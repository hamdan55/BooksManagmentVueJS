import { setupLayouts } from 'virtual:generated-layouts'
import { createRouter, createWebHistory } from 'vue-router'
import routes from '~pages'
import { isUserLoggedIn } from './utils'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...setupLayouts(routes),
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

router.beforeEach((to, from, next) => {
  const check = isUserLoggedIn()

  if (!check && to.path === '/login') {
    next()
  } else if (!check && to.path !== '/login') {
    next('/login')
  } else {
    next()
  }
})

export default router
