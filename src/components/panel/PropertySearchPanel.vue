<!-- PropertyPanel.vue -->
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
    </div>

    <!-- 필터 옵션 -->
    <div class="filter-section" v-if="searchPerformed">
      <h4 class="filter-title">필터</h4>
      <div class="filter-row">
        <div class="filter-group">
          <label>가격 범위</label>
          <div class="range-selector">
            <input type="text" placeholder="최소" v-model="priceMin" />
            <span class="range-divider">~</span>
            <input type="text" placeholder="최대" v-model="priceMax" />
          </div>
        </div>

        <!-- <div class="filter-group">
          <label>평수</label>
          <div class="range-selector">
            <input type="text" placeholder="최소" v-model="areaMin" />
            <span class="range-divider">~</span>
            <input type="text" placeholder="최대" v-model="areaMax" />
          </div>
        </div> -->
      </div>

      <div class="filter-row">
        <div class="filter-group">
          <label>건축년도</label>
          <div class="range-selector">
            <input type="text" placeholder="최소" v-model="yearMin" />
            <span class="range-divider">~</span>
            <input type="text" placeholder="최대" v-model="yearMax" />
          </div>
        </div>

        <button class="apply-filter-button" @click="applyFilters">필터 적용</button>
      </div>
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
          @click="showOnMap(apartment)"
        >
          <!-- <div class="apartment-image">
            <img :src="apartment.image || 'https://via.placeholder.com/150'" alt="아파트 이미지" />
          </div> -->
          <div class="apartment-info">
            <h3 class="apartment-name">{{ apartment.name }}</h3>
            <p class="apartment-address">{{ apartment.addr }}</p>
            <div class="apartment-details">
              <span class="detail-item">{{ apartment.buildYear }}년 준공</span>
              <span class="detail-item">도로명 주소: {{ apartment.roadNmSggCd }}</span>
            </div>
            <div class="apartment-price">
              <span class="price-value">{{ formatPrice(apartment.price) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { apartmentAPI } from '@/api/apartment'

// emit 정의 업데이트
const emit = defineEmits(['showOnMap', 'showAllOnMap'])

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

// 필터 상태
const priceMin = ref('')
const priceMax = ref('')
const yearMin = ref('')
const yearMax = ref('')
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
    // 실제 API 엔드포인트로 교체 필요
    const result = await apartmentAPI.getDistricts(cityId)
    districts.value = result.data
  } catch (error) {
    console.error('동 데이터를 불러오는 중 오류가 발생했습니다:', error)
    districts.value = []
  } finally {
    isLoadingDistricts.value = false
  }
}

const fetchApartments = async (districtId) => {
  if (!districtId) return

  isLoadingApartments.value = true
  try {
    // 실제 API 엔드포인트로 교체 필요
    const result = await apartmentAPI.getApartments(districtId)
    apartments.value = result.data
    emit('showAllOnMap', apartments.value)
  } catch (error) {
    console.error('아파트 데이터를 불러오는 중 오류가 발생했습니다:', error)
    apartments.value = []
  } finally {
    isLoadingApartments.value = false
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

const applyFilters = () => {
  // 여기에 필터 적용 로직 구현
  // 새로운 API 호출이나 기존 데이터 필터링
  console.log('필터 적용:', {
    가격: `${priceMin.value || '최소'} ~ ${priceMax.value || '최대'}`,
    건축년도: `${yearMin.value || '최소'} ~ ${yearMax.value || '최대'}`,
    정렬: sortOption.value,
  })
}

// 지도에 표시 함수
const showOnMap = (apartment) => {
  // 부모 컴포넌트로 아파트 위치 데이터 전달
  emit('showOnMap', {
    latitude: apartment.latitude,
    longitude: apartment.longitude,
    name: apartment.name,
    price: apartment.price,
    id: apartment.id,
  })
}

// 가격 포맷팅 함수
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
  // 정렬 옵션에 따른 데이터 정렬
  if (apartments.value.length > 0) {
    apartments.value = [...apartments.value].sort((a, b) => {
      switch (sortOption.value) {
        case 'price_asc':
          return a.price - b.price
        case 'price_desc':
          return b.price - a.price
        case 'year_desc':
          return b.buildYear - a.buildYear
        case 'year_asc':
          return a.buildYear - b.buildYear
        default:
          return 0
      }
    })
  }
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

/* 필터 섹션 */
.filter-section {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 20px;
}

.filter-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #555;
}

.filter-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 12px;
}

.filter-group {
  flex: 1;
  min-width: 140px;
}

.range-selector {
  display: flex;
  align-items: center;
  gap: 8px;
}

.range-selector input {
  flex: 1;
  padding: 8px 10px;
  width: 60px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 13px;
}

.range-divider {
  color: #777;
  font-size: 13px;
}

.apply-filter-button {
  padding: 8px 16px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
  font-size: 13px;
  margin-top: auto;
  align-self: flex-end;
}

.apply-filter-button:hover {
  background-color: #388e3c;
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
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
  cursor: pointer;
}

.apartment-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.apartment-image {
  width: 120px;
  height: 120px;
  flex-shrink: 0;
}

.apartment-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.apartment-card:hover .apartment-image img {
  transform: scale(1.05);
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

.apartment-price {
  margin-top: auto;
}

.price-value {
  font-size: 16px;
  font-weight: 700;
  color: #4caf50;
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
}
</style>
