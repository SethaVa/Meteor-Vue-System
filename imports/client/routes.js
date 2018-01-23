import NotFound from './pages/NoteFound.vue';
import index from './pages/index.vue';
import MainLayout from './layouts/Menu.vue';
import Home from './pages/home.vue';
import welcome from './pages/Welcome.vue';

// Student 
// import Student from './pages/Student.vue';
// import StudentInsert from './pages/StudentInsert.vue';
// import StudentUpdate from './pages/StudentUpdate.vue';

// Teacher
import Teacher from './pages/Teacher.vue';

// book
import BookList from './pages/Book.vue';

const routes =[
    //Notfound
    {
        path:'*',
        component:NotFound,
        meta:{
            headerTitle: 'Not Found',
        }
    },


    {
        path:'/',
        component:index,
        children:[
            {
                path:'',
                name:'home',
                component:Home
            },
            {
                path:'welocme',
                name:'welcome',
                component:welcome
            },
            {
                path:'teacher',
                name:'teacher',
                component:Teacher
            },
            // Book
            {
                path:'book',
                name:'book',
                component:BookList
            }
            
        ]
    }
];
export default routes;