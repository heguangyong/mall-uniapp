<template>
	<view class="pagebox">
		<view class="after_sale" v-if="info.userRefundSign" @click="skipList(info.orderNo)">
			该订单存在处理中售后，请点击查看
			<text class="iconfont icon-you"></text>
		</view>
		<view class="order_info">
			<view class="order_info_number">
				订单号：{{info.orderNo}}
			</view>
			<view class="order_info_item" v-for="(item,index) in info.infoResponseList">
				<image class="product_img" :src="item.image" mode=""></image>
				<view class="info_text">
					<view class="info_text_top">
						<view class="info_text_title">
							{{item.productName}}
						</view>
						<view class="info_text_sku">
							{{item.sku}}
						</view>
					</view>
					<view class="operate">
						<text class="infor-num">购买 x{{item.payNum}} <text class="infor-text"> {{item.applyRefundNum||item.refundNum?`(${item.applyRefundNum}件售后中 ${item.refundNum}件已退款）`:''}}</text></text>
						<text>核销：<text class="cancel_num">{{item.payNum-item.refundNum}}</text></text>
					</view>
				</view>
			</view>
		</view>
		<view class="page_bottom">
			<view class="page_bottom_num">
				共{{info.totalNum}}件
			</view>
			<view class="page_bottom_btn" @click="toCancel">
				确认核销
			</view>
		</view>
	</view>
</template>

<script>
	import {employeeOrderCancel} from '@/api/work.js'
	export default{
		data(){
			return{
				popup_center:'center',
				info:{},
				verifyCode:''
			}
		},
		computed:{
			
		},
		onLoad(options) {
			this.info=JSON.parse(options.info)
			this.verifyCode=options.verifyCode
		},
		methods:{
			skipList(orderNo){
				uni.navigateTo({
					url:`/pages/admin/skipRefund/index?orderNo=${orderNo}`
				})
			},
			toCancel(){
				employeeOrderCancel({verifyCode:this.verifyCode}).then(res=>{
					if(res.code==200){
						uni.navigateTo({
							url:`/pages/admin/cancel/result?type=1&&orderNo=${this.info.orderNo}`
						})
					}else{
						uni.navigateTo({
							url:'/pages/admin/cancel/result?type=0'
						})
					}
				}).catch(err => {
					return this.$util.Tips({
						title: err
					});
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.pagebox{	
		padding: 20rpx;
		padding-bottom: 150rpx;
		.after_sale{
			font-size: 26rpx;
			background-color: #E5EFFE;
			height: 90rpx;
			line-height: 90rpx;
			padding-left: 20rpx;
			border-radius: 10rpx;
			color: #2A7EFB;
			position: relative;
			margin-bottom: 20rpx;
			.icon-you{
				position: absolute;
				right: 10rpx;
			}
		}
		.order_info{
			.order_info_number{
				border-bottom: 2rpx solid #F5F5F5;
				padding-bottom: 30rpx;
			}
			padding:30rpx 20rpx ;
			background-color: #fff;
			border-radius: 20rpx;
			.info_text{
				margin-left: 15rpx;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
			}
			.order_info_item{
				display: flex;
				padding: 30rpx 0;
				
				.product_img{
					width: 180rpx;
					height: 180rpx;
					border-radius: 10rpx;
				}
				.info_text_title{
					width: 480rpx;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
				.info_text_sku{
					color: #999;
					font-size: 24rpx;
					margin-top: 8rpx;
				}
				.operate{
					font-size: 24rpx;
					display: flex;
					justify-content: space-between;
					.cancel_num{
						background-color: #F5F5F5;
						padding: 10rpx 20rpx;
					}
				}
			}
		}
		.page_bottom{
			width: 100vw;
			height: 100rpx;
			position: fixed;
			bottom: 0;
			left: 0rpx;
			background-color: #fff;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 0 20rpx;
			.page_bottom_btn{
				width: 200rpx;
				height: 64rpx;
				background: #2A7EFB;
				border-radius: 40rpx;
				line-height: 64rpx;
				text-align: center;
				font-weight: 500;
				font-size: 24rpx;
				color: #FFFFFF;
			}
		}
	}
	.infor-text{
		color: #2A7EFB ;
	}
	/deep/ .uni-popup__wrapper {
		width: 600rpx;
		height: 310rpx;
		background: #FFFFFF;
		border-radius: 14rpx;
	}
	
	.sh_popup-content {
		.sh_popup_title {
			font-weight: 500;
			font-size: 32rpx;
			color: #333333;
			text-align: center;
			margin-top: 40rpx;
		}
	
		.sh_popup_text {
			font-weight: 400;
			font-size: 30rpx;
			color: #666666;
			text-align: center;
			margin-top: 30rpx;
		}
	
		.sh_popup_btn {
			display: flex;
			justify-content: space-between;
			margin-top: 40rpx;
			padding: 0 47rpx;
			.btn {
				width: 244rpx;
				height: 72rpx;
				border-radius: 50rpx;
				text-align: center;
				line-height: 72rpx;
			}
	
			.no_btn {
				border: 1px solid #2A7EFB;
				color: #2A7EFB;
			}
	
			.yes_btn {
				background: #2A7EFB;
				color: #FFFFFF;
			}
		}
	}
	.infor-num{
		width: 350rpx;
	}
</style>