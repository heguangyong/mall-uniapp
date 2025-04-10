<template>
	<view ref="textContainer" class="price-box acea-row w-full line-heightOne align-center">
		<view class="acea-row row-middle" v-if="parseFloat(pointsPrice.redeemIntegral)" ref="redeemIntegral">
			<image :src="`${urlDomain}crmebimage/presets/points_my.png`" :style="[iconStyle]"></image>
			<text class="icon-color semiBold" :style="[priceStyle, priceColor]">{{ pointsPrice.redeemIntegral }}</text>
		</view>
		<view
			v-if="parseFloat(pointsPrice.redeemIntegral) && (parseFloat(pointsPrice.price) || parseFloat(pointsPrice.payFee))"
			ref="hao" class="ml-4"> + </view>
		<view class="acea-row row-middle" v-if="parseFloat(pointsPrice.price) || parseFloat(pointsPrice.payFee)">
			<text class="icon-color semiBold ml-4"
				:style="[priceStyle, priceColor]">{{ pointsPrice.price || pointsPrice.payFee }}</text>
			<text :style="[unitStyle]" class="ml-4">元</text>
		</view>
	</view>
</template>

<script>
	/**
	 * 字数超过样式
	 */
	export const pointsStyle = {
		iconStyle: {
			width: '22rpx',
			height: '22rpx'
		},
		priceStyle: {
			fontSize: '22rpx',
		},
		unitStyle: {
			fontSize: '18rpx',
		},
	}
	import easyLoadimage from '@/components/base/easy-loadimage.vue';
	export default {
		components: {
			easyLoadimage
		},
		props: {
			//是否展示小字样式
			value: {
				type: Boolean,
				default: false,
			},
			//商品大小样式
			pointsPrice: {
				type: Object,
				default: function() {
					return {};
				}
			},
			//商品大小样式
			pointsGoodsStyle: {
				type: Object,
				default: function() {
					return {};
				}
			},
		},
		computed: {
			isOverflow() {
				return this.pointsPrice.redeemIntegral > 9999 && this.pointsPrice.price > 9999;
			},
			// 价格
			priceStyle() {
				return this.isOverflow && this.value ? this.pointsStyle.priceStyle : this.pointsGoodsStyle.priceStyle
			},
			//单位
			unitStyle() {
				return this.isOverflow && this.value ? this.pointsStyle.unitStyle : this.pointsGoodsStyle.unitStyle
			},
			// 图标
			iconStyle() {
				return this.isOverflow && this.value ? this.pointsStyle.iconStyle : this.pointsGoodsStyle.iconStyle
			},
			// 价格颜色
			priceColor() {
				return this.pointsGoodsStyle.priceColor ? this.pointsGoodsStyle.priceColor : ''
			},
		},
		data() {
			return {
				pointsStyle: pointsStyle,
				urlDomain: this.$Cache.get("imgHost"),
			}
		},
	}
</script>

<style scoped lang="scss">
	.acea-row {
		flex-wrap: nowrap;
	}

	.price-box {
		width: auto;
		//font-size: 24rpx;
		font-weight: 500;
		color: #666;

		image {
			width: 31rpx;
			height: 31rpx;
			margin-right: 6rpx;
		}
	}

	.sales {
		color: #999999;
		margin-top: 8rpx;
	}
</style>