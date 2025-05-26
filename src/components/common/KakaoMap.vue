<template>
  <div class="map-container" ref="mapContainer"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, defineExpose } from 'vue'
import { useMemberStore } from '@/stores/user'
import { kakaoAPI } from '@/api/commerce'
import { apartmentAPI } from '@/api/apartment'

const memberStore = useMemberStore()
const emit = defineEmits(['showOnMap', 'showAllOnMap'])

let currentInfoWindow = null // 현재 열린 인포윈도우 저장
let previousApartments = [] // 이전 아파트 목록 저장

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

// 가격 포맷팅 함수
const formatPrice = (price) => {
  if (!price || price < 0) return '-'

  const oku = Math.floor(price / 10000)
  const man = price % 10000

  if (oku === 0) {
    return `${man.toLocaleString()}만`
  } else if (man === 0) {
    return `${oku}억`
  } else {
    return `${oku}억 ${man.toLocaleString()}만`
  }
}

// 아파트 마커 생성 함수 (공통)
const createApartmentMarker = (apt, isHighlighted = false) => {
  const formattedPrice = formatPrice(apt.avgPrice)
  const width = isHighlighted ? 110 : 90
  const height = isHighlighted ? 65 : 55
  const fontSize = isHighlighted ? 13 : 11
  const subFontSize = isHighlighted ? 10 : 8
  const strokeWidth = isHighlighted ? 3 : 1
  const strokeColor = isHighlighted ? '#2E7D32' : '#4B8C3A'

  const markerSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height - 10}">
      <rect x="0" y="0" width="${width - 10}" height="${height - 15}" rx="8" ry="8"
            fill="#4B8C3A" stroke="${strokeColor}" stroke-width="${strokeWidth}" />
      <text x="${(width - 10) / 2}" y="${isHighlighted ? 18 : 15}" font-size="${fontSize}"
            fill="white" font-weight="bold" text-anchor="middle">
        ${formattedPrice}
      </text>
      <text x="${(width - 10) / 2}" y="${isHighlighted ? 35 : 30}" font-size="${subFontSize}"
            fill="#ddd" text-anchor="middle">
        ${apt.buildYear}년 준공
      </text>
    </svg>
  `

  const svgBase64 = btoa(unescape(encodeURIComponent(markerSvg)))
  const imageSrc = 'data:image/svg+xml;base64,' + svgBase64
  const imageSize = new window.kakao.maps.Size(width, height)
  const imageOption = { offset: new window.kakao.maps.Point(width / 2, height) }

  return new window.kakao.maps.MarkerImage(imageSrc, imageSize, imageOption)
}

// 상권 카테고리별 아이콘 매핑
const getCategoryIcon = (categoryCode) => {
  const iconMap = {
    MT1: '🏬', // 대형마트
    CS2: '🏪', // 편의점
    PS3: '🧸', // 어린이집, 유치원
    SC4: '🏫', // 학교
    AC5: '📚', // 학원
    PK6: '🅿️', // 주차장
    OL7: '⛽', // 주유소
    SW8: '🚇', // 지하철역
    BK9: '🏦', // 은행
    CT1: '🎭', // 문화시설
    AG2: '🏢', // 중개업소
    PO3: '🏛️', // 공공기관
    AT4: '🗺️', // 관광명소
    AD5: '🏨', // 숙박
    FD6: '🍽️', // 음식점
    CE7: '☕', // 카페
    HP8: '🏥', // 병원
    PM9: '💊', // 약국
  }
  return iconMap[categoryCode] || '📍'
}

// 상권 마커 생성 함수
const createCommerceMarker = (commerce) => {
  const icon = getCategoryIcon(commerce.category_group_code)

  const markerSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
      <rect x="2" y="2" width="36" height="36" rx="6" ry="6"
            fill="#2196F3" stroke="#1976D2" stroke-width="2" />
      <text x="20" y="28" font-size="18" text-anchor="middle">${icon}</text>
    </svg>
  `

  const svgBase64 = btoa(unescape(encodeURIComponent(markerSvg)))
  const imageSrc = 'data:image/svg+xml;base64,' + svgBase64
  const imageSize = new window.kakao.maps.Size(40, 40)
  const imageOption = { offset: new window.kakao.maps.Point(20, 40) }

  return new window.kakao.maps.MarkerImage(imageSrc, imageSize, imageOption)
}

