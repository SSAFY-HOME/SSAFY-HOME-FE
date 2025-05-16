<template>
  <AppHeader />
  <div class="apartment-registration-page">
    <div class="page-container">
      <h1 class="page-title">아파트 등록</h1>

      <!-- 아파트 검색 섹션 -->
      <div class="search-section">
        <h2 class="section-title">아파트 검색</h2>
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
                <div
                  class="dropdown-item empty"
                  v-if="provinces.length === 0 && !isLoadingProvinces"
                >
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
                <div
                  class="dropdown-item empty"
                  v-if="districts.length === 0 && !isLoadingDistricts"
                >
                  데이터가 없습니다
                </div>
              </div>
            </div>
          </div>

          <button class="search-button" @click="searchApartments" :disabled="!selectedDistrict">
            <span class="button-text">검색</span>
          </button>
        </div>
      </div>

      <!-- 선택된 아파트 등록 섹션 -->
      <div class="registration-section" v-if="selectedApartment">
        <h3 class="registration-title">선택된 아파트</h3>
        <div class="selected-apartment-info">
          <h4 class="apartment-name">{{ selectedApartment.name }}</h4>
          <p class="apartment-address">{{ selectedApartment.addr }}</p>
          <div class="apartment-details">
            <span class="detail-item">{{ selectedApartment.buildYear }}년 준공</span>
            <span class="detail-item">도로명 {{ selectedApartment.roadNmSggCd }}</span>
          </div>
        </div>
        <button class="register-button" @click="registerApartment">이 아파트 등록하기</button>
      </div>

      <!-- 검색 결과 섹션 -->
      <div class="results-section" v-if="searchPerformed">
        <div class="results-header">
          <h3 class="results-title">검색 결과 ({{ apartments.length }}건)</h3>
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
            :class="{
              selected: selectedApartment && selectedApartment.id === apartment.id,
            }"
            @click="selectApartment(apartment)"
          >
            <div class="apartment-info">
              <h3 class="apartment-name">{{ apartment.name }}</h3>
              <p class="apartment-address">{{ apartment.addr }}</p>
              <div class="apartment-details">
                <span class="detail-item">{{ apartment.buildYear }}년 준공</span>
                <span class="detail-item">도로명 {{ apartment.roadNmSggCd }}</span>
              </div>
            </div>
            <div
              class="selection-indicator"
              v-if="selectedApartment && selectedApartment.id === apartment.id"
            >
              <span class="checkmark">✓</span>
            </div>
          </div>
        </div>
      </div>
      <RegistHomeModal
        :show="showConfirmModal"
        :apartment="selectedApartment"
        @cancel="cancelRegistration"
        @confirm="confirmRegistration"
      />
    </div>
  </div>
</template>

<script setup>
import AppHeader from '@/components/common/Header.vue'
import RegistHomeModal from '@/components/modal/RegistHomeModal.vue' // 모달 컴포넌트

import { ref, watch, onMounted } from 'vue'
import { apartmentAPI } from '@/api/apartment' // 기존 코드에서 API import 유지

// 상태 관리
const provinces = ref([])
const cities = ref([])
const districts = ref([])
const apartments = ref([])

const selectedProvince = ref('')
const selectedCity = ref('')
const selectedDistrict = ref('')
const selectedApartment = ref(null)

const provinceDropdownOpen = ref(false)
const cityDropdownOpen = ref(false)
const districtDropdownOpen = ref(false)

const isLoadingProvinces = ref(false)
const isLoadingCities = ref(false)
const isLoadingDistricts = ref(false)
const isLoadingApartments = ref(false)
const searchPerformed = ref(false)

// 정렬 옵션
const sortOption = ref('year_desc')

// 모달 & 알림 상태
const showConfirmModal = ref(false)
const registrationComplete = ref(false)

// Vue 컴포넌트 내부 함수
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

const fetchApartments = async (districtId) => {
  if (!districtId) return

  isLoadingApartments.value = true
  try {
    const result = await apartmentAPI.getApartments(districtId)
    apartments.value = result.data
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
  searchPerformed.value = false
  selectedApartment.value = null
}

const selectCity = (city) => {
  selectedCity.value = city.name
  selectedDistrict.value = ''
  fetchDistricts(city.id)
  cityDropdownOpen.value = false
  searchPerformed.value = false
  selectedApartment.value = null
}

const selectDistrict = (district) => {
  selectedDistrict.value = district.name
  districtDropdownOpen.value = false
  searchPerformed.value = false
  selectedApartment.value = null
}

const searchApartments = () => {
  if (!selectedDistrict.value) return

  // districts 배열에서 선택된 동의 ID 찾기
  const selectedDistrictObj = districts.value.find((d) => d.name === selectedDistrict.value)
  if (selectedDistrictObj) {
    fetchApartments(selectedDistrictObj.id)
    searchPerformed.value = true
    selectedApartment.value = null
  }
}

// 아파트 선택 및 등록 함수
const selectApartment = (apartment) => {
  selectedApartment.value = apartment
  // 등록 섹션으로 스크롤
  setTimeout(() => {
    const registrationSection = document.querySelector('.search-section')
    if (registrationSection) {
      registrationSection.scrollIntoView({ behavior: 'smooth' })
    }
  }, 100)
}

const registerApartment = () => {
  showConfirmModal.value = true
}

import { memberAPI } from '@/api/member'
import { useRouter } from 'vue-router'
const router = useRouter()

const confirmRegistration = async () => {
  const aptData = {
    aptSeq: selectedApartment.value.aptSeq,
  }
  try {
    await memberAPI.registHome(aptData)
    showConfirmModal.value = false
    registrationComplete.value = true
    router.push('/mypage')
  } catch (err) {
    alert('홈 등록 중 오류가 발생했습니다.')
    console.error(err)
  }
}

const cancelRegistration = () => {
  showConfirmModal.value = false
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
  selectedApartment.value = null
})

