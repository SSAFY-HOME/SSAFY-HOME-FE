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

      <!-- 컨텐츠 패널 컴포넌트 -->
      <ContentPanel
        :active-menu="activeMenu"
        :current-component="currentComponent"
        :highlighted-id="highlightedId"
        @close-panel="closePanel"
        @show-on-map="handleShowOnMap"
        @show-all-on-map="handleShowAllOnMap"
        @view-listings="handleViewListings"
        @view-commerces="handleViewCommerces"
      />

      <CommunityPanel v-if="activeMenu === 'community'" @view-post-detail="handleViewPostDetail" />

      <!-- DealPanel 추가 -->
      <DealPanel
        :isVisible="isListingPanelVisible"
        :apartment="selectedApartment"
        @close="closeListingPanel"
      />

      <!-- CommercePanel 추가 -->
      <CommercePanel
        :is-visible="isCommercePanelVisible"
        :province="selectedLocation.province"
        :city="selectedLocation.city"
        :district="selectedLocation.district"
        :district-id="selectedLocation.districtId"
        @close="closeCommercePanel"
        @showOnMap="handleShowOnMap"
        @showAllOnMap="handleShowCommercesOnMap"
      />

      <KakaoMap ref="kakaoMapRef" @show-on-map="handleShowOnMap" />
    </div>

    <!-- 로그아웃 모달 -->
    <LogoutModal :is-visible="isLogoutModalVisible" :message="logoutMessage" @close="closeLogout" />
  </div>
</template>

<script setup>
import { ref, shallowRef, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'

// 컴포넌트 임포트
import Sidebar from '@/components/common/AppSidebar.vue'
import KakaoMap from '@/components/common/KakaoMap.vue'
import ContentPanel from '@/components/common/ContentPanel.vue'
import LogoutModal from '@/components/modal/LogoutModal.vue'
import DealPanel from '@/components/panel/DealPanel.vue'
import CommercePanel from '@/components/panel/CommercePanel.vue'

// 패널 컴포넌트 임포트
import HomePanel from '@/components/panel/HomePanel.vue'
import PropertySearchPanel from '@/components/panel/PropertySearchPanel.vue'
// import SearchPanel from '@/components/panel/SearchPanel.vue'
import CommunityPanel from '@/components/panel/CommunityPanel.vue'
import ChatRoomPanel from '@/components/panel/ChatRoomPanel.vue'
// import ChatbotPanel from '@/components/panel/ChatbotPanel.vue'
// import MenuPanel from '@/components/panel/MenuPanel.vue'

// 라우터 설정
const router = useRouter()

// 상태 관리
const activeMenu = ref('')
const isLoggedIn = ref(false)
const isLogoutModalVisible = ref(false)
const logoutMessage = ref('')
const currentComponent = shallowRef(null)
const kakaoMapRef = ref(null)
const highlightedId = ref(null)

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
    // ListingPanel과 CommercePanel도 닫기
    isListingPanelVisible.value = false
    isCommercePanelVisible.value = false
    activeMenu.value = ''
    currentComponent.value = null

    return
  }

  //다른 메뉴로 전환할 때 기존 마커 제거
  if (activeMenu.value !== '' && kakaoMapRef.value) {
    kakaoMapRef.value.clearMarkers()
    // ListingPanel도 함께 닫기
    isListingPanelVisible.value = false
    isCommercePanelVisible.value = false
  }

  activeMenu.value = menuName
  console.log('활성화된 메뉴:', menuName)

  // 메뉴에 따른 컴포넌트 선택
  switch (menuName) {
    case 'home':
      currentComponent.value = HomePanel
      break
    case 'property':
      currentComponent.value = PropertySearchPanel
      break
    // 필요에 따라 다른 케이스 추가
    case 'community':
      currentComponent.value = CommunityPanel
      break
    case 'chatbot':
      currentComponent.value = ChatRoomPanel
      break
    // case 'menu':
    //   currentComponent.value = MenuPanel
    //   break
    // case 'profile':
    //   currentComponent.value = MyPagePanel
    //   break
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
  router.push('/login')
}

// DealPanel 관련 상태 관리
const isListingPanelVisible = ref(false)
const selectedApartment = ref(null)

// DealPanel 관련 함수
const handleViewListings = (apartment) => {
  selectedApartment.value = apartment
  isListingPanelVisible.value = true

  console.log(isCommercePanelVisible.value)

  // 상권 패널이 열려있으면 닫기
  if (isCommercePanelVisible.value) {
    isCommercePanelVisible.value = false
  }
  // 선택된 아파트를 지도에서 강조 표시
  if (kakaoMapRef.value) {
    handleShowOnMap({
      latitude: apartment.latitude,
      longitude: apartment.longitude,
      name: apartment.name,
      id: apartment.id,
      avgPrice: apartment.avgPrice,
      addr: apartment.addr,
      buildYear: apartment.buildYear,
      aptSeq: apartment.aptSeq,
      highlight: true, // 강조 표시 옵션 추가
    })
  }
}

// 상권 정보를 지도에 표시하는 핸들러
const handleShowCommercesOnMap = (commerces) => {
  if (kakaoMapRef.value) {
    // 먼저 모든 기존 마커 제거
    kakaoMapRef.value.clearMarkers()

    // 상권 마커만 표시
    kakaoMapRef.value.showMultipleCommercesOnMap(commerces)
  }
}

// Commerce Panel 관련 상태 관리
const isCommercePanelVisible = ref(false)
const selectedLocation = ref({
  province: '',
  city: '',
  district: '',
  districtId: '',
})

const closeListingPanel = () => {
  isListingPanelVisible.value = false
}

const closeCommercePanel = () => {
  isCommercePanelVisible.value = false
}

// 패널 닫기
const closePanel = () => {
  if (activeMenu.value === 'profile' && kakaoMapRef.value) {
    // 지도에서 모든 마커 제거하고 초기 상태로 복원
    kakaoMapRef.value.clearMarkers()
  }
  activeMenu.value = ''
  currentComponent.value = null

  isListingPanelVisible.value = false
  isCommercePanelVisible.value = false
}

// 지도 관련 핸들러
const handleShowOnMap = async (apartmentInfo) => {
  console.log('[MainLayout] showOnMap 받음 → ID:', apartmentInfo.id)
  isListingPanelVisible.value = true

  highlightedId.value = apartmentInfo.id
  kakaoMapRef.value.showApartmentOnMap(apartmentInfo)
}

const handleShowAllOnMap = (apartments) => {
  kakaoMapRef.value.showMultipleApartmentsOnMap(apartments)
}

// CommercePanel 관련 함수
const handleViewCommerces = (locationInfo) => {
  console.log('주변 상권 보기 요청:', locationInfo)
  selectedLocation.value = locationInfo
  isCommercePanelVisible.value = true
}

// PropertySearchPanel이 아파트가 선택 해제될 때 알 수 있도록 감시자 추가
watch(isListingPanelVisible, (newValue) => {
  // 매물 패널이 닫힐 때 선택된 아파트 정보 초기화
  if (!newValue) {
    selectedApartment.value = null
  }
})
import { useRoute } from 'vue-router'
const route = useRoute()
// 컴포넌트 마운트 시 실행
onMounted(() => {
  checkLoginStatus()
  const menuFromQuery = route.query.menu
  if (menuFromQuery) {
    activeMenu.value = menuFromQuery
  }
})
watch(
  () => route.query.menu,
  (newMenu) => {
    if (newMenu) {
      activateMenu(newMenu)
    }
  },
  { immediate: true },
)
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
