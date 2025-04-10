<template>
	<view :data-theme="theme" class="discover borderPad">
		<!-- 表单 -->
		<form v-if="!topicShow" @submit="formSubmit" report-submit='true'>
			<view class="release_content">
				<view class="release_item">
					<view class="photo_count">
						<view class="input_photo acea-row row-middle">
							<view class="pictrue" v-if="formData.video">
								<image class="video-bg" mode="widthFix" src="../static/images/video_bg.png"></image>
								<view class="videoHover" @click="videoshow">
									<view>
										<text class="iconfont icon-24gf-play"></text>
									</view>
								</view>
								<text class="video-text">点击可预览视频</text>
								<view class="close_btn" @click="formData.video = ''"><text
										class="iconfont icon-guanbi4"></text></view>
							</view>
							<view class="pictrue" v-for="(item, index) in image" :key="index">
								<easy-loadimage mode="widthFix" :image-src="item.url"></easy-loadimage>
								<text class="cover_text" v-if="item.isCover">封面</text>
								<view class="close_btn" @click="DelPic(index)"><text
										class="iconfont icon-guanbi4"></text></view>
								<view class="cover_change" v-if="!item.isCover" @click="onChangeCover(item, index)">更换封面
								</view>
							</view>
							<view v-if="image.length < 9 && !formData.video"
								class="pictrue acea-row row-center-wrapper row-column add" @click="upload('image')">
								<view><text class='iconfont icon-paizhao'></text></view>
								<view class="text">添加图片</view>
							</view>

							<view v-if="image.length === 0 && !formData.video"
								class="pictrue acea-row row-center-wrapper row-column add" @click="upload('video',1)">
								<view><text class='iconfont icon-tianjiashipin'></text></view>
								<view class="text">添加视频</view>
							</view>
							<view v-if="formData.video && image.length=== 0"
								class="pictrue acea-row row-center-wrapper row-column add" @click="upload('video',2)">

								<view><text class='iconfont icon-paizhao'></text></view>
								<view class="text">添加封面</view>
							</view>
						</view>
					</view>
					<view class="title mb30">
						<input placeholder='填写标题会有更多赞噢~' name="title" placeholder-class='placeholder'
							v-model="formData.title" maxlength="20" />
					</view>
					<view class="textarea">
						<textarea
							:placeholder="formData.type == 1?'分享使用体验和心得，获得更多点赞和关注哦~(600字以内)':'分享使用体验和心得，获得更多点赞和关注哦~(200字以内)'"
							auto-height name="comment" placeholder-class='placeholder' v-model="formData.content"
							:maxlength="formData.type == 1?'600':'200'"></textarea>
						<view class="discoverlist acea-row mt-10">
							<view v-for="(item, index) in discoverTopicList" :key="item.id"
								class="list mr-12 font-color">
								<text class="icon iconfont icon-huati"></text>{{item.name}}
							</view>
						</view>
					</view>
					<view @click="addTopic" class="flex flex-wrap mt-120">
						<view class="h-52 px-16 rd-30rpx border-eee flex-center fs-24">
							<span class="line-heightOne">#话题</span>
						</view>
					</view>
				</view>
			</view>
			<view class="release_content">
				<view class="release_item" style="padding: 0 24rpx;">
					<view class='item acea-row row-between-wrapper' @click.stop="addProduct">
						<view class='name color28'><text
								class="iconfont icon-tianjiabaobei"></text>添加宝贝({{productList.length}})
						</view>
						<view class="select">
							<view class="select_count">
								<text v-if="productList.length == 0" class="text">请选择</text>
								<view v-else class="text">
									<image class="image" v-for="(item,index) in productList" :key="index"
										:src="item.image || item.productImage"></image>
								</view>
								<text class="iconfont icon-xiangyou"></text>
							</view>
						</view>
					</view>
					<view class='item acea-row row-between-wrapper'>
						<view class='name color28'><text class="iconfont icon-neirongfenlei"></text>内容分类
						</view>
						<view class="select">
							<view class="select_count">
								<picker class="pickerIpt" @change="bindSexChange" :value="sexindex"
									:range="categoryList" range-key="name">
									<text v-if="!categoryName" class="text">请选择</text>
									<view class="uni-input color28 text">{{categoryName}}</view>
								</picker>
								<text @change="bindSexChange" class="iconfont icon-xiangyou"></text>
							</view>
						</view>
					</view>
					<view v-if="!replyPlatformSwitch" class='item acea-row row-between-wrapper'>
						<view class='name color28'>总平台禁止评论</view>
					</view>
					<view v-else class='item acea-row row-between-wrapper'>
						<view class='name color28'><text class="iconfont icon-pinglun3"></text>是否禁止评论</view>
						<view class="select">
							<switch @change="switch1Change" :checked="replyStatus" :color="indicatorBg"
								style="transform:scale(0.7)" />
						</view>
					</view>
				</view>
			</view>
			<button class="release_btn button" form-type="submit">发布</button>
		</form>
		<!-- 商品列表 -->
		<tui-bottom-popup class="topic" :zIndex="1002" :maskZIndex="1001" :show="popupShow" @close="popup">
			<associated-product v-if="popupShow" :checkedObj="productList" @getProduct="getProduct"
				@close="popup"></associated-product>
		</tui-bottom-popup>
		<!-- 话题列表 -->
		<tui-bottom-popup class="topic" :zIndex="1002" :maskZIndex="1001" :show="topicShow" @close="popupTopic">
			<discover-topic v-if="topicShow" @onClose="popupTopic"></discover-topic>
		</tui-bottom-popup>

		<!--视频预览弹窗-->
		<tui-bottom-popup class="topic" :zIndex="1002" :maskZIndex="1001" :show="showVideo" @close="showVideo=false">
			<view v-if="showVideo" class="video-count">
				<!--#ifndef APP-PLUS-->
				<video id="myVideo" class="videoLink" autoplay loop muted :src="formData.video"></video>
				<!--#endif-->
				<!--#ifdef APP-PLUS-->
				<view v-html="videoHtml"></view>
				<!--#endif-->

			</view>
		</tui-bottom-popup>
	</view>
