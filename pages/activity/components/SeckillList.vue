<template>
	<view class="seckill_list relative" :data-theme="theme">
		<view class="seckill_item acea-row" v-for="(item,index) in seckillList " :key="index"
			@click="goDetail(item.id)">
			<view class="picture">
				<easy-loadimage :image-src="item.image" :border-src="item.image" width="254rpx" height="254rpx"
					:radius="8">
				</easy-loadimage>
			</view>
			<view class="acea-row row-column row-between" :class="status == 1?'':''">
				<view class="pro_name line1 f-w-700"><text v-if="item.isSelf"
						class="font-bg-red bt-color mr10 self_min merType bg-color">自营</text>{{item.name}}</view>
				<view v-if="status == 1" class="seckill_zhekou acea-row row-between">
					<view class="zhekou_price futura f-s-22 frice_hua">￥{{item.price}}</view>
					<view class="acea-row row-column row-center row-middle pb-30">
						<text class="f-s-24 reduce_color title">直降</text>
						<text
							class="f-s-24 reduce_color">¥{{(Number(item.price)-Number(item.seckillPrice)).toFixed(2)}}</text>
					</view>
					<view class="zhekou_price f-s-20 futura text-right">即将恢复</view>
				</view>
				<view v-else class="acea-row row-between">
					<text
						class="f-s-24 reduce_color mts">商品直降¥{{(Number(item.price)-Number(item.seckillPrice)).toFixed(2)}}</text>
				</view>
				<!--  抢购中按钮-->
				<view class="seckill_btn seckill_btn_bg1 acea-row row-middle" v-if="status == 1">
					<view class="seckill_btn_left f-w-700">
						<text class="friceIcon">￥</text>{{item.seckillPrice}}
					</view>
					<view class="middle"></view>
					<view class="acea-row row-column seckill_btn_right">
						<text class="f-s-26 f-w-700 text-white text-center">立即抢购</text>
						<view class="acea-row row-middle mt12">
							<text class="f-s-17 text-white f-w-300">已抢{{item.payRange}}</text>
							<view class="w80 ml8">
								<view class="activityProgress skeleton-rect">
									<view class='bg-reds' :style="'width:'+item.payRange"></view>
								</view>
							</view>
						</view>
					</view>
				</view>
				<!--  未开始按钮-->
				<view class="seckill_btn seckill_btn_bg2 acea-row row-middle" v-if="status == 2 || status ==3">
					<view class="seckill_btn_left f-w-700">
						<text class="friceIcon">￥</text>{{item.seckillPrice}}
					</view>
					<view class="middle"></view>
					<view class="acea-row row-column">
						<text class="f-s-28 f-w-700 btn_text text-center">敬请期待</text>
					</view>
				</view>
				<view class="seckill_btn seckill_btn_bg3 acea-row row-middle" v-if="status == 0">
					<view class="seckill_btn_left f-w-700">
						<text class="friceIcon">￥</text>{{item.seckillPrice}}
					</view>
					<view class="middle"></view>
					<view class="acea-row row-center row-middle">
						<text class="f-s-28 f-w-700 btn_text text-center">已结束</text>
					</view>
				</view>
			</view>
		</view>
		<view class='loadingicon acea-row row-center-wrapper'>
			<text class='loading iconfont icon-jiazai'
				:hidden='loading==false'></text>{{seckillList.length>0?loadTitle:''}}
		</view>
		<view class="empty-boxs" v-if="!seckillList.length && !loading">
			<emptyPage title="暂无秒杀商品~" mTop="31%" :imgSrc="urlDomain+'crmebimage/presets/noShopper.png'"></emptyPage>
		</view>
	</view>
</template>

