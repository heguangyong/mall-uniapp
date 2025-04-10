<template>
	<view :data-theme="theme">
		<view class="borderPad">
			<view v-if="InvoiceList.length" class="logistics-title bgcolor">
				<text class="iconfont icon-shuoming2"></text>
				<text class="bgcolor-text">当前订单已发<text>{{deliveryNum}}</text>个包裹</text>
			</view>
			<view v-for="(item,index) in InvoiceList" :key="item.id" class='wrapper borRadius14'>
				<view class='bnt cancel' hover-class='none' @click="toLogistics(item,index)">
					<view v-if="item.deliveryType ==='express'" class="acea-row mb30 row-between">
						<text class="wrapper-title colorSize">快递配送</text>
						<view class="wrapper-title colorSize color-999">{{item.expressName}}：{{item.trackingNumber}}
						</view>
					</view>
					<view v-else-if="item.deliveryType ==='noNeed'" class="acea-row mb30 row-between">
						<text class="wrapper-title colorSize">无需发货</text>
						<view class="wrapper-title colorSize color-999 text-right line1" style="width: 80%;"
							:title="item.deliveryMark">{{item.deliveryMark}}</view>
					</view>
					<view v-else class="acea-row mb30 row-between">
						<text class="wrapper-title colorSize">商家送货</text>
						<view class="wrapper-title colorSize color-999">{{item.deliveryCarrier}} {{item.carrierPhone}}
						</view>
					</view>
					<view class="wrapper-pro acea-row">
						<scroll-view scroll-x="true" class="scroll_view" v-if="item.detailList.length>1">
							<view v-for="j in item.detailList" :key="j.id" class="wrapper-img">
								<easy-loadimage mode="widthFix" :image-src="j.image"></easy-loadimage>
							</view>
						</scroll-view>
						<view v-else class="acea-row">
							<image class="wrapper-img" :src="item.detailList[0].image" mode=""></image>
							<view class="acea-row row-column-between ml20">
								<view class="line2 line2-width f-s-28">
									{{item.detailList[0].productName}}
								</view>
								<view class="f-s-24 color-999">
									{{item.detailList[0].sku}}
								</view>
							</view>
						</view>
					</view>
					<view class="wrapper-num">共{{item.totalNum}}件商品</view>
				</view>

			</view>
		</view>
		<view class='noCommodity' v-if="!InvoiceList.length">
			<view class='pictrue text-center'>
				<image :src="urlDomain+'crmebimage/presets/nowuliu.png'"></image>
				<view class="default_txt">暂无物流信息~</view>
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
		orderInvoiceListInfo
	} from '@/api/order.js';
	import easyLoadimage from '@/components/base/easy-loadimage.vue';
	import navBar from '@/components/navBar';
	const app = getApp();
	export default {
		components: {
			easyLoadimage,
			navBar
		},
		data() {
			return {
				urlDomain: this.$Cache.get("imgHost"),
				theme: app.globalData.theme,
				orderNo: '',
				InvoiceList: [],
				num: 0,
				deliveryNum: 0
			}
		},
		onLoad: function(options) {
			this.$set(this, 'orderNo', options.orderNo);
			this.getOrderInvoiceListInfo(options.orderNo);
		},
		onShow() {
			this.getOrderInvoiceListInfo(this.orderNo);
		},
		methods: {
			getOrderInvoiceListInfo(orderNo) {
				uni.showLoading({
					title: "正在加载中"
				});
				orderInvoiceListInfo(orderNo).then(res => {
					uni.hideLoading();
					let data = res.data;
					this.deliveryNum = data.deliveryNum;
					this.num = data.num;
					this.$set(this, 'InvoiceList', data.invoiceList);
				}).catch(err => {
					this.$util.Tips({
						title: err
					});
				});
			},
			//跳转
			toLogistics(item, index) {
				//快递配送
				if (item.deliveryType == 'express') {
					uni.navigateTo({
						url: `/pages/admin/logistics/detail?invoiceId=${item.id}`
					})
					//商家送货-无需发货
				} else {
					uni.navigateTo({
						url: `/pages/admin/logistics/record?orderNo=${this.orderNo}&index=${index}`
					})
				}
			}
		}
	}
</script>

<style scoped lang="scss">
	.borderPad {
		padding-bottom: 50rpx;
	}

	.noCommodity {
		padding-top: 50% !important;
	}

	.logistics {
		&-title {
			height: 62rpx;
			line-height: 62rpx;
			background: #FCFBE7;
			padding: 0 30rpx;
			color: #9F560C;
			font-size: 24rpx;
		}
	}

	.wrapper {
		background-color: #fff;
		margin-top: 20rpx;
		padding: 20rpx 24rpx;

		&-num {

			font-size: 20rpx;
			color: #999999;
		}

		&-title {

			color: #666666;
			font-size: 24rpx;
		}

		&-img {
			width: 120rpx;
			height: 120rpx;
			margin-right: 20rpx;
			border-radius: 14rpx;
			overflow: hidden;
			margin-bottom: 20rpx;

			image {
				width: 100%;
				height: 100%;
			}

			&:nth-child(5n) {
				margin-right: 0;
			}
		}

	}

	.default_txt {
		font-size: 26rpx;
		color: #999;
		text-align: center;
	}

	.scroll_view {
		white-space: nowrap;
		padding-top: 10rpx;
		border-top: 1rpx solid #F0F0F0;

		.wrapper-img {
			display: inline-block;
			margin-right: 10rpx;
		}
	}

	.colorSize {
		font-size: 28rpx !important;
	}

	.color-999 {
		color: #999;
	}

	.bgcolor {
		background-color: #E5EFFE !important;
		color: #2A7EFB;
		height: 80rpx;
		line-height: 80rpx;
		border-radius: 14rpx;
		display: flex;
		align-items: center;

		.bgcolor-text {
			font-size: 26rpx;
		}
	}

	.icon-shuoming2 {
		margin-right: 8rpx;
		font-size: 28rpx;
	}

	.line2-width {
		width: 450rpx;
	}

	.logistics-title {
		/* #ifdef MP||APP-PLUS */
		margin-top: 20rpx;
		/* #endif */
	}
</style>