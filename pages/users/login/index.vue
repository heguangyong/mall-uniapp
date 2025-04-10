<template>
	<view class="login-wrapper" :data-theme="theme">
		<view class="shading">
			<!-- <image :src="logoUrl"/> -->
			<image :src="logoUrl" />
			<!-- <image src="/static/images/logo2.png" v-if="!logoUrl" /> -->
		</view>
		<view class="whiteBg" v-if="formItem === 1">
			<view class="list" v-if="current !== 1">
				<form @submit.prevent="submit">
					<view class="item">
						<view class="acea-row row-middle">
							<text class="iconfont icon-phone_"></text>
							<input type="number" class="texts" placeholder="输入手机号码" v-model="phone" maxlength="11"
								required />
						</view>
					</view>
					<view class="item">
						<view class="acea-row row-middle">
							<text class="iconfont icon-code_1"></text>
							<input type="password" class="texts" placeholder="填写登录密码" maxlength="18" v-model="password"
								required />
						</view>
					</view>
				</form>
			</view>
			<view class="list" v-if="current !== 0 || appLoginStatus || appleLoginStatus">
				<view class="item">
					<view class="acea-row row-middle">
						<text class="iconfont icon-phone_"></text>
						<input type="number" class="texts" placeholder="输入手机号码" v-model="phone" maxlength="11" />
					</view>
				</view>
				<view class="item">
					<view class="acea-row row-middle">
						<text class="iconfont icon-code_1"></text>
						<input type="number" placeholder="填写验证码" class="codeIput" v-model="captcha" maxlength="6" />
						<button class="code main_color" :disabled="disabled" :class="disabled === true ? 'on' : ''"
							@click="code">
							{{ text }}
						</button>
					</view>
				</view>
				<view class="item" v-if="isShowCode">
					<view class="acea-row row-middle">
						<text class="iconfont icon-code_1"></text>
						<input type="number" placeholder="填写验证码" class="codeIput" v-model="codeVal" maxlength="6" />
						<view class="code" @click="again"><img :src="codeUrl" /></view>
					</view>
				</view>
			</view>
			<view class="protocol acea-row row-between-wrapper">
				<checkbox-group class="checkgroup acea-row" @change='isAgree=!isAgree' style="align-items: end;">
					<checkbox class="checkbox" :checked="isAgree ? true : false" />
					<text class="protocol_text">我已阅读并同意<text @click="userAgree('userinfo')" class="font_pro">《用户协议》</text>与<text
							@click="userAgree('userprivacyinfo')" class="font_pro">《隐私协议》</text></text>
				</checkbox-group>
			</view>
			<view class="logon bg_color" @click="loginMobile" v-if="current !== 0">登录</view>
			<view class="logon bg_color" @click="submit" v-if="current === 0">登录</view>
			<!-- #ifndef APP-PLUS -->
			<view class="tips">
				<view v-if="current==0" @click="current = 1">快速登录</view>
				<view v-if="current==1" @click="current = 0">账号登录</view>
			</view>
			<!-- #endif -->
			<!-- #ifdef APP-PLUS -->
			<view class="appLogin" v-if="!appLoginStatus && !appleLoginStatus">
				<view class="hds">
					<span class="line"></span>
					<p>其他方式登录</p>
					<span class="line"></span>
				</view>
				<view class="btn-wrapper">
					<view class="btn wx" @click="wxLogin">
						<span class="iconfont icon-s-weixindenglu1"></span>
					</view>
					<view class="btn mima" v-if="current == 1" @click="current =0">
						<span class="iconfont icon-s-mimadenglu1"></span>
					</view>
					<view class="btn yanzheng" v-if="current == 0" @click="current =1">
						<span class="iconfont icon-s-yanzhengmadenglu1"></span>
					</view>
					<view class="btn apple-btn" @click="appleLogin" v-if="appleShow">
						<view class="iconfont icon-s-pingguo"></view>
					</view>
				</view>
			</view>
			<!-- #endif -->
		</view>
		<view class="bottom"></view>

		<Verify @success="handlerOnVerSuccess" :captchaType="'clickWord'" :imgSize="{ width: '330px', height: '155px' }"
			ref="verify"></Verify>
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
	import sendVerifyCode from "@/mixins/SendVerifyCode";
	import Verify from '../components/verifition/verify.vue';
	import {
		loginH5,
		loginMobile,
		registerVerify,
		register,
	} from "@/api/user";
	let app = getApp();
	import {
		loginConfigApi,
		appAuth,
		appleLogin
	} from "@/api/public";
	import {
		VUE_APP_API_URL
	} from "@/utils";
	import {
		Debounce
	} from '@/utils/validate.js'
	import {
		goToAgreement
	} from "@/libs/order";
	import {
		mapGetters
	} from "vuex";
	import Routine from "../../../libs/routine";
	import {
		silenceBindingSpread
	} from "../../../utils";
	const BACK_URL = "login_back_url";

	export default {
		name: "Login",
		mixins: [sendVerifyCode],
		components: {
			Verify,
		},
		computed: mapGetters(['userInfo', 'isLogin', 'globalData']),
		data: function() {
			return {
				isAgree: false,
				navList: ["快速登录", "账号登录"],
				current: 1,
				phone: "",
				password: "",
				captcha: "",
				formItem: 1,
				type: "login",
				logoUrl: "",
				keyCode: "",
				codeUrl: "",
				codeVal: "",
				isShowCode: false,
				platform: '',
				appLoginStatus: false, // 微信登录强制绑定手机号码状态
				appUserInfo: {}, // 微信登录保存的用户信息
				appleLoginStatus: false, // 苹果登录强制绑定手机号码状态
				appleUserInfo: null,
				appleShow: false, // 苹果登录版本必须要求ios13以上的
				theme: app.globalData.theme,
			};
		},
		watch: {
			formItem: function(nval, oVal) {
				if (nval == 1) {
					this.type = 'login'
				} else {
					this.type = 'register'
				}
			}
		},
		mounted: function() {
			this.getCode();
			this.getLogoImage();
		},
		onLoad() {
			let self = this
			uni.getSystemInfo({
				success: function(res) {
					if (res.platform.toLowerCase() == 'ios' && res.system.split(' ')[1] >= '13') {
						self.appleShow = true
						self.platform = res.platform
					}
				}
			});
		},
		methods: {
			userAgree(info) {
				goToAgreement(info)
			},
			// 苹果登录
			appleLogin() {
				let self = this
				this.phone = ''
				this.captcha = ''
				if (!this.isAgree) return this.$util.Tips({
					title: '请勾选用户隐私协议'
				});
				uni.showLoading({
					title: '登录中'
				})
				uni.login({
					provider: 'apple',
					timeout: 10000,
					success(loginRes) {
						uni.hideLoading();
						uni.getUserInfo({
							provider: 'apple',
							success: function(infoRes) {
								self.appleUserInfo = infoRes.userInfo
								self.appleLoginApi()
							},
							fail() {
								uni.hideLoading();
								uni.showToast({
									title: '获取用户信息失败',
									icon: 'none',
									duration: 2000
								})
							},
							complete() {
								uni.hideLoading()
							}
						});
					},
					fail(error) {
						uni.hideLoading()
					}
				})
			},
			// 苹果登录Api
			appleLoginApi() {
				appleLogin({
					openId: this.appleUserInfo.openId,
					email: this.appleUserInfo.email == undefined ? '' : this.appleUserInfo.email,
					identityToken: this.appleUserInfo.identityToken || ''
				}).then((res) => {
					let data = res.data;
					this.$store.commit("LOGIN", {
						'token': data.token
					});
					if (data.isNew && data.newPeopleCouponList && data.newPeopleCouponList.length !== 0) {
						this.$Cache.set('newGift', data.newPeopleCouponList);
					} else {
						this.$Cache.clear('newGift');
					}
					this.getUserInfo(data);
				}).catch(error => {
					uni.hideLoading();
					uni.showModal({
						title: '提示',
						content: `错误信息${error}`,
						success: function(res) {
							if (res.confirm) {
								console.log('用户点击确定');
							} else if (res.cancel) {
								console.log('用户点击取消');
							}
						}
					});
				})
			},
			// App微信登录
			wxLogin: Debounce(function() {
				this.phone = ''
				this.captcha = ''
				let self = this
				if (!this.isAgree) return this.$util.Tips({
					title: '请勾选用户隐私协议'
				});
				uni.showLoading({
					title: '登录中'
				})
				uni.login({
					provider: 'weixin',
					success: function(res) {
						uni.hideLoading();
						let loginRes = res.authResult;
						self.appUserInfo.openId = loginRes.openid;
						self.appUserInfo.unionId = loginRes.unionid;
						self.appUserInfo.type = self.platform === 'ios' ? 'iosWx' : 'androidWx';
						self.wxLoginGo(self.appUserInfo)
					},
					fail() {
						uni.hideLoading()
						uni.showToast({
							title: '登录失败',
							icon: 'none',
							duration: 2000
						})
					}
				});
			}),
			wxLoginGo(userInfo) {
				appAuth(userInfo).then(res => {
					let data = res.data;
					if (data.type === 'register') {
						uni.navigateTo({
							url: '/pages/users/app_login/index?authKey=' + data.key
						})
					}
					if (data.type === 'login') {
						this.$store.commit("LOGIN", {
							'token': data.token
						});
						this.getUserInfo(data);
					}
					if (data.isNew && data.newPeopleCouponList && data.newPeopleCouponList.length !== 0) {
						this.$Cache.set('newGift', data.newPeopleCouponList);
					} else {
						this.$Cache.clear('newGift');
					}
				}).catch(res => {
					this.$util.Tips({
						title: res
					});
				});
			},
			again() {
				this.codeUrl =
					VUE_APP_API_URL +
					"/sms_captcha?" +
					"key=" +
					this.keyCode +
					Date.parse(new Date());
			},
			getCode() {
				let that = this
			},
			async getLogoImage() {
				let that = this;
				loginConfigApi().then(res => {
					that.logoUrl = res.data.logo ? res.data.logo : '/static/images/logo2.png';
				});
			},
			/**
			 * 手机号验证码登录
			 */
			loginMobile: Debounce(function() {
				let that = this;
				if (!that.phone) return that.$util.Tips({
					title: '请填写手机号码'
				});
				if (!/^1(3|4|5|7|8|9|6)\d{9}$/i.test(that.phone)) return that.$util.Tips({
					title: '请输入正确的手机号码'
				});
				if (!that.captcha) return that.$util.Tips({
					title: '请填写验证码'
				});
				if (!/^[\w\d]+$/i.test(that.captcha)) return that.$util.Tips({
					title: '请输入正确的验证码'
				});
				if (!that.isAgree) return that.$util.Tips({
					title: '请勾选用户隐私协议'
				});
				loginMobile({
						phone: that.phone,
						captcha: that.captcha,
						spreadPid: that.$Cache.get("spread")
					})
					.then(res => {
						let data = res.data;
						let newTime = Math.round(new Date() / 1000);
						this.$store.commit("LOGIN", {
							'token': res.data.token
						});
						if (data.isNew && data.newPeopleCouponList && data.newPeopleCouponList.length !== 0) {
							this.$Cache.set('newGift', data.newPeopleCouponList);
						} else {
							this.$Cache.clear('newGift');
						}
						that.getUserInfo(data);
					})
					.catch(res => {
						that.$util.Tips({
							title: res
						});
					});
			}),
			async register() {
				let that = this;
				if (!that.phone) return that.$util.Tips({
					title: '请填写手机号码'
				});
				if (!/^1(3|4|5|7|8|9|6)\d{9}$/i.test(that.phone)) return that.$util.Tips({
					title: '请输入正确的手机号码'
				});
				if (!this.isAgree) return this.$util.Tips({
					title: '请勾选用户隐私协议'
				});
				if (!that.captcha) return that.$util.Tips({
					title: '请填写验证码'
				});
				if (!/^[\w\d]+$/i.test(that.captcha)) return that.$util.Tips({
					title: '请输入正确的验证码'
				});
				if (!that.password) return that.$util.Tips({
					title: '请填写密码'
				});
				if (!/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/i.test(that.password)) return that.$util.Tips({
					title: '您输入的密码过于简单'
				});
				register({
						phone: that.phone,
						captcha: that.captcha,
						password: that.password,
						spread_spid: that.$Cache.get("spread")
						// spread_spid: uni.getStorageSync('spid') || 0
					})
					.then(res => {
						that.$util.Tips({
							title: res
						});
						that.formItem = 1;
					})
					.catch(res => {
						that.$util.Tips({
							title: res
						});
					});
			},
			//滑块验证成功后
			handlerOnVerSuccess(data) {
				this.$refs.verify.hide();
				this.codeSend();
			},
			codeSend() {
				let that = this;
				if (!that.phone) return that.$util.Tips({
					title: '请填写手机号码'
				});
				if (!this.isAgree) return this.$util.Tips({
					title: '请勾选用户隐私协议'
				});
				if (!/^1(3|4|5|7|8|9|6)\d{9}$/i.test(that.phone)) return that.$util.Tips({
					title: '请输入正确的手机号码'
				});
				registerVerify(that.phone)
					.then(res => {
						that.$util.Tips({
							title: res.message
						});
						that.sendCode();
					})
					.catch(err => {
						return that.$util.Tips({
							title: err
						});
					});
			},
			code: Debounce(function() {
				let that = this;
				if (!that.phone) return that.$util.Tips({
					title: '请填写手机号码'
				});
				if (!this.isAgree) return this.$util.Tips({
					title: '请勾选用户隐私协议'
				});
				if (!/^1(3|4|5|7|8|9|6)\d{9}$/i.test(that.phone)) return that.$util.Tips({
					title: '请输入正确的手机号码'
				});
				that.$refs.verify.show();
			}),
			navTap: function(index) {
				this.current = index;
			},
			submit: Debounce(function() {
				let that = this;
				if (!that.phone) return that.$util.Tips({
					title: '请填写账号'
				});
				if (!/^[\w\d]{5,16}$/i.test(that.phone)) return that.$util.Tips({
					title: '请输入正确的账号'
				});
				if (!that.password) return that.$util.Tips({
					title: '请填写密码'
				});
				if (!that.isAgree) return that.$util.Tips({
					title: '请勾选用户隐私协议'
				});
				uni.showLoading({
					title: '正在登录中'
				});
				loginH5({
						phone: that.phone,
						password: that.password,
						spread_spid: that.$Cache.get("spread")
					}).then(({
						data
					}) => {
						that.$store.commit("LOGIN", {
							'token': data.token
						});
						uni.hideLoading();
						that.getUserInfo(data);
					})
					.catch(e => {
						uni.hideLoading();
						that.$util.Tips({
							title: e
						});
					});
			}),
			getUserInfo(data) {
				this.$store.dispatch("GetTokenIsExist");
				//分销绑定
				silenceBindingSpread(true, this.globalData.spread);
				this.$store.dispatch('GetGlobalConfig');
				this.$store.commit('UPDATE_USERINFO', {
					avatar: data.avatar,
          nickname: data.nickname,
					phone: data.phone
				});
				this.$store.commit("SETUID", data.id);
				let backUrl = this.$Cache.get(BACK_URL) || "/pages/index/index";
				if (backUrl.indexOf('/pages/users/login/index') !== -1) {
					backUrl = '/pages/index/index';
				}
				// #ifdef MP
				if (!this.$Cache.get('wechatQRcode')) Routine.getQrcode()
				// #endif
				uni.reLaunch({
					url: backUrl
				});
			},
		}
	};
