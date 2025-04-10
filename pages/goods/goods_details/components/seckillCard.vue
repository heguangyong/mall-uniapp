<template>
	<view :data-theme="theme">
		<view class="seckill_activity pad-30 acea-row row-between acea-no-warp" :style="{backgroundImage: bgImage}">
			<view class="acea-row items-baseline">
				<text class="title">秒杀价</text>
				<text class="biao">￥</text>
				<text class="price semiBold">{{productPrice.price}}</text>
				<text class="ot-price text-dec">{{productPrice.otPrice}}</text>
			</view>
			<view class="acea-row row-column seckillTime">
				<text class="f-s-24 text-right mb12"
					:class="seckillStatus == 2 ? 'end_title' : 'text-white'">{{seckillStatus === 0? '活动已结束' : seckillStatus === 2 || seckillStatus === 3? '距活动开始' : '距活动结束'}}</text>
				<countDown v-if="seckillStatus > 0" :is-day="true" :tip-text="' '" :day-text="' '" :hour-text="' : '"
					:minute-text="' : '" :second-text="' '" :datatime="seckillTime" :isCol="false" :bgColor="bgColor">
				</countDown>
			</view>
		</view>
	</view>

</template>

<script>
	import svipPrice from '@/components/svipPrice.vue';
	import countDown from "@/components/countDown";
	import {
		setThemeColor
	} from '@/utils/setTheme.js'
	import {
		mapGetters
	} from "vuex";
	const app = getApp();
	export default {
		computed: mapGetters(["globalData"]),
		components: {
			countDown,
			svipPrice
		},
		props: {
			// 0=已结束 1=抢购中 2=即将开始 3=明日预告
			seckillStatus: {
				type: Number,
				default: 0
			},
			productInfo: {
				type: Object,
				default: () => {}
			},
			seckillTime: {
				type: Number,
				default: 0
			},
			//选中的价格
			productPrice: {
				type: Object,
				default: () => {},
			}
		},
		data() {
			return {
				theme: this.$Cache.get("theme"),
				//bgImage: '',
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
				return 'url(' + require('@/pages/goods/static/images/' + this.theme + '.png') + ')'
			}
		},
		mounted() {
			this.bgColor.Color = setThemeColor();
		},
	}
</script>

<style scoped lang="scss">
	.pad-30 {
		padding: 0 30rpx;
	}

	.mb12 {
		margin-bottom: 12rpx;
	}

	.seckill_activity {
		width: 750rpx;
		height: 303rpx;
		color: #fff;
		background-size: cover;
		padding: 0 30rpx;

		.title,
		.ot-price {

			font-size: 22rpx;
			margin-top: 96rpx;
		}

		.biao {
			font-size: 22rpx;
			font-weight: 800;
			margin-top: 96rpx;
			margin-left: 6rpx;
		}

		.price {

			font-size: 50rpx;
			margin-top: 72rpx;

			margin-right: 6rpx;
		}

		.seckillTime {
			margin-top: 35rpx;
		}
	}
</style>