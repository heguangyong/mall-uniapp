<template>
	<text class="price-box semiBold">
		<text class="icon">￥</text>
		<text class="big-num">{{priceArr[0]}}</text>
		<text>.</text>
		<text class="small-num">{{priceArr[1]}}</text>
	</text>
</template>

<script>
	export default{
		props:['price'],
		computed:{
			priceArr(){
				return this.price && this.price.toString().split('.')
			}
		}
	}
</script>

<style lang="scss" scoped>
	.price-box{
		color: #E93323;
		font-weight: 600;
		.icon{
			font-size: 24rpx;
		}
		.big-num{
			font-size: 40rpx;
		}
		.small-num{
			font-size: 24rpx;
		}
	}
</style>