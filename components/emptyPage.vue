<template>
	<view class="empty-box" :style="{'padding-top':mTop}">
		<image class="empty-img" :src="imgSrc"></image>
		<view class="txt">{{title}}</view>
	</view>
</template>

<script>
	// +----------------------------------------------------------------------
	// | CRMEB [ CRMEB赋能开发者，助力企业发展 ]
	// +----------------------------------------------------------------------
	// | Copyright (c) 2016~2025 https://www.crmeb.com All rights reserved.
	// +----------------------------------------------------------------------
	// | Licensed CRMEB并不是自由软件，未经许可不能去掉CRMEB相关版权
	// +----------------------------------------------------------------------
	// | Author: CRMEB Team <admin@crmeb.com>
	// +----------------------------------------------------------------------
	export default {
		props: {
			imgSrc: {
				type: String,
				default: '/static/images/empty-box.gif',
			},
			title: {
				type: String,
				default: '暂无记录',
			},
			mTop: {
				type: String,
				default: '50%',
			}
		},
		data() {
			return {
				urlDomain: this.$Cache.get("imgHost")
			}
		}
	}
</script>

<style lang="scss" scoped>
	.empty-box {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding-bottom: 60rpx;

		.empty-img {
			width: 440rpx;
			height: 360rpx;
		}

		.txt {
			font-size: 26rpx;
			color: #999;
		}
	}
</style>