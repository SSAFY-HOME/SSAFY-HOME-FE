<template>
  <!-- 등록 확인 모달 -->
  <div class="modal-overlay" v-if="show" @click="onCancel">
    <div class="modal-container" @click.stop>
      <div class="modal-header">
        <h3 class="modal-title">아파트 등록 확인</h3>
        <span class="modal-close" @click="onCancel">✕</span>
      </div>
      <div class="modal-body">
        <p>다음 아파트를 등록하시겠습니까?</p>
        <div class="confirm-apartment-info">
          <p class="apartment-name">{{ apartment ? apartment.name : '' }}</p>
          <p class="apartment-address">{{ apartment ? apartment.addr : '' }}</p>
          <p class="apartment-year">
            {{ apartment ? `${apartment.buildYear}년 준공` : '' }}
          </p>
        </div>
      </div>
      <div class="modal-footer">
        <button class="cancel-button" @click="onCancel">취소</button>
        <button class="confirm-button" @click="onConfirm">등록하기</button>
      </div>
    </div>
  </div>
</template>

<script setup>
// props 정의
const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  apartment: {
    type: Object,
    default: null,
  },
})

// 이벤트 정의
const emit = defineEmits(['cancel', 'confirm'])

// 메소드
const onCancel = () => {
  emit('cancel')
}

const onConfirm = () => {
  emit('confirm')
}
</script>

<style scoped>
/* 모달 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-container {
  background-color: #fff;
  border-radius: 5px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #eee;
}

.modal-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.modal-close {
  font-size: 20px;
  color: #999;
  cursor: pointer;
}

.modal-body {
  padding: 20px;
}

.confirm-apartment-info {
  background-color: #f9f9f9;
  border-radius: 5px;
  padding: 15px;
  margin-top: 10px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 15px 20px;
  border-top: 1px solid #eee;
}

.cancel-button {
  padding: 10px 15px;
  background-color: #f5f5f5;
  color: #555;
  border: none;
  border-radius: 5px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.cancel-button:hover {
  background-color: #e0e0e0;
}

.confirm-button {
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.confirm-button:hover {
  background-color: #388e3c;
}
</style>
