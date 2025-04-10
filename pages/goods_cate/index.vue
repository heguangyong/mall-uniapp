<template>
	<view :data-theme="theme">
		<tui-skeleton v-if="showSkeleton"></tui-skeleton>
		<view class='productSort' :style="{visibility: showSkeleton ? 'hidden' : 'visible', height: winHeight+ 'px' }">
			<!-- #ifdef APP -->
			<view class='header acea-row row-center-wrapper' :style="{ 'marginTop': sysHeight*2 + 'rpx'}">
			<!-- #endif -->
			<!-- #ifndef APP -->
			<view class='header acea-row row-center-wrapper header-box'>
			<!-- #endif -->
				<!-- #ifndef MP -->
				<view class='acea-row row-between-wrapper input'>
					<text class='iconfont icon-sousuo'></text>
					<input type='text' placeholder='点击搜索商品信息' @confirm="searchSubmitValue" confirm-type='search' name="search"
					 placeholder-class='placeholder' maxlength="20"></input>
				</view>
				<!-- #endif -->
				<!-- #ifdef MP -->
				<searchBox class="searchBox" :toBackShow="false" @searchChange="searchSubmitValue"></searchBox>
				<!-- #endif -->
			</view>
			<!-- #ifdef APP -->
			<view class="con-box">
			<!-- #endif -->
			<!-- #ifndef APP -->
			<view class="con-box" :style="{ 'marginTop': sysHeight*2 + 90 + 'rpx'}">
			<!-- #endif -->
				<view class='aside'>
					<scroll-view scroll-y="true" style="height: 100%; overflow: hidden;" scroll-with-animation='true' :scroll-into-view="intoindex">
						<view v-for="(item,index) in productList" :key="item.id">
							<view class='item acea-row row-center-wrapper' :class='index==navActive?"on":""' v-if='item.childList && item.childList.length > 0'
							 :key="item.id" @click='tap(index,"b"+item.id)' :id='"sort"+index'><text class="item_text skeleton-rect">{{item.name}}</text>
							 </view>
						</view>
					</scroll-view>
				</view>
				<view class='conter'>
					<scroll-view scroll-y="true" :scroll-into-view="toView" style="height: 100%; overflow: hidden;" @scroll="scroll" scroll-with-animation='true'>
						<view v-for="(p,i) in productList" :key="p.id">
							<view class='listw' :id="'b'+p.id+index" v-for="(item,index) in p.childList" :key="item.id">
								<view class='title acea-row'>
									<view class='name skeleton-rect'>{{item.name}}</view>
								</view>
								<view class='list acea-row'>
									<block v-for="(itemn,indexn) in item.childList" :key="itemn.id">
										<navigator hover-class='none' :url='"/pages/goods/goods_list/index?cid="+itemn.id+"&title="+itemn.name'
										 class='item acea-row row-column row-middle'>
											<view class='picture skeleton-rect'>
												<easy-loadimage mode="widthFix" :image-src="itemn.icon"></easy-loadimage>
											</view>
											<view class='name line1'>{{itemn.name}}</view>
										</navigator>
									</block>
								</view>
							</view>
						</view>
						<view :style='"height:"+(bottomheight-300)+"rpx;"'></view>
					</scroll-view>
				</view>
			</view>
		</view>
		<view v-if="bottomNavigationIsCustom" class="footerBottom"></view>
		<pageFooter></pageFooter>
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
	import { getCategoryList } from '@/api/product.js';
	import easyLoadimage from '@/components/base/easy-loadimage.vue';
	import { mapGetters } from "vuex";
	import tuiSkeleton from '@/components/base/tui-skeleton.vue';
	import pageFooter from "@/components/pageFooter/index.vue";
	import animationType from '@/utils/animationType.js'
	// #ifdef MP
	import searchBox from "@/components/searchBox.vue";
	// #endif
	let sysHeight = uni.getSystemInfoSync().statusBarHeight;
	export default {
		components: {
			easyLoadimage,
			tuiSkeleton,
			pageFooter,
			// #ifdef MP
			searchBox
			// #endif
		},
		computed: mapGetters(['bottomNavigationIsCustom']),
		data() {
			let active = 0;
			// #ifdef H5
			active = location.hash.substr(1);
			// #endif
			return {
				theme:app.globalData.theme,
				showSkeleton: true, //骨架屏显示隐藏
				navlist: [],
				hotList: [], //推荐分类
				sysHeight:sysHeight,
				productList: [
					{name: 'skeleton',id: 0,
					childList:[
						{name: 'skeleton',id: 10,childList:[
							{name: '',id: 101,},
							{name: '',id: 102,},
							{name: '',id: 103,},
							{name: '',id: 104,},
							{name: '',id: 105,},
							{name: '',id: 106,}
						]},
						{name: 'skeleton',id: 1,
						childList:[
						{name: '',id: 101,},
						{name: '',id: 102,},
						{name: '',id: 103,},
						{name: '',id: 104,},
						{name: '',id: 105,},
						{name: '',id: 106,}
						]},
						{name: '',id: 20}
						]
					},
					{name: 'skeleton',id: 2,
					childList:[{name:'skeleton',id: 30}]},
					{name: 'skeleton',id: 3,
					childList:[{name:'skeleton',id: 31}]},
					{name: 'skeleton',id: 4,
					childList:[{name:'skeleton',id: 32}]},
					{name: 'skeleton',id: 5,
					childList:[{name:'skeleton',id: 33}]},
					{name: 'skeleton',id: 6,
					childList:[{name:'skeleton',id: 34}]},
					{name: 'skeleton',id: 7,
					childList:[{name:'skeleton',id: 35}]},
					{name: 'skeleton',id: 8,
					childList:[{name:'skeleton',id: 36}]},
					{name: 'skeleton',id: 9,
					children:[{name:'skeleton',id: 37}]},
					{name: 'skeleton',id: 10,
					childList:[{name:'skeleton',id: 38}]},
					{name: 'skeleton',id: 11,
					childList:[{name:'skeleton',id: 39}]},
				],
				navActive: 0,
				activceCate: active,
				number: "",
				bottomheight: 0,
				hightArr: [],
				toView: "",
				winHeight: 0,
				pidIndex: 0,
				intoindex: "",
				pid: '',
				newData: {},
				activeRouter: '',
			}
		},
		onLoad(options) {
			let that = this
			uni.getSystemInfo({
				success: function(res) {
					that.winHeight = res.windowHeight
				},
			});
			// #ifdef H5
			document.body.addEventListener('touchmove', function(event) {
				if (that.$route.path == '/pages/goods_cate/goods_cate') {
					event.preventDefault();
				}
			}, {
				passive: false
			});
			// #endif
			this.getAllCategory();
		},
		onShow() {
			let that = this
			let routes = getCurrentPages();
			let curRoute = routes[routes.length - 1].route;
			this.activeRouter = '/' + curRoute;
			if(uni.getStorageSync('cateNavActive')){
				this.navActive = uni.getStorageSync('cateNavActive')-1;
				uni.removeStorageSync('cateNavActive');
			}
			if(uni.getStorageSync('categoryId')){
				this.pid= uni.getStorageSync('categoryId');
				uni.removeStorageSync('categoryId');
			}
			this.pid && this.navActive && setTimeout(()=>this.tap(this.navActive, 'b' + this.pid), 200);
			setTimeout(() => {
				uni.removeStorageSync('categoryId');
				uni.removeStorageSync('cateNavActive');
			}, 300);

		},
		methods: {
			infoScroll: function() {
				let that = this;
				//设置商品列表高度
				uni.getSystemInfo({
					success: function(res) {
						that.bottomheight = (res.windowHeight) * (750 / res.windowWidth) - 98;
					},
				});
				let hightArr = [];
				for (let i = 0; i < that.productList.length; i++) {
					let item = that.productList[i]
					if(!that.productList[i].childList){
						continue;
					}
					for (let j = 0; j < that.productList[i].childList.length; j++) {
						//获取元素所在位置
						let query = uni.createSelectorQuery().in(this);
						let idView = "#b" + item.id + j;
						query.select(idView).boundingClientRect();
						query.exec(function(res) {
							if(res[0]){
								let top = res[0].top;
								hightArr.push({top,i});
							}
						});
					};
				};
				that.hightArr = hightArr;
			},
			tap: function(index, id) {
				this.toView = ''+id+0;
				this.navActive = index;
				setTimeout(()=>{
					uni.$emit('scroll');
				}, 300);
			},
			getAllCategory: function() {
				let that = this;
				let value = ""
				that.pidIndex = 0;
				getCategoryList().then(res => {
					that.productList = res.data;
					that.$nextTick(function(){
						that.infoScroll();
					})
					that.showSkeleton = false
				})
			},
			scroll: function(e) {
				uni.$emit('scroll');
				let scrollTop = e.detail.scrollTop + 10;
				let scrollArr = this.hightArr;
				for (let i = 0; i < scrollArr.length; i++) {
					if (scrollTop >= 0 && scrollTop < scrollArr[1].top - scrollArr[0].top) {
						this.navActive = 0
					} else if (scrollTop >= scrollArr[i].top - scrollArr[0].top && scrollTop < (scrollArr[i + 1] ? scrollArr[i + 1].top : 0) - scrollArr[0].top) {
						this.navActive = scrollArr[i].i
					} else if (scrollTop >= scrollArr[scrollArr.length - 1].top - scrollArr[0].top) {
						this.navActive = scrollArr[scrollArr.length - 1].i
					}
				}
			},
			searchSubmitValue: function(e) {
				if (this.$util.trim(e.detail.value).length > 0)
					uni.navigateTo({
						animationType: animationType.type,
						animationDuration: animationType.duration,
						url: '/pages/goods/goods_list/index?searchValue=' + e.detail.value
					})
				else
					return this.$util.Tips({
						title: '请填写要搜索的产品信息'
					});
			},
		}
	}
