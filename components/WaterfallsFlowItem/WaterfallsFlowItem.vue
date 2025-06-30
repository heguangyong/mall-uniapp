<template>
	<view class='list acea-row row-between-wrapper' :data-theme="theme">
		<view class='item' hover-class='none' @click="goDetail(item)">
			<view class='pictrue'>
				<view v-show="item.stock===0" class="sellOut">已售罄</view>
				<easy-loadimage :image-src="item.image"></easy-loadimage>
				<view v-if="item.activityStyle" :style="{ backgroundImage: `url(${item.activityStyle})` }"
					class="border-picture"></view>
			</view>
			<view class='texts'>
				<view class='names box-line2'>
					<text v-if="item.productTags && item.productTags.locationLeftTitle.length"
						class="font-bg-red mr10 bg-color merType">{{item.productTags.locationLeftTitle[0].tagName}}</text>
					{{item.name}}
				</view>
				<view class='money mt-10'>
					<svip-price :svipIconStyle="svipIconStyle" :productPrice="item"
						:svipPriceStyle="svipPriceStyle"></svip-price>
					<view v-if="item.productTags && item.productTags.locationUnderTitle.length">
						<text
							v-for="items in item.productTags.locationUnderTitle.length>3?item.productTags.locationUnderTitle.slice(0,3):item.productTags.locationUnderTitle"
							:key="items.id" class="mr10 tagSolid">{{items.tagName}}</text>
					</view>
					<view class="sold mt-8">已售 {{ item.sales }} {{item.unitName}}
					</view>
				</view>
				<view class="company mt-4" v-if="item.merName" @click.stop="goStore(item.merId)">
					<text class='name line1'>{{item.merName}}</text>
					<view class="flex">
						进店
						<text class="iconfont icon-xiangyou"></text>
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
		goProductDetail
	} from '@/libs/order.js'
	import easyLoadimage from '@/components/base/easy-loadimage.vue';
	import svipPrice from '@/components/svipPrice.vue';
	let app = getApp();
	export default {
		components: {
			easyLoadimage,
			svipPrice
		},
		props: {
			item: {
				type: Object,
				require: true
			},
			type: {
				type: Number,
				default: 0
			},
			isStore: {
				type: [String, Number],
				default: '1'
			},
			isLogin: {
				type: Boolean,
				require: false
			}
		},
		data() {
			return {
				theme: app.globalData.theme,
				//普通价格
				svipPriceStyle: {
					svipBox: {
						height: '26rpx',
						borderRadius: '60rpx 56rpx 56rpx 20rpx',
					},
					icon: {
						height: '26rpx',
						fontSize: '18rpx',
						borderRadius: '12rpx 0 12rpx 2rpx'
					},
					price: {
						fontSize: '38rpx'
					},
					svipPrice: {
						fontSize: '22rpx'
					}
				},
				//svip价格
				svipIconStyle: {
					svipBox: {
						height: '26rpx',
						borderRadius: '24rpx 40rpx 40rpx 0.4rpx',
					},
					price: {
						fontSize: '38rpx'
					},
					svipPrice: {
						fontSize: '18rpx'
					}
				}
			}
		},
		methods: {
			// 去详情页
			goDetail(item) {
				goProductDetail(item.id, 0, '');
			},
			goStore(id) {
				uni.navigateTo({
					url: `/pages/merchant/home/index?merId=${id}`
				})
			},
			authOpen() {
				this.$emit('authOpen');
			},
			followToggle(item) {
				this.$emit('followToggle', item);
			}
		}
	}
</script>
<style lang="scss" scoped>
	.tagSolid {
		margin-bottom: 4rpx;
	}

	.merType {
		@include main_bg_color(theme);
	}

	.list {
		.item {
			width: 100%;

			.pictrue {

				::v-deepimage,
				::v-deep.easy-loadimage,
				uni-image {
					width: 100%;
					height: 100%;
					border-radius: 20rpx 20rpx 0 0;
					overflow: hidden;
				}
			}

		}

		.texts {
			padding: 16rpx;
			font-size: 30rpx;
			color: #222;
			background-color: #fff;
			border-radius: 0 0 16rpx 16rpx;

			.names {
				font-size: 28rpx;
				font-weight: 400;
				color: #333333;
			}

			.money {
				.num {
					font-size: 38rpx;
					font-weight: 900;
					@include price_color(theme);
				}

				.y-money {
					font-size: 26rpx;
					color: #888888;
					text-decoration: line-through;
					margin-left: 14rpx;
				}
			}
		}
	}

	.company {
		display: flex;
		align-items: center;
		font-size: 26rpx;

		.name {
			width: 210rpx;
			display: inline-block;
			color: #666 !important;
			height: auto !important;
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
			margin-bottom: 0 !important;
			margin-right: 10rpx;
		}

		.flex {
			display: flex;
			align-items: center;
			color: #282828 !important;

			.iconfont {
				font-size: 16rpx;
				margin-top: 4rpx;
			}
		}
	}

	.sold {
		font-size: 22rpx;
		color: #666;
		margin-bottom: 4rpx;
	}

	.m-l-8 {
		margin-left: 8rpx;
	}

	.list .item .pictrue,
	.easy-loadimage,
	image,
	uni-image {
		position: relative;
		width: 100%;
		height: 330rpx;
		border-radius: 16rpx 16rpx 0 0;
		overflow: hidden;

		::v-deep.easy-loadimage,
		uni-image,
		image {
			height: 330rpx;
			border-radius: 16rpx 16rpx 0 0;
		}

		margin: 0 !important;
	}
	.box-line2 {
		overflow: hidden;
		height: 80rpx;
    line-height: 40rpx;
	}
</style>