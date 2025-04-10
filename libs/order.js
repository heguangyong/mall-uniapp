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
	preOrderApi,refundOrderRevokeApi
} from '@/api/order.js';
import util from '@/utils/util'
import animationType from '@/utils/animationType.js'
import { ProductMarketingTypeEnum, ProductTypeEnum } from "@/enums/productEnums";

/**
 * 去订单详情
 */
export function goOrderDetail(orderNo) {
	return new Promise(resolve => {
		if (!orderNo) return that.$util.Tips({
			title: '缺少订单号无法查看订单详情'
		});
		// #ifdef MP
		uni.navigateTo({
			url: '/pages/goods/order_details/index?orderNo=' + orderNo
		})
		// #endif  
		// #ifndef MP
		uni.navigateTo({
			animationType: animationType.type,
			animationDuration: animationType.duration,
			url: '/pages/goods/order_details/index?orderNo=' + orderNo
		})
		// #endif
	});
}

/**
 * 去商品详情
 */
export function goProductDetail(id, marketingType, params) {
	return new Promise(resolve => {
		// #ifdef MP
		uni.navigateTo({
			url: `/pages/goods/goods_details/index?id=${id}&mt=${marketingType}${params}`
		})
		// #endif
		// #ifndef MP
		uni.navigateTo({
			animationType: animationType.type,
			animationDuration: animationType.duration,
			url: `/pages/goods/goods_details/index?id=${id}&mt=${marketingType}${params}`
		})
		// #endif
	});
}

/**
 * 活动商品、普通商品、购物车、再次购买预下单
 */
export function onGetPreOrder(preOrderType, orderDetails) {
	return new Promise((resolve, reject) => {
		preOrderApi({
			"preOrderType": preOrderType,
			"orderDetails": orderDetails
		}).then(res => {
			uni.navigateTo({
				url: '/pages/goods/order_confirm/index?orderNo=' + res.data.orderNo
			});
		}).catch(err => {
			return util.Tips({
				title: err
			});
		})
	});
}

/**
 * 售后，撤销售后申请
 */
export function onRevokeRefund(refundOrderNo) {
	return new Promise((resolve, reject) => {
		uni.showModal({
			title: '提示',
			content: '确定要撤销本次退款申请吗？',
			success: function(res) {
				if (res.confirm) {
					refundOrderRevokeApi(refundOrderNo).then(res => {
						resolve()
					}).catch(err => {
						return util.Tips({
							title: err
						});
					})
				} else if (res.cancel) {
					console.log('用户点击取消');
				}
			}
		});
	});
}

/**
 * 去协议详情
 */
export function goToAgreement(from) {
    return new Promise(resolve => {
        // #ifdef MP
        uni.navigateTo({
            url: `/pages/goods/agreement_info/index?from=${from}`
        })
        // #endif
        // #ifndef MP
        uni.navigateTo({
            animationType: animationType.type,
            animationDuration: animationType.duration,
            url: `/pages/goods/agreement_info/index?from=${from}`
        })
        // #endif
    });
}

// 普通商品、虚拟（开启可申请退款开关）、视频号可申请退款
export function isRefund(orderInfo) {
	return (
		orderInfo.type === ProductMarketingTypeEnum.Normal &&
		(orderInfo.secondType === ProductTypeEnum.Normal ||
			orderInfo.secondType === ProductTypeEnum.Fictitious ||
			orderInfo.secondType === ProductTypeEnum.Video)
	)
}