<template>
    <div class="box">
        <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-position="left" label-width="0px" class="demo-ruleForm login-container">
            <h1 class="title" style="color: cadetblue">后台系统demo</h1>
            <el-form-item prop="account">
                <el-input type="text" v-model="ruleForm2.account" auto-complete="off" placeholder="账号" @keyup.enter.native="handleSubmit2" />
            </el-form-item>
            <el-form-item prop="checkPass">
                <el-input type="password" v-model="ruleForm2.checkPass" auto-complete="off" placeholder="密码" @keyup.enter.native="handleSubmit2" />
            </el-form-item>
                <el-checkbox v-model="checked"  class="remember" @keyup.enter.native="handleSubmit2" >记住密码</el-checkbox>
            <el-form-item style="width:100%;">
                <el-button type="primary" style="width:100%;" @click="handleSubmit2" :loading="logining">登录</el-button>
            <!--<el-button @click.native.prevent="handleReset2">重置</el-button>-->
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import { requestLogin } from '../api/api';
    import { mapGetters, mapActions } from 'vuex'
    import { setCookie, getCookie, clearCookie } from '../common/js/cookieRelated'
    // import NProgress from 'nprogress'
    export default {
        data() {
            return {
                logining: false,
                ruleForm2: {
                    account: 'admin',
                    checkPass: 'admin'
                },
                rules2: {
                    account: [
                        { required: true, message: '请输入账号', trigger: 'blur' },
                        // { validator: validaePass }
                    ],
                    checkPass: [
                        { required: true, message: '请输入密码', trigger: 'blur' },
                        // { validator: validaePass2 }
                    ]
                },
                checked: false
            };
        },
        computed: {
            // 使用对象展开运算符将 getters 混入 computed 对象中
            ...mapGetters([
                'rememberPassword'
            ])
        },
        methods: {
            ...mapActions([
                'notRememberPwd',
                'rememberPwd'
            ]),
            handleReset2() {
                this.$refs.ruleForm2.resetFields();
            },
            handleSubmit2(ev) {
                var _this = this;
                this.$refs.ruleForm2.validate((valid) => {
                    if (valid) {
                        // _this.$router.replace('/table');
                        this.logining = true;
                        // NProgress.start();
                        var loginParams = { username: this.ruleForm2.account, password: this.ruleForm2.checkPass };
                        requestLogin(loginParams).then(data => {
                            this.logining = false;
                            // NProgress.done();
                            // let { code, msg, user } = data;
                            let code = parseInt(data.code);
                            let msg = data.msg;
                            let user = data.result;
                            if (code !== 0) {
                                this.$message({
                                    message: msg,
                                    type: 'error'
                                });
                            } else {
                                let LoginParams = { LoginName: this.ruleForm2.account };
                                sessionStorage.setItem('token', data.token);
                                sessionStorage.setItem('user', JSON.stringify(LoginParams));
                                if (this.checked === true) {
                                    this.rememberPwd(this.ruleForm2);  // 全局方法
                                    setCookie(this.ruleForm2.account, this.ruleForm2.checkPass, 3000)
                                } else {
                                    this.notRememberPwd();
                                    clearCookie()
                                }
                                this.$router.push({ path: '/charts' });
                            }
                        });
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
        },
        mounted() {
            this.ruleForm2 = getCookie();
        }
    }

</script>

<style lang="scss" scoped>
    .box {
        background: url(../assets/bg.jpg);
        height: 100%;
        margin:0;
        overflow:hidden;
    }

    .login-container {
        /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
        -webkit-border-radius: 5px;
        border-radius: 5px;
        -moz-border-radius: 5px;
        background-clip: padding-box;
        margin: 180px auto;
        width: 350px;
        padding: 35px 35px 15px 35px;
        background: #fff;
        border: 1px solid #eaeaea;
        box-shadow: 0 0 25px #cac6c6;
        .title {
            margin: 0px auto 40px auto;
            text-align: center;
            color: #505458;
        }
        .remember {
            margin: 0px 0px 35px 0px;
        }
    }
</style>
