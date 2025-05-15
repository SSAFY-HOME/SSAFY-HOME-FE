<template>
  <div class="commerce-panel" :class="{ active: isVisible }">
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
      <h2 class="panel-title">{{ district }} 주변 상권</h2>
    </div>

    <div class="panel-content">
      <div class="location-summary" v-if="district">
        <div class="summary-header">
          <h3 class="summary-title">{{ district }} 주변 상권 정보</h3>
          <p class="summary-address">{{ province }} {{ city }}</p>
        </div>
      </div>

      <div class="commerce-filter">
        <div class="filter-header">
          <h4>카테고리 필터</h4>
        </div>
        <div class="filter-options">
          <button
            v-for="category in commerceCategories"
            :key="category.id"
            :class="['category-button', { active: category.id === selectedCategory }]"
            @click="filterByCategory(category.id)"
          >
            {{ category.name }}
          </button>
        </div>
      </div>

      <div class="loading-indicator" v-if="isLoadingCommerces">
        <div class="spinner"></div>
        <p>상권 정보를 불러오는 중...</p>
      </div>

      <div
        class="no-results"
        v-if="commerces.length === 0 && !isLoadingCommerces && commerceSearchPerformed"
      >
        <p>주변 상권 정보가 없습니다.</p>
        <p class="no-results-sub">다른 지역으로 검색해보세요.</p>
      </div>

      <div class="commerce-list" v-if="commerces.length > 0">
        <div
          class="commerce-card"
          v-for="commerce in filteredCommerces"
          :key="commerce.id"
          @click="showCommerceOnMap(commerce)"
          :class="{ 'selected-commerce': selectedCommerceId === commerce.id }"
        >
          <div class="commerce-info">
            <div class="commerce-category">{{ commerce.category_name }}</div>
            <h3 class="commerce-name">{{ commerce.place_name }}</h3>
            <p class="commerce-address">{{ commerce.address_name }}</p>
            <div class="commerce-details">
              <span class="detail-item" v-if="commerce.phone">☎️ {{ commerce.phone }}</span>
              <span class="detail-item" v-if="commerce.distance">🚶 {{ commerce.distance }}m</span>
            </div>
            <div class="commerce-actions">
              <a class="commerce-link" :href="commerce.place_url" target="_blank" @click.stop>
                상세정보 보기
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'

// Props 정의
const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false,
  },
  province: {
    type: String,
    default: '',
  },
  city: {
    type: String,
    default: '',
  },
  district: {
    type: String,
    default: '',
  },
  districtId: {
    // String과 Number 둘 다 허용하도록
    type: [String, Number],
    default: '',
  },
})

// 이벤트 정의
const emit = defineEmits(['close', 'showOnMap', 'showAllOnMap', 'showCommerceOnMap'])

// 상태 관리
const commerces = ref([])
const selectedCategory = ref('')
const filteredCommerces = computed(() => {
  if (!selectedCategory.value) return commerces.value
  return commerces.value.filter(
    (commerce) =>
      commerce.category_group_code === selectedCategory.value ||
      commerce.category_name.includes(getCategoryNameById(selectedCategory.value)),
  )
})

const isLoadingCommerces = ref(false)
const commerceSearchPerformed = ref(false)
const selectedCommerceId = ref(null)

// 상권 카테고리 정의
const commerceCategories = ref([
  { id: '', name: '전체' },
  { id: 'MT1', name: '대형마트' },
  { id: 'CS2', name: '편의점' },
  { id: 'PS3', name: '어린이집, 유치원' },
  { id: 'SC4', name: '학교' },
  { id: 'AC5', name: '학원' },
  { id: 'PK6', name: '주차장' },
  { id: 'OL7', name: '주유소, 충전소' },
  { id: 'SW8', name: '지하철역' },
  { id: 'BK9', name: '은행' },
  { id: 'CT1', name: '문화시설' },
  { id: 'AG2', name: '중개업소' },
  { id: 'PO3', name: '공공기관' },
  { id: 'AT4', name: '관광명소' },
  { id: 'AD5', name: '숙박' },
  { id: 'FD6', name: '음식점' },
  { id: 'CE7', name: '카페' },
  { id: 'HP8', name: '병원' },
  { id: 'PM9', name: '약국' },
])

// 카테고리 ID로 이름 가져오기
const getCategoryNameById = (id) => {
  const category = commerceCategories.value.find((cat) => cat.id === id)
  return category ? category.name : ''
}

// 패널 닫기
const closePanel = () => {
  emit('close')
}

import { kakaoAPI } from '@/api/commerce'

// 주변 상권 검색 함수
const fetchNearbyCommerces = async (keyword, category) => {
  if (!props.district) return

  isLoadingCommerces.value = true
  commerceSearchPerformed.value = true

  try {
    // API 호출
    const result = await kakaoAPI.searchNearbyCommerces({
      city: props.city,
      district: props.district,
      keyword: keyword || '',
      categoryGroupCode: category || '',
    })
    console.log('상권정보api호출', result.data)

    // 응답 처리
    if (result.status === 200) {
      commerces.value = result.data

      // 지도에 상권 위치 표시
      emit('showAllOnMap', commerces.value)
    } else {
      console.error('주변 상권 검색 중 오류:', result.message)
      commerces.value.data = []
    }
  } catch (error) {
    console.error('주변 상권 데이터를 불러오는 중 오류가 발생했습니다:', error)
    commerces.value = []
  } finally {
    isLoadingCommerces.value = false
  }
}

