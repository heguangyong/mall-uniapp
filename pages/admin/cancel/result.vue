<template>
	<view class="detail-page-box">
		<view class="detailBox">
			<image :src="type==1?urlDomain+'crmebimage/presets/adminImg/result2.png':urlDomain+'crmebimage/presets/adminImg/result1.png'" mode=""></image>
			<view class="text">
				{{type==1?'订单已全部核销':'暂无待核销订单'}}
			</view>
			<view class="btn-box">
				<view class="btn xq" @click="toDetail">
					{{type==1?'订单详情':'返回重新核销'}}
				</view>
				<view class="btn gzt" @click="toWork">
					返回工作台
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				urlDomain: this.$Cache.get("imgHost"),
				type:'',
				orderNo:''
			}
		},
		onLoad(options) {
			this.type=options.type
			this.orderNo=options.orderNo
		},
		methods:{
			toWork(){
				uni.reLaunch({
					url:'/pages/admin/work/index'
				})
			},
			toDetail(){
				if(this.type==1){
					uni.navigateTo({
						url:`/pages/admin/order/detail?orderNo=${this.orderNo}`
					})
				}else{
					uni.navigateTo({
						url:`/pages/admin/cancel/index`
					})
				}
			}
		}
	}
</script>

<style scoped lang="scss">
	.detail-page-box{
		padding: 40rpx 20rpx;
		.detailBox{
			padding: 40rpx 20rpx;
			width: 710rpx;
			height: 660rpx;
			background: #FFFFFF;
			text-align: center;
			padding-top: 64rpx;
			border-radius: 14rpx;
			image{
				width: 170rpx;
				height: 150rpx;
			}
			.text{
				font-size: 36rpx;
				color: #333333;
				margin-top: 34rpx;
			}
			.btn-box{
				margin-top: 60rpx;
				.btn{
					width: 500rpx;
					height: 88rpx;
					border-radius: 50rpx;
					line-height: 88rpx;
					font-weight: 500;
					font-size: 28rpx;
					margin: 0 auto;
				}
				.xq{
					background: #2A7EFB;
					color: #FFFFFF;
				}
				.gzt{
					border: 1px solid #2A7EFB;
					color: #2A7EFB;
					margin-top: 24rpx;
				}
			}
		}
	}
</style>