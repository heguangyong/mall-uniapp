<template>
	<view  @touchstart="touchStart">
		<!-- #ifdef MP || APP-->
		<nav-bar ref="navBarRef" navTitle="积分商城" iconColor="#ffffff" :isBackgroundColor="false"
			backgroundColor="linear-gradient( 90deg, #E93323 0%, #FF7931 100%)"></nav-bar>
		<!-- #endif -->
		<view class="header">
			<view class="headerBg" :style="{'background-image': `url(${urlDomain}crmebimage/presets/points_bg.png)`}">
				<view class="pictrue"></view>
				<view class="num">当前积分{{integral}}</view>
			</view>
			<navigator hover-class='none' url='/pages/goods/order_list/index?secondType=1'
				class="record acea-row row-center-wrapper">兑换记录</navigator>
		</view>
		<view class="points-nav">
			<view class="nav acea-row row-middle row-around borRadius14">
				<navigator hover-class='none' url='/pages/merchant/user_integral/index' class="item">
					<view class="pictrue">
						<image :src="`${urlDomain}crmebimage/presets/points_my.png`"></image>
					</view>
					<view>我的积分</view>
				</navigator>
				<view class="line"></view>
				<navigator hover-class='none' url='/pages/merchant/user_sgin/index' class="item">
					<view class="pictrue">
						<image :src="`${urlDomain}crmebimage/presets/points_qiandao.png`"></image>
					</view>
					<view>每日签到</view>
				</navigator>
				<view class="line"></view>
				<navigator hover-class='none' open-type='switchTab' url='/pages/index/index' class="item">
					<view class="pictrue">
						<image :src="`${urlDomain}crmebimage/presets/points_goods.png`"></image>
					</view>
					<view>购买商品</view>
				</navigator>
			</view>
		</view>
		<view class="hot borRadius14" v-if="goodList.length">
			<view class="flex-between-center">
				<view class="title">热门推荐</view>
				<navigator v-show="goodList.length > 10 " hover-class='none' url='/pages/activity/goods_points/index'
					class="item">
					<view class="text-666 f-s-26 mr28 flex-center">
						更多
						<text class="iconfont icon-xiangyou"></text>
					</view>
				</navigator>
			</view>
			<scroll-view scroll-x="true" class="scroll">
				<PointsGoods :integralGood="goodList" :pointsGoodsStyle="hotPointsStyle" :isShowSamll="true">
				</PointsGoods>
			</scroll-view>
		</view>
		<view class="body">
			<view class="body-title flex">
				<view class="scroll" @click="navTap(0,0)"><text class="item" :class="0 == current?'on':''">全部</text>
				</view>
				<scroll-view scroll-x="true" class="scroll" style="width: 81%;">
					<view class="item" :class="index+1 == current ?'on':''" v-for="(item, index) in navList"
						:key="index" @click="navTap(item.id,index+1)">{{item.value}}{{index+1?'积分':''}}</view>
				</scroll-view>
			</view>
			<view class="product-list" v-if="integralGood.length">
				<PointsGoods :integralGood="integralGood" :pointsGoodsStyle="pointsStyle"></PointsGoods>
			</view>
			<view v-else-if="!loading" class="empty-box">
				<emptyPage title="暂无商品，去看看别的吧～" mTop="0" :imgSrc="urlDomain+'crmebimage/presets/noShopper.png'">
				</emptyPage>
			</view>
			<view v-if="loading" class='loadingicon acea-row row-center-wrapper' :hidden='loading==false'>
				<text class='loading iconfont icon-jiazai'></text>
			</view>

		</view>
	</view>
</template>

