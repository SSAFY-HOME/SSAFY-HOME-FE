// ListingPanel.vue - 매물 리스트 조회 패널
<template>
  <div class="listing-panel" :class="{ active: isVisible }">
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
      <h2 class="panel-title">{{ apartment ? apartment.name : '' }} 매물 리스트</h2>
    </div>

    <div class="panel-content">
      <div class="apartment-summary" v-if="apartment">
        <div class="summary-header">
          <h3 class="summary-title">{{ apartment.name }}</h3>
          <p class="summary-address">{{ apartment.addr }}</p>
        </div>
        <div class="summary-details">
          <span class="detail-tag">{{ apartment.buildYear }}년 준공</span>
          <span class="detail-tag">{{ listings.length }}개 매물</span>
        </div>
      </div>

      <div class="filters">
        <div class="filter-header">
          <h4>필터</h4>
          <div class="sort-control">
            <label for="sort-select">정렬:</label>
            <select id="sort-select" v-model="sortOption">
              <option value="date_desc">최신 거래순</option>
              <option value="date_asc">오래된 거래순</option>
              <option value="price_desc">가격 높은순</option>
              <option value="price_asc">가격 낮은순</option>
              <option value="floor_desc">층수 높은순</option>
              <option value="floor_asc">층수 낮은순</option>
            </select>
          </div>
        </div>

        <div class="date-filter">
          <label>거래 시기:</label>
          <div class="date-filter-options">
            <div
              v-for="period in datePeriods"
              :key="period.value"
              :class="['period-option', { active: selectedPeriod === period.value }]"
              @click="selectedPeriod = period.value"
            >
              {{ period.label }}
            </div>
          </div>
        </div>
      </div>

      <!-- 로딩 인디케이터 -->
      <div class="loading-indicator" v-if="isLoading">
        <div class="spinner"></div>
        <p>매물 정보를 불러오는 중...</p>
      </div>

      <!-- 결과 없음 메시지 -->
      <div class="no-results" v-if="!isLoading && filteredListings.length === 0">
        <p>검색 조건에 맞는 매물이 없습니다.</p>
        <p class="sub-text">필터를 변경하여 다시 검색해보세요.</p>
      </div>

      <!-- 매물 리스트 -->
      <div class="listings-container" v-if="!isLoading && filteredListings.length > 0">
        <table class="listings-table">
          <thead>
            <tr>
              <th>거래일</th>
              <th>가격</th>
              <th>층수</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="listing in filteredListings"
              :key="`${listing.year}-${listing.month}-${listing.day}-${listing.floor}`"
              class="listing-row"
            >
              <td class="date-cell">
                <span class="date-value"
                  >{{ listing.year }}.{{ formatNumber(listing.month) }}.{{
                    formatNumber(listing.day)
                  }}</span
                >
              </td>
              <td class="price-cell">
                <span class="price-value">{{ formatPrice(listing.price) }}</span>
              </td>
              <td class="floor-cell">
                <span class="floor-value">{{ listing.floor }}층</span>
              </td>
            </tr>
          </tbody>
        </table>
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
  apartment: {
    type: Object,
    default: null,
  },
})

// 이벤트 정의
const emit = defineEmits(['close'])

// 상태 관리
const isLoading = ref(true)
const listings = ref([])
const sortOption = ref('date_desc')
const selectedPeriod = ref('all')

// 날짜 필터 옵션
const datePeriods = [
  { value: 'all', label: '전체' },
  { value: '1m', label: '1개월' },
  { value: '3m', label: '3개월' },
  { value: '6m', label: '6개월' },
  { value: '1y', label: '1년' },
]

// 매물 데이터 가져오기 (실제 구현에서는 API 호출)
const fetchListings = async () => {
  isLoading.value = true

  try {
    // 실제 구현에서는 API 호출
    // const response = await fetch(`/api/apartments/${props.apartment.id}/listings`);
    // listings.value = await response.json();

    // 샘플 데이터
    setTimeout(() => {
      listings.value = generateSampleListings()
      isLoading.value = false
    }, 800)
  } catch (error) {
    console.error('매물 정보를 불러오는 중 오류가 발생했습니다:', error)
    listings.value = []
  } finally {
    isLoading.value = false
  }
}

// 샘플 데이터 생성 함수 (실제 구현에서는 제거)
// const generateSampleListings = () => {
//   const result = []
//   const currentDate = new Date()
//   const currentYear = currentDate.getFullYear()
//   const currentMonth = currentDate.getMonth() + 1

//   // 랜덤 매물 20개 생성
//   for (let i = 0; i < 20; i++) {
//     // 랜덤 날짜 (최근 2년 이내)
//     const monthsAgo = Math.floor(Math.random() * 24)
//     const date = new Date()
//     date.setMonth(date.getMonth() - monthsAgo)

//     const year = date.getFullYear()
//     const month = date.getMonth() + 1
//     const day = Math.floor(Math.random() * 28) + 1

//     // 랜덤 가격 (5억~15억)
//     const price = Math.floor(Math.random() * 1000000000) + 500000000

//     // 랜덤 층수 (1~20층)
//     const floor = Math.floor(Math.random() * 20) + 1

//     result.push({
//       year,
//       month,
//       day,
//       price,
//       floor,
//     })
//   }

//   return result
// }

