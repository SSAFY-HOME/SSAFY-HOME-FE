<template>
  <div class="kakao-withdraw">
    <p>회원 탈퇴를 처리 중입니다...</p>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { onMounted } from 'vue'
import { memberAPI } from '@/api/member'

const route = useRoute()
const router = useRouter()

onMounted(async () => {
  const code = route.query.code

  if (!code) {
    alert('카카오 인증 코드가 없습니다.')
    router.push('/')
    return
  }

  try {
    // 백엔드로 인가 코드 전달 (access token 발급 + unlink 처리)
    await memberAPI.kakaoWithdrawByCode(code)

    // 로컬 토큰 제거
    localStorage.removeItem('accessToken')
    localStorage.removeItem('social')

    alert('회원 탈퇴가 완료되었습니다. 감사합니다.')
    router.push('/')
  } catch (err) {
    console.error('회원 탈퇴 오류:', err)
    alert('회원 탈퇴 중 오류가 발생했습니다. 다시 시도해주세요.')
    router.push('/')
  }
})
</script>

<style scoped>
.kakao-withdraw {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 1.2rem;
}
</style>
