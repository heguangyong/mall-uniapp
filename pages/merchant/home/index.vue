<template>
	<view id="home" :data-theme="theme">
		<home-index v-if="tabActive == 0 && merId" :merId="merId" :diyId="diyId" :isScrolled="isScrolled"></home-index>
		<coupon-and-classify v-if="tabActive >0 && merId" :tabActive="tabActive" :merId="merId"></coupon-and-classify>


		<view class="footer">
			<view v-for="(item, index) in tabs" :key="index" :class="{ active: tabActive === index }" class="item"
				@click="handleChangetab(index)">
				<view :class="['iconfont', item.icon]"></view>
				<view>{{ item.name }}</view>
			</view>
			<view class="item" @click="handleCustomer">
				<view class="iconfont icon-kefu_o"></view>
				<view>联系客服</view>
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
		chatConfig
	} from '@/utils/consumerType.js'
	import tuiSkeleton from '@/components/base/tui-skeleton.vue';
	import homeIndex from './components/homeIndex.vue';
	import couponAndClassify from '../components/couponAndClassify/index.vue';
	import {
		getMerIndexInfoApi,
	} from '@/api/merchant.js';
	import {
		getShare
	} from '@/api/public.js';
	import {
		mapGetters
	} from "vuex";
	import {
		silenceBindingSpread,
	} from '@/utils/index.js';

	const arrTemp = ["beforePay", "afterPay", "createBargain", "pink"];
	var statusBarHeight = uni.getSystemInfoSync().statusBarHeight + 'px';
	let app = getApp();
	export default {
		computed: mapGetters(['isLogin', 'uid', 'globalData', 'bottomNavigationIsCustom']),
		components: {
			tuiSkeleton,
			homeIndex,
			couponAndClassify
		},
		data() {
			return {
				urlDomain: this.$Cache.get("imgHost"),
				isNoCommodity: false,
				isScrolled: false, //是否开始滚动
				showSkeleton: true, //骨架屏显示隐藏
				isNodes: 0, //控制什么时候开始抓取元素节点,只要数值改变就重新抓取
				statusBarHeight: statusBarHeight,
				navIndex: 0, //判断首页显示内容，1显示分类页和商品，0首页
				site_name: '', //首页title
				configApi: {}, //分享类容配置
				theme: app.globalData.theme,
				imgHost: '', //图片域名地址
				wxText: "点击添加到我的小程序，微信首页下拉即可访问商城。",
				// #ifdef APP-PLUS || MP
				isFixed: true,
				// #endif
				// #ifdef H5
				isFixed: false,
				// #endif
				domOffsetTop: 50,
				domHeight: 0,
				styleConfig: [], //DIY数据
				diyId: 0, //DIYID
				homeCombData: {}, //组合组件数据
				showHomeComb: false, //是否显示组合
				showHeaderSerch: false, //是否显示搜索框
				headerSerchCombData: {}, //搜索框对象
				bgPic: '', //背景图片
				bgTabVal: '', //背景图片样式
				windowHeight: 0,
				pageStyle: {},
				isDefault: 1, //是否首页，1是，0不是

				merchantInfo: {},
				merId: 0,
				// 底部菜单
				tabs: [{
						icon: 'icon-yizhan_o',
						name: '首页',
					},
					{
						icon: 'icon-yingyongAPP_o',
						name: '分类'
					},
					{
						icon: 'icon-huobiliu_o',
						name: '领券'
					}
				],
				tabActive: 0, // 底部切换
			}
		},
		onLoad(options) {
			if (options.hasOwnProperty('merId') || options.scene) {
				if (options.scene) { // 仅仅小程序扫码进入
					this.merId = this.globalData.merId ? this.globalData.merId : 0;
				} else {
					this.merId = options.merId ? parseInt(options.merId) : 0;
				}
			}
			if (options.hasOwnProperty('id') || options.scene) {
				if (options.scene) { // 仅仅小程序扫码进入
					this.diyId = this.globalData.id ? this.globalData.id : 0;
				} else {
					this.diyId = options.id ? parseInt(options.id) : 0;
				}
			}
			//分销码
            if(options.sd) this.$store.commit('Change_Spread', options.sd);
            this.getMerIndexInfo()
			let that = this;
			this.$nextTick(function() {
				uni.getSystemInfo({
					success: function(res) {
						that.windowHeight = res.windowHeight;
					}
				});
			})
		},
		// #ifdef MP
		/**
		 * 用户点击右上角分享到朋友圈
		 */
		onShareTimeline() {
			return {
				title: this.merchantInfo.name,
				imageUrl: this.merchantInfo.avatar,
        query: `merId=${this.merId}&sd=${this.uid}`
			};
		},
		/**
		 * 用户点击右上角分享
		 */
		onShareAppMessage() {
			return {
				title: this.merchantInfo.name,
				imageUrl: this.merchantInfo.avatar,
				path: `/pages/merchant/home/index?merId=${this.merId}&sd=${this.uid}`
			};
		},
		// #endif
		// 滚动监听
		onPageScroll(e) {
			// 传入scrollTop值并触发所有easy-loadimage组件下的滚动监听事件
			uni.$emit('scroll');
			if (e.scrollTop > this.domOffsetTop) {
				this.isScrolled = true;
			}
			if (e.scrollTop < this.domOffsetTop) {
				this.$nextTick(() => {
					this.isScrolled = false;
				});
			}
		},
		methods: {
			//客服跳转
			handleCustomer: function() {
				chatConfig(this.merchantInfo);
			},
			//商户信息
			getMerIndexInfo() {
				let that = this;
				getMerIndexInfoApi(this.merId).then(res => {
					this.merchantInfo = res.data
					uni.setNavigationBarTitle({
						title: res.data.name
					})
					this.$store.commit('MERCHANTJINFO', res.data);
					this.skeletonShow = false;
				}).catch(err => {
					that.loading = false;
					that.loadTitle = '加载更多';
					this.skeletonShow = false;
				});
			},
			//底部切换
			handleChangetab(param) {
				this.tabActive = param;
			},

			//清除骨架屏
			reloadData() {
				this.showSkeleton = false;
			},
			shareApi: function() {
				getShare().then(res => {
					this.$set(this, 'configApi', res.data);
					this.$set(this, "site_name", res.data.title);
					uni.setNavigationBarTitle({
						title: this.site_name
					})
					// #ifdef H5
					this.setOpenShare(res.data);
					// #endif
				})
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
		onShow() {
			//分销绑定
			silenceBindingSpread(this.isLogin, this.globalData.spread);
		},
		mounted() {
			let query = uni.createSelectorQuery().in(this);
			query.select("#home").boundingClientRect();
			query.exec(res => {
				this.domHeight = res[0].height;
			})
		},
		onReachBottom() {
			// this.$refs.recommendIndex.get_host_product();
		}
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
	.footer {
		position: fixed;
		bottom: 0;
		left: 0;
		z-index: 999;
		display: flex;
		width: 100%;
		padding-top: 12rpx;
		padding-bottom: constant(safe-area-inset-bottom); ///兼容 IOS<11.2/

		padding-bottom: env(safe-area-inset-bottom); ///兼容 IOS>11.2/

		background-color: #FFFFFF;
		opacity: 0.96;

		.item {
			flex: 1;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			font-weight: 500;
			font-size: 20rpx;
			color: #282828;

			.iconfont {
				font-size: 43rpx !important;
			}
		}

		.active {
			@include main_color(theme);
		}
	}
</style>