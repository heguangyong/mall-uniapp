<template>
	<!-- 新人礼弹窗 -->
	<view class="coupon_modal" @touchmove.stop.prevent="moveStop" v-if="couponModal">
		<view class="mask"></view>
		<view class="_container"
			:style="{'background-image': `url(${urlDomain}crmebimage/presets/coupon_modal_bg.png)`}">
			<view class="_tit">新人专属大礼包</view>
			<view class="_look">优惠券将发放至个人账户，可在“我的优惠券”查看</view>
			<scroll-view :scroll-top="0" scroll-y="true" class="_box">
				<view class="_item acea-row row-middle" v-for="item in couponList" :key="item.id"
					:style="{'background-image': `url(${urlDomain}crmebimage/presets/coupon_item_bg.png)`}">
					<view class="_price_box">
						<view class="_price">¥{{item.money}}</view>
						<view class="_man">满{{item.minPrice}}可用</view>
					</view>
					<view class="flex-1 _desc">
						<view v-if="item.category === 3" class="_text line1">全平台通用</view>
						<view v-else class="_text line1">仅限指定{{item.category | couponTypeFilter}}可用</view>
						<view v-if="item.isFixedTime" class="_end line1">
							{{ $util.getTime(item.useStartTime) + ' ~ ' + $util.getTime(item.useEndTime) + '可用' }}
						</view>
						<view v-else class="_end line1">{{ '领取后' + item.day + '天内可用' }}</view>
					</view>
				</view>
			</scroll-view>
			<view class="_btn" @click="close()"
				:style="{'background-image': `url(${urlDomain}crmebimage/presets/coupon_modal_btn.png)`}"></view>
			<span class="guanbi iconfont icon-cha2" @click="close()"></span>
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
	export default {
		name: "couponDialog",
		props: {
			//图片域名地址
			urlDomain: {
				type: String,
				default: ""
			},
			//弹窗是否弹起
			couponModal: {
				type: Boolean,
				default: false
			}
		},
		computed: {
			//优惠券列表
			couponList() {
				let list = this.$Cache.get('newGift') ? JSON.parse(this.$Cache.get('newGift')) : [];
				return list;
			}
		},
		methods: {
			close() {
				this.$emit('on-close')
			},
			getTime(time){
				this.$util.getTime(time);
			}
		}
	}
</script>
<style lang="scss" scoped>
	.coupon_modal {
		._container {
			position: fixed;
			left: 50%;
			top: 50%;
			transform: translate(-50%, -50%);
			width: 630rpx;
			height: 844rpx;
			background-size: cover;
			z-index: 33;

			._tit {
				text-align: center;
				height: 42rpx;
				font-size: 42rpx;
				font-family: PingFang SC-Semibold, PingFang SC;
				font-weight: 600;
				color: #FFE9BE;
				line-height: 42rpx;
				text-shadow: 0px 2rpx 2rpx rgba(0, 0, 0, 0.2);
				margin-top: 226rpx;
			}

			._look {
				text-align: center;
				font-size: 22rpx;
				color: #fff;
				margin: 20rpx auto 28rpx;
			}

			._box {
				width: 540rpx;
				height: 370rpx;
				margin: auto;
			}

			._item {
				width: 100%;
				height: 140rpx;
				border-radius: 14rpx;
				background-size: cover;
				padding: 10rpx 0;

				._price_box {
					width: 200rpx;
					padding: 0 20rpx;
					text-align: center;
					border-right: 1px dashed #E6E6E6;

					._price {
						font-size: 34rpx;
						color: #E93323;
						font-weight: 600;
					}

					._man {
						font-size: 22rpx;
						color: #666;
						margin-top: 10rpx;
					}
				}

				._desc {
					padding: 0 30rpx;

					._text {
						width: 280rpx;
						font-size: 32rpx;
						color: #282828;
						font-weight: 600;
					}

					._end {
						width: 280rpx;
						margin-top: 20rpx;
						font-size: 22rpx;
						color: #999;
					}
				}

				~._item {
					margin-top: 20rpx;
				}
			}

			._btn {
				width: 320rpx;
				height: 76rpx;
				background-size: cover;
				margin: 26rpx auto 0;
			}

			.guanbi {
				font-size: 50rpx;
				color: #fff;
				font-weight: bold;
				position: absolute;
				bottom: -70rpx;
				left: 50%;
				transform: translateX(-50%);
			}
		}
	}
</style>