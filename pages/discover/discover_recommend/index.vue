<template>
	<view class="discover_recommend">
		<scroll-view v-if="noteRecommendList.length>0" scroll-y="true" :show-scrollbar="false" class="scroll-view" :style="'height:'+swiperHeight+'px'"
			id="recommendList" @scrolltolower="onTouchmoveRecommend" @scroll="followScroll">
			<discover-details v-if="noteRecommendList.length>0" @getIsMore="getIsMore" @getComment="getComment"
				type="list" :noteRecommendList="noteRecommendList"></discover-details>
			<view class='loadingicon acea-row row-center-wrapper'>
				<text class='loading iconfont icon-jiazai' :hidden='loading==false && noteDetails'></text>{{loadTitle}}
			</view>
		</scroll-view>

		<view class="empty-boxs" v-if="isShow">
			<emptyPage title="内容不存在,可能被删除了噢~" mTop="31%" :imgSrc="urlDomain+'crmebimage/presets/noguanzhu.png'"></emptyPage>
			<view class="btn" url="/pages/discover_index/index" @click="back">返回首页</view>
		</view>

		<!-- 评论 -->
		<uni-popup type="bottom" ref="comment">
			<view
				:style="'width: '+ windowWidth +'px; background-color: #fff; border-top-left-radius: 10px; border-top-right-radius: 10px;'">
			<discoverComment v-if="showComment" @getReplyNum="getReplyNum" :noteId="noteDetails.id"
				:noteDetails="noteDetails" @close="close">
			</discoverComment>
			</view>
		</uni-popup>
	</view>
</template>
<script>
	import emptyPage from '@/components/emptyPage.vue'
	import discoverDetails from '@/components/discoverDetails/index.vue'
	import discoverComment from '@/components/discoverComment/index.vue'
	import {
		noteRecommendApi,
		noteDetailApi
	} from '@/api/discover.js';
	export default {
		components: {
			discoverDetails,
			discoverComment,
			emptyPage
		},
		data() {
			return {
        urlDomain: this.$Cache.get("imgHost"),
				windowWidth: 0, //获取屏幕宽度🌟💗
				swiperHeight: 0,
				noteRecommendList: [], // 发现内容推荐列表
				loaded: false,
				loading: false,
				loadTitle: '加载更多',
				where: {
					page: 1,
					limit: 10,
					noteId: '' //内容id
				},
				noteDetails: {}, //内容详情
				isShow: false, //内容是否被删掉
				showComment: false, //评论弹窗
				windowHeight: 0,
				isWidth: 0
			}
		},
		onLoad: function(options) {
			this.windowWidth = uni.getSystemInfoSync().screenWidth; //获取屏幕宽度
			this.where.noteId = options.noteId ? options.noteId : '';
			this.getNoteRecommend(); // 推荐
			this.getNoteDetail(options.noteId);
		},
		created() {
			var that = this;
			// 获取设备宽度
			uni.getSystemInfo({
				success(e) {
					that.isWidth = e.windowWidth / 6;
					that.windowHeight = e.windowHeight;
					that.swiperHeight = that.windowHeight
					that.$set(that, 'swiperHeight', that.windowHeight);
				}
			});

		},
		onReachBottom() {
			this.getNoteRecommend(); // 推荐
		},
		// 滚动监听
		onPageScroll(e) {
			// 传入scrollTop值并触发所有easy-loadimage组件下的滚动监听事件
			uni.$emit('scroll');
		},
		/**
		 * 用户点击右上角分享
		 */
		// #ifdef MP
		onShareAppMessage: function(res) {
			let data = res.target.dataset;
			return {
				title: data.title || '',
				imageUrl: data.cover || '',
				path: 'pages/discover/discover_details/index?noteId=' + data.id + '&sd=' + data.uid,
			}
		},
		// #endif
		methods: {
			/**
			 * 列表滑动中用到的方法
			 */
			followScroll() {
				uni.$emit('scroll');
			},
			onTouchmoveRecommend(e) {
				this.getNoteRecommend();
			},
			close() {
				uni.showTabBar();
				this.showComment = false;
				this.$refs.comment.close();
			},
			getReplyNum(n) {
				this.noteDetails.replyNum = n;
			},
			// 点击评论
			getComment(item) {
			    this.showComment = false;
				this.noteDetails = item;
				uni.hideTabBar();
				this.$refs.comment.open('bottom');
				this.showComment = true;
				
			},
			//返回首页
			back() {
				uni.switchTab({
					url: '/pages/discover_index/index'
				})
				this.$util.backPageRefresh();
			},
			getIsMore(i) {
				this.noteRecommendList[i].isMore = true;
			},
			//此页面，最上面展示当前内容的详情，底下为推荐的内容列表
			// 内容详情
			getNoteDetail(noteId) {
				this.loading = true;
				noteDetailApi(noteId).then(res => {
					this.noteRecommendList.unshift(res.data)
					this.noteDetails = res.data
					this.loading = false;
				}).catch(err => {
					this.isShow = true;
					uni.showToast({
						title: err,
						icon: 'none'
					})
					this.loading = false;
				});
			},
			// 内容发现推荐列表
			getNoteRecommend: function() {
				let that = this;
				if (that.loadend) return;
				if (that.loading) return;
				that.loading = true;
				that.loadTitle = '';
				that.where.title = encodeURIComponent(this.searchValue);
				noteRecommendApi(that.where).then(res => {
					that.$set(that.where, 'page', that.where.page + 1);
					this.noteRecommendList = this.noteRecommendList.concat(res.data.list || []);
					that.loadend = that.where.page > res.data.totalPage;
					that.loading = false;
					that.loadTitle = that.loadend ? '已全部加载' : '加载更多';
					this.noteRecommendList.map(item => {
						item.isMore = false;
					})
				}).catch(err => {
					that.loading = false;
					uni.showToast({
						title: err,
						icon: 'none'
					})
				});
			},
		}
	}
</script>

<style lang="scss" scoped>
	.btn {
		width: 440rpx;
		text-align: center;
		padding: 15rpx 0;
		@include main_color(theme);
		@include coupons_border_color(theme);
		border-radius: 40rpx;
		margin: 44rpx auto 0;
		font-size: 32rpx;
	}

	.discover_recommend {
		background-color: #fff;
		::v-deep.no-border {
			bottom: 40rpx;
		}
	}
</style>