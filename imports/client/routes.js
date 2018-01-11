import NotFound from './pages/NoteFound.vue';
import index from './pages/index.vue';
import MainLayout from './pages/Menu.vue';
import Home from './pages/home.vue';
import welcome from './pages/Welcome.vue';
const routes =[
    //Notfound
    {
        path:'*',
        component:NotFound
    },

    // MainLayout
    {
        path:'',
        component:MainLayout,
        children:[
            {
                path:'',
                name:'home',
                component:Home
            },
            {
                path:'/welocme',
                name:'welcome',
                component:welcome
            }
        ]
    }
];
export default routes;