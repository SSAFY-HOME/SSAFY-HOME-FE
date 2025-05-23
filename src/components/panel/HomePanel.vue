<template>
  <div v-if="!isLoggedIn" class="login-required-container">
    <div class="login-icon">
      <img src="@/assets/toLogin-icon.png" alt="toLogin Icon" class="toLogin-icon" />
    </div>
    <h2 class="login-title">로그인이 필요합니다</h2>
    <p class="login-message">프로필 정보를 확인하려면 로그인해주세요.</p>
    <button class="login-button" @click="goToLogin">로그인 하기</button>
  </div>

  <div v-else class="myhome-panel">
    <!-- 탭 메뉴 -->
    <div class="myhome-tabs">
      <button
        class="tab-button"
        :class="{ active: activeTab === 'info' }"
        @click="activeTab = 'info'"
      >
        <i class="fas fa-user"></i> 마이홈
      </button>

      <button
        class="tab-button"
        :class="{ active: activeTab === 'wishlist' }"
        @click="activeTab = 'wishlist'"
      >
        <i class="fas fa-heart"></i> 위시리스트
      </button>
    </div>

    <!-- 탭 컨텐츠 -->
    <div class="tab-content">
      <!-- 마이홈 탭 -->
      <div v-if="activeTab === 'info'" class="info-content">
        <!-- 우리집 정보 -->
        <div class="my-apartment-info">
          <h3>우리집 정보</h3>

          <!-- 아파트 카드 -->
          <div class="apartment-card">
            <div class="apartment-name">{{ memberStore.apartment.apartmentName }}</div>
            <div class="apartment-detail">{{ memberStore.apartment.address }}</div>
            <div class="apartment-detail">{{ memberStore.apartment.buildYear }}년 준공</div>
          </div>

          <!-- 시세 정보 -->
          <ApartmentDetailChart v-if="apartment" :aptSeq="memberStore.apartment.aptSeq" />
        </div>
      </div>

      <!-- 위시리스트 탭 -->
      <div v-else-if="activeTab === 'wishlist'" class="wishlist-content">
        <h2>WishList</h2>
        <div v-if="favoriteApartments.length > 0" class="favorites-list">
          <div v-for="apt in favoriteApartments" :key="apt.id" class="favorite-item">
            <div class="favorite-info">
              <p class="favorite-name">{{ apt.name }}</p>
              <p class="favorite-address">{{ apt.addr }}</p>
            </div>
          </div>
        </div>
        <div v-else class="empty-wishlist">
          <i class="fas fa-heart-o"></i>
          <p>아직 위시리스트에 추가된 매물이 없습니다.</p>
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
const memberStore = useMemberStore()
import { memberAPI } from '@/api/member'
const isLoggedIn = computed(() => !!memberStore.accessToken)
// 반응형 데이터
const activeTab = ref('info')
const apartment = ref(null)
const favoriteApartments = ref([])
const router = useRouter()
const goToLogin = () => router.push('/login')
// 아파트 정보
onMounted(() => {
  apartment.value = {
    aptSeq: memberStore.apartment.aptSeq,
    name: memberStore.apartment.apartmentName,
    dong: memberStore.apartment.address,
  }
  checkLoginStatus()
})

const checkLoginStatus = () => {
  const token = memberStore.accessToken
  isLoggedIn.value = !!token
  if (isLoggedIn.value) {
    fetchFavoriteApartments()
  }
}
const fetchFavoriteApartments = async () => {
  try {
    const response = await memberAPI.getFavoriteApartments()
    if (response && response.data) {
      favoriteApartments.value = response.data
    }
  } catch (error) {
    console.error('관심 아파트 가져오기 오류:', error)
  }
}
</script>

<style scoped>
.myhome-panel {
  min-height: 100vh;
  background-color: #f8f9fa;
}

/* 탭 메뉴 */
.myhome-tabs {
  display: flex;
  border-bottom: 1px solid #e0e0e0;
  background-color: white;
  position: sticky;
  top: 0;
  z-index: 10;
}

.tab-button {
  flex: 1;
  padding: 15px 0;
  border: none;
  background-color: transparent;
  font-size: 15px;
  font-weight: 500;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
  border-bottom: 2px solid transparent;
}

.tab-button:hover {
  color: #4caf50;
}

.tab-button.active {
  color: #4caf50;
  border-bottom: 2px solid #4caf50;
}

.tab-button i {
  margin-right: 6px;
}

/* 탭 컨텐츠 */
.tab-content {
  padding: 20px;
}

/* 마이홈 컨텐츠 */
.my-apartment-info h3 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 15px;
  color: #333;
}

.apartment-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.apartment-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 5px;
}

.apartment-detail {
  font-size: 14px;
  color: #666;
}

/* 시세 정보 */
.price-section {
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.price-section h4 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 15px;
  color: #333;
}

.price-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin-bottom: 15px;
}

.price-item {
  padding: 15px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: #fafafa;
}

.price-label {
  font-size: 12px;
  color: #666;
  margin-bottom: 5px;
  padding: 2px 8px;
  background: #f0f0f0;
  border-radius: 4px;
  display: inline-block;
}

.price-value {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 3px;
}

.price-date {
  font-size: 12px;
  color: #999;
  margin-bottom: 5px;
}

.price-change {
  font-size: 12px;
  font-weight: 500;
}

.price-change.up {
  color: #e53e3e;
}

.price-change.down {
  color: #3182ce;
}

.source-info {
  font-size: 11px;
  color: #999;
  text-align: center;
  border-top: 1px solid #e0e0e0;
  padding-top: 10px;
}

/* 차트 섹션 */
.chart-section {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
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

/* 위시리스트 */
.wishlist-content {
  text-align: center;
  padding: 0px 20px;
}

.favorites-list {
  display: grid;
  gap: 16px;
  max-width: 600px;
  margin: 0 auto;
}

.favorite-item {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.06);
  border: 1px solid #f1f5f9;
  transition: all 0.3s ease;
  cursor: pointer;
}

.favorite-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  border-color: #e2e8f0;
}

.favorite-info {
  text-align: left;
}

.favorite-name {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 4px;
}

.favorite-address {
  font-size: 14px;
  color: #64748b;
  margin: 0;
}

.empty-wishlist {
  background: white;
  padding: 60px 40px;
  border-radius: 20px;
  box-shadow: 0 4px 25px rgba(0, 0, 0, 0.08);
  max-width: 400px;
  margin: 0 auto;
}

.empty-wishlist i {
  font-size: 64px;
  color: #cbd5e1;
  margin-bottom: 25px;
  display: block;
}

.empty-wishlist p {
  color: #64748b;
  font-size: 16px;
  font-weight: 500;
  line-height: 1.6;
  margin: 0;
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .myhome-panel {
    padding: 15px;
  }

  .login-required-container {
    padding: 40px 25px;
    max-width: 350px;
  }

  .login-title {
    font-size: 24px;
  }

  .tab-content {
    padding: 20px 15px;
  }

  .apartment-card {
    padding: 20px;
  }

  .apartment-name {
    font-size: 18px;
  }

  .tab-button {
    padding: 15px 0;
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .login-required-container {
    padding: 30px 20px;
  }

  .toLogin-icon {
    height: 100px;
    width: 100px;
  }

  .login-title {
    font-size: 22px;
  }

  .login-message {
    font-size: 15px;
  }

  .login-button {
    padding: 14px 30px;
    font-size: 15px;
  }
}
</style>
