<template>
	<view :data-theme="theme">
		<view class="cart_nav" :style='"height:"+navH+"rpx;"'>
			<!-- #ifndef APP-PLUS -->
			<nav-bar iconColor='#fff' ref="navBarRef" :isBackgroundColor="false" navTitle="购物车">
			</nav-bar>
			<!-- #endif -->
		</view>
		<view class='shoppingCart copy-data' :style='"top:"+navH+"rpx;"' @touchstart="touchStart">
			<view class='labelNav'>
				<view
					v-if="(cartList.valid.length === 0 && cartList.invalid.length === 0) || (cartList.valid.length > 0)"
					class='acea-row row-between-wrapper'>
					<view>共 <text class='num'>{{cartCount}}</text>件商品</view>
					<view v-if="cartList.valid.length > 0 || cartList.invalid.length > 0"
						class='administrate acea-row row-center-wrapper' @click='manage'>{{ footerswitch ? '管理' : '取消'}}
					</view>
				</view>
			</view>
			<view class="fixheight"></view>
			<view class="borRadius14 cartBox">
				<view v-if="cartList.valid.length > 0 || cartList.invalid.length > 0" class="borderPad">
					<view class='list'>
						<view v-for="(itemn,index) in cartList.valid" :key="index" class="mb24 borRadius14"
							style="overflow: hidden;">
							<view class="store-title nav">
								<view class="checkbox" @click="storeAllCheck(itemn,index)">
									<view v-if="itemn.noCheck" class="noCheck"></view>
									<view v-else>
										<text v-if="!itemn.allCheck" class="iconfont icon-weixuan"></text>
										<text v-else class="iconfont icon-xuanzhong11 font-color"></text>
									</view>
								</view>
								<navigator :url="'/pages/merchant/home/index?merId='+itemn.merId "
									class="info acea-row">
									<text class="iconfont icon-shangjiadingdan"></text>
									<view class="name">{{itemn.merName}}</view>
									<text class="iconfont icon-jiantou"></text>
								</navigator>
							</view>
							<block v-for="(item,indexn) in itemn.cartInfoList" :key="indexn">
								<view class='item acea-row row-between-wrapper'>
									<view class="checkbox" @click.stop="goodsCheck(item,indexn)">
										<block v-if="!footerswitch">
											<text v-if="!item.check" class="iconfont icon-weixuan"></text>
											<text v-else class="iconfont icon-xuanzhong11 font-color"></text>
										</block>
										<block v-else>
											<text v-if="!item.check && item.stock>0"
												class="iconfont icon-weixuan"></text>
											<text v-if="item.check && item.stock>0"
												class="iconfont icon-xuanzhong11 font-color"></text>
											<view v-if="!item.check && (item.stock===0 || !item.stock)" class="noCheck">
											</view>
										</block>

									</view>
									<navigator :url="`/pages/goods/goods_details/index?id=${item.productId}&mt=0`"
										hover-class='none' class='picTxt acea-row row-between-wrapper'>
										<view class='pictrue'>
											<image :src="item.image"></image>
											<!-- <easy-loadimage mode="widthFix" :image-src="item.image"></easy-loadimage> -->
										</view>
										<view class='text'>
											<view class='line1 line-heightOne' :class="item.attrStatus?'':'reColor'">
												{{item.proName}}
											</view>
											<view class='infor line1 line-heightOne' v-if="item.sku">规格：{{item.sku}}
											</view>
											<view class='money mt-20' v-if="item.attrStatus">
												<svip-price :svipIconStyle="svipIconStyle" :productPrice="item"
													:svipPriceStyle="svipPriceStyle"></svip-price>
												<!-- ￥{{item.vipPrice ? item.vipPrice :item.price}} -->
											</view>
											<view class="reElection acea-row row-between-wrapper" v-else>
												<view class="title">请重新选择商品规格</view>
												<view class="reBnt cart-color acea-row row-center-wrapper"
													@click.stop="reElection(item)">重选</view>
											</view>
										</view>
										<view class='carnum acea-row row-center-wrapper' v-if="item.attrStatus">
											<view class="reduce" :class="item.numSub ? 'on' : ''"
												@click.stop='subCart(item)'>-</view>
											<view class='num ml-8 mr-8'>{{item.cartNum}}</view>
											<view class="plus" :class="item.numAdd ? 'on' : ''"
												@click.stop='addCart(item)'>+</view>
										</view>
									</navigator>
								</view>
							</block>
						</view>
					</view>
					<view v-if="cartList.invalid.length > 0" class='invalidGoods borRadius14'
						:style="cartList.valid.length===0 && cartList.invalid.length > 0 ? 'position: relative;z-index: 111;':'position: static;'">
						<view class='goodsNav acea-row row-between-wrapper'>
							<view v-if="cartList.invalid.length > 1 || cartList.valid.length > 0" @click='goodsOpen'>
								<text class='iconfont'
									:class='goodsHidden==true?"icon-xiangxia":"icon-xiangshang"'></text>失效商品
							</view>
							<view v-else>
								失效商品
							</view>
							<view class='del' @click='unsetCart'><text class='iconfont icon-shanchu1'></text>清空</view>
						</view>
						<view class='goodsList' :hidden='goodsHidden'>
							<view v-for="(itemn,indexn) in cartList.invalid" :key='indexn'>
								<view v-for="(item,index) in itemn.cartInfoList" :key='index'>
									<view class='item acea-row row-between-wrapper'>
										<view class='invalid'>失效</view>
										<view class='picTxt acea-row row-between-wrapper'>
											<view class='pictrue'>
												<easy-loadimage mode="widthFix" :image-src="item.image">
												</easy-loadimage>
											</view>
											<view class='text acea-row row-column-between'>
												<view class='line1 name'>{{item.proName}}</view>
												<view class='infor line1' v-if="item.sku">
													属性：{{item.sku}}
												</view>
												<view class='acea-row row-between-wrapper'>
													<view class='end'>该商品已失效</view>
												</view>
											</view>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
					<!-- #ifdef H5 -->
					<view v-if="!bottomNavigationIsCustom" style="height:60rpx;"></view>
					<!-- #endif -->
				</view>
				<view class='loadingicon acea-row row-center-wrapper' :hidden='loading==false'>
					<text class='loading iconfont icon-jiazai'></text>
				</view>
				<view class='noCart noCommodity'
					v-if="(cartList.valid.length == 0 && cartList.invalid.length == 0 && !loading ) || !isLogin">
					<view class='pictrue'>
						<image :src="urlDomain+'crmebimage/presets/noShopper.png'"></image>
						<view class="text-ccc">购物车为空哦~</view>
					</view>
					<recommend ref="recommendIndex"></recommend>
				</view>
				<!-- #ifdef H5 -->
				<view v-if="cartList.valid.length > 0 || cartList.invalid.length > 0" class="uni-p-b-96"></view>
				<!-- #endif -->
				<view v-if="cartList.valid.length > 0 || cartList.invalid.length > 0" class="uni-p-b-98"></view>
				<view v-if="bottomNavigationIsCustom" class="footerBottom"></view>
			</view>
		</view>
		<view :class="bottomNavigationIsCustom?'footerTop':''" class='footer acea-row row-between-wrapper'
			v-if="cartList.valid.length > 0">
			<view>
				<view class="allcheckbox flex-y-center" @click.stop="checkboxAllChange">
					<text v-if="!isAllSelect" class="iconfont icon-weixuan"></text>
					<text v-else class="iconfont icon-xuanzhong11 font-color"></text>
					全选
				</view>
			</view>
			<view class='money acea-row row-middle' v-if="footerswitch==true">
				<view class="text-right">
					<view>
						<text class="all_text">合计：</text>
						<text class='price-color'>
							<text class="symbol">¥</text>
							<text
								class="all_money">{{calculatePriceData.totalPrice?calculatePriceData.totalPrice:0}}</text>
						</text>
					</view>
					<view class="acea-row row-middle" @click="popupChange()"
						v-show="calculatePriceData.totalCouponPrice>0">
						<text
							class="youhui">优惠：¥{{calculatePriceData.totalCouponPrice?calculatePriceData.totalCouponPrice:0}}</text>
						<text class="mingxi price-color">优惠明细</text>
						<text class="iconfont icon-xiala1"></text>
						<!-- <text class="iconfont icon-xiangshang2"></text> -->
					</view>
				</view>
				<form @submit="subOrder" report-submit='true'>
					<button class='placeOrder bg_color' formType="submit">去结算 ({{bayCount}})</button>
				</form>
			</view>
			<view class='button acea-row row-middle' v-else>
				<form @submit="subCollect" report-submit='true'>
					<button class='btn_cart_color' formType="submit">移入收藏</button>
				</form>
				<form @submit="subDel" report-submit='true'>
					<button class='bnt' formType="submit">删除</button>
				</form>
			</view>
		</view>
		<productWindow :attr="attr" :isShow='1' :iSplus='1' :iScart='1' @myevent="onMyEvent" @ChangeAttr="ChangeAttr"
			@ChangeCartNum="ChangeCartNum" @attrVal="attrVal" @iptCartNum="iptCartNum" @goCat="reGoCat"
			id='product-window'></productWindow>
		<!-- 优惠券详情弹窗 -->
		<view class="window" :class="popupShow ? 'on': ''">
			<view v-show="popupShow">
				<scroll-view scroll-y="true" class="popup_content">
					<view class="_tit text-center">
						{{calculatePriceData.proTotalPrice>0&& calculatePriceData.totalCouponPrice!=0?'优惠明细':'商品详情'}}
					</view>
					<view v-show="calculatePriceData.proTotalPrice>0&& calculatePriceData.totalCouponPrice!=0"
						class="_desc text-center">实际优惠详情以下单页为准</view>
					<view class="_pro_content">
						<view class="_pro_box">
							<view class="_pic_item" @click.stop="popupCheck(item)"
								v-for="item in showMore ? checkProList : checkProList.slice(0,4)" :key="item.id">
								<view class="checkbox">
									<text v-if="item.check" class="iconfont icon-xuanzhong11 font-color"></text>
									<text v-else class="noCheckd"></text>
								</view>
								<image :src="item.image" mode="aspectFill"></image>
							</view>
						</view>
						<view class="acea-row row-center-wrapper _more"
							v-show="checkProList.length && checkProList.length > 4" @click="showMore = !showMore">
							<text>已选{{checkProList.length}}件商品</text>
							<text v-if="showMore" class="iconfont icon-xiangshang"></text>
							<text v-else class="iconfont icon-xiangxia"></text>
						</view>
					</view>
					<block v-if="calculatePriceData.proTotalPrice>0 && calculatePriceData.totalCouponPrice!=0">
						<view class="_cell acea-row row-between-wrapper">
							<text class="_label">商品总价：</text>
							<text class="_count">¥{{calculatePriceData.proTotalPrice}}</text>
						</view>
						<view class="_cell acea-row row-between-wrapper">
							<text class="_label">会员优惠：</text>
							<text class="_count">-¥{{calculatePriceData.svipDiscountPrice}}</text>
						</view>
						<view class="_cell acea-row row-between-wrapper">
							<text class="_label">店铺优惠：</text>
							<text class="_count">-¥{{calculatePriceData.merCouponPrice}}</text>
						</view>
						<view class="_cell acea-row row-between-wrapper">
							<text class="_label">平台优惠：</text>
							<text class="_count">-¥{{calculatePriceData.platCouponPrice}}</text>
						</view>
						<view class="_cell_all acea-row row-between-wrapper">
							<text class="_label">共优惠：</text>
							<text class="_count">-¥{{calculatePriceData.totalCouponPrice}}</text>
						</view>
					</block>
				</scroll-view>
			</view>
			<text v-show="popupShow" class="iconfont icon-guanbi5" @click="popupShow = false"></text>
		</view>
		<view class="mask" v-show="popupShow" @touchmove.stop.prevent="moveStop" @click="popupShow = false"></view>
		<pageFooter></pageFooter>
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
	import recommend from "@/components/base/recommend.vue";
	import easyLoadimage from '@/components/base/easy-loadimage.vue';
	import pageFooter from "@/components/pageFooter/index.vue";
	import svipPrice from '@/components/svipPrice.vue';
	import navBar from '@/components/navBar';
	import {
		onGetPreOrder
	} from '@/libs/order';
	// #ifdef APP-PLUS
	let sysHeight = uni.getSystemInfoSync().statusBarHeight + 'px';
	// #endif
	// #ifndef APP-PLUS
	let sysHeight = 0
	// #endif
	import {
		getCartList,
		getCartCounts,
		changeCartNum,
		cartDel,
		getResetCart,
		cartCalculatePriceApi
	} from '@/api/order.js';
	import {
		getProductHot,
		cartToCollect,
		getProductDetail
	} from '@/api/product.js';
	import {
		tokenIsExistApi
	} from '@/api/api.js';
	import {
		getShare
	} from '@/api/public.js';
	import {
		mapGetters
	} from "vuex";
	import productWindow from '@/components/productWindow';
	import {
		Debounce
	} from '@/utils/validate.js'
	import animationType from '@/utils/animationType.js'
	let app = getApp();
	export default {
		components: {
			productWindow,
			recommend,
			easyLoadimage,
			pageFooter,
			svipPrice,
			navBar
		},
		data() {
			return {
				//普通价格
				svipPriceStyle: {
					svipBox: {
						height: '22rpx',
						borderRadius: '50rpx 56rpx 56rpx 20rpx',
					},
					icon: {
						fontSize: '14rpx',
						height: '22rpx',
						borderRadius: '8rpx 0 8rpx 2rpx'
					},
					price: {
						fontSize: '32rpx'
					},
					svipPrice: {
						fontSize: '16rpx'
					},
					topStyle: {
						top: '0'
					}
				},
				//svip价格
				svipIconStyle: {
					svipBox: {
						height: '22rpx',
						lineHeight: '22rpx',
						borderRadius: '20rpx 40rpx 40rpx 0.4rpx',
					},
					price: {
						fontSize: '32rpx'
					},
					svipPrice: {
						fontSize: '14rpx'
					}
				},
				urlDomain: this.$Cache.get("imgHost"),
				categoryId: 0,
				cartCount: 0, //购物车规格数，
				bayCount: 0, //去结算总数
				goodsHidden: false,
				footerswitch: true, //管理按钮是否开启
				hostProduct: [],
				cartList: {
					valid: [],
					invalid: []
				},
				isAllSelect: false, //全选
				selectValue: [], //选中的数据
				selectCountPrice: 0.00,
				isAuto: false, //没有授权的不会自动授权
				isShowAuth: false, //是否隐藏授权
				hotScroll: false,
				hotPage: 1,
				hotLimit: 10,
				loading: false,
				loadend: false,
				loadTitle: '加载更多', //提示语
				page: 1,
				limit: 20,
				loadingInvalid: false,
				loadendInvalid: false,
				limitInvalid: 20,
				attr: {
					cartAttr: false,
					productAttr: [],
					productSelect: {}
				},
				productValue: [], //系统属性
				productInfo: {},
				attrValue: '', //已选属性
				attrTxt: '请选择', //属性页面提示
				cartId: 0,
				product_id: 0,
				sysHeight: sysHeight,
				canShow: false,
				configApi: {}, //分享类容配置
				theme: app.globalData.theme,
				navH: "",
				homeTop: 20,
				currentPage: false,
				type: "", //视频号普通商品类型
				tokenIsExist: false, //校验token是否有效
				popupShow: false,
				showMore: false,
				checkProList: [],
				calculatePriceData: {}
			};
		},
		computed: {
			...mapGetters(['isLogin', 'productType', 'globalData', 'bottomNavigationIsCustom']),
		},
		onLoad: function(options) {
			this.getTokenIsExist();
			let that = this;
			// #ifdef MP
			that.navH = this.globalData.navHeight;
			// #endif
			// #ifndef MP
			that.navH = 96;
			// #endif
		},
		onReady() {
			this.$nextTick(function() {
				//// #ifdef MP
				const menuButton = uni.getMenuButtonBoundingClientRect();
				const query = uni.createSelectorQuery().in(this);
				query
					.select('#home')
					.boundingClientRect(data => {
						this.homeTop = menuButton.top * 2 + menuButton.height - data.height;
					})
					.exec();
				//// #endif
			});
		},
		onShow: function() {
			this.canShow = false
			this.calculatePriceData = {};
			this.popupShow = false;
			// this.getTokenIsExist();
			if (this.isLogin && this.tokenIsExist) {
				this.getIndex();
				this.getCartNum();
			};
		},
		// 滚动监听
		onPageScroll(e) {
			// 传入scrollTop值并触发所有easy-loadimage组件下的滚动监听事件
			uni.$emit('scroll');
		},
		methods: {
			//首次进入加载的接口
			getIndex() {
				this.hotPage = 1;
				this.hostProduct = [],
					this.hotScroll = false,
					this.loadend = false;
				this.page = 1;
				this.cartList.valid = [];
				this.getCartList();
				this.loadendInvalid = false;
				this.cartList.invalid = [];
				this.getInvalidList();
				//this.getCartNum();
				this.footerswitch = true;
				this.hotScroll = false;
				this.hotPage = 1;
				this.hotLimit = 10;
				this.cartList = {
						valid: [],
						invalid: []
					},
					this.isAllSelect = false; //全选
				this.selectValue = []; //选中的数据
				this.selectCountPrice = 0.00;
				this.bayCount = 0;
				this.isShowAuth = false;
			},
			//校验token是否有效,true为有效，false为无效
			getTokenIsExist() {
				tokenIsExistApi().then(res => {
					this.tokenIsExist = res.data;
					if (this.isLogin && this.tokenIsExist) {
						this.getIndex();
						this.getCartNum();
					}
				})
			},
			// 修改购物车
			reGoCat: function() {
				let that = this,
					productSelect = that.productValue[this.attrValue];
				//如果有属性,没有选择,提示用户选择
				if (
					that.attr.productAttr.length &&
					productSelect === undefined
				)
					return that.$util.Tips({
						title: "产品库存不足，请选择其它"
					});

				let q = {
					id: that.cartId,
					productId: that.product_id,
					num: that.attr.productSelect.cart_num,
					unique: that.attr.productSelect !== undefined ?
						that.attr.productSelect.unique : that.productInfo.id
				};
				getResetCart(q)
					.then(function(res) {
						that.attr.cartAttr = false;
						that.$util.Tips({
							title: "添加购物车成功",
							success: () => {
								that.loadend = false;
								that.page = 1;
								that.cartList.valid = [];
								that.getCartList();
								that.getCartNum();
							}
						});
					})
					.catch(res => {
						return that.$util.Tips({
							title: res
						});
					});
			},
			onMyEvent: function() {
				this.$set(this.attr, 'cartAttr', false);
			},
			reElection: function(item) {
				this.getGoodsDetails(item)
			},
			/**
			 * 获取产品详情
			 *
			 */
			getGoodsDetails: function(item) {
				uni.showLoading({
					title: '加载中',
					mask: true
				});
				let that = this;
				that.cartId = item.id;
				that.product_id = item.productId;
				getProductDetail(item.productId, 'normal').then(res => {
					uni.hideLoading();
					that.attr.cartAttr = true;
					let productInfo = res.data.productInfo;
					that.$set(that, 'productInfo', productInfo);
					that.$set(that, 'productValue', res.data.productValue);
					let productAttr = res.data.productAttr.map(item => {
						return {
							attrName: item.attrName,
							attrValues: item.attrValues.split(','),
							id: item.id,
							isDel: item.isDel,
							productId: item.productId,
							type: item.type
						}
					});
					this.$set(that.attr, 'productAttr', productAttr);
					that.DefaultSelect();
				}).catch(err => {
					uni.hideLoading();
				})
			},
			/**
			 * 属性变动赋值
			 *
			 */
			ChangeAttr: function(res) {
				let productSelect = this.productValue[res];
				if (productSelect && productSelect.stock > 0) {
					this.$set(this.attr.productSelect, "image", productSelect.image);
					this.$set(this.attr.productSelect, "price", productSelect.price);
					this.$set(this.attr.productSelect, "stock", productSelect.stock);
					this.$set(this.attr.productSelect, "unique", productSelect.id);
					this.$set(this.attr.productSelect, "cart_num", 1);
					this.$set(this, "attrValue", res);
					this.$set(this, "attrTxt", "已选择");
				} else {
					this.$set(this.attr.productSelect, "image", this.productInfo.image);
					this.$set(this.attr.productSelect, "price", this.productInfo.price);
					this.$set(this.attr.productSelect, "stock", 0);
					this.$set(this.attr.productSelect, "unique", this.productInfo.id);
					this.$set(this.attr.productSelect, "cart_num", 0);
					this.$set(this, "attrValue", "");
					this.$set(this, "attrTxt", "请选择");
				}
			},
			/**
			 * 默认选中属性
			 *
			 */
			DefaultSelect: function() {
				let productAttr = this.attr.productAttr;
				let value = [];
				for (let key in this.productValue) {
					if (this.productValue[key].stock > 0) {
						value = this.attr.productAttr.length ? key.split(",") : [];
						break;
					}
				}
				for (let i = 0; i < productAttr.length; i++) {
					this.$set(productAttr[i], "index", value[i]);
				}
				//sort();排序函数:数字-英文-汉字；
				let productSelect = this.productValue[value.sort().join(",")];
				if (productSelect && productAttr.length) {
					this.$set(
						this.attr.productSelect,
						"storeName",
						this.productInfo.storeName
					);
					this.$set(this.attr.productSelect, "image", productSelect.image);
					this.$set(this.attr.productSelect, "price", productSelect.price);
					this.$set(this.attr.productSelect, "stock", productSelect.stock);
					this.$set(this.attr.productSelect, "unique", productSelect.id);
					this.$set(this.attr.productSelect, "cart_num", 1);
					this.$set(this, "attrValue", value.sort().join(","));
					this.$set(this, "attrTxt", "已选择");
				} else if (!productSelect && productAttr.length) {
					this.$set(
						this.attr.productSelect,
						"storeName",
						this.productInfo.storeName
					);
					this.$set(this.attr.productSelect, "image", this.productInfo.image);
					this.$set(this.attr.productSelect, "price", this.productInfo.price);
					this.$set(this.attr.productSelect, "stock", 0);
					this.$set(this.attr.productSelect, "unique", this.productInfo.id);
					this.$set(this.attr.productSelect, "cart_num", 0);
					this.$set(this, "attrValue", "");
					this.$set(this, "attrTxt", "请选择");
				} else if (!productSelect && !productAttr.length) {
					this.$set(
						this.attr.productSelect,
						"storeName",
						this.productInfo.storeName
					);
					this.$set(this.attr.productSelect, "image", this.productInfo.image);
					this.$set(this.attr.productSelect, "price", this.productInfo.price);
					this.$set(this.attr.productSelect, "stock", this.productInfo.stock);
					this.$set(
						this.attr.productSelect,
						"unique",
						this.productInfo.id || ""
					);
					this.$set(this.attr.productSelect, "cart_num", 1);
					this.$set(this, "attrValue", "");
					this.$set(this, "attrTxt", "请选择");
				}
			},
			attrVal(val) {
				this.$set(this.attr.productAttr[val.indexw], 'index', this.attr.productAttr[val.indexw].attrValues[val
					.indexn]);
			},
			/**
			 * 购物车数量加和数量减
			 *
			 */
			ChangeCartNum: function(changeValue) {
				//changeValue:是否 加|减
				//获取当前变动属性
				let productSelect = this.productValue[this.attrValue];
				//如果没有属性,赋值给商品默认库存
				if (productSelect === undefined && !this.attr.productAttr.length)
					productSelect = this.attr.productSelect;
				//无属性值即库存为0；不存在加减；
				if (productSelect === undefined) return;
				let stock = productSelect.stock || 0;
				let num = this.attr.productSelect;
				if (changeValue) {
					num.cart_num++;
					if (num.cart_num > stock) {
						this.$set(this.attr.productSelect, "cart_num", stock ? stock : 1);
						this.$set(this, "cart_num", stock ? stock : 1);
					}
				} else {
					num.cart_num--;
					if (num.cart_num < 1) {
						this.$set(this.attr.productSelect, "cart_num", 1);
						this.$set(this, "cart_num", 1);
					}
				}
			},
			/**
			 * 购物车手动填写
			 *
			 */
			iptCartNum: function(e) {
				this.$set(this.attr.productSelect, 'cart_num', e);
			},
			subDel: Debounce(function(event) {
				let selectValue = []
				this.cartList.valid.forEach(el => {
					el.cartInfoList.forEach(goods => {
						if (goods.check) {
							selectValue.push(goods.id)
						}
					})
				})
				if (selectValue.length > 0) {
					uni.showLoading({
						title: '加载中...'
					});

					cartDel(selectValue).then(res => {
						this.loadend = false;
						this.cartList.valid = [];
						this.calculatePriceData = {};
						this.bayCount = 0
						this.getCartList();
						this.getCartNum();
						uni.hideLoading();
					}).catch(err => {
						uni.hideLoading();
					});
				} else {
					return this.$util.Tips({
						title: '请选择产品'
					});
				}

			}),
			getSelectValueProductId: function() {
				let that = this;
				let validList = that.cartList.valid;
				let selectValue = that.selectValue;
				let productId = [];
				if (selectValue.length > 0) {
					for (let index in validList) {
						if (that.inArray(validList[index].id, selectValue)) {
							productId.push(validList[index].productId);
						}
					}
				};
				return productId;
			},
			subCollect: function(event) {
				let that = this;
				let type_id = []
				this.cartList.valid.forEach(el => {
					el.cartInfoList.forEach(goods => {
						if (goods.check) {
							type_id.push(goods.id)
						}
					})
				})
				if (type_id.length > 0) {
					cartToCollect(type_id).then(res => {
						that.$util.Tips({
							title: '收藏成功',
							icon: 'success'
						});
						this.cartList.valid = [];
						this.calculatePriceData = {};
						this.bayCount = 0
						this.getCartNum();
						this.getCartList();
					}).catch(err => {
						return that.$util.Tips({
							title: err
						});
					});
				} else {
					return that.$util.Tips({
						title: '请选择产品'
					});
				}
			},
			// 立即下单
			subOrder: Debounce(function(event) {
				this.$store.commit("PRODUCT_TYPE", 'normal');
				uni.showLoading({
					title: '加载中...'
				});
				this.selectValue = [];
				this.cartList.valid.forEach(el => {
					el.cartInfoList.forEach(goods => {
						if (goods.check) {
							this.selectValue.push(goods.id)
						}
					})
				})
				if (this.selectValue.length > 0) {
					this.getPreOrder();
				} else {
					uni.hideLoading();
					return this.$util.Tips({
						title: '请选择产品'
					});
				}
			}),
			/**
			 * 预下单
			 */
			getPreOrder: function() {
				let shoppingCartId = this.selectValue.map(item => {
					return {
						"shoppingCartId": Number(item)
					}
				})
				uni.hideLoading();
				onGetPreOrder("shoppingCart", shoppingCartId);
			},
			inArray: function(search, array) {
				for (let i in array) {
					if (array[i] == search) {
						return true;
					}
				}
				return false;
			},
			switchSelect: function() {
				let that = this;
				let validList = that.cartList.valid;
				let selectValue = that.selectValue;
				let selectCountPrice = 0.00;
				if (selectValue.length < 1) {
					that.selectCountPrice = selectCountPrice;
				} else {
					for (let index in validList) {
						if (that.inArray(validList[index].id, selectValue)) {
							selectCountPrice = that.$util.$h.Add(selectCountPrice, that.$util.$h.Mul(validList[index]
								.cartNum, validList[index].vipPrice ? validList[index].vipPrice : validList[
									index].price))
						}
					}
					that.selectCountPrice = selectCountPrice;
				}
			},
			checkboxAllChange() {
				this.popupShow = false
				this.isAllSelect = !this.isAllSelect
				this.cartAllCheck('cartCheck');

			},
			setAllSelectValue: function(status) {
				let that = this;
				let selectValue = [];
				let valid = that.cartList.valid;
				if (valid.length > 0) {
					let newValid = valid.map(item => {
						if (status) {
							if (that.footerswitch) {
								if (item.attrStatus) {
									item.checked = true;
									selectValue.push(item.id);
								} else {
									item.checked = false;
								}
							} else {
								item.checked = true;
								selectValue.push(item.id);
							}
							that.isAllSelect = true;
						} else {
							item.checked = false;
							that.isAllSelect = false;
						}
						return item;
					});
					that.$set(that.cartList, 'valid', newValid);
					that.selectValue = selectValue;
					that.switchSelect();
				}
			},
			checkboxChange: function(event) {
				let that = this;
				let value = event.detail.value;
				let valid = that.cartList.valid;
				let arr1 = [];
				let arr2 = [];
				let arr3 = [];
				let newValid = valid.map(item => {
					if (that.inArray(item.id, value)) {
						if (that.footerswitch) {
							if (item.attrStatus) {
								item.checked = true;
								arr1.push(item);
							} else {
								item.checked = false;
							}
						} else {
							item.checked = true;
							arr1.push(item);
						}
					} else {
						item.checked = false;
						arr2.push(item);
					}
					return item;
				});
				if (that.footerswitch) {
					arr3 = arr2.filter(item => !item.attrStatus);
				}
				that.$set(that.cartList, 'valid', newValid);
				that.isAllSelect = newValid.length === arr1.length + arr3.length;
				that.selectValue = value;
				that.switchSelect();
			},
			inArray: function(search, array) {
				for (let i in array) {
					if (array[i] == search) {
						return true;
					}
				}
				return false;
			},
			//计算总价
			switchSelect: function() {
				let that = this;
				let validList = that.cartList.valid;
				let selectValue = that.selectValue;
				let selectCountPrice = 0.00;
				if (selectValue.length < 1) {
					that.selectCountPrice = selectCountPrice;
				} else {
					for (let index in validList) {
						if (that.inArray(validList[index].id, selectValue)) {
							selectCountPrice = that.$util.$h.Add(selectCountPrice, that.$util.$h.Mul(validList[index]
								.cartNum, validList[index].vipPrice ? validList[index].vipPrice : validList[
									index]
								.price))
						}
					}
					that.selectCountPrice = selectCountPrice;
				}
			},
			/**
			 * 购物车手动填写
			 *
			 */
			iptCartNum: function(index) {
				let item = this.cartList.valid[index];
				if (item.cartNum) {
					this.setCartNum(item.id, item.cartNum);
				}
				this.switchSelect();
			},
			blurInput: function(index) {
				let item = this.cartList.valid[index];
				if (!item.cartNum) {
					item.cartNum = 1;
					this.$set(this.cartList, 'valid', this.cartList.valid)
				}
			},
			subCart: Debounce(function(item) {
				let that = this;
				let status = false;
				if (item.cartNum < 1) status = true;
				if (item.cartNum <= 1) {
					item.cartNum = 1;
					item.numSub = true;
					status = true;
				} else {
					item.cartNum = Number(item.cartNum) - 1;
					if (false == status) {
						that.setCartNum(item.id, item.cartNum, function(data) {
							item.numSub = false;
							item.numAdd = false;
							if (item.cartNum <= 1) {
								item.numSub = true;
							}
							that.cartAllCheck('goodsCheck')
						});
					}
				}

			}),
			addCart: Debounce(function(item) {
				let that = this;
				item.cartNum = Number(item.cartNum) + 1;
				if (item.cartNum < item.stock) {
					item.numAdd = false;
					item.numSub = false;
					that.setCartNum(item.id, item.cartNum, function(data) {
						that.cartAllCheck('goodsCheck')
					})
				} else if (item.cartNum === item.stock) {
					item.numAdd = true;
					item.numSub = false;
					that.setCartNum(item.id, item.cartNum, function(data) {
						that.cartAllCheck('goodsCheck')
					})
				} else {
					item.cartNum = item.stock;
					item.numAdd = true;
					item.numSub = false;
				}
			}),
			setCartNum(cartId, cartNum, successCallback) {
				let that = this;
				changeCartNum(cartId, cartNum).then(res => {
					successCallback && successCallback(res.data);
				}).catch(err => {
					return that.$util.Tips({
						title: err
					});
				});
			},
			//购物车数量
			getCartNum: function() {
				let that = this;
				getCartCounts(true, 'total').then(res => {
					that.cartCount = res.data.count;
				});
			},
			// 商铺全选
			storeAllCheck(item, index) {
				// item.noCheck为true表示店铺全是无库存商品，店铺不能操作选择功能
				if (item.noCheck) return;
				if (item.allCheck) {
					item.allCheck = false
					item.cartInfoList.forEach((el, index) => {
						el.check = false
					})
				} else {
					item.allCheck = true
					item.cartInfoList.forEach((el, index) => {
						if (!this.footerswitch) {
							el.check = true
						} else {
							if (parseFloat(el.stock) > 0) el.check = true
						}
					})
				}
				this.cartAllCheck('goodsCheck');
			},
			// 商品选中
			goodsCheck(goods) {
				goods.check = !goods.check
				this.cartAllCheck('goodsCheck')

			},
			// 全选判断
			cartAllCheck(type) {
				let allArr = [];
				let totalMoney = 0;
				let totalNum = 0;
				this.cartList.valid.forEach((el, index) => {
					//单独选中，else为点击全选功能
					if (type == 'goodsCheck') {
						//this.footerswitch管理开关，true是正常状态，false是开启管理状态
						if (this.footerswitch) {
							let tempStock = el.cartInfoList.filter(goods => {
								return goods.stock > 0
							})
							let tempArr = el.cartInfoList.filter(goods => {
								return goods.check == true
							})
							if ((tempStock.length == tempArr.length) && tempStock.length > 0 && tempArr.length >
								0) {
								el.allCheck = true
								allArr.push(el)
							} else {
								el.allCheck = false
							}
						} else {
							let tempArr = el.cartInfoList.filter(goods => {
								return goods.check == true
							})
							if (el.cartInfoList.length == tempArr.length) {
								el.allCheck = true
								allArr.push(el)
							} else {
								el.allCheck = false
							}
						}
						let allCheck = this.cartList.valid.filter(goods => {
							return goods.allCheck == true
						})
						// 全选
						this.isAllSelect = allArr.length == this.cartList.valid.length ? true : false
					} else {
						// 刚进入页面的全选功能
						el.cartInfoList.forEach((goods) => {
							if (this.footerswitch) {
								goods.check = this.isAllSelect && parseFloat(goods.stock) > 0
							} else {
								goods.check = this.isAllSelect
							}
						})
						if (this.footerswitch) {
							let tempStock = el.cartInfoList.filter(goods => {
								return goods.stock > 0
							})
							let tempArr = el.cartInfoList.filter(goods => {
								return goods.check == true
							})
							if (tempStock.length !== tempArr.length) {
								el.allCheck = false
							} else if (tempStock.length > 0 && tempArr.length > 0) {
								el.allCheck = true
							} else {
								el.noCheck = true
							}
						} else {
							el.allCheck = this.isAllSelect
							if (el.allCheck) allArr.push(el)
						}

						if (el.allCheck) allArr.push(el)
					}
					// 总金额 //总数
					el.cartInfoList.forEach(e => {
						if (e.check && e.stock > 0 && this.footerswitch) {
							totalMoney = this.$util.$h.Add(totalMoney, this.$util.$h.Mul(e.price, e
								.cartNum))
							totalNum += e.cartNum

						} else if (e.check && !this.footerswitch) {
							totalMoney = this.$util.$h.Add(totalMoney, this.$util.$h.Mul(e.price, e
								.cartNum))
							totalNum += e.cartNum
						}
					})
				})
				this.bayCount = totalNum
				this.selectCountPrice = totalMoney
				this.changePrice();
			},
			//购物车正常商品列表
			getCartList() {
				if (this.loading) return false;
				let data = {
					isValid: true
				}
				this.loading = true;
				getCartList(data).then(res => {
					let valid = res.data;
					this.$set(this.cartList, 'valid', valid);
					valid.forEach((item, index) => {
						item.cartInfoList.forEach((goods, j) => {
							if (goods.cartNum == 1) {
								goods.numSub = true;
							} else {
								goods.numSub = false;
							}
							if (goods.cartNum == goods.stock) {
								goods.numAdd = true;
							} else {
								goods.numAdd = false;
							}
						})
					})
					this.loading = false;
					if (this.cartList.valid) this.canShow = true;
					uni.hideLoading();
				}).catch(res => {
					uni.hideLoading();
				});
			},
			// 判断商品的初始状态是全部选中的
			getCheckGoods(valid) {
				let totalNum = 0;
				valid.forEach((item, index) => {
					item.cartInfoList.forEach((goods, j) => {
						if (this.footerswitch && this.isAllSelect) {
							goods.check = true
							totalNum += goods.cartNum
						} else {
							if (parseFloat(goods.stock) === 0) {
								goods.check = false
							} else {
								goods.check = true
								totalNum += goods.cartNum
							}
						}

						if (goods.cartNum == 1) {
							goods.numSub = true;
						} else {
							goods.numSub = false;
						}
						if (goods.cartNum == goods.stock) {
							goods.numAdd = true;
						} else {
							goods.numAdd = false;
						}
					})
					let tempStock = item.cartInfoList.filter(goods => {
						return goods.stock > 0
					})
					let tempArr = item.cartInfoList.filter(goods => {
						return goods.check == true
					})
					if (tempStock.length === 0 && tempArr.length === 0 && tempStock.length === tempArr.length) {
						item.allCheck = false
					} else {
						item.allCheck = true
					}
				})
				this.bayCount = totalNum;
			},
			//失效商品列表
			getInvalidList: function() {
				let that = this;
				if (this.loadingInvalid) return false;
				let data = {
					isValid: false
				}
				getCartList(data).then(res => {
					let invalidList = res.data;
					that.$set(that.cartList, 'invalid', invalidList);
					that.loadingInvalid = false;
					uni.hideLoading();
				}).catch(res => {
					uni.hideLoading();
					that.loadingInvalid = false;
				})

			},
			goodsOpen: function() {
				this.goodsHidden = !this.goodsHidden;
			},
			//管理按钮
			manage: function() {
				if (this.isAllSelect) {
					this.getCheckGoods(this.cartList.valid);
				}

				this.footerswitch = !this.footerswitch;
			},
			unsetCart: function() {
				let that = this,
					ids = [];
				this.cartList.invalid.forEach((el, index) => {
					el.cartInfoList.forEach(e => {
						ids.push(e.id);
					})
				})
				cartDel(ids).then(res => {
					that.$util.Tips({
						title: '清除成功'
					});
					that.$set(that.cartList, 'invalid', []);
				}).catch(res => {

				});
			},
			// 微信分享；
			setOpenShare: function(data) {
				let that = this;
				if (that.$wechat.isWeixin()) {
					let configAppMessage = {
						desc: data.synopsis,
						title: data.title,
						link: location.href,
						imgUrl: data.img
					};
					that.$wechat.wechatEvevt(["updateAppMessageShareData", "updateTimelineShareData"],
						configAppMessage);
				}
			},
			touchStart() {
				this.$refs.navBarRef.currentPage = false;
			},
			//点击优惠明细
			popupChange() {
				this.popupShow = !this.popupShow;
			},
			//改变价格
			changePrice() {
				let ids = [];
				this.checkProList = [];
				this.cartList.valid.forEach(item => {
					item.cartInfoList.forEach(item1 => {
						this.$set(item1, 'popupCheck', true);
						if (item1.check) {
							this.checkProList.push(item1);
							ids.push(item1.id);
						}

					})
				})
				this.getcartCalculatePrice(ids);
			},
			//弹窗中选中
			popupCheck(item) {
				let ids = [];
				let totalNum = 0;
				let allArr = []; //所有的数据
				let checkArr = []; //选中的数据
				this.$set(item, 'popupCheck', !item.popupCheck);
				this.cartList.valid.forEach(item1 => {
					item1.cartInfoList.forEach(item2 => {
						if (item2.id == item.id) {
							item2.check = !item2.check;
						}
						allArr.push(item)
					})
				})
				this.checkProList.forEach(item => {
					if (item.check) {
						ids.push(item.id);
						checkArr.push(item)
					}
				})
				this.getcartCalculatePrice(ids);
				this.checkProList.forEach(e => {
					if (e.check && e.stock > 0 && this.footerswitch) {
						totalNum += e.cartNum

					} else if (e.check && !this.footerswitch) {
						totalNum += e.cartNum
					}
				})
				// 全选
				this.isAllSelect = allArr.length === checkArr.length ? true : false
				this.bayCount = totalNum;
			},
			//计算价格
			getcartCalculatePrice(ids) {
				if (ids.length === 0) {
					this.selectCountPrice = 0.00;
					this.calculatePriceData.totalCouponPrice = 0.00;
					this.calculatePriceData.merCouponPrice = 0.00;
					this.calculatePriceData.platCouponPrice = 0.00;
					this.calculatePriceData.totalCouponPrice = 0.00;
					this.calculatePriceData.totalPrice = 0.00;
					return
				}
				cartCalculatePriceApi({
					ids: ids
				}).then(res => {
					this.calculatePriceData = res.data;
					this.selectCountPrice = this.calculatePriceData.proTotalPrice;
				}).catch(err => {
					this.bayCount = 0;
					this.selectCountPrice = 0.00;
					this.calculatePriceData.proTotalPrice = 0.00;
					this.calculatePriceData.totalCouponPrice = 0.00;
					this.calculatePriceData.merCouponPrice = 0.00;
					this.calculatePriceData.platCouponPrice = 0.00;
					this.calculatePriceData.totalCouponPrice = 0.00;
					this.calculatePriceData.totalPrice = 0.00;
					return this.$util.Tips({
						title: err
					});
				})
			}
		},
		onReachBottom() {
			let that = this;
			if (that.loadend) {
				that.getInvalidList();
			}
			if ((that.cartList.valid.length == 0 && that.cartList.invalid.length == 0 && !that.loading)) {
				that.$refs.recommendIndex.get_host_product();
			}

		}
	}
