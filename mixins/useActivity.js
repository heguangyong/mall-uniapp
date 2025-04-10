// +----------------------------------------------------------------------
// | CRMEB [ CRMEB赋能开发者，助力企业发展 ]
// +----------------------------------------------------------------------
// | Copyright (c) 2016~2025 https://www.crmeb.com All rights reserved.
// +----------------------------------------------------------------------
// | Licensed CRMEB并不是自由软件，未经许可不能去掉CRMEB相关版权
// +----------------------------------------------------------------------
// | Author: CRMEB Team <admin@crmeb.com>
// +----------------------------------------------------------------------

import {userIntegralApi} from "../api/activity";
import {
		discoverNoteLike
	} from '@/libs/follow.js';
export default {
    data() {
        return {
            integral: 0,
            backgroundColor:'transparent',
            headerZindex:9,
            listZindex:99,
        };
    },
    onPageScroll(e) {
        if(e.scrollTop > 20){
            this.backgroundColor = '#E93323';
        }else{
            this.backgroundColor = 'transparent';
        }
        if (e.scrollTop > 170) {
            this.listZindex=9
            this.headerZindex=99
        } else {
            this.listZindex=99
            this.headerZindex=9
        }
        // 传入scrollTop值并触发所有easy-loadimage组件下的滚动监听事件
        uni.$emit('scroll');
    },
    methods: {
        // 积分信息
        getUserIntegral() {
            userIntegralApi().then(res => {
                this.integral = res.data.integral
            })
        },
		//逛逛点赞
		handleLikeToggle(item) {
			discoverNoteLike(item.id).then(() => {
				this.$set(item, 'userIsLike', !item.userIsLike);
				if (!item.userIsLike) {
					item.likeNum--;
					item.likeNum = item.likeNum == 0 ? 0 : item.likeNum
				} else {
					item.likeNum++;
				}
			});
		}
    }
};
