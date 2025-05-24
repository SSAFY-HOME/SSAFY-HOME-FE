import { defineStore } from 'pinia'

export const useMemberStore = defineStore('member', {
  state: () => ({
    name: '',
    email: '',
    image: '',
    isSocial: '',
    apartment: '',
    accessToken: '',
    refreshToken: '',
    admin: '',
    hasHomeInfo: '',
  }),

  actions: {
    setMember(memberData) {
      this.name = memberData.name
      this.email = memberData.email
      this.image = memberData.image
      this.isSocial = memberData.isSocial || ''
      this.apartment = memberData.apartment || ''
      this.accessToken = memberData.accessToken || ''
      this.refreshToken = memberData.refreshToken || ''
      this.admin = memberData.admin || false
      this.hasHomeInfo = memberData.hasHomeInfo || false
    },

    clearMember() {
      this.name = ''
      this.email = ''
      this.image = ''
      this.isSocial = ''
      this.apartment = ''
      this.accessToken = ''
      this.admin = ''
      this.hasHomeInfo = ''
      this.refreshToken = ''
    },
  },

  persist: {
    storage: localStorage, 
    paths: ['name', 'email', 'image', 'isSocial', 'apartment', 'accessToken', 'refreshToken', 'admin', 'hasHomeInfo'],
  },
})
