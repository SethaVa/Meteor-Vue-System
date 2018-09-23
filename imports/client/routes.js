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

const routes = [
  //Notfound
  {
    path: '*',
    component: NotFound,
    meta: {
      headerTitle: 'Not Found',
    },
  },

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
    name: 'welcome',
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
      },
      // Brach
      {
        path: 'company',
        name: 'company',
        component: Company,
      },
      // User List
      {
        path: 'user',
        name: 'user',
        component: UserList,
      },
      // User Profile
      {
        path: 'profile/:_id',
        name: 'profile',
        component: Profile,
      },
    ],
  },
]
export default routes