<template>
	<!-- svip会员模块 -->
	<view class="vipBox" @touchstart="touchStart">
		<view class="vipPaid pt-40">
			<!-- #ifdef MP -->
			<nav-bar ref="navBarRef" navTitle="SVIP会员" :iconColor="iconColor" :isBackgroundColor="false"
				:backgroundColor="backgroundColor"></nav-bar>
			<!-- #endif -->
			<view class="headerBg" :style="{'background-image': `url(${urlDomain}crmebimage/presets/svipbg.png)`}">
			</view>
			<!-- 会员信息 -->
			<view class="card-section" :style="[svipInfo.isPaidMember?paidMemberSize:noMemberSize]">
				<view v-if="svipInfo.isPaidMember" class="avatar-wrap">
					<view class="acea-row mb-28">
						<image class="avatar" :src="svipInfo.avatar"></image>
						<view class="text">
							<view class="name line1">{{svipInfo.nickname}}</view>
							<view class="tips">{{svipInfo.phone}}</view>
						</view>
					</view>
					<view class="acea-row row-middle tips" @click="goToRecord">
						<view v-if="svipInfo.isPermanentPaidMember">永久SVIP会员</view>
						<view v-else>SVIP会员至{{svipInfo.paidMemberExpirationTime}}</view>
						<text class="f-s-20 iconfont icon-gengduo3 ml-8"></text>
					</view>
				</view>
			</view>
			<!-- 会员权益 -->
			<view class="benefits-section" :class="!svipInfo.isPaidMember?'bgColor':''">
				<view class="acea-row row-between mb-36" @click="goToBenefits(0)">
					<view class="title">会员尊享权益</view>
					<view class="acea-row row-middle">
						<view class="f-s-24 text mr10">权益介绍</view>
						<text class="text f-s-20 iconfont icon-gengduo3"></text>
					</view>
				</view>
				<view class="section-bd acea-row row-between-wrapper">
					<view v-for="(item,index) in svipInfo.benefitsList" :key="item.id" class="item"
						@click="goToBenefits(index)">
						<view class="image-wrap acea-row row-center row-middle">
							<view class="image-wrap-inner acea-row row-center-wrapper">
								<image class="image" :src="item.imageUrl"></image>
							</view>
						</view>
						<view class="text">
							<view class="name f-s-24 lh-34rpx">{{item.value}}</view>
							<view class="f-s-20 lh-28rpx">{{item.message}}</view>
						</view>
					</view>
				</view>
			</view>

			<view class="other-section pt-20">
				<!-- 会员卡 -->
				<view
					v-if="svipInfo && svipInfo.cardList && svipInfo.cardList.length>0 && !svipInfo.isPermanentPaidMember"
					class="type-section" id="card">
					<view class="type-section-inner">
						<view class="title acea-row row-between-wrapper">
							<view class="">开通SVIP</view>
						</view>
						<scroll-view class="scroll" scroll-x="true">
							<view v-for="item in svipInfo.cardList" :key="item.id" class="item"
								:class="{on: item.id === svip.id}" @click="checkType(item)">
								<view v-show="item.label" class="badge">{{item.label}}</view>
								<view class="name">{{item.name}}</view>
								<view class="new">￥<text class="num semiBold">{{item.price | moneyFormat}}</text></view>
								<view class="old">￥{{item.originalPrice | moneyFormat}}</view>
							</view>
						</scroll-view>
					</view>
				</view>
				<!-- 推荐商品 -->
				<view v-if="recommendList.length">
					<view class="flex-center recommend-box mt-20">
						<image :src="`${urlDomain}crmebimage/presets/haowuzuo.png`"></image>
						<view class="f-s-32 lh-44rpx ml-4">会员专享好物</view>
						<image class="ml-6" :src="`${urlDomain}crmebimage/presets/haowuyou.png`"></image>
					</view>
					<recommend style="margin-top: -6rpx;" ref="recommendIndex" :isShowTitle="false" :isDefault="false"
						:recommendList="recommendList">
					</recommend>
					<view class="footer-placeholder"></view>
				</view>
				<!-- 购买按钮 -->
				<view v-if="!svipInfo.isPermanentPaidMember" class="footer">
					<view class="protocol acea-row row-middle mb-20" :class="svip.giftBalance==0?'row-center':''">
						<view class="checkbox acea-row row-middle" @click="isAgree=!isAgree">
							<text v-if="!isAgree" class="iconfont icon-weixuanzhong"></text>
							<text v-else class="iconfont icon-xuanzhong1"></text>
						</view>
						<text class="f-s-24 text-999 ml-8">开通前请确认<text @click="userAgree"
								class="protocol_text f-s-24">《会员服务协议》</text></text>
					</view>
					<view v-show="svip.giftBalance!=0" class="isFirstChargeGive f-s-24"
						:style="{'background-image': `url(${urlDomain}crmebimage/presets/juxing.png)`}">
						{{svip.isFirstChargeGive?'首次开通':'现在购买'}}立送{{svip.giftBalance}}元余额
					</view>
					<view class="acea-row">
						<view class="text acea-row row-middle">
							<view><text class="symbol">¥ </text> <text class="number semiBold ml-4">
									{{ svip.price }}</text><text
									class="original regular">原价¥{{ parseFloat(svip.originalPrice) }}</text></view>
						</view>
						<view class="buy acea-row row-center-wrapper" @tap="subOrder">立即开通</view>
					</view>
				</view>
				<!-- <view v-show="!svipInfo.isPermanentPaidMember" class="footer-placeholder"></view> -->
			</view>
		</view>
		<!-- 评论 -->
		<uni-popup type="center" animation ref="activate" :mask-click="false">
			<view class="w-600 h-344 bg--w111-fff rd-14rpx acea-row row-column activate-box">
				<span class="iconfont icon-guanbi5 absolute" @click="onClose"></span>
				<view class="f-s-32 text--w111-333 lh-44rpx mb-24 text-center">确认开通</view>
				<view class="text--w111-666 mb-40">我已阅读并同意<text @click="userAgree"
						class="protocol_text f-s-24">《会员服务协议》</text>，确认开通该套餐。</view>
				<view class="btn" @click="sureOrder">继续开通</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import recommend from "@/components/base/recommend.vue";
	import navBar from '@/components/navBar';
	import orderPay from "@/mixins/OrderPay.js";
	import {
		Debounce
	} from '@/utils/validate.js'
	import {
		svipInfoApi,
		svipBenefitsListApi
	} from '@/api/activity.js';
	import {
		productMemberApi
	} from '@/api/product.js';
	import {
		goToAgreement
	} from "@/libs/order";
	export default {
		mixins: [orderPay],
		components: {
			// #ifdef MP
			navBar,
			// #endif
			recommend
		},
		computed: {
			paidMemberSize() {
				return {
					backgroundImage: `url(${this.$Cache.get("imgHost")}crmebimage/presets/huiyuanbj2.png)`,
					width: '710rpx',
					height: '642rpx',
					backgroundSize: '710rpx 642rpx',
					marginLeft: '20rpx'
				}
			},
			noMemberSize() {
				return {
					backgroundImage: `url(${this.$Cache.get("imgHost")}crmebimage/presets/huiyuanbj.png)`,
					width: '662rpx',
					height: '329rpx',
					backgroundSize: '662rpx 329rpx',
					marginLeft: '36rpx',
				}
			}
		},
		data() {
			return {
				urlDomain: this.$Cache.get("imgHost"),
				userInfo: {},
				// #ifdef MP
				iconColor: '#FFFFFF',
				isScrolling: false,
				// #endif
				benefitsList: [], //会员权益
				svipInfo: {}, //会员信息
				svip: {},
				goodScroll: false,
				params: { //精品推荐分页
					page: 1,
					limit: 10,
				},
				loading: false,
				recommendList: [],
				totalPrice: 0,
				isAgree: false,
				backgroundColor: '',
			}
		},
		onLoad() {
			this.getProductMember()
			this.getSvipInfo();
			this.getSvipBenefitsList();
		},
		onPageScroll(e) {
			uni.$emit('scroll');
			// #ifdef MP
			if (e.scrollTop > 50) {
				this.backgroundColor = '#fff';
				this.iconColor = '#333333'
			} else if (e.scrollTop < 50) {
				this.backgroundColor = '';
				this.iconColor = '#fff'
			}
			// #endif
		},
		methods: {
      //滚动
      touchStart() {
        this.$refs.navBarRef.currentPage = false;
      },
			//关闭弹窗
			onClose() {
				this.$refs.activate.close();
			},
			//记录跳转
			goToRecord() {
				uni.navigateTo({
					url: `/pages/activity/vip_order_record/index`
				});
			},
			//确认开通
			sureOrder() {
				this.isAgree = true;
				this.$refs.activate.close();
				this.handlerOpen();
			},
			//协议跳转
			userAgree() {
				goToAgreement('paid/member/agreement/info')
			},
			//权益跳转
			goToBenefits(currentIndex) {
				uni.navigateTo({
					url: `/pages/activity/vip_paid_benefits/index?currentIndex=${currentIndex}`
				});
			},
			//会员专享好物
			getProductMember() {
				uni.hideLoading();
				if (this.goodScroll) return;
				this.loading = true
				productMemberApi(
					this.params
				).then((res) => {
					this.$set(this.params, 'page', this.params.page + 1);
					this.goodScroll = this.params.page > res.data.totalPage;
					this.recommendList = this.recommendList.concat(res.data.list || []);
					this.loading = false
				}).catch(err => {
					this.loading = false
				});
			},
			//会员信息
			getSvipInfo() {
				uni.hideLoading();
				svipInfoApi().then(res => {
					this.svipInfo = res.data;
					this.svip = this.svipInfo.cardList[0];
				}).catch(err => {
					uni.showToast({
						title: err,
						icon: 'none'
					});
				});
			},
			//会员权益
			getSvipBenefitsList() {
				uni.hideLoading();
				svipBenefitsListApi().then(res => {
					this.benefitsList = res.data;
				}).catch(err => {
					uni.showToast({
						title: err,
						icon: 'none'
					});
				});
			},
			//点击会员卡
			checkType(svip) {
				this.svip = svip;
			},
			//立即开通
			subOrder: Debounce(function(e) {
				if (!this.isAgree) return this.$refs.activate.open()
				this.handlerOpen();
			}),
			handlerOpen() {
				uni.showLoading({
					title: '正在提交中'
				});
				setTimeout(() => {
					uni.navigateTo({
						url: `/pages/goods/order_payment/index?orderNo=${this.svip.id}&payPrice=${this.svip.price}&fromType=svip`
					});
					uni.hideLoading();
				}, 1000)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.icon-guanbi5 {
		top: 30rpx;
		right: 30rpx;
		color: #AAAAAA;
	}

	/deep/.list .texts {
		background-color: #fff;
		border-radius: 0 0 14rpx 14rpx;
	}

	.recommend-box {
		image {
			width: 42rpx;
			height: 36rpx;
		}

		view {
			font-weight: 600;
		}
	}

	.vipBox {
		padding-bottom: 172px;
	}

	.activate-box {
		padding: 40rpx;

		.btn {
			width: 520rpx;
			height: 72rpx;
			background: #E93323;
			border-radius: 43rpx 43rpx 43rpx 43rpx;
			font-family: PingFang SC, PingFang SC;
			font-weight: 400;
			font-size: 32rpx;
			color: #FFFFFF;
			line-height: 72rpx;
			text-align: center;
		}
	}

	/deep/uni-checkbox .uni-checkbox-wrapper {
		vertical-align: inherit !important;
	}

	.protocol_text {
		color: #D88D0E;
	}

	.isFirstChargeGive {
		height: 66rpx;
		line-height: 66rpx;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		position: absolute;
		right: 20rpx;
		top: 34rpx;
		z-index: 9;
		color: #fff;
		padding: 0 30rpx 0 20rpx;
	}

	.checkbox {
		text-align: center;
		font-size: 24rpx;
		font-weight: 400;

		span {
			margin-left: 5rpx;
		}

		.icon-xuanzhong1 {
			color: #E93323;
			font-style: normal;
		}

		.iconfont {
			font-size: 36rpx;
		}
	}


	.vipPaid {
		background: linear-gradient(180deg, #141414 0%, #000000 100%);
		height: 900rpx;
	}

	.headerBg {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 820rpx;
		background-position: right top;
		background-repeat: no-repeat;
		background-size: 566rpx 334rpx;
	}

	.paidMemberSize {
		width: 710rpx;
		height: 642rpx;
		background-size: 710rpx 642rpx;
	}

	.noMemberSize {
		width: 662rpx;
		height: 329rpx;
		background-size: 662rpx 329rpx;
	}

	.card-section {
		position: absolute;
		border-bottom-right-radius: 48rpx;
		z-index: 9;
		background-position: 0% 0%;
		background-repeat: no-repeat;

		.vip-paid {
			position: absolute;
			top: 40rpx;
			right: 52rpx;
			width: 228rpx;
			height: 328rpx;
		}

		.expect {
			padding: 32rpx 0 58rpx 36rpx;

			.image {
				display: block;
				width: 414rpx;
				height: 76rpx;
			}

			.mark {
				display: inline-flex;
				align-items: center;
				height: 48rpx;
				padding: 0 24rpx;
				border-radius: 24rpx;
				margin-top: 12rpx;
				background: linear-gradient(-270deg, #E7B667 0%, #FFEAB5 100%);
				font-size: 28rpx;
				line-height: 48rpx;
				color: #7E4B06;

				.number {
					margin: 0 8rpx;
					font-size: 36rpx;
				}
			}
		}

		.avatar-wrap {
			min-height: 236rpx;
			padding: 62rpx 0 0 40rpx;

			.text {
				flex: 1;
				font-size: 22rpx;
				line-height: 30rpx;
				color: #89735B;

				.shopName {
					max-width: 164rpx;
				}

				.name {
					display: inline-block;
					vertical-align: middle;
					font-weight: 500;
					font-size: 32rpx;
					line-height: 44rpx;
					background: linear-gradient(-270deg, #FACB7A 0%, #FFF3D5 100%);
					-webkit-background-clip: text;
					-webkit-text-fill-color: transparent;
				}
			}
		}

		.avatar {
			width: 88rpx;
			height: 88rpx;
			border-radius: 50%;
			margin-right: 20rpx;
		}

		.tips {
			margin-top: 6rpx;
			font-size: 22rpx;
			line-height: 30rpx;
			color: rgba(254, 227, 174, 0.8);
		}

		.info {
			margin-top: 74rpx;
			font-size: 24rpx;
			color: #AE5A2A;
		}

		.num {
			font-size: 36rpx;
		}

		.btn {
			width: 146rpx;
			height: 44rpx;
			border-radius: 22rpx;
			background-color: #FFFFFF;
			line-height: 44rpx;
			text-align: center;
		}
	}

	.bgColor {
		background-color: #1B1B1B;
	}

	.benefits-section {
		padding: 32rpx;
		width: 710rpx;
		height: 400rpx;
		border-radius: 24rpx;
		margin: 234rpx 20rpx 0 20rpx;
		position: relative;
		z-index: 97;

		.title {
			font-family: PingFang SC, PingFang SC;
			font-weight: 500;
			font-size: 30rpx;
			color: rgba(250, 204, 125, 0.8);
			line-height: 44rpx;
		}

		.text {
			color: rgba(255, 255, 255, 0.6);
		}

		.section-hd {
			padding: 32rpx 32rpx 36rpx;
			font-weight: 500;
			font-size: 30rpx;
			line-height: 44rpx;
			color: rgba(250, 204, 125, 0.8);

			.arrow {
				font-weight: 400;
				font-size: 24rpx;
				line-height: 34rpx;
				color: rgba(255, 255, 255, 0.6);
			}

			.iconfont {
				font-size: 24rpx;
			}
		}

		.section-bd {
			padding: 0 0 32rpx;

			.item {
				flex: 1;
				min-width: 0;
			}

			.image-wrap {
				position: relative;
				border-radius: 50%;
				margin: 0 auto;
				width: 88rpx;
				height: 88rpx;
				background: linear-gradient(180deg, rgba(255, 255, 255, 0.1) 2%, rgba(255, 255, 255, 0) 100%);
				border: 1rpx solid;

				.image-wrap-inner {
					width: 42rpx;
					height: 37rpx;
				}
			}

			.image-inner {
				height: 100%;
				border-radius: 50%;
			}

			.image {
				width: 100%;
				height: 100%;
			}

			.text {
				margin-top: 28rpx;
				text-align: center;
				color: rgba(255, 255, 255, 0.4);
			}

			.name {
				margin-bottom: 8rpx;
				color: rgba(255, 255, 255, 0.7);
			}
		}
	}

	.other-section {
		position: relative;
		border-top-left-radius: 48rpx;
		border-top-right-radius: 48rpx;
		background-color: #F5F5F5;
		margin-top: -68rpx;
		z-index: 98;
	}

	.type-section {
		padding: 0 20rpx 22rpx 20rpx;

		.type-section-inner {
			border-radius: 24rpx;
			background-color: #FFFFFF;
			padding-bottom: 32rpx;
		}

		.title {
			padding: 32rpx 32rpx 26rpx;
			border-radius: 24rpx 24rpx 0 0;
			background: linear-gradient(180deg, #FFEFCE 0%, #FFFFFF 100%);
			font-weight: bold;
			font-size: 32rpx;
			line-height: 44rpx;
			color: #333333;

			.bold {
				display: inline-block;
				margin-right: 14rpx;
				font-weight: bold;
				font-size: 32rpx;
				line-height: 45rpx;
				color: #333333;

				+view {
					display: inline-block;
				}
			}

			.time {
				margin-left: 14rpx;
				font-size: 24rpx;
				color: #AE5A2A;
			}

			.cash {
				font-weight: 400;
				font-size: 26rpx;
				line-height: 36rpx;
				color: rgba(217, 126, 29, 0.8);
			}
		}

		.scroll {
			white-space: nowrap;
		}

		.item {
			position: relative;
			display: inline-block;
			min-width: 220rpx;
			padding: 60rpx 6rpx;
			border: 1rpx solid #DDDDDD;
			border-radius: 24rpx;
			margin: 16rpx 24rpx 0 0;

			&:first-child {
				margin: 16rpx 24rpx 0 32rpx;
			}

			&:last-child {
				margin: 16rpx 32rpx 0 0;
			}

			&.on {
				border: 2rpx solid #D97E1D;
				background: linear-gradient(180deg, #FFFFFF 0%, #FEF5E6 100%);
			}

			.badge {
				position: absolute;
				top: 0;
				left: -2rpx;
				height: 44rpx;
				padding: 0 12rpx;
				border-radius: 22rpx 22rpx 22rpx 0;
				margin-top: -18rpx;
				background: linear-gradient(90deg, #FF7931 0%, #E93323 100%);
				font-size: 24rpx;
				line-height: 44rpx;
				color: #FFFFFF;
			}

			.name {
				text-align: center;
				font-weight: 500;
				font-size: 28rpx;
				line-height: 40rpx;
				color: #7E4B06;
			}

			.button {
				width: 142rpx;
				height: 52rpx;
				border-radius: 22rpx;
				margin: 18rpx auto 0;
				background-color: #FEE8BC;
				text-align: center;
				font-size: 22rpx;
				line-height: 52rpx;
				color: #333333;
			}
		}

		.new {
			margin-top: 28rpx;
			text-align: center;
			font-family: SemiBold;
			font-size: 36rpx;
			line-height: 62rpx;
			color: #333333;

			.num {
				font-size: 52rpx;
			}
		}

		.old {
			margin-top: 8rpx;
			text-decoration: line-through;
			text-align: center;
			font-size: 24rpx;
			line-height: 34rpx;
			color: #999999;
		}

		.info {
			margin-top: 4rpx;
			text-align: center;
			font-size: 24rpx;
			line-height: 34rpx;
			color: #999999;
		}

		.agree {
			font-size: 22rpx;
			text-align: center;
			color: #797979;

			.link {
				display: inline-block;
			}

			.mark {
				color: #AE5A2A;
			}
		}
	}

	.footer-placeholder {
		height: 208rpx;
		height: calc(208rpx + constant(safe-area-inset-bottom));
		height: calc(208rpx + env(safe-area-inset-bottom));
	}

	.footer {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		padding: 22rpx 20rpx;
		padding-bottom: calc(22rpx + constant(safe-area-inset-bottom));
		padding-bottom: calc(22rpx + env(safe-area-inset-bottom));
		background-color: #FFFFFF;
		z-index: 9;

		.text {
			flex: 1;
			height: 108rpx;
			padding-left: 48rpx;
			border-radius: 54rpx 0 0 54rpx;
			background-color: #222222;
			font-size: 28rpx;
			color: #FACC7D;
		}

		.symbol {
			font-weight: 600;
			font-size: 32rpx;
		}

		.number {
			font-size: 48rpx;
		}

		.original {
			margin-left: 16rpx;
			text-decoration: line-through;
			font-size: 24rpx;
			color: rgba(255, 255, 255, 0.4);
		}

		.buy {
			position: relative;
			width: 266rpx;
			height: 108rpx;
			border-radius: 0 54rpx 54rpx 0;
			background: linear-gradient(to right, #FFDD9C, #EEA82F);
			font-weight: 500;
			font-size: 32rpx;
			color: #7E4B06;

			&::before {
				content: "";
				position: absolute;
				top: 0;
				left: 0;
				border-width: 54rpx 20rpx;
				border-style: solid;
				border-color: #222222 transparent transparent #222222;
			}
		}
	}

	.coupon-section {
		border-radius: 24rpx;
		margin: 0 20rpx;
		background-color: #FFFFFF;

		.section-hd {
			padding: 32rpx 32rpx 24rpx;
			font-weight: bold;
			font-size: 32rpx;
			line-height: 44rpx;
			color: #333333;

			.link {
				font-weight: 400;
				font-size: 26rpx;
				line-height: 36rpx;
				color: #666666;

				.iconfont {
					font-size: 24rpx;
				}
			}
		}

		.section-bd {
			padding-bottom: 24rpx;
			white-space: nowrap;

			.item {
				position: relative;
				display: inline-block;
				width: 151rpx;
				padding: 0 6rpx;
				border-radius: 24rpx;
				margin: 20rpx 14rpx 0 0;
				background-color: #E0A558;

				&:first-child {
					margin-left: 32rpx;
				}

				.inner {
					padding-bottom: 76rpx;
					border: 2rpx solid #FFEDCA;
					border-radius: 12rpx;
					margin-top: -20rpx;
					background-color: #FFFFFF;

					.type {
						width: 96rpx;
						height: 38rpx;
						border-radius: 0 0 12rpx 12rpx;
						background-color: rgba(224, 165, 88, 0.2);
						margin: 0 auto;
						text-align: center;
						font-size: 20rpx;
						line-height: 38rpx;
						color: #333333;
					}
				}

				&.gray {
					background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAWgAAACUCAMAAACJHEMxAAAAeFBMVEUAAAC/v7/f39/V1dXf39/c3Nzh4eHc3Nze3t7a2tre3t7f39/e3t7d3d3e3t7d3d3f39/e3t7e3t7e3t7d3d3e3t7e3t7d3d3d3d3e3t7d3d3e3t7f39/h4eHi4uLn5+fo6Ojp6enq6urs7Ozu7u7v7+/w8PDx8fEswD7yAAAAG3RSTlMABAgMECQrLC8we4+Tl6uvr7/Dz9PT5+vz9/vtB+63AAADZElEQVR42u3Zy3baMBSFYbmmsaFuIRcKxdixi5He/w0LGJtLljrA1mby7xFZyehbyjkS25hD0uzjT06CZP2RpabNt59wBM0mi47O0RsUofN6lM5wCJ/MmOkGBsH0SDjQqiO9BEGRd5NEcTJbIREuv2dJHCXtDW+yuPlVUTfWkYdim6q4wfw1Mde5lq5QHmZdXWEuzG0ml+mxc7Yut/zLP5Zt+de63WVuTO6gzaz7Ve32BV5DUuxdf6Zn985m2v2VszgPlba9YfIFOu4PdIXU0NSuPn+KvdCN40APTukaL3Q3OqzDaXic9Y6Obhk6oMeAdr5l2F/vgB4VenV/vZvnQIeAzue353meAx0GOp+fz3Qaxen1l0pAjwydr2ZpHKXmf39CxoBuAzTQQBOggQZ6etcZAj029KkznH7pDIEeGdrXGQI9LvSCL5Uk0P7OEOhRof2dIdCjQvs7Q6BHhY6BfhY0o0M0OliGmmXI9S4MNJ2h6sFCZ6h6gtMZiqDpDFXQbYAGGmgCNNBA0xmGhqYz1EDTGWqg6Qw10HSGImg6QxE0naEIms7wadCMDtHoYBlqliHXuzDQdIaqBwudoeoJTmcogqYzVEG3ARpooAnQQANNZxgams5QA01nqIGmM9RA0xmKoOkMRdB0hiJoOsOnQTM6RKODZahZhlzvwkDTGaoeLHSGqic4naEIms5QBd0GaKCBJkADDTSdYWhoOkMNNJ2hBprOUANNZyiCpjMUQdMZiqDpDJ8GzegQjQ6WoWYZcr0LA01nqHqw0BmqnuB0hiJoOkMVdBuggQaaAA000HSGoaHpDDXQdIYaaDpDDTSdoQiazlAETWcogqYzfBo0o0M0OliGmmXI9S4MNJ2h6sFCZ6h6gtMZiqDpDFXQbYAGGmgCNNBA0xmGhqYz1EDTGWqg6Qw10HSGImh/Z2iBHgPanj/4O8PGlTgNTema8yd/Z1i7CqihqXpEf2dYOFsgNSyFdYV3dHTL8HCk90gPc967Ovctw8nlcbhz9rPc4vVYtuWndbv+R39neJww1pEBsddbztsZns5+3WD9qHJT3U7erjN8uesMydg5dYYvZomEIu8mA0GRzEw3KITP5nCf5khLDrQx0RsOofMaHe8dEWc68NzIou57jmy5xiNM1ssf34/G/wD2nqj2ECBXfgAAAABJRU5ErkJggg==");

					.btn {
						color: #9F9F9F;
					}

					.money {
						color: #fff;

						.num {
							color: #fff;
						}
					}

					.name {
						color: #fff;
					}

					.text {
						color: #9F9F9F;
					}

					.mark {
						color: #A8A8A8;
					}
				}

				.btn {
					width: 52rpx;
					padding-right: 14rpx;
					padding-left: 14rpx;
					white-space: pre-wrap;
					font-size: 24rpx;
					color: #5D3324;
				}

				.text {
					position: absolute;
					bottom: 0;
					left: 0;
					width: 100%;
					height: 76rpx;
					padding-top: 30rpx;
					background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJgAAABMCAYAAACRbX4YAAAAAXNSR0IArs4c6QAAFNBJREFUeF7tXW2MFdd5fs7sB7sswUvAGNdkWTB4FxvbRFATtVQibnBbKb9cWUntEFuxHMW1+quyFFVqpLbpj1Tt70pRpH5IUVVVqpBK7FZ2bKImktsY4bo2mGXZxbCFxWycdczC7t47c6r3nPOer5m5H8sFlmWQ13Nn7pwzZ855zvM+7ztzzyvklTPnIcVbEOJtSLyFa1ePiY0PXUH1r+qBNntAvvlmNz4/tBs9yR7I7AsA9gp5ZUKG9cg6IN4D8DogXsfVqz+rANdmT98hp8vJyT5swD5AfgnAAQjsBdDn334BwHK9Mw/gpwD+Hd04Ivq2nbpD+q+6zYIekPMTI6jjywA0qCJAxUVaAVhc5iwgDgPJEVzOfia2biUAVv9WaA/IXx4fRO/a30SGL0OI3wUw3M6tLgVgrn4pr0CIoxA4jHr2E3HX9vF2Ll6du/x6QOmox7Y9CpkegCRQyf2A6F5qS68PYLmryimt3ZKjqM3/RKzbeXapDavK3ZweUIDaN7wHGQEJBKr9EBjs1NU7DLBcs84C8qgCXSr/q2K4Tg3b0utRwvyeZA+ybD8gD0DK/RBizdJrbFzyRgMsclDljA6HUFgEbyFbPCbWjszcqJu70+tV7LR32wiSbD8yuRdCUuhg9HpMXrt9Kr79R78vh4e3YfPmIQwNDWHHjh3o6ws8zXbrbO98KcchxFuAeBvABxXo2us+Ptsyk0xHAexGht1FYYOl1d5aqcXFRUxMTmLizAROj49jYmIS4qXnfkemaYZaPUWtlqKeAVuHt2J0dBS7HtqJB3eOoLe3t7UrdOosKWdULC4BxePeQU3+D2QyLtZtne3UJW7XehSQ7pYjgNwFKUbVVojd7Xp3nbj/NE0xdmoMJ06ewPvvn8DY6dNYWKghky60Kl567glZr2dYrNFfisVaXW1rtQxplmHVqlV4ZNeD2PfYHuzdsxub7tnYibYtrQ4CnhDkOHwAKcYhcBYSZ7FYPyPW7yAHY0X8kx9NbsIabEGWbYdMtkPI7ZAYhpDDgNh8K2/y0qVLeP+99/Duu+/i/RMncOXKHLJM6j+ptwQvaUAmXnr2CVlLNbgWFlMsLtK2rhitnlKBDKoEJIQQGBq6D194bC9+fe9u7Hpw9OazW3nvzkOCQDYDIc9CJrNIlFc7DSmmADmNmvgEwOzNZkKlhXYPk5AeRG+yHjLbACE3Qwq9zbAJwGYItaW/m6hRGsP16txVjI2dUoCiv+mL0yAIyQwWUAwstZXSgEsA9N8fEsAUg2mAEbgWFupYrGcgCkxTKsAAAyAEEtokAgP9fdi1aycefeQhPPrwQ3hgx/3o6uq6lROs9WvrGN4MJChQPAOBK5ByHkJcAURdVSRlXe+rHf1Zei68RB8EgyHrg9oXtB2EwBpADurPN85La/2GWzuTADV+ZhwfnDyJU6dO4cz4OOr1VIGGcKC3hqWYtQxzZZJAl0FKoThJ5AC2kGLeAiwFmc6UKM/QniomhC4IIKGt2tfHVq/ux8O7RrHrwZ14RAFu23JiuNZ6+A47a3Z2FmNjYwZQY5g6f14RC5MKA4sOWNOngKSBpkGlt1JmZqs7UeHCMtiiBtf8gmGxWoq0nqGeEiJ15aoQbw24iM0UFfK+t+1f3Y+RHfdj5+gDit12bN+Ge26lhrvDwBPf7uJiDZOTEzj34TlMTE7gzOlxXLhwIQAOaycGGAOLTlIo0P9ZRvPNogabUVQBgxmBP08gWyCQGaGvGCwzDKZIzwJMI9T80XHDahpsZl8dE0gSB8DBu9Zi5+gOjI5o0G3fvg13rV17hw9952+fwHTu3IeYnJhUYKKQAYEpM+ykgWTkj5FADlRGFDCtGHbRpzGTOXPpsxjVmVkS8hiM9RcxGAFsgUIWSocR7XnCjcS+oT/uFgKXBZz3nQUgAc4CksHntndvWI+tW4awZXgzhoeGsGXL57D5vvvQ379stG7nEdChGglIFy9ewNT5KfzfhQuYmppSny9fvmxMnUaHAhQDxXh4DBhzgt6okfLCDJq3/ENaixGQWJcB2ov0vEfSYYKIRZnIWqYARQL/mgEYiX4CmDKRpMGk9iJV2wSzmT7mm06mOM1ohvECpjM6Lgc4w3xsuwVUSITA9rnN9+HX7t2EjRvvttvbxpnoAJBIE12+PIOZmctqOz09jQsXLmJq6jwufzSDNEstsygTxgDieBSbNwsUAzozlKH80YBiKRQ032LUCH4CltVfRpOZAiHA6pn1IC3AFlNQ+IJ0GHsOZAepzfbigvDO9BXqs1ivMcMp2AWMZ/aNiVXmtYDtdHk6V4OaWO/eezcpwG1Y/1ms37BebdcNDuIzaz+jtrcDCAk8n376KT7++GO1nZ39RH0mBpqevmQ/kyWxJo1NmwEMa6PAsDFqvKCnBYs1eT5TeajiMeaB9hHnmUhmLMVk1DrDYpoxfQYrAhgzmAEYVUJDH4t9pbmsrbTkZlmNwVRkTgOwGVBZIPG+YUJ9HV/bacDxxRPzmc03bdd9dlABbd26QQwODqK/rw8DawbQ37cKAwMD6pHYwMBqsx3AwOrVxtYDPd096O3tUftJ0hWY67m5OTtWtVoN9Ef/CATz8/OYuzqH+fkFXJ2bw9zVq+oYuf/zC3r7KwLULz7G7Cezap9ApgfF2SLnxZmBt4DR51ho+B+IYYyF0xsHIH/Cayvkj5UZWzPGjgy8a5tBZvNIVSutZWJfCmylACsykaUM5iCmrulxqfUwveMB+Ph0W1BbfAYVo5K/FjQLyBx7ZthnPxUysUA0n03v2DqY+UybdHnnrKh930EJ3RgLuCKTERyLZ7sBix5o1jX+SVrXMDkEesjC14lq/5CHxgh9QUF7n2z09NU90Ck02u61liV3LQ+MNwRgLPIdgzlg+K2KO9zf9wecb8CCJaBBxqwxv97g54Dhd46Zkgo6RYBhE+xdy/d8/U4N2mUb688ld2eW04PZ5myKHVTDLmqfP8cAs+MfmS7TBl2rr5EYuDwP9LcxnN0thN8E1sW3RDzpDRzVeeaWbhLA7MT2ZnheGvo30Ar4LLcU3WwBUzqseKAyTEXxOT1MRrd52s/vcI0LIzoMIwZgi5AXM1lAXKbdridMGIDqtQfDftJjZ0ChyFqwrbTRcB7cIhYtbCv3n3cpWzbXj+bAsgVY0cB7zNKwA7wv2Rt1g89CwXMeDHg8UnFId5bUo/3QBORmsqCnETSg2tLQRgWOCxodEJQ3ww2GQeZcW1dXmXlgEt2A0T4MbFVEa0tVMp6n0X1FeHe7RedFoMnp4UjfFE0e1ZzlwGDR2HuD7PrAN5N5vjOz1wddAMCoHnPBwAybC7hOMRxmJ2k4G/xZnWOHQhY1KAi0ZNhgH2OxqSoCqe23qENce1xD8gAIKSpmqUK2XSkMpjouusOyDsh3vGEej6qKzINfLvg+Bodv+hhszlfJx3xKzAWzVdFkYi83x67MVIbh6PIMPL+PgoliKtHwcWezvrTXaLF/y88vmXAeQ99+DOaNTm6GeYj0AyIxUINBzM3IYs82AIVlNF2TA2oE7AKWLK+nfLAaMqVv87yB9cKLgRddaiL9247ur3F/uZOLGO/WA6xogLmj2p5hYYFGlF/KXoUAZuD4UeL4yWrrjJtnhJhxYy+SSoThlhzTlbJmAxPZdv+GaA6eLC9bkd+QkeIb8qdo/nFEXuh75csGoAzguePxTG0ez2N6K5rZeXPpzmLwF5Zr0N7y6xQwaxsSpGIwy3itM1ho2jxT5/VmNOSeKSw4fykDFlFsI8Ztr71++yoGs1SU11S3lsFiuDYFwHWZnPBVpih2HGm9ZhMi+j5+oWCpEiQQkDxslQYrB3BhhzkzXDFYNMFzEyi018tT5C9jDVYxWIEFaapNXRk69Y71ItvTNJ5ILhPZlQbLxQOXB8AqBrM2OWDMJXi9lRfpvQ/WlEGWxAiVF+kbNcu7TocHNq/VJyXWsa40WAnADJqvL67keXk3ZMAqL3LJLxzm3wfz3OiOapqKwSoG83qg83GlisHyAHNa47rjjFUcrGKwisEqBrM9EIrsSoNVGqxR5H9JXq/1z9yjoEZhm5afPPiPiqpnkdWzSAOvKg7mlg1o/stu72drlRcZPXzOPWz2nhRUDKZ6p3MAqyL5VSSffnx7PT+8rRisYrBb/rvISL9qVdL2+1VVHOx2i4PpRejc6oe8dFPnTGQVybc/t2gaeF6BXiSvcmiBZmZI5wBWabA7RoPpXzGY/5tlD/zlm3iVnWKRXzcLz3kL0NHiwLR8U6XB7mwN5r/+bdceM6sBsXm0S2nyKkG8yqW/yjSvbuivcEgL0Km1z6PlmwK279jbCZUGW44aTOtps/SKWW+M1wajXb0AMK9waBbAywFMLQKcX6NVA0wX4jccg/h1pcFWvgZTCAsBRnuOvQzADNj0b0DjVabNOvnX5utqtWlKyEAm0jFY+JP3isFiL3kFP4vU67MojBGwVCIGb7Vpp8PMwsCsSpMkFS9+/YlammXdBCjHYCkWanWdToaW0TQM5tO3BVjFYCuWwTjU5K/LyysC6+XKNdB4lWk2k4yTJBEL4luHDl7KpNxIuYpoEWC7yrRiML0QsMs/E0KsqVtexcGCDlPdUTYhGy64Ej2KYoZot38Lr+8EdPy+mQ8wJ4/CZczdOq16WTObCIsywghxUbz49YP/mUnsV6lkTKYPJfIpbxGZSAaYCablRGjFYCuYwdzK4m5dPAcwq8HYZKp1W926HEmCN8WLhw7+QALPL9Z1riKfwdRS5saLLPIkKwYLp9tKe5vCOnNu0cUg24cfolDazDKYpuOuRPyteOGZL73Q3SW+T2yldBjnK1JCn/JI6mwfGmDR2laNKL+Tj4rKwiAtmxzPxHSUcQN/2lm/626vH3e79e+D6fABM5PJS2SSLjColFdJGDE6QCfhSL4hvvbUge1rV/eeVhnXCGA1L1+RAhhlXMuQUdY1u9R2FHis4mB2qTjLaSvgd5GxU8cLo3PWtVh/KdFvplmiEhpgq4LGtw4dPJlJOUpeo8q2ZhJjEYNZM2nS+un18r1/HWWEkkDrdTNCxWAs2EuNesGECAHmUsqEMTBP9BuAEXslAu/96I13HlY9/82v/fafJiL5c2IxlVKGEmKp3JE6QSnpMMViJq1ftL5/9UarGokVEgfjpdXtXHemkS2Y3rq3KHRChijLmhDf/tEbx7+nqnnuqQOb+vt7ztVT2cOJSa0nSemVOeBqWEw9j2K/tWKwFeNFMnG416x4kT4HHl9zcS5JjolxggKKf8l0YfiVoyemLTy++czBvxdCPsti35pJk7+bQEbplfmxkcIYexeVBrv9GczG1rSO0kPqpXXw80Sqx0Quam8TuSkzq9I3/uDIj4+/EPhgTz/5+Ja1a7rG6qnsVXm7a5RaWZtJEvr8ZoXKgGtT6xqQceMiVdixFw4rDWaMcNjB7fdvVD7IPRVmwOKMIsb6aRPo54o0ILMJuniMkmReCDFy5PVj5yInn7TYwb8UwJ8QoEiL6QTx+nNNxcSk02IRyPIeR/VGaxwZNx6872i6brsFkfwgyMLmKG60p6047kWgylRe7jDdlklE+xdHfnz8O2EAx+wdOHCgb2Rz9zuZxAhpMdZj+rMJWdRlEBfj94NuKMAqBusIg8WDrrOLOHPojyFnbVMMpqSYH8F3mdzUV5yULBEn055fff7VV8cXCgFGB5996ot7Vq3q+mmayj5iLcVk5o/CGMpUqgfgnCzeT8sbZxnQl8nN5OiAeyLghRO8u2135scXjWu9ftMSaoJc/dFNx2GdQmaL79cbocg/bbyYcYP4W9yPPqB8n81JewMk+/aqAZrHatKAKxHiWirEvldeP/a/cb058nn+q48f6upK/qGWZoJARuxFIFOfDcDIXGY23bKH8ka5dSJY54FXxcHyg1MeyS9aaDg0e8UT3JBOkdEJjvk5K4nRrJhXWowTkKnEoxJCPvNvrx3/p7jSeIzt99/4yhdf7u7u+itiLA0yDS4W/Dqft7Rvuzr77FDOoQyXHs/N/BhKDVkqZsEWouTBjRrvpnBmdcgD1lndwu51zNwmk4cE2X6mD58N4zYVhJdiULhMzE5jxU9xtJUgcAnZBbx8+LVjf1OE2FKA0ckEsq7u5Hu1OjGZAZcxk85UeubS8zTCixnSbZQfyNi1loDmtbqZ+dH9sARmDExUAXCCNkT1twk0c+uFa6S65JftSI1y5vIZziaI05ygw2Cm7T7I1Ncqx6XLnKSeNSZCJgIvH/6PYnB51ZWz5XNfffxQdyK+X0+zvjqBK9WMRgymcnqrPx3VVZnnDY/66YH9zK6qsaUM5EamCPnNtJjfeS0zGLNFm6DI65lIiZUwY+n6+T7rRCNTqNkaTLJgBXx1XpjKLSaxOPWy1WA2mbxJTMg3rdMgXoPE84dfeztnFgstRTnEtPDv7hE/zDKMKGCZFxEtixnRzwCT5g1YfqTQqO7QjMRy1pUspNp2zZsZuLK6yq7eMBmXB4ZCIEQ338yMxn2VB3IBk0Wo5XZwWZuju9FAmO/0UxotuPjNCFuMf8gBnJSZePrwaz9/p1mVDU2kX5hCGFs3ie8A4o+zNOul55MENrX1vEryLvndMQ7IMsUGuYRjiolnsL9f0MpGgMsNUhk7MXs1AYHrYP2piGeXzK4lbQhZoIyuvLYUTDbFVGVMWoAM33u0rGduTE0MgQWRib/+xcJH3z169Ox8M3BFRNzK6QBF/Hu7sz+DwNNpKnvYRHLowppK81M3zvHMNt09KC/ISFYC99zhFjvNMlKrAGthupUyUEH3hexc3r9FLMVnF4YoGoxccAst3I97yqhXxPGz9lqLKMSilPIfM9S++6+vHP+wNaTEk7GdUgCefPK37h3oSl4QUvyBhBzJMim0V6l/qKueVUUgi7WYpgOTIb3J9Zt1XEt92YSpml3DDXpJY8uJJuCpltratC7XhjIT3uaQhqcr2SVOSJn9UGbZ3/3LKz+fXkp9Ld1rs4q/8nu/cX93X8/jQsh9GeSIzOQDANZJiR4/S32jqH/RNVplgLhs/qZaH60ld0iLrNq8rfE4F0Sqmw1IPBM87z1XVHn+qEshfykgTkkpP5Ay+29Zq73xz68eO9PqpcrO+39v98vKpNhVDwAAAABJRU5ErkJggg==");
					background-repeat: no-repeat;
					background-size: 100% 100%;
				}

				.name {
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
					font-weight: bold;
					font-size: 28rpx;
					line-height: 40rpx;
					color: #5D3324;
				}

				.mark {
					text-align: center;
					font-weight: 500;
					font-size: 22rpx;
					line-height: 30rpx;
					color: rgba(250, 204, 125, 0.8);
				}

				.money {
					margin-top: 16rpx;
					text-align: center;
					font-weight: 500;
					font-size: 28rpx;
					line-height: 44rpx;
					color: #E0A558;
				}

				.num {
					font-family: SemiBold;
					font-size: 44rpx;
				}
			}
		}
	}

	.recommend /deep/ .fw-500 {
		font-weight: bold;
	}
</style>