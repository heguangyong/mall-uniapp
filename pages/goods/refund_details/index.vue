<template>
	<view :data-theme="theme">
		<view class='order-details'>
			<!-- 给header上与data上加on为退款订单-->
			<view class='header bg_color on'>
				<view class='picTxt acea-row row-middle'>
					<view class='data on'>
						<view class="acea-row row-middle mb20">
							<view class='state line-heightOne'>{{refundInfo.refundStatus | refundStatusFilter}}</view>
							<view v-show="refundInfo.refundStatus===3"><text
									class="font-color refundPrice">{{refundInfo.refundPrice}}元</text></view>
						</view>
						<view class="mb30 line2" v-if="refundInfo.refundStatus===1">{{refundInfo.refundReason}}</view>
						<view v-else class="mb30">{{refundInfo.refundStatus | orderRefundTipsStatusFilter}}</view>
					</view>
				</view>
			</view>
			<!-- 商品详情 -->
			<view class="borderPad margin-100">
				<view class="borRadius14 wrapper">
					<orderGoods :isShowBtn="false" :refundInfo="refundInfo" :cartInfo="[refundInfo]" :jump="true" :orderData="refundInfo">
					</orderGoods>
					<view class="borderPad">
						<view class="return_info">
							<view class='item acea-row row-between line-heightOne'>
								<view>退款件数：</view>
								<view class='conter'>{{refundInfo.applyRefundNum}}</view>
							</view>
							<view class='item acea-row row-between line-heightOne'>
								<view>退款金额：</view>
								<view class='conter'>￥{{refundInfo.refundPrice}}</view>
							</view>
							<view class='item acea-row row-between line-heightOne'>
								<view>退款方式：</view>
								<view class='conter'>原路返回</view>
							</view>
							<view class='item acea-row row-between line-heightOne'>
								<view>退款原因：</view>
								<view v-if="refundInfo.promoterType==='user'" class='conter'>{{refundInfo.refundReasonWap}}</view>
								<view v-else class='conter'>商家直接退款</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<!-- 商家店铺地址 -->
			<view v-if="refundInfo.returnGoodsType ===2 && merAddress && refundInfo.refundStatus>0" class="borderPad">
				<view class="borRadius14 wrapper return_info_pad">
					<view class='item acea-row row-between mb30'>
						<view>商家退回地址：</view>
						<view class='conter acea-row row-middle row-right'>
							<!-- #ifndef H5 -->
							<text class='copy line-heightOne' @tap="copy(merAddress.name+','+merAddress.phone+','+merAddress.addressDetail)">复制</text>
							<!-- #endif -->
							<!-- #ifdef H5 -->
							<text class='copy copy-data line-heightOne'
								:data-clipboard-text="merAddress.name+','+merAddress.phone+','+merAddress.addressDetail">复制</text>
							<!-- #endif -->
						</view>
					</view>
					<view class="text-2828 f-s-26 mb20">
						<text class="text-2828">{{merAddress.name}}</text>
						<text>{{merAddress.phone}}</text>
					</view>
					<view class="text-666 f-s-26 addressDetail">{{merAddress.addressDetail}}</view>
				</view>
			</view>
			<!-- 商家退回地址 -->
			<view v-if="refundInfo.returnGoodsType ===1 && refundInfo.refundStatus>0 &&refundInfo.receiver&&refundInfo.receiverPhone&&refundInfo.receiverAddressDetail" class="borderPad">
				<view class="borRadius14 wrapper return_info_pad">
					<view class='item acea-row row-between mb30'>
						<view>商家退回地址：</view>
						<view class='conter acea-row row-middle row-right'>
							<!-- #ifndef H5 -->
							<text class='copy line-heightOne' @tap="copy(refundInfo.receiver+','+refundInfo.receiverPhone+','+refundInfo.receiverAddressDetail)">复制</text>
							<!-- #endif -->
							<!-- #ifdef H5 -->
							<text class='copy copy-data line-heightOne'
								:data-clipboard-text="refundInfo.receiver+','+refundInfo.receiverPhone+','+refundInfo.receiverAddressDetail">复制</text>
							<!-- #endif -->
						</view>
					</view>
					<view class="text-2828 f-s-26 mb20">
						<text class="text-2828">{{refundInfo.receiver}}</text>
						<text>{{refundInfo.receiverPhone}}</text>
					</view>
					<view class="text-666 f-s-26 addressDetail">{{refundInfo.receiverAddressDetail}}</view>
				</view>
			</view>
			<!-- 退款订单详情 "-->
			<view class="borderPad">
				<view class='wrapper borRadius14 return_info_pad'>
					<view class='item acea-row row-between '>
						<view>订单单号：</view>
						<view class='conter acea-row row-middle row-right'><text
								class="text-overflow">{{refundInfo.orderNo}}</text>
							<!-- #ifndef H5 -->
							<text class='copy line-heightOne' @tap='copy(refundInfo.orderNo)'>复制</text>
							<!-- #endif -->
							<!-- #ifdef H5 -->
							<text class='copy copy-data line-heightOne'
								:data-clipboard-text="refundInfo.orderNo">复制</text>
							<!-- #endif -->
						</view>
					</view>
					<view class='item acea-row row-between'>
						<view>售后单号：</view>
						<view class='conter acea-row row-middle row-right'><text
								class="text-overflow">{{refundInfo.refundOrderNo}}</text>
							<!-- #ifndef H5 -->
							<text class='copy line-heightOne' @tap='copy(refundInfo.refundOrderNo)'>复制</text>
							<!-- #endif -->
							<!-- #ifdef H5 -->
							<text class='copy copy-data line-heightOne'
								:data-clipboard-text="refundInfo.refundOrderNo">复制</text>
							<!-- #endif -->
						</view>
					</view>
					<view class='item acea-row row-between'>
						<view>申请时间：</view>
						<view class='conter'>{{(refundInfo.createTime || 0)}}</view>
					</view>
					<view class='item acea-row row-between'>
						<view>售后类型：</view>
						<view class='conter'>{{refundInfo.afterSalesType===1?'仅退款':'退货退款'}}</view>
					</view>
					<view class='item acea-row row-between'>
						<view>退回方式：</view>
						<view class='conter'>
							{{refundInfo.returnGoodsType===1?'快递退回':refundInfo.returnGoodsType===2?'到店退货':'不退货'}}</view>
					</view>
					<view class='item acea-row row-between' v-if="refundInfo.refundReasonWapExplain">
						<view>备注说明：</view>
						<view class='conter-refund text-left'>{{refundInfo.refundReasonWapExplain}}</view>
					</view>
					<view class='item acea-row row-between' v-if="refundInfo.refundReasonWapImg">
						<view>售后凭证：</view>
						<view class='conter-refund text-left'>
							<image class="wapImg" :src="item" v-for="item in refundInfo.refundReasonWapImg.split(',')"
								:key='item.id'></image>
						</view>
					</view>
				</view>
			</view>

            <!-- 用户到店退回信息 -->
            <view v-if="refundInfo.returnGoodsType ===2 && refundInfo.refundStatus>0 && refundInfo.telephone" class="borderPad">
            	<view class="borRadius14 wrapper return_info_pad">
            		<view class='item acea-row row-between'>
            			<view>联系电话：</view>
            			<view class='conter'>{{refundInfo.telephone}}</view>
            		</view>
            	</view>
            </view>
            <!-- 用户发货信息 -->
			<view v-if="refundInfo.returnGoodsType ===1 && refundInfo.refundStatus>0 && refundInfo.expressName && refundInfo.trackingNumber" class="borderPad">
				<view class="borRadius14 wrapper return_info_pad">
					<view class='item acea-row row-between mb30'>
						<view>物流公司：</view>
						<view class='conter'>{{refundInfo.expressName}}</view>
					</view>
					<view class='item acea-row row-between mb30'>
						<view>物流单号：</view>
						<view class='conter acea-row row-middle row-right'>
							<text class="text-overflow">{{refundInfo.trackingNumber}}</text>
							<!-- #ifndef H5 -->
							<text class='copy line-heightOne' @tap='copy(refundInfo.trackingNumber)'>复制</text>
							<!-- #endif -->
							<!-- #ifdef H5 -->
							<text class='copy copy-data line-heightOne'
								:data-clipboard-text="refundInfo.trackingNumber">复制</text>
							<!-- #endif -->
						</view>
					</view>
					<view class='item acea-row row-between'>
						<view>联系电话：</view>
						<view class='conter'>{{refundInfo.telephone}}</view>
					</view>
				</view>
			</view>
			<!-- 操作按钮 "-->
			<view v-if="refundInfo.refundStatus === 0 || refundInfo.refundStatus === 4 || refundInfo.refundStatus === 5" class="borderPad">
				<view class='wrapper borRadius14 return_info_pad btn-box acea-row' style="justify-content: flex-end;">
					<view></view>
					<view
						v-if="refundInfo.refundStatus === 0 || refundInfo.refundStatus === 4 || refundInfo.refundStatus === 5"
						class="btn btn-999" @click="handleRevokeRefund(refundInfo.refundOrderNo)">撤销售后</view>
					<view v-if="refundInfo.refundStatus === 4 && refundInfo.afterSalesType === 2" style="color: #fff;"
						class="btn bg-color" @click="handleReturningRefund(refundInfo)">退回商品</view>
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
	import { orderRefundInfoApi } from '@/api/order.js';
  import {onRevokeRefund} from '@/libs/order';
	import orderGoods from "../components/orderGoods";
	import { getMerAddressApi } from '@/api/merchant.js'
	import ClipboardJS from "@/plugin/clipboard/clipboard.js";
	import {
		toLogin
	} from '@/libs/login.js';
	import {
		mapGetters
	} from "vuex";
	// #ifdef MP
	import uQRCode from '@/js_sdk/Sansnn-uQRCode/uqrcode.js'
	// #endif
	import {
		setThemeColor
	} from '@/utils/setTheme.js'
	const app = getApp();
	export default {
		components: {
			orderGoods
		},
		data() {
			return {
				merAddress: null, //店铺地址
				refundOrderNo: '',
				refundInfo: {}, //退款单详情
				theme: app.globalData.theme,
				chatConfig: {
					consumer_hotline: '',
					telephone_service_switch: 'false'
				}, //客服配置
			};
		},
		computed: mapGetters(['isLogin', 'chatUrl', 'userInfo']),
		onLoad: function(options) {
			options.type == undefined || options.type == null ? this.type = 'normal' : this.type = options.type;
			if (!options.refundOrderNo) return this.$util.Tips({
				title: '缺少参数'
			}, {
				tab: 3,
				url: 1
			});
			this.$set(this, 'refundOrderNo', options.refundOrderNo);
			this.bgColor = setThemeColor();
			this.$set(this, 'chatConfig', this.$Cache.getItem('chatConfig'));
		},
		onShow() {
			if (this.isLogin) {
				this.orderRefundInfo();
			} else {
				toLogin();
			}
		},
		onHide: function() {
			this.isClose = true;
		},
		// 滚动监听
		onPageScroll(e) {
			// 传入scrollTop值并触发所有easy-loadimage组件下的滚动监听事件
			uni.$emit('scroll');
		},
		onReady: function() {
			// #ifdef H5
			this.$nextTick(function() {
				const clipboard = new ClipboardJS(".copy-data");
				clipboard.on("success", () => {
					this.$util.Tips({
						title: '复制成功'
					});
				});
			});
			// #endif

		},
		methods: {
			//店铺地址
			getMerAddress() {
				getMerAddressApi(this.refundInfo.merId).then(res => {
					this.$set(this, 'merAddress', res.data);
				}).catch(err => {
					return this.$util.Tips({
						title: err
					});
				})
			},
			//撤销售后
			handleRevokeRefund(refundOrderNo) {
				onRevokeRefund(refundOrderNo).then(() => {
					this.orderRefundInfo()
				});
			},
			//退回商品
			handleReturningRefund(item) {
				this.$Cache.set('productInfo', item)
				uni.navigateTo({
					url: `/pages/goods/returns_and_refunds/index?refundOrderNo=${item.refundOrderNo}&returnGoodsType=${item.returnGoodsType}`
				})
			},
			kefuClick() {
				if (this.chatConfig.telephone_service_switch === 'true') {
					uni.makePhoneCall({
						phoneNumber: this.chatConfig.consumer_hotline //仅为示例
					});
				} else {
					// #ifdef APP-PLUS
					uni.navigateTo({
						url: '/pages/users/web_page/index?webUel=' + this.chatUrl + '&title=客服'
					})
					// #endif
					// #ifndef APP-PLUS
					location.href = this.chatUrl;
					// #endif
				}
			},
			/**
			 * 拨打电话
			 */
			makePhone: function(e) {
				uni.makePhoneCall({
					phoneNumber: e
				})
			},
			/**
			 * 获取退款订单详细信息
			 *
			 */
			orderRefundInfo() {
				let that = this;
				uni.showLoading({
					title: "正在加载中"
				});
        orderRefundInfoApi(that.refundOrderNo).then(res => {
					uni.hideLoading();
					let data = res.data;
					that.$set(that, 'refundInfo', data);
					//returnGoodsType 退货类型：0-不退货 1-快递退回，2-到店退货
					if(that.refundInfo.returnGoodsType ===2)that.getMerAddress();
				}).catch(err => {
					that.$util.Tips({
						title: err
					}, {
						tab: 4,
						url: '/pages/user/index'
					});
				});
			},
			/**
			 *
			 * 剪切订单号
			 */
			// #ifndef H5
			copy: function(orderNo) {
				let that = this;
				uni.setClipboardData({
					data: orderNo
				});
			},
			// #endif
			/**
			 * 打电话
			 */
			goTel: function() {
				uni.makePhoneCall({
					phoneNumber: this.refundInfo.deliveryId
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.addressDetail {
			line-height: 36rpx;
		}
	.btn-box {
		display: flex;
		padding-top: 20rpx;
		line-height: 60rpx;

		.btn-line {
			@include main_color(theme);
			@include coupons_border_color(theme);
		}

		.btn-bg {
			color: #fff;
		}

		.btn-999 {
			border: 1px solid #999999;
			color: #666666;
		}

		.btn {
			width: 176rpx;
			height: 60rpx;
			line-height: 56rpx;
			margin-left: 18rpx;
			text-align: center;
			border-radius: 30rpx;
			font-size: 28rpx;
		}
	}

	.margin-100 {
		margin: -86rpx auto 0 auto;
	}

	.return_info_pad {
		padding: 30rpx 24rpx;
	}

	.return_info {
		border-top: 1px solid #EEEEEE;
		background-color: #fff;
		padding: 32rpx 0;
	}

	.refundPrice {
		font-size: 35rpx;
		font-weight: bold;
	}

	.qs-btn {
		width: auto;
		height: 60rpx;
		text-align: center;
		line-height: 60rpx;
		border-radius: 50rpx;
		color: #fff;
		font-size: 27rpx;
		padding: 0 3%;
		color: #aaa;
		border: 1px solid #ddd;
		margin-right: 20rpx;
	}

	.text-overflow {
		width: 392rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.shuoming {
		width: 32rpx;
		height: 32rpx;
	}

	.mp-header {
		width: 100%;
		@include main_bg_color(theme);
	}

	.goodCall {
		@include main_color(theme);
		text-align: center;
		width: 100%;
		height: 86rpx;
		padding: 0 30rpx;
		border-bottom: 1rpx solid #eee;
		font-size: 30rpx;
		line-height: 86rpx;
		background: #fff;

		.icon-kefu {
			font-size: 36rpx;
			margin-right: 15rpx;
		}

		/* #ifdef MP */
		button {
			display: flex;
			align-items: center;
			justify-content: center;
			height: 86rpx;
			font-size: 30rpx;
			@include main_color(theme);
		}

		/* #endif */
	}

	.justify-between {
		justify-content: space-between;
	}

	.align-center {
		align-items: center;
	}

	.order-details {
		padding-bottom: 30rpx;
		.header {
			height: 250rpx;
			padding: 0 24rpx;
		}
	}

	.bg_color {
		@include main_bg_color(theme);
	}

	.order-details .header.on {
		// /background-color: #666 !important;
	}

	.order-details .header .pictrue {
		width: 110rpx;
		height: 110rpx;
	}

	.order-details .header .pictrue image {
		width: 100%;
		height: 100%;
	}

	.order-details .header .data {
		color: rgba(255, 255, 255, 0.8);
		font-size: 24rpx;
		margin-left: 27rpx;
	}

	.order-details .header .data.on {
		margin-left: 0;
		padding-top: 34rpx;
	}

	.order-details .header .data .state {
		font-size: 30rpx;
		font-weight: bold;
		color: #fff;
	}

	.order-details .header .data .time {
		margin-left: 20rpx;
	}

	.picTxt {
		padding-left: 10rpx;
	}

	.order-details .nav {
		background-color: #fff;
		font-size: 26rpx;
		color: #282828;
		padding: 27rpx 0;
		width: 100%;
		border-radius: 14rpx;
		margin: -100rpx auto 0 auto;
	}

	.order-details .nav .navCon {
		padding: 0 40rpx;
	}

	.order-details .nav .on {
		@include main_color(theme);
	}

	.font_color {
		@include main_color(theme);
	}

	.order-details .nav .progress {
		padding: 0 65rpx;
		margin-top: 10rpx;
	}

	.order-details .nav .progress .line {
		width: 100rpx;
		height: 2rpx;
		background-color: #939390;
	}

	.order-details .nav .progress .iconfont {
		font-size: 25rpx;
		color: #939390;
		margin-top: -2rpx;
	}

	.order-details .address {
		font-size: 26rpx;
		color: #868686;
		background-color: #fff;
		padding: 30rpx 0;

		.phone {
			margin-left: 20rpx;
		}
	}

	.order-details .address .name {
		font-size: 30rpx;
		color: #333;
		margin-bottom: 15rpx;
	}

	.order-details .line {
		width: 100%;
		height: 3rpx;
	}

	.order-details .line image {
		width: 100%;
		height: 100%;
		display: block;
	}

	.order-details .wrapper {
		background-color: #fff;
		margin-top: 12rpx;
	}

	.order-details .wrapper .item {
		font-size: 28rpx;
		color: #282828;
	}

	.order-details .wrapper .item~.item {
		margin-top: 34rpx;
	}

	.order-details .wrapper .item .conter {
		color: #282828;
		text-align: right;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.mark_show {
		color: #868686;
		width: 470rpx;
		text-align: right;
	}

	.order-details .wrapper .item .conter .copy {
		font-size: 20rpx;
		color: #666;
		border-radius: 20rpx;
		border: 1rpx solid #999;
		padding: 8rpx 18rpx;
		margin-left: 10rpx;
	}

	.order-details .wrapper .actualPay {
		border-top: 1rpx solid #eee;
		margin-top: 30rpx;
		padding-top: 30rpx;
	}

	.order-details .wrapper .actualPay .money {
		font-weight: bold;
		font-size: 30rpx;
		@include price_color(theme);
	}

	.order-details .footer {
		width: 100%;
		height: 100rpx;
		position: fixed;
		bottom: 0;
		left: 0;
		background-color: #fff;
		padding-right: 30rpx;
		box-sizing: border-box;
	}

	.order-details .footer .bnt {
		width: 158rpx;
		height: 54rpx;
		text-align: center;
		line-height: 54rpx;
		border-radius: 50rpx;
		color: #fff;
		font-size: 27rpx;
	}

	.order-details .footer .bnt.cancel {
		color: #aaa;
		border: 1rpx solid #ddd;
	}

	.order-details .footer .bnt~.bnt {
		margin-left: 18rpx;
	}

	.order-details .writeOff {
		background-color: #fff;
		margin-top: 15rpx;
		padding-bottom: 50rpx;
	}

	.order-details .writeOff .title {
		font-size: 30rpx;
		color: #282828;
		height: 87rpx;
		border-bottom: 1px solid #f0f0f0;
		padding: 0 24rpx;
		line-height: 87rpx;
	}

	.order-details .writeOff .grayBg {
		background-color: #f2f5f7;
		width: 590rpx;
		height: 384rpx;
		border-radius: 20rpx 20rpx 0 0;
		margin: 50rpx auto 0 auto;
		padding-top: 55rpx;
	}

	.order-details .writeOff .grayBg .pictrue {
		width: 290rpx;
		height: 290rpx;
		margin: 0 auto;
	}

	.order-details .writeOff .grayBg .pictrue image {
		width: 100%;
		height: 100%;
		display: block;
	}

	.order-details .writeOff .gear {
		width: 590rpx;
		height: 30rpx;
		margin: 0 auto;
	}

	.order-details .writeOff .gear image {
		width: 100%;
		height: 100%;
		display: block;
	}

	.order-details .writeOff .num {
		background-color: #f0c34c;
		width: 590rpx;
		height: 84rpx;
		color: #282828;
		font-size: 48rpx;
		margin: 0 auto;
		border-radius: 0 0 20rpx 20rpx;
		text-align: center;
		padding-top: 4rpx;
	}

	.order-details .writeOff .rules {
		margin: 46rpx 30rpx 0 30rpx;
		border-top: 1px solid #f0f0f0;
		padding-top: 10rpx;
	}

	.order-details .writeOff .rules .item {
		margin-top: 20rpx;
	}

	.order-details .writeOff .rules .item .rulesTitle {
		font-size: 28rpx;
		color: #282828;
	}

	.order-details .writeOff .rules .item .rulesTitle .iconfont {
		font-size: 30rpx;
		color: #333;
		margin-right: 8rpx;
		margin-top: 5rpx;
	}

	.order-details .writeOff .rules .item .info {
		font-size: 28rpx;
		color: #999;
		margin-top: 7rpx;
	}

	.order-details .writeOff .rules .item .info .time {
		margin-left: 20rpx;
	}

	.order-details .map {
		font-size: 30rpx;
		color: #282828;
		margin-top: 15rpx;
		background-color: #fff;
		padding: 0 24rpx;

		.title {
			line-height: 86rpx;
			border-bottom: 1px solid #f0f0f0;
		}
	}

	.order-details .map .place {
		font-size: 26rpx;
		width: 176rpx;
		height: 50rpx;
		border-radius: 25rpx;
		line-height: 50rpx;
		text-align: center;
	}

	.order-details .map .place .iconfont {
		font-size: 27rpx;
		height: 27rpx;
		line-height: 27rpx;
		margin: 2rpx 3rpx 0 0;
	}

	.order-details .address .name .iconfont {
		font-size: 34rpx;
		margin-left: 10rpx;
	}

	.refund {
		padding: 0 !important;
		margin-top: 15rpx;
		background-color: #fff;

		.title {
			display: flex;
			align-items: center;
			font-size: 30rpx;
			color: #333;
			height: 86rpx;
			border-bottom: 1px solid #f5f5f5;
			font-weight: 400;
			padding: 0 24rpx;

			image {
				width: 32rpx;
				height: 32rpx;
				margin-right: 10rpx;
			}
		}

		.con {
			font-size: 26rpx;
			color: #666666;
			padding: 30rpx 24rpx;
		}
	}

	.pictrue {
		width: 130rpx;
		height: 130rpx;
		border-radius: 14rpx;
		overflow: hidden;

		image {
			width: 100%;
			height: 100%;
		}
	}

	.text {
		width: 490rpx;

		// position: relative;
		.name {
			font-size: 28rpx;
			color: #282828;
		}

		.attr {
			font-size: 16rpx;
			color: #868686;
			margin-top: 7rpx
		}
	}

	.wrapper-head {
		background-color: #fff;
		margin-top: 12rpx;
		padding: 30rpx 24rpx;

	}

	.wrapper-info {
		background-color: #fff;
		margin: -100rpx auto 0 auto;
		padding: 15px 12px;

		.name {
			width: 414rpx;
			color: #333;
		}

		.num {
			color: #999;
		}

		.attr {
			color: #999;
			font-size: 20rpx;
			margin: 7rpx 0 16rpx 0;
		}

		.price {
			font-size: 26rpx;
			color: #E93323;
		}
	}

	.borRadius-top {
		border-radius: 14rpx 14rpx 0px 0px;
	}

	.borRadius-bottom {
		border-radius: 0px 0px 14rpx 14rpx;
	}

	.conter-refund {
		width: 76%;
		text-align: right;
		color: #868686;

		.wapImg {
			width: 106rpx;
			height: 106rpx;
			border-radius: 10rpx;
			margin-right: 10rpx;
		}
	}
</style>