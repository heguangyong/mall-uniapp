<template>
	<view class="pagebox">
		<!-- #ifdef MP || APP-PLUS -->
		<NavBar titleText="销售额统计" :iconColor="iconColor" :textColor="iconColor" :isScrolling="isScrolling" showBack></NavBar>
		<!-- #endif -->
		<view class="headerBg">
			<view :style="{ height: `${getHeight.barTop}px` }"></view>
			<view :style="{ height: `${getHeight.barHeight}px` }"></view>
			<view class="inner"></view>
		</view>
		<view class="order-index" ref="container">
			<view class="header">
				<view class="">销售额(元)</view>
				<view class="money">{{ after_price }}</view>
				<view class="info">
					环比增长：{{ increase_time_status == 1 ? '' : '-' }}{{ growth_rate }}%
					<text :class="['iconfont', increase_time_status == 1 ? 'icon-xiangshang1' : 'icon-xiangxia2','info-icon']"></text>
				</view>
				<view class="picker">
					<picker mode="selector" :range="array" @change="bindPickerChange">
						<view>{{ array[index] }}<text class="iconfont icon-xiangxia"></text></view>
					</picker>
				</view>
			</view>
			<view class="wrapper">
				<view class="list acea-row">
					<view class="item">
						<view class="num">{{ after_number }}</view>
						<view>订单数量</view>
					</view>
					<view class="item">
						<view class="num">{{ refund_number }}</view>
						<view>已退款</view>
					</view>
					<view class="item">
						<view class="num">{{ visits_number }}</view>
						<view>访客数量</view>
					</view>
				</view>
			</view>
			<div class="chart">
				<view class="title">
					销量趋势
				</view>
				<uCharts></uCharts>
			</div>
			<view class="public-wrapper">
				<view class="title">
					详细数据
				</view>
				<view class="nav acea-row row-between-wrapper">
					<view class="data">日期</view>
					<view class="browse">订单数</view>
					<view class="turnover">销售额(元)</view>
					<view class="visit">退款(元)</view>
				</view>
				<view class="conter">
					<view class="item acea-row row-between-wrapper" v-for="(item, index) in 3" :key="index">
						<view class="data">4.1</view>
						<view class="browse">36</view>
						<view class="turnover">3456.78</view>
						<view class="visit">0.00</view>
					</view>
				</view>
			</view>
			<Loading :loaded="loaded" :loading="loading"></Loading>
		</view>
		<view class="safe-area-inset-bottom"></view>
	</view>
</template>

<script> 
	const app = getApp();
	import Loading from '../components/Loading/index.vue'
	import uCharts from '../components/uCharts/order_ucharts.vue'
	// #ifdef MP || APP-PLUS
	import NavBar from '../components/NavBar.vue';
	// #endif
	export default {
		name: 'adminOrder',
		components: {
			uCharts,
			Loading,
			// #ifdef MP ||APP-PLUS
			NavBar,
			// #endif
		},
		data() {
			return {
				theme: app.globalData.theme,
				iconColor: '#FFFFFF',
				isScrolling: false,
				getHeight: this.$util.getWXStatusHeight(),
				census: {},
				list: [],
				where: {
					page: 1,
					limit: 15
				},
				loaded: false,
				loading: false,
				after_price: '8,903,785.00', // 销售额
				after_number: 199, // 订单数
				refund_number: '978.97', // 已退款
				visits_number: '2,197', // 访客数量
				growth_rate: 0, // 增长率
				increase_time: 0, // 较昨日同比增长
				increase_time_status: 1, // 1 增长 2 减少
				cWidth: '',
				cHeight: '',
				pixelRatio: 1,
				textarea: '',
				index: 4,
				array: ['今日', '昨日', '本周','上周','本月','上月','今年','去年'],
				arrays: [1, 7, 30],
			}
		},
		methods:{
			bindPickerChange: function(e) {
				this.index = e.detail.value
			},
		}
	}
