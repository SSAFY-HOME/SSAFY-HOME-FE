<!-- ChatPanel.vue -->
<template>
  <div v-if="!isLoggedIn" class="login-required-container">
    <div class="login-icon">
      <img src="@/assets/toLogin-icon.png" alt="toLogin Icon" class="toLogin-icon" />
    </div>
    <h2 class="login-title">로그인이 필요합니다</h2>
    <p class="login-message">채팅 서비스를 이용하려면 로그인해주세요.</p>
    <button class="login-button" @click="goToLogin">로그인 하기</button>
  </div>
  <div v-else class="chat-container">
    <h3 class="section-title">아파트 정보 채팅</h3>

    <div class="chat-panel">
      <!-- 채팅 메시지 표시 영역 -->
      <div class="chat-messages" ref="chatMessagesContainer">
        <div class="loading-indicator" v-if="isLoadingMessages">
          <div class="spinner"></div>
          <p>채팅 내용을 불러오는 중...</p>
        </div>

        <div class="no-messages" v-if="messages.length === 0 && !isLoadingMessages">
          <p>아직 대화 내용이 없습니다.</p>
          <p class="no-messages-sub">첫 메시지를 보내보세요!</p>
        </div>

        <div class="message-list" v-if="messages.length > 0">
          <div
            v-for="message in messages"
            :key="message.id"
            :class="['message-bubble', message.senderType.toLowerCase()]"
          >
            <div class="message-content">
              <div class="message-header">
                <span class="sender-name">{{
                  message.senderType === 'USER' ? '나' : 'AI 비서'
                }}</span>
                <span class="message-time">{{ formatDate(message.timestamp) }}</span>
              </div>
              <p class="message-text">{{ message.message }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 채팅 입력 영역 -->
      <div class="chat-input-area">
        <textarea
          class="chat-input"
          v-model="newMessage"
          placeholder="아파트 관련 질문을 입력하세요..."
          @keydown.enter.prevent="sendMessage"
          :disabled="isSending"
          rows="3"
        ></textarea>
        <button
          class="send-button"
          @click="sendMessage"
          :disabled="!newMessage.trim() || isSending"
        >
          <span class="button-icon">📤</span>
          <span class="button-text">전송</span>
        </button>
      </div>

      <!-- 전송 중 표시 -->
      <div class="sending-indicator" v-if="isSending">
        <div class="spinner small"></div>
        <span>메시지 전송 중...</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'

// 상태 관리
const router = useRouter()
const isLoggedIn = ref(false)
const isLoadingMessages = ref(false)
const isSending = ref(false)
const newMessage = ref('')
const messages = ref([])
const chatMessagesContainer = ref(null)

// API 관련 설정 (실제 구현 시 import 해야 함)
// import { chatAPI } from '@/api/chat'

// 초기 데이터 로드 및 추가 메시지 예시 (더 많은 메시지 표시용)
const fetchChatMessages = async () => {
  isLoadingMessages.value = true

  try {
    // 실제 환경에서는 API 호출로 대체
    // const response = await chatAPI.getMessages()
    // messages.value = response.data

    // 예시 데이터 사용 (테스트용) - 더 많은 메시지로 채워넣기
    messages.value = [
      {
        id: 1,
        senderType: 'USER',
        message: '안녕하세요, 아파트 정보를 알려주세요.',
        timestamp: '2025-05-15',
      },
      {
        id: 2,
        senderType: 'AI',
        message:
          '안녕하세요! 어떤 아파트 정보가 필요하신가요? 특정 지역이나 아파트 이름을 알려주시면 도움드릴 수 있습니다.',
        timestamp: '2025-05-15',
      },
      {
        id: 3,
        senderType: 'USER',
        message: '풍암동 아파트 거래현황에 대해 알려줘',
        timestamp: '2025-05-16',
      },
      {
        id: 4,
        senderType: 'AI',
        message:
          '현재 제 지식 기반에는 풍암동 아파트 거래현황에 대한 구체적인 정보가 없습니다. 하지만 부동산 시장에 대해 일반적으로 말씀드리자면, 아파트 거래는 해당 지역의 경제 상황, 인프라 개발, 교통 편의성, 그리고 주변 환경에 많은 영향을 받습니다. 만약 풍암동의 특정한 정보를 원하신다면, 지역 부동산 중개인이나 관련 부동산 정보 플랫폼을 통해 최신 데이터를 확인하시는 것이 좋습니다.',
        timestamp: '2025-05-16',
      },
      {
        id: 5,
        senderType: 'USER',
        message: '풍암동에서 가장 인기 있는 아파트는 어디인가요?',
        timestamp: '2025-05-16',
      },
      {
        id: 6,
        senderType: 'AI',
        message:
          "풍암동에서 인기 있는 아파트는 일반적으로 교통 접근성, 학군, 편의시설 접근성 등에 따라 달라집니다. 주민들 사이에서는 '진태크리스타피아', '대주아파트', '풍암호수타운' 등이 자주 언급됩니다. 하지만 가장 최신 인기 동향은 실시간으로 바뀔 수 있으니, 정확한 정보는 부동산 앱이나 지역 중개사무소를 통해 확인하시는 것이 좋겠습니다.",
        timestamp: '2025-05-16',
      },
    ]
  } catch (error) {
    console.error('채팅 내용을 불러오는 중 오류가 발생했습니다:', error)
    messages.value = []
  } finally {
    isLoadingMessages.value = false
    scrollToBottom()
  }
}

import { chatAPI } from '@/api/chat' // 실제 API 호출을 위한 import

// 메시지 전송
const sendMessage = async () => {
  if (!newMessage.value.trim() || isSending.value) return

  isSending.value = true

  try {
    const userMessageText = newMessage.value.trim()

    // 사용자 메시지 추가 (UI 즉시 반영)
    const userMessage = {
      id: Date.now(), // 임시 ID (실제로는 서버에서 할당)
      senderType: 'USER',
      message: userMessageText,
      timestamp: new Date().toISOString().split('T')[0],
    }

    messages.value.push(userMessage)
    newMessage.value = ''
    scrollToBottom()

    // 채팅 API 호출
    const response = await chatAPI.sendMessage({ message: userMessageText })

    // AI 응답 (테스트용)
    const aiMessage = {
      id: Date.now() + 1, // 임시 ID
      senderType: 'AI',
      message:
        '죄송합니다만, 현재 해당 지역의 최신 거래 정보를 제공해드리기 어렵습니다. 정확한 정보를 원하시면 국토교통부 실거래가 공개시스템이나 한국부동산원의 부동산통계정보시스템을 확인해보시는 것이 좋겠습니다.',
      timestamp: new Date().toISOString().split('T')[0],
    }

    messages.value.push(aiMessage)
    scrollToBottom()
  } catch (error) {
    console.error('메시지 전송 중 오류가 발생했습니다:', error)
    alert('메시지 전송에 실패했습니다. 다시 시도해주세요.')
  } finally {
    isSending.value = false
  }
}

// 채팅창 하단으로 스크롤
const scrollToBottom = async () => {
  await nextTick()
  if (chatMessagesContainer.value) {
    chatMessagesContainer.value.scrollTop = chatMessagesContainer.value.scrollHeight
  }
}

// 로그인 페이지로 이동
const goToLogin = () => router.push('/login')

// 날짜 포맷팅
const formatDate = (dateString) => {
  if (!dateString) return ''

  const date = new Date(dateString)
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())

  // 오늘이면 시간만 표시
  if (messageDate.getTime() === today.getTime()) {
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    return `오늘 ${hours}:${minutes}`
  }

  // 그 외에는 날짜 전체 표시
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

// 로그인 상태 확인
const checkLoginStatus = () => {
  const token = localStorage.getItem('accessToken')
  isLoggedIn.value = !!token

  if (isLoggedIn.value) {
    fetchChatMessages()
  }
}

// 컴포넌트 마운트 시 초기화
onMounted(() => {
  checkLoginStatus()
})

// 새 메시지가 있을 때마다 스크롤
watch(messages, () => {
  scrollToBottom()
})
</script>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
}

