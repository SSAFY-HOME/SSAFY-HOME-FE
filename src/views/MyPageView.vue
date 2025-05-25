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
              :src="profileImage"
              alt="프로필 이미지"
              class="profile-image"
              @error="handleImageError"
              @load="handleImageLoad"
              :key="profileImage"
            />
            <div class="profile-image-overlay">
              <button class="image-edit-button">
                <span class="icon">📷</span>
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
          <span class="icon">👤</span> 기본 정보
        </button>

        <button
          class="tab-button"
          :class="{ active: activeTab === 'security' }"
          @click="activeTab = 'security'"
          v-if="!isKakaoUser"
        >
          <span class="icon">🔒</span> 비밀번호 변경 및 탈퇴
        </button>
        <button
          class="tab-button"
          :class="{ active: activeTab === 'security' }"
          @click="activeTab = 'security'"
          v-if="isKakaoUser"
        >
          <span class="icon">🔒</span> 탈퇴
        </button>
        <button
          class="tab-button"
          :class="{ active: activeTab === 'activity' }"
          @click="activeTab = 'activity'"
        >
          <span class="icon">📊</span> 활동 내역
        </button>
      </div>

      <!-- 기본 정보 탭 -->
      <div v-if="activeTab === 'info'" class="tab-content">
        <!-- 프로필 정보 -->
        <div class="info-card">
          <div class="card-header">
            <h3 class="section-title"><span class="icon">🆔</span> 프로필 정보</h3>
          </div>
          <div class="card-content">
            <div class="form-group">
              <label for="name">이름</label>
              <input type="text" id="name" v-model="user.name" readonly />
              <label for="nickname">이메일</label>
              <input type="text" id="nickname" v-model="user.email" readonly />
            </div>
          </div>
        </div>
        <!-- 아파트 정보 -->
        <div class="info-card apartment-info">
          <div class="card-header">
            <h3 class="section-title"><span class="icon">🏠</span> 나의 아파트 정보</h3>
            <button class="edit-button small" @click="modifyApartment">
              <span class="icon">✏️</span> 수정
            </button>
          </div>
          <div class="card-content">
            <div v-if="user.apartment" class="apartment-details">
              <div class="apartment-text">
                <p class="apartment-name">{{ user.apartment.apartmentName }}</p>
                <p class="apartment-address">
                  <span class="icon">📍</span> {{ user.apartment.address }}
                </p>
                <p class="apartment-year">
                  <span class="icon">📅</span> {{ user.apartment.buildYear }}년 준공
                </p>
              </div>
            </div>
            <p v-else class="no-apartment">
              <span class="icon">❗</span> 등록된 아파트 정보가 없습니다.
              <button class="add-button" @click="modifyApartment">아파트 등록하기</button>
            </p>
          </div>
        </div>

        <!-- 관심 아파트 -->
        <div class="info-card favorites">
          <div class="card-header">
            <h3 class="section-title"><span class="icon">❤️</span> 관심 아파트</h3>
          </div>
          <div class="card-content">
            <div v-if="favoriteApartments.length > 0" class="favorites-list">
              <div v-for="apt in favoriteApartments" :key="apt.id" class="favorite-item">
                <div class="favorite-info">
                  <p class="favorite-name">{{ apt.name }}</p>
                  <p class="favorite-address">{{ apt.addr }}</p>
                </div>
              </div>
            </div>
            <p v-else class="no-favorites">
              <span class="icon">💔</span> 등록된 관심 아파트가 없습니다.
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
            <h3 class="section-title"><span class="icon">🔑</span> 비밀번호 변경</h3>
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
                <span class="icon">🔑</span> 비밀번호 변경하기
              </button>
            </form>
          </div>
        </div>

        <!-- 회원 탈퇴 섹션 - 일반 사용자 -->
        <div class="info-card danger-zone" v-if="!isKakaoUser">
          <div class="card-header danger">
            <h3 class="section-title"><span class="icon">⚠️</span> 계정 관리</h3>
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
              <span class="icon">🚫</span> 회원 탈퇴
            </button>
          </div>
        </div>

        <!-- 회원 탈퇴 섹션 - 카카오 사용자 -->
        <div class="info-card danger-zone" v-if="isKakaoUser">
          <div class="card-header danger">
            <h3 class="section-title"><span class="icon">⚠️</span> 계정 관리</h3>
          </div>
          <div class="card-content">
            <p class="warning-text">
              계정을 삭제하면 모든 데이터가 영구적으로 삭제됩니다. 이 작업은 되돌릴 수 없습니다.
            </p>
            <p class="kakao-notice">
              <span class="icon">ℹ️</span> 카카오톡 계정으로 연결된 회원은 카카오 로그인 인증 후
              탈퇴가 가능합니다.
            </p>
            <button class="kakao-login-button" @click="requestKakaoReLogin">
              <span class="icon">💬</span> 카카오톡으로 인증하기
            </button>
          </div>
        </div>
      </div>

      <!-- 활동 내역 탭 -->
      <div v-if="activeTab === 'activity'" class="tab-content">
        <div class="info-card">
          <div class="card-header">
            <h3 class="section-title"><span class="icon">📋</span> 내가 쓴 게시글</h3>
          </div>
          <div class="card-content">
            <div v-if="userPosts.length > 0" class="activity-list">
              <div v-for="post in userPosts" :key="post.communityId" class="activity-item">
                <div class="activity-content">
                  <h4 class="activity-title">{{ post.title }}</h4>
                  <p class="activity-excerpt">{{ post.content }}</p>
                </div>
                <div class="activity-meta">
                  <span class="activity-date">{{ formatDate(post.updateDate) }}</span>
                  <span class="activity-stats">
                    <span class="icon">❤️</span> {{ post.like }} <span class="icon ml-2">💬</span>
                    {{ post.comments }}
                  </span>
                </div>
              </div>
            </div>
            <p v-else class="no-activity">
              <span class="icon">📋</span> 작성한 게시글이 없습니다.
              <button class="add-button" @click="goToCommunity">게시글 작성하기</button>
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
          <span class="icon">❌</span>
        </button>
      </div>
      <div class="modal-body">
        <div class="image-preview">
          <img
            :src="previewImageUrl"
            alt="프로필 이미지 미리보기"
            @error="handleImageError"
            @load="handleImageLoad"
            :key="previewImageUrl"
          />
        </div>

        <!-- 업로드 진행률 표시 -->
        <div v-if="isUploading" class="upload-progress">
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: uploadProgress + '%' }"></div>
          </div>
          <p class="progress-text">업로드 중... {{ uploadProgress }}%</p>
        </div>

        <div class="upload-controls" v-if="!isUploading">
          <input
            type="file"
            id="profile-image-upload"
            @change="previewProfileImage"
            accept="image/*"
            class="file-input"
          />
          <label for="profile-image-upload" class="file-input-label">
            <span class="icon">⬆️</span> 이미지 선택
          </label>

          <button
            class="remove-image-button"
            @click="removeProfileImage"
            v-if="user.image && user.image !== 'null' && user.image.trim() !== ''"
          >
            <span class="icon">🗑️</span> 이미지 삭제
          </button>
        </div>
      </div>
      <div class="modal-footer">
        <button class="cancel-button" @click="closeImageModal" :disabled="isUploading">취소</button>
        <button
          class="save-button"
          @click="saveProfileImage"
          :disabled="!selectedFile || isUploading"
        >
          <span v-if="isUploading">업로드 중...</span>
          <span v-else>저장</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { memberAPI } from '@/api/member'
