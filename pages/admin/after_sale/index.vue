<template>
	<view class="pos-order-list" ref="container">
		<!-- #ifdef MP || APP-PLUS -->
		<NavBar titleText="售后订单" bagColor="#F5F5F5" :iconColor="iconColor" :textColor="iconColor"
			:isScrolling="isScrolling" showBack></NavBar>
		<!-- #endif -->
		<view class="searchCon acea-row">
			<view class="search acea-row row-middle">
				<text class="iconfont icon-ic_search"></text>
				<input class="inputs" placeholder='请输入要查询的退款单号' placeholder-class='placeholder' placeholder-style="font-size:28rpx" confirm-type='search'
					name="search" v-model="where.refundOrderNo" @confirm="searchSubmit"></input>
			</view>
			<view class="btn" @click="filterShow = true">
				<text class="iconfont icon-a-icon_filter1x"></text>
			</view>
		</view>
		<view class="nav acea-row row-around row-middle" id="nav" :style="{
			top:getHeight.barTop+getHeight.barHeight+'px'
		}">
			<scroll-view scroll-x="true" class="scroll_view">
				<view class="item" :class="state == 9 ? 'on' : ''" @click="changeStatus(9)">
					全部({{refundStatusNum['all']?refundStatusNum['all']:'0'}})
					<image src="../static/adorn.png" v-if="state == 9"></image>
				</view>
				<view class="item" :class="state == 0 ? 'on' : ''" @click="changeStatus(0)">
					待审核({{refundStatusNum['await']?refundStatusNum['await']:'0'}})
					<image src="../static/adorn.png" v-if="state == 0"></image>
				</view>
				<view class="item" :class="state == 2 ? 'on' : ''" @click="changeStatus(2)">
					退款中({{refundStatusNum['refunding']?refundStatusNum['refunding']:'0'}})
					<image src="../static/adorn.png" v-if="state == 2"></image>
				</view>
				<view class="item" :class="state == 4 ? 'on' : ''" @click="changeStatus(4)">
					用户退货({{refundStatusNum['awaitReturning']?refundStatusNum['awaitReturning']:'0'}})
					<image src="../static/adorn.png" v-if="state == 4"></image>
				</view>
				<view class="item" :class="state == 5 ? 'on' : ''" @click="changeStatus(5)">
					商家待收货({{refundStatusNum['awaitReceiving']?refundStatusNum['awaitReceiving']:'0'}})
					<image src="../static/adorn.png" v-if="state == 5"></image>
				</view>
				<view class="item" :class="state == 6 ? 'on' : ''" @click="changeStatus(6)">
					已撤销({{refundStatusNum['revoke']?refundStatusNum['revoke']:'0'}})
					<image src="../static/adorn.png" v-if="state == 6"></image>
				</view>
				<view class="item" :class="state == 1 ? 'on' : ''" @click="changeStatus(1)">
					商家拒绝({{refundStatusNum['reject']?refundStatusNum['reject']:'0'}})
					<image src="../static/adorn.png" v-if="state == 1"></image>
				</view>
				<view class="item" :class="state == 3 ? 'on' : ''" @click="changeStatus(3)">
					已退款({{refundStatusNum['refunded']?refundStatusNum['refunded']:'0'}})
					<image src="../static/adorn.png" v-if="state == 3"></image>
				</view>
			</scroll-view>
		</view>
		<view class="list" v-if="list.length">
			<view class="item" v-for="(item, index) in list" :key="index">
				<view class="order-num acea-row row-between-wrapper" @click="toDetail(item)">
					<view>
						<view>售后单号：{{ item.refundOrderNo }}</view>
					</view>
					<view class="state">{{statusArr[item.refundStatus]}}</view>
				</view>
				<view class="pos-order-goods">
					<view class="goods acea-row" @click="toDetail(item)">
						<!-- <scroll-view class="picTxt scroll-view" scroll-x="true" v-if="item.infoResponseList.length > 1">
							<view class="pictrue" v-for="(val, key) in item.infoResponseList" :key="key">
								<image :src="val.image" />
							</view>
						</scroll-view> -->
						<view class="picTxt">
							<view class="acea-row" >
								<view class="pictrue">
									<image :src="item.refundOrderInfo.image" />
								</view>
								<view class="text info-text">
									<view class="info line2">
										{{ item.refundOrderInfo.productName }}
									</view>
									<view class="attr">
										{{ item.refundOrderInfo.sku }}
									</view>
								</view>
							</view>
						</view>
						<view class="money">
							<baseMoney color="#333333" :money="item.refundPrice" symbolSize="20" integerSize="32" decimalSize="20">
							</baseMoney>
							<view class="num">共{{ item.totalNum }}件</view>
						</view>
					</view>
				</view>
				<view class="operation acea-row row-between-wrapper">
					<view v-if="item.afterSalesType == 1" class="more acea-row row-middle">
						<text class="iconfont icon-ic_returnmoney"></text>仅退款
					</view>
					<view v-else-if="item.afterSalesType == 2 " class="more acea-row row-middle">
						<text class="iconfont icon-ic_returnofgoods"></text>退货退款
					</view>
					<view class="acea-row row-middle">
						<view class="btn" @click="modify(item, 7)">退款单备注</view>
						<view class="btn on" v-if="item.refundStatus==0&&(item.returnGoodsType==0||item.returnGoodsType==2)" :class="openErp?'on':''" @click="modify(item,'2',1,0)">
							退款审核
						</view>
						<view class="btn on" v-if="item.refundStatus==0&&item.returnGoodsType==1" :class="openErp?'on':''" @click="modify(item,'2',0,1)">
							退款审核
						</view>
						<view class="btn on" v-if="item.refundStatus==5" @click="modify(item, 2, 8,2)">确认收货</view>
					</view>
				</view>
			</view>
		</view>
		<emptyPage v-else title="暂无订单～" mTop="35%" :imgSrc="urlDomain+'crmebimage/presets/nodingdan.png'"></emptyPage>
		<!-- <Loading :loaded="loaded" :loading="loading"></Loading> -->
		<PriceChange :change="change" :orderInfo="orderInfo" :isRefund="isRefund"
			v-on:statusChange="statusChange($event)" v-on:closechange="changeclose($event)" v-on:savePrice="savePrice"
			:status="status"></PriceChange>
		<view class="mask" v-if="filterShow" @click="filterShow=!filterShow"></view>
		<!-- #ifdef H5 -->
		<view class="filter-popup" :class="{ on: filterShow }">
		<!-- #endif -->
		<!-- #ifndef H5 -->
		<view class="filter-popup" :class="{ on: filterShow }" :style="{
		top:getHeight.barTop+getHeight.barHeight+'px'}">
		<!-- #endif -->
			<view class="content">
				<view class="search acea-row row-middle">
					<text class="iconfont icon-ic_search"></text>
					<input class="inputs popup-input" placeholder='请输入要查询的退款单号' placeholder-style="font-size:28rpx" placeholder-class='placeholder' confirm-type='search'
						name="search" v-model="where.refundOrderNo" @confirm="searchSubmit"></input>
				</view>
				<view class="item">
					<view class="title">按售后时间</view>
					<view class="acea-row list">
						<view class="cell" v-for="(item, index) in dateList" :key="index"
							:class="{ on: item.val == dateType }" @click="dateChange(item.val)">{{ item.label }}
						</view>
					</view>
				</view>
				<view class="bottom">
					<view class="no_view" @click="resetBtn">重置</view>
					<view class="yes_view" @click="submitBtn">确定</view>
				</view>
			</view>
		</view>
		<footerPage></footerPage>
	</view>
