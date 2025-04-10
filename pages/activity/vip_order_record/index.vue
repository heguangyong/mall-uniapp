<template>
	<view class="p-24-0">
		<view class="svipOrderRecord borRadius14 mt-24" v-for="item in svipOrderRecordList" :key="item.id">
			<view class="flex-y-center header mb-36">
				<image :style="{'background-image': `url(${urlDomain}crmebimage/presets/viptu.png)`}" class="w-40 h-40 mr-8 vipicon"></image>
				<view class="f-s-32 lh-40rpx">{{item.cardName}}</view>
			</view>
			<view class="acea-row justify-between mb-28">订单编号<view class="centent">{{item.orderNo}}</view></view>
			<view class="acea-row justify-between mb-28">支付时间<view class="centent">{{item.payTime}}</view></view>
			<view class="acea-row justify-between mb-28 ">支付方式<view class="centent">{{item.payType | payTypeFilter}}</view></view>
			<view class="acea-row justify-between mb-28">会员期限<view class="centent">{{item.deadlineDay==0 ?'永久': item.deadlineDay+'天'}}</view></view>
			<view class="acea-row justify-between mb-28">赠送余额<view class="centent">{{item.giftBalance}}</view></view>
			<view class="acea-row justify-between">实付款<view class="font-color-red centent">￥{{item.price}}</view></view>
		</view>
	</view>
</template>

<script>
	import {
		svipOrderRecordApi
	} from '@/api/activity.js';
	export default {
		data() {
			return {
				urlDomain: this.$Cache.get("imgHost"),
				svipOrderRecordList: []
			}
		},
		onLoad() {
			this.getSvipOrder();
		},
		methods: {
			//会员信息
			getSvipOrder() {
				uni.showLoading({
					title: '加载中...'
				});
				svipOrderRecordApi().then(res => {
					this.svipOrderRecordList = res.data;
					uni.hideLoading();
				}).catch(err => {
					uni.showToast({
						title: err,
						icon: 'none'
					});
					uni.hideLoading();
				});
			},
		}
	}
</script>

<style scoped lang="scss">
	.vipicon{
		background-size: 100% 100%;
	}
	.p-24-0{
		padding: 0 24rpx 24rpx 24rpx;
	}
	.svipOrderRecord{
		padding: 0 28rpx 36rpx 28rpx;
		background-color: #fff;
		.header{
			height: 92rpx;
			border-bottom: 1px solid #F5F5F5;
		}
		.centent{
			color: #666;
			font-size: 28rpx;
		}
	}
</style>