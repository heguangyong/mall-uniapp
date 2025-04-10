<template>
	<!-- 种草逛逛 -->
	<view :data-theme="theme">
		<view class="discover indexList" :style="[boxStyle]">
			<view class="bg_box" :style="[boxBgStyle]"></view>
			<view class='title acea-row row-between-wrapper'>
				<view class='text line1 tui-skeleton-rect acea-row'>
					<image :src="logoUrl"></image>
					<text class='label' :style="[titleColor]">{{titleText}}</text>
				</view>
				<view class='more tui-skeleton-rect' :style="[moreColor]" @click="goPage(dataConfig.linkConfig.val)">
          更多
					<text class="iconfont icon-jiantou"></text>
				</view>
			</view>
			<view class='tips mb20'>Good brand store</view>
			<view class="conter" v-if="listStyle == 0">
				<scroll-view scroll-x="true" style="white-space: nowrap; vertical-align: middle;"
					show-scrollbar="false">
					<view class="itemCon" :style="[contentConfig]" v-for="item in discoverList" :key="item.id"
						@click="goDetail(item)">
						<view class="item">
							<view class="pictrue skeleton-rect">
								<easy-loadimage :image-src="item.cover"
									:radius="dataConfig.contentStyle.val"></easy-loadimage>
								<view class="author acea-row row-middle">
									<image v-show="avatarShow" :src="item.authorAvatar" mode="aspectFill"></image>
									<text v-show="nicknameShow" :style="[nameColor]"
										class="nickname line1">{{item.authorName}}</text>
								</view>
								<view v-show="titleShow" :style="[laberColor]" class="item_tit line1">{{item.title}}
								</view>
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
			<view class="conter_y" :style="[contentConfig]" v-if="listStyle == 1">
				<view class="item" v-for="item in discoverList" :key="item.id"
					@click="goDetail(item)">
					<view class="pictrue skeleton-rect">
						<easy-loadimage :image-src="item.cover" :radius="dataConfig.contentStyle.val"></easy-loadimage>
					</view>
					<view v-show="titleShow" :style="[laberColor]" class="item_tit line1">{{item.title}}</view>
					<view class="author acea-row row-middle row-between">
						<view class="acea-row row-middle">
							<image v-show="avatarShow" :src="item.authorAvatar" mode="aspectFill"></image>
							<text v-show="nicknameShow" :style="[nameColor]" class="nickname">{{item.authorName}}</text>
						</view>
						<view class="item_count" @click.stop="likeToggle(item)">
							<text class="iconfont"
								:class="item.userIsLike ? 'icon-shoucang1' : 'icon-dianzan'"></text>
							<text>{{item.likeNum > 0 ? item.likeNum < 10000 ? item.likeNum : (item.likeNum / 10000).toFixed(2) : ''}}</text>
						</view>
					</view>
				</view>
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
		discoverListApi
	} from "@/api/discover";
	import {
		discoverNoteLike
	} from '@/libs/follow.js';
	import {
		toLogin
	} from '@/libs/login.js';
	import {
		Debounce
	} from '@/utils/validate.js'
	import easyLoadimage from '@/components/base/easy-loadimage.vue';
	let app = getApp();
	export default {
		name: 'homeDiscover',
		props: {
			dataConfig: {
				type: Object,
				default: () => {}
			},
			//是否登录
			isLogin: {
				type: Boolean,
				default: () => false
			}
		},
		data() {
			return {
				theme: app.globalData.theme,
				urlDomain: this.$Cache.get("imgHost"),
				discoverList: [],
			}
		},
		components: {
			easyLoadimage
		},
		computed: {
			//内容边距
			contentConfig() {
				if (this.listStyle === 0) {
					return {
						marginRight: this.dataConfig.contentConfig.val ? this.dataConfig.contentConfig.val +
							'px' : '0',
						borderRadius: this.dataConfig.contentStyle.val + 'px'
					}
				} else {
					return {
						gridGap: this.dataConfig.contentConfig.val ? this.dataConfig.contentConfig.val + 'px' : '0',
						borderRadius: this.dataConfig.contentStyle.val + 'px'
					}
				}
			},
			//标题
			titleShow() {
				if (this.dataConfig.typeConfig.activeValue.indexOf(0) !== -1) {
					return true;
				} else {
					return false;
				}
			},
			//头像
			avatarShow() {
				if (this.dataConfig.typeConfig.activeValue.indexOf(1) !== -1) {
					return true;
				} else {
					return false;
				}
			},
			//昵称
			nicknameShow() {
				if (this.dataConfig.typeConfig.activeValue.indexOf(2) !== -1) {
					return true;
				} else {
					return false;
				}
			},
			//更多颜色
			moreColor() {
				return {
					'color': this.dataConfig.moreColor.color[0].item
				}
			},
			//标题图片
			boxBgStyle() {
				return {
					borderRadius: this.dataConfig.bgStyle.val * 2 + 'rpx' + ' ' + this.dataConfig.bgStyle.val * 2 + 'rpx' +
						' ' + 0 + ' ' + 0,
					backgroundImage: `url(${this.urlDomain}crmebimage/presets/discover_bg_pic.png),linear-gradient(${this.dataConfig.bgColor.color[0].item}, ${this.dataConfig.bgColor.color[1].item})`
				}
			},
			//最外层盒子的样式
			boxStyle() {
				return {
					borderRadius: this.dataConfig.bgStyle.val * 2 + 'rpx',
					margin: this.dataConfig.mbConfig.val * 2 + 'rpx' + ' ' + this.dataConfig.lrConfig.val * 2 + 'rpx' +
						' ' + 0,
					padding: this.dataConfig.upConfig.val * 2 + 'rpx' + ' ' + '24rpx' + ' ' + this.dataConfig.downConfig
						.val * 2 + 'rpx'
				}
			},
			limit() {
				return this.dataConfig.numConfig.val
			},
			listStyle() {
				return this.dataConfig.tabConfig.tabVal
			},
			logoUrl() {
				return this.dataConfig.logoConfig.url
			},
			titleText() {
				return this.dataConfig.titleConfig.val
			},
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
			//作者昵称
			nameColor() {
				return {
					color: this.dataConfig.nameColor.color[0].item
				};
			},
			//文章标题颜色
			laberColor() {
				return {
					color: this.dataConfig.laberColor.color[0].item
				};
			},
		},
		created() {
			this.getList();
		},
		methods: {
			//点赞
			likeToggle: Debounce(function(item) {
				if (this.isLogin) {
					discoverNoteLike(item.id).then(() => {
						this.$set(item, 'userIsLike', !item.userIsLike);
						if (!item.userIsLike) {
							item.likeNum--;
							item.likeNum = item.likeNum == 0 ? 0 : item.likeNum
						} else {
							item.likeNum++;
						}
					});
				} else {
					toLogin();
				}
			}),
			//链接跳转
			goPage(url) {
				this.$util.navigateTo(url)
			},
			//种草列表
			getList() {
				discoverListApi({
					page: 1,
					limit: this.limit
				}).then(res => {
					this.discoverList = res.data.list;
				}).catch(err => {})
			},
			//详情跳转
			goDetail(item) {
				if (item.type == 1) {
					uni.navigateTo({
						url: `/pages/discover/discover_recommend/index?noteId=${item.id}`
					});
				} else {
					uni.navigateTo({
						//#ifdef APP
						url: `/pages/discover/discover_video/appVideo/index?noteId=${item.id}&fromTo=${this.fromTo}&sd=${this.uid}`
						//#endif
						//#ifndef APP
						url: `/pages/discover/discover_video/routineVideo/index?noteId=${item.id}&fromTo=${this.fromTo}&sd=${this.uid}`
						//#endif

					});
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.item_count {
		font-size: 24rpx;
		display: flex;
		align-items: center;
	
		&:last-child {
			margin-left: 40rpx;
		}
	
		.iconfont {
			font-size: 26rpx;
			margin-right: 5rpx;
		}
	
		.icon-shoucang1 {
			@include main_color(theme);
		}
	}
	.discover {
		width: auto;
		background: #fff;
		border-radius: 14rpx;
		box-sizing: border-box;
		position: relative;

		.tips {
			position: relative;
		}

		.more {
			z-index: 9;
		}

		.title .text image {
			z-index: 9;
		}

		.bg_box {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 174rpx;
			background-repeat: no-repeat;
			background-size: cover;
			border-radius: 14rpx 14rpx 0 0;
		}

		.conter {
			border-radius: 12px;
			margin-top: 30rpx;

			.itemCon {
				display: inline-block;
				width: 280rpx;
				margin-right: 20rpx;

				.item {
					width: 100%;

					.pictrue {
						width: 100%;
						height: 280rpx;
						border-radius: 10rpx;
						overflow: hidden;
						position: relative;
						color: #fff;

						image {
							width: 100%;
							height: 100%;
							border-radius: 16rpx;
						}
					}

					.author {
						position: absolute;
						bottom: 50rpx;
						left: 16rpx;

						image {
							width: 34rpx;
							height: 34rpx;
							border-radius: 50%;
						}

						.nickname {
							width: 200rpx;
							font-size: 20rpx;
							padding-left: 8rpx;
						}
					}

					.item_tit {
						position: absolute;
						bottom: 16rpx;
						left: 16rpx;
						width: 236rpx;
						font-size: 24rpx;
						font-weight: 500;
					}
				}
			}
		}
	}

	.conter_y {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		grid-template-rows: auto;
		grid-gap: 20rpx;
		width: 100%;
		margin-top: 30rpx;

		.item {
			width: 100%;

			.pictrue {
				//width: 316rpx;
				height: 316rpx;

				image {
					width: 100%;
					height: 100%;
					border-radius: 14rpx;
				}
			}

			.author {
				width: 316rpx;
				color: #333;

				image {
					width: 44rpx;
					height: 44rpx;
					border-radius: 50%;
				}

				.nickname {
					font-size: 24rpx;
					padding-left: 8rpx;
				}
			}

			.item_tit {
				color: #333;
				width: 316rpx;
				margin: 28rpx 0 16rpx;
				font-size: 28rpx;
				font-weight: 500;
			}
		}
	}
</style>