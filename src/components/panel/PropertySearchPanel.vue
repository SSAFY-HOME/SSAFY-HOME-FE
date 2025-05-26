<!-- PropertySearchPanel.vue -->
<template>
  <div class="property-panel">
    <h3 class="section-title">아파트 검색</h3>
    <div class="search-form">
      <!-- 시/도 선택 -->
      <div class="search-group">
        <label for="province">시/도</label>
        <div class="dropdown-container" :class="{ active: provinceDropdownOpen }">
          <div class="selected-option" @click="toggleProvinceDropdown">
            {{ selectedProvince || '시/도 선택' }}
            <span class="dropdown-arrow">▼</span>
          </div>
          <div class="dropdown-menu" v-if="provinceDropdownOpen">
            <div
              class="dropdown-item"
              v-for="province in provinces"
              :key="province.id"
              @click="selectProvince(province)"
            >
              {{ province.name }}
            </div>
            <div class="dropdown-item loading" v-if="isLoadingProvinces">로딩 중...</div>
            <div class="dropdown-item empty" v-if="provinces.length === 0 && !isLoadingProvinces">
              데이터가 없습니다
            </div>
          </div>
        </div>
      </div>

      <!-- 군/구 선택 -->
      <div class="search-group">
        <label for="city">군/구</label>
        <div
          class="dropdown-container"
          :class="{ active: cityDropdownOpen, disabled: !selectedProvince }"
        >
          <div
            class="selected-option"
            @click="toggleCityDropdown"
            :class="{ disabled: !selectedProvince }"
          >
            {{ selectedCity || '군/구 선택' }}
            <span class="dropdown-arrow">▼</span>
          </div>
          <div class="dropdown-menu" v-if="cityDropdownOpen">
            <div
              class="dropdown-item"
              v-for="city in cities"
              :key="city.id"
              @click="selectCity(city)"
            >
              {{ city.name }}
            </div>
            <div class="dropdown-item loading" v-if="isLoadingCities">로딩 중...</div>
            <div class="dropdown-item empty" v-if="cities.length === 0 && !isLoadingCities">
              데이터가 없습니다
            </div>
          </div>
        </div>
      </div>

      <!-- 동 선택 -->
      <div class="search-group">
        <label for="district">동</label>
        <div
          class="dropdown-container"
          :class="{ active: districtDropdownOpen, disabled: !selectedCity }"
        >
          <div
            class="selected-option"
            @click="toggleDistrictDropdown"
            :class="{ disabled: !selectedCity }"
          >
            {{ selectedDistrict || '동 선택' }}
            <span class="dropdown-arrow">▼</span>
          </div>
          <div class="dropdown-menu" v-if="districtDropdownOpen">
            <div
              class="dropdown-item"
              v-for="district in districts"
              :key="district.id"
              @click="selectDistrict(district)"
            >
              {{ district.name }}
            </div>
            <div class="dropdown-item loading" v-if="isLoadingDistricts">로딩 중...</div>
            <div class="dropdown-item empty" v-if="districts.length === 0 && !isLoadingDistricts">
              데이터가 없습니다
            </div>
          </div>
        </div>
      </div>

      <button class="search-button" @click="searchApartments" :disabled="!selectedDistrict">
        <span class="button-text">검색</span>
      </button>
      <button class="commerce-button" @click="openCommercePanel" :disabled="!selectedDistrict">
        <span class="button-icon">🏪</span>
        <span class="button-text">지역 분석</span>
      </button>
    </div>
    <!-- 검색 결과 -->
    <div class="search-results" v-if="searchPerformed">
      <div class="results-header">
        <h4 class="results-title">검색 결과 ({{ apartments.length }}건)</h4>
        <div class="sort-options">
          <select v-model="sortOption">
            <option value="price_asc">가격 낮은순</option>
            <option value="price_desc">가격 높은순</option>
            <option value="year_desc">신축순</option>
            <option value="year_asc">준공일순</option>
          </select>
        </div>
      </div>

      <div class="loading-indicator" v-if="isLoadingApartments">
        <div class="spinner"></div>
        <p>아파트 정보를 불러오는 중...</p>
      </div>

      <div
        class="no-results"
        v-if="apartments.length === 0 && !isLoadingApartments && searchPerformed"
      >
        <p>검색 결과가 없습니다.</p>
        <p class="no-results-sub">다른 지역이나 조건으로 검색해보세요.</p>
      </div>

      <div class="apartment-list" v-if="apartments.length > 0">
        <div
          class="apartment-card"
          v-for="apartment in apartments"
          :key="apartment.id"
          :id="`apt-${apartment.id}`"
          :class="{
            'selected-apartment': selectedApartmentId === apartment.id,
            highlighted: props.highlightedId === apartment.id,
          }"
        >
          <!-- 좋아요 버튼 (오른쪽 상단에 배치) -->
          <div class="like-button-container">
            <button
              class="like-button"
              @click.stop="toggleLike(apartment)"
              :class="{ liked: apartment.likedApt }"
            >
              <span class="heart-icon">{{ apartment.likedApt ? '❤️' : '🤍' }}</span>
            </button>
          </div>

          <div class="apartment-info" @click="showOnMap(apartment)">
            <h3 class="apartment-name">{{ apartment.name }}</h3>
            <p class="apartment-address">{{ apartment.addr }}</p>
            <div class="apartment-details">
              <span class="detail-item">{{ apartment.buildYear }}년 준공</span>
              <span class="detail-item">도로명 주소: {{ apartment.roadNmSggCd }}</span>
            </div>
            <!-- 통계 추가 -->
            <div class="price-info">
              <span class="avg-price">평균 {{ formatPrice(apartment.avgPrice) }}</span>

              <span class="price-range"
                >최저 {{ formatPrice(apartment.minPrice) }} ~ 최고
                {{ formatPrice(apartment.maxPrice) }}</span
              >
            </div>
            <div class="apartment-actions">
              <button class="listing-button" @click.stop="viewListings(apartment)">
                <span class="button-icon">📋</span> 매물 리스트 보기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue'
