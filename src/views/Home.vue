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
            <button class="search-btn" @click="activateButton('property')">
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
            <div class="service-card community-card" @click="activateButton('community')">
              <div class="card-icon">
                <div class="icon-circle community-bg">
                  <img src="@/assets/communityIcon.png" alt="Neighborhood Icon" />
                </div>
              </div>
              <div class="card-content">
                <h4 class="card-title">동네 탐방하기</h4>
                <p class="card-description">우리 동네 리뷰 쓰고<br />다른 동네 탐방 하기</p>
              </div>
              <div class="card-arrow">→</div>
            </div>

            <div class="service-card ai-card" @click="activateButton('chatbot')">
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

            <div class="service-card news-card" @click="activateButton('news')">
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



        <!-- 푸터 섹션 -->
        <div class="footer-section">
          <div class="social-links">
            <a href="https://github.com/soyuuuuuni" class="social-link">Soyeon</a>
            <a href="https://github.com/MinjuKwak01" class="social-link">Minju</a>
            <a href="https://github.com/SSAFY-HOME" class="social-link">GitHub</a>
          </div>
          <p class="copyright">© 2025 ZIPZIP. All rights reserved.</p>
        </div>
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
      router.push({ path: '/main', query: { menu: 'community' } })
      break
    case 'property':
      router.push({ path: '/main', query: { menu: 'property' } })
      break
    case 'chatbot':
      router.push({ path: '/main', query: { menu: 'chatbot' } })
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
    linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('@/assets/building.jpg');
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
    padding: 3rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow-y: auto;

    &::-webkit-scrollbar {
      width: 6px;
    }

    &::-webkit-scrollbar-track {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 3px;
    }

    &::-webkit-scrollbar-thumb {
      background: rgba(76, 87, 76, 0.6);
      border-radius: 3px;
      
      &:hover {
        background: rgba(117, 141, 115, 0.8);
      }
    }
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
        transition: all 0.3s ease;

        &:hover {
          background-color: #5a90c5;
          transform: translateY(-2px);
          filter: drop-shadow(0px 6px 8px rgba(255, 239, 239, 0.3));
        }

        .arrow {
          margin-left: 0.5rem;
          transition: transform 0.3s ease;
        }

        &:hover .arrow {
          transform: translateX(3px);
        }
      }
    }
  }

  /* 서비스 섹션 */
  .service-section {
    flex: 1;
    display: flex;
    flex-direction: column;

    .service-header {
      margin-bottom: 2rem;

      .section-title {
        text-align: right;
        font-size: clamp(1.5rem, 4vw, 2.5rem);
        font-weight: 700;
        margin-bottom: 1rem;
        letter-spacing: -0.5px;
      }

      .service-description {
        text-align: right;
        font-size: clamp(0.6rem, 2vw, 1.2rem);
        color: rgba(255, 255, 255, 0.8);
        line-height: 1.6;
        font-weight: 300;

        .highlight {
          color: #5ea658;
          font-weight: 600;
          text-shadow: 0 0 10px rgba(94, 166, 88, 0.3);
        }
      }
    }

    .service-cards {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      flex: 1;
    }

    .service-card {
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(10px);
      border-radius: 16px;
      padding: 1.5rem;
      display: flex;
      align-items: center;
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      cursor: pointer;
      border: 1px solid rgba(255, 255, 255, 0.1);
      position: relative;
      overflow: hidden;

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
        transition: left 0.6s;
      }

      &:hover {
        background: rgba(255, 255, 255, 0.1);
        transform: translateY(-3px) scale(1.02);
        box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
        border-color: rgba(255, 255, 255, 0.2);

        &::before {
          left: 100%;
        }
      }

      &.community-card:hover {
        box-shadow: 0 15px 35px rgba(94, 166, 88, 0.2);
      }

      &.ai-card:hover {
        box-shadow: 0 15px 35px rgba(74, 128, 181, 0.2);
      }

      &.news-card:hover {
        box-shadow: 0 15px 35px rgba(181, 90, 74, 0.2);
      }

      .card-icon {
        margin-right: 1.5rem;
        flex-shrink: 0;

        .icon-circle {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;

          &::before {
            content: '';
            position: absolute;
            inset: 0;
            border-radius: 50%;
            padding: 2px;
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.2), transparent);
            mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            mask-composite: exclude;
          }

          img {
            width: 28px;
            height: 28px;
            transition: transform 0.3s ease;
          }

          &.community-bg {
            background: linear-gradient(135deg, #5ea658, #4a7850);
          }

          &.ai-bg {
            background: linear-gradient(135deg, #4a80b5, #2d5aa0);
          }

          &.news-bg {
            background: linear-gradient(135deg, #b55a4a, #8a342c);
          }
        }
      }

      &:hover .icon-circle {
        transform: scale(1.1) rotate(5deg);

        img {
          transform: scale(1.1);
        }
      }

      .card-content {
        flex: 1;
        color: white;

        .card-title {
          font-size: clamp(1rem, 2.5vw, 1.3rem);
          font-weight: 700;
          margin-bottom: 0.5rem;
          letter-spacing: -0.3px;
        }

        .card-description {
          font-size: clamp(0.8rem, 2vw, 1rem);
          color: rgba(255, 255, 255, 0.7);
          line-height: 1.5;
          font-weight: 300;
        }
      }

      .card-arrow {
        font-size: 1.5rem;
        color: rgba(255, 255, 255, 0.5);
        transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        flex-shrink: 0;
      }

      &:hover .card-arrow {
        transform: translateX(8px) scale(1.2);
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

/* 반응형 디자인 */
@media (max-width: 1200px) {
  .hero {
    width: 55%;
  }
  
  .main-content {
    width: 45%;
    
    .right-panel {
      padding: 2.5rem;
    }
    
    .searchHome .question {
      font-size: 2rem;
    }
    
    .service-section .service-header .section-title {
      font-size: 2rem;
    }
  }
}

@media (max-width: 968px) {
  .hero {
    width: 100%;
    height: 50vh;
    position: relative;
    
    .hero-text {
      .main-title {
        font-size: 4rem;
      }
      
      .text-animation .animated-text {
        font-size: 1.8rem;
      }
      
      .sub-title {
        font-size: 1.3rem;
      }
    }
  }

  .main-content {
    position: relative;
    top: auto;
    right: auto;
    width: 100%;
    height: auto;
    padding: 0;
    
    .right-panel {
      width: 100%;
      margin: 0;
      border-radius: 0;
      padding: 2rem;
      min-height: 60vh;
    }
    
    .searchHome {
      .question {
        font-size: 1.8rem;
      }
    }
    
    .service-section {
      .service-header {
        text-align: center;
        
        .section-title {
          text-align: center;
          font-size: 1.8rem;
        }
        
        .service-description {
          text-align: center;
        }
      }
    }
  }
}

@media (max-width: 640px) {
  .hero {
    height: 40vh;
    
    .hero-text {
      .main-title {
        font-size: 3rem;
        margin-bottom: 1.5rem;
      }
      
      .text-animation {
        height: 40px;
        margin-bottom: 1.5rem;
        
        .animated-text {
          font-size: 1.5rem;
        }
      }
      
      .sub-title {
        font-size: 1.1rem;
      }
    }
  }

  .main-content {
    .right-panel {
      padding: 1.5rem;
    }
    
    .searchHome {
      .question {
        font-size: 1.5rem;
        margin-bottom: 1.5rem;
      }
      
      .search-bar .search-btn {
        font-size: 1.1rem;
        padding: 0.8rem 1.2rem;
      }
    }
    
    .service-section {
      .service-header {
        .section-title {
          font-size: 1.6rem;
        }
        
        .service-description {
          font-size: 1rem;
        }
      }
      
      .service-cards {
        gap: 1rem;
      }
      
      .service-card {
        padding: 1.2rem;
        
        .card-icon {
          margin-right: 1rem;
          
          .icon-circle {
            width: 50px;
            height: 50px;
            
            img {
              width: 25px;
              height: 25px;
            }
          }
        }
        
        .card-content {
          .card-title {
            font-size: 1.1rem;
          }
          
          .card-description {
            font-size: 0.85rem;
          }
        }
      }
    }
  }
}

@media (max-width: 480px) {
  .hero {
    height: 35vh;
    
    .hero-text {
      .main-title {
        font-size: 2.5rem;
        letter-spacing: 0.3rem;
      }
      
      .text-animation .animated-text {
        font-size: 1.3rem;
        letter-spacing: 0.2rem;
      }
      
      .sub-title {
        font-size: 1rem;
        letter-spacing: 0.1rem;
      }
    }
  }

  .main-content {
    .right-panel {
      padding: 1rem;
    }
    
    .searchHome {
      .question {
        font-size: 1.3rem;
      }
      
      .search-bar .search-btn {
        font-size: 1rem;
        padding: 0.7rem 1rem;
      }
    }
    
    .service-section {
      .service-header {
        .section-title {
          font-size: 1.4rem;
        }
        
        .service-description {
          font-size: 0.9rem;
        }
      }
      
      .service-card {
        padding: 1rem;
        
        .card-icon {
          .icon-circle {
            width: 45px;
            height: 45px;
            
            img {
              width: 22px;
              height: 22px;
            }
          }
        }
        
        .card-content {
          .card-title {
            font-size: 1rem;
          }
          
          .card-description {
            font-size: 0.8rem;
          }
        }
      }
    }
    
    .footer-section {
      .social-links {
        gap: 1rem;
      }
    }
  }
}
</style>