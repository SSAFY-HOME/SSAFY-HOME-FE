import { defineStore } from 'pinia'

export const useMemberStore = defineStore('member', {
  state: () => ({
    id: null,
    name: '', // ← nickname이 아니라 name으로 통일
    email: '',
    image: '',
    isKakao: false,
    apartment: '',
    sido: '',
    gungu: '',
    dong: '',
    accessToken: '',
  }),

  actions: {
    setMember(memberData) {
      this.id = memberData.id
      this.name = memberData.name // ← nickname → name
      this.email = memberData.email
      this.image = memberData.image
      this.isKakao = memberData.isKakao || false
      this.apartment = memberData.apartment || ''
      this.sido = memberData.sido || ''
      this.gungu = memberData.gungu || ''
      this.dong = memberData.dong || ''
      this.accessToken = memberData.accessToken || ''
    },

    clearMember() {
      this.id = null
      this.name = ''
      this.email = ''
      this.image = ''
      this.isKakao = false
      this.apartment = ''
      this.sido = ''
      this.gungu = ''
      this.dong = ''
      this.accessToken = ''
    },
  },
})
