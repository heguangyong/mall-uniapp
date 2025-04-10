<template>
	<view class="flex pointsGoods" :style="[pointsGoodsStyle.boxStyle]">
		<view class="product-item " :style="[pointsGoodsStyle.imageBoxStyle]" v-for="(item, index) in integralGood" :key="index" @click="goGoodsDetail(item)">
			<view class="relative">
				<easy-loadimage
				:image-src="item.image"
				:width="pointsGoodsStyle._imageWidth"
				:height="pointsGoodsStyle._imageHeight"
				:radius="10"></easy-loadimage>
				<view v-show="item.stock===0" class="sellOut">已售罄</view>
			</view>
			<view class="info">
				<view class="title line1" :style="[pointsGoodsStyle.nameStyle]">{{ item.name }}</view>
				<view class="sales text-999 mt-8 mb-20" :style="[pointsGoodsStyle.salesStyle]">已有{{item.sales}}人兑换</view>
				<PointsPrice :pointsPrice="item" :pointsGoodsStyle="pointsGoodsStyle" v-model="isShowSamll"></PointsPrice>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		goProductDetail
	} from "@/libs/order";
	import PointsPrice from '@/components/PointsPrice.vue';
	import easyLoadimage from '@/components/base/easy-loadimage.vue';
		export default {
			components: {
				easyLoadimage,
			    PointsPrice
			},
			props: {
				//积分商品列表
				integralGood: {
					type: Array,
					default: function() {
						return [];
					}
				},
				//商品大小样式
				pointsGoodsStyle: {
					type: Object,
					default: function() {
						return {};
					}
				},
				//视图宽
				width: {
					type: String,
					default: ''
				},
				marginRight: {
					type: String,
					default: ''
				},
				// 积分图标大小
				iconWidth: {
					type: String,
					default: ''
				},
				isShowSamll: {
					type: Boolean,
					default: false
				}
			},
			computed: {
				boxStyle() {
					return {
						width: this.width,
						marginRight: this.marginRight
					}
				},
				iconStyle() {
					return {
						width: this.iconWidth,
						height: this.iconWidth
					}
				}
			},
			data(){
				return {
					urlDomain: this.$Cache.get("imgHost"),
				}
			},
			methods: {
				goGoodsDetail(item){
					goProductDetail(item.id, 0, '',1)
				},
			}
		}
</script>

<style scoped lang="scss">
	.fs-22{
		margin-left: 4rpx;
	}
	.product-item {
		position: relative;
		background: #fff;
		border-radius: 10rpx;
		margin-bottom: 20rpx;
	
		.info {
			margin-top: 20rpx;
		}
	}
</style>