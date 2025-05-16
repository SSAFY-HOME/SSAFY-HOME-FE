<template>
  <div class="sidebar">
    <div class="sidebar-content">
      <!-- 페이지 로고 - 클릭 시 홈으로 이동 -->
      <div class="logo-container" @click="goToHome">
        <div class="logo-icon">
          <img src="@/assets/logobright_green.png" alt="ZIPZIP" class="logo-img" />
        </div>
        <!-- <div class="logo-text">
          <span>ZIP</span>
          <span>ZIP</span>
        </div> -->
      </div>

      <!-- 내 ZIP -->
      <div
        class="menu-item"
        :class="{ active: activeMenu === 'home' }"
        @click="activateMenu('home')"
      >
        <div class="menu-icon">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M9 22V12H15V22"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
        <span class="menu-text">내 ZIP</span>
      </div>

      <!-- 매물 찾기 -->
      <div
        class="menu-item"
        :class="{ active: activeMenu === 'property' }"
        @click="activateMenu('property')"
      >
        <div class="menu-icon">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
        <span class="menu-text">매물 찾기</span>
      </div>

      <!-- 커뮤니티 -->
      <div
        class="menu-item"
        :class="{ active: activeMenu === 'community' }"
        @click="activateMenu('community')"
      >
        <div class="menu-icon">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
        <span class="menu-text">커뮤니티</span>
      </div>

      <!-- AI 챗봇 -->
      <div
        class="menu-item"
        :class="{ active: activeMenu === 'chatbot' }"
        @click="activateMenu('chatbot')"
      >
        <div class="menu-icon">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2Z"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M7 13.5C7.82843 13.5 8.5 12.8284 8.5 12C8.5 11.1716 7.82843 10.5 7 10.5C6.17157 10.5 5.5 11.1716 5.5 12C5.5 12.8284 6.17157 13.5 7 13.5Z"
              fill="currentColor"
            />
            <path
              d="M12 13.5C12.8284 13.5 13.5 12.8284 13.5 12C13.5 11.1716 12.8284 10.5 12 10.5C11.1716 10.5 10.5 11.1716 10.5 12C10.5 12.8284 11.1716 13.5 12 13.5Z"
              fill="currentColor"
            />
            <path
              d="M17 13.5C17.8284 13.5 18.5 12.8284 18.5 12C18.5 11.1716 17.8284 10.5 17 10.5C16.1716 10.5 15.5 11.1716 15.5 12C15.5 12.8284 16.1716 13.5 17 13.5Z"
              fill="currentColor"
            />
          </svg>
        </div>
        <span class="menu-text">AI 챗봇</span>
      </div>

      <!-- 공지사항 -->
      <div class="menu-item" @click="handleNotice">
        <div class="menu-icon">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 8V12M12 16H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
        <span class="menu-text">공지사항</span>
      </div>

      <div class="menu-divider"></div>

      <!-- 내 프로필 -->
      <div class="menu-item" @click="goToMyPage">
        <div class="menu-icon">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
        <span class="menu-text">내 프로필</span>
      </div>

      <!-- 로그인/로그아웃 -->
      <div class="menu-item" @click="handleAuth">
        <div class="menu-icon">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M16 17L21 12L16 7"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M21 12H9"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
        <span class="menu-text">{{ isLoggedIn ? '로그아웃' : '로그인' }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

// 라우터 가져오기
const router = useRouter()

// props 및 emit 정의
const props = defineProps({
  activeMenu: {
    type: String,
    default: '',
  },
  isLoggedIn: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['activate-menu', 'login', 'logout'])

// 홈으로 이동 함수
const goToHome = () => {
  router.push('/')
}

// 메뉴 활성화 메소드
const activateMenu = (menuName) => {
  emit('activate-menu', menuName)
}

// 로그인/로그아웃 처리
const handleAuth = () => {
  if (props.isLoggedIn) {
    emit('logout')
  } else {
    emit('login')
  }
}

const handleNotice = () => {
  router.push('/notice')
}
const goToMyPage = () => {
  router.push('/mypage')
}
</script>

<style scoped>
/* 사이드바 스타일 */
.sidebar {
  width: 80px;
  height: 100%;
  background-color: white;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  z-index: 100;
  overflow-y: auto;
  transition: all 0.3s ease;
  padding: 16px 0;
}

.sidebar-content {
  display: flex;
  flex-direction: column;
  height: 100%;
}

/* 로고 스타일 수정 */
.logo-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 0 0px 0;
  cursor: pointer;
  transition: all 0.2s ease;
}

.logo-container:hover {
  transform: scale(1.05);
}

.logo-icon {
  margin-bottom: 8px;
}

.logo-img {
  height: 80px; /* 로고 이미지 높이 조정 */
  width: auto;
}

.logo-text {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-weight: 1000;
  font-size: 17px;
  color: #000000;
  letter-spacing: 1px;
}

.logo-text span {
  line-height: 1.2;
  font-weight: 600;
}
/* 메뉴 아이템 스타일 */
.menu-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 12px 0;
  margin: 4px 0;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #666;
}

.menu-item:hover {
  background-color: rgba(76, 175, 80, 0.1);
  color: #4caf50;
}

.menu-item.active {
  background-color: rgba(76, 175, 80, 0.15);
  color: #4caf50;
}

.menu-icon {
  margin-bottom: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.menu-text {
  font-size: 12px;
  font-weight: 500;
  text-align: center;
}

.menu-divider {
  height: 1px;
  background-color: #eee;
  margin: 12px 8px;
}
</style>
