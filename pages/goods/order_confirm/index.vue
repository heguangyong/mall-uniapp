<template>
	<view :data-theme="theme">
		<!-- #ifndef APP-PLUS -->
		<view class='cart_nav'>
			<nav-bar :navTitle='navTitle' iconColor='#fff' :isBackgroundColor="true" ref="navBarRef"></nav-bar>
		</view>

		<!-- #endif -->
		<view class='order-submission' @touchstart="touchStart">
			<!-- 拼团切换样式 -->
			<view class="allAddress"
				v-if="Number(orderInfoVo.secondType)<5 && Number(orderInfoVo.secondType)!==2&&orderInfoVo.type==2">
				<view class="h-96 relative"
					v-if="orderInfoVo.merchantInfoList[0].deliveryMethodMer.split(',').length==2">
					<view class="w-full abs-lb rd-t-24rpx flex bg--w111-fff">
						<view class="flex-center w-50p h-76 fs-28 rd-lt-24rpx z-2"
							:class="shippingType == 1 ? 'bg--w111-fff font_color' : 'bg-primary-light'"
							@tap="addressType(1)">商家配送</view>
						<view class="flex-center w-50p h-76 fs-28 rd-rt-24rpx z-2"
							:class="shippingType == 2 ? 'bg--w111-fff font_color' : 'bg-primary-light'"
							@tap="addressType(2)">到店自提</view>
					</view>
					<view class="w-50p rd-t-24rpx bg--w111-fff h-96" :class="shippingType == 1 ? 'abs-lt' : 'abs-rt'">
						<view class="w-full h-full relative active-card"></view>
					</view>
				</view>
				<view class='address   group acea-row row-between-wrapper' :class="orderInfoVo.merchantInfoList[0].deliveryMethodMer.split(',').length == 1?'bd-r-14':''  "   @tap='onAddress'
					v-if='shippingType == 1'>
					<view class='addressCon' v-if="addressInfo.realName">
						<view class='name acea-row'>
							<view class="line1 select-name">{{addressInfo.realName}}</view>
							<view class='phone'>{{addressInfo.phone}}</view>
						</view>
						<view class="acea-row">
							<view class="line1"><text class='default  font_color' v-if="addressInfo.isDefault">[默认]</text>{{addressInfo.province}}{{addressInfo.city}}{{addressInfo.district}}{{ addressInfo.street}}{{addressInfo.detail}}</view>
						</view>
					</view>
					<view class='addressCon' v-else>
						<view class='setaddress'>设置收货地址</view>
					</view>
					<view class='iconfont icon-jiantou mt30'></view>
				</view>
				<view class='address group acea-row row-between-wrapper' v-if='shippingType == 2' :class="orderInfoVo.merchantInfoList[0].deliveryMethodMer.split(',').length == 1?'bd-r-14':''  ">
					<view class='addressCon' v-for="(item, index) in merchantOrderVoList" :key="index"
						@click="goMap(item)">
						<view class='name acea-row'>
							<view class="line1 select-name">{{item.merName}}</view>
							<view class='phone'>{{item.phone}}</view>
						</view>
						<view class="acea-row">
							<view class="line1">{{item.addressDetail}}</view>
						</view>
					</view>
					<view class='iconfont icon-jiantou mt30'></view>
				</view>
				<view class='line'>
					<image src='../static/images/line.png'></image>
				</view>
			</view>
			<view v-if="Number(orderInfoVo.secondType)<5 && Number(orderInfoVo.secondType)!==2&&orderInfoVo.type!=2"
				class="allAddress">
				<view class='address acea-row row-between-wrapper' @tap='onAddress'>
					<view class='addressCon' v-if="addressInfo.realName">
						<view class='name'>{{addressInfo.realName}}
							<text class='phone'>{{addressInfo.phone}}</text>
						</view>
						<view class="acea-row line2">
							<text class='default font_color' v-if="addressInfo.isDefault">[默认]</text>
							<text>{{addressInfo.province}}{{addressInfo.city}}{{addressInfo.district}}{{ addressInfo.street}}{{addressInfo.detail}}</text>
						</view>
					</view>
					<view class='addressCon' v-else>
						<view class='setaddress'>设置收货地址</view>
					</view>
					<view class='iconfont icon-jiantou'></view>
				</view>
				<view class='line'>
					<image src='../static/images/line.png'></image>
				</view>
			</view>
			<view class="borderPad">
				<view v-for="(item, index) in merchantOrderVoList" :key="index" class='wrapper borRadius14'>
					<orderGoods :cartInfo="item.orderInfoList" :orderInfo="item" :secondType="secondType"
						:orderProNum="orderProNum" :isShowBtn="false">
					</orderGoods>
					<view v-show="Number(orderInfoVo.secondType)===0&&orderInfoVo.type!=2" class="boxs">
						<view class='item acea-row row-between-wrapper'>
							<view>配送方式</view>
							<view v-if="item.deliveryMethodMer.length===3 && item.takeTheirSwitch"
								class='discount acea-row row-middle'>
								<text
									@tap="openShowBox(item,index)">{{item.shippingType === 1 ? '商家配送' : '到店自提'}}</text>

								<text @tap="openShowBox(item,index)" class='iconfont icon-jiantou'></text>
							</view>
							<view v-else class='discount'>
								{{item.shippingType === 1 ? '商家配送' : '到店自提'}}
							</view>
						</view>
						<view v-if="item.shippingType == 2 && item.takeTheirSwitch" class="store-address acea-row">
							<view>
								<view class="name phone">{{item.phone}}</view>
								<view class="name w-480px">{{item.addressDetail}}</view>
							</view>
							<view class="map" @click="goMap(item)">
								<text class="iconfont icon-chakanditu"></text>
								<view class="map_text">查看地图</view>
							</view>
						</view>
					</view>
					<view v-show="item.shippingType === 1 && Number(orderInfoVo.secondType)===0"
						class='item acea-row row-between-wrapper'>
						<view>快递费用</view>
						<view v-if='!item.freightFee || item.freightFee == 0' class="noCoupon">免运费</view>
						<view v-else class='money'>￥{{item.freightFee}}</view>
					</view>
					<view v-show="item.svipDiscountPrice != 0&&orderInfoVo.type!=2"
						class='item acea-row row-between-wrapper'>
						<view>会员优惠</view>
						<view class='money'>-￥{{item.svipDiscountPrice}}</view>
					</view>
					<view v-if="isProductType" class='item acea-row row-between-wrapper'>
						<view>店铺优惠</view>
						<view v-if="item.merCouponUserList && item.merCouponUserList.length"
							@tap='couponTap(item.merCouponUserList,item.merId, index)'>
							<view class='discount acea-row row-between-wrapper'>
								<text
									class="couponTitle line1">{{item.couponFee==0?`有${item.merCouponUserList.length}张优惠券可选`:`-￥${item.couponFee}`}}</text>
								<text class='iconfont icon-jiantou'></text>
							</view>
						</view>
						<view v-else class="noCoupon">暂无优惠券</view>
					</view>
					<view class='item acea-row row-between-wrapper' v-if="textareaStatus" style="height: auto;">
						<view>买家留言</view>
						<input placeholder-class='placeholder' value="" name="mark" placeholder='选填买家留言'
							v-model="item.remark" @input='bindHideKeyboard(item.remark,index)'
							style="width: 484rpx;text-align: right;"></input>
					</view>
				</view>
				<!--商品关联系统表单-->
				<view v-if="orderInfoVo.systemFormValue && orderInfoVo.systemFormValue.length"
					class='wrapper borRadius14'>
					<systemFrom v-model="orderInfoVo.systemFormValue"></systemFrom>
					<!--					<systemFrom :orderForm="orderInfoVo.systemFormValue" ></systemFrom>-->
				</view>
				<view class='moneyList borRadius14'>
					<view v-show="secondType !== ProductTypeEnum.Integral" class='item acea-row row-between-wrapper'>
						<view>商品总价</view>
						<view class='money'>￥{{orderInfoVo.proTotalFee || 0}}</view>
					</view>
					<view class='item acea-row row-between-wrapper' v-if="parseInt(orderInfoVo.freightFee) > 0">
						<view>运费：</view>
						<view class='money'>+￥{{orderInfoVo.freightFee}}</view>
					</view>
					<view v-show="orderInfoVo.svipDiscountPrice != 0 &&orderInfoVo.type!=2"
						class='item acea-row row-between-wrapper'>
						<view>会员优惠</view>
						<view class='money'>-￥{{orderInfoVo.svipDiscountPrice}}</view>
					</view>
					<view class='item acea-row row-between-wrapper' v-if="parseInt(merCouponFee) > 0 && isProductType">
						<view>店铺优惠</view>
						<view class='money'>-￥{{merCouponFee}}</view>
					</view>
					<view v-if="isProductType" class='item acea-row row-between-wrapper'>
						<view>平台优惠</view>
						<view v-if="orderInfoVo.platCouponUserList && orderInfoVo.platCouponUserList.length"
							class='discount acea-row row-between-wrapper'
							@tap='couponTap(orderInfoVo.platCouponUserList,0)'>
							<text
								class="couponTitle line1">{{platCouponFee==0?`有${orderInfoVo.platCouponUserList.length}张优惠券可选`:`-￥${platCouponFee}`}}</text>
							<text class='iconfont icon-jiantou'></text>
						</view>
						<view v-else class="noCoupon">暂无优惠券</view>
					</view>
					<view class='item acea-row row-between-wrapper'
						v-if="orderInfoVo.integralDeductionSwitch && isProductType">
						<view>积分抵扣</view>
						<view class='discount acea-row row-middle'>
							<view class="mr14"> {{isUseIntegral ? "使用积分":"当前积分"}}
								<text
									class='num font_color'>{{ isUseIntegral ? orderInfoVo.surplusIntegral : orderInfoVo.userIntegral}}</text>
							</view>
							<checkbox-group @change="ChangeIntegral">
								<checkbox :checked='isUseIntegral ? true : false'
									:disabled="orderInfoVo.userIntegral==0 && !isUseIntegral" />
							</checkbox-group>
						</view>
					</view>

					<view class='item acea-row row-between-wrapper' v-if="Number(orderInfoVo.deductionPrice) > 0">
						<view>抵扣金额</view>
						<view class='money'>-￥{{orderInfoVo.deductionPrice}}</view>
					</view>

				</view>
				<view style='height:120rpx;'></view>
			</view>
			<view class='footer acea-row row-between-wrapper'>
				<view class="acea-row row-middle">合计：
					<!-- 积分价格 -->
					<PointsPrice v-if="orderInfoVo.secondType === ProductTypeEnum.Integral" :pointsPrice="orderInfoVo"
						:pointsGoodsStyle="hotPointsStyle"></PointsPrice>
					<!-- 其他价格 -->
					<text v-else class='price_color'>￥{{orderInfoVo.payFee || 0}}</text>
				</view>
				<view class='settlement' style='z-index:100' @tap="SubOrder">
					{{secondType === ProductTypeEnum.Integral?"确认兑换":"立即下单"}}
				</view>
			</view>
		</view>
		<couponListWindow :coupon='coupon' @ChangCouponsClone="ChangCouponsClone" :openType='openType'
			@ChangCoupons="ChangCoupons" :orderShow="orderShow" :surplusFee="surplusFee"></couponListWindow>

		<view v-if="isShowBox">
			<checkDelivery :isShowBox="isShowBox" :activeObj="activeObj" @close="boxClose"
				@confirmBtn="getShippingType">
			</checkDelivery>
		</view>
		<!-- 满员提示 -->
		<uni-popup ref="sh_popup" background-color="#fff" borderRadius="10px">
			<view class="sh_popup-content">
				<view class="sh_popup_title">
					提示
				</view>
				<view class="sh_popup_text">
					该团已拼成，是否自行开团？
				</view>
				<view class="sh_popup_btn">
					<view class="no_btn btn font_color" @click="popupClose">返回首页</view>
					<view class="yes_btn btn" @click="toAudit">去开团</view>
				</view>
			</view>
		</uni-popup>
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
		getCouponsOrderPrice,
		orderCreate,
		postOrderComputed,
		loadPreOrderApi
	} from '@/api/order.js';
	import {
		getAddressDetail,
		getAddressDefault
	} from '@/api/user.js';
	// import {
	// 	openPaySubscribe
	// } from '@/utils/SubscribeMessage.js';
	import {
		takeTheirApi
	} from '@/api/merchant.js';
	import {
		CACHE_LONGITUDE,
		CACHE_LATITUDE
	} from '@/config/cache.js';
	import dayjs from "@/plugin/dayjs/dayjs.min.js";
	import couponListWindow from '../components/couponListWindow';
	import orderGoods from '../components/orderGoods'
	import navBar from '@/components/navBar';
	import checkDelivery from '../components/checkDelivery/index.vue';
	import systemFrom from '../components/systemFrom/index.vue';
	import PointsPrice from '@/components/PointsPrice.vue';
	import {
		toLogin
	} from '@/libs/login.js';
	import {
		mapGetters
	} from "vuex";
	import {
		Debounce
	} from '@/utils/validate.js'
	import {
		ProductTypeEnum,
		ProductMarketingTypeEnum
	} from "../../../enums/productEnums";
	import orderPay from "@/mixins/OrderPay.js";
	let app = getApp();
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
	export default {
		mixins: [orderPay],
		components: {
			navBar,
			couponListWindow,
			orderGoods,
			checkDelivery,
			systemFrom,
			PointsPrice
		},
		computed: {
			// 是否可以使用优惠券、积分抵扣。 基础订单/云盘订单，卡密,虚拟，可以使用优惠券、积分抵扣
			isProductType() {
				return this.type === ProductMarketingTypeEnum.Normal && this.secondType !== this.ProductTypeEnum
					.Integral && this.secondType !== this.ProductTypeEnum.Video
			},
			...mapGetters(['productType', 'isLogin'])
		},
		data() {
			return {
				hotPointsStyle: hotPointsStyle,
				ProductMarketingTypeEnum: ProductMarketingTypeEnum,
				ProductTypeEnum: ProductTypeEnum,
				navTitle: '提交订单',
				homeTop: 20,
				orderShow: 'orderShow', //下单页面使用优惠券组件不展示tab切换页
				textareaStatus: true,
				openType: 1, //优惠券打开方式 1=使用
				couponShow: false,
				coupon: {
					coupon: false,
					list: [], //商户优惠券
					statusTile: '立即使用',
					couponMoney: 0
				}, //优惠券组件
				addressInfo: {}, //地址信息
				addressId: 0, //地址id
				orderMerchantRequestList: [], //商户属性集合
				cartId: '', //购物车id
				userInfo: {}, //用户信息
				mark: '', //买家留言
				couponFee: '请选择', //优惠券
				coupon_price: 0, //优惠券抵扣金额
				isUseIntegral: false, //是否使用积分
				integral_price: 0, //积分抵扣金额
				integral: 0,
				ChangePrice: 0, //使用积分抵扣变动后的金额
				formIds: [], //收集formid
				status: 0,
				is_address: false,
				toPay: false, //修复进入支付时页面隐藏从新刷新页面
				shippingType: 1,
				storePostage: 0,
				contacts: '',
				contactsTel: '',
				mydata: {},
				merchantOrderVoList: [],
				priceGroup: {},
				animated: false,
				totalPrice: 0,
				integralRatio: "0",
				orderKey: "",
				// usableCoupon: {},
				offlinePostage: "",
				news: true,
				again: false,
				addAgain: false,
				bargain: false, //是否是砍价
				combination: false, //是否是拼团
				secKill: false, //是否是秒杀
				orderInfoVo: {},
				addressList: [], //地址列表数据
				orderProNum: 0,
				orderNo: '', //预下单订单号
				theme: app.globalData.theme,
				addressChangeId: 0,
				isShowBox: false,
				activeObj: {},
				activeIndex: 0, // 选中店铺索引
				type: 0, // 0-基础订单,1-秒杀订单,2-拼团订单
				secondType: 0, //订单二级类型:0-普通订单，1-积分订单，2-虚拟订单，4-视频号订单，5-云盘订单，6-卡密订单
				merId: 0, //商户id，用于判断商户优惠券还是平台优惠券，平台优惠券商户id为0
				platUserCouponObj: {}, //平台优惠券对象，用于缓存数据使用
				platUserCouponId: 0, //平台优惠券id
				platCouponFee: '', //平台优惠券金额
				merCouponFee: '', //店铺优惠券总金额
				surplusFee: 0, //商品总金额-商户优惠券金额=平台端可使用优惠券的门槛
				merUserCouponId: 0, //店铺使用优惠券的id
				tempCouponObj: {}, //临时优惠券数据
				merchangtInfo: {}, //商户信息
				orderForm: [], //系统表单配置的数据
				orderExtend: {}, //提交接口表单的数据
				productId:'',
				groupActivityId:''
			};
		},
		watch: {
			isLogin: {
				handler: function(newV, oldV) {
					if (newV) {
						this.getloadPreOrder();
					}
				},
				deep: true
			},
		},
		onLoad(options) {
			this.orderNo = options.orderNo || 0;
			this.addressChangeId = parseInt(options.addressId) || 0;
			this.is_address = options.is_address ? true : false;
			if (this.isLogin) {
				this.getloadPreOrder();
			} else {
				toLogin();
			}
		},
		/**
		 * 生命周期函数--监听页面显示
		 */
		onShow: function() {
			let _this = this
			this.textareaStatus = true;
		},
		methods: {
      //滚动
      touchStart() {
        this.$refs.navBarRef.currentPage = false;
      },
			popupClose() {
				this.$refs.sh_popup.close()
				uni.switchTab({
					url: '/pages/index/index'
				});
			},
			//去开团
			toAudit() {
				this.$refs.sh_popup.close()
				uni.navigateTo({
					url:`/pages/goods/goods_details/index?id=${this.productId}&mt=2&gd=${this.groupActivityId}`
				})
			},
			addressType(type) {
				this.merchantOrderVoList[0].shippingType = type
				this.getShippingType(this.merchantOrderVoList[0])
				if(type==2){
					setTimeout(()=>{
						this.shippingType = type
					},300)
				}else{
					this.shippingType = type
				}
			},
			//选择配送方式回调 
			getShippingType(item) {
				this.orderMerchantRequestList[this.activeIndex].shippingType = item.shippingType;
				this.$set(this.merchantOrderVoList[this.activeIndex], 'shippingType', item.shippingType);
				if (item.shippingType === 2) this.getTakeTheir(item.merId);
				this.computedPrice();
				this.isShowBox = false;
			},
			getTakeTheir(id) {
				takeTheirApi(id).then(res => {
					this.merchangtInfo = res.data; //商户信息
					this.$set(this.merchantOrderVoList[this.activeIndex], 'addressDetail', res.data.addressDetail);
					this.$set(this.merchantOrderVoList[this.activeIndex], 'phone', res.data.phone);
					this.$set(this.merchantOrderVoList[this.activeIndex], 'latitude', res.data.latitude);
					this.$set(this.merchantOrderVoList[this.activeIndex], 'longitude', res.data.longitude);
				}).catch(err => {
					return this.$util.Tips({
						title: err
					});
				})
			},
			//查看内置地图
			goMap(item) {
				let that = this;
				//#ifdef H5
				if (that.$wechat.isWeixin() === true) {
					that.$wechat.seeLocation({
						latitude: parseFloat(this.merchantOrderVoList[this.activeIndex].latitude),
						longitude: parseFloat(this.merchantOrderVoList[this.activeIndex].longitude),
						name: item.merName,
						address: item.addressDetail ? item.addressDetail : '',
					}).then(res => {
						console.log('success');
					})
				} else {
					//#endif
					uni.openLocation({
						latitude: parseFloat(this.merchantOrderVoList[this.activeIndex].latitude),
						longitude: parseFloat(this.merchantOrderVoList[this.activeIndex].longitude),
						scale: 8,
						name: item.merName,
						address: item.addressDetail ? item.addressDetail : '',
						success: function(res) {
							that.go_map = true
						},
					});
					// #ifdef H5
				}
				//#endif
			},
			// 打开配送方式弹窗
			openShowBox(item, index) {
				this.activeObj = item
				this.activeIndex = index
				this.isShowBox = true
			},
			boxClose() {
				this.isShowBox = false
			},
			// 订单详情
			getloadPreOrder: function() {
				loadPreOrderApi(this.orderNo).then(res => {
					let orderInfoVo = res.data;
					if(orderInfoVo.merchantInfoList[0].orderInfoList[0].groupBuyActivityId){
						this.groupActivityId=orderInfoVo.merchantInfoList[0].orderInfoList[0].groupBuyActivityId
						this.productId=orderInfoVo.merchantInfoList[0].orderInfoList[0].productId
					}
					if (orderInfoVo.merchantInfoList[0].deliveryMethodMer.split(',').length == 1) {
						this.shippingType = orderInfoVo.merchantInfoList[0].deliveryMethodMer
					}
					this.orderInfoVo = {
						...orderInfoVo,
						systemFormValue: orderInfoVo.systemFormValue ? this.$util.objToArr(JSON.parse(
							orderInfoVo.systemFormValue)) : []
					};

					this.merchantOrderVoList = orderInfoVo.merchantInfoList; //商户端数据
					this.platCouponFee = orderInfoVo.platCouponFee; //平台优惠券总金额
					this.platUserCouponId = orderInfoVo.platUserCouponId;
					this.merCouponFee = orderInfoVo.merCouponFee; //店铺优惠券总金额
					orderInfoVo.merchantInfoList.map(item => {
						this.orderMerchantRequestList.push({
							shippingType: item.shippingType,
							merId: item.merId,
							remark: '',
							userCouponId: item.userCouponId
						})
						if (item.shippingType === 2) this.getTakeTheir(item.merId)
						item.addressDetail = this.merchangtInfo.addressDetail;
						item.phone = this.merchangtInfo.phone;
						item.latitude = this.merchangtInfo.latitude;
						item.longitude = this.merchangtInfo.longitude;
					});
					this.type = orderInfoVo.type; //订单类型
					this.secondType = orderInfoVo
						.secondType; //订单二级类型:0-普通订单，1-积分订单，2-虚拟订单，4-视频号订单，5-云盘订单，6-卡密订单
					this.orderProNum = orderInfoVo.orderProNum;
					if (orderInfoVo.addressId && this.addressChangeId === 0) {
						this.addressId = orderInfoVo.addressId;
					} else {
						this.addressId = this.addressChangeId;
						if (orderInfoVo.addressId != this.addressChangeId && this.addressChangeId > 0)
							this.computedPrice();
					}
					this.getaddressInfo();
				}).catch(err => {
					uni.navigateTo({
						url: '/pages/goods/order_list/index'
					});
				})
			},
			// 计算订单价格
			computedPrice: function() {
				uni.showLoading({
					title: '加载中...'
				});
				let shippingType = this.shippingType;
				postOrderComputed({
					addressId: this.addressId,
					isUseIntegral: this.isUseIntegral,
					orderMerchantRequestList: this.orderMerchantRequestList,
					preOrderNo: this.orderNo,
					platUserCouponId: this.platUserCouponId
				}).then(res => {
					let data = res.data;
					//usedIntegral 使用的积分，surplusIntegral 剩余积分
					data.merOrderResponseList.map((item, i) => {
						this.merchantOrderVoList[i].freightFee = item.freightFee
						this.merchantOrderVoList[i].couponFee = item.couponFee
					});
					this.orderInfoVo.platCouponUserList = data.platCouponUserList; //平台优惠券数据
					this.merCouponFee = data.merCouponFee; //店铺优惠券总金额
					this.orderInfoVo.couponFee = data.couponFee; //优惠券优惠金额
					this.orderInfoVo.userIntegral = data.surplusIntegral; //使用的积分
					this.orderInfoVo.deductionPrice = data.deductionPrice;
					this.orderInfoVo.freightFee = data.freightFee;
					this.orderInfoVo.payFee = data.payFee;
					this.orderInfoVo.proTotalFee = data.proTotalFee;
					this.orderInfoVo.surplusIntegral = data.usedIntegral; //剩余积分
					this.platCouponFee = data.platCouponFee; //平台优惠金额
					this.orderInfoVo.integralDeductionSwitch = data.integralDeductionSwitch //积分抵扣开关
					//选中商户优惠券的值
					this.merchantOrderVoList[this.activeIndex].merCouponUserList = data.merOrderResponseList[
						this.activeIndex].merCouponUserList; //商户数据
					this.merUserCouponId = data.merOrderResponseList[this.activeIndex]
						.userCouponId //店铺使用优惠券的id
					uni.hideLoading();
				}).catch(err => {
					uni.hideLoading();
					return this.$util.Tips({
						title: err
					});
				});
			},
			bindPickerChange: function(e) {
				let value = e.detail.value;
				this.shippingType = value;
				this.computedPrice();
			},
			/**
			 * 使用积分抵扣
			 */
			ChangeIntegral: function() {
				this.isUseIntegral = !this.isUseIntegral;
				this.computedPrice();
			},
			bindHideKeyboard: function(e, i) {
				this.orderMerchantRequestList[i].remark = e;
			},
			/*
			 * 获取默认收货地址或者获取某条地址信息
			 */
			getaddressInfo: function() {
				if (this.addressId) {
					getAddressDetail(this.addressId).then(res => {
						if (res.data) {
							res.data.isDefault = res.data.isDefault;
							this.addressInfo = res.data || {};
						}
					})
				}
			},

			//关闭优惠券弹窗
			ChangCouponsClone: function(coupon) {
				this.coupon.list = [];
				this.coupon.coupon = false;
			},
			//点击优惠券弹窗确定后
			ChangCoupons: function(item) {
				this.coupon.list = [];
				if (item.merId === 0) {
					this.platUserCouponId = item.isChecked ? item.id : 0;
				} else {
					this.$set(this.orderMerchantRequestList[this.activeIndex], 'userCouponId', item.isChecked ? item
						.id : 0);

				}
				this.coupon.coupon = false;
				this.computedPrice();
			},
			/**
			 * 选择优惠券
			 * @param {Object} item优惠券对象
			 * @param {Number} merId商户id
			 * @param {Number} index索引
			 */
			couponTap: function(item, merId, index) {
				this.$set(this.coupon, 'list', item);
				this.$set(this.coupon, 'couponMoney', item);
				this.coupon.coupon = true;
				this.merId = merId; //商户id
				if (merId !== 0) this.activeIndex = index;
				this.coupon.loading = false;
			},
			/**
			 * 获取当前金额可用优惠券
			 *
			 */
			getCouponList: function(item, merId) {
				this.$set(this.coupon, 'list', item);
				this.openType = 1;
				uni.hideLoading();
			},
			onAddress: function() {
				uni.navigateTo({
					url: '/pages/address/user_address_list/index?orderNo=' + this.orderNo
				});
			},
			realName: function(e) {
				this.contacts = e.detail.value;
			},
			phone: function(e) {
				this.contactsTel = e.detail.value;
			},
			payment: function(data) {
				let that = this;
				// #ifdef MP
				uni.checkBeforeAddOrder({
					success(res) {
						console.log("下单前置检查 成功：", JSON.stringify(res));
						const traceId = res.data.traceId;
						data.traceId = traceId;
						that.onCreate(data);
					},
					fail(res) {
						console.log("下单前置检查 失败：", JSON.stringify(res));
					}
				});
				// #endif
				// #ifndef MP
				that.onCreate(data);
				// #endif
			},
			onCreate(data) {
				orderCreate(data).then(res => {
					if(res.data.groupBuyIsFull==1){
						uni.hideLoading();
						return this.$refs.sh_popup.open('center')
					}
					if (this.secondType === this.ProductTypeEnum.Integral && this.orderInfoVo.payFee == 0) {
						// 积分商品并且支付金额为0时，直接默认走余额支付的逻辑，订单支付成功跳转到支付结果页
						this.changeOrderPay(res.data.orderNo, 'yue', 'yue', 'integral', 'integral', '0')
					} else {
						// 其他商品走正常流程，去支付收银台页面
						this.getToPayment(this.secondType, res.data)
					}

					uni.hideLoading();
				}).catch(err=>{
					uni.hideLoading();
					return this.$util.Tips({
						title: err
					});
				});
			},
			//立即下单
			SubOrder: Debounce(function(e) {
				let that = this,
					data = {};
				let flag = false;
				that.orderMerchantRequestList.map(function(v) {
					if (v.shippingType === 1 && !that.addressId && that.orderInfoVo.secondType !== 2) {
						flag = true;
					}
				});
				if (flag) {
					that.$util.Tips({
						title: '请选择收货地址'
					});
					return;
				}

				let systemFormValue = Array.from(this.orderInfoVo.systemFormValue)
				let systemFormData = []
				for (var i = 0; i < systemFormValue.length; i++) {
					let curdata = systemFormValue[i]
					if (['radios'].indexOf(curdata.name) == -1 && (curdata.titleShow.val || (['uploadPicture',
							'dateranges'
						].indexOf(curdata.name) == -1 && curdata.value && curdata.value.trim()))) {
						if ((curdata.name === 'texts' && curdata.valConfig.tabVal == 0) || ['dates', 'times',
								'selects', 'citys', 'checkboxs'
							].indexOf(curdata.name) != -1) {
							if (!curdata.value || (curdata.value && !curdata.value.trim())) {
								return that.$util.Tips({
									title: `请填写${curdata.titleConfig.val}`
								});
							}
						}
						if (curdata.name === 'timeranges') {
							if (!curdata.value) {
								return that.$util.Tips({
									title: `请选择${curdata.titleConfig.val}`
								});
							}
						}
						if (curdata.name === 'dateranges') {
							if (!curdata.value.length) {
								return that.$util.Tips({
									title: `请选择${curdata.titleConfig.val}`
								});
							}
						}
						if (curdata.name === 'texts' && curdata.valConfig.tabVal == 4) {
							if (curdata.value <= 0) {
								return that.$util.Tips({
									title: `请填写大于0的${curdata.titleConfig.val}`
								});
							}
						}
						if (curdata.name === 'texts' && curdata.valConfig.tabVal == 3) {
							if (!/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(curdata.value)) {
								return that.$util.Tips({
									title: `请填写正确的${curdata.titleConfig.val}`
								});
							}
						}
						if (curdata.name === 'texts' && curdata.valConfig.tabVal == 1) {
							if (!/^1(3|4|5|7|8|9|6)\d{9}$/i.test(curdata.value)) {
								return that.$util.Tips({
									title: `请填写正确的${curdata.titleConfig.val}`
								});
							}
						}
						if (curdata.name === 'texts' && curdata.valConfig.tabVal == 2) {
							if (!
								/^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/i
								.test(curdata.value)) {
								return that.$util.Tips({
									title: `请填写正确的${curdata.titleConfig.val}`
								});
							}
						}
						if (curdata.name === 'uploadPicture') {
							if (!curdata.value.length) {
								return that.$util.Tips({
									title: `请上传${curdata.titleConfig.val}`
								});
							}
						}
					}
					this.orderExtend[curdata.key] = curdata.value
					systemFormData.push({
						title: curdata.titleConfig.val,
						value: curdata.value,
					})
				}
				data = {
					addressId: that.addressId,
					orderMerchantRequestList: that.orderMerchantRequestList,
					isUseIntegral: that.isUseIntegral,
					preOrderNo: that.orderNo,
					platUserCouponId: this.platUserCouponId,
					systemFormId: this.orderInfoVo.systemFormId,
					orderExtend: JSON.stringify(systemFormData)

				};
				uni.showLoading({
					title: '订单提交中'
				});
				that.payment(data);
				//// #ifdef MP
				// openPaySubscribe().then(() => {
				// 	that.payment(data);
				// });
				// // #endif
				// // #ifndef MP
				// that.payment(data);
				// // #endif
			})
		}
	}
