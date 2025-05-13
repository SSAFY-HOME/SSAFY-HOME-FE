// MyPagePanel.vue
<template>
  <div class="profile-panel">
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
          <p class="apartment-name">{{ user.apartment.name }}</p>
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

const router = useRouter()
const isLoggedIn = ref(false)
const profileImage = ref(null)

// 이벤트 emit 정의
const emit = defineEmits(['showOnMap'])

// 사용자 정보 (예시 데이터)
const user = ref({
  name: '홍길동',
  email: 'hong@example.com',
  apartment: {
    name: '푸른 아파트',
    address: '서울시 강남구 테헤란로 123',
    buildYear: '2015',
    // 지도에 표시하기 위한 좌표 정보
    latitude: 37.5037,
    longitude: 127.0448,
  },
})

// 로그인 상태 확인 및 사용자 정보 가져오기
const checkLoginStatus = () => {
  const token = localStorage.getItem('accessToken')
  isLoggedIn.value = !!token

  if (isLoggedIn.value) {
    // 실제 구현에서는 토큰을 통해 사용자 정보를 API에서 가져와야 합니다
    // fetchUserProfile()
  }
}

// 실제 환경에서는 API를 통해 사용자 프로필 정보를 가져오는 함수
const fetchUserProfile = async () => {
  try {
    // 실제 API 호출 예시
    // const response = await fetch('/api/user/profile', {
    //   headers: {
    //     'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    //   }
    // })
    // const data = await response.json()
    // user.value = data
    // profileImage.value = data.profileImageUrl || null
  } catch (error) {
    console.error('프로필 정보를 가져오는 중 오류가 발생했습니다:', error)
  }
}

// 아파트 위치를 지도에 표시하는 함수
const showApartmentOnMap = () => {
  if (user.value.apartment && user.value.apartment.latitude && user.value.apartment.longitude) {
    // MainLayout 컴포넌트로 이벤트 전달
    emit('showOnMap', user.value.apartment)
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

    // 패널이 열리면 자동으로 아파트 위치를 지도에 표시
    // setTimeout을 사용하여 지도가 완전히 로드된 후 마커를 표시
    setTimeout(() => {
      if (user.value.apartment) {
        showApartmentOnMap()
      }
    }, 300)
  }
})
</script>

<style scoped>
.profile-panel {
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
  background-color: #4caf50;
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
