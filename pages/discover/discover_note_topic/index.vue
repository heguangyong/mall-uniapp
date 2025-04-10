<template>
	<view class="discover_note_topic" :data-theme="theme">
		<view class="header">
			<view class="name color28 mb20"><text class="iconfont icon-huati mr20"></text>{{topicDetails.name?topicDetails.name:''}}</view>
			<view class="noteNum">
				{{ (topicDetails.noteNum && topicDetails.noteNum<10000) ? topicDetails.noteNum+'篇内容' : topicDetails.noteNum &&(topicDetails.noteNum/10000).toFixed(2)+'万篇内容'}}
			</view>
		</view>
		<view class="borderPad">
			<view class="acea-row row-center-wrapper tab">
				<view :class="params.type == 'hot'? 'on' : ''" class="nav-item" @click="onChange('hot')">最热</view>
				<view :class="params.type == 'new'? 'on' : ''" class="nav-item" @click="onChange('new')">最新</view>
			</view>
		</view>
		<view class="borderPad">
			<WaterfallsFlow v-if="noteTopicList.length" :wfList="noteTopicList" :fromType="1">
			</WaterfallsFlow>
		</view>
		<view class="publish" @click="publish"><text class="iconfont icon-fabu2"></text>立即发布</view>
	</view>
</template>

<script>
	import WaterfallsFlow from '@/components/WaterfallsFlow/WaterfallsFlow.vue';
	import animationType from '@/utils/animationType.js';
	import {
		topicCountApi,
		noteTopicListApi
	} from '@/api/discover.js';
	let app = getApp();
	export default {
		components: {
			WaterfallsFlow
		},
		data() {
			return {
				theme: app.globalData.theme,
				params: {
					page: 1,
					limit: 10,
					topicId: 0,
					type: 'hot'
				},
				loadend: false,
				loading: false,
				noteTopicList: [],
				topicDetails: {}
			}
		},
		watch: {
			'params.type': {
				handler: function(newV, oldV) {
					if (newV) {
						this.noteTopicList = [];
						this.getNoteTopicList();
					}
				},
				deep: true
			}
		},
		onLoad(options) {
			this.params.topicId = options.topicId;
			this.getTopicCount();
			this.getNoteTopicList();
		},
		onReachBottom() {
			this.getNoteTopicList(); // 推荐
		},
		// 滚动监听
		onPageScroll(e) {
			// 传入scrollTop值并触发所有easy-loadimage组件下的滚动监听事件
			uni.$emit('scroll');
		},
		methods: {
			//发布内容
			publish() {
				// #ifdef MP || H5
				uni.navigateTo({
					url: `/pages/discover/discover_release/index`
				})
				// #endif  
				// #ifdef APP-PLUS
				uni.navigateTo({
					animationType: animationType.type,
					animationDuration: animationType.duration,
					url: `/pages/discover/discover_release/index`
				})
				// #endif
			},
			//点击切换
			onChange(type) {
				this.params.page = 1;
				this.params.type = type;
				this.loading = false;
				this.loadend = false;
			},
			//话题
			getTopicCount() {
				topicCountApi(this.params.topicId).then(res => {
					this.topicDetails = res.data;
				}).catch(err => {
					uni.showToast({
						title: err,
						icon: 'none'
					})
				});
			},
			//关注内容
			getNoteTopicList() {
				if (this.loadend) return;
				this.loading = true;
				noteTopicListApi(this.params).then(res => {
					this.$set(this.params, 'page', this.params.page + 1);
					this.loadend = this.params.page > res.data.totalPage;
					this.noteTopicList = this.noteTopicList.concat(res.data.list || []);
					this.loading = false
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

<style lang="scss" scoped>
	.publish {
		position: fixed;
		z-index: 9999;
		width: 240rpx;
		height: 76rpx;
		opacity: 1;
		border-radius: 38rpx;
		bottom: 142rpx;
		right: 50%;
		margin-right: -60px;
		color: #fff;
		line-height: 76rpx;
		text-align: center;
		@include linear-gradient(theme);
        font-size: 30rpx;
		.iconfont {
			font-size: 28rpx;
			margin-right: 16rpx;
		}
	}

	.nav-item {
		font-size: 32rpx;
		color: #999;

		&:first-child {
			margin-right: 70rpx;
		}

		&.on {
			position: relative;
			font-size: 38rpx;
			color: #333;
			font-weight: bold;

			&::after {
				content: "";
				width: 40rpx;
				height: 5rpx;
				@include main_bg_color(theme);
				position: absolute;
				bottom: -10rpx;
				left: 14rpx;
			}
		}
	}

	.discover_note_topic {
		background-color: #fff;
		position: relative;
	}

	.tab {
		border-top: 1px solid #EEEEEE;
		padding: 30rpx 0 37rpx 0;
	}

	.header {
		padding: 40rpx 24rpx;


		.name {

			font-size: 34rpx;
			font-weight: 600;
		}

		.noteNum {
			font-size: 24rpx;
			color: #666666;
		}
	}
</style>