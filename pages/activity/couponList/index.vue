<template>
	<view class='my-coupon' :data-theme="theme">
		<view class='header'>
			<view class='nav acea-row row-around'>
				<view class='item' :class='type==0 ? "on": ""' @click="statusClick(0)">
					<view>全部</view>
				</view>
				<view class='item' :class='type==3 ? "on": ""' @click="statusClick(3)">
					<view>通用</view>
				</view>
				<view class='item' :class='type==4 ? "on": ""' @click="statusClick(4)">
					<view>品类</view>
				</view>
				<view class='item' :class='type==2 ? "on": ""' @click="statusClick(2)">
					<view>商品</view>
				</view>
				<view class='item' :class='type==5 ? "on": ""' @click="statusClick(5)">
					<view>品牌</view>
				</view>
				<view class='item' :class='type==6 ? "on": ""' @click="statusClick(6)">
					<view>跨店</view>
				</view>
			</view>
		</view>
		<view class="listBox">
			<view v-for="item in list" :key='item.id'>
				<view class="list acea-row row-around"
					:style="{'background-image': `url(${urlDomain}crmebimage/presets/get_coupon_bg.png)`}">
					<view class="left cross" v-if="item.productVoList.length == 1" @click="goList(item)">
						<view class="cross-left" v-for="(items,index) in item.productVoList" :key='index'>
							<image :src="items.image" mode=""></image>
						</view>
						<view class="tips cross-right">
							<view class="title line2">{{item.name || ''}}</view>
							<view class="couponlogo">{{item.category | couponTypeFilter}}</view>
							<view class="time"></view>
						</view>
					</view>
					<view class="left" v-else-if="item.productVoList.length > 1" @click="goList(item)">
						<view class="acea-row row-middle">
							<view class="couponlogo">{{item.category | couponTypeFilter}}</view>
							<view class="tips line1">{{item.name || ''}}</view>
						</view>
						<view class="info">
							<view class="info-box" v-for="(items,index) in item.productVoList" :key='index'>
								<view class="relative">
									<view v-show="items.stock===0" class="sellOut">已售罄</view>
									<image :src="items.image" mode=""></image>
								</view>
								<view class="money">¥ {{items.price}}</view>
							</view>
						</view>
					</view>
					<view class="left cross" v-if="!item.productVoList.length">
						<view class="cross-left">
							<view class="_empty acea-row row-column row-center-wrapper">
								<text class="iconfont icon-fengmian"></text>
								<text>暂无商品</text>
							</view>
						</view>
						<view class="tips cross-right acea-row row-column row-between">
							<view class="title line2">{{item.name}}</view>
							<view class="couponlogo">{{item.category | couponTypeFilter}}</view>
							<view class="time"></view>
						</view>
					</view>
					<view class="right" :style="{'background-image': `url(${rightBg})`}">
						<view class="title"
							:class="item.lastTotal === 0 && item.isLimited?'text--w111-ccc':'font-color'">
							<view>
								<p>
									<text class='font1'>¥</text>
									<text class='font2'>{{parsePrice(item.money)}}</text>
								</p>
								<p>
									<text class='font3' v-if="item.minPrice == 0">无使用门槛</text>
									<text class='font3' v-else>满{{parsePrice(item.minPrice)}}元可用</text>
								</p>
							</view>
							<!-- isLimited是true限量，false不限量-->
							<view v-if="item.lastTotal === 0 && item.isLimited">
								<view class='btn bg-color-hui'>已领完</view>
								<span class="iconfont icon-yilingwan1"></span>
							</view>
							<view v-else>
								<view class="btn bg-color" v-if="!item.isUserReceive" @click="receiveCoupon(item)">立即领取
								</view>
								<view v-if="item.lastTotal > 0 && item.isUserReceive">
									<view class='btn bg-color' @click="goList(item)">去使用</view>
									<span class="iconfont icon-yilingqu"></span>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="loadingicon acea-row row-center-wrapper">
			<text class="loading iconfont icon-jiazai" :hidden="loading == false" style="color:#33;"></text>
		</view>
		<view class="empty-boxs noContent" v-if="!list.length && loaded">
			<emptyPage title="暂无优惠券可领取哦~" mTop="13%" :imgSrc="urlDomain + 'crmebimage/presets/noCoupon.png'">
			</emptyPage>
		</view>
	</view>
