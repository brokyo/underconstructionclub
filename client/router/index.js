import Vue from 'vue'

import Router from 'vue-router'
Vue.use(Router)

import Meta from 'vue-meta'
Vue.use(Meta)


import Home from '../views/Home'
import Signup from '../views/SignUp'
import Windows from '../views/Windows'

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: Home
    },
    {
      path: '/signup',
      component: Signup
    },
    {
      path: '/windows',
      component: Windows
    }
  ]
})
