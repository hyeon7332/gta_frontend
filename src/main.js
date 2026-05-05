import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'

// Vue 앱 생성 (최상위 컴포넌트 App.vue 기준)
const app = createApp(App)

// 라우터 적용
app.use(router)

// 라우터 준비 완료 후 앱 마운트 (초기 라우팅 안정성 보장)
router.isReady().then(() => {
  app.mount('#app')
})