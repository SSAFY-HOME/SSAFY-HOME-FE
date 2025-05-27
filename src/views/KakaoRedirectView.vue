<script setup>
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/api/index'
import { useMemberStore } from '@/stores/user'

const route = useRoute()
const router = useRouter()

onMounted(async () => {
  const code = route.query.code
  if (!code) {
    alert('카카오 인증 코드가 없습니다.')
    return
  }

  try {
    const response = await api.get(`oauth?code=${code}`)
    const user = response.data

    // ✅ 사용자 정보 저장
    localStorage.setItem('email', user.email)
    localStorage.setItem('accessToken', user.accessToken)
    localStorage.setItem('isAdmin', user.admin)
    localStorage.setItem('hasHome', user.hasHomeInfo)
    localStorage.setItem('isSocial', user.social)

    // pinia에 user데이터 저장
    const memberStore = useMemberStore()

    memberStore.setMember({
      image: user.image,
      email: user.email,
      accessToken: user.accessToken,
      isSocial: user.social,
      name: user.name,
      admin: user.admin,
      apartment: user.apartment,
      hasHomeInfo: user.hasHomeInfo,
    })

    if (user.hasHomeInfo === false) {
      router.push('/regist/home')
    } else {
      router.push('/')
    }
  } catch (e) {
    console.error('카카오 로그인 실패:', e)
    alert('카카오 로그인에 실패했습니다.')
    router.push('/login')
  }
})
</script>

<template>
  <div>카카오 로그인 처리 중...</div>
</template>
