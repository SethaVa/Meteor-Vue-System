import NotFound from './pages/NoteFound.vue'
import index from './pages/index.vue'
// import MainLayout from "./layouts/Menu.vue";
import Home from './pages/home.vue'
import welcome from './pages/Welcome.vue'
import Login from './pages/Login.vue'
// Student
// import Student from './pages/Student.vue';
// import StudentInsert from './pages/StudentInsert.vue';
// import StudentUpdate from './pages/StudentUpdate.vue';

// Staff
import Staff from './pages/Staff.vue'
// Position
import Position from './pages/Position'
// Subject
import Subject from './pages/Subject.vue'

// room
import Room from './pages/Room.vue'
// type
import Type from './pages/Type.vue'
// Lelvel
import Levele from './pages/Levele.vue'
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

  {
    path: '/',
    component: index,
    children: [
      {
        path: '',
        name: 'home',
        component: Home,
      },
      {
        path: 'welocme',
        name: 'welcome',
        component: welcome,
      },
      // Staff
      {
        path: 'staff',
        name: 'staff',
        component: Staff,
      },
      // Position
      {
        path: 'position',
        name: 'position',
        component: Position,
      },
      // Book
      {
        path: 'book',
        name: 'book',
        component: Subject,
      },
      // room
      {
        path: 'room',
        name: 'room',
        component: Room,
      },
      // type
      {
        path: 'type',
        name: 'type',
        component: Type,
      },
      {
        path: 'levele',
        name: 'levele',
        component: Levele,
      },
    ],
  },
]
export default routes