import AppHeader from '@/components/common/Header.vue'
import { communityAPI } from '@/api/community'
import { useMemberStore } from '@/stores/user'

const user = computed(() => memberStore)
const router = useRouter()
const isLoggedIn = computed(() => !!user.value.accessToken)
const confirmPassword = ref('')
const errors = ref({})
const memberStore = useMemberStore()

const activeTab = ref('info')
const showImageModal = ref(false)
const previewImage = ref(null)
const favoriteApartments = ref([])
const userPosts = ref([])
const selectedFile = ref(null)
const uploadProgress = ref(0)
const isUploading = ref(false)

// 🔥 개선된 기본 프로필 이미지 처리
import defaultProfileImage from '@/assets/default-profile-image.png'

const DEFAULT_PROFILE_IMAGE = defaultProfileImage
const imageErrorCount = ref(new Map()) // 이미지 에러 카운트 추적

// 카카오 로그인 사용자 체크
const isKakaoUser = computed(() => user.value.isSocial === true || user.value.social === 'true')

// 🆕 개선된 프로필 이미지 URL 처리
const profileImage = computed(() => {
  console.log('프로필 이미지 확인:', user.value.image)

  // 이미지가 있고 유효한 URL인 경우
  if (user.value.image && user.value.image.trim() !== '' && user.value.image !== 'null') {
    return user.value.image
  }

  // 이미지가 없거나 null인 경우 기본 이미지 반환
  return DEFAULT_PROFILE_IMAGE
})

