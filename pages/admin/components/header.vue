<template>
	<view class="navbar">
		<view class="content" :style="{ background: isScrolling ? '#fff' : bagColor }">
			<view :style="{ height: `${getHeight.barTop}px` }"></view>
			<view class="acea-row  bar" :style="{ height: `${getHeight.barHeight}px`,width: `${750-2*getHeight.barWidth}rpx` }">
				<view class="back-icon acea-row row-center-wrapper">
					<view
						v-show="showBack"
						@click="back"
						class="iconfont icon-xiangzuo back-icon"
						:style="{ lineHeight: `${getHeight.barHeight}rpx`}"
					></view>
				</view>
				<view class="title">{{ titleText }}</view>
				<view class="h-80 px-5 flex-y-center">
					<view class="w-full h-58 flex-y-center rd-30rpx bg--w111-fff px-32">
						<text class="iconfont icon-sousuo8 fs-28"></text>
						<input class="fs-24 pl-18" placeholder="搜索商品名称或订单号">
					</view>
					<view class="search_right_icon">
						
					</view>
				</view>
				<!-- <view class="right-icon acea-row row-center-wrapper">
					<view v-show="showRight" class="right-icon"></view>
				</view> -->
			</view>
		</view>
		<view class="placeholder">
			<view :style="{ height: `${getHeight.barTop}px` }"></view>
			<view :style="{ height: `${getHeight.barHeight}px` }"></view>
		</view>
	</view>
</template>

<script>
export default {
	name: 'headerNav',
	props: {
		// 滚动至下部
		isScrolling: {
			type: Boolean,
			default: false
		},
		// 是否显示返回icon
		showBack: {
			type: Boolean,
			default: false
		},
		// Title
		titleText: {
			type: String,
			default: ''
		},
		// 背景色
		bagColor: {
			type: String,
			default: 'transparent'
		}
	},
	data() {
		return {
			getHeight: this.$util.getWXStatusHeight()
		};
	},
	methods: {
		back() {
			uni.navigateBack();
		}
	}
};
</script>

<style lang="scss">
.navbar {
	position: relative;
	color: #333;
	.content {
		position: fixed;
		top: 0;
		right: 0;
		left: 0;
		z-index: 998;
		background-color: var(--view-theme);
		font-weight: 500;
		font-size: 34rpx;
		color: #ffffff;
		.back-icon,
		.right-icon {
			width: 40rpx;
			height: 40rpx;
		}
		.bar {
			align-items: center;
		}
		.title {
			margin-left: 10rpx;
		}
	}
}
.search_right_icon{
	width: 80rpx;
	height: 60rpx;
	border-radius: 30rpx;
	background: darkgray;
	margin-left: 20rpx;
}
.icon-sousuo8{
	color: #333;
}
.h-80{
	width: 75%;
	margin-left: 10rpx;
}
.icon-xiangzuo,.title{
	color: #999999;
	font-size: 30rpx;
}
</style>
