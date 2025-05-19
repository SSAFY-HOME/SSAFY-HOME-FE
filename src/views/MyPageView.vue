<template>
  <AppHeader />
  <div class="myPage">
    <!-- 로그인되지 않은 경우 -->
    <div v-if="!isLoggedIn" class="login-required-container">
      <div class="login-icon">
        <img src="@/assets/toLogin-icon.png" alt="toLogin Icon" class="toLogin-icon" />
      </div>
      <h2 class="login-title">로그인이 필요합니다</h2>
      <p class="login-message">프로필 정보를 확인하려면 로그인해주세요.</p>
      <button class="login-button" @click="goToLogin">로그인 하기</button>
    </div>

    <!-- 로그인된 경우 -->
    <div v-else class="profile-container">
      <div class="profile-header">
        <div class="profile-cover-image"></div>
        <div class="profile-avatar-container">
          <div class="profile-image-container" @click="openImageModal">
            <img
              :src="profileImage || '/api/placeholder/150/150'"
              alt="프로필 이미지"
              class="profile-image"
            />
            <div class="profile-image-overlay">
              <button class="image-edit-button">
                <i class="fas fa-camera"></i>
              </button>
            </div>
          </div>
          <h2 class="profile-name">{{ user.name }}</h2>
          <p class="profile-email">{{ user.email }}</p>
        </div>
      </div>

      <!-- 탭 메뉴 -->
      <div class="profile-tabs">
        <button
          class="tab-button"
          :class="{ active: activeTab === 'info' }"
          @click="activeTab = 'info'"
        >
          <i class="fas fa-user"></i> 기본 정보
        </button>

        <button
          class="tab-button"
          :class="{ active: activeTab === 'security' }"
          @click="activeTab = 'security'"
          v-if="!isKakaoUser"
        >
          <i class="fas fa-lock"></i> 비밀번호 변경 및 탈퇴
        </button>
        <button
          class="tab-button"
          :class="{ active: activeTab === 'security' }"
          @click="activeTab = 'security'"
          v-if="isKakaoUser"
        >
          <i class="fas fa-lock"></i> 탈퇴
        </button>
        <button
          class="tab-button"
          :class="{ active: activeTab === 'activity' }"
          @click="activeTab = 'activity'"
        >
          <i class="fas fa-chart-line"></i> 활동 내역
        </button>
      </div>

      <!-- 기본 정보 탭 -->
      <div v-if="activeTab === 'info'" class="tab-content">
        <!-- 프로필 정보 -->
        <div class="info-card">
          <div class="card-header">
            <h3 class="section-title"><i class="fas fa-id-card"></i> 프로필 정보</h3>
          </div>
          <div class="card-content">
            <div class="form-group">
              <label for="name">이름</label>
              <input type="text" id="name" v-model="user.name" />
              <label for="nickname">이메일</label>
              <input type="text" id="nickname" v-model="user.email" />
            </div>
          </div>
        </div>
        <!-- 아파트 정보 -->
        <div class="info-card apartment-info">
          <div class="card-header">
            <h3 class="section-title"><i class="fas fa-home"></i> 나의 아파트 정보</h3>
            <button class="edit-button small" @click="modifyApartment">
              <i class="fas fa-edit"></i> 수정
            </button>
          </div>
          <div class="card-content">
            <div v-if="user.apartment" class="apartment-details">
              <div class="apartment-text">
                <p class="apartment-name">{{ user.apartment.apartmentName }}</p>
                <p class="apartment-address">
                  <i class="fas fa-map-marker-alt"></i> {{ user.apartment.address }}
                </p>
                <p class="apartment-year">
                  <i class="fas fa-calendar-alt"></i> {{ user.apartment.buildYear }}년 준공
                </p>
              </div>
            </div>
            <p v-else class="no-apartment">
              <i class="fas fa-exclamation-circle"></i> 등록된 아파트 정보가 없습니다.
              <button class="add-button" @click="modifyApartment">아파트 등록하기</button>
            </p>
          </div>
        </div>

        <!-- 관심 아파트 -->
        <div class="info-card favorites">
          <div class="card-header">
            <h3 class="section-title"><i class="fas fa-heart"></i> 관심 아파트</h3>
            <button class="view-all-button small"><i class="fas fa-list"></i> 전체보기</button>
          </div>
          <div class="card-content">
            <div v-if="favoriteApartments.length > 0" class="favorites-list">
              <div v-for="apt in favoriteApartments" :key="apt.id" class="favorite-item">
                <div class="favorite-info">
                  <p class="favorite-name">{{ apt.name }}</p>
                  <p class="favorite-address">{{ apt.address }}</p>
                </div>
                <button class="remove-favorite">
                  <i class="fas fa-times"></i>
                </button>
              </div>
            </div>
            <p v-else class="no-favorites">
              <i class="fas fa-heart-broken"></i> 등록된 관심 아파트가 없습니다.
              <button class="add-button" @click="goToSearch">아파트 찾아보기</button>
            </p>
          </div>
        </div>
      </div>

      <!-- 비밀번호 수정& 탈퇴 탭 -->
      <div v-if="activeTab === 'security'" class="tab-content">
        <!-- 일반 사용자: 비밀번호 변경 폼 -->
        <div class="info-card" v-if="!isKakaoUser">
          <div class="card-header">
            <h3 class="section-title"><i class="fas fa-key"></i> 비밀번호 변경</h3>
          </div>
          <div class="card-content">
            <form @submit.prevent="updatePassword" class="password-form">
              <div class="form-group">
                <label for="current-password">현재 비밀번호</label>
                <input
                  type="password"
                  id="current-password"
                  v-model="user.currentPassword"
                  placeholder="현재 비밀번호를 입력해주세요"
                />
              </div>
              <div class="form-group">
                <label for="password">새 비밀번호</label>
                <input
                  type="password"
                  id="password"
                  v-model="user.password"
                  placeholder="8자 이상 입력해주세요"
                  @blur="validatePassword"
                  :class="{
                    'input-error': errors.password,
                    'input-success': user.password && !errors.password,
                  }"
                />
                <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
                <div v-if="user.password" class="password-strength">
                  <div class="strength-bar" :class="passwordStrengthClass"></div>
                  <span class="strength-text">{{ passwordStrengthText }}</span>
                </div>
              </div>

              <div class="form-group">
                <label for="password-confirm">비밀번호 확인</label>
                <input
                  type="password"
                  id="password-confirm"
                  v-model="user.passwordConfirm"
                  placeholder="비밀번호를 다시 입력해주세요"
                  @blur="validatePasswordConfirm"
                  :class="{
                    'input-error': errors.passwordConfirm,
                    'input-success': user.passwordConfirm && !errors.passwordConfirm,
                  }"
                />
                <span v-if="errors.passwordConfirm" class="error-message">{{
                  errors.passwordConfirm
                }}</span>
              </div>
              <button class="save-button" type="submit">
                <i class="fas fa-key"></i> 비밀번호 변경하기
              </button>
            </form>
          </div>
        </div>

        <!-- 회원 탈퇴 섹션 - 일반 사용자 -->
        <div class="info-card danger-zone" v-if="!isKakaoUser">
          <div class="card-header danger">
            <h3 class="section-title"><i class="fas fa-exclamation-triangle"></i> 계정 관리</h3>
          </div>
          <div class="card-content">
            <p class="warning-text">
              계정을 삭제하면 모든 데이터가 영구적으로 삭제됩니다. 이 작업은 되돌릴 수 없습니다.
            </p>
            <div class="form-group">
              <label for="confirm-password">비밀번호 확인</label>
              <input
                type="password"
                id="confirm-password"
                v-model="confirmPassword"
                placeholder="비밀번호를 입력해주세요"
              />
            </div>
            <button class="delete-account-button" @click="deleteUser">
              <i class="fas fa-user-slash"></i> 회원 탈퇴
            </button>
          </div>
        </div>

        <!-- 회원 탈퇴 섹션 - 카카오 사용자 -->
        <div class="info-card danger-zone" v-if="isKakaoUser">
          <div class="card-header danger">
            <h3 class="section-title"><i class="fas fa-exclamation-triangle"></i> 계정 관리</h3>
          </div>
          <div class="card-content">
            <p class="warning-text">
              계정을 삭제하면 모든 데이터가 영구적으로 삭제됩니다. 이 작업은 되돌릴 수 없습니다.
            </p>
            <p class="kakao-notice">
              <i class="fas fa-info-circle"></i> 카카오톡 계정으로 연결된 회원은 카카오 로그인 인증
              후 탈퇴가 가능합니다.
            </p>
            <button class="kakao-login-button" @click="requestKakaoReLogin">
              <i class="fas fa-comment"></i> 카카오톡으로 인증하기
            </button>
          </div>
        </div>
      </div>

      <!-- 활동 내역 탭 -->
      <div v-if="activeTab === 'activity'" class="tab-content">
        <div class="info-card">
          <div class="card-header">
            <h3 class="section-title"><i class="fas fa-clipboard-list"></i> 내가 쓴 게시글</h3>
            <button class="view-all-button small"><i class="fas fa-list"></i> 전체보기</button>
          </div>
          <div class="card-content">
            <div v-if="userPosts.length > 0" class="activity-list">
              <div v-for="post in userPosts" :key="post.id" class="activity-item">
                <div class="activity-content">
                  <h4 class="activity-title">{{ post.title }}</h4>
                  <p class="activity-excerpt">{{ post.excerpt }}</p>
                </div>
                <div class="activity-meta">
                  <span class="activity-date">{{ formatDate(post.createdAt) }}</span>
                  <span class="activity-stats">
                    <i class="fas fa-heart"></i> {{ post.likes }}
                    <i class="fas fa-comment ml-2"></i> {{ post.comments }}
                  </span>
                </div>
              </div>
            </div>
            <p v-else class="no-activity">
              <i class="fas fa-clipboard"></i> 작성한 게시글이 없습니다.
              <button class="add-button" @click="goToCommunity">게시글 작성하기</button>
            </p>
          </div>
        </div>

        <div class="info-card">
          <div class="card-header">
            <h3 class="section-title"><i class="fas fa-comment-dots"></i> 내가 쓴 댓글</h3>
            <button class="view-all-button small"><i class="fas fa-list"></i> 전체보기</button>
          </div>
          <div class="card-content">
            <div v-if="userComments.length > 0" class="activity-list">
              <div v-for="comment in userComments" :key="comment.id" class="activity-item">
                <div class="activity-content">
                  <p class="activity-comment">{{ comment.content }}</p>
                  <p class="activity-parent">
                    <i class="fas fa-reply fa-flip-horizontal"></i>
                    {{ comment.postTitle }}
                  </p>
                </div>
                <div class="activity-meta">
                  <span class="activity-date">{{ formatDate(comment.createdAt) }}</span>
                </div>
              </div>
            </div>
            <p v-else class="no-activity">
              <i class="fas fa-comment-slash"></i> 작성한 댓글이 없습니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 프로필 이미지 업로드 모달 -->
  <div v-if="showImageModal" class="modal">
    <div class="modal-content">
      <div class="modal-header">
        <h3>프로필 이미지 변경</h3>
        <button class="close-button" @click="closeImageModal">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="modal-body">
        <div class="image-preview">
          <img
            :src="previewImage || profileImage || '/api/placeholder/150/150'"
            alt="프로필 이미지 미리보기"
          />
        </div>
        <div class="upload-controls">
          <input
            type="file"
            id="profile-image-upload"
            @change="previewProfileImage"
            accept="image/*"
            class="file-input"
          />
          <label for="profile-image-upload" class="file-input-label">
            <i class="fas fa-upload"></i> 이미지 선택
          </label>
          <button class="remove-image-button" @click="removeProfileImage">
            <i class="fas fa-trash-alt"></i> 이미지 삭제
          </button>
        </div>
      </div>
      <div class="modal-footer">
        <button class="cancel-button" @click="closeImageModal">취소</button>
        <button class="save-button" @click="saveProfileImage">저장</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { memberAPI } from '@/api/member'
