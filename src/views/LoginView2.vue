<template>
  <AppHeader />
  <div class="con">
    <div class="container">
      <div class="left-panel">
        <h1>ZIPZIP과<br />함께<br />딱 맞는<br />부동산을<br />찾아보세요</h1>
      </div>
      <div class="right-panel">
        <h2>ZIPZIP에 오신 것을<br />환영해요!</h2>

        <!-- 오류 메시지 표시 영역 -->
        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>

        <form @submit.prevent="handleLogin">
          <div class="input-group">
            <label for="email">이메일</label>
            <input
              type="email"
              id="email"
              v-model="email"
              placeholder="이메일을 입력해주세요"
              required
            />
          </div>

          <div class="input-group">
            <label for="password">비밀번호</label>
            <input
              type="password"
              id="password"
              v-model="password"
              placeholder="비밀번호를 입력해주세요"
              required
            />
          </div>

          <div class="auto-login">
            <input type="checkbox" id="auto-login" v-model="autoLogin" />
            <label for="auto-login">자동로그인</label>
            <div style="flex-grow: 1"></div>
            <div>
              <span style="font-size: 14px; color: #666">아직 회원이 아니신가요?</span>
              <router-link
                to="/signup"
                style="font-size: 14px; color: #4caf50; font-weight: 600; margin-left: 5px"
                >회원가입</router-link
              >
            </div>
          </div>

          <button type="submit" class="login-btn" :disabled="isLoading">
            {{ isLoading ? '로그인 중...' : '로그인' }}
          </button>

          <div class="social-login">
            <button type="button" class="kakao-btn" @click="kakaoLogin">
              <span class="kakao-icon">💬</span>
              카카오 로그인
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { memberAPI } from '@/api/member'
import AppHeader from '@/components/common/Header.vue'

const router = useRouter()

// 상태 변수
const email = ref('')
const password = ref('')
const autoLogin = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')

// 로그인 처리 함수
const handleLogin = async () => {
  try {
    // 입력 유효성 검사
    if (!email.value.trim()) {
      errorMessage.value = '이메일을 입력해주세요.'
      return
    }

    if (!password.value) {
      errorMessage.value = '비밀번호를 입력해주세요.'
      return
    }

    // 로딩 상태 시작
    isLoading.value = true
    errorMessage.value = ''

    // 로그인 API 호출
    const userData = {
      email: email.value,
      password: password.value,
    }

    const result = await memberAPI.logIn(userData)

    // 로그인 결과 처리
    if (result.status === 200) {
      // 로그인 성공 처리
      console.log('로그인 성공:', result.message)

      // 로컬 스토리지에 토큰 저장
      localStorage.setItem('isAdmin', result.isAdmin)
      // 필요한 경우 토큰 저장
      localStorage.setItem('accessToken', result.token)
      localStorage.setItem('isSocial', result.social)

      // 홈 페이지 또는 이전 페이지로 리다이렉트
      console.log(result.hasHome)
      if (result.hasHome === false) {
        router.push('/regist/home')
      } else {
        router.push('/')
      }
    } else {
      // 오류 메시지 표시
      errorMessage.value = result.message || '로그인에 실패했습니다.'
    }
  } catch (error) {
    console.error('로그인 처리 중 오류:', error)
    errorMessage.value = '로그인 처리 중 오류가 발생했습니다.'
  } finally {
    // 로딩 상태 종료
    isLoading.value = false
  }
}

// 카카오 로그인 함수
const kakaoLogin = () => {
  const REST_API_KEY = import.meta.env.VITE_KAKAO_LOGIN_REST_API_KEY
  const REDIRECT_URI = import.meta.env.VITE_KAKAO_REDIRECT_URI

  const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`

  window.location.href = kakaoAuthUrl
}
</script>

<style scoped>
.con {
  display: flex;
  height: 90%;
  justify-content: center;
  align-items: center;
}
.container {
  display: flex;
  width: 900px;
  height: 600px;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  overflow: hidden;
}

.left-panel {
  width: 45%;
  background: #000000;
  color: white;
  padding: 60px 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.left-panel h1 {
  font-size: 38px;
  font-weight: 700;
  line-height: 1.3;
  margin-bottom: 30px;
}

.right-panel {
  width: 60%;
  background: white;
  padding: 60px 50px;
  display: flex;
  flex-direction: column;
}

.right-panel h2 {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 40px;
  text-align: center;
  color: #333;
}

.input-group {
  margin-bottom: 24px;
}

.input-group label {
  display: block;
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.input-group input {
  width: 100%;
  padding: 15px;
  border: 1px solid #e0e0e0;
  border-radius: 5px;
  font-size: 16px;
  transition: all 0.3s;
}

.input-group input:focus {
  border-color: #5358e9;
  outline: none;
  box-shadow: 0 0 0 3px rgba(83, 88, 233, 0.1);
}

.login-btn {
  background: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 16px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  margin-top: 10px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-btn:hover:not(:disabled) {
  background: #45a049;
}

.login-btn:disabled {
  background: #a5d6a7;
  cursor: not-allowed;
}

.social-login {
  margin-top: 20px;
}

.kakao-btn {
  background: #f0e332;
  color: #3c1e1e;
  border: none;
  border-radius: 5px;
  padding: 16px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 12px;
}

.kakao-icon {
  margin-right: 8px;
  font-size: 18px;
}

.auto-login {
  display: flex;
  align-items: center;
  margin: 20px 0;
}

.auto-login input {
  margin-right: 8px;
}

.sign-up {
  text-align: center;
  margin-top: 20px;
  color: #666;
  font-size: 14px;
}

.sign-up a {
  color: #4caf50;
  text-decoration: none;
  font-weight: 600;
}

/* 에러 메시지 스타일 */
.error-message {
  background-color: #ffebee;
  color: #e53935;
  padding: 12px;
  border-radius: 5px;
  margin-bottom: 20px;
  font-size: 14px;
  text-align: center;
}
</style>
