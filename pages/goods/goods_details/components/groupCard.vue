<template>
	<view :data-theme="theme" class="seckill ">
		<view class="seckill_activity pad-30 acea-row row-between acea-no-warp" :style="[...bgImage]">
			<view class="" >
				<image class="img"  src="../../static/images/czpt.png" mode=""></image>
				<view class="acea-row price-box">
					<text class="title">拼团价</text>
					<text class="biao">￥</text>
					<text class="price semiBold">{{productInfo.groupPrice}}</text>
					<text class="ot-price text-dec">￥{{productInfo.price}}</text>
				</view>
			</view>
			<view class="acea-row row-column groupFoter">
				<view class="groupNum">{{groupBuyActivityResponse.buyCount}}人团</view>
				<view class="status">活动进行中</view>
			</view>
		</view>
	</view>
</template>

<script>
	import svipPrice from '@/components/svipPrice.vue';
	const app = getApp();
	export default {
		components: {
			svipPrice
		},
		props:['productInfo','groupBuyActivityResponse'],
		data() {
			return {
				urlDomain: this.$Cache.get("imgHost"),
				theme: app.globalData.theme,
				bgColor: {
					'bgColor': '#fff',
					'Color': '',
					'width': '36rpx',
					'timeTxtwidth': '16rpx',
					'isDay': true
				},
			}
		},
		computed: {
			bgImage() {
				return [
					{
						'background':`url(${this.urlDomain}crmebimage/presets/groupMb.png)`
					},
					{
						'background-size':`cover`
					}
				]
			}
		},
	}
</script>

<style scoped lang="scss">
	.pad-30 {
		padding: 0 30rpx;
	}
	.seckill_activity {
		width: 750rpx;
		height: 303rpx;
		color: #fff;
		padding: 0 30rpx;
		background-size: cover;
		.title,
		.ot-price {
			font-size: 22rpx;
			margin-top: 25rpx;
		}

		.biao {
			font-size: 22rpx;
			margin-top: 25rpx;
		}

		.price {
			font-size: 50rpx;
			margin-right: 8rpx;
			margin-top: 4rpx;
		}

		.groupFoter {
			margin-top: 28rpx;
			text-align: right;
			.groupNum{
				background: #FFFFFF;
				opacity: 0.9;
				font-size: 26rpx;
				color: #E93323;
				text-align: center;
				padding: 6rpx 16rpx;
				border-radius: 50rpx 40rpx 40rpx 0;
			}
			.status{
				margin-top: 20rpx;
				font-size: 26rpx;
			}
		}
		.img{
			width: 150rpx;
			height: 30rpx;
			margin-top: 28rpx;
		}
		.price-box{
			margin-top: 10rpx;
		}
	}
</style>