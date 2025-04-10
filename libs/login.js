// +----------------------------------------------------------------------
// | CRMEB [ CRMEB赋能开发者，助力企业发展 ]
// +----------------------------------------------------------------------
// | Copyright (c) 2016~2025 https://www.crmeb.com All rights reserved.
// +----------------------------------------------------------------------
// | Licensed CRMEB并不是自由软件，未经许可不能去掉CRMEB相关版权
// +----------------------------------------------------------------------
// | Author: CRMEB Team <admin@crmeb.com>
// +----------------------------------------------------------------------

import store from "../store";
import Cache from '../utils/cache';
import { Debounce } from '@/utils/validate.js'
// #ifdef H5 || APP-PLUS
import { isWeixin } from "../utils";
import auth from './wechat';
// #endif

import { LOGIN_STATUS, USER_INFO, EXPIRES_TIME, STATE_R_KEY, BACK_URL, GLOBAL_DATA} from './../config/cache';
import {globalConfigApi} from "../api/public";
import util from "../utils/util";

function prePage(){
	let pages = getCurrentPages();
	let prePage = pages[pages.length - 1];
	return prePage.$page.fullPath;
}

export const toLogin = Debounce(_toLogin,800)

export function _toLogin(push, pathLogin) {
	// 公众号登录方式(单选),1微信授权，2手机号登录/
	let publicLoginType = Cache.get('publicLoginType');

	let path = prePage();
	let login_back_url = Cache.get(BACK_URL);
	// #ifdef H5
	path = location.href;
	path = location.pathname + location.search;
	// #endif
	if(!pathLogin){
		pathLogin = '/page/users/login/index'
		Cache.set(BACK_URL,path);
	}
		
	// #ifdef H5
	if (isWeixin() && publicLoginType ==1) {
		let urlData = location.pathname + location.search
		if (urlData.indexOf('?') !== -1) {
			urlData += '&go_longin=1';
		} else {
			urlData += '?go_longin=1';
		}
		if (!Cache.has('snsapiKey')) {
			auth.oAuth('snsapi_base', urlData);
		} else {
			uni.navigateTo({
				url: '/pages/users/wechat_login/index'
			})
		}
	} else {
		uni.navigateTo({
			url: '/pages/users/login/index'
		})
	}
	// #endif
	
	if (['pages/user/index','/pages/user/index','/pages/order_addcart/order_addcart'].indexOf(login_back_url) == -1) {
		// #ifdef MP
		uni.navigateTo({
			 url: '/pages/users/wechat_login/index'
		})
		// #endif
		// #ifdef APP-PLUS
			uni.showModal({
			    title: '登录提示',
			    content: '登录以后可体验商城完整功能',
				cancelColor: '#000000',
				showCancel: false, // 是否显示取消按钮，默认为 true
				confirmColor: '#526BB1',
			    success: function (res) {
			        if (res.confirm) {
			           uni.navigateTo({
			           	url: '/pages/users/login/index'
			           })
			        } else if (res.cancel) {
			            uni.navigateTo({
			            	url: '/pages/index/index'
			            })
			        }
			    }
			});
		// #endif
	}
}


export function checkLogin()
{
	let token = Cache.get(LOGIN_STATUS);
	let expiresTime = Cache.get(EXPIRES_TIME);
	let newTime = Math.round(new Date() / 1000);
	if (expiresTime < newTime || !token){
		Cache.clear(LOGIN_STATUS);
		Cache.clear(EXPIRES_TIME);
		Cache.clear(USER_INFO);
		Cache.clear(STATE_R_KEY);
		return false;
	}else{
		store.commit('UPDATE_LOGIN',token);
		let userInfo = Cache.get(USER_INFO,true);
		if(userInfo){
			store.commit('UPDATE_USERINFO',userInfo);
		}
		return true;
	}

}
