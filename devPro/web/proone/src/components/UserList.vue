<template>
<div>
<table>
	<thead>
		<tr>
			<th>用户名</th>
			<th>注册时间</th>
			<th>上次登录时间</th>
			<th>状态</th>
			<th>操作</th>
		</tr>
	</thead>
	<tbody>
		<tr v-for="item in userListData" :key="item.username">
			<td>{{item.username}}</td>
			<td>{{item.createTime}}</td>
			<td>{{item.loginTime}}</td>
			<td>{{item.isUsed}}</td>
			<td>
				<button type="button" @click="viewFn(item)">查看</button>
				<button type="button" @click="changeFn(item)">修改</button>
			</td>
		</tr>
	</tbody>
	
</table>
<Model :isModelVialiable = 'modelState' @ok="modelOk" @close="modelClose" class="model-box" :closeBtnHide="closeBtnHide">
	<template v-slot:model-title>{{modelTitle}}</template>
	<template v-slot:model-content class="model-content">
		<label><span>用户名：</span><MyInput :disabled="inputDisabled" v-model="currentItem.username"/></label>
		<label>
			<span>状态：</span>
			<label>可用<input type="radio" name="state" value="1" v-model="currentItem.isUsed" :disabled="inputDisabled" /></label>
			<label>不可用<input type="radio" name="state" value="0" v-model="currentItem.isUsed" :disabled="inputDisabled" /></label>
			{{currentItem.isUsed}}
		</label>
	</template>
</Model>
</div>
</template>

<script>
import common from "@/commons/common";

export default {
	name: "Userlist",
	data(){
		return {
			userListData: [],
			modelState: false,
			modelTitle: '查看',
			currentItem: {},
			inputDisabled: true,
			closeBtnHide: false
		}
	},
	methods:{
		getListData(){
			//getData
			let sessionData = JSON.parse(sessionStorage.getItem('userData'))|| {} ;
			let _this = this;
			this.$axios.get({
				url: '/getUserData?user=' + sessionData.user,
				success(res){
					if(res.data.code == 0){
						_this.userListData = res.data.data;
					}
				}
			})
		},
		viewFn(item){
			this.closeBtnHide = true;
			this.currentItem = Object.assign({}, item);
			this.modelState = true;
			this.modelTitle = '查看';
			this.inputDisabled = true;
		},
		changeFn(item){
			this.closeBtnHide = false;
			this.currentItem = Object.assign({}, item);
			this.modelState = true;
			this.modelTitle = '修改';
			this.inputDisabled = false;
		},
		modelClose(){
			this.modelState = false;
		},
		modelOk(){
			let _this = this;
		
			let sessionData = JSON.parse(sessionStorage.getItem("userData"))
			this.modelState = false;
			if(this.inputDisabled){
				return;
			}

			this.$axios.post({
				url: '/changeUserData',
				data: {
					username: sessionData.user,
					changeid: this.currentItem.username,
					isUsed: this.currentItem.isUsed
				},
				success(res){
					if(res.data.code == 0){
						_this.getListData();
					}else{

					}
				}
			})
		}
	},
	created(){
		this.getListData();
	}
}
</script>

<style scope>
table, tr, th, td{
	border-collapse: collapse;
	border: 1px solid #ccc;
	text-align: center;
}

th, td{
	padding: 5px 3px;
	width: auto;
	word-break: break-all;
	max-width: 200px;
}
.model-content>label{
	width: 100%;
	display: inline-block;
}
.model-content>label span{
	width: 100px;
	text-align: right;
	display: inline-block;
}
.model-content label input{
	vertical-align: middle;
}

</style>