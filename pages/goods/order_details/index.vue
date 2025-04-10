<template>
	<view :data-theme="theme">
		<view class='order-details'>
			<!-- 给header上与data上加on为退款订单-->
			<view class='header bg_color'>
				<view class='picTxt acea-row row-middle'>
					<view class='data'>
						<view v-if="orderInfo.refundStatus == 3"  class='state'>已退款</view>
						<view v-else class='state'>{{orderInfo.status | orderStatusFilter}}</view>
						<view v-if="orderInfo.refundReasonTime !== null">{{orderInfo.refundReasonTime}}</view>
						<view v-if="orderInfo.createTime && orderInfo.status>0">{{orderInfo.createTime}}</view>
						<view v-if="orderInfo.status===0">请在{{orderInfo.expirationTime}}前完成支付！</view>
					</view>
					<view class="">
						<image class="orderStatusPng" :src="urlDomain+`crmebimage/presets/orderStatus/${statusPng[orderInfo.status]}.png`" mode=""></image>
					</view>
				</view>
			</view>

			<view class="borderPad" style="margin: -100rpx auto 0 auto;">
				<view v-if="orderInfo.status!==9 && (shippingType ===1 || shippingType ===3) && orderInfo.refundStatus !== 3" class='nav'>
					<view class='navCon acea-row row-between-wrapper'>
						<view :class="orderInfo.status == 0 ?'on':''">待付款</view>
						<view :class="orderInfo.status == 1 ? 'on':''">待发货</view>
						<view :class="orderInfo.status == 4 ? 'on':''">待收货</view>
						<view :class="orderInfo.status == 5 ? 'on':''">已收货</view>
						<view :class="orderInfo.status == 6 ? 'on':''">已完成</view>
					</view>
					<!-- 订单状态（0：待支付，1：待发货,2：部分发货， 3：待核销，4：待收货,5：已收货,6：已完成，9：已取消） -->
					<view class='progress acea-row row-between-wrapper'>
						<view class='iconfont'
							:class='(orderInfo.status == 0 ? "icon-webicon318":"icon-yuandianxiao") + " " + (orderInfo.status >= 0 ? "font_color":"")'>
						</view>
						<view class='line' :class='orderInfo.status > 0 ? "bg_color":""'></view>
						<view class='iconfont'
							:class='(orderInfo.status == 1 ? "icon-webicon318":"icon-yuandianxiao") + " " +(orderInfo.status >= 1 ? "font_color":"")'>
						</view>
						<view class='line' :class='orderInfo.status > 2  ? "bg_color":""'></view>
						<view class='iconfont'
							:class='(orderInfo.status == 4 ? "icon-webicon318":"icon-yuandianxiao") + " " + (orderInfo.status >= 4 ? "font_color":"")'>
						</view>
						<view class='line' :class='orderInfo.status > 4 ? "bg_color":""'></view>
						<view class='iconfont'
							:class='(orderInfo.status == 5 ? "icon-webicon318":"icon-yuandianxiao") + " " + (orderInfo.status >= 5 ? "font_color":"")'>
						</view>
						<view class='line' :class='orderInfo.status > 5 ? "bg_color":""'></view>
						<view class='iconfont'
							:class='(orderInfo.status == 6 ? "icon-webicon318":"icon-yuandianxiao") + " " + (orderInfo.status >= 6 ? "font_color":"")'>
						</view>
					</view>
				</view>
				<view v-if="shippingType ===2 && orderInfo.refundStatus !== 3" class='nav'>
					<view class='navCon acea-row row-between-wrapper'>
						<view :class="orderInfo.status == 0 ?'on':''">待付款</view>
						<view :class="orderInfo.status == 3 ? 'on':''">待核销</view>
						<view :class="orderInfo.status == 6 ? 'on':''">已收货</view>
					</view>
					<!-- 订单状态（0：待支付，1：待发货,2：部分发货， 3：待核销，4：待收货,5：已收货,6：已完成，9：已取消） -->
					<view class='progress acea-row row-between-wrapper'>
						<view class='iconfont'
							:class='(orderInfo.status == 0 ? "icon-webicon318":"icon-yuandianxiao") + " " + (orderInfo.status >= 0 ? "font_color":"")'>
						</view>
						<view class='line' :class='orderInfo.status > 0 ? "bg_color":""'></view>
						<view class='iconfont'
							:class='(orderInfo.status == 3 ? "icon-webicon318":"icon-yuandianxiao") + " " +(orderInfo.status >= 3 ? "font_color":"")'>
						</view>
						<view class='line' :class='orderInfo.status > 4  ? "bg_color":""'></view>
						<view class='iconfont'
							:class='(orderInfo.status == 5 ? "icon-webicon318":"icon-yuandianxiao") + " " + (orderInfo.status >= 5 ? "font_color":"")'>
						</view>
					</view>
				</view>
				<!-- 收货地址只显示一次 -->
				<view v-if="isUserAddress && secondType !== ProductTypeEnum.Fictitious"
					class='wrapper borRadius14 address'>
					<view class='name'>{{userAddress[0].realName}}<text
							class='phone'>{{userAddress[0].userPhone}}</text></view>
					<view>{{userAddress[0].userAddress}}</view>
				</view>
				<block v-for="(item, index) in orderInfo.merchantOrderList" :key="item.merId">
					<view v-if="item.shippingType == 2 && orderInfo.status == 3 && orderInfo.refundStatus !== 3">
						<view class="writeOff borRadius14">
							<view class="title">核销信息</view>
							<view class="grayBg">
								<view class="pictrue">
									<image :src="codeImg"></image>
								</view>
							</view>
							<view class="gear">
								<image src="../static/images/writeOff.jpg"></image>
							</view>
							<view class="num">{{item.verifyCode}}</view>
							<view class="rules" v-if='item.systemStore'>
								<view class="item">
									<view class="rulesTitle acea-row row-middle">
										<text class="iconfont icon-shijian"></text>核销时间
									</view>
									<view class="info">
										每日：<text class="time">{{item.systemStore.dayTime.replace(',','-')}}</text>
									</view>
								</view>
								<view class="item">
									<view class="rulesTitle acea-row row-middle">
										<text class="iconfont icon-shuoming1"></text>使用说明
									</view>
									<view class="info">可将二维码出示给店员扫描或提供数字核销码</view>
								</view>
							</view>
						</view>
						<view class="map borRadius14">
							<view class='title item acea-row row-between-wrapper'>
								<view>自提地址信息</view>
								<view class="place cart-color acea-row row-center-wrapper" @tap="showMaoLocation(item)">
									<text class="iconfont icon-weizhi"></text>查看位置
								</view>
							</view>
							<view class="address">
								<view class='name' @tap="makePhone(item.merPhone)">{{item.merName}}<text
										class='phone'>{{item.merPhone}}</text><text
										class="iconfont icon-tonghua font-color"></text></view>
								<view>{{item.merAddressDetail}}</view>
							</view>
						</view>
					</view>
					<view class="borRadius14 orderGoodsBox">
						<orderGoods :orderInfo="item" :orderNo="orderNo" :cartInfo="item.orderInfoList" :jump="true"
							:orderData="orderInfo" :secondType="orderInfo.secondType"></orderGoods>
						<!-- v-if="orderInfo.status < 2" -->
						<view class="p-24">
							<view class='item acea-row row-between'>
								<view>配送方式：</view>
								<view v-if="Number(orderInfo.secondType) > 4" class='conter'>自动发货</view>
								<view v-else-if="Number(orderInfo.secondType) === 2" class='conter'>虚拟发货</view>
								<view v-else class='conter'>{{item.shippingType ==1 ? '商家配送': '到店自提'}}</view>
							</view>
						</view>
						<view class='flex justify-between userRemarkBox'>
							<view class="f-s-28 color28">买家留言：</view>
							<view class='cor-86 f-s-28 userRemark'>{{item.userRemark || '-'}}</view>
							<view v-show="!isShow" @click="isShow=!isShow">
								<view class='mark_show f-s-28'>{{item.userRemark}}</view>
							</view>
						</view>
					</view>
					<!-- <view v-if="orderInfo.status > 1" class="p-24 wrapper borRadius14">
						<view class='item acea-row row-between'>
							<view>配送方式：</view>
							<view v-if="Number(orderInfo.secondType) > 4" class='conter'>自动发货</view>
							<view v-else-if="secondType === ProductTypeEnum.Fictitious" class='conter'>虚拟发货</view>
							<view v-else class='conter'>{{item.shippingType ==1 ? '商家配送': '到店自提'}}</view>
						</view>
					</view> -->
				</block>
			</view>

			<!-- 系统表单信息 "-->
			<view v-if="orderExtend.length" class="borderPad">
				<view class='wrapper borRadius14'>
					<systemFromInfo :orderExtend="orderExtend"></systemFromInfo>
				</view>
			</view>


			<!-- 订单信息 "-->
			<view class="borderPad">
				<view class='wrapper borRadius14'>
					<view class='item acea-row row-between'>
						<view>订单编号：</view>
						<view class='conter acea-row row-middle row-right' style="width: auto;"><text
								class="text-overflow">{{orderInfo.orderNo}}</text>
							<!-- #ifndef H5 -->
							<text class='copy line-heightOne' @tap='handleCopy(orderInfo.orderNo)'>复制</text>
							<!-- #endif -->
							<!-- #ifdef H5 -->
							<text class='copy copy-data' :data-clipboard-text="orderInfo.orderNo">复制</text>
							<!-- #endif -->
						</view>
					</view>
					<view class='item acea-row row-between'>
						<view>下单时间：</view>
						<view class='conter'>{{(orderInfo.createTime || 0)}}</view>
					</view>
					<view class='item acea-row row-between'>
						<view>支付状态：</view>
						<view class='conter' v-if="orderInfo.paid">已支付</view>
						<view class='conter' v-else>未支付</view>
					</view>
					<view
						v-show="(orderInfo.payType && secondType !== ProductTypeEnum.Integral) || (secondType === ProductTypeEnum.Integral && orderInfo.payPrice!=0)"
						class='item acea-row row-between'>
						<view>支付方式：</view>
						<view class='conter'>{{orderInfo.payType | payTypeFilter}}</view>
					</view>
				</view>
				<view>
					<view class='wrapper borRadius14' v-if='orderInfo.deliveryType=="express"'>
						<view class='item acea-row row-between'>
							<view>配送方式：</view>
							<view class='conter'>发货</view>
						</view>
						<view class='item acea-row row-between'>
							<view>快递公司：</view>
							<view class='conter'>{{orderInfo.deliveryName || ''}}</view>
						</view>
						<view class='item acea-row row-between'>
							<view>快递号：</view>
							<view class='conter'>{{orderInfo.deliveryId || ''}}</view>
						</view>
					</view>
					<view class='wrapper borRadius14' v-else-if='orderInfo.deliveryType=="send"'>
						<view class='item acea-row row-between'>
							<view>配送方式：</view>
							<view class='conter'>送货</view>
						</view>
						<view class='item acea-row row-between'>
							<view>配送人姓名：</view>
							<view class='conter'>{{orderInfo.deliveryName || ''}}</view>
						</view>
						<view class='item acea-row row-between'>
							<view>联系电话：</view>
							<view class='conter acea-row row-middle row-right'>{{orderInfo.deliveryId || ''}}<text
									class='copy' @tap='goTel'>拨打</text></view>
						</view>
					</view>
					<view class='wrapper borRadius14' v-else-if='orderInfo.deliveryType=="fictitious"'>
						<view class='item acea-row row-between'>
							<view>虚拟发货：</view>
							<view class='conter'>已发货，请注意查收</view>
						</view>
					</view>
				</view>
				<view class='wrapper borRadius14'>
					<view class='item acea-row row-between'>
						<view>商品总价：</view>
						<!-- 积分价格 -->
						<PointsPrice v-if="secondType === ProductTypeEnum.Integral" :pointsPrice="pointsPrice"
							:pointsGoodsStyle="hotPointsStyle"></PointsPrice>
						<!-- 其他价格 -->
						<view v-else class='conter'>￥{{orderInfo.proTotalPrice || 0}}</view>
					</view>
					<view class='item acea-row row-between' v-if="orderInfo.payPostage > 0">
						<view>运费：</view>
						<view class='conter'>￥{{orderInfo.payPostage || 0}}</view>
					</view>
					<view class='item acea-row row-between' v-if='orderInfo.svipDiscountPrice > 0'>
						<view>会员优惠：</view>
						<view class='conter'>-￥{{orderInfo.svipDiscountPrice || 0}}</view>
					</view>
					<view class='item acea-row row-between' v-if='orderInfo.merCouponPrice > 0'>
						<view>店铺优惠：</view>
						<view class='conter'>-￥{{orderInfo.merCouponPrice || 0}}</view>
					</view>
					<view class='item acea-row row-between' v-if='orderInfo.platCouponPrice > 0'>
						<view>平台优惠：</view>
						<view class='conter'>-￥{{orderInfo.platCouponPrice || 0}}</view>
					</view>
					<view class='item acea-row row-between' v-if="orderInfo.integralPrice > 0">
						<view>积分抵扣：</view>
						<view class='conter'>-￥{{orderInfo.integralPrice || 0}}</view>
					</view>
					<view v-show="secondType !== ProductTypeEnum.Integral" class='actualPay acea-row row-right'>
						实付款<text class='money'>￥{{orderInfo.payPrice || 0}}</text>
					</view>
				</view>
				<view style='height:120rpx;'></view>
				
				<!-- 底部按钮 -->
				<view v-show="isShowBtn" class='footer acea-row row-right row-middle'>
					<view class="qs-btn" v-show="orderInfo.status==0" @click.stop="cancelOrder">取消订单</view>
					<view class='bnt bg_color' v-show="orderInfo.combinationId > 0" @tap='goJoinPink'>查看拼团</view>
					<view class='bnt cancel'
						v-show="Number(orderInfo.status) >1 &&Number(orderInfo.status) < 9 && orderInfo.status!=3&&shippingType===1"
						@tap='godeliverRecord'>发货记录
					</view>
					<view class='bnt bg_color' v-show="orderInfo.status==4 && orderInfo.refundStatus!==3" @tap='confirmOrder'>确认收货</view>
					<view class='bnt cancel' v-show="orderInfo.status==6 || orderInfo.status==9" @tap='delOrder'>删除订单
					</view>
					<view class='bnt bg_color' v-show="orderInfo.status==0" @tap='goPay(orderInfo)'>立即付款</view>
					<view class='bnt bg_color' v-show="(orderInfo.status>0) && isBuyAgain" @tap='goOrderConfirm'>
						再次购买</view>
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
	import easyLoadimage from '@/components/base/easy-loadimage.vue';
	import {
		getOrderDetail,
		orderTake,
		orderDel,
		orderCancel,
		strToBase64Api,
		orderStatusImgApi
	} from '@/api/order.js';
	import {
		cartBatchAddApi
	} from '@/api/product.js';
	import orderGoods from "../components/orderGoods";
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
	import {
		Debounce
	} from '@/utils/validate.js'
	import {
		ProductTypeEnum,
		ProductMarketingTypeEnum
	} from "../../../enums/productEnums";
	import systemFromInfo from '@/components/systemFromInfo';
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
			fontSize: '28rpx',
		},
		unitStyle: {
			fontSize: '26rpx',
		},
	}
	const app = getApp();
	export default {
		components: {
			orderGoods,
			easyLoadimage,
			systemFromInfo,
			PointsPrice
		},
		data() {
			return {
				codeImg: '',
				qrcodeSize: 100,
				orderNo: '',
				cartInfo: [], //购物车产品
				orderInfo: {
					systemStore: {},
					pstatus: {}
				}, //订单详情
				status: {}, //订单底部按钮状态
				totalPrice: '0',
				id: 0, //订单id
				uniId: '',
				utils: this.$util,
				againStatus: 0,
				type: 0, //订单类型 0-普通订单，1-视频号订单,2-秒杀订单
				secondType: 0, //订单二级类型:0-普通订单，1-积分订单，2-虚拟订单，4-视频号订单，5-云盘订单，6-卡密订单
				isShow: true,
				theme: app.globalData.theme,
				bgColor: '#e93323',
				userAddress: [],
				shippingType: 1,
				statusPic: '',
				isUserAddress: false, //是否只显示一次收货地址
				ProductMarketingTypeEnum: ProductMarketingTypeEnum,
				ProductTypeEnum: ProductTypeEnum,
				orderExtend: [], //系统表单数据
				isSplitDelivery: false, //是否拆单发货
				deliveryType: '', // 配送方式
				hotPointsStyle: hotPointsStyle,
				urlDomain: this.$Cache.get("imgHost"),
				statusPng:['beforPay','beforSend','beforSend','beforSend','beforResaved','orderDone','orderDone','','','orderCancel']
			};
		},
		computed: {
			//是否可以再次购买
			isBuyAgain() {
				return this.type === ProductMarketingTypeEnum.Normal && this.secondType === ProductTypeEnum.Normal && !this
					.orderExtend.length
			},
			...mapGetters(['isLogin', 'chatUrl', 'userInfo']),
			//积分价格
			pointsPrice() {
				return {
					redeemIntegral: this.orderInfo.redeemIntegral,
					price: this.orderInfo.proTotalPrice
				}
			},
			//是否展示底部操作按钮
			//<!-- 订单状态（0：待支付，1：待发货,2：部分发货， 3：待核销，4：待收货,5：已收货,6：已完成，9：已取消） -->
			//	<!-- 已退款的订单详情中，不支持任何操作。 orderInfo.refundStatus !== 3,拼团已退款订单还可进行【查看拼团】操作-->
			isShowBtn() {
				return (this.orderInfo.status!=3 && this.orderInfo.status!=1) || this.orderInfo.refundStatus !== 3 || (this.orderInfo.refundStatus == 3 && this.type !== this.ProductMarketingTypeEnum.Groupbuying)
			},
		},
		onLoad: function(options) {
			if (!options.orderNo) return this.$util.Tips({
				title: '缺少参数'
			}, {
				tab: 3,
				url: 1
			});
			this.$set(this, 'orderNo', options.orderNo);
			this.bgColor = setThemeColor();
			uni.setNavigationBarColor({
				frontColor: '#ffffff',
				backgroundColor: this.bgColor,
			});
		},
		onShow() {
			if (this.isLogin) {
				this.getOrderInfo();
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
			//发货记录
			godeliverRecord() {
				uni.showLoading({
					title: '加载中...'
				});
				let order_logistics = `/pages/goods/order_logistics/index?orderNo=${this.orderInfo.orderNo}`
				let send_record = `/pages/goods/send_record/index?orderNo=${this.orderNo}&index=0`
				if (this.isSplitDelivery) {
					uni.navigateTo({
						url: order_logistics
					});
				} else {
					let url = this.deliveryType === 'express' ? order_logistics : send_record
					uni.navigateTo({
						url: url
					})
				}
			},
			/**
			 * 打开支付组件
			 *
			 */
			goPay: Debounce(function(item) {
				uni.showLoading({
					title: '加载中...'
				});

				uni.navigateTo({
					url: `/pages/goods/order_payment/index?orderNo=${item.orderNo}&payPrice=${item.payPrice}`
				});
			}),
			/**
			 * 拨打电话
			 */
			makePhone: function(e) {
				uni.makePhoneCall({
					phoneNumber: e
				})
			},
			/**
			 * 打开地图
			 *
			 */
			showMaoLocation: function(e) {
				if (!e.merLatitude || !e.merLongitude) return this.$util.Tips({
					title: '缺少经纬度信息无法查看地图！'
				});
				//#ifdef H5
				if (this.$wechat.isWeixin() === true) {
					this.$wechat.seeLocation({
						latitude: parseFloat(e.merLatitude),
						longitude: parseFloat(e.merLongitude),
						name: e.merName,
						address: e.merAddressDetail,
					}).then(res => {
						console.log('success');
					})
				} else {
					//#endif
					uni.openLocation({
						latitude: parseFloat(e.merLatitude),
						longitude: parseFloat(e.merLongitude),
						scale: 8,
						name: e.merName,
						address: e.merAddressDetail,
						success: function() {

						},
					});
					// #ifdef H5
				}
				//#endif

			},
			orderStatusImg() {
				let that = this;
				orderStatusImgApi().then(res => {
					res.data.map(item => {
						if (item.title === 'await_pay' && this.orderInfo.status === 0) {
							this.statusPic = item.pic
						} else if (item.title === 'await_shipped' && this.orderInfo.status === 1) {
							this.statusPic = item.pic
						} else if (item.title === 'receiving' && this.orderInfo.status === 3) {
							this.statusPic = item.pic
						} else if (item.title === 'spike' && this.orderInfo.status === 2) {
							this.statusPic = item.pic
						} else if (item.title === 'complete' && this.orderInfo.status === 4) {
							this.statusPic = item.pic
						}
					})
				}).catch(err => {
					that.$util.Tips({
						title: err
					});
				});
			},
			/**
			 * 获取订单详细信息
			 *
			 */
			getOrderInfo: function() {
				let that = this;
				uni.showLoading({
					title: "正在加载中"
				});
				getOrderDetail(that.orderNo).then(res => {
					uni.hideLoading();
					let data = res.data;
					that.$set(that, 'orderInfo', data);
					that.$set(that, 'id', data.id);
					that.$set(that, 'type', data.type);
					that.$set(that, 'secondType', data.secondType);
					that.$set(that, 'orderExtend', data.orderExtend ? JSON.parse(data.orderExtend) : []);
					that.orderStatusImg();
					that.userAddress = data.merchantOrderList.filter(item => {
						return item.shippingType === 1
					})
					that.isUserAddress = that.userAddress.length > 0 ? true : false;
					if (data.status !== 0 || data.status !== 9) {
						if (data.merchantOrderList[0].shippingType == 2) that.markCode(data.merchantOrderList[
							0].verifyCode);
					}
					that.$set(that, 'shippingType', data.merchantOrderList[0].shippingType);
					that.$set(that, 'cartInfo', data.merchantOrderList[0].orderInfoList);
					that.$set(that, 'isSplitDelivery', data.merchantOrderList[0].isSplitDelivery);
					that.$set(that, 'deliveryType', data.merchantOrderList[0].deliveryType);

					if (that.orderInfo.refundStatus > 0) {
						uni.setNavigationBarColor({
							frontColor: '#fff',
							backgroundColor: '#666666'
						})
					}
					// if (data.combinationId > 0 || data.bargainId > 0 || data.seckillId > 0) {
					// 	this.againStatus = 1;
					// }
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
			 * 生成二维码
			 */
			markCode(text) {
				strToBase64Api({
					height: '145',
					text: text,
					width: '145'
				}).then(res => {
					this.codeImg = res.data.code
				});
			},
			/**
			 *
			 * 剪切订单号
			 */
			// #ifndef H5
			handleCopy: function(num) {
				uni.setClipboardData({
					data: num
				});
			},
			// #endif
			/**
			 * 打电话
			 */
			goTel: function() {
				uni.makePhoneCall({
					phoneNumber: this.orderInfo.deliveryId
				})
			},
			/**
			 * 去拼团详情
			 *
			 */
			goJoinPink: function() {
				uni.navigateTo({
					url: '/pages/activity/goods_combination_status/index?id=' + this.orderInfo.pinkId,
				});
			},
			/**
			 * 再此购买
			 *
			 */
			goOrderConfirm: Debounce(function() {
				uni.showLoading({
					title: '加载中...'
				});
				let cartListRequest = []
				let that = this;
				this.cartInfo.map(item => {
					cartListRequest.push({
						productId: parseFloat(item.productId),
						productAttrUnique: item.attrValueId,
						cartNum: parseFloat(item.payNum)
					})
				})
				cartBatchAddApi(cartListRequest).then(function(res) {
					uni.switchTab({
						url: '/pages/order_addcart/order_addcart'
					})
				}).catch(res => {
					return this.$util.Tips({
						title: res
					});
				});
			}),
			//确认收货
			confirmOrder: Debounce(function() {
				let that = this;
				let applyRefundNum = 0;
				that.orderInfo.merchantOrderList.map((item) => {
					item.orderInfoList.map((i) => {
						applyRefundNum = Number(i.applyRefundNum) + Number(i.refundNum);
					});
				});
                 // 如果有售后中的，提示
                if (applyRefundNum >0) return uni.showModal({
                	title: '提示',
                	content: '请先撤销售后，再进行收货操作',
					confirmText: '我知道了',
                	success(res) {
                		if (res.confirm) {
                			return
                		}
                	}
                });
				uni.showModal({
					title: '确认收货',
					content: '为保障权益，请收到货确认无误后，再确认收货',
					success: function(res) {
						if (res.confirm) {
							orderTake(that.orderNo).then(res => {
								return that.$util.Tips({
									title: '操作成功',
									icon: 'success'
								}, function() {
									that.getOrderInfo();
								});
							}).catch(err => {
								return that.$util.Tips({
									title: err
								});
							})
						}
					}
				})
			}),
			/**
			 *
			 * 删除订单
			 */
			delOrder: Debounce(function() {
				uni.showModal({
					content: '确定删除该订单',
					cancelText: "取消",
					confirmText: "确定",
					showCancel: true,
					confirmColor: '#f55850',
					success: (res) => {
						if (res.confirm) {
							let that = this;
							orderDel(this.orderNo).then(res => {
								return that.$util.Tips({
									title: '删除成功',
									icon: 'success'
								}, {
									tab: 4,
									url: '/pages/user/index'
								});
							}).catch(err => {
								return that.$util.Tips({
									title: err
								});
							});
						} else {

						}
					}
				})
			}),
			cancelOrder: Debounce(function() {
				let self = this
				uni.showModal({
					title: '提示',
					content: '确认取消该订单?',
					success: function(res) {
						if (res.confirm) {
							orderCancel(self.orderNo)
								.then((data) => {
									self.$util.Tips({
										title: '取消成功'
									}, {
										tab: 4,
										url: '/pages/user/index'
									})
								}).catch((err) => {
									self.$util.Tips({
										title: err
									})
									self.getDetail();
								});
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			})
		}
	}
</script>

<style scoped lang="scss">
	@import '../static/css/order_details.scss';
	.orderStatusPng{
		width: 128rpx;
		height: 128rpx;
	}
	.picTxt{
		justify-content: space-between;
	}
</style>