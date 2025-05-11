<template>
  <AppHeader />
  <div class="con">
    <div class="container">
      <div class="left-panel">
        <h1>ZIPZIP과<br />함께<br />딱 맞는<br />부동산을<br />찾아보세요</h1>
      </div>
      <div class="right-panel">
        <h2>ZIPZIP에 오신 것을<br />환영해요!</h2>

        <form>
          <div class="input-group">
            <label for="email">이메일</label>
            <input type="email" id="email" placeholder="이메일을 입력해주세요" />
          </div>

          <div class="input-group">
            <label for="password">비밀번호</label>
            <input type="password" id="password" placeholder="비밀번호를 입력해주세요" />
          </div>

          <div class="auto-login">
            <input type="checkbox" id="auto-login" />
            <label for="auto-login">자동로그인</label>
            <div style="flex-grow: 1"></div>
            <div>
              <span style="font-size: 14px; color: #666">아직 회원이 아니신가요?</span>
              <a
                href="#"
                style="font-size: 14px; color: #4caf50; font-weight: 600; margin-left: 5px"
                >회원가입</a
              >
            </div>
          </div>

          <button type="submit" class="login-btn">로그인</button>

          <div class="social-login">
            <button type="button" class="kakao-btn">
              <span class="kakao-icon">💬</span>
              카카오 로그인
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import AppHeader from '@/components/common/Header.vue'

export default {
  components: {
    AppHeader, // Header 컴포넌트를 등록
  },
  name: 'LoginPage',
  data() {
    return {
      email: '',
      password: '',
    }
  },
  methods: {
    async handleLogin() {
      try {
        const response = await axios.post('/member/login', {
          email: this.email,
          password: this.password,
        })
        console.log('Login successful:', response.data)
      } catch (error) {
        console.error('Login failed:', error)
      }
    },
  },
}
</script>

<style scoped>
.con {
  display: flex;
  height: 100%;
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
  width: 40%;
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

.login-btn:hover {
  background: #45a049;
}

.social-login {
  margin-top: 20px;
}

.kakao-btn {
  background: #fee500;
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
</style>
