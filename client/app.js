import Vue from 'vue'
import { sync } from 'vuex-router-sync'
import App from './components/App'
import router from './router'
import store from './store'

sync(store, router)

import VueAnalytics from 'vue-analytics'

Vue.use(VueAnalytics, {
  id: 'UA-109330238-2',
  router
})

const app = new Vue({
  router,
  store,
  ...App
})

export { app, router, store }
