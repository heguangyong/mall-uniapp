<template>
	<view :data-theme="theme">
		<view class='wrapper'>
			<view class='item borRadius14'>
				<view class="title">￥<text>{{payPrice}}</text></view>
				<view class='list'>
					<block v-for="(item,index) in cartArr" :key='index'>
						<view v-if="item.payStatus === 1" class='payItem acea-row row-middle'
							:class='active==index ?"on":""' @tap='payItem(index,item)'>
							<view class='name acea-row row-center-wrapper'>
								<view class='iconfont animated'
									:class='(item.icon) + " " + (animated==true&&active==index ?"bounceIn":"")'>
								</view>
								{{item.name}}
							</view>
							<view class="acea-row">
								<view class='tip'>
									{{item.title}}
									<block v-if="item.value === 'yue'">
										{{item.userBalance}}
									</block>
								</view>
								<view class="radio">
									<block v-if="active==index">
										<view class="iconfont icon-xuanzhong1 font-color"></view>
									</block>
									<block v-else>
										<view class="iconfont icon-weixuanzhong"></view>
									</block>
								</view>
							</view>
						</view>
					</block>
				</view>
			</view>
		</view>
		<view v-if="isShow" class="titleNo">暂无支付方式！</view>
		<view class="btn-box">
			<button class='Bnt bg-color' @tap='getOrderPay' :disabled="isBuy">立即支付</button>
		</view>
		<view class="alipaysubmit" v-html="formContent"></view>
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
		orderPayApi,
		wechatQueryPayResult
	} from '@/api/order.js';
	import {
		svipOrderCreateApi
	} from '@/api/activity.js';
	import {
		openOrderSubscribe
	} from '@/utils/SubscribeMessage.js';
	import {
		Debounce
	} from '@/utils/validate.js'
	import {
		mapGetters
	} from "vuex";
	import store from '@/store'
	import orderPay from "@/mixins/OrderPay.js";
	let app = getApp();
	export default {
		mixins: [orderPay],
		data() {
			return {
				active: null, //支付方式切换
				theme: app.globalData.theme,
				//支付方式
				cartArr: [],
				payPrice: '',
				orderNo: '',
				animated: false,
				payType: '', //支付方式
				payChannel: '',
				formContent: '',
				isShow: false,
				userBalance: '', //余额
				fromType: '' ,//页面来源，svip支付，购买商品
				//isBuy: false //是否可以点击购买
			}
		},
		computed: {
			...mapGetters(['productType', 'systemPlatform'])
		},
		onLoad(options) {
			this.payPrice = options.payPrice;
			this.orderNo = options.orderNo;
			this.fromType = options.fromType || ''
		},
		mounted() {
			this.payConfig();
		},
		methods: {
			// 支付配置
			payConfig() {
				uni.hideLoading();
				// 支付方式
				store.dispatch('getPayConfig').then((res) => {
					this.cartArr = res.payConfig;
          this.userBalance = res.userBalance;
					// if(this.fromType === 'svip') this.cartArr[1].payStatus = 0					
					if (this.cartArr.length) {
						this.active = 0;
						this.payType = this.cartArr[0].value;
						this.isShow = false;
					} else {
						this.isShow = true;
						return this.$util.Tips({
							title: '暂无支付方式！'
						})
					}
				});
			},
			payItem: Debounce(function(e,item) {
				let that = this;
				if(item.userBalance) that.userBalance = item.userBalance
				let active = e;
				that.active = active;
				that.animated = true;
				that.payType = that.cartArr[active].value;
				setTimeout(function() {
					that.car();
				}, 500);
			}),
			car: function() {
				let that = this;
				that.animated = false;
			},
			//选择支付方式的判断，传参
			getPayCheck() {
				if (!this.payType) return this.$util.Tips({
					title: '请选择支付方式'
				});
				if (this.payType === 'yue') {
					this.payChannel = 'yue'
				} else if (this.payType == 'alipay') {
					// #ifdef H5
					this.payChannel = 'alipay';
					// #endif
					// #ifdef APP-PLUS
					this.payChannel = 'alipayApp';
					// #endif
				} else {
					// #ifdef H5
					this.payChannel = this.$wechat.isWeixin() ? 'public' : 'h5';
					// #endif
					// #ifdef APP-PLUS
					this.payChannel = this.systemPlatform === 'ios' ? 'wechatIos' : 'wechatAndroid';
					// #endif
					// #ifdef MP
					this.payChannel = "mini";
					if (this.productType == 'video') {
						this.payChannel = "video";
					} else {
						this.payChannel = "mini";
					}
					// #endif
				}
			},
			//立即支付
			getOrderPay: Debounce(function() {
				this.getPayCheck();
				if (Number(this.payPrice)>Number(this.userBalance) && this.payType === 'yue') return this.$util.Tips({
					title: '余额的金额不够，请切换支付方式'
				});
				uni.showLoading({
					title: '加载中...'
				});
				this.isBuy = true;
				if (this.fromType === 'svip') {
					svipOrderCreateApi({
						cardId: this.orderNo,
						payChannel: this.payChannel,
						payType: this.payType,
					}).then(res => {
						this.handleOrderPay(res, res.data.orderNo, this.productType, this.fromType, this
							.payType, this.payPrice)
					}).catch(err => {
						uni.hideLoading();
						this.isBuy = false;
						return this.$util.Tips({
							title: err
						});
					});
				} else {
					// 订单支付
					this.changeOrderPay(this.orderNo, this.payChannel, this.payType ,this.productType, this.fromType, this.payPrice)
					// orderPayApi({
					// 	orderNo: this.orderNo,
					// 	payChannel: this.payChannel,
					// 	payType: this.payType,
					// 	scene: this.productType === 'normal' ? 0 : 1177

					// }).then(res => {
					// 	this.handleOrderPay(res, this.orderNo, this.productType, this.fromType, this
					// 		.payType, this.payPrice)
					// }).catch(err => {
					// 	uni.hideLoading();
					// 	this.isBuy = false;
					// 	return this.$util.Tips({
					// 		title: err
					// 	});
					// });
				}
			})
		},
	}
