<template>
	<view :data-theme="theme">
		<view class='payment-status'>
			<!--失败时： 用icon-iconfontguanbi fail替换icon-duihao2 bg-color-->
			<view class='iconfont icons icon-duihao2 bg_color'
				v-if="order_pay_info.paid === 1"></view>
			<view v-if="order_pay_info.paid === 2" class='iconfont icons icon-iconfontguanbi'></view>
			<!-- 失败时：订单支付失败 -->
			<view class='status' v-if="order_pay_info.payType != 'offline'">{{status==2 ? '订单取消支付' : errMsg ? '订单支付异常':payResult }}</view>
			<view class='status' v-else>订单创建成功</view>
			<view class='wrapper'>
				<view v-show="!fromType" class='item acea-row row-between-wrapper'>
					<view>订单编号</view>
					<view class='itemCom'>{{order_pay_info.orderNo}}</view>
				</view>
				<view v-show="!fromType" class='item acea-row row-between-wrapper'>
					<view>下单时间</view>
					<view class='itemCom'>{{order_pay_info.createTime?order_pay_info.createTime:'-'}}</view>
				</view>
				<view v-show="(order_pay_info.payType && order_pay_info.secondType !== ProductTypeEnum.Integral) || (order_pay_info.secondType === ProductTypeEnum.Integral && order_pay_info.payPrice!=0)" class='item acea-row row-between-wrapper'>
					<view>支付方式</view>
					<view class='itemCom'>{{order_pay_info.payType | payTypeFilter}}支付</view>
				</view>
				<view class='item acea-row row-between-wrapper'>
					<view>支付金额</view>
					<view class='itemCom'>{{order_pay_info.payPrice}}</view>
				</view>
				<view v-show="order_pay_info.secondType === ProductTypeEnum.Integral" class='item acea-row row-between-wrapper'>
					<view>消耗积分</view>
					<view class='itemCom'>{{order_pay_info.redeemIntegral}}</view>
				</view>
				<!--失败时加上这个  -->
				<view class='item acea-row row-between-wrapper'
					v-if="!order_pay_info.paid && order_pay_info.payType != 'offline'">
					<view>失败原因</view>
					<view class='itemCom'>{{status==2 ? '取消支付':msg}}</view>
				</view>
			</view>
			<!--失败时： 重新购买 -->
			<view @tap="goOrderDetails">
				<button formType="submit" class='returnBnt bg_color' hover-class='none'>{{fromType =='svip'?'查看会员':type==2?'查看拼团':'查看订单'}}</button>
			</view>
			<button @click="goIndex" class='returnBnt cart-color' formType="submit" hover-class='none'
				>返回首页</button>
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
		getOrderDetail,
		wechatQueryPayResult
	} from '@/api/order.js';
	import {
		openOrderSubscribe
	} from '@/utils/SubscribeMessage.js';
	import {
		toLogin
	} from '@/libs/login.js';
	import {
		mapGetters
	} from "vuex";
	import {
		ProductTypeEnum
	} from "../../../enums/productEnums";
	let app = getApp();
	export default {
		data() {
			return {
				ProductTypeEnum:ProductTypeEnum,
				orderNo: '',
				order_pay_info: {
					paid: 0,
					_status: {}
				},
				status: 0,
				msg: '',
				errMsg: false,
				payResult: '订单查询中...',
				theme:app.globalData.theme,
				fromType: '', // 支付页面来源，会员支付，商品支付，积分支付 
				type:'',
			};
		},
		computed: mapGetters(['isLogin']),
		watch: {
			isLogin: {
				handler: function(newV, oldV) {
					if (newV) {
						this.getOrderPayInfo();
					}
				},
				deep: true
			}
		},
		onLoad: function(options) {
			this.fromType = options.fromType
			this.orderNo = options.order_id;
			if(!this.fromType || this.fromType==='integral'){
				this.status = options.status || 0;
				if (this.isLogin) {
					this.getOrderPayInfo();
				} else {
					toLogin();
				}
			}else{
				this.order_pay_info.payType= options.payType
				this.order_pay_info.payPrice = options.payPrice
				if(options.payType !== 'yue'){
					uni.showLoading({
						title: '正在加载中'
					});
					setTimeout(()=>{
						this.wechatQueryPay('svip');
					},500);
				}else{
					this.payResult = '支付成功';
					this.order_pay_info.paid = 1;
				}
			};
		},
		methods: {
			//svip支付成功之后更新会员状态
			setPaidMember(){
				this.$store.commit('updatePaidMember', true);
			},
			//微信支付查明结果
			wechatQueryPay(orderType) {
				wechatQueryPayResult({
					orderType: orderType,
					orderNo:this.orderNo
				}).then(res => {
					if(res.data){
						this.payResult = '支付成功';
						this.order_pay_info.paid = 1;
						uni.hideLoading();
						this.setPaidMember();
					}else{
						this.payResult = '支付失败';
						this.order_pay_info.paid = 2;
						uni.hideLoading();
					}
				})
				.catch(err => {
					this.order_pay_info.paid = 2;
					this.errMsg = true;
					this.msg = err;
					uni.hideLoading();
					this.$util.Tips({
						title: err
					});
				});
			},
			onLoadFun: function() {
				if(this.fromType !=='svip')this.getOrderPayInfo();
			},
			/**
			 *
			 * 支付完成查询支付状态
			 *
			 */
			getOrderPayInfo: function() {
				let that = this;
				uni.showLoading({
					title: '正在加载中'
				});
				getOrderDetail(that.orderNo).then(res => {
					this.type=res.data.type
					that.$set(that, 'order_pay_info', res.data);
					if (res.data.payType === 'weixin') {
						setTimeout(()=>{
							that.wechatQueryPay('order');
						},2000);
					}else {
						if(res.data.paid){
							this.payResult = '支付成功';
							this.order_pay_info.paid = 1;
						}else{
							this.payResult = '支付失败';
							this.order_pay_info.paid = 2;
						}
						uni.hideLoading();
					}

				}).catch(err => {
					uni.hideLoading();
				});
			},
			/**
			 * 去首页关闭当前所有页面
			 */
			goIndex: function(e) {
				uni.switchTab({
					url: '/pages/index/index'
				});
			},
			/**
			 *
			 * 去订单详情页面
			 */
			goOrderDetails: function(e) {
				uni.navigateTo({
					url: this.fromType =='svip'?'/pages/activity/vip_paid/index':this.type==2?`/pages/activity/status/index?orderNo=${this.orderNo}`:'/pages/goods/order_list/index'
				});
			}
		}
	}
