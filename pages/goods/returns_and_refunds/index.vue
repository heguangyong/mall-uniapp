<template>
	<view :data-theme="theme">
		<form @submit="submitForm" report-submit='true'>
			<view class='apply-return'>
				<view class='goodsStyle borRadius14'>
					<view class="acea-row row-between">
						<view class='pictrue'>
							<image :src='orderInfo.image'></image>
						</view>
						<view class='text'>
							<view class='name line1 line-heightOne mb20'>{{orderInfo.productName}}</view>
							<view class='sku text-999 f-s-20 line-heightOne mb20'>{{orderInfo.sku}}</view>
							<view class='acea-row f-s-26 text-right row-middle'>
								<view class="mr10 text-2828">￥{{orderInfo.price || orderInfo.refundPrice}} </view>
								<view class='num text-999'> x {{orderInfo.applyRefundNum}}</view>
							</view>
						</view>
					</view>
				</view>
				<view v-if="returnGoodsType===2 && merAddress" class="list borRadius14 py-30">
					<view class="acea-row row-between">
						<view class="text-2828 f-s-28 line-heightOne mb30">到店退货地址：</view>
						<!-- #ifdef H5 -->
						<button class="button line-heightOne copy-data"
							:data-clipboard-text="merAddress.name+','+merAddress.phone+','+merAddress.addressDetail"><text
								class="copy">复制</text></button>
						<!-- #endif -->
						<!-- #ifndef H5 -->
						<button class="button line-heightOne" @tap="copy(merAddress.name+','+merAddress.phone+','+merAddress.addressDetail)"><text class="copy">复制</text></button>
						<!-- #endif -->
					</view>
					<view class="text-2828 f-s-28 mb20"><text
							class="text-2828">{{merAddress.name}}</text><text>{{merAddress.phone}}</text></view>
					<view class="text-666 f-s-26 addressDetail">{{merAddress.addressDetail}}</view>
				</view>
				<view class='list borRadius14'>
					<view v-if="returnGoodsType===1 && expressAll.length" class='item acea-row row-between-wrapper'>
						<view>物流公司</view>
						<view class="picker">
							<picker @change="bindExpressChange" :value="expressIndex" :range="expressAll"
								range-key="name">
								<view class="picker-box">
									{{expressAll[expressIndex].name}}
									<text class="iconfont icon-jiantou"></text>
								</view>
							</picker>
						</view>
					</view>
					<view v-if="returnGoodsType===1" class='item acea-row row-between-wrapper'>
						<view>物流单号</view>
						<view class="text-right">
							<input type='text' placeholder='请输入物流单号' placeholder-style="color:#ccc;"
								name='trackingNumber' :value="trackingNumber" placeholder-class='placeholder'
								maxlength="30"></input>
						</view>
					</view>
					<view class='item acea-row row-between-wrapper no-border'>
						<view>联系电话</view>
						<view class="text-right">
							<input type='text' placeholder='请输入联系电话' placeholder-style="color:#ccc;" name='telephone'
								:value="telephone" placeholder-class='placeholder' maxlength="11"></input>
						</view>
					</view>
				</view>
				<view class="returnBntBox">
					<button class='returnBnt bg_color' form-type="submit">提交信息</button>
				</view>
			</view>
		</form>
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
		expressAllApi,
		returningGoodsApi
	} from '@/api/order.js';
	import {
		getMerAddressApi
	} from '@/api/merchant.js'
	import {
		toLogin
	} from '@/libs/login.js';
	import {
		mapGetters
	} from "vuex";
	import {
		Debounce
	} from '@/utils/validate.js';
	import ClipboardJS from "@/plugin/clipboard/clipboard.js";
	let app = getApp();
	export default {
		data() {
			return {
				orderInfo: {},
				theme: app.globalData.theme,
				expressAll: [],
				expressIndex: 0,
				telephone: '',
				trackingNumber: '',
				refundOrderNo: '',
				returnGoodsType: 1, //退货类型：0-不退货 1-快递退回，2-到店退货
				merAddress: null //店铺地址
			};
		},
		computed: mapGetters(['isLogin']),
		onLoad: function(options) {
			this.$set(this, 'orderInfo', JSON.parse(this.$Cache.get('productInfo')));
			if (!options.refundOrderNo) return this.$util.Tips({
				title: '缺少退款单id,无法退回商品'
			}, {
				tab: 3,
				url: 1
			});
			this.refundOrderNo = options.refundOrderNo;
			this.returnGoodsType = options.returnGoodsType ? Number(options.returnGoodsType) : 1;
			if (this.returnGoodsType === 1) {
				if (!this.$Cache.get('expressListAll')) {
					this.getExpressAll();
				} else {
					this.expressAll = JSON.parse(this.$Cache.get('expressListAll'))
				}
			} else {
				this.getMerAddress()
			}
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
			//剪切订单号
			// #ifndef H5
			copy: function(orderNo) {
				let that = this;
				uni.setClipboardData({
					data: orderNo
				});
			},
			// #endif
			//物流公司
			getExpressAll() {
				expressAllApi().then(res => {
					this.$set(this, 'expressAll', res.data);
					this.$Cache.set('expressListAll', res.data)
				}).catch(err => {
					return this.$util.Tips({
						title: err
					});
				})
			},
			//选择物流公司
			bindExpressChange(e) {
				this.expressIndex = e.target.value;
			},
			//店铺地址
			getMerAddress() {
				getMerAddressApi(this.orderInfo.merId).then(res => {
					this.$set(this, 'merAddress', res.data);
				}).catch(err => {
					return this.$util.Tips({
						title: err
					});
				})
			},
			//提交
			submitForm: Debounce(function(e) {
				let that = this,
					data = {},
					value = e.detail.value;
				if (!value.trackingNumber && this.returnGoodsType === 1) return that.$util.Tips({
					title: '请填写物流单号'
				});
				if (!value.telephone) return that.$util.Tips({
					title: '请填写联系电话'
				});
				if (!/^1(3|4|5|7|8|9|6)\d{9}$/i.test(value.telephone)) return that.$util.Tips({
					title: '请输入正确的手机号码'
				});
				uni.showLoading({
					title: '保存中',
					mask: true
				})
				if (that.returnGoodsType === 1) {
					data = {
						refundOrderNo: that.refundOrderNo,
						telephone: value.telephone,
						trackingNumber: value.trackingNumber,
						expressName: that.expressAll[that.expressIndex].name
					}
				} else {
					data = {
						refundOrderNo: that.refundOrderNo,
						telephone: value.telephone
					}
				}
				returningGoodsApi(data).then(res => {
					uni.hideLoading();
					return that.$util.Tips({
						title: '退回商品成功',
						icon: 'success'
					}, {
						tab: 5,
						url: '/pages/goods/user_return_list/index?isT=1'
					});
				}).catch(err => {
					uni.hideLoading();
					return that.$util.Tips({
						title: err
					});
				})
			})
		}
	}
