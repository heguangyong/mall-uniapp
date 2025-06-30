<template>
	<view class="group-con" v-if="allData">
		<view class="w-full header-gradient relative z-99">
			<view class="swiper-box" v-if="allData.groupBuyUserActivityDoneList">
				<swiper :indicator-dots="false" autoplay interval="2500" duration="500" vertical="true" circular="true">
					<block v-for="(item,index) in allData.groupBuyUserActivityDoneList" :key='index' v-if="item.id>0">
						<swiper-item>
							<view class='line1'>
								<image class="swiper-img" :src="item.groupAvatar" mode=""></image>
								<text class="swiper-text">{{item.groupNickname}} 拼团成功</text>
							</view>
						</swiper-item>
					</block>
				</swiper>
			</view>
			<view class="p-20 p-bottom" @click="toGroupProduct">
				<view class="w-full bg--w111-fff rd-24rpx p-20 flex relative">
					<easy-loadimage mode="widthFix" :image-src="allData.productDetailResponse.productInfo.image"
						width="240rpx" height="240rpx" :radius="10"></easy-loadimage>
					<view class="flex-1 h-240 pl-20 flex-col justify-between">
						<view class="w-full">
							<view class="w-full fs-28 lh-40rpx line2">{{allData.productDetailResponse.productInfo.name}}
							</view>
							<view class="flex fs-20 mt-14">
								<view class="tuan-num text--w111-fff flex-center">
									{{allData.recordForShare.buyingCountNum}}人团
								</view>
								<view class="complete font-red flex-center">已拼{{allData.recordForShare.latestBuyCount}}份
								</view>
							</view>
						</view>
						<view class="w-full flex-between-center">
							<view>
								<view class="flex items-baseline">
									<text class="fs-22 lh-30rpx font-red fw-500">拼团价:</text>
									<priceStyle :price="allData.recordForShare.activePrice"></priceStyle>
								</view>
								<view class="text-line text--w111-999 fs-22 lh-30rpx mt-12">
									¥{{allData.productDetailResponse.productInfo.price}}</view>
							</view>
						</view>
					</view>
					<view class="abs-badge">
						<image class="w-full h-full" src="../static/images/pinkSucess.png" v-if="pinkBool === 10">
						</image>
						<image class="w-full h-full" src="../static/images/pinkErr.png" v-else-if="pinkBool === -1">
						</image>
					</view>
				</view>
			</view>
		</view>
		<view class="px-20">
			<view class="wrapper">
				<view class="tips sucess-tips" v-if="pinkBool === 10">恭喜您拼团成功</view>
				<view class="tips font-num-err" v-else-if="pinkBool === -1">还差<span
						class="font-num  pl-10 pr-10">{{ allData.recordForShare.buyingCountNum-allData.recordForShare.yetBuyingNum  }}人</span>，拼团失败
				</view>
				<view class="tips" v-else-if="pinkBool === 0">拼团中，还差<span
						class="font-num font-num-sucess pl-10 pr-10">{{ allData.recordForShare.buyingCountNum-allData.recordForShare.yetBuyingNum }}人</span>拼团成功
				</view>
				<view class="title acea-row row-center-wrapper" v-if="pinkBool === 0">
					<view class="name acea-row row-center-wrapper">
						剩余
						<CountDown :is-day="true" :tip-text="' '" :day-text="' : '" :hour-text="' : '"
							:minute-text="' : '" :second-text="' '" :isCol="false" :datatime="dataTimeLimit"
							:bgColor="bgColor"></CountDown>结束
					</view>
				</view>
				<view class="list acea-row row-middle result" :class="[ iShidden ? 'on' : '']">
					<view class="pictrue" v-if="(fictiStatus===1&&pinkBool!==10)||fictiStatus!==1"
						v-for="(item, index) in allData.groupBuyUserList" :key="index">
						<view class="image-box" v-if="item.id">
							<image class="groupAvater" :src="item.groupAvatar" />
						</view>
						<image v-else src="../static/images/pinkNo.png" mode=""></image>
						<view v-if="item.isLeader" class="group-leader">团长</view>
					</view>
					<view class="pictrue" v-if="fictiStatus===1&&pinkBool===10"
						v-for="(item, index) in allData.groupBuyUserList" :key="index">
						<view class="image-box" v-if="item.id">
							<image class="groupAvater" :src="item.groupAvatar" />
						</view>
						<view class="image-box" v-else>
							<image src="../static/images/normal.png" mode=""></image>
						</view>
						<view v-if="item.isLeader" class="group-leader">团长</view>
					</view>
				</view>
				<view v-if=" allData.groupBuyUserList.length > 10" class="lookAll acea-row row-center-wrapper"
					@click="lookAll">
					{{ iShidden ? '收起' : '查看全部' }}
					<span class="iconfont" :class="iShidden ? 'icon-xiangshang' : 'icon-xiangxia'"></span>
				</view>
				<view v-if="userBool === 1 && isOk == 0 && pinkBool === 0">
					<view class="teamBnt" @click="listenerActionSheet">邀请好友参团</view>
				</view>
				<view class="teamBnt" v-else-if="userBool === 0 && pinkBool === 0">
					<view @click="toAddGroup">我要参团</view>
				</view>
				<view class="teamBnt" v-if="pinkBool === 10 || pinkBool === -1"
					@click="goDetail(allData.recordForShare.productId,allData.recordForShare.groupActivityId)">
					{{`${pinkBool === 10?'再次':'重新'}开团`}}
				</view>
				<view class="lookOrder" v-if="pinkBool === 10" @click="goOrder">
					查看订单信息
					<span class="iconfont icon-xiangyou"></span>
				</view>
			</view>
			<!--  -->
			<view class="play-wrapper">
				<view class="w-full flex-center">
					<image class="zs" src="../static/images/pinkLeft.png"></image>
					<text class="fs-28 fw-500 text--w111-333 lh-44rpx px-6">拼团玩法</text>
					<image class="zs" src="../static/images/pinkRight.png"></image>
				</view>
				<view class="wrapper-main acea-row row-center-wrapper">
					<view class="progress-box">
						<view class="progress">
							<view v-if="!nowShow&&pinkBool != 10" class="inner inner1 bg-red"></view>
							<view v-if="nowShow&&pinkBool !== 10" class="inner inner2 bg-red"></view>
							<view v-if="pinkBool === 10" class="inner inner3 bg-red"></view>
						</view>
						<view class="steps acea-row">
							<view class="item">
								<view class="head bg-red">1</view>
								<view class="main">开团/参团享团购价</view>
							</view>
							<view class="item">
								<view class="head bg-red" :class="nowShow&&pinkBool !== 10?'bg-red':''">2</view>
								<view class="main">邀请好友参团优惠多</view>
							</view>
							<view class="item">
								<view class="head" :class="pinkBool === 10 ? 'bg-red' : ''">3</view>
								<view class="main">人满发货不满退款</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="mt-40 all-pink">
				<view class="w-full flex-center">
					<image class="zs" src="../static/images/pinkLeft.png"></image>
					<text class="fs-28 fw-500 text--w111-333 lh-44rpx px-6">大家都在拼</text>
					<image class="zs" src="../static/images/pinkRight.png"></image>
				</view>
				<view class="card w-full bg--w111-fff rd-24rpx p-20 flex mt-24" v-for="(item,index) in groupGood"
					:key="index" @tap="goDetail(item.productId,item.groupActivityId)">
					<view class="relative">
						<view v-show="item.quota===0" class="sellOut">已售罄</view>
						<easy-loadimage mode="widthFix" :image-src="item.imageUrl" width="240rpx" height="240rpx"
							:radius="10"></easy-loadimage>
					</view>
					<view class="flex-1 h-240 pl-20 flex-col justify-between">
						<view class="w-full">
							<view class="w-full fs-28 lh-40rpx line2">{{item.productName}}</view>
							<view class="flex fs-20 mt-14">
								<view class="tuan-num text--w111-fff flex-center">{{item.buyCount}}人团</view>
								<view class="complete font-red flex-center">已拼{{item.latestBuyCount}}份</view>
							</view>
						</view>
						<view class="w-full flex-between-center flex-special">
							<view>
								<view class="flex items-baseline">
									<text class="fs-22 lh-30rpx font-red fw-500">拼团价:</text>
									<priceStyle :price="item.activePrice"></priceStyle>
								</view>
								<view class="text-line text--w111-999 fs-22 lh-30rpx mt-12">¥{{item.price}}</view>
							</view>
							<view class="groupBtn">参与拼团</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 分享按钮 -->
		<view class="generate-posters" :class="posters ? 'on' : ''">
			<view class="generateCon acea-row row-middle">
				<!-- #ifdef MP -->
				<button class="item" open-type="share" hover-class="none">
					<view class="pictrue">
						<image src="../static/images/weixin.png"></image>
					</view>
					<view class="">分享给好友</view>
				</button>
				<!-- #endif -->
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
		<!-- 发送给朋友图片 -->
		<view class="share-box" v-if="H5ShareBox">
			<image :src="urlDomain + 'crmebimage/presets/share-info.png'" @click="H5ShareBox = false"></image>
		</view>
	</view>
	</view>
