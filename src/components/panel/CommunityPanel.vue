<!-- CommunityPanel.vue -->
<template>
  <div class="community-panel">
    <h3 class="section-title">아파트 커뮤니티</h3>

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
        <div
          class="post-card"
          v-for="post in sortedPosts"
          :key="post.communityId"
          @click="viewPostDetail(post)"
        >
          <div class="post-header">
            <div class="user-info">
              <div class="user-avatar">
                <img
                  :src="post.member.image || '@/assets/default-avatar.png'"
                  alt="프로필 이미지"
                />
              </div>
              <span class="user-name">{{ post.member.name }}</span>
            </div>
            <div class="post-date">{{ formatDate(post.postDate) }}</div>
          </div>

          <div class="post-content">
            <h3 class="post-title">{{ post.title }}</h3>
            <p class="post-text">{{ truncateText(post.content) }}</p>
          </div>

          <div class="post-footer">
            <div class="post-actions">
              <button class="like-button" @click.stop="likePost(post)">
                <span class="action-icon"> {{ post.liked ? '❤️' : '🤍' }}</span>
                <span class="action-count">{{ post.like }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
// 실제 구현 시 API 임포트 추가
// import { communityAPI } from '@/api/community'

// emit 정의
const emit = defineEmits(['view-post-detail', 'show-on-map'])

// 상태 관리
const myApartmentName = ref('')
const myApartmentId = ref(null)
const myApartmentLocation = ref(null)
const posts = ref([])

const isLoadingApartments = ref(false)
const isLoadingPosts = ref(false)
const communityLoaded = ref(false)
const sortOption = ref('recent')
const showWriteForm = ref(false)

const newPost = ref({
  title: '',
  content: '',
})

// 정렬된 게시글 목록 (computed)
const sortedPosts = computed(() => {
  if (sortOption.value === 'recent') {
    return [...posts.value].sort((a, b) => {
      const dateA = a?.postDate ? new Date(a.postDate) : new Date(0)
      const dateB = b?.postDate ? new Date(b.postDate) : new Date(0)

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
    posts.value = result.data
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
  newPost.value = { title: '', content: '' }
}

const cancelWrite = () => {
  showWriteForm.value = false
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
      const newPostObj = result.data

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
        posts.value[postIndex].isLiked = true
      }
    }
  }
}

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

// 클릭 외부 감지 (필요 없지만 혹시 남아있을 수 있는 드롭다운 관련 로직 지원)
const handleClickOutside = (event) => {
  // 드롭다운 관련 코드가 더 이상 필요하지 않지만, 다른 곳에서 참조될 수 있어 빈 함수로 유지
}

// 컴포넌트 마운트 시 초기 데이터 로드
onMounted(() => {
  fetchMyApartment()
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
  height: 200px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
  cursor: pointer;
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
}

.post-footer {
  padding: 12px 16px;
  border-top: 1px solid #eee;
}

.post-actions {
  display: flex;
  justify-content: space-between;
}

.like-button.liked {
  color: #ff3366;
}

.like-button.liked .action-icon {
  color: #ff3366;
}

.like-button,
.comment-button {
  display: flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px 10px;
  color: #555;
  font-size: 14px;
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

.like-button:hover,
.comment-button:hover {
  background-color: #f5f5f5;
}

.action-icon {
  font-size: 16px;
}

.action-count {
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
}
</style>
