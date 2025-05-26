<template>
  <div class="map-container" ref="mapContainer"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, defineExpose } from 'vue'
import { useMemberStore } from '@/stores/user'
import { kakaoAPI } from '@/api/commerce'
import { apartmentAPI } from '@/api/apartment'

const memberStore = useMemberStore()

let currentInfoWindow = null // 현재 열린 인포윈도우 저장

// 지도 컨테이너 참조
const mapContainer = ref(null)

// 카카오 지도 및 마커 배열
let kakaoMap = null
let markers = []

// 지도 초기화 함수
const initializeMap = async () => {
  if (window.kakao && window.kakao.maps) {
    let centerLat = 37.5665
    let centerLng = 126.978
    // 지도 생성

    const apt = memberStore.apartment
    if (apt && apt.latitude && apt.longitude) {
      centerLat = apt.latitude
      centerLng = apt.longitude
    }
    const options = {
      center: new window.kakao.maps.LatLng(centerLat, centerLng), // 서울 중심 좌표
      level: 5, // 확대 레벨
    }

    kakaoMap = new window.kakao.maps.Map(mapContainer.value, options)

    // 지도 크기 변경 시 리사이즈 이벤트 처리
    window.kakao.maps.event.addListener(kakaoMap, 'idle', () => {
      kakaoMap.relayout()
    })

    // 초기 마커 표시
    await showInitialMarkers(apt?.dongCode)
  }
}

// 초기화 시 마커 표시 함수
const showInitialMarkers = async (dongCode) => {
  if (!dongCode) return

  try {
    // 아파트 불러오기
    const aptResult = await apartmentAPI.getApartments(dongCode)
    const apartments = aptResult.data
    showMultipleApartmentsOnMap(apartments)

    // 상권 불러오기
    const commerceResult = await kakaoAPI.searchNearbyCommerces({ dongCode })
    const commerces = commerceResult.data
    showMultipleCommercesOnMap(commerces)
  } catch (e) {
    console.error('초기 마커 표시 중 오류:', e)
  }
}

