<template>
	<view :data-theme="theme">
		<view class="mp-bg">
			<view class="searchCon acea-row">
				<!-- #ifndef APP-PLUS||MP -->
				<view @click="toBack">
					<text class="iconfont icon-fanhui"></text>
				</view>
				<!-- #endif -->
				<view class="search acea-row row-middle">
					<text class="iconfont icon-ic_search"></text>
					<input class="inputs" placeholder='输入商品或订单号搜索' placeholder-class='placeholder'
						placeholder-style="font-size:28rpx" v-model="keywords" @confirm="search"></input>
				</view>
				<view class="btn" @click="search">
					<text>搜索</text>
				</view>
			</view>
			<scroll-view class="scroll-view_x" scroll-x style="white-space: nowrap; vertical-align: middle;"
				show-scrollbar="false">
				<view class='nav borRadius14 acea-row'>
					<text class='item' :class='orderStatus==-1 ? "on": ""' @click="statusClick(-1)">
						<text>全部</text>
					</text>
					<text class='item' :class='orderStatus==0 ? "on": ""' @click="statusClick(0)">
						<text>待付款</text>
					</text>
					<text class='item' :class='orderStatus==1 ? "on": ""' @click="statusClick(1)">
						<text>待发货</text>
					</text>
					<text class='item' :class='orderStatus==3 ? "on": ""' @click="statusClick(3)">
						<text>待核销</text>
					</text>
					<text class='item' :class='orderStatus==4 ? "on": ""' @click="statusClick(4)">
						<text>待收货</text>
					</text>
					<text class='item' :class='orderStatus==9 ? "on": ""' @click="statusClick(9)">
						<text>已取消</text>
					</text>
				</view>
			</scroll-view>
		</view>
		<view class='my-order'>
			<view class='list'>
				<view class='item' v-for="(item,index) in orderList" :key="index">
					<view class='title acea-row row-between-wrapper'>
						<view class="acea-row row-middle">
							<view v-if="item.merName">
								<navigator :url="`/pages/merchant/home/index?merId=${item.merId}`" hover-class="none">
									<text class='iconfont icon-shangjiadingdan mr10'></text>
									<text class="mr10">{{item.merName}}</text>
									<text class='iconfont icon-xiangyou'></text>
								</navigator>
							</view>
							<view v-else>
								<text class="mr10">{{item.orderNo}}</text>
							</view>
						</view>
						<view v-if="item.refundStatus == 3" class='font_color'>已退款</view>
						<template v-else>
							<view v-if="item.groupBuyRecordStatus==99||item.status==9||item.groupBuyRecordStatus==10"
								class='font_color'>{{item.status | orderStatusFilter}}</view>
							<view v-else class='font_color'>{{item.groupBuyRecordStatus===0?'拼团中':'拼团失败'}}</view>
						</template>
					</view>
					<view v-for="(items,indexs) in item.orderInfoList" :key="indexs">
						<view @click='goOrderDetails(item)' class='item-info acea-row row-between row-top'>
							<view class='pictrue'>
								<easy-loadimage mode="widthFix" :image-src="items.image"></easy-loadimage>
							</view>
							<view class='text acea-row row-between'>
								<view class="nameBox">
									<view class='name line2'>
										<span v-if="Number(item.type) > 0 && Number(item.type) < 3"
											class="activity bg_color">{{item.type | orderTypeFilter}}</span>
										<span v-if="Number(item.secondType) === 1" class="activity bg_color">积分</span>
										<span>{{items.productName}}</span>
									</view>
									<view class="sku line1">{{items.sku}}</view>
								</view>
								<view class='money'>
									<view>￥{{items.price}}</view>
									<view>x{{items.payNum}}</view>
								</view>
							</view>
						</view>
						<view v-if="items.applyRefundNum && item.refundStatus > -1"
							class="text-24rpx font-color oppoSans-R mr-20px px-30 mt-14">
							售后申请数量：{{ items.applyRefundNum }}
						</view>
					</view>
					<view class='totalPrice' :class="item.status===0?'no-border':''">{{item.totalNum}}
						件商品，总金额
						<text class='money semiBold'> ￥{{item.payPrice}}</text>
					</view>
					<view v-if="item.status===0" class="mx-20 flex">
						<view class="tips w-full px-20 f-s-26">
							付款提醒<text class="ml-20 text-999">请在{{item.expirationTime}}前完成支付！</text>
						</view>
					</view>
					<!-- 订单状态（0：待支付，1：待发货,2：部分发货， 3：待核销，4：待收货,5：已收货,6：已完成，9：已取消） -->
					<view class='bottom acea-row row-right row-middle'>
						<view class='bnt cancelBnt' v-if="item.status === 0" @click='cancelOrder(index,item.orderNo)'>
							取消订单
						</view>
						<view class='bnt bg_color' v-if="item.status === 0" @click='goPay(item)'>
							立即付款
						</view>
						<view class='bnt cancelBnt' v-if="item.type==2&&item.status !== 0&&item.status !== 9"
							@click="toCheckGroup(item)">
							查看拼团
						</view>
						<view class='bnt bg_color'
							v-if="item.type==2&&item.status !== 0&&item.groupBuyRecordStatus===0&&item.status!=9"
							@click="listenerActionSheet(item)">
							邀请好友
						</view>
						<view class='bnt bg_color'
							v-if="((item.paid || item.status == 9)&&item.type!=2)||(item.type==2&&item.groupBuyRecordStatus!==0)"
							@click='goOrderDetails(item)'>
							查看详情</view>
						<view class='bnt cancelBnt' v-if="item.status==6 || item.status==9"
							@click='delOrder(item.orderNo,index)'>
							删除订单
						</view>
					</view>

				</view>
			</view>

			<view class='loadingicon acea-row row-center-wrapper'>
				<text class='loading iconfont icon-jiazai'
					:hidden='loading==false'></text>{{orderList.length>0?loadTitle:''}}
			</view>
			<view class='noCart' v-if="orderList.length == 0 && isShow && !loading">
				<view class='pictrue'>
					<image :src="urlDomain+'crmebimage/presets/nodingdan.png'"></image>
					<view class="default_txt">暂无订单信息~</view>
				</view>
			</view>
		</view>
		<!-- 分享按钮 -->
		<view class="generate-posters" :class="posters ? 'on' : ''">
			<view class="generateCon acea-row row-middle">
				<!-- #ifdef APP-PLUS -->
				<view class="item" @click="appShare('WXSceneSession')">
					<view class="iconfont icon-weixin3"></view>
					<view class="">微信好友</view>
				</view>
				<view class="item" @click="appShare('WXSenceTimeline')">
					<view class="iconfont icon-pengyouquan"></view>
					<view class="">微信朋友圈</view>
				</view>
				<!-- #endif -->
				<!-- #ifdef H5 || MP -->
				<view class="item" @click="getpreviewImage">
					<view class="pictrue">
						<image src="../static/images/changan.png"></image>
					</view>
					<view class="">预览发图</view>
				</view>
				<!-- #endif -->
				<!-- #ifdef MP  -->
				<button class="item" hover-class="none" @click="savePosterPath">
					<view class="pictrue">
						<image src="../static/images/haibao.png"></image>
					</view>
					<view class="">保存海报</view>
				</button>
				<!-- #endif -->
			</view>
			<view class="generateClose acea-row row-center-wrapper" @click="posterImageClose">取消</view>
		</view>
		<view class="mask" v-if="canvasStatus"></view>
		<!-- 海报展示 -->
		<view class='poster-pop' v-if="canvasStatus">
			<image :src='imagePath'></image>
		</view>
		<view class="canvas" v-else>
			<canvas style="width:750px;height:1190px;" canvas-id="firstCanvas"></canvas>
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
	import uQRCode from '@/js_sdk/Sansnn-uQRCode/uqrcode.js'
	import {
		HTTP_H5_URL
	} from "@/config/app.js";
	import {
		imageBase64
	} from "@/api/public";
	// #ifdef MP
	import {
		mpQrcode
	} from '@/api/api.js';
	import {
		base64src
	} from '@/utils/base64src.js'
	// #endif
	import {
		Debounce
	} from '@/utils/validate.js'
	import {
		getOrderList,
		orderCancel,
		orderDel
	} from '@/api/order.js';
	import {
		openOrderSubscribe
	} from '@/utils/SubscribeMessage.js';
	import navBar from '@/components/navBar';
	import {
		ProductTypeEnum,
	} from "@/enums/productEnums";
	import {
		toLogin
	} from '@/libs/login.js';
	import {
		mapGetters
	} from "vuex";
	import {
		setThemeColor
	} from '@/utils/setTheme.js'
	import animationType from '@/utils/animationType.js';
	import easyLoadimage from '@/components/base/easy-loadimage.vue';
	import orderPay from "@/mixins/OrderPay.js";
	const app = getApp();
	export default {
		mixins: [orderPay],
		components: {
			navBar,
			easyLoadimage
		},
		data() {
			return {
				H5ShareBox: false, //公众号分享图片
				pinkPriceImg: '../static/images/pinkPrice.png',
				posterbackgd: '../static/images/posterbackgd.png',
				pinkbackgd: '../static/images/pinkShare.png',
				pinkWhiteBg: '../static/images/whiteBg.png',
				imgTop: '',
				imagePath: '', //海报路径
				canvasStatus: false, //是否显示海报
				posters: false,
				weixinStatus: false,
				qrcodeSize: 600,
				PromotionCode: '', //二维码图片
				ProductTypeEnum: ProductTypeEnum,
				urlDomain: this.$Cache.get("imgHost"),
				navTitle: '我的订单',
				loading: false, //是否加载中
				loadend: false, //是否加载完毕
				loadTitle: '加载更多', //提示语
				orderList: [], //订单数组
				orderStatus: -1, //订单状态
				page: 1,
				limit: 20,
				pay_order_id: '',
				totalPrice: '0',
				isShow: false,
				theme: app.globalData.theme,
				bgColor: '#e93323',
				keywords: '',
				secondType: 0, //订单二级类型:0-普通订单，1-积分订单，2-虚拟订单，4-视频号订单，5-云盘订单，6-卡密订单
				publicLoginType: app.globalData.publicLoginType, //公众号登录方式(单选),1微信授权，2手机号登录
				errT: '',
				storeImage: '', //海报产品图
				selectItem: '',
				groupLeaderAvatar: ''
			};
		},
		computed: mapGetters(['isLogin', 'userInfo', 'globalData', 'uid']),
		// 滚动监听
		onPageScroll(e) {
			// 传入scrollTop值并触发所有easy-loadimage组件下的滚动监听事件
			uni.$emit('scroll');
		},
		onShow() {
			if (this.isLogin) {
				this.loadend = false;
				this.getAllOrder();
			} else {
				toLogin();
			}
		},
		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function(options) {
			if (options.status) this.orderStatus = options.status;
			if (options.secondType) this.secondType = options.secondType
		},
		methods: {
			/**
			 * 分享打开
			 *
			 */
			listenerActionSheet: function(item) {
				this.selectItem = item
				if (!item.groupBuyActivityRecord.activePrice) {
					return this.$util.Tips({
						title: '活动已失效！'
					});
				}
				if (this.isLogin) {
					//#ifdef H5
					this.make(item);
					this.ShareInfo(item);
					this.getImageBase64(item.orderInfoList[0].image, item);
					// #endif
				};
				// #ifdef MP
				this.getQrcode(item);
				// #endif
				// #ifdef MP
				this.imgTop = item.orderInfoList[0].image
				// #endif
				// #ifndef H5
				this.downloadFilestoreImage(item);
				// #endif
				this.imgTop = item.orderInfoList[0].image
				this.posters = true;
				// #ifdef H5
				if (!this.isLogin) {
					toLogin();
				} else {
					if (this.$wechat.isWeixin()) {
						this.weixinStatus = true;
					}
				}
				// #endif
			},
			closePosters: function() {
				this.posters = false;
				this.currentPage = false;
			},
			//隐藏海报
			posterImageClose: function() {
				this.canvasStatus = false
				this.posters = false;
			},
			//替换安全域名
			setDomain: function(url) {
				url = url ? url.toString() : '';
				//本地调试打开,生产请注销
				if (url.indexOf("https://") > -1) return url;
				else return url.replace('http://', 'https://');
			},
			// #ifdef APP-PLUS
			appShare(scene) {
				let that = this;
				uni.share({
					provider: "weixin",
					scene: scene,
					type: 0,
					href: `${HTTP_H5_URL}/pages/activity/status/index?pt=${that.selectItem.groupBuyActivityRecord.productId}&gt=${that.selectItem.groupBuyActivityRecord.groupActivityId}&rd=${that.selectItem.groupBuyActivityRecord.groupRecordId}&sd=${this.uid}`,
					title: that.selectItem.orderInfoList[0].productName,
					imageUrl: that.selectItem.orderInfoList[0].image,
					success: function(res) {
						that.posters = false;
					},
					fail: function(err) {
						uni.showToast({
							title: "分享失败",
							icon: "none",
							duration: 2000,
						});
						that.posters = false;
					},
				});
			},
			// #endif
			//获取海报产品图（解决跨域问题，只适用于小程序）
			downloadFilestoreImage: function(item) {
				let that = this;
				uni.downloadFile({
					url: that.setDomain(item.groupBuyActivityRecord.groupLeaderAvatar),
					success: function(res) {
						that.groupLeaderAvatar = res.tempFilePath;
					},
					fail: function() {
						return that.$util.Tips({
							title: ''
						});
						that.groupLeaderAvatar = '';
					},
				});
			},
			// 小程序关闭分享弹窗；
			goFriend: function() {
				this.posters = false;
			},
			// 小程序二维码
			getQrcode(item) {
				this.imgTop = item.orderInfoList[0].image
				this.downloadFilestoreImage(item);
				let that = this;
				let data = {
					scene: `pt=${item.groupBuyActivityRecord.productId}&gt=${item.groupBuyActivityRecord.groupActivityId}&rd=${item.groupBuyActivityRecord.groupRecordId}&sd=${this.uid}`,
					page: 'pages/activity/status/index'
				}
				mpQrcode(data).then(res => {
					base64src(res.data.code, Date.now(), res => {
						that.PromotionCode = res;
						setTimeout(() => {
							this.goPoster(item)
						}, 500)
					});
				}).catch(err => {
					that.errT = err;
				});
			},
			// 生成二维码；
			make(item) {
				let href =
					`${this.globalData.frontDomain}/pages/activity/status/index?pt=${item.groupBuyActivityRecord.productId}&gt=${item.groupBuyActivityRecord.groupActivityId}&rd=${item.groupBuyActivityRecord.groupRecordId}&sd=${this.uid}`
				uQRCode.make({
					canvasId: 'qrcode',
					text: href,
					size: this.qrcodeSize,
					margin: 10,
					success: res => {
						this.PromotionCode = res;
						setTimeout(() => {
							this.goPoster(item)
						}, 500)
					},
					complete: () => {},
					fail: res => {
						this.$util.Tips({
							title: '海报二维码生成失败！'
						});
					}
				})
			},
			getImageBase64: function(images, item) {
				let that = this;
				imageBase64({
					url: images
				}).then(res => {
					that.imgTop = res.data.code;
				})
				imageBase64({
					url: item.groupBuyActivityRecord.groupLeaderAvatar
				}).then(res => {
					that.groupLeaderAvatar = res.data.code;
				})
			},
			/**
			 * 获取产品分销二维码
			 * @param function successFn 下载完成回调
			 *
			 */
			downloadFilePromotionCode: function(successFn) {
				let that = this;
				getProductCode(that.id)
					.then(res => {
						uni.downloadFile({
							url: that.setDomain(res.data.code),
							success: function(res) {
								that.$set(that, 'isDown', false);
								if (typeof successFn == 'function') {
									successFn && successFn(res
										.tempFilePath);
								} else {
									that.$set(that, 'PromotionCode', res.tempFilePath);
								}
							},
							fail: function() {
								that.$set(that, 'isDown', false);
								that.$set(that, 'PromotionCode', '');
							}
						});
					})
					.catch(err => {
						that.$set(that, 'isDown', false);
						that.$set(that, 'PromotionCode', '');
					});
			},
			/**
			 * 生成海报
			 */
			goPoster: function(item) {
				let that = this;
				uni.showLoading({
					title: '海报生成中',
					mask: true
				});
				// that.posters = false;
				let arrImagesUrl = '';
				let arrImagesUrlTop = '';
				if (!that.PromotionCode) {
					uni.hideLoading();
					that.$util.Tips({
						title: that.errT
					});
					return
				}
				setTimeout(() => {
					if (!that.imgTop || !that.groupLeaderAvatar) {
						uni.hideLoading();
						that.$util.Tips({
							title: '无法生成商品海报！'
						});
						return
					}
				}, 1000);
				uni.downloadFile({
					url: that.imgTop, //仅为示例，并非真实的资源
					success: (res) => {
						arrImagesUrlTop = res.tempFilePath;
						let arrImages = [that.pinkbackgd, arrImagesUrlTop, that.PromotionCode, this
							.pinkWhiteBg, this.pinkPriceImg, that.groupLeaderAvatar
						];
						let name = item.orderInfoList[0].productName;
						let price = item.groupBuyActivityRecord.activePrice;
						let people = item.groupBuyActivityRecord.buyingCountNum - item
							.groupBuyActivityRecord.yetBuyingNum;
						let groupLeaderNickname = item.groupBuyActivityRecord.groupLeaderNickname
						setTimeout(() => {
							that.$util.groupCanvas(arrImages, name, price, people,
								groupLeaderNickname,
								function(tempFilePath) {
									that.imagePath = tempFilePath;
									that.canvasStatus = true;
									uni.hideLoading();
								});
						}, 500);
					}
				});
			},
			// 图片预览；
			getpreviewImage: function() {
				if (this.imagePath) {
					let photoList = [];
					photoList.push(this.imagePath)
					uni.previewImage({
						urls: photoList,
						current: this.imagePath
					});
				} else {
					this.$util.Tips({
						title: '您的海报尚未生成'
					});
				}
			},
			/*
			 * 保存到手机相册
			 */
			// #ifdef MP
			savePosterPath: function() {
				let that = this;
				uni.getSetting({
					success(res) {
						if (!res.authSetting['scope.writePhotosAlbum']) {
							uni.authorize({
								scope: 'scope.writePhotosAlbum',
								success() {
									uni.saveImageToPhotosAlbum({
										filePath: that.imagePath,
										success: function(res) {
											that.posterImageClose();
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
									})
								}
							})
						} else {
							uni.saveImageToPhotosAlbum({
								filePath: that.imagePath,
								success: function(res) {
									that.posterImageClose();
									that.$util.Tips({
										title: '保存成功',
										icon: 'success'
									});
								},
								fail: function(res) {
									that.$util.Tips({
										title: '保存失败'
									});
								},
							})
						}
					}
				})
			},
			// #endif
			//查看拼团
			toCheckGroup(item) {
				uni.navigateTo({
					url: `/pages/activity/status/index?orderNo=${item.orderNo}&rd=${item.groupBuyActivityRecord.groupRecordId}`
				})
			},
			ShareInfo(item) {
				let data = item.orderInfoList[0];
				let href =
					`${this.globalData.frontDomain}/pages/activity/status/index?pt=${item.groupBuyActivityRecord.productId}&gt=${item.groupBuyActivityRecord.groupActivityId}&rd=${item.groupBuyActivityRecord.groupRecordId}&sd=${this.uid}`
				if (this.$wechat.isWeixin() && this.publicLoginType == 1) {
					let configAppMessage = {
						// desc: data.storeInfo,
						title: data.productName,
						link: href,
						imgUrl: data.image
					};
					this.$wechat.wechatEvevt([
						"updateAppMessageShareData",
						"updateTimelineShareData",
						"onMenuShareAppMessage",
						"onMenuShareTimeline"
					], configAppMessage).then(res => {}).catch(err => {
						console.log(err);
					})
				}
			},
			//加载订单列表
			getAllOrder() {
				this.page = 1;
				this.loadend = false
				this.loading = false
				this.$set(this, 'orderList', []);
				this.getOrderList();
			},

			/**
			 * 取消订单
			 *
			 */
			cancelOrder: function(index, orderNo) {
				let that = this;
				if (!orderNo) return that.$util.Tips({
					title: '缺少订单号无法取消订单'
				});
				uni.showModal({
					content: '确定取消该订单',
					cancelText: "取消",
					confirmText: "确定",
					showCancel: true,
					confirmColor: '#f55850',
					success: (res) => {
						if (res.confirm) {
							uni.showLoading({
								title: '正在取消中'
							});
							orderCancel(orderNo).then(res => {
								uni.hideLoading();
								return that.$util.Tips({
									title: '取消成功',
									icon: 'success'
								}, function() {
									that.getAllOrder();
								});
							}).catch(err => {
								return that.$util.Tips({
									title: err
								});
							});
						} else {

						}
					},
				})
			},
			/**
			 * 打开支付组件
			 *
			 */
			goPay: Debounce(function(item) {
				uni.showLoading({
					title: '加载中...'
				});
				if (item.secondType === this.ProductTypeEnum.Integral && item.payPrice == 0) {
					// 积分商品并且支付金额为0时，直接默认走余额支付的逻辑，订单支付成功跳转到支付结果页
					this.changeOrderPay(item.orderNo, 'yue', 'yue', 'integral', 'integral', '0')
				} else {
					// 其他商品走正常流程，去支付收银台页面
					this.getToPayment(item.secondType, item)
				}
			}),
			/**
			 * 去订单详情
			 */
			goOrderDetails: function(item, status) {
				if (item.groupBuyRecordStatus === 0) return this.$util.Tips({
					title: '拼团中无法查看详情'
				});
				if (!item.orderNo) return this.$util.Tips({
					title: '缺少订单号无法查看订单详情'
				});
				//虚拟商品
				if (item.secondType === this.ProductTypeEnum.CloudDrive || item.secondType === this.ProductTypeEnum
					.CardPassword) {
					// #ifdef MP
					uni.navigateTo({
						url: '/pages/goods/virtual_order_details/index?orderNo=' + item.orderNo
					})
					// #endif
					// #ifndef MP
					uni.navigateTo({
						animationType: animationType.type,
						animationDuration: animationType.duration,
						url: '/pages/goods/virtual_order_details/index?orderNo=' + item.orderNo
					})
					// #endif
				} else {
					// #ifdef MP
					uni.navigateTo({
						url: '/pages/goods/order_details/index?orderNo=' + item.orderNo
					})
					// #endif
					// #ifndef MP
					uni.navigateTo({
						animationType: animationType.type,
						animationDuration: animationType.duration,
						url: '/pages/goods/order_details/index?orderNo=' + item.orderNo
					})
					// #endif
				}

			},
			/**
			 * 切换类型
			 */
			statusClick: function(status) {
				if (status == this.orderStatus) return;
				this.orderStatus = status;
				this.loadend = false;
				this.getAllOrder();
			},
			/**
			 * 获取订单列表
			 */
			getOrderList: function() {
				let that = this;
				if (that.loadend) return;
				if (that.loading) return;
				that.loading = true;
				that.loadTitle = "加载更多";
				getOrderList({
					status: that.orderStatus,
					page: that.page,
					limit: that.limit,
					keywords: that.keywords,
					secondType: that.secondType
				}).then(res => {
					let list = res.data.list || [];
					let loadend = list.length < that.limit;
					that.orderList = that.$util.SplitArray(list, that.orderList);
					that.$set(that, 'orderList', that.orderList);
					that.loadend = loadend;
					that.loading = false;
					that.loadTitle = loadend ? "我也是有底线的" : '加载更多';
					that.page = that.page + 1;
					that.isShow = true;
				}).catch(err => {
					that.loading = false;
					that.loadTitle = "加载更多";
				})
			},

			/**
			 * 删除订单
			 */
			delOrder: function(orderNo, index) {
				uni.showModal({
					content: '确定删除该订单',
					cancelText: "取消",
					confirmText: "确定",
					showCancel: true,
					confirmColor: '#f55850',
					success: (res) => {
						if (res.confirm) {
							let that = this;
							orderDel(orderNo).then(res => {
								that.getAllOrder();
								return that.$util.Tips({
									title: '删除成功',
									icon: 'success'
								});
							}).catch(err => {
								return that.$util.Tips({
									title: err
								});
							})
						} else {

						}
					},
				})
			},
			// 返回上一页
			toBack() {
				uni.navigateBack({
					delta: 1
				})
			},
			//搜索
			search() {
				this.orderList = []
				this.loadend = false
				this.loading = false
				this.page = 1
				this.getOrderList()
			}
		},
		onReachBottom: function() {
			this.getOrderList();
		}
	}
</script>
s
<style scoped lang="scss">
	.tips{
		height: 72rpx;
		line-height: 72rpx;
		background: #F5F5F5;
		border-radius: 8rpx;
		color: #333;
	}
	.activity {
		width: 56rpx;
		height: 32rpx;
		border-radius: 4rpx;
		opacity: 1;
		display: inline-block;
		color: #fff;
		margin-right: 8rpx;
		line-height: 32rpx;
		text-align: center;
		font-size: 20rpx;
	}

	.mp-bg {
		top: 0;
		position: fixed;
		left: 0;
		width: 100%;
		// height: 120rpx;
		// @include index-gradient(theme);
		background: #fff;
		/* #ifdef H5 */
		padding: 30rpx 30rpx 0 30rpx;
		/* #endif */
		/* #ifdef MP || APP-PLUS */
		padding: 0 30rpx;
		/* #endif */
		z-index: 99;
	}

	.my-order {
		/* #ifdef H5 */
		margin-top: 220rpx !important;
		/* #endif */
		/* #ifdef MP || APP-PLUS */
		margin-top: 190rpx !important;

		/* #endif */
		.header {
			height: 250rpx;
			padding: 0 30rpx;
		}
	}

	.bg_color {
		@include main_bg_color(theme);
	}

	.my-order .header .picTxt {
		height: 190rpx;
	}

	.my-order .header .picTxt .text {
		color: rgba(255, 255, 255, 0.8);
		font-size: 26rpx;
		font-family: 'Guildford Pro';
	}

	.my-order .header .picTxt .text .name {
		font-size: 34rpx;
		font-weight: bold;
		color: #fff;
		margin-bottom: 20rpx;
	}

	.my-order .header .picTxt .pictrue {
		width: 120rpx;
		height: 120rpx;
	}

	.my-order .header .picTxt .pictrue image {
		width: 100%;
		height: 100%;
	}

	.nav {
		background-color: #fff;
		justify-content: space-between;
		align-items: center;
	}

	.nav .item {
		font-size: 26rpx;
		color: #282828;
		padding: 25rpx 0;
		display: inline-block;
		font-size: 26rpx;
	}

	.nav .item.on {
		/* #ifdef H5 || MP */
		font-weight: bold;
		/* #endif */
		/* #ifdef APP-PLUS */
		color: #000;
		/* #endif */
		position: relative;
		@include main_color(theme);
		font-size: 30rpx;
	}

	.nav .item .num {
		margin-top: 18rpx;
	}

	.my-order .list {
		width: 690rpx;
		margin: 14rpx auto 0 auto;
	}

	.my-order .list .item {
		background-color: #fff;
		border-radius: 14rpx;
		margin-bottom: 14rpx;
	}

	.my-order .list .item .title {
		height: 84rpx;
		padding: 0 24rpx;
		border-bottom: 1rpx solid #eee;
		font-size: 28rpx;
		color: #282828;
	}

	.my-order .list .item .title .sign {
		font-size: 24rpx;
		padding: 0 13rpx;
		height: 36rpx;
		margin-right: 15rpx;
		border-radius: 18rpx;
		@include coupons_border_color(theme);
		@include main_color(theme);
	}

	.my-order .list .item .item-info {
		padding: 0 30rpx;
		margin-top: 22rpx;
	}

	.my-order .list .item .item-info .pictrue {
		width: 120rpx;
		height: 120rpx;
	}

	.my-order .list .item .item-info .pictrue image {
		width: 100%;
		height: 100%;
		border-radius: 14rpx;
		overflow: hidden;
	}

	.my-order .list .item .item-info {
		.nameBox {
			position: relative;
			height: 120rpx;
		}

		.sku {
			font-size: 20rpx;
			position: absolute;
			bottom: 4rpx;
			width: 420rpx;
		}

		.text {
			width: 496rpx;
			font-size: 28rpx;
			color: #999;
		}
	}

	.my-order .list .item .item-info .text .name {
		width: 326rpx;
		color: #282828;
	}

	.my-order .list .item .item-info .text .money {
		text-align: right;
	}

	.font_color {
		@include main_color(theme);
	}

	.my-order .list .item .totalPrice {
		font-size: 26rpx;
		color: #282828;
		text-align: right;
		margin: 27rpx 0 0 30rpx;
		padding: 0 30rpx 30rpx 0;
		border-bottom: 1rpx solid #eee;
	}

	.my-order .list .item .totalPrice .money {
		font-size: 28rpx;
		font-weight: bold;
		@include price_color(theme);
	}

	.my-order .list .item .bottom {
		height: 107rpx;
		padding: 0 30rpx;
	}

	.my-order .list .item .bottom .bnt {
		width: 176rpx;
		height: 60rpx;
		text-align: center;
		line-height: 60rpx;
		color: #fff;
		border-radius: 50rpx;
		font-size: 27rpx;
	}

	.my-order .list .item .bottom .bnt.cancelBnt {
		border: 1rpx solid #ddd;
		color: #aaa;
	}

	.my-order .list .item .bottom .bnt~.bnt {
		margin-left: 17rpx;
	}

	.noCart {
		margin-top: 171rpx;
		padding-top: 0.1rpx;
	}

	.noCart .pictrue {
		width: 414rpx;
		height: 336rpx;
		margin: 78rpx auto 56rpx auto;
	}

	.noCart .pictrue image {
		width: 100%;
		height: 100%;
	}

	.icon-xiangyou {
		font-size: 24rpx;
	}

	.default_txt {
		font-size: 26rpx;
		color: #999;
		text-align: center;
	}

	.searchCon {
		padding: 10rpx 0rpx;
		align-items: center;

		.search {
			flex: 1;
			height: 60rpx;
			padding: 0 32rpx;
			border-radius: 36rpx;
			background: #F5F5F5;
			margin-left: 5px;

			.iconfont {
				margin-right: 16rpx;
				font-size: 30rpx;
				color: #999999;
			}

			.inputs {
				flex: 1;
				font-size: 28rpx;
				color: #333;
			}

			.placeholder {
				font-size: 26rpx;
				color: #ccc;
			}
		}

		.btn {
			width: 72rpx;
			height: 60rpx;
			line-height: 60rpx;
			margin-left: 20rpx;
			background: #FFFFFF;
			text-align: center;
			font-size: 30rpx;
			color: #282828;

			.iconfont {
				font-size: 32rpx;
				line-height: 72rpx;
				color: #666666;
			}
		}
	}

	.canvas {
		position: fixed;
		z-index: -5;
		opacity: 0;
	}

	.poster-pop {
		position: fixed;
		width: 500rpx;
		height: 714rpx;
		top: 50%;
		left: 50%;
		transform: translateX(-50%);
		margin-top: -432rpx;
		z-index: 399;
		// background-image: url('https://api.admin.merchant.crmeb.xbdzz.cn/crmebimage/public/product/2024/08/13/8a25e3c98d864299b7a5201f70ea24edkoj7sce8za.png');
		// background-size: cover;
	}

	.poster-pop image {
		width: 100%;
		height: 100%;
		display: block;
	}

	.poster-pop .close {
		width: 46rpx;
		height: 75rpx;
		position: fixed;
		right: 0;
		top: -73rpx;
		display: block;
	}

	.poster-pop .save-poster {
		background-color: #df2d0a;
		font-size: ：22rpx;
		color: #fff;
		text-align: center;
		height: 76rpx;
		line-height: 76rpx;
		width: 100%;
	}

	.poster-pop .keep {
		color: #fff;
		text-align: center;
		font-size: 25rpx;
		margin-top: 10rpx;
	}

	.mask {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.6);
		z-index: 99;
	}

	.generate-posters {
		width: 100%;
		height: 318rpx;
		background-color: #fff;
		position: fixed;
		left: 0;
		bottom: 0;
		z-index: 388;
		transform: translate3d(0, 100%, 0);
		transition: all 0.3s cubic-bezier(0.25, 0.5, 0.5, 0.9);
		border-top: 1rpx solid #eee;

		.generateCon {
			height: 220rpx;
		}

		.generateClose {
			height: 98rpx;
			font-size: 28rpx;
			color: #333333;
			border-top: 1px solid #eee;
		}

		.item {
			.pictrue {
				width: 96rpx;
				height: 96rpx;
				border-radius: 50%;
				margin: 0 auto 6rpx auto;

				::v-deepimage,
				.easy-loadimage,
				image,
				uni-image {
					width: 100%;
					height: 100%;
					border-radius: 50%;
				}
			}
		}
	}

	.generate-posters.on {
		transform: translate3d(0, 0, 0);
	}

	.generate-posters .item {
		flex: 1;
		text-align: center;
		font-size: 30rpx;
	}

	.generate-posters .item .iconfont {
		font-size: 80rpx;
		color: #5eae72;
	}

	.generate-posters .item .iconfont.icon-haibao {
		color: #5391f1;
	}

	.generate-posters .item .iconfont.icon-haowuquan1 {
		color: #ff954d;
	}
</style>