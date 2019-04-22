<template>
    <section class="chart-container">
        <el-row>
            <section class="data_section">
                <header class="section_title">数据统计</header>
                <el-row :gutter="20" >
                    <el-col :span="8"><div class="data_list today_head"><span class="data_num head">当日数据：</span></div></el-col>
                    <el-col :span="6"><div class="data_list"><span class="data_num">{{total_admin_today}}</span> 新增管理员</div></el-col>
                    <el-col :span="6"><div class="data_list"><span class="data_num">{{total_userAccounts_today}}</span> 新增账单</div></el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="8"><div class="data_list all_head"><span class="data_num head">总数据：</span></div></el-col>
                    <el-col :span="6"><div class="data_list"><span class="data_num">{{total_admin}}</span> 管理员</div></el-col>
                    <el-col :span="6"><div class="data_list"><span class="data_num">{{total_userAccounts}}</span> 账单</div></el-col>
                </el-row>
            </section>
            <el-col :span="12">
                <div id="chartColumn" style="width:100%; height:430px;"></div>
            </el-col>
            <el-col :span="12">
                <div id="chartLine" style="width:103%; height:400px;"></div>
            </el-col>
            <!--
            <el-col :span="12">
                <div id="chartLine1" style="width:103%; height:400px;"></div>
            </el-col>
            -->
        </el-row>
    </section>
</template>

<script>
    import util from '../../common/js/util'
    import echarts from 'echarts'
    import {requestTotal,requestWeek} from "../../api/api";

    export default {
        data() {
            return {
                // chartColumn: null,
                chartLine: null,
                chartLine1: null,

                total_admin: '',
                total_userAccounts: '',

                total_admin_today:'',
                total_userAccounts_today: '',

                week: [],

                Roles: [],
                UserAccounts: [],
            }
        },

        methods: {
            // 获取七日数据
            async getAdminsWeek() {
                // 获取一周的日期并作简单处理
                let week = [];
                for (let i = 0; i < 7; i++) {
                    week.push(util.formatDate.format(new Date(new Date().getTime() - i*24*60*60*1000), 'yyyy-MM-dd'))
                }
                this.week = week;

                // 构建请求条件（一周的时间戳）
                let now_time = util.formatDate.format(new Date(new Date().getTime()), 'yyyy-MM-dd hh:mm:ss');
                let time = util.formatDate.format(new Date(new Date().getTime() - 6*24*60*60*1000), 'yyyy-MM-dd 00:00:00');
                let para = {
                    QueryTime: [time, now_time],
                };
                // NProgress.start();
                await requestWeek(para).then((res) => {
                    let weekRoles = [];  // 一周管理员趋势数据（中间变量）
                    let weekUserAccounts = [];  // 一周账单趋势数据（中间变量）
                    this.week.forEach(function (item) {
                        let roleItem = (!res.result.Roles[item]) ? 0 : res.result.Roles[item];
                        let userAccountItem = (!res.result.UserAccounts[item]) ? 0 : res.result.UserAccounts[item];
                        weekRoles.push(roleItem);
                        weekUserAccounts.push(userAccountItem)
                    });
                    this.Roles = weekRoles;
                    this.UserAccounts = weekUserAccounts;

                    // 当日数据
                    this.total_admin_today = this.Roles[0];
                    this.total_userAccounts_today = this.UserAccounts[0];

                    let para = {};
                    // NProgress.start();
                    // 获取总数据接口
                    requestTotal(para).then((res) => {
                        this.total_admin = res.result.RoleCount;
                        this.total_userAccounts = res.result.UserAccountsCount;
                        this.drawColumnChart();
                        this.drawLineChart();
                        // NProgress.done();
                    });
					// NProgress.done();
				});
            },

            // 调用echarts绘制柱状图函数
            drawColumnChart() {
                this.chartColumn = echarts.init(document.getElementById('chartColumn'));
                this.chartColumn.setOption({
                    title: {text: '概览'},
                    tooltip: {},
                    xAxis: {
                        data: ["管理员", "账单"]
                    },
                    yAxis: {},
                    series: [{
                        name: '数量',
                        type: 'bar',
                        data: [this.total_admin, this.total_userAccounts],
                        itemStyle : { normal: {label : {show: true}}}
                    }]
                });
            },

            // 调用echarts绘制折线图函数
            drawLineChart() {
                this.chartLine = echarts.init(document.getElementById('chartLine'));
                this.chartLine.setOption({
                    title: {
                        text: '七日增量走势'
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data: ['管理员增量', '账单增量']
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: [this.week[6], this.week[5], this.week[4], this.week[3],
                            this.week[2] , this.week[1], this.week[0]]
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [
                        {
                            name: '管理员增量',
                            type: 'line',
                            // stack: '数量',
                            data: [this.Roles[6], this.Roles[5], this.Roles[4], this.Roles[3],
                                this.Roles[2], this.Roles[1], this.Roles[0]],
                            itemStyle : { normal: {label : {show: true}}}
                        },
                        {
                            name: '账单增量',
                            type: 'line',
                            // stack: '数量',
                            data: [this.UserAccounts[6], this.UserAccounts[5], this.UserAccounts[4], this.UserAccounts[3],
                                this.UserAccounts[2], this.UserAccounts[1], this.UserAccounts[0]],
                            itemStyle : { normal: {label : {show: true}}}
                        }
                    ]
                });
            },
        },

        mounted: function () {
            this.getAdminsWeek();
        },
    }

</script>

<style scoped lang="less">
    .data_section{
		padding: 20px;
		margin-bottom: 40px;
		.section_title{
			text-align: center;
			font-size: 30px;
			margin-bottom: 10px;
		}
		.data_list{
			text-align: center;
			font-size: 14px;
			color: #666;
            border-radius: 6px;
            background: #E5E9F2;
            .data_num{
                color: #333;
                font-size: 26px;

            }
            .head{
                border-radius: 6px;
                font-size: 22px;
                padding: 4px 0;
                color: #fff;
                display: inline-block;
            }
        }
        .today_head{
            background: #FF9800;
        }
        .all_head{
            background: #20A0FF;
        }
	}
    .chart-container {
        width: 100%;
        float: left;
    }
    /*
    .chart div {
        height: 400px;
        float: left;
    }
    */

    .el-col {
        padding: 30px 20px;
    }
</style>
