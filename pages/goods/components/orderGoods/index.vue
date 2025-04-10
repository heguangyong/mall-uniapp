<template>
	<view class="orderGoods borRadius14">
		<navigator v-if="orderInfo.merName" :url="`/pages/merchant/home/index?merId=`+ orderInfo.merId" hover-class="none">
			<view class='total'>
				<text class="mr10 iconfont icon-shangjiadingdan"></text>
				<text class="mr10">{{orderInfo.merName}}</text>
				<text class="iconfont icon-xiangyou" style="font-size: 20rpx;"></text>
			</view>
		</navigator>
		<view v-show="orderData.secondType ===1" class='total'>
			<text class="mr10 iconfont icon-zhuanti"></text>
			<text class="mr10">积分商品兑换</text>
		</view>
		<view class='goodWrapper pad24'>
			<view class="item" v-for="(item,index) in cartInfo" :key="index">
				<view class='acea-row row-between-wrapper' @click="jumpCon(item)">
					<view class='pictrue'>
						<image :src='item.image'></image>
					</view>
					<view class='text'>
						<view class='acea-row row-between-wrapper'>
							<view class='name line1'>{{item.productName}}</view>
							<view class='num line-heightOne' v-if="item.payNum">x {{item.payNum}}</view>
						</view>

						<view class='attr' v-if="item.sku">{{item.sku}}</view>
						<!-- 积分价格 -->
						<PointsPrice v-if="secondType === ProductTypeEnum.Integral" :pointsPrice="item"
							:pointsGoodsStyle="hotPointsStyle" class="mt-20"></PointsPrice>
						<!-- 其他价格 -->
						<view v-else class='acea-row justify-between' style="align-items: baseline;">
							<view class="acea-row">
								<view class='money line-heightOne'>￥{{item.price || item.productPrice}}</view>
							</view>
							<view
								v-if="(item.deliveryMethod == 1 || !orderInfo.takeTheirSwitch) && !jump && Number(item.productType)==0"
								class="font-color">不支持到店自提</view>
							<view v-if="item.deliveryMethod == 2 && !jump && Number(item.productType)==0"
								class="font-color">不支持商家配送</view>
						</view>
					</view>
				</view>
				<!-- 订单状态（0：待支付，1：待发货,2：部分发货， 3：待核销，4：待收货,5：已收货,6：已完成，9：已取消） -->
				<view v-if="isShowBtn" class="acea-row evaluateBox">
					<view v-show="getApplyRefundNum(item)>0" class="text">申请售后（
						数量：{{(getApplyRefundNum(item))}} ）</view>
					<view class='evaluate'
						v-if="isRefund(item) && getApplyRefundNum(item)< item.payNum"
						@click.stop="goRefund(item)"><text class="line-heightOne">申请退款</text>
					</view>
					<!-- 虚拟商品退款需要判断是否开启退款按钮 -->
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
	import * as filters from '@/filters'
	import {
		goProductDetail
	} from "../../../../libs/order";
	import {
		ProductTypeEnum,
		ProductMarketingTypeEnum
	} from "@/enums/productEnums";
	import PointsPrice from '@/components/PointsPrice.vue';
	/**
	 * 积分商品推荐样式
	 */
	const hotPointsStyle = {
		iconStyle: {
			width: '28rpx',
			height: '28rpx'
		},
		priceStyle: {
			fontSize: '26rpx',
		},
		unitStyle: {
			fontSize: '24rpx',
		},
	}
	export default {
		props: {
			//订单详情
			orderData: {
				type: Object,
				default: function() {
					return {};
				}
			},
			//商品信息
			cartInfo: {
				type: Array,
				default: function() {
					return [];
				}
			},
			orderNo: {
				type: String,
				default: '',
			},
			jump: {
				type: Boolean,
				default: false,
			},
			orderProNum: {
				type: Number,
				default: function() {
					return 0;
				}
			},
			//商户整条对象信息
			orderInfo: {
				type: Object,
				default: function() {
					return {};
				}
			},
			//是否显示操作按钮
			isShowBtn: {
				type: Boolean,
				default: true,
			},
			//订单二级类型:0-普通订单，1-积分订单，2-虚拟订单，4-视频号订单，5-云盘订单，6-卡密订单
			secondType: {
				type: Number,
				default: function() {
					return 0;
				}
			}
		},
		components: {
			PointsPrice
		},
		data() {
			return {
				hotPointsStyle: hotPointsStyle,
				totalNmu: '',
				ProductMarketingTypeEnum: ProductMarketingTypeEnum,
				ProductTypeEnum: ProductTypeEnum,
			};
		},
		watch: {
			cartInfo: function(nVal, oVal) {
				let num = 0
				nVal.forEach((item, index) => {
					num += item.cartNum
				})
				this.totalNmu = num
			}
		},
		methods: {
			// 普通商品、虚拟（开启可申请退款开关）、视频号可申请退款
			isRefund(item) {
				return (this.secondType === this.ProductTypeEnum.Normal || this
					.secondType === this.ProductTypeEnum.Video || (this.secondType === this.ProductTypeEnum.Fictitious && item.proRefundSwitch)) && this.orderData.status > 0 && this.orderData.status < 6;
			},
			// 退款数量
			getApplyRefundNum(item) {
				return Number(item.applyRefundNum) + Number(item.refundNum)
				
			},
			/**
			 * 退款申请
			 */
			goRefund(item) {
				item.groupBuyActivityId=this.orderData.groupBuyActivityId
				this.$Cache.set('productInfo', item)
				uni.navigateTo({
					url: '/pages/goods/after_sales_type/index?orderNo=' + this.orderNo + '&orderId=' + item.id
				})
			},
			jumpCon: function(item) {
				let type = item.hasOwnProperty('productMarketingType')?item.productMarketingType:item.hasOwnProperty('productType')?item.productType:item.type;
				if (this.jump) {
					goProductDetail(item.productId, type, '')
				}
			}
		}
	}
</script>

<style scoped lang="scss">
	.evaluateBox {
		position: relative;
		margin-top: 10rpx;

		.text {
			font-size: 20rpx;
			color: #868686;
		}
	}

	.evaluate {
		width: auto !important;
		border-radius: 20rpx !important;
		padding: 0 10rpx;
		font-size: 24rpx;
	}

	.pad24 {
		padding: 20rpx 24rpx 20rpx 24rpx;
	}

	.orderGoods {
		background-color: #fff;
		margin-top: 24rpx;
	}

	.money {
		@include price_color(theme);
	}

	.orderGoods .total {
		width: 100%;
		height: 86rpx;
		padding: 0 24rpx;
		border-bottom: 2rpx solid #f0f0f0;
		font-size: 30rpx;
		color: #282828;
		line-height: 86rpx;
		box-sizing: border-box;
	}

	.pictrue image {
		background: #f4f4f4;
	}

	.goodWrapper {
		.item {
			margin-bottom: 30rpx;
		}

		.item:nth-last-child(1) {
			margin-bottom: 0;
		}

		.name {
			width: 87%;
		}
	}
</style>