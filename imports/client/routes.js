// import MainLayout from "./layouts/Menu.vue";

import NotFound from './pages/NoteFound.vue'
import Login from './pages/Login.vue'

import Home from './pages/Home.vue'

// Branch
import BranchList from './pages/Branch.vue'
// Company 
import Company from './pages/Company'
//user
import UserList from './pages/User.vue'
//Profile
import Profile from './pages/UserProfile.vue'
//Exchange
import Exchange from './pages/Exchange.vue'

const routes = [
  //Notfound
  {
    path: '*',
    component: NotFound,
    meta: {
      headerTitle: 'Not Found',
    },
  },
  // Login
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: {
      layout: 'login',
      notRequiresAuth: true,
      headerTitle: 'Login',
    },
  },
  // Home
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: {
      headerTitle: 'Home',
      // breadcrumb: {
      //   title: 'Home',
      //   icon: 'fas fa-home',
      // },
    },
  },
  {
    path: '/main',
    component: {
      render(h) {
        return h('router-view')
      },
    },
    // path: '/',
    // component: index,
    children: [
      // Brach
      {
        path: 'branch',
        name: 'branch',
        component: BranchList,
        meta: {
          headerTitle: 'Branch'
        }
      },
      // Brach
      {
        path: 'company',
        name: 'company',
        component: Company,
        meta: {
          headerTitle: 'Company'
        }
      },
      // User List
      {
        path: 'user',
        name: 'user',
        component: UserList,
        meta: {
          headerTitle: 'User'
        }
      },
      // User Profile
      {
        path: 'profile/:_id',
        name: 'profile',
        component: Profile,
        meta: {
          headerTitle: 'User Profile'
        }
      },
      {
        path: 'exchange',
        name: 'exchange',
        component: Exchange,
        meta: {
          headerTitle: 'Exchange Rate'
        }
      }
    ],
  },
]
export default routes