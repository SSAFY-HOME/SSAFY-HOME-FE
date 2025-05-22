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
      <h2 class="panel-title">{{ district }} 지역 분석</h2>
    </div>

    <div class="panel-content">
      <div class="location-summary" v-if="district">
        <div class="localStats">
          <h3 class="district-analysis-title">{{ province }} 분석</h3>
        </div>

        <!-- 허위매물 위험 지수 섹션 -->
        <div class="risk-assessment-section">
          <div class="risk-header">
            <h4 class="risk-title">🔍 허위매물 위험도 분석</h4>
            <button class="refresh-button" @click="fetchRiskAssessment" :disabled="isLoadingRisk">
              🔄
            </button>
          </div>

          <!-- 로딩 상태 -->
          <div v-if="isLoadingRisk" class="risk-loading">
            <div class="mini-spinner"></div>
            <span>위험도 분석 중...</span>
          </div>

          <!-- 위험도 데이터 표시 -->
          <div v-else-if="riskData" class="risk-content">
            <div class="risk-summary">
              <div class="risk-level-badge" :class="getRiskLevelClass(riskData.riskLevel)">
                {{ getRiskLevelText(riskData.riskLevel) }}
              </div>
              <div class="risk-stats">
                <div class="stat-item">
                  <span class="stat-label">실거래 건수</span>
                  <span class="stat-value">{{ formatNumber(riskData.dealCount) }}건</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">등기 건수</span>
                  <span class="stat-value">{{ formatNumber(riskData.registryCount) }}건</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">등기율</span>
                  <span class="stat-value">{{ formatPercentage(riskData.registryRate) }}%</span>
                </div>
              </div>
            </div>

            <!-- 등기율 시각화 바 -->
            <div class="registry-rate-bar">
              <div class="bar-background">
                <div
                  class="bar-fill"
                  :style="{ width: riskData.registryRate * 100 + '%' }"
                  :class="getRiskLevelClass(riskData.riskLevel)"
                ></div>
              </div>
              <div class="bar-labels">
                <span>0%</span>
                <span>100%</span>
              </div>
            </div>

            <!-- 위험도 설명 -->
            <div class="risk-explanation">
              <p class="explanation-text">
                {{ getRiskExplanation(riskData.riskLevel, riskData.registryRate) }}
              </p>
            </div>
          </div>

          <!-- 에러 상태 -->
          <div v-else-if="riskError" class="risk-error">
            <p class="error-text">{{ riskError }}</p>
            <button class="retry-button" @click="fetchRiskAssessment">다시 시도</button>
          </div>
        </div>

        <!-- 동 상권 분석 섹션 -->
        <div class="district-analysis" v-if="commerces.length > 0">
          <h3 class="district-analysis-title">{{ district }} 상권 점수</h3>
          <div class="district-analysis-section">
            <p class="district-score-description">
              주변의 편의시설, 음식점, 카페, 병원 등 상권 정보를 기반으로 한 동네 점수입니다.
            </p>

            <div class="district-score-box">
              <span class="score-value">{{ areaScore }}</span>
              <span class="score-unit">점</span>
            </div>

            <div class="score-bar-container">
              <div class="score-bar-background">
                <div class="score-bar-fill" :style="{ width: `${(areaScore / 30) * 100}%` }"></div>
              </div>
              <div class="score-bar-labels">
                <span>0</span>
                <span>30+</span>
              </div>
            </div>

            <p class="score-evaluation">{{ evaluateAreaScore(areaScore) }}</p>
          </div>
        </div>

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
import { kakaoAPI } from '@/api/commerce'
import { riskAPI } from '@/api/risk'

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
    type: [String, Number],
    default: '',
  },
})

// 이벤트 정의
const emit = defineEmits(['close', 'showOnMap', 'showAllOnMap', 'showCommerceOnMap'])

// 기존 상태 관리
const commerces = ref([])
const selectedCategory = ref('')
const isLoadingCommerces = ref(false)
const commerceSearchPerformed = ref(false)
const selectedCommerceId = ref(null)

// 허위매물 위험도 관련 상태
const riskData = ref(null)
const isLoadingRisk = ref(false)
const riskError = ref(null)

const filteredCommerces = computed(() => {
  if (!selectedCategory.value) return commerces.value
  return commerces.value.filter(
    (commerce) =>
      commerce.category_group_code === selectedCategory.value ||
      commerce.category_name.includes(getCategoryNameById(selectedCategory.value)),
  )
})

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

