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
import wechat from "@/libs/wechat.js";
import {
	toLogin,
	checkLogin
} from '../libs/login';
/**
 * 获取微信公众号js配置
 * @returns {*}
 */
export function getWechatConfig() {
  return request.get("wechat/get/public/js/config",{ url: encodeURIComponent(wechat.signLink()) },{ noAuth: true });
}

/**
 * 获取微信sdk配置
 * @returns {*}
 */
export function wechatAuth(code, spread) {
	var reg=/^[0-9]+.?[0-9]*$/; //判断字符串是否为数字 ，判断正整数用/^[1-9]+[0-9]*]*$/
	spread = reg.test(spread) ? spread : 0;
  return request.post(
    "login/wechat/public", {code:code,spreadPid:spread},
    { noAuth: true }
  );
}

/**
 * 获取登录授权login
 * 
*/
export function loginConfigApi()
{
  return request.get('login/config', {}, { noAuth : true});
}

/**
 * 小程序用户登录
 * @param data object 小程序用户登录信息
 */
export function login(data) {
  return request.post("login/wechat/routine", data, { noAuth : true });
}
/**
 * 分享
 * @returns {*}
 */
export function getShare() {
  return request.get("share", {}, { noAuth: true });
}

/**
 * 获取关注海报
 * @returns {*}
 */
export function follow() {
  return request.get("wechat/follow", {}, { noAuth: true });
}

/**
 * 获取图片base64
 * @retins {*}
 * */
export function imageBase64(image) {
  return request.post("qrcode/url/to/base64",image,{ noAuth: true });
}

/**
 * 自动复制口令功能
 * @returns {*}
 */
export function copyWords() {
  return request.get("copy_words", {}, { noAuth: true });
}

/**
 * 微信（公众号，小程序）绑定手机号
 * @param {Object} data
 */
export function getUserPhone(data){
	return request.post('login/wechat/register/binding/phone',data,{noAuth : true});
}

/**
 * APP微信登录
 * @param {Object} data
 */
export function appAuth(data) {
	return request.post("login/wechat/app/login", data, { noAuth : true });
}

/**
 * 苹果登录
 * @param {Object} data
 */
export function appleLogin(data) {
	return request.post("login/ios/login", data, { noAuth : true });
}

/**
 * 苹果绑定手机号
 * @param {Object} data
 */
export function iosBinding(data) {
	return request.post("ios/binding/phone", data, { noAuth : true });
}

/**
 * 微信地址导入
 * @param {Object} data
 */
export function addressWxImportApi(data) {
	return request.post("address/wechant/import", data);
}

/**
 * 微信直播间列表
 * @param {Object} data
 */
export function liveroomApi(data) {
	return request.get("wechat/liveroom", data, { noAuth : true });
}

/**
 * 全局配置信息
 */
export function globalConfigApi() {
	return request.get("index/global/config/info", {}, { noAuth : true });
}