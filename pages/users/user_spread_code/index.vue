<template>
	<view class="page">
		<view class='distribution-posters'>
			<swiper :indicator-dots="indicatorDots" :autoplay="autoplay" :circular="circular" :interval="interval"
				:duration="duration" @change="bindchange" previous-margin="40px" next-margin="40px">
				<block v-for="(item,index) in spreadList" :key="index">
					<swiper-item>
						<image :src="item.pic" class="slide-image" :class="swiperIndex == index ? 'active' : 'quiet'"
							mode='aspectFill' />
					</swiper-item>
				</block>
			</swiper>
			<!-- #ifdef APP-PLUS || MP-->
			<view class='keep' :style="{backgroundColor:bgColor}" @click='savePhoto(spreadList[swiperIndex].pic)'>保存海报
			</view>
			<!-- #endif -->
			<!-- #ifndef MP || APP-PLUS -->
			<div class="preserve acea-row row-center-wrapper">
				<div class="line"></div>
				<div class="tip">长按保存图片</div>
				<div class="line"></div>
			</div>
			<!-- #endif -->
		</view>
		<view class="canvas" v-if="canvasStatus">
			<canvas style="width:750px;height:1190px;" canvas-id="canvasOne"></canvas>
			<canvas canvas-id="qrcode" :style="{width: `${qrcodeSize}px`, height: `${qrcodeSize}px`}" />
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
	// #ifdef H5 || APP-PLUS
	import uQRCode from '@/js_sdk/Sansnn-uQRCode/uqrcode.js'
	// #endif
	// #ifdef APP-PLUS
	import {
		HTTP_H5_URL
	} from '@/config/app.js';
	// #endif
	import {
		spreadBanner
	} from '@/api/user.js';
	import {
		toLogin
	} from '@/libs/login.js';
	import {
		mapGetters
	} from "vuex";
	// #ifdef MP
	import {
		base64src
	} from '@/utils/base64src.js'
	import {
		mpQrcode
	} from '@/api/api.js';
	// #endif
	import {
		setThemeColor
	} from '@/utils/setTheme.js'
	import {
		imageBase64
	} from "@/api/public";
	export default {
		data() {
			return {
				imgUrls: [],
				indicatorDots: false,
				circular: false,
				autoplay: false,
				interval: 3000,
				duration: 500,
				swiperIndex: 0,
				spreadList: [],
				poster: '',
				qrcodeSize: 1000,
				PromotionCode: '',
				base64List: [],
				canvasStatus: true, //海报绘图标签
				bgColor: '#e93323'
			};
		},
		computed: mapGetters(['isLogin', 'uid', 'userInfo']),
		watch: {
			isLogin: {
				handler: function(newV, oldV) {
					if (newV) {
						this.userSpreadBannerList();
					}
				},
				deep: true
			}
		},
		onLoad() {
			this.bgColor = setThemeColor();
			if (this.isLogin) {
				// #ifdef MP
				this.PromotionCode = this.$Cache.get('wechatQRcode')
				// #endif
				// #ifndef MP
				this.make();
				// #endif
				this.userSpreadBannerList();
			} else {
				toLogin();
			}
		},

		// #ifdef MP
		/**
		 * 用户点击右上角分享
		 */
		onShareAppMessage: function() {
			return {
				title: this.userInfo.nickname + '-分销海报',
				imageUrl: this.spreadList[0].pic,
				path: `/pages/index/index?id=0&sd=${this.uid}`,
			};
		},
		// #endif
		onReady() {},
		methods: {
			userSpreadBannerList: function() {
				let that = this;
				uni.showLoading({
					title: '获取中',
					mask: true,
				})
				spreadBanner({
					page: 1,
					limit: 5
				}).then(res => {
					uni.hideLoading();
					that.getImageBase64(res.data);
					that.$set(that, 'spreadList', res.data);
				}).catch(err => {
					uni.hideLoading();
				});
			},
			getImageBase64: function(images) {
				uni.showLoading({
					title: '海报生成中',
					mask: true
				});
				let that = this;
				// #ifdef H5
				let spreadList = []
				// 生成一个Promise对象的数组
				images.forEach(item => {
					const oneApi = imageBase64({
						url: item.pic
					}).then(res => {
						return res.data.code;
					})
					spreadList.push(oneApi)
				})
				Promise.all(spreadList).then(result => {
					that.$set(that, 'base64List', result);
					that.setShareInfoStatus();
					setTimeout(()=>{
						that.getImgCanvas(this.base64List[0], 0)
					},100)
				})
				// #endif

				// #ifdef MP || APP-PLUS
				that.base64List = images.map(item => {
					return item.pic
				});
				let arrImagesUrl = "";
				uni.downloadFile({
					url: this.base64List[0],
					success: (res) => {
						arrImagesUrl = res.tempFilePath;
						this.getImgCanvas(arrImagesUrl, 0)
					}
				});
				// #endif
			},
			getImgCanvas(arrImagesUrl, index) {
				this.$nextTick(() => {
					this.PosterCanvas(arrImagesUrl, this.PromotionCode, this.userInfo
						.nickname, index)
				})
			},
			// 生成二维码；
			make() {
				let that = this;
				let href = '';
				// #ifdef H5
				href = window.location.href.split('/pages')[0];
				// #endif
				// #ifdef APP-PLUS
				href = HTTP_H5_URL;
				let routes = getCurrentPages(); // 获取当前打开过的页面路由数组
				let curRoute = routes[routes.length - 1].route //获取当前页面路由
				let curParam = routes[routes.length - 1].options; //获取路由参数
				// #endif
				uQRCode.make({
					canvasId: 'qrcode',
					text: href + '/pages/index/index?sd=' + that.uid,
					size: this.qrcodeSize,
					margin: 10,
					success: res => {
						that.PromotionCode = res;
					},
					complete: (res) => {},
					fail: res => {
						uni.hideLoading();
						that.$util.Tips({
							title: '海报二维码生成失败！'
						});
					}
				})
			},
			PosterCanvas: function(arrImages, code, nickname, index) {
				let context = uni.createCanvasContext('canvasOne')
				context.clearRect(0, 0, 0, 0);
				let that = this;
				uni.getImageInfo({
					src: arrImages,
					success: function(res) {
						context.drawImage(arrImages, 0, 0, 750, 1190);
						context.save();
						context.drawImage(code, 110, 925, 140, 140);
						context.restore();
						context.setFontSize(28);
						context.fillText(nickname, 270, 980);
						context.fillText('邀请您加入', 270, 1020);
						setTimeout(() => {
							context.draw(true, function() {
								uni.canvasToTempFilePath({
									destWidth: 750,
									destHeight: 1190,
									canvasId: 'canvasOne',
									fileType: 'jpg',
									success: function(res) {
										// 在H5平台下，tempFilePath 为 base64
										uni.hideLoading();
										that.spreadList[index].pic = res
											.tempFilePath;
										that.$set(that, 'poster', res
											.tempFilePath);
										that.$set(that, 'canvasStatus', false);
									}
								})
							})

						}, 100);
					},
					fail: function(err) {
						uni.hideLoading();
						that.$util.Tips({
							title: '无法获取图片信息'
						});
					}
				});
			},
			bindchange(e) {
				let base64List = this.base64List;
				let index = e.detail.current;
				this.swiperIndex = index;
				let arrImagesUrl = "";
				uni.downloadFile({
					url: base64List[index],
					success: (res) => {
						arrImagesUrl = res.tempFilePath;
						setTimeout(() => {
							this.$set(this, 'canvasStatus', true);
							this.PosterCanvas(arrImagesUrl, this.PromotionCode, this.userInfo.nickname,
								index);
						}, 300);
					}
				});
			},
			// 点击保存海报
			savePhoto: function(url) {
				let that = this;
				uni.saveImageToPhotosAlbum({
					filePath: url,
					success: function(res) {
						that.$util.Tips({
							title: '保存成功',
							icon: 'success'
						});
					},
					fail: function(res) {
						that.$util.Tips({
							title: '保存失败'
						});
					}
				});
			},
			setShareInfoStatus: function() {
				if (this.$wechat.isWeixin()) {
					let configAppMessage = {
						desc: '分销海报',
						title: this.userInfo.nickname + '-分销海报',
						link: '/pages/index/index?sd=' + this.uid,
						imgUrl: this.spreadList[0].pic
					};
					this.$wechat.wechatEvevt(["updateAppMessageShareData", "updateTimelineShareData"],
						configAppMessage)
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	// page {
	// 	background-color: #A2A2A2 !important;
	// 	height: 100vh;
	// 	overflow: auto;
	// }
	.page {
		height: 100vh;
		overflow: auto;
		background-color: #A2A2A2 !important;
	}

	.canvas {
		position: relative;
	}

	.distribution-posters {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.distribution-posters swiper {
		width: 100%;
		height: 1000rpx;
		position: relative;
		margin-top: 40rpx;
	}

	.distribution-posters .slide-image {
		width: 100%;
		height: 100%;
		margin: 0 auto;
		border-radius: 15rpx;
	}

	.distribution-posters .slide-image.active {
		transform: none;
		transition: all 0.2s ease-in 0s;
	}

	.distribution-posters .slide-image.quiet {
		transform: scale(0.8333333);
		transition: all 0.2s ease-in 0s;
	}

	.distribution-posters .keep {
		font-size: 30rpx;
		color: #fff;
		width: 600rpx;
		height: 80rpx;
		border-radius: 50rpx;
		text-align: center;
		line-height: 80rpx;
		margin: 38rpx auto;

	}

	.distribution-posters .preserve {
		color: #fff;
		text-align: center;
		margin-top: 38rpx;
	}

	.distribution-posters .preserve .line {
		width: 100rpx;
		height: 1px;
		background-color: #fff;
	}

	.distribution-posters .preserve .tip {
		margin: 0 30rpx;
	}
</style>