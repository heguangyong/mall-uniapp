<template>
	<view id="home" :data-theme="theme" :style="[pageStyle]">
		<tui-skeleton v-if="showSkeleton"></tui-skeleton>
		<!-- 有网内容 -->
		<view class="page-index tui-skeleton page_count" :class="{'bgf':navIndex >0}"
			:style="{visibility: showSkeleton ? 'hidden' : 'visible'}">
			<!-- 组合组件 -->
			<merHomeComb :bgInfo="bgInfo" v-if="showHomeComb" :dataConfig="homeCombData" :isScrolled="isScrolled" :navIndex="navIndex"
				:merId="merId">
			</merHomeComb>
			<!-- 顶部搜索框 -->
			<headerSearch :isScrolled="isScrolled" v-if="showHeaderSerch" :dataConfig="headerSerchCombData" :merId="merId"></headerSearch>
			<view class="page_content skeleton">
				<view v-if="navIndex === 0">
					<view v-for="(item, index) in styleConfig" :key="index">
						<!-- 导航组 -->
						<merHome v-if="item.name == 'homeStore'" :dataConfig="item" class="tui-skeleton-rect"
							:merchantInfo="merchantAPPInfo" :merId="merId" :isHome="true"></merHome>
						<!-- 导航组 -->
						<menus v-if="item.name == 'menus'" :dataConfig="item"></menus>
						<!-- 秒杀 -->
						<seckill-data v-if="item.name == 'seckill'" :dataConfig="item" :merId="merId"></seckill-data>
						<!-- 小程序直播 -->
						<!-- #ifdef MP -->
						<liveBroadcast v-if="item.name == 'liveBroadcast'" :dataConfig="item"></liveBroadcast>
						<!-- #endif -->
						<!-- 优惠券 -->
						<coupon v-if="item.name == 'homeCoupon'" :dataConfig="item" :merId="merId"></coupon>
						<!-- 图片魔方 -->
						<pictureCube v-if="item.name == 'pictureCube'" :dataConfig="item"></pictureCube>
						<!-- 热区 -->
						<hotSpot v-if="item.name == 'homeHotspot'" :dataConfig="item"></hotSpot>
						<!-- 轮播图 -->
						<swiperBg v-if="item.name == 'swiperBg'" :dataConfig="item"></swiperBg>
						<!-- 视频 -->
						<shortVideo v-if="item.name == 'video'" :dataConfig="item"></shortVideo>
						<!-- 拼团 -->
						<group v-if="item.name == 'group'" :dataConfig="item" :merId="merId"></group>
						<!-- 辅助线 -->
						<guide v-if="item.name == 'guide'" :dataConfig="item"></guide>
						<!-- 富文本-->
						<rich-text-editor v-if="item.name == 'richTextEditor'" :dataConfig="item"></rich-text-editor>
						<!-- 辅助空白-->
						<blank-page v-if="item.name == 'blankPage'" :dataConfig="item"></blank-page>
						<!-- 标题 -->
						<home-title v-if="item.name == 'titles'" :dataConfig="item"></home-title>
						<!-- 商品列表 -->
						<goodList v-if="item.name == 'goodList'" :dataConfig="item" @detail="goDetail" :merId="merId">
						</goodList>
						<!-- 选项卡商品列表-->
						<homeTab v-if="item.name == 'homeTab'" :dataConfig="item" @detail="goDetail" :merId="merId">
						</homeTab>
					</view>
				</view>

				<!-- 底部导航距离，做兼容处理的-->
				<view class="footerBottom"></view>
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
	// import Cache from '../../utils/cache';
	import tuiSkeleton from '@/components/base/tui-skeleton.vue';
	import liveBroadcast from '@/components/homeIndex/liveBroadcast';
	import merHomeComb from '@/components/homeIndex/merHomeComb.vue';
	import recommend from "@/components/base/recommend.vue";
	import seckillData from "@/components/homeIndex/seckill.vue";
	import coupon from "@/components/homeIndex/coupon.vue";
	import menus from "@/components/homeIndex/menus.vue";
	import pictureCube from '@/components/homeIndex/pictureCube'
	import goodList from '@/components/homeIndex/goodList'
	import guide from '@/components/homeIndex/guide';
	import swiperBg from '@/components/homeIndex/swiperBg'
	import headerSearch from '@/components/homeIndex/headerSearch';
	import richTextEditor from '@/components/homeIndex/richTextEditor';
	import shortVideo from '@/components/homeIndex/video';
	import homeTab from '@/components/homeIndex/homeTab';
	import blankPage from '@/components/homeIndex/blankPage';
	import homeTitle from '@/components/homeIndex/title';
	import hotSpot from '@/components/homeIndex/hotSpot.vue';
	import group from "@/components/homeIndex/group.vue";
	import pageFooter from "@/components/pageFooter/index.vue";
  import merHome from '@/components/merHome/index.vue'
	import {
		getMerDiyInfoApi,
	} from '@/api/merchant.js';
	import {
		mapGetters
	} from "vuex";
	import {
		goProductDetail
	} from "@/libs/order";
	let app = getApp();
	export default {
		computed: mapGetters(['isLogin', 'uid', 'globalData', 'bottomNavigationIsCustom', 'merchantAPPInfo']),
		components: {
			merHomeComb,
			recommend,
			tuiSkeleton,
			seckillData,
			pageFooter,
			liveBroadcast,
			coupon,
			menus,
			pictureCube,
			goodList,
			swiperBg,
			headerSearch,
			guide,
			richTextEditor,
			shortVideo,
			homeTab,
			blankPage,
			homeTitle,
			hotSpot,
			group,
      merHome
		},
		props: {
			merId: { // 商户id
				type: Number,
				default: 0
			},
			isScrolled: { //是否开始滚动
				type: Boolean,
				default: false
			},
			diyId: { //模板 Id
				type: Number,
				default: 0
			}
		},
		watch: {
			merId: {
				handler(newValue, oldValue) {
					this.diyData();
				},
				immediate: true
			}
		},
		data() {
			return {
				showSkeleton: true, //骨架屏显示隐藏
				isNodes: 0, //控制什么时候开始抓取元素节点,只要数值改变就重新抓取
				navIndex: 0, //判断首页显示内容，1显示分类页和商品，0首页
				theme: app.globalData.theme,
				styleConfig: [], //DIY数据
				homeCombData: {}, //组合组件数据
				showHomeComb: false, //是否显示组合
				showHeaderSerch: false, //是否显示搜索框
				headerSerchCombData: {}, //搜索框对象
				bgPic: '', //背景图片
				bgTabVal: '', //背景图片样式
				windowHeight: 0,
				pageStyle: {},
				where: {
					keyword: '',
					priceOrder: '',
					salesOrder: '',
					page: 1,
					limit: 10,
					cid: 0,
					merId: 0,
					maxPrice: 0,
					minPrice: 0
				},
				loading: false,
				loadend: false,
				bgInfo:{
					colorPicker:'#f5f5f5',
					isBgColor:1,
				},
			}
		},
		onLoad(options) {
			//diy数据加载
			this.diyData();

			let that = this;
			this.$nextTick(function() {
				uni.getSystemInfo({
					success: function(res) {
						that.windowHeight = res.windowHeight;
					}
				});
			})
		},
		methods: {
			/**
			 * 获取DIY
			 * @param {number} id
			 * @param {boolean} type 区分是否是微页面
			 */
			diyData() {
				let that = this;
				that.styleConfig = []
				uni.showLoading({
					title: '加载中...'
				});
				getMerDiyInfoApi(this.merId, this.diyId).then(res => {
					uni.setNavigationBarTitle({
						title: res.data.title
					});
					let data = res.data;
					this.reloadData();
					that.styleConfig = that.$util.objToArr(res.data.value);
					this.bgInfo.isBgColor=data.isBgColor
					this.bgInfo.colorPicker=data.colorPicker
					that.pageStyle = {
						'background-color': data.isBgColor === 1 ? res.data.colorPicker : '',
						'background-image': data.isBgPic === 1 ? `url(${res.data.bgPic})` : '',
						'background-repeat': res.data.bgTabVal === 1 ? 'repeat-y' : 'no-repeat',
						'background-size': res.data.bgTabVal === 2 ? 'cover' : 'contain'
					};
					uni.hideLoading();
					that.styleConfig.forEach((item) => {
						if (item.name === 'tabNav') {
							that.showCateNav = true;
							that.cateNavData = item;
						}
						if (item.name === 'homeComb') {
							that.showHomeComb = true
							that.homeCombData = item;

						}
						if (item.name === 'headerSerch') {
							that.showHeaderSerch = true
							that.headerSerchCombData = item;
						}
					});

					setTimeout(() => {
						that.isNodes++;
					}, 100);
				}).catch(err => {
					return that.$util.Tips({
						title: err
					});
					uni.hideLoading();
				});
			},
			//清除骨架屏
			reloadData() {
				this.showSkeleton = false;
			},
			clear() {
				this.loading = false;
				this.loadend = false;
				this.where = {
					keyword: '',
					priceOrder: '',
					salesOrder: '',
					page: 1,
					limit: 20,
					cid: 0
				};
				this.productList = [];
			},
			// 微信分享；
			setOpenShare: function(data) {
				let that = this;
				if (that.$wechat.isWeixin()) {
					let configAppMessage = {
						desc: data.synopsis,
						title: data.title,
						link: location.href,
						imgUrl: data.img
					};
					that.$wechat.wechatEvevt(["updateAppMessageShareData", "updateTimelineShareData"],
						configAppMessage);
				}
			},
			stopTouchMove() {
				return true //禁止新闻swiper手动滑动
			},
			goDetail(item) {
				goProductDetail(item.id, 0, '')
			},
		},
	}
