<template>
	<view :data-theme="theme">
		<view class="seckill_header w-full">
			<view :style="{ height: `${navH}rpx` }"></view>
			<view class="scroll_box" :style='{width: mainWidth+"px"}'>
				<scroll-view scroll-x="true" scroll-with-animation style="white-space: nowrap; vertical-align: middle;"
					show-scrollbar="false" :scroll-left="tabLeft">
					<!-- #ifdef APP-PLUS -->
					<!-- <view class="" :style="'width:100%;' + 'height:'+sysHeight"></view> -->
					<!-- #endif -->
					<view class="scroll_box_item">
						<view class="scroll_item" v-for="(item,index) in timeLine" :key="index"
							@click="checkSeckill(index,item)">
							<view class="acea-row row-column row-center row-middle" :style='"width:"+isWidth+"px;"'
								:id='"sort"+index'>
								<text class="header_time f-w-700"
									:class="active == index ? 'active' : ''">{{item.startTime}}</text>
								<text class="header_day f-w-700"
									:class="active == index ? 'active_day' : ''">{{item.status | timeStatusFilter}}</text>
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</view>
		<view class="seckill_box" :style='{ marginTop: listMarTop + "rpx"}'>
			<view class="seckill_desc acea-row row-between row-middle">
				<view class="acea-row row-column">
					<text class="seckill_name"></text>
				</view>
				<view v-if="status>0" class="acea-row datatimeBox">
					<text class="f-s-24 text-right mr10">{{desc}}</text>
					<view class="count_down">
						<countDown :is-day="true" :tip-text="' '" :day-text="' '" :hour-text="' : '"
							:minute-text="' : '" :second-text="' '" :datatime="datatime" :isCol="false"
							:bgColor="bgColor"></countDown>
					</view>
				</view>
			</view>
			<!-- 秒杀商品列表 -->
			<seckill-list :seckillList="seckillList" :loading="loading" :loadTitle="loadTitle" :status="status"
				:datatime="datatime"></seckill-list>
		</view>

	</view>
</template>

<script>
	import {
		mapGetters
	} from "vuex";
	import SeckillList from "../components/SeckillList";
	import countDown from "@/components/countDown";
	import emptyPage from '@/components/emptyPage.vue'
	import {
		setThemeColor
	} from '@/utils/setTheme.js'
	let app = getApp();
	export default {
		name: 'PageStyle',
		components: {
			countDown,
			emptyPage,
			SeckillList,
		},
		props: {
			//秒杀商品列表
			seckillList: {
				type: Array,
				default: function() {
					return [];
				}
			},
			loading: {
				type: Boolean,
				default: false
			},
			loadTitle: {
				type: String,
				default: ''
			},
			status: {
				type: Number,
				default: 1
			},
			// 倒计时时间
			datatime: {
				type: Number,
				default: 0
			},
			active: {
				type: Number,
				default: 0
			},
			mainWidth: {
				type: Number,
				default: 0
			},
			tabLeft: {
				type: Number,
				default: 0
			},
			timeLine: {
				type: Array,
				default: function() {
					return [];
				}
			},
			marTop: {
				type: Number,
				default: 0
			},
			// 倒计时文字
			desc: {
				type: String,
				default: ''
			},
			isWidth: {
				type: Number,
				default: 0
			},
		},
		computed: mapGetters(['globalData']),
		data() {
			return {
				theme: this.$Cache.get("theme"),
				bgColor: {
					'bgColor': '',
					'Color': '#fff',
					'width': '36rpx',
					'timeTxtwidth': '16rpx',
					'isDay': true
				},
				listMarTop: 0,
				navH: '',
			}
		},
		mounted() {
			this.bgColor.bgColor = setThemeColor();
			// #ifdef MP || APP-PLUS
			// 获取导航高度；
			//this.navH = this.globalData.navHeight;
			// 获取页面高度
			uni.getSystemInfo({
				success:(res) => {
					// 获取导航高度；
					this.navH = res.statusBarHeight * (750 / res.windowWidth) + 91;
				}
			});
			// #endif

			this.$nextTick(function() {
				const query = uni.createSelectorQuery().in(this);
				query.select('.scroll_box_item').boundingClientRect(data => {
					// #ifdef MP
					this.listMarTop = this.navH + data.height * 2 + 30 + 20
					// #endif
					// #ifdef APP-PLUS
					this.listMarTop = this.marTop + data.height * 2 + 30 + 20
					// #endif
				}).exec();
			});
		},
		methods: {
			checkSeckill(index, item) {
				this.$emit('getCheckSeckill', index, item)
			},
		}
	}
