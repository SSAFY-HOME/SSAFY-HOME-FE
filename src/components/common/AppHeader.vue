<!-- src/components/common/Header.vue -->
<template>
  <header class="header">
    <div class="logo">
      <img src="../../assets/logo.png" alt="ZIPZIP 로고" />
      <span>ZIPZIP</span>
    </div>
    <nav class="nav">
      <router-link to="/real-price">부동산 실거래 조회</router-link>
      <router-link to="/chat">부동산 상담 채팅</router-link>
      <router-link to="/notice">공지사항</router-link>
      <router-link to="/login">로그인</router-link>
      <router-link to="/register">회원가입</router-link>
      <router-link to="/community">동네 커뮤니티</router-link>
    </nav>
    <div class="search-icon">🔍</div>
  </header>
</template>

<script setup>
// JavaScript setup 구문 기반
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 24px;
  border-bottom: 1px solid #ccc;
}

.logo {
  display: flex;
  align-items: center;
  font-weight: bold;
  font-size: 18px;
}

.logo img {
  width: 30px;
  margin-right: 8px;
}

.nav {
  display: flex;
  gap: 16px;
  font-size: 14px;
}

.nav a {
  text-decoration: none;
  color: #000000;
}

.search-icon {
  font-size: 18px;
}
</style>
