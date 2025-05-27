<!-- CommunityPanel.vue -->
<template>
  <div v-if="!isLoggedIn" class="login-required-container">
    <div class="login-icon">
      <img src="@/assets/toLogin-icon.png" alt="toLogin Icon" class="toLogin-icon" />
    </div>
    <h2 class="login-title">로그인이 필요합니다</h2>
    <p class="login-message">프로필 정보를 확인하려면 로그인해주세요.</p>
    <button class="login-button" @click="goToLogin">로그인 하기</button>
  </div>
  <div class="container" v-else>
    <h3 class="section-title">나의 아파트 커뮤니티</h3>

    <div class="community-form">
      <!-- 내 아파트 표시 및 글쓰기 버튼 -->
      <div class="apartment-header">
        <h4 class="apartment-name">
          {{ myApartmentName || '아파트 정보를 불러오는 중...' }}
        </h4>

        <div class="loading-info" v-if="isLoadingApartments">
          <div class="loading-spinner"></div>
        </div>

        <button class="write-button" @click="openWriteForm" :disabled="!myApartmentName">
          <span class="button-icon">✏️</span>
          <span class="button-text">글쓰기</span>
        </button>
      </div>
    </div>

    <!-- 글쓰기 폼 (토글) -->
    <div class="write-form" v-if="showWriteForm && myApartmentName">
      <h4 class="form-title">새 글 작성</h4>
      <div class="form-group">
        <label for="post-title">제목</label>
        <input
          type="text"
          id="post-title"
          v-model="newPost.title"
          placeholder="제목을 입력하세요"
          class="form-input"
        />
      </div>
      <div class="form-group">
        <label for="post-content">내용</label>
        <textarea
          id="post-content"
          v-model="newPost.content"
          placeholder="내용을 입력하세요"
          class="form-textarea"
          rows="4"
        ></textarea>
      </div>
      <div class="form-actions">
        <button class="cancel-button" @click="cancelWrite">취소</button>
        <button
          class="submit-button"
          @click="submitPost"
          :disabled="!newPost.title || !newPost.content"
        >
          등록하기
        </button>
      </div>
    </div>

    <!-- 수정 폼 (토글) -->
    <div class="write-form" v-if="showEditForm && editingPost">
      <h4 class="form-title">글 수정</h4>
      <div class="form-group">
        <label for="edit-post-title">제목</label>
        <input
          type="text"
          id="edit-post-title"
          v-model="editingPost.title"
          placeholder="제목을 입력하세요"
          class="form-input"
        />
      </div>
      <div class="form-group">
        <label for="edit-post-content">내용</label>
        <textarea
          id="edit-post-content"
          v-model="editingPost.content"
          placeholder="내용을 입력하세요"
          class="form-textarea"
          rows="4"
        ></textarea>
      </div>
      <div class="form-actions">
        <button class="cancel-button" @click="cancelEdit">취소</button>
        <button
          class="submit-button"
          @click="updatePost"
          :disabled="!editingPost.title || !editingPost.content"
        >
          수정하기
        </button>
      </div>
    </div>

    <!-- 커뮤니티 글 목록 -->
    <div class="community-results" v-if="communityLoaded">
      <div class="results-header">
        <h4 class="results-title">{{ myApartmentName }} 커뮤니티 ({{ posts.length }}건)</h4>
        <div class="sort-options">
          <select v-model="sortOption">
            <option value="recent">최신순</option>
            <option value="likes">좋아요순</option>
          </select>
        </div>
      </div>

      <div class="loading-indicator" v-if="isLoadingPosts">
        <div class="spinner"></div>
        <p>커뮤니티 글을 불러오는 중...</p>
      </div>

      <div class="no-results" v-if="posts.length === 0 && !isLoadingPosts && communityLoaded">
        <p>등록된 글이 없습니다.</p>
        <p class="no-results-sub">첫 글을 작성해보세요!</p>
      </div>

      <div class="post-list" v-if="posts.length > 0">
        <div class="post-card" v-for="post in sortedPosts" :key="post.communityId">
          <div class="post-header">
            <div class="user-info">
              <div class="user-avatar">
                <img :src="post.member.image || defaultProfileImage" alt="프로필 이미지" />
              </div>
              <span class="user-name">{{ post.member.name }}</span>
            </div>
            <div class="post-date">{{ formatDate(post.postDate) }}</div>
          </div>

          <div class="post-content">
            <h3 class="post-title" @click="viewPostDetail(post)">{{ post.title }}</h3>
            <div class="post-text-container">
              <p class="post-text" :class="{ expanded: post.isExpanded }">
                {{ post.isExpanded ? post.content : truncateText(post.content) }}
              </p>
              <button
                v-if="needsTruncation(post.content)"
                class="expand-button"
                @click.stop="toggleExpand(post)"
              >
                {{ post.isExpanded ? '접기' : '더보기' }}
              </button>
            </div>
          </div>

          <div class="post-footer">
            <div class="post-actions">
              <button class="like-button" @click.stop="likePost(post)">
                <span class="action-icon"> {{ post.liked ? '❤️' : '🤍' }}</span>
                <span class="action-count">{{ post.like }}</span>
              </button>

              <!-- 내가 작성한 글인 경우에만 수정/삭제 버튼 표시 -->
              <div class="my-post-actions" v-if="post.mine">
                <button class="edit-button" @click.stop="openEditForm(post)">
                  <span class="action-icon">✏️</span>
                  <span class="action-text">수정</span>
                </button>
                <button class="delete-button" @click.stop="confirmDelete(post)">
                  <span class="action-icon">🗑️</span>
                  <span class="action-text">삭제</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import defaultProfileImage from '@/assets/default_profile_img.png'

