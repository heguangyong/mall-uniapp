<template>
	<view class="page" :data-theme="theme" :style="{'background-image': `url(${backBg})`}">
		<view class="system-height" :style="{height:statusBarHeight}"></view>
		<!-- #ifdef MP -->
		<view class="title-bar" style="height: 43px;">
			<view class="icon" @click="back" v-if="!isHome">
				<image src="../static/images/left.png"></image>
			</view>
			<view class="icon" @click="home" v-else>
				<image src="../static/images/home.png"></image>
			</view>
			账户登录
		</view>
		<!-- #endif -->
		<view class="wechat_login">
			<view class="img acea-row row-center">
				<image :src="mobileLoginLogo" mode="widthFix" class="image"></image>
			</view>
			<view class="company">{{companyName}}</view>
			<view class="btn-wrapper">
				<!-- #ifdef H5 -->
				<button hover-class="none" @click="wechatLogin" class="bg-green btn1"><text
						class='iconfont icon-weixin2'></text>立即登录</button>
					<!-- #endif -->
				<!-- #ifdef MP -->
				<button v-if="wxLogin" hover-class="none" @click="getUserProfile" class="btn1 bg-color">立即登录</button>
				<view v-else>
					<button v-if="routinePhoneVerification == 1 || routinePhoneVerification.length===3"
						hover-class="none" @click="onUserPhone" class="btn1 bg-color"><text
							class='iconfont'></text>手机号一键登录</button>
					<button v-if="routinePhoneVerification == 2 || routinePhoneVerification.length===3"
						hover-class="none" @click="onUserPhone('isPhone')" class="btn2">手动绑定手机号</button>
				</view>
				<!-- #endif -->
			</view>
		</view>
		<block v-if="isUp">
			<mobileLogin :theme="theme" :isUp="isUp" @close="maskClose" :authKey="authKey" @wechatPhone="wechatPhone">
			</mobileLogin>
		</block>
		<atModel v-if="isPhoneBox" :userPhoneType="true" :isPhoneBox="isPhoneBox" :authKey="authKey"
			:content="getPhoneContent" @closeModel="bindPhoneClose" @confirmModel="confirmModel"></atModel>
	</view>
</template>

