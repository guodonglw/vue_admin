<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item style="margin-left: 20px">
					<el-input v-model="filters.RealName" placeholder="请输入查找的姓名" />
				</el-form-item>
				<el-form-item>
					<el-input v-model="filters.PhoneID" placeholder="请输入查找的手机号" />
				</el-form-item>
                <el-form-item label="收入/支出金额范围" style="margin-left: 20px">
					<el-input v-model="filters.LowAmount" placeholder="请输入范围下限" style="width: 120px"/>
					<el-input v-model="filters.HighAmount" placeholder="请输入范围上限" style="width: 120px"/>
				</el-form-item>
                <el-form-item label="注册时间" style="margin-left: 20px">
					<el-date-picker v-model="RecordTime" type="datetimerange" :picker-options="pickerOptions" range-separator="至"
					  start-placeholder="记录开始时间" end-placeholder="记录截止时间" align="right" style="width: 300px;" placeholder="请选择记录时间范围">
					</el-date-picker>
				</el-form-item>
                <el-form-item label="第一排序条件" style="margin-left: 20px">
					<el-select v-model="selectSort1" placeholder="排序条件" style="width: 130px;">
						<el-option
						  v-for="item in selectS1"
						  :key="item.selectSort1"
						  :label="item.label"
						  :value="item.selectSort1">
						</el-option>
					</el-select>
					<el-select v-model="DescAsc1" placeholder="排序方式" style="width: 130px;">
						<el-option
						  v-for="item in DescOrAsc1"
						  :key="item.DescAsc1"
						  :label="item.label"
						  :value="item.DescAsc1">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="第二排序条件" style="margin-left: 20px">
					<el-select v-model="selectSort2" placeholder="排序条件" style="width: 130px;">
						<el-option
						  v-for="item in selectS2"
						  :key="item.selectSort2"
						  :label="item.label"
						  :value="item.selectSort2">
						</el-option>
					</el-select>
					<el-select v-model="DescAsc2" placeholder="排序方式" style="width: 130px;">
						<el-option
						  v-for="item in DescOrAsc2"
						  :key="item.DescAsc2"
						  :label="item.label"
						  :value="item.DescAsc2">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item style="margin-left: 20px">
					<el-button type="primary" v-on:click="getUserAccounts">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="userAccounts" highlight-current-row v-loading="listLoading" @selection-change="selsChange"
				  style="width: 100%;text-align: center;align-items: center;" @sort-change='sortChange' border="">
			<el-table-column type="expand" width="25" >
			  	<template slot-scope="props">
					<el-form label-position="left" inline class="demo-table-expand" style="text-align: left">
                        <el-form-item label="账户ID">
							<span>{{ props.row.SAID }}</span>
				  		</el-form-item>
						<el-form-item label="姓名">
							<span>{{ props.row.RealName }}</span>
				  		</el-form-item>
					</el-form>
			  </template>
            </el-table-column>
			<el-table-column type="selection" width="55" align="center">
			</el-table-column>
            <el-table-column prop="AccountID" label="账单ID" min-width="80" align="center" sortable='custom'>
			</el-table-column>
			<el-table-column prop="SAID" label="账户ID" min-width="80" align="center" sortable='custom'>
			</el-table-column>
			<el-table-column prop="RealName" label="姓名" show-overflow-tooltip min-width="85" align="center"  sortable='custom'>
			</el-table-column>
			<el-table-column prop="PhoneID" label="手机号" min-width="90" show-overflow-tooltip align="center" sortable='custom'>
			</el-table-column>
            <el-table-column prop="InOrOut" label="收入/支出" min-width="90" show-overflow-tooltip align="center" sortable='custom'>
			</el-table-column>
			<el-table-column prop="Amount" label="金额" min-width="105" align="center" sortable='custom'>
				<template slot-scope="scope">
                    <el-button type="success" style="width: 100px;height: 35px;align-content: center"
							   @click="handleClickAmount(scope.$index, scope.row)">{{scope.row.Amount}}</el-button>
                </template>
			</el-table-column>
			<el-table-column prop="RecordTime" label="记录时间" min-width="120" show-overflow-tooltip align="center" sortable='custom'>
			</el-table-column>
			<el-table-column label="操作" width="100" align="center">
				<template slot-scope="scope">
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
			<el-button type="success" @click="handleBatchAddAmount" :disabled="this.sels.length===0">批量充值</el-button>
			<el-pagination layout="total,prev, pager, next, jumper" @current-change="handleCurrentChange"
						   :page-size="PageNum" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--点击剩余足记币时所显示的对话框-->
		<el-dialog v-dialogDrag title="用户点券" v-model="addAmountVisible" :close-on-click-modal="false" customClass="customWidth">
			<el-form :model="addAmountForm" label-width="100px" :rules="addAmountFormRules" ref="addAmountForm">
				<el-form-item label="用户ID" prop="UserID">
					<el-input v-model="addAmountForm.AccountID" auto-complete="off" style="width: 200px;"
							  placeholder="用户ID" :disabled="true" />
				</el-form-item>
				<el-form-item label="当前金额" prop="Amount">
					<el-input v-model="addAmountForm.Amount" auto-complete="off" style="width: 200px;"
							  placeholder="当前金额" :disabled="true" />
				</el-form-item>
				<el-form-item label="增加金额" prop="Number">
					<el-input v-model="addAmountForm.Number" auto-complete="off" style="width: 200px;"
							  placeholder="输入增加金额（整数如:20）" />
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addAmountVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addAmountSubmit" :loading="addAmountLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--批量充值-->
		<el-dialog v-dialogDrag title="多人充值" v-model="addAmountVisible_1" :close-on-click-modal="false" customClass="customWidth">
			<el-form :model="addAmountForm" label-width="100px" :rules="addAmountFormRules" ref="addAmountForm">
				<el-form-item label="用户ID" prop="UserID">
					<el-input v-model="addAmountForm.AccountID" auto-complete="off" style="width: 200px;" placeholder="请输入用户ID" />
				</el-form-item>
				<el-form-item label="充值" prop="Number">
					<el-input v-model="addAmountForm.Number" auto-complete="off" style="width: 200px;" placeholder="输入充值金额（整数如:20）" />
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addAmountVisible_1 = false">取消</el-button>
				<el-button type="primary" @click.native="batchAddAmountSubmit" :loading="addAmountLoading">提交</el-button>
			</div>
		</el-dialog>

	</section>
