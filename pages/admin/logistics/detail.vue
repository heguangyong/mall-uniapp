<template>
	<view>
		<view class="w-full header_bg" :style="{'height': (174 + sysHeight) * 2 + 'rpx'}">
			<view class="w-full abs-lb white_jianbian"></view>
		</view>
		<!-- #ifdef MP -->
		<NavBar titleText="发货记录" :iconColor="iconColor" :textColor="iconColor" :isScrolling="isScrolling" showBack></NavBar>
		<!-- #endif -->
		<view class="relative px-20 z-20 express_box">
			<view class="h-66 b-r-16rpx light px-24 flex-between-center fs-22">
				<text>{{orderInfo.expName}} {{orderInfo.number}}</text>
				<text class="inline-block copy_btn fs-22 text--w111-333" @tap="copyOrderId">复制单号</text>
			</view>
		</view>
		<view class="px-20 mt-20 relative">
			<view class="bg--w111-fff rd-16rpx pt-32 pr-24 pl-24 pb-32">
				<view class="flex-between-center">
					<view class="fs-32 fw-500 text--w111-333">
						<text>物流详情</text>
					</view>
				</view>
				<view class="logisticsCon mt-50 relative" v-if="expressList.length">
					<view class='item' v-for="(item,index) in logisticList" :key="index">
						<view class='circular' :class='index === 0 ? "on text-center":""'>
							<text class="iconfont icon-a-ic_CompleteSelect text--w111-fff fs-24" v-if="index == 0"></text>
						</view>
						<view class='text' :class='index===0 ? "on-font on":""'>
							<view>{{item.status}}</view>
							<view class='data' :class='index===0 ? "on-font on":""'>{{item.time}}</view>
						</view>
					</view>
					<view class="more-text fs-24" @tap="checkShowMore">
						<text>{{showMore ? '收起' : '查看更多物流信息'}}</text>
						<text class="iconfont fs-24 pl-8" :class="showMore ? 'icon-ic_uparrow' : 'icon-ic_downarrow'"></text>
					</view>
				</view>
				<emptyPage title="暂无物流信息" :imgSrc="urlDomain+'crmebimage/presets/nowuliu.png'" v-else></emptyPage>
			</view>
			<view class="safe-area-inset-bottom"></view>
		</view>
	</view>
</template>

<script>
	let sysHeight = uni.getSystemInfoSync().statusBarHeight;
	import {
		express
	} from '@/api/order.js';
	import ClipboardJS from "@/plugin/clipboard/clipboard.js";
	import {
		toLogin
	} from '@/libs/login.js';
	import {
		mapGetters
	} from "vuex";
	import {
		HTTP_REQUEST_URL
	} from '@/config/app';
	// #ifdef MP
	import NavBar from '../components/NavBar.vue'
	// #endif
	import emptyPage from '@/components/emptyPage.vue'
	export default {
		components: {
			// #ifdef MP
			NavBar,
			// #endif
			emptyPage,
		},
		data() {
			return {
        urlDomain: this.$Cache.get("imgHost"),
				sysHeight: sysHeight,
				imgHost: HTTP_REQUEST_URL,
				orderId: '',
				type: '',
				product: [],
				orderInfo: {},
				expressList: [],
				hostProduct: [],
				isShowAuth: false,
				pageScrollStatus: false,
				showMore: true,
				// #ifdef MP
				iconColor: '#FFFFFF',
				isScrolling: false,
				// #endif
			};
		},
		computed: {
			...mapGetters(['isLogin']),
			logisticList() {
				if (this.showMore) {
					return this.expressList
				} else {
					return this.expressList.slice(0, 1)
				}
			}
		},
		watch: {
			isLogin: {
				handler: function(newV, oldV) {
					if (newV) {
						//#ifndef MP
						this.getExpress();
						// this.get_host_product();
						//#endif
					}
				},
				deep: true
			}
		},
		onLoad: function(options) {
			this.orderId = options.invoiceId;
			if (this.isLogin) {
				this.getExpress();
			}
		},
		onReady: function() {
			// #ifdef H5
			this.$nextTick(function() {
				const clipboard = new ClipboardJS(".copy-data");
				clipboard.on("success", () => {
					this.$util.Tips({
						title: '复制成功'
					});
				});
			});
			// #endif
		},
		onPageScroll(object) {
			if (object.scrollTop > 100) {
				this.pageScrollStatus = true;
			} else if (object.scrollTop < 100) {
				this.pageScrollStatus = false;
			}
			// #ifdef MP
			if (object.scrollTop > 50) {
				this.isScrolling = true;
				this.iconColor = '#333333';
			} else if (object.scrollTop < 50) {
				this.isScrolling = false;
				this.iconColor = '#FFFFFF';
			}
			// #endif
			uni.$emit('scroll');
		},
		onShow() {
			if (!this.isLogin) {
				toLogin()
			}
		},
		methods: {
			// 授权关闭
			authColse: function(e) {
				this.isShowAuth = e
			},
			/**
			 * 授权回调
			 */
			onLoadFun: function() {
				this.getExpress();
				this.isShowAuth = false;
			},
			copyOrderId: function() {
				uni.setClipboardData({
					data: this.orderInfo.number
				});
			},
			getExpress: function() {
				let that = this;
				express(that.orderId).then(function(res) {
					that.$set(that, 'orderInfo', res.data);
					that.$set(that, 'expressList', res.data.list || []);
				}).catch((error) => {
					this.$util.Tips({
						title: error
					});
				});
			},
			checkShowMore() {
				this.showMore = !this.showMore
			},
			goPage(type, url) {
				if (type == 1) {
					uni.navigateTo({
						url
					})
				} else if (type == 2) {
					uni.switchTab({
						url
					})
				} else if (type == 3) {
					uni.navigateBack();
				}

			},
		}
	}
