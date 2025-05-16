<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

onMounted(() => {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('social')
  localStorage.removeItem('isAdmin')
  alert('카카오 로그아웃이 완료되었습니다.')
  router.push('/')
})
</script>

<template>
  <div>카카오 로그아웃 처리 중...</div>
</template>
