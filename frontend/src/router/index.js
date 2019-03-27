import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import Index from '@/App'

export default new Router({
  mode: 'history',
  routes: [
    // { path: '*', component: ErrorPage }, // 지정 외의 경로 이동시 에러페이지 이동
    {
      path: '/',
      name: 'IndexPage',
      component: Index,
    }
  ]
})