<script>
	import easyLoadimage from '@/components/base/easy-loadimage.vue'
	import {
		goProductDetail
	} from "@/libs/order";
	let app = getApp();
	export default {
		name: "SeckillList",
		components: {
			easyLoadimage,
		},
		props: {
			//秒杀商品列表
			seckillList: {
				type: Array,
				default: function() {
					return [];
				}
			},
			loading: {
				type: Boolean,
				default: false
			},
			loadTitle: {
				type: String,
				default: ''
			},
			status: {
				type: Number,
				default: 1
			},
			// 倒计时时间
			datatime: {
				type: Number,
				default: 0
			}
		},
		data() {
			return {
				urlDomain: this.$Cache.get("imgHost"),
				theme: app.globalData.theme,
			}
		},
		methods: {
			/*
			 *去商品详情页 
			 */
			goDetail(id) {
				goProductDetail(id, 1, `&status=${this.status}&datatime=${this.datatime}`)
			},
		}
	}
</script>

<style scoped lang="scss">
	.middle {
		width: 24rpx;
		height: 82rpx;
		background-image: url('../static/images/middle.png');
		background-size: cover;
	}

	.pl-6 {
		padding-left: 6rpx;
	}

	.mt12 {
		margin-top: 8rpx;
	}

	.ml8 {
		margin-left: 8rpx;
	}

	.reduce_color {
		color: #AC6926;
	}

	.f-w-300 {
		font-weight: 300;
	}

	.w80 {
		width: 60rpx;
	}

	.seckill_list {
		background-color: #fff;
		padding: 117rpx 24rpx 24rpx 24rpx;
		overflow-y: scroll;
		z-index: 1;
	}

	.seckill_item {
		height: 300rpx;
		background: #FFFFFF;
		border-radius: 14rpx;
		border: 1px solid #E6E6E6;
		margin-bottom: 20rpx;
		padding: 20rpx;
		box-sizing: border-box;

		.picture,
		::v-deep.easy-loadimage image {
			display: block;
			margin-right: 16rpx;
		}

		.pro_name {
			width: 386rpx;
			// height: 72rpx;
			font-size: 28rpx;
			font-family: PingFang SC-中黑体, PingFang SC;
			color: #333333;
			// line-height: 36rpx;
		}
	}

	.seckill_zhekou {
		width: 100%;
		height: 76rpx;
		background-image: url('../static/images/seckill_discount.png');
		background-position: bottom;
		background-repeat: no-repeat;
		background-size: contain;

		.title {
			margin-top: -20rpx;
		}
	}

	.seckill_btn {
		background-size: contain;
		background-repeat: no-repeat;
		width: 388rpx;
		height: 82rpx;
		// padding: 0 16rpx 0;
		border-radius: 8rpx;
	}

	.seckill_btn_left {
		width: 190rpx;
		height: 82rpx;
		line-height: 82rpx;
		text-align: center;
		color: #FFD39D;
		font-size: 36rpx;
		font-family: PingFang SC-中黑体, PingFang SC;
		background: linear-gradient(300deg, #22170F 0%, #4B3A30 100%);
		opacity: 1;
		background-image: url('../static/images/seckill_btn_bg2.png');
		background-size: 100% 100%;
		background-repeat: no-repeat;
	}

	.seckill_btn_right {
		width: 174rpx;
		text-align: center;
		align-items: center;
	}

	.seckill_btn_bg1 {
		@include main_bg_color(theme);
	}

	.seckill_btn_bg2,
	.seckill_btn_bg3 {
		background-color: #BBBBBB;
	}

	.btn_text {
		width: 150rpx;
		color: #fff;
	}

	.zhekou_price {
		color: #888888;
		width: 122rpx;

	}

	.frice_hua {
		text-decoration: line-through;
	}

	.text-center {
		text-align: center;
	}

	.other_btn {
		width: 200rpx;
		height: 60rpx;
		font-size: 28rpx;
		font-weight: 500;
		color: #000;
		border-radius: 30rpx;
		border: 1px solid #000;
		margin: 30rpx 0;
	}

	.icon-shangpinye_gengduo {
		font-size: 24rpx;
		padding-left: 4rpx;
	}
</style>