<template>
	<view :data-theme="theme">
		<view class="ChangePassword">
			<view class="list">
				<block v-if="isNew">
					<view class="item">
						<input disabled='true' :value="userInfo.phone"></input>
					</view>
					<view class="item acea-row row-between-wrapper">
						<input type='number' placeholder='填写验证码' placeholder-class='placeholder' class="codeIput"
							v-model="captcha" maxlength="6"></input>
						<button class="code" :class="disabled === true ? 'on' : ''" :disabled='disabled' @click="code">
							{{ text }}
						</button>
					</view>
				</block>
				<block v-else>
					<view class="item">
						<input type='number' placeholder='新手机号' placeholder-class='placeholder' v-model="phone"
							maxlength="11"></input>
					</view>
					<view class="item acea-row row-between-wrapper">
						<input type='number' placeholder='填写验证码' placeholder-class='placeholder' class="codeIput"
							v-model="bindingCaptcha" maxlength="6"></input>
						<button class="code" :class="disabled === true ? 'on' : ''" :disabled='disabled' @click="code">
							{{ text }}
						</button>
					</view>
				</block>
			</view>
			<button form-type="submit" v-if="isNew" class="confirmBnt bg_color" @click="next">下一步</button>
			<button form-type="submit" v-if="!isNew" class="confirmBnt bg_color" @click="editPwd">保存</button>
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
		registerVerify,
		bindingPhone,
		verifyCode,
		bindingPhoneCode
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
	const app = getApp();
	export default {
		components: {
			Verify
		},
		mixins: [sendVerifyCode],
		data() {
			return {
				phone: '',
				captcha: '',
				isAuto: false, //没有授权的不会自动授权
				isShowAuth: false, //是否隐藏授权
				key: '',
				isNew: true,
				timer: '',
				text: '获取验证码',
				nums: 60,
				theme: app.globalData.theme,
				bgColor: '',
				bindingCaptcha: ''
			};
		},
		mounted() {
			// this.timer = setInterval(this.getTimes, 1000);
		},
		computed: mapGetters(['isLogin', 'userInfo']),
		onLoad() {
			let that = this;
			that.bgColor = setThemeColor();
			uni.setNavigationBarColor({
				frontColor: '#ffffff',
				backgroundColor: that.bgColor,
			});
			if (this.isLogin) {
			} else {
				toLogin();
			}
		},
		methods: {
			getTimes() {
				this.nums = this.nums - 1;
				this.text = "剩余 " + this.nums + "s";
				if (this.nums < 0) {
					clearInterval(this.timer);
				}
				this.text = "剩余 " + this.nums + "s";
				if (this.text < "剩余 " + 0 + "s") {
					this.disabled = false;
					this.text = "重新获取";
				}
			},
			onLoadFun: function() {},
			// 授权关闭
			authColse: function(e) {
				this.isShowAuth = e
			},
			next() {
				if (!this.captcha) return this.$util.Tips({
					title: '请填写验证码'
				});
				this.isNew = false;
				clearInterval(this.timer);
				this.disabled = false;
				this.text = "获取验证码";
			},
			editPwd: Debounce(function(e) {
				let that = this;
				if (!that.phone) return that.$util.Tips({
					title: '请填写手机号码！'
				});
				if (!(/^1(3|4|5|7|8|9|6)\d{9}$/i.test(that.phone))) return that.$util.Tips({
					title: '请输入正确的手机号码！'
				});
				if (!that.bindingCaptcha) return that.$util.Tips({
					title: '请填写验证码'
				});
				uni.showModal({
					title: '是否更换绑定账号',
					// #ifdef H5
					title: '是否更换绑定账号,更换之后需重新登录',
					// #endif
					confirmText: '绑定',
					success(res) {
						uni.showLoading({
							title: '加载中',
							mask: true
						});
						if (res.confirm) {
							bindingPhone({
								phone: that.phone,
								captcha: that.bindingCaptcha
							}).then(res => {
								uni.hideLoading();
								that.$store.dispatch('GETLOGOUT');
							}).catch(err => {
								uni.hideLoading();
								return that.$util.Tips({
									title: err
								});
							})
						} else if (res.cancel) {
							return that.$util.Tips({
								title: '您已取消更换绑定！'
							}, {
								tab: 5,
								url: '/pages/users/user_info/index'
							});
						}
					}
				});
			}),
			//滑块验证成功
			handlerOnVerSuccess(data) {
				this.$refs.verify.hide();
				this.codeSend();
			},
			codeSend() {
				let that = this;
				bindingPhoneCode({
					phone: that.phone,
					captcha: that.captcha
				}).then(res => {
					that.$util.Tips({
						title: res.message
					});

					that.timer = setInterval(that.getTimes, 1000);
					that.disabled = true;
					uni.hideLoading();
				}).catch(err => {
					return that.$util.Tips({
						title: err.toString()
					}, {
						tab: 3,
						url: 1
					});
					uni.hideLoading();
				});
			},
			/**
			 * 发送验证码
			 *
			 */
			code: Debounce(function() {
				this.nums = 60;
				uni.showLoading({
					title: '加载中',
					mask: true
				});
				let that = this;
				if (that.isNew) {
					registerVerify().then(res => {
						that.$util.Tips({
							title: res.message
						});
						that.timer = setInterval(that.getTimes, 1000);
						that.disabled = true;
						uni.hideLoading();
					}).catch(err => {
						return that.$util.Tips({
							title: err
						});
						uni.hideLoading();
					});
				} else {
					uni.hideLoading();
					if (!that.phone) return that.$util.Tips({
						title: '请填写手机号码！'
					});
					if (!(/^1(3|4|5|7|8|9|6)\d{9}$/i.test(that.phone))) return that.$util.Tips({
						title: '请输入正确的手机号码！'
					});
					that.$refs.verify.show();
				}

			})
		}
	}
</script>

<style lang="scss" scoped>
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

	page {
		background-color: #fff !important;
	}

	.ChangePassword {
		padding-top: 100rpx;
	}

	.ChangePassword .phone {
		font-size: 32rpx;
		font-weight: bold;
		text-align: center;
		margin-top: 55rpx;
	}

	.ChangePassword .list {
		width: 580rpx;
		margin: 0 auto;
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
		@include main_color(theme);
		background-color: #f5f5f5;
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

	.bg_color {
		@include main_bg_color(theme);
	}
</style>
