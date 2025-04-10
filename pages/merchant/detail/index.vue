<template>
	<view :data-theme="theme"
		:style="{ 'background-image': `linear-gradient(0deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) 40%),url(${store.mer_banner})` }"
		class="store-detail">
		<tui-skeleton v-if="skeletonShow"></tui-skeleton>
		<view class="sectionBox">
			<view class="section head">
				<image :src="merchantAPPInfo.avatar"></image>
				<view class="text-wrap">
					<view class="name line1 acea-row row-middle">
						<text class="name_store">{{ merchantAPPInfo.name }}</text>
						<text v-if="store.typeId"
							class="merType ml8 bg-color">{{ store.typeId | merchantTypeFilter }}</text>
						<text v-else-if="store.isSelf" class="merType bg-color ml8">自营</text>
					</view>
					<view class="fans">
						{{ store.followerNum < 10000 ? store.followerNum + '人关注' : (store.followerNum / 10000).toFixed(2) + '万' + '人关注' }}
					</view>
				</view>
				<button hover-class="none" class="merCollect" :class="store.isCollect ? 'care' : ''"
					@click="followToggle">
					<text v-show="!store.isCollect" class="iconfont icon-guanzhu"></text>
					{{ store.isCollect ? '已关注' : '关注' }}
				</button>
			</view>
			<view class="section wrap">
				<view class="name">店铺评级</view>
				<view class="score-wrap">
					<view class="score">
						<view class='starsList'>
							<block v-for="(itemn, indexn) in merchantAPPInfo.starLevel" :key="indexn">
								<text class='iconfont icon-pingfen font-color'></text>
							</block>
							<block v-show="Number(merchantAPPInfo.starLevel)<5">
								<text v-for="(itemn, indexn) in (5-Number(merchantAPPInfo.starLevel))" :key="indexn"
									class='iconfont icon-pingfen' style="color: #BBBBBB;"></text>
							</block>
							<text class="font-color">{{merchantAPPInfo.starLevel}}</text>
						</view>
					</view>
				</view>
			</view>

			<view class="section wrap" @click="popupShow = true">
				<view class="name">店铺资质</view>
				<view><text class="iconfont icon-zizhizhengjian"></text></view>
			</view>

			<view class="section wrap" @click="call">
				<view class="name">联系客服</view>
				<view><text class="iconfont icon-kefu-mendian"></text></view>
			</view>
			<view class="section info">
				<view class="item very">
					<view class="name">店铺简介</view>
					<view class="value">{{ store.intro }}</view>
				</view>
				<view class="item very">
					<view class="acea-row" style="flex: 1;">
						<view class="name">店铺地址</view>
						<view class="value">{{ store.addressDetail }}</view>
					</view>
					<view v-if="store.latitude && store.longitude " class="iconfont icon-dingwei font-color"
						@click="showMaoLocation(store.latitude, store.longitude)"></view>
				</view>
				<view class="item">
					<view class="name">开店时间</view>
					<view class="value">{{ store.createTime | dateFormat }}</view>
				</view>
			</view>
			<view :class="{ mask: popupShow }" @click="popupShow = false"></view>
			<view :class="{ 'popup-active': popupShow }" class="popup-qrcode">
				<view class="name">资质图片</view>
				<template v-for="(item,index) in qualificationPicture">
					<image :src="item" @click='getpreviewImage(index)'></image>
				</template>
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
		mapGetters
	} from 'vuex';
	import {
		getMerDetailApi
	} from '@/api/merchant.js';
	import {
		chatConfig
	} from '@/utils/consumerType.js'
	import {
		followMer
	} from '@/libs/follow.js';
	import tuiSkeleton from '@/components/base/tui-skeleton.vue';
	let app = getApp();
	export default {
		computed: mapGetters(['isLogin', 'uid', 'merchantAPPInfo', 'merchantType']),
		components: {
			tuiSkeleton
		},
		data() {
			return {
				skeletonShow: true,
				merid: 0,
				store: {},
				score: 0,
				star: 0,
				popupShow: false,
				storeCode: '',
				openSettingBtnHidden: true, //是否授权
				qualificationPicture: [],
				theme: app.globalData.theme
			};
		},
		onLoad: function(options) {
			this.merid = options.merId;
			this.getStore();
		},
		onReady: function() {

		},
		mounted: function() {
          if(!this.merchantAPPInfo) this.getMerIndexInfo()
		},
		methods: {
			//商户信息
			async getMerIndexInfo() {
				let { data } = await getMerIndexInfoApi(this.merId)
				this.$store.commit('MERCHANTJINFO', data);
			},
			//查看地图
			showMaoLocation(lat, long) {
				if (!lat || !long)
					return this.$util.Tips({
						title: '请设置允许商城访问您的位置！'
					});
				//#ifdef H5
				if (this.$wechat.isWeixin() === true) {
					this.$wechat
						.seeLocation({
							latitude: Number(lat),
							longitude: Number(long),
							name: this.store.name,
							address: this.store.addressDetail ? this.store.addressDetail : ''
						})
						.then(res => {
							console.log('success');
						});
				} else {
					//#endif
					uni.openLocation({
						latitude: parseFloat(lat),
						longitude: parseFloat(long),
						scale: 8,
						geocode: true,
						name: this.store.name,
						address: this.store.addressDetail ? this.store.addressDetail : '',
						success: function(res) {
							console.log(res);
						}
					});
					// #ifdef H5
				}
				//#endif
			},
			// 设置是否关注
			followToggle: function() {
				if (this.isLogin === false) {
					toLogin();
				} else {
					followMer(this.store.isCollect, this.merid).then(() => {
						this.$set(this.store, 'isCollect', !this.store.isCollect);
						let merchantInfo = {
							...this.merchantAPPInfo
						}
						merchantInfo.isCollect = !merchantInfo.isCollect
						this.$store.commit('MERCHANTJINFO', {
							...merchantInfo
						});
					});
				}
			},
			returns() {
				uni.navigateBack()
			},

			call: function() {
				chatConfig(this.$Cache.getItem('merchantAPPInfo'));
			},
			getpreviewImage: function(indexw) {
				uni.previewImage({
					urls: this.qualificationPicture,
					current: this.qualificationPicture[indexw]
				});
			},
			getStore: function() {
				getMerDetailApi(this.merid).then(res => {
					let store = res.data;
					this.store = store;
					this.qualificationPicture = JSON.parse(store.qualificationPicture)

					this.score = (parseFloat(store.postage_score) + parseFloat(store.product_score) +
						parseFloat(store.service_score)) / 3;
					this.star = (this.score / 5) * 100;
					this.skeletonShow = false
				});
			}
		}
	};