</template>
<script>
	import {
		HTTP_H5_URL
	} from "@/config/app.js";
	// #ifdef MP
	import {
		base64src
	} from '@/utils/base64src.js'
	import {
		mpQrcode
	} from '@/api/api.js';
	// #endif
	import {
		groupBuySkuListApi
	} from '@/api/group'
	import {
		imageBase64
	} from "@/api/public";
	import uQRCode from '@/js_sdk/Sansnn-uQRCode/uqrcode.js'
	import CountDown from '@/components/countDown';
	import BaseMoney from '@/components/BaseMoney.vue';
	import easyLoadimage from '@/components/base/easy-loadimage.vue';
	import priceStyle from '@/components/priceStyle'
	import {
		groupbuySkuOrderShare,
		groupbuySkuOrderReadShare
	} from '@/api/activity.js'
	import {
		toLogin
	} from '@/libs/login.js';
	import {
		tokenIsExistApi
	} from "@/api/api.js";
	import {
		silenceBindingSpread
	} from "@/utils";
	import {
		mapGetters
	} from "vuex";
	const app = getApp();
	export default {
		components: {
			CountDown,
			BaseMoney,
			easyLoadimage,
			priceStyle
		},
		data: function() {
			return {
				where: {
					page: 1,
					limit: 5,
					showgroup: 1,
				},
				pinkPriceImg: '../static/images/pinkPrice.png',
				pinkbackgd: '../static/images/pinkShare.png',
				pinkWhiteBg: '../static/images/whiteBg.png',
				qrcodeSize: 600,
				canvasStatus: false, //是否显示海报
				bgColor: {
					'bgColor': 'rgba(233,51,35,0.2)',
					'Color': '#E93323',
					'width': '36rpx',
					'timeTxtwidth': '16rpx',
					'isDay': true
				},
				isOk: 0, //判断拼团是否完成
				pinkBool: 0, //判断拼团是否成功
				userBool: 1, //判断当前用户是否在团内|0=未在,1=在
				pinkT: [], //团长信息
				iShidden: false,
				userInfo: {},
				posters: false,
				weixinStatus: false,
				H5ShareBox: false, //公众号分享图片
				attrValue: '', //已选属性
				/* imgHost: HTTP_REQUEST_URL, */
				endTime: false,
				allData: null,
				loadend: false,
				loading: false,
				loadTitle: '加载更多',
				groupGood: [],
				imgTop: '',
				storeImage: '', //海报产品图
				errT: '',
				imagePath: '', //海报路径
				publicLoginType: app.globalData.publicLoginType, //公众号登录方式(单选),1微信授权，2手机号登录
				orderNo: '',
				nowShow: '',
				sd: null,
				fictiStatus: 0,
				groupLeaderAvatar: '',
				urlDomain: this.$Cache.get("imgHost"),
			};
		},
		onShow() {
			// #ifdef MP
			uni.setNavigationBarColor({
				frontColor: '#ffffff',
				backgroundColor: '#E93323',
			})
			// #endif
			//绑定分销关系
			this.getTokenIsExist();
		},
		onLoad(options) {
			let value;
			//小程序扫码进入
			if (options.scene) {
				value = this.$util.getUrlParams(decodeURIComponent(options.scene));
			} else {
				value = options
			}
			value.sd && (this.sd = value.sd)
			value.orderNo && this.getData(value.orderNo)
			if (value.sd) this.$store.commit('Change_Spread', value.sd);
			if (!value.orderNo) {
				this.getShareData(value)
			}
			this.getGroupList();
		},
		// 滚动监听
		onPageScroll(e) {
			// 传入scrollTop值并触发所有easy-loadimage组件下的滚动监听事件
			uni.$emit('scroll');
		},

		// #ifdef MP
		/**
		 * 用户点击右上角分享
		 */
		onShareAppMessage: function() {
			let that = this;
			return {
				title: that.allData.productDetailResponse.productInfo.name || '',
				imageUrl: that.allData.productDetailResponse.productInfo.image || '',
				path: `/pages/activity/status/index?gt=${that.allData.recordForShare.groupActivityId}&pt=${that.allData.recordForShare.productId}&rd=${that.allData.recordForShare.groupRecordId}&sd=${that.uid}`,
			}
		},
		// #endif
		computed: {
			dataTimeLimit() {
				let date;
				if (this.allData) {
					date = new Date(this.allData.recordForShare.endTime.replace(/-/g, "/")).getTime() / 1000
				}
				return date
			},
			...mapGetters(['isLogin', 'globalData', 'uid']),
		},
		methods: {
			toGroupProduct() {
				uni.navigateTo({
					url: `/pages/goods/goods_details/index?id=${this.allData.recordForShare.productId}&mt=2&gd=${this.allData.recordForShare.groupActivityId}`
				})
			},
			nowShowChange() {
				let arr = this.allData.groupBuyUserList.filter(val => val.id > 0)
				this.nowShow = arr.length > 1 ? true : false
			},
			//校验token是否有效,true为有效，false为无效
			getTokenIsExist() {
				tokenIsExistApi().then((res) => {
					silenceBindingSpread(this.isLogin, this.globalData.spread);
				}).catch(err => {});
			},
			//去订单
			goOrder() {
				uni.navigateTo({
					url: '/pages/goods/order_details/index?orderNo=' + this.orderNo
				})
			},
			//to商品详情
			goDetail(productId, groupActivityId) {
				uni.navigateTo({
					url: `/pages/goods/goods_details/index?id=${productId}&mt=2&gd=${groupActivityId}`
				})
			},
			//我要参团
			toAddGroup() {
				uni.navigateTo({
					url: `/pages/goods/goods_details/index?id=${this.allData.recordForShare.productId}&mt=2&gd=${this.allData.recordForShare.groupActivityId}&rd=${this.allData.recordForShare.groupRecordId}&sd=${this.sd}`
				})
			},
			lookAll: function() {
				this.iShidden = !this.iShidden;
			},
			getData(orderNo) {
				groupbuySkuOrderShare(orderNo).then(res => {
					this.allData = res.data
					this.pinkBool = res.data.recordForShare.recordStatus
					this.isOk = res.data.recordForShare.recordStatus == 0 ? 0 : 1
					this.fictiStatus = res.data.recordForShare.fictiStatus
					this.orderNo = res.data.orderNo
					this.getShareInfo()
					this.nowShowChange()
				}).catch(err => {
					uni.showToast({
						title: err,
						icon: 'none'
					})
					setTimeout(() => {
						uni.switchTab({
							url: '/pages/index/index'
						})
					}, 500)
				})
			},
			getShareData(options) {
				groupbuySkuOrderReadShare(options.gt, options.pt, options.rd).then(res => {
					this.allData = res.data
					this.pinkBool = res.data.recordForShare.recordStatus
					this.isOk = res.data.recordForShare.recordStatus == 0 ? 0 : 1
					this.fictiStatus = res.data.recordForShare.fictiStatus
					this.userBool = res.data.recordForShare.canBuyFlag
					this.orderNo = res.data.orderNo
					this.getShareInfo()
					this.nowShowChange()
				}).catch(err => {
					uni.showToast({
						title: err,
						icon: 'none'
					})
					setTimeout(() => {
						uni.switchTab({
							url: '/pages/index/index'
						})
					}, 500)
				})
			},
			getShareInfo() {
				if (this.isLogin) {
					//#ifdef H5
					this.make();
					this.ShareInfo();
					this.getImageBase64(this.allData.productDetailResponse.productInfo.image);
					// #endif
				};
				// #ifdef MP
				this.getQrcode();
				// #endif
				// #ifdef MP
				this.imgTop = this.allData.productDetailResponse.productInfo.image
				// #endif
				// #ifndef H5
				this.downloadFilestoreImage();
				// #endif
			},
			/**
			 * 分享打开
			 *
			 */
			listenerActionSheet: function() {
				this.goPoster()
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
					href: `${HTTP_H5_URL}/pages/activity/status/index?gt=${this.allData.recordForShare.groupActivityId}&pt=${this.allData.recordForShare.productId}&rd=${this.allData.recordForShare.groupRecordId}&sd=${this.uid}`,
					title: that.allData.productDetailResponse.productInfo.name,
					imageUrl: that.allData.productDetailResponse.productInfo.image,
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
			downloadFilestoreImage: function() {
				let that = this;
				uni.downloadFile({
					url: that.setDomain(that.allData.recordForShare.groupLeaderAvatar),
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
			getQrcode() {
				let that = this;
				let data = {
					scene: `gt=${this.allData.recordForShare.groupActivityId}&pt=${this.allData.recordForShare.productId}&rd=${this.allData.recordForShare.groupRecordId}&sd=${this.uid}`,
					page: 'pages/activity/status/index'
				}
				mpQrcode(data).then(res => {
					base64src(res.data.code, Date.now(), res => {
						that.PromotionCode = res;
					});

				}).catch(err => {
					that.errT = err;
				});
			},
			// 生成二维码；
			make() {
				let href =
					`${this.globalData.frontDomain}/pages/activity/status/index?gt=${this.allData.recordForShare.groupActivityId}&pt=${this.allData.recordForShare.productId}&rd=${this.allData.recordForShare.groupRecordId}&sd=${this.uid}`
				uQRCode.make({
					canvasId: 'qrcode',
					text: href,
					size: this.qrcodeSize,
					margin: 10,
					success: res => {
						this.PromotionCode = res;
					},
					complete: () => {},
					fail: res => {
						this.$util.Tips({
							title: '海报二维码生成失败！'
						});
					}
				})
			},
			getImageBase64: function(images) {
				let that = this;
				imageBase64({
					url: images
				}).then(res => {
					that.imgTop = res.data.code;
				})
				imageBase64({
					url: that.allData.recordForShare.groupLeaderAvatar
				}).then(res => {
					that.groupLeaderAvatar = res.data.code;
				})
			},
			/**
			 * 生成海报
			 */
			goPoster: function() {
				let that = this;
				uni.showLoading({
					title: '海报生成中',
					mask: true
				});
				that.posters = false;
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
						let arrImages = [that.pinkbackgd, arrImagesUrlTop, that.PromotionCode, that
							.pinkWhiteBg, that.pinkPriceImg, that.groupLeaderAvatar
						];
						let name = that.allData.productDetailResponse.productInfo.name;
						let price = that.allData.recordForShare.activePrice;
						let people = that.allData.recordForShare.buyingCountNum - that.allData
							.recordForShare.yetBuyingNum;
						let groupLeaderNickname = that.allData.recordForShare.groupLeaderNickname
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
			ShareInfo() {
				let data = this.allData.productDetailResponse.productInfo;
				let href =
					`${this.globalData.frontDomain}/pages/activity/status/index?gt=${this.allData.recordForShare.groupActivityId}&pt=${this.allData.recordForShare.productId}&rd=${this.allData.recordForShare.groupRecordId}&sd=${this.uid}`;
				if (this.$wechat.isWeixin() && this.publicLoginType == 1) {
					let configAppMessage = {
						// desc: data.storeInfo,
						title: data.name,
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
			//拼团商品列表
			getGroupList() {
				if (this.loadend) return;
				if (this.loading) return;
				this.loading = true;
				groupBuySkuListApi(this.where).then(res => {
					let list = res.data;
					let limit = this.where.limit;
					this.where.page++;
					this.loadend = limit > list.length;
					this.groupGood = this.groupGood.concat(list);
					this.loading = false;
					this.loadTitle = this.loadend ? '没有更多内容啦~' : '加载更多';
				}).catch(err => {
					this.loading = false;
					this.loadTitle = '加载更多';
					return this.$util.Tips({
						title: err
					});
				})
			},
			onReachBottom() {
				this.getGroupList();
			}
		}
	};
</script>
<style lang="scss" scoped>
	.header-gradient {
		background: linear-gradient(180deg, #E93323 0%, #E93323 52%, #F5F5F5 100%);
	}

	.tuan-num {
		width: 70rpx;
		height: 32rpx;
		background: #E93323;
		border-radius: 8rpx 0 0 8rpx;
	}

	.complete {
		width: 110rpx;
		height: 32rpx;
		background: rgba(233, 51, 35, 0.1);
		border-radius: 0 8rpx 8rpx 0;
	}

	.font-red {
		color: #e93323;
	}

	.bg-red {
		background: linear-gradient(90deg, #FF7931 0%, #E93323 100%) !important;
	}

	.notice-box {
		width: 348rpx;
		background: linear-gradient(270deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0) 99%);
	}

	.zs {
		width: 42rpx;
		height: 36rpx;
	}

	.abs-badge {
		width: 102rpx;
		height: 102rpx;
		position: absolute;
		right: 20rpx;
		bottom: 20rpx;
		border-radius: 50%;
	}

	.generate-posters {
		width: 100%;
		background-color: #fff;
		position: fixed;
		left: 0;
		bottom: 0;
		z-index: 300;
		transform: translate3d(0, 100%, 0);
		transition: all 0.3s cubic-bezier(0.25, 0.5, 0.5, 0.9);
		border-top: 1rpx solid #eee;
	}

	.generate-posters.on {
		transform: translate3d(0, 0, 0);
	}

	.generate-posters .item {
		display: flex;
		flex-direction: column;
		align-items: center;
		flex: 1;
		text-align: center;
		font-size: 30rpx;
	}

	.generate-posters .item .pictrue {
		width: 86rpx;
		height: 86rpx;
		margin-bottom: 10rpx;

		image {
			width: 100%;
			height: 100%;
			border-radius: 50%;
		}
	}

	.generate-posters .item .iconfont {
		font-size: 80rpx;
		color: #5eae72;
	}

	.generate-posters .item .iconfont.icon-haibao {
		color: #5391f1;
	}

	.group-con {
		padding-bottom: 30rpx !important;
	}

	.group-con .wrapper {
		background-color: #fff;
		margin-top: 20rpx;
		padding: 48rpx 0;
		border-radius: 24rpx;
	}

	.group-con .wrapper .title {
		margin-top: 48rpx;
	}

	.group-con .wrapper .title .line {
		width: 136rpx;
		height: 1px;
		background-color: #ddd;
	}

	.group-con .wrapper .title .name {
		// margin: 0 45rpx;
		font-size: 24rpx;
		line-height: 36rpx;
		color: #3D3D3D;
	}

	.group-con .wrapper .title .name .time {
		margin: 0 12rpx;
	}

	.group-con .wrapper .title .name .timeTxt {
		color: #fc4141;
	}

	.group-con .wrapper .title .name ::v-deep.time .styleAll {
		text-align: center;
		border-radius: 8rpx;
		font-size: 24rpx;
		font-weight: bold;
		display: inline-block;
		vertical-align: middle;
		width: 36rpx;
		height: 36rpx;
		line-height: 36rpx;
	}

	.group-con .wrapper .tips {
		font-size: 32rpx;
		font-weight: bold;
		text-align: center;
		// margin-top: 30rpx;
		line-height: 42rpx;
		color: #333333;
	}

	.group-con .wrapper .list {
		// padding: 0 30rpx;
		padding-left: 44rpx;
		margin-top: 40rpx;
	}

	.group-con .wrapper .list.result {
		position: relative;
		max-height: 240rpx;
		overflow: hidden;
		padding-top: 20rpx;

		.group-leader {
			position: absolute;
			width: 72rpx;
			height: 30rpx;
			background: #E93323;
			border-radius: 16rpx;
			font-size: 20rpx;
			color: #FFFFFF;
			text-align: center;
			line-height: 30rpx;
			top: 72rpx;
			left: 10rpx;
		}
	}

	.group-con .wrapper .list.result.on {
		max-height: 2000rpx;
	}

	.group-con .wrapper .list .pictrue {
		width: 94rpx;
		height: 94rpx;
		margin: 0 38rpx 30rpx 0;
		position: relative;
	}

	.group-con .wrapper .list .pictrue .label {
		position: absolute;
		bottom: 0;
		left: 50%;
		width: 72rpx;
		height: 30rpx;
		margin: 18rpx 0 0 -36rpx;
		color: #fff;
		font-size: 20rpx;
		background-color: var(--view-theme);
		text-align: center;
		line-height: 30rpx;
		border-radius: 15rpx;
	}

	.group-con .wrapper .list .pictrue img,
	.group-con .wrapper .list .pictrue image {
		width: 100%;
		height: 100%;
		border-radius: 50%;
		border: 2rpx solid var(--view-theme);
	}

	.group-con .wrapper .list .pictrue image.img-none {
		border: none;
	}

	.group-con .wrapper .lookAll {
		font-size: 24rpx;
		color: #282828;
		padding-top: 10rpx;
	}

	.group-con .wrapper .lookAll .iconfont {
		font-size: 25rpx;
		margin: 2rpx 0 0 10rpx;
	}

	.group-con .wrapper .teamBnt {
		font-size: 28rpx;
		width: 646rpx;
		height: 88rpx;
		border-radius: 44rpx;
		text-align: center;
		line-height: 88rpx;
		color: #fff;
		margin: 32rpx auto 0;
		background-color: #e93323;
	}

	.group-con .wrapper .cancel,
	.group-con .wrapper .lookOrder {
		text-align: center;
		font-size: 24rpx;
		color: #333333;
		padding-top: 30rpx;
	}

	.group-con .wrapper .cancel .iconfont {
		font-size: 35rpx;
		color: #2c2c2c;
		vertical-align: -4rpx;
		margin-right: 9rpx;
	}

	.group-con .wrapper .lookOrder .iconfont {
		font-size: 25rpx;
		color: #2c2c2c;
		margin-left: 10rpx;
	}



	.share-box {
		z-index: 1000;
		position: fixed;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;

		image {
			width: 100%;
			height: 100%;
		}
	}

	.play-wrapper {
		padding: 32rpx 0 132rpx;
		border-radius: 24rpx;
		margin-top: 20rpx;
		background-color: #FFFFFF;
	}

	.play-wrapper .wrapper-header {
		text-align: center;
	}

	.play-wrapper .wrapper-header .title {
		display: inline-block;
		height: 40rpx;
		padding: 0 48rpx;
		font-weight: 500;
		font-size: 28rpx;
		line-height: 40rpx;
		color: #333333;
	}

	.play-wrapper .wrapper-main {
		margin-top: 42rpx;
	}

	.play-wrapper .wrapper-main .item {
		position: relative;
		margin-right: 210rpx;
	}

	.play-wrapper .wrapper-main .item:last-child {
		margin-right: 0;
	}

	.play-wrapper .wrapper-main .item .head {
		position: relative;
		width: 36rpx;
		height: 36rpx;
		border-radius: 18rpx;
		background-color: #DDDDDD;
		text-align: center;
		font-weight: 600;
		font-size: 24rpx;
		line-height: 36rpx;
		color: #FFFFFF;
	}

	.play-wrapper .wrapper-main .item .main {
		position: absolute;
		top: 0;
		left: 50%;
		width: 120rpx;
		margin: 68rpx 0 0 -60rpx;
		text-align: center;
		font-size: 24rpx;
		line-height: 34rpx;
		color: #333333;
	}

	.play-wrapper .wrapper-main .progress-box {
		position: relative;
	}

	.play-wrapper .wrapper-main .progress {
		position: absolute;
		top: 50%;
		left: 50%;
		width: 494rpx;
		height: 12rpx;
		background-color: #EEEEEE;
		transform: translate(-50%, -50%);
	}

	.play-wrapper .wrapper-main .progress .inner {
		width: 70%;
		height: 12rpx;
		border-radius: 6rpx;
		background: linear-gradient(90deg, #E93323 0%, #FF7931 100%);
	}

	.play-wrapper .wrapper-main .progress .inner.inner1 {
		width: 30% !important;
	}

	.play-wrapper .wrapper-main .progress .inner.inner2 {
		width: 70% !important;
	}

	.play-wrapper .wrapper-main .progress .inner.inner3 {
		width: 100% !important;
	}

	.font-num-sucess {
		color: #E93323 !important;
	}

	.font-num-err {
		color: #999 !important;
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

	.img {
		width: 240rpx;
		height: 240rpx;
		border-radius: 20rpx;
	}

	.groupBtn {
		width: 144rpx;
		height: 56rpx;
		background: linear-gradient(90deg, #FF7931 0%, #E93323 100%);
		border-radius: 50rpx;
		text-align: center;
		line-height: 56rpx;
		font-weight: 500;
		font-size: 24rpx;
		color: #FFFFFF;
	}

	.flex-special {
		align-items: end !important;
	}

	.p-bottom {
		padding-bottom: 4rpx;
	}

	.swiper-box {
		height: 70rpx !important;
		padding: 20rpx;
		color: #fff;
		font-size: 24rpx;

		.swiper-img {
			width: 48rpx;
			height: 48rpx;
			border-radius: 24rpx;
		}

		.line1 {
			display: flex;
			align-items: center;
			width: 348rpx;
			height: 56rpx;
			background: linear-gradient(to right, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0) 99%);
			border-radius: 200rpx;
			padding-left: 4rpx;
		}

		.swiper-text {
			margin-left: 8rpx;
		}
	}

	.all-pink {
		min-height: 20rpx;
	}

	.image-box {
		width: 100%;
		height: 100%;
		border-radius: 50%;
		border: 4rpx solid #E93323;
	}

	.sucess-tips {
		color: #e93323 !important;
	}
</style>