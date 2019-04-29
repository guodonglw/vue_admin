import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'

Vue.use(Vuex)

// 应用初始状态
const state = {
    count: 10,
    rememberPwd: false,
    userInfo: {
        userName: '',
        userPwd: ''
    }
};

// 定义所需的 mutations
const mutations = {
    INCREMENT(state) {
        state.count++
    },
    DECREMENT(state) {
        state.count--
    },
    NOTREMEMBER(state) {
        state.rememberPwd = false;
        state.userInfo.userName = '';
        state.userInfo.userPwd = ''
    },
    REMEMBER(state, userInfo) {
        state.rememberPwd = true;
        state.userInfo.userName = userInfo.account;
        state.userInfo.userPwd = userInfo.checkPass
    },
};

// 创建 store 实例
export default new Vuex.Store({
    actions,
    getters,
    state,
    mutations
})
