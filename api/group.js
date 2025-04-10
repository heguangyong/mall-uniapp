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
 * 获取首页拼团信息
 * 
*/
export function getGroupIndexApi(limit){
  return request.get(`groupbuy/activity/list/${limit}`,{},{ noAuth : true});
}

/**
 * sku列表
 * 
*/
export function groupSkuListApi(data) {
  return request.get(`groupbuy/sku/list`,data);
}

/**
 * 拼团商品列表
 * 
*/
export function groupBuySkuListApi(data) {
  return request.get(`groupbuy/sku/product/list`,data,{ noAuth : true});
}

/**
 * 商户首页拼团卡片数据获取
 */
export function groupbuyMerchantApi(merId,limit){
  return request.get(`groupbuy/activity/merchant/${merId}/page/${limit}`,{},{ noAuth : true});
}

/**
 * 商户拼团商品sku分页列表
 */
export function groupbuyMerchantListApi(data){
  return request.get(`groupbuy/sku/merchant/product/page`,data,{ noAuth : true});
}