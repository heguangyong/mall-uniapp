<template>
	<view :data-theme="theme" class="user_payment">
		<form @submit="submitSub" report-submit='true'>
			<view class="payment-top acea-row row-column row-center-wrapper">
				<span class="name1">转入至</span>
				<span class="name2"><text class="iconfont icon-yue"></text>余额</span>
			</view>
			<view class="payment">
				<view class="tip">
					<view class="pay-money">
						转入金额
					</view>
					<view class='input'><text>￥</text>
					<input placeholder="0.00" type='number' v-model="toPrice" placeholder-class='placeholder'></input></view>
					<view class="tips-title">
						<view style="font-weight: bold; font-size: 26rpx;">提示：</view>
						<view style="margin-top: 10rpx;">
							当前佣金为 <text class=' mr10'>￥{{nowMoney || 0}}, </text>
							<text class="font-color" @click="getAll">全部转入</text>
						</view>
					</view>
					<view class="tips-box">
						<view class="tips mt-30">注意事项：</view>
						<view class="tips-samll" v-for="item in noticeList" :key="item">
							{{ item }}
						</view>
					</view>
				</view>
				<button class='but' :class="parseFloat(this.nowMoney)<=0?'bg-color-hui':''" formType="submit"> 立即转入</button>
				<view class="alipaysubmit" v-html="formContent"></view>
			</view>
		</form>
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
		transferIn,
		getRechargeApi
	} from '@/api/user.js';
	import {
		toLogin
	} from '@/libs/login.js';
	import {
		mapGetters
	} from "vuex";
	import {Debounce} from '@/utils/validate.js'
	let app = getApp();
	export default {
		data() {
			let that = this;
			return {
				toPrice: '',
				placeholder: "0.00",
				packageList: [],
				noticeList: [],
				theme:app.globalData.theme,
				formContent:'',
				nowMoney: 0
			};
		},
		watch:{
			isLogin:{
				handler:function(newV,oldV){
					if(newV){
						this.getRecharge();
					}
				},
				deep:true
			}
		},
		computed: mapGetters(['isLogin', 'systemPlatform','userInfo']),
		onLoad(options) {
			this.nowMoney = options.brokeragePrice
			if (this.isLogin) {
				this.getRecharge();
			} else {
				toLogin();
			}
		},
		methods: {
			/**
			 * 充值额度选择
			 */
			getRecharge() {
				getRechargeApi()
					.then(res => {
						this.noticeList = res.data.noticeList || [];
					})
					.catch(res => {
						this.$dialog.toast({
							mes: res
						});
					});
			},
			getAll(){
				if(parseFloat(this.nowMoney)<=0) {
					return this.$util.Tips({
						title: '您暂无佣金'
					});
				}
				this.toPrice = this.nowMoney
			},

			navRecharges: function(index) {
				this.active = index;
			},
			/*
			 * 立即转入
			 */
			submitSub: Debounce(function(e) {
				let that = this
				if(parseFloat(that.nowMoney)<=0) {
					return
				}
				// 转入余额
				if (parseFloat(that.toPrice) < 0 || parseFloat(that.toPrice) == NaN || that.toPrice == undefined || that.toPrice == "") {
					return that.$util.Tips({
						title: '请输入金额'
					});
				}
				uni.showModal({
					title: '转入余额',
					content: '转入余额后无法再次转出，确认是否转入余额',
					success(res) {
						if (res.confirm) {
							transferIn({
										price: parseFloat(that.toPrice)
							}).then(res => {
								return that.$util.Tips({
									title: '转入成功',
									icon: 'success'
								}, {
									tab: 5,
									url: '/pages/users/user_spread_user/index'
								});
							}).catch(err=>{
								return that.$util.Tips({
									title: err
								});
							})
						} else if (res.cancel) {
							return that.$util.Tips({
								title: '已取消'
							});
						}
					},
				})
			})
		}
	}
</script>