.chat-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 700px;
  max-height: 800px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #333;
}

/* 로그인이 필요한 경우 스타일 */
.login-required-container {
  background-color: white;
  border-radius: 12px;
  width: 100%;
  max-width: 400px;
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  box-shadow: 0 4px 5px rgba(0, 0, 0, 0.08);
  animation: fadeIn 0.5s ease;
}

.login-icon {
  margin-bottom: 20px;
  color: #888;
}

.toLogin-icon {
  height: 200px;
  width: 200px;
  transition: transform 0.3s ease;
}

.login-icon:hover .toLogin-icon {
  transform: scale(1.05);
}

.login-title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
}

.login-message {
  font-size: 16px;
  color: #666;
  margin-bottom: 30px;
}

.login-button {
  padding: 14px 34px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(76, 175, 80, 0.3);
}

.login-button:hover {
  background-color: #388e3c;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.4);
}

.login-button:active {
  transform: translateY(0);
}

/* 채팅 메시지 영역 */
.chat-messages {
  flex-grow: 1;
  overflow-y: auto;
  padding: 16px;
  background-color: #f5f5f5;
  border-radius: 8px;
  margin-bottom: 16px;
  min-height: 500px;
  max-height: calc(100% - 120px);
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

.spinner.small {
  width: 16px;
  height: 16px;
  border-width: 2px;
  margin-right: 8px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.loading-indicator p {
  margin-top: 12px;
  color: #666;
  font-size: 14px;
}

.no-messages {
  text-align: center;
  padding: 40px 0;
  color: #666;
  background-color: #f9f9f9;
  border-radius: 8px;
}

.no-messages-sub {
  font-size: 14px;
  color: #888;
  margin-top: 8px;
}

.message-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.message-bubble {
  max-width: 80%;
  padding: 12px 16px;
  border-radius: 12px;
  animation: fadeIn 0.3s ease;
}

.message-bubble.user {
  align-self: flex-end;
  background-color: #dcf8c6;
  border-bottom-right-radius: 4px;
}

.message-bubble.ai {
  align-self: flex-start;
  background-color: white;
  border-bottom-left-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.message-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
  font-size: 12px;
}

.sender-name {
  font-weight: 600;
  color: #444;
}

.message-time {
  color: #777;
}

.message-text {
  font-size: 14px;
  line-height: 1.5;
  color: #333;
  white-space: pre-wrap;
  word-break: break-word;
}

/* 채팅 입력 영역 */
.chat-input-area {
  display: flex;
  gap: 8px;
  padding: 8px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-bottom: 8px;
}

.chat-input {
  flex-grow: 1;
  border: none;
  resize: none;
  padding: 8px 12px;
  font-size: 14px;
  border-radius: 6px;
  background-color: #f9f9f9;
  transition: background-color 0.2s ease;
}

.chat-input:focus {
  outline: none;
  background-color: #f0f0f0;
}

.send-button {
  padding: 8px 16px;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #4caf50;
  white-space: nowrap;
}

.send-button:hover {
  background-color: #388e3c;
}

.send-button:disabled {
  background-color: #a5d6a7;
  cursor: not-allowed;
}

.button-icon {
  margin-right: 6px;
  font-size: 16px;
}

.button-text {
  font-size: 14px;
}

.sending-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 8px;
  color: #666;
  font-size: 13px;
}

/* 모바일 반응형 스타일 */
@media (max-width: 480px) {
  .message-bubble {
    max-width: 90%;
  }

  .send-button .button-text {
    display: none;
  }

  .send-button .button-icon {
    margin-right: 0;
  }

  .send-button {
    padding: 8px;
  }

  .chat-panel {
    min-height: 500px;
  }
}

@media (min-width: 768px) {
  .chat-container {
    max-width: 800px;
    margin: 0 auto;
  }

  .chat-panel {
    min-height: 1200px;
  }
}
</style>
