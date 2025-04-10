<template>
	<view class="pagebox">
		<!-- #ifdef MP || APP-PLUS -->
		<workNavBar titleText="工作台" :iconColor="iconColor" :textColor="iconColor" :isScrolling="isScrolling" showBack>
			<view class="word_header_text">
				<view class="text-box line1 wx-text-box">
					{{popupName}}
				</view>
				<view class="icon-box" v-if="merchantEmployeeList.length>1" @click="toggle('bottom')">
					<text class="iconfont icon-xiangxia"></text>
				</view>
			</view>
		</workNavBar>
		<!-- #endif -->
		<view class="headerBg">
			<view :style="{ height: `${getHeight.barTop}px` }"></view>
			<view :style="{ height: `${getHeight.barHeight}px` }"></view>
			<view class="inner">
			</view>
		</view>
		<view class="page-content">
			<!-- #ifdef H5 -->
			<view class="word_header_text">
				<view class="popup-box">
					{{popupName}}
				</view>
				<view class="icon-box" v-if="merchantEmployeeList.length>1" @click="toggle('bottom')">
					<text class="iconfont icon-xiangxia"></text>
				</view>
			</view>
			<!-- #endif -->
			<view class="header acea-row row-middle">
				<image :src="merchantSelected.avatar" class="avatar"></image>
				<view class="text-box">
					<view class="name">{{ merchantSelected.name }}</view>
					<view class="phone">{{ merchantSelected.phone }}</view>
				</view>
				<navigator url="/pages/admin/cancel/index" hover-class="none"
					v-if="selectMerchantRole.split(',').includes('5')">
					<text class="iconfont icon-ic_Scan"></text>
				</navigator>
			</view>
			<!-- 销售统计 -->
			<view class="today" v-if="selectMerchantRole.split(',').includes('6')">
				<view class="title-box">
					<navigator class="link"  hover-class="none">
						今日销售额(元)
					</navigator>
					<view class="money semiBold">{{homeData.sales?homeData.sales:0}}</view>
				</view>
				<view class="acea-row">
					<view class="item">
						<view class="num semiBold">{{homeData.yesterdaySales?homeData.yesterdaySales:0}} </view>
						<view class="">昨日销售额(元)</view>
					</view>
					<view class="item semiBold">
						<view class="num">{{ homeData.orderNum?homeData.orderNum:0 }}</view>
						<view class="">今日订单量</view>
					</view>
					<view class="item semiBold">
						<view class="num">{{ homeData.yesterdayOrderNum?homeData.yesterdayOrderNum:0 }}</view>
						<view class="">昨日订单量</view>
					</view>
				</view>
			</view>
			<!-- 订单 -->
			<view class="goods acea-row" v-if="selectMerchantRole.split(',').includes('6')">
				<navigator url="/pages/admin/order/index?type=notShipped" hover-class="none" class="item" v-if="selectMerchantRole.split(',').includes('1')">
					<view class="img-box">
						<view class="img positionImg">
							<image class="positionImg" :src="urlDomain+'crmebimage/presets/adminImg/daifahuo.png'"
								mode="">
							</image>
							<view :class="operatingData.notShippingOrderNum<10?'positonsNum':'positonsNumBig'">
								{{operatingData.notShippingOrderNum>99?'99+':operatingData.notShippingOrderNum}}
							</view>
						</view>
					</view>
					<view class="">待发货</view>
				</navigator>
				<navigator url="/pages/admin/order/index?type=awaitVerification" hover-class="none" class="item" v-if="selectMerchantRole.split(',').includes('1')">
					<view class="img-box">
						<view class="img positionImg">
							<image :src="urlDomain+'crmebimage/presets/adminImg/daihexiao.png'" mode=""></image>
							<view :class="operatingData.awaitVerificationOrderNum<10?'positonsNum':'positonsNumBig'">
								{{operatingData.awaitVerificationOrderNum>99?'99+':operatingData.awaitVerificationOrderNum}}
							</view>
						</view>
					</view>
					<view class="">待核销</view>
				</navigator>
				<navigator url="/pages/admin/after_sale/index?type=0" hover-class="none" class="item" v-if="selectMerchantRole.split(',').includes('2')">
					<view class="img-box">
						<view class="img positionImg">
							<image :src="urlDomain+'crmebimage/presets/adminImg/daishenhe.png'" mode=""></image>
							<view :class="operatingData.refundingOrderNum<10?'positonsNum':'positonsNumBig'">
								{{operatingData.refundingOrderNum>99?'99+':operatingData.refundingOrderNum}}
							</view>
						</view>
					</view>
					<view class="">审核中</view>
				</navigator>
			</view>
			<!-- 商品 -->
			<view class="product" v-if="selectMerchantRole.split(',').includes('2')">
				<view class="acea-row titleBottom">
					<image class="ddImg" :src="urlDomain+'crmebimage/presets/adminImg/ic_shangpin.png'" mode=""></image>
					<view class="title-box bottom-line">商品统计</view>
				</view>
				<view class="acea-row product-box">
					<view class="">
						<view class="num semiBold">{{productStatusNum?productStatusNum[0]['count']:0}}</view>
						<view class="special list-text">出售中</view>
					</view>
					<view class="">
						<view class="num semiBold">{{productStatusNum?productStatusNum[1]['count']:0}}</view>
						<view class="special list-text">仓库中</view>
					</view>
					<view class="">
						<view class="num semiBold">{{productStatusNum?productStatusNum[2]['count']:0}}</view>
						<view class="special list-text">已售罄</view>
					</view>
					<view class="">
						<view class="num semiBold">{{productStatusNum?productStatusNum[3]['count']:0}}</view>
						<view class="special list-text">警戒库存</view>
					</view>
					<view class="">
						<view class="num semiBold">{{productStatusNum?productStatusNum[7]['count']:0}}</view>
						<view class="special list-text">待提审</view>
					</view>
					<view class="">
						<view class="num semiBold">{{productStatusNum?productStatusNum[5]['count']:0}}</view>
						<view class="special list-text">待审核</view>
					</view>
					<view class="">
						<view class="num semiBold">{{productStatusNum?productStatusNum[6]['count']:0}}</view>
						<view class="special list-text">审核失败</view>
					</view>
					<view class="">
						<view class="num semiBold">{{productStatusNum?productStatusNum[4]['count']:0}}</view>
						<view class="special list-text">回收站</view>
					</view>
				</view>
			</view>
			<view class="manage" v-if="selectMerchantRole.split(',').includes('6')">
				<view class="acea-row ddImg-box titleBottom">
					<image class="ddImg" :src="urlDomain+'crmebimage/presets/adminImg/ic_user.png'" mode="">
					</image>
					<view class="title-box bottom-line">用户统计</view>
				</view>
				<view class="list acea-row">
					<view class="gz-box">
						<view class="num semiBold">{{homeData.followNum?homeData.followNum:0}}</view>
						<view class="list-text">累计关注量</view>
					</view>
				</view>
			</view>
		</view>
		<footerPage></footerPage>
		<uni-popup ref="popup" type="bottom" background-color="rgba(0,0,0,0)" border-radius="10px 10px 0 0">
			<view class="popup-content">
				<view class="item" v-for="(item,index) in merchantEmployeeList" :key="index"
					:class="{bottom_border:index!=merchantEmployeeList.length-1}">
					<view class="item_main">
						<image :src="item.currentMerchant.avatar" mode="" class="item_img"></image>
						<view class="item_name" :class="{nameColor:item.merId==merId}">{{item.currentMerchant.name}}</view>
					</view>
					<text v-if="item.merId==merId" class="iconfont icon-xuanzhong11 icon-size icon_color"></text>
					<text v-else class="iconfont icon-weixuan icon-size" @click="radioChange(item)"></text>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import {
		mapGetters
	} from "vuex";
	import {
		HTTP_REQUEST_URL
	} from '@/config/app';
	import Cache from '@/utils/cache';
	import {
		getMerIndexInfoApi
	} from '@/api/merchant.js';
	import {
		merchantActive,
		statisticsIndex,
		statisticsOperatingData,
		productTabsHeaders
	} from '@/api/work.js';
	// #ifdef MP || APP-PLUS
	import workNavBar from '../components/workNavBar.vue';
	// #endif
	import footerPage from '../components/footerPage/index.vue';
	export default {
		components: {
			// #ifdef MP || APP-PLUS
			workNavBar,
			// #endif
			footerPage,
		},
		computed: {
			...mapGetters(['merchantEmployeeList', 'selectMerId', 'selectMerchantRole']),
		},
		created() {
			//防止中途关闭权限
			this.merId = this.selectMerId
			this.role=this.selectMerchantRole
			this.selectMerchantList()
		},
		mounted() {
			this.toActive(this.merId)
			this.geiHomeData()
		},
		data() {
			return {
				urlDomain: this.$Cache.get("imgHost"),
				role: null,
				popupName: null,
				merId: null,
				merchantSelected: {},
				imgHost: HTTP_REQUEST_URL,
				// #ifdef MP || APP-PLUS
				iconColor: '#FFFFFF',
				isScrolling: false,
				// #endif
				avatar: '',
				getHeight: this.$util.getWXStatusHeight(),
				homeData: {},
				operatingData: {},
				productStatusNum: '',
			}
		},
		methods: {
			geiHomeData() {
				statisticsIndex().then(res => {
					this.homeData = res.data
				}).catch(err=>{})
				statisticsOperatingData().then(res => {
					this.operatingData = res.data
				}).catch(err=>{})
				productTabsHeaders().then(res => {
					this.productStatusNum = res.data
				}).catch(err=>{})
			},
			//商铺激活
			toActive(merId) {
				let that = this
				merchantActive(merId).then(res => {
					if (res.code == 200) {
						that.$store.commit('SET_MANAGER_TOKEN', {
							managerToken: res.data.token
						});
						Cache.set('electrPrintingSwitch', res.data.electrPrintingSwitch);
						this.geiHomeData()
					}
				})
			},
			selectMerchantList() {
				let arr = JSON.parse(JSON.stringify(this.merchantEmployeeList))
				this.merchantSelected = arr.find(value => value.merId == this.merId)
				this.popupName = this.merchantSelected.currentMerchant.name
			},
			toggle(type) {
				this.type = type
				// open 方法传入参数 等同在 uni-popup 组件上绑定 type属性
				this.$refs.popup.open(type)
			},
			radioChange(item) {
				this.popupName = item.currentMerchant.name
				this.merId = item.merId
				this.role = item.role
				this.$store.commit('SetSelectMerId', this.merId);
				this.$store.commit('SetSelectMerchantRole', this.role);
				this.toActive(this.merId)
				this.selectMerchantList()
				this.$refs.popup.close()
				this.geiHomeData()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.pagebox {
		position: relative;
		overflow: hidden;
		padding-bottom: 200rpx;
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

	.page-content {
		position: relative;
		padding: 0 20rpx;

		.header {
			padding: 22rpx 20rpx 32rpx 12rpx;

			.avatar {
				width: 80rpx;
				height: 80rpx;
				border-radius: 50%;
			}

			.text-box {
				flex: 1;
				padding-left: 16rpx;
				color: #FFFFFF;
			}

			.name {
				font-weight: 500;
				font-size: 32rpx;
				line-height: 44rpx;
			}

			.phone {
				margin-top: 4rpx;
				font-size: 22rpx;
				line-height: 30rpx;
			}

			.iconfont {
				font-size: 40rpx;
				color: #FFFFFF;
			}
		}

		.today {
			border-radius: 24rpx;
			background: #FFFFFF;

			.title-box {
				padding: 40rpx 0 0 40rpx;
			}

			.link {
				display: inline-block;
				vertical-align: middle;
				font-size: 24rpx;
				line-height: 34rpx;
				color: #999999;
			}

			.iconfont {
				margin-left: 4rpx;
				font-size: 24rpx;
			}

			.money {
				margin-top: 16rpx;
				font-size: 56rpx;
				line-height: 56rpx;
				color: #FF7E00;
			}

			.item {
				flex: 1;
				padding: 54rpx 0 38rpx;
				text-align: center;
				font-size: 24rpx;
				line-height: 34rpx;
				color: #999999;
			}

			.num {
				margin-bottom: 12rpx;
				font-size: 36rpx;
				line-height: 36rpx;
				color: #333333;
			}
		}

		.goods {
			border-radius: 24rpx;
			margin-top: 20rpx;
			background: #FFFFFF;
			justify-content: space-between;
			.item {
				width: 175rpx;
				padding: 30rpx 0 26rpx;
				text-align: center;
				font-size: 26rpx;
				line-height: 36rpx;
				color: #333333;
			}

			.img-box {
				position: relative;
				width: 76rpx;
				height: 76rpx;
				border-radius: 50%;
				margin: 0 auto 12rpx;
				// background: #F9A833;
				// text-align: center;
				// line-height: 76rpx;
			}

			.img {
				width: 100%;
				height: 100%;
				// border-radius: 50%;
				// background: rgba(255, 255, 255, 0.8);
			}

			.num {
				position: absolute;
				top: -6rpx;
				left: 58rpx;
				z-index: 2;
				min-width: 24rpx;
				height: 24rpx;
				padding: 0 8rpx;
				border-radius: 12rpx;
				background: #FF7E00;
				font-weight: 500;
				font-size: 18rpx;
				line-height: 24rpx;
				color: #FFFFFF;
			}

			image {
				width: 100%;
				height: 100%;
				// font-size: 38rpx;
				// color: #FF7E00;
			}
		}

		.manage {
			padding-bottom: 41rpx;
			border-radius: 24rpx;
			margin-top: 20rpx;
			background: #FFFFFF;
			padding: 40rpx;

			.title-box {
				font-weight: 500;
				font-size: 30rpx;
				color: #333333;
			}

			.num {
				margin-bottom: 12rpx;
				font-size: 32rpx;
				line-height: 36rpx;
				color: #333333;
				font-weight: 600;
			}

			.list {
				justify-content: space-between;
				margin-top: 30rpx;
			}
		}

		.product {
			padding-bottom: 41rpx;
			border-radius: 24rpx;
			margin-top: 20rpx;
			background: #FFFFFF;
			padding: 40rpx;

			.title-box {
				font-weight: 500;
				font-size: 30rpx;
				color: #333333;
			}

			.num {
				margin-bottom: 12rpx;
				font-size: 32rpx;
				line-height: 36rpx;
				color: #333333;
				font-weight: 600;
			}

			.product-box {
				flex-wrap: wrap;
				justify-content: space-between;
				&>view {
					margin-top: 40rpx;
				}

				.special {
					width: 140rpx;
				}
				.num{
					text-align: center;
				}
			}
		}
	}

	.word_header_text {
		/* #ifdef H5 */
		margin-top: 20rpx;
		/* #endif */
		color: #fff;
		text-align: center;
		display: flex;
		align-items: center;
		justify-content: center;

		.popup-box {
			text-align: right;
			width: 180rpx;
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
		}

		.icon-xiangxia {
			font-size: 18rpx;
		}
	}

	.popup-content {
		border-radius: 16rpx 16rpx 0px 0px;

		.bottom_border {
			border-bottom: 1px solid #F5F5F5;
		}

		.item {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 20rpx;

			.icon_color {
				color: #2A7EFB;
			}

			.item_main {
				display: flex;
				align-items: center;

				.item_name {
					margin-left: 20rpx;
					font-weight: 500;
					font-size: 28rpx;
				}
			}

			.item_img {
				width: 60rpx;
				height: 60rpx;
				border-radius: 60rpx;
			}
		}
	}

	.icon-box {
		width: 30rpx;
		height: 30rpx;
		background: rgba(255, 255, 255, 0.3);
		border-radius: 15rpx;
		line-height: 20rpx;
		text-align: center;
		margin-right: 20rpx;
		margin-left: 10rpx;
		.icon-xiangxia {
			font-size: 12rpx;
		}
	}

	.ddImg {
		width: 36rpx;
		height: 36rpx;
		margin-right: 12rpx;
		margin-top: 2rpx;
	}

	.positionImg {
		position: relative;

		.positonsNum {
			position: absolute;
			right: -5rpx;
			top: 0;
			background: #FF7E00;
			border-radius: 40rpx;
			color: #fff;
			font-size: 18rpx;
			width: 24rpx;
			height: 24rpx;
			text-align: center;
			line-height: 24rpx;
		}
		.positonsNumBig{
			position: absolute;
			left: 50rpx;
			top: 0;
			background: #FF7E00;
			border-radius: 40rpx;
			color: #fff;
			font-size: 18rpx;
			// width: 34rpx;
			height: 24rpx;
			text-align: center;
			line-height: 24rpx;
			padding: 0 6rpx;
		}
	}

	.list-text {
		font-size: 24rpx;
		color: #999999;
		text-align: center;
	}

	.gz-box {
		// width: 100%;
		text-align: center;
	}
	.titleBottom{
		vertical-align: top;
		padding-bottom: 24rpx;
		border-bottom: 2rpx solid #f5f5f5;
	}
	.icon-size{
		width: 40rpx;
		height: 40rpx;
	}
	.nameColor{
		color: #2A7EFB;
	}
	.wx-text-box{
		max-width: 240rpx;
	}
</style>