</script>

<style lang="scss" scoped>
	.w-480px{
		width: 480rpx;
	}
	.noCoupon {
		color: #999999;

	}

	.icon-jiantou {
		font-size: 26rpx;
		color: #515151;
		margin-left: 14rpx;
	}

	.mr14 {
		margin-right: 14rpx;
	}

	.couponTitle {
		width: 430rpx;
		display: inline-block;
		text-align: right;
		@include main_color(theme);
	}

	.store-address {
		padding: 20rpx;
		margin: 0 24rpx;
		background: #F6F6F6;
		border-radius: 8rpx;
		font-size: 24rpx;
		/*垂直居中*/
		-webkit-box-align: center;
		/*旧版本*/
		-moz-box-align: center;
		/*旧版本*/
		-ms-flex-align: center;
		/*混合版本*/
		-webkit-align-items: center;
		/*新版本*/
		align-items: center;

		/*新版本*/
		.phone {
			margin-bottom: 10rpx;
			color: #282828;
			font-weight: bold;
		}

		.name {
			padding-right: 20rpx;
		}

		.info {
			flex: 1;
		}

		.line2 {
			width: 456rpx !important;
		}

		.map {
			text-align: center;
			padding-left: 36rpx;
			position: relative;
			@include main_color(theme);

			&::before {
				content: '';
				display: inline-block;
				width: 2rpx;
				height: 42rpx;
				background-color: #DDDDDD;
				position: absolute;
				left: 0;
				top: 18rpx;
			}

			.iconfont {
				color: var(--view-theme);
			}

			.map_text {
				color: var(--view-theme);
			}
		}
	}

	.font_color {
		@include main_color(theme);
	}

	.price_color {
		@include price_color(theme);
	}

	.line2 {
		width: 624rpx;
	}

	.textR {
		text-align: right;
	}

	.order-submission .line {
		width: 100%;
		height: 3rpx;
	}

	.order-submission .line image {
		width: 100%;
		height: 100%;
		display: block;
	}

	.order-submission .address {
		padding: 40rpx 24rpx;
		background-color: #fff;
		box-sizing: border-box;
	}

	.order-submission .address .addressCon {
		width: 596rpx;
		font-size: 26rpx;
		color: #666;
	}

	.order-submission .address .addressCon .name {
		font-size: 30rpx;
		color: #282828;
		font-weight: bold;
		// margin-bottom: 10rpx;
	}

	.order-submission .address .addressCon .name .phone {
		margin-left: 50rpx;
	}

	.order-submission .address .addressCon .default {
		margin-right: 12rpx;
	}

	.order-submission .address .addressCon .setaddress {
		color: #333;
		font-size: 28rpx;
	}

	.order-submission .address .iconfont {
		color: #707070;
	}

	.order-submission .allAddress {
		width: 100%;
		@include index-gradient(theme);
		padding: 30rpx 24rpx 0 24rpx;
	}

	.order-submission .allAddress .address.group {
		border-radius: 0;
	}

	.order-submission .allAddress .address {
		max-height: 180rpx;
		margin: -2rpx auto 0 auto;
		border-radius: 14rpx 14rpx 0 0;
	}

	.order-submission .allAddress .line {
		width: 100%;
		margin: 0 auto;
	}

	.order-submission .wrapper .item .discount .placeholder {
		color: #ccc;
	}

	.order-submission .wrapper {
		background-color: #fff;
		margin-top: 24rpx;
	}

	.order-submission .wrapper .item {
		padding: 28rpx 24rpx;
		font-size: 30rpx;
		color: #333333;
	}

	.order-submission .wrapper .item .discount {
		font-size: 30rpx;
		color: #333;
	}

	.order-submission .wrapper .item .discount .iconfont {
		color: #515151;
	}

	.order-submission .wrapper .item .discount .num {
		font-size: 32rpx;
		margin-right: 20rpx;
	}

	.order-submission .wrapper .item .shipping {
		font-size: 30rpx;
		color: #999;
		position: relative;
		padding-right: 58rpx;
	}

	.order-submission .wrapper .item .shipping .iconfont {
		font-size: 35rpx;
		color: #707070;
		position: absolute;
		right: 0;
		top: 50%;
		transform: translateY(-50%);
		margin-left: 30rpx;
	}

	.order-submission .wrapper .item textarea {
		background-color: #f9f9f9;
		width: auto !important;
		height: 140rpx;
		border-radius: 14rpx;
		margin-top: 30rpx;
		padding: 15rpx;
		box-sizing: border-box;
		font-weight: 400;
	}

	.order-submission .wrapper .item .placeholder {
		color: #ccc;
	}

	.order-submission .wrapper .item .list {
		margin-top: 35rpx;
	}

	.order-submission .wrapper .item .list .payItem {
		border: 1px solid #eee;
		border-radius: 14rpx;
		height: 86rpx;
		width: 100%;
		box-sizing: border-box;
		margin-top: 20rpx;
		font-size: 28rpx;
		color: #282828;
	}

	.order-submission .wrapper .item .list .payItem.on {
		// border-color: #fc5445;
		@include coupons_border_color(theme);
		color: $theme-color;
	}

	.order-submission .wrapper .item .list .payItem .name {
		width: 50%;
		text-align: center;
		border-right: 1px solid #eee;
	}

	.order-submission .wrapper .item .list .payItem .name .iconfont {
		width: 44rpx;
		height: 44rpx;
		border-radius: 50%;
		text-align: center;
		line-height: 44rpx;
		background-color: #fe960f;
		color: #fff;
		font-size: 30rpx;
		margin-right: 15rpx;
	}

	.order-submission .wrapper .item .list .payItem .name .iconfont.icon-weixin2 {
		background-color: #41b035;
	}

	.order-submission .wrapper .item .list .payItem .name .iconfont.icon-zhifubao {
		background-color: #00AAEA;
	}

	.order-submission .wrapper .item .list .payItem .tip {
		width: 49%;
		text-align: center;
		font-size: 26rpx;
		color: #aaa;
	}

	.order-submission .moneyList {
		margin-top: 15rpx;
		background-color: #fff;
		padding: 0 30rpx;
		margin-bottom: calc(constant(safe-area-inset-bottom)); ///兼容 IOS<11.2/
		margin-bottom: calc(env(safe-area-inset-bottom)); ///兼容 IOS>11.2/
	}

	.order-submission .moneyList .item {
		font-size: 30rpx;
		color: #282828;
		height: 96rpx;
	}

	.order-submission .moneyList .item~.item {
		// margin-top: 20rpx;
	}

	.order-submission .moneyList .item .money {
		color: #666666;
	}

	.order-submission .footer {
		width: 100%;
		height: 100rpx;
		background-color: #fff;
		padding: 0 30rpx;
		font-size: 28rpx;
		color: #333;
		box-sizing: border-box;
		position: fixed;
		bottom: 0;
		left: 0;
		height: calc(100rpx+ constant(safe-area-inset-bottom)); ///兼容 IOS<11.2/
		height: calc(100rpx + env(safe-area-inset-bottom)); ///兼容 IOS>11.2/
		z-index: 999;
	}

	.order-submission .footer .settlement {
		background-color: #fff;
		font-size: 30rpx;
		color: #fff;
		width: 240rpx;
		height: 70rpx;
		@include main_bg_color(theme);
		border-radius: 50rpx;
		text-align: center;
		line-height: 70rpx;
	}

	.footer .transparent {
		opacity: 0
	}

	/deep/ checkbox .uni-checkbox-input.uni-checkbox-input-checked {
		@include main_bg_color(theme);
		border: none !important;
		color: #fff !important
	}

	/deep/ checkbox .wx-checkbox-input.wx-checkbox-input-checked {
		@include main_bg_color(theme);
		border: none !important;
		color: #fff !important;
		margin-right: 0 !important;
	}

	// 切换
	/deep/.uni-date-x--border {
		border: 0;
	}

	/deep/.uni-icons {
		font-size: 0 !important;
	}

	/deep/.uni-date-x {
		color: #999;
		font-size: 15px;
	}

	/deep/.uni-date__x-input {
		font-size: 15px;
	}

	/deep/uni-checkbox[disabled] .uni-checkbox-input {
		background-color: #eee;
	}

	.abs-lt .active-card {
		&:after {
			right: -67rpx;
		}
	}

	.abs-rt .active-card {
		&:after {
			left: -67rpx;
			-moz-transform: scaleX(-1);
			-webkit-transform: scaleX(-1);
			-o-transform: scaleX(-1);
			transform: scaleX(-1);
		}
	}

	.active-card {
		&:after {
			content: "";
			width: 67rpx;
			height: 76rpx;
			background-image: url('../static/images/nav_circle_left.png');
			background-size: contain;
			background-repeat: no-repeat;
			position: absolute;
			bottom: 0;
			z-index: 4;
		}
	}

	.line {
		width: 680rpx;
		margin: auto;
		height: 3rpx;
	}

	.line image {
		width: 100%;
		height: 100%;
		display: block;
	}

	.address {
		background-color: #fff;
		box-sizing: border-box;
	}

	.footer .transparent {
		opacity: 0
	}

	.w-322 {
		width: 322rpx;
	}

	.w-450 {
		width: 450rpx;
	}

	.w-50p {
		width: 50%;
	}

	.h-auto {
		height: auto;
	}

	.bd-r-14 {
		border-radius: 14rpx 14rpx 0 0  !important;
	}
	.mt30{
		margin-top: 30rpx;
	}
	.bg-primary-light {
		@include main_rgba_color(theme);
	}

	.rd-lt-24rpx {
		border-radius: 24rpx 0 0 0;
	}

	.rd-rt-24rpx {
		border-radius: 0 24rpx 0 0;
	}

	.z-2 {
		z-index: 2;
	}

	.gold {
		color: #DCA658;
	}

	.select-name {
		max-width: 300rpx;
	}

	.font-color {
		font-weight: 500 !important;
	}
	/deep/ .uni-popup__wrapper {
		background: #FFFFFF;
		border-radius: 32rpx;
	}
	.sh_popup-content {
		padding: 40rpx;
		.sh_popup_title {
			font-weight: 500;
			font-size: 32rpx;
			color: #333333;
			text-align: center;
		}
	
		.sh_popup_text {
			font-weight: 400;
			font-size: 30rpx;
			color: #666666;
			text-align: center;
			margin-top: 36rpx;
		}
	
		.sh_popup_btn {
			display: flex;
			margin-top: 60rpx;
			justify-content: space-between;
			.btn {
				width: 244rpx;
				height: 72rpx;
				border-radius: 50rpx;
				text-align: center;
				line-height: 72rpx;
			}
	
			.no_btn {
				@include coupons_border_color(theme);
				color: $theme-color;
				margin-right: 32rpx;
			}
	
			.yes_btn {
				@include main_bg_color(theme);
				color: #FFFFFF;
			}
		}
	}
</style>