<template>
	<view :data-theme="theme">
		<view class='personal-data borderPad'>
			<view class='list borRadius14' v-for="(item,index) in tabList" :key="index" @click="goMultiple(item.info)">
				<view class='item acea-row row-between-wrapper'>
					<view>{{item.title}}</view>
					<text class='iconfont icon-xiangyou'></text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
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
		mapGetters
	} from "vuex";
  import {goToAgreement} from "@/libs/order";
	let app = getApp();
	export default {
		data() {
			return {
				theme: app.globalData.theme,
				tabList: [{
						title: "用户协议",
						id: 1,
						info: 'userinfo',
						save: 'usersave'
					},
					{
						title: "隐私政策",
						id: 2,
						info: 'userprivacyinfo',
						save: 'userprivacysave'
					},
					{
						title: "商户入驻协议",
						id: 3,
						info: 'merincomminginfo',
						save: 'merincommingsave'
					},
					{
						title: "关于我们",
						id: 4,
						info: 'aboutusinfo',
						save: 'aboutussave'
					},
					{
						title: "资质证照",
						id: 5,
						info: 'intelligentinfo',
						save: 'intelligentsave'
					},
					{
						title: "平台规则",
						id: 6,
						info: 'platfromruleinfo',
						save: 'platfromrulesave'
					},
					{
						title: "优惠券协议",
						id: 7,
						info: 'coupon/agreement/info',
						save: 'platfromrulesave'
					},
					{
						title: "注销提示",
						id: 8,
						info: 'useraccountcancelinfo',
						save: 'useraccountcancelsave'
					},
					{
						title: "注销声明",
						id: 9,
						info: 'useraccountcancelnoticeinfo',
						save: 'useraccountcancelnoticesave'
					},
				],
			}
		},
		onLoad() {

		},
		methods: {
			goMultiple(e){
        goToAgreement(e)
			}
		}
	}
</script>

<style scoped lang="scss">
	.personal-data{
		.list {
			margin-top: 30rpx;
			background-color: #fff;
			.item {
				border-bottom: 1rpx solid #f2f2f2;
				padding: 24rpx;
				font-size: 32rpx;
				color: #333333;
				.input {
					text-align: right;
					color: #BBBBBB;
					.iconfont {
						font-size: 35rpx;
						margin-left: 20rpx;
					}
				}
				.icon-xiangyou {
					color: #BBBBBB;
				}
			}
		}
	}
</style>
