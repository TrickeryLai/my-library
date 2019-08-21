<template>
	<div>
		<van-nav-bar
		fixed
		@click-left="onClickLeft"
		@click-right="onClickRight"
		class="top-bg"
		style="background: #fff;"
		>	
			<span slot="title" class="top-bg-title">{{title}}</span>
			<i class="iconfont icon-previous_step top-bg-title" slot="left"></i>
			<i class="iconfont icon-add top-bg-title" slot="right"></i>
		</van-nav-bar>
		<div class="list-wrap">
			<div style="overflow-y: hidden;" :style="scrollH">
				<div style="height: 100%;overflow-y:scroll;">
					<van-pull-refresh v-model="isLoading" @refresh="onRefresh">
					<van-list
						ref="bscroll"
						v-model="loading"
						:finished="finished"
						finished-text="没有更多了"
						:error.sync="error"
						error-text="请求失败，点击重新加载"
						:offset=20
						@load="onLoad"
						style="padding-bottom:50px;margin-top: 5px;"
						>
							<van-cell

							v-for="(item,index) in list"
							:key="index"
							:title="index"
							style="margin-bottom: 5px;box-shadow: 1px 1px 0px 1px #ccc;"
							>
								<template slot="title">
									<van-row>
										<van-col span="16">{{item.acceptor}}</van-col>
										<van-col span="8">
											<van-button
											size="small"
											class=""
											@click="deleteItem(item)"
											>删除</van-button>
										</van-col>
									</van-row>
								</template>
							</van-cell>
						</van-list>
					</van-pull-refresh>
				</div>
				
			</div>
		</div>

		<van-dialog
		    v-model="addState"
		    title="新增"
		    :show-confirm-button="false"
		    style="padding: 0 10px;"
		    >
		      <van-cell-group>
		        <van-row style="margin-bottom: 5px;">
		          <van-col span="8" style="padding: 5px 0;">
		            公司名称
		          </van-col>
		          <van-col span="16">
		            <van-field 
		            v-reset-page
		            class="van-hairline--surround register-input"
		            style="display:inline-block;margin:0;padding:0;" 
		            v-model="addCompanyName"
		            type="text"
		            />
		          </van-col>
		        </van-row>
		        <van-row>
		            <van-col span="12">
		              <van-button style="width: 100%;font-size:14px;" @click="cancelAdd">取消</van-button>
		            </van-col>
		            <van-col span="12">
		              <van-button style="width: 100%;font-size:14px;" @click="confirmAdd">确认</van-button>
		            </van-col>
		          </van-row>
		      </van-cell-group>
		    </van-dialog>
	</div>
</template>

<script>
import _server from '@/server/server'
import _common from '@/server/index'

  export default {
  	name: 'WhiteName',
  	data() {
  		return {
  			scrollH:{
  				height: '400px'
  			},
  			addState: false,
  			addCompanyName: '',
  			title: '白名单',
	        finished: false,//是否已经加载完成
	        error: false,
	        isLoading: false,
	        loading: false,
	        isGetData: false,
	        detailModelState: false,//详情框状态
	        detailItem: {},//详情项
	        currentItemInfo: '',//当前点击项
	        searchModelState: false,//筛选弹出框状态
	        isGetingData: false,//是否正在请求数据
	        searchData: '',//搜索条件
	        aBScroll: '',
	        // 0是asc   1是desc
	      	pageData: {
	      		pageNum: 0,
		      	pageSize: 10,
		      	total: 0,
	      	},
	      	commonFn:_common.common_fn,
      		list: []
  		}
	},
	mounted(){
		
	},
	created(){
		this.$canScroll();
	 	window.addEventListener('resize', this.getHeight);
      	this.getHeight()
	},
	beforeRouteLeave(to, from, next){
		if(to.name == 'Login' || to.name == 'RealName' || to.name == 'RealNameChange'){
			next();
			return;
		}
		if(this.detailModelState ){
			this.detailModelState = false;
			this.isGetingData = false;
			this.loading = false;
			next(false);
			return;
		}	

		this.$canScroll();
		next();
	},
	methods: {
		onClickLeft() {
			this.$router.go(-1);
		},
		onClickRight(){
			console.log(123)
			this.addState = true;
		},
		cancelAdd(){
			this.addState = false;
		},
		confirmAdd(){
			_server.insertData({
				acceptor: this.addCompanyName
			}).then(res => {
				if(res.code == 0){
					this.$toast('新增成功！');
					this.addState = false;
					this.pageData.pageNum = 1;
					this.getData();
				}else{
					this.$toast(res.errMsg);
				}
			}).catch(error =>{

			})
		},
      	getHeight(){
        	var scrollH = window.screen.height;

        	this.scrollH.height = scrollH - 170 + 'px';
      	},
      	deleteItem(item){
      		this.$dialog.confirm({
					title:'确认删除',
					message: '确认删除么？'
				}).then(() => {
					_server.delAcceptorWhiteList(item.id).then(res=>{
						if(res.code == 0){
							this.$toast('删除成功！');
							this.pageData.pageNum = 1;
							this.getData();
						}else{
							this.$toast(res.errMsg);
						}
					}).catch(error => {

					})
				})
      	},
		getData(data, callback) {
			if (this.isGetData) {
				return;
			}
			this.isGetData = true;
	        this.loading = true;//处于加载状态，不触发onLoad
	        let _this = this;
	        let pageData = Object.assign({}, this.pageData);
	      	if (this.pageData.pageNum == 1) {
	      		this.list = [];//不清空，在滚动至多页的时候，重新刷新会一直触发onload
	      	}
	        //查询条件
	        data = Object.assign({}, pageData, data);
	        //获取列表数据
	        _server.getWhiteNameList(data).then((response) => {
	        	this.isGetData = false;
	        	this.loading = false;
	        	this.isLoading = false;
	        	this.error = false;
	        	if (response.code == 0) {
	        		if (this.pageData.pageNum > 1) {
	        			response.list.forEach((item) => {
	        				this.list.push(item);
	        			});
	        		} else {
	        			this.list = response.list;

	        		}
		            //数据全部加载完成
		            if (this.list.length >= response.pageInfo.total) {
		            	this.finished = true;
		            } else {
		            	this.finished = false;
		            }
		        }else{
		        	this.$toast(response.errMsg);

		        }
	    	}).catch((error) => {
		    	this.error = true;
		    	this.isGetData = false;
		    	this.loading = false;
		    	this.isLoading = false;
	    	})
	},
	onRefresh() {
        //获取列表
        this.pageData.pageNum = 1;
        this.getData();
    },
    onLoad() {
    	this.pageData.pageNum = this.pageData.pageNum + 1;
    	this.getData()
    },
}
}
</script>

<style scoped>
.cashDetail-type{
	font-size: 14px;
	color: #000;
	padding: 2px 0;
	text-align: left;
}
.cashDetail-time{
	font-size: 12px;
	color: #999;
	padding: 2px 0;
	text-align: left;
}
.cashDetail-amount{
	font-size: 24px;
	color: #000;
	padding: 10px 0;
}
.cashDetail-line{
	text-align:left;
}
.cashDetail-line-l{
	font-size: 14px;
	color: #000;
	text-align:left;
}
.cashDetail-line-c{
	font-size: 14px;
	color: #999;
	text-align:left;
}

</style>
