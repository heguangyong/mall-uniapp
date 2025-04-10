<template>
	<view :data-theme="theme">
		<view class="header borderPad header-box">
			<text class="title">话题</text>
			<text class="iconfont icon-guanbi5" @click="close"></text>
		</view>
		<view class='search acea-row row-between-wrapper'>
			<view class='input acea-row row-middle'>
				<text class='iconfont icon-sousuo2'></text>
				<input class="placeholder" type='text' :value='searchValue' :focus="focus" placeholder='点击搜索话题'
					placeholder-class='placeholder'  @input="setValue" @confirm="searchBut" maxlength="20"></input>
			</view>
			<view class='bnt' @tap='searchBut'>搜索</view>
		</view>
		<view class="topic-recommend">
			<view class="topic-title acea-row row-middle"><text class="dian mr10"></text>推荐话题</view>
			<view class="list acea-row">
				<view v-for="item in topicRecommendList" :key="item.id" :class="item.isChoose ? 'active' : ''"
					@click="onCheck(item)" class="item borderPad mr20 mb30"><text
						:class="item.isChoose ? 'font-color' : ''" class="icon">#</text>{{item.name}}
				</view>
			</view>
		</view>
		<view class="topic-recommend">
			<view class="topic-title mt10 acea-row row-middle"><text class="dian mr10"></text>全部话题</view>
			<view class="list acea-row" style="border: none;">
				<view v-for="item in topicList" :key="item.id" @click="onCheck(item)"
					:class="item.isChoose ? 'active' : ''" class="item borderPad mr20 mb30">
					<text class="icon" :class="item.isChoose ? 'font-color' : ''">#</text>{{item.name}}
				</view>
			</view>
		</view>
		<view class="foot_bar">
			<button class="confirm_btn" @click="submit">确定({{topicSelectedList.length}}/5)</button>
		</view>
	</view>
</template>

<script>
	import {
		mapGetters
	} from "vuex";
	import {
		topicListApi,
		topicRecommendListApi,
	} from '@/api/discover.js';
	let app = getApp();
	export default {
		computed: mapGetters(['discoverTopic']),
		data() {
			return {
				focus: false,
				searchValue: '',
				theme: app.globalData.theme,
				where: {
					page: 1,
					limit: 30,
					keywords: '',
				},
				loaded: false,
				loading: false,
				topicList: [], //全部
				topicRecommendList: [], //推荐
				topicSelectedList: [] //选中
			}
		},
		mounted() {
			this.topicSelectedList = [...this.discoverTopic];
			this.getTopicList();
			this.getTopicRecommendList();
		},
		onReachBottom() {
			this.getTopicList();
		},
		methods: {
			close() {
				this.$emit('onClose');
			},
			/*获取初始化选中的数据*/
			getInitchecked(arr) {
				let that = this;
				arr.forEach((item, index) => {
					that.$set(item, 'check', false);
					that.topicSelectedList.forEach((val, i) => {
						if ((item.id == val.id)) {
							that.$set(item, 'isChoose', true);
						}
					})
				})
			},
			searchBut(){
				this.focus = false;
				this.where.page = 1;
				this.loaded = false;
				this.loading= false;
				this.topicList = [];
				this.getTopicList();
			},
			//搜索
			onBlur(){
			},
			setValue: function(event) {
				this.$set(this, 'searchValue', event.detail.value);
			},
			/*确定提交*/
			submit() {
				this.$store.commit('DiscoverTopic',this.topicSelectedList);
				this.$emit('onClose',this.topicSelectedList)
			},
			//点击
			onCheck(item) {
				if (this.topicSelectedList.length > 4 && !item.isChoose) {
					return;
				}
				let list = [...this.topicRecommendList, ...this.topicList]
				list.forEach((val, i) => {
					if ((val.id == item.id)) {
						this.$set(val, 'isChoose', !val.isChoose);
					} 
				})
				if (item.isChoose) {
					this.topicSelectedList.push(item)
				} else {
					this.topicSelectedList.splice(this.topicSelectedList.findIndex(itemn => ((itemn.id == item.id))), 1)
				}
			},
			//全部
			getTopicList() {
				if (this.loading || this.loaded) return;
				this.loading = true;
				this.where.keywords = encodeURIComponent(this.searchValue);
				topicListApi(this.where).then(
					res => {
						this.loadingb = false;
						this.loaded = res.data.list.length < this.where.limit;
						this.topicList.push.apply(this.topicList, res.data.list);
						this.where.page = this.where.page + 1;
						this.topicList.forEach((item, index) => {
							this.$set(item, 'isChoose', false);
						})
						this.getInitchecked(this.topicList);
					},
					error => {
						this.$util.Tips({
							title: error.message
						})
					}
				);
			},
			//推荐
			getTopicRecommendList() {
				topicRecommendListApi().then(
					res => {
						this.topicRecommendList = res.data;
						this.topicRecommendList.forEach((item, index) => {
							this.$set(item, 'isChoose', false);
						})
						this.getInitchecked(this.topicRecommendList);
					},
					error => {
						this.$util.Tips({
							title: error.message
						})
					}
				);
			}
		}
	}