/*
 * 단일 아파트 표시
 */

// 단일 아파트를 지도에 표시하는 함수
const showApartmentOnMap = (apartmentInfo) => {
  if (!kakaoMap) return

  // 기존 강조 마커가 있다면 원래 상태로 되돌림
  markers.forEach((m) => {
    if (m.type === 'apartment') {
      if (m.isHighlighted) {
        // 기존 강조 마커 제거
        m.marker.setMap(null)

        // 일반 마커로 다시 생성
        const defaultMarkerImage = createApartmentMarker(m, false)
        const newMarker = new window.kakao.maps.Marker({
          position: new window.kakao.maps.LatLng(m.latitude, m.longitude),
          image: defaultMarkerImage,
          map: kakaoMap,
        })

        // 기존 마커 정보 갱신
        m.marker = newMarker
        m.isHighlighted = false
      }
    }
  })

  // 현재 클릭된 마커는 다시 생성해서 강조
  const markerImage = createApartmentMarker(apartmentInfo, true)
  const position = new window.kakao.maps.LatLng(apartmentInfo.latitude, apartmentInfo.longitude)
  const marker = new window.kakao.maps.Marker({
    position,
    image: markerImage,
    map: kakaoMap,
  })

  // 새 마커로 교체
  const idx = markers.findIndex((m) => m.id === apartmentInfo.id && m.type === 'apartment')
  if (idx !== -1) {
    markers[idx].marker = marker
    markers[idx].isHighlighted = true
  }

  // 중심 이동
  const offsetX = -210
  const proj = kakaoMap.getProjection()
  const screenPoint = proj.containerPointFromCoords(position)
  screenPoint.x += offsetX
  const newPosition = proj.coordsFromContainerPoint(screenPoint)
  kakaoMap.setCenter(newPosition)

  // 단일 아파트용 깔끔한 인포윈도우 생성
  const singleAptInfoContent = `
      <div style="padding: 35px 15px; font-size: 9px; max-width: 350px; border-radius: 8px;">
        <div style="font-weight: bold; font-size: 13px; margin-bottom: 8px; color: #2E7D32;">
          ${apartmentInfo.name}
        </div>
        <div style="color: #666; margin-bottom: 4px; font-size: 12px;">
          📍 ${apartmentInfo.addr}
        </div>
        <div style="color: #4B8C3A; font-weight: bold; margin-bottom: 4px;">
          💰  평균가: ${formatPrice(apartmentInfo.avgPrice)}
        </div>
        <div style="color: #666; font-size: 12px;">
          🏗️ ${apartmentInfo.buildYear}년 준공
        </div>
      </div>
    `

  const singleAptInfoWindow = new window.kakao.maps.InfoWindow({
    content: singleAptInfoContent,
    removable: true,
    zIndex: 5,
  })

  // 마커 클릭 시 인포윈도우 토글
  window.kakao.maps.event.addListener(marker, 'click', () => {
    if (currentInfoWindow === singleAptInfoWindow) {
      // 이미 열려있으면 닫기
      singleAptInfoWindow.close()
      currentInfoWindow = null
    } else {
      // 기존 인포윈도우 닫기
      if (currentInfoWindow) {
        currentInfoWindow.close()
      }
      // 새 인포윈도우 열기
      singleAptInfoWindow.open(kakaoMap, marker)
      currentInfoWindow = singleAptInfoWindow
    }
  })

  // 마커 정보 저장
  markers.push({
    marker: marker,
    type: 'apartment',
    id: apartmentInfo.id,
    isHighlighted: true,
    infoWindow: singleAptInfoWindow,
  })
}

