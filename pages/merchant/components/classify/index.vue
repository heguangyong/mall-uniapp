<template>
	<!-- 分类 -->
	<view>
		<view class="category">
			<view v-for="item in category" :key="item.id" class="section">
				<view class="head" @click="goCategoryGoods(item)">
					<view class="title">{{ item.name }}</view>
					<view class="iconfont icon-xiangyou"></view>
				</view>
				<view v-if="item.childList" class="body">
					<view v-for="value in item.childList" :key="value.id" class="item" @click="goCategoryGoods(value)">
						{{ value.name }}</view>
				</view>
			</view>
		</view>
		<view :hidden="!categoryLoading" class="acea-row row-center-wrapper loadingicon">
			<text class="iconfont icon-jiazai loading"></text>
		</view>
		<emptyPage v-if="category.length == 0 && !categoryLoading" mTop="35%" title="暂无商品分类~"
			:imgSrc="urlDomain+'crmebimage/presets/noSearch.png'"></emptyPage>
	</view>
</template>

<script>
	import {
		getMerCategoryApi
	} from '@/api/merchant.js';
	import emptyPage from '@/components/emptyPage.vue'
	export default {
		components: {
			emptyPage
		},
		props: {
			merId: { // 商户id
				type: Number,
				default: 0
			},
		},
		data() {
			return {
				category: [],
				categoryLoading: false,
				urlDomain: this.$Cache.get("imgHost"),
			}
		},
		mounted() {
			this.getMerCategory()
		},
		methods: {
			goCategoryGoods(item) {
				uni.navigateTo({
					url: '/pages/goods/goods_list/index?merId=' + this.merId + '&cid=' +
						item.id
				})
			},
			getMerCategory() {
				this.categoryLoading = true
				getMerCategoryApi(this.merId).then(res => {
					this.category = res.data
					this.categoryLoading = false
				}).catch(err => {
					return this.$util.Tips({
						title: err
					});
					this.categoryLoading = false
				});
			},
		}
	}
</script>

<style lang="scss" scoped>
	.category {
		padding-top: 34rpx;
		padding-right: 20rpx;
		padding-left: 20rpx;

		.section {
			border-radius: 10rpx;
			margin-bottom: 20rpx;
			background-color: #FFFFFF;

			.head {
				position: relative;
				display: flex;
				align-items: center;
				height: 90rpx;
				padding-right: 20rpx;
				padding-left: 36rpx;
				font-weight: bold;
				color: #282828;

				&::before {
					content: " ";
					position: absolute;
					top: 50%;
					left: 20rpx;
					width: 6rpx;
					height: 24rpx;
					@include main_bg_color(theme);
					transform: translateY(-50%);
				}

				.title {
					flex: 1;
					min-width: 0;
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
					font-size: 30rpx;
				}

				.iconfont {
					font-size: 22rpx;
					line-height: 1;
				}
			}

			.body {
				display: flex;
				flex-wrap: wrap;
				justify-content: space-between;
				align-items: center;
				padding: 9rpx 36rpx 14rpx;

				.item {
					width: 314rpx;
					height: 84rpx;
					padding-right: 30rpx;
					padding-left: 30rpx;
					border-radius: 10rpx;
					background-color: #F5F5F5;
					margin-bottom: 10rpx;
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
					font-weight: 500;
					font-size: 26rpx;
					line-height: 84rpx;
					color: #282828;
				}
			}
		}
	}
</style>