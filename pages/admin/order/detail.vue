<template>
	<view>
		<!-- #ifdef MP || APP-PLUS -->
		<NavBar titleText="订单详情" :iconColor="iconColor" :textColor="iconColor" :isScrolling="isScrolling" showBack>
		</NavBar>
		<!-- #endif -->
		<view class="headerBg">
			<view :style="{ height: `${getHeight.barTop}px` }"></view>
			<view :style="{ height: `${getHeight.barHeight}px` }"></view>
			<view class="inner"></view>
		</view>
		<view class="order-detail pos-order-details">
			<view class="header">
				<view class="state">{{ info.refundStatus != 3?orderStatus[info.status]:'已退款' }}</view>
				<view v-if="[1,2].includes(info.status)&&info.refundStatus != 3" class="data">用户已下单，请及时发货哦～</view>
				<view v-if="info.refundStatus != 3&&info.status == 4" class="data">货物正在运输中，等待用户确认收货！</view>
				<view v-if="info.refundStatus != 3&&info.status == 3" class="data">用户已下单，您可以联系用户到店自提！</view>
				<view v-if="info.refundStatus != 3&&info.status == 5" class="data">用户已经确认收货啦，您可以联系用户索要好评呦！</view>
				<view v-if="info.refundStatus != 3&&info.status == 6" class="data">订单已经完成，您可以申请货款提现啦～</view>
				<view v-if="info.refundStatus == 3" class="data">此订单退款已原路返回！</view>
			</view>
			<view class="remarks acea-row row-middle" @click="modify('1')">
				<text class="iconfont icon-ic_notes"></text>
				<view class="line1 mark-box" style="text-align: left;">
					{{info.merchantRemark ? info.merchantRemark : '订单未备注，点击添加备注信息'}}
				</view>
			</view>
			<view class="address" v-if="info.shippingType==1&&info.secondType!=2">
				<view class="name">
					<text class="iconfont icon-ic_location4"></text>
					{{ info.realName}}
					<text class="phone">{{ info.userPhone }}</text>
				</view>
				<view v-if="info.shippingType == 1">地址：{{ info.userAddress }}</view>
			</view>
			<view class="acea-row row-middle user-box">
				<image :src="info.avatar" class="image"></image>
				<view class="text">
					<view class="acea-row row-middle name">
						{{info.nickname}}
					</view>
					<view v-if="info.phone" class="">{{info.phone}}（ID:{{info.uid}}）</view>
					<view v-else class="">ID:{{info.uid}}</view>
				</view>
			</view>
			<!-- 未拆单时，正常单 -->
			<view class="pos-order-goods split">
				<navigator :url="`/pages/goods_details/index?id=${item.product_id}`" hover-class="none"
					class="goods acea-row" v-for="(item, index) in info.orderDetailList" :key="index">
					<view class="picTxt acea-row">
						<view class="pictrue">
							<image :src="item.image" />
						</view>
						<view class="text info-text">
							<view class="info line1">{{ item.productName }}</view>
							<view class="attr line1">{{ item.sku }}</view>
						</view>
					</view>
					<view class="money">
						<BaseMoney :money="item.price" symbolSize="20" integerSize="32" decimalSize="20"></BaseMoney>
						<view class="num">共{{ item.payNum }}件</view>
						<view class="acea-row row-right">
							<view class="writeOff" v-if="item.refundNum">
								{{item.refundNum}}件已退款
							</view>
						</view>
					</view>
				</navigator>
				<view class="mark acea-row" v-if="info.userRemark">
					<view class="name">买家留言：</view>
					<view class="value line1">{{info.userRemark}}</view>
				</view>
			</view>
			<!-- 结束 -->
			<view class="wrapper">
				<view class="item acea-row row-between">
					<view>订单编号：</view>
					<view class="conter acea-row row-middle row-right">
						{{ info.orderNo}}
						<!-- #ifdef H5 -->
						<text class="copy copy-data" :data-clipboard-text="info.orderNo">复制</text>
						<!-- #endif -->
						<!-- #ifdef MP -->
						<text class="copy copy-data" @click="copyNum(info.orderNo)">复制</text>
						<!-- #endif -->
					</view>
				</view>
				<view class="item acea-row row-between">
					<view>下单时间：</view>
					<view class="conter">{{ info.payTime }}</view>
				</view>
				<view class="item acea-row row-between">
					<view>支付方式：</view>
					<view class="conter">
						{{payType[info.payChannel]}}
					</view>
				</view>
				<view class="item acea-row row-between">
					<view>支付时间：</view>
					<view class="conter">
						{{info.payTime}}
					</view>
				</view>
				<view class="item acea-row row-between">
					<view>下单时间：</view>
					<view class="conter">
						{{info.createTime}}
					</view>
				</view>
			</view>
			<view class="wrapper" v-if="info.deliveryType != 'fictitious'">
				<view class="item acea-row row-between">
					<view>配送方式：</view>
					<view v-if="Number(info.secondType) > 4" class='conter'>自动发货</view>
					<view v-else-if="Number(info.secondType) == 2" class='conter'>虚拟发货</view>
					<view class="conter" v-else>
						{{info.shippingType==1?'商家配送':info.shippingType==2?'到店自提':'虚拟发货'}}
					</view>
				</view>
			</view>
			<view class="wrapper" v-if="info.orderExtend&&JSON.parse(info.orderExtend).length">
				<systemFromInfo :orderExtend="JSON.parse(info.orderExtend)"></systemFromInfo>
			</view>
			<view class="wrapper">
				<view class='item acea-row row-between'>
					<view>商品总价（共{{info.totalNum}}件）</view>
					<view class='conter'>￥{{info.proTotalPrice}}</view>
				</view>
				<view class="item acea-row row-between">
					<view>运费</view>
					<view class="conter">￥{{ info.totalPostage }}</view>
				</view>
				<view class='item acea-row row-between'>
					<view>会员优惠</view>
					<view class='conter'>-￥{{info.svipDiscountPrice}}</view>
				</view>
				<view class="item acea-row row-between">
					<view>商家优惠</view>
					<view class="conter">-￥{{ info.merCouponPrice }}</view>
				</view>
				<view class='item acea-row row-between'>
					<view>平台优惠</view>
					<view class='conter'>-￥{{info.platCouponPrice}}</view>
				</view>
				<view class='item acea-row row-between'>
					<view>积分抵扣（使用{{info.useIntegral}}积分）</view>
					<view class='conter'>-￥{{info.integralPrice}}</view>
				</view>
				<view class="actualPay acea-row row-right">
					实付款：
					<BaseMoney :money="info.payPrice" symbolSize="24" integerSize="40" decimalSize="24" color="#E93323">
					</BaseMoney>
				</view>
			</view>
			<view class="height-add"></view>
			<view class="footer acea-row row-right row-middle">
				<view class="tomore" v-if="info.status==2&&!info.userRefundSign">
					<span @click="toMore">更多</span>
					<view class="more-operate" v-if="moreShow">
						<view class="sjx"></view>
						<view class="more-operate-item" @click="print">
							小票打印
						</view>
						<view class="more-operate-item" @click="modify('1')">
							订单备注
						</view>
					</view>
				</view>
				<view class="bnt cancel" @click="print" v-if="info.status!=2||(info.status==2&&info.userRefundSign)">
					小票打印</view>
				<view class="bnt cancel" @click="modify('1')"
					v-if="info.status!=2||(info.status==2&&info.userRefundSign)">订单备注</view>
				<view class="bnt cancel" v-if="!info.userRefundSign&&info.totalNum!=refundSum" @click="modify('2',1)">
					直接退款</view>
				<view class="bnt delivery" v-if="[1,2].includes(info.status)&&info.refundStatus != 3"
					@click="goDelivery(info)">立即发货</view>
				<view class="bnt delivery" v-if="[2,4,5,6].includes(info.status)&&info.shippingType=='1'"
					@click="goLogistics(info)">发货记录
				</view>
				<view class="bnt delivery" v-if="info.status==3&&info.refundStatus!=3" @click="verify">立即核销</view>
			</view>
			<PriceChange :change="change" :orderInfo="info" :isRefund="isRefund"
				v-on:statusChange="statusChange($event)" v-on:closechange="changeclose($event)"
				v-on:savePrice="savePrice" :status="status"></PriceChange>
		</view>
		<uni-popup ref="hs_popup" background-color="#fff" borderRadius="10px">
			<view class="sh_popup-content"
				:class="{ 'popup-height': popup_center === 'left' || popup_center === 'right' }">
				<view class="sh_popup_title">
					打印小票
				</view>
				<view class="sh_popup_text">
					你确定要打印此订单小票吗？
				</view>
				<view class="sh_popup_btn">
					<view class="no_btn btn" @click="hsPopupClose">取消</view>
					<view class="yes_btn btn" @click="toRecycle">确认</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>
