import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import Main from './views/Main.vue'
import Admin from './views/nav1/Admin.vue'
import User from './views/nav2/User.vue'
import UserAccount from './views/nav5/UserAccount'
import Vuex from './views/nav3/vuex.vue'
import ToDoList from './views/nav4/toDoList.vue'
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
    /*
    {
        path: '/',
        component: Home,
        name: '',
        iconCls: 'fa fa-user-circle-o',
        leaf: true,
        children: [
            { path: '/user', component: User, name: '用户管理' },
        ]
    },
    */
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
    {
        path: '/',
        component: Home,
        name: '',
        iconCls: 'fa fa-user-circle-o',
        leaf: true,
        children: [
            { path: '/todolist', component: ToDoList, name: 'toDoList' },
        ]
    },
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    }
];

export default routes;
