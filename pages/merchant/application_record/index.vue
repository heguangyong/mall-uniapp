<template>
	<view class="main">
		<view class="application-record" v-if="listData.length">
			<view class="card-list" v-for="item in listData" :key="item.id">
				<view class="card-top">
					<view class="title">{{item.name}}</view>
					<view class="time">提交时间：{{item.createTime}}</view>
					<view v-if="item.denialReason" class="reason">原因：{{item.denialReason}}</view>
				</view>
				<view class="line"></view>
				<view class="card-bottom">
					<view class="card-status">
						<view class="flex align-center">
							<image class="status-icon" v-if="item.auditStatus === 1" src="../static/images/pending.png"
								mode=""></image>
							<image class="status-icon" v-else-if="item.auditStatus === 2"
								src="../static/images/passed.png" mode=""></image>
							<image class="status-icon" v-else-if="item.auditStatus === 3"
								src="../static/images/not-pass.png" mode=""></image>
							<text class="status-text">{{statusText(item.auditStatus)}}</text>
						</view>
						<view @click="goDetal(item)">
							<text v-if="item.auditStatus === 2 || item.auditStatus === 1" class="btn">查看</text>
							<text v-else class="btn">重新提交</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class='no-shop' v-if="!listData.length && !loading">
			<view class='pictrue' style="margin: 0 auto;" @click="menusTap()">
				<image :src="urlDomain+'crmebimage/presets/noJilu.png'"></image>
				<text class="text-ccc">暂无申请记录，快去申请入驻吧</text>
			</view>
		</view>
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
	import {
		getMerSettledRecordApi
	} from '@/api/merchant.js'
	export default {
		data() {
			return {
				urlDomain: this.$Cache.get("imgHost"),
				loading: false,
				listData: [],
				pageData: {
					page: 1,
					limit: 10,
				}
			}
		},
		onLoad() {
			this.getListData()
		},
		// 滚动到底部
		onReachBottom() {
			if (this.count == this.listData.length) {
				uni.showToast({
					title: '没有更多啦',
					icon: 'none',
					duration: 1000
				});
			} else {
				this.pageData.page += 1
				this.getListData()
			}
		},
		methods: {
			goDetal(item) {
				uni.navigateTo({
					url: '/pages/users/settled/index?key=1'
				})
				this.$store.commit('MERSTTLEDDATA', item);
			},
			returns() {
				uni.navigateBack()
			},
			menusTap() {
				uni.navigateTo({
					url: '/pages/users/settled/index'
				})
			},
			getListData() {
				this.loading = true
				uni.showLoading({
					title: '加载中...'
				});
				getMerSettledRecordApi(this.pageData).then(res => {
					this.count = res.data.total;
					res.data.list.map(item => {
						this.$set(item, 'qualificationPicture', JSON.parse(item.qualificationPicture));
					})
					this.listData = this.listData.concat(res.data.list)
					uni.hideLoading();
					this.loading = false
				})
			},
			//状态判断
			statusText(number) {
				// 使用对象
				let statusData = {
					1: '待审核',
					2: '审核通过',
					3: '审核未通过'
				};
				return statusData[number]
			},
			// button显示文字
			statusBtn(number) {
				// 使用对象
				let statusData = {
					0: '编辑',
					1: '查看',
					2: '重新提交',
				};
				return statusData[number]
			},
		}
	}
</script>

<style lang="scss" scoped>
	.main {
		padding-bottom: constant(safe-area-inset-bottom); ///兼容 IOS<11.2/
		padding-bottom: env(safe-area-inset-bottom); ///兼容 IOS>11.2/
	}

	.application-record {
		display: flex;
		flex-direction: column;
		align-items: center;
		background-color: #F5F5F5;
		padding: 20rpx 30rpx;

		.card-list {
			width: 100%;
			background-color: #fff;
			padding: 20rpx 24rpx;
			margin: 10rpx 20rpx;
			border-radius: 12rpx;

			.card-top {

				.title {
					font-size: 28rpx;
					font-weight: bold;
					color: #333333;
				}

				.time {
					color: #999999;
					font-size: 24rpx;
					padding: 5rpx 0;
				}

				.reason {
					color: #E93323;
					font-weight: bold;
					font-size: 24rpx;
				}
			}

			.line {
				height: 2rpx;
				margin: 20rpx 0 20rpx 0;
				background-color: #EEEEEE;
			}

			.card-bottom {
				display: flex;
				justify-content: space-between;
				align-items: center;
				color: #333;

				.card-status {
					display: flex;
					align-items: center;
					justify-content: space-between;
					width: 100%;

					.status-icon {
						width: 30rpx;
						height: 30rpx;
						margin: 10rpx;
					}

					.status-text {
						font-size: 28rpx;
						font-weight: 500;
					}
				}

				.status-btn {
					font-size: 26rpx;
					color: #555;
					border: 1px solid #999999;
					padding: 8rpx 32rpx;
					border-radius: 40rpx;
				}
			}
		}

	}

	.no-shop {
		width: 100%;
		background-color: #fff;
		height: 100vh;
		text-align: center;

		.pictrue {
			height: 100%;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			//@include main_color(theme);

			image {
				width: 440rpx;
				height: 360rpx;
			}

			.text-ccc {
				margin: 0;
			}
		}
	}

	.align-center {
		align-items: center;
	}

	.btn {
		font-size: 26rpx;
		color: #666;
		padding: 13rpx 32rpx;
		border-radius: 30rpx;
		border: 1px solid #999999;
	}
</style>