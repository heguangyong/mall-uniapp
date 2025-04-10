<!-- 拼团 -->
<template>
	<view class="groupBox" v-if="groupProductList.length" :style="[...boxPadding]">
		<view class="group" :style="[...boxStyle]">
			<view class="group-top acea-row row-middle row-between" :style="[bgImgStyle]">
				<view class="group-top-left acea-row">
					<image v-if="selectStyle == 0" :src="logoUrl" alt="" class="logo">
						<view v-else class="titleFont" :style="[...headerTitleConfig]">{{ titleConfig }}</view>
						<view class="interval" :style="[lineColor]"></view>
						<!-- <image src="" alt="" class="pinkHead" :style="[contentStyle]"> -->
						<view class="avater-box"
							v-if="groupInfo.orderDoneUserImages&&groupInfo.orderDoneUserImages.length">
							<image class="avater1" :src="groupInfo.orderDoneUserImages[0]"></image>
							<image class="avater2" v-if="groupInfo.orderDoneUserImages.length>1"
								:src="groupInfo.orderDoneUserImages[1]"></image>
							<image class="avater3" v-if="groupInfo.orderDoneUserImages.length>2"
								:src="groupInfo.orderDoneUserImages[2]"></image>
						</view>
						<view v-if="groupInfo.orderDoneUserImages" class="num ml-num"
							:class="groupInfo.orderDoneUserImages.length==1?'num1':groupInfo.orderDoneUserImages.length==2?'num2':groupInfo.orderDoneUserImages.length>=3?'num3':''"
							:style="[titleColor]">{{groupInfo.totalAllOrderDone}}人拼团成功</view>
				</view>
				<view class="group-top-right" :style="[headerBtnColor]" @click="toMore">
					更多
					<text class="iconfont icon-xiangyou" :style="[headerBtnColor]"></text>
				</view>
			</view>
			<!-- 样式一 -->
			<view v-if="listStyle == 0" :style="[...boxBgStyle]" class="group-bottom">
				<view v-for="(item, index) in groupProductList" :key="index" :style="[contentConfig]">
					<view class=" acea-row row-between" v-if="item.groupBuyActivityProductResponse.groupBuyActivitySkuResponses"
						@click="toGroupDetail(item.groupBuyActivityProductResponse.groupBuyActivitySkuResponses[0].productId,item.groupBuyActivityProductResponse.groupBuyActivitySkuResponses[0].groupActivityId)">
						<view class="group-bottom-left">
							<view class="img acea-row row-center row-middle relative" :style="[contentStyle]">
								<view v-show="item.stock===0" class="sellOut">已售罄</view>
								<easy-loadimage :image-src="item.groupBuyActivityProductResponse.image" width="250rpx"
									height="250rpx" :radius="dataConfig.contentStyle.val"></easy-loadimage>
							</view>
						</view>
						<view class="group-bottom-right acea-row row-column row-between">
							<view class="right-top">
								<view class="title line2" v-if="typeShow.includes(0)" :style="[nameColor]">
									{{item.groupBuyActivityProductResponse.productName}}
								</view>
								<view class="pink acea-row" v-if="typeShow.includes(1)">
									<view class="people-box acea-row" :style="[groupTitleColor]">
										<view class="people" :style="[groupTitleColor]">{{item.buyCount}}人团</view>
										<view class="groupNum" :style="[groupTitleFontColor]">
											已拼{{item.groupBuyActivityProductResponse.groupBuyActivitySkuResponses.latestBuyCount||'0'}}份
										</view>
									</view>
								</view>
							</view>
							<view class="right-bottom acea-row  row-between">
								<view class="price">
									<view class="pinkNum" v-if="typeShow.includes(2)" :style="[priceColor]"><text
											class="pinkNum-title">拼团价</text><text class="pinkNum-icon">￥</text><text
											class="pinkNum-num semiBold">{{item.groupBuyActivityProductResponse.groupBuyActivitySkuResponses[0].activePrice}}</text>
									</view>
									<view class="num" v-if="typeShow.includes(3)" :style="[originalColor]"><text
											class="num-title">单买价</text><text class="num-icon">￥</text><text
											class="icon-num regular">{{item.groupBuyActivityProductResponse.groupBuyActivitySkuResponses[0]['attrValue'][0].price}}</text>
									</view>
								</view>
								<view class="btnBox" v-if="groupBtnShow">
									<view class="btn" :style="[...btnColor]">去拼团</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<!-- 样式二 -->
			<view class="group-bottom two acea-row row-between grid-list" v-if="listStyle == 1"
				:style="[...boxBgStyle]">
				<view v-for="(item, index) in groupProductList" :key="index" v-if="item.groupBuyActivityProductResponse.groupBuyActivitySkuResponses"
					@click="toGroupDetail(item.groupBuyActivityProductResponse.groupBuyActivitySkuResponses[0].productId,item.groupBuyActivityProductResponse.groupBuyActivitySkuResponses[0].groupActivityId)">
					<view class="group-bottom-left">
						<view class="img acea-row row-center row-middle big-img relative" :style="[contentStyle]">
							<view v-show="item.stock===0" class="sellOut">已售罄</view>
							<easy-loadimage :image-src="item.groupBuyActivityProductResponse.image" width="324rpx"
								height="324rpx" :radius="dataConfig.contentStyle.val"></easy-loadimage>
						</view>
					</view>
					<view class="two-item">
						<view class="title acea-row">
							<view :style="[groupTitleColor]" class="numPink-box">
								<view class="numPink" v-if="typeShow.includes(1)" :style="[groupTitleFontColor]">
									{{item.buyCount}}人团
								</view>
							</view>
							<text :class="typeShow.includes(1) ? 'line1-show' : 'line1-hidden'" class="line1"
								v-if="typeShow.includes(0)" :style="[nameColor]">
								{{item.groupBuyActivityProductResponse.productName}}
							</text>
						</view>
						<view class="two-item-bottom acea-row row-between">
							<view class="price">
								<view class="pinkNum" v-if="typeShow.includes(2)" :style="[priceColor]">
									<text class="num-icon">￥</text><text
										class="num semiBold">{{item.groupBuyActivityProductResponse.groupBuyActivitySkuResponses[0].activePrice}}</text>
								</view>
								<view class="otNum regular" v-if="typeShow.includes(3)" :style="[originalColor]">
									￥{{item.groupBuyActivityProductResponse.groupBuyActivitySkuResponses[0]['attrValue'][0].price}}
								</view>
							</view>
							<view class="btnBox" v-if="groupBtnShow">
								<view class="btn" :style="[...btnColor]">去拼团</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<!-- 样式三 -->
			<view class="group-bottom three acea-row grid-three" v-if="listStyle == 2" :style="[...boxBgStyle]">
				<view v-for="(item, index) in groupProductList" :key="index" class="three-box" v-if="item.groupBuyActivityProductResponse.groupBuyActivitySkuResponses"
					@click="toGroupDetail(item.groupBuyActivityProductResponse.groupBuyActivitySkuResponses[0].productId,item.groupBuyActivityProductResponse.groupBuyActivitySkuResponses[0].groupActivityId)">
					<view class="group-bottom-left">
						<view class="img acea-row row-center row-middle three-img relative" :style="[contentStyle]">
							<view v-show="item.stock===0" class="sellOut">已售罄</view>
							<easy-loadimage :image-src="item.groupBuyActivityProductResponse.image" width="100%"
								class="loadimage" height="100%" :radius="dataConfig.contentStyle.val"></easy-loadimage>
						</view>
					</view>
					<view class="two-item">
						<view class="title acea-row">
							<view :style="[groupTitleColor]" class="numPink-box numPink-box-special">
								<view class="numPink" v-if="typeShow.includes(1)" :style="[groupTitleFontColor]">
									{{item.buyCount}}人团
								</view>
							</view>
							<text class="line1" v-if="typeShow.includes(0)" :style="[nameColor]">
								{{item.groupBuyActivityProductResponse.productName}}
							</text>
						</view>
						<view class="two-item-bottom">
							<view class="price">
								<view class="pinkNum" v-if="typeShow.includes(2)" :style="[priceColor]">
									<text class="num-icon">￥</text><text
										class="num semiBold">{{item.groupBuyActivityProductResponse.groupBuyActivitySkuResponses[0].activePrice}}</text>
								</view>
								<view class="otNum regular" v-if="typeShow.includes(3)" :style="[originalColor]">
									￥{{item.groupBuyActivityProductResponse.groupBuyActivitySkuResponses[0]['attrValue'][0].price}}
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<!-- 样式四 -->
			<view class="group-bottom four acea-row " v-if="listStyle == 3" :style="[...boxBgStyle]">
				<scroll-view scroll-x="true" class="scroll_view">
					<view v-for="(item, index) in groupProductList" :key="index" class="four-item" :style="[fourStyle]" v-if="item.groupBuyActivityProductResponse.groupBuyActivitySkuResponses"
						@click="toGroupDetail(item.groupBuyActivityProductResponse.groupBuyActivitySkuResponses[0].productId,item.groupBuyActivityProductResponse.groupBuyActivitySkuResponses[0].groupActivityId)">
						<view class="group-bottom-left">
							<view class="img acea-row row-center row-middle four-img relative" :style="[contentStyle]">
								<view v-show="item.stock===0" class="sellOut">已售罄</view>
								<easy-loadimage :image-src="item.groupBuyActivityProductResponse.image" width="240rpx"
									height="240rpx" :radius="dataConfig.contentStyle.val"></easy-loadimage>
							</view>
						</view>
						<view class="two-item">
							<view class="title acea-row" :style="[nameColor]">
								<view :style="[groupTitleColor]" class="numPink-box numPink-box-special">
									<view class="numPink" v-if="typeShow.includes(1)" :style="[groupTitleFontColor]">
										{{item.buyCount}}人团
									</view>
								</view>
								<text class="line1" v-if="typeShow.includes(0)">
									{{item.groupBuyActivityProductResponse.productName}}
								</text>
							</view>
							<view class="two-item-bottom">
								<view class="price">
									<view class="pinkNum" v-if="typeShow.includes(2)" :style="[priceColor]">
										<text class="num-icon">￥</text><text
											class="num semiBold">{{item.groupBuyActivityProductResponse.groupBuyActivitySkuResponses[0].activePrice}}</text>
									</view>
									<view class="otNum regular" v-if="typeShow.includes(3)" :style="[originalColor]">
										￥{{item.groupBuyActivityProductResponse.groupBuyActivitySkuResponses[0]['attrValue'][0].price}}
									</view>
								</view>
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
			<emptyPage :mTop="'0'" v-if="groupProductList.length==0" title="暂无拼团商品，去看看其他商品吧~～"
				:imgSrc="urlDomain+'crmebimage/presets/noActivity.png'"></emptyPage>
		</view>
	</view>
