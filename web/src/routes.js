import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import Main from './views/Main.vue'
import Admin from './views/nav1/Admin.vue'
import UserAccount from './views/nav5/UserAccount'
import Vuex from './views/nav3/vuex.vue'
import ToDoList from './views/nav4/toDoList.vue'
import LeafLet from './views/nav4/leaflet.vue'
import Charts from './views/charts/echarts'


let routes = [
    {
        path: '/login',
        component: Login,
        name: '',
        hidden: true
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },
    {
        path: '/',
        component: Home,
        name: '',
        iconCls: 'fa fa-life-ring',//图标样式class
        leaf: true,
        children: [
            { path: '/charts', component: Charts, name: '首页' },
        ]
    },
    {
        path: '/',
        component: Home,
        name: '',
        iconCls: 'fa fa-user-o',//图标样式class
        leaf: true,
        children: [
            { path: '/admin', component: Admin, name: '账号管理' },
        ]
    },
    {
        path: '/',
        component: Home,
        name: '',
        iconCls: 'fa fa-user-circle-o',
        leaf: true,
        children: [
            { path: '/userAccount', component: UserAccount, name: '账本管理' },
        ]
    },
    /*
    {
        path: '/',
        component: Home,
        name: '',
        iconCls: 'fa fa-user-circle-o',
        leaf: true,
        children: [
            { path: '/vuex', component: Vuex, name: '全局变量' },
        ]
    },
    */
    {
        path: '/',
        component: Home,
        name: '二级菜单',
        iconCls: 'fa fa-user-circle-o',
        // leaf: true,
        children: [
            { path: '/vuex', component: Vuex, name: '全局变量' },
            { path: '/todolist', component: ToDoList, name: 'toDoList' },
            { path: '/leaflet', component: LeafLet, name: 'leaflet' }
        ]
    },
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    }
];

export default routes;
