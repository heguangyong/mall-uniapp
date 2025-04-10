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
 * 获取用户信息
 * 
*/
export function getUserInfoApi(){
  return request.get('user/info');
}

/**
 * 设置用户分享
 * 
*/
export function userShare(){
  return request.post('user/share');
}

/**
 * h5用户登录
 * @param data object 用户账号密码
 */
export function loginH5(data) {
  return request.post("login/mobile/password", data, { noAuth : true });
}

/**
 * h5用户手机号 验证码登录
 * @param data object
 */
export function loginMobile(data) {
  return request.post("login/mobile/captcha", data, { noAuth : true });
}

/**
 * 验证码key
 */
export function getCodeApi() {
  return request.get("verify_code", {}, { noAuth: true });
}

/**
 * h5用户发送验证码
 * @param data object 用户手机号
 */
export function registerVerify(phone){
  return request.post('login/send/code', { phone: phone },{noAuth:true})
}

/**
 * h5用户手机号注册
 * @param data object 用户手机号 验证码 密码
 */
export function register(data) {
  return request.post("register", data, { noAuth : true });
}

/**
 * 用户手机号修改密码
 * @param data object 用户手机号 验证码 密码
 */
export function registerReset(data) {
  return request.post("register/reset", data, { noAuth: true });
}

/**
 * 获取个人中心详情
 *
 */
export function userCenterInfo() {
  return request.get("user/center/info");
}

/**
 * 签到页信息
*/
export function signInfo(data){
  return request.get('sign/page/info', data)
}

/**
 * 签到记录列表(年月)
 * @param object data
 * 
*/
export function getSignMonthList(data){
  return request.get('sign/record/list',data)
}

/**
 * 活动状态
 * 
*/
export function userActivity(){
  return request.get('user/activity');
}

/*
 * 余额明细（types|2=全部,1=支出,2=收入）
 * */
export function getCommissionInfo(data) {
  return request.get("retail/store/brokerage/record", data);
}

/*
 * 用户结算记录
 * */
export function getClosingRecordApi(data) {
  return request.get("retail/store/user/closing/record", data);
}

/*
 * 提现总金额 
 * */
export function getCountApi() {
  return request.get("extract/totalMoney");
}

/*
 * 积分记录
 * */
export function getIntegralList(q) {
  return request.get("user/center/integral/list", q);
}

/**
 * 获取分销海报图片
 * 
*/
export function spreadBanner(){
	return request.get('retail/store/user/poster/banner');
}

/**
 *
 * 获取推广用户一级和二级
 * @param object data
*/
export function spreadPeople(data){
  return request.get('retail/store/spread/people/list',data);
}

/**
 * 
 * 推广佣金/提现总和
 * @param int type
*/
export function spreadCount(type){
  return request.get('spread/count/'+type);
}

/*
 * 推广数据 当前佣金 提现总金额
 * */
export function myPromotion() {
  return request.get("user/center/my/promotion");
}


/**
 * 
 * 推广订单
 * @param object data
*/
export function spreadOrder(data){
  return request.get('retail/store/spread/order/list',data);
}

/*
 * 获取推广人排行
 * */
export function getRankList(type) {
  return request.get("retail/store/spread/people/rank", type);
}

/*
 * 获取佣金排名
 * */
export function getBrokerageRank(type) {
  return request.get("retail/store/brokerage/rank", type);
}

/**
 * 用户结算申请
 * @param object data
*/
export function extractCash(data){
  return request.post('retail/store/user/closing/apply',data)
}

/**
 * 会员等级列表
 * 
*/
export function userLevelGrade(){
  return request.get('user/level/grade');
}

/**
 * 获取某个等级任务
 * @param int id 任务id
*/
export function userLevelTask(id){
  return request.get('user/level/task/'+id);
}

/**
 * 检查用户是否可以成为会员
 * 
*/
export function userLevelDetection(){
  return request.get('user/level/detection');
}

/**
 * 
 * 地址列表
*/
export function getAddressList(){
  return request.get('address/list');
}

/**
 * 设置默认地址
 * @param int id
*/
export function setAddressDefault(id){
  return request.post(`address/set/default/${id}`)
}