// 카카오 맵 스크립트 로드 함수
const loadKakaoMapScript = () => {
  return new Promise((resolve) => {
    if (window.kakao && window.kakao.maps) {
      resolve()
      return
    }

    const script = document.createElement('script')
    const apiKey = import.meta.env.VITE_KAKAO_MAP_API_KEY
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&autoload=false`
    script.onload = () => {
      window.kakao.maps.load(() => {
        resolve()
      })
    }
    document.head.appendChild(script)
  })
}

import apartmentImg from '@/assets/apartmentImg.svg'

/*
 * 단일 아파트 표시
 */

// 단일 아파트를 지도에 표시하는 함수
const showApartmentOnMap = (apartmentInfo) => {
  if (!kakaoMap) return

  // 상권 마커가 아닌 경우에만 기존 마커 제거
  if (!apartmentInfo.isCommerce) {
    // 상권 타입의 마커만 남기고 아파트 마커 제거
    clearMarkersByType('apartment')
  }

  // 아파트 정보인 경우
  if (!apartmentInfo.isCommerce) {
    console.log('아파트정보', apartmentInfo)
    // 마커 이미지 설정
    const imageSrc = apartmentImg
    const imageSize = new window.kakao.maps.Size(45, 50)
    const imageOption = { offset: new window.kakao.maps.Point(27, 69) }
    const markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize, imageOption)

    // 새 마커 생성
    const position = new window.kakao.maps.LatLng(apartmentInfo.latitude, apartmentInfo.longitude)
    const marker = new window.kakao.maps.Marker({
      position: position,
      image: markerImage,
      map: kakaoMap,
    })

    // 마커 정보 저장
    markers.push({
      marker: marker,
      type: 'apartment',
      id: apartmentInfo.id,
    })

    // 지도 중심 이동
    const offsetX = -210 // 왼쪽 패널 너비 + 여유 공간
    const proj = kakaoMap.getProjection()
    const screenPoint = proj.containerPointFromCoords(position)
    screenPoint.x += offsetX
    const newPosition = proj.coordsFromContainerPoint(screenPoint)
    kakaoMap.setCenter(newPosition)
    kakaoMap.setLevel(3) // 확대 수준 설정
  }
  // 상권 정보인 경우
  else {
    // 상권 마커 표시 로직
    showCommerceOnMap(apartmentInfo)
  }
}

// 상권 정보를 지도에 표시하는 함수
const showCommerceOnMap = (commerceInfo) => {
  if (!kakaoMap) return

  console.log('상권정보', commerceInfo)

  // 기존 인포윈도우 닫기
  if (currentInfoWindow) {
    currentInfoWindow.close()
  }

  // 상권 타입에 따른 마커 색상 설정 (임시 색상 배열)
  const categoryColors = {
    MT1: '#e74c3c', // 대형마트 - 빨강
    CS2: '#3498db', // 편의점 - 파랑
    PS3: '#f1c40f', // 어린이집, 유치원 - 노랑
    SC4: '#9b59b6', // 학교 - 보라
    AC5: '#2ecc71', // 학원 - 초록
    PK6: '#34495e', // 주차장 - 검정
    OL7: '#e67e22', // 주유소 - 주황
    SW8: '#1abc9c', // 지하철역 - 청록
    BK9: '#95a5a6', // 은행 - 회색
    CT1: '#8e44ad', // 문화시설 - 진보라
    AG2: '#d35400', // 중개업소 - 갈색
    PO3: '#27ae60', // 공공기관 - 진초록
    AT4: '#2980b9', // 관광명소 - 진파랑
    AD5: '#c0392b', // 숙박 - 진빨강
    FD6: '#f39c12', // 음식점 - 주황
    CE7: '#16a085', // 카페 - 진청록
    HP8: '#2c3e50', // 병원 - 진검정
    PM9: '#7f8c8d', // 약국 - 진회색
  }

  // 마커 색상 설정 (카테고리에 맞는 색상 또는 기본 파란색)
  const markerColor = categoryColors[commerceInfo.category_group_code] || '#2196f3'

  // 커스텀 마커 HTML 생성 (SVG 기반)
  const markerSvg = `
    <svg width="30" height="38" viewBox="0 0 30 38" xmlns="http://www.w3.org/2000/svg">
      <path d="M15 0C6.716 0 0 6.716 0 15C0 25.65 15 38 15 38C15 38 30 25.65 30 15C30 6.716 23.284 0 15 0Z" 
            fill="${markerColor}" />
      <circle cx="15" cy="15" r="6" fill="white" />
    </svg>
  `

  // SVG를 Base64로 인코딩
  const svgBase64 = btoa(markerSvg)

  // 마커 이미지 설정
  const imageSrc = 'data:image/svg+xml;base64,' + svgBase64
  const imageSize = new window.kakao.maps.Size(30, 38)
  const imageOption = { offset: new window.kakao.maps.Point(15, 38) }
  const markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize, imageOption)

  // 새 마커 생성
  const position = new window.kakao.maps.LatLng(
    commerceInfo.latitude || commerceInfo.y,
    commerceInfo.longitude || commerceInfo.x,
  )
  const marker = new window.kakao.maps.Marker({
    position: position,
    image: markerImage,
    map: kakaoMap,
  })

  // 인포윈도우 내용 생성
  const iwContent = `
    <div class="info-window commerce-info" style="padding: 10px 10px 21px 10px; max-width: 250px; font-size: 13px;">
      <div style="font-weight: bold; font-size: 14px; margin-bottom: 5px;">${commerceInfo.name || commerceInfo.place_name}</div>
      <div style="color: #2196f3; margin-bottom: 5px;">${commerceInfo.category || commerceInfo.category_name}</div>
      <div style="color: #666; margin-bottom: 5px;"></div>
      <div style="color: #666;"></div>
      ${commerceInfo.place_url ? `<div style="margin-top: 8px;"><a href="${commerceInfo.place_url}" target="_blank" style="color: #2196f3; text-decoration: none;">상세정보 보기</a></div>` : ''}
    </div>
  `

  // 인포윈도우 생성
  const infoWindow = new window.kakao.maps.InfoWindow({
    content: iwContent,
    removable: true,
  })

  // 인포윈도우 즉시 표시
  infoWindow.open(kakaoMap, marker)
  currentInfoWindow = infoWindow

  // 마커 클릭 이벤트 추가
  window.kakao.maps.event.addListener(marker, 'click', () => {
    // 기존 인포윈도우 닫기
    if (currentInfoWindow) {
      currentInfoWindow.close()
    }

    // 새 인포윈도우 열기
    infoWindow.open(kakaoMap, marker)
    currentInfoWindow = infoWindow
  })

  // 마커 정보 저장
  markers.push({
    marker: marker,
    infoWindow: infoWindow,
    type: 'commerce',
    id: commerceInfo.id,
  })

  // 지도 중심 이동
  const offsetX = 190 // 오른쪽 패널 너비의 절반 (상권 패널이 오른쪽에 있을 경우)
  const proj = kakaoMap.getProjection()
  const screenPoint = proj.containerPointFromCoords(position)
  screenPoint.x -= offsetX
  const newPosition = proj.coordsFromContainerPoint(screenPoint)
  kakaoMap.setCenter(newPosition)
  kakaoMap.setLevel(3) // 확대 수준 설정
}
/*
 * 여러 아파트 표시
 */

// 여러 아파트를 지도에 표시하는 함수
// const showMultipleApartmentsOnMap = (apartments) => {
//   if (!kakaoMap || !apartments || apartments.length === 0) return

//   // 기존 아파트 마커들 제거
//   clearMarkersByType('apartment')

//   // 모든 마커의 위치를 포함할 범위 객체
//   const bounds = new window.kakao.maps.LatLngBounds()

//   // 마커 이미지 설정
//   const imageSrc = apartmentImg
//   const imageSize = new window.kakao.maps.Size(40, 45)
//   const imageOption = { offset: new window.kakao.maps.Point(27, 69) }
//   const markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize, imageOption)

//   // 각 아파트마다 마커 생성
//   apartments.forEach((apt) => {
//     if (!apt.latitude || !apt.longitude) return

//     const position = new window.kakao.maps.LatLng(apt.latitude, apt.longitude)
//     const marker = new window.kakao.maps.Marker({
//       position: position,
//       image: markerImage,
//       map: kakaoMap,
//     })

//     // 마커 정보 저장
//     markers.push({
//       marker: marker,
//       type: 'apartment',
//       id: apt.id,
//     })

//     // 마커 클릭 이벤트 추가
//     window.kakao.maps.event.addListener(marker, 'click', () => {
//       showApartmentOnMap(apt)
//     })

//     // bounds에 마커 위치 추가
//     bounds.extend(position)
//   })

//   // 모든 마커를 포함하도록 지도 범위 조정
//   kakaoMap.setBounds(bounds)
// }
// 💡 emit 추가를 위해 defineEmits 선언 필요
const emit = defineEmits(['showAllOnMap'])
const formatPrice = (price) => {
  if (!price) return '-'
  const oku = Math.floor(price / 10000)
  const man = price % 10000
  return man === 0 ? `${oku}억` : `${oku}억 ${man.toLocaleString()}`
}

const showMultipleApartmentsOnMap = (apartments) => {
  if (!kakaoMap || !apartments || apartments.length === 0) return

  // ✅ emit 통해 상위 컴포넌트로 아파트 리스트 전달
  emit('showAllOnMap', apartments)

  // 기존 아파트 마커 제거
  clearMarkersByType('apartment')

  const bounds = new window.kakao.maps.LatLngBounds()

  apartments.forEach((apt) => {
    if (!apt.latitude || !apt.longitude) return

    const position = new window.kakao.maps.LatLng(apt.latitude, apt.longitude)

    // 💡 가격 + 준공년 SVG 마커 만들기
    const formattedPrice = formatPrice(apt.avgPrice)
    const markerSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="90" height="55" viewBox="0 0 90 45">
    <rect x="0" y="0" width="80" height="40" rx="6" ry="6" fill="#4B8C3A" />
    <text x="40" y="15" font-size="11" fill="white" font-weight="bold" text-anchor="middle" >
      ${formattedPrice}
    </text>
    <text x="40" y="30" font-size="8" fill="#ddd" text-anchor="middle">
      ${apt.buildYear}년 준공
    </text>
  </svg>
`

    const svgBase64 = btoa(unescape(encodeURIComponent(markerSvg)))
    const imageSrc = 'data:image/svg+xml;base64,' + svgBase64
    const imageSize = new window.kakao.maps.Size(90, 45)
    const imageOption = { offset: new window.kakao.maps.Point(45, 45) }
    const markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize, imageOption)

    // 마커 생성
    const marker = new window.kakao.maps.Marker({
      position: position,
      image: markerImage,
      map: kakaoMap,
    })

    // Hover용 인포윈도우
    const infoContent = `
      <div style="padding: 20px; font-size: 11px; max-width: 280px;">
        <strong style="font-size: 13px;">${apt.name}</strong><br/>
        주소: ${apt.addr}<br/>
        평균가: ${formattedPrice}<br/>
        준공년도: ${apt.buildYear}<br/>
        도로명 주소: ${apt.roadNmSggCd || ''}<br/>
      </div>
    `
    const infoWindow = new window.kakao.maps.InfoWindow({
      content: infoContent,
      removable: false,
      zIndex: 3,
      yAnchor: 3.5,
    })

    window.kakao.maps.event.addListener(marker, 'mouseover', () => {
      infoWindow.open(kakaoMap, marker)
    })
    window.kakao.maps.event.addListener(marker, 'mouseout', () => {
      infoWindow.close()
    })

    window.kakao.maps.event.addListener(marker, 'click', () => {
      showApartmentOnMap(apt)
    })

    markers.push({
      marker: marker,
      type: 'apartment',
      id: apt.id,
      infoWindow: infoWindow,
    })

    bounds.extend(position)
  })

  kakaoMap.setBounds(bounds)
}

