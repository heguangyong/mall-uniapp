<template>
	<view>
		<view class="main borderPad">
			<view class='search acea-row '>
				<view class='input acea-row row-middle'>
					<text class='iconfont icon-sousuo2'></text>
					<input class="placeholder" type='text' :value='searchValue' :focus="focus" placeholder='请输入标题' placeholder-class='placeholder' @input="setValue" confirm-type="search" @confirm="searchBut()"></input>
				</view>
				<view class='bnt' @tap='searchBut'>搜索</view>
			</view>
			<view class="tab-cont">
				<view v-if="discoverList.length" class="goods-wrap">
					<view class="goods">
						<WaterfallsFlow :wfList='discoverList' :type="1" :fromType="1" :isStore="1">
						</WaterfallsFlow>
					</view>
				</view>
				<view :hidden="!loading" class="acea-row row-center-wrapper loadingicon">
					<text class="iconfont icon-jiazai loading"></text>
				</view>
				<emptyPage v-if="discoverList.length == 0 && !loading" title="暂无更多内容~" mTop="13%" :imgSrc="urlDomain+'crmebimage/presets/noguanzhu.png'"></emptyPage>
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
	import WaterfallsFlow from '@/components/WaterfallsFlow/WaterfallsFlow.vue'
	import WaterfallsFlowItem from '@/components/discoverFlowItem/discoverFlowItem.vue'
	import { discoverListApi } from '@/api/discover.js';
	import { mapGetters } from "vuex";
	import emptyPage from '@/components/emptyPage.vue'
	const app = getApp();
	export default {
		components: {
			emptyPage,
			WaterfallsFlow,
			WaterfallsFlowItem
		},
		data() {
			return {
				urlDomain: this.$Cache.get("imgHost"),
				focus: false,
				discoverList: [], // 发现内容列表
				loaded: false,
				loading: false,
				loadTitle: '加载更多',
				where: {
					title: '',
					page: 1,
					limit: 30,
					categoryId: ''
				},
				searchValue: ""
			}
		},
		onLoad: function(options) {
			// this.where.topic_id = options.id ? options.id : ''
			this.searchBut();
		},
		methods: {
			setValue: function(event) {
				this.searchValue = event.detail.value;
			},
			searchBut(){
				this.loadend = this.loading = false
				this.where.page = 1
				this.discoverList = []
				this.getDiscoverList()
			},
			// 获取关注商品
			getDiscoverList: function() {
				let that = this;
				if (that.loadend) return;
				if (that.loading) return;
				that.loading = true;
				that.loadTitle = '';
				that.where.title = encodeURIComponent(this.searchValue);
				discoverListApi(that.where).then(res => {
					that.loading = false;
					let list = res.data.list;
					let discoverList = that.$util.SplitArray(list, that.discoverList);
					let loadend = list.length < that.where.limit;
					that.loadend = loadend;
					that.loading = false;
					that.loadTitle = loadend ? '已全部加载' : '加载更多';
					that.$set(that, 'discoverList', discoverList);
					that.$set(that.where, 'page', that.where.page + 1);
				}).catch(err => {
					that.loading = false;
					that.goodsLoading = false;
					uni.showToast({
						title: err,
						icon: 'none'
					})
				});
			},
		},
		onReachBottom() {
			this.getDiscoverList();
		},
		// 滚动监听
		onPageScroll(e) {
			// 传入scrollTop值并触发所有easy-loadimage组件下的滚动监听事件
			uni.$emit('scroll');
		},
		onPullDownRefresh(){}
	}
</script>

<style lang="scss" scoped>
	.main .search {
		padding: 18rpx 10rpx 10rpx 10rpx;
	}
	.main .search .input {
		width: 590rpx;
		background-color: #f7f7f7;
		border-radius: 33rpx;
		padding: 0 24rpx;
		box-sizing: border-box;
		height: 66rpx;
	}
	.main .search .input input {
		width: 460rpx;
		font-size: 28rpx;
	}
	.main .search .input .iconfont {
		color: #000;
		font-size: 35rpx;
	}
	.main .search .bnt {
		text-align: center;
		height: 66rpx;
		line-height: 66rpx;
		font-size: 28rpx;
		color: #282828;
		margin-left: 24rpx;
	}
	.main {
		background: #ffffff;
		min-height: 100vh;
		.goods-wrap{
			margin-top: 20rpx;
		}
	}
	.goods {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		// width: 750rpx;
	}
	.placeholder{
		margin-left: 16rpx;
	}
</style>