watch(selectedCity, () => {
  districts.value = []
  selectedDistrict.value = ''
  searchPerformed.value = false
  selectedApartment.value = null
})

watch(selectedDistrict, () => {
  searchPerformed.value = false
  selectedApartment.value = null
})

// 정렬 옵션 변경 감시
watch(sortOption, () => {
  // 정렬 옵션에 따른 데이터 정렬
  if (apartments.value.length > 0) {
    apartments.value = [...apartments.value].sort((a, b) => {
      switch (sortOption.value) {
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
.apartment-registration-page {
  font-family:
    'Pretendard',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    sans-serif;
  color: #333;
  background-color: #ffffff;
  min-height: 100vh;
}

.page-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 30px 20px;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: #333;
  margin-bottom: 30px;
  text-align: center;
  position: relative;
  padding-bottom: 15px;
}

/* 제목 아래 초록색 줄 추가 */
.page-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 150px;
  height: 3px;
  background-color: #4caf50;
  border-radius: 5px;
}

/* 섹션 스타일 */
.search-section,
.results-section,
.registration-section {
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 25px;
  margin-bottom: 30px;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #333;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}

/* 검색 폼 */
.search-form {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.search-group {
  display: flex;
  flex-direction: column;
}

label {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 8px;
  color: #555;
}

.dropdown-container {
  position: relative;
}

.selected-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #fff;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
}

.selected-option:hover {
  border-color: #4caf50;
}

.selected-option.disabled {
  background-color: #f5f5f5;
  color: #aaa;
  cursor: not-allowed;
  border-color: #ddd;
}

.dropdown-container.active .selected-option {
  border-color: #4caf50;
  box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
}

.dropdown-arrow {
  font-size: 12px;
  color: #888;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  max-height: 250px;
  overflow-y: auto;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  z-index: 100;
  margin-top: 5px;
}

.dropdown-item {
  padding: 10px 15px;
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
  padding: 15px;
}

.search-button {
  grid-column: 1 / -1;
  padding: 14px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
  font-size: 15px;
}

.search-button:hover {
  background-color: #388e3c;
}

.search-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

/* 검색 결과 */
.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.results-title {
  font-size: 18px;
  font-weight: 600;
}

.sort-options select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
  background-color: #fff;
  cursor: pointer;
}

.loading-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 50px 0;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #4caf50;
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
  margin-top: 15px;
  color: #666;
}

.no-results {
  text-align: center;
  padding: 50px 0;
  color: #666;
  background-color: #f9f9f9;
  border-radius: 5px;
}

.no-results-sub {
  font-size: 14px;
  color: #888;
  margin-top: 10px;
}

.apartment-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.apartment-card {
  position: relative;
  border-radius: 5px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  background-color: #fff;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
  cursor: pointer;
  border: 2px solid transparent;
}

.apartment-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.apartment-card.selected {
  border-color: #4caf50;
  box-shadow: 0 5px 15px rgba(76, 175, 80, 0.2);
}

.apartment-image {
  height: 180px;
  overflow: hidden;
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
  padding: 15px;
}

.apartment-name {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 5px;
  color: #333;
}

.apartment-address {
  font-size: 14px;
  color: #666;
  margin-bottom: 10px;
}

.apartment-details {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.detail-item {
  font-size: 12px;
  background-color: #f5f5f5;
  padding: 4px 10px;
  border-radius: 5px;
  color: #555;
}

.selection-indicator {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 30px;
  height: 30px;
  background-color: #4caf50;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.checkmark {
  color: white;
  font-weight: bold;
}

/* 등록 섹션 */
.registration-section {
  background-color: #f9fff9;
  border: 1px solid #e0f0e0;
}

.registration-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 15px;
}

.selected-apartment-info {
  background-color: #fff;
  border-radius: 5px;
  padding: 15px;
  margin-bottom: 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.register-button {
  width: 100%;
  padding: 15px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.register-button:hover {
  background-color: #388e3c;
}

@keyframes slideIn {
  from {
    transform: translateY(100vh);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
/* 반응형 스타일 */
@media (max-width: 768px) {
  .search-form {
    grid-template-columns: 1fr;
  }

  .apartment-list {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .apartment-card {
    display: flex;
    flex-direction: column;
  }

  .apartment-image {
    height: 200px;
  }

  .modal-container {
    width: 95%;
  }
}
</style>
