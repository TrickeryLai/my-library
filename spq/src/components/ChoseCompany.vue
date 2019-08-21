<template>
	<div>
		<van-nav-bar
		fixed
		class="top-bg"
		>
			<span slot="title" class="top-bg-title">{{title}}</span>
		</van-nav-bar>
        <div>
          	<van-cell-group>
              <van-cell v-for="(item, index) in searchList"
                :key="index"                
                clickable 
                @click="choseCompany(item)"
                >
                <span slot="title" style="display: inline-block;">{{item.companyName}}</span>
              </van-cell>
            </van-cell-group>
        </div>
        <!-- <van-row style="margin-top: 20px;position: fixed;left:0;bottom:0;width: 100%;background: #fff;padding: 10px 0;">
          <van-col span="10" offset="1">
            <van-button  type="default" style="width:100%;" @click="toBuyModelClose">取消</van-button>
          </van-col>
          <van-col span="10" offset="2">
            <van-button class="baseBtn" type="info" style="width:100%;" @click="toBuyModelConfirm">确认</van-button>
          </van-col>
        </van-row> -->
      </div>
</template>

<script type="text/javascript">

	import _server from '@/server/server';
	import _common from '@/server/index';

	export default {
		name: 'ChoseCompany',
		data(){
			return{
				title: '企业选择',
				searchList: [],
			}
		},
		created(){
			this.getCompanyList();
		},
		methods: {
			getCompanyList(){
				_server.getCompanies().then(res => {
					if(res.code == 0){
						this.searchList = res.data;
					}else{
						this.$toast(res.errMsg);
					}
				}).catch(error => {

				})
			},

			choseCompany(item){
				let data = {
					companyId: item.companyId
				}
				_server.changeCompany(data).then(res => {
					if(res.code == 0){
						let loginData = JSON.parse(localStorage.getItem('loginData'));
						loginData.user = res.data;

						localStorage.setItem('loginData', JSON.stringify(loginData));
						localStorage.setItem('phonenumber', JSON.stringify(res.data.phonenumber));
						localStorage.setItem('user', JSON.stringify(res.data));
						localStorage.setItem('userId', JSON.stringify(res.data.userId));

						this.$router.replace({path: '/home/billHall'});
					}else{
						this.$toast(res.errMsg);
					}
				}).catch(error => {

				})
			}
		}
	}
</script>