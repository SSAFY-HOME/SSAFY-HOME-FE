<template>
  <AppHeader />
  <div class="signup-container">
    <div class="signup-card">
      <h1>회원가입</h1>
      <form @submit.prevent="submitForm">
        <div class="form-group">
          <label for="name">이름</label>
          <input
            type="text"
            id="name"
            v-model="user.name"
            placeholder="홍길동"
            @blur="validateName"
            :class="{ 'input-error': errors.name, 'input-success': user.name && !errors.name }"
          />
          <span v-if="errors.name" class="error-message">{{ errors.name }}</span>
        </div>

        <div class="form-group">
          <label for="email">이메일</label>
          <input
            type="email"
            id="email"
            v-model="user.email"
            placeholder="example@domain.com"
            @blur="validateEmail"
            :class="{ 'input-error': errors.email, 'input-success': user.email && !errors.email }"
          />
          <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
        </div>

        <div class="form-group">
          <label for="password">비밀번호</label>
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

        <div class="checkbox-container">
          <input type="checkbox" id="terms" v-model="user.termsAgreed" />
          <label for="terms" class="checkbox-label"
            >이용약관 및 개인정보 수집, 이용에 모두 동의합니다.</label
          >
          <span v-if="errors.termsAgreed" class="error-message block-error">{{
            errors.termsAgreed
          }}</span>
        </div>

        <button type="submit" class="btn" :disabled="isSubmitting">
          <span v-if="isSubmitting">처리 중...</span>
          <span v-else>회원가입</span>
        </button>

        <div class="form-footer">
          이미 계정이 있으신가요? <router-link to="/login">로그인하기</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import AppHeader from '@/components/common/Header.vue'
import { memberAPI } from '@/api/member' // memberAPI 가져오기
import { useRouter } from 'vue-router'

// 사용자 입력 데이터
const user = reactive({
  name: '',
  email: '',
  password: '',
  passwordConfirm: '',
  termsAgreed: false,
})

// 유효성 검사 오류
const errors = reactive({
  name: '',
  email: '',
  password: '',
  passwordConfirm: '',
  termsAgreed: '',
})

const isSubmitting = ref(false)
const registrationComplete = ref(false)
const router = useRouter()

// 유효성 검사 함수들 (기존 코드와 동일)
const validateName = () => {
  if (!user.name) {
    errors.name = '이름을 입력해주세요'
    return false
  }
  errors.name = ''
  return true
}

const validateEmail = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!user.email) {
    errors.email = '이메일을 입력해주세요'
    return false
  } else if (!emailRegex.test(user.email)) {
    errors.email = '올바른 이메일 형식이 아닙니다'
    return false
  }
  errors.email = ''
  return true
}

const validatePassword = () => {
  if (!user.password) {
    errors.password = '비밀번호를 입력해주세요'
    return false
  } else if (user.password.length < 8) {
    errors.password = '비밀번호는 8자 이상이어야 합니다'
    return false
  }
  errors.password = ''
  return true
}

const validatePasswordConfirm = () => {
  if (!user.passwordConfirm) {
    errors.passwordConfirm = '비밀번호 확인을 입력해주세요'
    return false
  } else if (user.password !== user.passwordConfirm) {
    errors.passwordConfirm = '비밀번호가 일치하지 않습니다'
    return false
  }
  errors.passwordConfirm = ''
  return true
}

const validateTerms = () => {
  if (!user.termsAgreed) {
    errors.termsAgreed = '이용약관에 동의해주세요'
    return false
  }
  errors.termsAgreed = ''
  return true
}

