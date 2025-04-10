<template>
	<view class="flex-center recommend-box mt-20 mb-24">
		<image :src="`${urlDomain}crmebimage/presets/haowuzuo.png`"></image>
		<view class="f-s-32 lh-44rpx ml-4">{{title}}</view>
		<image class="ml-6" :src="`${urlDomain}crmebimage/presets/haowuyou.png`"></image>
	</view>
</template>

<script>
	export default {
		props: {
			title: {
				type: String,
				default: ''
			}
		},
		data() {
			return {
				urlDomain: this.$Cache.get("imgHost"),
			}
		}
	}
</script>

<style scoped lang="scss">
	.recommend-box {
		image {
			width: 42rpx;
			height: 36rpx;
		}
	
		view {
			font-weight: 600;
		}
	}
</style>