</script>

<style lang="scss">
	.icon-iconfontguanbi {
		background-color: #999 !important;
		text-shadow: none !important;
	}
	.bg_color{
		@include main_bg_color(theme);
	}
	.cart_color{
		@include main_color(theme);
		@include coupons_border_color(theme);
	}
	.payment-status {
		background-color: #fff;
		margin: 195rpx 30rpx 0 30rpx;
		border-radius: 10rpx;
		padding: 1rpx 0 28rpx 0;
	}

	.payment-status .icons {
		font-size: 70rpx;
		width: 140rpx;
		height: 140rpx;
		border-radius: 50%;
		color: #fff;
		text-align: center;
		line-height: 140rpx;
		text-shadow: 0px 4px 0px rgba(0,0,0,.1);
		border: 6rpx solid #f5f5f5;
		margin: -76rpx auto 0 auto;
		background-color: #999;
	}

	.payment-status .iconfont {
		font-size: 70rpx;
		width: 140rpx;
		height: 140rpx;
		border-radius: 50%;
		color: #fff;
		text-align: center;
		line-height: 140rpx;
		text-shadow: 0px 4px 0px rgba(0,0,0,.1);
		border: 6rpx solid #f5f5f5;
		margin: -76rpx auto 0 auto;
		background-color: #999;
	}

	.payment-status .iconfont.fail {
		text-shadow: 0px 4px 0px #7a7a7a;
	}

	.payment-status .status {
		font-size: 32rpx;
		font-weight: bold;
		text-align: center;
		margin: 25rpx 0 37rpx 0;
	}

	.payment-status .wrapper {
		border: 1rpx solid #eee;
		margin: 0 30rpx 47rpx 30rpx;
		padding: 35rpx 0;
		border-left: 0;
		border-right: 0;
	}

	.payment-status .wrapper .item {
		font-size: 28rpx;
		color: #282828;
	}

	.payment-status .wrapper .item~.item {
		margin-top: 20rpx;
	}

	.payment-status .wrapper .item .itemCom {
		color: #666;
	}

	.payment-status .returnBnt {
		width: 630rpx;
		height: 86rpx;
		border-radius: 50rpx;
		color: #fff;
		font-size: 30rpx;
		text-align: center;
		line-height: 86rpx;
		margin: 0 auto 20rpx auto;

	}
	.cart-color {
		@include main_color(theme);
		@include coupons_border_color(theme);
	}
</style>
