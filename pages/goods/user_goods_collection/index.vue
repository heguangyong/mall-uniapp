<template>
	<view :data-theme="theme">
		<view class='collectionGoods' v-if="collectProductList.length">
            <view class="placeholders"></view>
			<view class="borderPad navbox">
				<view class='nav acea-row row-between-wrapper'>
					<view>当前共 <text class='num font_color'>{{ totals }}</text>件商品</view>
					<view class='administrate acea-row row-center-wrapper' @click='manage'>{{ footerswitch ? '管理' : '取消'}}
					</view>
				</view>
			</view>

			<view class="list">
				<checkbox-group @change="checkboxChange" class="centent">
					<!-- #ifndef APP-PLUS-->
					<view v-for="(item,index) in collectProductList" :key="index" class='item acea-row row-middle'>
						<checkbox :value="item.productId.toString()" :checked="item.checked" v-if="!footerswitch"
							style="margin-right: 10rpx;" />
						<view @click="handleProductDetail(item)" class="acea-row">
							<view class='pictrue'>
								<image :src="item.image"></image>
								<view v-if="item.activityStyle" :style="{ backgroundImage: `url(${item.activityStyle})` }" class="border-picture"></view>
							</view>
							<view>
								<view class='name line1 text-28rpx' :class="item.isShow?'':'text--w111-ccc'">{{item.name}}</view>
								<view class='money text-26rpx' v-if="item.isShow">￥{{item.price}}</view>
								<view v-else class="text--w111-ccc text-24rpx">该商品已下架</view>
							</view>
						</view>
					</view>
					<!-- #endif -->
					<!-- #ifdef APP-PLUS -->
					<view v-for="(item,index) in collectProductList" :key="index" :data-index="index"
						class='item acea-row row-middle order-item'>
						<view @click="handleProductDetail(item)" class="acea-row">
							<view class='pictrue m-30'>
								<image :src="item.image"></image>
								<view v-if="item.activityStyle" :style="{ backgroundImage: `url(${item.activityStyle})` }" class="border-picture"></view>
							</view>
							<view>
								<view class='name line1 text-28rpx' :class="item.isShow?'':'text--w111-ccc'">{{item.name}}</view>
								<view v-if="item.isShow" class='money text-26rpx'>￥{{item.price}}</view>
								<view v-else class="text--w111-ccc text-24rpx">该商品已下架</view>
							</view>
						</view>
						<view class="remove borRadius14" @tap="delCollection(item.productId)">删除</view>
					</view>
					<!-- #endif -->
				</checkbox-group>
			</view>
			<view class='loadingicon acea-row row-center-wrapper'>
				<text class='loading iconfont icon-jiazai' :hidden='loading==false'></text>{{loadTitle}}
			</view>
			<view v-if="!footerswitch" class='footer acea-row row-between-wrapper'>
				<view>
					<checkbox-group @change="checkboxAllChange">
						<checkbox value="all" :checked="!!isAllSelect" />
						<text class='checkAll'>全选</text>
					</checkbox-group>
				</view>
				<view class='button acea-row row-middle'>
					<form @submit="delCollectionAll" report-submit='true'>
						<button class='bnt cart-color' formType="submit">取消收藏</button>
					</form>
				</view>
			</view>
		</view>
		<view class='noCommodity' v-else-if="!collectProductList.length && page > 1">
			<view class='pictrue'>
        <image :src="urlDomain+'crmebimage/presets/noguanzhu.png'"></image>
				<view class="text-ccc">收藏列表为空哦~</view>
			</view>
			<recommend ref="recommendIndex"></recommend>
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
		getCollectUserList,
		getProductHot,
		collectCancel
	} from '@/api/product.js';
	import {
		mapGetters
	} from "vuex";
	import {
		toLogin
	} from '@/libs/login.js';
	import recommend from "@/components/base/recommend.vue";
		import {
	    goProductDetail
		} from '@/libs/order.js'
	let app = getApp();
	export default {
		components: {
			recommend
		},
		data() {
			return {
        urlDomain: this.$Cache.get("imgHost"),
				footerswitch: true,
				hostProduct: [],
				loadTitle: '加载更多',
				loading: false,
				loadend: false,
				collectProductList: [],
				limit: 20,
				page: 1,
				hotScroll: false,
				hotPage: 1,
				hotLimit: 10,
				isAllSelect: false, //全选
				selectValue: [], //选中的数据
				delBtnWidth: 80, //左滑默认宽度
				totals: 0,
				theme:app.globalData.theme,
			};
		},
		computed: mapGetters(['isLogin']),
		onLoad() {
			let that = this;
			if (this.isLogin) {
				this.loadend = false;
				this.page = 1;
				this.collectProductList = [];
				this.get_user_collect_product();
			} else {
				toLogin();
			}
		},
		onShow() {
			this.loadend = false;
			this.page = 1;
			this.collectProductList = [];
			this.get_user_collect_product();
		},
		methods: {
			//去商品详情
			handleProductDetail(item){
				if(item.isShow)goProductDetail(item.productId, 0, '');
			},
			manage: function() {
				this.footerswitch = !this.footerswitch;
			},

			checkboxChange: function(event) {
				var items = this.collectProductList,
					values = event.detail.value;
				for (var i = 0, lenI = items.length; i < lenI; ++i) {
					const item = items[i]
					if (values.includes(item.productId.toString())) {
						this.$set(item, 'checked', true)
					} else {
						this.$set(item, 'checked', false)
					}
				}
				this.selectValue = values.toString();
				this.isAllSelect = items.length === values.length;
			},
			checkboxAllChange: function(event) {
				let value = event.detail.value;
				if (value.length > 0) {
					this.setAllSelectValue(1)
				} else {
					this.setAllSelectValue(0)
				}
			},
			setAllSelectValue: function(status) {
				let selectValue = [];
				if (this.collectProductList.length > 0) {
					this.collectProductList.map(item => {
						if (status) {
							this.$set(item, 'checked', true)
							selectValue.push(item.productId);
							this.isAllSelect = true;
						} else {
							this.$set(item, 'checked', false)
							this.isAllSelect = false;
						}
					});
					this.selectValue = selectValue.toString();
				}
			},
			/**
			 * 获取收藏产品
			 */
			get_user_collect_product: function() {
				let that = this;
				if (this.loading) return;
				if (this.loadend) return;
				that.loading = true;
				that.loadTitle = "";
				getCollectUserList({
					page: that.page,
					limit: that.limit
				}).then(res => {
					res.data.list.map(item => {
						that.$set(item, 'right', 0);
					});
					that.totals = res.data.total;
					let collectProductList = res.data.list;
					let loadend = collectProductList.length < that.limit;
					that.collectProductList = that.$util.SplitArray(collectProductList, that
						.collectProductList);
					that.$set(that, 'collectProductList', that.collectProductList);
					that.loadend = loadend;
					that.loadTitle = loadend ? '我也是有底线的' : '加载更多';
					that.page = that.page + 1;
					that.loading = false;
				}).catch(err => {
					that.loading = false;
					that.loadTitle = "加载更多";
				});
			},
			/**
			 * 取消收藏
			 */
			delCollection: function(id, index) {
				this.selectValue = id;
				this.del({
					ids: this.selectValue.toString()
				});
			},
			delCollectionAll: function() {
				if (!this.selectValue || this.selectValue.length == 0) return this.$util.Tips({
					title: '请选择商品'
				});
				this.del({
					ids: this.selectValue
				});
			},
			del: function(data) {
				collectCancel(data).then(res => {
					this.$util.Tips({
						title: '取消收藏成功',
						icon: 'success'
					});
					this.selectValue = [];
					// this.collectProductList = this.collectProductList.filter(item=>item!==this.selectValue)
					this.collectProductList = [];
					this.loadend = false;
					this.page = 1;
					this.get_user_collect_product();
				}).catch(err => {
					return this.$util.Tips({
						title: err
					})
				});
			}
		},
		/**
		 * 页面上拉触底事件的处理函数
		 */
		onReachBottom() {
			this.get_user_collect_product();
			if(!this.collectProductList.length && this.page > 1){
				this.$refs.recommendIndex.get_host_product();
			}

		},
		// 滚动监听
		onPageScroll(e) {
			// 传入scrollTop值并触发所有easy-loadimage组件下的滚动监听事件
			uni.$emit('scroll');
		}
	}
