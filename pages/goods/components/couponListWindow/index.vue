<template>
	<view>
		<view class='coupon-list-window' :class='coupon.coupon==true?"on":""'>
			<text class="iconfont icon-guanbi5" @click="close"></text>
			<view class="_tit text-center">选择优惠券</view>
			<view class='coupon-list' :style="{'margin-top':!orderShow?'0':'0'}">
				<view v-if="couponList.length">
					<view style="padding-bottom: 70rpx;">
						<view class='item acea-row row-center-wrapper' @click="getCouponUser(index,item)" v-for="(item,index) in couponList"
							:key='index'>
							<view class='money acea-row row-column row-center-wrapper' :class='!item.isChoose&&!item.isChecked?"moneyGray":"main_bg"'>
								<view>￥<text class='num'>{{item.money?Number(item.money):''}}</text></view>
								<view class="pic-num">满{{item.minPrice}}元可用</view>
							</view>
							<view class='text'>
								<view class='acea-row condition'>
									<span class='line-title select'
										:class='!item.isChoose?"gray":"select"'>{{item.category | couponTypeFilter}}</span>
									<span class="line2">{{item.name}}</span>
						
								</view>
								<view class='data acea-row row-between-wrapper'>
									<view v-if="coupon.statusTile">{{$util.getCouponTime(item.startTime,item.endTime)}}</view>
				                    <view>
										<view v-if="!item.isChecked && item.isChoose" class="iconfont icon-weixuanzhong"></view>
										<view v-if="item.isChecked && item.isChoose" class='iconfont icon-xuanzhong1 font-color'></view>
										<view v-if="!item.isChoose && !item.isChecked" class="noCheck"></view>
									</view>
								</view>
							</view>
						</view>
					</view>
					<view class="foot-box">
						<view v-if="Number(couponMoney)>0" class="left">
							可优惠<text class="font-color">￥{{couponMoney}}</text>
						</view>
						<view v-else class="left"></view>
						<view @click="onSure" class="btn bg-color">确定</view>
					</view>
				</view>
				<!-- 无优惠券 -->
				<view class='pictrue' v-if="!couponList.length">
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
			},
			//平台优惠券可使用的门槛
			surplusFee: {
				type: Number,
				default: 0
			}
		},
		data() {
			return {
				type: 1,
				current: 0,
				urlDomain: this.$Cache.get("imgHost"),
				couponList: [],
				couponMoney: 0,
				couponObj: {}, //修改过的数据
			};
		},
		watch: {
			coupon:{
				handler(nVal,oVal){
					this.couponList = JSON.parse(JSON.stringify(nVal.list));
					this.couponList.map(i=>{
						if(i.isChecked){
							this.couponMoney =i.money
						}else{
							this.couponMoney = 0
						}
					});
				},
				immediate: true,
				deep:true
			}
		},
		mounted() {
			
		},
		methods: {
			close: function() {
				this.type = this.typeNum;
				this.$emit('ChangCouponsClone');
			},
			//确定选择优惠券
			onSure() {
				this.$emit('ChangCoupons', this.couponObj);
			},
			//选择优惠券
			getCouponUser: function(index, item) {
				if(!item.isChecked && !item.isChoose) return;
				this.couponList.map(i=>{
					if(!item.isChecked)i.isChecked = false
					
				});
				item.isChecked = !item.isChecked;
				this.couponMoney = item.isChecked ? item.money : 0;
				this.couponObj = item;
			},
			setType: function(type) {
				this.$emit('tabCouponType', type);
				this.type = type;
			}
		}
	}
</script>

<style scoped lang="scss">
	.noCheck {
		width: 32rpx;
		height: 32rpx;
		border-radius: 50%;
		overflow: hidden;
		border: 1px solid #999999;
		background-color: #eee;
	}
	.foot-box {
		width: 100%;
		height: 100rpx;
		background: #FFFFFF;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 30rpx;
		position: absolute;
		bottom: 0;

		.btn {
			width: 200rpx;
			height: 70rpx;
			line-height: 70rpx;
			text-align: center;
			border-radius: 35rpx;
			color: #fff;
			font-size: 30rpx;
		}

		.left {
			text {
				color: var(--view-priceColor);
			}
		}
	}

	/deep/.uni-radio-input-checked {
		@include main_bg_color(theme);
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

	.width {
		width: 252rpx;
	}

	.coupon-list {
		padding-left: 0 !important;
		padding-right: 0 !important;
	}

	.coupon-list-window {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		background-color: #f5f5f5;
		border-radius: 16rpx 16rpx 0 0;
		z-index: 9999;
		transform: translate3d(0, 100%, 0);
		transition: all .3s cubic-bezier(.25, .5, .5, .9);
		padding-top: 43rpx;
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

	.line-title {
		width: 90rpx;
		padding: 0 10rpx;
		box-sizing: border-box;
		background: #fff;
		border: 1px solid rgba(232, 51, 35, 1);
		opacity: 1;
		border-radius: 20rpx;
		font-size: 20rpx;
		color: #E83323;
		margin-right: 12rpx;
	}

	.line-title.gray {
		border-color: #BBB;
		color: #bbb;
		background-color: #F5F5F5;
	}

	.nav {
		// position: absolute;
		// top: 0;
		// left: 0;
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

	.occupy {
		height: 106rpx;
	}

	.coupon-list .item {
		margin-bottom: 20rpx;
		box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.06);

		.data {
			padding-top: 20rpx;
		}
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