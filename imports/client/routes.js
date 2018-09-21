import NotFound from './pages/NoteFound.vue'
import index from './pages/index.vue'
// import MainLayout from "./layouts/Menu.vue";
import Home from './pages/home.vue'
import welcome from './pages/Welcome.vue'
import Login from './pages/Login.vue'

// Branch
import BranchList from './pages/Branch.vue'
// Company 
import Company from './pages/Company'
// Student
import StudentList from './pages/StudentList.vue'

//user
import UserList from './pages/User.vue'

//Profile
import Profile from './pages/UserProfile.vue'
// Staff
import Staff from './pages/Staff.vue'
// Position
import Position from './pages/Position'
// Subject
import Subject from './pages/Subject.vue'

// room
import Room from './pages/Room.vue'
//TimeList
import TimeList from './pages/TimeList'
//Class Study
import ClassStudy from './pages/ClassList'
//Class Details
import ClassDetails from './reports/ClassDetails.vue'
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
//Staff Salary
import StaffSalary from './reports/StaffSalary.vue'
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
// Report
import AllStudent from './reports/AllStudent'
import DailyInEx from './reports/DailyReportInEx.vue';
import MonthlyInEx from './reports/MonthlyReport.vue';
import StaffReport from './reports/Staff.vue'
import SubjectReport from './reports/Subject.vue';
import TeacherDetails from './reports/TeacherDetails.vue'
import StudentDebt from './reports/StudentDebt.vue'
import StudentExchangeRpt from './reports/ExchangeStudent.vue'

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
    // meta: {
    //   layout: 'login',
    //   notRequiresAuth: true,
    //   pageTitle: 'Login',
    // },
  },

  {
    path: '/',
    component: index,
    children: [{
        path: '',
        name: 'home',
        component: Home,
      },
      {
        path: 'welocme',
        name: 'welcome',
        component: welcome,
      },
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
      // Report
      {
        path: 'student-all',
        name: 'student-all',
        component: AllStudent,
      },
      {
        path: 'staff-report',
        name: 'staff-report',
        component: StaffReport,
      },
      {
        path: 'subject-report',
        name: 'subject-report',
        component: SubjectReport,
      },
      //
      {
        path: 'daily-report',
        name: 'daily',
        component: DailyInEx,
      },
      {
        path: 'monthly-report',
        name: 'monthly-report',
        component: MonthlyInEx,
      },
      {
        path: 'exchange-class',
        name: 'exchange-class',
        component: ExchangeClass,
      },
      // Rpt TeacherDetails
      {
        path: 'rpt-teacher',
        name: 'teacher-details',
        component: TeacherDetails,
      },
      // Rpt StudentDebt
      {
        path: 'rpt-debt',
        name: 'student-debt',
        component: StudentDebt,
      },
      // Rpt StudentDebt
      {
        path: 'rpt-exchangeStudent',
        name: 'student-exchange',
        component: StudentExchangeRpt,
      },
    ],
  },
]
export default routes