// 양식 제출 처리 - memberAPI 사용하도록 수정
const submitForm = async () => {
  // 모든 필드 유효성 검사
  const isNameValid = validateName()
  const isEmailValid = validateEmail()
  const isPasswordValid = validatePassword()
  const isPasswordConfirmValid = validatePasswordConfirm()
  const isTermsValid = validateTerms()

  // 모든 검사가 통과하는지 확인
  if (isNameValid && isEmailValid && isPasswordValid && isPasswordConfirmValid && isTermsValid) {
    try {
      isSubmitting.value = true

      // 서버로 전송할 데이터 준비 (필요한 필드만 포함)
      const userData = {
        name: user.name, // API에 맞게 필드명 변경
        email: user.email,
        password: user.password,
      }

      // memberAPI를 사용하여 회원가입 요청 전송
      const result = await memberAPI.signUp(userData)
      console.log(result)
      // 응답 결과에 따른 처리
      if (result.status === 200) {
        // 성공 메시지 표시
        alert('회원가입이 완료되었습니다!')

        // 폼 초기화
        user.name = ''
        user.email = ''
        user.password = ''
        user.passwordConfirm = ''
        user.termsAgreed = false

        registrationComplete.value = true

        // 필요시 로그인 페이지로 리다이렉트
        router.push('/login')
      } else {
        // API에서 실패 응답을 반환한 경우
        throw new Error(result.message || '회원가입에 실패했습니다.')
      }
    } catch (error) {
      console.error('회원가입 처리 중 오류가 발생했습니다:', error)

      // 오류 메시지 표시
      alert(error.message || '회원가입 처리 중 오류가 발생했습니다. 다시 시도해주세요.')
    } finally {
      isSubmitting.value = false
    }
  }
}
</script>
<style scoped>
/* 전역 스타일 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* 컨테이너 스타일 */
.signup-container {
  min-height: 90vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  font-family: 'Pretendard', 'Apple SD Gothic Neo', sans-serif;
}

.signup-card {
  width: 100%;
  max-width: 450px;
  background-color: white;
  border-radius: 8px; /* 16px에서 8px로 낮춤 */
  box-shadow: none; /* drop shadow 제거 */
  padding: 40px;
  animation: fadeIn 0.5s ease;
  border: 1px solid #e0e0e0; /* 그림자 대신 테두리 추가 (선택사항) */
}

/* 로고 및 제목 스타일 */
.logo {
  text-align: center;
  margin-bottom: 30px;
}

h1 {
  color: #333;
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 10px;
  text-align: center;
}

.subtitle {
  color: #666;
  font-size: 16px;
  text-align: center;
  margin-bottom: 30px;
}

/* 폼 스타일 */
.form-group {
  margin-bottom: 20px;
  position: relative;
}

label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  color: #555;
  font-weight: 500;
}

input[type='text'],
input[type='email'],
input[type='password'] {
  width: 100%;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 4px; /* 8px에서 4px로 낮춤 */
  font-size: 16px;
  transition: all 0.3s;
}

input:focus {
  outline: none;
  border-color: #4caf50;
  box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.2);
}

input::placeholder {
  color: #aaa;
}

.input-error {
  border-color: #e74c3c !important;
}

.input-success {
  border-color: #4caf50 !important;
}

.error-message {
  color: #e74c3c;
  font-size: 12px;
  margin-top: 5px;
  display: block;
}

.block-error {
  display: block;
  margin-top: 5px;
}

/* 체크박스 스타일 */
.checkbox-container {
  display: flex;
  align-items: flex-start;
  margin-bottom: 20px;
}

.checkbox-container input {
  width: 18px;
  height: 18px;
  margin-right: 10px;
  margin-top: 2px;
}

.checkbox-label {
  font-size: 14px;
  color: #666;
  flex: 1;
}

/* 버튼 스타일 */
.btn {
  width: 100%;
  padding: 16px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px; /* 8px에서 4px로 낮춤 */
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  margin-top: 10px;
}

.btn:hover:not(:disabled) {
  background-color: #45a049;
  transform: translateY(-2px);
}

.btn:disabled {
  background-color: #aaa;
  cursor: not-allowed;
}

/* 푸터 스타일 */
.form-footer {
  text-align: center;
  margin-top: 30px;
  font-size: 14px;
  color: #666;
}

.form-footer a {
  color: #4caf50;
  text-decoration: none;
  font-weight: 500;
}

.form-footer a:hover {
  text-decoration: underline;
}

/* 반응형 스타일 */
@media (max-width: 480px) {
  .signup-card {
    padding: 25px;
    max-width: 100%;
  }

  h1 {
    font-size: 24px;
  }
}
</style>
