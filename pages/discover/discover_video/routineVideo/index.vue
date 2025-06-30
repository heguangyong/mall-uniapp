<template>
	<view>
		<!-- #ifdef MP-->
		<view class="sys-head" :style="{ height: sysHeight+'px' }"></view>
		<view class='cart_nav'>
			<nav-bar ref="navBarRef" :isBackgroundColor="false" iconColor='#fff' :isHeight="false"></nav-bar>
		</view>
		<!--  #endif -->
		<!--注意：这是 H5、微信小程序界面-->
		<swiper :style="'width: '+ windowWidth +'px; height: '+ windowHeight +'px; background-color: #000000;'"
			:vertical="true" @animationfinish="animationfinish" @change="change" :current="k" :indicator-dots="false"
			@touchstart="mpTouchstart" @touchend="mpTouchend" class="swiper-box">
			<swiper-item v-for="(list,index) in dataList" :key="index">
				<view v-if="max > index">
					<view>
						<!-- 
						1.v-if：用于控制视频在节点的渲染数
						2.muted的默认值是 false，代表默认是禁音视频的
						3.http-cache默认开启视频缓存
						4.poster（封面（方案一））：这里的封面默认处理存储在阿里云的视频
						5.show-loading：这里默认去掉播放转圈的标志
						v-if="Math.abs(k-index)<=1"
						 -->
						<video objectFit="contain" :id="list.id+''+index" :loop="true"
							:autoplay="index == k && isRoutine" :muted="list.isplay" :controls="false"
							:http-cache="true" :page-gesture="false" :show-fullscreen-btn="false" :show-loading="false"
							:show-center-play-btn="false" :enable-progress-gesture="false" :src="list.video"
							@ended="ended" @waiting="waiting(index)" @click="tapVideoHover(list.state,$event)"
							@play="play(index)"
							:style="'width: '+ windowWidth +'px; height: '+ windowHeight +'px; background-color: #000000; z-index: -1;'"></video>
						<!-- 
						1.这里是封面（方案二）：这里的封面可以自定义。
						2.也在代码中做了批注，两种方案可以共存，不会相互影响。
						-->
						<!-- 	<image
						v-if="!list.playIng"
						:src="list.cover"
						:style="'width: '+ windowWidth +'px; height: '+ windowHeight +'px; position: absolute;'"
						mode="aspectFit"
						></image> -->
					</view>
					<!-- 播放状态：pause 的时候就会暂停 -->
					<view class="videoHover" @click="tapVideoHover(list.state,$event)"
						:style="'width: '+ windowWidth +'px; height: '+ windowHeight +'px;'">
						<image v-if="list.state=='pause'" class="playState" src="../../static/images/play.png"></image>
					</view>
					<!--审核状态  -->
					<view v-if="list.auditStatus == 0 || list.auditStatus == 2 || list.auditStatus == 3"
						class="video-status" :style="'top: '+ statusTop +'px;'">
						<view v-if="list.auditStatus == 2 || list.auditStatus == 3" class="status-title">
							<text class="iconfont icon-tishi"></text>
							<text class="title">{{list.auditStatus == 2 ? '审核未通过' : '平台关闭'}}，内容仅自己可见</text>
						</view>
						<view v-else class="status-title">
							<text class="iconfont icon-shijian"></text>
							<text class="title">正在审核，内容仅自己可见</text>
						</view>
						<view class="status_info">
							<text
								class="refusal">{{(list.auditStatus == 2 || list.auditStatus == 3) ? list.refusal : '发布的内容审核通过后，将在首页展示！'}}</text>
						</view>
					</view>
					<view v-if="isShowCent" class="userInfo">
						<!-- 1.头像 -->
						<navigator hover-class="none" :url="'/pages/discover/discover_user/index?id='+list.authorId"
							class="pictrue">
							<image class="userAvatar"
								:src="list.authorAvatar || urlDomain+'crmebimage/presets/morenT.png'" mode="aspectFill">
							</image>
							<view v-if="!list.isConcerned && list.authorId!==uid" class="guanzhu"
								@click.stop="followAuthor(list)"><text
									class="iconfont icon-shangpinshuliang-jia"></text></view>
							<view v-else class="yiguanzhu"><text class="iconfont"></text></view>
						</navigator>
						<!-- 2.点赞 -->
						<view @click="likeToggle(list);" style="margin-top: 5px;" class="flex-column"
							:class="{'likeNumActive':list.userIsLike}">
							<text class="iconfont icon-shipindianzan-yidian"
								:class="{'likeNumActive':list.userIsLike}"></text>
							<text class="info-text">{{list.likeNum > 0 ? list.likeNum : '点赞'}}</text>
						</view>
						<!-- 3.评论 -->
						<view v-if="list.platReplySwitch" class="comment flex-column" @click="toComment(list)"
							style="margin-top: 18px;">
							<text class="iconfont icon-pinglun2"></text>
							<text class="info-text">{{list.replyNum>0 ? list.replyNum : '评论'}}</text>
						</view>
						<!-- 4.分享 小程序端，审核通过之后-->
						<view v-if="list.auditStatus == 1" @click="listenerActionSheet" class="flex-column"
							style="margin-top: 17px;">
							<text class="iconfont icon-fenxiang3"></text>
							<text class="info-text">分享</text>
						</view>
						<!-- 5.自己的视频 -->
						<view v-if="list.authorId == uid" style="margin-top: 17px;">
							<view class="video-my">
								<view class="video-dian" @click.stop="showManage = !showManage">
									<text class="dian"></text>
									<text class="dian"></text>
									<text class="dian"></text>
								</view>
								<view class="manage" v-show="showManage">
									<navigator hover-class="none"
										:url="'/pages/discover/discover_release/index?noteId='+list.id" class="items">
										<text class="iconfont icon-bianji"></text>
										<text>编辑</text>
									</navigator>
									<view class="items" @click.stop="deleteTopic(list)">
										<text class="iconfont icon-shanchu3"></text>
										<text>删除</text>
									</view>
									<view disabled="true" class="items" @click.stop="replySwitch(list)">
										<text class="iconfont"
											:class="list.replyStatus ==1 ? 'icon-jinzhipinglun' : 'icon-yunxupinglun'"></text>
										<text>{{list.replyStatus ==1 ? '禁止评论' : '开启评论'}}</text>
									</view>
								</view>
							</view>
						</view>
						<!-- 提到的商品 -->
						<view v-if="list.productList.length>0 && k === index" @click="openMore(list)" class="mention"
							style="opacity: 0.9; margin-top: 18px;">
							<image src="../../static/images/collection.png"></image>
							<text class="count">{{list.productList.length}}</text>
						</view>
						<!-- 6.收起内容 -->
						<view @click="onHideCent" class="flex-column"
							:style="{marginTop: list.productList.length>0 && k === index ? '0' : '35rpx'}"
							style="align-items: center;">
							<view class="onHide">
								<text class="iconfont icon-zhankai"></text>
							</view>
						</view>
					</view>
					<view v-else @click="onHideCent" class="onShow">
						<view class="onHide">
							<text class="iconfont icon-shouqi"></text>
						</view>
					</view>
					<!-- 最底下的文字部分 -->
					<view v-if="isShowCent" class="content">
						<view class="cart">
							<text class="cartName">@{{list.authorName}}</text>
						</view>
						<view class="words mb20" :style="'width: '+ (windowWidth - 120) +'px;'">
							<BaseTextMore v-if="list.content" :content="list.content" fontColor="rgba(255,255,255,0.9)"
								actionFontColor="#fff" :font-size="28" :rows="2" expand-text="展开" collapse-text="收起">
							</BaseTextMore>
							<view class="topicList acea-row" v-if="list.topicList && list.topicList.length">
								<view @click="goTopic(item.id)" v-for="item in list.topicList" :key="item.id">
									<text class="icon">#</text><text class="text">{{item.name}}</text>
								</view>
							</view>
						</view>
						<view v-if="k===index" class="product mb20">
							<scroll-view scroll-x="true" style="white-space: nowrap; display: flex;"
								scroll-with-animation show-scrollbar="true">
								<view class="product-item" v-for="(goods,idx) in list.productList" :key="idx">
									<view class="item-count acea-row" @click="goDetail(goods)">
										<view class="picture">
											<image :src="goods.productImage"></image>
										</view>
										<!--  -->
										<view class="product-text">
											<view style="height: 68rpx;">
												<view class="name line1">{{goods.productName}}</view>
												<view v-if="goods.isPay===1" class="buy">作者买过</view>
											</view>
											<view class="product-price">
												<view class="price">¥<text>{{goods.price}}</text></view>
												<view class="buy-btn">购买</view>
											</view>
										</view>
									</view>
								</view>
							</scroll-view>
						</view>

					</view>
				</view>
			</swiper-item>
		</swiper>
		<!-- 评论 -->
		<tui-bottom-popup :zIndex="98" :maskZIndex="97" :show="showComment" @close="close">
			<discoverComment v-if="showComment" fromTo="popupView" :noteId="noteDetail.id" :noteDetails="noteDetail"
				@close="close">
			</discoverComment>
		</tui-bottom-popup>
		<!-- 他提到的宝贝弹窗 -->
		<uni-popup type="bottom" ref="pinglunMentioned">
			<view
				:style="'width: '+ windowWidth +'px;background-color: #F5F5F5; border-top-left-radius: 10px; border-top-right-radius: 10px;'">
				<mentioned ref="mentioned" :list="proList" @close="popup"></mentioned>
			</view>
		</uni-popup>

		<!-- 分享按钮 -->
		<image v-if="H5ShareBox" class="shareImg" :src="urlDomain+'crmebimage/presets/share-info.png'"
			@click="H5ShareBox = false"></image>
		<!-- 分享按钮 -->
		<view class="generate-posters acea-row row-middle" :class="posters ? 'on' : ''">
			<!-- #ifndef MP -->
			<button class="item" :class="weixinStatus ? 'item3' : ''" hover-class='none' v-if="weixinStatus === true"
				@click="H5ShareBox = true">
				<view class="iconfont icon-weixin3"></view>
				<view class="">发送给朋友</view>
			</button>
			<!-- #endif -->
			<!-- #ifdef MP -->
			<button class="item" :class="weixinStatus ? 'item3' : ''" open-type="share" hover-class='none'
				@click="goFriend">
				<view class="iconfont icon-weixin3"></view>
				<view class="">发送给朋友</view>
			</button>
			<!-- #endif -->
			<button class="item" :class="weixinStatus ? 'item3' : ''" hover-class='none' @click="goPoster">
				<view class="iconfont icon-haibao"></view>
				<view class="">生成海报</view>
			</button>
		</view>
		<view class="mask" v-if="posters" @click="listenerActionClose"></view>
		<!-- 海报展示 -->
		<view class='mask' v-if="posterImageStatus"></view>
		<view class='poster-pop' v-if="posterImageStatus">
			<image src='../../static/images/poster-close.png' class='close' @click="posterImageClose"></image>
			<image :src='posterImage' class="image"></image>
			<!-- #ifndef H5 -->
			<view class="keep" @click="savePosterPath">保存到相册</view>
			<!-- #endif -->
		</view>
		<view class="canvas" v-if="canvasStatus">
			<canvas style="width:750px;height:1190px;" canvas-id="myCanvas"></canvas>

		</view>

		<canvas v-if="qrcodecanvasStatus" class="qrcodecanvasStatus" canvas-id="qrcode"
			:style="{width: `${qrcodeSize}px`, height: `${qrcodeSize}px`}" />
	</view>
