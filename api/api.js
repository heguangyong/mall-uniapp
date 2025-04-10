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
 * 首页接口，公共接口 ，优惠券接口 , 行业此讯 , 手机号码注册
 *
*/

/**
 * 首页 获取底部导航信息
 *
*/
export function getBottomNavigationApi()
{
  return request.get("index/get/bottom/navigation",{},{ noAuth : true});
}

/**
 * 首页 第一级商品分类
 *
*/
export function getCategoryFirst()
{
  return request.get("product/category/get/first",{},{ noAuth : true});
}

/**
 * 首页 第三级商品分类
 *
*/
export function getCategoryThird(id)
{
  return request.get(`product/category/get/third/${id}`,{},{ noAuth : true});
}

/**
 * 获取主页数据 无需授权
 *
*/
export function getIndexData()
{
  return request.get("index/info",{},{ noAuth : true});
}

/**
 * 获取登录授权login
 *
*/
export function getLogo()
{
  return request.get('wechat/getLogo', {}, { noAuth : true});
}


/**
 * 保存form_id
 * @param string formId
 */
export function setFormId(formId) {
  return request.post("wechat/set_form_id", { formId: formId});
}

/**
 * 领取优惠卷
 * @param int couponId
 *
*/
export function setCouponReceive(couponId){
  return request.post(`coupon/receive/${couponId}`);
}
/**
 * 优惠券列表
 * @param object data
*/
export function getCoupons(data){
  return request.get('coupon/page/list',data,{noAuth:true})
}

/**
 * 我的优惠券
 * @param int types 0全部  1未使用 2已使用
*/
export function getUserCoupons(data){
  return request.get('coupon/user/list',data)
}

/**
 * 文章分类列表
 *
*/
export function getArticleCategoryList(){
  return request.get('article/category/list',{},{noAuth:true})
}

/**
 * 文章列表
 * @param int cid
 *
*/
export function getArticleList(cid,data){
  return request.get(`article/list/${cid}`, data,{noAuth:true})
}

/**
 * 文章 热门列表
 *
*/
export function getArticleHotList(){
  return request.get('article/hot/list',{},{noAuth:true});
}

/**
 * 文章 轮播列表
 *
*/
export function getArticleBannerList(){
  return request.get('article/banner/list',{},{noAuth:true})
}

/**
 * 文章详情
 * @param int id
 *
*/
export function getArticleDetails(id){
  return request.get(`article/info/${id}`,{noAuth:true});
}

/**
 * 获取短信KEY
 * @param object phone
*/
export function verifyCode(){
  return request.get('verify_code', {},{noAuth:true})
}

/**
 * 换绑手机号获取用户手机号验证码
 * @param object phone
*/
export function registerVerify(phone){
  return request.post('user/phone/code', {noAuth:true})
}

/**
 * 换绑手机号获取验证码
 * @param object data
*/
export function bindingPhoneCode(data){
  return request.post('user/update/binding/phone/code', data,{noAuth:true})
}

/**
 * 手机号修改密码获取验证码
 */
export const updatePasswordCodeApi = () => {
    return request.post(`user/update/password/phone/code`,{},{noAuth:true})
}

/**
 * 手机号注册
 * @param object data
 *
*/
export function phoneRegister(data){
  return request.post('register',data,{noAuth:true});
}

/**
 * 手机号修改密码
 * @param object data
 *
*/
export function phoneRegisterReset(data){
  return request.post('user/register/reset',data,{noAuth:true})
}

/**
 * 手机号+密码登录
 * @param object data
 *
*/
export function phoneLogin(data){
  return request.post('login',data,{noAuth:true})
}

/**
 * 切换H5登录
 * @param object data
*/
// #ifdef MP
export function switchH5Login(){
  return request.post('switch_h5', { 'from':'routine'});
}
// #endif

/*
 * h5切换公众号登录
 * */
// #ifdef H5
export function switchH5Login() {
  return request.post("switch_h5", { 'from': "wechat" });
}
// #endif

/**
 * 换绑手机号
 *
*/
export function bindingPhone(data){
  return request.post('user/update/binding',data);
}

/**
 * 换绑手机号校验
 *
*/
export function bindingVerify(data){
  return request.post('update/binding/verify',data);
}

/**
 * 获取订阅消息id
 */
export function getTemlIds(data)
{
  return request.get('wechat/program/my/temp/list', data , { noAuth:true});
}

/**
 * 首页拼团数据
 */
export function pink()
{
  return request.get('pink', {}, { noAuth:true});
}

/**
 * 获取城市信息
 */
export function getCity(data) {
  return request.get('city/list', data, { noAuth: true });
}

/**
 * 获取小程序直播列表
 */
export function getLiveList(page,limit) {
  return request.get('wechat/live', { page, limit}, { noAuth: true });
}

/**
 * 获取小程序二维码
 */
export function mpQrcode(data) {
  return request.post('qrcode/get/wechat',data,{ noAuth: true });
}

/**
 * 获取主题换色配置
 */
export function getTheme() {
  return request.get('index/color/config',{},{noAuth:true});
}

/**
 * 获取APP版本更新信息
 */
export function getAppVersion() {
  return request.get('index/index/get/version',{},{noAuth:true});
}

/**
 * 获取全局本地图片域名
 */
export function getImageDomain() {
  return request.get('image/domain',{},{noAuth:true});
}

/**
 * 商品排行榜
*/
export function productRank(){
  return request.get('product/leaderboard',{},{noAuth:true});
}

/**
 * 协议详情
*/
export function agreementInfo(info){
  return request.get(`agreement/${info}`,{},{noAuth:true});
}

/**
 * 校验token是否有效
*/
export function tokenIsExistApi(){
  return request.post(`login/token/is/exist`,{},{noAuth:true});
}

/**
 * 获取DIY数据
*/
export function getDiy(id){
  return request.get(`pagediy/info/${id}`,{},{noAuth:true});
}

/**
 * 首页优惠券
 */
export function getIndexCoupon(num){
  return request.get(`index/coupon/info/${num}`,{},{noAuth:true});
}
/**
 * id获取系统表单
 */
export function systemFromDetail(id){
  return request.get(`system/form/detail/${id}`,{},{noAuth:true});
}
/**
 * 获取开屏广告信息
 */
export function getOpenAdvApi(){
  return request.get(`index/splash/ad/info`,{},{noAuth:true});
}