// 미리보기 이미지 URL
const previewImageUrl = computed(() => {
  if (previewImage.value) {
    return previewImage.value
  }
  return profileImage.value
})

// 🆕 이미지 URL 유효성 검사
const isValidImageUrl = (url) => {
  if (!url || url === 'null' || url.trim() === '') return false
  if (url === DEFAULT_PROFILE_IMAGE) return true

  // S3 URL 패턴 검사
  const s3UrlPattern = /^https:\/\/[^\/]+\.s3\.[^\/]+\.amazonaws\.com\/.+/
  const httpPattern = /^https?:\/\/.+/

  return s3UrlPattern.test(url) || httpPattern.test(url) || url.startsWith('data:image/')
}

// 🆕 개선된 이미지 에러 핸들러 (무한루프 방지)
const handleImageError = (event) => {
  const imgSrc = event.target.src

  console.warn('이미지 로드 실패:', imgSrc)

  // 이미 기본 이미지인 경우 무한루프 방지
  if (imgSrc === DEFAULT_PROFILE_IMAGE || imgSrc.includes('default-profile-image')) {
    console.warn('기본 이미지 로드도 실패했습니다. 더 이상 재시도하지 않습니다.')
    return
  }

  // 에러 카운트 추적으로 무한루프 방지
  const currentCount = imageErrorCount.value.get(imgSrc) || 0
  if (currentCount >= 2) {
    console.warn('이미지 로드 재시도 한계 초과:', imgSrc)
    return
  }

  imageErrorCount.value.set(imgSrc, currentCount + 1)

  console.log('기본 이미지로 교체:', DEFAULT_PROFILE_IMAGE)
  event.target.src = DEFAULT_PROFILE_IMAGE
}

// 🆕 이미지 로드 성공 핸들러
const handleImageLoad = (event) => {
  const imgSrc = event.target.src
  console.log('이미지 로드 성공:', imgSrc)

  // 성공시 에러 카운트 초기화
  if (imageErrorCount.value.has(imgSrc)) {
    imageErrorCount.value.delete(imgSrc)
  }
}

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
  }
}

const fetchUserProfile = async () => {
  try {
    const response = await memberAPI.getProfile()
    if (response && response.data) {
      console.log('받은 프로필 데이터:', response.data.image)

      user.value = {
        ...response.data,
        image: response.data.image || DEFAULT_PROFILE_IMAGE,
        currentPassword: '',
        password: '',
        passwordConfirm: '',
        social: response.data.social,
      }

      console.log('프로필 정보:', user.value.image)

      // 🆕 이미지 URL 로그 추가
    }
  } catch (error) {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('accessToken')
      router.push('/login')
    }
  }
}

const fetchFavoriteApartments = async () => {
  try {
    const response = await memberAPI.getFavoriteApartments()
    if (response && response.data) {
      favoriteApartments.value = response.data
    }
  } catch (error) {
    console.error('관심 아파트 가져오기 오류:', error)
  }
}

const fetchUserPosts = async () => {
  try {
    const response = await communityAPI.getUserPosts()
    if (response && response.data) {
      userPosts.value = response.data
    }
  } catch (error) {
    console.error('내가 작성한 게시글 가져오기 오류:', error)
  }
}

const formatDate = (dateString) => {
  if (!dateString) return ''

  try {
    const date = new Date(dateString)

    if (isNaN(date.getTime())) {
      console.warn('Invalid date string:', dateString)
      return dateString
    }

    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const targetDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())

    const diffTime = today - targetDate
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 0) {
      return `${Math.abs(diffDays)}일 후`
    }

    if (diffDays === 0) return '오늘'
    if (diffDays === 1) return '어제'
    if (diffDays < 7) return `${diffDays}일 전`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}주 전`

    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`
  } catch (error) {
    console.error('Error formatting date:', error)
    return dateString
  }
}

const goToLogin = () => router.push('/login')
const modifyApartment = () => router.push('/regist/home')
const goToSearch = () => router.push('/main')
const goToCommunity = () => router.push({ path: '/main', query: { menu: 'community' } })

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

