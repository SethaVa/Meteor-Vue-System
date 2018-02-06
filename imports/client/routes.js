import NotFound from './pages/NoteFound.vue';
import index from './pages/index.vue';
import MainLayout from './layouts/Menu.vue';
import Home from './pages/home.vue';
import welcome from './pages/Welcome.vue';
import Login from './pages/Login.vue';
// Student 
// import Student from './pages/Student.vue';
// import StudentInsert from './pages/StudentInsert.vue';
// import StudentUpdate from './pages/StudentUpdate.vue';

// Teacher
import Teacher from './pages/Teacher.vue';

// Subject
import Subject from './pages/Subject.vue';

// room
import Room from './pages/Room.vue';
// type
import Type from './pages/Type.vue';


const routes = [
    //Notfound
    {
        path: '*',
        component: NotFound,
        meta: {
            headerTitle: 'Not Found',
        }
    },

    {
        path: '/login',
        name:'login',
        component: Login,
        meta: {
            layout: 'login',
            notRequiresAuth: true,
            headerTitle: 'Login',
        }
    },

    {
        path: '/',
        component: index,
        children: [
            {
                path: '',
                name: 'home',
                component: Home
            },
            {
                path: 'welocme',
                name: 'welcome',
                component: welcome
            },
            {
                path: 'teacher',
                name: 'teacher',
                component: Teacher
            },
            // Book
            {
                path: 'book',
                name: 'book',
                component: Subject
            },
            {
                path: 'room',
                name: 'room',
                component: Room
            },
            {
                path:'type',
                name:'type',
                component:Type
            }

        ]
    }
];
export default routes;