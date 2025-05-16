<!-- Home.vue -->
<template>
  <AppHeader />
  <div class="body">
    <!-- 히어로 섹션 -->

    <section class="hero">
      <div class="hero-content">
        <div class="hero-text">
          <h1 class="main-title">ZIPZIP</h1>
          <div class="text-animation">
            <span class="animated-text">faster</span>
            <span class="animated-text">smarter</span>
            <span class="animated-text">whatever you wish</span>
          </div>
          <p class="sub-title">당신의 완벽한 주거공간을 찾아드립니다</p>
        </div>
      </div>
    </section>

    <!-- 메인 콘텐츠 섹션 -->
    <section class="main-content">
      <div class="right-panel">
        <div class="searchHome">
          <h2 class="question">어떤 집을 찾고 계세요?</h2>
          <div class="search-bar">
            <!-- <div class="input-container">
              <img src="@/assets/search-icon.png" alt="Search" class="search-input-icon" />
              <input
                type="text"
                placeholder="지역, 지하철, 대학, 단지명 또는 매물번호를 입력해주세요."
              />
            </div> -->
            <button class="search-btn" @click="activateButton('main')">
              집 찾으러 가기 <span class="arrow">→</span>
            </button>
          </div>
        </div>
        <!-- 서비스 소개 섹션 -->
        <div class="service-section">
          <div class="service-header">
            <h2 class="section-title">Our Services</h2>
            <p class="service-description">
              <span class="highlight">zipzip</span>의 서비스와 함께 빠르고 똑똑하게,<br />
              원하는 조건의 매물을 만나보세요.
            </p>
          </div>

          <!-- 서비스 카드 -->
          <div class="service-cards">
            <div class="service-card" @click="activateButton('community')">
              <div class="card-icon">
                <div class="icon-circle">
                  <img src="@/assets/communityIcon.png" alt="Neighborhood Icon" />
                </div>
              </div>
              <div class="card-content">
                <h4 class="card-title">동네 탐방하기</h4>
                <p class="card-description">우리 동네 리뷰 쓰고<br />다른 동네 탐방 하기</p>
              </div>
              <div class="card-arrow">→</div>
            </div>

            <div class="service-card" @click="activateButton('chatbot')">
              <div class="card-icon">
                <div class="icon-circle ai-bg">
                  <img src="@/assets/chatbotIcon.png" alt="AI Icon" class="ai-icon" />
                </div>
              </div>
              <div class="card-content">
                <h4 class="card-title">AI 부동산 중개사</h4>
                <p class="card-description">
                  AI 챗봇과 함께 자신에게<br />맞는 매물을 탐색해보세요
                </p>
              </div>
              <div class="card-arrow">→</div>
            </div>

            <div class="service-card" @click="activateButton('news')">
              <div class="card-icon">
                <div class="icon-circle news-bg">
                  <img src="@/assets/newsIcon.png" alt="News Icon" class="news-icon" />
                </div>
              </div>
              <div class="card-content">
                <h4 class="card-title">부동산 기사</h4>
                <p class="card-description">
                  AI 요약과 함께 원하는<br />동네의 최신 소식을 살펴보세요
                </p>
              </div>
              <div class="card-arrow">→</div>
            </div>
          </div>
        </div>
      </div>
      <!-- 푸터 섹션 -->
      <div class="footer-section">
        <div class="social-links">
          <a href="https://github.com/soyuuuuuni" class="social-link">Soyeon</a>
          <a href="https://github.com/MinjuKwak01" class="social-link">Minju</a>
          <a href="https://github.com/SSAFY-HOME" class="social-link">GitHub</a>
        </div>
        <p class="copyright">© 2025 ZIPZIP. All rights reserved.</p>
      </div>
    </section>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import AppHeader from '@/components/common/AppHeader.vue'
const router = useRouter()

const activateButton = (name) => {
  switch (name) {
    case 'main':
      router.push('/main')
      break
    case 'community':
      router.push('/main')
      break
    case 'chatbot':
      router.push('/chat')
      break
    case 'news':
      router.push('/news')
      break
  }
}
</script>
<script>
export default {
  name: 'Home',
  methods: {
    scrollToContent() {
      const mainContent = document.querySelector('.main-content')
      mainContent.scrollIntoView({ behavior: 'smooth' })
    },
  },
}
</script>

