// DealPanel.vue - 매물 리스트 조회 패널
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
      <ApartmentDetailChart v-if="apartment" :aptSeq="apartment.aptSeq" />
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
              v-for="(listing, index) in filteredListings"
              :key="listing.dealId || `item-${index}`"
              class="listing-row"
            >
              <td class="date-cell">
                <span class="date-value">
                  {{ listing.dealYear }}.{{ formatNumber(listing.dealMonth) }}.{{
                    formatNumber(listing.dealDay)
                  }}
                </span>
              </td>
              <td class="price-cell">
                <span class="price-value">{{ formatDealAmount(listing.dealAmount) }}</span>
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
import { dealAPI } from '@/api/deal'
import ApartmentDetailChart from '@/components/chart/ApartmentDetailChart.vue'
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

// 매물 데이터 가져오기
const fetchDealHistory = async () => {
  if (!props.apartment || !props.apartment.aptSeq) return
  isLoading.value = true

  try {
    const result = await dealAPI.getDealHistory(props.apartment.aptSeq)

    if (result.success) {
      listings.value = result.data
    } else {
      console.error('거래 내역 조회 실패:', result.message)
    }
  } catch (error) {
    console.error('거래 내역 조회 오류:', error)
    listings.value = []
  } finally {
    isLoading.value = false
  }
}

// apartment prop이 변경될 때 데이터 다시 가져오기
watch(
  () => props.apartment,
  (newValue) => {
    if (newValue && props.isVisible) {
      fetchDealHistory()
    }
  },
)

// 날짜 필터링 함수 수정
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
    // dealYear, dealMonth, dealDay 속성 사용
    const itemDate = new Date(
      parseInt(item.dealYear, 10),
      parseInt(item.dealMonth, 10) - 1,
      parseInt(item.dealDay, 10),
    )
    return itemDate >= threshold
  })
}

// 정렬된 & 필터링된 매물 목록 수정
const filteredListings = computed(() => {
  const filtered = getFilteredByDate([...listings.value])

  return filtered.sort((a, b) => {
    switch (sortOption.value) {
      case 'date_desc':
        // dealYear, dealMonth, dealDay 속성 사용
        return (
          new Date(
            parseInt(b.dealYear, 10),
            parseInt(b.dealMonth, 10) - 1,
            parseInt(b.dealDay, 10),
          ) -
          new Date(parseInt(a.dealYear, 10), parseInt(a.dealMonth, 10) - 1, parseInt(a.dealDay, 10))
        )
      case 'date_asc':
        return (
          new Date(
            parseInt(a.dealYear, 10),
            parseInt(a.dealMonth, 10) - 1,
            parseInt(a.dealDay, 10),
          ) -
          new Date(parseInt(b.dealYear, 10), parseInt(b.dealMonth, 10) - 1, parseInt(b.dealDay, 10))
        )
      case 'price_desc':
        // dealAmount 문자열을 숫자로 변환하여 비교
        return (
          parseInt(b.dealAmount.replace(/,/g, ''), 10) -
          parseInt(a.dealAmount.replace(/,/g, ''), 10)
        )
      case 'price_asc':
        return (
          parseInt(a.dealAmount.replace(/,/g, ''), 10) -
          parseInt(b.dealAmount.replace(/,/g, ''), 10)
        )
      case 'floor_desc':
        // floor 속성이 문자열일 수 있으므로 parseInt 사용
        return parseInt(b.floor, 10) - parseInt(a.floor, 10)
      case 'floor_asc':
        return parseInt(a.floor, 10) - parseInt(b.floor, 10)
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
  if (!number) return '00'
  return number < 10 ? `0${number}` : number
}

// 부동산 거래 금액 포맷팅 함수
const formatDealAmount = (dealAmount) => {
  if (!dealAmount) return '정보 없음'

  // 문자열이 들어온 경우 (예: "17,900")
  if (typeof dealAmount === 'string') {
    // 콤마 제거 후 숫자로 변환
    const numericPrice = parseInt(dealAmount.replace(/,/g, ''), 10)

    // 변환 실패 시
    if (isNaN(numericPrice)) {
      return dealAmount // 원본 그대로 반환
    }

    // 부동산 거래 금액 포맷팅 (만원 단위 적용)
    const billion = Math.floor(numericPrice / 10000) // 억 단위 (만원 단위이므로 10000으로 나눔)
    const million = numericPrice % 10000 // 만원 단위 나머지

    if (billion > 0 && million > 0) {
      return `${billion}억 ${million}만원`
    } else if (billion > 0) {
      return `${billion}억원`
    } else {
      return `${numericPrice}만원`
    }
  }

  // 숫자가 들어온 경우
  const numericPrice = dealAmount
  const billion = Math.floor(numericPrice / 10000) // 억 단위
  const million = numericPrice % 10000 // 만원 단위 나머지

  if (billion > 0 && million > 0) {
    return `${billion}억 ${million}만원`
  } else if (billion > 0) {
    return `${billion}억원`
  } else {
    return `${numericPrice}만원`
  }
}

// 아파트가 변경될 때 매물 데이터 다시 가져오기
watch(
  () => props.apartment,
  (newApartment) => {
    if (newApartment) {
      fetchDealHistory()
    }
  },
  { immediate: true },
)

onMounted(() => {
  if (props.apartment) {
    fetchDealHistory()
  }
})
</script>

<style scoped>
.listing-panel {
  width: 0;
  height: 100%;
  position: absolute;
  top: 0;
  left: 600px;
  background-color: white;
  box-shadow: -1px 0 10px rgba(0, 0, 0, 0.1);
  transition: width 0.3s ease;
  overflow: hidden;
  z-index: 95;
  display: flex;
  flex-direction: column;
}

.listing-panel.active {
  width: 580px;
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
    left: 80px;
  }
}
</style>
