<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="请输入查询账号" />
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getAdmins">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
        <export-zip :data="users"></export-zip>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="users" highlight-current-row v-loading="listLoading" @selection-change="selsChange"
				  style="width: 100%;text-align: center;overflow: auto" @sort-change='sortChange' border="">
      <el-table-column type="expand" width="25" >
			  	<template slot-scope="props">
					<el-form label-position="left" inline class="demo-table-expand" style="text-align: left">
            <el-form-item label="ID">
							<span>{{ props.row.id }}</span>
            </el-form-item>
						<el-form-item label="姓名">
							<span>{{ props.row.name }}</span>
            </el-form-item>
					</el-form>
			  </template>
      </el-table-column>
			<el-table-column type="selection" width="80" align="center">
			</el-table-column>
            <el-table-column type="index" width="60" align="center">
			</el-table-column>
			<el-table-column prop="id" label="ID" min-width="180" align="center" sortable>
			</el-table-column>
			<el-table-column prop="name" label="姓名" min-width="160" align="center" sortable>
                <template slot-scope="scope">
                    <el-button type="info" style="width: 100px;height: 35px;align-content: center"
							   @click="jumpUserAccount(scope.$index, scope.row)">{{scope.row.name}}</el-button>
                </template>
			</el-table-column>
			<el-table-column prop="email" label="Email" min-width="160" align="center" sortable>
			</el-table-column>
			<el-table-column prop="buildtime" label="创建时间" min-width="160" align="center" sortable>
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
				<el-form-item label="姓名" prop="name">
					<el-input v-model="editForm.name" style="width: 200px;" placeholder="请输入真实姓名" />
				</el-form-item>
				<el-form-item  label="Email" prop="email">
					<el-input v-model="editForm.email" style="width: 200px;" placeholder="请输入邮箱" />
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--新增界面-->
		<el-dialog v-dialogDrag title="新增" v-model="addFormVisible" :close-on-click-modal="false" customClass="customWidth">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-form-item label="姓名" prop="name">
					<el-input v-model="addForm.name" auto-complete="off" style="width: 230px;" placeholder="请输入新增用户" />
				</el-form-item>
				<el-form-item label="Email" prop="email">
					<el-input v-model="addForm.email" auto-complete="off" style="width: 230px;" placeholder="请输入有效邮箱" />
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
	// import NProgress from 'nprogress'
	import { getAdminListPage, removeAdmin, removeMoreAdmin, editAdmin, addAdmin } from '../../api/api';
	import ExportZip from './components/exportZip'

	export default {
	  components: {
	    ExportZip
    },
		data() {
			return {
				filters: {  // 筛选条件
					name: ''
				},
				users: [],

                SessionLN: '',
                Judge: '',

				total: 0,
				Page: 1,
				PageNum: 20,
        downloadLoading: false,
				listLoading: false,
				sels: [],  // 列表选中列

				editFormVisible: false,  // 编辑界面是否显示
				editLoading: false,
				editFormRules: {
					name: [
						{ required: true, message: '请输入真实姓名', trigger: 'blur' },{
					    min: 2, message: '真实姓名不小于两个字符'},{
						pattern: /^[\u4E00-\u9FA5]+$/, message: '姓名只能为中文'}
					],
					email: [
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
					name: '',
					email: '',
				},

				addFormVisible: false,  // 新增界面是否显示
				addLoading: false,
				addFormRules: {
					name: [
						{ required: true, message: '请输入真实姓名', trigger: 'blur' },{
					    min: 2, message: '真实姓名不小于两个字符'},{
						pattern: /^[\u4E00-\u9FA5]+$/, message: '姓名只能为中文'}
					],
					email: [
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
					name: '',
					email: '',
				}

			}
		},
		methods: {
		    // 处理列名旁边上下三角排序的功能
		    sortChange: function(column, prop, order) {
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
				let para = {
					page: this.Page,
					name: this.filters.name,
				};
				this.listLoading = true;
				// NProgress.start();
				getAdminListPage(para).then((res) => {
					// this.total = len(res);
					this.total = res.total;
					this.users = res.users;
					this.listLoading = false;
					// NProgress.done();
				}).catch((err) => {
				    console.log('加载用户列表失败', err)

				});
			},

            // 点击跳转到账单页面
			jumpUserAccount: function (index, row) {
				this.$router.push({ path: '../userAccount',query: { name: row.name}})
            },

			// 显示新增界面
			handleAdd: function () {
				this.addFormVisible = true;
				this.addForm = {
					name: '',
					email: '',
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

            // 删除
			handleDel: function (index, row) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					// NProgress.start();
					let para = { id: row.id };
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

			// 批量删除列表
			selsChange: function (sels) {
				this.sels = sels;
			},

			// 批量删除
			batchRemove: function () {
				var ids = this.sels.map(item => item.id);
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					// NProgress.start();
					let para = { ids: ids};
					removeMoreAdmin(para).then((res) => {
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
