<template>
	<view :data-theme="theme">
		<view v-if="!successful">
      <form report-submit='true'>
        <view class='merchantsSettled'>
          <view class="merchantBg">
            <image class="bag" :src="merchantBg" alt="" srcset="" />
          </view>
          <view v-if="!merchantData.name" class="application-record" @click="jumpToList">
            申请记录
            <text class="iconfont icon-xiangyou"></text>
          </view>
          <view class='list'>
            <view class="item">
              <view class="acea-row row-middle required">
                <text class="item-name">商户名称</text>
                <input :disabled="merchantData.auditStatus&&parseFloat(merchantData.auditStatus)<3"
                       type="text" :maxlength="isCn ? '16' : '16'" placeholder="商户名称"
                       v-model="merchantData.name" @change="validateBtn" placeholder-class='placeholder' />
              </view>
            </view>
            <view class="item">
              <view class="acea-row row-middle required">
                <text class="item-name">用户姓名</text>
                <input :disabled="merchantData.auditStatus&&parseFloat(merchantData.auditStatus)<3"
                       type="text" placeholder="用户姓名" v-model="merchantData.realName" @change="validateBtn"
                       placeholder-class='placeholder' />
              </view>
            </view>
            <view class="item">
              <view class="acea-row row-middle required">
                <text class="item-name">联系电话</text>
                <input :disabled="merchantData.auditStatus&&parseFloat(merchantData.auditStatus)<3"
                       type="number" class="texts" v-model="merchantData.phone" placeholder="联系电话"
                       style="margin:0;width: 252rpx;" />

              </view>
            </view>
            <view class="item rel"
                  v-if="(isKey&&parseFloat(merchantData.auditStatus)>2) || (!isKey&&!merchantData.auditStatus)">
              <view class="acea-row row-middle required">
                <text class="item-name">验证码</text>
                <input :disabled="merchantData.auditStatus&&parseFloat(merchantData.auditStatus)<3"
                       type="text" placeholder="验证码" v-model="merchantData.captcha" @change="validateBtn"
                       class="codeIput" placeholder-class='placeholder' />
                <button class="code" :disabled="disabled" :class="disabled === true ? 'on' : ''"
                        @click="code">
                  {{ text }}
                </button>
              </view>
            </view>
            <view class="item">
              <view class="uni-list">
                <view class="uni-list-cell">
                  <view class="uni-list-cell-db acea-row row-middle required">
                    <text class="item-name">商户分类</text>
                    <picker
                        :disabled="merchantData.auditStatus&&parseFloat(merchantData.auditStatus)<3"
                        @change="bindPickerChange" :value="merchantCategoryIndex"
                        :range="merchantClassify" range-key="name">
                      <input placeholder="商户分类" type="text" readonly disabled
                             v-model="merchantCategoryName" @change="validateBtn">
                      <view class='iconfont icon-xiangyou'></view>
                    </picker>
                  </view>
                </view>
              </view>
            </view>
            <view class="item">
              <view class="uni-list">
                <view class="uni-list-cell">
                  <view class="uni-list-cell-db acea-row row-middle required">
                    <text class="item-name">商户类型</text>
                    <picker
                        :disabled="merchantData.auditStatus&&parseFloat(merchantData.auditStatus)<3"
                        @change="bindPickerChange1" :value="merchantTypeIndex" :range="merchantType"
                        range-key="name">
                      <input placeholder="商户类型" type="text" readonly disabled
                             v-model="merchantTypeName" @change="validateBtn">
                      <view class='iconfont icon-xiangyou'></view>
                    </picker>
                  </view>
                </view>
              </view>
            </view>
            <view class="item">
              <view class="acea-row row-middle">
                <text class="item-name">关键字</text>
                <input :disabled="merchantData.auditStatus&&parseFloat(merchantData.auditStatus)<3"
                       type="text" maxlength="30" placeholder="关键字" v-model="merchantData.keywords"
                       placeholder-class='placeholder' />
              </view>
            </view>
            <view class="item no-border">
              <text class="acea-row row-middle required item-title">请上传营业执照及行业相关资质证明图片</text>
              <text v-if="merchantTypeInfo" class="item-title">( {{merchantTypeInfo}} )</text>
              <text class="item-desc">(图片最多可上传5张，格式支持JPG、PNG、JPEG)</text>
              <view class="upload">
                <view class='pictrue' v-for="(item,index) in pics" :key="index" :data-index="index"
                      @click="getPhotoClickIdx">
                  <image :src='item'></image>
                  <text
                      v-if="(isKey&&parseFloat(merchantData.auditStatus)>2) || (!isKey&&!merchantData.auditStatus)"
                      class='iconfont icon-guanbi1' @click.stop='DelPic(index)'></text>
                </view>
                <view class='pictrue acea-row row-center-wrapper row-column' @click='uploadpic'
                      v-if="pics.length < 5 && ((isKey&&parseFloat(merchantData.auditStatus)>2) || (!isKey&&!merchantData.auditStatus))">
                  <text class='iconfont icon-icon25201'></text>
                  <view>上传凭证</view>
                </view>
              </view>
            </view>
            <view
                v-if="(isKey&&parseFloat(merchantData.auditStatus)>2) || (!isKey&&!merchantData.auditStatus)"
                class="item no-border acea-row row-center row-middle">
              <checkbox-group @change='ChangeIsAgree' class="acea-row row-middle">
                <checkbox class="checkbox" :checked="isAgree ? true : false" />
                <span class="ml-4">已阅读并同意</span>
              </checkbox-group>
              <button class="settleAgree" @click="showProtocol = true">《入驻协议》</button>
            </view>
            <button
                v-if="(isKey&&parseFloat(merchantData.auditStatus)>2) || (!isKey&&!merchantData.auditStatus)"
                :disabled="merchantData.auditStatus&&parseFloat(merchantData.auditStatus)<3"
                class='submitBtn' :class="successful === true ? 'on':''" @click="formSubmit">提交申请</button>
          </view>
        </view>
      </form>
      <view class="settlementAgreement" v-if="showProtocol">
        <view class="setAgCount">
          <i class="icon iconfont icon-guanbi" @click="showProtocol = false"></i>
          <div class="title">商户入驻协议</div>
          <view class="content">
            <jyf-parser :html="protocol" ref="article" :tag-style="tagStyle"></jyf-parser>
          </view>

        </view>
      </view>
      <view class='loadingicon acea-row row-center-wrapper' v-if="loading">
        <text class='loading iconfont icon-jiazai' :hidden='loading==false'></text>
      </view>
		</view>
		<view class="settledSuccessMain" v-else>
			<view class="settledSuccessful">
				<image class="image" src="../static/images/settledSuccessful.svg" alt="" />
				<view class="title">恭喜，您的资料提交成功！</view>
				<view class="info">预计15个工作日内审核完毕，平台客服会及时与您联系！</view>
				<view class="goHome" hover-class="none" @click="goHome">
					返回首页
				</view>
			</view>
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
	import {
		agreementInfo
	} from '@/api/api.js'
	import {
		toLogin
	} from '@/libs/login.js';
	import {
		getMerSettledApplyApi,
		sendSettledCodeApi,
	} from '@/api/merchant.js';

	import {
		mapGetters
	} from "vuex";
	import parser from "../components/jyf-parser/jyf-parser";
	import sendVerifyCode from "@/mixins/SendVerifyCode";
	import Verify from '../components/verifition/verify.vue';
	import {
		Debounce
	} from '@/utils/validate.js'
	const app = getApp();
	export default {
		components: {
			"jyf-parser": parser,
			Verify
		},
		watch: {
			'merchantData.name': function(val) {
				let pattern = new RegExp('[\u4E00-\u9FA5]+');
				let pattern2 = new RegExp('[A-Za-z]+');
				if (pattern.test(val)) {
					this.isCn = true;
				} else if (pattern2.test(val)) {
					this.isCn = false;
				}
			},
		},
		data() {
			return {
				windowHeight: app.globalData.windowHeight,
				isCn: true,
				text: '获取验证码',
				disabled: false,
				isAgree: false,
				showProtocol: false,
				isShowCode: false,
				loading: false,
				merchantData: {
					name: "",
					realName: "",
					phone: "",
					captcha: '',
					categoryId: 0,
					handlingFee: '',
					keywords: '',
					qualificationPicture: '',
					typeId: 0
				},
				validate: false,
				successful: false,
				codeVal: "",
				protocol: "",
				timer: "",
				merchantCategoryIndex: 0,
				merchantTypeIndex: 0,
				merchantCategoryName: '',
				merchantTypeName: '',
				pics: [],
				tagStyle: {
					img: 'width:100%;display:block;'
				},
				checkType: 'country',
				country: 'China',
				isType: false,
				merchantTypeInfo: '',
				theme: app.globalData.theme,
				merchantBg: '',
				isKey: '',
			};
		},
		mixins: [sendVerifyCode],
		beforeDestroy() {
			clearTimeout(this.timer)
		},
		computed: mapGetters(['globalData','isLogin', 'merchantClassify', 'merchantType', 'merSttledData']),
		mounted() {
			this.$store.dispatch('MerCategoryList');
			this.$store.dispatch('MerTypeList');
			this.merchantBg = `../static/images/${this.theme}.jpg`;
		},

		onShow() {
			if (!this.isLogin) {
				toLogin();
			}
			this.getConfig()
		},
		onLoad(options) {
			let that = this;
			uni.getSystemInfo({
				success: function(res) {
					that.windowHeight = res.windowHeight + 'px'
				},
			});
			if (options.key !== '1') {
				this.$store.commit('MERSTTLEDDATA', {});
				this.isKey = '';
			} else {
				this.isKey = options.key;
			}
			this.merchantData = Object.assign({}, this.merSttledData);
			if (this.merchantData.qualificationPicture) {
				this.pics = this.merchantData.qualificationPicture;
			}
			let idx = this.merchantData.categoryId;
			let index = this.merchantClassify.findIndex(item => item.id == idx);
			this.merchantCategoryIndex = index;
			if (this.merchantClassify[index]) {
				this.merchantCategoryName = this.merchantClassify[index].name;
				this.merchantData.handlingFee = this.merchantClassify[index].handlingFee;
			}
			let idxn = this.merchantData.typeId;
			let indexn = this.merchantType.findIndex(item => item.id == idxn);
			this.merchantTypeIndex = indexn;
			if (this.merchantType[indexn]) {
				this.merchantTypeName = this.merchantType[indexn].name;
				this.merchantTypeInfo = this.merchantType[indexn].info;
			}
		},
		methods: {
			scroll(){
				uni.$emit('scroll');
			},
			moveHandle() {},
			getConfig() {
				// 获取配置
				agreementInfo('merincomminginfo').then(res => {
					if (res.data) {
						this.protocol = JSON.parse(res.data).agreement
					}
				}).catch(err => {
					return this.$util.Tips({
						title: err
					});
				});
			},
			bindPickerChange: function(e) {
				this.index = e.target.value
				let idx = e.target.value
				if (this.merchantClassify[idx]) {
					this.merchantData.categoryId = this.merchantClassify[idx]['id']
					this.merchantCategoryName = this.merchantClassify[idx]['name']
					this.merchantData.handlingFee = this.merchantClassify[idx]['handlingFee']
				}
			},
			bindPickerChange1: function(e) {
				this.merchantTypeIndex = e.target.value
				let idx = e.target.value
				if (this.merchantType[idx]) {
					this.merchantData.typeId = this.merchantType[idx]['id']
					this.merchantTypeName = this.merchantType[idx]['name']
					this.merchantTypeInfo = this.merchantType[idx]['info']
				}
			},
			/*店铺类型说明*/
			getAgreement() {
				this.showProtocol = true;
				this.isType = true

			},
			// 图片预览
			// 获得相册 idx
			getPhotoClickIdx(e) {
				let _this = this;
				let idx = e.currentTarget.dataset.index;
				_this.imgPreview(_this.pics, idx);
			},
			// 图片预览
			imgPreview: function(list, idx) {
				// list：图片 url 数组
				if (list && list.length > 0) {
					uni.previewImage({
						current: list[idx], //  传 Number H5端出现不兼容
						urls: list
					});
				}
			},
			toggleTab(str) {
				this.$refs[str].show();
			},
			// 首页
			goHome() {
				uni.switchTab({
					url: '/pages/index/index'
				});
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
					model: "user",
					pid: 0
				}, function(res) {
					that.pics.push(res);
					that.$set(that, 'pics', that.pics);
				});
			},
			/**
			 * 删除图片
			 *
			 */
			DelPic: function(index) {
				let that = this,
					pic = this.pics[index];
				that.pics.splice(index, 1);
				that.$set(that, 'pics', that.pics);
			},
			//滑块验证成功后
			handlerOnVerSuccess(data) {
				this.$refs.verify.hide();
				this.codeSend();
			},
			codeSend() {
				sendSettledCodeApi({
					phone: this.merchantData.phone
				}).then(res => {
					this.$util.Tips({
						title: res.message
					});
					this.sendCode();
				}).catch(err => {
					return this.$util.Tips({
						title: err
					});
				});
			},
			code: Debounce(function() {
				if (this.disabled) return;
				if (!this.merchantData.phone) return this.$util.Tips({
					title: '请填写手机号'
				});
				this.$refs.verify.show();
			}),
			onConfirm(val) {
				this.region = val.checkArr[0] + '-' + val.checkArr[1] + '-' + val.checkArr[2];
			},
			ChangeIsAgree: function(e) {
				this.isAgree = !this.isAgree;
				this.validateBtn();
			},

			formSubmit: Debounce(function(e) {
				if (this.validateForm() && this.validate) {
					if (this.pics.length == 0) return this.$util.Tips({
						title: "请上传资质图片"
					});
					if (this.pics) {
						this.merchantData.qualificationPicture = JSON.stringify(this.pics)
					}
					this.merchantData.address = this.country + ',' + this.address
					getMerSettledApplyApi(this.merchantData).then(data => {
						this.loading = true;
						this.timer = setTimeout(() => {
							this.successful = true;
						}, 1000)

					}).catch(res => {
						this.$util.Tips({
							title: res
						});
					})

				}
			}),
			validateBtn: function() {
				let that = this,
					value = that.merchantData;
				if (value.name && value.realName && value.categoryId &&
					value.captcha && that.isAgree && value.typeId && value.pics) {
					if (that.codeVal) {
						that.validate = true;
					} else {
						that.validate = false;
					}

				}
			},

			validateForm: function() {
				let that = this,
					value = that.merchantData;

				if (!value.name) return that.$util.Tips({
					title: '请输入商户名称'
				});
				if (!value.realName) return that.$util.Tips({
					title: '请输入姓名'
				});
				if (!value.captcha) return that.$util.Tips({
					title: '请填写验证码'
				});
				if (!value.categoryId) return that.$util.Tips({
					title: '请选择商户分类'
				});
				if (!that.isAgree) return that.$util.Tips({
					title: '请勾选并同意入驻协议'
				});
				that.validate = true;
				return true;
			},
			jumpToList() {
				uni.navigateTo({
					url: "/pages/merchant/application_record/index"
				})
			},

		}
	}
