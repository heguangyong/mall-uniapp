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
 * 商户激活
 * 
*/
export function merchantActive(data) {
  return request.get(`employee/merchant/active/${data}`);
}
/**
 * 商户管理-订单分页列表
 * 
*/
export function employeeOrderList(data) {
  return request.get(`employee/order/list`,data);
}
/**
 * 订单详情
 * 
*/
export function employeeOrderInfo(orderNo) {
  return request.get(`employee/order/info/${orderNo}`);
}
/**
 * 订单备注
 * 
*/
export function employeeOrderMark(data) {
  return request.post(`employee/order/mark`,data);
}
/**
 * 订单发货
 * 
*/
export function employeeOrderSend(data) {
  return request.post(`employee/order/send`,data);
}
/**
 * 发货单列表
 * 
*/
export function employeeInvoiceList(orderNo) {
  return request.get(`employee/order/${orderNo}/invoice/list`);
}
/**
 * 直接退款
 * 
*/
export function employeeDirectRefund(data) {
  return request.post(`employee/order/direct/refund`,data);
}
/**
 * 订单发货列表
 * 
*/
export function orderInvoiceListInfo(orderNo) {
  return request.get(`employee/order/${orderNo}/invoice/list`);
}
/**
 * 订单核销
 * 
*/
export function employeeOrderCancel(data) {
  return request.post(`employee/order/verification`,data);
}
/**
 * 修改配送信息
 * 
*/
export function employeeOrderInvoiceUpdate(data) {
  return request.post(`employee/order/invoice/update`,data);
}
// -------------商品-------------------------
/**
 * 商品分页
 * 
*/
export function employeeProductList(data) {
  return request.get(`employee/product/list`,data);
}
/**
 * 商品上架
 * 
*/
export function employeeProductUp(data) {
  return request.post(`employee/product/up/${data}`);
}
/**
 * 商品下架
 * 
*/
export function employeeProductDown(data) {
  return request.post(`employee/product/down/${data}`);
}
/**
 * 批量上架
 * 
*/
export function employeeBatchUp(data) {
  return request.post(`employee/product/batch/up`,data);
}
/**
 * 批量下架
 * 
*/
export function employeeBatchDown(data) {
  return request.post(`employee/product/batch/down`,data);
}
/**
 * 批量加入回收站
 * 
*/
export function employeeBatchRecycle(data) {
  return request.post(`employee/product/batch/recycle`,data);
}
/**
 * 恢复商品
 * 
*/
export function employeeRestore(data) {
  return request.post(`employee/product/restore/${data}`);
}
/**
 * 批量恢复商品
 * 
*/
export function employeeBatchRestore(data) {
  return request.post(`employee/product/batch/restore`,data);
}
/**
 * 删除商品
 * 
*/
export function employeeProductDelete(data) {
  return request.post(`employee/product/delete`,data);
}
/**
 * 批量删除商品
 * 
*/
export function employeeBatchDelete(data) {
  return request.post(`employee/product/batch/delete`,data);
}
/**
 * 商品提审
 * 
*/
export function employeeSubmitAudit(data) {
  return request.post(`employee/product/submit/audit/${data}`);
}
/**
 * 批量提审
 * 
*/
export function employeeBatchAudit(data) {
  return request.post(`employee/product/batch/submit/audit`,data);
}
/**
 * 商品详情
 * 
*/
export function employeeProductInfo(data) {
  return request.get(`employee/product/info/${data}`);
}

/**
 * 无状态编辑
 * 
*/
export function reviewFreeEdit(data) {
  return request.post(`employee/product/anytime/edit`,data);
}
/**
 * 快捷添加
 * 
*/
export function quickStockAdd(data) {
  return request.post(`employee/product/quick/stock/add`,data);
}
/**
 * 商品表头数量接口
 * 
*/
export function productTabsHeaders(data) {
  return request.get(`employee/product/tabs/headers`,data);
}
/**
 * 订单表头数量接口
 * 
*/
export function orderStatusNum(data) {
  return request.get(`employee/order/status/num`,data);
}
/**
 * 订单表头数量接口
 * 
*/
export function orderDetailList(data) {
  return request.get(`employee/order/${data}/detail/list`);
}
// ------------------------------------------------------
/**
 * 售后分页列表
 * 
*/
export function refundOrderList(data) {
  return request.get(`employee/refund/order/list`,data);
}
/**
 * 退款备注
 * 
*/
export function refundOrderMark(data) {
  return request.post(`employee/refund/order/mark`,data);
}
/**
 * 退款单各状态数量
 * 
*/
export function refundStatusNum(data) {
  return request.get(`employee/refund/order/status/num`,data);
}
/**
 * 审核
 * 
*/
export function refundOrderAudit(data) {
  return request.post(`employee/refund/order/audit`,data);
}
/**
 *确认收货
 * 
*/
export function refundReceiving(data) {
  return request.post(`employee/refund/order/receiving/${data}`);
}
/**
 *拒绝收货
 * 
*/
export function refundReceivingReject(data) {
  return request.post(`employee/refund/order/receiving/reject`,data);
}
/**
 *退款单详情
 * 
*/
export function refundOrderDetail(data) {
  return request.get(`employee/refund/order/detail/${data}`);
}
// 核销------------------------------
/**
 *订单核销详情
 * 
*/
export function orderGetVerfication(data) {
  return request.post(`employee/order/get/verification`,data);
}
// 首页数据-------------------------------------
/**
 *首页数据
 * 
*/
export function statisticsIndex() {
  return request.get(`employee/statistics/home/index`);
}
/**
 *经营数据
 * 
*/
export function statisticsOperatingData() {
  return request.get(`employee/statistics/home/operating/data`);
}
/**
 *商品分类tree
 * 
*/
export function productCategroyGetTree(id) {
  return request.get(`merchant/product/category/cache/tree/${id}`);
}
// 地址------------------------------------------
/**
 *地址列表
 * 
*/
export function employeeAddressList() {
  return request.get(`employee/address/list`);
}
/**
 *物流公司列表
 * 
*/
export function expressSearchPage(data) {
  return request.get(`employee/express/search/page`,data);
}
/**
 *小票打印
 * 
*/
export function printReceipt(data) {
  return request.get(`employee/order/printreceipt/${data}`);
}
/**
 *订单细节详情列表(分单)
 * 
*/
export function sendDetailList(data) {
  return request.get(`employee/order/${data}/detail/list`);
}
/**
 *商户配送人员分页列表
 * 
*/
export function deliveryPersonnelApi(data) {
  return request.get(`employee/merchant/delivery/personnel/page`,data);
}
/**
 *获取归属商户列表
 * 
*/
export function MerchantBelongListApi(data) {
  return request.get(`employee/merchant/belong/List`,data);
}
/**
 *获取电子面单
 * 
*/
export function employeeExpressTemplate(data) {
  return request.get(`employee/express/template`,data);
}

/**
 *获取电子面单配送信息
 * 
*/
export function employeeExpressElectInfo(data) {
  return request.get(`employee/merchant/elect/info`,data);
}