import AppHeader from '@/components/common/Header.vue'

const router = useRouter()
const isLoggedIn = ref(false)
const profileImage = ref(null)
const confirmPassword = ref('')
const errors = ref({})
const user = ref({
  name: '',
  currentPassword: '',
  password: '',
  passwordConfirm: '',
  apartment: null,
  social: '',
})

const activeTab = ref('info')
const showImageModal = ref(false)
const previewImage = ref(null)
const favoriteApartments = ref([])
const userPosts = ref([])
const userComments = ref([])

// 카카오 로그인 사용자 체크 (social 필드가 'true' 문자열인 경우)
const isKakaoUser = computed(() => user.value.social === true || user.value.social === 'true')

// 패스워드 강도 계산
const passwordStrengthClass = computed(() => {
  if (!user.value.password) return ''

  const strength = calculatePasswordStrength(user.value.password)
  if (strength < 30) return 'strength-weak'
  if (strength < 60) return 'strength-medium'
  return 'strength-strong'
})

const passwordStrengthText = computed(() => {
  if (!user.value.password) return ''

  const strength = calculatePasswordStrength(user.value.password)
  if (strength < 30) return '약함'
  if (strength < 60) return '보통'
  return '강함'
})

const calculatePasswordStrength = (password) => {
  if (!password) return 0

  let strength = 0

  // 길이 점수
  strength += Math.min(password.length * 4, 25)

  // 대문자, 소문자, 숫자, 특수문자 점수
  if (/[A-Z]/.test(password)) strength += 15
  if (/[a-z]/.test(password)) strength += 10
  if (/[0-9]/.test(password)) strength += 15
  if (/[^A-Za-z0-9]/.test(password)) strength += 25

  // 복합성 점수
  const variety =
    (/[A-Z]/.test(password) ? 1 : 0) +
    (/[a-z]/.test(password) ? 1 : 0) +
    (/[0-9]/.test(password) ? 1 : 0) +
    (/[^A-Za-z0-9]/.test(password) ? 1 : 0)

  strength += variety * 10

  return Math.min(strength, 100)
}