</script>

<style scoped lang="scss">
	.safe-area-inset-bottom {
		height: calc(100rpx+ constant(safe-area-inset-bottom)); ///兼容 IOS<11.2/
		height: calc(100rpx + env(safe-area-inset-bottom)); ///兼容 IOS>11.2/
		padding-bottom: calc(0rpx+ constant(safe-area-inset-bottom)); ///兼容 IOS<11.2/
		padding-bottom: calc(0rpx + env(safe-area-inset-bottom)); ///兼容 IOS>11.2/
	}

	.header_bg {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 369rpx;
		background: linear-gradient(270deg, #01ABF8 0%, #2A7EFB 100%);
	}

	.white_jianbian {
		height: 180rpx;
		background: linear-gradient(0deg, #F5F5F5 0%, rgba(245, 245, 245, 0) 100%);
	}

	.light {
		background: rgba(255, 255, 255, 0.9);
	}

	.express_box {
		padding-top: 30rpx;
	}

	.copy_btn {
		width: 112rpx;
		height: 34rpx;
		background: #fff;
		border-radius: 20rpx;
		text-align: center;
		line-height: 34rpx;
	}

	.city-box {
		&:before {
			content: '';
			width: 1px;
			height: 64rpx;
			background-color: #eee;
			position: absolute;
			top: 40rpx;
			left: 0;
		}
	}

	.more-text {
		position: absolute;
		left: 40rpx;
		bottom: -12rpx;

		&:before {
			content: '';
			width: 14rpx;
			height: 14rpx;
			border-radius: 50%;
			background-color: #ddd;
			position: absolute;
			left: -26rpx;
			top: 8rpx;
		}
	}

	.logisticsCon .item {
		padding: 0 20rpx;
		position: relative;
	}

	.logisticsCon .item .circular {
		width: 14rpx;
		height: 14rpx;
		border-radius: 50%;
		position: absolute;
		left: 15rpx;
		background-color: #ddd;
	}

	.logisticsCon .item .circular.on {
		width: 0;
		height: 0;
		left: 6rpx;
		.icon-a-ic_CompleteSelect{
			color: #2A7EFB;
		}
	}

	.logisticsCon .item .text {
		font-size: 26rpx;
		color: #666;
		width: 615rpx;
		border-left: 1rpx solid #e6e6e6;
		padding: 0 0 40rpx 38rpx;
	}

	.logisticsCon .item .text .data {
		font-size: 24rpx;
		color: #999;
		margin-top: 10rpx;
	}

	.logisticsCon .item .text .data .time {
		margin-left: 15rpx;
	}

	.z-99 {
		z-index: 99;
	}
	.b-r-16rpx{
		border-radius: 16rpx;
	}
	.product~.product {
		margin-top: 20rpx;
	}
</style>