<script>
	import PriceChange from "../components/PriceChange/index.vue";
	import countDown from '@/components/countDown/index.vue'
	import BaseMoney from "../components/BaseMoney.vue";
	import systemFromInfo from '@/components/systemFromInfo';
	// #ifdef MP || APP-PLUS
	import NavBar from "../components/NavBar.vue";
	// #endif 
	// #ifdef H5
	import ClipboardJS from "@/plugin/clipboard/clipboard.js";
	// #endif
	import {
		employeeOrderInfo,
		employeeOrderMark,
		orderInvoiceListInfo,
		orderGetVerfication,
		printReceipt
	} from '@/api/work.js';
	import {
		isMoney
	} from '@/utils/validate.js'

	export default {
		name: "AdminOrder",
		components: {
			PriceChange,
			countDown,
			BaseMoney,
			systemFromInfo,
			// #ifdef MP || APP-PLUS
			NavBar,
			// #endif
		},
		props: {},
		data: function() {
			return {
				popup_center: 'center',
				moreShow: false,
				payType: {
					'public': '公众号支付',
					'mini': '小程序支付',
					'h5': '网页支付支付',
					'yue': '余额支付',
					'wechatIos': '微信Ios支付',
					'wechatAndroid': '微信Android支付',
					'alipay': '支付宝支付',
					'alipayApp': '支付宝App支付'
				},
				orderStatus: ['待支付', '待发货', '部分发货', '待核销', '待收货', '已收货', '已完成', '已取消'],
				openErp: false,
				giveData: {
					give_integral: 0,
					give_coupon: []
				},
				giveCartInfo: [],
				totalNmu: 0,
				order: false,
				change: false,
				order_id: "",
				status: "",
				title: "标题",
				types: "",
				statusType: '',
				clickNum: 1,
				isRefund: 0, //1是仅退款;0是同意退货退款
				iconColor: '#FFFFFF',
				isScrolling: false,
				getHeight: this.$util.getWXStatusHeight(),
				confirmShow: false,
				info: {},
				refundSum: '',
				orderNo: ''
			};
		},
		onShow() {
			let self = this
			// #ifdef H5
			this.$nextTick(function() {
				var clipboard = new ClipboardJS('.copy-data');
				// var copybtn = document.getElementsByClassName("copy-data");
				// var clipboard = new Clipboard(copybtn);
				clipboard.on('success', function(e) {
					self.$util.Tips({
						title: '复制成功'
					})
				});
				clipboard.on('error', function(e) {
					self.$util.Tips({
						title: '复制失败'
					})
				});
			});
			// #endif
			this.initOrderInfo(this.orderNo)
		},
		onLoad(options) {
			this.orderNo = options.orderNo
			this.initOrderInfo(options.orderNo)
		},
		onPageScroll(e) {
			// #ifdef MP || APP-PLUS
			if (e.scrollTop > 50) {
				this.iconColor = '#333333';
				this.isScrolling = true;
			} else {
				this.iconColor = '#FFFFFF';
				this.isScrolling = false;
			}
			// #endif
		},
		methods: {
			hsPopupClose() {
				this.$refs.hs_popup.close()
			},
			toRecycle() {
				printReceipt(this.info.orderNo).then(res => {
					if (res.code == 200) {
						this.$util.Tips({
							title: '操作成功'
						})
						this.$refs.hs_popup.close()
					}
				})
			},
			hsPopupClose() {
				this.$refs.hs_popup.close()
			},
			print() {
				this.$refs.hs_popup.open('center')
			},
			//更多
			toMore() {
				this.moreShow = !this.moreShow
			},
			initOrderInfo(orderNo) {
				employeeOrderInfo(orderNo).then(res => {
					this.info = res.data
					let refundSum = 0
					let detailList = this.info.orderDetailList
					detailList.forEach(item => {
						refundSum += item.refundNum
					})
					this.refundSum = refundSum
				})
			},
			//核销
			verify() {
				orderGetVerfication({
					verifyCode: this.info.verifyCode
				}).then(res => {
					if (res.code == 200) {
						uni.navigateTo({
							url: `/pages/admin/cancel/list?info=${JSON.stringify(res.data)}&verifyCode=${this.info.verifyCode}`
						})
					} else {
						this.$util.Tips({
							title: res.message
						});
					}
				})
			},
			//发货
			goDelivery(info) {
				if (info.refundStatus == 1) return this.$util.Tips({
					title: '请处理售后，再操作',
				});
				uni.navigateTo({
					url: `/pages/admin/order/send?orderNo=${this.info.orderNo}`
				})

			},
			//发货记录
			goLogistics(info) {
				if (info.secondType == 2) {
					uni.navigateTo({
						url: `/pages/admin/logistics/record?orderNo=${this.orderNo}&index=0&secodeType=2`
					})
				} else {
					orderInvoiceListInfo(info.orderNo).then(res => {
						uni.navigateTo({
							url: `/pages/admin/logistics/index?orderNo=${info.orderNo}`
						})
					})
				}
			},
			modify: function(status, type) {
				if (status == 2) {
					this.isRefund = type
					uni.navigateTo({
						url: `/pages/admin/refund/index?orderNo=${this.info.orderNo}&type=${this.info.type}`
					})
				} else {
					this.change = true;
					this.status = status;
				}
			},
			async savePrice(opt) {
				if (!opt.remark) {
					return this.$util.Tips({
						title: '请输入备注'
					})
				} else {
					this.toMark(this.info.orderNo, opt.remark)
				}
			},
			//备注
			toMark(orderNo, remark) {
				employeeOrderMark({
					orderNo,
					remark
				}).then(res => {
					res.code == 200 && (this.change = false);
					this.initOrderInfo(this.info.orderNo)
					return this.$util.Tips({
						title: '备注成功'
					})
				})
			},
			changeclose: function(msg) {
				this.change = msg;
			},
			//复制
			// #ifdef MP
			copyNum(id) {

				uni.setClipboardData({
					data: id,
					success: function() {}
				});
			},
			// #endif
			// #ifdef H5
			webCopy(item, index) {
				let items = item
				let indexs = index
				let self = this

				if (self.clickNum == 1) {
					self.clickNum += 1
					self.webCopy(items, indexs)
				}
			},
			// #endif
		}
	};
