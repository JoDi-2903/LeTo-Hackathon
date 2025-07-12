import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import ProfilePage from '../views/ProfilePage.vue'
import GamificationPage from '../views/GamificationPage.vue'
import GroupsCoursesPage from '../views/GroupsCoursesPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfilePage,
    },
    {
      path: '/competition',
      name: 'competition',
      component: GamificationPage,
    },
    {
      path: '/groups-courses',
      name: 'groups-courses',
      component: GroupsCoursesPage,
    },
    // Add additional routes as needed
  ]
})

export default router
