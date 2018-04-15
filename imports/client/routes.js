import NotFound from './pages/NoteFound.vue'
import index from './pages/index.vue'
// import MainLayout from "./layouts/Menu.vue";
import Home from './pages/home.vue'
import welcome from './pages/Welcome.vue'
import Login from './pages/Login.vue'
// Student
import StudentList from './pages/StudentList.vue'
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
//TimeList
import TimeList from './pages/TimeList'
// Lelvel
import Levele from './pages/Levele.vue'
//Class Study
import ClassStudy from './pages/ClassList'
//Class Details
import ClassDetails from './reports/ClassDetails.vue'
//Register
import RegisterList from './pages/RegisterList'
import RegisterInsert from './pages/RegisterInsert.vue'
//Payment
import Payment from './pages/Payment.vue'
//Refund
import Refund from './pages/Refund.vue'
//Staff Salary
import StaffSalary from './reports/StaffSalary.vue'
// Incomeouting
import Income from './pages/IncomeList.vue'
//Exchange
import Exchange from './pages/Exchange.vue'
// SalaryRate
import SalaryRate from './pages/SalaryRate.vue'
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
        path: 'subject',
        name: 'subject',
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
      //level
      {
        path: 'levele',
        name: 'levele',
        component: Levele,
      },
      //class Study
      {
        path: 'class',
        name: 'classStudy',
        component: ClassStudy,
      },
      //Time
      {
        path: 'time',
        name: 'time',
        component: TimeList,
      },
      //Register
      {
        path: 'register-list',
        name: 'registerList',
        component: RegisterList,
      },
      //Register
      {
        path: 'register-new',
        name: 'register-new',
        component: RegisterInsert,
      },
      //Payment
      {
        path: 'payment',
        name: 'payment',
        component: Payment,
      },
      // Student
      {
        path: 'student',
        name: 'student',
        component: StudentList,
      },
      // Class Details
      {
        path: 'details',
        name: 'classDetails',
        component: ClassDetails,
      },
      // Refund
      {
        path: 'refund',
        name: 'refund',
        component: Refund,
      },
      // Salary
      {
        path: 'salary',
        name: 'salary',
        component: StaffSalary,
      },
      // Incomeouting
      {
        path: 'income',
        name: 'income',
        component: Income,
      },
      // Exchange
      {
        path: 'exchange',
        name: 'exchange',
        component: Exchange,
      },
      // Exchange
      {
        path: 'salary-rate',
        name: 'salary-rate',
        component: SalaryRate,
      },
    ],
  },
]
export default routes
