<template>
	<view class="containers" :data-theme="theme">
		<view class="header">
			<view class="title">
				<text :class="isActive == 0 ? 'on' : ''" @click="tabs(0)">已购</text>
				<text :class="isActive == 1 ? 'on' : ''" @click="tabs(1)">收藏</text>
				<text :class="isActive == 2 ? 'on' : ''" @click="tabs(2)">浏览</text>
			</view>
			<text class="iconfont icon-guanbi5" @click="close"></text>
		</view>
		<view class="main borderPad">
			<scroll-view scroll-y="true" class="scroll" @scrolltolower="onScrolltolower" @touchmove.stop>
				<view v-if="isActive == 0">
					<view v-if="bought.length" id="goods">
						<view class="picTxt acea-row" v-for="(item, index) in bought" :key="index"
							@click.stop="goodsCheck(item,index,bought)">
							<view class="checkbox">
								<text v-if="item.check" class="iconfont icon-xuanzhong1"></text>
								<text v-else :class="{'disabled':disabled}" class="iconfont icon-weixuanzhong"></text>
							</view>
							<view class='pictrue'>
								<image :src='item.image'></image>
							</view>
							<view class='text'>
								<view class='line2 name'>{{item.name}}</view>
								<view class='money'>￥<text>{{item.price}}</text></view>
							</view>
						</view>
					</view>
					<view v-if="bought.length===0 && !loadingb" class="empty">
						<image :src="urlDomain+'crmebimage/presets/noShopper.png'"></image>
						<text>暂无商品哦~</text>
					</view>
				</view>
				<view v-if="isActive == 1">
					<view v-if="collect.length" id="collect">
						<view class="picTxt acea-row" v-for="(item, index) in collect" :key="index"
							@click.stop="goodsCheck(item,index,collect)">
							<view class="checkbox">
								<text v-if="item.check" class="iconfont icon-xuanzhong1"></text>
								<text v-else :class="{'disabled':disabled}" class="iconfont icon-weixuanzhong"></text>
							</view>
							<view class='pictrue'>
								<image :src='item.image'></image>
							</view>
							<view class='text'>
								<view class='line2 name'>{{item.name}}</view>
								<view class='money'>￥<text>{{item.price}}</text></view>
							</view>
						</view>
					</view>
					<view v-if="collect.length===0 && !loadingc" class="empty">
						<image :src="urlDomain+'crmebimage/presets/noShopper.png'"></image>
						<text>暂无商品哦~</text>
					</view>
				</view>
				<view v-if="isActive == 2">
					<view v-if="browse.length" id="browse">
						<view class="picTxt acea-row" v-for="(item, index) in browse" :key="index"
							@click.stop="goodsCheck(item,index,browse)">
							<view class="checkbox">
								<text v-if="item.check" class="iconfont icon-xuanzhong1"></text>
								<text v-else :class="{'disabled':disabled}" class="iconfont icon-weixuanzhong"></text>
							</view>
							<view class='pictrue'>
								<image :src='item.image'></image>
							</view>
							<view class='text'>
								<view class='line2 name'>{{item.name}}</view>
								<view class='money'>￥<text>{{item.price}}</text></view>
							</view>
						</view>
					</view>
					<view v-if="browse.length===0 && !loadings" class="empty">
						<image :src="urlDomain+'crmebimage/presets/noShopper.png'"></image>
						<text>暂无商品哦~</text>
					</view>
				</view>
				<view class="acea-row row-center-wrapper loadingicon">
					<text :hidden="!loadingb || !loadingc || !loadings"
						class="iconfont icon-jiazai loading"></text>{{(isActive == 0 &&bought.length>0) || (isActive == 1 &&collect.length>0) || (isActive == 2 &&browse.length>0) ?loadTitle:''}}
				</view>
			</scroll-view>
			<view class="foot_bar">
				<button class="confirm_btn" @click="submit">确定({{checkedArr.length}}/5)</button>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		purchasedApi,
		getCollectUserList,
		proBrowseApi
	} from "@/api/product";
	import {
		browseRecordApi
	} from "@/api/user";

	import {
		mapGetters
	} from "vuex";
	let app = getApp();
	export default {
		props: {
			checkedObj: {
				type: Array,
				default: []
			}
		},
		data() {
			return {
				urlDomain: this.$Cache.get("imgHost"),
				loadTitle: '加载更多',
				theme: app.globalData.theme,
				isActive: 0,
				loadedb: false,
				loadingb: false,
				loadedc: false,
				loadingc: false,
				loadeds: false,
				loadings: false,
				whereb: {
					page: 1,
					limit: 10,
				},
				wherec: {
					page: 1,
					limit: 10,
				},
				wheres: {
					page: 1,
					limit: 10,
				},
				searchVal: "",
				checked: [],
				list: [],
				collect: [],
				bought: [],
				browse: [],
				checkedArr: this.checkedObj,
				disabled: false
			};
		},
		watch: {
			checkedObj: {
				handler(n) {
					this.checkedArr = n
				},
				deep: true
			}
		},
		mounted() {
			this.checkedArr = this.checkedObj
			this.getBounht();
			this.getCollect();
			this.getBrowse();
		},
		methods: {
			onScrolltolower() {
				if (this.isActive == 0) {
					this.getBounht();
				} else if (this.isActive == 1) {
					this.getCollect();
				} else {
					this.getBrowse();
				}

			},
			// 点击关闭按钮
			close() {
				this.$emit('close');
			},
			tabs(index) {
				this.isActive = index
				this.searchVal = ''
				this.searchBut()
			},
			searchBut() {
				this.loadingb = this.loadingc = this.loadings = this.loadedb = this.loadedc = this.loadeds = false
				this.whereb.page = this.wherec.page = this.wheres.page = 1
				this.bought = this.collect = this.browse = []
				this.isActive == 0 ? this.getBounht() : this.isActive == 1 ? this.getCollect() : this.getBrowse()
			},
			//已购
			getBounht() {
				var that = this;
				if (that.loadingb || that.loadedb) return;
				that.loadingb = true;
				purchasedApi(that.whereb).then(
					res => {
						that.loadedb = res.data.list.length < that.whereb.limit;
						that.bought.push.apply(that.bought, res.data.list);
						that.whereb.page = that.whereb.page + 1;
						that.loadTitle = that.loadedb ? '没有了' : '加载更多';
						that.getInitchecked(that.bought);
						that.loadingb = false;
					},
					error => {
						that.$util.Tips({
							title: error
						})
					}
				);
			},
			//收藏
			getCollect() {
				var that = this;
				if (that.loadingc || that.loadedc) return;
				that.loadingc = true;
				getCollectUserList(that.wherec).then(
					res => {
						that.loadedc = res.data.list.length < that.wherec.limit;
						that.collect.push.apply(that.collect, res.data.list);
						that.wherec.page = that.wherec.page + 1;
						that.loadTitle = that.loadedc ? '没有了' : '加载更多';
						that.getInitchecked(that.collect);
						that.loadingc = false;
					},
					error => {
						that.$util.Tips({
							title: error
						})
					}
				);
			},
			//足迹
			getBrowse() {
				var that = this;
				if (that.loadings || that.loadeds) return;
				that.loadings = true;
				proBrowseApi(that.wheres).then(
					res => {
						that.loadeds = res.data.list.length < that.wheres.limit;
						that.browse.push.apply(that.browse, res.data.list);
						that.wheres.page = that.wheres.page + 1;
						that.loadTitle = that.loadeds ? '没有了' : '加载更多';
						that.getInitchecked(that.browse);
						that.loadings = false;
					},
					error => {
						that.$util.Tips({
							title: error
						})
					}
				);
			},
			/*获取初始化选中的数据*/
			getInitchecked(arr) {
				let that = this;
				arr.forEach((item, index) => {
					that.$set(item, 'check', false);
					that.checkedArr.forEach((val, i) => {
						if ((item.productId == val.productId)) {
							that.$set(item, 'check', true);
						}
					})
				})
			},
			/*点击选中与否*/
			goodsCheck(item, index, list) {
				if (this.checkedArr.length > 4 && !item.check) {
					return;
				}
				list.forEach((val, i) => {
					if ((val.productId == item.productId)) {
						this.$set(val, 'check', !val.check);
					}
				})
				if (item.check) {
					this.checkedArr.push(item)
				} else {
					this.checkedArr.splice(this.checkedArr.findIndex(itemn => ((itemn.productId == item.productId))), 1)
				}
				this.disabled = this.checkedArr.length > 4
			},
			/*确定提交*/
			submit() {
				this.$emit('getProduct', this.checkedArr);
			},
		}
	}