</template>

<script>
	import {refundOrderList,refundOrderMark,refundStatusNum,refundOrderAudit,refundReceiving,refundReceivingReject} from '@/api/work.js'
	import footerPage from '../components/footerPage/index.vue';
	import Loading from '../components/Loading/index'
	import PriceChange from '../components/PriceChange/index.vue'
	import emptyPage from '@/components/emptyPage.vue'
	import NavBar from '../components/NavBar.vue'
	import baseMoney from '../components/BaseMoney.vue'
	import {
		isMoney
	} from '@/utils/validate.js';
	import {
		HTTP_REQUEST_URL
	} from '@/config/app';
	export default {
		name: "AdminOrderList",
		components: {
			Loading,
			PriceChange,
			emptyPage,
			NavBar,
			footerPage,
			baseMoney
		},
		data() {
			return {
        urlDomain: this.$Cache.get("imgHost"),
				refundStatusNum:{},
				statusArr:['待审核','商家拒绝','退款中','已退款','用户退货','商家待收货','已撤销'],
				getHeight: this.$util.getWXStatusHeight(),
				iconColor: '#333333',
				isScrolling: false,
				top: 0,
				navHeight: 0,
				isFixed: false,
				filterShow: false,
				openErp: false,
				current: "",
				change: false,
				types: 0,
				where: {
					page: 1,
					limit: 10,
					dateLimit: '',//事件区间
					orderNo: '',//订单号
					refundOrderNo: '',//退款订单号
					refundStatus: 9,//售后状态
				},
				list:[],
				loaded: false,
				loading: false,
				orderInfo: {},
				status: "",
				state: 9,
				isRefund: 0, //1是仅退款;0是退货退款
				imgHost: HTTP_REQUEST_URL,
				dateSelected: '',
				apiModalType:'',//0-仅退款 1-退货退款 2-确认收货
				dateList: [{
						label: '全部',
						val: '-1',
					},{
						label: '近1个月',
						val: '0',
					},
					{
						label: '近3个月',
						val: '1',
					},
					{
						label: '近6个月',
						val: '2',
					},
				],
				dateType:'-1'
			};
		},
		onLoad(option) {
			this.state = option.type?option.type:9;
			this.where.refundStatus=option.type?option.type:9;
		},
		onShow() {
			this.init();
		},
		mounted() {
			const query = uni.createSelectorQuery().in(this);
			query.select("#nav").boundingClientRect((data) => {
				this.top = data.top;
				this.navHeight = data.height;
			}).exec();
		},
		methods: {
			getStatusNum(){
				refundStatusNum(this.where).then(res=>{
					this.refundStatusNum=res.data
				})
			},
			statusChange(e) {
				this.status = e;
			},
			// 获取数据
			getIndex: function() {
				let that = this;
				if (that.loading || that.loaded) return;
				that.loading = true;
				let obj = refundOrderList(that.where);
				obj.then(
					res => {
						that.loading = false;
						that.loaded = res.data.list.length < that.where.limit;
						that.list.push.apply(that.list, res.data.list);
						that.where.page = that.where.page + 1;
					},
					err => {
						that.$util.Tips({
							title: err
						})
					}
				);
			},
			// 初始化
			init: function() {
				this.list = [];
				this.where.page = 1;
				this.loaded = false;
				this.loading = false;
				this.getIndex();
				this.current = "";
				this.getStatusNum()
			},
			searchSubmit() {
				this.init();
			},
			// 导航切换
			changeStatus(val) {
				if (this.state != val) {
					this.state = val;
					this.where.refundStatus = val;
					this.init();
				}
			},
			// 商品操作
			//0-仅退款 1-退货退款 2-确认收货 212
			modify: function(item, status, type,apiType) {
				this.apiModalType=apiType
				if (this.openErp && status != 1) return
				this.change = true;
				this.status = status.toString();
				this.orderInfo = item;
				if (status == 2) {
					this.isRefund = type
				}
			},
			changeclose: function(msg) {
				this.change = msg;
				this.orderInfo = {};
			},
			async savePrice(opt) {
				let that = this,
					data = {};
				data.refundOrderNo = that.orderInfo.refundOrderNo;
				if (that.apiModalType == 0) {
					if(opt.type==2&&!opt.refuse_reason){
						return this.$util.Tips({
							title: '请输入拒绝理由'
						})
					}
					let requestObj = {
						refundOrderNo:that.orderInfo.refundOrderNo,
						auditType:opt.type==1?'success':'refuse',
						reason:opt.refuse_reason?opt.refuse_reason:''
					}
					refundOrderAudit(requestObj).then(res=>{
						if(res.code==200){
							this.$util.Tips({
								title: '审核成功'
							})
							this.init();
							this.change = false
						}else{
							this.$util.Tips({
								title:res.message
							})
						}
					})
				} else if (that.apiModalType == 1) {
					//退货退款审核
					if(opt.type==2&&!opt.refuse_reason){
						return this.$util.Tips({
							title: '请输入拒绝理由'
						})
					}
					if(opt.type==1&&!opt.merAddressId){
						return this.$util.Tips({
							title: '请选择退货地址'
						})
					}
					//退货退款拒绝
					if(opt.type==2){
						let requestObj = {
							refundOrderNo:that.orderInfo.refundOrderNo,
							auditType:opt.type==1?'success':'refuse',
							reason:opt.refuse_reason?opt.refuse_reason:''
						}
						refundOrderAudit(requestObj).then(res=>{
							if(res.code==200){
								this.$util.Tips({
									title: '操作成功'
								})
								this.init();
								this.change = false
							}else{
								this.$util.Tips({
									title:res.message
								})
							}
						})
					}
					//退货退款同意
					if(opt.type==1){
						let requestObj = {
							refundOrderNo:that.orderInfo.refundOrderNo,
							auditType:opt.type==1?'success':'refuse',
							merAddressId:opt.merAddressId
						}
						refundOrderAudit(requestObj).then(res=>{
							if(res.code==200){
								this.$util.Tips({
									title: '操作成功'
								})
								this.init();
								this.change = false
							}else{
								this.$util.Tips({
									title:res.message
								})
							}
						})
					}
				}else if(that.apiModalType == 2){
					//确认收货
					if(opt.type==2&&!opt.refuse_reason){
						return this.$util.Tips({
							title: '请输入拒绝理由'
						})
					}
					if(opt.type==1){
						// 同意
						refundReceiving(that.orderInfo.refundOrderNo).then(res=>{
							if(res.code==200){
								this.$util.Tips({
									title: '操作成功'
								})
								this.init();
								this.change = false
							}else{
								this.$util.Tips({
									title:res.message
								})
							}
						})
					}
					if(opt.type==2){
						let requestObj = {
							refundOrderNo:that.orderInfo.refundOrderNo,
							reason:opt.refuse_reason?opt.refuse_reason:''
						}
						// 拒绝
						refundReceivingReject(requestObj).then(res=>{
							if(res.code==200){
								this.$util.Tips({
									title: '操作成功'
								})
								this.init();
								this.change = false
							}else{
								this.$util.Tips({
									title:res.message
								})
							}
						})
					}
				}else{
					data.remark=opt.remark
					if (!data.remark) {
						return this.$util.Tips({
							title: '请输入备注'
						})
					}
					refundOrderMark(data).then(res=>{
						if(res.code==200){
							this.$util.Tips({
								title: '备注成功'
							})
							this.change = false
						}else{
							this.$util.Tips({
								title:res.message
							})
						}
					})
				}
			},
			toDetail(item) {
				uni.navigateTo({
					url: `/pages/admin/refundOrderDetail/index?refundOrderNo=${item.refundOrderNo}`
				})
			},
			offlinePay: function(item) {
				if (this.openErp) return
				setOfflinePay({
					order_id: item.order_id
				}).then(
					res => {
						this.$util.Tips({
							title: res.msg,
							icon: "success"
						});
						this.init();
					},
					error => {
						this.$util.Tips(error);
					}
				);
			},
			dateChange(val) {
				this.dateType = val;
			},
			goLogistics(orderInfo) {
				uni.navigateTo({
					url: '/pages/admin/logistics/index?type=refund&orderId=' + orderInfo.order_id
				})
			},
			// 点击确认按钮
			submitBtn() {
				if (this.dateType == -1) {
					this.where.dateLimit=''
					this.filterShow = false;
					this.init()
					return
				} else if (this.dateType == 0) {
					this.where.dateLimit = 'lately30'
				} else if (this.dateType == 1) {
					this.where.dateLimit = 'lately90'
				} else if (this.dateType == 2) {
					this.where.dateLimit = 'lately180'
				}
				this.filterShow = false;
				this.init()
			},
			//点击重置按钮
			resetBtn() {
				this.where.refundOrderNo=''
				this.dateType = '-1';
			},
		},
		onReachBottom() {
			this.getIndex()
		}
	}
