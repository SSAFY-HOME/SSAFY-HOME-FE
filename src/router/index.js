import { createRouter, createWebHistory } from 'vue-router'
import NoticeDetail from '../views/NoticeDetailView.vue'
import MainView from '../views/Home.vue'
import NoticeEdit from '../views/NoticeEditView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: MainView,
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView2.vue'),
    },
    {
      path: '/signup',
      name: 'signup',
      component: () => import('../views/SignupView.vue'),
    },
    {
      path: '/mypage',
      name: 'mypage',
      component: () => import('../views/MyPageView.vue'),
    },
    {
      path: '/main',
      name: 'main',
      component: () => import('../views/MainLayout.vue'),
    },
    {
      path: '/notice',
      name: 'notice',
      component: () => import('../views/NoticeView.vue'),
    },
    {
      path: '/notice/write',
      name: 'WriteNotice',
      component: () => import('../views/NoticeWriteView.vue'),
    },
    {
      path: '/notice/:id',
      name: 'NoticeDetail',
      component: NoticeDetail,
      props: true, // route.params를 컴포넌트 props로 전달
    },
    {
      path: '/notice/edit/:id',
      name: 'NoticeEdit',
      component: NoticeEdit,
      props: true, // route.params를 컴포넌트 props로 전달
    },
    {
      path: '/regist/home',
      name: 'RegistHome',
      component: () => import('../views/RegistHomeView.vue'),
    },
    {
      path: '/oauth',
      name: 'KakaoRedirect',
      component: () => import('@/views/KakaoRedirectView.vue'),
    },
    {
      path: '/oauth/withdraw',
      name: 'KakaoWithdraw',
      component: () => import('@/components/common/KakaoWithDraw.vue'),
    },
    {
      path: '/news',
      name: 'NewsList',
      component: () => import('@/views/NewsList.vue'),
    },
    {
      path: '/news/detail',
      name: 'NewsDetail',
      component: () => import('@/views/NewsDetailView.vue'),
    },
  ],
})

export default router