<style lang="scss">
	.user_payment{
		height: 100vh;
		background-color: #fff;
	}
	.payment {
		position: relative;
		top: -60rpx;
		width: 100%;
		background-color: #fff;
		border-radius: 10rpx;
		padding-top: 25rpx;
		border-top-right-radius: 14rpx;
		border-top-left-radius: 14rpx;
	}

	.payment .nav {
		height: 75rpx;
		line-height: 75rpx;
		padding: 0 100rpx;
	}

	.payment .nav .item {
		font-size: 30rpx;
		color: #333;
	}

	.payment .nav .item.on {
		font-weight: bold;
		@include tab_border_bottom(theme);
	}

	.payment .input {
		display: flex;
		align-items: center;
		border-bottom: 1px dashed #dddddd;
		margin: 32rpx auto 0 auto;
		padding-bottom: 20rpx;
		font-size: 56rpx;
		color: #333333;
		flex-wrap: nowrap;

	}

	.payment .input text {
		// padding-left: 106rpx;
	}

	.payment .input input {
		width: 310rpx;
		height: 94rpx;
		text-align: center;
		font-size: 70rpx;
	}

	.payment .placeholder {
		color: #d0d0d0;
		height: 100%;
		line-height: 94rpx;
	}

	.payment .tip {
		font-size: 26rpx;
		color: #888888;
		padding: 0 30rpx;
		// margin-top: 25rpx;
	}

	.payment .but {
		color: #fff;
		font-size: 30rpx;
		width: 700rpx;
		height: 86rpx;
		border-radius: 43rpx;
		margin: 50rpx auto 0 auto;
		@include linear-gradient(theme);
		line-height: 86rpx;
	}

	.payment-top {
		width: 100%;
		height: 278rpx;
		@include main_bg_color(theme);

		.name1 {
			font-size: 26rpx;
			color: rgba(255, 255, 255, 0.8);
			margin-top: -38rpx;
			margin-bottom: 16rpx;
		}
		.name2 {
			font-size: 36rpx;
			color: rgba(255, 255, 255, 0.8);
		}
		.icon-yue {
			font-size: 42rpx;
			margin-right: 8rpx;
		}

		.pic {
			font-size: 32rpx;
			color: #fff;
		}

		.pic-font {
			font-size: 78rpx;
			color: #fff;
		}
	}

	.picList {
		display: flex;
		flex-wrap: wrap;
		margin: 30rpx 0;

		.pic-box {
			width: 32%;
			height: auto;
			border-radius: 20rpx;
			margin-top: 21rpx;
			padding: 20rpx 0;
			margin-right: 12rpx;

			&:nth-child(3n) {
				margin-right: 0;
			}
		}

		.pic-box-color {
			background-color: #f4f4f4;
			color: #656565;
		}

		.pic-number {
			font-size: 22rpx;
		}

		.pic-number-pic {
			font-size: 38rpx;
			margin-right: 10rpx;
			text-align: center;
		}

	}
    .pic-box-color-active {
			@include linear-gradient(theme);
			color: #fff !important;
	}
	.tips-box {
		.tips {
			font-size: 28rpx;
			color: #333333;
			font-weight: 800;
			margin-bottom: 14rpx;
			margin-top: 20rpx;
		}

		.tips-samll {
			font-size: 24rpx;
			color: #333333;
			margin-bottom: 14rpx;
		}

		.tip-box {
			margin-top: 30rpx;
		}
	}

	.tips-title {
		margin-top: 20rpx;
		font-size: 24rpx;
		color: #333;
	}
	.wrapper .item textarea {
		background-color: #f9f9f9;
		width: auto !important;
		height: 140rpx;
		border-radius: 14rpx;
		margin-top: 30rpx;
		padding: 15rpx;
		box-sizing: border-box;
		font-weight: 400;
	}
	.px-30{
		padding-left: 30rpx;
		padding-rigt: 30rpx;
	}
	 .wrapper .item .placeholder {
		color: #ccc;
	}

	.wrapper .item .list {
		margin-top: 35rpx;
	}

	.wrapper .item .list .payItem {
		border: 1px solid #eee;
		border-radius: 14rpx;
		height: 86rpx;
		width: 95%;
		box-sizing: border-box;
		margin-top: 20rpx;
		font-size: 28rpx;
		color: #282828;
	}

	.wrapper .item .list .payItem.on {
		// border-color: #fc5445;
		@include coupons_border_color(theme);
		color: $theme-color;
	}

	.name {
		width: 50%;
		text-align: center;
		border-right: 1px solid #eee;
	}
	.name .iconfont {
		width: 44rpx;
		height: 44rpx;
		border-radius: 50%;
		text-align: center;
		line-height: 44rpx;
		background-color: #fe960f;
		color: #fff;
		font-size: 30rpx;
		margin-right: 15rpx;
	}
	.name .iconfont.icon-weixin2 {
		background-color: #41b035;
	}
	.name .iconfont.icon-zhifubao {
		background-color: #00AAEA;
	}
	.payItem .tip {
		width: 49%;
		text-align: center;
		font-size: 26rpx;
		color: #aaa;
	}
	.pay-money {
		margin-top: 30rpx;
		color: #333;
	}
</style>