</script>
<style lang="scss" scoped>
	.header {
		position: relative;
		text-align: center;
		margin-bottom: 30rpx;
		margin-top: 30rpx;
	
		.title {
			color: #282828;
			font-size: 36rpx;
			font-weight: bold;
		}
	
		.iconfont {
			color: #8A8A8A;
			font-size: 28rpx;
			position: absolute;
			top: 4rpx;
			right: 24rpx;
		}
	}
	.foot_bar {
		width: 100%;
		position: fixed;
		bottom: 0;
		left: 0;
		background: #ffffff;
		padding: 20rpx 0;
		z-index: 5;
	
		.confirm_btn {
			width: 710rpx;
			height: 86rpx;
			line-height: 84rpx;
			color: #ffffff;
			text-align: center;
			font-size: 32rpx;
			@include main_bg_color(theme);
			border-radius: 43rpx;
			margin: 0 auto;
		}
	}
	.topic {
		&-recommend {
			padding: 30rpx 0 0 30rpx;

			.dian {
				width: 10rpx;
				height: 10rpx;
				border-radius: 50%;
				opacity: 1;
				@include main_bg_color(theme);
			}

			.list {
				border-bottom: 1px solid #EEEEEE;
				padding-bottom: 20rpx;

				.active {
					@include cate-two-btn(theme);
					@include main_color(theme);
					border: none;
				}
			}

			.item {
				height: 62rpx;
				line-height: 59rpx;
				border-radius: 31rpx;
				border: 1px solid #CCCCCC;
				color: #282828;
				font-size: 24rpx;

				.icon {
					color: #999999;
					margin-right: 6rpx;
				}
			}

			.item:nth-last-child(1) {
				margin-right: 0;
			}
		}

		&-title {
			font-weight: 600;
			color: #282828;
			font-size: 30rpx;
			margin-bottom: 30rpx;
		}
	}

	.search {
		padding: 0 24rpx 18rpx 30rpx;
		background-color: #fff !important;

		.input {
			width: 610rpx;
			background-color: #f7f7f7;
			border-radius: 33rpx;
			padding: 0 35rpx;
			box-sizing: border-box;
			height: 66rpx;

			input {
				width: 472rpx;
				font-size: 26rpx;
			}

			.placeholder {
				color: #bbb;
			}

			.iconfont {
				color: #000;
				font-size: 35rpx;
			}
		}

		.bnt {
			text-align: center;
			height: 66rpx;
			line-height: 66rpx;
			font-size: 30rpx;
			color: #282828;
		}
	}
	.header-box{
		height: 50rpx;
		line-height: 50rpx;
	}
	.placeholder{
		margin-left: 16rpx;
	}
</style>
