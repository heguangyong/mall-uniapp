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
 * 获取首页秒杀信息
 * 
*/
export function getSeckillIndexApi(){
  return request.get('index/seckill/info',{},{ noAuth : true});
}

/**
 * 秒杀时段信息
 * 
*/
export function getSeckillHeaderApi(){
  return request.get('seckill/activity/time/info',{},{ noAuth : true});
}

/**
 * 秒杀商品列表
 * 
*/
export function getSeckillListApi(data){
  return request.get('seckill/product/list',data,{ noAuth : true});
}

/**
 * 优惠券列表
 * 
*/
export function getCouponLstApi(data){
  return request.get('coupon/voucher/collection/center',data,{ noAuth : true});
}

/**
 * 优惠券列表
 * 
*/
export function couponReceiveApi(id){
  return request.post(`coupon/receive/${id}`);
}

/**
 * 获取svip会员权益列表
 * 
*/
export function svipBenefitsListApi(){
  return request.get(`member/get/svip/benefits/list`);
}

/**
 * 获取svip会员中心信息
 * 
*/
export function svipInfoApi(){
  return request.get(`member/get/svip/info`);
}

/**
 * 生成购买svip会员订单
 * 
*/
export function svipOrderCreateApi(data){
  return request.post(`member/svip/order/create`,data);
}

/**
 * svip会员订单购买记录
 * 
*/
export function svipOrderRecordApi(){
  return request.post(`member/svip/order/record`);
}

/**
 * 积分商品分页列表(积分区间)
 * 
*/
export function integralListApi(data){
  return request.get(`integral/shopping/interval/product/page`, data);
}

/**
 * 获取积分区间列表
 * 
*/
export function integralCategoryApi(){
  return request.get(`integral/shopping/get/integral/interval`);
}

/**
 * 积分商品热门推荐分页列表
 * 
*/
export function integralProductHotApi(data){
  return request.get(`integral/shopping/product/hot/page`,data, { noAuth : true});
}

/**
 * 获取用户积分数据
 */
export function userIntegralApi(){
  return request.get(`integral/shopping/get/user/integral`);
}

/**
 * 拼团订单中查看拼团活动 - 用于分享 (自己购买过)
 * 
*/
export function groupbuySkuOrderShare(orderNo){
  return request.get(`groupbuy/sku/order/share/${orderNo}`);
}

/**
 * 拼团订单中查看拼团活动 - 用于参团 (自己还没购买)
 * 
*/
export function groupbuySkuOrderReadShare(groupActivityId,productId,recordId){
  return request.get(`groupbuy/sku/order/readshare/${groupActivityId}/${productId}/${recordId}`,{},{ noAuth : true});
}

/**
 * 商户秒杀商品列表
 */
export function seckillMerchantApi(data){
  return request.get(`seckill/merchant/product/page`,data,{ noAuth : true});
}

/**
 * 获取秒杀样式
 */
export function seckillStyleApi(){
  return request.get(`seckill/get/style`,{},{ noAuth : true});
}