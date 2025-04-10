<template>
	<view :data-theme="theme">
		<view class='cash-withdrawal'>
			<view class='nav acea-row'>
				<view v-for="(item,index) in navList" :key="index" class='item font-color'
					@click="swichNav(index,item)">
					<view class='line bg_color' :class='currentTab==index ? "on":""'></view>
					<view class='iconfont' :class='item.icon+" "+(currentTab==index ? "on":"")'></view>
					<view class="tab_text">{{item.name}}</view>
				</view>
			</view>
			<view class='wrapper'>
				<view :hidden='currentTab != 0' class='list'>
					<form @submit="subCash" report-submit='true'>
						<view class='item acea-row row-between-wrapper'>
							<view class='name'>姓名</view>
							<view class='input'>
								<input placeholder='请输入持卡人姓名' placeholder-class='placeholder' name="cardholder"
									maxlength="20"></input>
							</view>
						</view>
						<view class='item acea-row row-between-wrapper'>
							<view class='name'>卡号</view>
							<view class='input'>
								<input type='number' placeholder='请填写卡号' placeholder-class='placeholder'
									name="bankCardNo" maxlength="19"></input>
							</view>
						</view>
						<view class='item acea-row row-between-wrapper'>
							<view class='name'>Bank</view>
							<view class='input'>
								<picker @change="bindPickerChange" :value="index" :range="bankList">
									<text class='Bank'>{{bankList[index]}}</text>
									<text class='iconfont icon-qiepian38'></text>
								</picker>
							</view>
						</view>
						<view class='item acea-row row-between-wrapper'>
							<view class='name'>结算</view>
							<view class='input'><input
									:placeholder='settlementConfig.minPrice? "最低结算金额"+ settlementConfig.minPrice:"最低结算金额"+ 0'
									placeholder-class='placeholder' name="closingPrice" type='digit'></input></view>
						</view>
						<button formType="submit" class='bnt'
							:class="parseFloat(settlementConfig.brokerage)>parseFloat(settlementConfig.minPrice) ?'bg-color': 'bg-color-hui'">结算申请</button>
					</form>
				</view>
				<view :hidden='currentTab != 1' class='list'>
					<form @submit="subCash" report-submit='true'>
						<view class='item acea-row row-between-wrapper'>
							<view class='name'>姓名</view>
							<view class='input'>
								<input placeholder='请填写您的真实姓名' placeholder-class='placeholder' name="realName"
									maxlength="20"></input>
							</view>
						</view>
						<view class='item acea-row row-between-wrapper'>
							<view class='name'>账号</view>
							<view class='input'>
								<input placeholder='请填写您的微信账号' placeholder-class='placeholder' name="wechatNo"
									maxlength="20"></input>
							</view>
						</view>
						<view class='item acea-row row-between-wrapper'>
							<view class='name'>结算</view>
							<view class='input'>
								<input :placeholder='"最低结算金额"+ settlementConfig.minPrice|| 0'
									placeholder-class='placeholder' name="closingPrice" type='digit'
									maxlength="5"></input>
							</view>
						</view>
						<view class='item acea-row row-top row-between'>
							<view class='name'>收款码</view>
							<view class="input acea-row">
								<view class="picEwm" v-if="qrcodeUrlW">
									<image :src="qrcodeUrlW"></image>
									<text class='iconfont icon-guanbi1 font-color' @click='DelPicW'></text>
								</view>
								<view class='pictrue acea-row row-center-wrapper row-column' @click='uploadpic("W")'
									v-else>
									<text class='iconfont icon-icon25201'></text>
									<view>上传图片</view>
								</view>
							</view>
						</view>
						<button formType="submit" class='bnt'
							:class="parseFloat(settlementConfig.brokerage)>parseFloat(settlementConfig.minPrice) ?'bg-color': 'bg-color-hui'">结算申请</button>
					</form>
				</view>
				<view :hidden='currentTab != 2' class='list'>
					<form @submit="subCash" report-submit='true'>
						<view class='item acea-row row-between-wrapper'>
							<view class='name'>姓名</view>
							<view class='input'>
								<input placeholder='请填写您的真实姓名' placeholder-class='placeholder' name="realName"
									maxlength="20"></input>
							</view>
						</view>
						<view class='item acea-row row-between-wrapper'>
							<view class='name'>账号</view>
							<view class='input'>
								<input placeholder='请填写您的支付宝账号' placeholder-class='placeholder' name="alipayAccount"
									maxlength="20"></input>
							</view>
						</view>
						<view class='item acea-row row-between-wrapper'>
							<view class='name'>结算</view>
							<view class='input'>
								<input :placeholder='"最低结算金额"+settlementConfig.minPrice' placeholder-class='placeholder'
									name="closingPrice" type='digit' maxlength="5"></input>
							</view>
						</view>
						<view class='item acea-row row-top row-between'>
							<view class='name'>收款码</view>
							<view class="input acea-row">
								<view class="picEwm" v-if="qrcodeUrlZ">
									<image :src="qrcodeUrlZ"></image>
									<text class='iconfont icon-guanbi1 font-color' @click='DelPicZ'></text>
								</view>
								<view class='pictrue acea-row row-center-wrapper row-column' @click='uploadpic("Z")'
									v-else>
									<text class='iconfont icon-icon25201'></text>
									<view>上传图片</view>
								</view>
							</view>
						</view>
						<button formType="submit" class='bnt'
							:class="parseFloat(settlementConfig.brokerage)>parseFloat(settlementConfig.minPrice) ?'bg-color': 'bg-color-hui'">结算申请</button>
					</form>
				</view>
				<view class='tip'>
					当前可提现金额: <text
						class="price">￥{{settlementConfig.brokerage?settlementConfig.brokerage:0}},</text>冻结佣金：￥{{settlementConfig.freezeBrokerage?settlementConfig.freezeBrokerage:0}}
				</view>
				<view class='tip'>
					说明: 每笔佣金的冻结期为{{settlementConfig.freezeDay?settlementConfig.freezeDay:0}}天，到期后可提现
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
		extractCash,
		closingConfigApi
	} from '@/api/user.js';
	import {
		toLogin
	} from '@/libs/login.js';
	import {
		mapGetters
	} from "vuex";
	import {
		Debounce
	} from '@/utils/validate.js'
	let app = getApp();
	export default {
		data() {
			return {
				navList: [{
						'name': '',
						'icon': 'icon-yinhangqia',
						'type': 'bank'
					},
					{
						'name': '',
						'icon': 'icon-weixin2',
						'type': 'wechat'
					},
					{
						'name': '',
						'icon': 'icon-icon34',
						'type': 'alipay'
					}
				],
				type: 'bank',
				currentTab: 0,
				index: 0,
				bankList: [], //提现银行
				userInfo: [],
				isClone: false,
				settlementConfig: {}, //结算配置
				qrcodeUrlW: "",
				qrcodeUrlZ: "",
				isCommitted: false, //防止多次提交
				theme: app.globalData.theme,
			};
		},
		computed: mapGetters(['isLogin']),
		watch: {
			isLogin: {
				handler: function(newV, oldV) {
					if (newV) {
						this.getClosingConfig();
					}
				},
				deep: true
			}
		},
		onLoad(options) {
			if (this.isLogin) {
				this.getClosingConfig();
			} else {
				toLogin();
			}
		},
		methods: {
			uploadpic: function(type) {
				let that = this;
				that.$util.uploadImageOne({
					url: 'upload/image',
					name: 'multipart',
					model: "user",
					pid: 1
				}, function(res) {
					if (type === 'W') {
						that.qrcodeUrlW = res;
					} else {
						that.qrcodeUrlZ = res;
					}
				});
			},
			/**
			 * 删除图片
			 *
			 */
			DelPicW: function() {
				this.qrcodeUrlW = "";
			},
			DelPicZ: function() {
				this.qrcodeUrlZ = "";
			},
			/**
			 * 获取用户结算配置
			 *
			 */
			getClosingConfig() {
				closingConfigApi().then(res => {
					let data = res.data;
					this.$set(this, 'bankList', data.bankList);
					this.settlementConfig = res.data;
				})
			},
			swichNav: function(i, item) {
				this.currentTab = i;
				this.type = item.type;
			},
			bindPickerChange: function(e) {
				this.index = e.detail.value;
			},
			moneyInput(e) {
				//正则表达试
				e.target.value = (e.target.value.match(/^\d*(\.?\d{0,2})/g)[0]) || null
				//重新赋值给input
				this.$nextTick(() => {
					this.money = e.target.value
				})

			},
			subCash: Debounce(function(e) {
				let that = this,
					value = e.detail.value;
				if(parseFloat(that.settlementConfig.brokerage) <=0) return;
				switch (that.currentTab) {
					case 0:
						if (value.cardholder.length == 0) return this.$util.Tips({
							title: '请填写持卡人姓名'
						});
						if (value.bankCardNo.length == 0) return this.$util.Tips({
							title: '请填写卡号'
						});
						value.bankName = that.bankList[that.index];
						break;
					case 1:
						if (value.wechatNo.length == 0) return this.$util.Tips({
							title: '请填写微信号'
						});
						if (value.realName.length == 0) return this.$util.Tips({
							title: '请填写真实姓名'
						});
						if (!that.qrcodeUrlW) return this.$util.Tips({
							title: '请填写微信收款码'
						});
						value.paymentCode = that.qrcodeUrlW;
						break;
					default:
						if (value.alipayAccount.length == 0) return this.$util.Tips({
							title: '请填写支付宝账号'
						});
						if (value.realName.length == 0) return this.$util.Tips({
							title: '请填写真实姓名'
						});
						if (!that.qrcodeUrlZ) return this.$util.Tips({
							title: '请填写支付宝收款码'
						});
						value.paymentCode = that.qrcodeUrlZ;
						break;
				}
				value.type = this.type;
				if (value.closingPrice.length == 0) return this.$util.Tips({
					title: '请填写结算金额'
				});
				if (!(/^(\d?)+(\.\d{0,2})?$/.test(value.closingPrice))) return this.$util.Tips({
					title: '结算金额保留2位小数'
				});
				if (parseFloat(value.closingPrice) < parseFloat(that.settlementConfig.minPrice)) return this.$util
					.Tips({
						title: '结算金额不能低于' + that.settlementConfig.minPrice
					});
				if (this.isCommitted == false) {
					this.isCommitted = true;
					extractCash(value).then(res => {
						return this.$util.Tips({
							title: "申请成功",
							icon: 'success'
						}, {
							tab: 2,
							url: '/pages/users/user_spread_user/index'
						});
						this.isCommitted = false;
					}).catch(err => {
						this.isCommitted = false;
						return this.$util.Tips({
							title: err
						});
					});
				}
			})
		}
	}