const checkLoginStatus = () => {
  const token = localStorage.getItem('accessToken')
  isLoggedIn.value = !!token
  if (isLoggedIn.value) {
    fetchUserProfile()
    fetchFavoriteApartments()
    fetchUserPosts()
    fetchUserComments()
  }
}

const fetchUserProfile = async () => {
  try {
    const response = await memberAPI.getProfile()
    if (response && response.data) {
      user.value = {
        ...response.data,
        currentPassword: '',
        password: '',
        passwordConfirm: '',
        social: response.data.social,
      }
      if (response.data.image) {
        profileImage.value = response.data.image
      }
    }
  } catch (error) {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('accessToken')
      router.push('/login')
    }
  }
}

const fetchFavoriteApartments = async () => {
  // API 연동 시 실제 함수로 대체
  favoriteApartments.value = [
    { id: 1, name: '래미안 아파트', address: '서울시 강남구 테헤란로 123' },
    { id: 2, name: '자이 아파트', address: '서울시 서초구 서초대로 456' },
    { id: 3, name: '푸르지오 아파트', address: '서울시 송파구 올림픽로 789' },
  ]
}

const fetchUserPosts = async () => {
  // API 연동 시 실제 함수로 대체
  userPosts.value = [
    {
      id: 1,
      title: '아파트 가격 전망이 어떻게 될까요?',
      excerpt: '요즘 시장 상황이 불안정한데 전문가들의 의견이 궁금합니다.',
      createdAt: new Date(2025, 4, 10),
      likes: 24,
      comments: 13,
    },
    {
      id: 2,
      title: '우리 아파트 분리수거 문제',
      excerpt: '분리수거 관련해서 주민 여러분의 의견이 필요합니다.',
      createdAt: new Date(2025, 4, 5),
      likes: 31,
      comments: 27,
    },
    {
      id: 3,
      title: '새로 개발된 단지 정보 공유',
      excerpt: '새로 분양하는 아파트 정보를 공유합니다.',
      createdAt: new Date(2025, 3, 28),
      likes: 19,
      comments: 8,
    },
  ]
}

