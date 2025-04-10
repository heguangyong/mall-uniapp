<template>
	<view :data-theme="theme">
		<form @submit="formSubmit" report-submit='true'>
			<view class='addAddress borderPad'>
				<view class='list borRadius14'>
					<view class='item acea-row' style="border: none;">
						<view class='name'>姓名</view>
						<input type='text' placeholder='请输入姓名' placeholder-style="color:#ccc;" name='realName'
							:value="userAddress.realName" placeholder-class='placeholder' maxlength="20"></input>
					</view>
					<view class='item acea-row'>
						<view class='name'>手机号码</view>
						<input type='number' placeholder='请输入手机号码' placeholder-style="color:#ccc;" name="phone"
							:value='userAddress.phone' placeholder-class='placeholder' maxlength="11"></input>
					</view>
					<view class='item acea-row row-between-wrapper'>
						<view class='name'>所在地区</view>
						<view class="address">
							<view class="region_count" @click="changeRegion">
								<text v-if="!addressInfo.length" style="color:#cdcdcd;">请选择地址</text>
								<text v-else>{{addressText}}</text>
								
							</view>
						</view>
						<text class="iconfont icon-xiangyou"></text>
					</view>
					<view class='item acea-row row-between-wrapper'>
						<view class='name'>详细地址</view>
						<input class="address" type='text' placeholder='请填写具体地址' placeholder-style="color:#ccc;" name='detail'
							placeholder-class='placeholder' v-model='userAddress.detail' maxlength="100"></input>
						<view class='iconfont icon-dizhi font_color' @tap="chooseLocation"></view>
					</view>
				</view>
				<view class='default acea-row row-middle borRadius14'>
					<checkbox-group @change='ChangeIsDefault'>
						<checkbox :checked="userAddress.isDefault" />设置为默认地址
					</checkbox-group>
				</view>

				<button class='keepBnt bg_color' form-type="submit">{{orderNo!=0?'保存并使用':'立即保存'}}</button>
				<!-- #ifdef MP -->
				<view class="wechatAddress" v-if="!addressId" @click="getWxAddress">导入微信地址</view>
				<!-- #endif -->
				<!-- #ifdef H5 -->
				<view class="wechatAddress" v-if="this.$wechat.isWeixin() && !addressId" @click="getAddress">导入微信地址</view>
				<!-- #endif -->
			</view>
		</form>
		<view v-show="showLoading" class="bg-fixed"></view>
		<areaWindow ref="areaWindow" :display="display" :address="addressInfo" @submit="OnChangeAddress"
			@changeClose="changeClose"></areaWindow>
	</view>
</template>