</template>

<script>
	// #ifdef MP
	import {
		base64src
	} from '@/utils/base64src.js'
	// #endif
	import {
		mapGetters
	} from "vuex";
	import {
		setThemeColor
	} from '@/utils/setTheme.js'
	import {
		noteDetailApi,
		communityCategoryListApi,
		noteUpdateApi,
		noteAddApi,
		replyPlatformSwitchApi
	} from '@/api/discover.js';
	import {
		Debounce
	} from '@/utils/validate.js';
	import {
		HTTP_REQUEST_URL
	} from '@/config/app.js';
	import tuiBottomPopup from "../components/tui-bottom-popup.vue"
	import associatedProduct from "../components/associatedProduct.vue"
	import easyLoadimage from '@/components/base/easy-loadimage.vue';
	import discoverTopic from '../components/discover_topic.vue';
	let app = getApp();
	export default {
		components: {
			tuiBottomPopup,
			associatedProduct,
			easyLoadimage,
			discoverTopic
		},
		computed: {
			...mapGetters(['discoverTopic']),
			videoHtml: function() {
				return `<video  autoplay loop muted controls="controls" width="100%" height="870px"><source src="${this.formData.video}" type="video/mp4"></video>`;
			}
		},
		data() {
			return {
				topicShow: false,
				popupShow: false,
				theme: app.globalData.theme,
				image: [], //图片集合
				cover: '', //视频第一帧作为封面
				filesLen: 0,
				exceeded_list: [],
				uploadMaxSize: 50, //上传图片大小限制
				formData: {
					categoryId: 0,
					image: "",
					content: "",
					cover: '',
					topicIds: "",
					proIds: "",
					video: '',
					id: 0,
					replyStatus: 1,
					title: "",
					type: 1 //1图文，2视频
				},
				productList: [], //商品
				topicList: [], //话题
				noteId: 0, //内容id
				sexindex: 0, //分类索引
				categoryName: '', //分类名称
				categoryList: [], //逛逛分类
				indicatorBg: '#e93323',
				discoverTopicList: [], //选中的话题列表
				replyStatus: false, //开关
				showVideo: false, //预览视频弹窗
				replyPlatformSwitch: false, //评论总开关状态,true开启，false关闭
				videoContext: ''
			}
		},
		onShow() {
			this.getReplyPlatformSwitch();
		},
		mounted() {
			// #ifndef APP-PLUS
			this.videoContext = uni.createVideoContext('myVideo', this);
			// #endif
		},
		onLoad(options) {
			this.discoverTopicList = [];
			this.$store.commit('DiscoverTopic', this.discoverTopicList);
			this.indicatorBg = setThemeColor();
			this.noteId = options.noteId ? Number(options.noteId) : 0;
			if (this.noteId > 0) this.getDetail();
			this.getCommunityCategoryList();
			this.videoContext = uni.createVideoContext("myvideo", this);
		},
		// 滚动监听
		onPageScroll(e) {
			// 传入scrollTop值并触发所有easy-loadimage组件下的滚动监听事件
			uni.$emit('scroll');
		},
		methods: {
			/*更换封面*/
			onChangeCover(item) {
				uni.showLoading({
					title: '加载中',
					mask: true
				})
				setTimeout(() => {
					this.image.map(items => {
						items.isCover = false
					})
					this.$set(item, 'isCover', true);
					uni.hideLoading();
				}, 500);

			},
			/*获取评论总开关状态*/
			getReplyPlatformSwitch() {
				replyPlatformSwitchApi().then(res => {
					this.replyPlatformSwitch = res.data == 1 ? true : false;
				})
			},
			/*查看视频*/
			videoshow() {
				this.showVideo = true
				this.videoContext = uni.createVideoContext('myVideo', this);
				this.$nextTick(() => {
					this.videoContext.play();
				})
			},
			//开关
			switch1Change: function(e) {
				this.formData.replyStatus = e.detail.value ? 2 : 1;
			},
			//分类列表
			getCommunityCategoryList() {
				communityCategoryListApi().then(res => {
					this.categoryList = res.data;
				})
			},
			//选择分类
			bindSexChange(e) {
				this.sexindex = e.detail.value;
				this.formData.categoryId = this.categoryList[this.sexindex].id;
				this.categoryName = this.categoryList[this.sexindex].name;
			},
			/*获取图文详情*/
			getDetail() {
				noteDetailApi(this.noteId).then(res => {
					this.formData = res.data;
					this.productList = res.data.productList || [];
					this.topicList = res.data.topicList || [];
					//视频2 图文1
					if (this.formData.type === 2) {
						this.image = [{
							url: res.data.cover,
							isCover: true
						}];
					} else {
						let images = res.data.image ? res.data.image.split(',') : [];
						let index = images.findIndex(item => {
							if (item === this.formData.cover) {
								return true
							}
						});
						images.map(item => {
							this.image.push({
								isCover: false,
								url: item
							})
						})
						this.$set(this.image[index], 'isCover', true);
					}
					this.discoverTopicList = res.data.topicList || [];
					this.$store.commit('DiscoverTopic', this.discoverTopicList);
					this.replyStatus = this.formData.replyStatus == 2 ? true : false;
					this.categoryName = this.formData.categoryName;
					this.sexindex = this.formData.categoryId;
				}).catch(err => {
					return this.$util.Tips({
						title: err
					});
				})
			},
			/*删除话题*/
			onDel(i) {
				this.discoverTopicList.splice(i, 1);
				this.$store.commit('DiscoverTopic', this.discoverTopicList);
			},
			/*参与话题*/
			addTopic() {
				this.topicShow = true;
			},
			popup() {
				this.popupShow = false;
			},
			popupTopic() {
				this.topicShow = false;
				this.discoverTopicList = [...this.discoverTopic]
			},
			/*添加宝贝*/
			addProduct() {
				this.popupShow = true;
			},
			// 上传
			upload(name, n) {
				if (name === 'image') {
					this.formData.type = 1
					this.getImage();
				} else {
					this.formData.type = 2
					n === 1 ? this.getVideo() : this.getImage();
				}
			},
			//传图片
			getImage() {
				this.$util.uploadImageOne({
					name: 'multipart',
					model: "product",
					pid: 1,
					count: 9
				}, res => {
					let data = []
					res.map(item => {
						data.push({
							isCover: false,
							url: item
						})
					})
					this.image = [...this.image, ...data];
					if (this.image && this.image.length) this.image[0].isCover = true;

				});
			},
			//传视频
			getVideo() {
				this.$util.uploadVideo({
					name: 'multipart',
					model: "product",
					pid: 1,
				}, async res => {
					this.formData.video = res.fils;
					// #ifdef H5
					this.image = [{
						url: res.coverURL,
						isCover: true
					}];
					// #endif

				});
			},
			/**删除图片*/
			DelPic(index) {
				this.image.splice(index, 1);
			},
			/*获取选中的宝贝*/
			getProduct(data) {
				this.productList = data;
				this.popupShow = false;
			},
			/**
			 * 提交数据
			 */
			formSubmit: Debounce(function(e) {
				let that = this;
				// if (that.image.length == 0) return that.$util.Tips({
				// 	title: '请添加内容图片'
				// });
				if (that.formData.type == 2 && !that.formData.video) {
					return that.$util.Tips({
						title: '请添加内容视频'
					});
				}
				if (!that.formData.categoryId) return that.$util.Tips({
					title: '请选择内容分类'
				});
				if (this.formData.type == 1) {
					let images = [];
					this.image.map(item => {
						images.push(item.url)
					});
					this.formData.image = images.join(',');
					let index = this.image.findIndex(item => {
						if (item.isCover) {
							return true
						}
					});
					if (this.image.length) this.formData.cover = this.image[index].url;

				} else {
					if (this.image.length > 0) {
						this.formData.cover = this.image[0].url;
					} else {
						this.formData.cover = this.cover;
					}

				}
				this.formData.proIds = this.productList.map(val => val.productId).join(',');

				this.formData.topicIds = this.discoverTopicList.map(val => val.id).join(',');



				if (!that.formData.cover) return that.$util.Tips({
					title: '请上传封面图'
				});


				uni.showLoading({
					title: '保存中',
					mask: true
				})
				that.noteId ? noteUpdateApi(that.formData).then(res => {
					uni.hideLoading()
					that.$util.Tips({
						title: '提交成功',
						icon: 'success'
					});
					setTimeout(function() {
						uni.redirectTo({
							url: '/pages/discover/discover_user/index'
						})
					}, 500);
				}).catch(err => {
					uni.hideLoading()
					return that.$util.Tips({
						title: err
					});
				}) : noteAddApi(that.formData).then(res => {
					that.$util.Tips({
						title: '提交成功',
						icon: 'success'
					});
					uni.hideLoading()
					setTimeout(function() {
						uni.redirectTo({
							url: '/pages/discover/discover_user/index'
						})
					}, 500);
				}).catch(err => {
					uni.hideLoading()
					return that.$util.Tips({
						title: err
					});
				})
			})
		}
	}