// 여러 상권을 지도에 표시하는 함수 (추가)
const showMultipleCommercesOnMap = (commerces) => {
  if (!kakaoMap || !commerces || commerces.length === 0) return

  // 기존 상권 마커들 제거
  clearMarkersByType('commerce')

  // 모든 마커의 위치를 포함할 범위 객체
  const bounds = new window.kakao.maps.LatLngBounds()

  // 상권 타입에 따른 마커 색상 설정
  const categoryColors = {
    MT1: '#e74c3c', // 대형마트 - 빨강
    CS2: '#3498db', // 편의점 - 파랑
    PS3: '#f1c40f', // 어린이집, 유치원 - 노랑
    SC4: '#9b59b6', // 학교 - 보라
    AC5: '#2ecc71', // 학원 - 초록
    PK6: '#34495e', // 주차장 - 검정
    OL7: '#e67e22', // 주유소 - 주황
    SW8: '#1abc9c', // 지하철역 - 청록
    BK9: '#95a5a6', // 은행 - 회색
    CT1: '#8e44ad', // 문화시설 - 진보라
    AG2: '#d35400', // 중개업소 - 갈색
    PO3: '#27ae60', // 공공기관 - 진초록
    AT4: '#2980b9', // 관광명소 - 진파랑
    AD5: '#c0392b', // 숙박 - 진빨강
    FD6: '#f39c12', // 음식점 - 주황
    CE7: '#16a085', // 카페 - 진청록
    HP8: '#2c3e50', // 병원 - 진검정
    PM9: '#7f8c8d', // 약국 - 진회색
  }

  // 각 상권마다 마커 생성
  commerces.forEach((commerce) => {
    // 좌표 체크
    if (!commerce.y || !commerce.x) return

    // 마커 색상 설정 (카테고리에 맞는 색상 또는 기본 파란색)
    const markerColor = categoryColors[commerce.category_group_code] || '#2196f3'

    // 커스텀 마커 HTML 생성 (SVG 기반)
    const markerSvg = `
      <svg width="30" height="38" viewBox="0 0 30 38" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 0C6.716 0 0 6.716 0 15C0 25.65 15 38 15 38C15 38 30 25.65 30 15C30 6.716 23.284 0 15 0Z" 
              fill="${markerColor}" />
        <circle cx="15" cy="15" r="6" fill="white" />
      </svg>
    `

    // SVG를 Base64로 인코딩
    const svgBase64 = btoa(markerSvg)

    // 마커 이미지 설정
    const imageSrc = 'data:image/svg+xml;base64,' + svgBase64
    const imageSize = new window.kakao.maps.Size(30, 38)
    const imageOption = { offset: new window.kakao.maps.Point(15, 38) }
    const markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize, imageOption)

    // 새 마커 생성
    const position = new window.kakao.maps.LatLng(commerce.y, commerce.x)
    const marker = new window.kakao.maps.Marker({
      position: position,
      image: markerImage,
      map: kakaoMap,
    })

    // 인포윈도우 내용 생성
    const iwContent = `
      <div class="info-window commerce-info" style="padding: 10px; max-width: 250px; font-size: 13px;">
        <div style="font-weight: bold; font-size: 14px; margin-bottom: 5px;">${commerce.place_name}</div>
        <div style="color: #2196f3; margin-bottom: 5px;">${commerce.category_name}</div>
        <div style="color: #666; margin-bottom: 5px;"></div>
        <div style="color: #666;"></div>}
        ${commerce.place_url ? `<div style="margin-top: 8px;"><a href="${commerce.place_url}" target="_blank" style="color: #2196f3; text-decoration: none;">상세정보 보기</a></div>` : ''}
      </div>
    `

    // 인포윈도우 생성
    const infoWindow = new window.kakao.maps.InfoWindow({
      content: iwContent,
      removable: true,
    })

    // 마커 클릭 이벤트 추가
    window.kakao.maps.event.addListener(marker, 'click', () => {
      // 기존 인포윈도우 닫기
      if (currentInfoWindow) {
        currentInfoWindow.close()
      }

      // 새 인포윈도우 열기
      infoWindow.open(kakaoMap, marker)
      currentInfoWindow = infoWindow
    })

    // 마커 정보 저장
    markers.push({
      marker: marker,
      infoWindow: infoWindow,
      type: 'commerce',
      id: commerce.id,
    })

    // bounds에 마커 위치 추가
    bounds.extend(position)
  })

  // 모든 마커를 포함하도록 지도 범위 조정
  if (commerces.length > 0) {
    kakaoMap.setBounds(bounds)
  }
}

