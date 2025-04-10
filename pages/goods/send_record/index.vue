<template>
	<view :data-theme="theme" class="record-box">
		<!-- #ifndef APP-PLUS || MP -->
		<nav-bar navTitle='发货记录' ref="navBarRef"></nav-bar>
		<!-- #endif -->
		<view class="mp-bg"></view>
		<view class="product-box"  @touchstart="touchStart">
			<view class="acea-row productInfo-box">
				<view class="acea-row productInfo-item" v-for="(item,index) in productInfo" :key="index">
					<span class="num">x{{item.num}}</span>
					<image class="wrapper-img" :src="item.image" mode=""></image>
					<view class="acea-row row-column-between ml20">
						<view class="line1 line1-width f-s-28">
							{{item.productName}}
						</view>
						<view class="f-s-24 line1-width color-999 line2">
							{{item.sku}}
						</view>
					</view>
				</view>
			</view>
			<view class="info-box">
				<view class="item acea-row row-between">
					<view>发货方式</view>
					<view>{{deliveryInfo.deliveryType=='merchant'?'商家送货':'无需发货'}}</view>
				</view>
				<view class="item acea-row row-between" v-if="deliveryInfo.deliveryType=='noNeed'">
					<view>发货备注</view>
					<view class="text-width wrap-normal">{{deliveryInfo.deliveryMark}}</view>
				</view>
				<view class="item acea-row row-between" v-if="deliveryInfo.deliveryType=='merchant'">
					<view>配送人员</view>
					<view>{{deliveryInfo.deliveryCarrier}}</view>
				</view>
				<view class="item acea-row row-between" v-if="deliveryInfo.deliveryType=='merchant'">
					<view>手机号码</view>
					<view>{{deliveryInfo.carrierPhone}}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	const app = getApp();
	import navBar from '@/components/navBar';
	import {
		orderInvoiceListInfo
	} from '@/api/order.js';
	import {
		setThemeColor
	} from '@/utils/setTheme.js'
	export default{
		components: {
			navBar,
		},
		data(){
			return{
				theme: app.globalData.theme,
				productInfo:[],
				deliveryInfo:{}
			}
		},
		onShow() {
			let that = this;
			that.bgColor = setThemeColor();
			uni.setNavigationBarColor({
				frontColor: '#ffffff',
				backgroundColor: that.bgColor,
			});
		},
		onLoad(options) {
			this.getInfo(options.orderNo,options.index)
		},
		methods:{
      //滚动
      touchStart() {
        this.$refs.navBarRef.currentPage = false;
      },
			getInfo(orderNo,index){
				orderInvoiceListInfo(orderNo).then(res=>{
					this.deliveryInfo=res.data.invoiceList[index]
					this.productInfo=res.data.invoiceList[index]['detailList']
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	
	/* 让文本在达到容器宽度时自动换行 */
	.wrap-normal {
		align-items: center;
		overflow: hidden;
		word-break: break-all;  /* break-all(允许在单词内换行。) */
		text-overflow: ellipsis;  /* 超出部分省略号 */
		display: -webkit-box; /** 对象作为伸缩盒子模型显示 **/
		-webkit-box-orient: vertical; /** 设置或检索伸缩盒对象的子元素的排列方式 **/
	}
	.mp-bg {
		top: 0;
		position: fixed;
		left: 0;
		/* #ifdef H5 */
		top: 74rpx;
		/* #endif */
		width: 100%;
		height: 120rpx;
		@include index-gradient(theme);
		padding: 30rpx 30rpx 0 30rpx;
		z-index: 99;
	}
	.color-999{
		color: #999;
	}
	.f-s-28{
		font-size: 28rpx;
	}
	.record-box{
		overflow: hidden;
		.product-box{
			padding: 0 24rpx;
			/* #ifdef H5 */
			margin-top: 20rpx;
			/* #endif */
			/* #ifndef H5 */
			margin-top: 50rpx;
			/* #endif */
			.productInfo-box{
				position: relative;
				z-index: 999;
				padding: 24rpx;
				border-radius: 14rpx;
				background: #fff;
				.productInfo-item{
					position: relative;
					padding: 10rpx 0;
					.wrapper-img{
						width: 130rpx;
						height: 130rpx;
					}
					.line1-width{
						width: 450rpx;
					}
					.num{
						position: absolute;
						right: -40rpx;
						top: 10rpx;
						color: #999;
					}
				}
			}
		}
		.info-box{
			padding:24rpx;
			margin-top: 24rpx;
			background: #fff;
			border-radius: 14rpx;
			.text-width{
				width: 400rpx;
				text-align: right;
			}
			.item{
				padding: 20rpx 0;
			}
		}
		.footer{
			width: 100%;
			height: 100rpx;
			position: fixed;
			bottom: 0;
			display: flex;
			align-items: center;
			justify-content: flex-end;
			padding: 0 24rpx;
			background: #fff;
			.update{
				background: #2A7EFB;
				width: 150rpx;
				height: 60rpx;
				border-radius: 30rpx;
				line-height: 60rpx;
				text-align: center;
				color: #fff;
			}
		}
	}
</style>