</template>

<script>
	import {
		getCouponLstApi,
		couponReceiveApi
	} from '@/api/activity.js';
	import emptyPage from '@/components/emptyPage.vue';
	let app = getApp();
	export default {
		components: {
			emptyPage
		},
		data() {
			return {
				type: '',
				urlDomain: this.$Cache.get("imgHost"),
				list: [],
				loading: false,
				loaded: false,
				page: 1,
				limit: 15,
				theme: app.globalData.theme,
			}
		},
		onLoad: function() {
			this.statusClick(0);

		},
		computed: {
			rightBg() {
				let theme = this.$Cache.get('theme');
				switch (theme) {
					case 'theme1':
						return this.urlDomain + 'crmebimage/presets/right_red.png'
						break;
					case 'theme2':
						return this.urlDomain + 'crmebimage/presets/right_orange.png'
						break;
					case 'theme3':
						return this.urlDomain + 'crmebimage/presets/right_green.png'
						break;
					case 'theme4':
						return this.urlDomain + 'crmebimage/presets/right_blue.png'
						break;
					case 'theme5':
						return this.urlDomain + 'crmebimage/presets/right_pink.png'
						break;
					default:
						break;
				}
			},
			gray_bg() {
				return this.urlDomain + 'crmebimage/presets/right_gray.png'
			}
		},
		methods: {
			parsePrice(price) {
				if (price >= 100) {
					return parseFloat(price)
				} else {
					return price
				}
			},
			// 领取优惠券
			receiveCoupon(item) {
				let that = this;
				couponReceiveApi(item.id).then(res => {
					item.isUserReceive = true;
					uni.showToast({
						title: '领取成功',
						icon: 'none'
					})
				}).catch(err => {
					uni.showToast({
						title: err,
						icon: 'none'
					})
				})
			},
			getList() {
				if (this.loading || this.loaded) return;
				this.loading = true;
				getCouponLstApi({
					category: this.type,
					page: this.page,
					limit: this.limit
				}).then(res => {
					this.list = this.list.concat(res.data.list);
					this.loading = false;
					this.loaded = res.data.list.length != this.limit;
					this.page++;
				})
			},
			//切换类型
			statusClick: function(status) {
				if (status === this.type) return;
				this.loaded = false;
				this.loading = false;
				this.page = 1;
				this.list = [];
				this.type = status;
				this.getList()
			},
			goList(item) {
				uni.navigateTo({
					url: `/pages/goods/coupon_goods_list/index?type=1&userCouponId=${item.id}&money=${item.money}&minPrice=${item.minPrice}&isUserReceive=${item.isUserReceive}`
				})
			}
		},
		onReachBottom: function() {
			this.getList();
		}
	}
</script>

