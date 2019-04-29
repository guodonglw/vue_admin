import axios from 'axios';
import { Message, MessageBox } from 'element-ui';

// axios.defaults.withCredentials = true;
const instance = axios.create({
    baseURL: '', // api的base_url
    timeout: 10000,
});

// request拦截器
instance.interceptors.request.use(config => {
    if (sessionStorage.getItem('token')) {
        config.headers.token = sessionStorage.getItem('token');
        config.headers.admin = sessionStorage.getItem('user'); // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    // console.log(JSON.parse(sessionStorage.getItem('user')));
    return config
}, error => {
    // Do something with request error
    console.log(error); // for debug
    Promise.reject(error)
});

// respone拦截器
instance.interceptors.response.use(
    response => {
        const res = response.data;
        if (res.code === -1) {
            MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
                confirmButtonText: '重新登录',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                sessionStorage.removeItem('token');
                sessionStorage.removeItem('user');
                location.reload() // 为了重新实例化vue-router对象 避免bug
            })
            return Promise.reject('error')
        } else {
            return response
        }
    },
    error => {
        console.log('err' + error) // for debug
        Message({
            message: error.message,
            type: 'error',
            duration: 3 * 1000
        });
        return Promise.reject(error)
    }
);

export default instance