</script>

<style lang="scss" scoped>
	.pagebox {
		position: relative;
		overflow: hidden;
	}

	.safe-area-inset-bottom {
		height: 0;
		height: constant(safe-area-inset-bottom);
		height: env(safe-area-inset-bottom);
	}

	.headerBg {
		position: absolute;
		top: 0;
		left: -25%;
		width: 150%;
		border-bottom-right-radius: 100%;
		border-bottom-left-radius: 100%;
		background: linear-gradient(270deg, #01ABF8 0%, #2A7EFB 100%);
		.inner {
			height: 356rpx;
		}
	}

	/*订单首页*/
	.order-index {
		position: relative;
		padding: 0 20rpx;
	}

	.order-index .header {
		position: relative;
		padding: 24rpx 0 40rpx 20rpx;
		font-size: 28rpx;
		line-height: 40rpx;
		color: #FFFFFF;

		.picker {
			position: absolute;
			top: 24rpx;
			right: 0;
			height: 48rpx;
			padding: 0 20rpx;
			border-radius: 24rpx;
			background: rgba(255, 255, 255, 0.3);
			text-align: center;
			font-size: 24rpx;
			line-height: 48rpx;
			color: #FFFFFF;

			.iconfont {
				margin-left: 10rpx;
				font-size: 24rpx;
			}
		}
	}

	.order-index .header .money {
		margin-top: 26rpx;
		font-family: SemiBold;
		font-size: 50rpx;
		line-height: 80rpx;
	}

	.order-index .header .info {
		margin-top: 30rpx;
		position: relative;
		.iconfont {
			margin-left: 6rpx;
			font-size: 12rpx;
			position: absolute;
			top: 0;
		}
	}

	.order-index .wrapper {
		background-color: #fff;
		border-radius: 24rpx;
	}

	.order-index .wrapper .list .item {
		flex: 1;
		padding: 36rpx 0 26rpx;
		text-align: center;
		font-size: 24rpx;
		line-height: 34rpx;
		color: #999;
	}

	.order-index .wrapper .list .item .num {
		margin-bottom: 8rpx;
		font-family: SemiBold;
		font-size: 36rpx;
		color: #333;
		font-weight: 600;
	}

	.public-wrapper .title {
		font-weight: 500;
		font-size: 30rpx;
		line-height: 42rpx;
		color: #333333;
		padding: 32rpx 0 40rpx 24rpx;
	}

	.public-wrapper {
		background-color: #fff;
		border-radius: 24rpx;
		margin-top: 20rpx;
	}

	.public-wrapper .nav {
		padding: 0 40rpx;
		line-height: 34rpx;
		font-size: 24rpx;
		color: #999;
	}

	.public-wrapper .data {
		flex: 1;
		text-align: left;
	}

	.public-wrapper .browse {
		flex: 1;
		// text-align: center;
	}

	.public-wrapper .turnover {
		flex: 1;
		// text-align: center;
	}

	.public-wrapper .visit {
		flex: 1;
		text-align: right;
	}

	.public-wrapper .conter {
		padding: 0 40rpx;
	}

	.public-wrapper .conter .item {
		border-bottom: 1px solid #F1F1F1;
		height: 74rpx;
		font-size: 24rpx;
	}

	.chart {
		border-radius: 24rpx;
		margin-top: 20rpx;
		background: #FFFFFF;

		.title {
			padding: 32rpx 0 16rpx 24rpx;
			font-weight: 500;
			font-size: 30rpx;
			line-height: 42rpx;
			color: #333333;
		}

		.chart-title {
			padding: 40rpx 0 6rpx 42rpx;
			font-size: 22rpx;
			line-height: 26rpx;
			color: #999999;
		}

		.charts {
			width: 100%;
			height: 514rpx;
		}
	}

	.cover-view {
		position: fixed;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
	}
</style>