// 허위매물 위험도 조회 함수
const fetchRiskAssessment = async () => {
  if (!props.province) return

  isLoadingRisk.value = true
  riskError.value = null

  try {
    // 현재 날짜 기준으로 1년간의 데이터 조회
    const currentDate = new Date()
    const endYm =
      currentDate.getFullYear().toString() +
      (currentDate.getMonth() + 1).toString().padStart(2, '0')
    const startDate = new Date(currentDate.getFullYear() - 1, currentDate.getMonth(), 1)
    const startYm =
      startDate.getFullYear().toString() + (startDate.getMonth() + 1).toString().padStart(2, '0')

    const result = await riskAPI.evaluateRisk(props.province, startYm, endYm)

    if (result.success) {
      riskData.value = result.data
    } else {
      riskError.value = '위험도 데이터를 불러올 수 없습니다.'
    }
  } catch (error) {
    console.error('허위매물 위험도 조회 실패:', error)
    riskError.value = error.message || '위험도 분석 중 오류가 발생했습니다.'
  } finally {
    isLoadingRisk.value = false
  }
}

// 위험도 레벨에 따른 CSS 클래스 반환
const getRiskLevelClass = (riskLevel) => {
  switch (riskLevel) {
    case '낮음':
      return 'risk-low'
    case '보통':
      return 'risk-medium'
    case '높음':
      return 'risk-high'
    default:
      return 'risk-unknown'
  }
}

// 위험도 레벨 텍스트 반환
const getRiskLevelText = (riskLevel) => {
  switch (riskLevel) {
    case '낮음':
      return '✅ 안전'
    case '보통':
      return '⚠️ 주의'
    case '높음':
      return '🚨 위험'
    default:
      return '❓ 알 수 없음'
  }
}

// 위험도 설명 반환
const getRiskExplanation = (riskLevel, registryRate) => {
  const rate = Math.round(registryRate * 100)

  switch (riskLevel) {
    case '낮음':
      return `등기율이 ${rate}%로 높음. 대부분의 거래가 정상적으로 등기되어 허위매물 위험이 낮습니다.`
    case '보통':
      return `등기율이 ${rate}%로 보통 수준. 거래 시 등기 여부를 반드시 확인하시기 바랍니다.`
    case '높음':
      return `등기율이 ${rate}%로 낮음. 허위매물 위험이 높으니 각별한 주의가 필요합니다.`
    default:
      return '위험도를 판단할 수 없습니다. 거래 시 신중하게 검토하시기 바랍니다.'
  }
}

// 숫자 포맷팅
const formatNumber = (num) => {
  return num?.toLocaleString() || '0'
}

// 퍼센트 포맷팅
const formatPercentage = (rate) => {
  return (rate * 100).toFixed(1)
}

// 패널 닫기
const closePanel = () => {
  emit('close')
}
// 상권 점수 계산용 가중치
const categoryWeights = {
  FD6: 1, // 음식점
  CE7: 1.5, // 카페
  CS2: 1, // 편의점
  HP8: 1.2, // 병원
  PM9: 1, // 약국
  BK9: 1.2, // 은행
  AC5: 1, // 학원
  MT1: 2, // 대형마트
}

// 지역 점수 계산
const areaScore = computed(() => {
  return commerces.value.reduce((acc, place) => {
    const weight = categoryWeights[place.category_group_code] || 0
    return acc + weight
  }, 0)
})

// 점수 평가 문구
const evaluateAreaScore = (score) => {
  if (score >= 25) return '✅ 생활 편의시설이 매우 풍부한 지역입니다.'
  if (score >= 15) return '👍 편의시설이 적절히 갖춰진 지역입니다.'
  if (score >= 8) return '⚠️ 편의시설이 다소 부족할 수 있습니다.'
  return '🚨 편의시설이 매우 부족한 지역입니다.'
}

