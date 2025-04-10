<template>
	<view class="user_about" :data-theme="theme">
		<view>
			<view class="text cancelTxt">
				<jyf-parser :html="agreementData?agreementData.replace(/<br\/>/ig, ''):''" ref="article" :tag-style="tagStyle"></jyf-parser>
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
		userLevelRuleApi
	} from '@/api/user.js'
	import parser from "../components/jyf-parser/jyf-parser";
	let app = getApp();
	export default {
		name: 'user_about',
		components: {
			"jyf-parser": parser
		},
		data() {
			return {
				theme: app.globalData.theme,
				agreementData: '',
				loaded: false,
				tagStyle: {
					img: 'width:100%;display:block;'
				},
			}
		},
		onLoad: function() {
			this.getCacheinfo();
		},
		methods: {
			getCacheinfo() {
				this.loaded = false;
				userLevelRuleApi().then(res => {
					this.agreementData = res.data
					this.loaded = true;
				})
			}
		}
	}
</script>

<style lang="scss">
	.user_about {
		.text {
			font-size: 30rpx;
			font-weight: 400;
			padding: 30rpx;
			color: #282828;
		}

		.cancelTxt {
			overflow: hidden;
			overflow-y: auto;

			image {
				max-width: 100%;
			}
		}
	}
	
</style>