<script>
	import {
		editAddress,
		addAddress,
		getAddressDetail,
		getCity,
		getWxAddressInfo
	} from '@/api/user.js';
	import {
		getCityList
	} from "@/utils";
	import {
		toLogin
	} from '@/libs/login.js';
	import {
		mapGetters
	} from "vuex";
	import areaWindow from '../components/areaWindow';
	import {
		Debounce
	} from '@/utils/validate.js'

	import {
		addressWxImportApi
	} from '@/api/public.js';
	let app = getApp();
	export default {
		components: {
			areaWindow
		},
		data() {
			return {
				cartId: '', //购物车id
				pinkId: 0, //拼团id
				couponId: 0, //优惠券id
				addressId: 0, //地址id
				userAddress: {
					isDefault: false
				}, //地址详情
				region: ['省', '市', '区'],
				valueRegion: [0, 0, 0, 0],
				district: [],
				multiArray: [],
				multiIndex: [0, 0, 0],
				cityId: 0,
				bargain: false, //是否是砍价
				combination: false, //是否是拼团
				secKill: false, //是否是秒杀
				theme: app.globalData.theme,
				showLoading: false,
				display: false,
				addressInfo: [],
				addressData: [],
				orderNo: '' //订单id
			};
		},
		computed: {
			...mapGetters(['isLogin']),
			addressText() {
				return this.addressInfo.map(v => v.regionName).join('/');
			}
		},
		watch: {
			isLogin: {
				handler: function(newV, oldV) {
					if (newV) {
						this.getUserAddress();
					}
				},
				deep: true
			}
		},
		onLoad(options) {
			if (this.isLogin) {
				this.orderNo = options.orderNo || 0;
				this.addressId = options.id || 0;
				uni.setNavigationBarTitle({
					title: this.addressId ? '编辑地址' : '添加地址'
				})
				this.getUserAddress();
			} else {
				toLogin();
			}
		},
		methods: {
			// 关闭地址弹窗；
			changeClose: function() {
				this.display = false;
			},
			OnChangeAddress(address) {
				this.addressInfo = address;
			},
			changeRegion() {
				this.display = true;
			},
			getUserAddress: function() {
				if (!this.addressId) return false;
				let that = this;
				getAddressDetail(this.addressId).then(res => {
					if (res.data) {
						that.$set(that, 'userAddress', res.data);
						that.addressInfo = [{
							regionName: res.data.province,
							parentId: 1,
							isChild: true,
							regionId: res.data.provinceId,
							regionType: 1
						}, {
							regionName: res.data.city,
							parentId: res.data.provinceId,
							regionId: res.data.cityId,
							isChild: true,
							regionType: 2
						}, {
							regionName: res.data.district,
							parentId: res.data.cityId,
							regionId: res.data.districtId,
							isChild: true,
							regionType: 3
						}, {
							isChild: false,
							parentId: res.data.districtId,
							regionName: res.data.street,
							regionType: 4
						}]
					}
				});
			},
			toggleTab(str) {
				this.$refs[str].show();
			},
			onConfirm(val) {
				this.region = val.checkArr[0] + '-' + val.checkArr[1] + '-' + val.checkArr[2];
			},
            //选择定位
			chooseLocation: function() {
				this.$util.$L.getLocation().then(res=>{
					uni.chooseLocation({
						latitude: uni.getStorageSync('user_latitude'),
						longitude: uni.getStorageSync('user_longitude'),
						success: (res) => {
							this.$set(this.userAddress, 'detail', res.name);
						}
					})
				})
			},
			//导入微信地址回显到地址栏
			addressWxImportAdd(res) {
				this.userAddress.realName = res.userName;
				this.userAddress.phone = res.telNumber;
				this.userAddress.detail = res.detailInfo;
				getWxAddressInfo({
					"cityName": res.cityName,
					"countryName": res.countryName || res.countyName,
					"detail": res.detailInfo,
					"nationalCode": res.nationalCode,
					"provinceName": res.provinceName,
					"streetName": res.streetName || res.addressStreetFourthStageName
				}).then(r => {
					this.addressInfo = [{
						regionName: r.data.province,
						parentId: 1,
						isChild: true,
						regionId: r.data.provinceId,
						regionType: 1
					}, {
						regionName: r.data.city,
						parentId: r.data.provinceId,
						regionId: r.data.cityId,
						isChild: true,
						regionType: 2
					}, {
						regionName: r.data.district,
						parentId: r.data.cityId,
						regionId: r.data.districtId,
						isChild: true,
						regionType: 3
					}, {
						isChild: false,
						parentId: r.data.districtId,
						regionName: r.data.street,
						regionType: 4
					}]
				});
			},
			// 导入共享地址（小程序）
			getWxAddress: function() {
				this.$util.addressWxImport().then(userInfo => {
					this.addressWxImportAdd(userInfo);
				});
			},
			// 导入共享地址（微信）；
			getAddress() {
				let that = this;
				that.$wechat.openAddress().then(userInfo => {
					that.addressWxImportAdd(userInfo);
				});
			},
			/**
			 * 提交用户添加地址
			 * 
			 */
			formSubmit: Debounce(function(e) {
				let that = this,
					value = e.detail.value;
				if (!value.realName) return that.$util.Tips({
					title: '请填写收货人姓名'
				});
				if (!value.phone) return that.$util.Tips({
					title: '请填写手机号码'
				});
				if (!/^1(3|4|5|7|8|9|6)\d{9}$/i.test(value.phone)) return that.$util.Tips({
					title: '请输入正确的手机号码'
				});
				if (!that.addressInfo.length == '省-市-区-街道') return that.$util.Tips({
					title: '请选择所在地区'
				});
				if (!value.detail) return that.$util.Tips({
					title: '请填写详细地址'
				});
				value.id = that.addressId;
				value.province = that.addressInfo[0].regionName;
				value.provinceId = that.addressInfo[0].regionId;
				value.city = that.addressInfo[1].regionName;
				value.cityId = that.addressInfo[1].regionId;
				value.district = that.addressInfo[2].regionName;
				value.districtId = that.addressInfo[2].regionId;
				value.street = that.addressInfo.length>3?that.addressInfo[3].regionName:'';
				value.isDefault = that.userAddress.isDefault;

				uni.showLoading({
					title: '保存中',
					mask: true
				})
				if (that.addressId) {
					editAddress(value).then(res => {
						that.$util.Tips({
							title: '修改成功',
							icon: 'success'
						});
            uni.hideLoading();
						that.onSuccess();
					}).catch(err => {
            uni.hideLoading();
						return that.$util.Tips({
							title: err
						});
					})
				} else {
					addAddress(value).then(res => {
						that.$util.Tips({
							title: '添加成功',
							icon: 'success'
						});
						that.addressId = res.data;
            uni.hideLoading();
						that.onSuccess();
					}).catch(err => {
						return that.$util.Tips({
							title: err
						});
            uni.hideLoading();
					})
				}

			}),
			onSuccess() {
				let orderNo = this.orderNo;
				let id = this.addressId;
				setTimeout(()=> {
					if (orderNo!=0 && id!=0) {
						uni.redirectTo({
							url: '/pages/goods/order_confirm/index?is_address=1&orderNo=' + orderNo +
								'&addressId=' + id
						})
					} else {
						// #ifdef H5
						return history.back();
						// #endif
						// #ifndef H5
						return uni.navigateBack({
							delta: 1,
						})
						// #endif
					}
				}, 1000);
			},
			ChangeIsDefault: function(e) {
				this.$set(this.userAddress, 'isDefault', !this.userAddress.isDefault);
			}
		}
	}