import { apartmentAPI } from '@/api/apartment'

// emit 정의 업데이트
const emit = defineEmits(['showOnMap', 'showAllOnMap', 'view-listings', 'view-commerces'])

// 상태 관리
const provinces = ref([])
const cities = ref([])
const districts = ref([])
const apartments = ref([])

const selectedProvince = ref('')
const selectedCity = ref('')
const selectedDistrict = ref('')

const provinceDropdownOpen = ref(false)
const cityDropdownOpen = ref(false)
const districtDropdownOpen = ref(false)

const isLoadingProvinces = ref(false)
const isLoadingCities = ref(false)
const isLoadingDistricts = ref(false)
const isLoadingApartments = ref(false)
const searchPerformed = ref(false)
const sortOption = ref('price_asc')

// Vue 컴포넌트 내부
const fetchProvinces = async () => {
  isLoadingProvinces.value = true
  try {
    const result = await apartmentAPI.getProvinces()
    provinces.value = result.data
  } catch (error) {
    console.error('시/도 데이터를 불러오는 중 오류가 발생했습니다:', error)
  } finally {
    isLoadingProvinces.value = false
  }
}

const fetchCities = async (provinceId) => {
  if (!provinceId) {
    cities.value = []
    return
  }

  isLoadingCities.value = true
  try {
    const result = await apartmentAPI.getCities(provinceId)
    cities.value = result.data
  } catch (error) {
    console.error('시/군/구 데이터를 불러오는 중 오류가 발생했습니다:', error)
    cities.value = []
  } finally {
    isLoadingCities.value = false
  }
}

