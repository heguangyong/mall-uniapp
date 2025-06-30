<template>
	<view class="record-box">
		<!-- #ifdef MP||APP-PLUS -->
		<view class="w-full header_bg" :style="{'height': (120 + sysHeight) * 2 + 'rpx'}">
			<view class="w-full abs-lb white_jianbian"></view>
		</view>
		<!-- #endif -->
		<!-- #ifdef H5 -->
		<view class="w-full header_bg" :style="{'height': (100 + sysHeight) * 2 + 'rpx'}">
			<view class="w-full abs-lb white_jianbian"></view>
		</view>
		<!-- #endif -->
		<!-- #ifdef MP -->
		<NavBar titleText="发货记录" :iconColor="iconColor" :textColor="iconColor" :isScrolling="isScrolling" showBack></NavBar>
		<!-- #endif -->
		<view class="product-box">
			<view class="acea-row productInfo-box">
				<view class="acea-row productInfo-item" v-for="(item,index) in productInfo" :key="index">
					<span class="num">x{{item.num}}</span>
					<image class="wrapper-img" :src="item.image" mode=""></image>
					<view class="acea-row row-column-between ml20">
						<view class="line1 line1-width f-s-28">
							{{item.productName}}
						</view>
						<view class="f-s-24 line1-width line2 color-999">
							{{item.sku}}
						</view>
					</view>
				</view>
			</view>
			<view class="info-box pos-rel">
				<view class="item acea-row row-between">
					<view>发货方式</view>
					<view v-if="!secodeType">{{deliveryInfo.deliveryType=='merchant'?'商家送货':'无需发货'}}</view>
					<view v-if="secodeType">虚拟发货</view>
				</view>
				<view class="item acea-row row-between" v-if="deliveryInfo.deliveryType=='noNeed'">
					<view>发货备注</view>
					<view class="text-width">{{deliveryInfo.deliveryMark}}</view>
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
		<view class="footer">
			<view class="update" @click="toUpdate">编辑</view>
		</view>
	</view>
</template>

<script>
	import {
		orderInvoiceListInfo
	} from '@/api/order.js';
	// #ifdef MP
	import NavBar from '../components/NavBar.vue'
	// #endif
	let sysHeight = uni.getSystemInfoSync().statusBarHeight;
	export default{
		components: {
			// #ifdef MP
			NavBar,
			// #endif
		},
		data(){
			return{
				sysHeight: sysHeight,
				// #ifdef MP
				iconColor: '#FFFFFF',
				isScrolling: false,
				// #endif
				pageScrollStatus: false,
				productInfo:[],
				deliveryInfo:{},
				orderNo:'',
				index:'',
				secodeType:null,
			}
		},
		onLoad(options) {
			this.orderNo=options.orderNo
			this.index=options.index
			this.secodeType=options.secodeType
			this.getInfo(options.orderNo,options.index)
		},
		methods:{
			//编辑配送信息
			toUpdate(){
				uni.redirectTo({
					url:`/pages/admin/order/send?orderNo=${this.orderNo}&type=2&index=${this.index}`
				})
			},
			getInfo(orderNo,index){
				orderInvoiceListInfo(orderNo).then(res=>{
					this.deliveryInfo=res.data.invoiceList[index]
					this.productInfo=res.data.invoiceList[index]['detailList']
				})
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
		}
	}
</script>

<style lang="scss" scoped>
	.header_bg {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 369rpx;
		background: linear-gradient(270deg, #01ABF8 0%, #2A7EFB 100%);
	}
	
	.white_jianbian {
		height: 160rpx;
		background: linear-gradient(0deg, #F5F5F5 0%, rgba(245, 245, 245, 0) 100%);
	}
	.wrapper-img {
		display: inline-block;
		margin-right: 10rpx;
	}
	.color-999{
		color: #999;
	}
	.f-s-28{
		font-size: 28rpx;
	}
	.record-box{
		overflow: hidden;
		padding-bottom: 200rpx;
		.product-box{
			padding: 0 24rpx;
			/* #ifdef H5 */
			margin-top: 100rpx;
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
			height: calc(100rpx + constant(safe-area-inset-bottom)); ///兼容 IOS<11.2/
			height: calc(100rpx + env(safe-area-inset-bottom)); ///兼容 IOS>11.2/
			padding-bottom: calc(0rpx + constant(safe-area-inset-bottom)); ///兼容 IOS<11.2/
			padding-bottom: calc(0rpx + env(safe-area-inset-bottom)); ///兼容 IOS>11.2/
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