<template>
	<!-- 底部导航 -->
	<view class="page-footer">
		<view class="foot-item" :class="item.pagePath == activeRouter?'active':''" v-for="(item,index) in footerList"
			:key="index" @click="goRouter(item)" v-if="!(item.role!='0'&&!selectMerchantRole.split(',').includes(item.role))">
			<block v-if="item.pagePath == activeRouter">
				<image :src="item.selectedIconPath"></image>
				<view class="txt">{{item.text}}</view>
			</block>
			<block v-else>
				<image :src="item.iconPath"></image>
				<view class="txt">{{item.text}}</view>
			</block>
		</view>
	</view>
</template>

<script>
	import {
		mapGetters
	} from "vuex";
	export default {
		name: 'footerPage',
		props: {},
		computed: {
			...mapGetters(['selectMerchantRole']),
		},
		created() {
			let routes = getCurrentPages(); //获取当前打开过的页面路由数组
			let curRoute = routes[routes.length - 1].route //获取当前页面路由
			this.activeRouter = '/' + curRoute
		},
		mounted() {},
		data() {
			return {
				activeRouter: '',
				footerList: [{
						pagePath: "/pages/admin/work/index",
						iconPath: require("../../static/gzth.png"),
						selectedIconPath: require("../../static/gztl.png"),
						text: "工作台",
						role: '0'
					},
					{
						pagePath: "/pages/admin/order/index",
						iconPath: require("../../static/ddh.png"),
						selectedIconPath: require("../../static/ddl.png"),
						text: "订单",
						role: '1'
					},
					{
						pagePath: "/pages/admin/after_sale/index",
						iconPath: require("../../static/shh.png"),
						selectedIconPath: require("../../static/shl.png"),
						text: "售后",
						role: '3'
					},
					{
						pagePath: "/pages/admin/goods/index",
						iconPath: require("../../static/sph.png"),
						selectedIconPath: require("../../static/spl.png"),
						text: "商品",
						role: '2'
					}
				]
			}
		},
		methods: {
			goRouter(item) {
				var pages = getCurrentPages();
				var page = (pages[pages.length - 1]).$page.fullPath;
				if (item.pagePath == page) return

				uni.redirectTo({
					url: item.pagePath,
					animationType: 'none' // 关闭默认的滑动效果
				});
			}
		}
	}
</script>

<style scoped lang="scss">
	.page-footer {
		position: fixed;
		bottom: 0;
		left: 0;
		z-index: 20;
		display: flex;
		align-items: center;
		justify-content: space-around;
		width: 100%;
		height: calc(100rpx+ constant(safe-area-inset-bottom)); ///兼容 IOS<11.2/
		height: calc(100rpx + env(safe-area-inset-bottom)); ///兼容 IOS>11.2/
		box-sizing: border-box;
		border-top: solid 1rpx #F3F3F3;
		background-color: #fff;
		// box-shadow: 0px 0px 17rpx 1rpx rgba(206, 206, 206, 0.32);
		padding-bottom: constant(safe-area-inset-bottom); ///兼容 IOS<11.2/
		padding-bottom: env(safe-area-inset-bottom); ///兼容 IOS>11.2/

		.foot-item {
			display: flex;
			width: max-content;
			align-items: center;
			justify-content: center;
			flex-direction: column;
			position: relative;
			padding: 0 20rpx;

			&.active {
				color: #2A7EFB
			}
		}

		.foot-item image {
			height: 40rpx;
			width: 40rpx;
			text-align: center;
			margin: 0 auto;
		}

		.foot-item .txt {
			font-size: 20rpx;
			margin-top: 6rpx;
		}
	}
</style>