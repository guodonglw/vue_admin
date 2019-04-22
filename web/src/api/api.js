import instance from '../common/js/fetch'

const base = process.env.BASE_URL;
const qs=require('qs');

/* 登录 */
export const requestLogin = params => { return instance.post(`${base}/role/login`, qs.stringify(params), {timeout: 1000 *15}).then(
    res => res.data).catch(() => {alert('请求超时，请点击确定后重新登录！')})};
/* 登出 */
export const requestLogout = params => { return instance.post(`${base}/role/logout`, qs.stringify(params)).then(res => res.data)};

/* 首页图表 */
// 获取总数据
export const requestTotal = params => { return instance.post(`${base}/total/all`, qs.stringify(params)).then(res => res.data)};
// 获取七日数据
export const requestWeek = params => { return instance.post(`${base}/total/week`, qs.stringify(params)).then(res => res.data)};

/* 账号管理 */
// 获取账号列表
export const getAdminListPage = params => { return instance.post(`${base}/role/list`, qs.stringify(params)).then(res => res.data)};
// 添加账号列表
export const addAdmin = params => { return instance.post(`${base}/role/add`, qs.stringify(params)).then(res => res.data)};
// 删除某个账号
export const removeAdmin = params => { return instance.post(`${base}/role/delete`, qs.stringify(params)).then(res => res.data)};
// 修改某个账号
export const editAdmin = params => { return instance.post(`${base}/role/update`, qs.stringify(params)).then(res => res.data)};

/* 用户管理 */
// 删除某个账号
export const removeUser = params => { return instance.post(`${base}/user/delete`, qs.stringify(params)).then(res => res.data)};

/* 账本管理 */
// 获取账本列表
export const getUserAccountListPage = params => { return instance.post(`${base}/userAccount/list`, qs.stringify(params)).then(res => res.data)};
// 修改收入/支出金额数值
export const addUserAccountAmount = params => { return instance.post(`${base}/userAccount/amount`, qs.stringify(params)).then(res => res.data)};








