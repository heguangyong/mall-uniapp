<template>
	<view :data-theme="theme">
		<view class="container">
			<!-- <view class="header">
				<text class="title">TA提到的宝贝</text>
				<image @click="closePopup" class="closeBnt" :src="urlDomain +'crmebimage/presets/close.png'" mode=""></image>
            </view> -->
			<view class="main_count flex" :class="isHome ? 'mb90' : ''">
				<view v-for="(item, index) in list" :key="index" @click="goDetail(item)" class="list">
					<view class="pro_list">
						<view class="picture">
							<image :src="item.productImage" class="image"></image>
						</view>
						<view class="info">
							<view class="name line1 text--w111-333 text-28rpx">{{item.productName}}</view>
							<text v-if="item.isPay == 1" class="isPay">作者买过</text>
							<view class="bottom">
								<view v-if="item.price" class="price"><text class="sm">￥</text><text
										class="text">{{item.price}}</text></view>
								<text class="buy-btn">立即购买</text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>

</template>

<script>
	import Cache from '@/utils/cache'
	import {
		goProductDetail
	} from '@/libs/order.js'
	import {
		mapGetters
	} from "vuex";
	let app = getApp();
	export default {
		computed: {},
		props: {
			list: {
				type: Array,
				default: function() {
					return []; 
				}
			},
			uid: {
				type: Number,
			},
			isHome: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				urlDomain: Cache.get("imgHost"),
				theme: app.globalData.theme,
				popup: {
					show: false
				},

			};
		},
		methods: {
			// 点击关闭按钮
			closePopup() {
				this.$emit('close');
			},
			// 去详情页
			goDetail(item) {
				goProductDetail(item.productId, 0, '');
			}
		}
	}
</script>

<style lang="scss" scoped>
	.isPay {
		padding: 3rpx 5rpx;
		@include main_color(theme);
		@include coupons_border_color(theme);
		font-size: 20rpx;
		border-radius: 3px 3px 3px 3px;
		margin-top: 12rpx;
		display: inline-block;
	}

	.container {
		background-color: #ffffff;
		border-radius: 16rpx 16rpx 0 0;
		padding-bottom: constant(safe-area-inset-bottom); ///兼容 IOS<11.2/
		padding-bottom: env(safe-area-inset-bottom); ///兼容 IOS>11.2/

		.header {
			position: relative;
			padding: 45rpx 24rpx;

			.title {
				color: #282828;
				font-size: 30rpx;
			}

			.closeBnt {
				position: absolute;
				right: 30rpx;
				top: 45rpx;
				width: 30rpx;
				height: 30rpx;
				font-size: 28rpx;
			}
		}

		.scroll-view {
			//max-height: 1100rpx;
		}

		.main_count {
			padding: 0 24rpx 0 0;
			//max-height: 1100rpx;
			overflow-y: scroll;

			.list {
				width: 578rpx;
				height: 192rpx;
				background: #FAFAFA;
				border-radius: 16rpx 16rpx 16rpx 16rpx;
				padding: 20rpx;
				flex-direction: row;
				margin-right: 30rpx;

				&:last-child {
					margin-bottom: 0;
				}
			}

			.pro_list {
				display: flex;
				flex-direction: row;

				.picture,
				.image {
					width: 150rpx;
					height: 150rpx;
					border-radius: 16rpx;
				}

				.info {
					margin-left: 16rpx;
					position: relative;

					.name {
						width: 390rpx;
						lines: 1;
						text-overflow: ellipsis;
					}

					.bottom {
						display: flex;
						justify-content: space-between;
						align-items: center;
						width: 370rpx;
						position: absolute;
						left: 0;
						bottom: 0;
						flex-direction: row;
					}

					.price {
						flex-direction: row;
						align-items: flex-end;

						.sm {
							font-weight: bold;
							color: #E93323;
							font-size: 26rpx;
						}

						.text {
							font-weight: bold;
							color: #E93323;
							font-size: 34rpx;
						}
					}

					.buy-btn {
						border-radius: 26rpx;
						padding: 10rpx 20rpx;
						text-align: center;
						align-items: center;
						justify-content: center;
						font-size: 24rpx;
						color: #fff;
						background: #E93323;
					}
				}
			}
		}
	}
</style>