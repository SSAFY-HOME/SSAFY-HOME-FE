<!-- Header.vue -->
<template>
  <header class="header">
    <div class="header-container">
      <div class="left-section">
        <div class="logo-container">
          <RouterLink to="/" class="logo">
            <img src="@/assets/logowhite.png" alt="ZIPZIP" class="logo-img" />
          </RouterLink>
        </div>

        <div class="nav-section">
          <div class="main-nav">
            <RouterLink to="/main" class="main-nav-link">부동산 실거래 조회</RouterLink>
            <RouterLink to="/chat" class="main-nav-link">부동산 상담 채팅</RouterLink>
          </div>
          <div class="sub-nav">
            <RouterLink to="/news" class="sub-nav-link">부동산 기사</RouterLink>
            <RouterLink to="/community" class="sub-nav-link">동네 커뮤니티</RouterLink>
          </div>
        </div>
      </div>

      <div class="right-section">
        <div class="user-menu">
          <!-- 로그인 상태가 아닐 때 표시 -->
          <template v-if="!isLoggedIn">
            <RouterLink to="/login" class="user-menu-link login">로그인</RouterLink>
            <RouterLink to="/signup" class="user-menu-link signup">회원가입</RouterLink>
          </template>

          <!-- 로그인 상태일 때 표시 -->
          <template v-else>
            <a @click="handleLogout" class="user-menu-link logout">로그아웃</a>
            <RouterLink to="/mypage" class="user-menu-link mypage">마이페이지</RouterLink>
          </template>
          <RouterLink to="/notice" class="user-menu-link">공지사항</RouterLink>
          <button class="search-toggle">
            <img src="@/assets/search-icon-white.png" alt="Search" class="search-input-icon" />
          </button>
        </div>
        <LogoutModal
          :is-visible="isLogoutModalVisible"
          :message="logoutMessage"
          @close="closeLogout"
        />
      </div>
    </div>
  </header>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import LogoutModal from '@/components/modal/LogoutModal.vue'

// 로그인 상태 관리
const isLoggedIn = ref(false)
const isLogoutModalVisible = ref(false)
const logoutMessage = ref('')
const router = useRouter()

// 로컬 스토리지에서 토큰 확인하여 로그인 상태 설정
const checkLoginStatus = () => {
  const token = localStorage.getItem('accessToken')
  isLoggedIn.value = !!token
}

// 로그아웃 처리
const handleLogout = () => {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('isAdmin')
  logoutMessage.value = '로그아웃이 완료되었습니다'
  isLoggedIn.value = false
  isLogoutModalVisible.value = true
}

// 로그아웃 모달 닫기
const closeLogout = () => {
  isLogoutModalVisible.value = false
  router.push('/')
}

// 컴포넌트 마운트 시 로그인 상태 확인
onMounted(() => {
  checkLoginStatus()
})
</script>

<script>
export default {
  name: 'AppHeader',
}
</script>

<style lang="scss" scoped>
.header {
  position: fixed;
  top: 15px;
  left: 0;
  width: 100%;
  z-index: 1000;
  backdrop-filter: blur(1px);
  transition: all 0.3s ease;

  .header-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1440px;
    margin: 0 auto;
    height: 100px;
  }

  .left-section {
    display: flex;
    align-items: center;

    .logo-container {
      margin-right: 2rem;

      .logo {
        display: block;

        .logo-img {
          height: 80px;
        }
      }
    }

    .nav-section {
      display: flex;
      flex-direction: column;

      .main-nav {
        display: flex;
        gap: 1.5rem;
        margin-bottom: 0.3rem;

        .main-nav-link {
          color: #fff;
          text-decoration: none;
          font-size: 1.4rem;
          font-weight: 600;
          transition: color 0.3s;

          &:hover,
          &.router-link-active {
            color: #82b06d;
          }
        }
      }

      .sub-nav {
        display: flex;
        gap: 1.5rem;
        margin-left: 5px;

        .sub-nav-link {
          color: #ccc;
          text-decoration: none;
          font-size: 0.9rem;
          transition: color 0.3s;

          &:hover,
          &.router-link-active {
            color: #82b06d;
          }
        }
      }
    }
  }

  .right-section {
    .user-menu {
      display: flex;
      gap: 2rem;

      .user-menu-link {
        color: #ccc;
        text-decoration: none;
        font-size: 1rem;
        transition: color 0.3s;

        &:hover {
          color: #fff;
        }
      }
    }
    .search-toggle {
      background: none;
      border: none;
      cursor: pointer;

      .search-input-icon {
        height: 25px;
        width: 25px;
      }
    }
  }
}

// 반응형 디자인
@media (max-width: 768px) {
  .header {
    .header-container {
      flex-direction: column;
      height: auto;
      padding: 1rem 0;
    }

    .left-section {
      flex-direction: column;
      align-items: center;
      margin-bottom: 1rem;

      .logo-container {
        margin-right: 0;
        margin-bottom: 1rem;
      }

      .nav-section {
        align-items: center;

        .main-nav,
        .sub-nav {
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }
      }
    }

    .right-section {
      .user-menu {
        justify-content: center;
      }
    }
  }
}
</style>
