<template>
	<view v-if="noteDetail" class="main_content" :data-theme="theme" :class="!noteDetail.platReplySwitch?'bodyNo':''">
		<popup-header  v-if="!isShowCommentView && noteDetail.platReplySwitch && fromTo==='popupView'" title="评论" :num="noteDetail.replyNum" @close="close"></popup-header>
		<!-- 评论列表 -->
		<scroll-view class="bottom" id="myElements" scroll-y="true" @scrolltolower="onTouchmove" @scroll="followScroll"
			v-if="noteDetail.platReplySwitch">
			<view class="container">
				<view v-if="list.length > 0" id="reply">
					<view class="common_list" v-for="(item, index) in list" :key="index">
						<view class="commen_one" @click.stop="goUserHomePage(item.uid)">
							<image :src="item.avatar || urlDomain+'crmebimage/presets/morenT.png'" class="image">
							</image>
						</view>
						<view class="info_count">
							<view class="info">
								<view class="message" @click.stop="toReply(item,index)">
									<view v-if="item.nickname" class="name">{{item.nickname}}</view>
									<view class="desc acea-row">
										<view v-if="item.auditStatus==0" class="auditStatus">
											<text class="line-heightOne">审核中</text>
										</view>
										<view style="width: 84%;">{{item.content}}</view>
									</view>
									<view class="acea-row row-middle" style="margin-top: 4rpx;">
										<view class="time">{{item.createTime?$util.getDateDiff(item.createTime):''}}
										</view>
										<view @click.stop="toReply(item,index)" class="del mr-20">回复</view>
										<text @click.stop="onDel(item, index)" v-if="item.uid == uid"
											class="del">删除</text>
									</view>
								</view>
								<view v-if="item.auditStatus!==0" class="like acea-row row-middle" @click.stop="starComment(item)">
									<view class="iconfont mr-10" :class="item.isLike ? 'icon-yidianzan' : 'icon-dianzan1'">
									</view>
									{{item.countStart?item.countStart:0}}
								</view>
							</view>
							<view v-if="item.replyList && item.replyList.length > 0" class="reply_count">
								<view v-for="(itemn,indexn) in item.replyList" :key="indexn" class="reply_list">
									<view class="item">
										<view class="item_count" @click.stop="toReply(itemn,index)">
											<image class="image" @click.stop="goUserHomePage(itemn.uid)"
												:src="itemn.avatar || urlDomain+'crmebimage/presets/morenT.png'">
											</image>
											<view v-if="itemn.nickname" class="name_two">{{itemn.nickname}}
											</view>
											<view class="desc acea-row">
												<view v-if="itemn.auditStatus==0" class="auditStatus mt10">
													<text class="line-heightOne">审核中</text>
												</view>
												<view class="desc_two">
													<text class="reply_user acea-row" v-if="Number(itemn.reviewUid) >0">回复<text class=ml-4>@{{itemn.reviewUserNickname}}</text> </text>{{itemn.content}}
												</view>
											</view>
											<view class="acea-row row-middle" style="margin-top: 4rpx;">
												<view class="time_two">
													{{itemn.createTime?$util.getDateDiff(itemn.createTime):''}}
												</view>
												<view @click.stop="toReply(itemn,index)" class="del mr20">回复</view>
												<text @click.stop="onDel(itemn, indexn, index)" v-if="itemn.uid == uid"
													class="del">删除</text>
											</view>

										</view>
										<view v-if="itemn.auditStatus!==0" class="like_two acea-row"
											@click.stop="starComment(itemn)">
											<view class="iconfont"
												:class="itemn.isLike ? 'icon-yidianzan' : 'icon-dianzan1'"></view>
											{{itemn.countStart ? itemn.countStart : 0}}
										</view>
									</view>
								</view>
							</view>
						</view>

					</view>
					<view class="end"><text>到底了</text></view>
				</view>
				<view :hidden="!loading" class="acea-row row-center-wrapper loadingicon">
					<text class="iconfont icon-jiazai loading"></text>
				</view>
				<view v-if="list.length == 0 && !loading" class="empty-box">
					<image :src="urlDomain+'crmebimage/presets/noEvaluate.png'"></image>
					<text>暂无评论，快去抢沙发吧~</text>
				</view>
			</view>
		</scroll-view>

		<!-- 评论弹窗评论触发处 -->
		<view v-if="fromTo==='popupView' && !isShowComment" @click="parentPinglun" class="release_bar bottoms">
			<image class="image" :src="userInfo.avatar || urlDomain+'crmebimage/presets/morenT.png'"></image>
			<view class="lang"
				:style="'height: 32px; margin-left: 10px; background-color: #eee; border-radius: 50px; display: flex; flex-direction: row;'">
				<text style="font-size: 13px; color: #999; margin-top: 7px; margin-left: 15px;">{{placeholder}}</text>

			</view>
		</view>
		<!-- 真实评论弹窗 -->
		<view v-show="isShowComment==true || (isShowCommentView && isClickBtn)" class="mask-popup"
			:class="isShowComment==true || (isShowCommentView && isClickBtn)?'on':''">
			<view class="release_bar" style="padding: 30rpx 24rpx;">
				<image class="image mr-20" :src="userInfo.avatar || urlDomain+'crmebimage/presets/morenT.png'"></image>
				<textarea :placeholder="placeholder" placeholder-style="color: #999999; font-size: 26rpx;"
					v-model="content" :cursor-spacing="cursorSpacing" confirm-hold
					:show-confirm-bar="false" class="input_count" 
					:focus="autoFocus" :adjust-position="adjustPosition" auto-height />

				<button class="send ml-20" @click.stop="submitComment">发送</button>
			</view>
		</view>
		<view class='mask' @touchmove.prevent catchtouchmove="true"
			v-show="isShowComment || (isShowCommentView && isClickBtn &&!isShowComment)" @tap="closeComment"></view>
	</view>
