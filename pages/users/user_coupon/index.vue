<template>
	<view :data-theme="theme">
		<view class="navbar acea-row row-around">
			<view class="item acea-row row-center-wrapper" :class="{ on: navOn === 'usable' }" @click="onNav('usable')">
				未使用</view>
			<view class="item acea-row row-center-wrapper" :class="{ on: navOn === 'unusable' }"
				@click="onNav('unusable')">已使用/失效</view>
		</view>
		<view class="coupon-box">
			<view class='coupon-list' v-if="couponsList.length">
				<navigator url="/pages/activity/couponList/index" class="more-btn" hover-class="none">
					<view class="pic_box">
						<image :src="urlDomain + 'crmebimage/presets/my_coupon.png'" mode=""></image>
					</view>
				</navigator>

				<view class='item acea-row row-center-wrapper' v-for='(item,index) in couponsList' :key="index"
					@click="goCouponsProList(item)">
					<view class='money'
						:class="item.validStr==='unusable'||item.validStr==='overdue' ? 'moneyGray' : 'main_bg'">
						<view class="logo">￥<text class='num'>{{item.money?Number(item.money):''}}</text></view>
						<view class="pic-num">满{{ Number(item.minPrice) }}元可用</view>
					</view>
					<view class='text'>
						<view class='condition acea-row'>
							<view class="line-title"
								:class="item.validStr==='unusable'||item.validStr==='overdue' ? 'bg-color-huic' : 'bg-color-check'">
								{{item.category | couponTypeFilter}}</view>

							<view class="line2">{{item.name}}</view>
						</view>
						<view class='data acea-row row-between-wrapper'>
							<view v-if="item.startTime && item.endTime && navOn === 'usable'">
								{{$util.getCouponTime(item.startTime,item.endTime)}}</view>
							<view v-if="navOn === 'unusable'">
								<span v-show="item.validStr==='overdue'">该优惠券已失效无法使用</span>
								<span v-show="item.validStr==='unusable'">该优惠券已使用</span>
							</view>
							<span class="iconfont"
								:class="{'icon-yilingqu1':item.validStr==='usable'||item.validStr==='notStart',
								'icon-yishiyong':item.validStr==='unusable',
								'icon-yishixiao':item.validStr==='overdue',
								'font-color':item.validStr==='usable'||item.validStr==='notStart'
								}
								"></span>
						</view>
					</view>
				</view>
			</view>
			<view v-if="couponsList.length" class='loadingicon acea-row row-center-wrapper'>
				<text class='loading iconfont icon-jiazai' :hidden='loading==false'></text>{{loadTitle}}
			</view>
		</view>
		<view class='noCommodity' v-if="!couponsList.length && !loading">
			<view class='pictrue'>
				<image :src="urlDomain + 'crmebimage/presets/noCoupon.png'"></image>
				<span class="coupon">暂无优惠券可使用哦~</span>
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
		getUserCoupons
	} from '@/api/api.js';
	import {
		toLogin
	} from '@/libs/login.js';
	import {
		mapGetters
	} from "vuex";
	let app = getApp();
	export default {
		data() {
			return {
				urlDomain: this.$Cache.get("imgHost"),
				couponsList: [],
				loading: false,
				loadend: false,
				loadTitle: '加载更多', //提示语
				page: 1,
				limit: 20,
				navOn: 'usable',
				theme: app.globalData.theme,
			};
		},
		computed: mapGetters(['isLogin']),
		watch: {
			isLogin: {
				handler: function(newV, oldV) {
					if (newV) {
						this.getUseCoupons();
					}
				},
				deep: true
			}
		},
		onLoad() {
			if (this.isLogin) {
				this.getUseCoupons();
			} else {
				toLogin();
			}
		},
		methods: {
			goCouponsProList(item) {
				if (this.navOn === 'usable') {
					uni.navigateTo({
						url: `/pages/goods/coupon_goods_list/index?type=2&userCouponId=${item.id}&money=${item.money}&minPrice=${item.minPrice}&isUserReceive=true`
					})
				}
			},
			onNav: function(type) {
				this.navOn = type;
				this.couponsList = [];
				this.page = 1;
				this.loadend = false;
				this.getUseCoupons();
			},
			/**
			 * 获取领取优惠券列表
			 */
			getUseCoupons: function() {
				let that = this;
				if (this.loadend) return false;
				if (this.loading) return false;
				this.loading = true;
				getUserCoupons({
					page: that.page,
					limit: that.limit,
					type: that.navOn
				}).then(res => {
					let list = res.data ? res.data.list : [],
						loadend = list.length < that.limit;
					let couponsList = that.$util.SplitArray(list, that.couponsList);
					that.$set(that, 'couponsList', couponsList);
					that.loadend = loadend;
					that.loadTitle = loadend ? '我也是有底线的' : '加载更多';
					that.page = that.page + 1;
					that.loading = false;
				}).catch(err => {
					that.loading = false;
					that.loadTitle = '加载更多';
				});
			}
		},
		/**
		 * 页面上拉触底事件的处理函数
		 */
		onReachBottom: function() {
			this.getUseCoupons();
		}
	}
</script>

<style lang="scss" scoped>
	.coupon-box {
		position: absolute;
	}

	.navbar {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 106rpx;
		background-color: #FFFFFF;
		z-index: 9;

		.item {
			border-top: 5rpx solid transparent;
			border-bottom: 5rpx solid transparent;
			font-size: 30rpx;
			color: #999999;

			&.on {
				@include tab_border_bottom(theme);
				@include main_color(theme);
			}
		}
	}


	.money {
		display: flex;
		flex-direction: column;
		justify-content: center;
		font-size: 20rpx !important;

		.logo {
			font-size: 39rpx;
		}
	}

	.bg_color {
		@include main_bg_color(theme);
	}

	.pic-num {
		color: #ffffff;
		font-size: 24rpx;
	}

	.pic_box {
		width: 690rpx;
		height: 160rpx;
		margin: 30rpx auto;

		image {
			width: 100%;
			height: 100%;
		}
	}

	.coupon-list {
		margin-top: 122rpx;
	}

	.coupon-list .item {
		overflow: hidden;
	}

	.coupon-list .item .text {
		height: 100%;
		position: relative;

		.iconfont {
			right: -16rpx;
			position: absolute;
			font-size: 140rpx;
			bottom: -20rpx;
			z-index: 1;
			opacity: 0.15;
		}
	}

	.coupon-list .item .text .data {
		border-top: 1px solid #f0f0f0;
	}

	.bg-color-check {
		@include main_color(theme);
		@include coupons_border_color(theme);
		font-size: 20rpx !important;
	}

	.noCommodity {
		margin-top: 64%;
	}



	.pictrue {
		display: flex;
		flex-direction: column;
		align-items: center;

		img {
			width: 414rpx;
			height: 305rpx;
		}

		.coupon {
			font-size: 26rpx;
			color: #999999;
		}
	}
</style>