</template>

<script>
	// #ifdef H5 
	import uQRCode from '@/js_sdk/Sansnn-uQRCode/uqrcode.js'
	// #endif
	// #ifdef MP
	import {
		base64src
	} from '@/utils/base64src.js'
	import {
		mpQrcode
	} from '@/api/api.js';
	// #endif
	import {
		goProductDetail
	} from '@/libs/order.js'
	import {
		imageBase64
	} from "@/api/public";
	import {
		mapGetters
	} from "vuex";
	import {
		discoverFollowAuthor,
		discoverNoteLike
	} from '@/libs/follow.js';
	import {
		toLogin
	} from '@/libs/login.js';
	import {
		Debounce
	} from '@/utils/validate.js'
	import {
		noteDetailApi,
		noteRecommendApi,
		noteReplySwitchApi,
		noteDelApi
	} from '@/api/discover.js';
	import {
		silenceBindingSpread,
		getUserSpread
	} from '@/utils/index.js';
	import navBar from '@/components/navBar';
	import mentioned from '@/components/mentioned.vue';
	import tuiBottomPopup from "../../components/tui-bottom-popup.vue";
	import discoverComment from '@/components/discoverComment/index.vue'
	import BaseTextMore from "../../components/BaseTextMore.vue"
	let sysHeight = uni.getSystemInfoSync().statusBarHeight;
	let audo = uni.createInnerAudioContext();
	audo.loop = true
	export default {
		components: {
			navBar,
			tuiBottomPopup,
			mentioned,
			discoverComment,
			BaseTextMore
		},
		computed: mapGetters(['userInfo', 'isLogin', 'uid', 'globalData']),
		data() {
			return {
				urlDomain: this.$Cache.get("imgHost"),
				fromTo: '',
				max: 2,
				qrcodecanvasStatus: true, //h5分享二维码
				showComment: false,
				autoplay: true, //是否自动播放视频
				proList: [], //商品列表
				popupShow: false, //商品弹窗
				sysHeight: sysHeight,
				navTitle: '短视频',
				noteId: 0,
				windowWidth: 0,
				windowHeight: 0,
				platform: "",
				model: "",
				deleteHeight: 0,
				dataList: [],
				k: 0,
				oldVideo: "",
				voice: "",
				timeout: "",
				current: 0,
				boxStyle: { //视频，图片封面样式🌟💗
					'height': 0,
					'width': 0,
				},

				videoID: "",
				isShow: false,

				showPlay: false, //转轮显示控制
				rotates: 0, //转轮旋转角度
				rotateTime: "", //转轮递归事件控制
				xrotats: "",

				mpcleartime: "",

				isClick: false,

				changeTimeout: "",
				mptime: 0,
				mpstartTime: 0,

				duration: 500,
				noteDetail: {},
				where: {
					page: 1,
					limit: 5,
					noteId: ''
				},
				isShowCent: true, //是否展示内容
				statusTop: 0, //审核状态样式
				showManage: false, //是否显示操作
				H5ShareBox: false,
				posters: false,
				weixinStatus: false, //是否是微信
				posterImageStatus: false,
				storeImage: '', //海报产品图
				PromotionCode: '', //二维码图片
				canvasStatus: false, //海报绘图标签
				posterImage: '', //海报路径
				posterbackgd: '../../static/images/posterbackgd.png',
				codeImg: "",
				qrcodeSize: 600,
				imgTop: '',
				currentPage: false,
				// 双击点赞参数
				touchNum: 0,
				// #ifdef MP
				isRoutine: true,
				// #endif
				// #ifndef MP
				isRoutine: true,
				// #endif
			}
		},
		watch: {
			k(new_k, old_k) {
				const max = new_k + 2;
				if (this.max < max) {
					this.max = max;
				}
				this.dataList[old_k].playIng = false //如果视频暂停，就加载封面
				this.dataList[old_k].isplay = false
				this.dataList[old_k].state = 'pause'
				// 2.0版本已经去掉了下面这一句，视频不用暂停，只需要把声音禁止就行
				uni.createVideoContext(this.dataList[old_k].id + '' + old_k, this)
					.pause() //如果视频暂停，那么旧视频停止，这里的this.dataList[old_k].id + '' + old_k，后面加 old_k 是为了每一个视频的 id 值不同，这样就可以大程度的避免串音问题
				//提示
				// #ifdef MP
				this.dataList[new_k].state = 'play'
				this.dataList[new_k].isplay = false
				this.dataList[new_k].playIng = true
				setTimeout(() => {
					uni.createVideoContext(this.dataList[new_k].id + '' + new_k, this).play()
				}, 250)
				// #endif
			}
		},
		onShow() {
			//分销绑定
			silenceBindingSpread(this.isLogin, this.globalData.spread);
		},
		onReady() {
			//新的标题
			uni.setNavigationBarTitle({
				title: '短视频'
			})
			//标题蓝颜色
			uni.setNavigationBarColor({
				frontColor: '#ffffff',
				backgroundColor: '#000'
			})
		},
		onLoad(options) {
			//分销码
			getUserSpread(options);

			if (options.hasOwnProperty('noteId') || options.scene) {
				if (options.scene) { // 仅仅小程序扫码进入
					let value = this.$util.getUrlParams(decodeURIComponent(options.scene));
					this.noteId = value.id ? value.id : "";
					if (value.sd) this.$store.commit('Change_Spread', value.sd);
				} else {
					this.noteId = options.noteId ? Number(options.noteId) : ''
				}
			}
			// #ifdef MP
			this.statusTop = sysHeight;
			// #endif
			// #ifdef H5
			this.statusTop = 60;
			// #endif
			this.fromTo = options.fromTo || '';
			this.getNoteDetail();
			if (options.fromTo !== 'home') this.get() //刚进入页面加载数据
			this.windowWidth = uni.getSystemInfoSync().windowWidth
			this.windowHeight = uni.getSystemInfoSync().windowHeight - this.sysHeight
			this.boxStyle.width = this.windowWidth + 'px' //给宽度加px
			this.boxStyle.height = this.windowHeight - this.deleteHeight; //有 tabbar的 修改这里可以改变视频高度

			// #ifdef H5
			//this.rotateX();
			// #endif
		},
		onHide() {
			// #ifdef MP
			this.dataList[this.k].state = 'pause';
			uni.createVideoContext(this.dataList[this.k].id + '' + this.k, this).pause()
			// #endif
			// #ifdef H5
			if (this.isClick) {
				this.dataList[this.k].state = 'pause';
				uni.createVideoContext(this.dataList[this.k].id + '' + this.k, this).pause()
				audo.pause()
			}
			// #endif
		},
		methods: {
			closePosters: function() {
				this.posters = false;
				this.currentPage = false;
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
										filePath: that.posterImage,
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
								filePath: that.posterImage,
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
			//替换安全域名
			setDomain: function(url) {
				url = url ? url.toString() : '';
				//本地调试打开,生产请注销
				if (url.indexOf("https://") > -1) return url;
				else return url.replace('http://', 'https://');
			},
			//获取海报产品图（解决跨域问题，只适用于小程序）
			downloadFilestoreImage(url) {
				return new Promise((resolve, reject) => {
					uni.downloadFile({
						url: this.setDomain(url),
						success: function(res) {
							resolve(res.tempFilePath);
						},
						fail: function() {
							return this.$util.Tips({
								title: ''
							});
						}
					});
				})
			},
			// 小程序关闭分享弹窗；
			goFriend: function() {
				this.posters = false;
			},
			// 小程序二维码
			getQrcode(id) {
				let that = this;
				let data = {
					scene: 'id=' + id + '&sd=' + that.uid,
					page: 'pages/discover/discover_video/routineVideo/index'
				}
				mpQrcode(data).then(res => {
					base64src(res.data.code, Date.now(), res => {
						that.PromotionCode = res;
					});

				}).catch(err => {
					that.errT = err;
				});
			},
			/**
			 * 分享打开
			 *
			 */
			listenerActionSheet: function() {
				// #ifdef H5
				if (this.$wechat.isWeixin() === true) {
					this.weixinStatus = true;
				}
				// #endif
				//this.goPoster()
				this.posters = true;
			},
			// 生成二维码；
			make(uid, id) {
				let href = location.href.split('?')[0] + '?noteId=' + id + "&sd=" + uid;
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
			//h5 转base64
			async getImageBase64(images) {
				let res = await imageBase64({
					url: images
				})
				return res.data.code
			},
			/**
			 * 生成海报
			 */
			async goPoster() {
				let that = this;
				if (that.posterImage) {
					that.posterImageStatus = true
					that.posters = false
					return
				}
				let arr2
				uni.showLoading({
					title: '海报生成中',
					mask: true
				});
				that.posters = false;
				that.qrcodecanvasStatus = true;
				that.$set(that, 'canvasStatus', true);
				// #ifdef MP
				arr2 = [that.posterbackgd, await that.downloadFilestoreImage(that.dataList[that.k].cover), that
					.PromotionCode, await that.downloadFilestoreImage(that.dataList[that.k].authorAvatar)
				];
				// #endif
				// #ifdef H5
				arr2 = [that.posterbackgd, await that.getImageBase64(that.dataList[that.k].cover), that.PromotionCode,
					await that.getImageBase64(that.dataList[that.k].authorAvatar)
				];
				// #endif
				//生成推广海报
				that.$util.videoPosterCanvas(arr2, that.dataList[that.k].content, that.dataList[that.k].authorName,
					function(tempFilePath) {
						that.qrcodecanvasStatus = false
						that.$set(that, 'posterImage', tempFilePath);
						that.$set(that, 'posterImageStatus', true);
						that.$set(that, 'canvasStatus', false);
						uni.hideLoading();
					}, (err) => {
						that.qrcodecanvasStatus = false
						that.$set(that, 'canvasStatus', false);
						uni.hideLoading();
					});
			},
			share() {
				this.H5ShareBox = true;
			},
			// 分享关闭
			listenerActionClose: function() {
				this.posters = false;
			},
			//隐藏海报
			posterImageClose: function() {
				this.posterImageStatus = false
			},
			// 小程序关闭分享弹窗；
			goFriend: function() {
				this.posters = false;
			},
			// 删除内容
			deleteTopic(item) {
				let that = this;
				uni.showModal({
					content: '确定要删除该内容么？',
					success: function(res) {
						if (res.confirm) {
							noteDelApi(item.id).then(res => {
								that.$util.Tips({
									title: '删除成功'
								});
								setTimeout(function() {
									uni.redirectTo({
										url: '/pages/discover/discover_user/index'
									})
								}, 1000);
							}).catch(err => {
								uni.showToast({
									title: err,
									icon: 'none'
								})
							});
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});

			},
			//禁止评论
			replySwitch(item) {
				if (!item.platReplySwitch && item.replyStatus === 3) {
					this.$util.Tips({
						title: '平台设置不可评论'
					});
				} else {
					noteReplySwitchApi(item.id).then(res => {
						if (item.replyStatus === 1) {
							this.$set(item, 'replyStatus', 2)
							this.$util.Tips({
								title: '禁止成功'
							});
						} else {
							this.$set(item, 'replyStatus', 1)
							this.$util.Tips({
								title: '开启成功'
							});
						}
					}).catch(err => {
						uni.showToast({
							title: err,
							icon: 'none'
						})
					});
				}
			},
			moreTap(item) {
				item.isMore = !item.isMore;
			},
			//去话题
			goTopic(id) {
				uni.navigateTo({
					url: `/pages/discover/discover_note_topic/index?topicId=${id}`
				})
			},
			//收起内容
			onHideCent() {
				this.isShowCent = !this.isShowCent;
			},
			// 去详情页
			goDetail(item) {
				goProductDetail(item.productId, 0, '');
			},
			//返回
			returns: function() {
				uni.navigateBack();
			},
			// 关注作者
			followAuthor: Debounce(function(item) {
				if (this.isLogin) {
					discoverFollowAuthor(item.authorId).then(() => {
						this.$set(item, 'isConcerned', !item.isConcerned);
					});
				} else {
					toLogin();
				}
			}),
			//点赞
			likeToggle: Debounce(function(item) {
				if (this.isLogin) {
					discoverNoteLike(item.id).then(() => {
						this.$set(item, 'userIsLike', !item.userIsLike);
						if (!item.userIsLike) {
							item.likeNum--;
							item.likeNum = item.likeNum == 0 ? 0 : item.likeNum
						} else {
							item.likeNum++;
						}
					});
				} else {
					toLogin();
				}
			}),
			play(k) {
				this.dataList[k].isplay = false
				this.dataList[k].playIng = true
				this.dataList[k].state = 'play'
				this.dataList[k].loading = false
				this.loading = false
			},
			waiting(k) {
				this.loading = true
				this.dataList[k].loading = true
			},
			/*查看提到的宝贝*/
			openMore(item) {
				this.proList = item.productList;
				this.$refs.pinglunMentioned.open('bottom');
				//this.popupShow = true;

			},
			//关闭提到的宝贝
			popup() {
				this.$refs.pinglunMentioned.close();
			},
			//微信分享
			ShareInfo(noteDetail) {
				let data = noteDetail;
				let href = location.href;
				if (this.$wechat.isWeixin()) {
					href = href.indexOf("?") === -1 ? href + "?sd=" + this.uid + '&id=' + noteDetail.id : href +
						"&sd=" + this.uid + '&id=' + this.noteId;
					let configAppMessage = {
						desc: data.content,
						title: data.title,
						link: href,
						imgUrl: data.cover
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
			getNoteDetail() {
				noteDetailApi(this.noteId).then(res => {
					let data = res.data;
					this.loading = false
					this.videoData([res.data]);
					//#ifdef H5
					this.make(this.uid, data.id);
					this.ShareInfo(data);
					// #endif
					// #ifdef MP
					this.imgTop = data.cover;
					this.getQrcode(data.id);
					// #endif
				}).catch(err => {
					uni.showToast({
						title: err,
						icon: 'none'
					})
				});
			},
			mpTouchend() {
				this.mptime = (new Date() / 1000) - this.mpstartTime;
			},
			mpTouchstart() {
				this.mpstartTime = (new Date() / 1000);
			},
			dealVoice() {
				uni.showToast({
					title: '处理声音',
					icon: 'none'
				})
			},
			clearToTime() {
				//清理定时器
				for (let i = 0; i < 20; i++) {
					clearTimeout(this.rotateTime);
					clearTimeout(this.xrotats);
					this.showPlay = false;
					this.rotates = 0;
				}
			},
			clearTime() {
				//清理定时器
				for (let i = 0; i < 20; i++) {
					clearTimeout(this.rotateTime);
					clearTimeout(this.xrotats);
				}
			},
			rotateX() {
				// clearTimeout(this.rotateTime);
				this.rotateTime = setTimeout(() => {
					this.rotateX();
					this.showPlay = true;
					this.rotates += 1;
				}, 30)
			},
			closeScrollview() {
				// 点击评论里面的叉叉，就会关闭评论
				this.$refs.comment.close();
			},
			ended() {
				// 1.播放当前视频结束时触发，自动切换下一个视频
				// this.current = this.k+1
			},
			//点击播放&&暂停
			tapVideoHover(state, event) {
				// 1.启用双击点赞 --- start
				this.touchNum++;
				setTimeout(() => {
					if (this.touchNum == 1) {
						if (state == 'play' || state == 'continue') {
							this.$set(this.dataList[this.k], 'state', 'pause')
							//this.dataList[this.k].state = 'pause';
						} else {
							this.$set(this.dataList[this.k], 'state', 'continue')
							//this.dataList[this.k].state = 'continue';
						}
						if (this.dataList[this.k].state == 'continue') {
							uni.createVideoContext(this.dataList[this.k].id + '' + this.k, this).play(); //暂停以后继续播放
						}
						if (this.dataList[this.k].state == 'pause') {
							uni.createVideoContext(this.dataList[this.k].id + '' + this.k, this)
								.pause(); //暂停以后继续播放
						}
					}
					this.touchNum = 0;
				}, 200)
			},
			change(event) {
				this.k = event.detail.current
				this.posterImage = false;
				this.qrcodecanvasStatus = true;
				//#ifdef H5
				this.make(this.uid, this.dataList[this.k].id);
				// #endif
				// #ifdef MP
				this.imgTop = this.dataList[this.k].cover;
				this.getQrcode(this.dataList[this.k].id);
				// #endif
			},
			animationfinish(event) {
				if (this.fromTo !== 'home') {
					// 1.这里进行判断，如果是最后一个视频就进入 get() 方法加载视频进入列表
					if (this.k == this.dataList.length - 1) {
						this.loadVideo = true;
						this.get()
					}
				}
			},
			get() {
				// 内容发现推荐列表
				let that = this;
				if (that.loadend) return;
				that.loading = true;
				this.where.noteId = this.noteId;
				noteRecommendApi(that.where).then(res => {
					that.loading = false;
					let list = res.data.list
					this.where.page = this.where.page + 1;
					this.loadend = this.where.page > res.data.totalPage;
					that.videoData(list)
				}).catch(err => {
					that.loading = false;
					uni.showToast({
						title: err,
						icon: 'none'
					})
				});

			},
			videoData(list) {
				if (list.length == 0) return;
				let that = this;
				var msg = list
				// 2.这里把视频添加到视频列表
				for (let i = 0; i < msg.length; i++) {
					msg[i]['isMore'] = false
					msg[i]['playIng'] = false
					msg[i]['state'] = 'pause'
					msg[i]['isplay'] = false
					msg[i]['loading'] = false
					that.dataList.push(msg[i])
					if (i == 0) {
						//#ifdef MP
						this.dataList[0].isplay = false
						this.dataList[0].playIng = true
						this.dataList[0].state = 'play'
						this.dataList[0].loading = false
						uni.createVideoContext(that.dataList[0].id + '' + 0, that).play()
						//#endif
					}
				}
				// #ifdef H5
				if (that.isLogin) {
					//that.setOpenShare(that.videoID);
				}
				// #endif
			},
			share() {
				uni.showToast({
					title: '分享',
					icon: 'none'
				})
			},
			//关闭评论
			close() {
				this.showComment = false
			},
			//打开评论
			toComment(itme) {
				this.noteDetail = itme;
				uni.showToast({
					title: '加载中...',
					icon: 'none',
					position: 'bottom',
					duration: 300
				})
				this.showComment = true
			},
		}
	}
</script>

<style scoped lang="scss">
	.shareImg {
		z-index: 1000;
		position: fixed;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
	}

	.video-my {
		position: relative;
	}

	.qrcodecanvasStatus {
		position: fixed;
		z-index: -5;
		opacity: 0;
	}

	.canvas {
		z-index: 300;
		width: 750px;
		height: 1036px;
	}

	.poster-pop {
		width: 600rpx;
		/*#ifdef H5*/
		height: 820rpx;
		/*#endif*/
		/*#ifndef H5*/
		height: 910rpx;
		/*#endif*/
		position: fixed;
		left: 50%;
		transform: translateX(-50%);
		z-index: 399;
		top: 50%;
		margin-top: -410rpx;
		border-radius: 30rpx;
	}

	.poster-pop .image {
		width: 100%;
		height: 100%;
		display: block;
		border-radius: 16rpx;
	}

	.close {
		width: 46rpx;
		height: 75rpx;
		position: fixed;
		right: 0;
		top: -73rpx;
		display: block;
	}

	.poster-pop .keep {
		text-align: center;
		width: 600rpx;
		height: 70rpx;
		line-height: 70rpx;
		border-radius: 43rpx;
		background: #E93323;
		color: #ffffff;
		font-size: 25rpx;
		margin-top: 40rpx;
	}

	.generate-posters {
		width: 100%;
		height: 170rpx;
		background-color: #fff;
		position: fixed;
		left: 0;
		bottom: 0;
		z-index: 388;
		transform: translate3d(0, 100%, 0);
		transition: all 0.3s cubic-bezier(0.25, 0.5, 0.5, 0.9);
		border-top: 1px solid #eee;
		align-content: center;
		align-items: center;
		flex-direction: row;
	}

	.generate-posters.on {
		transform: translate3d(0, 0, 0);
	}

	.generate-posters .item {
		/* #ifdef H5 */
		flex: 100%;
		/* #endif */
		/* #ifndef H5 */
		flex: 33.33%;
		/* #endif */
		text-align: center;
		font-size: 30rpx;

		&.item3 {
			flex: 33.33%;
		}
	}

	.generate-posters .item .iconfont {
		font-size: 80rpx;
		color: #5eae72;
	}

	.generate-posters .item .iconfont.icon-haibao {
		color: #5391f1;
	}

	.mask {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.6);
		z-index: 9;
	}

	.loadingicon {
		position: absolute;
		top: 50%;

		.iconfont {
			color: #fff !important;
		}

	}

	.sys-head {
		background-color: #000;
		color: #fff;
	}

	.manage {
		width: 210rpx;
		background: #ffffff;
		box-shadow: 0 2rpx 15rpx rgba(0, 0, 0, 0.1);
		padding: 0 15rpx;
		position: absolute;
		bottom: -65rpx;
		right: 113rpx;
		z-index: 10;
		border-radius: 16rpx;

		.iconfont {
			color: #333 !important;
		}

		&::before {
			content: "";
			display: inline-block;
			width: 26rpx;
			height: 26rpx;
			background: #ffffff;
			transform: rotate(137deg);
			position: absolute;
			top: 102rpx;
			right: -8rpx;
			box-shadow: -1rpx -1rpx 1rpx rgba(0, 0, 0, 0.05);
		}

		.items {
			border-bottom: 1px solid #EEEEEE;
			color: #282828;
			font-size: 26rpx;
			padding: 20rpx 0;
			display: flex;
			align-items: center;

			&:last-child {
				border-bottom: none;
			}

			.iconfont {
				margin: 0 16rpx 0;
			}
		}
	}

	.video-status {
		width: 690rpx;
		position: absolute;
		left: 30rpx;
		background: rgba(0, 0, 0, .55);
		border-radius: 10rpx;
		// top: 60rpx;
		padding: 26rpx 0 24rpx 30rpx;

		.iconfont {
			font-size: 30rpx;
		}

		.icon-shijian {
			color: #FC8327;
		}

		.icon-tishi {
			color: #E93323;
		}

		.status-title {
			flex-direction: row;
			align-items: center;

			.title {
				margin-left: 20rpx;
				color: #ffffff;
				font-size: 28rpx;
			}
		}

		.refusal {
			color: #ffffff;
			font-size: 22rpx;
			margin: 15rpx 0 0 48rpx;
		}

		.image {

			width: 28rpx;
			height: 28rpx;
		}
	}

	.onShow {
		position: absolute;
		bottom: 40rpx;
		right: 36rpx;
	}

	.onHide {
		width: 66rpx;
		height: 66rpx;
		border-radius: 50%;
		background-color: rgba(0, 0, 0, .4);
		color: #fff;
		text-align: center;
		line-height: 66rpx;
	}

	.topicList {
		>view {
			display: flex;
			align-items: center;
			margin-right: 12rpx;
			color: #fff;

			.text {
				font-size: 28rpx;
			}

			.icon {
				font-size: 35rpx;
				font-weight: bold;
				margin-right: 4rpx;
			}
		}
	}

	.videoHover {
		position: absolute;
		top: 0;
		left: 0;
		flex: 1;
		justify-content: center;
		align-items: center;
		display: flex;
		background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #000000 100%);
		opacity: 0.2;
	}

	.playState {
		width: 160rpx;
		height: 160rpx;
		opacity: 0.2;
	}

	.flex-column {
		display: flex;
		flex-direction: column;
	}

	.userInfo {
		position: absolute;
		bottom: 100rpx;
		right: 24rpx;
		flex-direction: column;
		text-align: center;
		display: flex;

		.pictrue {
			flex-direction: column;
			justify-content: center;
			align-items: center;
			position: relative;

			// margin-bottom: 18rpx;
			image {
				width: 92rpx;
				height: 92rpx;
			}

			.guanzhu {
				width: 42rpx;
				height: 42rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				color: #fff;
				background: #E93323;
				border-radius: 100%;
				position: relative;
				top: -20rpx;
				left: 26rpx;

				.iconfont {
					font-size: 20rpx;
				}
			}

			.yiguanzhu {
				width: 42rpx;
				height: 42rpx;
			}
		}

		.mention {
			width: 92rpx;
			height: 92rpx;
			position: relative;

			image {
				width: 58rpx;
				height: 58rpx;
				position: absolute;
				right: 16rpx;
			}

			.count {
				width: 30rpx;
				height: 30rpx;
				line-height: 30rpx;
				background: #fff;
				border-radius: 100%;
				display: flex;
				align-items: center;
				justify-content: center;
				color: #E93323;
				position: absolute;
				right: 8rpx;
				top: -12rpx;
				font-size: 20rpx;
			}
		}

		.iconfont {
			color: #ffffff;

			&.likeNumActive {
				color: #E93323;
			}
		}
	}

	.icon-shipindianzan-yidian {
		font-size: 59rpx;
	}

	.icon-pinglun2 {
		font-size: 59rpx;
	}

	.icon-fenxiang3 {
		font-size: 58rpx;
	}

	.info-text {
		margin-top: 10rpx;
		color: #ffffff;
		font-size: 22rpx;
	}

	.userAvatar {
		border-radius: 500%;
		border-style: solid;
		border-width: 2px;
		border-color: #ffffff;
		width: 80rpx;
		height: 80rpx;
		display: block;
	}

	.video-dian {
		position: relative;
		width: 66rpx;
		height: 66rpx;
		align-items: center;
		justify-content: center;
		flex-direction: row;
		left: 12rpx;

		.dian {
			display: inline-block;
			width: 13rpx;
			height: 13rpx;
			background-color: #fff;
			border-radius: 100%;
			margin-right: 10rpx;

			&:last-child {
				margin-right: 0;
			}
		}
	}

	.product {
		display: block;
		margin-top: 27rpx;

		.product-item {
			display: inline-block;
			width: 444rpx;
			height: 136rpx;
			background: rgba(0, 0, 0, .55);
			border-radius: 12rpx;
			padding: 16rpx 15rpx;
			margin-right: 30rpx;
		}

		::v-deepuni-swiper,
		::v-deepswiper {
			display: block;
			width: 500rpx !important;
			height: 136rpx !important;

			.swiper-count {
				display: block;
				width: 444rpx !important;
				height: 136rpx !important;
				background: rgba(0, 0, 0, .55);
				border-radius: 12rpx;
				padding: 16rpx 15rpx;
			}

			.swiper-item {
				display: block;
			}
		}

		.item-count {
			width: 414rpx;
			flex-direction: row;
			justify-content: space-between;
			border-radius: 12rpx;

			.picture {
				width: 104rpx;
				height: 104rpx;
				border-radius: 10rpx;

				image {
					width: 104rpx;
					height: 104rpx;
					border-radius: 10rpx;
				}
			}

			.product-text {
				width: 296rpx;
				justify-content: space-between;

				.buy {
					padding: 4rpx 7rpx;
					background: #5D5747;
					border-radius: 3px 3px 3px 3px;
					font-size: 16rpx;
					display: inline-block;
				}

				.name {
					width: 266rpx;
					font-size: 26rpx;
				}

				.product-price {
					display: flex;
					flex-direction: row;
					justify-content: space-between;
					align-items: center;

					.price {
						display: flex;
						flex-direction: row;
						align-items: end;
						font-size: 24rpx;

						text {
							font-size: 26rpx;
						}
					}

					.buy-btn {
						width: 89rpx;
						height: 36rpx;
						display: flex;
						align-items: center;
						justify-content: center;
						color: #fff;
						border-radius: 26rpx;
						background: #E93323;
						font-size: 20rpx;
					}
				}
			}
		}
	}

	.content {
		width: 590rpx;
		position: absolute;
		bottom: 80rpx;
		/* justify-content: center; */
		padding: 15rpx 0;
		flex-direction: column;
		justify-content: flex-start;
		color: #ffffff;
		left: 24rpx;

		.time {
			font-size: 24rpx;
			color: rgba(255, 255, 255, 0.5);
			margin-left: 12rpx;
		}

		.cart {
			height: 48rpx;
			flex-direction: row;

			.cartName {
				font-size: 28rpx;
				color: #fff;
			}
		}
	}

	.page-footer {

		position: fixed;
		bottom: 0;
		z-index: 999999;
		display: flex;
		align-items: center;
		justify-content: space-around;
		width: 100%;
		height: constant(safe-area-inset-bottom); ///兼容 IOS<11.2/
		height: env(safe-area-inset-bottom); ///兼容 IOS>11.2/ 
		box-sizing: border-box;
		// background-color: #fff;
		box-shadow: 0px 0px 17rpx 1rpx rgba(206, 206, 206, 0.32);
		padding-bottom: constant(safe-area-inset-bottom); ///兼容 IOS<11.2/
		padding-bottom: env(safe-area-inset-bottom); ///兼容 IOS>11.2/
	}

	.h5_back {
		color: #fff;
		position: fixed;
		left: 20rpx;
		font-size: 32rpx;
		text-align: center;
		line-height: 58rpx;
		z-index: 9999;
	}
</style>