const requestKakaoReLogin = () => {
  const REST_API_KEY = import.meta.env.VITE_KAKAO_LOGIN_REST_API_KEY
  const REDIRECT_URI = import.meta.env.VITE_KAKAO_WITHDRAWAL_REDIRECT_URI

  const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code`
  window.location.href = kakaoAuthUrl
}

const deleteUser = async () => {
  if (!confirm('정말 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) return

  if (!confirmPassword.value) {
    alert('비밀번호를 입력해주세요.')
    return
  }

  try {
    await memberAPI.deleteMember(confirmPassword.value)
    localStorage.removeItem('email')
    localStorage.removeItem('hasHome')
    localStorage.removeItem('isSocial')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('accessToken')
    localStorage.removeItem('isAdmin')
    memberStore.clearMember()
    alert('회원 탈퇴가 완료되었습니다. 그동안 이용해주셔서 감사합니다.')
    router.push('/')
  } catch (error) {
    if (error.response && error.response.status === 401) {
      alert('비밀번호가 일치하지 않습니다.')
    } else {
      alert('회원 탈퇴 중 오류가 발생했습니다.')
      console.error('회원 탈퇴 오류:', error)
    }
  }
}

// 프로필 이미지 관련 함수들
const openImageModal = () => {
  console.log('모달 열기 호출됨')
  showImageModal.value = true
  previewImage.value = null
  selectedFile.value = null
  uploadProgress.value = 0
}

const closeImageModal = () => {
  showImageModal.value = false
  previewImage.value = null
  selectedFile.value = null
  uploadProgress.value = 0
  isUploading.value = false

  const fileInput = document.getElementById('profile-image-upload')
  if (fileInput) fileInput.value = ''
}

const previewProfileImage = (event) => {
  const file = event.target.files[0]
  if (!file) return

  if (!file.type.match('image.*')) {
    alert('이미지 파일만 업로드 가능합니다.')
    event.target.value = ''
    return
  }

  const maxSize = 5 * 1024 * 1024 // 5MB
  if (file.size > maxSize) {
    alert('파일 크기는 5MB를 초과할 수 없습니다.')
    event.target.value = ''
    return
  }

  selectedFile.value = file

  const reader = new FileReader()
  reader.onload = (e) => {
    previewImage.value = e.target.result
  }
  reader.readAsDataURL(file)
}

// Presigned URL을 사용한 프로필 이미지 업로드
const uploadProfileImageWithPresignedUrl = async (file) => {
  try {
    isUploading.value = true
    uploadProgress.value = 10

    const presignedData = await memberAPI.getProfileImageUploadUrl(file.name, file.type)
    uploadProgress.value = 30

    const uploadResponse = await fetch(presignedData.presignedUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
      },
      mode: 'cors',
      credentials: 'omit',
    })

    if (!uploadResponse.ok) {
      throw new Error(`S3 업로드 실패: ${uploadResponse.status}`)
    }

    uploadProgress.value = 70

    await memberAPI.completeProfileImageUpload(presignedData.imageKey)
    uploadProgress.value = 100
    await fetchUserProfile()
    closeImageModal()
  } catch (error) {
    let errorMessage = '프로필 이미지 업로드에 실패했습니다.'
    alert(errorMessage)
    throw error
  } finally {
    isUploading.value = false
    uploadProgress.value = 0
  }
}

const uploadProfileImageDirect = async (file) => {
  try {
    isUploading.value = true
    uploadProgress.value = 50

    await memberAPI.uploadProfileImageDirect(file)
    uploadProgress.value = 100

    await fetchUserProfile()
    alert('프로필 이미지가 성공적으로 업로드되었습니다!')
    closeImageModal()
  } catch (error) {
    console.error('프로필 이미지 직접 업로드 실패:', error)
    alert('프로필 이미지 업로드에 실패했습니다.')
  } finally {
    isUploading.value = false
    uploadProgress.value = 0
  }
}

const saveProfileImage = async () => {
  if (!selectedFile.value) {
    alert('업로드할 이미지를 선택해주세요.')
    return
  }

  try {
    await uploadProfileImageWithPresignedUrl(selectedFile.value)
  } catch (error) {
    console.warn('Presigned URL 업로드 실패, 직접 업로드 시도:', error)

    try {
      await uploadProfileImageDirect(selectedFile.value)
    } catch (directError) {
      console.error('직접 업로드도 실패:', directError)
      alert('프로필 이미지 업로드에 실패했습니다. 잠시 후 다시 시도해주세요.')
    }
  }
}

// 🆕 개선된 프로필 이미지 삭제
const removeProfileImage = async () => {
  if (!confirm('프로필 이미지를 삭제하시겠습니까?')) return

  try {
    await memberAPI.removeProfileImage()

    // 🔥 로컬 상태 업데이트 개선
    user.value.image = null // image 필드를 null로 설정
    previewImage.value = null
    selectedFile.value = null

    const fileInput = document.getElementById('profile-image-upload')
    if (fileInput) fileInput.value = ''

    alert('프로필 이미지가 삭제되었습니다.')
  } catch (error) {
    console.error('이미지 삭제 오류:', error)
    alert('이미지 삭제 중 오류가 발생했습니다.')
  }
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
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
  cursor: pointer;
}

/* 🆕 기본 이미지 스타일 추가 */
.profile-image,
.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  background-color: #f5f5f5;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill='%23e0e0e0'%3E%3Ccircle cx='50' cy='35' r='15'/%3E%3Cpath d='M50 55c-15 0-25 10-25 20v10h50V75c0-10-10-20-25-20z'/%3E%3C/g%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: center;
  background-size: 60px 60px;
  transition: opacity 0.3s ease;
}

/* 이미지 로딩 중 상태 */
.profile-image[src=''],
.image-preview img[src=''] {
  opacity: 0.6;
}

/* 기본 이미지일 때 배경 숨기기 */
.profile-image[src*='default-profile-image'],
.image-preview img[src*='default-profile-image'] {
  background-image: none;
}

/* 이미지 로드 실패시 스타일 */
.image-error {
  background-color: #f8f9fa;
  border: 2px dashed #dee2e6;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6c757d;
  font-size: 12px;
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

/* 아이콘 공통 스타일 */
.icon {
  display: inline-block;
  font-size: 16px;
  margin-right: 6px;
  vertical-align: middle;
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

.tab-button .icon {
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

.section-title .icon {
  margin-right: 8px;
  color: #4caf50;
}

.danger-zone .section-title .icon {
  color: #d32f2f;
}

/* 아파트 정보 */
.apartment-details {
  display: flex;
  gap: 15px;
  align-items: center;
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

.apartment-address .icon,
.apartment-year .icon {
  margin-right: 5px;
  color: #6c757d;
}

.no-apartment {
  color: #888;
  font-size: 14px;
  text-align: center;
  margin: 20px 0;
}

.no-apartment .icon {
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

.no-favorites {
  color: #888;
  font-size: 14px;
  text-align: center;
  margin: 20px 0;
}

.no-favorites .icon {
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

.activity-stats .icon {
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

.no-activity .icon {
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
.add-button,
.kakao-login-button {
  padding: 10px 16px 10px 10px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.edit-button .icon,
.add-apartment-button .icon,
.delete-account-button .icon,
.save-button .icon,
.view-all-button .icon,
.add-button .icon,
.kakao-login-button .icon {
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

.add-button,
.kakao-login-button {
  background-color: transparent;
  color: #4caf50;
  border: 1px solid #4caf50;
  font-size: 13px;
  margin-top: 10px;
}

.add-button:hover,
.kakao-login-button:hover {
  background-color: #4caf50;
  color: white;
}

button.small {
  padding: 6px 8px;
  font-size: 13px;
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

/* 업로드 진행률 스타일 */
.upload-progress {
  margin: 15px 0;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background-color: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #4caf50, #66bb6a);
  transition: width 0.3s ease;
  border-radius: 4px;
}

.progress-text {
  text-align: center;
  font-size: 14px;
  color: #666;
  margin: 0;
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

/* 버튼 비활성화 스타일 */
.save-button:disabled,
.cancel-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.warning-text {
  color: #666;
  margin-bottom: 15px;
  line-height: 1.5;
}

.kakao-notice {
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 4px;
  padding: 12px;
  margin: 15px 0;
  color: #495057;
  line-height: 1.5;
}

.kakao-notice .icon {
  color: #17a2b8;
}

/* 반응형 스타일 */
@media (max-width: 768px) {
  .apartment-details {
    flex-direction: column;
    align-items: flex-start;
  }

  .tab-button {
    font-size: 13px;
    padding: 12px 0;
  }

  .tab-button .icon {
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

  .tab-content {
    padding: 0 15px 15px;
  }
}
</style>