</template>

<script>
	import {
		getGroupIndexApi,
		groupbuyMerchantApi
	} from '@/api/group.js'
	import easyLoadimage from '@/components/base/easy-loadimage.vue';
	import emptyPage from '@/components/emptyPage.vue'
	let app = getApp();
	export default {
		name: 'homeGroup',
		components: {
			easyLoadimage,
			emptyPage
		},
		props: {
			dataConfig: {
				type: Object,
				default: () => {}
			},
			merId: { // 商户id
				type: Number,
				default: 0
			},
		},
		data() {
			return {
				urlDomain: this.$Cache.get("imgHost"),
				listStyle: 0,
				logoUrl: null,
				typeShow: [0, 1, 2, 3],
				groupBtnShow: true,
				selectStyle: '',
				titleConfig: '',
				selectBgImg: '',
				bgImgUrl: '',
				headerTitleStyle: 0,
				old: {
					scrollTop: 0
				},
				groupInfo: {},
				groupProductList: [],
				themeColor:this.$options.filters.filterTheme(app.globalData.theme)
			}
		},
		computed: {
			//容器样式
			//最外层盒子的样式
			boxStyle() {
				return [{
						'border-radius': this.dataConfig.bgStyle.val ? 2 * this.dataConfig.bgStyle.val + 'rpx' : '0'
					},
					{
						margin: 0 + ' ' + 2 * this.dataConfig.lrConfig.val + 'rpx' + ' ' + 0
					},
					{
						background: `linear-gradient(to right,${this.dataConfig.bgColor.color[0].item}, ${this.dataConfig.bgColor.color[1].item})`,
					},
				];
			},
			//边距
			boxPadding() {
				return [{
						padding: 2 * this.dataConfig.upConfig.val + 'rpx' + ' ' + '0rpx' + ' ' + 2 * this.dataConfig
							.downConfig.val + 'rpx',
					},
					{
						margin: 2 * this.dataConfig.mbConfig.val + 'rpx' + ' ' + 0 + ' ' + 0
					},
				]
			},
			//背景颜色
			boxBgStyle() {
				return [{
						gap: this.listStyle != 3 ? `${2*this.dataConfig.contentConfig.val}rpx` : ''
					},
					{
						background: `linear-gradient(to right,${this.dataConfig.contentBgColor.color[0].item}, ${this.dataConfig.contentBgColor.color[1].item})`,
					},
				];
			},
			fourStyle() {
				return {
					'margin-right': this.listStyle == 3 ? `${2*this.dataConfig.contentConfig.val}rpx` : ''
				}
			},
			//标题颜色
			titleColor() {
				return {
					color: this.dataConfig.titleColor.color[0].item,
				};
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
			//商品原价颜色
			originalColor() {
				return {
					color: this.dataConfig.originalColor.color[0].item,
				};
			},
			//拼团价格颜色
			priceColor() {
				return {
					color: this.dataConfig.themeStyleConfig.tabVal?this.dataConfig.priceColor.color[0].item:this.themeColor,
				};
			},
			//标签颜色
			groupTitleColor() {
				return {
					background: this.dataConfig.themeStyleConfig.tabVal?this.dataConfig.groupTitleColor.color[0].item:this.themeColor,
				};
			},
			//已拼颜色
			groupTitleFontColor() {
				return {
					color: this.dataConfig.themeStyleConfig.tabVal?this.dataConfig.groupTitleColor.color[0].item:this.themeColor,
				}
			},
			//分割线颜色
			lineColor() {
				return {
					border: `1rpx solid ${this.dataConfig.lineColor.color[0].item}`,
				};
			},
			//按钮颜色
			btnColor() {
				return [{
						background: `linear-gradient(to right,${this.dataConfig.themeStyleConfig.tabVal?this.dataConfig.btnColor.color[0].item:'#FF7931'}, ${this.dataConfig.themeStyleConfig.tabVal?this.dataConfig.btnColor.color[1].item:this.themeColor})`,
					},
					{
						color: this.dataConfig.btnFontColor.color[0].item,
					}
				];
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
					'paddingBottom': 2 * this.dataConfig.contentConfig.val + 'rpx',
				};
			},
			//背景图片
			bgImgStyle() {
				return {
					'background': this.selectBgImg == 0 ? `url(${this.bgImgUrl})` :
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
		created() {
			this.setConfig()
			this.getInfo()
		},
		methods: {
			//去拼团
			toGroupDetail(id, groupActivityId) {
				uni.navigateTo({
					url: `/pages/goods/goods_details/index?id=${id}&mt=2&gd=${groupActivityId}`
				})
			},
			getInfo() {
				this.merId ? groupbuyMerchantApi(this.merId, 6).then((res) => {
					this.groupInfo = res.data
					this.groupProductList = res.data.items
				}) : getGroupIndexApi(6).then((res) => {
					this.groupInfo = res.data
					this.groupProductList = res.data.items
				})
			},
			scroll: function(e) {
				this.old.scrollTop = e.detail.scrollTop
			},
			// 更多
			toMore() {
				uni.navigateTo({
					url: `/pages/activity/goods_group/index?merId=${this.merId}`
				})
			},
			setConfig() {
				this.listStyle = this.dataConfig.tabConfig.tabVal;
				this.logoUrl = this.dataConfig.logoConfig.url;
				this.typeShow = this.dataConfig.typeConfig.activeValue;
				this.groupBtnShow = this.dataConfig.groupBtnConfig.tabVal == 0 ? true : false;
				this.selectStyle = this.dataConfig.selectStyle.tabVal;
				this.titleConfig = this.dataConfig.titleConfig.val;
				this.selectBgImg = this.dataConfig.selectBgImg.tabVal;
				this.bgImgUrl = this.dataConfig.bgImg.url;
				this.headerTitleStyle = this.dataConfig.headerTitleStyle.tabVal;
			},
		}
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
				padding: 0 24rpx;
				background-size: cover !important;

				.group-top-left {
					align-items: center;

					.ml10 {
						margin-top: 4rpx;
					}

					.logo {
						width: 154rpx;
						height: 32rpx;
						object-fit: contain;
					}

					.interval {
						width: 0rpx;
						height: 28rpx;
						margin-left: 20rpx;
						margin-top: 4rpx;
						opacity: 0.6;
					}

					.pinkHead {
						width: 108rpx;
						height: 36rpx;
					}

					.num {
						height: 32rpx;
						line-height: 32rpx;
						font-size: 26rpx;
						margin-left: 16rpx;
						color: #FFFFFF;
						margin-top: 6rpx;
					}

					.num1 {
						margin-left: 12rpx;
					}

					.num2 {
						margin-left: 41rpx;
					}

					.num3 {
						margin-left: 76rpx;
					}
				}

				.group-top-right {
					height: 32rpx;
					line-height: 32rpx;
					font-size: 24rpx;

					.icon-xiangyou {
						font-size: 24rpx;
					}
				}
			}

			.group-bottom {
				width: 100%;
				padding: 20rpx;

				.img {
					width: 240rpx;
					// height: 240rpx;
					// background: #F3F9FF;

				}

				.big-img.img {
					width: 100%;
					height: 324rpx;
				}

				.three-img.img {
					width: 100%;
					height: 210rpx;
				}

				.loadimage {
					width: 100%;
					height: 100%;
				}

				.four-img {
					width: 240rpx;
					height: 240rpx;
				}

				.group-bottom-right {
					flex: 1;
					margin-left: 20rpx;

					.right-top {
						.title {
							font-size: 28rpx;
							color: #333333;
						}

						.people-box {
							border-radius: 8rpx;
						}

						.pink {
							margin-top: 16rpx;
							font-size: 22rpx;
							border-radius: 8rpx;

							.people {
								color: #fff;
								padding: 4rpx 16rpx;
								border-radius: 8rpx;
							}

							.groupNum {
								background-color: rgba(255, 255, 255, 0.9);
								padding: 4rpx 12rpx;
								border-radius: 0 6rpx 6rpx 0;
								margin-left: 2rpx;
							}
						}
					}

					.right-bottom {

						.price {

							.pinkNum {

								.pinkNum-num {
									font-size: 36rpx;
								}
							}

							.num {
								color: #999999;
							}
						}

						.btnBox {
							// margin-top: 16rpx;
							font-size: 22rpx;
							display: flex;
							align-items: end;

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
						margin-top: 20rpx;

						.numPink {
							color: #ffffff;
							padding: 6rpx 12rpx;
							border-radius: 4rpx;
							font-size: 22rpx;
						}

						.line1-show {
							width: 210rpx;
							margin-left: 10rpx;
						}

						.line1-hidden {
							width: 300rpx;
						}
					}

					.two-item-bottom {
						margin-top: 10rpx;

						.pinkNum {

							.num {
								font-size: 36rpx;
							}
						}

						.otNum {
							font-size: 26rpx;
							color: #999999;
							text-decoration: line-through;
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
				.three-box {
					position: relative;
				}

				.numPink {
					color: #ffffff;
					padding: 4rpx 12rpx;
					border-radius: 16rpx;
					font-size: 22rpx;
					// z-index: 9;
				}

				.two-item {
					width: 100%;

					.title {
						margin-top: 18rpx;
						// width: 100%;

						.numPink {
							color: #ffffff;
							padding: 4rpx 12rpx;
							border-radius: 8rpx;
							font-size: 22rpx;
						}

						.line1 {
							width: 180rpx;
							margin-left: 5px;
						}
					}

					.two-item-bottom {
						margin-top: 10rpx;

						.pinkNum {

							.num {
								font-size: 36rpx;
							}
						}

						.otNum {
							font-size: 26rpx;
							color: #999999;
							text-decoration: line-through;
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

				.four-item {
					position: relative;
				}

				.numPink {
					color: #ffffff;
					padding: 6rpx 12rpx;
					border-radius: 32rpx;
					font-size: 22rpx;
					z-index: 9;
				}


				.two-item {
					width: 210rpx;

					.title {
						margin-top: 18rpx;

						.numPink {
							color: #ffffff;
							padding: 6rpx 12rpx;
							border-radius: 32rpx;
							font-size: 22rpx;
						}

						.line1 {
							width: 210rpx;
						}
					}

					.two-item-bottom {
						margin-top: 10rpx;

						.pinkNum {

							.num {
								font-size: 36rpx;
							}
						}

						.otNum {
							font-size: 26rpx;
							text-decoration: line-through;
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
			display: grid !important;
			grid-template-columns: repeat(2, 1fr);
			grid-template-rows: auto;
			width: 100%;
		}

		.grid-three {
			width: 100%;
			display: grid !important;
			grid-template-columns: repeat(3, 1fr);
			grid-template-rows: auto;
		}
	}

	.titleFont {
		font-size: 16px;
	}

	.scroll_view {
		white-space: nowrap;

		.four-item {
			display: inline-block;
			color: #999999;
		}
	}

	.numPink {
		background-color: rgba(255, 255, 255, 0.9);
	}

	.numPink-box {
		border-radius: 8rpx;
	}

	.numPink-box-special {
		position: absolute;
		left: 10rpx;
		top: 10rpx;
		border-radius: 32rpx;
	}

	.avater-box {
		position: relative;
		display: flex;
		align-items: end;
		margin-top: 4rpx;

		image {
			width: 36rpx;
			height: 36rpx;
			border-radius: 18rpx;
		}

		.avater1 {
			margin-left: 20rpx;
		}

		.avater2 {
			position: absolute;
			margin-left: 48rpx;
		}

		.avater3 {
			position: absolute;
			left: 78rpx;
		}
	}

	.regular {
		line-height: 34rpx !important;
		font-weight: 400 !important;
	}
</style>