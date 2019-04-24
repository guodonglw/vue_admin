import instance from '../common/js/fetch'
import axios from 'axios';

const base = '';
const qs=require('qs');

/* 登录 */
export const requestLogin = params => { return axios.post(`${base}/role/login`, params, {timeout: 1000 *15}).then(
    res => res.data).catch(() => {alert('请求超时，请点击确定后重新登录！')})};

/* 首页图表 */
// 获取总数据
// export const requestTotal = params => { return axios.get(`${base}/total/all`, qs.stringify(params)).then(res => res.data)};
// 获取七日数据
// export const requestWeek = params => { return axios.get(`${base}/total/week`, qs.stringify(params)).then(res => res.data)};

/* 账号管理 */
// 获取账号列表
export const getAdminListPage = params => { return axios.get(`${base}/user/listpage`, { params: params }).then(res => res.data)};
// 添加账号列表
export const addAdmin = params => { return axios.get(`${base}/user/add`, { params: params }).then(res => res.data)};
// 删除某个账号
export const removeAdmin = params => { return axios.get(`${base}/user/remove`, { params: params }).then(res => res.data)};
// 删除多个账号
export const removeMoreAdmin = params => { return axios.get(`${base}/user/batchremove`, { params: params }).then(res => res.data)};
// 修改某个账号
export const editAdmin = params => { return axios.get(`${base}/user/edit`, { params: params }).then(res => res.data)};

/* 账本管理 */
// 获取账本列表
// export const getUserAccountListPage = params => { return axios.post(`${base}/userAccount/list`, qs.stringify(params)).then(res => res.data)};
// 修改收入/支出金额数值
export const addUserAccountAmount = params => { return axios.get(`${base}/user/amount`, { params: params }).then(res => res.data)};








