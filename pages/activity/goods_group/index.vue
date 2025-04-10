<template>
	<view class="activity-box">
		<view class="activity_header"
			:style="{'background-image':`url(${urlDomain+'crmebimage/presets/group_list_bg.png'})`}">
			<view class='cart_nav'>
				<nav-bar navTitle="拼团列表" iconColor='#fff' :backgroundColor="backgroundColor"
					:isBackgroundColor="isBackgroundColor" ref="navBarRef"></nav-bar>
			</view>
		</view>
		<view class="list-box" :style="{'z-index':listZindex}"  @touchstart="touchStart">
			<view class="list-item" v-for="(item, index) in groupGood" :key="index">
				<view class="group-bottom acea-row row-between" @click="toGroupDeatil(item)">
					<view class="group-bottom-left">
						<view class="img acea-row row-center row-middle relative">
							<view v-show="item.quota===0" class="sellOut">已售罄</view>
							<easy-loadimage :image-src="item.imageUrl" width="240rpx" height="240rpx"
								:radius="10"></easy-loadimage>
							<!-- <image :src="item.imageUrl" mode=""></image> -->
						</view>
					</view>
					<view class="group-bottom-right acea-row row-column row-between">
						<view class="right-top">
							<view class="title line2">
								{{item.productName}}
							</view>
							<view class="pink acea-row">
								<view class="people">{{item.buyCount}}人团</view>
								<view class="groupNum">已拼{{item.latestBuyCount}}份</view>
							</view>
						</view>
						<view class="right-bottom acea-row  row-between">
							<view class="price">
								<view class="pinkNum"><text class="pinkNum-title">拼团价</text>
									<priceStyle :price="item.activePrice"></priceStyle>
								</view>
								<view class="num regular num-icon">￥{{item.price}}</view>
							</view>
							<view class="btnBox">
								<view class="btn">参与拼团</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<emptyPage :mTop="'30%'" v-if="groupGood.length==0" title="暂无拼团商品，去看看其他商品吧~～"
				:imgSrc="urlDomain+'crmebimage/presets/noActivity.png'"></emptyPage>
		</view>
	</view>
</template>

<script>
	import {
		silenceBindingSpread,
		getUserSpread
	} from '@/utils/index.js';
	import navBar from '@/components/navBar';
	import priceStyle from '@/components/priceStyle'
	import easyLoadimage from '@/components/base/easy-loadimage.vue';
	import {
		groupBuySkuListApi,
		groupbuyMerchantListApi
	} from '@/api/group';
	import {
		mapGetters
	} from "vuex";
	import emptyPage from '@/components/emptyPage.vue'
	import useActivity from "@/mixins/useActivity";
  import onShare from "@/mixins/onShare";
	let app = getApp();
	export default {
		mixins: [useActivity,onShare],
		computed: mapGetters(['isLogin', 'uid', 'globalData']),
		components: {
			navBar,
			priceStyle,
			easyLoadimage,
			emptyPage
		},
		data() {
			return {
				urlDomain: this.$Cache.get("imgHost"),
				theme: this.$Cache.get("theme"),
				backgroundColor: 'transparent',
				isBackgroundColor: false,
				listZindex: 99,
				where: {
					page: 1,
					limit: 10,
					merId: ''
				},
				loadend: false,
				loading: false,
				loadTitle: '加载更多',
				groupGood: [],
				merId: 0, //商户id
        title: '拼团列表'
			}
		},
		onLoad(options) {
			//分销码
			getUserSpread(options);
			
			if (options.merId) {
				this.merId = Number(options.merId)
				this.where.merId = this.merId
			}
			this.getGroupList()
		},
		onShow() {
			//分销绑定
			silenceBindingSpread(this.isLogin, this.globalData.spread);
		},
		onPageScroll(object) {
			if (object.scrollTop > 200) {
				this.pageScrollStatus = true;
			} else if (object.scrollTop < 200) {
				this.pageScrollStatus = false;
			}
			uni.$emit('scroll');
		},
		methods: {
      //滚动
      touchStart() {
        this.$refs.navBarRef.currentPage = false;
      },
			//拼团商品列表
			getGroupList() {
				if (this.loadend) return;
				if (this.loading) return;
				this.loading = true;
				if (this.merId != 0) {
					groupbuyMerchantListApi(this.where).then(res => {
						let list = res.data.list;
						let limit = this.where.limit;
						this.where.page++;
						this.loadend = limit > list.length;
						this.groupGood = this.groupGood.concat(list);
						this.loading = false;
						this.loadTitle = this.loadend ? '没有更多内容啦~' : '加载更多';
					}).catch(err => {
						this.loading = false;
						this.loadTitle = '加载更多';
						return this.$util.Tips({
							title: err
						});
					})
				} else {
					groupBuySkuListApi(this.where).then(res => {
						let list = res.data;
						let limit = this.where.limit;
						this.where.page++;
						this.loadend = limit > list.length;
						this.groupGood = this.groupGood.concat(list);
						this.loading = false;
						this.loadTitle = this.loadend ? '没有更多内容啦~' : '加载更多';
					}).catch(err => {
						this.loading = false;
						this.loadTitle = '加载更多';
						return this.$util.Tips({
							title: err
						});
					})
				}

			},
			//to拼团详情
			toGroupDeatil(item) {
				uni.navigateTo({
					url: `/pages/goods/goods_details/index?id=${item.productId}&mt=2&gd=${item.groupActivityId}`
				})
			},
			onReachBottom() {
				this.getGroupList();
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import "../static/css/activity.scss";

	.num-icon,
	.icon-num {
		font-size: 24rpx !important;
		line-height: 32rpx !important;
		margin-top: 12rpx !important;
	}

	.empty-box {
		padding-top: 30% !important;
	}
</style>