</script>

<style lang="scss" scoped>
	.titleNo {
		width: 100%;
		font-size: 28rpx;
		text-align: center;
	}

	.btn-box {
		padding: 0 30rpx;
		position: fixed;
		bottom: 43rpx;
	}

	.Bnt {
		font-size: 30rpx;
		font-weight: bold;
		color: #fff;
		width: 690rpx;
		height: 86rpx;
		border-radius: 43rpx;
		text-align: center;
		line-height: 86rpx;
	}

	.wrapper {

		padding: 30rpx;

		.list {
			margin-top: 50rpx;
		}

		.item {
			padding: 50rpx 30rpx;
			font-size: 30rpx;
			color: #333333;
			background-color: #fff;

			.title {
				text-align: center;
				@include main_color(theme);
				font-size: 34rpx;

				text {
					font-weight: 800;
					font-size: 50rpx;
				}
			}
		}

		.payItem {
			border-bottom: 1px solid #eee;
			justify-content: space-between;
			height: 138rpx;
			line-height: 138rpx;
			width: 100%;
			box-sizing: border-box;
			font-size: 32pxrpx;
			color: #333333;

			.on {
				// border-color: #fc5445;
				@include coupons_border_color(theme);
				color: $theme-color;
			}

			.name {

				.iconfont {
					width: 48rpx;
					height: 48rpx;
					border-radius: 50%;
					text-align: center;
					line-height: 48rpx;
					background-color: #fe960f;
					color: #fff;
					font-size: 30rpx;
					margin-right: 28rpx;
				}
			}

			.iconfont.icon-weixinzhifu1 {
				background-color: #41b035;
			}

			.iconfont.icon-zhifubao {
				background-color: #00AAEA;
			}

			.tip {
				text-align: center;
				font-size: 26rpx;
				color: #aaa;
				margin-right: 20rpx;
			}

			.radio {
				.iconfont {
					font-size: 46rpx;
				}
			}
		}
	}
</style>