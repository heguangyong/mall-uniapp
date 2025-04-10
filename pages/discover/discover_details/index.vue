<template>
	<view class="discover-details">
		<!-- #ifdef MP || APP-PLUS-->
		<!-- <nav-bar iconColor='#fff' navTitle='内容详情' :isBackgroundColor="false" ref="navBarRef" :isHeight="false">
		</nav-bar> -->
		<!--  #endif -->
		<discover-details v-if="noteDetail && !loading" :noteRecommendList="noteDetail" type="detail"
			@getComment="getComment" @onChangeReplyStatus="onChangeReplyStatus" :imageH="imageH"
			:isShowCommentView="isShowCommentView"></discover-details>
		<view class='loadingicon acea-row row-center-wrapper' :hidden='loading==false'>
			<text class='loading iconfont icon-jiazai'></text>
		</view>

		<view class="commen_details borderPad" id="myElement">
			<view v-if="noteDetail.platReplySwitch" class="commen_count" id="commen_count">
				评论<span class="ml10">{{noteDetail.replyNum == 0 ? '' : noteDetail.replyNum}}</span></view>
			<view>
				<discoverComment v-if="noteDetail" :noteId="noteId" :noteDetails="noteDetail" :isClickBtn="isClickBtn"
					fromTo="pageView" :isShowCommentView="isShowCommentView" @closeModelComment="closeModelComment">
				</discoverComment>
			</view>
		</view>
	</view>
</template>

<script>
	import discoverDetails from '@/components/discoverDetails/index.vue'
	import discoverComment from '@/components/discoverComment/index.vue'
	import navBar from '@/components/navBar';
	import {
		noteDetailApi
	} from '@/api/discover.js';
	import {
		silenceBindingSpread,
		getUserSpread
	} from '@/utils/index.js';
	import {
		mapGetters
	} from "vuex";
	import onShare from "../../../mixins/onShare";
	export default {
		components: {
			discoverDetails,
			discoverComment,
			navBar
		},
		mixins: [onShare],
		computed: mapGetters(['isLogin', 'uid', 'globalData']),
		data() {
			return {
				noteDetail: {}, //内容详情
				content: '',
				bottomVal: 0,
				placeholder: "快来说点儿什么吧...",
				loading: false,
				isShowComment: false, //真实评论弹窗显示隐藏
				noteId: 0,
				showComment: false, //评论弹窗
				imageH: 0, //图片高度
				appear: false,
				elementId: 'myElement',
				observer: null,
				isShowCommentView: false, //评论列表是否出现
				isClickBtn: false, //是否点击了评论按钮,
				title: '内容详情'
			}
		},
		onLoad: function(options) {
			let pages = getCurrentPages()

			this.noteId = Number(options.noteId);
			this.getNoteDetail(options.noteId);

			//分销码
			getUserSpread(options);
		},
		onReady() {
			setTimeout(() => {
				// 创建监听器
				this.observer = uni.createIntersectionObserver(this);
				// 监听评论列表是否出现
				this.observer.relativeToViewport('#myElement').observe('#commen_count', (res) => {
					// res.intersectionRatio 为相交区域和元素的比例
					if (res.intersectionRatio > 0) {
						this.isShowCommentView = true
						// 元素进入可视区域
					} else {
						this.isShowCommentView = false
						this.isClickBtn = false
						// 元素离开可视区域
					}
				});
			}, 500)
		},
		onUnload() {
			// 页面销毁时，停止监听
			if (this.observer) {
				this.observer.disconnect();
			}
		},
		onShow() {
			//分销绑定
			silenceBindingSpread(this.isLogin, this.globalData.spread);
		},
		methods: {

			// 计算图片高度
			computedHeight() {
				let that = this;
				if (this.noteDetail.image) {
					let windowWidth = uni.getSystemInfoSync().windowWidth;
					uni.getImageInfo({
						src: that.$util.setDomain(this.noteDetail.image.split(',')[0]),
						success: (image) => {
							let imageH = parseInt(image.height * windowWidth / image.width);
							if (imageH > 500) {
								this.isAuto = false;
								this.imageH = 500;
							} else {
								this.imageH = imageH;
							}
						}
					})
				}
			},
			getReplyNum(n) {
				this.noteRecommendListNew[this.noteIndex].replyNum = n;
			},
			//触发评论输入框出现
			getComment(item) {
				this.showComment = true;
				this.isClickBtn = true
				this.noteDetails = item;
			},
			closeModelComment() {
				this.isClickBtn = false
			},
			//关闭评论回调
			onChangeReplyStatus(replyStatus) {
				if (replyStatus === 1) {
					this.$set(this.noteDetail, 'replyStatus', 2)
					this.$util.Tips({
						title: '禁止成功'
					});
				} else {
					this.$set(this.noteDetail, 'replyStatus', 1)
					this.$util.Tips({
						title: '开启成功'
					});
				}
			},
			// 内容详情
			getNoteDetail(noteId) {
				noteDetailApi(noteId).then(res => {
					this.loading = true;
					this.noteDetail = res.data;
					this.noteRecommendList = res.data;
					this.computedHeight()
					this.loading = false;
				}).catch(err => {
					this.loading = false;
					uni.showToast({
						title: err,
						icon: 'none'
					})
				});
			},
		}
	}
</script>

<style scoped lang="scss">
	/deep/.container {
		padding-bottom: 0 !important;
	}

	.commen_details {
		/deep/.container {
			height: auto !important;
		}

		/deep/.main_content {
			padding: 30rpx 0 !important;
		}
	}

	.commen_count {
		font-size: 26rpx;
		color: #282828;
		margin: 40rpx 0 0 0;
		// min-height: 1px;
	}

	.discover-details {
		padding-bottom: calc(80rpx+ constant(safe-area-inset-bottom)) !important; ///兼容 IOS<11.2/
		padding-bottom: calc(80rpx + env(safe-area-inset-bottom));
		background-color: #fff;
	}

	.details {
		padding-bottom: calc(40rpx+ constant(safe-area-inset-bottom)) !important; ///兼容 IOS<11.2/
		padding-bottom: calc(40rpx + env(safe-area-inset-bottom));
	}

	.lang {
		width: 560rpx !important;
	}

	.send {
		font-size: 26rpx;
		color: #ffffff;
		width: 120rpx;
		height: 62rpx;
		line-height: 62rpx;
		text-align: center;
		@include linear-gradient(theme);
		border-radius: 30rpx;
		text-align: center;
	}

	.details {
		background-color: #fff;
	}
</style>