</script>
<style lang="scss" scoped>
	.protocol {
		margin: 30rpx 0;
		padding-left: 44rpx;
	}

	.protocol_text {
		.font_pro {
			@include main_color(theme);
		}
	}

	page {
		background: #fff;
	}

	.appLogin {
		margin-top: 60rpx;

		.hds {
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 24rpx;
			color: #B4B4B4;

			.line {
				width: 68rpx;
				height: 1rpx;
				background: #CCCCCC;
			}

			p {
				margin: 0 20rpx;
			}
		}

		.btn-wrapper {
			display: flex;
			align-items: center;
			justify-content: center;
			margin-top: 30rpx;

			.btn {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 68rpx;
				height: 68rpx;
				border-radius: 50%;
			}

			.apple-btn {
				display: flex;
				align-items: center;
				justify-content: center;
				margin-left: 30rpx;
				background: #000;
				border-radius: 34rpx;
				font-size: 40rpx;

				.icon-s-pingguo {
					color: #fff;
					font-size: 40rpx;
				}
			}

			.iconfont {
				font-size: 40rpx;
				color: #fff;
			}

			.wx {
				margin-right: 30rpx;
				background-color: #61C64F;
			}

			.mima {
				background-color: #28B3E9;
			}

			.yanzheng {
				background-color: #F89C23;
			}

		}
	}

	.main_color {
		@include main_color(theme);
	}

	.bg_color {
		@include main_bg_color(theme);
	}

	.code img {
		width: 100%;
		height: 100%;
	}

	.acea-row.row-middle {
		input {
			margin-left: 20rpx;
			display: block;
		}
	}

	.login-wrapper {
		padding: 30rpx;

		.shading {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 100%;

			/* #ifdef APP-VUE */
			margin-top: 50rpx;
			/* #endif */
			/* #ifndef APP-VUE */

			margin-top: 200rpx;
			/* #endif */


			image {
				width: 180rpx;
				height: 180rpx;
			}
		}

		.whiteBg {
			margin-top: 100rpx;

			.list {
				border-radius: 16rpx;
				overflow: hidden;

				.item {
					border-bottom: 1px solid #F0F0F0;
					background: #fff;

					.row-middle {
						position: relative;
						padding: 16rpx 45rpx;

						.texts {
							flex: 1;
							font-size: 28rpx;
							height: 80rpx;
							line-height: 80rpx;
							display: flex;
							justify-content: center;
							align-items: center;
						}

						input {
							flex: 1;
							font-size: 28rpx;
							height: 80rpx;
							line-height: 80rpx;
							display: flex;
							justify-content: center;
							align-items: center;
						}

						.code {
							position: absolute;
							right: 30rpx;
							top: 50%;
							color: $theme-color;
							font-size: 26rpx;
							transform: translateY(-50%);
						}
					}
				}
			}

			.logon {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 100%;
				height: 86rpx;
				margin-top: 80rpx;
				background-color: $theme-color;
				border-radius: 120rpx;
				color: #FFFFFF;
				font-size: 30rpx;
			}

			.tips {
				margin: 30rpx;
				text-align: center;
				color: #999;
			}
		}
	}
</style>