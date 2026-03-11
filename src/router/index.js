// import { createRouter, createWebHistory } from 'vue-router'
import { createRouter, createWebHashHistory } from 'vue-router'
import OwnedListPage from '@/pages/OwnedListPage.vue'
import TransportModelAdminPage from '@/pages/TransportModelAdminPage.vue'

const routes = [
  { path: '/', redirect: '/owned' },
  { path: '/owned', component: OwnedListPage },
  { path: '/transport-models', component: TransportModelAdminPage }
]

export default createRouter({
  history: createWebHashHistory(),
  routes
})