<style lang="scss" scoped>
.body {
  background-color: black;
}
.hero {
  height: 100vh;
  width: 50%;
  position: relative;
  background-image:
    linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('@/assets/building.jpg'); //left panel background image를 넣어줘야함!!
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  .hero-content {
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: white;
  }

  .hero-text {
    text-align: center;

    .main-title {
      font-size: 5rem;
      font-weight: 700;
      letter-spacing: 0.5rem;
      margin-bottom: 2rem;
      opacity: 0;
      animation: fadeInUp 1s ease forwards;
    }

    .text-animation {
      height: 50px;
      margin-bottom: 2rem;
      overflow: hidden;
      position: relative;

      .animated-text {
        display: block;
        font-size: 2rem;
        font-weight: 300;
        letter-spacing: 0.3rem;
        position: absolute;
        width: 100%;
        text-align: center;
        opacity: 0;
        animation: rotateWords 9s linear infinite 0s;

        &:nth-child(2) {
          animation-delay: 3s;
        }

        &:nth-child(3) {
          animation-delay: 6s;
        }
      }
    }

    .sub-title {
      font-size: 1.5rem;
      letter-spacing: 0.2rem;
      opacity: 0;
      animation: fadeInUp 1s ease forwards 0.5s;
    }
  }
}
/* 메인 콘텐츠 섹션 스타일 */
.main-content {
  color: white;
  padding: 5rem 0rem;
  width: 45%;
  position: absolute;
  right: 0;
  top: 0;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;

  .right-panel {
    margin-top: 1rem;
    background: #010502;
    width: 90%;
    max-width: 100%;
    height: 80vh;
    border-radius: 15px;
    padding: 5rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .searchHome {
    text-align: center;
    margin-bottom: 2rem;

    .question {
      font-size: 2.3rem;
      font-weight: bold;
      margin-bottom: 2rem;
    }

    .search-bar {
      display: flex;
      flex-direction: column;
      width: 90%;
      align-items: center;
      gap: 1rem;

      .input-container {
        position: relative;
        width: 100%;
        margin-bottom: 1rem;

        .search-input-icon {
          position: absolute;
          left: 15px;
          top: 50%;
          transform: translateY(-50%);
          width: 18px;
          height: 18px;
        }

        input {
          width: 100%;
          padding: 0.75rem 1rem 0.75rem 2.5rem;
          font-size: 0.9rem;
          border-radius: 5px;
          border: none;
          outline: none;
        }
      }

      .search-btn {
        background-color: #4a80b5;
        color: white;
        font-weight: 600;
        padding: 0.6rem 1.5rem;
        border-radius: 15px;
        border: none;
        cursor: pointer;
        font-size: 1.2rem;
        display: flex;
        align-items: center;
        justify-content: center;
        stroke-width: 1px;
        stroke: #a3a3a3;
        filter: drop-shadow(0px 4px 4px rgba(255, 239, 239, 0.2));

        .arrow {
          margin-left: 0.5rem;
        }
      }
    }
  }

  /* 서비스 섹션 */
  .service-section {
    margin-bottom: 3rem;

    .service-header {
      margin-bottom: 2rem;

      .section-title {
        text-align: right;
        font-size: 2.2rem;
        font-weight: 700;
        margin-bottom: 1rem;
        letter-spacing: -0.5px;
      }

      .service-description {
        text-align: right;
        font-size: 1.1rem;
        color: rgba(255, 255, 255, 0.8);
        line-height: 1.5;

        .highlight {
          color: #5ea658;
          font-weight: 600;
        }
      }
    }

    .service-cards {
      display: flex;
      flex-direction: column;
      gap: 1.2rem;
    }

    .service-card {
      background-color: rgba(255, 255, 255, 0.05);
      border-radius: 12px;
      padding: 1.5rem;
      display: flex;
      align-items: center;
      transition: all 0.3s ease;
      cursor: pointer;
      border: 1px solid rgba(255, 255, 255, 0.1);

      &:hover {
        background-color: rgba(255, 255, 255, 0.1);
        transform: translateY(-3px);
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
      }

      .card-icon {
        margin-right: 1.5rem;

        .icon-circle {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background-color: #5d8864;
          display: flex;
          align-items: center;
          justify-content: center;

          img {
            width: 30px;
            height: 30px;
          }

          &.ai-bg {
            background-color: #4a80b5;
          }

          &.news-bg {
            background-color: #b55a4a;
          }

          .ai-icon,
          .news-icon {
            width: 28px;
            height: 28px;
          }
        }
      }

      .card-content {
        flex: 1;

        .card-title {
          font-size: 1.2rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .card-description {
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.7);
          line-height: 1.5;
        }
      }

      .card-arrow {
        font-size: 1.5rem;
        color: rgba(255, 255, 255, 0.5);
        transition: transform 0.3s ease;
      }

      &:hover .card-arrow {
        transform: translateX(5px);
        color: white;
      }
    }
  }

  /* 푸터 섹션 */
  .footer-section {
    margin-top: auto;
    padding: 2rem 0;
    border-top: 1px solid rgba(255, 255, 255, 0.1);

    .social-links {
      display: flex;
      gap: 1.5rem;
      margin-bottom: 1rem;

      .social-link {
        color: rgba(255, 255, 255, 0.6);
        font-size: 0.9rem;
        text-decoration: none;
        transition: all 0.3s ease;

        &:hover {
          color: #5ea658;
        }
      }
    }

    .copyright {
      font-size: 0.8rem;
      color: rgba(255, 255, 255, 0.4);
    }
  }
}
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes rotateWords {
  0% {
    opacity: 0;
    transform: translateY(50%);
  }
  2% {
    opacity: 0;
    transform: translateY(50%);
  }
  5% {
    opacity: 1;
    transform: translateY(0);
  }
  30% {
    opacity: 1;
    transform: translateY(0);
  }
  33% {
    opacity: 0;
    transform: translateY(-50%);
  }
  80% {
    opacity: 0;
  }
  100% {
    opacity: 0;
  }
}

@keyframes bounce {
  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-30px);
  }
  60% {
    transform: translateY(-15px);
  }
}

// .main-content {
//   background: #f8f9fa;
//   padding: 5rem 2rem;
// }

// 반응형 디자인
@media (max-width: 768px) {
  .hero {
    .hero-text {
      .main-title {
        font-size: 3rem;
      }

      .text-animation .animated-text {
        font-size: 1.8rem;
      }

      .sub-title {
        font-size: 1.2rem;
      }
    }
  }
}
</style>
