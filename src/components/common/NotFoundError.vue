<template>
  <AppHeader />
  <div class="error-page-container">
    <div class="error-content">
      <!-- 404 아이콘/일러스트 -->
      <div class="error-icon">
        <svg
          width="120"
          height="120"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="12" cy="12" r="10" stroke="#4caf50" stroke-width="2" />
          <path d="M16 16L8 8" stroke="#4caf50" stroke-width="2" />
          <path d="M8 16L16 8" stroke="#4caf50" stroke-width="2" />
        </svg>
      </div>

      <!-- 404 텍스트 -->
      <div class="error-number">404</div>

      <!-- 에러 메시지 -->
      <h1 class="error-title">페이지를 찾을 수 없습니다</h1>
      <p class="error-description">
        요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.<br />
        주소를 다시 확인해주세요.
      </p>

      <!-- 액션 버튼들 -->
      <div class="error-actions">
        <button class="home-button" @click="goHome">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z"
              stroke="white"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M9 22V12H15V22"
              stroke="white"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          홈으로 가기
        </button>

        <button class="back-button" @click="goBack">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 12H5"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M12 19L5 12L12 5"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          이전 페이지
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import AppHeader from '@/components/common/Header.vue'

const router = useRouter()

// 홈으로 이동
const goHome = () => {
  router.push('/')
}

// 이전 페이지로 이동
const goBack = () => {
  // 이전 페이지가 있으면 뒤로가기, 없으면 홈으로
  if (window.history.length > 1) {
    router.go(-1)
  } else {
    router.push('/')
  }
}
</script>

<style scoped>
.error-page-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 60px 20px;
  font-family:
    'Pretendard',
    'Apple SD Gothic Neo',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    Oxygen,
    Ubuntu,
    Cantarell,
    'Open Sans',
    'Helvetica Neue',
    sans-serif;
  min-height: calc(100vh - 200px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.error-content {
  text-align: center;
  max-width: 600px;
  width: 100%;
}

.error-icon {
  margin-bottom: 24px;
  opacity: 0.8;
}

.error-number {
  font-size: 120px;
  font-weight: 700;
  color: #4caf50;
  line-height: 1;
  margin-bottom: 16px;
  text-shadow: 0 4px 8px rgba(76, 175, 80, 0.2);
}

.error-title {
  font-size: 32px;
  font-weight: 700;
  color: #333;
  margin-bottom: 16px;
  position: relative;
  padding-bottom: 15px;
  display: inline-block;
}

.error-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 3px;
  background-color: #4caf50;
  border-radius: 2px;
}

.error-description {
  font-size: 16px;
  color: #666;
  line-height: 1.6;
  margin-bottom: 40px;
}

.error-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-bottom: 40px;
  flex-wrap: wrap;
}

.home-button {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 8px rgba(76, 175, 80, 0.3);
}

.home-button:hover {
  background-color: #43a047;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.4);
}

.back-button {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: white;
  color: #4caf50;
  border: 1px solid #4caf50;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.back-button:hover {
  background-color: #4caf50;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
}

.help-section {
  padding-top: 24px;
  border-top: 1px solid #eee;
}

.help-title {
  font-size: 16px;
  color: #666;
  margin-bottom: 12px;
  font-weight: 500;
}

.help-links {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
}

.help-link {
  color: #4caf50;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.2s;
}

.help-link:hover {
  color: #43a047;
  text-decoration: underline;
}

.help-divider {
  color: #ccc;
  font-size: 12px;
}

@media (max-width: 768px) {
  .error-page-container {
    padding: 40px 16px;
  }

  .error-number {
    font-size: 80px;
  }

  .error-title {
    font-size: 24px;
  }

  .error-description {
    font-size: 14px;
  }

  .error-actions {
    flex-direction: column;
    align-items: center;
  }

  .home-button,
  .back-button {
    width: 200px;
    justify-content: center;
  }

  .help-links {
    flex-direction: column;
    gap: 8px;
  }

  .help-divider {
    display: none;
  }
}

.error-icon svg {
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%,
  20%,
  53%,
  80%,
  100% {
    transform: translateY(0);
  }
  40%,
  43% {
    transform: translateY(-10px);
  }
  70% {
    transform: translateY(-5px);
  }
  90% {
    transform: translateY(-2px);
  }
}
</style>
