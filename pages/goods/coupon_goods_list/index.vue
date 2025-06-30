<template>
	<view :data-theme="theme">
		<view class='productList'>
			<view class='search bg_color acea-row row-between-wrapper'>
				<!-- #ifdef H5 -->
				<view class="iconfont icon-xiangzuo" @click="goback()"></view>
				<!-- #endif -->
				<view class='input acea-row row-middle'><text class='iconfont icon-sousuo'></text>
					<input placeholder='搜索商品名称' placeholder-class='placeholder' confirm-type='search' name="search"
						v-model="keyword" @confirm="searchSubmit" maxlength="20"></input>
				</view>
				<!-- <view v-if="tabIndex===1" class='iconfont icon-yangshi1' @click='Changswitch'></view> -->
				<view class='item iconfont' :class="is_switch?'icon-pailie':'icon-tupianpailie'" @click='Changswitch()'>
				</view>
			</view>
			<view class='titleBox acea-row row-middle skeleton-rect'>
				<view class="acea-row row-middle flex-1">
					<view>
						<text class='font1'>¥</text>
						<text class='font2'>{{money}}</text>
					</view>
					<text class='font3'>满{{minPrice}}元可用</text>
				</view>
				<view v-show="type==='1'" class="_right" @click="receiveCoupon">
					<view class="_btn acea-row row-center row-middle">{{isUserReceive ? '已领取' : '领取'}}</view>
				</view>
				<view class="roll left-roll"></view>
				<view class="roll right-roll"></view>
			</view>
			<view class="" :class="is_switch==true?'proList':'listBox'">
				<view v-if="productList.length>0">
					<view v-if="!is_switch" class='list acea-row row-between-wrapper pad30'
						:class="[is_switch==true ? '' : 'on'] ">
						<view class='item' :class='is_switch==true?"":"on"' hover-class='none'
							v-for="(item,index) in productList" :key="index" @click="goDetail(item)">
							<view class='pictrue' :class='is_switch==true?"":"on"'>
								<easy-loadimage :image-src="item.image" :class='is_switch==true?"":"on"'>
								</easy-loadimage>
								<span class="pictrue_log_class"
									:class="is_switch === true ? 'pictrue_log_big' : 'pictrue_log'"
									v-if="item.activityH5 && item.activityH5.type === '1'">秒杀</span>
								<span class="pictrue_log_class"
									:class="is_switch === true ? 'pictrue_log_big' : 'pictrue_log'"
									v-if="item.activityH5 && item.activityH5.type === '2'">砍价</span>
								<span class="pictrue_log_class"
									:class="is_switch === true ? 'pictrue_log_big' : 'pictrue_log'"
									v-if="item.activityH5 && item.activityH5.type === '3'">拼团</span>
							</view>
							<view class='text' :class='is_switch==true?"":"on"'>
								<view class='name line2'>{{item.name}}</view>
								<view class='x-money' :class='is_switch==true?"":"on"'>￥<text
										class='num'>{{item.price}}</text></view>
								<view v-if="item.merTypeId">
									<text
										class="font-bg-red mr10 merType">{{item.merTypeId | merchantTypeFilter}}</text>
								</view>		
									<view class='vip acea-row row-between-wrapper' :class='is_switch==true?"":"on"'>
										<view class='vip-money' v-if="item.vip_price && item.vip_price > 0">
											￥{{item.vip_price}}
											<image src='../static/images/vip.png'></image>
										</view>
										<view>已售{{item.sales}}{{item.unitName}}</view>
									</view>
									<view class="company">
										<text class='name line1'>{{item.merName}}</text>
										<view class="flex" @click.stop="goStore(item.merId)">
											进店
											<text class="iconfont icon-xiangyou"></text>
										</view>
									</view>
								</view>

							</view>
						</view>
						<view v-else class="goods">
							<WaterfallsFlow :wfList='productList' :type="1">
								<template slot-scope="{item}">
									<WaterfallsFlowItem :item="item" :type="1" :isStore="1" />
								</template>
							</WaterfallsFlow>
						</view>
					</view>
					<view class='loadingicon acea-row row-center-wrapper'>
						<text class='loading iconfont icon-jiazai'
							:hidden='loading==false'></text>{{productList.length>0?loadTitle:''}}
					</view>
				</view>
			</view>
			<view class='noCommodity top132'
				v-if="(productList.length==0 && isShow && where.page > 1 && tabIndex===1 && !loading ) ">
				<view class='pictrue'>
					<image :src="urlDomain+'crmebimage/presets/noSearch.png'"></image>
				</view>
				<text class="text-ccc">{{tabIndex===1?'暂无商品':'暂无店铺'}}</text>
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
		getCouponProList,
		getSystemCouponProList
	} from '@/api/product.js';
	import {
		couponReceiveApi
	} from '@/api/activity.js';
	import {
		mapGetters
	} from "vuex";
	import animationType from '@/utils/animationType.js'
	import WaterfallsFlow from '@/components/WaterfallsFlow/WaterfallsFlow.vue'
	import easyLoadimage from '@/components/base/easy-loadimage.vue';
	import WaterfallsFlowItem from '@/components/WaterfallsFlowItem/WaterfallsFlowItem.vue'
  import { goProductDetail } from "@/libs/order";
	let app = getApp();
	export default {
		computed: mapGetters(['uid']),
		components: {
			WaterfallsFlow,
			easyLoadimage,
			WaterfallsFlowItem
		},
		mounted() {},
		data() {
			return {
				urlDomain: this.$Cache.get("imgHost"),
				theme: app.globalData.theme,
				keyword: '',
				tabIndex: 1,
				productList: [],
				is_switch: true,
				where: {
					keyword: '',
					page: 1,
					limit: 20,
					userCouponId: 0,
					couponId: 0
				},
				loadend: false,
				loading: false,
				loadTitle: '加载更多',
				goodScroll: true,
				isShow: false,
				userCouponId: 0,
				minPrice: 0,
				money: 0,
				isUserReceive: false,
				type: '' //从何跳转来，1从领券中心跳入
			};
		},
		// 滚动监听
		onPageScroll(e) {
			// 传入scrollTop值并触发所有easy-loadimage组件下的滚动监听事件
			uni.$emit('scroll');
		},
		onLoad: function(options) {
			this.$store.dispatch('MerTypeList');
			this.type = options.type;
			this.minPrice = options.minPrice ? Number(options.minPrice) : 0;
			this.money = options.money ? Number(options.money) : 0;
			this.isUserReceive = JSON.parse(options.isUserReceive);
			if (options.type == 1) {
				this.where.couponId = options.userCouponId ? Number(options.userCouponId) : 0;
			} else {
				this.where.userCouponId = options.userCouponId ? Number(options.userCouponId) : 0;
			}
			this.get_product_list();
		},
		methods: {
      // 去详情页
      goDetail(item) {
        goProductDetail(item.id, 0, '');
      },
			//进店
			goStore(id) {
				uni.navigateTo({
					url: `/pages/merchant/home/index?merId=${id}`
				})
			},
			// 领取优惠券
			receiveCoupon(item) {
				let that = this;
				couponReceiveApi(this.where.couponId).then(res => {
					this.isUserReceive = true;
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
			searchSubmit: function(e) {
				let that = this;
				that.loadend = false;
				//	this.keyword = e.detail.value;
				that.$set(that, 'keyword', e.detail.value || '');
				// that.$set(that.where, 'keyword', e.detail.value);
				// that.$set(that.whereMer, 'keywords', e.detail.value);
				that.$set(that.where, 'page', 1)
				this.get_product_list(true);
			},
			confirm(data) {
				this.loadend = false;
			},
			goback() {
				// #ifdef H5
				return history.back();
				// #endif
				// #ifndef H5
				return uni.navigateBack({
					delta: 1,
				})
				// #endif
			},
			Changswitch: function() {
				let that = this;
				that.is_switch = !that.is_switch
			},
			//查找产品
			get_product_list: function(isPage) {
				let that = this;
				let methods = this.type == 1 ? getSystemCouponProList : getCouponProList;
				if (that.loadend) return;
				if (that.loading) return;
				if (isPage === true) that.$set(that, 'productList', []);
				that.loading = true;
				that.loadTitle = '';
				that.where.keyword = encodeURIComponent(that.keyword);
				methods(that.where).then(res => {
					let list = res.data.list;
					let productList = that.$util.SplitArray(list, that.productList);
					let loadend = list.length < that.where.limit;
					that.loadend = loadend;
					that.loading = false;
					that.loadTitle = loadend ? '已全部加载' : '加载更多';
					that.$set(that, 'productList', productList);
					that.$set(that.where, 'page', that.where.page + 1);
					this.isShow = true
				}).catch(err => {
					that.loading = false;
					that.loadTitle = '加载更多'
				})
			},
		},
		onReachBottom() {
			if (this.productList.length > 0) {
				this.get_product_list();
			}
		}
	}
</script>

<style scoped lang="scss">
	.listBox{
		background-color: #FFFFFF;
	}
	.titleBox {
		margin: 108rpx auto 20rpx;
		width: 702rpx;
		height: 80rpx;
		border-radius: 8rpx;
		position: relative;
		padding: 0 30rpx 0 50rpx;
		@include cate-two-btn(theme);
		@include coupons_border_color(theme);
		@include main_color(theme);

		.font1 {
			font-size: 30rpx;
			font-weight: 500;
		}

		.font2 {
			font-size: 44rpx;
			padding: 0 20rpx 0 4rpx;
			font-weight: 500;
		}

		.font3 {
			font-size: 28rpx;
		}

		._right {
			width: 125rpx;
			@include dashed_border_left(theme);

			._btn {
				width: 100rpx;
				height: 44rpx;
				border-radius: 22rpx;
				font-size: 20rpx;
				margin-left: 24rpx;
				color: #fff;
				@include linear-gradient(theme);
			}
		}

		.roll {
			position: absolute;
			width: 20rpx;
			height: 20rpx;
			border-radius: 50%;
			top: 50%;
			transform: translateY(-50%);
			background-color: #f5f5f5;
			@include coupons_border_color(theme);

			&.left-roll {
				left: -6rpx;
				@include white_left_border;
			}

			&.right-roll {
				right: -6rpx;
				@include white_right_border;
			}
		}
	}

	.company {
		display: flex;
		align-items: center;
		color: #737373 !important;
		font-size: 20rpx;
		margin-top: 10rpx;

		.name {
			display: inline-block;
			// width: 120rpx;
			height: auto !important;
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
		}

		.flex {
			display: flex;
			align-items: center;
			margin-left: 10rpx;
			color: #282828 !important;
			width: 100rpx;

			.iconfont {
				font-size: 16rpx;
				margin-top: 4rpx;
			}
		}
	}

	.icon-xiangzuo {
		color: #fff;
	}

	.goods {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		padding-left: 24rpx;
		background-color: #F5F5F5;
		width: 100%;
	}

	.proList {
		margin-top: 20rpx;

		::v-deep.texts {
			padding: 20rpx 20rpx 20rpx 25rpx !important;
		}
	}

	.merList {
		position: relative;
		top: 170rpx;
		z-index: 66;
	}

	.merBox {
		::v-deep.tui-drawer-container {
			width: 635rpx;
		}
	}

	.mer {
		&-nav {
			top: 80rpx !important;
			border-radius: inherit !important;
		}

		&-list {
			margin-top: 288rpx !important;
		}

		&-listBox {
			position: relative;
			top: -68rpx;
		}

		&-mt194 {
			margin-top: 286rpx !important;
		}

		&-mt100 {
			top: -200rpx !important;
		}
	}

	.no-shop {
		margin-top: 6rpx;
		background-color: #fff;
		padding-bottom: calc(100% - 109rpx);

		.pictrue {
			display: flex;
			flex-direction: column;
			align-items: center;

			//color: $uni-nothing-text;
			image {
				width: 414rpx;
				height: 380rpx;
			}
		}
	}

	.store-item {
		margin-bottom: 30rpx;
		padding: 24rpx 30rpx 30rpx 30rpx;
		background-color: #fff;

		.head {
			display: flex;
			justify-content: space-between;

			.left-wrapper {
				display: flex;
				align-items: center;

				.logo {
					width: 92rpx;
					height: 92rpx;

					image {
						width: 92rpx;
						height: 92rpx;
						border-radius: 6rpx;
					}
				}

				.con-box {
					margin-left: 20rpx;

					.font-bg-red {
						width: max-content;
						white-space: nowrap;
						font-size: 18rpx;
						padding: 2rpx 10rpx;
						color: #FFFFFF;
						@include main_bg_color(theme);
						border-radius: 13rpx;

					}

					.name {
						font-size: 30rpx;
						color: #333;
						font-weight: bold;
						margin-bottom: 10rpx;

						.mer_name {
							max-width: 400rpx;
						}
					}
				}
			}

			.link {
				width: 114rpx;
				height: 50rpx;
				line-height: 50rpx;
				@include linear-gradient(theme);
				border-radius: 25rpx;
				text-align: center;
				color: #fff;
				font-size: 24rpx;
			}
		}

		.pic-wrapper {
			display: flex;
			margin-top: 30rpx;

			.pic-item {
				position: relative;
				width: 214rpx;
				height: 214rpx;
				margin-right: 24rpx;

				image {
					width: 214rpx;
					height: 214rpx;
					border-radius: 16rpx;
				}

				.price {
					position: absolute;
					right: 0;
					bottom: 0;
					height: 36rpx;
					padding: 0 10rpx;
					line-height: 36rpx;
					text-align: center;
					background: rgba(0, 0, 0, .5);
					border-radius: 16rpx 2rpx 16rpx 2rpx;
					color: #fff;
					font-size: 24rpx;

					text {
						font-size: 18rpx;
					}
				}

				&:nth-child(3n) {
					margin-right: 0;
				}
			}
		}
	}

	.with50 {
		width: 50% !important;
	}

	.nav-wrapper {
		z-index: 9;
		position: fixed;
		left: 0;
		top: 86rpx;
		width: 100%;
		@include main_bg_color(theme);

		.tab-bar {
			display: flex;
			align-items: center;
			height: 100rpx;

			.tab-item {
				position: relative;
				flex: 1;
				display: flex;
				justify-content: center;
				align-items: center;
				padding-bottom: 40rpx;
				color: #fff;
				font-size: 28rpx;
				font-weight: bold;

				&::after {
					content: ' ';
					position: absolute;
					left: 50%;
					bottom: 34rpx;
					width: 60rpx;
					height: 3rpx;
					background: transparent;
					transform: translateX(-50%);
				}

				&.on {
					&::after {
						background: #fff;
					}
				}
			}
		}
	}

	.bg_color {
		@include main_bg_color(theme);
	}

	.font_color {
		@include main_color(theme);
	}

	.x-money {
		font-size: 24rpx;
		@include price_color(theme);
	}

	.iconfont {
		//color: #fff;
	}

	.fixed-top {
		position: fixed;
		top: 0;
		left: 0;
		z-index: 9;
	}

	.productList .search {
		width: 100%;
		height: 86rpx;
		padding: 0 24rpx;
		box-sizing: border-box;
		position: fixed;
		top: 0 !important;
		left: 0;
		z-index: 9;
		color: #fff;

	}

	.productList .search .input {
		/* #ifdef H5 */
		width: 570rpx;
		/* #endif */
		/* #ifndef H5 */
		width: 94%;
		/* #endif */
		height: 60rpx;
		background-color: #fff;
		border-radius: 50rpx;
		padding: 0 20rpx;
		box-sizing: border-box;
		color: #333;
	}

	.productList .search .input input {
		width: 464rpx;
		height: 100%;
		font-size: 26rpx;
		margin-left: 20rpx;
	}

	.productList .search .input .placeholder {
		color: #CCCCCC;
	}

	.productList .search .input .iconfont {
		font-size: 26rpx;
		color: #999999;
	}

	.productList .search .icon-yangshi1,
	.icon-shaixuan {
		color: #fff;
		width: 62rpx;
		font-size: 40rpx;
		height: 86rpx;
		line-height: 86rpx;
		text-align: right;
	}

	.productList .nav {
		height: 86rpx;
		color: #454545;
		position: fixed;
		left: 0;
		width: 100%;
		font-size: 28rpx;
		background-color: #fff;
		top: 154rpx;
		z-index: 9;
		border-radius: 16rpx 16rpx 0rpx 0rpx;
	}

	.productList .nav .item {
		width: 25%;
		text-align: center;

		.iconfont {
			//color: #fff;
		}
	}

	.productList .nav .item.font-color {
		font-weight: bold;
	}

	.productList .nav .item image {
		width: 15rpx;
		height: 19rpx;
		margin-left: 10rpx;
	}


	.productList .list.on {
		margin-top: 0 !important;
		background-color: #fff;
		border-top: 1px solid #F5F5F5;
		padding-top: 20rpx;
	}

	.productList .list .item {
		width: 335rpx;
		background-color: #fff;
		border-radius: 14rpx;
		margin-bottom: 20rpx;
	}

	.productList .list .item.on {
		width: 100%;
		display: flex;
		padding: 0 0rpx 60rpx 0rpx;
		margin: 0;
		border-radius: 14rpx;
	}

	.productList .list .item .pictrue {
		position: relative;
		// width: 100%;
	}

	.productList .list .item .pictrue ::v-deep.easy-loadimage {
		width: 240rpx;
		height: 240rpx;
		border-radius: 14rpx;
		overflow: hidden;
	}

	.productList .list .item .pictrue image {
		width: 100%;
		height: 100%;
		border-radius: 20rpx 20rpx 0 0;
		overflow: hidden;
	}

	.productList .list .item .pictrue image.on {
		border-radius: 6rpx;
	}

	.productList .list .item .text {
		padding: 18rpx 20rpx;
		font-size: 30rpx;
		color: #222;
	}

	.productList .list .item .text.on {
		width: 456rpx;
		padding: 0 0 0 20rpx;
		position: relative;

		&::after {
			content: '';
			display: block;
			width: 94%;
			border-bottom: 1rpx solid #f6f6f6;
			position: absolute;
			right: 2rpx;
			bottom: -24rpx;
		}
        
		.name {
			height: 84rpx;
		}
	}

	.productList .list .item .text .money {
		font-size: 26rpx;
		font-weight: bold;
		margin-top: 8rpx;
	}

	.productList .list .item .text .money.on {
		margin-top: 50rpx;
	}

	.productList .list .item .text .money .num {
		font-size: 34rpx;
	}

	.productList .list .item .text .vip {
		font-size: 22rpx;
		color: #aaa;
		margin-top: 7rpx;
	}

	.productList .list .item .text .vip .vip-money {
		font-size: 24rpx;
		color: #282828;
		font-weight: bold;
	}

	.productList .list .item .text .vip .vip-money image {
		width: 46rpx;
		height: 21rpx;
		margin-left: 4rpx;
	}

	.noCommodity {
		padding-bottom: 30rpx;
		position: relative;
		// top: -112rpx;
	}

	.top104 {
		top: -80rpx;
	}

	.top132 {
		top: 162rpx;
	}
</style>