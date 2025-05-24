<template>
  <div v-if="!isLoggedIn" class="login-overlay">
    <div class="login-container">
      <img src="@/assets/toLogin-icon.png" alt="login" class="login-icon" />
      <h2 class="login-title">로그인이 필요합니다</h2>
      <p class="login-message">맞춤형 부동산 서비스를 이용하려면 로그인하세요</p>
      <button class="login-button" @click="goToLogin">로그인 하기</button>
    </div>
  </div>

  <div v-else class="myhome-wrapper">
    <!-- 탭 네비게이션 -->
    <nav class="tab-nav">
      <button class="tab-btn" :class="{ active: activeTab === 'info' }" @click="selectTab('info')">
         마이홈
      </button>
      <button class="tab-btn" :class="{ active: activeTab === 'wishlist' }" @click="selectTab('wishlist')">
         위시리스트
      </button>
    </nav>

    <div class="tab-container">
      <!-- 마이홈 -->
      <div v-if="activeTab === 'info'" class="info-tab">
        <div class="section-card">
          <h3 class="section-title">우리집 정보</h3>
          <div class="apt-card">
            <h4 class="apt-name">{{ memberStore.apartment.apartmentName }}</h4>
            <p class="apt-addr">{{ memberStore.apartment.address }}</p>
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
              {{ apartment.likedApt ? '❤️' : '🤍' }}
            </div>
            <div @click="showOnMap(apartment)">
              <h4 class="apt-name">{{ apartment.name }}</h4>
              <p class="apt-addr">{{ apartment.addr }}</p>
              <p class="apt-meta">{{ apartment.buildYear }}년 준공</p>
            </div>
            <button class="view-btn" @click.stop="viewListings(apartment)">
              📋 매물 보기
            </button>
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
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useMemberStore } from '@/stores/user'
import ApartmentDetailChart from '@/components/chart/ApartmentDetailChart.vue'
import { apartmentAPI } from '@/api/apartment'
import { memberAPI } from '@/api/member'

const router = useRouter()
const memberStore = useMemberStore()
const isLoggedIn = computed(() => !!memberStore.accessToken)

const activeTab = ref('info')
const apartment = ref(null)
const favoriteApartments = ref([])
const selectedApartmentId = ref(null)

const emit = defineEmits(['showOnMap', 'view-listings'])

const goToLogin = () => router.push('/login')

const selectTab = async (tab) => {
  activeTab.value = tab
  if (tab === 'wishlist') await fetchFavoriteApartments()
}

const fetchFavoriteApartments = async () => {
  try {
    const res = await memberAPI.getFavoriteApartments()
    favoriteApartments.value = res.data
  } catch (e) {
    console.error('위시리스트 로딩 오류', e)
  }
}

const toggleLike = async (apt) => {
  try {
    if (apt.likedApt) {
      await apartmentAPI.unlikeApartment(apt.aptSeq)
      apt.likedApt = false
    } else {
      await apartmentAPI.likeApartment(apt.aptSeq)
      apt.likedApt = true
    }
  } catch (e) {
    alert('좋아요 처리 중 오류 발생')
  }
}

const showOnMap = (apt) => {
  selectedApartmentId.value = apt.id
  emit('showOnMap', {
    latitude: apt.latitude,
    longitude: apt.longitude,
    name: apt.name,
    price: apt.price,
    id: apt.id,
  })
}

const viewListings = (apt) => {
  selectedApartmentId.value = apt.id
  emit('view-listings', apt)
}

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
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.login-container {
  background: white;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  text-align: center;
  max-width: 400px;
  width: 90%;
}

.login-icon {
  width: 100px;
  margin-bottom: 20px;
}

.login-title {
  font-size: 22px;
  font-weight: bold;
  color: #333;
}

.login-message {
  font-size: 14px;
  color: #666;
  margin: 10px 0 20px;
}

.login-button {
  padding: 12px 24px;
  background: #4facfe;
  color: white;
  border: none;
  border-radius: 24px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s;
}

.login-button:hover {
  background: #00c9fe;
}

.myhome-wrapper {
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
  color: #4facfe;
  border-bottom: 3px solid #4facfe;
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
  background: #e2e9e2;
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
  transition: 0.3s;
}

.view-btn:hover {
  background: #00c9fe;
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