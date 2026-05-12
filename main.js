import App from './App'

// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'
Vue.config.productionTip = false

// 注册全局组件
import CustomTabbar from './components/custom-tabbar/custom-tabbar.vue'
import ShareCard from './components/share-card/share-card.vue'
import LazyImage from './components/lazy-image/lazy-image.vue'

Vue.component('custom-tabbar', CustomTabbar)
Vue.component('share-card', ShareCard)
Vue.component('lazy-image', LazyImage)

App.mpType = 'app'
const app = new Vue({
  ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
import CustomTabbar from './components/custom-tabbar/custom-tabbar.vue'
import ShareCard from './components/share-card/share-card.vue'
import LazyImage from './components/lazy-image/lazy-image.vue'

export function createApp() {
  const app = createSSRApp(App)
  app.component('custom-tabbar', CustomTabbar)
  app.component('share-card', ShareCard)
  app.component('lazy-image', LazyImage)
  return {
    app
  }
}
// #endif
