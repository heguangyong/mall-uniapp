<template>
	<view :data-theme="theme">
		<form @submit="formSubmit" report-submit='true'>
			<view class='personal-data borderPad'>
				<view class='list borRadius14'>
					<view class="item acea-row row-between-wrapper">
						<view>头像</view>
						<!-- #ifndef MP -->
						<view class="pictrue" @click.stop='uploadpic'>
							<image :src='avatarUrl'></image>
							<image :src='editPng' class="alter"></image>
						</view>
						<!-- #endif -->
						<!-- #ifdef MP -->
						<view class="pictrue">
							<button class="avatar-wrapper" open-type="chooseAvatar" @chooseavatar="onChooseAvatar">
								<image class="avatar" :src="avatarUrl"></image>
							</button>
							<image :src='editPng' class="alter"></image>
						</view>
						<!-- #endif -->
					</view>
					<view class='item acea-row row-between-wrapper'>
						<view>昵称</view>
						<view class='input fontColor'>
							<!-- #ifndef MP -->
							<input type='text' name='nickname' :value='nickname' maxlength="10"></input>
							<!-- #endif -->
							<!-- #ifdef MP -->
							<input type="nickname" name='nickname' :value='nickname' class="weui-input"
								placeholder="请输入昵称" maxlength="10"/>
							<!-- #endif -->
						</view>
					</view>
					<view class='item acea-row row-between-wrapper'>
						<view>性别</view>
						<view class='input'>
							<picker @change="bindSexChange" :value="sexindex" :range="sexList" range-key="name">
								<view class="uni-input">{{sexList[sexindex].name}}</view>
							</picker>
						</view>
					</view>
					<view class='item acea-row row-between-wrapper'>
						<view>出生日期</view>
						<view class='input'>
							<picker mode="date" :value="date"
								@change="bindDateChange">
								<view class="uni-input">{{date}}</view>
							</picker>
						</view>
					</view>
					<view class='item acea-row row-between-wrapper'>
						<view>地区</view>
						<view class='input'>
							<picker mode="multiSelector" :value="cityIndex" :range="cityData" @change="bindCityChange"
								@columnchange="selMonitor">
								<view class="uni-input">{{addressNode.province&&addressNode.city ? addressNode.province + ' , ' + addressNode.city : '-'}}
								</view>
							</picker>
						</view>
					</view>
				</view>
				<button class='modifyBnt bg_color' formType="submit">保存修改</button>
			</view>
		</form>
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
		userEdit
	} from '@/api/user.js';
	import {
		getCity
	} from '@/api/api.js';
	import {
		toLogin
	} from '@/libs/login.js';
	import {
		mapGetters
	} from "vuex";
	import {
		Debounce
	} from '@/utils/validate.js'
	import city from "../static/js/city.js";
	let app = getApp();
	const CACHE_ADDRESS = {};
	export default {
		data() {
			return {
				memberInfo: {
					avatar: '',
				},
				userIndex: 0,
				wechat: false,
				theme: app.globalData.theme,
				editPng: '../../../static/images/alert1.png',
				sexList: [{
						val: 0,
						name: '未知'
					},
					{
						val: 1,
						name: '男'
					},
					{
						val: 2,
						name: '女'
					}
				],
				sexindex: 0,
				date: '2000-01-01',
				sex: 0,
				cityData: city,
				cityIndex: 0,
				addressNode: {
					province: "请选择城市",
					city: ""
				},
				provinceList: [],
				cityAllList: [],
				avatarUrl: "",
				nickname: '',
				userInfo: null
			};
		},
		computed: {
			...mapGetters(['isLogin']),
			startDate() {
				return this.getDate('start');
			},
			endDate() {
				return this.getDate('end');
			}

		},
		onLoad() {
			//this.loadAddress(1, 1);
			if (!this.isLogin) {
				toLogin();
			} else {
				this.getUserInfo();
			}
			this.getAddressData();
			// #ifdef H5
			let ua = navigator.userAgent.toLowerCase();
			if (ua.match(/MicroMessenger/i) == "micromessenger") {
				this.$set(this, 'wechat', false);
			} else {
				this.$set(this, 'wechat', true);
			}
			// #endif
			switch (this.theme) {
				case 'theme2':
					this.editPng = '../static/images/alert2.png'
					break;
				case 'theme3':
					this.editPng = '../static/images/alert3.png'
					break;
				case 'theme4':
					this.editPng = '../static/images/alert4.png'
					break;
				case 'theme5':
					this.editPng = '../static/images/alert5.png'
					break;
				default:
					this.editPng = '../static/images/alert1.png'
					break;
			}
		},
		methods: {
			getUserInfo(data) {
				this.$store.dispatch('USERINFO').then(res => {
					this.userInfo = res;
					this.avatarUrl = this.userInfo.avatar ? this.userInfo.avatar : '../static/images/f.png';
					this.nickname = this.userInfo.nickname ? this.userInfo.nickname : '-';
					this.date = this.userInfo.birthday || '2000-01-01';
					this.sexindex = this.userInfo.sex;
					this.sex = this.sexList[this.sexindex].val;
					this.addressNode = {
						province: this.userInfo.province,
						city: this.userInfo.city
					}
				});
			},
			/**
			 * 小程序端上传头像
			 *
			 */
			onChooseAvatar(e) {
				const {
					avatarUrl
				} = e.detail
				uni.showLoading({
					title: '加载中...'
				});
				this.$util.uploadImgs( avatarUrl, {
					url: 'upload/image',
					name: 'multipart',
					model: "maintain",
					pid: 0
				},(res) => {
					this.avatarUrl = res.data.url;
					uni.hideLoading();
				}, (err) => {
					uni.hideLoading();
				})
			},
			/**
			 * 监听省市区滚动
			 *
			 */
			selMonitor(e) {
				const that = this
				let column = e.detail.column
				if (column == 0) {
					let index = e.detail.value
					let length = that.cityData[1].length
					// 改变市
					that.cityData[1].splice(0, length, ...that.cityAllList[index])
				}
			},
			/**
			 * 将省市区的数据转换为picker可用的多维数组
			 *
			 */
			getAddressData() {
				// 所有城市列表,二维数组
				let cityAllList = [];
				// 省列表
				let provinceList = [];
				// cityData为省市区的json数据
				for (let key in this.cityData) {
					let newDataList = [];
					if (this.cityData[key].child) {
						for (let key2 in this.cityData[key].child) {
							newDataList.push(this.cityData[key].child[key2].city);
						}
					}
					provinceList.push(this.cityData[key].province);
					cityAllList.push(newDataList);
				}
				this.provinceList = provinceList;
				this.cityAllList = cityAllList;
				this.cityData = [provinceList, cityAllList[0]];
			},
			bindCityColumnChange(e) {
				let column = e.detail.column
				if (column == 0) {
					let index = e.detail.value
					this.cityData[1] = this.cityAllList[index]
				}
			},
			bindCityChange(e) {
				let val = e.target.value
				this.addressNode = {
					province: this.cityData[0][val[0]],
					city: this.cityData[1][val[1]]
				}
			},
			bindSexChange(e) {
				this.sexindex = e.detail.value;
				this.sex = this.sexList[this.sexindex].val;
			},
			bindDateChange: function(e) {
				this.date = e.detail.value
			},
			getDate(type) {
				const date = new Date();
				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let day = date.getDate();

				if (type === 'start') {
					year = year - 60;
				} else if (type === 'end') {
					year = year + 2;
				}
				month = month > 9 ? month : '0' + month;
				day = day > 9 ? day : '0' + day;
				return `${year}-${month}-${day}`;
			},
			/**
			 * 上传文件
			 *
			 */
			uploadpic: function() {
				let that = this;
				that.$util.uploadImageOne({
					url: 'upload/image',
					name: 'multipart',
					model: "maintain",
					pid: 0,
					count: 1
				}, function(res) {
					that.avatarUrl = res;
				});
			},

			/**
			 * 提交修改
			 */
			formSubmit: Debounce(function(e) {
				let that = this,
					value = e.detail.value
				if (!value.nickname) return that.$util.Tips({
					title: '用户姓名不能为空'
				});
				value.avatar = that.avatarUrl ? that.avatarUrl : that.userInfo.avatar;
				uni.showLoading({
					title: '加载中...'
				});

				userEdit({
					avatar: value.avatar,
					birthday: that.date,
					city: this.addressNode.city,
					province: this.addressNode.province,
					nickname: value.nickname,
					sex: that.sex
				}).then(res => {
					uni.hideLoading();
					that.$util.Tips({
						title: '保存成功',
						icon: 'success'
					});
					setTimeout(function() {
						uni.reLaunch({
							url: '/pages/user/index',
						})
					}, 2000);

				}).catch(msg => {
					uni.hideLoading();
					return that.$util.Tips({
						title: msg || '保存失败，您并没有修改'
					});
				});
			})
		}
	}
