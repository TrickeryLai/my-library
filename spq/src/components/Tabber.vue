<template>
	<div>
		<router-view/>	
		<van-tabbar v-model="active">
			<van-tabbar-item to="/home/billHall">
				大厅
				<i
				slot="icon"
				slot-scope="props"
				class="iconfont icon-home3"
				>
				</i>
			</van-tabbar-item>
			<van-tabbar-item icon="column" to="/home/ticketHolder">
				票方
				<i
				slot="icon"
				slot-scope="props"
				class="iconfont icon-ticket"
				>
				</i>
			</van-tabbar-item>
			<van-tabbar-item icon="orders-o" to="/home/order">
				资方
				<i
				slot="icon"
				slot-scope="props"
				class="iconfont icon-order2"
				>
				</i>
			</van-tabbar-item>
			<van-tabbar-item icon="manager" to="/home/selfInfo">
				我的
				<i
				slot="icon"
				slot-scope="props"
				class="iconfont icon-mine"
				>
				</i>
			</van-tabbar-item>
		</van-tabbar>
	</div>
</template>

<script>
	import Vue from 'vue'
	import { Tabbar, TabbarItem } from 'vant';
	Vue.use(Tabbar).use(TabbarItem);

	export default {
		name: 'Tabbar',
		data() {
			return {
				active: 0
			}
		},
		created(){
			this.setTabActive(this.$route);
		},
		methods:{
			setTabActive(now){
				if(now.path.indexOf('billHall') >= 0) {
					this.active = 0;
					return;
				}
				if(now.path.indexOf('ticketHolder') >= 0) {
					this.active = 1;
					return;
				}
				if(now.path.indexOf('order') >= 0) {
					this.active = 2;
					return;
				}
				if(now.path.indexOf('selfInfo') >= 0) {
					this.active = 3;
					return;
				}
			}
		},
		watch: {
			$route(now,old) {
				this.setTabActive(now); 
        	}
		}
	}
</script>
