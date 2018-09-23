import Home from './pages/Home.vue'


const routes = [
  {
    path: '/school',
    component: {
      render(h) {
        return h('router-view')
      },
    },
    children:[
      {
        path: 'home',
        name: 'school.home',
        component: Home,
        meta: {
          pageTitle: 'Home',
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