</script>

<style lang="scss" scoped>
	.care {
		color: #666666 !important;
		border: 1px solid #CCCCCC;
		background: inherit !important;
	}

	.score {
		display: flex;
		align-items: center;
		margin-top: 8rpx;
		font-weight: 500;
		font-size: 24rpx;
		line-height: 1;

		.iconfont {
			font-size: 20rpx;
		}
	}

	.ml8 {
		margin-left: 8rpx;
		margin-right: 0;
	}

	.store-detail {
		background: left top/750rpx 360rpx no-repeat fixed;

		.sectionBox {
			padding: 30rpx 24rpx;
		}

		.section {
			border-radius: 20rpx;
			margin-bottom: 20rpx;
			background-color: #ffffff;
		}

		.head {
			display: flex;
			align-items: center;
			padding: 20rpx;

			image {
				width: 90rpx;
				height: 90rpx;
				border-radius: 6rpx;
			}

			.text-wrap {
				flex: 1;
				min-width: 0;
				margin-right: 20rpx;
				margin-left: 20rpx;
				line-height: 1;

				.name {

					font-weight: bold;
					font-size: 28rpx;
					color: #333;

					.name_store {
						display: inline-block;
						overflow: hidden;
						white-space: nowrap;
						text-overflow: ellipsis;
						max-width: 140px;
					}

					.isSelf {
						padding: 3rpx;

						border-radius: 6rpx;
					}
				}

				.fans {
					margin-top: 15rpx;
					font-weight: 500;
					font-size: 22rpx;
					color: #666666;
				}
			}

			.followed {
				border: 1rpx solid #bfbfbf;
				background: none;
				color: #999999;
			}
		}

		.wrap {
			display: flex;
			align-items: center;
			padding: 32rpx 20rpx;

			.name {
				flex: 1;
				min-width: 0;
				font-weight: 400;
				font-size: 28rpx;
				color: #282828;
			}

			.score-wrap {
				display: flex;
				align-items: center;
				font-weight: 500;
				font-size: 28rpx;
			}

			.iconfont {
				font-size: 36rpx;
			}

			.icon-pingfen {
				margin-right: 6rpx;
				font-size: 23rpx;
				color: #666666;
			}

			.active {
				@include main_bg_color(theme);
			}
		}

		.info {
			.item {
				display: flex;
				align-items: center;
				padding: 30rpx 20rpx;
				border: 1rpx solid #f5f5f5;
				font-weight: normal;
				font-size: 28rpx;
				color: #282828;
				justify-content: flex-start;

				.name {
					margin-right: 16rpx;
					// width: 176rpx;
				}

				.value {
					font-size: 30rpx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #999999;
					line-height: 40rpx;
					width: 486rpx;
					word-break: break-all;
				}
			}

			.very {
				.name {
					align-self: flex-start;
				}
			}
		}

		.popup-qrcode {
			position: fixed;
			top: 50%;
			left: 50%;
			z-index: 99;
			width: 544rpx;
			padding-top: 48rpx;
			padding-bottom: 36rpx;
			border-radius: 24rpx;
			background-color: #ffffff;
			transform: translate(-50%, -50%) scale(0);
			opacity: 0;
			transition: 0.3s;
			line-height: 1;
			text-align: center;
			color: #282828;

			.name {
				max-width: 90%;
				margin-right: auto;
				margin-left: auto;
				font-weight: bold;
				font-size: 32rpx;
			}

			.info {
				margin-top: 24rpx;
				font-weight: 500;
				font-size: 24rpx;
			}

			image {
				width: 110rpx;
				height: 110rpx;
				margin-top: 18rpx;
			}
		}

		.popup-active {
			transform: translate(-50%, -50%) scale(1);
			opacity: 1;
		}
	}
</style>