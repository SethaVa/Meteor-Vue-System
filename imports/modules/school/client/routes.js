import Home from './pages/home.vue'
// Staff
import Staff from './pages/Staff.vue'
// Student
import StudentList from './pages/StudentList.vue'
//Class Study
import ClassStudy from './pages/ClassList'
/**
 * Setting
 */
import Room from './pages/Room.vue'
import Position from './pages/Position'
import Subject from './pages/Subject.vue'
import TimeList from './pages/TimeList'
import CategoryList from './pages/CategoryList.vue'
import ItemList from './pages/ItemList.vue'
import SalaryRate from './pages/SalaryRate.vue'
import LevelList from './pages/LevelList.vue'
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
// Exchange Class 
import ExchangeClass from './pages/ExchangeClassList.vue'
// items
import StockList from './pages/StockList.vue'

const routes = [{
  path: '/sch',
  component: {
    render(h) {
      return h('router-view')
    },
  },
  children: [{
      path: 'home',
      name: 'sch.home',
      component: Home,
      meta: {
        headerTitle: 'Home',
        // breadcrumb: {
        //   title: 'Setting',
        //   parent: 'home',
        // },
      },
    },
    // Staff
    {
      path: 'staff',
      name: 'sch.staff',
      component: Staff,
      meta:{
        headerTitle:'Staff List'
      }
    },
    //class Study
    {
      path: 'class',
      name: 'sch.classStudy',
      component: ClassStudy,
      meta:{
        headerTitle:'Class List'
      }
    },

    //Register
    {
      path: 'register-list',
      name: 'sch.registerList',
      component: RegisterList,
      meta:{
        headerTitle:'Register List'
      }
    },
    //Register new
    {
      path: 'register-new',
      name: 'sch.registerNew',
      component: RegisterInsert,
      meta: {
        headerTitle: 'Register New',
        linkActiveClass: 'registerList',
      }
    },
    // Register update
    {
      path: 'register-edit/:id',
      name: 'sch.registerEdit',
      component: RegisterUpdate,
      meta: {
        headerTitle: 'Register Edit',
        linkActiveClass: 'registerList',
      },
    },

    //Payment
    {
      path: 'payment',
      name: 'sch.payment',
      component: PaymentList,
      meta:{
        headerTitle:'Payment List'
      }
    },
    //Payment New
    {
      path: 'new-payment',
      name: 'sch.newPayment',
      component: PaymentInsert,
      meta: {
        headerTitle: 'New Payment',
        linkActiveClass: 'payment',
      },
    },
    //Payment New
    {
      path: 'edit-payment/:id',
      name: 'sch.editPayment',
      component: PaymentUpdate,
      meta: {
        headerTitle: 'Edit Payment',
        linkActiveClass: 'payment',
      },
    },
    // Student
    {
      path: 'student',
      name: 'sch.student',
      component: StudentList,
      meta:{
        headerTitle:'Student List'
      }
    },
    // Refund
    {
      path: 'refund',
      name: 'sch.refund',
      component: Refund,
      meta:{
        headerTitle:'Refund List'
      }
    },
    // Incomeouting
    {
      path: 'income',
      name: 'sch.income',
      component: Income,
      meta:{
        headerTitle:'Income List'
      }
    },
    // Exchange
    {
      path: 'ex-class',
      name: 'sch.ex-class',
      component: ExchangeClass,
      meta:{
        headerTitle:'Exchange List'
      }
    },
    // Stock List
    {
      path: 'stock-list',
      name: 'sch.stock-list',
      component: StockList,
      meta:{
        headerTitle:'Stock List'
      }
    },
    /**
     * Setting
     */
    // Level
    {
      path: 'level',
      name: 'sch.level',
      component: LevelList,
      meta:{
        headerTitle:'Level List'
      }
    },
    // Position
    {
      path: 'position',
      name: 'sch.position',
      component: Position,
      meta:{
        headerTitle:'Position'
      }
    },
    // Book
    {
      path: 'subject',
      name: 'sch.subject',
      component: Subject,
      meta:{
        headerTitle:'Subject List'
      }
    },
    // room
    {
      path: 'room',
      name: 'sch.room',
      component: Room,
      meta:{
        headerTitle:'Room List'
      }
    },
    //Time
    {
      path: 'time',
      name: 'sch.time',
      component: TimeList,
      meta:{
        headerTitle:'Time List'
      }
    },
    // Rate Salary
    {
      path: 'salary-rate',
      name: 'sch.salary-rate',
      component: SalaryRate,
      meta: {
        headerTitle: 'Rate List'
      }
    },
    // Category List
    {
      path: 'category-list',
      name: 'sch.category-list',
      component: CategoryList,
      meta: {
        headerTitle: 'Category List' 
      }
    },
    // Item List
    {
      path: 'item-list',
      name: 'sch.item-list',
      component: ItemList,
      meta: {
        headerTitle: 'Item List'
      }
    },
  ]
}]

export default routes