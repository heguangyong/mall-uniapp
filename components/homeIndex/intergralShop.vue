<!-- 积分 -->
<template>
	<view class="groupBox" :style="[...boxPadding]">
		<view class="group" :style="[...boxStyle]">
			<view class="group-top acea-row row-middle row-between" :style="[bgImgStyle]">
				<view class="group-top-left acea-row">
          <image v-if="selectStyle == 0" :src="logoUrl" alt="" class="logo"></image>
					<view v-else class="titleFont" :style="[...headerTitleConfig]">{{ titleConfig }}</view>
				</view>
				<view class="group-top-right" :style="[headerBtnColor]" @click="toIntergralList">
					更多
					<text class="iconfont icon-xiangyou" :style="[headerBtnColor]"></text>
				</view>
			</view>
			<!-- 样式一 -->
			<view class="group-bottom two acea-row grid-list" v-if="listStyle == 0"
				:style="[...boxBgStyle]">
				<view v-for="(item, index) in goodList" :key="index" @click="goGoodsDetail(item)">
					<view class="group-bottom-left">
						<view class="img acea-row row-center row-middle big-img relative" :style="[contentStyle]">
							<view v-show="item.stock===0" class="sellOut">已售罄</view>
							<easy-loadimage :image-src="item.image" width="322rpx" height="322rpx"
								:radius="10"></easy-loadimage>
						</view>
					</view>
					<view class="two-item">
						<view class="title acea-row line-heightOne mb-24">
							<text class="line1" :style="[nameColor]">{{item.name}}</text>
						</view>
						<PointsPrice :pointsPrice="item" :pointsGoodsStyle="hotPointsStyle">
						</PointsPrice>
					</view>
				</view>
			</view>
			<!-- 样式二 -->
			<view class="group-bottom three acea-row grid-three" v-if="listStyle == 1" :style="[...boxBgStyle]">
				<view v-for="(item, index) in goodList" :key="index" class="three-box" @click="goGoodsDetail(item)">
					<view class="group-bottom-left mb-20">
						<view class="img acea-row row-center row-middle three-img relative" :style="[contentStyle]">
							<view v-show="item.stock===0" class="sellOut">已售罄</view>
							<easy-loadimage :image-src="item.image" width="208rpx" height="208rpx"
								:radius="10"></easy-loadimage>
						</view>
					</view>
					<PointsPrice :pointsPrice="item" :pointsGoodsStyle="hotPointsStyle1" v-model="isShowSamll">
					</PointsPrice>
					<view class="two-item mt-10">
						<view class="title acea-row line-heightOne">
							<text class="line1" :style="[nameColor]">{{item.name}}</text>
						</view>
					</view>
				</view>
			</view>
			<!-- 样式三 -->
			<view class="group-bottom four acea-row " v-if="listStyle == 2" :style="[...boxBgStyle]">
				<scroll-view scroll-x="true" class="scroll_view">
					<view v-for="(item, index) in goodList" :key="index" class="four-item" :style="[fourStyle]"
						@click="goGoodsDetail(item)">
						<view class="group-bottom-left mb-20">
							<view class="img acea-row row-center row-middle four-img relative" :style="[contentStyle]">
								<view v-show="item.stock===0" class="sellOut">已售罄</view>
								<easy-loadimage :image-src="item.image" width="224rpx" height="224rpx"
									:radius="10"></easy-loadimage>
							</view>
						</view>
						<PointsPrice :pointsPrice="item" :pointsGoodsStyle="hotPointsStyle1" v-model="isShowSamll">
						</PointsPrice>
					</view>
				</scroll-view>
			</view>

		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapGetters
	} from 'vuex';
	let app = getApp();
	import {
		integralProductHotApi
	} from '@/api/activity.js'
	import easyLoadimage from '@/components/base/easy-loadimage.vue';
	import PointsPrice from '@/components/PointsPrice.vue';
	import {
		goProductDetail
	} from "@/libs/order";
	
	export default {
		name: 'homeIntergral',
		components: {
			easyLoadimage,
			PointsPrice
		},
		props: {
			dataConfig: {
				type: Object,
				default: () => {}
			},
		},
		computed: {
			//容器样式
			//最外层盒子的样式
			boxStyle() {
				return [{
						'border-radius': this.dataConfig.bgStyle.val ? 2 * this.dataConfig.bgStyle.val + 'rpx' : '0'
					},
					{
						margin: 0 + ' ' + 2 * this.dataConfig.lrConfig.val +
							'rpx' + ' ' +
							0
					},
				];
			},
			//边距
			boxPadding() {
				return [{
						padding: 2 * this.dataConfig.upConfig.val + 'rpx' + ' ' + '0px' + ' ' + 2 * this.dataConfig
							.downConfig
							.val +
							'rpx',
					},
					{
						margin: 2 * this.dataConfig.mbConfig.val + 'rpx' + ' ' + 0 + ' ' + 0
					},
				]
			},
			//背景颜色
			boxBgStyle() {
				return [{
						background: `linear-gradient(to right,${this.dataConfig.contentBgColor.color[0].item}, ${this.dataConfig.contentBgColor.color[1].item})`,
					},
					{
						gap: `${2*this.dataConfig.contentConfig.val}rpx`
					}
				];
			},
			fourStyle() {
				return {
					'margin-right': this.listStyle == 2 ? `${2*this.dataConfig.contentConfig.val}rpx` : ''
				}
			},
			//头部按钮颜色
			headerBtnColor() {
				return {
					color: this.dataConfig.headerBtnColor.color[0].item,
				};
			},
			//商品名称颜色
			nameColor() {
				return {
					color: this.dataConfig.nameColor.color[0].item,
				};
			},
			//拼团价格颜色
			priceColor() {
				return {
					color: this.dataConfig.themeStyleConfig.tabVal?this.dataConfig.priceColor.color[0].item:this.themeColor,
				};
			},
			//图片圆角
			contentStyle() {
				return {
					'border-radius': this.dataConfig.contentStyle.val ? 2 * this.dataConfig.contentStyle.val + 'rpx' : '0',
				};
			},
			//样式一内容边距
			contentConfig() {
				return {
					'margin-top': 2 * this.dataConfig.contentConfig.val + 'rpx',
				};
			},
			//背景图片
			bgImgStyle() {
				return {
					'background-image': this.selectBgImg == 0 ? `url(${this.bgImgUrl})` :
						`linear-gradient(to right,${this.dataConfig.bgColor.color[0].item}, ${this.dataConfig.bgColor.color[1].item})`,
				};
			},
			//标题文字格式
			headerTitleConfig() {
				return [{
						'font-weight': this.headerTitleStyle == 0 ? 600 : ''
					},
					{
						'font-style': this.headerTitleStyle == 2 ? 'italic' : 'normal'
					},
					{
						color: this.dataConfig.headerTitleColor.color[0].item,
					}
				]
			}
		},
		data() {
			return {
				isShowSamll: true,
				listStyle: 0,
				logoUrl: null,
				groupBtnShow: true,
				selectStyle: '',
				titleConfig: '',
				selectBgImg: '',
				bgImgUrl: '',
				headerTitleStyle: 0,
				old: {
					scrollTop: 0
				},
				goodList: [],
				hotPointsStyle: {
					iconStyle: {
						width: '32rpx',
						height: '32rpx'
					},
					priceStyle: {
						fontSize: '32rpx',
					},
					unitStyle: {
						fontSize: '28rpx',
					},
					priceColor: this.priceColor
				},
				hotPointsStyle1: {
					iconStyle: {
						width: '28rpx',
						height: '28rpx'
					},
					priceStyle: {
						fontSize: '28rpx',
					},
					unitStyle: {
						fontSize: '24rpx',
					},
					priceColor: this.priceColor
				},
				themeColor:this.$options.filters.filterTheme(app.globalData.theme)
			}
		},
		created() {
			this.setConfig()
			this.getStoreIntegral()
		},
		methods: {
			//跳商品详情
			goGoodsDetail(item) {
				goProductDetail(item.id, 0, '', 1)
			},
			//热门推荐
			getStoreIntegral() {
				integralProductHotApi({
					page: 1,
					limit: 6,
				}).then(res => {
					this.goodList = res.data.list;
					this.integral = res.data.integral;
				})
			},
			toIntergralList() {
				uni.navigateTo({
					url: '/pages/activity/points_mall/index'
				})
			},
			setConfig() {
				this.listStyle = this.dataConfig.itemStyle.tabVal;
				this.logoUrl = this.dataConfig.logoConfig.url;
				this.selectStyle = this.dataConfig.selectStyle.tabVal;
				this.titleConfig = this.dataConfig.titleConfig.val;
				this.selectBgImg = this.dataConfig.selectBgImg.tabVal;
				this.bgImgUrl = this.dataConfig.bgImg.url;
				this.headerTitleStyle = this.dataConfig.headerTitleStyle.tabVal;
				this.hotPointsStyle.priceColor = {
					color:  this.dataConfig.themeStyleConfig.tabVal?this.dataConfig.priceColor.color[0].item:this.themeColor,
				}
				this.hotPointsStyle1.priceColor = {
					color:  this.dataConfig.themeStyleConfig.tabVal?this.dataConfig.priceColor.color[0].item:this.themeColor,
				}
			},
		},
	}