const fetchUserComments = async () => {
  // API 연동 시 실제 함수로 대체
  userComments.value = [
    {
      id: 1,
      content: '정말 좋은 정보 감사합니다. 저도 검토 중이었는데 도움이 많이 되었어요.',
      postTitle: '새로 개발된 단지 정보 공유',
      createdAt: new Date(2025, 4, 12),
    },
    {
      id: 2,
      content: '자세한 설명 감사합니다. 추가 질문이 있는데 연락 가능할까요?',
      postTitle: '아파트 가격 전망이 어떻게 될까요?',
      createdAt: new Date(2025, 4, 8),
    },
    {
      id: 3,
      content: '저도 동일한 경험이 있어요. 관리사무소에 문의해보시는게 좋을 것 같습니다.',
      postTitle: '우리 아파트 분리수거 문제',
      createdAt: new Date(2025, 4, 5),
    },
  ]
}

const formatDate = (date) => {
  if (!date) return ''

  const now = new Date()
  const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return '오늘'
  if (diffDays === 1) return '어제'
  if (diffDays < 7) return `${diffDays}일 전`

  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`
}

const goToLogin = () => router.push('/login')
const modifyApartment = () => router.push('/regist/home')
const goToSearch = () => router.push('/search')
const goToCommunity = () => router.push('/community')

const validatePassword = () => {
  if (!user.value.password) {
    errors.value.password = '비밀번호를 입력해주세요.'
  } else if (user.value.password.length < 8) {
    errors.value.password = '비밀번호는 8자 이상이어야 합니다.'
  } else {
    errors.value.password = ''
  }
}

const validatePasswordConfirm = () => {
  if (!user.value.passwordConfirm) {
    errors.value.passwordConfirm = '비밀번호 확인을 입력해주세요.'
  } else if (user.value.password !== user.value.passwordConfirm) {
    errors.value.passwordConfirm = '비밀번호가 일치하지 않습니다.'
  } else {
    errors.value.passwordConfirm = ''
  }
}

const updatePassword = async () => {
  validatePassword()
  validatePasswordConfirm()
  if (!errors.value.password && !errors.value.passwordConfirm) {
    try {
      // 현재 비밀번호 검증 추가
      if (!user.value.currentPassword) {
        alert('현재 비밀번호를 입력해주세요.')
        return
      }

      await memberAPI.updatePassword(user.value.currentPassword, user.value.password)

      alert('비밀번호가 성공적으로 변경되었습니다.')
      user.value.currentPassword = ''
      user.value.password = ''
      user.value.passwordConfirm = ''
    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert('현재 비밀번호가 일치하지 않습니다.')
      } else {
        alert('비밀번호 변경 중 오류가 발생했습니다.')
        console.error('비밀번호 변경 오류:', error)
      }
    }
  }
}

// 카카오 재인증 요청
const requestKakaoReLogin = () => {
  const REST_API_KEY = import.meta.env.VITE_KAKAO_LOGIN_REST_API_KEY
  const REDIRECT_URI = import.meta.env.VITE_KAKAO_WITHDRAWAL_REDIRECT_URI

  const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`
  window.location.href = kakaoAuthUrl
}

