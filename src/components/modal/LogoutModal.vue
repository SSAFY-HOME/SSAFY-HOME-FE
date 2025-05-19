<template>
  <div v-if="isVisible" class="logout-modal-overlay" @click.self="handleOverlayClick">
    <div class="logout-modal-content">
      <h3>로그아웃</h3>
      <p>{{ message }}</p>
      <button @click="handleClose" class="confirm-button">확인</button>
    </div>
  </div>
</template>

<script setup>
defineProps({
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

import { useRouter } from 'vue-router'
const router = useRouter()

// Close when clicking the confirmation button
const handleClose = () => {
  emit('close')
}

// Allow closing by clicking outside the modal
const handleOverlayClick = () => {
  emit('close')
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
  z-index: 2000; /* Higher than header z-index */
}

.logout-modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 400px;
  width: 100%;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.logout-modal-content h3 {
  margin-top: 0;
  margin-bottom: 10px;
  font-weight: 600;
  color: #333;
}

.logout-modal-content p {
  margin-bottom: 20px;
  color: #555;
}

.confirm-button {
  margin-top: 10px;
  padding: 8px 20px;
  background-color: #82b06d;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: background-color 0.2s;
}

.confirm-button:hover {
  background-color: #6e9459;
}
</style>
