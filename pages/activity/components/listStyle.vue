<template>
	<view :data-theme="theme">
		<!--  #ifdef  H5 -->
		<view class="w-full bg-top h-604 relative" :style="{backgroundImage:headerBg}">
		<!--  #endif -->
			<!--  #ifndef  H5 -->
			<view class="w-full bg-top relative"
				:style="{backgroundImage:headerBg,height: (sysHeight + 262) * 2 + 'rpx'}">
			<!--  #endif -->
			</view>
			<view class="relative w-full content">
				<view class="_box h-106 flex-y-center" :class="pageScrollStatus ? '' : 'rd-t-24rpx'"
					:style="{'top': 50 + sysHeight + 'px'}">
					<scroll-view scroll-x="true" style="white-space: nowrap;" scroll-with-animation
						class="white-nowrap vertical-middle w-full relative z-10"
						:class="{'sel1':active == 0,'sel-last': timeLine.length > 4 && active == timeLine.length - 1}"
						show-scrollbar="false" :scroll-left="tabLeft">
						<view class="scroll-item" v-for="(item,index) in timeLine" :key='index'
							:class="active == index ? 'active-card' : ''"
							:style="{'background-image': active == index ? navActiveBg : ''}"
							@tap='checkSeckill(index,item)'>
							<view class="flex-col flex-center z-10 relative t-22">
								<text class="SemiBold fs-40 lh-40rpx semiBold"
									:class="active == index ? 'text--w111-333':'text--w111-fff'">{{item.startTime}}</text>
								<text class="inline-block h-36 lh-34rpx fs-24"
									:class="active == index ? 'red-tag':'text--w111-fff'">{{item.status | timeStatusFilter}}</text>
							</view>
						</view>
					</scroll-view>
					<view class="abs-lb w-full"
						:style="{'background': pageScrollStatus ? '#e93323' : 'rgba(245,245,245,0.2)','height': pageScrollStatus ? '130rpx' : '96rpx'}">
					</view>
				</view>
				<view class="bg--w111-f5f5f5 pt-32 pl-20 pr-20 relative">
					<view class="card w-full bg--w111-fff rd-24rpx p-20 flex" v-for="(item,index) in seckillList"
						:key="index" @tap='goDetail(item.id)'>
						<view class="w-240 h-240">
							<easy-loadimage mode="aspectFit" :image-src="item.image" :border-src="item.image"
								width="240rpx" height="240rpx" :radius="10"></easy-loadimage>
						</view>
						<view class="flex-1 pl-20 flex-col justify-between">
							<view class="w-full">
								<view class="w-410 fs-28 lh-40rpx line2">
									<text v-if="item.isSelf" class="font-bg-red bt-color mr10 self_min merType bg-red">自营</text>
									{{item.name}}
								</view>
							</view>
							<view class="flex items-baseline">
								<text class="fs-22 lh-30rpx text-primary pr-8">秒杀价:</text>
								<baseMoney :money="item.seckillPrice" symbolSize="24" integerSize="40" decimalSize="24"
									incolor="E93323" weight></baseMoney>
								<text class="fs-22 lh-30rpx text--w111-999 pl-16 text-line regular">¥{{item.price}}</text>
							</view>
							<view class="w-full progress-box flex-between-center" v-if="status == 1">
								<view class="flex-y-center">
									<view class="progress ml-16">
										<view class="active" :style="'width:'+item.payRange"></view>
									</view>
									<text class="fs-22 text-primary pl-8">已抢{{item.payRange}}</text>
								</view>
								<view class="qiang"></view>
							</view>
							<view class="w-full yuyue-box flex-between-center" v-if="status == 2 || status ==3">
								<view class="flex-y-center fs-22 pl-16">活动即将开始</view>
								<view class="yuyue"></view>
							</view>
							<view class="w-full over-box flex-between-center" v-if="status == 0">
								<view class="flex-y-center fs-22 pl-16">活动已结束</view>
								<view class="over"></view>
							</view>
						</view>
					</view>
					<view class="abs-lt cir" v-show="active > 0"></view>
				</view>
				<view class="bg--w111-f5f5f5 p-20" v-if="!seckillList.length && !loading">
					<emptyPage title="暂无秒杀商品，去看看其他商品吧～" :imgSrc="urlDomain+'crmebimage/presets/noShopper.png'">
					</emptyPage>
				</view>
			</view>
		</view>
</template>

