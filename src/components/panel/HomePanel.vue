<template>
  <div v-if="!isLoggedIn" class="login-required-container">
    <div class="login-icon">
      <img src="@/assets/toLogin-icon.png" alt="toLogin Icon" class="toLogin-icon" />
    </div>
    <h2 class="login-title">로그인이 필요합니다</h2>
    <p class="login-message">서비스를 이용하려면 로그인해주세요.</p>
    <button class="login-button" @click="goToLogin">로그인 하기</button>
  </div>

  <div v-else class="myhome-wrapper">
    <!-- 탭 네비게이션 -->
    <nav class="tab-nav">
      <button class="tab-btn" :class="{ active: activeTab === 'info' }" @click="selectTab('info')">
        마이홈
      </button>
      <button
        class="tab-btn"
        :class="{ active: activeTab === 'wishlist' }"
        @click="selectTab('wishlist')"
      >
        위시리스트
      </button>
    </nav>

    <div class="tab-container">
      <!-- 마이홈 -->
      <div v-if="activeTab === 'info'" class="info-tab">
        <div class="section-card">
          <h3 class="section-title">우리집 정보</h3>
          <div class="apt-card">
            <h4 class="apt-name">
              {{ memberStore.apartment.name || memberStore.apartment.apartmentName }}
            </h4>
            <p class="apt-addr">
              {{ memberStore.apartment.addr || memberStore.apartment.address }}
            </p>
            <p class="apt-meta">{{ memberStore.apartment.buildYear }}년 준공</p>
          </div>
          <ApartmentDetailChart v-if="apartment" :aptSeq="memberStore.apartment.aptSeq" />
        </div>
      </div>

      <!-- 위시리스트 -->
      <div v-else-if="activeTab === 'wishlist'" class="wishlist-tab">
        <h3 class="section-title">위시리스트</h3>
        <div v-if="favoriteApartments.length > 0" class="wishlist-grid">
          <div
            class="apt-card"
            v-for="apartment in favoriteApartments"
            :key="apartment.id"
            :class="{ selected: selectedApartmentId === apartment.id }"
          >
            <div class="like-btn" @click.stop="toggleLike(apartment)">
              {{ isLiked(apartment) ? '❤️' : '🤍' }}
            </div>
            <div>
              <h4 class="apt-name">{{ apartment.name }}</h4>
              <p class="apt-addr">{{ apartment.addr }}</p>
              <p class="apt-meta">{{ apartment.buildYear }}년 준공</p>
            </div>
            <button class="view-btn" @click.stop="viewListings(apartment)">📋 매물 보기</button>
          </div>
        </div>
        <div v-else class="empty-wishlist">
          <p>💡 관심 매물이 없습니다.<br />마음에 드는 집에 하트를 눌러 추가해보세요.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useMemberStore } from '@/stores/user'
import ApartmentDetailChart from '@/components/chart/ApartmentDetailChart.vue'
import { memberAPI } from '@/api/member'

const router = useRouter()
const memberStore = useMemberStore()
const isLoggedIn = computed(() => !!memberStore.accessToken)
const selectedApartment = ref(null)
// 🔥 props 추가 - 부모 컴포넌트의 activeMenu 감지
const props = defineProps({
  activeMenu: {
    type: String,
    default: '',
  },
})

const activeTab = ref('info')
const apartment = ref(null)
const favoriteApartments = ref([])
const selectedApartmentId = ref(null)
const isViewingListings = ref(false)

// 🔥 이벤트에 hide-listings 추가
const emit = defineEmits(['showOnMap', 'view-listings', 'hide-listings', 'close-panel'])

const goToLogin = () => router.push('/login')

// 🔥 탭 변경 시 패널 닫기 기능 추가
const selectTab = async (tab) => {
  // 탭이 변경될 때 매물 패널 닫기
  if (activeTab.value !== tab) {
    hideListings()
  }

  activeTab.value = tab
  if (tab === 'wishlist') await fetchFavoriteApartments()
}

const fetchFavoriteApartments = async () => {
  try {
    const res = await memberAPI.getFavoriteApartments()
    console.table(res.data)
    favoriteApartments.value = res.data
  } catch (e) {
    console.error('위시리스트 로딩 오류', e)
  }
}

// 🔥 매물 패널 닫기 함수
const hideListings = () => {
  isViewingListings.value = false
  selectedApartmentId.value = null
  emit('hide-listings')
}

const viewListings = (apt) => {
  selectedApartment.value = apt
  selectedApartmentId.value = apt.id
  isViewingListings.value = true
  emit('view-listings', apt)
}

import { apartmentAPI } from '@/api/apartment'