// 일반 사용자 탈퇴
const deleteUser = async () => {
  if (!confirm('정말 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) return

  if (!confirmPassword.value) {
    alert('비밀번호를 입력해주세요.')
    return
  }

  try {
    await memberAPI.deleteMember(confirmPassword.value)
    localStorage.removeItem('accessToken')
    alert('회원 탈퇴가 완료되었습니다. 그동안 이용해주셔서 감사합니다.')
    router.push('/notice')
  } catch (error) {
    if (error.response && error.response.status === 401) {
      alert('비밀번호가 일치하지 않습니다.')
    } else {
      alert('회원 탈퇴 중 오류가 발생했습니다.')
      console.error('회원 탈퇴 오류:', error)
    }
  }
}

// 이미지 관련 함수들
const openImageModal = () => {
  console.log('모달 열기 호출됨')
  showImageModal.value = true
}

const closeImageModal = () => {
  showImageModal.value = false
  previewImage.value = null
}

const previewProfileImage = (event) => {
  const file = event.target.files[0]
  if (!file) return

  if (!file.type.match('image.*')) {
    alert('이미지 파일만 업로드 가능합니다.')
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    previewImage.value = e.target.result
  }
  reader.readAsDataURL(file)
}

const removeProfileImage = async () => {
  try {
    await memberAPI.removeProfileImage()
    profileImage.value = null
    previewImage.value = null

    const fileInput = document.getElementById('profile-image-upload')
    if (fileInput) fileInput.value = ''

    alert('프로필 이미지가 삭제되었습니다.')
  } catch (error) {
    alert('이미지 삭제 중 오류가 발생했습니다.')
    console.error('이미지 삭제 오류:', error)
  }
}

onMounted(() => {
  checkLoginStatus()
})
</script>

<style scoped>
/* 전체 페이지 스타일 */
.myPage {
  display: flex;
  justify-content: center;
  padding: 20px;
  width: 100%;
  background-color: #f8f9fa;
  min-height: calc(100vh - 60px);
}

/* 로그인이 필요한 경우 스타일 */
.login-required-container {
  background-color: white;
  border-radius: 12px;
  width: 100%;
  max-width: 400px;
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  box-shadow: 0 4px 5px rgba(0, 0, 0, 0.08);
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
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

/* 프로필 컨테이너 스타일 */
.profile-container {
  background-color: white;
  border-radius: 12px;
  width: 100%;
  max-width: 800px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  animation: fadeIn 0.5s ease;
}

/* 프로필 헤더 */
.profile-header {
  position: relative;
  width: 100%;
  height: 250px;
  overflow: hidden;
}

.profile-cover-image {
  width: 100%;
  height: 150px;
  background: linear-gradient(135deg, #43a047 0%, #2e7d32 100%);
  position: relative;
}

.profile-avatar-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: -50px;
  padding: 0 20px;
}

.profile-image-container {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: 15px;
  background-color: #f0f0f0;
  border: 4px solid white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  position: relative;
}

.profile-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0);
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: all 0.3s ease;
}

.profile-image-container:hover .profile-image-overlay {
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 1;
}

.image-edit-button {
  background-color: transparent;
  color: white;
  border: none;
  font-size: 20px;
  cursor: pointer;
}

.profile-name {
  font-size: 22px;
  font-weight: 600;
  color: #333;
  margin: 0 0 5px 0;
}

.profile-email {
  font-size: 14px;
  color: #666;
  margin: 0 0 15px 0;
}

.profile-stats {
  display: flex;
  justify-content: center;
  gap: 30px;
  margin: 10px 0 15px 0;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #444;
}

.stat-number {
  font-size: 20px;
  font-weight: 600;
  color: #333;
}

.stat-label {
  font-size: 13px;
  color: #777;
}

/* 탭 메뉴 */
.profile-tabs {
  display: flex;
  border-bottom: 1px solid #eee;
  margin-bottom: 20px;
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 10;
}

.tab-button {
  flex: 1;
  padding: 15px 0;
  border: none;
  background-color: transparent;
  font-size: 15px;
  font-weight: 500;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
  border-bottom: 2px solid transparent;
}

.tab-button:hover {
  color: #4caf50;
}

.tab-button.active {
  color: #4caf50;
  border-bottom: 2px solid #4caf50;
}

.tab-button i {
  margin-right: 6px;
}

/* 탭 컨텐츠 */
.tab-content {
  padding: 0 20px 20px;
}

/* 카드 스타일 */
.info-card {
  background-color: white;
  border-radius: 8px;
  margin-bottom: 20px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border: 1px solid #eee;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #eee;
  background-color: #f9f9f9;
}

.card-header.danger {
  background-color: #fff8f8;
  border-bottom: 1px solid #ffebee;
}

.danger-zone .section-title {
  color: #d32f2f;
}

.card-content {
  padding: 15px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #444;
  margin: 0;
}

.section-title i {
  margin-right: 8px;
  color: #4caf50;
}

.danger-zone .section-title i {
  color: #d32f2f;
}

/* 아파트 정보 */
.apartment-details {
  display: flex;
  gap: 15px;
  align-items: center;
}

.apartment-image {
  width: 100px;
  height: 75px;
  border-radius: 6px;
  overflow: hidden;
  flex-shrink: 0;
}

.apartment-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.apartment-text {
  flex: 1;
}

.apartment-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
}