</script>

<style scoped lang="scss">
	.noCheckd {
		display: inline-block;
		width: 34rpx;
		height: 34rpx;
		border-radius: 50%;
		background-color: #fff;
		border: 1px solid #ccc;
	}

	.footerTop {
		bottom: 98rpx !important;
		bottom: calc(98rpx+ constant(safe-area-inset-bottom)) !important; ///兼容 IOS<11.2/
		bottom: calc(98rpx + env(safe-area-inset-bottom)) !important; ///兼容 IOS>11.2/
	}

	.fixheight {
		width: 100%;
		height: 152rpx;
		@include main_bg_color(theme);
		position: fixed;
	}

	.icon-jiantou {
		font-size: 20rpx;
	}

	.noCheck {
		width: 32rpx;
		height: 32rpx;
		border-radius: 50%;
		overflow: hidden;
		border: 1px solid #999999;
		background-color: #eee;
	}

	.invalidClas {
		position: relative;
		z-index: 111;
		top: -120rpx;
	}

	.invalidClasNO {
		position: static;
		margin-top: 15px;
	}

	.store-title {
		display: flex;
		align-items: center;
		width: 100%;
		padding: 0 30rpx;
		height: 85rpx;
		border-bottom: 1px solid #f0f0f0;

		.info {
			margin-left: 28rpx;
			align-items: center;
		}

		.name {
			margin-left: 8rpx;
		}
	}

	.cartBox {
		position: relative;
		/* #ifndef APP */
		top: 64rpx;
		/* #endif */
		/* #ifdef APP */
		top: 76rpx;
		/* #endif */
	}

	.cart_nav {
		position: fixed;
		@include main_bg_color(theme);
		top: 0;
		left: 0;
		z-index: 99;
		width: 100%;
	}

	.px-20 {
		padding: 0 20rpx 0;
	}

	.pl-20 {
		padding-left: 20rpx;
	}

	.justify-center {
		justify-content: center;
	}

	.align-center {
		align-items: center;
	}

	.px-20 {
		padding: 0 20rpx 0;
	}

	.container_detail {
		/* #ifdef MP */
		margin-top: 32rpx;
		/* #endif */
	}

	.tab_nav {
		width: 100%;
		height: 48px;
		padding: 0 30rpx 0;
	}

	.nav_title {
		width: 200rpx;
		color: #fff;
		font-size: 36rpx;
		position: fixed;
		text-align: center;
		left: 0;
		right: 0;
		margin: auto;
	}

	.pl-20 {
		padding-left: 20rpx;
	}

	.px-20 {
		padding: 0 20rpx 0;
	}

	.justify-center {
		justify-content: center;
	}

	.align-center {
		align-items: center;
	}

	.shoppingCart {
		/* #ifdef H5 */
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
		/* #endif */
		position: absolute;
		width: 100%;
		margin-bottom: 280rpx;
	}

	.shoppingCart .labelNav {
		height: 62rpx;
		padding: 0 24rpx;
		font-size: 28rpx;
		color: #fff;
		width: 100%;
		box-sizing: border-box;
		@include main_bg_color(theme);
		z-index: 5;
		position: fixed;
	}

	.shoppingCart .labelNav .item .iconfont {
		font-size: 26rpx;
		margin-right: 10rpx;
	}

	.shoppingCart .nav {
		height: 92rpx;
		background-color: #fff;
		padding: 0 20rpx;
		-webkit-box-sizing: border-box;
		box-sizing: border-box;
		font-size: 28rpx;
		color: #282828;
		z-index: 6;
		border-top-left-radius: 14rpx;
		border-top-right-radius: 14rpx;
	}

	.shoppingCart .nav .num {
		margin-left: 12rpx;
	}

	.shoppingCart .nav .administrate {
		font-size: 28rpx;
		color: #333333;
	}

	.shoppingCart .noCart {
		background-color: #f5f5f5;
		padding-top: 0.1rpx;
	}

	.shoppingCart .noCart .pictrue {
		width: 414rpx;
		height: 336rpx;
		margin: 30rpx auto 90rpx auto;
	}

	.shoppingCart .noCart .pictrue image {
		width: 100%;
		height: 100%;
	}

	.shoppingCart .list {
		width: 100%;
		// margin-top: 178rpx;
		/* #ifdef MP */
		// margin-bottom:120rpx;
		/* #endif */
		/* #ifndef MP */
		// margin-bottom:240rpx;
		/* #endif */
		overflow: hidden;
		border-bottom-left-radius: 14rpx;
		border-bottom-right-radius: 14rpx;
	}


	.shoppingCart .list .item {
		padding: 20rpx;
		background-color: #fff;
	}

	.shoppingCart .list .item .picTxt {
		width: 610rpx;
		position: relative;
	}

	.shoppingCart .list .item .picTxt .pictrue {
		width: 160rpx;
		height: 160rpx;
	}

	.shoppingCart .list .item .picTxt .pictrue image {
		width: 100%;
		height: 100%;
		border-radius: 6rpx;
	}

	.shoppingCart .list .item .picTxt .text {
		width: 432rpx;
		font-size: 28rpx;
		color: #282828;
	}

	.shoppingCart .list .item .picTxt .text .reColor {
		color: #999;
	}

	.shoppingCart .list .item .picTxt .text .reElection {
		margin-top: 20rpx;
	}

	.shoppingCart .list .item .picTxt .text .reElection .title {
		font-size: 24rpx;
		color: #666;
	}

	.shoppingCart .list .item .picTxt .text .reElection .reBnt {
		width: 120rpx;
		height: 46rpx;
		border-radius: 23rpx;
		font-size: 26rpx;
		@include coupons_border_color(theme);
		@include main_color(theme);
	}

	.shoppingCart .list .item .picTxt .text .infor {
		font-size: 24rpx;
		color: #999999;
		margin-top: 20rpx;
	}

	.money {
		font-size: 32rpx;
		font-weight: 600;
		@include price_color(theme);

		.price-color {
			@include price_color(theme);
		}
	}

	.mt-28 {
		margin-top: 28rpx;
	}

	.bg_color {
		@include main_bg_color(theme);
	}


	.icon-xuanzhong11,
	.icon-weixuan {
		font-size: 36rpx;
	}

	.shoppingCart .list .item .picTxt .carnum {
		height: 47rpx;
		position: absolute;
		bottom: 7rpx;
		right: 0;
	}

	.shoppingCart .list .item .picTxt .carnum view {
		text-align: center;
		height: 100%;
		line-height: 44rpx;
		font-size: 28rpx;
		color: #333;
	}

	.shoppingCart .list .item .picTxt .carnum .reduce {
		border-right: 0;
		border-radius: 3rpx 0 0 3rpx;
		border-radius: 22rpx 0rpx 0rpx 22rpx;
		font-size: 34rpx;
		line-height: 46rpx;
	}

	.shoppingCart .list .item .picTxt .carnum .on {
		color: #CCCCCC;
	}

	.shoppingCart .list .item .picTxt .carnum .plus {
		border-left: 0;
		border-radius: 0 3rpx 3rpx 0;
		border-radius: 0rpx 22rpx 22rpx 0rpx;
		font-size: 34rpx;
		line-height: 46rpx;
	}

	.shoppingCart .list .item .picTxt .carnum .num {
		color: #282828;
		width: 72rpx;
		height: 36rpx;
		line-height: 36rpx;
		background-color: #F5F5F5;
		border-radius: 4rpx;
		font-size: 24rpx;
	}

	.shoppingCart .invalidGoods {
		background-color: #fff;
		// margin-top: 30rpx;
		/* #ifdef MP */
		// margin-top: 140rpx;
		/* #endif */

	}

	.shoppingCart .invalidGoods .goodsNav {
		width: 100%;
		height: 90rpx;
		padding: 0 24rpx;
		box-sizing: border-box;
		font-size: 28rpx;
		color: #333333;
	}

	.shoppingCart .invalidGoods .goodsNav .iconfont {
		color: #424242;
		font-size: 28rpx;
		margin-right: 17rpx;
	}

	.shoppingCart .invalidGoods .goodsNav .del {
		font-size: 26rpx;
		color: #333;
	}

	.shoppingCart .invalidGoods .goodsNav .del .icon-shanchu1 {
		color: #333;
		font-size: 33rpx;
		vertical-align: -2rpx;
		margin-right: 8rpx;
	}

	.shoppingCart .invalidGoods .goodsList .item {
		padding: 24rpx;
	}

	.shoppingCart .invalidGoods .goodsList .picTxt {
		width: 592rpx;
	}

	.shoppingCart .invalidGoods .goodsList .item .invalid {
		font-size: 22rpx;
		color: #CCCCCC;
		height: 36rpx;
		border-radius: 3rpx;
		text-align: center;
		line-height: 36rpx;
	}

	.shoppingCart .invalidGoods .goodsList .item .pictrue {
		width: 160rpx;
		height: 160rpx;
	}

	.shoppingCart .invalidGoods .goodsList .item .pictrue image {
		width: 100%;
		height: 100%;
		border-radius: 6rpx;
	}

	.shoppingCart .invalidGoods .goodsList .item .text {
		width: 414rpx;
		font-size: 28rpx;
		color: #999;
		height: 140rpx;
	}

	.shoppingCart .invalidGoods .goodsList .item .text .name {
		width: 100%;
	}

	.shoppingCart .invalidGoods .goodsList .item .text .infor {
		font-size: 24rpx;
	}

	.shoppingCart .invalidGoods .goodsList .item .text .end {
		font-size: 26rpx;
		color: #bbb;
	}

	.footer {
		z-index: 999;
		width: 100%;
		height: 100rpx;
		background-color: #fff;
		position: fixed;
		padding: 0 24rpx;
		box-sizing: border-box;
		border-top: 1rpx solid #eee;
		bottom: var(--window-bottom);

	}

	.footer .checkAll {
		font-size: 28rpx;
		color: #282828;
		margin-left: 14rpx;
	}

	.footer .money {
		.font-color {
			font-weight: 600;
		}

		.all_text {
			font-size: 24rpx;
			color: #333;
			font-weight: 400;
		}

		.symbol {
			font-size: 26rpx;
		}

		.all_money {
			font-size: 38rpx;
		}

		.youhui {
			font-size: 20rpx;
			color: #999;
			font-weight: 400;
		}

		.mingxi {
			font-size: 22rpx;
			color: #999;
			font-weight: 400;
			padding-left: 14rpx;
		}
	}

	.footer .placeOrder {
		color: #fff;
		font-size: 30rpx;
		padding: 0 20rpx;
		height: 70rpx;
		border-radius: 50rpx;
		text-align: center;
		line-height: 70rpx;
		margin-left: 22rpx;
	}

	.footer .button .bnt {
		font-size: 28rpx;
		color: #999;
		border-radius: 50rpx;
		border: 1px solid #999;
		width: 160rpx;
		height: 60rpx;
		text-align: center;
		line-height: 60rpx;
	}

	.btn_cart_color {
		font-size: 14px;
		border-radius: 25px;
		width: 80px;
		height: 30px;
		text-align: center;
		line-height: 30px;
		@include coupons_border_color(theme);
		@include main_color(theme);
	}

	.footer .button form~form {
		margin-left: 17rpx;
	}

	.uni-p-b-96 {
		height: 96rpx;
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

	.allcheckbox .iconfont {
		margin-right: 16rpx;
	}

	.window {
		position: fixed;
		bottom: calc(var(--window-bottom) + 100rpx);
		width: 100%;
		left: 0;
		background-color: #fff;
		z-index: 77;
		border-radius: 20rpx 20rpx 0 0;
		padding-bottom: 0;
		transform: translate3d(0, 100%, 0);
		transition: all .2s cubic-bezier(0, 0, .25, 1);
	}

	.window.on {
		transform: translate3d(0, 0, 0);
	}

	.popup_content {
		height: 900rpx;
		padding: 40rpx 16rpx;
		box-sizing: border-box;

		._tit {
			font-weight: 500;
			color: #333;
			font-size: 32rpx;
			margin-bottom: 20rpx;
		}

		._desc {
			font-size: 24rpx;
			color: #999;
		}

		._pro_content {
			width: 100%;
			background: #F8F8F8;
			border-radius: 14rpx;
			margin: 20rpx 0 40rpx;
			padding: 30rpx 14rpx;
		}

		._pro_box {
			width: 100%;
			display: grid;
			grid-template-columns: repeat(4, 1fr);
			grid-template-rows: auto;
			grid-gap: 16rpx;

			._pic_item {
				width: 160rpx;
				height: 160rpx;
				position: relative;

				image {
					width: 100%;
					height: 100%;
					border-radius: 14rpx;
				}

				.checkbox {
					width: 34rpx;
					height: 34rpx;
					position: absolute;
					top: 6rpx;
					right: 10rpx;
					z-index: 9;

					.iconfont {
						font-size: 34rpx;
						color: #fff;
					}
				}
			}
		}

		._more {
			width: 100%;
			color: #666;
			font-size: 24rpx;
			margin-top: 30rpx;

			.iconfont {
				font-size: 24rpx;
				margin-left: 10rpx;
			}
		}

		._cell {
			font-size: 28rpx;
			margin-bottom: 40rpx;
			padding: 0 14rpx;

			._label {
				color: #666;
				font-weight: 400;
			}

			._count {
				color: #333;
			}
		}

		._cell_all {
			font-size: 32rpx;
			font-weight: 600;
			padding: 0 14rpx;

			._label {
				color: #333;
			}

			._count {
				color: #333;
				@include price_color(theme);
			}
		}
	}

	.window .icon-guanbi5 {
		position: absolute;
		font-size: 28rpx;
		color: #aaa;
		top: 30rpx;
		right: 30rpx;
		z-index: 1;
	}
</style>