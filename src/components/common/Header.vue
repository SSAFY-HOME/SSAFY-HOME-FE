<template>
  <header class="zipzip-header">
    <div class="header-container">
      <!-- 로고 섹션 -->
      <div class="logo-section">
        <a href="/" class="logo-link">
          <div class="logo">
            <div class="logo-icon">
              <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M16 2L2 10V30H30V10L16 2Z" stroke="#4CAF50" stroke-width="2" fill="none" />
                <path d="M16 8L8 13V25H24V13L16 8Z" fill="#4CAF50" />
                <rect x="14" y="18" width="4" height="7" rx="1" fill="white" />
              </svg>
            </div>
            <div class="logo-text">
              <span>ZIP</span>
              <span>ZIP</span>
            </div>
          </div>
        </a>
      </div>

      <!-- 메인 내비게이션 -->
      <nav class="main-nav">
        <div class="nav-item active">
          <a href="/main">부동산 실거래 조회</a>
          <div class="underline"></div>
        </div>
        <div class="nav-item">
          <a href="#">부동산 상담 채팅</a>
          <div class="underline"></div>
        </div>
      </nav>

      <!-- 보조 내비게이션 -->
      <div class="sub-nav">
        <a href="/notice" class="sub-nav-item">공지사항</a>
        <a href="/login" class="sub-nav-item login">로그인</a>
        <a href="/signup" class="sub-nav-item signup">회원가입</a>
        <a href="#" class="sub-nav-item">동네 커뮤니티</a>
      </div>

      <!-- 검색 버튼 -->
      <div class="search-button">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z"
            stroke="#333"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M21 21L16.65 16.65"
            stroke="#333"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: 'HeaderComponent',
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.zipzip-header {
  width: 100%;
  height: 90px;
  background-color: white;
  border-bottom: 1px solid #f0f0f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.header-container {
  max-width: 1200px;
  height: 100%;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
}

/* 로고 스타일링 */
.logo-section {
  margin-right: 40px;
}

.logo-link {
  text-decoration: none;
}

.logo {
  display: flex;
  align-items: center;
}

.logo-icon {
  margin-right: 8px;
}

.logo-text {
  display: flex;
  flex-direction: column;
  line-height: 1;
}

.logo-text span {
  font-weight: 800;
  color: #4caf50;
  font-size: 16px;
  letter-spacing: -0.5px;
}

/* 메인 내비게이션 */
.main-nav {
  display: flex;
  height: 100%;
  margin-right: auto;
}

.nav-item {
  position: relative;
  height: 100%;
  display: flex;
  align-items: center;
  margin-right: 32px;
}

.nav-item a {
  color: #666;
  text-decoration: none;
  font-size: 16px;
  font-weight: 600;
  padding: 0 4px;
}

.nav-item.active a {
  color: #666;
}

.underline {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background-color: transparent;
  transition: background-color 0.3s;
}

/* .nav-item.active .underline {
  background-color: #4caf50;
} */

.nav-item:hover .underline {
  background-color: #4caf50;
}

/* 보조 내비게이션 */
.sub-nav {
  display: flex;
  align-items: center;
  margin-right: 24px;
}

.sub-nav-item {
  color: #666;
  text-decoration: none;
  font-size: 14px;
  margin-left: 20px;
  transition: color 0.3s;
}

.sub-nav-item:hover {
  color: #4caf50;
}

.sub-nav-item.login {
  color: #000000;
  font-weight: 600;
}

.sub-nav-item.signup {
  color: #000000;
  font-weight: 600;
}

/* 검색 버튼 */
.search-button {
  cursor: pointer;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s;
}

.search-button:hover {
  background-color: #f5f5f5;
}

/* 반응형 스타일 */
@media (max-width: 768px) {
  .sub-nav {
    display: none;
  }

  .main-nav {
    margin-right: 20px;
  }

  .nav-item {
    margin-right: 20px;
  }

  .nav-item a {
    font-size: 14px;
  }
}
@media (max-width: 576px) {
  .logo-text {
    display: none;
  }

  .nav-item {
    margin-right: 12px;
  }
}
</style>
