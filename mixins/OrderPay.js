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
	svipOrderCreateApi
} from '@/api/activity.js';
import {
		orderPayApi
	} from '@/api/order.js';
import {
		ProductTypeEnum,
	} from "@/enums/productEnums";
export default {
	data() {
		return {
			ProductTypeEnum: ProductTypeEnum,
			isBuy: false //是否可以点击购买
		};
	},
	methods: {
		/**
		 * 调支付订单接口后的操作
		 * @param {Object} res 接口返回的值
		 * @param {Object} orderNo 订单号
		 * @param {Object} productType 商品类型
		 * @param {Object} fromType 页面来源
		 * @param {Object} payType 支付方式
		 * @param {Object} payPrice  支付金额
		 */
		handleOrderPay(res,orderNo,productType,fromType,payType,payPrice){
			let jsConfig = res.data.jsConfig;
			let goPages = ''
			if(fromType==='svip'){
				goPages = `/pages/goods/order_pay_status/index?order_id=${orderNo}&payType=${payType}&payPrice=${payPrice}&fromType=${fromType}`;
			}else{
				goPages = '/pages/goods/order_pay_status/index?order_id=' + orderNo;
			}
			switch (res.data.payType) {
				
				case 'weixin':
					uni.hideLoading();
					this.weixinPay(jsConfig, orderNo, goPages,productType,fromType);
					break;
				case 'yue':
					uni.hideLoading();
					uni.reLaunch({
						url: goPages + '&status=1'
					});
					break;
				case 'h5':
					uni.hideLoading();
					setTimeout(() => {
						location.href = jsConfig.mwebUrl + '&redirect_url=' + window
							.location
							.protocol + '//' + window.location.host + goPages +
							'&status=1';
					}, 500)
					break;
				case 'alipay':
					//#ifdef H5
					//h5支付
					uni.hideLoading();
					this.formContent = res.data.alipayRequest;
					this.$nextTick(() => {
						document.forms['punchout_form'].submit();
					})
					uni.setStorage({
						key: 'orderNo',
						data: orderNo
					});
					uni.setStorage({
						key: 'payResultfromType',
						data: fromType
					});
					//#endif
					// #ifdef APP-PLUS
					let alipayRequest = res.data.alipayRequest;
					uni.requestPayment({
						provider: 'alipay',
						orderInfo: alipayRequest,
						success: (e) => {
							setTimeout(res => {
								uni.hideLoading();
								uni.navigateTo({
                                    url: `/pages/goods/alipay_return/alipay_return?out_trade_no=${orderNo}&payChannel=appAlipay&payPrice=${payPrice}&fromType=${fromType}`
								})
							}, 500)
						},
						fail: (e) => {
							uni.hideLoading();
							uni.showModal({
								content: "支付失败",
								showCancel: false,
								success: function(res) {
									if (res.confirm) {
										//点击确认的操作
										uni.navigateTo({
											url: '/pages/goods/alipay_return/alipay_return?out_trade_no=' +
												orderNo +
												'&payChannel=' +
												'appAlipay'
										})
									}
								}
							})
						},
						complete: () => {
							uni.hideLoading();
						},
					});
					// #endif
					break;
			}
		},
		//微信支付
		weixinPay(jsConfig, orderNo, goPages,productType,fromType) {
			// #ifdef MP
			if (productType === 'video') {
				uni.requestOrderPayment({
					timeStamp: jsConfig.timeStamp,
					nonceStr: jsConfig.nonceStr,
					package: jsConfig.packages,
					signType: jsConfig.signType,
					paySign: jsConfig.paySign,
					ticket: productType === 'normal' ? null : jsConfig.ticket,
					success: function(ress) {
						setTimeout(res => {
							uni.hideLoading();
							uni.reLaunch({
								url: goPages
							})
						}, 500);
					},
					fail: function(e) {
						uni.hideLoading();
						return this.$util.Tips({
							title: '取消支付'
						}, {
							tab: 5,
							url: goPages + '&status=2'
						});
					},
					complete: function(e) {
						uni.hideLoading();
						//关闭当前页面跳转至订单状态
						if (e.errMsg == 'requestPayment:cancel') return this.$util.Tips({
							title: '取消支付'
						}, {
							tab: 5,
							url: goPages + '&status=2'
						});
					},
				})
			} else {
				uni.requestPayment({
					timeStamp: jsConfig.timeStamp,
					nonceStr: jsConfig.nonceStr,
					package: jsConfig.packages,
					signType: jsConfig.signType,
					paySign: jsConfig.paySign,
					ticket: productType === 'normal' ? null : jsConfig.ticket,
					success: function(ress) {
						setTimeout(res => {
							uni.hideLoading();
							uni.reLaunch({
								url: goPages
							})
						}, 500);
					},
					fail: function(e) {
						uni.hideLoading();
						return this.$util.Tips({
							title: '取消支付'
						}, {
							tab: 5,
							url: goPages + '&status=2'
						});
					},
					complete: function(e) {
						uni.hideLoading();
						//关闭当前页面跳转至订单状态
						if (e.errMsg == 'requestPayment:cancel') return this.$util.Tips({
							title: '取消支付'
						}, {
							tab: 5,
							url: goPages + '&status=2'
						});
					},
				})
			}
			// #endif
			// #ifdef H5
			let data = {
				timestamp: jsConfig.timeStamp,
				nonceStr: jsConfig.nonceStr,
				package: jsConfig.packages,
				signType: jsConfig.signType,
				paySign: jsConfig.paySign
			};
			if (this.$wechat.isWeixin()) {
				this.$wechat.pay(data).then(res => {
					setTimeout(res => {
						uni.hideLoading();
						uni.redirectTo({
							url: goPages
						})
					}, 500);
				}).catch(res => {
					uni.hideLoading();
					return this.$util.Tips({
						title: '取消支付'
					}, {
						tab: 5,
						url: goPages + '&status=2'
					});
				});
			} else {
				setTimeout(() => {
					location.href = jsConfig.mwebUrl + '&redirect_url=' + window.location.protocol + '//' + window.location.host + goPages;
				}, 100)
				uni.hideLoading();
			}
			// #endif
			// #ifdef APP-PLUS
			let mp_pay_name = ''
			if (uni.requestOrderPayment) {
				mp_pay_name = 'requestOrderPayment'
			} else {
				mp_pay_name = 'requestPayment'
			}
			uni[mp_pay_name]({
				provider: 'wxpay',
				orderInfo: {
					"appid": jsConfig.appId, // 微信开放平台 - 应用 - AppId，注意和微信小程序、公众号 AppId 可能不一致
					"noncestr": jsConfig.nonceStr, // 随机字符串
					"package": "Sign=WXPay", // 固定值
					"partnerid": jsConfig.partnerid, // 微信支付商户号
					"prepayid": jsConfig.packages, // 统一下单订单号
					"timestamp": Number(jsConfig.timeStamp), // 时间戳（单位：秒）
					"sign": this.systemPlatform === 'ios' ? 'MD5' : jsConfig.paySign // 签名，这里用的 MD5 签名
				}, //微信、支付宝订单数据 【注意微信的订单信息，键值应该全部是小写，不能采用驼峰命名】
				success: function(res) {
					uni.hideLoading();
					setTimeout(res => {
						uni.redirectTo({
							url: goPages
						})
					}, 500)
				},
				fail: function(err) {
					uni.hideLoading(); 
					uni.showModal({
						content: "支付失败",
						showCancel: false,
						success: function(res) {
							if (res.confirm) {
								uni.redirectTo({
									url: goPages + '&status=2'
								})
							}
						}
					})
				},
				complete: (err) => {
					uni.hideLoading();
				}
			});
			// #endif
		},
		//购买svip
		svipOnCreateOrder(data, orderNo,payType,payPrice,fromType) {
			svipOrderCreateApi(data).then(res => {
				let jsConfig = res.data.jsConfig;
				let goPages = `/pages/goods/order_pay_status/index?order_id=${res.data.orderNo}&payType=${payType}&payPrice=${payPrice}&fromType=${fromType}`;
				this.weixinPay(jsConfig, res.data.orderNo, goPages,'normal',fromType)
			}).catch(err => {
				uni.hideLoading();
				return this.$util.Tips({
					title: err
				});
			});
		},
		
		/**
		 * 跳入支付收银台页面
		 * @param {Object} secondType 二级订单类型
		 * @param {data} res 订单对象
		 */
		getToPayment(secondType,data) {
			let url = `/pages/goods/order_payment/index?orderNo=${data.orderNo}&payPrice=${data.payPrice}`
			// let url = ''
			// if(secondType === this.ProductTypeEnum.Integral){
			// 	url = `/pages/goods/order_payment/index?orderNo=${data.orderNo}&payPrice=${data.payPrice}&fromType=integral`
			// }else{
			// 	url = `/pages/goods/order_payment/index?orderNo=${data.orderNo}&payPrice=${data.payPrice}`
			// }
			uni.redirectTo({
				url: url
			});
		},
		
		/**
		 * 订单支付
		 * @param {Object} orderNo 订单号
		 * @param {Object} payChannel  支付渠道
		 * @param {Object} payType 支付方式
		 * @param {Object} productType 商品类型
		 * @param {Object} fromType  页面来源
		 * @param {Object} payPrice  支付金额
		 */
		changeOrderPay(orderNo, payChannel, payType ,productType, fromType, payPrice) {
			orderPayApi({
				orderNo: orderNo,
				payChannel: payChannel,
				payType: payType,
				scene: productType === 'normal' ? 0 : 1177
			
			}).then(res => {
				this.handleOrderPay(res, orderNo, productType, fromType, payType, payPrice)
			}).catch(err => {
				uni.hideLoading();
				this.isBuy = false;
				return this.$util.Tips({
					title: err
				});
			});
		}
	}
};