<template>
	<view class="tab-conts" :data-theme="theme">
		<!-- 0-待审核，1-审核通过，2-审核失败，3-平台关闭 -->
		<view v-if="noteDetails.auditStatus == 0 || noteDetails.auditStatus == 2 || noteDetails.auditStatus == 3"
			class="approval_status">
			<view class="status_count" :class="noteDetails.auditStatus == 0 ? 'status1' : 'status0'">
				<view class="status_title">
					<text class="iconfont"
						:class="(noteDetails.auditStatus == 2 || noteDetails.auditStatus == 3) ? 'icon-tishi' : 'icon-shijian'"></text>
					<text v-if="noteDetails.auditStatus == 2" class="title">审核未通过，内容仅自己可见</text>
					<text v-if="noteDetails.auditStatus == 3" class="title">平台关闭，内容仅自己可见</text>
					<text v-if="noteDetails.auditStatus == 0" class="title">正在审核，内容仅自己可见</text>
				</view>
				<view v-if="noteDetails.auditStatus == 2 || noteDetails.auditStatus == 3" class="status_info">
					{{noteDetails.refusal}}
				</view>
				<view v-if="noteDetails.auditStatus == 0" class="status_info">
					发布的内容审核通过后，将展示在首页！
				</view>
			</view>
		</view>
		<view class="follow_count"
			:class="(type=='list' || type =='follow' || !noteDetails.platReplySwitch)?'bodyNo':''">
			<view class="list_count">
				<view class="imageBox">
					<swiper v-if="noteDetails.type ===1 && noteDetails.image && noteDetails.image.split(',').length>1"
						:indicator-dots="indicatorDots" indicator-active-color="#e93323" :circular="circular"
						:interval="interval" :duration="duration" :style="{height:imageH + 'px'}">
						<block v-for="(item,index) in noteDetails.image.split(',')" :key='index'>
							<swiper-item class="cover">
								<!-- <image class="w-full" show-menu-by-longpress :src="item"
									:mode="isAuto ?  'aspectFill' : 'heightFix'" :style="{height:imageH + 'px'}"
									@tap="proview(item)"></image> -->
								<easy-loadimage mode="heightFix" :image-src="item"
									:height="imageH*2+'rpx'"></easy-loadimage>
							</swiper-item>
						</block>
					</swiper>
					<view
						v-if="noteDetails.type ===2 || (noteDetails.type ===1 &&noteDetails.image && noteDetails.image.split(',').length===1)">
						<view class="cover" @click="goDetail(noteDetails)">
							<easy-loadimage mode="heightFix" :image-src="noteDetails.cover"></easy-loadimage>
							<view v-if="noteDetails.type ===2" class="circle">
								<text class="iconfont icon-24gf-play"></text>
							</view>
						</view>
					</view>
				</view>
				<!-- 查看TA提到的宝贝 -->
				<view class="pro_describle">
					<view class="product_info">
						<view class="noteTitle">{{noteDetails.title}}</view>
						<view>
							<view class="text"
								v-if="noteDetails.isMore || (noteDetails.content && noteDetails.content.length<=70)">
								<text class="info">{{noteDetails.content}}</text>
							</view>
							<view class="text mt10" v-else>
								<text v-show="noteDetails.content"
									class="info">{{noteDetails.content && noteDetails.content.slice(0,70)}}...</text>
								<text class="more" v-if="noteDetails.content && noteDetails.content.length>70"
									@click.stop="moreTap(noteDetails,i)">
									展开</text>
							</view>
						</view>
					</view>
					<view class="topicList acea-row"
						v-if="noteDetails.topicList && noteDetails.topicList.length>0">
						<view style="line-height: 1.2;" @click="goTopic(item.id)" v-for="(item, j) in noteDetails.topicList" :key="j">
							<text class="icon">#</text><text class="text">{{item.name}}</text>
						</view>
					</view>
					<view v-if="type==='detail'" class="create_time">{{noteDetails.createTime}}</view>
					<scroll-view v-if="noteDetails.productList && noteDetails.productList.length" scroll-x="true" class="white-nowrap vertical-middle w-full mt-22 mb-12"
						show-scrollbar="false">
						<mentioned :list="noteDetails.productList" @close="popup" class=""></mentioned>
					</scroll-view>
				</view>
			</view>
		</view>

		<view class="footer_bar acea-row fixed release_bar_detail" style="bottom: 0;">
			<view class="acea-row items-center">
				<view class="author mr-16" @click="goUser(noteDetails)">
					<image v-if="noteDetails.authorLevelIcon" class="level_icon" :src="noteDetails.authorLevelIcon"
						alt="">
						<image class="picture"
							:src="noteDetails.authorAvatar || urlDomain+'crmebimage/presets/morenT.png'">
						</image>
						<view class="name acea-row">
							<text>{{noteDetails.authorName}}</text>
						</view>
				</view>
				<!-- 1关注 -->
				<view v-if="noteDetails.authorId!==uid && type !=='follow'" @click.stop="followAuthor(noteDetails)">
					<view v-if="!noteDetails.isConcerned" class="author-follow flex-around-center font-color"><text
							class="iconfont icon-shangpinshuliang-jia"></text>
						<view class="line-heightOne">关注</view>
					</view>
					<view v-else class="author-focused flex-around-center">
						<view class="line-heightOne">已关注</view>
					</view>
				</view>
				<!-- 管理 -->
				<view class="manageCount" v-if="noteDetails.authorId==uid && type==='detail'">
					<view class="follow_btn author-focused flex-around-center" @click.stop="handleManage">
						<view class="line-heightOne">管理</view>
					</view>
				</view>
			</view>
			<!-- 末尾处分享、关注、评论 -->
			<view class="foot_bar">
				<view class="item">
					<view class="item_count" @click.stop="likeToggle(noteDetails)">
						<text class="iconfont"
							:class="noteDetails.userIsLike ? 'icon-shoucang1' : 'icon-dianzan'"></text>
						<text>{{noteDetails.likeNum > 0 ? noteDetails.likeNum < 10000 ? noteDetails.likeNum : (noteDetails.likeNum / 10000).toFixed(2) : '点赞'}}</text>
					</view>
					<!--  -->
					<view v-if="noteDetails.platReplySwitch" class="item_count" @click="openCommon(noteDetails)">
						<text class="iconfont icon-pinglun"></text>
						<text>{{noteDetails.replyNum > 0 ? noteDetails.replyNum : '评论'}}</text>
					</view>
				</view>
				<!-- #ifdef MP -->
				<button v-if="noteDetails.auditStatus == 1" class="time iconfont icon-fenxiang ml-20" open-type="share"
					hover-class='none' :data-id="noteDetails.id" :data-cover="noteDetails.cover" :data-uid="uid"
					:data-title="noteDetails.title" @click="shareFriend(noteDetails)"></button>
				<!-- #endif -->
				<!-- #ifdef APP -->
				<button v-if="noteDetails.auditStatus == 1" @click="appShare('WXSceneSession',noteDetails)"
					class="time iconfont icon-fenxiang ml-20" hover-class='none'></button>
				<!-- #endif -->
				<!-- #ifdef H5 -->
				<button v-if="noteDetails.auditStatus == 1  && isWeixin" @click="appShare('WXSceneSession',noteDetails)"
					class="time iconfont icon-fenxiang ml-20" hover-class='none'></button>
				<button></button>
				<!-- #endif -->
			</view>

		</view>

		<!-- 分享按钮 -->
		<image v-if="H5ShareBox" class="shareImg" :src="urlDomain+'crmebimage/presets/share-info.png'"
			@click="H5ShareBox = false">
		</image>

		<!-- 商品列表 -->
		<uni-popup type="bottom" ref="goods">
			<mentioned v-if="popupShow" :list="proList" @close="popup" class=""></mentioned>
		</uni-popup>

		<!-- 评论弹窗 -->
		<uni-popup type="bottom" ref="comment">
			<view
				:style="'width: 100%; background-color: #fff; border-top-left-radius: 10px; border-top-right-radius: 10px;'">
				<discoverComment v-if="showComment" @getReplyNum="getReplyNum" :noteId="noteDetails.id"
					fromTo="popupView" :noteDetails="noteDetails" @close="close" :isShowCommentView="isShowCommentView">
				</discoverComment>
			</view>
		</uni-popup>

		<!-- 管理弹窗 -->
		<uni-popup type="bottom" ref="manageRef">
			<view class="manage">
				<popup-header title="内容管理" @close="closeManage"></popup-header>
				<navigator hover-class="none" :url="'/pages/discover/discover_release/index?noteId='+noteDetails.id"
					class="items">
					<text>编辑</text>
				</navigator>
				<view class="items" @click.stop="deleteTopic(noteDetails)">
					<text>删除</text>
				</view>
				<view disabled="true" class="items" @click.stop="replySwitch(noteDetails)">
					<text>{{noteDetails.replyStatus ==1 ? '禁止评论' : '开启评论'}}</text>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import discoverComment from '@/components/discoverComment/index.vue';
	import {
		mapGetters
	} from "vuex";
	import {
		toLogin
	} from '@/libs/login.js';
	import {
		discoverNoteLike
	} from '@/libs/follow.js';
	import {
		noteDelApi,
		noteReplySwitchApi
	} from '@/api/discover.js';
	import {
		discoverFollowAuthor
	} from '@/libs/follow.js';
	import {
		Debounce
	} from '@/utils/validate.js'
	import mentioned from '@/components/mentioned.vue';
	import easyLoadimage from '@/components/base/easy-loadimage.vue';
	import popupHeader from '@/components/popupHeader.vue'
	import animationType from '@/utils/animationType.js'
	import {
		HTTP_H5_URL
	} from '@/config/app.js';
	let app = getApp();
	export default {
		computed: mapGetters(['globalData', 'isLogin', 'userInfo', 'uid', 'bottomNavigationIsCustom']),
		components: {
			discoverComment,
			easyLoadimage,
			mentioned,
			popupHeader
		},
		data() {
			return {
				urlDomain: this.$Cache.get("imgHost"),
				H5ShareBox: false,
				isMore: false,
				theme: app.globalData.theme,
				popupShow: false, //商品弹窗
				showManage: false, //管理展示
				indicatorDots: true,
				circular: true,
				autoplay: true,
				interval: 5000,
				duration: 500,
				currents: "1",
				controls: true,
				isPlay: true,
				videoContext: '',
				proList: [], //商品列表
				showComment: false, //评论弹窗
				imageList: [], //轮播图
				isPay: false, //是否买过。true买过
				isWeixin: false, //是否是微信
				noteIndex: 0, //当前的索引
				noteDetails: this.noteRecommendList,
				windowWidth: 0, //获取屏幕宽度🌟💗
			}
		},
		props: {
			/* 内容详情 */
			noteRecommendList: {
				type: Object,
				default: function() {
					return {};
				},
			},
			/* 跳入组件类型，关注 follow 推荐页list，详情detail */
			type: {
				type: String,
				default: function() {
					return '';
				},
			},
			imageH: {
				type: Number,
				default: function() {
					return 0;
				},
			},
			// 评论列表是否出现在详情视图内，出现就展示弹窗
			isShowCommentView: {
				type: Boolean,
				default: function() {
					return false;
				},
			}
		},
		watch: {
			noteRecommendList: {
				immediate: true,
				deep: true,
				handler(nVal, oVal) {
					this.noteDetails = nVal
					if (this.noteDetails.productList && this.noteDetails.productList.length !== 0) {
						this.noteDetails.isPay = this.noteDetails.productList.some(function(items) {
							if (items.isPay == 1) {
								return true;
							}
						})
					}
				}
			}
		},
		onLoad() {
			this.windowWidth = uni.getSystemInfoSync().screenWidth; //获取屏幕宽度
			this.isWeixin = this.$wechat.isWeixin()
			this.computedHeight()
		},
		// 滚动监听
		onPageScroll(e) {
			// 传入scrollTop值并触发所有easy-loadimage组件下的滚动监听事件
			uni.$emit('scroll');
		},
		methods: {
			//关闭操作管理
			closeManage() {
				this.$refs.manageRef.close();
			},
			//操作管理
			handleManage() {
				this.$refs.manageRef.open('bottom');
			},
			appShare(scene, noteDetails) {
				let that = this
				let data = noteDetails;
				// #ifdef APP-PLUS
				uni.showLoading({
					title: '加载中',
					mask: true
				});
				let routes = getCurrentPages(); // 获取当前打开过的页面路由数组
				let curRoute = routes[routes.length - 1].$page.fullPath // 获取当前页面路由，也就是最后一个打开的页面路由
				uni.share({
					provider: "weixin",
					scene: scene,
					type: 0,
					href: `${HTTP_H5_URL}${curRoute}&sd=${that.uid}&id=${data.id}`,
					title: data.title || '',
					summary: data.content || '',
					imageUrl: data.cover || '',
					success: function(res) {
						uni.showToast({
							title: '分享成功',
							icon: 'success'
						})
						uni.hideLoading();
					},
					fail: function(err) {
						uni.hideLoading();
						uni.showToast({
							title: '分享失败',
							icon: 'none',
							duration: 2000
						})
					},
				});
				uni.hideLoading();
				// #endif
				// #ifdef H5
				if (that.$wechat.isWeixin()) {
					uni.showLoading({
						title: '加载中',
						mask: true
					});
					let configAppMessage = {
						desc: data.content || '',
						title: data.title || '',
						link: `/pages/goods/goods_details/index?id=${that.noteDetails.id}&mt=0&sd=${that.uid}`,
						imgUrl: data.cover || ''
					};
					uni.hideLoading();
					that.$wechat.wechatEvevt(["updateAppMessageShareData", "updateTimelineShareData"],
						configAppMessage);
				} else {
					this.H5ShareBox = true;
				}
				// #endif
			},
			//分享信息
			shareFriend(item) {
				this.noteDetails = item
			},
			//修改完评论之后的数量
			getReplyNum(n) {
				//this.noteRecommendListNew[this.noteIndex].replyNum = n;
			},
			// 关注作者
			followAuthor: Debounce(function(noteDetails) {
				if (this.isLogin) {
					discoverFollowAuthor(noteDetails.authorId).then(() => {
						this.$set(noteDetails, 'isConcerned', !noteDetails.isConcerned);
					});
				} else {
					toLogin();
				}
			}),
			moreTap(noteDetails, i) {
				this.$set(noteDetails, 'isMore', true);
			},
			popup() {
				this.$refs.goods.close();
				this.popupShow = false;
			},
			/*查看提到的宝贝*/
			openMore(item) {
				//此处为了处理小程序的兼容性，在父组件中去调取子组件的内容
				if (this.type === 'follow') {
					this.$emit('getPro', item);
				} else {
					this.proList = item.productList;
					this.$refs.goods.open('bottom');
					this.popupShow = true;
				}
			},
			//禁止评论
			replySwitch(noteDetails) {
				if (!noteDetails.platReplySwitch && noteDetails.replyStatus === 3) {
					this.$util.Tips({
						title: '平台设置不可评论'
					});
				} else {
					noteReplySwitchApi(noteDetails.id).then(res => {
						this.$emit('onChangeReplyStatus', noteDetails.replyStatus)
					}).catch(err => {
						uni.showToast({
							title: err,
							icon: 'none'
						})
					});
				}
			},
			// 去个人主人
			goUser(noteDetails) {
				// #ifdef MP || H5
				uni.navigateTo({
					url: `/pages/discover/discover_user/index?id=${noteDetails.authorId}`
				})
				// #endif  
				// #ifdef APP-PLUS
				uni.navigateTo({
					animationType: animationType.type,
					animationDuration: animationType.duration,
					url: `/pages/discover/discover_user/index?id=${noteDetails.authorId}`
				})
				// #endif
			},
			// 删除内容
			deleteTopic(noteDetails) {
				let that = this;
				uni.showModal({
					content: '确定要删除该内容么？',
					success: function(res) {
						if (res.confirm) {
							noteDelApi(noteDetails.id).then(res => {
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
			close() {
				this.$refs.comment.close('bottom');
				this.showComment = false;
			},
			//打开评论弹窗
			openCommon(item) {
				if (!this.isLogin) {
					toLogin();
				} else {
					//如果评论列表展示在视图中，就展示评论输入框
					//如果没在试图中，就展示评论弹窗
					if (this.isShowCommentView) {
						this.$emit('getComment', item);
					} else {
						uni.hideTabBar();
						this.$refs.comment.open('bottom');
						this.showComment = true

					}
				}
			},
			goTopic(id) {
				// #ifdef MP || H5
				uni.navigateTo({
					url: `/pages/discover/discover_note_topic/index?topicId=${id}`
				})
				// #endif  
				// #ifdef APP-PLUS
				uni.navigateTo({
					animationType: animationType.type,
					animationDuration: animationType.duration,
					url: `/pages/discover/discover_note_topic/index?topicId=${id}`
				})
				// #endif
			},
			goDetail(noteDetails) {
				if (noteDetails.type === 2) {
					uni.navigateTo({
						//#ifdef APP
						url: '/pages/discover/discover_video/appVideo/index?noteId=' + noteDetails.id+`&sd=${this.uid}`,
						//#endif
						//#ifndef APP
						url: '/pages/discover/discover_video/routineVideo/index?noteId=' + noteDetails.id+`&sd=${this.uid}`,
						//#endif

					});
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	.author-follow{
		background: none !important;
		@include coupons_border_color(theme);
	}
	.footer_bar {
		background-color: #fff;
		flex-shrink: 0;
		width: 100%;
		position: fixed; // input 所在盒子设置绝对定位
		left: 0;
		z-index: 9;
		display: flex;
		bottom: constant(safe-area-inset-bottom); ///兼容 IOS<11.2/
		bottom: env(safe-area-inset-bottom); ///兼容 IOS>11.2/
		align-items: center;
		justify-content: space-between;
		padding: 0 24rpx;
		border-top: 1px solid #F5F5F5;
	}

	.release_bar_detail {
		height: calc(90rpx+ constant(safe-area-inset-bottom)); ///兼容 IOS<11.2/
		height: calc(90rpx + env(safe-area-inset-bottom)); ///兼容 IOS>11.2/
		padding-bottom: constant(safe-area-inset-bottom); ///兼容 IOS<11.2/
		padding-bottom: env(safe-area-inset-bottom); ///兼容 IOS>11.2/
		background-color: #fff;
	}

	.author {
		display: flex;
		align-items: center;
		position: relative;

		.level_icon {
			position: absolute;
			width: 20rpx;
			height: 20rpx;
			margin: 4rpx 0 0 -4rpx;
			border: none;
			z-index: 1;
			bottom: 2rpx;
			left: 50rpx;
		}

		.picture,
		uni-image {
			width: 60rpx;
			height: 60rpx;
			border-radius: 100%;
		}

		.name {
			margin-left: 20rpx;
			color: #282828;
			font-size: 32rpx;
			font-weight: bold;
			align-items: center;
		}
	}


	/deep/.uni-swiper-dots-horizontal {
		bottom: 40rpx !important;
	}

	.shareImg {
		z-index: 1000;
		position: fixed;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
	}

	.isPay {
		padding: 3rpx 5rpx;
		@include main_color(theme);
		@include coupons_border_color(theme);
		font-size: 20rpx;
		border-radius: 3px 3px 3px 3px;
	}

	.more {
		font-weight: 600;
		margin-left: 6rpx;
	}

	.ml24 {
		margin-left: 24rpx;
	}

	.follow_btn {
		color: #282828 !important;
		border: 1px solid #282828 !important;
	}

	.approval_status {
		padding: 24rpx 24rpx 0 24rpx;

		.status_count {
			padding: 26rpx 30rpx 20rpx;
			border-radius: 10rpx;

			.title {
				margin-left: 10rpx;
				font-size: 28rpx;
				font-weight: bold;
			}

			&.status0 {
				background: #FDF3F2;

				.title {
					color: #E93323;
				}
			}

			&.status1 {
				background: #FFF4EB;

				.title {
					color: #FC8327;
				}
			}

			.iconfont {
				font-size: 30rpx;
			}

			.icon-shijian {
				color: #FC8327;
			}

			.icon-tishi {
				color: #E93323;
			}

			.status_info {
				font-size: 22rpx;
				color: #666666;
				margin: 10rpx 0 0 36rpx;
			}
		}
	}

	.createTime {
		font-size: 24rpx;
		font-family: PingFang SC-Regular, PingFang SC;
		font-weight: 400;
		color: #999999;
	}

	.tab-conts {
		// /deep/.container {
		// 	padding-bottom: calc(100rpx+ constant(safe-area-inset-bottom)); ///兼容 IOS<11.2/
		// 	padding-bottom: calc(100rpx + env(safe-area-inset-bottom)); ///兼容 IOS>11.2/
		// }
	}

	.bodyNo {
		border: none !important;
	}

	.foot_bar {
		display: flex;
		align-items: center;
		justify-content: space-between;

		.item {
			display: flex;
			align-items: center;
			color: #282828;

			&.icon-fenxiang {
				font-size: 46rpx;
			}
		}

		.item_count {
			font-size: 26rpx;
			display: flex;
			align-items: center;
			margin-left: 30rpx;

			&:first-child {
				margin-left: 0;
			}

			.iconfont {
				font-size: 40rpx;
				margin-right: 5rpx;
			}

			.icon-shoucang1 {
				@include main_color(theme);
			}
		}
	}

	.create_time {
		color: #909399;
		font-size: 22rpx;
		margin-top: 28rpx;
	}

	.pro_describle {
		overflow-x: hidden;

		.product_info {
			// line-height: 45rpx;
			margin-top: 30rpx;

			.noteTitle {
				font-size: 30rpx;
				font-family: PingFang SC-Medium, PingFang SC;
				font-weight: 700;
				color: #282828;
				margin-bottom: 14rpx;
			}

			.text {
				font-size: 28rpx;
				color: #282828;
				text-align: justify;
				text-justify: newspaper;
				word-break: break-all;
			}

			.unfold_btn {
				margin-left: 30rpx;
				font-size: 30rpx;
				color: #282828;
				font-weight: bold;
			}
		}

		.topicList {
            margin-right: -20rpx;
			>view {
				display: flex;
				align-items: center;
				border-radius: 30rpx;
				margin-right: 20rpx;
				// line-height: 62rpx;
				// height: 62rpx;
			
				@include main_color(theme);

				.text {
					font-size: 28rpx;
				}

				.icon {
					font-size: 35rpx;
				}
			}
		}
	}

	.imageBox {
		width: 702rpx;
		// height: 702rpx;
		position: relative;

		swiper {
			width: 100%;
			height: 100%;
			position: relative;
		}

		.cover {
			width: 702rpx;
			position: relative;
			border-radius: 10px 10px 10px 10px;

			/deep/image,
			/deep/.easy-loadimage,
			uni-image {
				width: 702rpx;
				border-radius: 10px 10px 10px 10px;
				overflow: hidden;
			}

			.circle {
				width: 100rpx;
				height: 100rpx;
				border-radius: 50%;
				background: rgba(0, 0, 0, .5);
				position: absolute;
				top: 50%;
				left: 50%;
				margin-left: -50rpx;
				margin-top: -50rpx;
				z-index: 10;
				line-height: 50px;
				text-align: center;
				color: #fff;
			}
		}

		.slide-image {
			width: 100%;
			height: 100%;
			border-radius: 16rpx;
		}

		.pages {
			position: absolute;
			background-color: #fff;
			height: 34rpx;
			padding: 0 10rpx;
			border-radius: 3rpx;
			right: 30rpx;
			bottom: 30rpx;
			line-height: 34rpx;
			font-size: 24rpx;
			color: #050505;
		}
	}

	.tab-cont {
		background: #fff;
	}

	.follow_count {
		padding: 30rpx 24rpx 20rpx 24rpx;
		border-bottom: 1px solid #F5F5F5;

		.title {
			padding: 0 10rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
		}

		.author {
			display: flex;
			align-items: center;
			position: relative;

			.level_icon {
				position: absolute;
				width: 26rpx;
				height: 26rpx;
				margin: 4rpx 0 0 6rpx;
				border: none;
				z-index: 1;
				bottom: 2rpx;
				left: 50rpx;
			}

			.picture,
			uni-image {
				width: 78rpx;
				height: 78rpx;
				border-radius: 100%;
			}

			.name {
				margin-left: 20rpx;
				color: #282828;
				font-size: 32rpx;
				font-weight: bold;
				align-items: center;
			}
		}

		.icon-fenxiang {
			font-size: 40rpx !important;
		}

		.time {
			color: #282828;
			font-size: 46rpx;
		}

		.product {
			margin-top: 20rpx;
			border-radius: 16rpx;
		}


	}

	.manage {
		width: 100%;
		background: #ffffff;
		box-shadow: 0 2rpx 15rpx rgba(0, 0, 0, 0.1);
		padding: 30rpx 24rpx;
		z-index: 10;
		border-radius: 40rpx 40rpx 0 0;

		.items {
			// border-bottom: 1px solid #EEEEEE;
			color: #333333;
			font-size: 28rpx;
			display: flex;
			justify-content: center;
			margin-bottom: 64rpx;

			&:last-child {
				border-bottom: none;
			}

			.iconfont {
				margin: 0 16rpx 0;
			}
		}
	}
</style>