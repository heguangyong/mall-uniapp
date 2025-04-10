<template>
	<view :data-theme="theme" class="upda_pasd">
		<view class="ChangePassword">
			<form @submit="editPwd" report-submit='true'>
				<view class="phone">当前手机号：{{userInfo.phone}}</view>
				<view class="list">
					<view class="item">
						<input type='password' placeholder='6-8位字母加数字' placeholder-class='placeholder' name="password"
							:value="password" maxlength="18" @blur="checkPasd"></input>
					</view>
					<view class="item">
						<input type='password' placeholder='确认新密码' placeholder-class='placeholder' name="qr_password"
							:value="qr_password" maxlength="18" @blur="checkPassword"></input>
					</view>
					<view class="item acea-row row-between-wrapper">
						<input type='number' placeholder='填写验证码' placeholder-class='placeholder' class="codeIput"
							name="captcha" :value="captcha" maxlength="6"></input>
						<button class="code" :class="disabled === true ? 'on' : ''" :disabled='disabled' @click="code">
							{{ text }}
						</button>
					</view>
				</view>
				<button form-type="submit" class="confirmBnt">确认修改</button>
			</form>
		</view>
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
	import {
		phoneRegisterReset,
		registerVerify
	} from '@/api/api.js';
	import {
		toLogin
	} from '@/libs/login.js';
	import {
		mapGetters
	} from "vuex";
	import {
		setThemeColor
	} from '@/utils/setTheme.js'
	import {
		Debounce
	} from '@/utils/validate.js'
	import Verify from '../components/verifition/verify.vue';
	import {
		updatePasswordCodeApi
	} from "../../../api/api";
	const app = getApp();
	export default {
		mixins: [sendVerifyCode],
		components: {
			Verify
		},
		data() {
			return {
				password: '',
				captcha: '',
				qr_password: '',
				isAuto: false, //没有授权的不会自动授权
				isShowAuth: false, //是否隐藏授权
				theme: app.globalData.theme,
				bgColor: ''
			};
		},
		computed: mapGetters(['isLogin', 'userInfo']),
		onLoad() {
			if (!this.isLogin) {
				toLogin();
			}
			this.bgColor = setThemeColor();
			uni.setNavigationBarColor({
				frontColor: '#ffffff',
				backgroundColor: this.bgColor,
			});
		},
		methods: {
			/**
			 * 授权回调
			 */
			onLoadFun: function(e) {
				//this.getUserInfo();
			},
			// 授权关闭
			authColse: function(e) {
				this.isShowAuth = e
			},
			//滑块验证成功后调用
			handlerOnVerSuccess(data) {
				this.$refs.verify.hide();
				this.codeSend();
			},
			codeSend() {
				let that = this;
				updatePasswordCodeApi().then(res => {
					that.$util.Tips({
						title: '发送成功'
					});
					that.sendCode();
				}).catch(err => {
					return that.$util.Tips({
						title: err
					});
				});
			},
			/**
			 * 发送验证码
			 *
			 */
			code: Debounce(function(e) {
				let that = this;
				if (!that.userInfo.phone) return that.$util.Tips({
					title: '手机号码不存在,无法发送验证码！'
				});
				if (that.qr_password != that.password) return that.$util.Tips({
					title: '两次输入的密码不一致！'
				});
				that.$refs.verify.show();
			}),

			/**
			 * H5登录 修改密码
			 *
			 */
			checkPasd(e) {
				let that = this,
					password = e.detail.value;
				that.password = password;
				// if (!/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,8}$/i.test(password)) return that.$util.Tips({
				if (!/^[a-zA-Z]\w{5,17}$/i.test(password)) return that.$util.Tips({
					title: '密码格式错误，密码必须以字母开头，长度在6~8之间，只能包含字符数字和下划线'
				});
			},
			checkPassword(e) {
				let that = this,
					qr_password = e.detail.value;
					that.qr_password = qr_password;
				if (qr_password != that.password) return that.$util.Tips({
					title: '两次输入的密码不一致！'
				});
			},
			editPwd: Debounce(function(e) {
				let that = this,
					password = e.detail.value.password,
					qr_password = e.detail.value.qr_password,
					captcha = e.detail.value.captcha;
				if (!password) return that.$util.Tips({
					title: '请输入新密码'
				});
				if (!qr_password) return that.$util.Tips({
					title: '请确认新密码'
				});
				if (!captcha) return that.$util.Tips({
					title: '请输入验证码'
				});
				uni.showLoading({
					title: '加载中',
					mask: true
				});
				phoneRegisterReset({
					captcha: captcha,
					password: password
				}).then(res => {
					uni.hideLoading();
					return that.$util.Tips({
						title: '操作成功'
					}, {
						tab: 3,
						url: 1
					});
				}).catch(err => {
					uni.hideLoading();
					return that.$util.Tips({
						title: err
					});
				});
			})
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #fff !important;
	}

	.upda_pasd {
		background: #FFFFFF;
		height: 100vh;
	}

	.ChangePassword .phone {
		font-size: 32rpx;
		font-weight: bold;
		text-align: center;
		padding-top: 100rpx;
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
		// background-color: #fff;
		@include main_color(theme);
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
		@include main_bg_color(theme);
	}
</style>