<template>
	<view class='recommend'>
		<block v-if="tempArr.length">
			<title-box v-if="isShowTitle" title="热门推荐"></title-box>
			<view class='recommendList borderPad' :class="isShowTitle?'':'mt30'">
				<WaterfallsFlow :wfList='tempArr' :type="1" :isStore="1">
					<template slot-scope="{item}">{{item.name}}
						<WaterfallsFlowItem :item="item" :type="1" :isStore="1"/>
					</template>
				</WaterfallsFlow>
			</view>
			<view class='loadingicon acea-row row-center-wrapper' :hidden='loading==false'>
				<text class='loading iconfont icon-jiazai'></text>
			</view>
			<view class="mores-txt flex" v-if="goodScroll">
				<text>我是有底线的</text>
			</view>
		</block>
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
		mapGetters
	} from "vuex";
	import animationType from '@/utils/animationType.js'
	import {
		getProductHot
	} from '@/api/product.js';
	import WaterfallsFlow from '@/components/WaterfallsFlow/WaterfallsFlow.vue';
	import WaterfallsFlowItem from '@/components/WaterfallsFlowItem/WaterfallsFlowItem.vue';
	import TitleBox from '@/components/titleBox/index.vue';
	let app = getApp();
	export default {
		name: 'recommend',
		computed: mapGetters(['uid']),
		components: {
			WaterfallsFlow,
			TitleBox
		},
		props: {
			categoryId: {
				type: Number,
				default: function() {
					return 0;
				}
			},
			//是否显示头部
			isShowTitle: {
				type: Boolean,
				default: function() {
					return true;
				}
			},
			//是否使用本页面的请求数据
			isDefault: {
				type: Boolean,
				default: function() {
					return true;
				}
			},
			//使用的页面中调用数据传来的商品列表，isDefault为false时使用
			recommendList: {
				type: Array,
				default: function() {
					return [];
				}
			}
		},
		data() {
			return {
				urlDomain: this.$Cache.get("imgHost"),
				theme: app.globalData.theme,
				goodScroll: false,
				params: { //精品推荐分页
					page: 1,
					limit: 10,
					cid: 0
				},
				loading: false,
				tempArr: []
			};
		},
		watch: {
			categoryId: function(val) { //监听props中的属性
				if (!this.isDefault) {
					this.params.page = 1;
					this.tempArr = [];
					this.goodScroll = false;
					this.get_host_product()
				}
			}
		},
		mounted() {
			if (this.isDefault) {
				this.params.page = 1;
				this.goodScroll = false;
				this.tempArr = [];
				this.get_host_product()
			}else{
				this.tempArr = this.recommendList
			};
		},
		methods: {
			/**
			 * 获取我的推荐
			 */
			get_host_product: function() {
				if (this.goodScroll) return;
				this.loading = true
				this.params.cid = this.categoryId;
				getProductHot(
					this.params
				).then((res) => {
					this.$set(this.params, 'page', this.params.page + 1);
					this.goodScroll = this.params.page > res.data.totalPage;
					this.tempArr = this.tempArr.concat(res.data.list || []);
					this.$emit('getRecommendLength', this.tempArr.length);
					this.loading = false
				}).catch(err => {
					this.loading = false
				});
			}
		},
		onReachBottom() {
			if (this.isDefault) this.get_host_product();
		}
	}
</script>

<style scoped lang="scss">
	
	.mores-txt {
		width: 100%;
		align-items: center;
		justify-content: center;
		height: 70rpx;
		color: #999;
		font-size: 24rpx;

		.iconfont {
			margin-top: 2rpx;
			font-size: 20rpx;
		}
	}

	.recommend {
		.title {
			height: 120rpx;
			line-height: 120rpx;
			font-size: 32rpx;
			color: #333333;

			.iconfont {
				font-size: 170rpx;
				color: #454545;
			}
		}

		.name {
			margin: 0 28rpx;
		}
	}
	.recommendList{
		background-color: #f5f5f5;
	}
</style>