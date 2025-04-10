// +----------------------------------------------------------------------
// | CRMEB [ CRMEB赋能开发者，助力企业发展 ]
// +----------------------------------------------------------------------
// | Copyright (c) 2016~2025 https://www.crmeb.com All rights reserved.
// +----------------------------------------------------------------------
// | Licensed CRMEB并不是自由软件，未经许可不能去掉CRMEB相关版权
// +----------------------------------------------------------------------
// | Author: CRMEB Team <admin@crmeb.com>
// +----------------------------------------------------------------------

import {
	getMerCollectAddApi,
	getMerCollectCancelApi
} from '@/api/merchant.js';
import {
	followAuthorApi,
	noteLikeApi
} from '@/api/discover.js';
import util from '@/utils/util'

/**
 * 关注、取消关注商户
 */
export function followMer(follow, id) {
	return new Promise((resolve, reject) => {
		if (follow) {
			getMerCollectCancelApi(id).then(res => {
				resolve(res);
			}).catch(err => {
				util.Tips({
					title: err
				});
			});
		} else {
			getMerCollectAddApi(id).then(res => {
				resolve(res);
			}).catch(err => {
				util.Tips({
					title: err
				});
			});
		}
	});
}
/**
 * 逛逛内容点赞、取消点赞
 */
export function discoverNoteLike(id) {
	return new Promise((resolve, reject) => {
		noteLikeApi(id).then(res => {
			resolve(res);
		}).catch(err => {
			util.Tips({
				title: err
			});
		});
	});
}
/**
 * 逛逛作者关注、取消关注
 */
export function discoverFollowAuthor(id) {
	return new Promise((resolve, reject) => {
		followAuthorApi(id).then(res => {
			resolve(res);
		}).catch(err => {
			util.Tips({
				title: err
			});
		});
	});
}