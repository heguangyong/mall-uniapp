// +----------------------------------------------------------------------
// | CRMEB [ CRMEB赋能开发者，助力企业发展 ]
// +----------------------------------------------------------------------
// | Copyright (c) 2016~2025 https://www.crmeb.com All rights reserved.
// +----------------------------------------------------------------------
// | Licensed CRMEB并不是自由软件，未经许可不能去掉CRMEB相关版权
// +----------------------------------------------------------------------
// | Author: CRMEB Team <admin@crmeb.com>
// +----------------------------------------------------------------------

// 分享到微信好友、朋友圈
import {
	mapGetters
} from "vuex";
export default {
	computed: mapGetters(['uid']),
	data() {
		return {
			share: {
				title: '', // 转发的标题
				path: '', // 转发的路径，默认是当前页面，必须是以‘/’开头的完整路径，/pages/index/index
				query: '' // 转发朋友圈中浏览器拼接参数
			},
		}
	},
	onLoad: function(options) {
		let pages = getCurrentPages(),
			view = pages[pages.length - 1];
		console.log('viewviewview', view)
		let urlData = view.$page.fullPath;
		if (urlData.indexOf('?') !== -1) {
			urlData = urlData.includes("sd=") ? urlData : urlData + `&sd=${this.uid}`
		} else {
			urlData = urlData+`?sd=${this.uid}`;
		}
		this.share.path = urlData;
		this.share.title = view.$vm.title;
		this.share.query = urlData.split('?')[1];

	},
	// #ifdef MP
	// 分享到微信好友
	onShareAppMessage: function() {
		//转发参数
		return this.share
	},
	// 分享到朋友圈
	onShareTimeline() {
		return this.share
	},
	// #endif
}