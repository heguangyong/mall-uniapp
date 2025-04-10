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
 * 获取产品详情
 * @param int id
 * 
 */
export function getProductDetail(id, marketingType, type,groupActivityId) {
	// return request.get('product/detail', params, {
	// 	noAuth: true
	// });
	return request.get(`product/detail?id=${id}&marketingType=${marketingType}&type=${type}&groupActivityId=${groupActivityId}`, {}, {
		noAuth: true
	});
}

/**
 * 产品分享二维码 推广员
 * @param int id
 */
// #ifndef MP
export function getProductCode(id) {
	return request.get('product/code/' + id, {});
}
// #endif
// #ifdef MP
export function getProductCode(id) {
	return request.get('product/code/' + id, {
		user_type: 'routine'
	});
}
// #endif

/**
 * 添加收藏
 * @param int id
 * @param string category product=普通产品,product_seckill=秒杀产品
 */
export function collectAdd(id, category) {
	return request.post('collect/add/product', {
		productId: id,
		'category': 0
	});
}

/**
 * 取消收藏产品
 * @param int id
 */
export function collectCancel(data) {
	return request.post(`collect/cancel/product`, data);
}


/**
 * 购物车添加
 * 
 */
export function postCartAdd(data) {
	return request.post('cart/add', data, {});
}

/**
 * 获取分类列表
 * 
 */
export function getCategoryList() {
	return request.get('product/category/get/tree', {}, {
		noAuth: true
	});
}

/**
 * 商品列表 搜索页面
 * @param object data
 */
export function productList(data) {
	return request.get('product/list', data, {
		noAuth: true
	});
}

/**
 * 获取推荐产品
 * 
 */
export function getProductHot(params) {
	return request.get("index/product/list", params, {
		noAuth: true
	});
}
/**
 * 购物车移入收藏
 * 
 * @param ids Array
 */
export function cartToCollect(ids) {
	return request.post('cart/to/collect', {
		ids: ids
	});
}

/**
 * 首页商品列表
 * @param int type 
 * 
 */
export function getGroomList(data) {
	return request.get('index/product', data, {
		noAuth: true
	});
}

/**
 * 获取收藏列表
 * @param object data
 */
export function getCollectUserList(data) {
	return request.get('collect/product/list', data)
}

/**
 * 获取产品评论
 * @param int id
 * @param object data
 * 
 */
export function getReplyList(id, data) {
	return request.get('product/reply/list/' + id, data,{
		noAuth: true
	})
}

/**
 * 产品评价数量和好评度
 * @param int id
 */
export function getReplyConfig(id) {
	return request.get('product/reply/config/' + id,{},{
		noAuth: true
	});
}

/**
 * 获取搜索关键字获取
 * 
 */
export function getSearchKeyword() {
	return request.get('index/search/keyword', {}, {
		noAuth: true
	});
}

/**
 * 详情页产品评论
 * @param int id
 * @param object data
 * 
 */
export function getReplyProduct(id) {
	return request.get(`product/reply/detail/${id}`, {},{
		noAuth: true
	})
}

/**
 * 获取商品的sku
 * @returns {*}
 */
export function getAttr(id) {
  return request.get("product/sku/detail/" + id);
}

/**
 * 获取优惠券商品列表
 * @returns {*}
 */
export function getCouponProList(data) {
  return request.get("product/coupon/pro/list", data);
}

/**
 * 系统优惠券商品列表
 * @returns {*}
 */
export function getSystemCouponProList(data) {
  return request.get("product/system/coupon/pro/list", data);
}

/**
 * 批量添加购物车
 * @returns {*}
 */
export function cartBatchAddApi(data) {
  return request.post("cart/batch/add", data);
}

/**
 * 已购商品列表
 * @returns {*}
 */
export function purchasedApi(data) {
  return request.get("product/purchased/list",data);
}

/**
 * 足迹商品列表
 * @returns {*}
 */
export function proBrowseApi(data) {
  return request.get("product/browse/list",data);
}

/**
 * 根据商品id集合查询对应商品
 * @param {string} ids
 */
export function productByidsApi(ids) {
	return request.get(`product/byids/${ids}`,{}, {
		noAuth: true
	});
}

/**
 * 会员商品分页列表
 * @param {object} data
 */
export function productMemberApi(data) {
	return request.get(`product/member/list`,data);
}