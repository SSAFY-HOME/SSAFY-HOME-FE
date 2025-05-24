<!-- ContentPanel.vue -->
<template>
  <div class="content-panel" :class="{ active: activeMenu !== '' }">
    <div class="panel-header">
      <button class="close-button" @click="closePanel">
        <span class="close-icon">×</span>
      </button>
      <h2 class="panel-title">{{ getPanelTitle(activeMenu) }}</h2>
    </div>

    <div class="panel-content">
      <!-- 동적 컴포넌트 렌더링 -->
      <component
        :is="currentComponent"
        @show-on-map="$emit('show-on-map', $event)"
        @show-all-on-map="$emit('show-all-on-map', $event)"
        @view-listings="$emit('view-listings', $event)"
        @view-commerces="emit('view-commerces', $event)"
      />
    </div>
  </div>
</template>

<script setup>
import { watch } from 'vue'

// 프롭스 정의
const props = defineProps({
  activeMenu: {
    type: String,
    default: '',
  },
  currentComponent: {
    type: Object,
    default: null,
  },
})

// 이벤트 정의 - view-listings 이벤트 추가
const emit = defineEmits([
  'close-panel',
  'show-on-map',
  'show-all-on-map',
  'view-listings',
  'view-commerces',
])

// 패널 닫기 함수
const closePanel = () => {
  emit('close-panel')
}

// 메뉴에 따른 패널 제목 반환
const getPanelTitle = (menu) => {
  switch (menu) {
    case 'home':
      return '홈'
    case 'property':
      return '부동산 검색'
    case 'search':
      return '검색'
    case 'community':
      return '커뮤니티'
    case 'chatbot':
      return '챗봇'
    case 'menu':
      return '메뉴'
    case 'profile':
      return '마이페이지'
    default:
      return ''
  }
}

//패널이 활성화되거나 비활성화될 때 추가 동작이 필요하면 watch 사용
watch(
  () => props.activeMenu,
  (newValue) => {
    // 메뉴가 변경될 때 수행할 작업
    // 예: 특정 메뉴 선택 시 추가 데이터 로드 등
  },
)
</script>

<style scoped>
.content-panel {
  position: absolute;
  top: 0;
  left: 80px; /* 사이드바 너비에 맞춤 */
  height: 100%;
  width: 0;
  background-color: white;
  transition: width 0.3s ease;
  z-index: 90;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.content-panel.active {
  width: 520px; /* 패널 활성화 시 너비 */
}

.panel-header {
  display: flex;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #eee;
  height: 60px;
}

.close-button {
  background: none;
  border: none;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  cursor: pointer;
  border-radius: 50%;
  transition: background-color 0.2s ease;
}

.close-button:hover {
  background-color: #f5f5f5;
}

.close-icon {
  font-size: 24px;
  line-height: 1;
  color: #666;
}

.panel-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.panel-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

/* 매물 리스트 패널이 활성화되었을 때 조정 */
.content-panel.active.listing-active {
  left :200px;
  width: 420px; /* 매물 리스트 패널이 표시될 때 너비 조정 */
}

/* 반응형 스타일 */
@media (max-width: 768px) {
  .content-panel.active {
    width: calc(100% - 60px); /* 모바일에서는 거의 전체 화면 */
  }
}
</style>
