<template>
	<!-- 小程序直播 -->
	<!-- #ifdef MP -->
	<!-- liveStatus直播间状态。101：直播中，102：未开始，103已结束，104禁播，105：暂停，106：异常，107：已过期 -->
	<view v-if="liveList.length > 0">
		<view class="wrapper-count indexList" :style="[boxStyle]">
			<view class='title acea-row row-between-wrapper'>
				<view class='text line1 tui-skeleton-rect acea-row'>
					<image :src="logoUrl"></image>
					<text class='label' :style="[titleColor]">{{titleText}}</text>
				</view>
				<navigator v-if="!merId" :url="moreLink" class="more-btn" hover-class="none">
					<view class='more tui-skeleton-rect' :style="[moreColor]">
            更多
						<text class="iconfont icon-jiantou"></text>
					</view>
				</navigator>
			</view>
			<view class='tips mb20'>First new product</view>
			<!-- 直播 -->
			<block v-if="listStyle == 0">
				<view class="live-wrapper mores">
					<scroll-view scroll-x="true" style="white-space: nowrap; display: flex">
						<view class="item" v-for="(item, index) in liveList" :key="index"
							:style="[{'margin-right':dataConfig.contentConfig.val + 'px'},imgStyle]">
							<navigator hover-class="none"
								:url="'plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=' + item.roomId">
								<view class="live-top"
									:style="'background:' + (item.liveStatus == 101 ? playBg : item.liveStatus != 101 && item.liveStatus != 102 ? endBg : notBg) + ';'"
									:class="item.liveStatus == 102 ? 'playRadius' : 'notPlayRadius'">
									<view v-if="item.liveReplay">
										<text class="iconfont icon-zhibo-huifang"></text>
										<text>回放</text>
									</view>
									<view v-else-if="item.liveStatus == 101">
										<text class="iconfont icon-zhibo-zhibozhong"></text>
										<text>直播中</text>
									</view>
									<view v-else-if="item.liveStatus == 103 ">
										<text class="iconfont icon-zhibo-yugao"></text>
										<text>已结束</text>
									</view>
									<view v-else-if="item.liveStatus == 102">
										<text class="iconfont icon-zhibo-yugao"></text>
										<text>预告</text>
									</view>
								</view>
								<view v-if="item.liveStatus == 101 || item.liveStatus == 102" class="broadcast-time">
									{{ igetPartTime(item.startTime) }}
								</view>
								<image :src="item.feedsImgWx" mode="aspectFill"></image>
							</navigator>
						</view>
					</scroll-view>
				</view>
			</block>
			<block v-if="listStyle == 1">
				<view class="live-wrapper-a" :style="[gridGap]">
					<navigator class="live-item-a" v-for="(item,index) in liveList" :key="index"
					 :style="[contentStyle]"
						:url="'plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=' + item.roomId">
						<view class="img-box">
							<view class="label bggary" v-if="item.liveReplay">
								<text class="iconfont icon-zhibo-huifang"></text>
								<text>回放</text>
							</view>
							<view class="label bgred" v-else-if="item.liveStatus==101">
								<text class="iconfont icon-zhibo-zhibozhong"></text>
								<text>直播中</text>
							</view>
							<view class="label bggary" v-else-if="item.liveStatus == 103 ">
								<text class="iconfont icon-zhibo-yugao"></text>
								<text>已结束</text>
							</view>
							<view class="label bgblue" v-else-if="item.liveStatus == 102">
								<view class="txt">预告</view>
								<view class="msg">{{ igetPartTime(item.startTime) }}</view>
							</view>
							<image :src="item.feedsImgWx" mode="aspectFill" :style="[imgStyle]"></image>
						</view>
						<view class="info">
							<view class="title line2">{{item.roomName}}</view>
							<view class="people">
								<text>{{item.anchorName}}</text>
							</view>
							<view class="goods-wrapper">
								<block v-if="item.broadcast && item.broadcast.length <=3 && item.broadcast.length > 0">
									<view class="goods-item" v-for="(goods,index) in item.broadcast" :key="index">
										<image :src="goods.coverImg" alt="">
											<text class="line1">￥{{goods.price}}</text>
									</view>
								</block>
								<block v-if="item.broadcast && item.broadcast.length>3">
									<view class="goods-item" v-for="(goods,index) in item.broadcast" :key="index"
										v-if="index<2">
										<image :src="goods.coverImg" alt="">
											<text class="line1">￥{{goods.price}}</text>
									</view>
									<view class="goods-item">
										<image :src="item.broadcast[item.broadcast.length-1].goods.coverImg" alt="">
											<view class="num">+{{item.broadcast.length}}</view>
									</view>
								</block>
								<block v-if="!item.broadcast || item.broadcast.length == 0">
									<view class="empty-goods">暂无商品</view>
								</block>
							</view>
						</view>
					</navigator>
				</view>
			</block>
			<block v-if="listStyle == 2">
				<view class="live-wrapper-b" :style="[gridGap]">
					<navigator class="live-item-b" v-for="(item,index) in liveList" :key="index"
						:url="'plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=' + item.roomId"
						hover-class="none" :style="[contentStyle]">
						<view class="img-box">
							<view class="label bggary" v-if="item.liveReplay">
								<text class="iconfont icon-zhibo-huifang"></text>
								<text>回放</text>
							</view>
							<view class="label bgred" v-else-if="item.liveStatus==101">
								<text class="iconfont icon-zhibo-zhibozhong"></text>
								<text>直播中</text>
							</view>
							<view class="label bggary" v-else-if="item.liveStatus == 103 ">
								<text class="iconfont icon-zhibo-yugao"></text>
								<text>已结束</text>
							</view>
							<view class="label bgblue" v-else-if="item.liveStatus == 102">
								<view class="txt">预告</view>
								<view class="msg">{{ igetPartTime(item.startTime) }}</view>
							</view>
							<image :src="item.feedsImgWx"></image>
						</view>
						<view class="info">
							<view class="title line2">{{item.roomName}}</view>
							<view class="people">
								<text>{{item.anchorName}}</text>
							</view>
						</view>
					</navigator>
				</view>
			</block>
		</view>
	</view>
	<!-- #endif -->
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
	import easyLoadimage from '@/components/base/easy-loadimage.vue';
	export default {
		name: 'liveBroadcast',
		components: {
			easyLoadimage
		},
		props: {
			dataConfig: {
				type: Object,
				default: () => {}
			},
			//商户id
			merId: {
				type: String || Number,
				default: ''
			}
		},
		data() {
			return {
				urlDomain: this.$Cache.get("imgHost"),
				liveList: [],
				bg: '#fff',
				endBg: 'linear-gradient(#666666, #999999)',
				notBg: 'rgb(26, 163, 246)',
				playBg: 'linear-gradient(#FF0000, #FF5400)',
			};
		},
		computed: {
			//内容圆角
			contentStyle() {
				return {
					'border-radius': this.dataConfig.contentStyle.val ? this.dataConfig.contentStyle.val + 'px' : '0'
				};
			},
			//样式种类
			listStyle() {
				return this.dataConfig.tabConfig.tabVal
			},
			//最外层盒子的样式
			boxStyle() {
				return {
					borderRadius: this.dataConfig.bgStyle.val * 2 + 'rpx',
					background: `linear-gradient(${this.dataConfig.bgColor.color[0].item}, ${this.dataConfig.bgColor.color[1].item})`,
					margin: this.dataConfig.mbConfig.val * 2 + 'rpx' + ' ' + this.dataConfig.lrConfig.val * 2 + 'rpx' +
						' ' + 0,
					padding: this.dataConfig.upConfig.val * 2 + 'rpx' + ' ' + '10px' + ' ' + this.dataConfig.downConfig
						.val * 2 + 'rpx'
				}
			},
			//内容间距
			gridGap() {
				return {
					'grid-gap': this.dataConfig.contentConfig.val * 2 + 'rpx'
				}
			},
			//文章图片的圆角和高度
			imgStyle() {
				return {
					'border-radius': this.dataConfig.contentStyle.val * 2 + 'rpx',
				}
			},
			//标题图片
			logoUrl() {
				return this.dataConfig.logoConfig.url
			},
			//标题
			titleText() {
				return this.dataConfig.titleConfig.val
			},
			//标题颜色
			titleColor() {
				return {
					color: this.dataConfig.titleColor.color[0].item
				}
			},
			//更多颜色
			moreColor() {
				return {
					color: this.dataConfig.moreColor.color[0].item
				}
			},
			//更多链接地址
			moreLink() {
				return this.dataConfig.linkConfig.val
			}
		},
		mounted() {
			this.getLiveList();
		},
		methods: {
			getPartTime(val) {
				var timearr = val.replace(" ", ":").replace(/:/g, "-").split("-");
				var timestr = Number(timearr[1]) + "月" + timearr[2] + "日" + Number(timearr[3]) + ":" + timearr[4];
				return timestr;
			},
			// 直播
			getLiveList() {
				let that = this;
				liveroomApi({
					page: 1,
					limit: 6
				}).then(res => {
					res.data.list.map(item => {
						this.$set(item, 'broadcast', JSON.parse(item.goodsJson));
					})
					that.liveList = res.data.list;
				}).catch(e => {});
			},
		}
	};
