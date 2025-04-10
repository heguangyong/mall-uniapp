<template>
	<view :data-theme="theme">
		<scroll-view v-if="storeList.length" :scroll-y="isScroll" :style="{ height: windowHeight + 'px' }">
			<block :key="index" v-for="(item, index) in storeList">
				<view @click="goStore(item.merId)" :data-index="index" class="order-item" @touchstart="drawStart" @touchmove="drawMove"
					@touchend="drawEnd" :style="{ right: item.right + 'rpx'}">
					<view class="content">
						<!-- #ifdef MP -->
						<image :src="item.merAvatar" mode=""></image>
						<!-- #endif -->
						<!-- #ifdef H5 || APP-PLUS -->
						<easy-loadimage mode="widthFix" :image-src="item.merAvatar"></easy-loadimage>
						<!-- #endif -->
						<view class="info">
							<view class="info_head">
								<span class="self" v-if="item.isSelf === true">自营</span>
								<text class="name line1">{{item.merName}}</text>
							</view>
							<view class="collection">
								{{item.collectNum}}人关注
							</view>
						</view>
					</view>
					<view class="remove" @click.stop="bindDetele(item.merId, index)">取消关注</view>
				</view>
			</block>
		</scroll-view>
		<view class='noCommodity' v-if="!storeList.length && page > 1 &&!loading" >
			<view class='pictrue mb30'>
        <image :src="urlDomain+'crmebimage/presets/noguanzhu.png'"></image>
				<view class="text-ccc">收藏列表为空哦~</view>
			</view>
			<recommend ref="recommendIndex"></recommend>
		</view>
		<view class='loadingicon acea-row row-center-wrapper'>
			<text class='loading iconfont icon-jiazai' :hidden='loading==false'></text>{{loadTitle}}
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
	let app = getApp();
	import { getMerCollectListApi, getMerCollectCancelApi } from '@/api/merchant.js'
	import easyLoadimage from '@/components/base/easy-loadimage.vue';
	import recommend from "@/components/base/recommend.vue";
	export default {
		data() {
			return {
        urlDomain: this.$Cache.get("imgHost"),
				delBtnWidth: 160,
				storeList: [],
				isScroll: true,
				theme:app.globalData.theme,
				windowHeight: 0,
				page:1,
				limit:20,
				loading: true,
				loadTitle:''
			};
		},
		components: {
			easyLoadimage,
			recommend
		},
		onLoad: function(options) {
			var that = this;
			wx.getSystemInfo({
				success: function(res) {
					that.windowHeight = res.windowHeight -41;
				}
			});
			uni.setNavigationBarTitle({
				title: '店铺收藏'
			})
			this.getList()
		},
		methods: {
			returns: function() {
				uni.navigateBack()
			},
			drawStart: function(e) {
				var touch = e.touches[0];
				for (var index in this.storeList) {
					this.storeList[index].right = 0;
				}
				this.startX = touch.clientX;
			},
			drawMove: function(e) {
				var touch = e.touches[0];
				var item = this.storeList[e.currentTarget.dataset.index];
				var disX = this.startX - touch.clientX;

				if (disX >= 20) {
					if (disX > this.delBtnWidth) {
						disX = this.delBtnWidth;
					}
					this.isScroll = false;
					this.storeList[e.currentTarget.dataset.index].right = disX;
				} else {
					this.isScroll = true;
					this.storeList[e.currentTarget.dataset.index].right = 0;
				}
			},
			drawEnd: function(e) {
				var item = this.storeList[e.currentTarget.dataset.index];
				if (item.right >= this.delBtnWidth / 2) {
					this.isScroll = true;
					this.storeList[e.currentTarget.dataset.index].right = this.delBtnWidth;
				} else {
					this.isScroll = true;
					this.storeList[e.currentTarget.dataset.index].right = 0;
				}
			},
			goStore(id){
				uni.navigateTo({
					url:`/pages/merchant/home/index?merId=${id}`
				})
			},
			getList(){
				if(!this.isScroll) return
				this.loading = true;
				this.loadTitle = "";
				getMerCollectListApi({
					page:this.page,
					limit:this.limit
				}).then(res=>{
					this.isScroll = res.data.list.length>=this.limit
					let loadend = res.data.list.length < this.limit;
					this.storeList = this.storeList.concat(res.data.list)
					this.loadend = loadend;
					this.loadTitle = this.storeList.length===0 ? '' : loadend ? '我也是有底线的' : '显示更多';
					this.page+=1
					this.loading = false;
				}).catch(res => {
					this.loading = false;
						return this.$util.Tips({
							title: res
						});

					});
			},
			// 删除收藏
			bindDetele(id, index){
				getMerCollectCancelApi(id).then(res=>{
					uni.showToast({
						title: '取消成功',
						icon:'none'
					})
					this.storeList.splice(index,1)
				})
			}
		},
		onReachBottom() {
			this.getList();
			if(!this.storeList.length && this.page > 1){
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

<style lang="scss" scoped>
	.order-item {
		height: 180rpx;
		width: 92%;
		display: flex;
		position: relative;
		transition: all 0.2s;
		margin-bottom: 50rpx;
		margin: 20rpx 4%;
		border-radius: 16rpx;
		background: #fff url('../static/images/storeBg.png') no-repeat;
		background-size: 100% 100%;
	}

	.remove {
		width: 130rpx;
		height: 100%;
		@include main_bg_color(theme);;
		color: white;
		position: absolute;
		top: 0;
		right: -160rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 99;
		border-radius: 14rpx;
		margin-left: 15rpx;
	}
	.content{
		position: relative;
		display: flex;
		padding: 30rpx 24rpx;
		align-items: center;
		image,.easy-loadimage,image,uni-image{
			width: 100rpx;
			height: 100rpx;
			overflow: hidden;
			border-radius: 14rpx;
		}
		.info{
			flex: 1;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			margin-left: 20rpx;
			position: relative;
			.name{
				width: 410rpx;
				font-weight: bold;
			}
		}
	}
	.info_head {
		.self{
			padding: 2rpx 6rpx;
			background: #E93323;
			color: #fff;
			border-radius: 3rpx;
			margin-right: 10rpx;
			font-size: 18rpx;
		}
	}
	.collection {
		margin-top: 14rpx;
		font-size: 22rpx;
		color: #666666;
	}
</style>