</script>

<style lang="scss" scoped>
	.containers {
		background: #ffffff;
		border-radius: 16rpx 16rpx 0 0;
		padding: 34rpx 0;
		position: relative;
		height: 100%;

		.header {
			position: relative;
			padding: 0 30rpx;

			.title {
				width: 100%;
				text-align: center;

				text {
					position: relative;
					margin: 0 50rpx;
					color: #999999;
					font-size: 30rpx;

					&.on {
						color: #333333;
						font-weight: bold;
						font-size: 34rpx;

						&::after {
							content: "";
							display: inline-block;
							width: 40rpx;
							height: 5rpx;
							@include main_bg_color(theme);
							position: absolute;
							bottom: -14rpx;
							left: 10rpx;
						}
					}
				}
			}

			.search {
				margin-top: 44rpx;
				background: #F5F5F5;
				border-radius: 30rpx;
				padding: 12rpx 30rpx 12rpx 66rpx;
				position: relative;

				.iconfont {
					font-size: 24rpx;
					color: #939393;
					position: absolute;
					top: 20rpx;
					left: 30rpx;
				}

				.placeholder {
					color: #999999;
					font-size: 26rpx;
				}
			}

			.sub_title {
				color: #282828;
				font-size: 26rpx;
				margin-top: 40rpx;
			}

			.iconfont {
				color: #8A8A8A;
				font-size: 28rpx;
				position: absolute;
				top: 0;
				right: 30rpx;
			}
		}

		scroll-view {
			height: 88% !important;
		}

		.main {
			height: 100%;
			margin: 40rpx 0 80rpx;

			/deep/.uni-scroll-view-content {
				height: auto;
			}

			.scroll {
				overflow-y: scroll;
			}
		}
	}

	.picTxt {
		width: 100%;
		position: relative;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 30rpx;

		.checkbox {
			margin-right: 4rpx;

			.iconfont {
				font-size: 38rpx;
				color: #CCCCCC;
			}

			.icon-xuanzhong1 {
				@include main_color(theme);
			}

			.disabled {
				pointer-events: none;
				cursor: default;
				opacity: 0.3;
			}
		}

		.pictrue {
			width: 160rpx;
			height: 160rpx;

			image {
				width: 100%;
				height: 100%;
				border-radius: 8rpx;
			}
		}

		.text {
			width: 450rpx;
			margin-left: 20rpx;
			font-size: 28rpx;
			color: #282828;
			position: relative;
			height: 160rpx;

			.name {
				color: #282828;
				font-size: 30rpx;
				font-weight: 600;
			}

			.money {
				position: absolute;
				bottom: 0;
				left: 0;
				@include main_color(theme);
				font-size: 26rpx;
				font-weight: bold;

				text {
					font-size: 34rpx;
				}
			}
		}
	}

	.foot_bar {
		width: 100%;
		position: fixed;
		bottom: 30rpx;
		left: 0;
		background: #ffffff;
		padding: 0 0 30rpx 0;
		z-index: 5;
		padding-bottom: constant(safe-area-inset-bottom); ///兼容 IOS<11.2/
		padding-bottom: env(safe-area-inset-bottom); ///兼容 IOS>11.2/

		.confirm_btn {
			width: 710rpx;
			height: 86rpx;
			line-height: 86rpx;
			color: #ffffff;
			text-align: center;
			font-size: 32rpx;
			@include main_bg_color(theme);
			border-radius: 43rpx;
			margin: 0 auto;
		}
	}

	.empty {
		margin: 130rpx 0 150rpx;
		text-align: center;

		image,
		uni-image {
			display: inline-block;
			width: 414rpx;
			height: 305rpx;
		}

		text {
			display: block;
			color: #999999;
			font-size: 26rpx;
		}
	}
</style>