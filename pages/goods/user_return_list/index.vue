<template>
	<view :data-theme="theme">
		<view class='nav acea-row row-around'>
			<view class='item' :class='refundTypeStatus==-1 ? "on": ""' @click="statusClick(-1)">
				<view>售后申请</view>
			</view>
			<view class='item' :class='refundTypeStatus==0 ? "on": ""' @click="statusClick(0)">
				<view>处理中</view>
			</view>
			<view class='item' :class='refundTypeStatus==9 ? "on": ""' @click="statusClick(9)">
				<view>申请记录</view>
			</view>
		</view>
		<view class="borderPad mt20">
			<view class='search acea-row row-middle'>
				<text class='iconfont icon-sousuo2 mr20'></text>
				<input type='text' v-model='keywords' confirm-type="search" :focus="focus"
					placeholder='根据商品名称/退款订单号/订单编号搜索' placeholder-class='placeholder' @blur="handleSeach"
					maxlength="50"></input>
			</view>
		</view>
		<view class='return-list borderPad' v-if="orderList.length">
			<view class='goodWrapper borRadius14' v-for="(items,index) in orderList" :key="index">
				<view v-if="refundTypeStatus ==-1" class='orderNum acea-row'>
					<text class="mr10 iconfont icon-shangjiadingdan"></text>
					<text class="no mr10">{{items.merName}}</text>
				</view>
				<view v-else class='orderNum acea-row row-between'>
					<view class="acea-row">
						<view class="tit mr10">退款单号: </view>
						<view class="no">{{items.refundOrderNo}}</view>
					</view>
					<view class="afterSalesType">
						<span class="iconfont" :class="items.afterSalesType===1?'icon-jintuikuan':'icon-tuihuotuikuan'"></span>
						<span>{{items.afterSalesType===1?'仅退款':'退货退款'}}</span>
					</view>
				</view>
				<view @click='goOrderDetails(items)'
					class='item acea-row row-between-wrapper'>
					<view class='pictrue'>
						<image :src='items.image'></image>
					</view>
					<view class='text'>
						<view class='name line1 mb20'>{{items.productName}}</view>
						<view class="f-s-20 text-999 mb24">{{items.sku}}</view>
						<view class='acea-row row-between-wrapper'>
							<view class='num mr20 line-heightOne'>
								{{refundTypeStatus ==-1?'数量:'+items.payNum:'申请数量:'+items.applyRefundNum}}
							</view>
							<view v-show="refundTypeStatus !==-1" class='attr font-color line-heightOne'>
								{{items.refundStatus===3?'已退款':'申请退款'}}：{{items.refundPrice}}
							</view>

						</view>
					</view>
				</view>
				<view v-if="refundTypeStatus===-1" class="btn-box acea-row row-between">
					<view @click.stop="handlerToRecord(items.orderNo)" v-if="items.applyRefundNum+items.refundNum>0" class="applyRefundNum">
						<text>有{{items.applyRefundNum+items.refundNum}}件商品已申请售后</text><span class="iconfont icon-gengduo3 ml10" style="font-size: 20rpx;"></span>
					</view>
					<view v-else></view>
					<view class="btn bg-color acea-row row-center" style="color: #fff;" @click="goRefund(items)">申请售后</view>
				</view>
				<view v-else>
					<view class="refundTypeStatus line1">
						{{ items.refundStatus| refundStatusFilter}}
						<span class="tips ml20">{{items.refundStatus| orderRefundTipsStatusFilter}}</span>
					</view>
					<view class="btn-box acea-row" style="justify-content: flex-end;">
						<view></view>
						<view v-if="items.refundStatus === 0 || items.refundStatus === 4 || items.refundStatus === 5"
							class="btn btn-999 acea-row row-center line-heightOne" @click="handleRevokeRefund(items.refundOrderNo)">撤销售后</view>
						<view v-if="items.refundStatus === 4 && items.afterSalesType === 2" style="color: #fff;"
							class="btn bg-color acea-row row-center line-heightOne ml20" @click="handleReturningRefund(items)">退回商品</view>
					</view>
				</view>
			</view>
		</view>
		<view class='loadingicon acea-row row-center-wrapper'>
			<text class='loading iconfont icon-jiazai'
				:hidden='loading==false'></text>{{orderList.length>0?loadTitle:''}}
		</view>
		<view class='noCart' v-if="orderList.length == 0 && !loading">
			<view class='pictrue text-center'>
        <image :src="urlDomain+'crmebimage/presets/nodingdan.png'"></image>
				<view class="default_txt">暂无售后订单哦~</view>
			</view>
		</view>
	</view>
</template>