// emit 정의
const emit = defineEmits(['view-post-detail', 'show-on-map'])

// 상태 관리
const myApartmentName = ref('')
const myApartmentId = ref(null)
const myApartmentLocation = ref(null)
const posts = ref([])
const isLoggedIn = ref(false)
const isLoadingApartments = ref(false)
const isLoadingPosts = ref(false)
const communityLoaded = ref(false)
const sortOption = ref('recent')
const showWriteForm = ref(false)
const showEditForm = ref(false)
const editingPost = ref(null)

const newPost = ref({
  title: '',
  content: '',
})

// 정렬된 게시글 목록 (computed)
const sortedPosts = computed(() => {
  if (sortOption.value === 'recent') {
    return [...posts.value].sort((a, b) => {
      const dateA = a?.updateDate ? new Date(a.updateDate) : new Date(0)
      const dateB = b?.updateDate ? new Date(b.updateDate) : new Date(0)

      return dateB - dateA
    })
  } else if (sortOption.value === 'likes') {
    return [...posts.value].sort((a, b) => b.like - a.like)
  }
  return posts.value
})

import { memberAPI } from '@/api/member'

// 아파트 가져오기 API 호출 함수
const fetchMyApartment = async () => {
  isLoadingApartments.value = true
  try {
    // /member/info API 호출하여 아파트 정보 가져오기
    const response = await memberAPI.getProfile()

    // apartment 이름 응답
    if (response && response.data) {
      myApartmentName.value = response.data.apartment.apartmentName
      myApartmentId.value = response.data.apartment.apartmentId // 실제 구현에서는 API 응답에서 ID 값도 받아와야 함

      // 아파트 정보를 가져온 후 해당 아파트의 게시글을 가져옴
      fetchPosts(myApartmentId.value)
    } else {
      myApartmentName.value = ''
      myApartmentId.value = null
      myApartmentLocation.value = null
    }
  } catch (error) {
    console.error('내 아파트 데이터를 불러오는 중 오류가 발생했습니다:', error)
    myApartmentName.value = ''
    myApartmentId.value = null
  } finally {
    isLoadingApartments.value = false
  }
}

import { communityAPI } from '@/api/community'

// 커뮤니티 글 목록 가져오기 API 호출 함수
const fetchPosts = async () => {
  communityLoaded.value = true
  isLoadingPosts.value = true

  try {
    const result = await communityAPI.getPosts()
    // 각 게시글에 isExpanded 속성 추가
    posts.value = result.data.map((post) => ({
      ...post,
      isExpanded: false,
    }))
  } catch (error) {
    console.error('커뮤니티 글을 불러오는 중 오류가 발생했습니다:', error)
    posts.value = []
  } finally {
    isLoadingPosts.value = false
  }
}

// 이벤트 핸들러
const openWriteForm = () => {
  showWriteForm.value = true
  showEditForm.value = false
  newPost.value = { title: '', content: '' }
}

