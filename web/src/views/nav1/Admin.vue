<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.LoginName" placeholder="请输入查询账号" />
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getAdmins">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="users" highlight-current-row v-loading="listLoading" @selection-change="selsChange"
				  style="width: 100%;text-align: center;" @sort-change='sortChange' border="">
			<el-table-column type="selection" width="80" align="center">
			</el-table-column>
			<el-table-column prop="SAID" label="SAID" min-width="100" align="center" sortable='custom'>
			</el-table-column>
			<el-table-column prop="LoginName" label="账号" min-width="160" align="center" sortable='custom'>
			</el-table-column>
			<el-table-column prop="RealName" label="真实姓名" min-width="160" align="center" sortable='custom'>
                <template slot-scope="scope">
                    <el-button type="info" style="width: 100px;height: 35px;align-content: center"
							   @click="jumpUserAccount(scope.$index, scope.row)">{{scope.row.RealName}}</el-button>
                </template>
			</el-table-column>
			<el-table-column prop="Email" label="Email" min-width="160" align="center" sortable='custom'>
			</el-table-column>
			<el-table-column prop="CreateTime" label="创建时间" min-width="160" align="center" sortable='custom'>
			</el-table-column>
			<el-table-column prop="LastLogin" label="最后登录时间" min-width="160" align="center" sortable='custom'>
			</el-table-column>
            <el-table-column prop="LastIP" label="最后登录IP" min-width="160" align="center" sortable='custom'>
			</el-table-column>
			<el-table-column label="操作" width="150">
				<template slot-scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
			<el-pagination layout="total, prev, pager, next, jumper" @current-change="handleCurrentChange"
						   :page-size="15" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--编辑界面-->
		<el-dialog v-dialogDrag title="编辑" v-model="editFormVisible" :close-on-click-modal="false" customClass="customWidth">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="账号" prop="LoginName" >
					<el-input v-model="editForm.LoginName" auto-complete="off" style="width: 200px;" :disabled="true" />
				</el-form-item>
				<el-form-item v-if="Judge" label="密码" prop="Password">
					<el-input v-model="editForm.Password" auto-complete="off" style="width: 200px;" type="password" placeholder="请输入密码" />
				</el-form-item>
				<el-form-item v-if="Judge" label="真实姓名" prop="RealName">
					<el-input v-model="editForm.RealName" style="width: 200px;" placeholder="请输入真实姓名" />
				</el-form-item>
				<el-form-item v-if="Judge" label="Email" prop="Email">
					<el-input v-model="editForm.Email" style="width: 200px;" placeholder="请输入邮箱" />
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button v-if="Judge" type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--新增界面-->
		<el-dialog v-dialogDrag title="新增" v-model="addFormVisible" :close-on-click-modal="false" customClass="customWidth">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-form-item label="账号" prop="LoginName">
					<el-input v-model="addForm.LoginName" auto-complete="off" style="width: 230px;" placeholder="请输入新增账号（至少两个字符）" />
				</el-form-item>
				<el-form-item label="密码" prop="Password">
					<el-input v-model="addForm.Password" auto-complete="off" style="width: 230px;" type="password" placeholder="账号密码（6-30位字符组成）" />
				</el-form-item>
				<el-form-item label="真实姓名" prop="RealName">
					<el-input v-model="addForm.RealName" auto-complete="off" style="width: 230px;" placeholder="请输入真实姓名" />
				</el-form-item>
				<el-form-item label="Email" prop="Email">
					<el-input v-model="addForm.Email" auto-complete="off" style="width: 230px;" placeholder="请输入有效邮箱" />
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
	// import util from '../../common/js/util'
	// import NProgress from 'nprogress'
	import { getAdminListPage, removeAdmin, editAdmin, addAdmin } from '../../api/api';

	export default {
		data() {
			return {
				filters: {
					LoginName: '',
					OrderField: 'LastLogin',
					AscOrDesc: 'descending'
				},
				users: [],

                SessionLN: '',
                Judge: '',

				total: 0,
				Page: 1,
				PageNum: 15,
				listLoading: false,
				sels: [],  // 列表选中列

				editFormVisible: false,  // 编辑界面是否显示
				editLoading: false,
				editFormRules: {
					LoginName: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					],
					Password: [
						{ required: true, message: '请输入密码', trigger: 'blur' }, {
					    pattern: /^[a-zA-Z0-9~'!@#￥$%^&*()-+_=:]{6,30}$/, message: '只能输入6-30个字母、数字、特殊字符'}, {
					    min: 6, max: 30, message: '长度为 6 到 30 个字符'},
					],
					RealName: [
						{ required: true, message: '请输入真实姓名', trigger: 'blur' },{
					    min: 2, message: '真实姓名不小于两个字符'},{
						pattern: /^[\u4E00-\u9FA5]+$/, message: '姓名只能为中文'}
					],
					Email: [
						{
						    required: true, message: '请输入邮箱地址',
							trigger: 'blur'
						}, {
					    	pattern: /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/,
							message: '请输入正确的邮箱地址'
						}
					],
				},
				// 编辑界面数据
				editForm: {
					LoginName: '',
					Password: '',
					RealName: '',
					Email: '',
				},

				addFormVisible: false,  // 新增界面是否显示
				addLoading: false,
				addFormRules: {
					LoginName: [
						{ required: true, message: '请输入账号', trigger: 'blur' },{
					    min: 2, message: '账号不小于两个字符'}
					],
					Password: [
						{ required: true, message: '请输入密码', trigger: 'blur' }, {
					    pattern: /^[a-zA-Z0-9~'!@#￥$%^&*()-+_=:]{6,30}$/, message: '只能输入6-30个字母、数字、特殊字符'}, {
					    min: 6, max: 30, message: '长度为 6 到 30 个字符'},
					],
					RealName: [
						{ required: true, message: '请输入真实姓名', trigger: 'blur' },{
					    min: 2, message: '真实姓名不小于两个字符'},{
						pattern: /^[\u4E00-\u9FA5]+$/, message: '姓名只能为中文'}
					],
					Email: [
						{
						    required: true,
							message: '请输入邮箱地址', trigger: 'blur'
						}, {
					    	pattern: /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/,
							message: '请输入正确的邮箱地址'
						}
					],
				},
				// 新增界面数据
				addForm: {
					LoginName: '',
					Password: '',
					RealName: '',
					Email: '',
				}

			}
		},
		methods: {
		    // 处理列名旁边上下三角排序的功能
		    sortChange: function(column, prop, order) {
    			// console.log(column + '-' + column.prop + '-' + column.order),
				this.filters.OrderField = column.prop;
				this.filters.AscOrDesc = column.order;
				this.getAdmins();
			},

			// 处理翻页相关函数
			handleCurrentChange(val) {
				this.Page = val;
				this.getAdmins();
			},

			// 获取用户列表
			getAdmins() {
		        if (this.filters.OrderField === null) {
		            this.filters.OrderField = 'LastLogin';
		            this.filters.AscOrDesc = 'descending'
				}else{}

				let para = {
					Page: this.Page,
					PageNum: this.PageNum,
					LoginName: this.filters.LoginName,
					OrderField: this.filters.OrderField,
					AscOrDesc: this.filters.AscOrDesc
				};
				this.listLoading = true;
				// NProgress.start();
				getAdminListPage(para).then((res) => {
					// this.total = len(res);
					// console.log(res);
					this.total = res.result.total;
					this.users = res.result.data;
					this.listLoading = false;
					// NProgress.done();
				}).catch((err) => {
				    console.log('加载用户列表失败', err)

				});
			},

            // 点击跳转到账单页面
			jumpUserAccount: function (index, row) {
				this.$router.push({ path: '../userAccount',query: { SAID: row.SAID }})
            },

			// 删除
			handleDel: function (index, row) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					// NProgress.start();
					let para = { SAID: row.SAID };
					removeAdmin(para).then((res) => {
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
						this.getAdmins();
					});
				}).catch((err) => {
				    console.log('删除失败', err)
				});
			},

			// 显示新增界面
			handleAdd: function () {
				this.addFormVisible = true;
				this.addForm = {
					LoginName: '',
					RealName: '',
					Email: '',
				};
			},
			// 新增
			addSubmit: function () {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							// NProgress.start();
							let para = Object.assign({}, this.addForm);
							addAdmin(para).then((res) => {
								this.addLoading = false;
								// NProgress.done();
								let code = parseInt(res.code);
								let msg = res.msg;
								if (code == 0){
									this.$message({
										message: '提交成功',
										type: 'success'
									});
									this.$refs['addForm'].resetFields();
									this.addFormVisible = false;
									this.getAdmins();
								}
								else {
								    this.$message({
										message: msg,
										type: 'error'
									});
									this.$refs['addForm'].resetFields();
									this.addFormVisible = false;
									this.getAdmins();
								}
							}).catch((err) => {
				    				console.log('添加失败', err)
							});
						});
					}
				});
			},

			// 显示编辑界面
			handleEdit: function (index, row) {
		        let SessionLN = JSON.parse(sessionStorage.getItem('user'));
		        this.SessionLN = SessionLN.LoginName;
                this.Judge = (this.SessionLN === row.LoginName) ? this.Judge = true : this.Judge = false;
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);

			},
			// 编辑
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;
							// NProgress.start();
							let para = Object.assign({}, this.editForm);
							editAdmin(para).then((res) => {
								this.editLoading = false;
								// NProgress.done();
								let code = parseInt(res.code);
								let msg = res.msg;
								if (code == 0) {
								    this.$message({
									message: '提交成功',
									type: 'success'
								});
								}
								else{
								    this.$message({
									message: msg,
									type: 'error'
								});
								}
								this.$refs['editForm'].resetFields();
								this.editFormVisible = false;
								this.getAdmins();
							});
						}).catch((err) => {
				    			console.log('更新失败', err)

						});
					}
				});
			},

			// 批量删除列表
			selsChange: function (sels) {
				this.sels = sels;
			},

			// 批量删除
			batchRemove: function () {
				var ids = this.sels.map(item => parseInt(item.SAID));
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					// NProgress.start();
					let para = { SAID: ids};
					removeAdmin(para).then((res) => {
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
						this.getAdmins();
					});
				}).catch((err) => {
						console.log('删除失败', err)
				});
			},
		},
		created() {
			this.getAdmins();
		}
	}

</script>

<style>
	.customWidth{
        width:20%;
		min-width: 200px;
    }
</style>
