<template>
	<view class="header">
		<view class="title">{{title}} <text v-show="num">{{num?num:0}}</text></view>
		<text class="iconfont icon-guanbi5" @click="close"></text>
	</view>
</template>

<script>
	export default {
		props: {
			//是否展示小字样式
			title: {
				type: String,
				default: '',
			},
			num: {
				type: Number,
				default: 0,
			}
		},
		methods: {
			close() {
				this.$emit('close');
			},
		}
	}
</script>

<style scoped lang="scss">
	.header {
		position: relative;
		text-align: center;
		margin-bottom: 50rpx;
	
		.title {
			color: #282828;
			font-size: 36rpx;
			font-weight: bold;
		}
	
		.iconfont {
			color: #8A8A8A;
			font-size: 36rpx;
			position: absolute;
			top: 4rpx;
			right: 0;
		}
	}
</style>