<template>
	<!-- 拼团玩法 -->
	<view class="playing">
		<view class="rd-14rpx bg--w111-fff mt-20 pt-32 pl-24 pr-24 pb-32">
			<view class="flex-between-center">
				<text class="fs-30 fw-500 lh-42rpx">拼团玩法</text>
			</view>
			<view class="flex-between-center mt-38 px-28">
				<view class="w-118 flex-col flex-center">
					<view class="w-80 h-80 rd-50-p111- bg-primary-light flex-center mb-24">
						<text class="iconfont icon-ic_user1 fs-44 text-red"></text>
					</view>
					<text class="fs-26 lh-36rpx">开团/参团</text>
				</view>
				<image class="dot-line" src="../../static/images/arrow.png"></image>
				<view class="w-118 flex-col flex-center">
					<view class="w-80 h-80 rd-50-p111- bg-primary-light flex-center mb-24">
						<text class="iconfont icon-ic_invite fs-44 text-red"></text>
					</view>
					<text class="fs-26 lh-36rpx">邀请好友</text>
				</view>
				<image class="dot-line" src="../../static/images/arrow.png"></image>
				<view class="w-118 flex-col flex-center">
					<view class="w-80 h-80 rd-50-p111- bg-primary-light flex-center mb-24">
						<text class="iconfont icon-ic_box fs-44 text-red"></text>
					</view>
					<text class="fs-26 lh-36rpx">满员发货</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
</script>

<style lang="scss" scoped>
	.playing{
		padding: 0 26rpx;
		margin: 22rpx 0;
	}
	.bg-primary-light{
		background: rgba(233, 51, 35, 0.1);
	}
	.text-red{
		color: #e93323;
	}
	.dot-line{
		width: 76rpx;
		height: 12rpx;
		margin-bottom: 66rpx;
	}
	.iconfont{
		font-size: 44rpx !important;
	}
</style>