</script>
<style scoped lang="scss">
	/deep/.origin-img{
		border-radius: 50%;
	}
	.productSort {
		display: flex;
		flex-direction: column;
		width: 100%;
		.con-box {
			flex: 1;
			display: flex;
			overflow: hidden;
		}
	}
	.productSort .header {
		width: 100%;
		/* #ifndef MP */
		height: 96rpx;
		/* #endif */
		background-color: #fff;
		border-bottom: 1rpx solid #f5f5f5;
	}
	.productSort .header .input {
		width: 700rpx;
		height: 60rpx;
		background-color: #f5f5f5;
		border-radius: 50rpx;
		box-sizing: border-box;
		padding: 0 25rpx;
	}

	.productSort .header .input .iconfont {
		font-size: 28rpx;
		color: #555;
	}
	.productSort .header .input .placeholder {
		color: #999;
	}
	.productSort .header .input input {
		font-size: 28rpx;
		height: 100%;
		width: 597rpx;
	}
	.productSort .header .input .input-box {
		display: flex;
		align-items: center;
		font-size: 28rpx;
		height: 100%;
		width: 597rpx;
		color: #999999;
	}
	.productSort .aside {
		background-color: #fff;
		overflow-y: auto;
		overflow-x: hidden;
		width: 200rpx;
		height: 100%;
		overflow: hidden;
	}
	.productSort .aside .item {
		height: 100rpx;
		width: 100%;
		font-size: 26rpx;
		color: #424242;
	}
	.productSort .aside .item_text {
		padding-left: 20rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
	}
	.productSort .aside .item.on {
		background-color: #f7f7f7;
		border-left: 4rpx solid var(--view-theme);
		width: 100%;
		text-align: center;
		@include main_color(theme);
		font-weight: bold;
	}
	.productSort .conter {
		flex: 1;
		height: 100%;
		padding: 0 14rpx;
		background-color: #f7f7f7;
	}
	.productSort .conter .listw .title {
		height: 100rpx;
		align-items: center;
	}
	.productSort .conter .listw .title .line {
		width: 100rpx;
		height: 2rpx;
		background-color: #f0f0f0;
	}
	.productSort .conter .listw .title .name {
		font-size: 28rpx;
		color: #333;
		margin: 0 30rpx;
		font-weight: bold;
	}
  .productSort .conter .listw .title .list_title,
	.productSort .conter .listw .title uni-image,
	.productSort .conter .listw .title image{
		width: 110rpx;
		height: 26rpx;
		border-radius: 0;
	}
	.productSort .conter .list {
		flex-wrap: wrap;
		background: #fff;
		border-radius: 16rpx;
		padding-bottom: 26rpx;
	}
	.productSort .conter .list .item {
		width: 174rpx;
		margin-top: 26rpx;
	}
	.productSort .conter .list .item .picture,
	.productSort .conter uni-image,
	.productSort .conter .list .item image,
	/deep/.easy-loadimage{
		width: 110rpx;
		height: 110rpx;
		border-radius: 50%;
	}
	.productSort .conter .list .item .name {
		font-size: 24rpx;
		color: #333;
		height: 56rpx;
		line-height: 56rpx;
		width: 120rpx;
		text-align: center;
	}
	.searchBox{
		width: 100%;
	}
	.header-box{
		position: fixed;
		z-index: 9999;
	}
</style>
