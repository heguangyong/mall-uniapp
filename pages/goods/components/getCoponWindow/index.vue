<template>
	<view>
		<view class='coupon-list-window' :class='coupon.coupon==true?"on":""'>
			<text class="iconfont icon-guanbi5" @click="close"></text>
			<view class="_tit text-center">领取优惠券</view>
			<view class='coupon-list borderPad' :style="{'margin-top':!orderShow?'0':'0'}">
				
				<block v-if="coupon.list.length">
					<view class='item acea-row row-center-wrapper' v-for="(item,index) in coupon.list"
						@click="getCouponUser(index,item.id)" :key='index'>
						<view class='money acea-row row-column row-center-wrapper main_bg'>
							<view>￥<text class='num'>{{item.money?Number(item.money):''}}</text></view>
							<view class="pic-num">满{{item.minPrice}}元可用</view>
						</view>
						<view class='text'>
							<view class='acea-row condition'>
								<span v-if='item.merId===0' class='line-title select'>平台</span>
								<span v-else class='line-title select'>店铺</span>
								<span class="line2">{{item.name}}</span>
							</view>
							<view class='data acea-row row-between-wrapper'>
								<view class="width">
									<view v-if="item.isFixedTime" class="_end">
										{{ $util.getTime(item.useStartTimeStr) + ' - ' + $util.getTime(item.useEndTimeStr) + ' 可用' }}
									</view>
									<view v-else class="_end">{{ '领取后' + item.day + '天内可用' }}</view>
								</view>
								<view class='bnt main_bg' v-if="!item.isUse">{{coupon.statusTile || '立即领取'}}</view>
							</view>
							<span v-if="item.isUse" class="iconfont icon-yilingqu1 font-color"></span>
						</view>
					</view>
				</block>
				<!-- 无优惠券 -->
				<view class='pictrue' v-else>
					<image :src="urlDomain+'crmebimage/presets/noCoupon.png'"></image>
					<view class="default_txt">暂无优惠券哦~</view>
				</view>
			</view>

		</view>
		<view class='mask' catchtouchmove="true" :hidden='coupon.coupon==false' @click='close'></view>
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
		setCouponReceive
	} from '@/api/api.js';
	export default {
		props: {
			//打开状态 0=领取优惠券,1=使用优惠券
			openType: {
				type: Number,
				default: 0,
			},
			coupon: {
				type: Object,
				default: function() {
					return {};
				}
			},
			//下单页面使用优惠券组件不展示tab切换页
			orderShow: {
				type: String,
				default: function() {
					return '';
				}
			},
			typeNum: {
				type: Number,
				default: 0
			}
		},
		data() {
			return {
				type: 1,
				urlDomain: this.$Cache.get("imgHost")
			};
		},
		watch: {
			'coupon.type': function(val) { //监听props中的属性
				this.type = val;
			}
		},
		methods: {
			close: function() {
				this.type = this.typeNum;
				this.$emit('ChangCouponsClone');
			},
			getCouponUser: function(index, id) {
				let that = this;
				let list = that.coupon.list;
				if (list[index].isUse == true && this.openType == 0) return true;
				switch (this.openType) {
					case 0:
						//领取优惠券
						let ids = [];
						ids.push(id);
						setCouponReceive(id).then(res => {
							that.$emit('ChangCouponsUseState', index);
							that.$util.Tips({
								title: "领取成功"
							}, function(res) {
								return that.$util.Tips({
									title: res
								});
							});
							that.$emit('ChangCoupons', list[index]);
						})
						break;
					case 1:
						that.$emit('ChangCoupons', index);
						break;
				}
			},
			setType: function(type) {
				this.$emit('tabCouponType', type);
				this.type = type;
			}
		}
	}
</script>

<style scoped lang="scss">

	.icon-yilingqu1 {
		position: absolute;
		opacity: 0.1;
		font-size: 160rpx;
		top: 50rpx;
		right: -20rpx;
	}

	._tit {
		font-size: 32rpx;
		font-weight: 600;
		color: #282828;
		margin-bottom: 43rpx;
	}

	.icon-guanbi5 {
		position: absolute;
		font-size: 28rpx;
		color: #aaa;
		top: 30rpx;
		right: 30rpx;
		z-index: 1;
	}


	.coupon-list-window {
		padding-top: 46rpx;
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		background-color: #f5f5f5;
		border-radius: 16rpx 16rpx 0 0;
		z-index: 555;
		transform: translate3d(0, 100%, 0);
		transition: all .3s cubic-bezier(.25, .5, .5, .9);
	}

	.coupon-list-window.on {
		transform: translate3d(0, 0, 0);
	}

	.coupon-list-window .title {
		height: 124rpx;
		width: 100%;
		text-align: center;
		line-height: 124rpx;
		font-size: 32rpx;
		font-weight: bold;
		position: relative;
	}

	.coupon-list-window .title .iconfont {
		position: absolute;
		right: 30rpx;
		top: 50%;
		transform: translateY(-50%);
		font-size: 35rpx;
		color: #8a8a8a;
		font-weight: normal;
	}

	.coupon-list-window .coupon-list {
		margin: 0 0 30rpx 0;
		height: 823rpx;
		overflow: auto;

		.text {
			position: relative;
			overflow: hidden;
		}
	}

	.coupon-list-window .pictrue {
		width: 414rpx;
		height: 336rpx;
		margin: 208rpx auto;
	}

	.coupon-list-window .pictrue image {
		width: 100%;
		height: 100%;
	}

	.pic-num {
		color: #fff;
		font-size: 24rpx;
	}

	.line-title.gray {
		border-color: #BBB;
		color: #bbb;
		background-color: #F5F5F5;
	}

	.nav {
		width: 100%;
		height: 96rpx;
		border-bottom: 2rpx solid #F5F5F5;
		border-top-left-radius: 16rpx;
		border-top-right-radius: 16rpx;
		background-color: #FFFFFF;
		font-size: 30rpx;
		color: #999999;
	}

	.nav .acea-row {
		border-top: 5rpx solid transparent;
		border-bottom: 5rpx solid transparent;
	}

	.nav .acea-row.on {
		@include tab_border_bottom(theme);
		color: #282828;
	}

	.nav .acea-row:only-child {
		border-bottom-color: transparent;
	}


	.coupon-list .item {
		margin-bottom: 20rpx;
		box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.06);
	}

	.coupon-list .item .money {
		font-weight: normal;
	}

	.select {
		@include main_color(theme);
		@include coupons_border_color(theme);
	}

	.default_txt {
		font-size: 26rpx;
		color: #999;
		text-align: center;
	}
</style>