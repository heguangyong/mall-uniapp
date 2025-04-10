<template>
	<scroll-view class="rights-container" scroll-y="true" :style="'height:'+windowHeight+'px'" @touchstart="touchStart">
		<!-- #ifdef MP -->
		<NavBar navTitle="会员权益" :isBackgroundColor="false" iconColor='#fff' ref="navBarRef"></NavBar>
		<!-- #endif -->
		<view class="header acea-row">
			<view v-for="(item, index) in benefitsList" :key="index" class="item acea-row row-column row-middle"
				:class="{ on: currentIndex == index }" @click="currentIndex = index">
				<view class="image-wrap acea-row row-center row-middle">
					<view class="image-wrap-inner acea-row row-center-wrapper">
						<image class="image" :src="item.imageUrl"></image>
					</view>
				</view>
				<view>{{ item.value }}</view>
			</view>
		</view>
		<swiper class="swiper" :current="currentIndex" :interval="3000" :duration="1000" previous-margin="58rpx"
			next-margin="58rpx" @change="swiperChange">
			<swiper-item v-for="(item, index) in benefitsList" :key="index">
				<view class="swiper-item acea-row row-column" :class="{ on: currentIndex == index }">
					<view class="title acea-row row-center-wrapper h-124 relative">
						<image class="h-124 absolute w-100-p111-" :src="`${urlDomain}crmebimage/presets/quanyibj.png`"></image>
						<view class="svip-line w-140" :style="{'background-image': `url(${urlDomain}crmebimage/presets/svipzuo.png)`}"></view>
						<view class="ml-12 mr-12 relative z-99">{{ item.value }}</view>
						<view class="svip-line w-140" :style="{'background-image': `url(${urlDomain}crmebimage/presets/svipyou.png)`}"></view>
					</view>
					<scroll-view class="scroll-view" scroll-y="true">
						<view v-html="item.expand || ''"></view>
					</scroll-view>
				</view>
			</swiper-item>
		</swiper>
	</scroll-view>
</template>

<script>
	import {
		svipBenefitsListApi,
	} from '@/api/activity.js';
	import NavBar from '@/components/navBar.vue';
	export default {
		components: {
			NavBar
		},
		data() {
			return {
				urlDomain:this.$Cache.get("imgHost"),
				benefitsList: [],
				currentIndex: 0,
				windowHeight: 0
			}
		},
		created() {
			// 获取设备宽度
			let that = this
			uni.getSystemInfo({
				success(e) {
					that.windowHeight = e.windowHeight;
				}
			});
		
		},
		onLoad(options) {
			this.currentIndex = options.currentIndex || 0
			this.getBenefitsList();
		},
		methods: {
      //滚动
      touchStart() {
        this.$refs.navBarRef.currentPage = false;
      },
			getBenefitsList() {
				uni.showLoading({
					title: '正在加载…'
				});
				svipBenefitsListApi().then(res => {
					uni.hideLoading();
					this.benefitsList = res.data;
				}).catch(err => {
					uni.showToast({
						title: err,
						icon: 'none'
					});
				});
			},
			swiperChange(e) {
				this.currentIndex = e.detail.current;
			},
		},
	}
</script>

<style lang="scss" scoped>
	.svip-line{
		height: 2rpx;
		background-repeat: no-repeat;
		background-size: 100% 100%;
	}
	.rights-container {
		/* #ifndef H5 */
		position: absolute;
		/* #endif */
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		background: linear-gradient(180deg, #312B23 0%, #19140E 100%);
		padding-bottom: calc(40rpx + constant(safe-area-inset-bottom));
		padding-bottom: calc(40rpx + env(safe-area-inset-bottom));

		.header {
			.item {
				flex: 1;
				padding: 48rpx 0 56rpx;
				font-size: 24rpx;
				line-height: 34rpx;
				color: rgba(255, 255, 255, 0.4);

				&.on {
					color: rgba(255, 255, 255, 0.8);

					.image {
						opacity: 1;
					}
				}
			}

			.image-wrap {
				position: relative;
				width: 88rpx;
				height: 88rpx;
				border-radius: 50%;
				margin-bottom: 28rpx;
				background: linear-gradient(180deg, rgba(255, 255, 255, 0.1) 2%, rgba(255, 255, 255, 0) 100%);

				.image-wrap-inner {
					width: 42rpx;
					height: 37rpx;
				}
			}

			.image {
				width: 100%;
				height: 100%;
				opacity: 0.3;
			}
		}

		.swiper {
			height: 76%;
		}

		.swiper-item {
			height: 100%;
			transform: scale(0.9);
			transition: 0.3s;

			&.on {
				transform: scale(1);
			}

			.title {
				padding: 42rpx 0 40rpx;
				border-radius: 24rpx 24rpx 0 0;
				background: linear-gradient(270deg, #FDF4E4 0%, #FEFAE9 100%);;
				text-align: center;
				font-weight: 700;
				font-size: 34rpx;
				line-height: 42rpx;
				color: #333333;
				image{
					top: 0;
				}
			}
		}

		.scroll-view {
			flex: 1;
			min-height: 0;
			padding: 48rpx;
			border-radius: 0 0 24rpx 24rpx;
			background-color: #FFFFFF;
			box-sizing: border-box;
		}
	}
</style>