</script>

<style scoped lang="scss">
	::v-deep.uni-scroll-view{
		overflow: hidden auto !important;
	}
	.select_code {
		width: 16px;
		height: 8px;
		display: inline-block;
		margin-left: 16rpx;
	}

	.flag {
		width: 40rpx;
		height: 26rpx;
		display: inline-block;
	}

	.uni-input-placeholder {
		color: #B2B2B2;
	}

	.item-name {
		width: 160rpx;
	}

	.uni-list-cell {
		position: relative;

		.iconfont {
			font-size: 14px;
			color: #7a7a7a;
			position: absolute;
			right: 15px;
			top: 7rpx;
		}

		.icon-guanbi2 {
			right: 35px;
		}
	}

	.merchantsSettled {
		@include main_bg_color(theme);
		height: 140vh;
	}

	.merchantsSettled .merchantBg {
		width: 100%;
		height: 900rpx;

		.bag {
			width: 100%;
			height: 100%;
		}

		.merchantBg-title {
			text-align: center;
			color: #fff;
			font-size: 60rpx;
			font-weight: 600;
			margin-bottom: 20rpx;
		}

		.merchantBg-join {
			text-align: center;
			color: #fff;
			font-size: 36rpx;
		}
	}

	.merchantsSettled .list {
		background-color: #fff;
		border-radius: 12px;
		margin: 0 24rpx;
		position: absolute;
		top: 417rpx;
		width: calc(100% - 24px);
	}

	.application-record {
		position: absolute;
		display: flex;
		align-items: center;
		top: 318rpx;
		right: 0;
		color: #fff;
		font-size: 22rpx;
		background-color: rgba(0, 0, 0, 0.3);
		padding: 8rpx 18rpx;
		border-radius: 20px 0px 0px 20px;
	}

	.merchantsSettled .list .item {
		padding: 40rpx 0 12px;
		border-bottom: 1rpx solid #eee;
		position: relative;
		margin: 0 20rpx;

		&.no-border {
			border-bottom: none;
			padding-left: 0;
			padding-right: 0;
		}

		.item-title {
			color: #666666;
			font-size: 28rpx;
			display: block;
		}

		.item-desc {
			color: #B2B2B2;
			font-size: 22rpx;
			display: block;
			margin-top: 9rpx;
			line-height: 36rpx;
		}
	}

	.acea-row,
	.upload {
		display: -webkit-box;
		display: -moz-box;
		display: -webkit-flex;
		display: -ms-flexbox;
		display: flex;
		-webkit-box-lines: multiple;
		-moz-box-lines: multiple;
		-o-box-lines: multiple;
		-webkit-flex-wrap: wrap;
		-ms-flex-wrap: wrap;
		flex-wrap: wrap;
	}

	.upload {
		margin-top: 20rpx;
	}

	.merchantsSettled .list .item .pictrue {
		width: 130rpx;
		height: 130rpx;
		margin: 24rpx 22rpx 0 0;
		position: relative;
		font-size: 11px;
		color: #bbb;

		&:nth-child(4n) {
			margin-right: 0;
		}

		&:nth-last-child(1) {
			border: 0.5px solid #ddd;
			box-sizing: border-box;
		}

		uni-image,
		image {
			width: 100%;
			height: 100%;
			border-radius: 1px;

			img {
				-webkit-touch-callout: none;
				-webkit-user-select: none;
				-moz-user-select: none;
				display: block;
				position: absolute;
				top: 0;
				left: 0;
				opacity: 0;
				width: 100%;
				height: 100%;
			}
		}

		.icon-guanbi1 {
			font-size: 33rpx;
			position: absolute;
			top: -10px;
			right: -10px;
		}
	}

	.uni-list-cell-db {
		position: relative;
	}

	.wenhao {
		width: 34rpx;
		height: 34rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 28rpx;
		border-radius: 50%;
		background: #E3E3E3;
		color: #ffffff !important;
		margin-left: 4rpx;
		position: absolute;
		left: 122rpx;
	}

	.merchantsSettled .list .item .imageCode {
		position: absolute;
		top: 7px;
		right: 0;
	}

	.merchantsSettled .list .item .icon {
		font-size: 40rpx;
		color: #b4b1b4;
	}

	.merchantsSettled .list .item input {
		width: 470rpx;
		font-size: 30rpx;
	}

	.merchantsSettled .list .item .placeholder {
		color: #b2b2b2;
	}

	.merchantsSettled .default {
		padding: 0 30rpx;
		height: 90rpx;
		background-color: #fff;
		margin-top: 23rpx;
	}

	.merchantsSettled .default checkbox {
		margin-right: 15rpx;
	}

	.merchantsSettled .acea-row uni-image {
		// width: 20px;
		// height: 20px;
		display: block;
	}

	.merchantsSettled .list .item .codeIput {
		width: 125px;
	}

	.uni-input-input {
		display: block;
		height: 100%;
		background: none;
		color: inherit;
		opacity: 1;
		-webkit-text-fill-color: currentcolor;
		font: inherit;
		line-height: inherit;
		letter-spacing: inherit;
		text-align: inherit;
		text-indent: inherit;
		text-transform: inherit;
		text-shadow: inherit;
	}

	.merchantsSettled .list .item .code {
		position: absolute;
		width: 93px;
		line-height: 27px;
		@include coupons_border_color(theme);
		border-radius: 15px;
		@include main_color(theme);
		text-align: center;
		bottom: 8px;
		right: 0;
		font-size: 12px;
	}

	.merchantsSettled .list .item .code.on {
		background-color: #bbb;
		color: #fff;
		border-color: #bbb;
	}

	.merchantsSettled .submitBtn {
		width: 588rpx;
		margin: 25px auto 25px auto;
		height: 86rpx;
		border-radius: 25px;
		text-align: center;
		line-height: 86rpx;
		font-size: 15px;
		color: #fff;
		@include main_bg_color(theme);
	}

	.merchantsSettled .submitBtn.on {
		@include main_bg_color(theme);
	}

	uni-checkbox-group,
	.settleAgree {
		display: inline-block;
		font-size: 24rpx;
	}

	uni-checkbox-group {
		color: #b2b2b2 !important;
	}

	checkbox ::v-deep.uni-checkbox-input.uni-checkbox-input-checked {
		@include coupons_border_color(theme);
		@include main_color(theme);
	}

	.settleAgree {
		@include main_color(theme);
	}

	.merchantsSettled uni-checkbox .uni-checkbox-wrapper {
		width: 30rpx;
		height: 30rpx;
		border: 2rpx solid #C3C3C3;
		border-radius: 15px;
	}

	.settlementAgreement {
		width: 100%;
		height: 100%;
		position: fixed;
		top: 0;
		left: 0;
		background: rgba(0, 0, 0, .5);
		z-index: 10;
	}

	.settlementAgreement .setAgCount {
		background: #fff;
		width: 656rpx;
		height: 458px;
		position: absolute;
		top: 50%;
		left: 50%;
		border-radius: 12rpx;
		-webkit-border-radius: 12rpx;
		padding: 20rpx 52rpx !important;
		-webkit-transform: translate(-50%, -50%);
		-moz-transform: translate(-50%, -50%);
		transform: translate(-50%, -50%);
		overflow-y: scroll;

		.content {
			height: 740rpx !important;
			overflow-y: scroll;

			::v-deep p {
				font-size: 13px;
				line-height: 22px;
			}

			::v-deep img {
				max-width: 100%;
			}
		}
	}

	.settlementAgreement .setAgCount .icon {
		font-size: 24rpx;
		color: #b4b1b4;
		position: absolute;
		top: 40rpx;
		right: 15rpx;

	}

	.settlementAgreement .setAgCount .title {
		color: #333;
		font-size: 32rpx;
		text-align: center;
		font-weight: bold;
	}

	.settlementAgreement .setAgCount .content {
		margin-top: 32rpx;
		color: #333;
		font-size: 26rpx;
		line-height: 22px;
		text-align: justify;
		text-justify: distribute-all-lines;
		height: 756rpx;
		overflow-y: scroll;
	}

	.settledSuccessMain {
		height: 100vh;
		display: flex;
		flex-direction: column;
		background: #fff;
	}

	.settledSuccessful {
		flex: 1;
		width: 100%;
		padding: 0 56px;
		height: auto;
		background: #fff;
		text-align: center;
	}

	.settledSuccessful .image {
		width: 189px;
		height: 157px;
		margin-top: 66px;
	}

	.settledSuccessful .title {
		color: #333333;
		font-size: 16px;
		font-weight: bold;
		margin-top: 35px;
	}

	.settledSuccessful .info {
		color: #A0A0A0;
		font-size: 13px;
		margin-top: 12px;
	}

	.settledSuccessful .goHome {
		margin: 60px auto 0;
		line-height: 43px;
		color: #282828;
		font-size: 15px;
		border: 1px solid #B4B4B4;
		border-radius: 60px;
	}

	::v-deep uni-checkbox .uni-checkbox-input {
		width: 15px;
		height: 15px;
		margin-right: 10rpx;
		position: relative;
	}

	::v-deep uni-checkbox .uni-checkbox-input.uni-checkbox-input-checked:before {
		font-size: 14px;
	}

	.loadingicon {
		height: 100vh;
		overflow: hidden;
		position: absolute;
		top: 0;
		left: 0;
	}

	.icon-xiangyou {
		font-size: 22rpx;
	}

	// #ifdef MP
	checkbox-group {
		display: inline-block;
	}

	// #endif
	.setAgCount {
		::v-deep table {
			border: 1rpx solid #DDD;
			border-bottom: none;
			border-right: none;
		}

		::v-deep td,
		th {
			padding: 5rpx 10rpx;
			border-bottom: 1rpx solid #DDD;
			border-right: 1rpx solid #DDD;
		}
	}

	.required::before {
		content: '* ';
		color: red;
		margin-right: 4rpx;
	}

	::v-deep.uni-input-input {
		width: 85%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap
	}
</style>