// 카테고리별 필터링
const filterByCategory = (categoryId) => {
  selectedCategory.value = categoryId

  // 카테고리가 전체가 아닌 경우 해당 카테고리로 다시 검색
  if (categoryId) {
    fetchNearbyCommerces('', categoryId)
  } else {
    fetchNearbyCommerces()
  }
}

// 상권 지도에 표시
const showCommerceOnMap = (commerce) => {
  selectedCommerceId.value = commerce.id

  // 부모 컴포넌트로 상권 위치 정보 전달
  emit('showOnMap', {
    latitude: commerce.y, // 위도
    longitude: commerce.x, // 경도
    name: commerce.place_name,
    category: commerce.category_name,
    id: commerce.id,
    isCommerce: true,
  })
}

// props 변경 시 상권 정보 다시 불러오기
watch(
  () => [props.isVisible, props.district],
  ([newVisible, newDistrict]) => {
    if (newVisible && newDistrict) {
      fetchNearbyCommerces()
    }
  },
  { immediate: true },
)

onMounted(() => {
  if (props.isVisible && props.district) {
    fetchNearbyCommerces()
  }
})
</script>

<style scoped>
.commerce-panel {
  width: 0;
  height: 100%;
  position: absolute;
  top: 0;
  left: 490px; /* property-panel 옆에 배치 */
  background-color: white;
  box-shadow: -1px 0 10px rgba(0, 0, 0, 0.1);
  transition: width 0.3s ease;
  overflow: hidden;
  z-index: 96; /* listing-panel(95)보다 높게 설정 */
  display: flex;
  flex-direction: column;
}

.commerce-panel.active {
  width: 410px;
}

.panel-header {
  display: flex;
  align-items: center;
  padding: 14px;
  border-bottom: 1px solid #eee;
  background-color: #485941;
  color: white;
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
  color: white;
  border-radius: 50%;
  transition: background-color 0.2s ease;
}

.close-button:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.panel-title {
  font-size: 16px;
  font-weight: 600;
  color: white;
  flex-grow: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.panel-content {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
}

/* 위치 요약 정보 */
.location-summary {
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.summary-header {
  margin-bottom: 10px;
}

.summary-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.summary-address {
  font-size: 13px;
  color: #666;
}

/* 필터 영역 */
.commerce-filter {
  margin-bottom: 20px;
  padding: 12px;
  background-color: #f9f9f9;
  border-radius: 6px;
}

.filter-header {
  margin-bottom: 12px;
}

.filter-header h4 {
  font-size: 14px;
  font-weight: 600;
  color: #444;
  margin: 0;
}

.filter-options {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.category-button {
  padding: 6px 12px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 20px;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s ease;
}

.category-button:hover {
  border-color: #4caf50;
  color: #4caf50;
}

.category-button.active {
  background-color: #4caf50;
  color: #fff;
  border-color: #4caf50;
}

/* 로딩 인디케이터 */
.loading-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
}

.spinner {
  width: 30px;
  height: 30px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #4caf50;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.loading-indicator p {
  margin-top: 12px;
  color: #666;
  font-size: 14px;
}

/* 결과 없음 메시지 */
.no-results {
  text-align: center;
  padding: 40px 0;
  color: #666;
}

.no-results-sub {
  font-size: 13px;
  color: #888;
  margin-top: 8px;
}

/* 상권 목록 */
.commerce-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.commerce-card {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    border-color 0.3s ease;
  cursor: pointer;
  border: 2px solid transparent;
  padding: 12px;
}

.commerce-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.commerce-card.selected-commerce {
  border-color: #4caf50;
  background-color: #f0fff6;
  box-shadow: 0 4px 12px rgba(33, 150, 243, 0.2);
}

.commerce-category {
  display: inline-block;
  background-color: #caecbd;
  color: #2a2a2a;
  font-size: 12px;
  padding: 3px 8px;
  border-radius: 4px;
  margin-bottom: 6px;
}

.commerce-name {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 4px 0;
  color: #333;
}

.commerce-address {
  font-size: 13px;
  color: #666;
  margin: 0 0 8px 0;
}

.commerce-details {
  display: flex;
  gap: 8px;
  margin-bottom: 10px;
  flex-wrap: wrap;
}

.detail-item {
  font-size: 12px;
  background-color: #f5f5f5;
  padding: 4px 8px;
  border-radius: 4px;
  color: #555;
}

.commerce-actions {
  text-align: right;
}

.commerce-link {
  display: inline-block;
  color: #485941;
  text-decoration: none;
  font-size: 13px;
  font-weight: 500;
  transition: color 0.2s ease;
}

.commerce-link:hover {
  color: #4caf50;
  text-decoration: underline;
}

/* 모바일 화면 대응 */
@media (max-width: 768px) {
  .commerce-panel.active {
    width: 100%;
    left: 80px;
  }
}
</style>
