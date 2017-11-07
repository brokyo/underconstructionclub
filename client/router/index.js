import Vue from 'vue'

import Router from 'vue-router'
Vue.use(Router)

import Meta from 'vue-meta'
Vue.use(Meta)


import Home from '../views/Home'
import Drones from '../views/Drones'
import Signup from '../views/SignUp'

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: Home
    },
    {
      path: '/drones',
      component: Drones
    },
    {
      path: '/signup',
      component: Signup
    }
  ]
})