const fetchDistricts = async (cityId) => {
  if (!cityId) {
    districts.value = []
    return
  }

  isLoadingDistricts.value = true
  try {
    const result = await apartmentAPI.getDistricts(cityId)
    districts.value = result.data
  } catch (error) {
    console.error('동 데이터를 불러오는 중 오류가 발생했습니다:', error)
    districts.value = []
  } finally {
    isLoadingDistricts.value = false
  }
}
const sortApartments = () => {
  if (apartments.value.length > 0) {
    apartments.value = [...apartments.value].sort((a, b) => {
      switch (sortOption.value) {
        case 'price_asc':
          return a.avgPrice - b.avgPrice
        case 'price_desc':
          return b.avgPrice - a.avgPrice
        case 'year_desc':
          return b.buildYear - a.buildYear
        case 'year_asc':
          return a.buildYear - b.buildYear
        default:
          return 0
      }
    })
  }
}
const fetchApartments = async (districtId) => {
  if (!districtId) return

  isLoadingApartments.value = true
  try {
    const result = await apartmentAPI.getApartments(districtId)
    apartments.value = result.data
    sortApartments()
    emit('showAllOnMap', apartments.value)
  } catch (error) {
    console.error('아파트 데이터를 불러오는 중 오류가 발생했습니다:', error)
    apartments.value = []
  } finally {
    isLoadingApartments.value = false
  }
}

// 좋아요 토글 기능
const toggleLike = async (apartment) => {
  try {
    console.log(apartment.aptSeq)
    if (apartment.likedApt) {
      // 좋아요 취소
      await apartmentAPI.unlikeApartment(apartment.aptSeq)
      apartment.likedApt = false
    } else {
      // 좋아요 추가
      await apartmentAPI.likeApartment(apartment.aptSeq)
      apartment.likedApt = true
    }
  } catch (error) {
    console.error('좋아요 처리 중 오류가 발생했습니다:', error)
    alert('좋아요 처리 중 오류가 발생했습니다. 다시 시도해주세요.')
  }
}

// 이벤트 핸들러
const toggleProvinceDropdown = () => {
  provinceDropdownOpen.value = !provinceDropdownOpen.value
  if (provinceDropdownOpen.value) {
    cityDropdownOpen.value = false
    districtDropdownOpen.value = false
  }
}

const toggleCityDropdown = () => {
  if (!selectedProvince.value) return
  cityDropdownOpen.value = !cityDropdownOpen.value
  if (cityDropdownOpen.value) {
    provinceDropdownOpen.value = false
    districtDropdownOpen.value = false
  }
}

const toggleDistrictDropdown = () => {
  if (!selectedCity.value) return
  districtDropdownOpen.value = !districtDropdownOpen.value
  if (districtDropdownOpen.value) {
    provinceDropdownOpen.value = false
    cityDropdownOpen.value = false
  }
}

const selectProvince = (province) => {
  selectedProvince.value = province.name
  selectedCity.value = ''
  selectedDistrict.value = ''
  fetchCities(province.id)
  provinceDropdownOpen.value = false
}

const selectCity = (city) => {
  selectedCity.value = city.name
  selectedDistrict.value = ''
  fetchDistricts(city.id)
  cityDropdownOpen.value = false
}

const selectDistrict = (district) => {
  selectedDistrict.value = district.name
  districtDropdownOpen.value = false
}

const searchApartments = () => {
  if (!selectedDistrict.value) return

  // districts 배열에서 선택된 동의 ID 찾기
  const selectedDistrictObj = districts.value.find((d) => d.name === selectedDistrict.value)
  if (selectedDistrictObj) {
    fetchApartments(selectedDistrictObj.id)
    searchPerformed.value = true
  }
}

// 추가: 선택된 아파트 ID를 저장할 상태 변수
const selectedApartmentId = ref(null)

// 지도에 표시 함수
const showOnMap = (apartment) => {
  selectedApartmentId.value = apartment.id
  emit('showOnMap', {
    latitude: apartment.latitude,
    longitude: apartment.longitude,
    name: apartment.name,
    avgPrice: apartment.avgPrice,
    id: apartment.id,
    buildYear: apartment.buildYear,
    addr: apartment.addr,
  })
}

