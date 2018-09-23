import Home from './pages/home.vue'
// Staff
import Staff from './pages/Staff.vue'
// Position
import Position from './pages/Position'
// Subject
import Subject from './pages/Subject.vue'

// Student
import StudentList from './pages/StudentList.vue'
// room
import Room from './pages/Room.vue'
//TimeList
import TimeList from './pages/TimeList'
//Class Study
import ClassStudy from './pages/ClassList'

//Register
import RegisterList from './pages/RegisterList'
import RegisterInsert from './pages/RegisterInsert.vue'
import RegisterUpdate from './pages/RegisterUpdate.vue'
//Payment
import PaymentList from './pages/PaymentList.vue'
import PaymentInsert from './pages/PaymentInsert.vue'
import PaymentUpdate from './pages/PaymentUpdate.vue'
//Refund
import Refund from './pages/RefundList.vue'
// Incomeouting
import Income from './pages/IncomeList.vue'
//Exchange
import Exchange from './pages/Exchange.vue'
// SalaryRate
import SalaryRate from './pages/SalaryRate.vue'
// Exchange Class 
import ExchangeClass from './pages/ExchangeClassList.vue'
// Category 
import CategoryList from './pages/CategoryList.vue'
// items
import ItemList from './pages/ItemList.vue'
// items
import StockList from './pages/StockList.vue'

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
        name: 'home',
        component: Home,
        meta: {
          pageTitle: 'Home',
          // breadcrumb: {
          //   title: 'Setting',
          //   parent: 'home',
          // },
        },
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
      //Register new
      {
        path: 'register-new',
        name: 'registerNew',
        component: RegisterInsert,
        meta:{
          pageTitle: 'Register New',
          linkActiveClass: 'registerList',
        }
      },
      // Register update
      {
        path: 'register-edit/:id',
        name: 'registerEdit',
        component: RegisterUpdate,
        meta: {
          pageTitle: 'Register Edit',
          linkActiveClass: 'registerList',
        },
      },

      //Payment
      {
        path: 'payment',
        name: 'payment',
        component: PaymentList,
      },
      //Payment New
      {
        path: 'new-payment',
        name: 'newPayment',
        component: PaymentInsert,
        meta: {
          pageTitle: 'New Payment',
          linkActiveClass: 'payment',
        },
      },
      //Payment New
      {
        path: 'edit-payment/:id',
        name: 'editPayment',
        component: PaymentUpdate,
        meta: {
          pageTitle: 'Edit Payment',
          linkActiveClass: 'payment',
        },
      },
      // Student
      {
        path: 'student',
        name: 'student',
        component: StudentList,
      },
      // Refund
      {
        path: 'refund',
        name: 'refund',
        component: Refund,
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
      // Rate Salary
      {
        path: 'salary-rate',
        name: 'salary-rate',
        component: SalaryRate,
      },
      // Category List
      {
        path: 'category-list',
        name: 'category-list',
        component: CategoryList,
      },
      // Item List
      {
        path: 'item-list',
        name: 'item-list',
        component: ItemList,
      },
      // Stock List
      {
        path: 'stock-list',
        name: 'stock-list',
        component: StockList,
      },
    ]
  }
]

export default routes