</template>

<script>
	import {
		mapGetters
	} from "vuex";
	import {
		discoverNoteLike
	} from '@/libs/follow.js';
	import {
		replyListApi,
		noteReplyAddApi,
		noteReplyLikeApi,
		replyDeleteApi
	} from '@/api/discover.js';
	import {
		toLogin
	} from '@/libs/login.js';
	import {
		Debounce
	} from '@/utils/validate.js'
	import popupHeader from '@/components/popupHeader.vue'
	let app = getApp();
	export default {
		computed: mapGetters(['isLogin', 'userInfo', 'uid']),
		components: {
			popupHeader
		},
		watch: {
			noteId: {
				handler: function(newV, oldV) {
					if (newV) {
						this.where.page = 1;
						this.loading = false;
						this.loaded = false;
						this.list = [];
						this.getList();

					}
				},
				deep: true
			},
			noteDetails: {
				handler: function(newV, oldV) {

					if (newV) {
						this.noteDetail = newV
					}
				},
				deep: true
			}
		},
		props: {
			/* 哪里引用，页面中使用还是弹窗中使用评论 */
			fromTo: {
				type: String,
				default: ''
			},
			/* 内容id */
			noteId: {
				type: Number,
				default: 0
			},
			/* 逛逛详情 */
			noteDetails: {
				type: Object,
				default: function() {
					return {};
				},
			},
			// 评论列表是否出现在详情视图内，出现就展示弹窗
			isShowCommentView: {
				type: Boolean,
				default: false,
			},
			//是否点击了评论按钮
			isClickBtn: {
				type: Boolean,
				default: false,
			},
		},
		data() {
			return {
				urlDomain: this.$Cache.get("imgHost"),
				cursorSpacing: 20, //键盘距离输入框的距离
				adjustPosition: true, //默认
				autoFocus: false,
				noteDetail: this.noteDetails,
				theme: app.globalData.theme,
				content: '',
				isShowComment: false, //真实评论弹窗显示隐藏
				placeholder: "快来说点儿什么吧...",
				loadTitle: '加载更多',
				where: {
					page: 1,
					limit: 10,
					noteId: ''
				},
				list: [],
				loading: false,
				replyId: 0,
				focus: false,
				index: 0,
				isChild: false,
				bottomVal: 0,
				observer: null,
				elementId: 'myElements',
			}
		},
		mounted() {
			this.getList();
		},
		onReady() {
		},
		onUnload() {
		},
		methods: {
			//去个人主页
			goUserHomePage(id){
				this.$util.navigateTo(`/pages/discover/discover_user/index?id=${id}`);
			},
			//删除自己的评论
			onDel(item, i, idx) {
				uni.showModal({
					title: '提示',
					content: '确认删除评论吗?',
					success: res => {
						if (res.confirm) {
							this.onSub(item, i, idx);
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			},
			onSub(item, i, idx) {
				uni.showLoading({
					title: '删除中...'
				});
				replyDeleteApi(item.id).then(res => {
					if (item.type === 1) {
						this.list.splice(i, 1);
					} else {
						this.list[idx].replyList.splice(i, 1)
					}
					uni.showToast({
						title: '删除成功',
						icon: 'none'
					})
					this.noteDetail.replyNum = res.data;
					this.$emit('getReplyNum', this.noteDetail.replyNum)
					uni.hideLoading();
				}).catch(err => {
					uni.hideLoading();
					uni.showToast({
						title: err,
						icon: 'none'
					})
				});
			},
			/*点赞评论*/
			starComment: Debounce(function(item) {
				let that = this;
				noteReplyLikeApi(item.id).then(res => {
					this.$set(item, 'isLike', !item.isLike);
					if (!item.isLike) {
						item.countStart--;
						item.countStart = item.countStart == 0 ? 0 : item.countStart
					} else {
						item.countStart++;
					}
				}).catch(err => {
					uni.showToast({
						title: err,
						icon: 'none'
					})
				});
			}),
			// 模拟触底刷新
			onTouchmove(e) {
				if (this.loadend || this.loading) return;
				this.getList();
			},
			/**
			 *  
			 */
			followScroll() {
				uni.$emit('scroll');
			},
			close() {
				this.$emit('close');
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
			//回复
			toReply(item, index) {
				if (item.auditStatus === 0) return this.$util.Tips({
					title: '审核中的评论不能进行回复'
				});
				this.placeholder = '回复：' + item.nickname
				this.replyId = item.id
				this.isChild = true
				this.index = index
				this.focus = true
				this.content = ""
				this.isShowComment = true
			},
			clickTextarea() {
				this.isopen = false;
				if (uni.getSystemInfoSync().platform == 'ios') {
					this.autoFocus = false;
					setTimeout(() => {
						this.autoFocus = true;
					}, 200)
				}
			},
			linechange(event) {
				this.lineheight = event.detail.height
			},
			//真实评论弹窗 关闭
			closeComment() {
				this.autoFocus = false;
				this.placeholder = "快来说点儿什么吧...";
				this.content = ""
				this.isChild = false
				this.focus = false
				this.bottomVal = 0
				this.isShowComment = false;
				//关闭评论蒙层
				this.$emit('closeModelComment')
			},
			oninput() {
				if (Number(this.noteDetail.replyStatus) > 1) {
					return this.$util.Tips({
						title: '该内容禁止评论'
					});
				} else {
					this.isShowComment = true
				}
			},
			parentPinglun() {
				if (!this.isLogin) {
					toLogin();
				} else {
					if (Number(this.noteDetail.replyStatus) > 1) {
						return this.$util.Tips({
							title: '该内容禁止评论'
						});
					} else {
						this.autoFocus = false;
						setTimeout(() => {
							this.autoFocus = true;
							this.isShowComment = true
						}, 50)
					}
				}
			},
			//评论发送提交
			submitComment: Debounce(function() {
				if (!this.content) return;
				noteReplyAddApi({
					content: this.content,
					noteId: this.noteId,
					replyId: this.replyId
				}).then(res => {
					this.isShowComment = false
					if (this.isChild) {
						if (this.list[this.index]['replyList']) {
							this.list[this.index]['replyList'].push(res.data)
						} else {
							this.list[this.index]['replyList'] = [res.data]
						}
					} else {
						this.list.unshift(res.data)
					}
					this.noteDetail.replyNum = res.data.noteReplyNum
					this.closeComment();
					this.$util.Tips({
						title: res.message
					});
				}).catch(err => {
					this.isShowComment = false
					uni.showToast({
						title: err,
						icon: 'none'
					})
				});
			}),
			//评论列表
			getList() {
				let that = this;
				if (that.loading || that.loaded) return;
				that.loading = true;
				that.where.noteId = this.noteId;

				replyListApi(that.where).then(res => {
						that.loading = false;
						that.all = res.data.all;
						that.loaded = res.data.list.length < that.where.limit;
						that.loadTitle = that.loadend ? '没有了' : '加载更多';
						that.list.push.apply(that.list, res.data.list);
						that.where.page = that.where.page + 1;
					},
					error => {
						that.loading = false;
						that.$util.Tips({
							title: error.msg
						})
					}
				);
			},
		}
	}
</script>

<style lang="scss" scoped>
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


	.del {
		font-size: 24rpx;
		color: #999999;
		display: inline-block;
	}

	.no-border {
		position: static !important;
		// border: none !important;
		background-color: #fff;
		z-index: 999 !important;
	}

	.release_box {
		padding: 30rpx 0;
		// padding-bottom: constant(safe-area-inset-bottom); // 兼容 IOS<11.2
		// padding-bottom: env(safe-area-inset-bottom); // 兼容 IOS>11.2
	}

	.lang {
		width: 628rpx !important;
	}

	.bodyNo {
		padding: 0 !important;
	}

	.main_content {
		padding: 30rpx 24rpx;
	}

	.fixed {
		// bottom: calc(40rpx+ constant(safe-area-inset-bottom)) !important; ///兼容 IOS<11.2/
		// bottom: calc(40rpx + env(safe-area-inset-bottom));
		position: fixed !important;
		//bottom: 0;
		// bottom: constant(safe-area-inset-bottom); // 兼容 IOS<11.2
		// bottom: env(safe-area-inset-bottom); // 兼容 IOS>11.2
		background-color: #fff;
	}

	.auditStatus {
		font-size: 18rpx;
		border-radius: 2px;
		opacity: 1;
		border: 1px solid #FE960F;
		color: #FE960F;
		height: 32rpx;
		padding: 0 4rpx;
		margin-right: 8rpx;
	}

	.textarea {
		bottom: constant(safe-area-inset-bottom); // 兼容 IOS<11.2
		bottom: env(safe-area-inset-bottom); // 兼容 IOS>11.2 
	}

	.bottom {
		bottom: constant(safe-area-inset-bottom); // 兼容 IOS<11.2
		bottom: env(safe-area-inset-bottom); // 兼容 IOS>11.2 
	}

	.release_bar_detail {
		height: calc(90rpx+ constant(safe-area-inset-bottom)); ///兼容 IOS<11.2/
		height: calc(90rpx + env(safe-area-inset-bottom)); ///兼容 IOS>11.2/
		padding-bottom: constant(safe-area-inset-bottom); ///兼容 IOS<11.2/
		padding-bottom: env(safe-area-inset-bottom); ///兼容 IOS>11.2/
		background-color: #fff;
	}

	.release_bar {
		background-color: #fff;
		flex-shrink: 0;
		width: 100%;
		position: absolute; // input 所在盒子设置绝对定位
		left: 0;
		z-index: 999;
		display: flex;
		bottom: constant(safe-area-inset-bottom); ///兼容 IOS<11.2/
		bottom: env(safe-area-inset-bottom); ///兼容 IOS>11.2/
		align-items: center;
		// justify-content: space-between;
		padding: 15rpx 24rpx;
		border-top: 1px solid #F5F5F5;

		.avatar,
		image,
		uni-image {
			width: 54rpx;
			height: 54rpx;
			border-radius: 100%;
		}

		.input_count {
			width: 440rpx;
			background: #F7F7F7;
			border-radius: 40rpx;
			height: 64rpx;
			/* #ifdef H5 */
			padding: 10rpx 30rpx;
			/* #endif */
			/* #ifndef H5 */
			padding: 16rpx 30rpx;
			/* #endif */
		}

		textarea {
			width: 100%;
		}

		.send {
			font-size: 26rpx;
			color: #ffffff;
			width: 120rpx;
			height: 64rpx;
			line-height: 64rpx;
			text-align: center;
			@include linear-gradient(theme);
			border-radius: 30rpx;
			text-align: center;
			font-weight: 500;
		}

		.input_bar {
			align-items: center;
			color: #282828;
			font-size: 26rpx;

			.iconfont {
				font-size: 40rpx;
				margin-right: 6rpx;
			}

			.icon-shoucang1 {
				@include main_color(theme);
			}

			.item {
				align-items: center;

				&:first-child {
					margin-right: 25rpx;
				}
			}
		}
	}

	.container {
		background-color: #fff;
		position: relative;
		height: 986rpx;
	}

	.end {
		margin-top: 50rpx;
		text-align: center;

		text {
			color: #999999;
			font-size: 22rpx;
			position: relative;

			&::before,
			&::after {
				content: "";
				display: inline-block;
				width: 22rpx;
				height: 1rpx;
				background: #999999;
				position: absolute;
				top: 18rpx;
				opacity: .5;
			}

			&::before {
				left: -30rpx;
			}

			&::after {
				right: -30rpx;
			}
		}
	}

	.common_list {
		position: relative;
		padding-left: 94rpx;

		.commen_one {
			position: absolute;
			top: 0;
			left: 0;

			.image,
			uni-image {
				width: 74rpx;
				height: 74rpx;
				border-radius: 100%;
			}
		}

		.info_count {
			margin-bottom: 30rpx;
		}

		.info {
			position: relative;

		}

		.name,
		.name_two {
			color: #999999;
			font-size: 26rpx;
		}

		.desc,
		.desc_two {
			color: #282828;
			font-size: 28rpx;
			margin-top: 4rpx;
			align-items: center;
		}

		.desc_two {
			font-size: 28rpx;
			width: 84%;

			.reply_user {
				font-size: 28rpx;
				color: #4A8AC9;
				display: inline-block;
				margin: 0 6rpx 0 6rpx;
			}
		}

		.time {
			color: #bbb;
			font-size: 24rpx;
			margin-right: 20rpx;
		}

		.icon-cha2 {
			font-size: 26rpx;
			margin-top: 4rpx;
		}

		.time_two {
			color: #bbb;
			font-size: 24rpx;
			margin-right: 20rpx;
		}

		.like,
		.like_two {
			color: #999999;
			font-size: 26rpx;
			text-align: center;
			position: absolute;
			top: 0;
			right: 0;
			width: 75rpx;

			.icon-yidianzan {
				@include main_color(theme);
			}
			.iconfont{
				margin-right: 10rpx;
			}
		}

		.reply_list {
			margin-top: 24rpx;

			.item {
				// padding-right: 140rpx;
				position: relative;
			}

			.item_count {
				position: relative;
				padding-left: 56rpx;

				.image,
				un-image {
					width: 36rpx;
					height: 36rpx;
					border-radius: 100%;
					position: absolute;
					top: 0;
					left: 0;
				}
			}
		}
	}
</style>