</script>

<style lang="scss" scoped>
	/deep/.dialog_nav {
		z-index: 9999;
	}

	.mts {
		margin-top: -56rpx;
	}

	.datatimeBox {
		height: 36rpx;
		line-height: 36rpx;
	}

	.friceIcon {
		font-size: 28rpx;
	}

	.futura {
		margin-top: -6rpx;
	}

	.seckill_header {
		background-image: url('../static/images/seckill_bg.jpg');
		background-size: cover;
		top: 0;
		left: 0;
		/* #ifdef H5 */
		height: 210rpx;
		padding-top: 32rpx;
		/* #endif */
		/* #ifndef H5*/
		height: 380rpx;
		/* #endif */
		position: fixed;
		z-index: 2;
	}

	.head-menu {
		display: flex;
		align-items: center;
		height: 54rpx;
		width: 140rpx;
		background: transparent;
		border: 1px solid rgba(151, 151, 151, 0.2);
		border-radius: 27rpx;
		position: relative;

		&:after {
			content: '';
			position: absolute;
			width: 1px;
			height: 26rpx;
			background-color: #EAEAEA;
			left: 50%;
			top: 50%;
			transform: translate(-50%, -50%);
		}

		.iconfont {
			flex: 1;
			text-align: center;
			color: #fff;
			box-sizing: border-box;
		}
	}


	.scroll_box_item {
		width: 100%;
		height: 92rpx;
	}

	.scroll_box {
		height: 104rpx;
	}

	.scroll_item {
		display: inline-block;
		height: 92rpx;
	}

	.header_time {
		font-size: 36rpx;
		color: rgba(255, 255, 255, .4);
		display: inline-block;
		margin-bottom: 10rpx;
		transition: all .3s ease;
		font-family: PingFang SC-中黑体, PingFang SC;
	}

	.active {
		color: #fff;
	}

	.active_day {
		width: 108rpx;
		height: 30rpx;
		line-height: 30rpx;
		text-align: center;
		font-size: 22rpx;
		color: #fff !important;
		@include linear-gradient(theme);
		background-size: contain;
		background-repeat: no-repeat;
	}

	.header_day {
		font-size: 24rpx;
		color: rgba(255, 255, 255, .4);
		font-family: PingFang SC-中黑体, PingFang SC;
	}

	.seckill_box {
		width: 100%;
		background-color: #fff;
		left: 0;
		position: relative;
		/* #ifdef H5 */
		margin-top: 172rpx !important;
		/* #endif */
		/* #ifndef H5 */
		//margin-top: -120rpx;
		/* #endif */
	}

	.seckill_desc {
		background: linear-gradient(360deg, #FFFFFF 0%, #F4F4F4 100%);
		border-radius: 24rpx 24rpx 0px 0px;
		padding: 0 24rpx;
		width: 100%;
		height: 117rpx;
		position: fixed;
		z-index: 2;
	}

	.seckill_name {
		width: 222rpx;
		height: 57rpx;
		background-image: url('../static/images/miaos.png');
		background-size: contain;
		background-repeat: no-repeat;
		padding-bottom: 10rpx;
	}

	.seckill_discount {
		font-size: 32rpx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #AC6926;
	}

	.text-right {
		text-align: right;
	}

	.count_down {}

	/deep/ .is_day {
		font-size: 24rpx;
		font-weight: 500;
		color: #1B1B1B;
	}
</style>