// 모든 마커 제거 함수
const clearMarkers = () => {
  markers.forEach((markerInfo) => {
    markerInfo.marker.setMap(null)
    if (markerInfo.infoWindow) {
      markerInfo.infoWindow.close()
    }
  })
  markers = []
  currentInfoWindow = null
}

// 특정 타입의 마커만 제거하는 함수 (아파트/상권 구분 시)
const clearMarkersByType = (type) => {
  if (!markers || markers.length === 0) return

  // 닫아야 할 인포윈도우가 있는지 확인
  let closeInfoWindow = false

  // 특정 타입의 마커만 제거하고 배열에서 필터링
  markers = markers.filter((markerInfo) => {
    if (markerInfo.type === type) {
      markerInfo.marker.setMap(null)

      // 인포윈도우가 있고 현재 열린 인포윈도우라면 닫기 플래그 설정
      if (markerInfo.infoWindow && markerInfo.infoWindow === currentInfoWindow) {
        closeInfoWindow = true
      }

      return false
    }
    return true
  })

  // 필요한 경우 현재 인포윈도우 초기화
  if (closeInfoWindow) {
    currentInfoWindow = null
  }
}

// 지도 재배치 함수
const relayoutMap = () => {
  if (kakaoMap) {
    kakaoMap.relayout()
  }
}

// 컴포넌트 마운트 시 지도 초기화
onMounted(async () => {
  try {
    await loadKakaoMapScript()
    initializeMap()

    // 윈도우 리사이즈 이벤트 처리
    window.addEventListener('resize', relayoutMap)
  } catch (error) {
    console.error('카카오 지도 로드 중 오류 발생:', error)
  }
})

// 컴포넌트 언마운트 시 이벤트 리스너 제거
onUnmounted(() => {
  window.removeEventListener('resize', relayoutMap)
})

// 외부에서 접근 가능한 메소드 노출
defineExpose({
  showApartmentOnMap,
  showMultipleApartmentsOnMap,
  showCommerceOnMap,
  showMultipleCommercesOnMap,
  relayoutMap,
  clearMarkers,
  clearMarkersByType,
})
</script>

<style scoped>
/* 지도 컨테이너 */
.map-container {
  flex: 1; /* 남은 공간 모두 차지 */
  height: 100%;
  background-color: #f8f8f8;
}
</style>
