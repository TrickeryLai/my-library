<template>
	<div>
		<van-col span="22">
			<van-field
				:autocomplete = 'autocomplete1'
				class="van-hairline--surround register-input"
				style="display:inline-block;margin:0;padding:0;"
				v-model="password"
				@input="inputFn"
				key="password" 
				:placeholder="placeholderV"
				:type="isShowWord ? 'text': 'password'" />
		</van-col>
		<van-col span="2" style="background: #eee;height: 36px;line-height: 36px;">
			<i
			@click="showWordFn" 
			class="iconfont"
			:class="{'icon-eye-fill': isShowWord, 'icon-eyeslash-fill': !isShowWord}"
			></i>
		</van-col>
	</div>
</template>

<script>
	export default{
		name: 'PasswordI',
		props:['vModel', 'placeholder', 'autocomplete'],
		data(){
			return {
				autocomplete1: this.autocomplete,
				placeholderV: this.placeholder ? this.placeholder : '请输入密码',
				password: this.vModel,
				isShowWord: false,
			}
		},
		methods:{
			showWordFn(){
				this.isShowWord = !this.isShowWord;
			},
			inputFn(v){
				this.$emit('input', v);
			}
		}
	}
</script>