const props = defineProps({
  highlightedId: Number,
})

watch(
  () => props.highlightedId,
  async (newId) => {
    if (!newId) return
    console.log('[PropertySearchPanel] highlightedId 변경 감지:', newId)
    await nextTick()

    const exists = apartments.value.some((apt) => apt.id === newId)
    if (!exists) {
      console.warn('[PropertySearchPanel] apartments에 해당 ID 없음:', newId)
      return
    }

    const el = document.getElementById(`apt-${newId}`)
    console.log('[PropertySearchPanel] scroll 대상 DOM:', el)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  },
)

// 매물 리스트 보기 함수
const viewListings = (apartment) => {
  // 선택된 아파트 ID 저장
  selectedApartmentId.value = apartment.id

  // 부모 컴포넌트로 선택된 아파트 정보 전달
  emit('view-listings', {
    latitude: apartment.latitude,
    longitude: apartment.longitude,
    name: apartment.name,
    avgPrice: apartment.avgPrice,
    id: apartment.id,
    buildYear: apartment.buildYear,
    addr: apartment.addr,
  })
}

// 주변 상권 패널 열기
const openCommercePanel = () => {
  if (!selectedDistrict.value) return

  // districts 배열에서 선택된 동의 정보 찾기
  const selectedDistrictObj = districts.value.find((d) => d.name === selectedDistrict.value)
  if (!selectedDistrictObj) return

  // 부모 컴포넌트로 상권 패널 열기 이벤트 발생
  emit('view-commerces', {
    province: selectedProvince.value,
    city: selectedCity.value,
    district: selectedDistrict.value,
    districtId: selectedDistrictObj.id,
  })
}

// 클릭 외부 감지 (드롭다운 닫기)
const handleClickOutside = (event) => {
  const dropdowns = document.querySelectorAll('.dropdown-container')
  let clickedOutside = true

  dropdowns.forEach((dropdown) => {
    if (dropdown.contains(event.target)) {
      clickedOutside = false
    }
  })

  if (clickedOutside) {
    provinceDropdownOpen.value = false
    cityDropdownOpen.value = false
    districtDropdownOpen.value = false
  }
}
// 가격 포맷팅 함수
const formatPrice = (price) => {
  if (price >= 10000) {
    const oku = Math.floor(price / 10000)
    const man = price % 10000
    if (man === 0) {
      return `${oku}억`
    } else {
      return `${oku}억 ${man.toLocaleString()}`
    }
  }
  return `${price.toLocaleString()}만원`
}
// 컴포넌트 마운트 시 초기 데이터 로드
onMounted(() => {
  fetchProvinces()
  document.addEventListener('click', handleClickOutside)
})

// 감시자
watch(selectedProvince, () => {
  cities.value = []
  districts.value = []
  selectedCity.value = ''
  selectedDistrict.value = ''
  searchPerformed.value = false
})

watch(selectedCity, () => {
  districts.value = []
  selectedDistrict.value = ''
  searchPerformed.value = false
})

watch(selectedDistrict, () => {
  searchPerformed.value = false
})

// 정렬 옵션 변경 감시
watch(sortOption, () => {
  sortApartments()
})
</script>

<style scoped>
.property-panel {
  padding: 0;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #333;
}

.search-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
}

.search-group {
  width: 100%;
}

label {
  display: block;
  margin-bottom: 6px;
  font-size: 14px;
  color: #555;
  font-weight: 500;
}

.dropdown-container {
  position: relative;
  width: 100%;
}

.selected-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 10px 12px;
  background-color: #fff;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
}

.selected-option:hover {
  border-color: #aaa;
}

.selected-option.disabled {
  background-color: #f5f5f5;
  color: #aaa;
  cursor: not-allowed;
}

