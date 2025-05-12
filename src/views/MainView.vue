<template>
  <div class="main-container">
    <!-- 콘텐츠 영역 -->
    <div class="content-container">
      <!-- 왼쪽 사이드바 메뉴 -->
      <div class="sidebar">
        <div class="sidebar-content">
          <!-- 내 ZIP -->
          <div
            class="menu-item"
            :class="{ active: activeMenu === 'home' }"
            @click="activateMenu('home')"
          >
            <div class="menu-icon">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M9 22V12H15V22"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
            <span class="menu-text">내 ZIP</span>
          </div>

          <!-- 메뉴 찾기 -->
          <div
            class="menu-item"
            :class="{ active: activeMenu === 'search' }"
            @click="activateMenu('search')"
          >
            <div class="menu-icon">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M21 21L16.65 16.65"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
            <span class="menu-text">메뉴 찾기</span>
          </div>

          <!-- 매물 찾기 -->
          <div
            class="menu-item"
            :class="{ active: activeMenu === 'property' }"
            @click="activateMenu('property')"
          >
            <div class="menu-icon">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
            <span class="menu-text">매물 찾기</span>
          </div>

          <!-- 커뮤니티 -->
          <div
            class="menu-item"
            :class="{ active: activeMenu === 'community' }"
            @click="activateMenu('community')"
          >
            <div class="menu-icon">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
            <span class="menu-text">커뮤니티</span>
          </div>

          <!-- AI 챗봇 -->
          <div
            class="menu-item"
            :class="{ active: activeMenu === 'chatbot' }"
            @click="activateMenu('chatbot')"
          >
            <div class="menu-icon">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2Z"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M7 13.5C7.82843 13.5 8.5 12.8284 8.5 12C8.5 11.1716 7.82843 10.5 7 10.5C6.17157 10.5 5.5 11.1716 5.5 12C5.5 12.8284 6.17157 13.5 7 13.5Z"
                  fill="currentColor"
                />
                <path
                  d="M12 13.5C12.8284 13.5 13.5 12.8284 13.5 12C13.5 11.1716 12.8284 10.5 12 10.5C11.1716 10.5 10.5 11.1716 10.5 12C10.5 12.8284 11.1716 13.5 12 13.5Z"
                  fill="currentColor"
                />
                <path
                  d="M17 13.5C17.8284 13.5 18.5 12.8284 18.5 12C18.5 11.1716 17.8284 10.5 17 10.5C16.1716 10.5 15.5 11.1716 15.5 12C15.5 12.8284 16.1716 13.5 17 13.5Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <span class="menu-text">AI 챗봇</span>
          </div>

          <!-- 메뉴 -->
          <div
            class="menu-item"
            :class="{ active: activeMenu === 'menu' }"
            @click="activateMenu('menu')"
          >
            <div class="menu-icon">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3 12H21"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M3 6H21"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M3 18H21"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
            <span class="menu-text">메뉴</span>
          </div>

          <div class="menu-divider"></div>

          <!-- 내 프로필 -->
          <div
            class="menu-item"
            :class="{ active: activeMenu === 'profile' }"
            @click="activateMenu('profile')"
          >
            <div class="menu-icon">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
            <span class="menu-text">내 프로필</span>
          </div>

          <!-- 로그아웃 -->
          <div
            class="menu-item"
            :class="{ active: activeMenu === 'logout' }"
            @click="activateMenu('logout')"
          >
            <div class="menu-icon">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M16 17L21 12L16 7"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M21 12H9"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
            <span class="menu-text">로그아웃</span>
          </div>
        </div>
      </div>

      <!-- 지도 영역 -->
      <div class="map-container" ref="mapContainer"></div>

      <!-- 클릭 시 나타나는 새로운 화면 -->
      <div class="content-panel" :class="{ active: activeMenu !== '' }">
        <div class="panel-header">
          <button class="close-button" @click="closePanel">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18 6L6 18"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M6 6L18 18"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
          <h2>{{ getPanelTitle() }}</h2>
        </div>

        <div class="panel-content">
          <!-- 동적으로 컴포넌트 로드 -->
          <component :is="currentComponent" v-if="currentComponent"></component>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, shallowRef, onMounted, onUnmounted } from 'vue'

// 동적으로 로드할 컴포넌트들
import HomePanel from '@/components/panel/HomePanel.vue'
// import SearchPanel from './panels/SearchPanel.vue'
// import PropertyPanel from './panels/PropertyPanel.vue'
// import CommunityPanel from './panels/CommunityPanel.vue'
// import ChatbotPanel from './panels/ChatbotPanel.vue'
// import MenuPanel from './panels/MenuPanel.vue'
// import ProfilePanel from './panels/ProfilePanel.vue'
// import LogoutPanel from './panels/LogoutPanel.vue'

// 현재 선택된 메뉴 상태 관리
const activeMenu = ref('')
const sidebarExpanded = ref(false)

// 현재 활성화된 컴포넌트 (shallowRef를 사용하여 성능 최적화)
const currentComponent = shallowRef(null)

