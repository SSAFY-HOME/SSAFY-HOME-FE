<template>
  <div v-if="isVisible" class="logout-modal-overlay">
    <div class="logout-modal-content">
      <h3>로그아웃</h3>
      <p>{{ message }}</p>
      <button @click="handleClose">확인</button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
const props = defineProps({
  isVisible: {
    type: Boolean,
    required: true,
  },
  message: {
    type: String,
    default: '로그아웃이 성공적으로 완료되었습니다.',
  },
})

const emit = defineEmits(['close'])
import { watch } from 'vue'

// isVisible prop 변화 감지
watch(
  () => props.isVisible,
  (newValue) => {
    console.log('isVisible prop changed:', newValue)
  },
)

const handleClose = () => {
  emit('close')
  router.push('/login')
}
</script>

<style scoped>
.logout-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.logout-modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 400px;
  width: 100%;
  text-align: center;
}

.logout-modal-content h3 {
  margin-top: 0;
  margin-bottom: 10px;
  font-weight: 600;
  color: #333;
}

.logout-modal-content button {
  margin-top: 10px;
  padding: 8px 16px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.logout-modal-content button:hover {
  background-color: #45a049;
}
</style>
