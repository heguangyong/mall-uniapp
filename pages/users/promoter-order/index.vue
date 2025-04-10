<template>
	<view :data-theme="theme">
		<view class="promoter-order">
			<view class='promoterHeader'>
				<view class='headerCon acea-row row-between-wrapper'>
					<view>
						<view class='name'>累积推广订单</view>
						<view><text class='num'>{{recordCount || 0}}</text>单</view>
					</view>
					<view class='iconfont icon-2'></view>
				</view>
			</view>
			<view class='list borderPad'>
				<block v-for="(item,index) in recordList" :key="index">
					<view class='item'>
						<view class='title acea-row row-column row-center'>
							<view class='data'>{{item.time}}</view>
							<view>本月累计推广订单：{{item.count || 0}}单</view>
						</view>
						<view class='listn'>
							<block v-for="(child,indexn) in item.child" :key="indexn">
								<view class='itenm borRadius14'>
									<view class='top acea-row row-between-wrapper'>
										<view class='pictxt acea-row row-between-wrapper'>
											<view class='pictrue'>
												<image :src='child.avatar'></image>
											</view>
											<view class='text line1'>{{child.nickname}}</view>
										</view>
										<view class='money'>返佣：<text class='font-color'>￥{{child.amount}}</text></view>
										<!-- 	<view class='money' v-if="child.type == 'brokerage'">返佣：<text class='font-color'>￥{{child.number}}</text></view>
										<view class='money' v-else>暂未返佣：<text class='font-color'>￥{{child.number}}</text></view> -->
									</view>
									<view class='bottom'>
										<view><text class='name'>订单编号：</text>{{child.orderNo}}</view>
										<view><text class='name'>返佣时间：</text>{{child.time}}</view>
									</view>
								</view>
							</block>
						</view>
					</view>
				</block>
				<view class='loadingicon acea-row row-center-wrapper'>
					<text class='loading iconfont icon-jiazai' :hidden='loading==false'></text>
				</view>
			</view>
			<view v-show="recordList.length == 0 && !loading">
				<emptyPage title="暂无推广订单～" mTop="30%" :imgSrc="urlDomain+'crmebimage/presets/noJilu.png'"></emptyPage>
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
		spreadOrder
	} from '@/api/user.js';
	import {
		toLogin
	} from '@/libs/login.js';
	import {
		mapGetters
	} from "vuex";
	import emptyPage from '@/components/emptyPage.vue'
	import {
		setThemeColor
	} from '@/utils/setTheme.js'
	const app = getApp();
	export default {
		components: {
			emptyPage
		},
		data() {
			return {
				urlDomain: this.$Cache.get("imgHost"),
				page: 1,
				limit: 20,
				status: false,
				recordList: [],
				recordCount: 0,
				time: 0,
				theme: app.globalData.theme,
				bgColor: '#e93323',
				loading: true
			};
		},
		computed: mapGetters(['isLogin']),
		onLoad() {
			if (this.isLogin) {
				this.getRecordOrderList();
			} else {
				toLogin();
			}
			let that = this;
			that.bgColor = setThemeColor();
			uni.setNavigationBarColor({
				frontColor: '#ffffff',
				backgroundColor: that.bgColor,
			});
		},
		methods: {
			stringToDate: function(data) {
				let str = data.replace(/-/g, '/');
				let date = new Date(str);
				return data;
			},
			getRecordOrderList: function() {
				let that = this;
				let page = that.page;
				let limit = that.limit;
				let status = that.status;
				let recordList = that.recordList;
				let newList = [];
				if (status == true) return;
				spreadOrder({
					page: page,
					limit: limit
				}).then(res => {
					let recordListData = res.data ? res.data : [];
					// 每页返回的总条数；
					let len = 0;
					for (let i = 0; i < recordListData.length; i++) {
						len = len + recordListData[i].child.length;
						let str = recordListData[i].time.replace(/-/g, '/');
						let date = new Date(str).getTime();
						that.recordCount += recordListData[i].count || 0;
						if (that.time === date) {
							that.$set(that.recordList[i], 'child', that.recordList[i].child.concat(
								recordListData[i].child));
						} else {
							recordListData.forEach((item, index) => {
								if (recordListData[i] == item) {
									newList.push(item);
								}
							})
							that.$set(that, 'recordList', recordList.concat(newList));
						}
						that.time = date;
					};
					that.status = limit > len;
					that.page = page + 1;
					that.loading = false;
				});
			}
		}
	}
</script>

<style scoped lang="scss">
	.promoter-order .list .item .title {
		height: 133rpx;
		font-size: 26rpx;
		color: #999;
	}

	.promoterHeader {
		@include main_bg_color(theme);
	}

	.promoter-order .list .item .title .data {
		font-size: 28rpx;
		color: #282828;
		margin-bottom: 5rpx;
	}

	.promoter-order .list .item .listn .itenm {
		background-color: #fff;
	}

	.promoter-order .list .item .listn .itenm~.itenm {
		margin-top: 20rpx;
	}

	.promoter-order .list .item .listn .itenm .top {
		padding: 0 24rpx;
		border-bottom: 1rpx solid #eee;
		height: 100rpx;
	}

	.promoter-order .list .item .listn .itenm .top .pictxt {
		width: 320rpx;
	}

	.promoter-order .list .item .listn .itenm .top .pictxt .text {
		width: 230rpx;
		font-size: 30rpx;
		color: #282828;
	}

	.promoter-order .list .item .listn .itenm .top .pictxt .pictrue {
		width: 66rpx;
		height: 66rpx;
	}

	.promoter-order .list .item .listn .itenm .top .pictxt .pictrue image {
		width: 100%;
		height: 100%;
		border-radius: 50%;
		border: 3rpx solid #fff;
		box-sizing: border-box;
		box-shadow: 0 0 15rpx #aaa;
	}

	.promoter-order .list .item .listn .itenm .top .money {
		font-size: 28rpx;
	}

	.promoter-order .list .item .listn .itenm .bottom {
		padding: 20rpx 24rpx;
		font-size: 28rpx;
		color: #666;
		line-height: 1.6;
	}

	.promoter-order .list .item .listn .itenm .bottom .name {
		color: #999;
	}
</style>