<style lang="scss" scoped>
	/deep/.sellOut {
		width: 96rpx;
		height: 32rpx;
		line-height: 28rpx;
		font-size: 20rpx;
	}

	.header {
		height: 200rpx;
		@include main_bg_color(theme);
		border-bottom-left-radius: 10%;
		border-bottom-right-radius: 10%;

		.nav {
			border-radius: 6rpx;
			padding-top: 30rpx;
			position: fixed;
			width: 100%;
			z-index: 9999999;
			@include main_bg_color(theme);
			padding-bottom: 16rpx;

			.item {
				text-align: center;
				font-size: 30rpx;
				color: #FFFFFF;
				padding: 29rpx 0;
				opacity: 0.7;
				line-height: 2rpx;

				.num {
					margin-top: 18rpx;
				}
			}

			.item.on {
				opacity: 1;
				font-weight: bold;
				border-bottom: 5rpx solid #FFFFFF;
			}
		}
	}

	.listBox {
		margin: -73rpx auto 0 auto;
		padding: 0 24rpx;

		.list {
			width: 100%;
			height: 260rpx;
			overflow: hidden;
			background-size: cover;
			border-radius: 12rpx;
			margin-bottom: 25rpx;
			text-align: center;

			.cross {
				display: flex;

				.cross-left {
					margin-top: 6rpx;

					image {
						width: 200rpx;
						height: 200rpx;
						border-radius: 12rpx;
					}

					._empty {
						width: 200rpx;
						height: 200rpx;
						border-radius: 12rpx;
						@include cate-two-btn(theme);
						@include main_color(theme);
						font-size: 24rpx;

						.iconfont {
							font-size: 48rpx;
							padding-top: 10rpx;
						}
					}
				}

				.cross-right {
					margin-left: 20rpx;
					margin-top: 6rpx;
					margin-bottom: 14rpx;
					display: flex;
					flex-direction: column;
					justify-content: space-between;

					.title {
						width: 234rpx;
						overflow: hidden;
						text-overflow: ellipsis;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 2;
					}

					.time {
						font-size: 20rpx;
						font-weight: 400;
						color: #666666;
					}

					.couponlogo {
						padding: 0 !important;
						/* #ifdef MP */
						width: 66rpx;
						height: 30rpx;
						border-radius: 14rpx;
						/* #endif */
						/* #ifdef H5 */
						width: 72rpx;
						/* #endif */
						/* #ifdef APP */
						width: 66rpx;
						/* #endif */
						text-align: center;
					}
				}
			}

			.left {
				width: 502rpx;
				height: 210rpx;
				margin-top: 20rpx;
				text-align: left;
				padding-left: 30rpx;
				background-color: #FFFFFF;

				.couponlogo {
					display: inline-table;
					height: 32rpx;
					line-height: 30rpx;
					border-radius: 16rpx;
					padding: 0 10rpx;
					font-size: 20rpx;
					margin-right: 12rpx;
					font-weight: 400;
					@include main_color(theme);
					@include coupons_border_color(theme);
					@include cate-two-btn(theme);
				}

				.tips {
					width: 360rpx;
					font-size: 26rpx;
					font-weight: 600;
					color: #282828;
				}

				.info {
					margin-top: 18rpx;
					display: flex;
					justify-content: flex-start;

					.info-box {
						margin-right: 25rpx;

						image {
							display: inline-block;
							width: 130rpx;
							height: 130rpx;
							border-radius: 8rpx;
						}

						.money {
							text-align: center;
							font-size: 24rpx;
							font-weight: 400;
							color: #666666;
							margin-top: 4rpx;
						}
					}
				}
			}

			.right {
				/* #ifdef APP */
				width: 188rpx;
				/* #endif */
				/* #ifndef APP */
				width: 200rpx;
				/* #endif */
				height: 100%;
				background-size: 100% 100%;
				position: relative;

				.icon-yilingqu,
				.icon-yilingwan1 {
					position: absolute;
					opacity: 0.4;
					font-size: 122rpx;
					top: -34rpx;
				}

				.title {
					width: 100%;
					height: 169rpx;
					margin: 30rpx auto 0;

					.font1 {
						font-size: 34rpx;
						font-weight: 600;
					}

					.font2 {
						font-size: 60rpx;
						font-weight: 600;
					}

					.font3 {
						font-size: 20rpx;
						font-weight: 400;
					}

					p {
						margin-top: 10rpx;
					}

					.btn {
						width: 142rpx;
						// @include linear-gradient(theme);
						border-radius: 26rpx;
						font-size: 24rpx;
						font-weight: 400;
						color: #FFFFFF;
						line-height: 44rpx;
						text-align: center;
						margin: 20rpx auto 0;

						&.disabled {
							pointer-events: none;
							background: #ccc;
							color: #fff;
							border-color: #ccc;
							cursor: not-allowed;
						}
					}

					.shiyong {
						border: 2rpx solid #E93323;
						background: none;
						color: #E93323;
						border-radius: 26rpx;

						&.disabled {
							pointer-events: none;
							color: #ccc;
							border-color: #ccc;
							cursor: not-allowed;
							background: none;
						}
					}
				}

			}
		}

		.list:nth-child(1) {
			.right {
				&::after {
					background-color: #E93323;
				}
			}
		}
	}

	.noCommodity {
		width: 100%;
		margin: -72rpx auto 0 auto;
		padding: 0 30rpx;

		.pictrue {
			width: 100%;
			height: 600rpx;
			background-color: #fff;
			border-radius: 6px;
			margin-bottom: 12px;
			text-align: center;
			color: #999;

			image {
				width: 400rpx;
			}
		}
	}
</style>