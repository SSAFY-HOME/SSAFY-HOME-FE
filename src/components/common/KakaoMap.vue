<template>
  <div class="map-container" ref="mapContainer"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, defineExpose } from 'vue'

// 지도 컨테이너 참조
const mapContainer = ref(null)

// 카카오 지도 및 마커 배열
let kakaoMap = null
let markers = []

// 지도 초기화 함수
const initializeMap = () => {
  if (window.kakao && window.kakao.maps) {
    // 지도 생성
    const options = {
      center: new window.kakao.maps.LatLng(37.5665, 126.978), // 서울 중심 좌표
      level: 5, // 확대 레벨
    }

    kakaoMap = new window.kakao.maps.Map(mapContainer.value, options)

    // 지도 크기 변경 시 리사이즈 이벤트 처리
    window.kakao.maps.event.addListener(kakaoMap, 'idle', () => {
      kakaoMap.relayout()
    })
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

// 단일 아파트를 지도에 표시하는 함수
const showApartmentOnMap = (apartmentInfo) => {
  if (!kakaoMap) return

  // 기존 마커들 제거
  clearMarkers()

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

  markers.push(marker)

  // 지도 중심 이동
  const offsetX = -210 // 왼쪽 패널 너비 + 여유 공간
  const proj = kakaoMap.getProjection()
  const screenPoint = proj.containerPointFromCoords(position)
  screenPoint.x += offsetX
  const newPosition = proj.coordsFromContainerPoint(screenPoint)
  kakaoMap.setCenter(newPosition)
  kakaoMap.setLevel(3) // 확대 수준 설정
}

// 여러 아파트를 지도에 표시하는 함수
const showMultipleApartmentsOnMap = (apartments) => {
  if (!kakaoMap || !apartments || apartments.length === 0) return

  // 기존 마커들 제거
  clearMarkers()

  // 모든 마커의 위치를 포함할 범위 객체
  const bounds = new window.kakao.maps.LatLngBounds()

  // 마커 이미지 설정
  const imageSrc = apartmentImg
  const imageSize = new window.kakao.maps.Size(40, 45)
  const imageOption = { offset: new window.kakao.maps.Point(27, 69) }
  const markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize, imageOption)

  // 각 아파트마다 마커 생성
  apartments.forEach((apt) => {
    if (!apt.latitude || !apt.longitude) return

    const position = new window.kakao.maps.LatLng(apt.latitude, apt.longitude)
    const marker = new window.kakao.maps.Marker({
      position: position,
      image: markerImage,
      map: kakaoMap,
    })

    markers.push(marker)

    // 마커 클릭 이벤트 추가
    window.kakao.maps.event.addListener(marker, 'click', () => {
      showApartmentOnMap(apt)
    })

    // bounds에 마커 위치 추가
    bounds.extend(position)
  })

  // 모든 마커를 포함하도록 지도 범위 조정
  kakaoMap.setBounds(bounds)
}

// 마커 제거 함수
const clearMarkers = () => {
  markers.forEach((marker) => marker.setMap(null))
  markers = []
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
  relayoutMap,
  clearMarkers,
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