</script>

<style scoped lang="scss">
	.placeholders{
		height: 30rpx;
		background-color: #f5f5f5;
		width: 100%;
		position: fixed;
		z-index: 111;
	}
	.money{
		font-size: 26rpx;
		@include price_color(theme);
	}
	.order-item {
		width: 100%;
		display: flex;
		position: relative;
		align-items: right;
		flex-direction: row;
	}

	.remove {
		width: 120rpx;
		height: 40rpx;
		@include main_bg_color(theme);
		color: #fff;
		position: absolute;
		bottom: 30rpx;
		right: 60rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 24rpx;
	}

	.collectionGoods {
        .navbox{
			width: 100%;
			height: 90rpx;
		}
		.nav {
			width: 93.5%;
			height: 90rpx;
			background-color: #fff;
			padding: 0 24rpx;
			-webkit-box-sizing: border-box;
			box-sizing: border-box;
			font-size: 28rpx;
			color: #282828;
			position: fixed;
			z-index: 5;
			top: 30rpx;
			border-bottom: 1px solid #EEEEEE;
			border-top-left-radius: 14rpx;
			border-top-right-radius: 14rpx;
		}

		.list {
			padding: 0 24rpx;
			.name {
				width: 434rpx;
				/* #ifdef APP-PLUS */
				width: 486rpx;
				/* #endif */
				margin-bottom: 56rpx;
			}
		}

		.centent {
			/* #ifdef H5 || MP */
			background-color: #fff;
			/* #endif */
			border-bottom-left-radius: 14rpx;
			border-bottom-right-radius: 14rpx;
			padding: 24rpx 0;
		}
	}

	.collectionGoods .item {
		background-color: #fff;
		padding-left: 24rpx;
		padding-top: 24rpx;
		border-radius: 14rpx;
		margin-bottom: 30rpx;

	}
	.collectionGoods .item:nth-last-child(1){
		margin-bottom: 0;
	}

	.collectionGoods .item .pictrue {
		width: 130rpx;
		height: 130rpx;
		margin-right: 20rpx;
		position: relative;
	}

	.collectionGoods .item .pictrue image {
		width: 100%;
		height: 100%;
		border-radius: 14rpx;
	}

	.collectionGoods .item .text {
		width: 535rpx;
		height: 130rpx;
		font-size: 28rpx;
		color: #282828;
	}

	.collectionGoods .item .text .name {
		width: 100%;
	}

	.collectionGoods .item .text .delete {
		font-size: 26rpx;
		color: #282828;
		width: 144rpx;
		height: 46rpx;
		border: 1px solid #bbb;
		border-radius: 4rpx;
		text-align: center;
		line-height: 46rpx;
	}

	.footer {
		z-index: 9;
		width: 100%;
		height: 96rpx;
		background-color: #fff;
		position: fixed;
		padding: 0 30rpx;
		box-sizing: border-box;
		border-top: 1rpx solid #eee;
		border-bottom: 1px solid #EEEEEE;
		/* #ifdef H5 || MP */
		bottom: 0rpx;
		/* #endif */
		/* #ifdef APP-PLUS */
		bottom: 0;

		/* #endif */
		/* #ifndef MP || APP-PLUS */
		// bottom: 98rpx;
		// bottom: calc(98rpx + constant(safe-area-inset-bottom)); ///兼容 IOS<11.2/
		// bottom: calc(98rpx + env(safe-area-inset-bottom)); ///兼容 IOS>11.2/
		/* #endif */
		.checkAll {
			font-size: 28rpx;
			color: #282828;
			margin-left: 16rpx;
		}

		.button .bnt {
			font-size: 28rpx;
			color: #999;
			border-radius: 30rpx;
			border: 1px solid #999;
			width: 160rpx;
			height: 60rpx;
			text-align: center;
			line-height: 60rpx;
		}
	}
	.font_color{
		@include main_color(theme);
	}
	::v-deep checkbox .uni-checkbox-input.uni-checkbox-input-checked {
		@include main_bg_color(theme);
		@include coupons_border_color(theme);
		color: #fff!important
	}

	::v-deep checkbox .wx-checkbox-input.wx-checkbox-input-checked {
		@include main_bg_color(theme);
		@include coupons_border_color(theme);
		color: #fff!important;
		margin-right: 0 !important;
	}
	.default_txt {
		font-size: 26rpx;
		color: #999;
		text-align: center;
	}
	.m-30 {
		margin-bottom: 24rpx;
	}
</style>