</script>

<style lang="scss" scoped>
	.headerBg {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		background-image: linear-gradient(360deg, #F5F5F5 0%, rgba(245, 245, 245, 0) 100%),
			linear-gradient(270deg, #01ABF8 0%, #2A7EFB 100%);
		background-position: left bottom, left top;
		background-repeat: no-repeat;
		background-size: 100% 120rpx, 100% 100%;

		.inner {
			height: 356rpx;
		}
	}

	.order-detail {
		position: absolute;
		width: 100%;
		padding: 0 20rpx;
	}

	.height-add {
		height: calc(120rpx+ constant(safe-area-inset-bottom)); ///兼容 IOS<11.2/
		height: calc(120rpx + env(safe-area-inset-bottom)); ///兼容 IOS>11.2/
	}

	.giveGoods {
		.item {
			padding: 14rpx 30rpx 14rpx 0;
			margin-left: 30rpx;
			border-top: 1px solid #eee;

			.picTxt {
				.pictrue {
					width: 76rpx;
					height: 76rpx;
					border-radius: 6rpx;
					background-color: #F5F5F5;
					color: #2a7efb;

					.iconfont {
						font-size: 34rpx;
					}

					image {
						width: 100%;
						height: 100%;
						border-radius: 6rpx;
					}

					margin-right: 16rpx;
				}

				.texts {
					width: 360rpx;
					color: #999999;
					font-size: 20rpx;

					.name {
						color: #333;
					}

					.limit {
						font-size: 20rpx;
						margin-top: 4rpx;
					}
				}
			}

			.num {
				color: #999999;
				font-size: 20rpx;
			}
		}
	}

	.splitTitle {
		width: 100%;
		height: 80rpx;
		background-color: #fff;
		margin-top: 17rpx;
		border-bottom: 1px solid #e5e5e5;
		padding: 0 30rpx;
	}

	.splitTitle .title {
		color: #2291f8;
	}

	/*商户管理订单详情*/
	.pos-order-details .header {
		// background: linear-gradient(270deg, #1cd1dc 0%, #2291f8 100%);
	}

	.pos-order-details .header .state {}

	.pos-order-details .header .data {}

	.pos-order-details .header .data .order-num {
		font-size: 26upx;
		margin-bottom: 8upx;
	}

	.pos-order-details .remarks {
		width: 710rpx;
		height: 100rpx;
		background: #FFFFFF;
		border-radius: 14rpx;
		display: flex;
		padding-left: 32rpx;
		border-radius: 24rpx;
		background: #FFFFFF;
	}

	.pos-order-details .remarks .iconfont {
		font-size: 32rpx;
		color: #000000;
	}

	.pos-order-details .remarks input {
		flex: 1;
		height: 100rpx;
		padding-left: 20rpx;
		font-size: 28rpx;
	}

	.pos-order-details .remarks input::placeholder {
		color: #CCCCCC;
	}

	.pos-order-details .orderingUser {
		font-size: 26upx;
		color: #282828;
		padding: 0 30upx;
		height: 67upx;
		background-color: #fff;
		margin-top: 16upx;
		border-bottom: 1px solid #f5f5f5;
	}

	.pos-order-details .orderingUser .iconfont {
		font-size: 40upx;
		color: #2a7efb;
		margin-right: 15upx;
	}

	.pos-order-details .address {
		margin-top: 0;
	}

	.pos-order-details .footer .more {
		font-size: 27upx;
		color: #aaa;
		width: 100upx;
		height: 64upx;
		text-align: center;
		line-height: 64upx;
		margin-right: 25upx;
		position: relative;
	}

	.pos-order-details .footer .delivery {
		border-color: #2A7EFB !important;
		background: #2A7EFB;
		color: #FFFFFF !important;
	}

	.pos-order-details .footer .more .order .arrow {
		width: 0;
		height: 0;
		border-left: 11upx solid transparent;
		border-right: 11upx solid transparent;
		border-top: 20upx solid #e5e5e5;
		position: absolute;
		left: 15upx;
		bottom: -18upx;
	}

	.pos-order-details .footer .more .order .arrow:before {
		content: '';
		width: 0;
		height: 0;
		border-left: 9upx solid transparent;
		border-right: 9upx solid transparent;
		border-top: 19upx solid #fff;
		position: absolute;
		left: -10upx;
		bottom: 0;
	}

	.pos-order-details .footer .more .order {
		width: 200upx;
		background-color: #fff;
		border: 1px solid #eee;
		border-radius: 10upx;
		position: absolute;
		top: -200upx;
		z-index: 9;
	}

	.pos-order-details .footer .more .order .item {
		height: 77upx;
		line-height: 77upx;
	}

	.pos-order-details .footer .more .order .item~.item {
		border-top: 1px solid #f5f5f5;
	}

	.pos-order-details .footer .more .moreName {
		width: 100%;
		height: 100%;
	}

	/*订单详情*/
	.order-detail .header {
		padding: 48rpx 0 30rpx 12rpx;
	}

	.order-detail .header.on {
		background-color: #666 !important;
	}

	.order-detail .header .pictrue {
		width: 110upx;
		height: 110upx;
	}

	.order-detail .header .pictrue image {
		width: 100%;
		height: 100%;
	}

	.order-detail .header .state {
		font-weight: 500;
		font-size: 36rpx;
		line-height: 50rpx;
		color: #FFFFFF;
	}

	.order-detail .header .data {
		margin-top: 8rpx;
		font-size: 26rpx;
		line-height: 36rpx;
		color: #FFFFFF;
	}

	.order-detail .header.on .data {
		margin-left: 0;
	}

	.order-detail .header .data .time {
		margin-left: 20rpx;
	}

	.order-detail .header .data .state {
		font-size: 30upx;
		font-weight: bold;
		color: #fff;
		margin-bottom: 7upx;
	}

	/* .order-details .header .data .time{margin-left:20upx;} */
	.order-detail .nav {
		background-color: #fff;
		font-size: 26upx;
		color: #282828;
		padding: 25upx 0;
	}

	.order-detail .nav .navCon {
		padding: 0 40upx;
	}

	.order-detail .nav .navCon .on {
		font-weight: bold;
		color: #e93323;
	}

	.order-detail .nav .progress {
		padding: 0 65upx;
		margin-top: 10upx;
	}

	.order-detail .nav .progress .line {
		width: 100upx;
		height: 2upx;
		background-color: #939390;
	}

	.order-detail .nav .progress .iconfont {
		font-size: 25upx;
		color: #939390;
		margin-top: -2upx;
		width: 30upx;
		height: 30upx;
		line-height: 33upx;
		text-align: center;
		margin-right: 0 !important;
	}

	.order-detail .address {
		position: relative;
		padding: 32rpx 32rpx 40rpx;
		border-radius: 24rpx;
		margin-top: 20rpx;
		background: #FFFFFF;
		overflow: hidden;
		font-size: 24rpx;
		line-height: 34rpx;
		color: #999999;
	}

	.order-detail .address .name {
		margin-bottom: 12rpx;
		font-weight: 500;
		font-size: 30rpx;
		line-height: 42rpx;
		color: #333333;
	}

	.order-detail .address .name .iconfont {
		margin-right: 8rpx;
		font-size: 32rpx;
	}

	.order-detail .address .name .phone {
		margin-left: 40upx;
	}

	.order-detail .line {
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 4rpx;
	}

	.order-detail .line image {
		width: 100%;
		height: 100%;
		display: block;
	}

	.order-detail .wrapper {
		padding: 32rpx 24rpx;
		border-radius: 24rpx;
		margin-top: 20rpx;
		background: #FFFFFF;
	}

	.order-detail .wrapper .item {
		font-size: 28rpx;
		line-height: 40rpx;
		color: #333333;
	}

	.order-detail .wrapper .item~.item {
		margin-top: 24rpx;
	}

	.order-detail .wrapper .item .conter {
		// color: #868686;
		// width: 468rpx;
		// display: flex;
		// flex-wrap: nowrap;
		// justify-content: flex-end;
		// text-align: right;

		.pictrue {
			width: 80rpx;
			height: 80rpx;
			margin-left: 6rpx;

			image {
				width: 100%;
				height: 100%;
				border-radius: 6rpx;
			}
		}
	}

	.order-detail .wrapper .item .conter .copy {
		height: 36rpx;
		padding: 0 12rpx;
		border: 0;
		border-radius: 18rpx;
		margin-left: 8rpx;
		background: #F5F5F5;
		font-size: 22rpx;
		line-height: 36rpx;
		color: #333333;
	}

	.order-detail .wrapper .actualPay {
		margin-top: 26rpx;
		align-items: center;
	}

	.order-detail .wrapper .actualPay .money {
		font-weight: bold;
		font-size: 30upx;
		color: #e93323;
	}

	.order-detail .footer {
		width: 100%;
		height: 100upx;
		position: fixed;
		bottom: 0;
		left: 0;
		background-color: #fff;
		padding: 0 30upx;
		border-top: 1px solid #eee;
		height: calc(100rpx+ constant(safe-area-inset-bottom)); ///兼容 IOS<11.2/
		height: calc(100rpx + env(safe-area-inset-bottom)); ///兼容 IOS>11.2/
		padding-bottom: calc(0rpx+ constant(safe-area-inset-bottom)); ///兼容 IOS<11.2/
		padding-bottom: calc(0rpx + env(safe-area-inset-bottom)); ///兼容 IOS>11.2/
	}

	.order-detail .footer .wait {
		color: #2a7efb;
		margin-right: 30rpx;
	}

	.order-detail .footer .bnt {
		width: 144rpx;
		height: 56rpx;
		border: 1rpx solid #CCCCCC;
		line-height: 54rpx;
		text-align: center;
		border-radius: 28rpx;
		font-size: 24rpx;
		color: #333333;
		transform: rotateZ(360deg);

		&.on {
			color: #c5c8ce !important;
			background: #f7f7f7 !important;
			border: 1px solid #dcdee2 !important;
		}
	}

	.order-detail .footer .bnt.cancel {
		// color: #333333;
		// border: 1px solid #CCCCCC;
	}

	.order-detail .footer .bnt.default {
		color: #444;
		border: 1px solid #444;
	}

	.order-detail .footer .bnt~.bnt {
		margin-left: 16rpx;
	}

	.pos-order-goods {
		padding: 32rpx 24rpx;
		border-radius: 24rpx;
		background: #FFFFFF;
	}

	.pos-order-goods.split {
		margin-top: 20rpx;
	}

	.pos-order-goods .title {
		height: 40rpx;
		margin-bottom: 32rpx;
		font-size: 28rpx;
		color: #333333;
	}

	.pos-order-goods .title .btn {
		font-size: 26rpx;
		color: #999999;
	}

	.pos-order-goods .title .btn .iconfont {
		font-size: 24rpx;
	}

	.pos-order-goods.split .goods {}

	.pos-order-goods .goods~.goods {
		margin-top: 32rpx;
	}

	.pos-order-goods .goods .picTxt {
		flex: 1;
		min-width: 0;
	}

	.pos-order-goods .goods .picTxt .pictrue {
		width: 136rpx;
		height: 136rpx;
	}

	.pos-order-goods .goods .picTxt .pictrue image {
		width: 100%;
		height: 100%;
		border-radius: 16rpx;
	}

	.pos-order-goods .goods .picTxt .text {
		flex: 1;
		min-width: 0;
		padding-left: 20rpx;
	}

	.pos-order-goods .goods .picTxt .text .info {
		font-size: 28rpx;
		line-height: 40rpx;
		color: #333333;
	}

	.pos-order-goods .goods .picTxt .text .info .label {
		color: #ff4c3c;
	}

	.pos-order-goods .goods .picTxt .text .attr {
		margin-top: 8rpx;
		font-size: 24rpx;
		line-height: 34rpx;
		color: #999999;
	}

	.pos-order-goods .goods .money {
		width: 144rpx;
		text-align: right;
	}

	.pos-order-goods .goods .money .writeOff {
		font-size: 24upx;
		margin-top: 17upx;
		color: #1890FF;
	}

	.pos-order-goods .goods .money .writeOff .on {
		color: #FF7E00;
	}

	.pos-order-goods .goods .money .x-money {
		color: #282828;
	}

	.pos-order-goods .goods .money .num {
		margin-top: 10rpx;
		font-size: 24rpx;
		line-height: 34rpx;
		color: #999999;
	}

	.pos-order-goods .goods .money .y-money {
		color: #999;
		text-decoration: line-through;
	}

	.public-total {
		font-size: 28upx;
		color: #282828;
		border-top: 1px solid #eee;
		height: 92upx;
		line-height: 92upx;
		text-align: right;
		padding: 0 30upx;
		background-color: #fff;
	}

	.public-total .money {
		color: #ff4c3c;
	}

	.copy-data {
		font-size: 10px;
		color: #333;
		-webkit-border-radius: 1px;
		border-radius: 1px;
		border: 1px solid #666;
		padding: 0px 7px;
		margin-left: 12px;
		height: 20px;
	}

	.pos-order-goods .mark {
		margin-top: 32rpx;
		font-size: 28rpx;
		line-height: 40rpx;
		color: #333333;


		.value {
			flex: 1;
		}
	}

	.mask {
		z-index: 21;
	}

	.confirm-popup {
		position: fixed;
		top: 50%;
		right: 75rpx;
		left: 75rpx;
		z-index: 21;
		transform: translateY(-50%);
		border-radius: 32rpx;
		background: #FFFFFF;
		text-align: center;

		.title {
			padding: 40rpx 32rpx 0;
			font-weight: 500;
			font-size: 32rpx;
			line-height: 52rpx;
			color: #333333;
		}

		.info {
			padding: 24rpx 40rpx 0;
			font-size: 30rpx;
			line-height: 42rpx;
			color: #666666;
		}

		.btn-box {
			padding: 40rpx;
		}

		.btn {
			flex: 1;
			height: 72rpx;
			border: 1rpx solid #2A7EFB;
			border-radius: 36rpx;
			margin-left: 32rpx;
			font-weight: 500;
			font-size: 26rpx;
			line-height: 70rpx;
			color: #2A7EFB;
			transform: rotateZ(360deg);

			&.primary {
				background: #2A7EFB;
				color: #FFFFFF;
			}
		}
	}

	.user-box {
		padding: 24rpx;
		border-radius: 24rpx;
		margin-top: 20rpx;
		background: #FFFFFF;

		.image {
			width: 80rpx;
			height: 80rpx;
			border-radius: 50%;
		}

		.text {
			flex: 1;
			padding-left: 20rpx;
			font-size: 24rpx;
			line-height: 34rpx;
			color: #999999;
		}

		.name {
			margin-bottom: 4rpx;
			font-weight: 500;
			font-size: 28rpx;
			line-height: 40rpx;
			color: #333333;
		}

		.svip {
			width: 56rpx;
			height: 26rpx;
			border-radius: 14rpx;
			margin-left: 12rpx;
			background: linear-gradient(90deg, #484643 0%, #1F1B17 100%);
			text-align: center;
			font-weight: 600;
			font-size: 18rpx;
			line-height: 26rpx;
			color: #FDDAA4;
		}

		.grade {
			height: 26rpx;
			padding: 0 10rpx;
			border: 1rpx solid #FACC7D;
			border-radius: 14rpx;
			margin-left: 10rpx;
			background: #FEF0D9;
			font-weight: 500;
			font-size: 18rpx;
			line-height: 24rpx;
			color: #DFA541;
			transform: rotateZ(360deg);

			.iconfont {
				margin-right: 6rpx;
				font-size: 18rpx;
			}
		}
	}

	.tomore {
		font-weight: 400;
		font-size: 24rpx;
		color: #333333;
		margin-right: 20rpx;
		position: relative;
	}

	.more-operate {
		position: absolute;
		top: -120rpx;
		left: -50rpx;
		width: 150rpx;
		height: 100rpx;
		background: #fff;
		border: 1px solid #eee;
		border-radius: 10rpx;

		.sjx {
			width: 16rpx;
			height: 16rpx;
			background: #fff;
			border: 1px solid #eee;
			position: absolute;
			top: 92rpx;
			left: 68rpx;
			transform: rotateZ(45deg);
		}

		.more-operate-item {
			font-size: 24rpx;
			color: #333333;
			text-align: center;
			height: 50rpx;
			line-height: 50rpx;
		}
	}

	/deep/ .uni-popup__wrapper {
		width: 600rpx;
		height: 310rpx;
		background: #FFFFFF;
		border-radius: 14rpx;
	}

	.sh_popup-content {

		// border-radius: 14rpx;
		// padding-bottom: 20rpx;
		.sh_popup_title {
			font-weight: 500;
			font-size: 32rpx;
			color: #333333;
			text-align: center;
			margin-top: 40rpx;
		}

		.sh_popup_text {
			font-weight: 400;
			font-size: 30rpx;
			color: #666666;
			text-align: center;
			margin-top: 30rpx;
		}

		.sh_popup_btn {
			display: flex;
			justify-content: space-between;
			margin-top: 40rpx;
			padding: 0 47rpx;

			.btn {
				width: 244rpx;
				height: 72rpx;
				border-radius: 50rpx;
				text-align: center;
				line-height: 72rpx;
			}

			.no_btn {
				border: 1px solid #2A7EFB;
				color: #2A7EFB;
			}

			.yes_btn {
				background: #2A7EFB;
				color: #FFFFFF;
			}
		}
	}

	.info-text {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.line1 {
		width: 90%;
	}

	.order-details .wrapper {
		padding: 0;
	}
</style>