// 사이드바 메뉴 활성화 함수
const activateMenu = (menuName) => {
  // 이미 활성화된 메뉴를 다시 클릭하면 패널을 닫음
  if (activeMenu.value === menuName) {
    activeMenu.value = ''
    currentComponent.value = null
    return
  }

  activeMenu.value = menuName

  // 메뉴에 따른 컴포넌트 선택
  switch (menuName) {
    case 'home':
      currentComponent.value = HomePanel
      break
    // case 'search':
    //   currentComponent.value = SearchPanel
    //   break
    // case 'property':
    //   currentComponent.value = PropertyPanel
    //   break
    // case 'community':
    //   currentComponent.value = CommunityPanel
    //   break
    // case 'chatbot':
    //   currentComponent.value = ChatbotPanel
    //   break
    // case 'menu':
    //   currentComponent.value = MenuPanel
    //   break
    // case 'profile':
    //   currentComponent.value = ProfilePanel
    //   break
    // case 'logout':
    //   currentComponent.value = LogoutPanel
    //   break
    default:
      currentComponent.value = null
  }
}

// 패널 닫기
const closePanel = () => {
  activeMenu.value = ''
  currentComponent.value = null
}

// 패널 제목 가져오기
const getPanelTitle = () => {
  switch (activeMenu.value) {
    case 'home':
      return '내 ZIP'
    case 'search':
      return '메뉴 찾기'
    case 'property':
      return '매물 찾기'
    case 'community':
      return '커뮤니티'
    case 'chatbot':
      return 'AI 챗봇'
    case 'menu':
      return '메뉴'
    case 'profile':
      return '내 프로필'
    case 'logout':
      return '로그아웃'
    default:
      return ''
  }
}

// 카카오 지도 관련 변수
const mapContainer = ref(null)
let kakaoMap = null

// 지도 초기화 함수
const initializeMap = () => {
  if (window.kakao && window.kakao.maps) {
    // 지도 생성
    const options = {
      center: new window.kakao.maps.LatLng(37.5665, 126.978), // 서울 중심 좌표
      level: 5, // 확대 레벨
    }

    kakaoMap = new window.kakao.maps.Map(mapContainer.value, options)

    // 지도 크기 변경 시 리사이즈 이벤트 처리
    window.kakao.maps.event.addListener(kakaoMap, 'idle', () => {
      kakaoMap.relayout()
    })
  }
}

// 카카오 맵 스크립트 로드 함수
const loadKakaoMapScript = () => {
  return new Promise((resolve) => {
    if (window.kakao && window.kakao.maps) {
      resolve()
      return
    }

    const script = document.createElement('script')
    const apiKey = import.meta.env.VITE_KAKAO_MAP_API_KEY
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&autoload=false`
    script.onload = () => {
      window.kakao.maps.load(() => {
        resolve()
      })
    }
    document.head.appendChild(script)
  })
}

// 컴포넌트 마운트 시 지도 초기화
onMounted(async () => {
  try {
    await loadKakaoMapScript()
    initializeMap()

    // 윈도우 리사이즈 이벤트 처리
    const handleResize = () => {
      if (kakaoMap) {
        kakaoMap.relayout()
      }
    }

    window.addEventListener('resize', handleResize)

    // 언마운트 시 이벤트 리스너 제거
    onUnmounted(() => {
      window.removeEventListener('resize', handleResize)
    })
  } catch (error) {
    console.error('카카오 지도 로드 중 오류 발생:', error)
  }
})
</script>

<style scoped>
/* 기본 스타일 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* 전체 컨테이너 */
.main-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
}

/* 콘텐츠 영역 */
.content-container {
  display: flex;
  flex: 1;
  position: relative;
  overflow: hidden;
}

/* 사이드바 스타일 */
.sidebar {
  width: 80px; /* 더 얇은 사이드바 */
  height: 100%;
  background-color: white;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  z-index: 100;
  overflow-y: auto;
  transition: all 0.3s ease;
  padding: 16px 0;
}

.sidebar-content {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.menu-item {
  display: flex;
  flex-direction: column; /* 아이콘 아래에 텍스트 표시 */
  align-items: center;
  justify-content: center;
  padding: 12px 0;
  margin: 4px 0;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #666;
}

.menu-item:hover {
  background-color: rgba(76, 175, 80, 0.1);
  color: #4caf50;
}

.menu-item.active {
  background-color: rgba(76, 175, 80, 0.15);
  color: #4caf50;
}

.menu-icon {
  margin-bottom: 6px; /* 아이콘과 텍스트 사이 간격 */
  display: flex;
  align-items: center;
  justify-content: center;
}

.menu-text {
  font-size: 12px;
  font-weight: 500;
  text-align: center;
}

.menu-divider {
  height: 1px;
  background-color: #eee;
  margin: 12px 8px;
}

/* 지도 컨테이너 */
.map-container {
  flex: 1;
  height: 100%;
  background-color: #f8f8f8;
}

/* 콘텐츠 패널 */
.content-panel {
  position: absolute;
  top: 0;
  right: 0;
  width: 380px;
  height: 100%;
  background-color: white;
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
  transform: translateX(100%);
  transition: transform 0.3s ease;
  z-index: 90;
  display: flex;
  flex-direction: column;
}

.content-panel.active {
  transform: translateX(0);
}

.panel-header {
  display: flex;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #eee;
}

.close-button {
  background: none;
  border: none;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  cursor: pointer;
  color: #666;
  border-radius: 50%;
  transition: background-color 0.2s ease;
}

.close-button:hover {
  background-color: #f5f5f5;
}

.panel-header h2 {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.panel-content {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
}

/* 반응형 스타일 */
@media (max-width: 768px) {
  .content-panel {
    width: calc(100% - 80px);
  }
}
</style>
