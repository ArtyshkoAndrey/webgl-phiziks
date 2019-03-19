import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: require('@/components/index').default
    },
    {
      path: '/graphics',
      name: 'graphics',
      component: require('@/components/graphics').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
