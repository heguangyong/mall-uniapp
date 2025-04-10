<template>
	<view :style="{ backgroundImage: `url(${productInfo.activityStyle})` }" class='nav acea-row row-between-wrapper '>
		<view class='money skeleton-rect'>
			<svip-price :svipIconStyle="svipIconStyle" :productPrice="productPrice" :productInfo="productInfo"
				:svipPriceStyle="svipPriceStyle"></svip-price>
		</view>
		<view class='acea-row row-middle skeleton-rect'>
		</view>
	</view>
</template>

<script>
	import svipPrice from '@/components/svipPrice.vue';
	export default {
		components: {
			svipPrice
		},
		props: {
			//商品详情
			productInfo: {
				type: Object,
				default: () => {},
			},
			//选中的价格
			productPrice: {
				type: Object,
				default: () => {},
			}
		},
		data() {
			return {
				//普通价格
				svipPriceStyle: {
					svipBox: {
						height: '34rpx',
						borderRadius: '60rpx 56rpx 56rpx 20rpx',
					},
					icon: {
						fontSize: '23rpx',
						height: '34rpx',
						borderRadius: '16rpx 0 16rpx 2rpx'
					},
					price: {
						fontSize: '44rpx'
					},
					svipPrice: {
						fontSize: '27rpx'
					},
					topStyle: {
						top: '6rpx'
					}
				},
				//svip价格
				svipIconStyle: {
					svipBox: {
						height: '34rpx',
						borderRadius: '36rpx 40rpx 40rpx 0.4rpx',
					},
					price: {
						fontSize: '44rpx'
					},
					svipPrice: {
						fontSize: '22rpx'
					}
				}
			}

		}
	}
</script>

<style lang="scss" scoped>
	.nav {
		background-repeat: no-repeat;
		background-size: 100% 100%;
		width: 100%;
		height: 100rpx;
		padding: 0 24px;
		box-sizing: border-box;

		.money {
			font-size: 14px;
			color: #fff;
		}

		.num {
			font-size: 24px;
		}

		.y-money {
			font-size: 26rpx;
			margin-left: 10rpx;
			text-decoration: line-through;
		}
	}
</style>