const cancelWrite = () => {
  showWriteForm.value = false
}

// 수정 폼 열기
const openEditForm = (post) => {
  editingPost.value = { ...post }
  showEditForm.value = true
  showWriteForm.value = false
}

// 수정 취소
const cancelEdit = () => {
  showEditForm.value = false
  editingPost.value = null
}

// 삭제 확인
const confirmDelete = (post) => {
  if (confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
    deletePost(post)
  }
}

// 글 작성 API 호출
const submitPost = async () => {
  // 입력 검증
  if (!newPost.value.title || !newPost.value.content) {
    alert('제목, 내용을 모두 입력해주세요.')
    return
  }

  try {
    // API 요청 데이터 구성
    const postData = {
      title: newPost.value.title,
      content: newPost.value.content,
    }

    // API 호출
    const result = await communityAPI.writePost(postData)

    // 성공 시 처리
    if (result.status === 200) {
      // API 응답 데이터를 사용하여 게시글 목록에 추가
      const newPostObj = {
        ...result.data,
        isExpanded: false,
      }

      // 목록의 맨 앞에 새 게시글 추가
      posts.value.unshift(newPostObj)

      // 폼 초기화 및 닫기
      showWriteForm.value = false
      newPost.value = { title: '', content: '' }

      // 성공 알림
      alert('게시글이 성공적으로 등록되었습니다.')
    } else {
      // 서버에서 오류 응답이 왔을 경우
      throw new Error(result.message || '게시글 등록에 실패했습니다.')
    }
  } catch (error) {
    console.error('게시글 등록 중 오류가 발생했습니다:', error)
    alert(error.message || '게시글 등록에 실패했습니다. 다시 시도해주세요.')
  }
}

// 글 수정 API 호출
const updatePost = async () => {
  // 입력 검증
  if (!editingPost.value.title || !editingPost.value.content) {
    alert('제목, 내용을 모두 입력해주세요.')
    return
  }
  try {
    // API 요청 데이터 구성
    const result = await communityAPI.updatePost(
      editingPost.value.communityId, // communityId를 첫 번째 인자로 전달
      {
        // 제목과 내용만 객체로 전달
        title: editingPost.value.title,
        content: editingPost.value.content,
      },
    )

    // 성공 시 처리
    if (result.status === 200) {
      // 수정된 게시글 정보로 업데이트
      const updatedPost = result.data
      const postIndex = posts.value.findIndex(
        (p) => p.communityId === editingPost.value.communityId,
      )

      if (postIndex !== -1) {
        posts.value[postIndex] = {
          ...posts.value[postIndex],
          title: updatedPost.title,
          content: updatedPost.content,
          updateDate: updatedPost.updateDate,
        }
      }

      // 폼 초기화 및 닫기
      showEditForm.value = false
      editingPost.value = null

      // 성공 알림
      alert('게시글이 성공적으로 수정되었습니다.')
    } else {
      // 서버에서 오류 응답이 왔을 경우
      throw new Error(result.message || '게시글 수정에 실패했습니다.')
    }
  } catch (error) {
    console.error('게시글 수정 중 오류가 발생했습니다:', error)
    alert(error.message || '게시글 수정에 실패했습니다. 다시 시도해주세요.')
  }
}

// 글 삭제 API 호출
const deletePost = async (post) => {
  try {
    // API 호출
    const result = await communityAPI.deletePost(post.communityId)

    // 성공 시 처리
    if (result.status === 200) {
      // 삭제된 게시글을 목록에서 제거
      posts.value = posts.value.filter((p) => p.communityId !== post.communityId)

      // 성공 알림
      alert('게시글이 성공적으로 삭제되었습니다.')
    } else {
      // 서버에서 오류 응답이 왔을 경우
      throw new Error(result.message || '게시글 삭제에 실패했습니다.')
    }
  } catch (error) {
    console.error('게시글 삭제 중 오류가 발생했습니다:', error)
    alert(error.message || '게시글 삭제에 실패했습니다. 다시 시도해주세요.')
  }
}

