<template>
  <AppHeader />
  <div class="login-page">
    <div class="login-left">
      <h2><strong>ZIPZIP</strong>과 함께<br />딱 맞는 부동산을<br />찾아보세요</h2>
    </div>
    <div class="login-right">
      <h2>ZIPZIP에 오신 것을 환영해요!</h2>
      <p>아직 회원이 아니신가요? <router-link to="/register">회원가입</router-link></p>
      <input type="text" placeholder="email" v-model="email" />
      <input type="password" placeholder="password" v-model="password" />
      <button @click="login">로그인</button>
      <label>
        <input type="checkbox" v-model="autoLogin" />
        자동로그인
      </label>
      <button class="kakao-login">🟨 카카오 로그인</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import AppHeader from '@/components/common/AppHeader.vue'
const email = ref('')
const password = ref('')
const autoLogin = ref(false)

const login = () => {
  console.log('로그인 시도:', {
    email: email.value,
    password: password.value,
    autoLogin: autoLogin.value,
  })
  // 실제 로그인 로직 연결 필요
}
</script>

<style scoped>
.login-page {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: 64px;
  padding: 64px;
}

.login-left {
  background: #000;
  color: #fff;
  padding: 48px;
  font-size: 22px;
  font-weight: bold;
}

.login-right {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 300px;
}

.login-right input {
  padding: 8px;
  font-size: 14px;
}

.login-right button {
  padding: 10px;
  font-size: 14px;
  cursor: pointer;
}

.kakao-login {
  background: #fee500;
  color: #000;
  font-weight: bold;
}
</style>
