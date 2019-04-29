//test
export const increment = ({commit}) => {
    commit('INCREMENT')
};
export const decrement = ({commit}) => {
    commit('DECREMENT')
};
export const notRememberPwd = ({commit}) => {
    commit('NOTREMEMBER')
};
export const rememberPwd = ({commit}, userInfo) => {
    commit('REMEMBER', userInfo)
};
