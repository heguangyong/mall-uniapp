<template>
	<view class="navbar">
		<view class="content" :style="{ background: isScrolling ? '#fff' : bagColor }">
			<view :style="{ height: `${getHeight.barTop}px` }"></view>
			<view class="acea-row row-center-wrapper bar" :style="{ height: `${getHeight.barHeight}px` }">
				<view class="back-icon acea-row row-center-wrapper">
					<view v-show="showBack" @click="back" class="iconfont icon-xiangzuo back-icon"
						:style="{ color: `${iconColor}`}"></view>
				</view>
				<view class="title"
					:style="{ color: `${textColor}`, fontSize: `${textSize}`, fontWeight: `${textWeight}` }"><slot></slot>
				</view>
				<view class="right-icon acea-row row-center-wrapper">
					<view v-show="showRight" class="right-icon"></view>
				</view>
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
		name: 'navbar',
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
			// icon 颜色
			iconColor: {
				type: String,
				default: '#000000'
			},
			// icon 字号
			iconSize: {
				type: String,
				default: '40rpx'
			},
			// icon 字重
			iconWeight: {
				type: String,
				default: 'bold'
			},
			// Title 颜色
			textColor: {
				type: String,
				default: '#333'
			},
			// Title 字号
			textSize: {
				type: String,
				default: '34rpx'
			},
			// Title 字重
			textWeight: {
				type: String,
				default: '500'
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
				uni.switchTab({
					url:'/pages/user/index'
				})
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
				padding: 0 30rpx;
			}

			.title {
				flex: 1;
				text-align: center;
			}
		}
	}
</style>