// 날짜 필터링
const getFilteredByDate = (items) => {
  if (selectedPeriod.value === 'all') return items

  const now = new Date()
  let threshold = new Date()

  switch (selectedPeriod.value) {
    case '1m':
      threshold.setMonth(now.getMonth() - 1)
      break
    case '3m':
      threshold.setMonth(now.getMonth() - 3)
      break
    case '6m':
      threshold.setMonth(now.getMonth() - 6)
      break
    case '1y':
      threshold.setFullYear(now.getFullYear() - 1)
      break
  }

  return items.filter((item) => {
    const itemDate = new Date(item.year, item.month - 1, item.day)
    return itemDate >= threshold
  })
}

// 정렬된 & 필터링된 매물 목록
const filteredListings = computed(() => {
  const filtered = getFilteredByDate([...listings.value])

  return filtered.sort((a, b) => {
    switch (sortOption.value) {
      case 'date_desc':
        return new Date(b.year, b.month - 1, b.day) - new Date(a.year, a.month - 1, a.day)
      case 'date_asc':
        return new Date(a.year, a.month - 1, a.day) - new Date(b.year, b.month - 1, b.day)
      case 'price_desc':
        return b.price - a.price
      case 'price_asc':
        return a.price - b.price
      case 'floor_desc':
        return b.floor - a.floor
      case 'floor_asc':
        return a.floor - b.floor
      default:
        return 0
    }
  })
})

// 패널 닫기
const closePanel = () => {
  emit('close')
}

// 숫자 포맷팅 (한 자리 숫자 앞에 0 추가)
const formatNumber = (number) => {
  return number < 10 ? `0${number}` : number
}

// 가격 포맷팅
const formatPrice = (price) => {
  if (!price) return '정보 없음'

  // 억 단위와 천만 단위로 분리
  const billion = Math.floor(price / 100000000)
  const million = Math.floor((price % 100000000) / 10000000)

  if (billion > 0 && million > 0) {
    return `${billion}억 ${million}천만원`
  } else if (billion > 0) {
    return `${billion}억원`
  } else if (million > 0) {
    return `${million}천만원`
  } else {
    return `${price.toLocaleString()}원`
  }
}

// 아파트가 변경될 때 매물 데이터 다시 가져오기
watch(
  () => props.apartment,
  (newApartment) => {
    if (newApartment) {
      fetchListings()
    }
  },
  { immediate: true },
)

onMounted(() => {
  if (props.apartment) {
    fetchListings()
  }
})
</script>

<style scoped>
.listing-panel {
  width: 0;
  height: 100%;
  position: absolute;
  top: 0;
  left: 490px;
  background-color: white;
  box-shadow: -1px 0 10px rgba(0, 0, 0, 0.1);
  transition: width 0.3s ease;
  overflow: hidden;
  z-index: 95;
  display: flex;
  flex-direction: column;
}

.listing-panel.active {
  width: 380px;
}

.panel-header {
  display: flex;
  align-items: center;
  padding: 14px;
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

.panel-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
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

/* 아파트 요약 정보 */
.apartment-summary {
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

.summary-details {
  display: flex;
  gap: 10px;
}

.detail-tag {
  font-size: 12px;
  padding: 4px 8px;
  background-color: #f5f5f5;
  border-radius: 4px;
  color: #555;
}

/* 필터 영역 */
.filters {
  margin-bottom: 20px;
  padding: 12px;
  background-color: #f9f9f9;
  border-radius: 6px;
}

.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.filter-header h4 {
  font-size: 14px;
  font-weight: 600;
  color: #444;
  margin: 0;
}

.sort-control {
  display: flex;
  align-items: center;
  gap: 8px;
}

.sort-control label {
  font-size: 13px;
  color: #666;
}

.sort-control select {
  font-size: 13px;
  padding: 4px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
}

.date-filter {
  margin-top: 10px;
}

.date-filter label {
  font-size: 13px;
  color: #666;
  display: block;
  margin-bottom: 8px;
}

.date-filter-options {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.period-option {
  padding: 5px 10px;
  border-radius: 4px;
  border: 1px solid #ddd;
  font-size: 12px;
  color: #666;
  cursor: pointer;
  transition: all 0.2s ease;
}

.period-option:hover {
  border-color: #4caf50;
  color: #4caf50;
}

.period-option.active {
  background-color: #4caf50;
  color: white;
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

.no-results .sub-text {
  font-size: 13px;
  color: #888;
  margin-top: 8px;
}

/* 매물 리스트 테이블 */
.listings-container {
  margin-top: 20px;
}

.listings-table {
  width: 100%;
  border-collapse: collapse;
}

.listings-table th {
  padding: 10px;
  text-align: left;
  font-size: 13px;
  color: #555;
  border-bottom: 2px solid #eee;
  font-weight: 600;
}

.listing-row {
  border-bottom: 1px solid #eee;
  transition: background-color 0.2s ease;
}

.listing-row:hover {
  background-color: #f9f9f9;
}

.listing-row td {
  padding: 12px 10px;
  vertical-align: middle;
}

.date-cell {
  font-size: 13px;
  color: #444;
}

.price-cell {
  font-weight: 600;
  color: #4caf50;
  font-size: 14px;
}

.floor-cell {
  font-size: 13px;
  color: #555;
}

/* 모바일 화면 대응 */
@media (max-width: 768px) {
  .listing-panel.active {
    width: 100%;
    left: 0;
  }
}
</style>