<script>
	import {
		pointsStyle,
		hotPointsStyle
	} from "./default";

	let sysHeight = uni.getSystemInfoSync().statusBarHeight;
	import {
		silenceBindingSpread,
		getUserSpread
	} from '@/utils/index.js';
	import {
		toLogin
	} from '@/libs/login.js';
	import {
		mapGetters
	} from 'vuex';
	import {
		integralProductHotApi,
		integralCategoryApi,
		integralListApi
	} from '@/api/activity.js'
	import emptyPage from '@/components/emptyPage.vue';
	import NavBar from "@/components/navBar.vue"
	import useActivity from "@/mixins/useActivity";
	import PointsGoods from "../components/PointsGoods.vue"
	import {
		userIntegralApi
	} from "../../../api/activity";
	export default {
		mixins: [useActivity],
		components: {
			emptyPage,
			NavBar,
			PointsGoods
		},
		data() {
			return {
				urlDomain: this.$Cache.get("imgHost"),
				sysHeight,
				goodList: [],
				navList: [],
				current: 0,
				where: {
					intervalId: 0,
					page: 1,
					limit: 10,
				},
				integralGood: [],
				loadend: false,
				loading: false,
				loadTitle: '加载更多',
				pageScrollStatus: false,
				pointsStyle: pointsStyle, //列表商品样式
				hotPointsStyle: hotPointsStyle //推荐商品样式
			}
		},
		computed: mapGetters(['isLogin', 'uid', 'globalData']),
		onShow() {
			//分销绑定
			silenceBindingSpread(this.isLogin, this.globalData.spread);
			this.integralCategory();
			this.getIntegralList();
			if (this.isLogin) {
				this.getStoreIntegral();
				this.getUserIntegral(); //获取我的积分
			} else {
				toLogin();
			}
		},
		onLoad(options) {
			//分销码
			getUserSpread(options);
			if (!this.isLogin) {
				toLogin();
			}
		},
		watch: {
			isLogin: {
				handler: function(newV, oldV) {
					if (newV == true) {
						this.getStoreIntegral();
						this.getUserIntegral(); //获取我的积分
					}
				},
				deep: true
			},
		},
		onPageScroll(object) {
			if (object.scrollTop > 130) {
				this.pageScrollStatus = true;
			} else if (object.scrollTop < 130) {
				this.pageScrollStatus = false;
			}
			uni.$emit('scroll');
		},
		// #ifdef MP
		/**
		 * 用户点击右上角分享
		 */
		onShareAppMessage() {
			return {
				title: '积分兑好物',
				path: `/pages/activity/points_mall/index?sd=${this.uid}`
			};
		},
		// #endif
		methods: {
      //滚动
      touchStart() {
        this.$refs.navBarRef.currentPage = false;
      },
			//分享
			getShareInfo() {
				return {
					path: `/pages/activity/points_mall/index?sd=${this.uid}`
				};
			},
			//区间列表
			integralCategory() {
				integralCategoryApi().then(res => {
					let data = res.data;
					this.navList = data;
				}).catch(err => {
					return this.$util.Tips({
						title: err
					});
				})
			},
			navTap(id, index) {
				if (this.current === index) return;
				this.current = index;
				this.where.intervalId = id;
				this.where.page = 1;
				this.loadend = false;
				this.$set(this, 'integralGood', []);
				this.getIntegralList();
			},
			//积分商品列表
			getIntegralList() {
				if (this.loadend) return;
				if (this.loading) return;
				this.loading = true;
				integralListApi(this.where).then(res => {
					let list = res.data.list;
					let limit = this.where.limit;
					this.where.page++;
					this.loadend = limit > list.length;
					this.integralGood = this.integralGood.concat(list);
					this.loading = false;
					this.loadTitle = loadend ? '没有更多内容啦~' : '加载更多';
				}).catch(err => {
					this.loading = false;
					this.loadTitle = '加载更多';
					return this.$util.Tips({
						title: err
					});
				})
			},
			goarrow() {
				uni.navigateBack()
			},
			//热门推荐
			getStoreIntegral() {
				integralProductHotApi({
					page: 1,
					limit: 20,
				}).then(res => {
					this.goodList = res.data.list;
				})
			},
			// 去商品详情
			goGoodsDetail(item) {
				uni.navigateTo({
					url: `/pages/activity/goods_details/index?id=${item.id}&type=4`
				});
			}
		},
		onReachBottom() {
			this.getIntegralList();
		}
	}
</script>

