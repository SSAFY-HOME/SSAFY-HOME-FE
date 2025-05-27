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
              <!-- 마크다운 렌더링 -->
              <div
                class="message-text markdown-content"
                v-html="renderMarkdown(message.message)"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- 채팅 입력 영역 -->
      <div class="chat-input-area">
        <div class="input-wrapper">
          <textarea
            class="chat-input"
            v-model="newMessage"
            placeholder="아파트 관련 질문을 입력하세요..."
            @keydown.enter.prevent="handleEnterKey"
            :disabled="isSending"
            rows="3"
          ></textarea>
          <div class="input-tools">
            <button
              type="button"
              class="markdown-help-btn"
              @click="showMarkdownHelp = !showMarkdownHelp"
              title="마크다운 도움말"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
                  fill="currentColor"
                />
              </svg>
            </button>
            <button
              class="send-button"
              @click="sendMessage"
              :disabled="!newMessage.trim() || isSending"
            >
              <span class="button-icon">📤</span>
              <span class="button-text">전송</span>
            </button>
          </div>
        </div>
      </div>

      <!-- 마크다운 도움말 -->
      <div v-if="showMarkdownHelp" class="markdown-help">
        <div class="help-header">
          <h4>마크다운 사용법</h4>
          <button @click="showMarkdownHelp = false" class="close-btn">×</button>
        </div>
        <div class="help-content">
          <div class="help-item"><code>**굵은 글씨**</code> → <strong>굵은 글씨</strong></div>
          <div class="help-item"><code>*기울임*</code> → <em>기울임</em></div>
          <div class="help-item"><code>`코드`</code> → <code>코드</code></div>
          <div class="help-item"><code>- 목록 항목</code> → 불릿 리스트</div>
          <div class="help-item"><code>1. 번호 목록</code> → 번호 리스트</div>
          <div class="help-item"><code>[링크](URL)</code> → 링크</div>
        </div>
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
import { ref, onMounted, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { chatAPI } from '@/api/chat'
import { marked } from 'marked' // npm install marked
import DOMPurify from 'dompurify' // npm install dompurify

// 상태 관리
const router = useRouter()
const isLoggedIn = ref(false)
const isLoadingMessages = ref(false)
const isSending = ref(false)
const newMessage = ref('')
const messages = ref([])
const chatMessagesContainer = ref(null)
const showMarkdownHelp = ref(false)

// 마크다운 설정
const configureMarked = () => {
  marked.setOptions({
    breaks: true, // 줄바꿈을 <br>로 변환
    gfm: true, // GitHub Flavored Markdown 지원
    sanitize: false, // DOMPurify로 별도 처리
  })

  // 코드 블록 렌더러 커스터마이징
  const renderer = new marked.Renderer()

  // 코드 블록 스타일링
  renderer.code = (code, language) => {
    const validLang = language && hljs?.getLanguage(language) ? language : 'plaintext'
    const highlighted =
      language && hljs?.getLanguage(language)
        ? hljs.highlight(code, { language: validLang }).value
        : code

    return `<pre class="code-block"><code class="hljs language-${validLang}">${highlighted}</code></pre>`
  }

  // 인라인 코드 스타일링
  renderer.codespan = (code) => {
    return `<code class="inline-code">${code}</code>`
  }

  // 링크 보안 처리
  renderer.link = (href, title, text) => {
    const titleAttr = title ? ` title="${title}"` : ''
    return `<a href="${href}" target="_blank" rel="noopener noreferrer"${titleAttr}>${text}</a>`
  }

  marked.use({ renderer })
}

// 마크다운 렌더링 함수
const renderMarkdown = (text) => {
  if (!text) return ''

  try {
    // 마크다운을 HTML로 변환
    const rawHtml = marked(text)

    // XSS 방지를 위한 HTML 정화
    const cleanHtml = DOMPurify.sanitize(rawHtml, {
      ALLOWED_TAGS: [
        'p',
        'br',
        'strong',
        'em',
        'u',
        's',
        'code',
        'pre',
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'ul',
        'ol',
        'li',
        'blockquote',
        'a',
        'img',
      ],
      ALLOWED_ATTR: ['href', 'title', 'src', 'alt', 'target', 'rel', 'class'],
    })

    return cleanHtml
  } catch (error) {
    console.error('마크다운 렌더링 오류:', error)
    // 오류 발생 시 원본 텍스트 반환
    return text.replace(/\n/g, '<br>')
  }
}

// Enter 키 처리 (Shift+Enter는 줄바꿈, Enter는 전송)
const handleEnterKey = (event) => {
  if (event.shiftKey) {
    // Shift+Enter: 줄바꿈 허용
    return
  } else {
    // Enter: 메시지 전송
    event.preventDefault()
    sendMessage()
  }
}

// 초기 데이터 로드
const fetchChatMessages = async () => {
  isLoadingMessages.value = true

  try {
    const response = await chatAPI.getMessages()
    messages.value = response.data
  } catch (error) {
    console.error('채팅 내용을 불러오는 중 오류가 발생했습니다:', error)
    messages.value = []
  } finally {
    isLoadingMessages.value = false
    scrollToBottom()
  }
}

// 메시지 전송
const sendMessage = async () => {
  if (!newMessage.value.trim() || isSending.value) return

  isSending.value = true

  try {
    const userMessageText = newMessage.value.trim()

    // 사용자 메시지 추가 (UI 즉시 반영)
    const userMessage = {
      id: Date.now(),
      senderType: 'USER',
      message: userMessageText,
      timestamp: new Date().toISOString(),
    }

    messages.value.push(userMessage)
    newMessage.value = ''
    scrollToBottom()

    // 채팅 API 호출
    const response = await chatAPI.sendMessage({ message: userMessageText })
    const data = response.data.aiMessage

    // AI 응답
    const aiMessage = {
      id: data.id,
      senderType: data.senderType,
      message: data.message,
      timestamp: data.timestamp,
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

  if (messageDate.getTime() === today.getTime()) {
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    return `오늘 ${hours}:${minutes}`
  }

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
  configureMarked()
  checkLoginStatus()
})

// 새 메시지가 있을 때마다 스크롤
watch(messages, () => {
  scrollToBottom()
})
</script>

<style scoped>
/* 기존 스타일 유지 + 마크다운 관련 스타일 추가 */
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
  min-height: 500px;
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
  max-width: 500px;
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
  word-break: break-word;
}

/* 마크다운 콘텐츠 스타일 */
.markdown-content {
  font-family: inherit;
}

.markdown-content :deep(h1),
.markdown-content :deep(h2),
.markdown-content :deep(h3),
.markdown-content :deep(h4),
.markdown-content :deep(h5),
.markdown-content :deep(h6) {
  margin: 12px 0 8px 0;
  font-weight: 600;
  color: #333;
}

.markdown-content :deep(h1) {
  font-size: 1.5em;
}
.markdown-content :deep(h2) {
  font-size: 1.4em;
}
.markdown-content :deep(h3) {
  font-size: 1.3em;
}
.markdown-content :deep(h4) {
  font-size: 1.2em;
}
.markdown-content :deep(h5) {
  font-size: 1.1em;
}
.markdown-content :deep(h6) {
  font-size: 1em;
}

.markdown-content :deep(p) {
  margin: 8px 0;
}

.markdown-content :deep(ul),
.markdown-content :deep(ol) {
  margin: 8px 0;
  padding-left: 20px;
}

.markdown-content :deep(li) {
  margin: 4px 0;
}

.markdown-content :deep(blockquote) {
  border-left: 4px solid #4caf50;
  padding-left: 12px;
  margin: 8px 0;
  color: #666;
  font-style: italic;
}

.markdown-content :deep(.inline-code) {
  background-color: rgba(76, 175, 80, 0.1);
  color: #2e7d32;
  padding: 2px 4px;
  border-radius: 3px;
  font-family: 'Courier New', monospace;
  font-size: 0.9em;
}

.markdown-content :deep(.code-block) {
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 12px;
  margin: 8px 0;
  overflow-x: auto;
  font-family: 'Courier New', monospace;
  font-size: 0.9em;
}

.markdown-content :deep(.code-block code) {
  background: none;
  padding: 0;
  border: none;
}

.markdown-content :deep(a) {
  color: #4caf50;
  text-decoration: none;
}

.markdown-content :deep(a:hover) {
  text-decoration: underline;
}

.markdown-content :deep(strong) {
  font-weight: 600;
}

.markdown-content :deep(em) {
  font-style: italic;
}

/* 채팅 입력 영역 */
.chat-input-area {
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-bottom: 8px;
}

.input-wrapper {
  display: flex;
  flex-direction: column;
  padding: 8px;
}

.chat-input {
  width: 100%;
  border: none;
  resize: none;
  padding: 8px 12px;
  font-size: 13px;
  border-radius: 6px;
  background-color: #f9f9f9;
  transition: background-color 0.2s ease;
  margin-bottom: 8px;
}

.chat-input:focus {
  outline: none;
  background-color: #f0f0f0;
}

.input-tools {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.markdown-help-btn {
  background: none;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 6px 8px;
  cursor: pointer;
  color: #666;
  font-size: 12px;
  transition: all 0.2s ease;
}

.markdown-help-btn:hover {
  background-color: #f0f0f0;
  color: #4caf50;
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

/* 마크다운 도움말 */
.markdown-help {
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-bottom: 8px;
  animation: fadeIn 0.3s ease;
}

.help-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #ddd;
}

.help-header h4 {
  margin: 0;
  font-size: 14px;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: #666;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  color: #333;
}

.help-content {
  padding: 12px 16px;
}

.help-item {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  font-size: 12px;
}

.help-item code {
  background-color: #e8e8e8;
  padding: 2px 4px;
  border-radius: 3px;
  margin-right: 8px;
  font-family: 'Courier New', monospace;
  min-width: 120px;
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

  .input-tools {
    flex-direction: column;
    gap: 8px;
  }

  .markdown-help-btn {
    align-self: flex-start;
  }
}

@media (min-width: 768px) {
  .chat-container {
    max-width: 800px;
    margin: 0 auto;
  }

  .chat-panel {
    min-height: 1000px;
  }
}
</style>