const isLiked = (apartment) => {
  return favoriteApartments.value.some((fav) => fav.aptSeq === apartment.aptSeq)
}

const toggleLike = async (apartment) => {
  // 현재 좋아요 상태 확인
  const currentlyLiked = favoriteApartments.value.some((fav) => fav.aptSeq === apartment.aptSeq)

  try {
    if (currentlyLiked) {
      // 좋아요 취소
      await apartmentAPI.unlikeApartment(apartment.aptSeq)

      // 즉시 UI에서 제거 (낙관적 업데이트)
      favoriteApartments.value = favoriteApartments.value.filter(
        (fav) => fav.aptSeq !== apartment.aptSeq,
      )
    } else {
      // 좋아요 추가
      await apartmentAPI.likeApartment(apartment.aptSeq)

      // 위시리스트 새로고침
      await fetchFavoriteApartments()
    }
  } catch (error) {
    console.error('좋아요 처리 실패:', error)

    // 실패 시 위시리스트 다시 불러와서 정확한 상태로 복원
    await fetchFavoriteApartments()
  }
}

// 🔥 외부에서 호출 가능한 메서드들을 expose
defineExpose({
  hideListings,
  closePanel: hideListings, // ContentPanel과 동일한 인터페이스 제공
})

// 🔥 부모 컴포넌트의 activeMenu 변경 감지
watch(
  () => props.activeMenu,
  (newMenu, oldMenu) => {
    // 다른 메뉴로 변경되었을 때 매물 패널 닫기
    if (newMenu !== oldMenu && newMenu !== 'profile') {
      hideListings()
    }
  },
)

onMounted(() => {
  apartment.value = {
    aptSeq: memberStore.apartment.aptSeq,
    name: memberStore.apartment.apartmentName,
    dong: memberStore.apartment.address,
  }
  if (activeTab.value === 'wishlist') fetchFavoriteApartments()
})
</script>

<style scoped>
.login-overlay {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

/* 로그인이 필요한 경우 스타일 */
.login-required-container {
  background-color: white;
  border-radius: 12px;
  width: 100%;
  max-width: 500px;
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  box-shadow: 0 4px 5px rgba(0, 0, 0, 0.08);
  animation: fadeIn 0.5s ease;
}

.login-icon {
  margin-bottom: 20px;
  color: #888;
}

.toLogin-icon {
  height: 200px;
  width: 200px;
  transition: transform 0.3s ease;
}

.login-icon:hover .toLogin-icon {
  transform: scale(1.05);
}

.login-title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
}

.login-message {
  font-size: 16px;
  color: #666;
  margin-bottom: 30px;
}

.login-button {
  padding: 14px 34px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(76, 175, 80, 0.3);
}

.login-button:hover {
  background-color: #388e3c;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.4);
}

.login-button:active {
  transform: translateY(0);
}

.myhome-wrapper {
  position: relative;
  background: #f7fafd;
  min-height: 100vh;
  padding-bottom: 40px;
}

.tab-nav {
  display: flex;
  justify-content: center;
  background: white;
  border-bottom: 1px solid #ddd;
  position: sticky;
  top: 0;
  z-index: 10;
}

.tab-btn {
  flex: 1;
  padding: 16px;
  background: none;
  border: none;
  font-size: 16px;
  font-weight: 600;
  color: #666;
  cursor: pointer;
  transition: all 0.3s;
}

.tab-btn.active {
  color: #388e3c;
  border-bottom: 3px solid #4caf50;
}

.tab-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 24px;
}

.section-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.section-title {
  font-size: 20px;
  font-weight: 700;
  color: #333;
  margin-bottom: 20px;
}

.apt-card {
  background: #f5fff5;
  border: 1px solid #c6ddd4;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 16px;
  position: relative;
  transition: 0.3s;
}

.apt-card.selected {
  border: 2px solid #abc0b1;
  background: #c7e0d1;
}

.apt-name {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.apt-addr,
.apt-meta {
  font-size: 14px;
  color: #666;
}

.like-btn {
  position: absolute;
  top: 12px;
  right: 16px;
  cursor: pointer;
  font-size: 18px;
}

.view-btn {
  margin-top: 12px;
  padding: 8px 16px;
  border-radius: 24px;
  background: #618a72;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s;
}

.view-btn:hover {
  background: #00c9fe;
}

/* 🔥 활성 상태의 매물 보기 버튼 스타일 */
.view-btn.active {
  background: #ff6b6b;
  transform: scale(1.02);
}

.view-btn.active:hover {
  background: #ff5252;
}

.wishlist-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.empty-wishlist {
  padding: 60px 20px;
  text-align: center;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  color: #777;
  font-size: 15px;
  max-width: 400px;
  margin: 40px auto 0;
}
</style>
