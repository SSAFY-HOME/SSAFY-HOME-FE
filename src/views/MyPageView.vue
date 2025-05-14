<template>
  <AppHeader />
  <div class="myPage">
    <!-- 로그인되지 않은 경우 -->
    <div v-if="!isLoggedIn" class="login-required-container">
      <div class="login-icon">
        <svg
          width="64"
          height="64"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M15 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H15"
            stroke="#888"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M10 17L15 12L10 7"
            stroke="#888"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M15 12H3"
            stroke="#888"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
      <h2 class="login-title">로그인이 필요합니다</h2>
      <p class="login-message">프로필 정보를 확인하려면 로그인해주세요.</p>
      <button class="login-button" @click="goToLogin">로그인 하기</button>
    </div>
    <!-- 로그인된 경우 -->
    <div v-else class="profile-container">
      <!-- 프로필 이미지 -->
      <div class="profile-image-container">
        <img
          :src="profileImage || '/api/placeholder/150/150'"
          alt="프로필 이미지"
          class="profile-image"
        />
      </div>

      <!-- 사용자 정보 -->
      <div class="profile-info">
        <h2 class="profile-name">{{ user.name }}</h2>
        <p class="profile-email">{{ user.email }}</p>
      </div>

      <!-- 아파트 정보 -->
      <div class="apartment-info">
        <h3 class="section-title">나의 아파트 정보</h3>
        <div v-if="user.apartment" class="apartment-details">
          <p class="apartment-name">{{ user.apartment.apartmentName }}</p>
          <p class="apartment-address">{{ user.apartment.address }}</p>
          <p class="apartment-year">{{ user.apartment.buildYear }}년 준공</p>
        </div>
        <p v-else class="no-apartment">등록된 아파트 정보가 없습니다.</p>
      </div>

      <!-- 버튼 영역 -->
      <div class="action-buttons">
        <button class="edit-button">프로필 수정</button>
        <button v-if="!user.apartment" class="add-apartment-button">아파트 등록하기</button>
        <button class="delete-account-button">회원 탈퇴</button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { memberAPI } from '@/api/member'
import AppHeader from '@/components/common/Header.vue'
const router = useRouter()
const isLoggedIn = ref(false)
const profileImage = ref(null)

// 로그인 상태 확인 및 사용자 정보 가져오기
const checkLoginStatus = () => {
  const token = localStorage.getItem('accessToken')
  isLoggedIn.value = !!token

  if (isLoggedIn.value) {
    fetchUserProfile()
  }
}

const user = ref({}) // 상단에 user ref 정의 추가

const fetchUserProfile = async () => {
  try {
    const response = await memberAPI.getProfile()

    if (response && response.data) {
      // 응답으로 받은 데이터로 user 업데이트
      user.value = response.data

      // 프로필 이미지 처리가 필요한 경우
      if (response.data.image) {
        profileImage.value = response.data.image
      }
    } else {
      console.warn('프로필 응답이 비어있거나 유효하지 않습니다')
    }
  } catch (error) {
    console.error('프로필 정보를 가져오는 중 오류가 발생했습니다:', error)
    //인증되지 않은 경우 로그인 페이지로 리디렉션
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('accessToken')
      router.push('/login')
    }
  }
}
// 로그인 페이지로 이동
const goToLogin = () => {
  router.push('/login')
}

// 컴포넌트 마운트 시 실행
onMounted(() => {
  checkLoginStatus()

  // 로그인 상태라면 사용자 정보를 가져옵니다
  if (isLoggedIn.value) {
    // fetchUserProfile()
  }
})
</script>

<style scoped>
.myPage {
  display: flex;
  justify-content: center;
  padding: 20px;
  width: 100%;
}

/* 로그인이 필요한 경우 스타일 */
.login-required-container {
  background-color: white;
  border-radius: 8px;
  width: 100%;
  max-width: 400px;
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.login-icon {
  margin-bottom: 20px;
  color: #888;
}

.login-title {
  font-size: 22px;
  font-weight: 600;
  color: #333;
  margin-bottom: 10px;
}

.login-message {
  font-size: 16px;
  color: #666;
  margin-bottom: 25px;
}

.login-button {
  padding: 12px 30px;
  background-color: #82b06d;
  color: white;
  border: none;
  border-radius: 3px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.login-button:hover {
  background-color: #388e3c;
}

/* 프로필 컨테이너 스타일 */
.profile-container {
  background-color: white;
  border-radius: 8px;
  width: 100%;
  max-width: 500px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* 프로필 이미지 */
.profile-image-container {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: 20px;
  background-color: #f0f0f0;
  border: 4px solid #f0f0f0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.profile-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 사용자 정보 */
.profile-info {
  text-align: center;
  margin-bottom: 25px;
  width: 100%;
}

.profile-name {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 5px;
}

.profile-email {
  font-size: 16px;
  color: #666;
  margin: 0;
}

.apartment-info {
  width: 100%;
  margin-top: 10px;
  padding: 0 0 10px 0;
  border-bottom: 1px solid #eee;
}

.section-title {
  font-size: 18px;
  font-weight: 700;
  color: #333;
  margin-top: 0;
  margin-bottom: 15px;
}

.apartment-details {
  padding: 10px 0;
}

.apartment-name {
  font-size: 18px;
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
}

.apartment-address {
  font-size: 15px;
  color: #555;
  margin-bottom: 8px;
}

.apartment-year {
  font-size: 14px;
  color: #777;
}

.no-apartment {
  color: #888;
  font-size: 15px;
  text-align: center;
  margin: 15px 0;
}

/* 버튼 영역 */
.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  margin-top: 25px;
}

.edit-button,
.add-apartment-button,
.delete-account-button {
  padding: 12px 20px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.edit-button {
  background-color: #4caf50;
  color: white;
}

.edit-button:hover {
  background-color: #388e3c;
}

.add-apartment-button {
  background-color: #2196f3;
  color: white;
}

.add-apartment-button:hover {
  background-color: #1976d2;
}

.delete-account-button {
  background-color: #f5f5f5;
  color: #d32f2f;
  border: 1px solid #e0e0e0;
}

.delete-account-button:hover {
  background-color: #f44336;
  color: white;
  border-color: #f44336;
}
</style>