</script>

<style lang="scss" scoped>
	@import '@/static/css/diyMain.scss';

	.wrapper-count {
		padding: 24rpx 20rpx 0;
	}

	.live-wrapper {
		position: relative;
		width: 100%;
		overflow: hidden;
		border-radius: 16rpx;

		image {
			width: 100%;
			height: 400rpx;
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
			width: 180rpx;
			height: 54rpx;
			border-radius: 16rpx 0px 16rpx 0px;

			&.playRadius {
				border-radius: 16rpx 0 0 0;
			}

			&.notPlayRadius {
				border-radius: 16rpx 0px 16rpx 0px;
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

		.live-title {
			position: absolute;
			left: 0;
			bottom: 6rpx;
			width: 100%;
			height: 70rpx;
			line-height: 70rpx;
			text-align: center;
			font-size: 30rpx;
			color: #fff;
			background: rgba(0, 0, 0, 0.35);
		}

		&.mores {
			width: 100%;

			.item {
				position: relative;
				width: 280rpx;
				display: inline-block;
				border-radius: 16rpx;
				overflow: hidden;

				image {
					width: 280rpx;
					height: 224rpx;
					border-radius: 16rpx;
				}

				.live-title {
					height: 40rpx;
					line-height: 40rpx;
					text-align: center;
					font-size: 22rpx;
				}

				.live-top {
					width: 100rpx;
					height: 36rpx;
					font-size: 22rpx;

					image {
						width: 20rpx;
						height: 20rpx;
					}
				}
			}
		}
	}

	.live-wrapper-a {
		display: grid;
		grid-template-rows: auto;
		grid-template-columns: repeat(1, 1fr);

		.live-item-a {
			display: flex;
			background: #fff;
			overflow: hidden;

			.img-box {
				position: relative;
				width: 340rpx;
				height: 270rpx;

				image {
					width: 100%;
					height: 100%;
				}
			}

			.info {
				flex: 1;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				padding: 15rpx 20rpx;

				.title {
					font-size: 30rpx;
					color: #333;
				}

				.people {
					display: flex;
					align-items: center;
					color: #999;
					font-size: 24rpx;
					margin-top: 10rpx;
				}

				.goods-wrapper {
					display: flex;

					.goods-item {
						position: relative;
						width: 96rpx;
						height: 96rpx;
						margin-right: 20rpx;
						overflow: hidden;
						border-radius: 16rpx;

						&:last-child {
							margin-right: 0;
						}

						image {
							width: 100%;
							height: 100%;
							border-radius: 16rpx;
						}

						.bg {
							position: absolute;
							left: 0;
							top: 0;
							width: 100%;
							height: 100%;
							border-radius: 16rpx;
							background: rgba(0, 0, 0, 0.3);
						}

						text {
							font-size: 24rpx;
							position: absolute;
							left: 0;
							bottom: 0;
							width: 100%;
							height: 60rpx;
							line-height: 70rpx;
							color: #fff;
							background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.75) 100%);
						}

						.num {
							display: flex;
							align-items: center;
							justify-content: center;
							position: absolute;
							left: 0;
							top: 0;
							width: 100%;
							height: 100%;
							background: rgba(0, 0, 0, 0.3);
							color: #fff;
							font-size: 28rpx;
						}
					}
				}

				.empty-goods {
					width: 96rpx;
					height: 96rpx;
					border-radius: 6rpx;
					background-color: #B2B2B2;
					color: #fff;
					font-size: 20rpx;
					text-align: center;
					line-height: 96rpx;
				}
			}
		}

		&.live-wrapper-c {
			.live-item-a {
				display: flex;
				flex-direction: column;

				.img-box {
					width: 100%;
					border-radius: 8px 8px 0 0;
				}

				.info {
					display: flex;
					justify-content: space-between;
					align-items: center;
					flex-direction: initial;

					.left {
						width: 69%;
					}

					.goods-wrapper {
						flex: 1;
					}
				}
			}
		}
	}

	.live-wrapper-b {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		grid-template-rows: auto;

		.live-item-b {
			background-color: #fff;
			overflow: hidden;
			margin-bottom: 20rpx;
			overflow: hidden;

			.img-box {
				position: relative;

				image {
					width: 100%;
					height: 274rpx;
				}
			}

			.info {
				display: flex;
				flex-direction: column;
				padding: 20rpx;

				.title {
					font-size: 30rpx;
					color: #333;
				}

				.people {
					display: flex;
					margin-top: 10rpx;
					color: #999;
					font-size: 24rpx;
				}
			}
		}
	}

	.label {
		display: flex;
		align-items: center;
		justify-content: center;
		position: absolute;
		left: 0;
		top: 0;
		border-radius: 16rpx 0px 16rpx 0;
		font-size: 24rpx;
		color: #fff;

		image {
			margin-right: 10rpx;
		}

		text {
			font-size: 22rpx;
		}
	}

	.bgred {
		width: 132rpx;
		height: 38rpx;
		background: linear-gradient(270deg, #F5742F 0%, #FF1717 100%)
	}

	.bggary {
		width: 108rpx;
		height: 38rpx;
		background: linear-gradient(270deg, #999999 0%, #666666 100%)
	}

	.bgblue {
		width: 220rpx;
		height: 38rpx;
		background: rgba(0, 0, 0, 0.36);
		overflow: hidden;

		.txt {
			position: relative;
			left: -6rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			width: 38px;
			height: 100%;
			text-align: center;
			background: linear-gradient(270deg, #2FA1F5 0%, #0076FF 100%);
		}
	}
</style>