</script>

<style scoped lang="scss">
	.bg-fixed {
		width: 100%;
		height: 750rpx;
		position: absolute;
		top: 0;
	}

	.addAddress {
		padding-top: 20rpx;
	}

	.bg_color {
		@include main_bg_color(theme);
	}

	.addAddress .list {
		background-color: #fff;
		padding: 0 24rpx;
	}

	.addAddress .list .item {
		border-top: 1rpx solid #eee;
		padding: 24rpx 0;
		justify-content: flex-start;
		align-items: center;
	}

	.addAddress .list .item .name {
		font-size: 30rpx;
		color: #333;
		width: 120rpx;
	}

	.addAddress .list .item input, .address {
			flex: 1;
		width: 490rpx;
		margin-left: 20rpx;
		font-size: 30rpx;
		font-weight: 400;
	}

	.addAddress .list .item .placeholder {
		color: #ccc;
	}

	.addAddress .list .item picker .picker {
		width: 410rpx;
		font-size: 30rpx;
	}

	.addAddress .default {
		padding: 0 30rpx;
		height: 90rpx;
		background-color: #fff;
		margin-top: 23rpx;
	}

	.addAddress .default checkbox {
		margin-right: 15rpx;
	}

	.addAddress .keepBnt {
		width: 690rpx;
		height: 86rpx;
		border-radius: 50rpx;
		text-align: center;
		line-height: 86rpx;
		margin: 80rpx auto 24rpx auto;
		font-size: 32rpx;
		color: #fff;
	}

	.addAddress .wechatAddress {
		width: 690rpx;
		height: 86rpx;
		border-radius: 50rpx;
		text-align: center;
		line-height: 86rpx;
		margin: 0 auto;
		font-size: 32rpx;
		@include main_color(theme);
		@include coupons_border_color(theme);
	}

	.font_color {
		@include main_color(theme);
	}

	.relative {
		position: relative;
	}

	.icon-dizhi {
		font-size: 44rpx;
		z-index: 100;
	}

	.abs_right {
		position: absolute;
		right: 0;
	}

	/deep/ checkbox .uni-checkbox-input.uni-checkbox-input-checked {
		@include main_bg_color(theme);
		@include coupons_border_color(theme);
		color: #fff !important
	}

	/deep/ checkbox .wx-checkbox-input.wx-checkbox-input-checked {
		@include main_bg_color(theme);
		@include coupons_border_color(theme);
		color: #fff !important;
		margin-right: 0 !important;
	}
</style>