// 좋아요 API 호출
const likePost = async (post) => {
  try {
    // 이미 좋아요를 눌렀으면 함수 종료
    if (post.liked) {
      return
    }

    // 실제 API 호출
    await communityAPI.likePost(post.communityId)

    // 좋아요 상태와 카운트 업데이트
    const postIndex = posts.value.findIndex((p) => p.communityId === post.communityId)
    if (postIndex !== -1) {
      posts.value[postIndex] = {
        ...posts.value[postIndex],
        like: posts.value[postIndex].like + 1,
        liked: true,
      }
    }
  } catch (error) {
    console.error('좋아요 처리 중 오류가 발생했습니다:', error)

    // 오류가 "이미 좋아요를 누른 게시글입니다"와 같은 경우 처리
    if (error.response && error.response.status === 400) {
      alert('이미 좋아요를 누른 게시글입니다.')

      // 백엔드와 상태 동기화 (이미 좋아요 상태로 설정)
      const postIndex = posts.value.findIndex((p) => p.communityId === post.communityId)
      if (postIndex !== -1) {
        posts.value[postIndex].liked = true
      }
    }
  }
}

import { useRouter } from 'vue-router'
const router = useRouter()
const goToLogin = () => router.push('/login')

const viewPostDetail = (post) => {
  emit('view-post-detail', post)
}

// 유틸리티 함수
const formatDate = (date) => {
  if (!date) return ''

  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

const truncateText = (text, maxLength = 100) => {
  if (!text) return ''
  if (text.length <= maxLength) return text

  return text.slice(0, maxLength) + '...'
}

const needsTruncation = (text, maxLength = 100) => {
  if (!text) return false
  return text.length > maxLength
}

const toggleExpand = (post) => {
  const postIndex = posts.value.findIndex((p) => p.communityId === post.communityId)
  if (postIndex !== -1) {
    posts.value[postIndex].isExpanded = !posts.value[postIndex].isExpanded
  }
}

const checkLoginStatus = () => {
  const token = localStorage.getItem('accessToken')
  isLoggedIn.value = !!token
  if (isLoggedIn.value) {
    // 로그인 상태일 때 아파트 정보 가져오기
    fetchMyApartment()
  } else {
    // 로그아웃 상태일 때 아파트 정보 초기화
    myApartmentName.value = ''
    myApartmentId.value = null
  }
}

// 클릭 외부 감지 (필요 없지만 혹시 남아있을 수 있는 드롭다운 관련 로직 지원)
const handleClickOutside = (event) => {
  // 드롭다운 관련 코드가 더 이상 필요하지 않지만, 다른 곳에서 참조될 수 있어 빈 함수로 유지
}

// 컴포넌트 마운트 시 초기 데이터 로드
onMounted(() => {
  checkLoginStatus()
  document.addEventListener('click', handleClickOutside)
})

// 컴포넌트 언마운트 시 이벤트 리스너 제거
const onUnmounted = () => {
  document.removeEventListener('click', handleClickOutside)
}
</script>

<style scoped>
.community-panel {
  padding: 0;
}

.container {
  width: 480px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #333;
}

.community-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
}

/* 로그인이 필요한 경우 스타일 */
.login-required-container {
  background-color: white;
  border-radius: 12px;
  width: 100%;
  max-width: 500px;
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  box-shadow: 0 4px 5px rgba(0, 0, 0, 0.08);
  animation: fadeIn 0.5s ease;
}

.login-icon {
  margin-bottom: 20px;
  color: #888;
}

.toLogin-icon {
  height: 200px;
  width: 200px;
  transition: transform 0.3s ease;
}

.login-icon:hover .toLogin-icon {
  transform: scale(1.05);
}

.login-title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
}

.login-message {
  font-size: 16px;
  color: #666;
  margin-bottom: 30px;
}

.login-button {
  padding: 14px 34px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(76, 175, 80, 0.3);
}

.login-button:hover {
  background-color: #388e3c;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.4);
}

.login-button:active {
  transform: translateY(0);
}

/* 아파트 헤더와 글쓰기 버튼을 한 줄에 배치 */
.apartment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.apartment-name {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.loading-info {
  display: inline-block;
  margin-left: 10px;
}

.loading-spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #4caf50;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

/* 글쓰기 버튼 스타일 변경 - 초록색으로 */
.write-button {
  padding: 8px 16px;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #4caf50; /* 초록색으로 변경 */
}

.write-button:hover {
  background-color: #388e3c; /* 더 짙은 초록색으로 변경 */
}

.write-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.button-icon {
  margin-right: 6px;
  font-size: 16px;
}

.button-text {
  font-size: 14px;
}

/* 글쓰기 폼 스타일 */
.write-form {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 20px;
  border: 1px solid #e0e0e0;
}

.form-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #333;
}

