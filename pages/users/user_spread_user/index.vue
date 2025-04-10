<template>
	<view :data-theme="theme">
		<view class='my-promotion'>
			<view class="header">
				<image class="head_img"
					src="https://image.beta.java.crmeb.net/crmebimage/maintain/2021/07/13/48e81e3e2e374d48820b7a9a56905365k2qa9yj8n5.png">
				</image>
				<navigator
					:url="'/pages/users/user_spread_money/index?type=1&extractCount='+promotionInfo.settledCommissionPrice"
					hover-class="none" class='record'>结算记录<text class='iconfont icon-xiangyou'></text></navigator>
				<view class="head_box">
					<view class='name acea-row row-center-wrapper'>
						<view>当前佣金</view>
					</view>
					<view class='num'>{{promotionInfo.brokeragePrice}}</view>
					<view class='profit acea-row row-between-wrapper'>
						<view class='item'>
							<view>冻结佣金</view>
							<view class='money'>
								{{promotionInfo.freezePrice ? Number(promotionInfo.freezePrice).toFixed(2) : 0}}
							</view>
						</view>
						<view class='item'>
							<view>累积已提</view>
							<view class='money'>
								{{promotionInfo.settledCommissionPrice ? Number(promotionInfo.settledCommissionPrice).toFixed(2) : 0}}
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="btnBox acea-row">
				<view @click="openSubscribe('/pages/users/user_transferOut/index')" url="/pages/users/user_transferOut/index" hover-class="none" class='bnt bg_color left'>
					<text>提现</text>
				</view>
				<view @click="openSubscribe('/pages/users/user_spread_brokerage_out/index?brokeragePrice='+ promotionInfo.brokeragePrice)" hover-class="none"
					class='bnt bg_color right'>
					<text>转入</text>
				</view>
			</view>
			<view class='list acea-row row-between-wrapper'>
				<navigator url='/pages/users/user_spread_code/index' hover-class="none"
					class='item acea-row row-center-wrapper row-column'>
					<text class='iconfont icon-erweima'></text>
					<view>推广名片</view>
				</navigator>
				<navigator url='/pages/users/promoter-list/index' hover-class="none"
					class='item acea-row row-center-wrapper row-column'>
					<text class='iconfont icon-tongji'></text>
					<view>推广人统计</view>
				</navigator>
				<navigator
					:url="'/pages/users/user_spread_money/index?type=2&commissionCount='+ promotionInfo.brokeragePrice"
					hover-class="none" class='item acea-row row-center-wrapper row-column'>
					<text class='iconfont icon-qiandai'></text>
					<view>佣金记录</view>
				</navigator>
				<navigator url='/pages/users/promoter-order/index' hover-class="none"
					class='item acea-row row-center-wrapper row-column'>
					<text class='iconfont icon-dingdan'></text>
					<view>推广人订单</view>
				</navigator>
				<navigator url='/pages/users/promoter_rank/index' hover-class="none"
					class='item acea-row row-center-wrapper row-column'>
					<text class='iconfont icon-paihang1'></text>
					<view>推广人排行</view>
				</navigator>
				<navigator url='/pages/users/commission_rank/index' hover-class="none"
					class='item acea-row row-center-wrapper row-column'>
					<text class='iconfont icon-paihang'></text>
					<view>佣金排行</view>
				</navigator>
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
		myPromotion
	} from '@/api/user.js';
	import {
		openExtrctSubscribe
	} from '@/utils/SubscribeMessage.js';
	import {
		toLogin
	} from '@/libs/login.js';
	import {
		mapGetters
	} from "vuex";
	import {
		setThemeColor
	} from '@/utils/setTheme.js'
	const app = getApp();
	export default {
		data() {
			return {
				promotionInfo: {},
				theme: app.globalData.theme,
				bgColor: '#e93323'
			};
		},
		computed: mapGetters(['isLogin']),
		watch: {
			isLogin: {
				handler: function(newV, oldV) {
					if (newV) {
						this.getMyPromotion();
					}
				},
				deep: true
			}
		},
		onShow() {
			let that = this;
			that.bgColor = setThemeColor();
			uni.setNavigationBarColor({
				frontColor: '#ffffff',
				backgroundColor: that.bgColor,
			});

			if (this.isLogin) {
				this.getMyPromotion();
			} else {
				toLogin();
			}
		},
		methods: {
			openSubscribe: function(page) {
				uni.navigateTo({
					url: page,
				});
			},
			/**
			 * 获取个人用户信息
			 */
			getMyPromotion: function() {
				let that = this;
				myPromotion().then(res => {
					that.$set(that, 'promotionInfo', res.data);
				});
			}
		}
	}