</script>


<style lang="scss" scoped>
	.groupBox {
		overflow: hidden;

		.group {
			overflow: hidden;

			.group-top {
				width: 100%;
				height: 100rpx;
				background-repeat: no-repeat;
				background-size: cover;
				padding: 0 24rpx;

				.group-top-left {
					.logo {
						width: 154rpx;
						height: 32rpx;
					}

					.interval {
						width: 0rpx;
						height: 32rpx;
						border: 2rpx solid rgba(255, 255, 255, 0.6);
						margin-left: 10rpx;
					}

					.pinkHead {
						width: 108rpx;
						height: 36rpx;
					}

					.num {
						height: 32rpx;
						line-height: 32rpx;
						font-size: 26rpx;
						color: #FFFFFF;
					}
				}

				.group-top-right {
					height: 32rpx;
					line-height: 32rpx;
					font-size: 24rpx;

					.icon-xuanze {
						font-size: 24rpx;
					}
				}
			}

			.group-bottom {
				width: 100%;
				padding: 20rpx;

				.img {
					//width: 240rpx;
					// height: 240rpx;
					// background: #F3F9FF;

					.shan {
						// width: 130rpx;
						// height: 100rpx;
					}
				}

				.big-img.img {
					width: 100%;
					height: 322rpx;
				}

				.three-img.img {
					width: 100%;
					// height: 200rpx;
				}

				.four-img {
					//width: 240rpx;
					height: 240rpx;
				}

				.group-bottom-right {
					width: 400rpx;

					.right-top {
						.title {
							font-size: 28rpx;
							color: #333333;
						}

						.pink {
							margin-top: 16rpx;
							font-size: 22rpx;

							.people {
								color: #fff;
								padding: 4rpx 12rpx;
								border-radius: 8rpx 0 0 8rpx;
							}

							.groupNum {
								color: #E93323;
								background: rgba(211, 56, 42, 0.1);
								padding: 4rpx 12rpx;
								border-radius: 0 8rpx 8rpx 0;
							}
						}
					}

					.right-bottom {

						.price {

							.pinkNum {
								image {
									vertical-align: middle;
								}

								.pinkNum-num {
									font-weight: 600;
									font-size: 36rpx;
								}
							}

							.num {
								color: #999999;
							}
						}

						.btnBox {
							margin-top: 16rpx;
							font-size: 22rpx;

							.btn {
								padding: 12rpx 20rpx;
								border-radius: 50rpx;
							}
						}
					}
				}
			}

			.group-bottom.two {
				.two-item {
					width: 100%;

					.title {
						margin-top: 16rpx;

						.numPink {
							color: #ffffff;
							padding: 4rpx 12rpx;
							border-radius: 0 8rpx 8rpx 0;
							font-size: 22rpx;
							width: 82rpx;
						}

						.line1 {
							width: 300rpx;
							margin-left: 10rpx;
						}
					}

					.two-item-bottom {
						margin-top: 20rpx;

						.pinkNum {

							.num {
								font-weight: 600;
								font-size: 36rpx;
							}
						}

						.otNum {
							font-size: 26rpx;
							color: #999999;
							text-decoration-line: line-through;
						}

						.btnBox {
							margin-top: 16rpx;
							font-size: 22rpx;

							.btn {
								padding: 12rpx 24rpx;
								border-radius: 50rpx;
							}
						}
					}
				}
			}

			.group-bottom.three {

				.numPink {
					position: absolute;
					color: #ffffff;
					padding: 4rpx 12rpx;
					border-radius: 0 8rpx 8rpx 0;
					font-size: 22rpx;
				}

				.two-item {
					width: 100%;

					.title {
						width: 100%;

						.numPink {
							color: #ffffff;
							padding: 4rpx 12rpx;
							border-radius: 0 8rpx 8rpx 0;
							font-size: 22rpx;
							width: 82rpx;
						}

						.line1 {
							width: 200rpx;
							margin-left: 10rpx;
						}
					}

					.two-item-bottom {
						margin-top: 20rpx;
						// width: 100%;

						.pinkNum {

							.num {
								font-weight: 600;
								font-size: 36rpx;
							}
						}

						.otNum {
							font-size: 26rpx;
							color: #999999;
							text-decoration-line: line-through;
						}

						.btnBox {
							margin-top: 16rpx;
							font-size: 22rpx;

							.btn {
								padding: 12rpx 24rpx;
								border-radius: 50rpx;
							}
						}
					}
				}
			}

			.group-bottom.four {
				overflow: hidden;
				flex-wrap: nowrap;
				position: relative;

				.numPink {
					position: absolute;
					color: #ffffff;
					padding: 4rpx 12rpx;
					border-radius: 0 8rpx 8rpx 0;
					font-size: 22rpx;
				}


				.two-item {
					width: 224rpx;

					.title {
						margin-top: 18rpx;

						.numPink {
							color: #ffffff;
							padding: 4rpx 12rpx;
							border-radius: 0 8rpx 8rpx 0;
							font-size: 22rpx;
							width: 82rpx;
						}

						.line1 {
							width: 210rpx;
							margin-left: 10rpx;
						}
					}

					.two-item-bottom {
						margin-top: 20rpx;

						.pinkNum {

							.num {
								font-weight: 600;
								font-size: 36rpx;
							}
						}

						.otNum {
							font-size: 26rpx;
							text-decoration-line: line-through;
						}

						.btnBox {
							margin-top: 16rpx;
							font-size: 22rpx;

							.btn {
								padding: 12rpx 24rpx;
								border-radius: 50rpx;
							}
						}
					}
				}
			}
		}

		.price {
			display: flex;
			flex-direction: column;
			justify-content: flex-end;
		}

		.grid-list {
			//display: grid !important;
			grid-template-columns: repeat(2, 1fr);
			grid-template-rows: auto;
			width: 100%;
		}

		.grid-three {
			//display: grid !important;
			grid-template-columns: repeat(3, 1fr);
			grid-template-rows: auto;
			width: 100%;
			//justify-content: space-between;

			.three-box {
				width: 208rpx;
			}
		}
	}

	.f-s-16 {
		font-size: 32rpx !important;
	}

	.f-s-14 {
		font-size: 28rpx !important;
	}

	.titleFont {
		font-size: 32rpx !important;
	}

	.priceNum-img {
		width: 28rpx;
		height: 28rpx;
		margin-right: 8rpx
	}

	.semiBold {
		font-weight: 600;
	}

	.scroll_view {
		white-space: nowrap;

		.four-item {
			display: inline-block;
			color: #999999;
		}
	}
</style>