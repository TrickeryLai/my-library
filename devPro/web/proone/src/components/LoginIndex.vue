
<template>
<div class="login-wrap">
	<div class="login">
		<router-view></router-view>
	</div>
</div>
</template>

<script>
export default{
	name: "LoginIndex",
	data(){
		return {}
	}

}
</script>

<style scope>
.login-wrap{
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100%;
	width: 100%;
}
.login{
	width: 14%;
	min-width: 350px;
	border: 1px solid #ccc;
	border-radius: 5px;
	text-align: center;
	padding:10px 5%;
}
.login h1{
	font-weight: normal;
	font-size: 20px;
	margin-bottom:10px;
}
.login label{
	display: inline-block;
	margin: 0 auto 5px;
	width: 100%;
	vertical-align: middle;
}
.login label.login-password{
	position: relative;
}
.login label.login-password i{
	position: absolute;
	right: 0;
	top:50%;
	transform: translate(-50%,-50%);
	font-style: normal;
	font-size: 20px;
	cursor: pointer;
}
.login label.login-password i.active{
	color: #3385ff;
}
.login label span{
	width: 70px;
	display: inline-block;
	text-align: right;
	vertical-align: middle;
}
.login button{
	display: inline-block;
	width: 75%;
	max-width: 300px;
	padding: 8px 0;
	background: #3385ff;
	border:1px solid #3385ff;
	border-radius: 5px;
	color: #fff;
	cursor: pointer;
}
.login .login-bottom{
	font-size:12px;
}
.login .login-bottom span{
	cursor: pointer;

}
.login .login-bottom span:hover{
	color: #3385ff;
}
</style>