.dropdown-arrow {
  font-size: 10px;
  color: #777;
}

.dropdown-container.active .selected-option {
  border-color: #4caf50;
  box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  max-height: 220px;
  overflow-y: auto;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 10;
  margin-top: 4px;
}

.dropdown-item {
  padding: 10px 12px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  font-size: 14px;
}

.dropdown-item:hover {
  background-color: rgba(76, 175, 80, 0.1);
}

.dropdown-item.loading,
.dropdown-item.empty {
  text-align: center;
  color: #888;
  cursor: default;
  padding: 12px;
}

.dropdown-item.loading:hover,
.dropdown-item.empty:hover {
  background-color: initial;
}

.search-button {
  padding: 12px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
  margin-top: 8px;
}

.search-button:hover {
  background-color: #388e3c;
}

.search-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.button-text {
  font-size: 14px;
}

/* 주변 상권보기 버튼 스타일 */
.commerce-button {
  flex: 1;
  padding: 12px;
  background-color: #485941;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.commerce-button:hover {
  background-color: #42523b;
}

/* 검색 결과 */
.search-results {
  margin-top: 20px;
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.results-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}
.price-info {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
}

.avg-price {
  font-size: 11px;
  font-weight: 600;
  color: #4caf50;
}
.price-range {
  font-size: 10px;
  color: #777;
  margin-bottom: 5px;
}
.sort-options select {
  padding: 6px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 13px;
  background-color: #fff;
  cursor: pointer;
}

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

.no-results {
  text-align: center;
  padding: 40px 0;
  color: #666;
  background-color: #f9f9f9;
  border-radius: 8px;
}

.no-results-sub {
  font-size: 14px;
  color: #888;
  margin-top: 8px;
}

.apartment-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.apartment-card {
  display: flex;
  position: relative; /* 좋아요 버튼 위치 지정을 위해 추가 */
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
}

.apartment-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* 선택된 아파트 카드 스타일 */
.apartment-card.selected-apartment,
.apartment-card.highlighted {
  border-color: #4caf50;
  background-color: #f7fcf7;
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.2);
}

/* 선택된 상태에서 호버 효과 */
.apartment-card.selected-apartment:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 14px rgba(76, 175, 80, 0.25);
}

/* 좋아요 버튼 스타일 */
.like-button-container {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 5;
}

.like-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
}

.like-button:hover {
  transform: scale(1.1);
  background-color: rgba(255, 255, 255, 0.95);
}

.heart-icon {
  font-size: 18px;
}

.like-button.liked {
  animation: heartbeat 0.3s ease-in-out;
}

@keyframes heartbeat {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

.apartment-info {
  flex: 1;
  padding: 12px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.apartment-name {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 4px;
  color: #333;
  padding-right: 50px; /* 좋아요 버튼 공간 확보 */
}

.apartment-address {
  font-size: 13px;
  color: #666;
  margin-bottom: 8px;
}

.apartment-details {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
  flex-wrap: wrap;
}

.detail-item {
  font-size: 12px;
  background-color: #f5f5f5;
  padding: 4px 8px;
  border-radius: 4px;
  color: #555;
}

/* 매물 리스트 버튼 스타일 */
.apartment-actions {
  margin-top: auto;
}

.listing-button {
  width: 100%;
  padding: 8px 12px;
  background-color: #e8f5e9;
  color: #4c4e4c;
  border: 1px solid #4caf50;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.listing-button:hover {
  background-color: #c8e6c9;
}

.button-icon {
  margin-right: 6px;
  font-size: 16px;
}

/* 모바일 반응형 스타일 */
@media (max-width: 480px) {
  .apartment-card {
    flex-direction: column;
  }

  .apartment-image {
    width: 100%;
    height: 180px;
  }

  .filter-row {
    flex-direction: column;
  }

  .like-button-container {
    top: 5px;
    right: 5px;
  }

  .like-button {
    width: 35px;
    height: 35px;
  }
}
</style>
