<template>
  <div class="content-panel" :class="{ active: activeMenu !== '' }">
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
      <h2>{{ getPanelTitle() }}</h2>
    </div>

    <div class="panel-content">
      <!-- 동적으로 컴포넌트 로드 -->
      <component
        :is="currentComponent"
        v-if="currentComponent"
        @showOnMap="handleShowOnMap"
        @showAllOnMap="handleShowAllOnMap"
      ></component>
    </div>
  </div>
</template>

<script setup>
// Props 정의
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

// Emits 정의
const emit = defineEmits(['close-panel', 'show-on-map', 'show-all-on-map'])

// 패널 닫기
const closePanel = () => {
  emit('close-panel')
}

// 패널 제목 가져오기
const getPanelTitle = () => {
  switch (props.activeMenu) {
    case 'home':
      return '내 ZIP'
    case 'search':
      return '메뉴 찾기'
    case 'property':
      return '매물 찾기'
    case 'community':
      return '커뮤니티'
    case 'chatbot':
      return 'AI 챗봇'
    case 'menu':
      return '메뉴'
    case 'profile':
      return '내 프로필'
    default:
      return ''
  }
}

// 지도 이벤트 핸들러
const handleShowOnMap = (apartmentInfo) => {
  emit('show-on-map', apartmentInfo)
}

const handleShowAllOnMap = (apartments) => {
  emit('show-all-on-map', apartments)
}
</script>

<style scoped>
/* 콘텐츠 패널 */
.content-panel {
  position: absolute;
  top: 0;
  right: 0;
  width: 420px;
  height: 100%;
  background-color: white;
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
  transform: translateX(100%);
  transition: transform 0.3s ease;
  z-index: 90;
  display: flex;
  flex-direction: column;
}

.content-panel.active {
  transform: translateX(0);
}

.panel-header {
  display: flex;
  align-items: center;
  padding: 16px;
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

.panel-header h2 {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.panel-content {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
}

/* 반응형 스타일 */
@media (max-width: 768px) {
  .content-panel {
    width: calc(100% - 80px);
  }
}
</style>