</template>

<script>
	import util from '../../common/js/util'
	// import NProgress from 'nprogress'
	import { getUserAccountListPage, addUserAccountAmount } from '../../api/api';

	export default {
		data() {
			return {
				filters: {
					RealName: '',
					PhoneID: '',
                    LowAmount: '',
					HighAmount: '',
					OrderField: 'AccountID',
					AscOrDesc: 'descending'
				},

				pickerOptions: {
                    shortcuts: [{
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近三个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                            picker.$emit('pick', [start, end]);
                        }
                    }]
				},
				RecordTime: '',

                selectS1: [{  // 排序条件一
				    selectSort1: '""',
				    label: '排序条件'
				}, {
				    selectSort1: 'PhoneID',
				    label: '手机号'
				}, {
				    selectSort1: 'RecordTime',
				    label: '注册时间'
				}],
				selectSort1: '""',

				DescOrAsc1: [{  // 升序/降序
				    DescAsc1: '""',
				    label: '排序方式'
				}, {
				    DescAsc1: 'ASC',
				    label: '升序'
				}, {
				    DescAsc1: 'DESC',
				    label: '降序'
				}],
				DescAsc1: '""',

				selectS2: [{  // 排序条件二
				    selectSort2: '""',
				    label: '排序条件'
				}, {
				    selectSort2: 'PhoneID',
				    label: '手机号'
				}, {
				    selectSort2: 'RecordTime',
				    label: '注册时间'
				}],
				selectSort2: '""',

				DescOrAsc2: [{  // 升序/降序
				    DescAsc2: '""',
				    label: '排序方式'
				}, {
				    DescAsc2: 'ASC',
				    label: '升序'
				}, {
				    DescAsc2: 'DESC',
				    label: '降序'
				}],
				DescAsc2: '""',

				userAccounts: [],
				total: 0,
				Page: 1,
				PageNum: 15,
				listLoading: false,
				sels: [],  // 列表选中列

				// 足记币充值
				addAmountVisible: false,
				addAmountVisible_1: false,  // 批量充值对话框
				addAmountLoading: false,
				addAmountFormRules: {
					AccountID: [
						{ required: true, message: '请输入账单ID', trigger: 'blur' },
					],
					Number: [
						{ required: true, message: '请输入充值数值', trigger: 'blur' },{
						pattern: /^[0-9]*[1-9][0-9]*$/, message: '数值只能为正整数'}
					],
				},
				addAmountForm: {
					UserID: '',
					Number: '',
				},
			}
		},
		methods: {
		    // 排序功能
		    sortChange: function(column, prop, order) {
				this.filters.OrderField = column.prop;
				this.filters.AscOrDesc = column.order;
				this.getUserAccounts();
			},

			// 翻页功能
			handleCurrentChange(val) {
				this.Page = val;
				this.getUserAccounts();
			},

			// 获取用户列表
			getUserAccounts() {
		        // 修改查询的时间格式
		        var FirstCreatTime = this.CreateTime
		        if(this.CreateTime && this.CreateTime.length > 0){
		            var CreateTime = [];
		            this.CreateTime.forEach(function (row) {
						row = (!row || row == '') ? '' : util.formatDate.format(row,'yyyy-MM-dd hh:mm:ss')
						CreateTime.push(row)
                	});
					this.CreateTime = CreateTime
				}

				if (((this.selectSort1 !== '""') && (this.DescAsc1 !== '""')) || ((this.selectSort2 !== '""') && (this.DescAsc2 !== '""'))){
		            this.filters.OrderField = '';
		            this.filters.AscOrDesc = '';
				}else {
		            if (this.filters.OrderField === null || this.filters.OrderField === '') {
						this.filters.OrderField = 'AccountID';
						this.filters.AscOrDesc = 'descending'
					}else {}
				}

				let para = {
				    Page: this.Page,
					PageNum: this.PageNum,
					SAID: this.filters.SAID,
					RealName: this.filters.RealName,
					PhoneID: this.filters.PhoneID,
                    LowAmount: this.filters.LowAmount,
					HighAmount: this.filters.HighAmount,
					RecordTime: this.RecordTime,
					OrderField: this.filters.OrderField,
					AscOrDesc: this.filters.AscOrDesc,
                    selectSort1: this.selectSort1,
					DescAsc1: this.DescAsc1,
					selectSort2: this.selectSort2,
					DescAsc2: this.DescAsc2,
				};
				this.listLoading = true;
				this.CreateTime = FirstCreatTime;
				// NProgress.start();
				getUserAccountListPage(para).then((res) => {
					this.total = res.result.total;
					this.userAccounts = res.result.data;
					this.listLoading = false;
					// NProgress.done();
				}).catch((err) => {
				    console.log('加载用户列表失败', err)
				});
			},

			//删除
			handleDel: function (index, row) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					// NProgress.start();
					let para = { UserID: row.UserID};
					removeUser(para).then((res) => {
						this.listLoading = false;
						// NProgress.done();
						let code = parseInt(res.code);
						let msg = res.msg;
						if (code == 0) {
						    this.$message({
							message: '删除成功',
							type: 'success'
							});
						}
						else{
						    this.$message({
							message: msg,
							type: 'error'
							});
						}
						this.getUserAccounts();
					});
				}).catch((err) => {
				    console.log('删除失败', err)
				});
			},

            // 点击充值记录跳转到充值记录页面
			jumpOrder: function (index, row) {
				this.$router.push({ path: '../order',query: { UserID: row.UserID }})
            },

			// 点击账户余额
			handleClickAmount:function (index, row) {
		        this.addAmountVisible = true;
				let SAID = String(row.SAID);
				let AccountID = String(row.AccountID);
				this.addAmountForm = {
				    AccountID: AccountID,
				    SAID: SAID,
					Amount: row.Amount,
					Number: ''
				}
            },

			// 提交充值足记币操作
			addAmountSubmit: function () {
				this.$refs.addAmountForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addAmountLoading = true;
							// NProgress.start();
							let para = Object.assign({}, this.addAmountForm);
							addUserAccountAmount(para).then((res) => {
								this.addAmountLoading = false;
								// NProgress.done();
								let code = parseInt(res.code);
								let msg = res.msg;
								if (code == 0){
									this.$message({
										message: '充值成功',
										type: 'success'
									});
									this.$refs['addAmountForm'].resetFields();
									this.addAmountVisible = false;
									this.getUserAccounts();
								}
								else {
								    this.$message({
										message: msg,
										type: 'error'
									});
									this.$refs['addAmountForm'].resetFields();
									this.addAmountVisible = false;
									this.getUserAccounts();
								}
							}).catch((err) => {
				    				console.log('充值失败', err)
							});
						});
					}
				});
			},

			selsChange: function (sels) {
				this.sels = sels;
			},

			// 批量充值
			handleBatchAddAmount: function () {
				this.addAmountVisible_1 = true;
				var idss = this.sels.map(item => parseInt(item.AccountID)).toString();
				this.addAmountForm.AccountID = idss;
			},
			batchAddAmountSubmit: function () {
			    var ids = this.sels.map(item => parseInt(item.AccountID));
				this.$refs.addAmountForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addAmountLoading = true;
							// NProgress.start();
							let para = Object.assign({}, this.addAmountForm);
							addUserAccountAmount(para).then((res) => {
								this.addAmountLoading = false;
								// NProgress.done();
								let code = parseInt(res.code);
								let msg = res.msg;
								if (code == 0){
									this.$message({
										message: '充值成功',
										type: 'success'
									});
									this.$refs['addAmountForm'].resetFields();
									this.addAmountForm.Number = '';
									this.addAmountVisible_1 = false;
									this.getUserAccounts();
								}
								else {
								    this.$message({
										message: msg,
										type: 'error'
									});
									this.$refs['addAmountForm'].resetFields();
									this.addAmountForm.Number = '';
									this.addAmountVisible_1 = false;
									this.getUserAccounts();
								}
							}).catch((err) => {
				    				console.log('充值失败', err)
							});
						});
					}
				});
			},

			// 批量删除
			batchRemove: function () {
				let ids = this.sels.map(item => parseInt(item.AccountID));
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					// NProgress.start();
					console.log(ids);
					let para = { AccountID: ids};
					console.log(para);
					removeUser(para).then((res) => {
						this.listLoading = false;
						// NProgress.done();
						let code = parseInt(res.code);
						let msg = res.msg;
						if (code == 0) {
						    this.$message({
							message: '删除成功',
							type: 'success'
							});
						}
						else{
						    this.$message({
							message: '删除失败',
							type: 'error'
							});
						}
						this.getUserAccounts();
					});
				}).catch((err) => {
						console.log('删除失败', err)
				});
			},


		},
		mounted() {
		    if (this.$route.query.SAID){
		        this.filters.SAID = this.$route.query.SAID;
		        this.getUserAccounts();
			}else{
		        this.getUserAccounts();
			}
		}
	}

</script>

<style>
	.demo-table-expand {
        font-size: 0;
    }
    .demo-table-expand label {
        width: 100px;
        color: #99a9bf;
    }
    .demo-table-expand .el-form-item {
		margin-left: 5%;
        margin-right: 0;
        margin-bottom: 0;
        width: 40%;
    }
	.customWidth{
        width:23%;
		min-width: 500px;
    }
</style>
