<template>
	<view :data-theme="theme" class="wrapper">
		<view class="bag"></view>
		<view class="system-height" :style="{height:statusBarHeight}"></view>
		<!-- #ifdef MP -->
		<view class="title-bar" style="height: 43px;">
			<view class="icon" @click="back" v-if="!isHome">
				<image class="img" src="../static/images/left.png"></image>
			</view>
			<view class="icon" @click="home" v-else>
				<image class="img" src="../static/images/home.png"></image>
			</view>
			账户登录
		</view>
		<!-- #endif -->
		<view class="appBox">
			<view class="phone_name">绑定手机号</view>
			<view class="phone_tips">登录注册需绑定手机号</view>
			<mobileLogin :isUp="isUp" :isShow="isShow" :platform="platform" :isPos="isPos" :appleShow="appleShow"
				:authKey="authKey" @wechatPhone="wechatPhone" :wxCode="wxCode"></mobileLogin>
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
	const app = getApp();
	let statusBarHeight = uni.getSystemInfoSync().statusBarHeight + 'px';
	import sendVerifyCode from "@/mixins/SendVerifyCode";

	import {
		registerVerify,
	} from "@/api/user";
	import mobileLogin from '../components/login_mobile/index.vue'
	export default {
		name: 'login_mobile',
		data() {
			return {
				theme: app.globalData.theme,
				options: '',
				account: '',
				codeNum: '',
				isUp: true,
				authKey: '',
				logoUrl: '',
				isShow: false,
				isPos: false, // 是否定位
				platform: '', // 手机平台
				appleShow: '', //是否是苹果登录
				statusBarHeight: statusBarHeight,
				wxCode: '' //小程序code值

			}
		},
		components: {
			mobileLogin
		},
		mixins: [sendVerifyCode],
		mounted() {
		},
		onLoad: function(options) {
			let that = this;
			// 获取系统信息
			uni.getSystemInfo({
				success(res) {
					that.platform = res.platform;
				}
			});
			const {
				code,
				state,
				scope,
				back_url,
				appleShow
			} = options;
			that.options = options
			if (options.authKey) that.authKey = options.authKey
			if (options.appleShow) that.appleShow = options.appleShow
			if (options.code) that.wxCode = options.code
		},
		methods: {
			// 返回
			back() {
				uni.navigateBack();
			},
			// 跳入首页
			home() {
				uni.switchTab({
					url: '/pages/index/index'
				})
			},
			wechatPhone() {
				this.$Cache.clear('snsapiKey');
				if (this.options.back_url) {
					let url = uni.getStorageSync('snRouter');
					url = url.indexOf('/pages/index/index') != -1 ? '/' : url;
					if (url.indexOf('/pages/users/wechat_login/index') !== -1) {
						url = '/';
					}
					if (!url) {
						url = '/pages/index/index';
					}
					this.isUp = false
					uni.showToast({
						title: '登录成功',
						icon: 'none'
					})
					setTimeout(res => {
						location.href = url
					}, 800)
				} else {
					uni.navigateBack()
				}
			},
			// 获取验证码
			async code() {
				let that = this;
				if (!that.account) return that.$util.Tips({
					title: '请填写手机号码'
				});
				if (!/^1(3|4|5|7|8|9|6)\d{9}$/i.test(that.account)) return that.$util.Tips({
					title: '请输入正确的手机号码'
				});
				await registerVerify(that.account).then(res => {
					that.$util.Tips({
						title: res.msg
					});
					that.sendCode();
				}).catch(err => {
					return that.$util.Tips({
						title: err
					})
				})
			}
		}
	}
</script>

<style>
	page {
		background: #fff;
		height: 100%;
	}
</style>
<style lang="scss" scoped>
	.wrapper {
		background: #fff;
		height: 100%;
		position: relative;

		.bag {
			position: absolute;
			top: 0;
			left: 0;
			width: 750rpx;
			height: 460rpx;
			@include logn-gradient(theme);
		}
	}

    .title-bar {
    	position: relative;
    	display: flex;
    	align-items: center;
    	justify-content: center;
    	font-size: 36rpx;
    }
    
    .icon {
    	position: absolute;
    	left: 30rpx;
    	top: 0;
    	display: flex;
    	align-items: center;
    	justify-content: center;
    	width: 86rpx;
    	height: 86rpx;
    
    	.img {
    		width: 50rpx;
    		height: 50rpx;
    	}
    }
    
    .phone {
    	&_name {
    		padding: 0 72rpx;
    		font-size: 48rpx;
    		font-weight: 500;
    		color: #333333;
    		line-height: 68rpx;
    		margin-bottom: 16rpx;
    	}
    
    	&_tips {
    		font-size: 28rpx;
    		font-weight: 400;
    		color: #333333;
    		line-height: 40rpx;
    		padding: 0 72rpx;
    	}
    }
	
	.appBox {
		background-color: #fff;
		height: 100%;
		display: flex;
		flex-direction: column;
		overflow: hidden;
		margin-top: 146rpx;
	}
	
	.shading {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;

		image {
			width: 180rpx;
			height: 180rpx;
		}
	}

	.ChangePassword .phone {
		font-size: 32rpx;
		font-weight: bold;
		text-align: center;
		margin-top: 55rpx;
	}

	.ChangePassword .list {
		width: 580rpx;
		margin: 53rpx auto 0 auto;
	}

	.ChangePassword .list .item {
		width: 100%;
		height: 110rpx;
		border-bottom: 2rpx solid #f0f0f0;
	}

	.ChangePassword .list .item input {
		width: 100%;
		height: 100%;
		font-size: 32rpx;
	}

	.ChangePassword .list .item .placeholder {
		color: #b9b9bc;
	}

	.ChangePassword .list .item input.codeIput {
		width: 340rpx;
	}

	.ChangePassword .list .item .code {
		font-size: 32rpx;
		background-color: #fff;
	}

	.ChangePassword .list .item .code.on {
		color: #b9b9bc !important;
	}

	.ChangePassword .confirmBnt {
		font-size: 32rpx;
		width: 580rpx;
		height: 90rpx;
		border-radius: 45rpx;
		color: #fff;
		margin: 92rpx auto 0 auto;
		text-align: center;
		line-height: 90rpx;
	}
</style>