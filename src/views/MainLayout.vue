// MainLayout.vue
<template>
  <div class="main-container">
    <!-- 콘텐츠 영역 -->
    <div class="content-container">
      <!-- 사이드바 컴포넌트 -->
      <Sidebar
        :active-menu="activeMenu"
        :is-logged-in="isLoggedIn"
        @activate-menu="activateMenu"
        @login="login"
        @logout="logout"
      />

      <!-- 지도 컴포넌트 -->
      <KakaoMap ref="kakaoMapRef" />

      <!-- 컨텐츠 패널 컴포넌트 -->
      <ContentPanel
        :active-menu="activeMenu"
        :current-component="currentComponent"
        @close-panel="closePanel"
        @show-on-map="handleShowOnMap"
        @show-all-on-map="handleShowAllOnMap"
      />
    </div>

    <!-- 로그아웃 모달 -->
    <LogoutModal :is-visible="isLogoutModalVisible" :message="logoutMessage" @close="closeLogout" />
  </div>
</template>

<script setup>
import { ref, shallowRef, onMounted } from 'vue'
import { useRouter } from 'vue-router'

// 컴포넌트 임포트
import Sidebar from '@/components/common/AppSidebar.vue'
import KakaoMap from '@/components/common/KakaoMap.vue'
import ContentPanel from '@/components/common/ContentPanel.vue'
import LogoutModal from '@/components/modal/LogoutModal.vue'

// 패널 컴포넌트 임포트
import HomePanel from '@/components/panel/HomePanel.vue'
import PropertySearchPanel from '@/components/panel/PropertySearchPanel.vue'
// 필요에 따라 다른 패널 컴포넌트 임포트
// import SearchPanel from '@/components/panel/SearchPanel.vue'
// import CommunityPanel from '@/components/panel/CommunityPanel.vue'
// import ChatbotPanel from '@/components/panel/ChatbotPanel.vue'
// import MenuPanel from '@/components/panel/MenuPanel.vue'
import MyPagePanel from '@/components/panel/MyPagePanel.vue'

// 라우터 설정
const router = useRouter()

// 상태 관리
const activeMenu = ref('')
const isLoggedIn = ref(false)
const isLogoutModalVisible = ref(false)
const logoutMessage = ref('')
const currentComponent = shallowRef(null)
const kakaoMapRef = ref(null)

// 로그인 상태 확인
const checkLoginStatus = () => {
  const token = localStorage.getItem('accessToken')
  isLoggedIn.value = !!token
}

// 메뉴 활성화 함수
const activateMenu = (menuName) => {
  // 이미 활성화된 메뉴를 다시 클릭하면 패널을 닫음
  if (activeMenu.value === menuName) {
    // 패널을 닫을 때 지도의 마커 제거
    if (kakaoMapRef.value) {
      kakaoMapRef.value.clearMarkers()
    }
    activeMenu.value = ''
    currentComponent.value = null
    return
  }

  // 다른 메뉴로 전환할 때 기존 마커 제거
  if (activeMenu.value !== '' && kakaoMapRef.value) {
    kakaoMapRef.value.clearMarkers()
  }

  activeMenu.value = menuName

  // 메뉴에 따른 컴포넌트 선택
  switch (menuName) {
    case 'home':
      currentComponent.value = HomePanel
      break
    case 'property':
      currentComponent.value = PropertySearchPanel
      break
    // 필요에 따라 다른 케이스 추가
    // case 'search':
    //   currentComponent.value = SearchPanel
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
    case 'profile':
      currentComponent.value = MyPagePanel
      break
    default:
      currentComponent.value = null
  }
}

// 로그인 함수
const login = () => {
  router.push('/login')
}

// 로그아웃 함수
const logout = () => {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('isAdmin')
  logoutMessage.value = '로그아웃이 완료되었습니다'
  isLogoutModalVisible.value = true
  isLoggedIn.value = false
}

// 로그아웃 모달 닫기
const closeLogout = () => {
  isLogoutModalVisible.value = false
}

// 패널 닫기
const closePanel = () => {
  if (activeMenu.value === 'profile' && kakaoMapRef.value) {
    // 지도에서 모든 마커 제거하고 초기 상태로 복원
    kakaoMapRef.value.clearMarkers()
  }
  activeMenu.value = ''
  currentComponent.value = null
}

// 지도 관련 핸들러
const handleShowOnMap = (apartmentInfo) => {
  kakaoMapRef.value.showApartmentOnMap(apartmentInfo)
}

const handleShowAllOnMap = (apartments) => {
  kakaoMapRef.value.showMultipleApartmentsOnMap(apartments)
}

// 컴포넌트 마운트 시 실행
onMounted(() => {
  checkLoginStatus()
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

/* 반응형 스타일 */
@media (max-width: 768px) {
  .content-panel {
    width: calc(100% - 80px);
  }
}
</style>