.apartment-address {
  font-size: 14px;
  color: #555;
  margin: 0 0 5px 0;
}

.apartment-year {
  font-size: 13px;
  color: #777;
  margin: 0;
}

.apartment-address i,
.apartment-year i {
  margin-right: 5px;
  color: #6c757d;
}

.no-apartment {
  color: #888;
  font-size: 14px;
  text-align: center;
  margin: 20px 0;
}

.no-apartment i {
  margin-right: 8px;
  color: #999;
}

/* 관심 아파트 목록 */
.favorites-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.favorite-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #eee;
  transition: background-color 0.3s ease;
}

.favorite-item:hover {
  background-color: #f9f9f9;
}

.favorite-image {
  width: 60px;
  height: 60px;
  border-radius: 4px;
  object-fit: cover;
}

.favorite-info {
  flex: 1;
}

.favorite-name {
  font-size: 15px;
  font-weight: 500;
  color: #333;
  margin: 0 0 5px 0;
}

.favorite-address {
  font-size: 13px;
  color: #666;
  margin: 0;
}

.remove-favorite {
  background-color: transparent;
  border: none;
  color: #999;
  padding: 5px;
  cursor: pointer;
  transition: color 0.3s ease;
}

.remove-favorite:hover {
  color: #d32f2f;
}