</script>

<style lang="scss" scoped>
	.pos-order-list {
		padding-bottom: 150rpx !important;
		padding-bottom: constant(safe-area-inset-bottom); ///兼容 IOS<11.2/
		padding-bottom: env(safe-area-inset-bottom); ///兼容 IOS>11.2/
	}

	.searchCon {
		padding: 10rpx 20rpx;

		.search {
			flex: 1;
			height: 72rpx;
			padding: 0 32rpx;
			border-radius: 36rpx;
			background: #FFFFFF;

			.iconfont {
				margin-right: 16rpx;
				font-size: 32rpx;
				color: #999999;
			}

			.inputs {
				flex: 1;
				font-size: 28rpx;
				color: #333333;
			}

			.placeholder {
				font-size: 26rpx !important;
				color: #ccc;
				left: 5;
			}
		}

		.btn {
			width: 72rpx;
			height: 72rpx;
			border-radius: 50%;
			margin-left: 20rpx;
			background: #FFFFFF;
			text-align: center;

			.iconfont {
				font-size: 32rpx;
				line-height: 72rpx;
				color: #666666;
			}
		}
	}

	.pos-order-list .nav {
		padding: 0 20rpx 0 34rpx;
		position: sticky;
		/* #ifdef H5 */
		top: 0rpx !important;
		/* #endif */
		left: 0;
		width: 100%;
		background-color: #F5F5F5;
		z-index: 9;

		.item {
			position: relative;
			padding: 28rpx 0;

			image {
				width: 14rpx;
				height: 14rpx;
				display: block;
				position: absolute;
				bottom: 20rpx;
				right: -4rpx;
			}
		}
	}

	.pos-order-list .nav .item.on {
		font-weight: 500;
		font-size: 30rpx;
		color: #2A7EFB;
	}

	.pos-order-list .list {
		padding: 0 20rpx;
	}

	.pos-order-list .nothing {
		margin-top: 120upx;
		text-align: center;
		color: #cfcfcf;
	}

	.pos-order-list .list .item {
		padding: 32rpx 24rpx;
		border-radius: 24rpx;
		background-color: #fff;
	}

	.pos-order-list .list .item~.item {
		margin-top: 20rpx;
	}

	.pos-order-list .list .item .order-num {
		font-size: 28rpx;
		line-height: 40rpx;
		color: #333333;
	}

	.pos-order-list .list .item .order-num .state {
		color: #FF7E00;
	}

	.pos-order-list .list .item .order-num .state.on {
		font-size: 24rpx;
		width: 150rpx;
		text-align: right;
	}

	.pos-order-list .list .item .order-num .time {
		font-size: 26upx;
		font-weight: normal;
		color: #999;
	}

	.pos-order-list .list .item .operation .more {
		position: relative;
		font-size: 26rpx;
		color: #999999;
	}

	.pos-order-list .list .item .operation .more .iconfont {
		margin-right: 12rpx;
		font-size: 34rpx;
		color: #2A7EFB;
	}

	.pos-order-list .list .item .operation .icon-gengduo {
		font-size: 50upx;
		color: #aaa;
	}

	.pos-order-list .list .item .operation .order .arrow {
		width: 0;
		height: 0;
		border-left: 11upx solid transparent;
		border-right: 11upx solid transparent;
		border-top: 20upx solid #e5e5e5;
		position: absolute;
		left: 15upx;
		bottom: -18upx;
	}

	.pos-order-list .list .item .operation .order .arrow:before {
		content: '';
		width: 0;
		height: 0;
		border-left: 7upx solid transparent;
		border-right: 7upx solid transparent;
		border-top: 20upx solid #fff;
		position: absolute;
		left: -7upx;
		bottom: 0;
	}

	.pos-order-list .list .item .operation .order {
		width: 200upx;
		background-color: #fff;
		border: 1px solid #eee;
		border-radius: 10upx;
		position: absolute;
		top: -100upx;
		z-index: 9;
	}

	.pos-order-list .list .item .operation .order .items {
		height: 77upx;
		line-height: 77upx;
		text-align: center;
	}

	.pos-order-list .list .item .operation .order .items~.items {
		border-top: 1px solid #f5f5f5;
	}

	.pos-order-list .list .item .operation .btn {
		height: 56rpx;
		padding: 0 24rpx;
		border-radius: 28rpx;
		border: 1rpx solid #CCCCCC;
		font-size: 24rpx;
		line-height: 54rpx;
		color: #333333;

		&.on {
			color: #FFFFFF !important;
			background-color: #2A7EFB !important;
			border-color: #2A7EFB !important;
		}
	}

	.pos-order-list .list .item .operation .btn~.btn {
		margin-left: 16rpx;
	}

	.pos-order-list .list .item .operation .wait {
		margin-left: 30rpx;
	}

	.pos-order-goods .goods {
		padding: 26rpx 0;
	}

	.pos-order-goods .goods~.goods {
		border-top: 1px dashed #e5e5e5;
	}

	.pos-order-goods .goods .picTxt {
		flex: 1;
		min-width: 0;
	}

	.pos-order-goods .goods .scroll-view {
		box-sizing: border-box;
		white-space: nowrap;

		.pictrue {
			display: inline-block;

			+.pictrue {
				margin-left: 16rpx;
			}
		}
	}

	.pos-order-goods .goods .picTxt .pictrue {
		width: 136rpx;
		height: 136rpx;
	}

	.pos-order-goods .goods .picTxt .pictrue image {
		width: 100%;
		height: 100%;
		border-radius: 16rpx;
	}

	.pos-order-goods .goods .picTxt .text {
		flex: 1;
		min-width: 0;
		padding-left: 20rpx;
	}

	.pos-order-goods .goods .picTxt .text .info {
		font-size: 28rpx;
		line-height: 40rpx;
		color: #333333;
	}

	.pos-order-goods .goods .picTxt .text .info .label {
		color: #ff4c3c;
	}

	.pos-order-goods .goods .picTxt .text .attr {
		margin-top: 12rpx;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		font-size: 24rpx;
		line-height: 34rpx;
		color: #999999;
	}

	.pos-order-goods .goods .money {
		padding-left: 16rpx;
		text-align: right;
		font-size: 28upx;
	}

	.pos-order-goods .goods .money .info {
		margin-top: 18rpx;
		font-size: 24rpx;
	}

	.pos-order-goods .goods .money .x-money {
		color: #282828;
	}

	.pos-order-goods .goods .money .num {
		margin-top: 10rpx;
		font-size: 24rpx;
		line-height: 34rpx;
		color: #999999;
	}

	.pos-order-goods .goods .money .y-money {
		color: #999;
		text-decoration: line-through;
	}

	.public-total {
		font-size: 28upx;
		color: #282828;
		border-top: 1px solid #eee;
		height: 92upx;
		line-height: 92upx;
		text-align: right;
		padding: 0 30upx;
		background-color: #fff;
	}

	.public-total .money {
		color: #ff4c3c;
	}

	.mask {
		z-index: 900;
	}

	.filter-popup {
		position: fixed;
		top: 0;
		left: 0;
		z-index: 900;
		width: 100%;
		border-radius: 0 0 32rpx 32rpx;
		background: #FFFFFF;
		transform: translateY(-100%);
		transition: transform 0.3s;

		&.on {
			transform: translateY(0);
		}

		.search-box {
			padding: 10rpx 32rpx;
		}

		.search {
			height: 58rpx;
			padding: 0 32rpx;
			border-radius: 29rpx;
			background: #F5F5F5;
		}

		.iconfont {
			font-size: 28rpx;
			color: #999999;
		}

		.input {
			flex: 1;
			height: 58rpx;
			padding-left: 16rpx;
			font-size: 24rpx;
		}

		.content {
			padding: 10rpx 30rpx 58rpx;

			.bottom {
				display: flex;
				margin-top: 40rpx;
				justify-content: space-between;
				view {
					width: 332rpx;
					height: 72rpx;
					text-align: center;
					line-height: 72rpx;
					font-weight: 500;
					font-size: 13px;
				}

				.no_view {
					border-radius: 50rpx;
					border: 1px solid #2A7EFB;
					color: #2A7EFB;
				}

				.yes_view {
					background: #2A7EFB;
					border-radius: 50rpx;
					color: #FFFFFF;
					margin-left: 22rpx;
				}
			}
		}

		.item {
			margin-top: 36rpx;

			&:first-child {
				margin-top: 0;
			}
		}

		.title {
			font-size: 28rpx;
			line-height: 40rpx;
			color: #333333;
		}

		.list {
			padding: 0;
			margin-right: -24rpx;
		}

		.cell {
			width: 154rpx;
			height: 56rpx;
			border: 1rpx solid #F5F5F5;
			border-radius: 28rpx;
			margin: 24rpx 24rpx 0 0;
			background: #F5F5F5;
			text-align: center;
			font-size: 24rpx;
			line-height: 54rpx;
			color: #333333;

			&.on {
				border-color: #2A7EFB;
				background: #E9F2FE;
				color: #2A7EFB;
			}
		}
	}
	.scroll_view {
		white-space: nowrap;
		// padding: 0 30rpx;
		.item {
			display: inline-block;
			color: #999999;
			margin-right: 50rpx;
		}
	}
	.info-text{
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}
	.icon-a-icon_filter1x{
		font-size: 40rpx !important;
	}
	.icon-ic_search{
		margin-right: 16rpx;
	}
	.filter-popup .search{
	    height: 72rpx;
	}
	.popup-input{
		width: 500rpx !important;
	}
</style>