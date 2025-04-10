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
 * 首页店铺列表-根据id集合加载
 */
export function getMerListbyidsApi(ids){
  return request.get(`index/merchant/listbyids/${ids}`,{},{noAuth:true});
}

/**
 * 首页店铺列表
 * @param
 */
export function indexMerListApi() {
  return request.get(`index/merchant/list`, {}, {noAuth:true});
}

/**
 * 店铺详细信息
 * @param int id
 */
export function getMerDetailApi(id) {
  return request.get(`merchant/detail/${id}`, {}, {noAuth:true});
}

/**
 * 店铺首页信息
 * @param int id
 */
export function getMerIndexInfoApi(id) {
  return request.get(`merchant/index/info/${id}`, {}, {noAuth:true});
}

/**
 * 商户搜索列表
 * @param Obj data
 */
export function getMerSearchApi(data) {
  return request.get(`merchant/search/list`, data, {noAuth:true});
}

/**
 * 商户入驻申请
 * @param Obj data
 */
export function getMerSettledApplyApi(data) {
  return request.post(`merchant/settled/apply`, data);
}

/**
 * 商户入入驻记录
 * @param Obj data
 */
export function getMerSettledRecordApi(data) {
  return request.get(`merchant/settled/record`, data);
}

/**
 * 店铺街
 * @param Obj data
 */
export function getMerStreetApi(data) {
  return request.get(`merchant/street`, data , {noAuth:true});
}

/**
 * 商户商品列表
 * @param Obj data
 */
export function getMerProListApi(data) {
  return request.get(`product/merchant/pro/list`, data , {noAuth:true});
}

/**
 * 商户商品分类列表
 * @param Obj data
 */
export function getMerCategoryApi(id) {
  return request.get(`merchant/product/category/cache/tree/${id}`, {}, {noAuth:true});
}

/**
 * 收藏店铺
 * @param int id
 */
export function getMerCollectAddApi(id) {
  return request.post(`collect/add/merchant/${id}`);
}

/**
 * 取消收藏店铺
 * @param int id
 */
export function getMerCollectCancelApi(id) {
  return request.post(`collect/cancel/merchant/${id}`);
}

/**
 * 商户收藏列表
 * @param Obj data
 */
export function getMerCollectListApi(data) {
  return request.get(`collect/merchant/list`,data);
}

/**
 * 获取全部商户分类列表
 */
export function getMerCategoryListApi() {
  return request.get(`merchant/all/category/list`, {}, {noAuth:true});
}

/**
 * 获取全部商户类型列表
 */
export function getMerTypeListApi() {
  return request.get(`merchant/all/type/list`, {}, {noAuth:true});
}

/**
 * 获取入驻协议
 */
export function settledAgreementApi() {
  return request.get(`merchant/settled/agreement`);
}

/**
 * 获取商户自提信息
 */
export function takeTheirApi(id) {
  return request.get(`merchant/get/take/their/${id}`);
}

/**
 * 发送入驻申请短信验证码
 */
export function sendSettledCodeApi(data) {
  return request.post(`merchant/send/settled/code`, data);
}

/**
 * 商户客服信息
 */
export function merCustomerApi(id) {
  return request.get(`merchant/customer/service/info/${id}`, {}, {noAuth:true});
}

/**
 * 首页店铺列表
 */
export function getDiyMerListApi(num) {
  return request.get(`index/merchant/list/${num}`, {}, {noAuth:true});
}

/**
 * 获取商户地址信息
 */
export function getMerAddressApi(id) {
  return request.get(`merchant/get/address/${id}`, {}, {noAuth:true});
}

/**
 * 店铺装修详情
 */
export function getMerDiyInfoApi(merId,id) {
  return request.get(`merchant/page/diy/info/${merId}/${id}`, {}, {noAuth:true});
}
