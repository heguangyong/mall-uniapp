// +----------------------------------------------------------------------
// | CRMEB [ CRMEB赋能开发者，助力企业发展 ]
// +----------------------------------------------------------------------
// | Copyright (c) 2016~2025 https://www.crmeb.com All rights reserved.
// +----------------------------------------------------------------------
// | Licensed CRMEB并不是自由软件，未经许可不能去掉CRMEB相关版权
// +----------------------------------------------------------------------
// | Author: CRMEB Team <admin@crmeb.com>
// +----------------------------------------------------------------------


import request from "@/utils/request.js";

/**
 * 获取购物车数量
 * @param numType boolean true 购物车数量,false=购物车产品数量
 */
export function getCartCounts(numType,type) {
	return request.get("cart/count?numType=" + numType + "&type=" + type);
}
/**
 * 获取购物车列表
 *
 */
export function getCartList(data) {
	return request.get("cart/list", data);
}

/**
 * 修改购物车数量
 * @param int cartId  购物车id
 * @param int number 修改数量
 */
export function changeCartNum(cartId, number) {
	return request.post("cart/num", {
		id: cartId,
		number: number
	});
}
/**
 * 清除购物车
 * @param object
 */
export function cartDel(ids) {
	if (typeof ids === 'object')
		ids = ids;
	return request.post('cart/delete', {
		ids: ids
	});
}

/**
 * 购物车重选提交
 *
 */
export function getResetCart(data) {
	return request.post('cart/resetcart', data);
}

/**
 * 订单列表
 * @param object data
 */
export function getOrderList(data) {
	return request.get('order/list', data);
}

/**
 * 订单产品信息
 * @param string unique
 */
export function orderProduct(data) {
	return request.post('order/product', data);
}

/**
 * 订单评价
 * @param object data
 *
 */
export function orderComment(data) {
	return request.post('order/reply/product', data);
}

/**
 * 订单支付
 * @param object data
 */
export function orderPayApi(data) {
	return request.post('pay/payment', data);
}

/**
 * 订单头部数量
 */
export function orderNum() {
	return request.get('user/center/order/num')
}

/**
 * 订单取消
 * @param string id
 *
 */
export function orderCancel(orderNo) {
	return request.post(`order/cancel/${orderNo}`);
}

/**
 * 删除已完成订单
 * @param string orderNo
 *
 */
export function orderDel(orderNo) {
	return request.post(`order/delete/${orderNo}`);
}

/**
 * 订单详情
 * @param string uni
 */
export function getOrderDetail(uni) {
	return request.get('order/detail/' + uni);
}

/**
 * 再次下单
 * @param string uni
 *
 */
export function orderAgain(uni) {
	return request.post('order/again', {
		orderNo: uni
	});
}

/**
 * 订单收货
 * @param string orderNo
 *
 */
export function orderTake(orderNo) {
	return request.post(`order/take/delivery/${orderNo}`);
}

/**
 * 订单查询物流信息
 * @returns {*}
 */
export function express(invoiceId) {
	return request.get(`order/logistics/${invoiceId}`);
}

/**
 * 获取退款理由
 *
 */
export function ordeRefundReason() {
	return request.get('refund/reason');
}

/**
 * 订单退款申请
 * @param object data
 */
export function orderRefundVerify(data) {
	return request.post('refund/apply', data);
}

/**
 * 订单确认获取订单详细信息
 * @param string cartId
 */
export function orderConfirm(cartId, isNew, addAgain,secKill,combination,bargain) {
	return request.post('order/confirm', {
		cartIds: cartId,
		isNew: isNew,
		addAgain: addAgain,
		secKill: secKill,
		combination:combination,
		bargain:bargain
	});
}

/**
 * 获取当前订单可用优惠券
 * @param string price
 *
 */
export function getCouponsOrderPrice(preOrderNo, merId) {
	return request.get(`coupon/order/list?merId=${merId}&preOrderNo=${preOrderNo}`)
}

/**
 * 订单创建
 * @param string key
 * @param object data
 *
 */
export function orderCreate(data) {
	return request.post('order/create', data);
}

/**
 * 计算订单金额
 * @param key
 * @param data
 * @returns {*}
 */
export function postOrderComputed(data) {
	return request.post("order/computed/price", data);
}

/**
 * 将字符串 转base64
 * @param object data
 */
export function strToBase64Api(data) {
	return request.post('qrcode/str/to/base64', data);
}

/**
 * 微信查询支付结果
 * @param object data
 */
export function wechatQueryPayResult(data) {
	return request.get(`pay/query/wechat/payment/result`,data);
}

/**
 * 支付宝查询支付结果
 * @param object data
 */
export function alipayQueryPayResult(orderNp) {
	return request.get(`pay/query/ali/pay/result/${orderNp}`);
}

/**
 * 预下单
 * @param object data
 */
export function preOrderApi(data) {
	return request.post(`order/pre/order`, data);
}

/**
 * 加载预下单
 * @param object preOrderNo
 */
export function loadPreOrderApi(preOrderNo) {
	return request.get(`order/load/pre/${preOrderNo}`);
}

/**
 * 获取支付配置
 * @param object preOrderNo
 */
export function getPayConfigApi(preOrderNo) {
	return request.get(`pay/get/config`);
}

/**
 * 评价列表
 *
 */
export function orderReplyList(data) {
	return request.get(`order/reply/list`, data)
}

/**
 * 售后申请列表(可申请售后列表)
 *
 */
export function orderAfterSaleList(data) {
	return request.get(`refund/after/sale/apply/list`, data)
}

/**
 * 退款订单列表
 *
 */
export function orderRefundList(data) {
	return request.get(`refund/list`, data)
}

/**
 * 退款订单详情
 *
 */
export function orderRefundInfoApi(refundOrderNo) {
	return request.get(`refund/detail/${refundOrderNo}`)
}

/**
 * 获取订单发货单列表
 *
 */
export function orderInvoiceListInfo(orderNo) {
	return request.get(`order/${orderNo}/invoice/list`)
}

/**
 * 订单状态图
 *
 */
export function orderStatusImgApi() {
	return request.get(`order/status/image`)
}

/**
 * 购物车商品价格计算
 *
 */
export function cartCalculatePriceApi(data) {
	return request.post(`cart/calculate/price`,data)
}

/**
 * 撤销退款单
 *
 */
export function refundOrderRevokeApi(refundOrderNo) {
	return request.post(`refund/revoke/${refundOrderNo}`)
}

/**
 * 获取物流公司列表
 *
 */
export function expressAllApi() {
	return request.get(`express/all`)
}

/**
 * 退款单退回商品
 *
 */
export function returningGoodsApi(data) {
	return request.post(`refund/returning/goods`,data)
}