// 상권 정보를 지도에 표시하는 함수
const showCommerceOnMap = (commerceInfo) => {
  if (!kakaoMap) return

  console.log('상권정보', commerceInfo)

  // 기존 인포윈도우 닫기
  if (currentInfoWindow) {
    currentInfoWindow.close()
  }
}

/*
 * 여러 아파트 표시
 */

const showMultipleApartmentsOnMap = (apartments) => {
  if (!kakaoMap || !apartments || apartments.length === 0) return

  // 이전 아파트 목록 저장
  previousApartments = [...apartments]

  // ✅ emit 통해 상위 컴포넌트로 아파트 리스트 전달
  emit('showAllOnMap', apartments)

  // 기존 아파트 마커 제거
  clearMarkersByType('apartment')

  const bounds = new window.kakao.maps.LatLngBounds()

  apartments.forEach((apt) => {
    if (!apt.latitude || !apt.longitude) return

    const position = new window.kakao.maps.LatLng(apt.latitude, apt.longitude)

    // 일반 마커 이미지 생성
    const markerImage = createApartmentMarker(apt, false)

    // 마커 생성
    const marker = new window.kakao.maps.Marker({
      position: position,
      image: markerImage,
      map: kakaoMap,
    })

    // Hover용 인포윈도우
    const infoContent = `
      <div style="padding: 30px 10px; font-size: 11px; max-width: 320px;">
        <strong style="font-size: 13px;">${apt.name}</strong><br/>
        주소: ${apt.addr}<br/>
        평균가: ${formatPrice(apt.avgPrice)}<br/>
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
      console.log('[KakaoMap] 마커 클릭됨:', apt.name, apt.id)
      showApartmentOnMap(apt)
      emit('showOnMap', apt)
    })

    markers.push({
      marker: marker,
      type: 'apartment',
      id: apt.id,
      infoWindow: infoWindow,
      isHighlighted: false,
    })

    bounds.extend(position)
  })

  kakaoMap.setBounds(bounds)
}

// 이전 아파트 목록으로 돌아가기 함수
const returnToPreviousApartments = () => {
  if (previousApartments && previousApartments.length > 0) {
    showMultipleApartmentsOnMap(previousApartments)
  }
}

// 여러 상권을 지도에 표시하는 함수
const showMultipleCommercesOnMap = (commerces) => {
  if (!kakaoMap || !commerces || commerces.length === 0) return

  // 기존 상권 마커들 제거
  clearMarkersByType('commerce')

  // 모든 마커의 위치를 포함할 범위 객체
  const bounds = new window.kakao.maps.LatLngBounds()

  // 각 상권마다 마커 생성
  commerces.forEach((commerce) => {
    // 좌표 체크
    if (!commerce.y || !commerce.x) return

    // 새로운 정사각형 아이콘 마커 생성
    const markerImage = createCommerceMarker(commerce)

    // 새 마커 생성
    const position = new window.kakao.maps.LatLng(commerce.y, commerce.x)
    const marker = new window.kakao.maps.Marker({
      position: position,
      image: markerImage,
      map: kakaoMap,
    })

    // 인포윈도우 내용 생성
    const iwContent = `
      <div class="info-window commerce-info" style="padding: 20px 10px 30px 10px; max-width: 350px; font-size: 13px;">
        <div style="font-weight: bold; font-size: 14px; margin-bottom: 5px;">${commerce.place_name}</div>
        <div style="color: #2196f3; margin-bottom: 5px;">${commerce.category_name}</div>
        
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

      // 인포윈도우가 있고 현재 열린 인포윈도우라면 닫기
      if (markerInfo.infoWindow) {
        markerInfo.infoWindow.close()
        if (markerInfo.infoWindow === currentInfoWindow) {
          closeInfoWindow = true
        }
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
  returnToPreviousApartments, // 새로 추가된 함수
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