<script>
	import emptyPage from '@/components/emptyPage.vue';
	import easyLoadimage from '@/components/base/easy-loadimage.vue'
	import {
		goProductDetail
	} from "@/libs/order";
	let sysHeight = uni.getWindowInfo() ? uni.getWindowInfo().statusBarHeight : '';
	let app = getApp();
	export default {
		name: 'ListStyle',
		components: {
			emptyPage,
			easyLoadimage
		},
		props: {
			//秒杀商品列表
			seckillList: {
				type: Array,
				default: function() {
					return [];
				}
			},
			timeLine: {
				type: Array,
				default: function() {
					return [];
				}
			},
			loading: {
				type: Boolean,
				default: false
			},
			active: {
				type: Number,
				default: 0
			},
			//控制页面滑动
			pageScrollStatus: {
				type: Boolean,
				default: false
			},
			tabLeft: {
				type: Number,
				default: 0
			},
		},
		data() {
			return {
				theme: app.globalData.theme,
				urlDomain: this.$Cache.get("imgHost"),
				sysHeight: sysHeight,
				scrollLeft: 0,
				status: 1,
			}
		},
		computed: {
			headerBg() {
				return 'url(' + this.urlDomain + 'crmebimage/presets/seckill_header.png' + ')'
			},
			navActiveLeft() {
				if (this.active == 0) {
					return 0
				} else if (this.active == 1) {
					return '134rpx'
				} else {
					return 154 * this.active + 'rpx'
				}
			},
			navActiveBg() {
				if (this.active == 0) {
					return 'url(' + this.urlDomain + 'crmebimage/presets/seckill_header_icon1.png' + ')'
				} else {
					return 'url(' + this.urlDomain + 'crmebimage/presets/seckill_header_icon2.png' + ')'
				}
			}
		},

		methods: {
			checkSeckill(index, item) {
				this.$emit('getCheckSeckill', index, item);
			},
			/*
			 *去商品详情页 
			 */
			goDetail(id) {
				goProductDetail(id, 1, `&status=${this.status}&datatime=${this.datatime}`)
			},
		},
	}
</script>

<style lang="scss" scoped>
  .bg-top{
      background-size: 100% 100%;
      background-repeat: no-repeat;
  }
  .sticky{
      &:after{
          content:'';
          width:100%;
          height: 20px;
          background-color: #E93323;
          position: absolute;
          left: 0;
          bottom: -20rpx;
      }
  }
  .content{
      top: -114rpx;
  }
  ._box{
      position: sticky;
      z-index: 99;
  }
  .card ~ .card{
      margin-top: 20rpx;
  }
  .w-21-p111-{
      width: 21%;
  }
  .max-w-96{
      max-width: 96rpx;
  }
  .fq{
      background-color: #E93323;
      color: #fff;
  }
  .text-primary{
      color: #E93323;;
  }
  .text-line{
      text-decoration: line-through;
  }
  .progress-box{
      height: 64rpx;
      background-color: rgba(233, 51, 35, 0.05);
      border-radius: 16rpx;
  }
  .progress{
     width:160rpx;
      height: 18rpx;
      border-radius: 10rpx;
      background-color: rgba(233, 51, 35, 0.2);
      .active{
          height: 18rpx;
          border-radius: 10rpx;
          background: linear-gradient(90deg, #FF7931 0%, #E93323 100%);
      }
  }
  .qiang{
      width:112rpx;
      height: 64rpx;
      background-image: url('../static/images/qiang.png');
      background-size: cover;
  }
  .yuyue-box{
      height: 64rpx;
      background-color: #FFF1E5;
      border-radius: 16rpx;
      color: #FF7D00;
  }
  .yuyue{
      width:140rpx;
      height: 64rpx;
      background-image: url('../static/images/yuyue.png');
      background-size: cover;
  }
  .over-box{
      height: 64rpx;
      background-color: rgba(233, 51, 35, 0.05);
      border-radius: 16rpx;
      color: rgba(233, 51, 35, 0.60);
  }
  .over{
      width:140rpx;
      height: 64rpx;
      background-image: url('../static/images/over.png');
      background-size: cover;
  }
	.sel1 .scroll-item{
		right: 30rpx;
	}

	.sel-last {
		::v-deep.uni-scroll-view {

			margin-right: -10rpx;
		}

		.scroll-item {
			// left: 40rpx;
			// left: 32rpx;
		}

		.active-card {
			width: 180rpx;
			padding-left: 10px;

			.relative {
				width: 160rpx;
			}
		}
	}
  .scroll-item{
      display: inline-block;
      height: 96rpx;
      width: 21%;
      position: relative;
      bottom: 0;
  }
  .active-card{
      width:234rpx;
      height: 106rpx;
      background-size: cover;
      z-index: 99;
  }
  .t-22{
      top: 22rpx;
  }
  .red-tag{
      display: inline-block;
      padding: 0 12rpx;
      height: 36rpx;
      border-radius: 18rpx;
      text-align: center;
      line-height: 36rpx;
      background-color: #E93323;
      font-size: 22rpx;
      color: #fff;
  }
  .cir{
	  width: 24rpx;
	  height: 24rpx;
	  background-color: #ED593E;
	  &:after{
		  content: '';
		  width: 24rpx;
		  height: 24rpx;
		  position: absolute;
		  left: 0;
		  top: 0;
		  border-top-left-radius: 100%; /* 左上角为半径大小的弧形 */
		  background-color: #f5f5f5;
	  }
  }
  .brand-tag{
  	background-color: #e93323 !important;
  }
</style>