// 주변 상권 검색 함수
const fetchNearbyCommerces = async (keyword, category) => {
  if (!props.district) return

  isLoadingCommerces.value = true
  commerceSearchPerformed.value = true

  try {
    const result = await kakaoAPI.searchNearbyCommerces({
      city: props.city,
      district: props.district,
      keyword: keyword || '',
      categoryGroupCode: category || '',
    })
    console.log('상권정보api호출', result.data)

    if (result.status === 200) {
      commerces.value = result.data
      emit('showAllOnMap', commerces.value)
    } else {
      console.error('주변 상권 검색 중 오류:', result.message)
      commerces.value = []
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

  if (categoryId) {
    fetchNearbyCommerces('', categoryId)
  } else {
    fetchNearbyCommerces()
  }
}

// 상권 지도에 표시
const showCommerceOnMap = (commerce) => {
  selectedCommerceId.value = commerce.id

  emit('showOnMap', {
    latitude: commerce.y,
    longitude: commerce.x,
    name: commerce.place_name,
    category: commerce.category_name,
    id: commerce.id,
    isCommerce: true,
  })
}

// props 변경 시 데이터 다시 불러오기
watch(
  () => [props.isVisible, props.district, props.province],
  ([newVisible, newDistrict, newProvince]) => {
    if (newVisible && newDistrict) {
      fetchNearbyCommerces()
    }
    if (newVisible && newProvince) {
      fetchRiskAssessment()
    }
  },
  { immediate: true },
)

onMounted(() => {
  if (props.isVisible && props.district) {
    fetchNearbyCommerces()
  }
  if (props.isVisible && props.province) {
    fetchRiskAssessment()
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
  width: 550px;
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
/* 허위매물 위험도 섹션 */
.risk-assessment-section {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  border: 1px solid #e9ecef;
}

.risk-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.risk-title {
  font-size: 15px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.refresh-button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  padding: 4px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.refresh-button:hover:not(:disabled) {
  background-color: rgba(0, 0, 0, 0.05);
}

.refresh-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.risk-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 20px;
  color: #666;
}

.mini-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #4caf50;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.risk-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.risk-summary {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.risk-level-badge {
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 13px;
  font-weight: 600;
  width: fit-content;
}

.risk-level-badge.risk-low {
  background-color: #d4edda;
  color: #155724;
}

.risk-level-badge.risk-medium {
  background-color: #fff3cd;
  color: #856404;
}

.risk-level-badge.risk-high {
  background-color: #f8d7da;
  color: #721c24;
}

.risk-level-badge.risk-unknown {
  background-color: #e2e3e5;
  color: #383d41;
}

.risk-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 8px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px;
  background: white;
  border-radius: 6px;
  border: 1px solid #e9ecef;
}

.stat-label {
  font-size: 11px;
  color: #666;
  margin-bottom: 2px;
}

.stat-value {
  font-size: 13px;
  font-weight: 600;
  color: #333;
}

.registry-rate-bar {
  margin: 8px 0;
}

.bar-background {
  height: 8px;
  background-color: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
  position: relative;
}

.bar-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.3s ease;
}

.bar-fill.risk-low {
  background-color: #28a745;
}

.bar-fill.risk-medium {
  background-color: #ffc107;
}

.bar-fill.risk-high {
  background-color: #dc3545;
}

.bar-labels {
  display: flex;
  justify-content: space-between;
  font-size: 10px;
  color: #666;
  margin-top: 4px;
}

.risk-explanation {
  margin-top: 8px;
}

.explanation-text {
  font-size: 12px;
  color: #666;
  line-height: 1.4;
  margin: 0;
}

.risk-error {
  text-align: center;
  padding: 20px;
}

.error-text {
  color: #dc3545;
  font-size: 13px;
  margin: 0 0 12px 0;
}

.retry-button {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.retry-button:hover {
  background-color: #45a049;
}
.summary-header {
  margin-bottom: 10px;
}
.district-analysis-section {
  background: #f0f4f3;
  border: 1px solid #d6e4e2;
  padding: 16px;
  margin-bottom: 16px;
  border-radius: 8px;
}

.district-analysis-title {
  font-size: 15px;
  font-weight: 600;
  color: #333;
  margin-bottom: 6px;
}

.district-score-description {
  font-size: 12px;
  color: #666;
  margin-bottom: 10px;
}

.district-score-box {
  display: flex;
  align-items: baseline;
  font-size: 28px;
  font-weight: 700;
  color: #4caf50;
  margin-bottom: 10px;
}

.score-unit {
  font-size: 14px;
  margin-left: 4px;
  color: #555;
}

.score-bar-container {
  margin-bottom: 8px;
}

.score-bar-background {
  background-color: #ddd;
  height: 10px;
  border-radius: 6px;
  overflow: hidden;
}

.score-bar-fill {
  height: 10px;
  background-color: #4caf50;
  transition: width 0.3s ease;
}

.score-bar-labels {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: #777;
  margin-top: 4px;
}

.score-evaluation {
  font-size: 12px;
  color: #444;
  margin-top: 6px;
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