</script>

<style scoped lang="scss">
	.addressDetail {
		line-height: 36rpx;
	}

	.text-right {
		width: 480rpx;
	}

	.button {
		width: 76rpx;
		height: 34rpx;
		border-radius: 34rpx;
		font-size: 20rpx;
		line-height: 34rpx;
		color: #666666;
		border-radius: 17rpx;
		border: 1px solid #999999;
		text-align: center;

		&.copy {
			color: #666666;
		}
	}

	.goodsStyle {
		.text {
			.name {
				font-size: 28rpx;
			}
		}

	}

	.icon-jiantou {
		margin-left: 10rpx;
		font-size: 28rpx;
		color: #BBBBBB;
	}

	.apply-return {
		padding: 20rpx 24rpx 30rpx 24rpx;
	}

	.apply-return .list {
		background-color: #fff;
		margin-top: 20rpx;
		padding: 0 24rpx;
	}

	.apply-return .list .item {
		min-height: 90rpx;
		border-bottom: 1rpx solid #eee;
		font-size: 30rpx;
		color: #282828;
	}

	.apply-return .list .item .num {
		color: #282828;
		width: 427rpx;
		text-align: right;
	}

	.apply-return .list .item .num .picker .iconfont {
		color: #666;
		font-size: 30rpx;
		margin-top: 2rpx;
	}
    .returnBntBox{
		width: 100%;
		position: fixed;
		bottom: 0;
		left: 0;
		margin: 30rpx auto;
	}
	.apply-return .returnBnt {
		font-size: 32rpx;
		color: #fff;
		width: 100%;
		height: 86rpx;
		border-radius: 50rpx;
		text-align: center;
		line-height: 86rpx;
	}

	.bg_color {
		@include main_bg_color(theme);
	}
</style>