.no-favorites {
  color: #888;
  font-size: 14px;
  text-align: center;
  margin: 20px 0;
}

.no-favorites i {
  margin-right: 8px;
  color: #999;
}

/* 활동 내역 */
.activity-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.activity-item {
  padding: 12px;
  border-radius: 6px;
  border: 1px solid #eee;
  transition: border-color 0.3s ease;
}

.activity-item:hover {
  border-color: #d2e3fc;
  background-color: #f8faff;
}

.activity-title {
  font-size: 15px;
  font-weight: 600;
  color: #333;
  margin: 0 0 5px 0;
}

.activity-excerpt {
  font-size: 14px;
  color: #666;
  margin: 0 0 10px 0;
  line-height: 1.4;
}

.activity-comment {
  font-size: 14px;
  color: #333;
  margin: 0 0 5px 0;
  line-height: 1.4;
}

.activity-parent {
  font-size: 13px;
  color: #666;
  margin: 0 0 5px 0;
}

.activity-parent i {
  margin-right: 5px;
  color: #777;
}

.activity-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
  font-size: 13px;
  color: #888;
}

.activity-date {
  color: #999;
}

.activity-stats {
  display: flex;
  align-items: center;
  gap: 10px;
}

.activity-stats i {
  margin-right: 3px;
}

.ml-2 {
  margin-left: 8px;
}

.no-activity {
  color: #888;
  font-size: 14px;
  text-align: center;
  margin: 20px 0;
}

.no-activity i {
  margin-right: 8px;
  color: #999;
}

/* 폼 스타일 */
.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #555;
  margin-bottom: 6px;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  transition: all 0.3s ease;
}

.form-group input:focus,
.form-group textarea:focus {
  border-color: #4caf50;
  outline: none;
  box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
}

.input-error {
  border-color: #f44336 !important;
}

.input-success {
  border-color: #4caf50 !important;
}

.error-message {
  color: #f44336;
  font-size: 12px;
  margin-top: 5px;
  display: block;
}

/* 비밀번호 강도 표시 */
.password-strength {
  margin-top: 8px;
}

.strength-bar {
  height: 5px;
  background-color: #eee;
  border-radius: 3px;
  margin-bottom: 5px;
  position: relative;
}

.strength-bar::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  border-radius: 3px;
  transition:
    width 0.3s ease,
    background-color 0.3s ease;
}

.strength-weak::before {
  width: 30%;
  background-color: #f44336;
}

.strength-medium::before {
  width: 60%;
  background-color: #ff9800;
}

.strength-strong::before {
  width: 100%;
  background-color: #4caf50;
}

.strength-text {
  font-size: 12px;
  color: #777;
}