<script>
	// +----------------------------------------------------------------------
	// | CRMEB [ CRMEB赋能开发者，助力企业发展 ]
	// +----------------------------------------------------------------------
	// | Copyright (c) 2016~2025 https://www.crmeb.com All rights reserved.
	// +----------------------------------------------------------------------
	// | Licensed CRMEB并不是自由软件，未经许可不能去掉CRMEB相关版权
	// +----------------------------------------------------------------------
	// | Author: CRMEB Team <admin@crmeb.com>
	// +----------------------------------------------------------------------
	import {
		orderAfterSaleList,
		orderRefundList
	} from '@/api/order.js';
	import {
    goProductDetail,onRevokeRefund
		} from '@/libs/order.js'
	import {
		toLogin
	} from '@/libs/login.js';
	import {
		mapGetters
	} from "vuex";
	import animationType from '@/utils/animationType.js'
	let app = getApp();
	export default {
		data() {
			return {
        urlDomain: this.$Cache.get("imgHost"),
				loading: false,
				loadend: false,
				loadTitle: '显示更多', //提示语
				orderList: [], //订单数组
				refundTypeStatus: -1, //订单选择状态
				page: 1,
				limit: 20,
				keywords: '',
				theme: app.globalData.theme,
				focus: false
			};
		},
		computed: mapGetters(['isLogin']),
		watch: {
			isLogin: {
				handler: function(newV, oldV) {
					if (newV) {
						//this.getOrderAfterSaleList();
					}
				},
				deep: true
			}
		},
		onLoad(options) {
			this.keywords = options.orderNo || ''
			if (this.isLogin) {
				this.getOrderAfterSaleList();
			} else {
				toLogin();
			}
		},
		/**
		 * 页面上拉触底事件的处理函数
		 */
		onReachBottom: function() {
			if (this.refundTypeStatus === -1) {
				this.getOrderAfterSaleList();
			} else {
				this.getOrderRefundList();
			}
		},
		methods: {
			//已经申请售后的订单跳转至申请列表
			handlerToRecord(orderNo){
				this.refundTypeStatus = 9;
				this.keywords = orderNo;
				this.loadend = false;
				this.loading = false;
				this.page = 1;
				this.orderList = [];
				this.getOrderRefundList()
			},
			//撤销售后
			handleRevokeRefund(refundOrderNo) {
				onRevokeRefund(refundOrderNo).then(() => {
					this.handleSeach()
				});
			},
			//退回商品
			handleReturningRefund(item) {
				this.$Cache.set('productInfo', item)
				uni.navigateTo({
					url: `/pages/goods/returns_and_refunds/index?refundOrderNo=${item.refundOrderNo}&returnGoodsType=${item.returnGoodsType}`
				})
			},
			//搜索
			handleSeach() {
				this.loadend = false;
				this.loading = false;
				this.page = 1;
				this.orderList = [];
				if (this.refundTypeStatus !== -1) {
					this.getOrderRefundList()
				} else {
					this.getOrderAfterSaleList();
				}
			},
			/**
			 * 退款申请
			 */
			goRefund(item) {
				uni.navigateTo({
					url: `/pages/goods/after_sales_type/index?orderNo=${item.orderNo}&orderId=${item.id}`
				})
				this.$Cache.set('productInfo', item)
			},
			statusClick(status) {
				this.refundTypeStatus = status;
				this.loadend = false;
				this.loading = false;
				this.page = 1;
				this.orderList = [];
				if (status === -1) {
					this.getOrderAfterSaleList();
				} else {
					this.getOrderRefundList();
				}
			},
			/**
			 * 去订单详情
			 */
			goOrderDetails: function(item) {
				let url;
				if (this.refundTypeStatus == -1) {
          goProductDetail(item.productId, item.productMarketingType, '');
				} else {
					url = '/pages/goods/refund_details/index?refundOrderNo=' + item.refundOrderNo
				}
				// #ifdef MP
				uni.navigateTo({
					url: url
				})
				// #endif
				// #ifndef MP
				uni.navigateTo({
					animationType: animationType.type,
					animationDuration: animationType.duration,
					url: url
				})
				// #endif
			},

			/**
			 * 获取售后申请列表
			 */
			getOrderAfterSaleList: function() {
				let that = this;
				if (that.loadend) return;
				if (that.loading) return;
				that.loading = true;
				that.loadTitle = "";
				orderAfterSaleList({
					page: that.page,
					limit: that.limit,
					keywords: that.keywords
				}).then(res => {
					let list = res.data.list || [];
					let loadend = list.length < that.limit;
					that.orderList = that.$util.SplitArray(list, that.orderList);
					that.$set(that, 'orderList', that.orderList);
					that.loadend = loadend;
					that.loading = false;
					that.loadTitle = loadend ? '我也是有底线的' : '显示更多';
					that.page = that.page + 1;
				}).catch(err => {
					that.loading = false;
					that.loadTitle = '显示更多';
				});
			},
			/**
			 * 获取退款列表
			 */
			getOrderRefundList: function() {
				let that = this;
				if (that.loadend) return;
				if (that.loading) return;
				that.loading = true;
				that.loadTitle = "";
				orderRefundList({
					page: that.page,
					limit: that.limit,
					keywords: that.keywords,
					type: that.refundTypeStatus
				}).then(res => {
					let list = res.data.list || [];
					let loadend = list.length < that.limit;
					that.orderList = that.$util.SplitArray(list, that.orderList);
					that.$set(that, 'orderList', that.orderList);
					that.loadend = loadend;
					that.loading = false;
					that.loadTitle = loadend ? '我也是有底线的' : '显示更多';
					that.page = that.page + 1;
				}).catch(err => {
					that.loading = false;
					that.loadTitle =  '显示更多';
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.refundTypeStatus {
		width: 100%;
		height: 71rpx;
		line-height: 71rpx;
		background: #F6F6F6;
		border-radius: 10rpx;
		font-size: 26rpx;
		font-weight: 400;
		color: #282828;
		padding: 0 18rpx;

		.tips {
			font-size: 26rpx;
			font-weight: 400;
			color: #999999;
		}
	}

	.afterSalesType {
		font-weight: 400;
		color: #666666;
		font-size: 26rpx;

		.iconfont {
			@include main_color(theme);
			margin-right: 12rpx;
			font-size: 26rpx;
		}
	}

	.search {
		width: 100%;
		background-color: #fff;
		border-radius: 33rpx;
		padding: 0 24rpx;
		box-sizing: border-box;
		height: 64rpx;

		input {
			width: 600rpx;
			font-size: 28rpx;
		}

		.placeholder {
			color: #bbb;
		}

		.iconfont {
			color: #999999;
			font-size: 26rpx;
		}
	}

	.applyRefundNum {
		font-size: 26rpx;
		@include main_color(theme);
	}

	.status {
		position: absolute;
		right: 15rpx;
		top: 0;

		.iconfont {
			font-size: 120rpx;
			opacity: .3;
		}
	}

	.btn-box {
		display: flex;
		padding-top: 20rpx;
		line-height: 60rpx;

		.btn-line {
			@include main_color(theme);
			@include coupons_border_color(theme);
		}

		.btn-bg {
			color: #fff;
		}

		.btn-999 {
			border: 1px solid #999999;
			color: #666666;
		}

		.btn {
			width: 176rpx;
			height: 60rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			border-radius: 30rpx;
			font-size: 28rpx;
		}
	}

	.nav {
		background-color: #fff;
		width: 100%;
		height: 90rpx;
		line-height: 88rpx;

		.item {
			text-align: center;
			font-size: 30rpx;
			color: #282828;

			.num {
				margin-top: 18rpx;
			}
		}

		.on {
			@include main_color(theme);
			font-weight: bold;
			@include tab_border_bottom(theme);
		}
	}

	.mr8 {
		margin-right: 8rpx;
	}

	.return-list .goodWrapper {
		background-color: #fff;
		margin-top: 20rpx;
		position: relative;
		padding: 0rpx 24rpx 20rpx 24rpx;
	}

	.return-list .goodWrapper .orderNum {
		border-bottom: 1px solid #eee;
		height: 86rpx;
		line-height: 86rpx;

		.tit {
			font-size: 28rpx;
			color: #282828;
		}

		.no {
			font-size: 28rpx;
			color: #282828;
		}
	}

	.return-list .goodWrapper .item {
		border-bottom: 0;
		padding: 25rpx 0;

		.money {
			color: #999999;
			font-weight: 26rpx;
			margin-top: 0;
		}

		.attr,
		.num {
			font-size: 20rpx;
			color: #999999;
			margin-top: 0;
		}
	}

	.return-list .goodWrapper .totalSum {
		padding: 0 0 32rpx 0;
		// text-align: right;
		font-size: 26rpx;
		color: #282828;
		display: flex;
		justify-content: space-between;
	}

	.return-list .goodWrapper .totalSum .price {
		font-size: 28rpx;
		font-weight: bold;
		@include price_color(theme);
	}

	.hui {
		color: #CCCCCC;
		font-size: 24rpx;
	}

	.return-list .goodWrapper .powder {
		@include price_color(theme);
		//font-size: 24rpx;
	}

	.align-center {
		margin-top: 32rpx;
	}

	.noCart {
		margin-top: 32%;

		.pictrue image {
			width: 410rpx !important;
			height: 334rpx !important;
		}
	}

	.default_txt {
		font-size: 26rpx;
		color: #999;
		text-align: center;
	}
</style>