/**
 * 修改 地址
 * @param object data
*/
export function editAddress(data){
  return request.post('address/edit',data);
}

/**
 * 添加 地址
 * @param object data
*/
export function addAddress(data){
  return request.post('address/add',data);
}

/**
 * 删除地址
 * @param int id
 * 
*/
export function delAddress(id){
  return request.post(`address/delete/${id}`)
}

/**
 * 地址详情
 * @param int id 
*/
export function getAddressDetail(id){
  return request.get(`address/detail/${id}`);
}

/**
 * 获取微信地址信息
 * @param object data 
*/
export function getWxAddressInfo(data){
  return request.post(`address/wechat/info`, data);
}

/**
 * 修改用户信息
 * @param object
*/
export function userEdit(data){
  return request.post('user/user/edit',data);
}

/*
 * 退出登录
 * */
export function getLogout() {
  return request.get("login/logout");
}

/**
 * 注销账户
 * @param object data
 * 
 */
export function userOut(data) {
	return request.post(`user/logoff`, data)
}

/**
 * 小程序充值
 * 
*/
export function rechargeRoutine(data){
  return request.post('recharge/routine',data)
}
/*
 * 公众号充值
 * */
export function rechargeWechat(data) {
  return request.post("recharge/wechat", data);
}

/*
 * app微信充值
 * */
export function appWechat(data) {
  return request.post("recharge/wechat/app", data);
}

/*
 * 佣金转入
 * */
export function transferIn(data) {
  return request.post("retail/store/brokerage/to/yue", data,1);
}

/*
 * 生成用户充值订单
 * */
export function rechargeCreateApi(data) {
    return request.post("recharge/user/create", data);
}

/*
 * 支付宝充值
 * */
export function alipayFull(data) {
  return request.post("recharge/alipay", data,{});
}

/**
 * 获取默认地址
 * 
*/
export function getAddressDefault(){
  return request.get('address/get/default');
}

/**
 * 充值金额选择
 */
export function getRechargeApi() {
  return request.get("recharge/get/user/package");
}

/**
 * 登录记录
 */
export function setVisit(data)
{
  return request.post('user/set_visit', {...data}, { noAuth:true});
}

/**
 * 客服列表
 */
export function serviceList() {
  return request.get("user/service/lst");
}
/**
 * 客服详情
 */
export function getChatRecord(to_uid, data) {
  return request.get("user/service/record/" + to_uid, data);
}

/**
 * 绑定推广关系
 * @param {number} spreadPid
 */
export function spreadApi(spreadPid)
{
	return request.post(`retail/store/binding/user/${spreadPid}`);
}

/**
 * 会员等级经验值；
 * 
 */
export function getlevelInfo()
{
	return request.get("user/center/user/level/grade");
}

/**
 * 经验值明细；
 * 
 */
export function getlevelExpList(data)
{
	return request.get("user/expList",data);
}

/**
 * 我的账户金额明细；
 * 
 */
export function getMyAccountApi()
{
	return request.get("user/center/my/account");
}

/**
 * 账单记录；
 * 
 */
export function getBillList(data)
{
	return request.get("user/center/balance/record",data);
}

/*
 * 积分中心详情
 * */
export function postIntegralUser() {
  return request.get("user/center/my/integral");
}

/*
 * 推广人统计页 推广人数（一级+二级）、一级人数、二级人数
 * */
export function spreadPeoCount() {
  return request.get("retail/store/spread/people/team/num");
}

/*
 * 用户结算配置
 * */
export function closingConfigApi() {
  return request.get("retail/store/user/closing/config");
}

/*
 * 足迹记录
 * */
export function browseRecordApi() {
  return request.get("user/center/browse/record");
}

/*
 * 我的经验
 * */
export function myExpApi() {
  return request.get("user/center/my/exp");
}

/*
 * 我的经验记录列表
 * */
export function myExpRecordApi(data) {
  return request.get("user/center/my/exp/record/list", data);
}

/**
 * 版权图片
*/
export function copyrightImageApi(){
  return request.get(`index/copyright/company/image`,{},{noAuth:true});
}

/**
 * 版权图片
*/
export function userLevelRuleApi(){
  return request.get(`agreement/user/level/rule`);
}