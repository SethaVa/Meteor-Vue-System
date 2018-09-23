import Home from './pages/Home.vue'
// Staff

const routes = [
  {
    path: '/demo',
    component: {
      render(h) {
        return h('router-view')
      },
    },
    children:[
      {
        path: 'home',
        name: 'demo.home',
        component: Home,
        meta: {
          headerTitle: 'Home',
          // breadcrumb: {
          //   title: 'Setting',
          //   parent: 'home',
          // },
        },
      },
    ]
  }
]

export default routes