<script>
	import {
		silenceBindingSpread
	} from "../../../utils";
	import {
		mapGetters
	} from "vuex";
	const app = getApp();
	let statusBarHeight = uni.getSystemInfoSync().statusBarHeight + 'px';
	import mobileLogin from '../components/login_mobile/index.vue'
	import atModel from '@/components/accredit/index.vue'
	import {
		loginConfigApi
	} from '@/api/public';
	import Routine from '@/libs/routine';
	import wechat from "@/libs/wechat";
	export default {
		data() {
			return {
				isUp: false,
				phone: '',
				statusBarHeight: statusBarHeight,
				isHome: false,
				isPhoneBox: false,
				logoUrl: '',
				code: '',
				authKey: '',
				options: '',
				userInfo: {},
				codeNum: 0,
				urlDomain: this.$Cache.get("imgHost"),
				backBg: '', //背景图片
				theme: app.globalData.theme,
				getPhoneContent: '申请获取您的手机号用于注册，完成后可使用商城更多功能',
				wxCode: '', //小程序code值
				companyName: '', //公司名称
				routinePhoneVerification: '', //小程序手机号校验类型（多选）1微信小程序验证 2短信验证
				loginConfig: '', //小程序绑定手机号，isPhone其他手机号绑定
				wxLogin: true, //登录显示
				mobileLoginLogo: '' // 登录页logo
			}
		},
		computed: mapGetters(['isLogin', 'globalData']),
		components: {
			mobileLogin,
			atModel
		},
		onLoad(options) {
			this.routinePhoneVerification = this.globalData.routinePhoneVerification
			this.mobileLoginLogo = this.globalData.mobileLoginLogo
			this.companyName = this.globalData.companyName
			//背景图片
			switch (this.globalData.theme) {
				case 'theme1':
					this.backBg = `${this.urlDomain}crmebimage/presets/wxbj1.png`;
					break;
				case 'theme2':
					this.backBg = `${this.urlDomain}crmebimage/presets/wxbj2.png`;
					break;
				case 'theme3':
					this.backBg = `${this.urlDomain}crmebimage/presets/wxbj3.png`;
					break;
				case 'theme4':
					this.backBg = `${this.urlDomain}crmebimage/presets/wxbj4.png`;
					break;
				case 'theme5':
					this.backBg = `${this.urlDomain}crmebimage/presets/wxbj5.png`;
					break;
			}
			//logo图片地址
			loginConfigApi().then(res => {
				this.logoUrl = res.data.logoUrl
			})
			let that = this
			// #ifdef H5
			document.body.addEventListener("focusout", () => {
				setTimeout(() => {
					const scrollHeight = document.documentElement.scrollTop || document.body.scrollTop ||
						0;
					window.scrollTo(0, Math.max(scrollHeight - 1, 0));
				}, 100);
			});
			const {
				code,
				state,
				scope
			} = options;
			this.options = options
			// 获取确认授权code
			this.code = code || ''
			if (code && this.options.scope !== 'snsapi_base') {
				let spread = this.globalData.spread ? this.globalData.spread : 0;
				//公众号授权登录回调 wechatAuth(code, Cache.get("spread"), loginType)
				wechat.auth(code, spread).then(res => {
					if (res.type === 'register') {
						this.authKey = res.key;
						this.isUp = true
					}
					if (res.type === 'login') {
						this.$store.commit('LOGIN', {
							token: res.token
						});
						this.$store.commit("SETUID", res.id);
						this.getUserInfo(res);
					}
          if (data.isNew && data.newPeopleCouponList && data.newPeopleCouponList.length !== 0) {
            this.$Cache.set('newGift', data.newPeopleCouponList);
          } else {
            this.$Cache.clear('newGift');
          }
				}).catch(error => {});
			}
			// #endif
			let pages = getCurrentPages();
		},
		methods: {
			//绑定手机号弹窗回调
			confirmModel() {
				this.isPhoneBox = false;
				this.isUp = true
			},
			back() {
				uni.navigateBack();
			},
			home() {
				uni.switchTab({
					url: '/pages/index/index'
				})
			},
			modelCancel() {
				this.isPhoneBox = false;
			},
			// 弹窗关闭
			maskClose() {
				// this.isUp = false  //点击模态框会关闭登录弹框，防止用户误触而关闭
			},
			bindPhoneClose(data) {
				if (data.isStatus) {
					this.isPhoneBox = false
					this.$util.Tips({
						title: '登录成功',
						icon: 'success'
					}, {
						tab: 3
					})
				} else {
					this.isPhoneBox = false
				}

			},
			// #ifdef MP
			/**
			 * 登录成功之后回调
			 */
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
				// #ifdef MP
				if(!this.$Cache.get('wechatQRcode')) Routine.getQrcode()
				// #endif
				this.$util.Tips({
					title: '登录成功',
					icon: 'success'
				}, {
					tab: 3
				});
			},
			//绑定手机号
			onUserPhone(type) {
				this.loginConfig = type;
				//如果是其他手机号绑定，调整页面。否则授权本机手机号登录
				if (this.loginConfig === 'isPhone') {
					uni.navigateTo({
						url: `/pages/users/app_login/index?code=${this.wxCode}&authKey=${this.authKey}`
					})
				} else {
					this.isPhoneBox = true
				}
			},
			//wx小程序立即登录
			getUserProfile() {
				let self = this;
				uni.showLoading({
					title: '正在登录中'
				});
				const hostSDKVersion = uni.getSystemInfoSync().hostSDKVersion; //小程序基础库版本号
				if (Routine.compareVersion(hostSDKVersion, '2.21.2') >= 0) {
					Routine.getCode()
						.then(code => {
							let userInfo = {
								code: code,
								spreadPid: this.globalData.spread, //获取推广人ID
								type: 'routine'
							};
							self.getWxUser(userInfo);
						})
						.catch(res => {
							uni.hideLoading();
						});
				} else {
					Routine.getUserProfile().then(res => {
							Routine.getCode()
								.then(code => {
									let userInfo = {
										code: code,
										spreadPid: this.globalData.spread, //获取推广人ID
										type: 'routine'
									};
									self.getWxUser(userInfo);
								})
								.catch(res => {
									uni.hideLoading();
								});
						})
						.catch(res => {
							uni.hideLoading();
						});
				}
			},
			// 登录调用方法
			getWxUser(userInfo) {
				let self = this;
				Routine.authUserInfo(userInfo)
					.then(res => {
						self.authKey = res.data.key;
						if (res.data.type === 'register') {
							uni.hideLoading();
							self.wxLogin = false;
						}
						if (res.data.type === 'login') {
							uni.hideLoading();
							self.getUserInfo(res.data);
						}
					})
					.catch(res => {
						uni.hideLoading();
						uni.showToast({
							title: res,
							icon: 'none',
							duration: 2000
						});
					});
			},
			// #endif
			// #ifdef H5
			// 获取url后面的参数
			getQueryString(name) {
				var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
				var reg_rewrite = new RegExp("(^|/)" + name + "/([^/]*)(/|$)", "i");
				var r = window.location.search.substr(1).match(reg);
				var q = window.location.pathname.substr(1).match(reg_rewrite);
				if (r != null) {
					return unescape(r[2]);
				} else if (q != null) {
					return unescape(q[2]);
				} else {
					return null;
				}
			},
			// 公众号登录
			wechatLogin() {
				if (!this.code && this.options.scope !== 'snsapi_base') {
					this.$wechat.oAuth('snsapi_userinfo', '/pages/users/wechat_login/index');
				} else {
					this.isUp = true;
				}
			},
			// 输入手机号后的回调
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
			}
			// #endif
		}
	}
</script>
<style lang="scss">
	page {
		background: #fff;
		height: 100%;
	}
</style>
<style lang="scss" scoped>
	.icon-weixin2 {
		margin-right: 10rpx;
	}

	.company {
		font-size: 40rpx;
		color: #333;
		text-align: center;
		font-weight: 500;
		margin: 32rpx 0 96rpx 0;
	}

	.page {
		background: #fff;
		width: 100%;
		height: 100%;
		background-repeat: no-repeat;
		background-size: 100% 100%;
	}

	.wechat_login {
		padding-top: 238rpx;

		.img .image {
			width: 152rpx;
			height: 152rpx;
		}

		.btn-wrapper {
			margin-top: 86rpx;
			padding: 0 66rpx;

			button {
				width: 100%;
				height: 86rpx;
				line-height: 84rpx;
				margin-bottom: 32rpx;
				border-radius: 120rpx;
				font-size: 32rpx;

				&.btn1 {
					color: #fff;
				}

				&.btn2 {
					color: #666666;
					border: 2rpx solid #666666;
				}
			}
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

		image {
			width: 50rpx;
			height: 50rpx;
		}
	}
</style>