<style lang="scss" scoped>
	.points-nav {
		position: relative;
		width: 100%;
		height: 154rpx;
		margin-bottom: 46rpx;
		background: linear-gradient(0deg, #F5F5F5 0%, rgba(255, 255, 255, 0) 100%);
	}

	page {
		padding-bottom: 40rpx;
	}

	.accountTitle {
		background: linear-gradient(90deg, var(--view-theme) 0%, var(--view-gradient) 100%);
		position: fixed;
		left: 0;
		top: 0;
		width: 100%;
		z-index: 99;

		.sysTitle {
			width: 100%;
			position: relative;
			font-weight: 500;
			color: #fff;
			font-size: 30rpx;

			.iconfont {
				position: absolute;
				font-size: 36rpx;
				left: 11rpx;
				width: 60rpx;
			}
		}
	}

	.header {
		width: 100%;
		height: 400rpx;
		background: linear-gradient(90deg, #E93323 0%, #FF7931 100%);
		position: relative;

		.record {
			width: 124rpx;
			height: 48rpx;
			background-color: rgba(51, 51, 51, 0.2);
			border-radius: 50rpx 0 0 50rpx;
			font-weight: 400;
			color: #FFFFFF;
			font-size: 24rpx;
			position: absolute;
			right: 0;
			top: 36rpx;
		}

		&::after {
			position: absolute;
			content: '';
			width: 100%;
			height: 105rpx;
			background: linear-gradient(180deg, rgba(233, 51, 35, 0) 0%, var(--view-minorColorT) 50%, #F5F5F5 100%);
		}

		.headerBg {
			background-repeat: no-repeat;
			background-size: 100% 100%;
			width: 689rpx;
			height: 298rpx;
			margin: 0 auto;
			padding-top: 88rpx;

			.pictrue {
				width: 345rpx;
				height: 76rpx;

				image {
					width: 100%;
					height: 100%;
				}
			}

			.num {
				font-size: 26rpx;
				font-weight: 400;
				color: rgba(255, 255, 255, 0.6);
				margin: 4rpx 0 0 12rpx;
			}
		}
	}

	.hot {
		background-color: #fff;
		width: 710rpx;
		margin: 20rpx auto 0 auto;
		padding: 24rpx 0 24rpx 28rpx;

		.title {
			font-weight: 600;
			color: #333333;
			font-size: 32rpx;
		}

		.scroll {
			white-space: nowrap;
			margin-top: 26rpx;

			.scroll-item {
				display: inline-block;
				width: 224rpx;
				margin-right: 20rpx;
				vertical-align: top;

				.pictrue {
					width: 100%;
					height: 224rpx;

					image {
						width: 100%;
						height: 100%;
						border-radius: 20rpx;
					}
				}

				.name {
					font-weight: 400;
					color: #333333;
					font-size: 26rpx;
					margin-top: 16rpx;
				}

				.info {
					color: #999999;
					font-size: 22rpx;
					margin-top: 8rpx;
				}

				.price-box {
					font-size: 24rpx;
					font-weight: 500;
					margin-top: 10rpx;
					color: #666;

					image {
						width: 31rpx;
						height: 31rpx;
						margin-right: 8rpx;
					}
				}
			}
		}
	}

	.nav {
		width: 710rpx;
		height: 184rpx;
		background-color: #fff;
		margin: -150rpx auto 0 auto;
		position: relative;

		.item {
			font-size: 26rpx;
			font-weight: 400;
			color: #333333;
			text-align: center;
			width: 30%;

			.pictrue {
				width: 61rpx;
				height: 61rpx;
				margin: 0 auto 16rpx auto;

				image {
					width: 100%;
					height: 100%;
				}
			}
		}

		.line {
			width: 1px;
			height: 70rpx;
			background-color: #F3F3F3;
		}
	}

	.body {
		background-color: #fff;
		width: 710rpx;
		margin: 20rpx auto 0 auto;
		border-radius: 24rpx;
		padding-bottom: 20rpx;
		overflow: hidden;

		.body-title {
			padding-left: 32rpx;
			overflow: auto;

			.scroll {
				white-space: nowrap;

				.item {
					display: inline-block;
					margin-right: 60rpx;
					padding: 34rpx 0 38rpx 0;
					font-size: 28rpx;
					font-weight: 400;

					&.on {
						font-weight: 500;
						color: #E93323;
						position: relative;
						font-size: 30rpx;

						&::after {
							position: absolute;
							content: '';
							width: 36rpx;
							height: 30rpx;
							border: 2px solid #E93323;
							border-left: 2px solid transparent !important;
							border-top: 2px solid transparent !important;
							border-right: 2px solid transparent !important;
							border-radius: 50%;
							left: 50%;
							bottom: 22rpx;
							margin-left: -24rpx;
						}
					}
				}
			}
		}

		.product-list {
			display: flex;
			flex-wrap: wrap;
			justify-content: space-between;
			padding: 0 32rpx;
			margin-right: -24px;

		}
	}
</style>