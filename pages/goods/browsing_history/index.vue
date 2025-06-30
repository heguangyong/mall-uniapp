<template>
	<view class="page-wrapper history" :data-theme="theme">
		<view class="history_count">
			<block v-if="list.length>0">
				<view class="history_header acea-row">
					<text>共{{total}}条，最多为您保存100条</text>
				</view>
				<view class="list" v-for="(item,index) in list">
					<view class="item_time">
						<view>{{item.date}}</view>
					</view>
					<view class="item_main acea-row">
						<view class="item acea-row" :class="{gary :(!itemn.isDel && itemn.isShow ==1) }"
							v-for="(itemn,indexn) in item.list">
							<view class="item item_count" @click="goPage(itemn)">
								<view class="pictrue">
									<easy-loadimage class="easy-img" mode="widthFix" :image-src="itemn.image">
									</easy-loadimage>
									<view v-if="item.activityStyle" :style="{ backgroundImage: `url(${item.activityStyle})` }" class="border-picture"></view>
								</view>
								<view class="info">
									<view class="msg">
										<block v-if="!itemn.isDel && itemn.isShow">
											<view class="price line2"><text></text>￥{{itemn.price}}</view>
										</block>
										<block v-else-if="itemn.isDel">
											<view class="tips">该商品已删除</view>
										</block>
										<block v-else>
											<view class="tips">该商品已下架</view>
										</block>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</block>
			<block v-if="(list.length==0 && !loading ) " >
				<emptyPage title="暂无浏览记录~" :imgSrc="urlDomain+'crmebimage/presets/noJilu.png'"></emptyPage>
			</block>
			<view class='loadingicon acea-row row-center-wrapper'>
				<text class='loading iconfont icon-jiazai' :hidden='loading==false'></text>
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
	import emptyPage from '@/components/emptyPage.vue'
	import {
		browseRecordApi,
		historyDelete,
		historyBatchDelete,
		historyBatchCollect
	} from '@/api/user.js'
	import {
    goProductDetail
	} from '@/libs/order.js'
	import {
		mapGetters
	} from "vuex";
	import animationType from '@/utils/animationType.js'
	import easyLoadimage from '@/components/base/easy-loadimage.vue';
	let app = getApp();
	export default {
		components: {
			emptyPage,
			easyLoadimage
		},
		computed: mapGetters(['uid', 'globalData']),
		data() {
			return {
				urlDomain: this.$Cache.get("imgHost"),
				list: [],
				allArr: [],
				total: 0,
				theme: app.globalData.theme,
				loading: true
			}
		},
		onLoad() {
			this.getList();
		},
		methods: {
			getList() {
				this.list = [];
				browseRecordApi().then(({
					data
				}) => {
					this.list = data;
				    data.map(item => {
						this.total += item.list.length;
						item.date = item.date.slice(5, 7)+'月'+item.date.slice(8, 10)+'日' ;
					})
					this.loading = false;
				}).catch(err => {
					this.loading = false;
					return this.$util.Tips({
						title: err
					});
				});
			},
			goPage(item) {
				if(!item.isShow) return;
        goProductDetail(item.productId, 0,'');
			}
		},
		// 滚动监听
		onPageScroll(e) {
			// 传入scrollTop值并触发所有easy-loadimage组件下的滚动监听事件
			uni.$emit('scroll');
		}
	}
</script>

<style lang="scss" scoped>
	.pictrue{
		position: relative;
	}
	page {
		background: #ffffff;
	}

	.history {
		margin-bottom: 96rpx;

		.history_count {
			padding: 0 30rpx;
		}

		.history_header {
			justify-content: space-between;
			margin: 30rpx 0;

			text {
				font-size: 26rpx;
				color: #666666;
			}

			.text {
				color: var(--view-theme);
			}
		}

	.list {
			margin-top: 20rpx;

			.item_time {
				font-size: 36rpx;
				color: #282828;
				font-weight: bold;
				display: flex;
				align-items: center;
			}

			.item_main {
				margin-top: 30rpx;
			}
		}

		.item {
			width: 217rpx;
			border-radius: 16rpx;
			margin: 0 20rpx 20rpx 0;
			position: relative;

			&:nth-child(3n) {
				margin-right: 0;
			}

			::v-deepimage,
			::v-deep.easy-loadimage,
			uni-image {
				width: 217rpx;
				height: 217rpx;
				border-radius: 16rpx;
			}

			.info {
				margin-top: 20rpx;
				color: var(--view-priceColor);
				font-size: 24rpx;
			}
		}
	}

	::v-deep.loadfail-img,
	.easy-img {
		width: 217rpx;
		height: 217rpx;
		border-radius: 16rpx;
		display: block;
	}

	.item_time .checkbox .iconfont {
		font-size: 38rpx;
		color: #999999;
		margin-right: 10rpx;

		&.icon-xuanzhong1 {
			color: var(--view-theme);
		}
	}

	.item_main .checkbox .iconfont {
		font-size: 40rpx;
		color: #DEDEDE;
		position: absolute;
		right: 12rpx;
		top: 12rpx;
		z-index: 10;
		border-radius: 100%;

		&.icon-weixuanzhong {
			&::after {
				content: "";
				display: block;
				width: 36rpx;
				height: 36rpx;
				background: rgba(0, 0, 0, .38);
				position: absolute;
				top: 2rpx;
				left: 2rpx;
				border-radius: 100%;
				border: 1rpx solid #DEDEDE;
			}
		}
	}

	.history .item .icon-xuanzhong1 {
		color: var(--view-theme);
	}

	.history .footer {
		z-index: 99;
		width: 100%;
		height: 96rpx;
		background-color: #ffffff;
		position: fixed;
		padding: 0 20rpx;
		box-sizing: border-box;
		border-top: 1rpx solid #eee;
		bottom: var(--window-bottom);
	}

	.area-edit {
		justify-content: center;

		.area-item {
			width: 50%;
			text-align: center;
			position: relative;
			align-items: center;
			color: #333333;

			.text {
				position: relative;
				top: -1px;
			}

			.iconfont {
				color: #333333;
			}

			&:nth-child(1) {
				&::after {
					content: '';
					display: inline-block;
					width: 2rpx;
					height: 42rpx;
					background: #CCCCCC;
					position: absolute;
					top: 0;
					right: 0;
			}
				}
		}
	}

	.history .footer .checkAll {
		font-size: 28rpx;
		color: #282828;
		margin-left: 16rpx;
	}

	.allcheckbox .iconfont {
		margin-right: 11px;
		font-size: 40rpx;
		color: #cccccc;
	}

	.allcheckbox .icon-xuanzhong1 {
		color: var(--view-theme);
	}

	.history .footer .button .bnt {
		font-size: 28rpx;
		color: #999;
		border-radius: 50rpx;
		border: 1px solid #999;
		width: 160rpx;
		height: 60rpx;
		text-align: center;
		line-height: 60rpx;

		&.collect_btn {
			color: var(--view-theme);
			border-color: var(--view-theme);
		}
	}
	.empty-box {
		margin-top: 60%;
	}
</style>
