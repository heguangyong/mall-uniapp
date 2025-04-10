// +----------------------------------------------------------------------
// | CRMEB [ CRMEB赋能开发者，助力企业发展 ]
// +----------------------------------------------------------------------
// | Copyright (c) 2016~2025 https://www.crmeb.com All rights reserved.
// +----------------------------------------------------------------------
// | Licensed CRMEB并不是自由软件，未经许可不能去掉CRMEB相关版权
// +----------------------------------------------------------------------
// | Author: CRMEB Team <admin@crmeb.com>
// +----------------------------------------------------------------------
import Cache from "@/utils/cache";
import animationType from '@/utils/animationType.js'
export function chatConfig(chatConfig) {
	switch (chatConfig.serviceType) {
		case 'H5':
		case 'h5':
			// #ifdef H5
			window.open(chatConfig.serviceLink);
			// #endif
			// #ifdef APP-PLUS
			uni.navigateTo({
				animationType: animationType.type,
				animationDuration: animationType.duration,
				url: `/pages/users/web_page/index?webUel=${chatConfig.serviceLink}&title=客服`
			})
			// #endif
			// #ifdef MP
			uni.navigateTo({
				url: `/pages/users/web_page/index?webUel=${chatConfig.serviceLink}&title=客服`
			})
			// #endif
			break;
		case 'phone':
		case 'hotline':
			uni.makePhoneCall({
				phoneNumber: chatConfig.servicePhone
			});
			break;
	}
}
