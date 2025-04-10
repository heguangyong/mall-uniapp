<template>
	<view :data-theme="theme">
		<form @submit="subRefund" report-submit='true'>
			<view class='apply-return px-24 py-24'>
				<view class='goodsStyle borRadius14 px-24'>
					<view class="acea-row row-between">
						<view class='pictrue'>
							<image :src='orderInfo.image'></image>
						</view>
						<view class='text'>
							<view class='name line1 line-heightOne mb20'>{{orderInfo.productName}}</view>
							<view class='sku text-999 f-s-20 line-heightOne mb20'>{{orderInfo.sku}}</view>
							<view class='acea-row f-s-26 text-right row-between row-middle'>
								<view class="acea-row">
									<view class="mr10 text-2828">￥{{orderInfo.price}} </view>
									<view class='num text-999'> x {{orderInfo.payNum}}</view>
								</view>
								<view v-if="parseFloat(orderInfo.refundNum) + parseFloat(orderInfo.applyRefundNum)>0" class="applyRefundNum font-color">{{parseFloat(orderInfo.refundNum) + parseFloat(orderInfo.applyRefundNum)}}件商品已申请售后</view>
							</view>
						</view>
					</view>
					
				</view>
				<view @click="handleApplyRefund(1)" class='list borRadius14 acea-row row-middle px-24 row-between'>
					<view class="acea-row row-middle">
						<view class="iconfont icon-jintuikuan mr20 font-color"></view>
						<view>
							<view class="f-s-26 text-2828 mb15">仅退款（无需退货）</view>
							<view class="f-s-22 text-999">未收到货，或与卖家协商同意不退货只退款</view>
						</view>
					</view>
					<view class="iconfont icon-gengduo3 mr20 text-bbb" style="font-size: 28rpx;"></view>
				</view>
				<view @click="handleApplyRefund(2)" class='list borRadius14 acea-row row-middle px-24 row-between'>
					<view class="acea-row row-middle">
						<view class="iconfont icon-tuihuotuikuan mr20 font-color"></view>
						<view>
							<view class="f-s-26 text-2828 mb15">退货退款（已收到货）</view>
							<view class="f-s-22 text-999">已收到货，需要退还收到的货物</view>
						</view>
					</view>
					<view class="iconfont icon-gengduo3 mr20 text-bbb" style="font-size: 28rpx;"></view>
				</view>
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
		toLogin
	} from '@/libs/login.js';
	import {
		mapGetters
	} from "vuex";
	import {
		Debounce
	} from '@/utils/validate.js'
	let app = getApp();
	export default {
		data() {
			return {
				orderInfo: {},
				RefundArray: [],
				index: 0,
				orderId: 0,
				theme: app.globalData.theme,
				numIndex: 0
			};
		},
		computed: mapGetters(['isLogin']),
		onLoad: function(options) {
			this.$set(this, 'orderInfo', JSON.parse(this.$Cache.get('productInfo')));
			if (!options.orderNo) return this.$util.Tips({
				title: '缺少订单id,无法退款'
			}, {
				tab: 3,
				url: 1
			});
			this.orderNo = options.orderNo;
			this.orderId = options.orderId;
			if (!this.isLogin) {
				toLogin();
			} 
		},
		methods: {
			/**
			 * 退款申请
			 */
			handleApplyRefund(afterSalesType) {
				uni.navigateTo({
					url: `/pages/goods/goods_return/index?orderNo=${this.orderNo}&orderId=${this.orderId}&afterSalesType=${afterSalesType}`
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.icon-tuihuotuikuan, .icon-jintuikuan{
		font-size: 44rpx;
	}
	.applyRefundNum{
		font-size: 26rpx;
	}
	.goodsStyle{
		.text{
			.name{
				font-size: 28rpx;
			}
		}

	}
	.icon-jiantou{
		margin-left: 10rpx;
		font-size: 28rpx;
		color: #BBBBBB;
	}
	.apply-return {
		padding: 20rpx 30rpx 70rpx 30rpx;
	}

	.apply-return .list {
		background-color: #fff;
		margin-top: 20rpx;
		height: 120rpx;
	}
</style>
