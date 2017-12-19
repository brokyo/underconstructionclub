import Vue from 'vue'

import Router from 'vue-router'
Vue.use(Router)

import Meta from 'vue-meta'
Vue.use(Meta)


import Home from '../views/Home'
import Signup from '../views/SignUp'
import Windows from '../views/Windows'
import Pools from '../views/Pools'
import Pools2 from '../views/Pools2'

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
    },
    {
      path: '/pools',
      component: Pools
    },
    {
      path: '/pools/2',
      component: Pools2
    }
  ]
})
