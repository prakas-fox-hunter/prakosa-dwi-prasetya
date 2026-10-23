import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import DummyMonitoringView from '../views/DummyMonitoringView.vue'
import DummySwaggerView from '../views/DummySwaggerView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/dummy-monitoring',
      name: 'dummy-monitoring',
      component: DummyMonitoringView,
    },
    {
      path: '/dummy-swagger',
      name: 'dummy-swagger',
      component: DummySwaggerView,
    },
    {
      path: '/voice-chat',
      name: 'voice-chat',
      redirect: '/dummy-monitoring?menu=voice-chat',
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
  scrollBehavior(to) {
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth',
      }
    }

    return { top: 0 }
  },
})

export default router
