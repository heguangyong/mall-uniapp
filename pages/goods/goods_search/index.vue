<template>
	<view :data-theme="theme">
		<view class='searchGood'>
			<view class='search acea-row row-between-wrapper'>
				<!-- #ifndef MP -->
				<view class='input acea-row row-between-wrapper'>
					<text class='iconfont icon-sousuo2'></text>
					<input type='text' :value='searchValue'
					:focus="focus" placeholder='点击搜索商品'
					confirm-type='search' @confirm="searchBut"
					placeholder-class='placeholder' @input="setValue"
					maxlength="20"></input>
				</view>
				<view class='bnt' @tap='searchBut'>搜索</view>
				<!-- #endif -->
				<!-- #ifdef MP -->
				<searchBox :searchValue="searchValue" class="searchBox"  @searchChange="searchBut"></searchBox>
				<!-- #endif -->
			</view>
			<!-- #ifdef MP -->
			<view class='title' :style="{'margin-top':searchTop+60+'px'}">热门搜索</view>
			<!-- #endif -->
			<!-- #ifndef MP -->
			<view class='title'>热门搜索</view>
			<!-- #endif -->
			<view class='list acea-row'>
				<block v-for="(item,index) in hotSearchList" :key="index">
					<view class='item' @tap='setHotSearchValue(item.title)'>{{item.title}}</view>
				</block>
			</view>
			<view class='line'></view>
		</view>
		<recommend ref="recommend"></recommend>
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
		getSearchKeyword,
	} from '@/api/product.js';
	import recommend from "@/components/base/recommend.vue";
	// #ifdef MP
	import searchBox from "@/components/searchBox.vue";
	// #endif
	let app = getApp();
	export default {
		components: {
			recommend,
			// #ifdef MP
			searchBox
			// #endif
		},
		data() {
			return {
				hostProduct: [],
				searchValue: '',
				focus: true,
				bastList: [],
				hotSearchList: [],
				first: 0,
				limit: 8,
				page: 1,
				loading: false,
				loadend: false,
				loadTitle: '加载更多',
				hotPage:1,
				isScroll:true,
				theme:app.globalData.theme,
				searchTop:''
			};
		},
		// 滚动监听
		onPageScroll(e) {
			// 传入scrollTop值并触发所有easy-loadimage组件下的滚动监听事件
			uni.$emit('scroll');
		},
		onShow: function() {
			this.getRoutineHotSearch();
		},
		onLoad(e){
			// #ifdef MP
			this.searchTop=uni.getMenuButtonBoundingClientRect().top
			// #endif
			if(e.searchVal) this.searchValue = e.searchVal;
		},
		methods: {
			getRoutineHotSearch: function() {
				let that = this;
				getSearchKeyword().then(res => {
					that.$set(that, 'hotSearchList', res.data);
				});
			},
			setHotSearchValue: function(event) {
				this.$set(this, 'searchValue', event);
				this.page = 1;
				this.loadend = false;
				this.$set(this, 'bastList', []);
				uni.navigateTo({
					url: `/pages/goods/goods_list/index?searchValue=${this.searchValue}`
				})
			},
			setValue: function(event) {
				this.$set(this, 'searchValue', event.detail.value);
			},
			searchBut: function(e) {
				let that = this;
				let val = '';
				that.focus = false;
				if(e.detail.value){
					val =e.detail.value
				}
				if (that.searchValue.length > 0||val) {
					uni.navigateTo({
						url: `/pages/goods/goods_list/index?searchValue=${val?val:that.searchValue}`
					})
				} else {
					return this.$util.Tips({
						title: '请输入要搜索的商品',
						icon: 'none',
						duration: 1000,
						mask: true,
					});
				}
			}
		},
		onReachBottom() {
			this.$refs.recommend.get_host_product();
		}
	}
</script>

<style lang="scss" scoped>
	page {
		background-color: #f5f5f5 !important;
	}

	.searchGood .search {
		padding-left: 30rpx;
		background-color: #fff !important;
	}

	.searchGood .search {
		/* #ifndef MP */
		padding-top: 20rpx;
		padding-bottom: 20rpx;
		/* #endif */
		/* #ifdef MP */
		position: fixed;
		width: 100%;
		z-index: 9999;
		top: 0;
		/* #endif */
	}

	.searchGood .search .input {
		width: 598rpx;
		background-color: #f7f7f7;
		border-radius: 33rpx;
		padding: 0 35rpx;
		box-sizing: border-box;
		height: 66rpx;
	}

	.searchGood .search .input input {
		width: 472rpx;
		font-size: 26rpx;
	}

	.searchGood .search .input .placeholder {
		color: #bbb;
	}

	.searchGood .search .input .iconfont {
		color: #000;
		font-size: 35rpx;
	}

	.searchGood .search .bnt {
		width: 120rpx;
		text-align: center;
		height: 66rpx;
		line-height: 66rpx;
		font-size: 30rpx;
		color: #282828;
	}

	.searchGood .title {
		font-weight: 500;
		font-family: PingFang SC, PingFang SC;
		font-size: 28rpx;
		color: #333;
		margin: 50rpx 30rpx 25rpx 30rpx;
	}

	.searchGood .list {
		padding-left: 10rpx;
	}

	.searchGood .list .item {
		font-size: 26rpx;
		color: #454545;
		padding: 0 21rpx;
		height: 60rpx;
		border-radius: 30rpx;
		line-height: 60rpx;
		border: 1rpx solid #aaa;
		margin: 0 0 20rpx 20rpx;
	}

	.searchGood .line {
		margin: 20rpx 30rpx 0 30rpx;
	}
	.searchBox{
		width: 100%;
	}
</style>