/* 버튼 스타일 */
.edit-button,
.add-apartment-button,
.delete-account-button,
.save-button,
.view-all-button,
.add-button {
  padding: 10px 16px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.edit-button i,
.add-apartment-button i,
.delete-account-button i,
.save-button i,
.view-all-button i,
.add-button i {
  margin-right: 6px;
}

.edit-button,
.save-button {
  background-color: #4caf50;
  color: white;
  border: none;
}

.edit-button:hover,
.save-button:hover {
  background-color: #388e3c;
}

.add-apartment-button {
  background-color: #2196f3;
  color: white;
  border: none;
}

.add-apartment-button:hover {
  background-color: #1976d2;
}

.delete-account-button {
  background-color: #f5f5f5;
  color: #d32f2f;
  border: 1px solid #e0e0e0;
  margin-top: 10px;
}

.delete-account-button:hover {
  background-color: #f44336;
  color: white;
  border-color: #f44336;
}

.view-all-button {
  background-color: transparent;
  color: #666;
  border: 1px solid #ddd;
  font-size: 13px;
}

.view-all-button:hover {
  background-color: #f5f5f5;
  color: #333;
}

.add-button {
  background-color: transparent;
  color: #4caf50;
  border: 1px solid #4caf50;
  font-size: 13px;
  margin-top: 10px;
}
.kakao-login-button {
  background-color: transparent;
  color: #4caf50;
  border: 1px solid #4caf50;
  font-size: 13px;
  margin-top: 10px;
}

.add-button:hover {
  background-color: #4caf50;
  color: white;
}

button.small {
  padding: 6px 12px;
  font-size: 13px;
}

.edit-profileImage-regist,
.edit-profileImage-remove {
  padding: 8px 15px;
  font-size: 14px;
  border-radius: 4px;
  margin: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.edit-profileImage-regist {
  background-color: #4caf50;
  color: white;
  border: none;
}

.edit-profileImage-regist:hover {
  background-color: #388e3c;
}

.edit-profileImage-remove {
  background-color: #f5f5f5;
  color: #d32f2f;
  border: 1px solid #e0e0e0;
}

.edit-profileImage-remove:hover {
  background-color: #f44336;
  color: white;
  border-color: #f44336;
}

/* 모달 스타일 */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  border-radius: 8px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  animation: modalFadeIn 0.3s ease;
}

@keyframes modalFadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #eee;
}

.modal-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.close-button {
  background-color: transparent;
  border: none;
  font-size: 18px;
  color: #777;
  cursor: pointer;
  transition: color 0.3s ease;
}

.close-button:hover {
  color: #333;
}

.modal-body {
  padding: 20px 15px;
}

.image-preview {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  overflow: hidden;
  margin: 0 auto 20px;
  border: 4px solid #f0f0f0;
}

.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.upload-controls {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 15px;
}

.file-input {
  display: none;
}

.file-input-label {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  background-color: #4caf50;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.file-input-label:hover {
  background-color: #388e3c;
}

.remove-image-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  background-color: transparent;
  color: #f44336;
  border: 1px solid #f44336;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.remove-image-button:hover {
  background-color: #f44336;
  color: white;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  padding: 15px;
  border-top: 1px solid #eee;
  gap: 10px;
}

.cancel-button {
  padding: 8px 16px;
  background-color: #f5f5f5;
  color: #555;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cancel-button:hover {
  background-color: #e0e0e0;
}

/* 반응형 스타일 */
@media (max-width: 768px) {
  .profile-stats {
    gap: 15px;
  }

  .apartment-details {
    flex-direction: column;
    align-items: flex-start;
  }

  .apartment-image {
    width: 100%;
    height: 120px;
  }

  .tab-button {
    font-size: 13px;
    padding: 12px 0;
  }

  .tab-button i {
    margin-right: 4px;
  }

  .modal-content {
    width: 95%;
  }
}

@media (max-width: 480px) {
  .profile-tabs {
    overflow-x: auto;
    white-space: nowrap;
  }

  .tab-button {
    padding: 12px 15px;
    min-width: 100px;
  }

  .profile-stats {
    width: 100%;
    justify-content: space-around;
  }

  .tab-content {
    padding: 0 15px 15px;
  }
}
</style>
