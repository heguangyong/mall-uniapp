<template>
	<div class="main">
		<!-- liveStatus直播间状态。101：直播中，102：未开始，103已结束，104禁播，105：暂停，106：异常，107：已过期 -->
		<view class='flash-sale'>
			<view class='list'>
				<view v-for="(item,index) in broadcastList" :key='index'>
					<navigator hover-class="none"
						:url="(item.liveStatus == 103 || item.liveStatus === 101 || item.liveStatus === 102) ? 'plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=' + item.roomId : ''">
						<view class='item acea-row row-between-wrapper'>
							<view class="live-image">
								<img class="image" :src="item.shareImgLocal">
								<view class="live-top" :class="item.liveStatus == 102 ? 'playRadius' : 'notPlayRadius'"
									:style="'background:' + (item.liveStatus == 101 ? playBg : (item.liveStatus != 101 && item.liveStatus != 102) ? endBg : notBg) + ';'">
									<block v-if="item.liveReplay">
										<text class="iconfont icon-zhibo-huifang"></text>
										<text>回放</text>
									</block>
									<block v-else-if="item.liveStatus == 101">
										<text class="iconfont icon-zhibo-zhibozhong"></text>
										<text>直播中</text>
									</block>
									<block v-else-if="item.liveStatus == 103">
										<text class="iconfont icon-zhibo-yugao"></text>
										<text>已结束</text>
									</block>
									<block v-else-if="item.liveStatus == 102">
										<text class="iconfont icon-zhibo-yugao"></text>
										<text>预告</text>
									</block>
								</view>
								<view v-if="item.liveStatus == 101 || item.liveStatus == 102" class="broadcast-time">
									{{ getPartTime(item.startTime) }}</view>
							</view>
							<view class="live-wrapper">
								<view class="live-title">{{ item.roomName }}</view>
								<view class="live-store">{{ item.anchorName }}</view>
								<!--  -->
								<view class="pro-count" style="white-space: nowrap; display: flex"
									v-if="item.goodsJson">
									<!-- <view class="item">
										<image :src="JSON.parse(item.goodsJson).coverImg"></image>
									</view> -->

									<navigator hover-class="none" class="item"
										v-for="(itm, idx) in JSON.parse(item.goodsJson)" :key="idx">
										<view class="pro-img" v-if="idx < 3">
											<image :src="itm.coverImg"></image>
											<view class="price" v-if="idx < 2">¥{{itm.price}}</view>
											<view v-else class="more">+{{ JSON.parse(item.goodsJson).length - 2 }}
											</view>
										</view>
									</navigator>
								</view>
							</view>
						</view>
					</navigator>
				</view>
				<view class='loadingicon acea-row row-center-wrapper'>
					<text class='loading iconfont icon-jiazai' :hidden='pageloading==false'></text>{{loadTitle}}
				</view>
			</view>
		</view>
	</div>
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
		liveroomApi
	} from '@/api/public.js';
  import onShare from "../../../mixins/onShare";
	export default {
    mixins: [onShare],
		data() {
			return {
				topImage: '',
				broadcastList: [],
				loadTitle: '加载更多',
				scrollLeft: 0,
				interval: 0,
				status: 1,
				page: 1,
				limit: 5,
				loading: false,
				loadend: false,
				pageloading: false,
				endBg: 'linear-gradient(#666666, #999999)',
				notBg: 'rgb(26, 163, 246)',
				playBg: 'linear-gradient(#FF0000, #FF5400)',
			}
		},
		onLoad() {
			this.getBroadcastList();
		},
		methods: {
			getPartTime(val) {
				var timearr = val.replace(" ", ":").replace(/:/g, "-").split("-");
				var timestr = Number(timearr[1]) + "月" + timearr[2] + "日" + Number(timearr[3]) + ":" + timearr[4];
				return timestr;
			},
			getBroadcastList() {
				var that = this;
				var data = {
					page: that.page,
					limit: that.limit,
				};
				if (that.loadend) return;
				if (that.pageloading) return;
				this.pageloading = true
				liveroomApi(data).then(res => {
					var list = res.data.list;
					var loadend = list.length < that.limit;
					that.page++;
					that.broadcastList = that.broadcastList.concat(list),
						that.page = that.page;
					that.pageloading = false;
					that.loadend = loadend;
					that.loadTitle = loadend ? '我也是有底线的' : '加载更多';
				}).catch(err => {
					that.pageloading = false
					that.loadTitle = '我也是有底线的'
				});
			},
		},
		/**
		 * 页面上拉触底事件的处理函数
		 */
		onReachBottom: function() {
			this.getBroadcastList();
		}
	}
</script>

<style lang="scss">
	.main {
		padding: 0 20rpx;
		margin-top: 20rpx;

		.row-between-wrapper {
			margin-bottom: 20rpx;
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			justify-content: space-between;
			border-radius: 18rpx;

			.live-image {
				position: relative;
				width: 355rpx;
				height: 272rpx;
				border-radius: 18rpx 0 0 18rpx;

				.image {
					width: 100%;
					height: 100%;
					border-radius: 18rpx 0 0 18rpx;
				}
				.iconfont {
					font-size: 24rpx;
					margin-right: 6rpx;
				}
			}

			.live-wrapper {
				width: 50%;
				height: 272rpx;
				padding: 20rpx;
				background: #fff;
				border-radius: 0 18rpx 18rpx 0;
				position: relative;

				.live-title {
					font-size: 30rpx;
					color: #282828;
					font-weight: bold;
				}

				.live-store {
					font-size: 24rpx;
					color: #666666;
				}

				.pro-count {
					width: 330rpx;
					height: 100rpx;
					white-space: nowrap;
					position: absolute;
					bottom: 20rpx;
				}

				.item {
					width: 100rpx;
					height: 100rpx;
					margin-right: 15rpx;
					border-radius: 8rpx;
					position: relative;

					.pro-img {
						width: 100rpx;
						height: 100rpx;
					}

					image {
						width: 100rpx;
						height: 100rpx;
						max-width: 100%;
						border-radius: 8rpx;
					}

					.price {
						text-align: center;
						color: #FEFEFE;
						position: absolute;
						bottom: 4rpx;
						left: 0;
						width: 100%;
						font-size: 22rpx;
						background: rgba(0, 0, 0, .5);
						border-radius: 0 0 8rpx 8rpx;
					}

					.more {
						width: 100rpx;
						height: 100rpx;
						line-height: 100rpx;
						text-align: center;
						font-size: 28rpx;
						color: #FEFEFE;
						font-weight: bold;
						position: absolute;
						top: 0;
						left: 0;
						background-color: rgba(0, 0, 0, .2);
						border-radius: 8rpx;
					}
				}
			}
		}
	}

	.live-top {
		z-index: 20;
		position: absolute;
		left: 0;
		top: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #fff;
		min-width: 121rpx;
		max-width: 140rpx;
		height: 50rpx;
		font-size: 22rpx;

		&.playRadius {
			border-radius: 18rpx 0px 0 0px;
		}

		&.notPlayRadius {
			border-radius: 18rpx 0px 18rpx 0px;
		}

		image {
			width: 30rpx;
			height: 30rpx;
			margin-right: 10rpx;
			/* #ifdef H5 */
			display: block;
			/* #endif */
		}
	}

	.broadcast-time {
		z-index: 20;
		position: absolute;
		left: 120rpx;
		top: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #fff;
		width: 160rpx;
		height: 50rpx;
		background: rgba(0, 0, 0, .4);
		font-size: 22rpx;
		border-radius: 0 0 18rpx 0;
	}
</style>