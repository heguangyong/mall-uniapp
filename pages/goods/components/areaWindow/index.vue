<template>
	<view :data-theme="theme" @touchmove.stop.prevent="disabledScroll">
		<view class="address-window" :class="display==true?'on':''">
			<view class='title'>请选择所在地区<text class='iconfont icon-guanbi' @tap='close'></text></view>
			<view class="address-count">
				<view class="address-selected">
					<view v-for="(item,index) in selectedArr" :key="index" class="selected-list"
						:class="{active:index === selectedIndex}" @click="change(item, index)">
						{{item.regionName?item.regionName:'请选择'}}
						<text class="iconfont icon-xiangyou"></text>
					</view>
					<view class="selected-list" :class="{active:-1 === selectedIndex}" v-if="showMore"
						@click="change(-1, -1)">
						<text class="iconfont icon-xiangyou"></text>
						请选择
					</view>
				</view>
				<scroll-view scroll-y="true" :scroll-top="scrollTop" class="address-list" @scroll="scroll">
					<view v-for="(item,index) in addressList" :key="index" class="list"
						:class="{active:item.regionId === activeId}" @click="selected(item, index)">
						<text class="item-name">{{item.regionName}}</text>
						<text v-if="item.regionId === activeId" class="iconfont icon-duihao2"></text>
					</view>
				</scroll-view>
			</view>
		</view>
		<view class='mask' catchtouchmove="true" @touchmove.prevent  :hidden='display==false'
			@tap='close'></view>
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
		getCity
	} from '@/api/api.js';
	const CACHE_ADDRESS = {};
	let app = getApp();
	export default {
		props: {
			display: {
				type: Boolean,
				default: true
			},
			cityShow: {
				type: Number,
				default: 3
			},
			address: {
				type: Array,
				default: []
			}
		},
		data() {
			return {
				theme: app.globalData.theme,
				active: 0,
				//地址列表
				addressList: [],
				selectedArr: [],
				selectedIndex: -1,
				is_loading: false,
				old: {
					scrollTop: 0
				},
				scrollTop: 0,
				addressData: [],
				province: [],
				city: [],
				district: [],
				street: []
			};
		},
		computed: {
			activeId() {
				return this.selectedIndex == -1 ? 0 : this.selectedArr[this.selectedIndex].regionId
			},
			showMore() {
				return this.selectedArr.length ? (this.selectedArr[this.selectedArr.length - 1].isChild && ((this
						.cityShow == 1 && this.addressList.regionType < 2) ||
					(this.cityShow == 2 && this.addressList.regionType < 3) || (this.cityShow == 3 && this
						.addressList
						.regionType < 4))) : true
			}
		},
		watch: {
			address(n) {
				this.selectedArr = n ? [...n] : []
			},
			display(n) {
				if (!n) {
					this.addressList = [];
					this.selectedArr = this.address ? [...this.address] : [];
					this.selectedIndex = -1;
					this.is_loading = false;
				} else {
					this.loadAddress(1, 1)
				}
			}
		},
		mounted() {
			this.loadAddress(1, 1);
		},
		methods: {
			disabledScroll() {
				return
			},
			loadAddress(parentId, regionType) {
				if (CACHE_ADDRESS[parentId]) {
					this.addressList = CACHE_ADDRESS[parentId];
					return;
				}
				let data = {
					parentId: parentId,
					regionType: regionType
				}
				this.is_loading = true;
				getCity(data).then(res => {
					this.is_loading = false;
					CACHE_ADDRESS[parentId] = res.data;
					this.addressList = res.data;
				})
				this.goTop()
			},
			change(item, index) {
				if (this.selectedIndex == index) return;
				this.selectedIndex = index;
				this.loadAddress(item.parentId, item.regionType);
			},
			selected(item, index) {
				if (this.is_loading) return;
				if (this.selectedIndex > -1) {
					this.selectedArr.splice(this.selectedIndex + 1, 999)
					this.selectedArr[this.selectedIndex] = item;
					this.selectedIndex = -1;
				} else if (item.regionType === 1) {
					this.selectedArr = [item];
				} else {
					this.selectedArr.push(item);
				}
				if (item.isChild && ((this.cityShow == 1 && this.addressList[0].regionType < 2) || (this.cityShow == 2 &&
						this
						.addressList[0].regionType < 3) || (this.cityShow == 3 && this.addressList[0].regionType < 4))) {
					this.loadAddress(item.regionId, item.regionType + 1);
				} else {
					this.$emit('submit', [...this.selectedArr]);
					this.$emit('changeClose');
				}
				this.goTop()
			},
			close: function() {
				this.$emit('changeClose');
			},
			scroll: function(e) {
				this.old.scrollTop = e.detail.scrollTop
			},
			goTop: function(e) {
				this.scrollTop = this.old.scrollTop
				this.$nextTick(() => {
					this.scrollTop = 0
				});
			}
		}
	}
</script>

<style scoped lang="scss">
	.address-window {
		background-color: #fff;
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		z-index: 101;
		border-radius: 30rpx 30rpx 0 0;
		transform: translate3d(0, 100%, 0);
		transition: all .3s cubic-bezier(.25, .5, .5, .9);
	}

	.address-window.on {
		transform: translate3d(0, 0, 0);
	}

	.address-window .title {
		font-size: 32rpx;
		font-weight: bold;
		text-align: center;
		height: 123rpx;
		line-height: 123rpx;
		position: relative;
	}

	.address-window .title .iconfont {
		position: absolute;
		right: 30rpx;
		color: #8a8a8a;
		font-size: 35rpx;
	}

	.address-count {
		.address-selected {
			padding: 0 30rpx;
			margin-top: 10rpx;
			position: relative;
			padding-bottom: 20rpx;
			border-bottom: 2rpx solid #f7f7f7;
		}

		.selected-list {
			font-size: 26rpx;
			color: #282828;
			line-height: 50rpx;
			padding-bottom: 10rpx;
			padding-left: 60rpx;
			position: relative;

			&.active {
				color: #e28d54;
			}

			&:before,
			&:after {
				content: '';
				display: block;
				position: absolute;
			}

			&:before {
				width: 4rpx;
				height: 100%;
				@include main_bg_color(theme);
				top: 0;
				left: 10rpx;
			}

			&:after {
				width: 12rpx;
				height: 12rpx;
				@include main_bg_color(theme);
				border-radius: 100%;
				left: 6rpx;
				top: 50%;
				margin-top: -8rpx;
			}

			&:first-child,
			&:last-child {
				&:before {
					height: 50%;
				}
			}

			&:first-child {
				&:before {
					top: auto;
					bottom: 0;
				}
			}

			.iconfont {
				font-size: 20rpx;
				float: right;
				color: #dddddd;
			}
		}

		scroll-view {
			height: 700rpx;
		}

		.address-list {
			padding: 0 30rpx;
			margin-top: 20rpx;
			box-sizing: border-box;

			.list {
				.iconfont {
					float: right;
					color: #ddd;
					font-size: 22rpx;
				}

				.item-name {
					display: inline-block;
					line-height: 50rpx;
					margin-bottom: 20rpx;
					font-size: 26rpx;
				}

				&.active {
					color: #e28d54;

					.iconfont {
						color: #e28d54;
					}
				}
			}
		}
	}
</style>