</script>

<style>
	body {
		height: 100% !important;
	}
</style>
<style lang="scss">
	page {
		background-color: #fff !important;

	}

	.cash-withdrawal .nav {
		height: 130rpx;
		box-shadow: 0 10rpx 10rpx #f8f8f8;
	}

	.cash-withdrawal .nav .item {
		font-size: 26rpx;
		flex: 1;
		text-align: center;
	}

	.cash-withdrawal .nav .item~.item {
		border-left: 1px solid #f0f0f0;
	}

	.cash-withdrawal .nav .item .iconfont {
		width: 40rpx;
		height: 40rpx;
		border-radius: 50%;
		@include coupons_border_color(theme);
		@include main_color(theme);
		text-align: center;
		line-height: 37rpx;
		margin: 0 auto 6rpx auto;
		font-size: 22rpx;
		box-sizing: border-box;
	}

	.cash-withdrawal .nav .item .iconfont.on {
		@include main_bg_color(theme);
		color: #fff !important;
		@include coupons_border_color(theme);
		// border-color: $theme-color;
	}

	.cash-withdrawal .nav .item .line {
		width: 2rpx;
		height: 20rpx;
		margin: 0 auto;
		transition: height 0.3s;
	}

	.tab_text {
		@include main_color(theme);
	}

	.bg_color {
		@include main_bg_color(theme);
	}

	.cash-withdrawal .nav .item .line.on {
		height: 39rpx;
	}

	.cash-withdrawal .wrapper .list {
		padding: 0 30rpx;
	}

	.cash-withdrawal .wrapper .list .item {
		border-bottom: 1rpx solid #eee;
		min-height: 28rpx;
		font-size: 30rpx;
		color: #333;
		padding: 39rpx 0;
	}

	.cash-withdrawal .wrapper .list .item .name {
		width: 130rpx;
	}

	.cash-withdrawal .wrapper .list .item .input {
		width: 505rpx;
	}

	.cash-withdrawal .wrapper .list .item .input .placeholder {
		color: #bbb;
	}

	.cash-withdrawal .wrapper .list .item .picEwm,
	.cash-withdrawal .wrapper .list .item .pictrue {
		width: 140rpx;
		height: 140rpx;
		border-radius: 3rpx;
		position: relative;
		margin-right: 23rpx;
	}

	.cash-withdrawal .wrapper .list .item .picEwm image {
		width: 100%;
		height: 100%;
		border-radius: 3rpx;
	}

	.cash-withdrawal .wrapper .list .item .picEwm .icon-guanbi1 {
		position: absolute;
		right: -14rpx;
		top: -16rpx;
		font-size: 40rpx;
	}

	.cash-withdrawal .wrapper .list .item .pictrue {
		border: 1px solid rgba(221, 221, 221, 1);
		font-size: 22rpx;
		color: #BBBBBB;
	}

	.cash-withdrawal .wrapper .list .item .pictrue .icon-icon25201 {
		font-size: 47rpx;
		color: #DDDDDD;
		margin-bottom: 3px;
	}

	.cash-withdrawal .wrapper .tip {
		font-size: 26rpx;
		color: #999;
		margin-top: 25rpx;
		padding: 0 30rpx;
	}

	.cash-withdrawal .wrapper .bnt {
		font-size: 32rpx;
		color: #fff;
		width: 690rpx;
		height: 90rpx;
		text-align: center;
		border-radius: 50rpx;
		line-height: 90rpx;
		margin: 64rpx auto;
	}

	.cash-withdrawal .wrapper .tip2 {
		font-size: 26rpx;
		color: #999;
		text-align: center;
		margin: 44rpx 0 20rpx 0;
	}

	.cash-withdrawal .wrapper .value {
		height: 135rpx;
		line-height: 135rpx;
		border-bottom: 1rpx solid #eee;
		width: 690rpx;
		margin: 0 auto;
	}

	.cash-withdrawal .wrapper .value input {
		font-size: 80rpx;
		color: #282828;
		height: 135rpx;
		text-align: center;
	}

	.cash-withdrawal .wrapper .list .value .placeholder2 {
		color: #bbb;
	}

	.price {
		@include price_color(theme);
	}
</style>