</script>

<style lang="scss" scoped>
	.pickerIpt {
		width: 300rpx;
	}

	.icon-huati {
		font-size: 24rpx;
	}

	.icon-guanbi5 {
		font-size: 20rpx;
	}

	.discover {
		padding-bottom: env(safe-area-inset-bottom); ///兼容 IOS>11.2/ */
		padding-bottom: constant(safe-area-inset-bottom) !important; ///兼容 IOS<11.2/

	}

	.topic {
		/deep/.tui-popup-class {
			height: 95% !important;
		}
	}

	.discoverlist {
		.list {
			// height: 62rpx;
			// line-height: 62rpx;
			// border-radius: 31rpx;
			@include main_color(theme);
			border: none;
			font-size: 24rpx;

			.icon {
				margin-right: 2rpx;
			}
		}
	}

	.crop_btn {
		line-height: 90rpx;
		height: 90rpx;
		height: calc(90rpx+ constant(safe-area-inset-bottom)); ///兼容 IOS<11.2/
		height: calc(90rpx + env(safe-area-inset-bottom)); ///兼容 IOS>11.2/
	}

	.container {
		position: fixed;
		top: 0;
		left: 0;
		z-index: 20;
		width: 750rpx;
		height: 100vh;
	}

	.release_content {
		margin-top: 20rpx;

		.release_tab {
			border-radius: 16rpx 16rpx 0 0;
			border-bottom: 1rpx solid #E4E4E4;
			background: #fff;
			align-items: center;
			justify-content: center;
			height: 86rpx;

			.tab_item {
				margin: 0 40rpx;
				font-size: 32rpx;
				color: #999;
				position: relative;
				line-height: 86rpx;
				cursor: pointer;

				&.on {
					color: #E93323;

					&::after {
						content: "";
						display: inline-block;
						width: 100%;
						height: 3rpx;
						background: #E93323;
						position: absolute;
						bottom: 2rpx;
						left: 0;
					}
				}

				.iconfont {
					margin-right: 10rpx;
					font-size: 32rpx;
				}
			}
		}

		.release_item {
			background: #ffffff;
			padding: 30rpx;
			border-radius: 10rpx;

		}

		.photo_count {}
	}

	/deep/.input_photo .easy-loadimage,
	/deep/.input_photo uni-image,
	/deep/.input_photo image {
		width: 200rpx;
		height: 200rpx;
		border-radius: 12rpx !important;
	}

	.input_photo .pictrue {
		width: 200rpx;
		height: 200rpx;
		border-radius: 12rpx !important;
		margin-right: 20rpx;
		position: relative;
		overflow: hidden;

		&:nth-child(3n) {
			margin-right: 0;
		}

		.close_btn {
			width: 30rpx;
			height: 30rpx;
			background: rgba(0, 0, 0, .6);
			border-radius: 0 12rpx 0 12rpx;
			position: absolute;
			top: 0;
			right: 0;
			display: flex;
			align-items: center;
			justify-content: center;
			z-index: 10;

			.iconfont {
				color: #ffffff;
				font-size: 12rpx;
			}
		}

		.cover_text {
			display: flex;
			width: 58rpx;
			height: 29rpx;
			background: #E93323;
			border-radius: 0px 12rpx 0px 12rpx;
			position: absolute;
			left: 0;
			bottom: 0;
			z-index: 10;
			align-items: center;
			justify-content: center;
			font-size: 18rpx;
			color: #fff;
		}

		.cover_change {
			width: 200rpx;
			height: 40rpx;
			background: rgba(0, 0, 0, 0.5);
			border-radius: 0px 0px 12rpx 12rpx;
			opacity: 1;
			color: #fff;
			text-align: center;
			font-size: 18rpx;
			position: absolute;
			z-index: 10;
			bottom: 0;
			line-height: 38rpx;
		}
	}

	/deep/.loading-img {
		width: 200rpx;
		height: 200rpx;
		border-radius: 12rpx;
	}

	.input_photo .pictrue {
		margin-bottom: 20rpx;

		.videoHover {
			width: 200rpx;
			height: 200rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			position: absolute;
			top: 0;
			left: 0;
			z-index: 10;

			>view {
				width: 50rpx;
				height: 50rpx;
				background: #000000;
				border-radius: 50rpx;
				display: flex;
				align-items: center;
				justify-content: center;

				.iconfont {
					color: #ffffff;
					font-size: 21rpx;
				}
			}
		}

		.video-text {
			display: block;
			width: 200rpx;
			text-align: center;
			color: #ffffff;
			font-size: 18rpx;
			z-index: 13;
			position: absolute;
			bottom: 20rpx;
		}

		video {
			width: 200rpx;
			height: 200rpx;
			border-radius: 12rpx;
		}
	}

	.input_photo .add {
		background: #f6f6f6;
		color: #666666;

		.iconfont {
			font-size: 50rpx;
		}

		.text {
			margin-top: 20rpx;
			font-size: 27rpx;
		}
	}

	.textarea {
		padding-top: 30rpx;
		border-top: 1px solid #EEEEEE;
		// min-height: 120rpx;

		textarea {
			font-size: 28rpx;
			width: 100%;
			box-sizing: border-box;
			// overflow: hidden;

		}
	}

	.title {
		font-size: 30rpx !important;
		margin-top: 20rpx;

		.placeholder {
			font-size: 30rpx !important;
		}
	}

	.textarea .placeholder,
	.title .placeholder {
		color: #999999;
		overflow: auto !important;
	}

	.release_item .item {
		height: 106rpx;
		border-bottom: 1rpx solid #eee;
		position: relative;
		font-size: 30rpx;

		&:nth-child(3) {
			height: auto;
			padding: 30rpx 0 10rpx;
		}

		&:last-child {
			border-bottom: none;
		}

		.name {
			.iconfont {
				margin-right: 20rpx;
				font-size: 32rpx;
			}
		}

		.select {
			// width: 300rpx;
			color: #bbbbbb;
			text-align: right;

			.select_count {
				display: flex;
				align-items: center;
				justify-content: flex-end;
			}

			.text {
				margin-right: 15rpx;
				text-align: right;

				.image,
				image,
				uni-image {
					width: 60rpx;
					height: 60rpx;
					border-radius: 6rpx;
					overflow: hidden;
					margin-right: 10rpx;
				}
			}

			.iconfont {
				font-size: 24rpx;
			}

			.text_name {
				color: var(--view-theme);
				padding: 5rpx 12rpx;
				background: var(--view-minorColor);
				border-radius: 23rpx;
				font-size: 24rpx;
				margin-right: 10rpx;

				.icon {
					color: var(--view-theme);
					font-weight: bold;
					font-size: 24rpx;
				}

				.title {
					margin: 0 10rpx;
				}

				.iconfont {
					font-size: 16rpx;
				}
			}
		}
	}

	.button {
		width: 710rpx;
		height: 86rpx;
		line-height: 84rpx;
		color: #ffffff;
		text-align: center;
		font-size: 32rpx;
		@include main_bg_color(theme);
		border-radius: 43rpx;
	}

	.release_btn {
		position: fixed;
		bottom: 30rpx;
		padding-bottom: constant(safe-area-inset-bottom); ///兼容 IOS<11.2/
		padding-bottom: env(safe-area-inset-bottom); ///兼容 IOS>11.2/
	}

	.video-count {
		position: fixed;
		width: 600rpx;
		height: 500rpx;
		top: 50%;
		left: 50%;
		margin-left: -300rpx;
		margin-top: -250rpx;
		z-index: 100;
		display: flex;
		align-items: center;
		justify-content: center;

		.videoLink {
			width: 600rpx;
			height: 500rpx;
		}
	}
</style>