</script>
<style>
	page {
		height: auto;
		display: flex;
		flex-direction: column;
		height: 100%;
		/* #ifdef H5 */
		background-color: #fff;
		/* #endif */

	}
</style>
<style lang="scss" scoped>
	.error-network {
		position: fixed;
		left: 0;
		top: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100%;
		height: 100%;
		padding-top: 40rpx;
		background: #fff;
		padding-top: 30%;

		.img {
			width: 414rpx;
			height: 336rpx;
		}

		.title {
			position: relative;
			top: -40rpx;
			font-size: 32rpx;
			color: #666;
		}

		.con {
			font-size: 24rpx;
			color: #999;

			.label {
				margin-bottom: 20rpx;
			}

			.item {
				margin-bottom: 20rpx;
			}
		}

		.btn {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 508rpx;
			height: 86rpx;
			margin-top: 100rpx;
			border: 1px solid #d74432;
			color: #e93323;
			font-size: 30rpx;
			border-radius: 120rpx;
		}
	}

	.ysize {
		background-size: 100%;
	}

	.fullsize {
		background-size: 100% 100%;
	}

	.repeat {
		background-repeat: repeat;
	}

	.noRepeat {
		background-repeat: no-repeat;
	}

	.noCommodity {
		margin-top: 30%;
	}

	.icon-gengduo1 {
		color: #F8F8F8;
	}

	.pageIndex {
		padding: 0 24rpx;
	}

	.productList {
		background-color: #F5F5F5;
		margin-top: 20rpx;

		// min-height: 70vh;
		.sort {
			width: 710rpx;
			max-height: 380rpx;
			background: rgba(255, 255, 255, 1);
			border-radius: 16rpx;
			padding: 0rpx 0rpx 20rpx 0rpx !important;
			flex-wrap: wrap;
			margin: 25rpx auto 0 auto;

			&.no_pad {
				padding: 0;
			}

			.item {
				width: 20%;
				margin-top: 20rpx;
				text-align: center;

				.pictrues {
					width: 90rpx;
					height: 90rpx;
					background: #F5F5F5;
					border-radius: 50%;
					margin: 0 auto;
				}

				.pictrue {
					width: 90rpx;
					height: 90rpx;
					background: #F5F5F5;
					border-radius: 50%;
					margin: 0 auto;
				}

				.slide-image {
					width: 90rpx;
					height: 90rpx;
					border-radius: 50%;
					overflow: hidden;
				}

				::v-deep .easy-loadimage,
				uni-image,
				.easy-loadimage {
					width: 90rpx;
					height: 90rpx;
					display: inline-block;
				}

				.text {
					color: #272727;
					font-size: 24rpx;
					margin-top: 10rpx;
					// overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
				}
			}
		}
	}

	.productList .list {
		padding: 0 20rpx;
	}

	.productList .list.on {
		background-color: #fff;
		border-top: 1px solid #f6f6f6;
	}

	.productList .list .item {
		width: 345rpx;
		margin-top: 20rpx;
		background-color: #fff;
		border-radius: 10rpx;

		.name {
			display: flex;
			align-items: center;

			.name_text {
				display: inline-block;
				max-width: 200rpx;
			}
		}
	}

	.page-index {
		display: flex;
		flex-direction: column;
		min-height: 100%;

		.page_content {

			// background-color: #f5f5f5;
			.swiper {
				position: relative;
				width: 100%;
				height: 246rpx;
				margin: 0 auto;
				border-radius: 10rpx;
				overflow: hidden;
				margin-bottom: 25rpx;
				/* #ifdef MP */
				margin-top: 20rpx;

				/* #endif */
				swiper,
				swiper-item,
				.slide-image,
				image {
					width: 100%;
					height: 246rpx;
					border-radius: 10rpx;
				}
			}
		}
	}

	.fixed {
		z-index: 100;
		position: fixed;
		left: 0;
		top: 0;
		background: linear-gradient(90deg, red 50%, #ff5400 100%);

	}

	.menu-txt {
		font-size: 24rpx;
		color: #454545;
	}
</style>