</script>

<style scoped lang="scss">
	.fontColor {
		color: #868686;
	}

	.personal-data .wrapper {
		margin: 10rpx 0;
		background-color: #fff;
		padding: 36rpx 30rpx 13rpx 30rpx;
	}

	.personal-data .wrapper .title {
		margin-bottom: 30rpx;
		font-size: 32rpx;
		color: #282828;
	}

	.personal-data .wrapper .wrapList .item {
		width: 690rpx;
		height: 160rpx;
		background-color: #f8f8f8;
		border-radius: 20rpx;
		margin-bottom: 22rpx;
		padding: 0 30rpx;
		position: relative;
		border: 2rpx solid #f8f8f8;
		box-sizing: border-box;
	}

	.personal-data .wrapper .wrapList .item.on {
		border-color: $theme-color;
		border-radius: 20rpx;
		background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAArIAAACgCAYAAADw+I85AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQ1IDc5LjE2MzQ5OSwgMjAxOC8wOC8xMy0xNjo0MDoyMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6M0QzNkY3NzlCNzJCMTFFOTgyNEU4QzhGQTRFRUY2REQiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6M0QzNkY3N0FCNzJCMTFFOTgyNEU4QzhGQTRFRUY2REQiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDozRDM2Rjc3N0I3MkIxMUU5ODI0RThDOEZBNEVFRjZERCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDozRDM2Rjc3OEI3MkIxMUU5ODI0RThDOEZBNEVFRjZERCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pn3rJMAAAArUSURBVHja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");
		background-size: 100% 100%;
		background-color: #fff9f9;
		background-repeat: no-repeat;
	}

	.personal-data .wrapper .wrapList .item .picTxt {
		width: 445rpx;
	}

	.personal-data .wrapper .wrapList .item .picTxt .pictrue {
		width: 96rpx;
		height: 96rpx;
		position: relative;
	}

	.personal-data .wrapper .wrapList .item .picTxt .pictrue image,
	.pictrue button {
		width: 100%;
		height: 100%;
		border-radius: 50%;
	}

	.personal-data .wrapper .wrapList .item .picTxt .pictrue .alter {
		width: 30rpx;
		height: 30rpx;
		border-radius: 50%;
		position: absolute;
		bottom: 0;
		right: 0;
	}

	.personal-data .wrapper .wrapList .item .picTxt .text {
		width: 325rpx;
	}

	.personal-data .wrapper .wrapList .item .picTxt .text .name {
		width: 100%;
		font-size: 30rpx;
		color: #282828;
	}

	.personal-data .wrapper .wrapList .item .picTxt .text .phone {
		font-size: 24rpx;
		color: #999;
		margin-top: 10rpx;
	}

	.personal-data .wrapper .wrapList .item .bnt {
		font-size: 24rpx;
		background-color: #fff;
		border-radius: 27rpx;
		width: 140rpx;
		height: 54rpx;
		border: 2rpx solid $theme-color;
	}

	.personal-data .wrapper .wrapList .item .currentBnt {
		position: absolute;
		right: 0;
		top: 0;
		font-size: 26rpx;
		background-color: rgba(233, 51, 35, 0.1);
		width: 140rpx;
		height: 48rpx;
		border-radius: 0 20rpx 0 20rpx;
	}

	.personal-data .list {
		margin-top: 30rpx;
		background-color: #fff;
	}

	.personal-data .list .item {
		border-bottom: 1rpx solid #f2f2f2;
		padding: 24rpx;
		font-size: 32rpx;
		color: #333333;
	}

	.personal-data .list .item .phone {
		width: 160rpx;
		height: 56rpx;
		font-size: 24rpx;
		color: #fff;
		line-height: 56rpx;
		border-radius: 32rpx
	}

	.personal-data .list .item .pictrue {
		width: 80rpx;
		height: 80rpx;
		position: relative;
	}

	.personal-data .list .item .pictrue image {
		width: 100%;
		height: 100%;
		border-radius: 50%;
	}

	.personal-data .list .item .pictrue .alter {
		width: 30rpx;
		height: 30rpx;
		border-radius: 50%;
		position: absolute;
		bottom: 0;
		right: 0;
	}

	.personal-data .list .item .input {
		width: 415rpx;
		text-align: right;
		color: #666666;
	}

	.personal-data .list .item .input .id {
		width: 365rpx;
	}

	.personal-data .list .item .input .iconfont {
		font-size: 35rpx;
	}

	.personal-data .modifyBnt {
		font-size: 32rpx;
		color: #fff;
		width: 690rpx;
		height: 90rpx;
		border-radius: 50rpx;
		text-align: center;
		line-height: 90rpx;
		margin: 76rpx auto 0 auto;
	}

	.bg_color {
		@include main_bg_color(theme);
	}

	.personal-data .logOut {
		font-size: 32rpx;
		text-align: center;
		width: 690rpx;
		height: 90rpx;
		border-radius: 45rpx;
		margin: 30rpx auto 0 auto;
	}
</style>
