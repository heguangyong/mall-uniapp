<template>
	<!-- 系统表单信息 "-->
	<view class="">
		<view v-if="orderExtend.length" class=''>
			<view v-for="(item,index) in orderExtend" :key="index" class='item acea-row row-between'>
				<view class="title">{{item.title}}{{ item.title.includes(':') ? '' : '：' }}</view>
				<view v-if="!Array.isArray(item.value)" class='conter'>{{item.value||'--'}}</view>
				<view v-else class='acea-row conter' style="justify-content: end;">
					<view v-for="(pic,i) in item.value" :key="i">
						<image v-if="pic.includes('http')" class="virtual_image ml-12" :src="pic"
							@click="getPhotoClickIdx(item.value,i)"></image>
						<view v-else class="ml-12 flex-center">
							<view>{{pic}}</view>
							<view class="ml-12" v-show="i < item.value.length - 1"> -- </view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			orderExtend: {
				type: Array,
				default: function() {
					return []
				}
			},
		},
		methods: {
			// 图片预览
			getPhotoClickIdx(list, idx) {
				uni.previewImage({
					current: list[idx], //  传 Number H5端出现不兼容
					urls: list
				});
			},
		}
	}
</script>

<style scoped lang="scss">
	.item {
		font-size: 28rpx;
		color: #282828;
	}

	.wrapper .item~.item {
		margin-top: 20rpx;
	}

	.conter {
		color: #868686;
		width: 460rpx;
		text-align: right;
		overflow: hidden;
	}

	.title {
		width: 194rpx;
	}

	.virtual_image {
		margin-left: 24rpx;
		width: 106rpx;
		height: 106rpx;
		border-radius: 8rpx;
		margin-right: 10rpx;

		&:last-child {
			margin-right: 0;
		}
	}
</style>