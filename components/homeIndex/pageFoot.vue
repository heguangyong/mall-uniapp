<template>
	<!-- 底部导航 -->
	<view :data-theme="theme">
		<view>
			<view class="page-footer" id="target">
				<view class="foot-item" v-for="(item,index) in bottomNavigationList" :key="index"
					@click="goRouter(item)">
					<block v-if="item.link.split('?')[0] == activeRouter">
						<image :src="item.imgList[0]"></image>
						<view class="txt">{{item.name}}</view>
					</block>
					<block v-else>
						<image :src="item.imgList[1]"></image>
						<view class="unchecked">{{item.name}}</view>
					</block>
				</view>
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
		mapState,
		mapGetters
	} from "vuex"
	import {
		getBottomNavigationApi
	} from '@/api/api.js';
	let app = getApp();
	export default {
		name: 'pageFooter',
		props: {
			dataConfig: {
				type: Object,
				default: () => {}
			},
		},
		data() {
			return {
				activeRouter: ''
			};
		},
		created() {
			let routes = getCurrentPages(); //获取当前打开过的页面路由数组
			let curRoute = routes[routes.length - 1].route //获取当前页面路由
			this.activeRouter = '/' + curRoute
		},
		computed: {
			bottomNavigationList() {
				return this.dataConfig.menuList.list
			},
			// cover() {
			// 	return this.dataConfig.cover.url
			// },
			// link() {
			// 	return this.dataConfig.link.val
			// },
			boxStyle() {
				return {
					background: `linear-gradient(${this.dataConfig.bgColor.color[0].item}, ${this.dataConfig.bgColor.color[1].item})`,
					margin: this.dataConfig.mbConfig.val * 2 + 'rpx' + ' ' + this.dataConfig.lrConfig.val * 2 + 'rpx' +
						' ' + 0,
					padding: this.dataConfig.upConfig.val * 2 + 'rpx' + ' ' + 0 + ' ' + this.dataConfig.downConfig.val *
						2 + 'rpx'
				}
			},
		}
	}
</script>

<style scoped lang="scss">
	.unchecked {
		color: #333;
		font-size: 24rpx;
	}

	.page-footer {
		position: fixed;
		bottom: 0;
		z-index: 9;
		display: flex;
		align-items: center;
		justify-content: space-around;
		width: 100%;
		height: calc(98rpx + constant(safe-area-inset-bottom)); ///兼容 IOS<11.2/
		height: calc(98rpx + env(safe-area-inset-bottom)); ///兼容 IOS>11.2/
		box-sizing: border-box;
		border-top: solid 1rpx #F3F3F3;
		background-color: #fff;
		box-shadow: 0px 0px 17rpx 1rpx rgba(206, 206, 206, 0.32);
		padding-bottom: constant(safe-area-inset-bottom); ///兼容 IOS<11.2/
		padding-bottom: env(safe-area-inset-bottom); ///兼容 IOS>11.2/

		.foot-item {
			display: flex;
			width: max-content;
			align-items: center;
			justify-content: center;
			flex-direction: column;
			position: relative;

			.count-num {
				position: absolute;
				display: flex;
				justify-content: center;
				align-items: center;
				width: 40rpx;
				height: 40rpx;
				top: 0rpx;
				right: -15rpx;
				color: #fff;
				font-size: 20rpx;
				background-color: #FD502F;
				border-radius: 50%;
				padding: 4rpx;
			}
		}

		.foot-item image {
			height: 50rpx;
			width: 50rpx;
			text-align: center;
			margin: 0 auto;
		}

		.foot-item .txt {
			font-size: 24rpx;
			@include main-color(theme);

			&.active {}
		}
	}
</style>