.form-group {
  margin-bottom: 16px;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.2s ease;
}

.form-input:focus,
.form-textarea:focus {
  border-color: #4caf50;
  outline: none;
  box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.1);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.cancel-button,
.submit-button {
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
}

.cancel-button {
  background-color: #f5f5f5;
  color: #555;
  border: 1px solid #ddd;
}

.cancel-button:hover {
  background-color: #e0e0e0;
}

.submit-button {
  background-color: #4caf50;
  color: white;
  border: none;
}

.submit-button:hover {
  background-color: #388e3c;
}

.submit-button:disabled {
  background-color: #a5d6a7;
  cursor: not-allowed;
}

/* 커뮤니티 결과 스타일 */
.community-results {
  margin-top: 20px;
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.results-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.sort-options select {
  padding: 6px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 13px;
  background-color: #fff;
  cursor: pointer;
}

.loading-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
}

.spinner {
  width: 30px;
  height: 30px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #4caf50;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.loading-indicator p {
  margin-top: 12px;
  color: #666;
  font-size: 14px;
}

.no-results {
  text-align: center;
  padding: 40px 0;
  color: #666;
  background-color: #f9f9f9;
  border-radius: 8px;
}

.no-results-sub {
  font-size: 14px;
  color: #888;
  margin-top: 8px;
}

.post-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.post-card {
  display: flex;
  flex-direction: column;
  border-radius: 5px;
  overflow: hidden;
  min-height: 200px; /* height을 min-height로 변경 */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.post-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background-color: #f9f9f9;
  border-bottom: 1px solid #eee;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  overflow: hidden;
  background-color: #e0e0e0;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-name {
  font-size: 14px;
  font-weight: 500;
  color: #444;
}

.post-date {
  font-size: 12px;
  color: #777;
}

.post-content {
  padding: 16px;
  flex-grow: 1;
  cursor: pointer;
}

.post-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #333;
}

.post-text {
  font-size: 14px;
  color: #555;
  line-height: 1.5;
  white-space: pre-wrap; /* 줄바꿈 유지 */
  word-wrap: break-word; /* 긴 단어 줄바꿈 */
  margin: 0;
  transition: max-height 0.3s ease;
}

.post-text.expanded {
  /* 확장된 상태에서는 제한 없음 */
}

.post-text-container {
  position: relative;
}

.expand-button {
  background: none;
  border: none;
  color: #4caf50;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  padding: 4px 0;
  margin-top: 8px;
  transition: color 0.2s ease;
}

.expand-button:hover {
  color: #388e3c;
  text-decoration: underline;
}

.post-footer {
  padding: 12px 16px;
  border-top: 1px solid #eee;
}

.post-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.like-button.liked {
  color: #ff3366;
}

.like-button.liked .action-icon {
  color: #ff3366;
}

.like-button,
.comment-button,
.edit-button,
.delete-button {
  display: flex;
  align-items: center;
  gap: 4px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px 8px;
  color: #555;
  font-size: 13px;
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

.like-button:hover,
.comment-button:hover,
.edit-button:hover,
.delete-button:hover {
  background-color: #f5f5f5;
}

/* 내 글일 때 표시되는 수정/삭제 버튼 스타일 */
.my-post-actions {
  display: flex;
  gap: 4px;
}

.edit-button {
  color: #2196f3;
}

.edit-button:hover {
  background-color: rgba(33, 150, 243, 0.1);
}

.delete-button {
  color: #f44336;
}

.delete-button:hover {
  background-color: rgba(244, 67, 54, 0.1);
}

.action-icon {
  font-size: 16px;
}

.action-count {
  font-weight: 500;
}

.action-text {
  font-size: 12px;
  font-weight: 500;
}

/* 모바일 반응형 스타일 */
@media (max-width: 480px) {
  .apartment-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .write-button {
    align-self: flex-end;
  }

  .post-actions {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .my-post-actions {
    margin-top: 4px;
  }
}
</style>
