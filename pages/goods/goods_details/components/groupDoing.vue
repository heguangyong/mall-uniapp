<template>
	<!-- 拼团详情 -->
	<view class="doing" v-if="processItem.length">
		<view class="rd-14rpx bg--w111-fff mt-20 p-24">
			<view class="flex fs-24 notice pb-24 border-bottom mb-38">
				<image class="laba" src="../../static/images/laba.png" mode=""></image>
				<text class="text-red">已拼{{groupBuyActivityResponse.latestBuyCount||0}}件</text>
				<text v-if="groupBuyActivityResponse.groupBuyUserActivityDoneList">丨</text>
				<view class='swiper'>
					<swiper :indicator-dots="false" autoplay interval="2500" duration="500" vertical="true"
						circular="true">
						<block v-for="(item,index) in groupBuyActivityResponse.groupBuyUserActivityDoneList"
							:key='index'>
							<swiper-item>
								<view class='line1'>{{item.groupNickname}}拼团成功</view>
							</swiper-item>
						</block>
					</swiper>
				</view>
			</view>
			<view class="flex-between-center pink-cell" v-for='(item,index) in processItem' :key='index'
				v-if="index < 5">
				<view class="flex-1 flex-y-center">
					<image :src='item.orderDoneUserImages[0].groupAvatar' class="w-64 h-64 rd-50-p111-"></image>
					<view class="flex-y-center fs-26 pl-24">
						<text>还差 <text class="text-red">{{item.needSomeTogetherCount}}</text>人,</text>
						<text class="pl-8">还剩</text>
						<view class="time-box">
							<countDown  :is-day="true" :tip-text="' '" :day-text="' : '" :hour-text="' : '"
							:minute-text="' : '" :second-text="' '" :isCol="false"  :datatime="item.recordEndTime|dataTime"
								:bgColor="bgColor" :isBg="true">
							</countDown>
						</view>
					</view>
				</view>
				<view class="w-120 h-56 rd-30rpx bg-red flex-center text--w111-fff fs-24"
					@click="$emit('toGroup',item.orderDoneUserImages[0].groupRecordId)">去拼团</view>
			</view>
		</view>
	</view>
</template>

<script>
	import countDown from "@/components/countDown";
	export default {
		components: {
			countDown,
		},
		props: {
			processItem: {
				type: Array,
				default: () => [],
			},
			groupBuyActivityResponse: {
				type: Object,
				default: () => {},
			}
		},
		data() {
			return {
				bgColor: {
					'bgColor': '#fff',
					'Color': '',
					'width': '36rpx',
					'timeTxtwidth': '6rpx',
					'isDay': true,
					'txtColor': '#999'
				},
			}
		},
		created() {

		},
		methods: {

		}
	}
</script>

<style lang="scss" scoped>
	.doing {
		padding: 0 26rpx;
		margin: 22rpx 0;
	}

	.notice .swiper {
		width: 360rpx;
		overflow: hidden;
		margin-left: 8rpx;
	}

	.notice .swiper swiper {
		height: 30rpx;
		width: 100%;
		overflow: hidden;
		padding-bottom: 2px;
		font-size: 22rpx;
		color: #282828;
	}

	.border-bottom {
		border-bottom: 1rpx solid #eee;
	}

	.text-red {
		color: #e93323;
	}

	.pink-cell~.pink-cell {
		margin-top: 64rpx;
	}

	.time-box {
		margin-top: 2rpx;
	}

	.laba {
		width: 46rpx;
		height: 40rpx;
	}

	/deep/.swiper-item {
		height: 100rpx !important;
	}

	.swiper-item-box {
		height: auto !important;
	}
</style>