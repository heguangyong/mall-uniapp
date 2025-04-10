<template>
	<view class="activity-box">
		<view class="activity_header"
			:style="{'background-image': pointsgoodsImg}">
			<!-- #ifndef H5 -->
			<view class='cart_nav'>
				<nav-bar navTitle="热门推荐" iconColor='#fff' :backgroundColor="backgroundColor"
					:isBackgroundColor="isBackgroundColor" ref="navBarRef"></nav-bar>
			</view>
			<!-- #endif -->
			
		</view>
		<view class="list-box" :style="{'z-index':listZindex}"  @touchstart="touchStart">
			<view class="list-item" v-for="(item, index) in integralGood" :key="index">
				<view class="group-bottom acea-row row-between" @click="toGroupDeatil(item)">
					<view class="group-bottom-left relative">
						<view v-show="item.stock===0" class="sellOut">已售罄</view>
						<easy-loadimage :image-src="item.image" width="220rpx" height="220rpx"
							:radius="10"></easy-loadimage>
					</view>
					<view class="group-bottom-right acea-row row-column row-between w-210">
						<view class="title line2 h-80 lh-40rpx mb-46rpx mt-12">{{item.name}}</view>
						<PointsPrice :pointsPrice="item" :pointsGoodsStyle="hotPointsStyle"></PointsPrice>
						<view class="right-bottom acea-row  row-between mt-20rpx pos-rel">
							<view class="sales text-24rpx text-999">已有{{item.sales}}人兑换</view>
							<view class="btn-box mt-0 lh-56rpx h-56 px-32 abs-rb">
								<view class="btn f-s-26">去兑换</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	/**
	 * 积分商品推荐样式
	 */
	import {
		goProductDetail
	} from "../../../libs/order";

	export const hotPointsStyle = {
		iconStyle: {
			width: '32rpx',
			height: '32rpx'
		},
		priceStyle: {
			fontSize: '32rpx',
		},
		unitStyle: {
			fontSize: '28rpx',
		},
	}
	import {
		integralProductHotApi,
	} from '@/api/activity.js'
	import navBar from '@/components/navBar';
	import priceStyle from '@/components/priceStyle'
	import easyLoadimage from '@/components/base/easy-loadimage.vue';
	import PointsPrice from '@/components/PointsPrice.vue';
	let app = getApp();
	export default {
		components: {
			navBar,
			priceStyle,
			easyLoadimage,
			PointsPrice
		},
		data() {
			return {
				urlDomain: this.$Cache.get("imgHost"),
				hotPointsStyle: hotPointsStyle,
				theme: app.globalData.theme,
				backgroundColor: 'transparent',
				isBackgroundColor: false,
				headerZindex: 9,
				listZindex: 99,
				where: {
					page: 1,
					limit: 10,
				},
				loadend: false,
				loading: false,
				loadTitle: '加载更多',
				integralGood: []
			}
		},
		computed: {
			// #ifdef APP-PLUS || MP
			pointsgoodsImg() {
				return 'url(' + this.urlDomain + 'crmebimage/presets/pointsgoods.png' + ')'
			},
			// #endif
			// #ifdef H5
			pointsgoodsImg() {
				return 'url(' + this.urlDomain + 'crmebimage/presets/pointsgoodsh5.png' + ')'
			},
			// #endif
		},
		onLoad() {
			this.getIntegralList();
		},
		methods: {
      //滚动
      touchStart() {
        this.$refs.navBarRef.currentPage = false;
      },
			//积分商品列表
			getIntegralList() {
				if (this.loadend) return;
				if (this.loading) return;
				this.loading = true;
				integralProductHotApi(this.where).then(res => {
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
			onPageScroll(e) {
				if (e.scrollTop > 130) {
					this.backgroundColor = '#E93323';
					this.listZindex = 9
					this.headerZindex = 99
				} else {
					this.backgroundColor = 'transparent';
					this.listZindex = 99
					this.headerZindex = 9
				}
				// 传入scrollTop值并触发所有easy-loadimage组件下的滚动监听事件
				uni.$emit('scroll');
			},
			//to积分详情
			toGroupDeatil(item) {
				goProductDetail(item.id, 0, '', 1)
			}
		},
		onReachBottom() {
			this.getIntegralList();
		}
	}
</script>

<style lang="scss" scoped>
	.activity_header{
		/* #ifndef MP */
		height: 438rpx !important;
		/* #endif */
		/* #ifdef MP */
		height: 550rpx !important;
		/* #endif */
	}
	.list-box {
		background: linear-gradient(0deg, #F5F5F5 0%, rgba(255, 255, 255, 0) 100%) !important;
		top: -170rpx !important;
	}

	.mb-46rpx {
		margin-bottom: 42rpx;
	}

	.group-bottom {
		padding: 24rpx !important;
	}

	.btn-box {
		background: #FFF3E5;
		border-radius: 29rpx 29rpx 29rpx 29rpx;
		color: #FF8C00;
	}

	@import "../static/css/activity.scss";
</style>