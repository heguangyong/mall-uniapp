// +----------------------------------------------------------------------
// | CRMEB [ CRMEB赋能开发者，助力企业发展 ]
// +----------------------------------------------------------------------
// | Copyright (c) 2016~2025 https://www.crmeb.com All rights reserved.
// +----------------------------------------------------------------------
// | Licensed CRMEB并不是自由软件，未经许可不能去掉CRMEB相关版权
// +----------------------------------------------------------------------
// | Author: CRMEB Team <admin@crmeb.com>
// +----------------------------------------------------------------------

import { spreadApi } from "@/api/user";
import Cache from "@/utils/cache";
import { getCity } from '@/api/api.js';
import Store from '@/store/index';
import store from "../store";

/**
 * 取值
 */
export function configMap(args, init) {
	if(Array.isArray(args)) {
		return args.reduce((i, v)=>{
			i[v] = () => Store.getters.globalData[v];
			return i;
		}, init || {})
	}else{
		return Object.keys(args).reduce((i, v)=>{
			i[v] = () => {
				const val = Store.getters.globalData[v];
				return (val === undefined || val === null || val === '') ? args[v] : val;
			};
			return i;
		}, init || {})
	}
}

/**
 * 获取浏览器的分销码
 * @param options
 */
export function getUserSpread(options){
	if(options.sd) store.commit('Change_Spread', options.sd);
}

/**
 * 静默授权绑定上下级,绑定后清除分销码
 * @param islogin
 * @param sd
 */
export function silenceBindingSpread(islogin,sd) {
	if (islogin && sd) {
		spreadApi(sd).then(res => {
			//#ifdef MP
			getApp().globalData.spread = 0;
			//#endif
			//清空分销码
			store.commit("Change_Spread",0)
		}).catch(res => {})
	}
}

export function isWeixin() {
	return navigator.userAgent.toLowerCase().indexOf("micromessenger") !== -1;
}

export function parseQuery() {
	const res = {};

	const query = (location.href.split("?")[1] || "")
		.trim()
		.replace(/^(\?|#|&)/, "");

	if (!query) {
		return res;
	}

	query.split("&").forEach(param => {
		const parts = param.replace(/\+/g, " ").split("=");
		const key = decodeURIComponent(parts.shift());
		const val = parts.length > 0 ? decodeURIComponent(parts.join("=")) : null;

		if (res[key] === undefined) {
			res[key] = val;
		} else if (Array.isArray(res[key])) {
			res[key].push(val);
		} else {
			res[key] = [res[key], val];
		}
	});

	return res;
}

// #ifdef H5
const VUE_APP_WS_URL = process.env.VUE_APP_WS_URL || `ws://${location.hostname}:20001`;
export {
	VUE_APP_WS_URL
}
// #endif

// 获取地址数据
export function getCityList() {
	return new Promise((resolve, reject) => {
		getCity().then(res => {
			resolve(res.data);
			Cache.set('cityList',res.data)
		})
	});
}

export default parseQuery;