</script>

<style scoped lang="scss">
	.my-promotion .header {
		width: 100%;
		height: 375rpx;
		position: relative;
	}

	.head_img {
		width: 100%;
		height: 375rpx;
		position: absolute;
		top: 0;
		z-index: 2;
	}

	.head_box {
		width: 100%;
		height: 375rpx;
		position: absolute;
		top: 0;
		z-index: 0;
		@include main_bg_color(theme);
	}

	.my-promotion .header .name {
		font-size: 30rpx;
		color: #fff;
		padding-top: 57rpx;
		position: relative;
	}

	.my-promotion .header .record {
		font-size: 26rpx;
		color: rgba(255, 255, 255, 0.8);
		position: absolute;
		right: 20rpx;
		top: 60rpx;
		z-index: 10;
	}

	.my-promotion .header .record .iconfont {
		font-size: 25rpx;
		margin-left: 10rpx;
		vertical-align: 2rpx;
	}

	.my-promotion .header .num {
		text-align: center;
		color: #fff;
		margin-top: 28rpx;
		font-size: 90rpx;
		font-family: 'Guildford Pro';
	}

	.my-promotion .header .profit {
		padding: 0 20rpx;
		margin-top: 35rpx;
		font-size: 24rpx;
		color: rgba(255, 255, 255, 0.8);
	}

	.my-promotion .header .profit .item {
		min-width: 200rpx;
		text-align: center;
	}

	.my-promotion .header .profit .item .money {
		font-size: 34rpx;
		color: #fff;
		margin-top: 5rpx;
	}

	.btnBox {
		position: absolute;
		width: 312rpx;
		background-color: #F5F5F5;
		border-radius: 200rpx;
		height: 84rpx;
		top: 334rpx;
		left: 218rpx;
		z-index: 3;
		padding-top: 6rpx;
	}

	.my-promotion {
		.bnt {
			font-size: 28rpx;
			color: #fff;
			height: 68rpx;
			box-sizing: border-box;
			border-radius: 50rpx;
			text-align: center;
			line-height: 68rpx;
			box-sizing: border-box;
			overflow: hidden;
		}

		.left {
			width: 148rpx;
			margin-left: 8rpx;
			border-radius: 200rpx 0px 0px 200rpx;
		}

		.right {
			width: 148rpx;
			border-radius: 0px 200rpx 200rpx 0px;
            text{
				width: 148rpx;
				height: 68rpx;
				display: inline-block;
				background-color: rgba(0, 0, 0, .3)
			}
		}
	}

	.bg_color {
		@include main_bg_color(theme);
	}

	.my-promotion .list {
		padding: 0 30rpx 50rpx 30rpx;
		margin-top: 60rpx;
	}

	.my-promotion .list .item {
		width: 335rpx;
		height: 240rpx;
		border-radius: 14rpx;
		background-color: #fff;
		margin-top: 20rpx;
		font-size: 30rpx;
		color: #666;
	}

	.my-promotion .list .item .iconfont {
		font-size: 70rpx;
		// background: linear-gradient(to right, #fc4d3d 0%, #e93323 100%);
		@include main_bg_color(theme);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		margin-bottom: 20rpx;
	}
</style>
