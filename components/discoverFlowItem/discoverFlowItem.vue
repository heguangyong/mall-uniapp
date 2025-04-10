<template>
	<view :data-theme="theme">
		<view @click="goDetail(items)" class="wf-page2">
			<view class='pictrue skeleton-rect'>
				<easy-loadimage mode="widthFix" :image-src="items.cover" :radius="8"></easy-loadimage>
				<view class="discover_video_icon" v-if="items.type == 2">
					<text class="iconfont icon-24gf-play"></text>
				</view>
				<!-- 审核状态:0-待审核，1-审核通过，2-审核失败，3-平台关闭 -->
				<view class="approval_status" v-if="items.auditStatus != 1 && uid == items.authorId">
					<view v-if="items.auditStatus == 2" class="approval_title">审核未通过</view>
					<view v-if="items.auditStatus == 3" class="approval_title">平台关闭</view>
					<view v-if="items.auditStatus == 0" class="approval_title">正在审核</view>
					<text v-if="items.auditStatus == 2 || items.auditStatus == 3" class="approval_info">查看未通过原因</text>
					<text v-if="items.auditStatus == 0" class="approval_info">通过后将展示在列表</text>
				</view>
			</view>
			<view class='text'>
				<view v-if="items.title" class='name skeleton-rect mt-24'>
					<text class="text_name line2">
						{{items.title}}
					</text>
				</view>
				<view class="count acea-row skeleton-rect">
					<view class="author acea-row">
						<image class="image"
							:src="items.authorAvatar ? items.authorAvatar : urlDomain+'crmebimage/presets/morenT.png'"
							mode="widthFix"></image>
						<text class="author_name line1"> {{items.authorName}}</text>
					</view>
					<view class="like" @click.stop="likeToggle(items)">

						<view class="like_count">
							<text class="iconfont" :class="items.userIsLike ? 'icon-shoucang1' : 'icon-dianzan'"></text>
							<text
								class="collect">{{items.likeNum ? items.likeNum < 10000 ? items.likeNum : (items.likeNum / 10000).toFixed(2) + 'w' : '' }}</text>
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
		toLogin
	} from '@/libs/login.js';
	import {
		discoverNoteLike
	} from '@/libs/follow.js';
	import easyLoadimage from '@/components/base/easy-loadimage.vue'
	import {
		mapGetters
	} from "vuex";
	let app = getApp();
	export default {
		components: {
			easyLoadimage
		},
		computed: {
			...mapGetters(['uid', 'isLogin'])
		},
		props: {
			// 区分从发现列表、我的主页作品进去，点进去内容列表，home从我的主页点进去
			fromTo: {
				type: String,
				default: ''
			},
			items: {
				type: Object,
				default: {}
			},
			type: {
				type: Number,
				default: 0
			},
			tab: {
				type: Number,
				default: 1
			}
		},
		data() {
			return {
				urlDomain: this.$Cache.get("imgHost"),
				theme: app.globalData.theme
			};
		},
		// 滚动监听
		onPageScroll(e) {
			// 传入scrollTop值并触发所有easy-loadimage组件下的滚动监听事件
			uni.$emit('scroll');
		},
		methods: {
			//点赞
			likeToggle(item) {
				this.$emit('changeLikeToggle',item)
			},
			goDetail(item) {
				if (item.type == 1) {
					uni.navigateTo({
						url: `/pages/discover/discover_details/index?noteId=${item.id}`
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
	.pictrue {
		max-height: 580rpx;
		overflow-y: hidden;
		border-radius: 16rpx;
		position: relative;

		.plant-show {
			width: 42rpx;
			height: 42rpx;
			border-radius: 100%;
			background: rgba(0, 0, 0, .5);
			display: flex;
			align-items: center;
			justify-content: center;
			position: absolute;
			top: 10rpx;
			left: 10rpx;

			.iconfont {
				font-size: 20rpx;
				color: #fff;

			}
		}
	}

	.loadfail-img {
		width: 100%;
		height: 345rpx;
	}

	.text {
		padding-bottom: 6rpx;
		width: 345rpx;

		.name {
			padding: 0 20rpx;
			color: #333333;
			font-size: 28rpx;
			font-weight: bold;
		}

		.count {
			padding: 0 20rpx;
			margin-top: 20rpx;
			justify-content: space-between;

			.author {
				align-items: center;
			}

			.author_name {
				margin-left: 10rpx;
				max-width: 120rpx;
				font-size: 24rpx;
				color: #333333;
				max-width: 180rpx;
			}

			.author_time {
				color: #666666;
			}

			.like {
				font-size: 24rpx;
				color: #999999;
				display: flex;

				.like_count {
					display: flex;
					align-items: center;
				}

				.iconfont {
					font-size: 30rpx;
				}

				.icon-shoucang1 {
					@include main_color(theme);
				}

				.collect {
					font-size: 24rpx;
					margin-left: 5rpx;
				}
			}
		}
	}

	.wf-page2 .author .image,
	.wf-page2 .author uni-image {
		width: 46rpx !important;
		height: 46rpx !important;
		border-radius: 100%;
	}

	.approval_status {
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, .4);
		position: absolute;
		top: 0;
		left: 0;
		border-radius: 16rpx;
		color: #fff;
		text-align: center;
		z-index: 5;

		.approval_title {
			font-size: 28rpx;
			margin-top: 135rpx;
			font-weight: bold;
		}

		.approval_info {
			font-size: 24rpx;
			margin-top: 24rpx;
		}
	}
</style>