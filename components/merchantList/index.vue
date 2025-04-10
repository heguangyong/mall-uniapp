<template>
	<view>
		<view v-if="merchantList.length" class="store-wrapper">
			<view v-for="(item,index) in merchantList" :key="item.id">
				<view v-if="(item.proList&&item.proList.length && isStreet) || (!isStreet)" class="store-item" :class="isStreet?'street-noPad':''"
					:style="[isStreet ? { 'background-image': item.streetBackImage?'url('+ item.streetBackImage +')': 'url('+ moren +')' } : '',isHome?merchantStyle.contentStyle:'']">
					<view @click="goShop(item.id)" class="head" :class="isStreet?'street-backImage':''">
						<view class="left-wrapper">
							<view class="logo" :class="isStreet?'street-logo':''" :style="{'background-image': isStreet?`url(${urlDomain}crmebimage/presets/shang.png)`:''}">
								<image v-show="(isShowHome.logoShow&&isHome) ||!isHome" :src="isStreet?item.rectangleLogo:item.avatar" mode=""></image>
							</view>
							<view class="con-box">
								<view class="name line1 acea-row row-middle" :class="isStreet?'street-name':''" :style="[isHome?merchantStyle.nameColor:'']">
									<text v-show="(isShowHome.nameShow&&isHome) ||!isHome" class="mer_name line1">{{item.name}}</text>
									<text v-if="item.isSelf && ((isShowHome.typeShow&&isHome) ||!isHome)" class="font-bg-red mr10 merType" :class="isHome?'':'bg-color'" :style="[isHome?merchantStyle.labelColor:'']">自营</text>
								</view>
								<view class="star-box">
									<view v-if="!isStreet" class="score">
										<view class='starsList'>
											<block v-for="(itemn, indexn) in item.starLevel" :key="indexn">
												<text class='iconfont icon-pingfen font-color'></text>
											</block>
											<block v-show="Number(item.starLevel)<5">
												<text v-for="(itemn, indexn) in 5-parseInt(item.starLevel)" :key="indexn" class='iconfont icon-pingfen noCheck'></text>
											</block>
										</view>
									</view>
									<view v-show="!isStreet" class="lines tui-skeleton-rect"></view>
									<view class="fans" :style="isStreet?'color:#fff':'color:#999'">
										{{ item.followerNum < 10000 ? item.followerNum : (item.followerNum / 10000).toFixed(2) + '万' }}人关注
									</view>
								</view>
							</view>
						</view>
						<view v-if="!isStreet" class="link" @click="goShop(item.id)">进店</view>
					</view>
					<view v-if="item.proList.length" class="pic-wrapper" :class="isStreet?'street-wrapper':''">
						<view v-for="(goods,indexn) in item.proList" :key="indexn" class="proList"
							@click="godDetail(goods)">
							<view class="pic-item" :class="isStreet?'street-pic':''">
								<view v-show="goods.stock===0" class="sellOut">已售罄</view>
								<image :src="goods.image" mode="aspectFill"></image>
								<!-- <easy-loadimage :image-src="goods.image"></easy-loadimage> -->
								<view v-if="!isStreet" class="price" :style="[isHome?merchantStyle.priceColor:'']">
									<text>￥</text>{{goods.price}}
								</view>
							</view>
							<view class="pic-name line2" v-if="isStreet">{{goods.name}}</view>
							<view v-if="isStreet" class="street-price" :style="[isHome?merchantStyle.priceColor:'']">
								￥{{goods.price}}
							</view>
						</view>
					</view>
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
    goProductDetail
	} from '@/libs/order.js'
	import {
		mapGetters
	} from "vuex";
	import easyLoadimage from '@/components/base/easy-loadimage.vue';
	export default {
		data() {
			return {
				urlDomain: this.$Cache.get("imgHost"),
				skeletonShow: true,
				isShow: true,
				moren: '',
				noStarLevel: 0
			}
		},
		components: {
			easyLoadimage
		},
		computed: mapGetters(['uid']),
		props: {
			merchantList: {
				type: Array,
				default: () => []
			},
			//是否是店铺街，true是，false不是
			isStreet: {
				type: Boolean,
				default: () => false
			},
			//是否是首页展示，true是，false不是
			isHome: {
				type: Boolean,
				default: () => false
			},
			//首页中展示字段判断
			isShowHome: {
				type: Object,
				default: () => ({
					logoShow: true,
					typeShow:true,
					nameShow: true
				})
			},
			merchantStyle: {
				type: Object,
				default: () => {}
			},
		},
		created() {
			this.moren = this.urlDomain + 'crmebimage/presets/mermoren.png';
		},
		methods: {
			godDetail(item) {
        goProductDetail(item.id, 0, '')
			},
			menusTap(url) {
				uni.navigateTo({
					url
				})
			},
			goShop(id) {
				uni.navigateTo({
					url: `/pages/merchant/home/index?merId=${id}`
				})
			},
		}
	};
</script>

<style scoped lang="scss">
	.noCheck{
		color: #ddd;
	}
	.score {
		display: flex;
		align-items: center;
		font-weight: 500;
		font-size: 24rpx;
		line-height: 1;
		height: 19rpx;

		.iconfont {
			font-size: 20rpx;
		}
	}
	.store-wrapper {
		//padding: 0 20rpx;
	}

	.star-box {
		display: flex;
		align-items: center;

		.lines {
			width: 2rpx;
			height: 14rpx;
			background: #BFBFBF;
			border-radius: 0px 0px 0px 0px;
			opacity: 1;
			margin-left: 10rpx;
			margin-right: 10rpx;
		}

		.fans {
			font-size: 24rpx;
		}

		.num {
			color: $theme-color;
			font-size: 24rpx;
			margin-left: 10rpx;
		}
	}

	.street {
		&-logo {
			width: 191rpx !important;
			height: 80rpx !important;
			background-repeat: no-repeat;
			background-size: 100% 100%;
			border-radius: 0 !important;
			margin-right: 0 !important;

			image {
				width: 130rpx !important;
				height: 44rpx !important;
				margin-top: 13rpx;
				margin-left: 17rpx;
			}
		}

		&-name {
			color: #fff;
		}

		&-pad20 {
			padding: 0 20rpx;
		}

		&-noPad {
			border-top-left-radius: 16rpx;
			border-top-right-radius: 16rpx;
			width: 100%;
			height: 353rpx;
			padding: 24rpx !important;
			background-size: 100% 100%;
			margin-bottom: 97rpx !important;
		}

		&-pic {
			border-radius: 8rpx !important;
			overflow: hidden;
			margin-right: 12rpx !important;
		}

		&-price {
			font-size: 28rpx;
			color: #FD502F;
			margin-top: 5rpx;

			font-weight: 800;
		}

		&-wrapper {
			padding: 20rpx !important;
			margin-top: -2rpx;
		}

		&-active {
			background-size: 111rpx 19rpx;
		}
	}

	.backImage {

		padding: 24rpx 0 24rpx 20rpx;
		border-radius: 16px 16px 0px 0px;
	}

	.store-item {
		margin-bottom: 30rpx;
		padding: 24rpx;
		background-color: #fff;
		border-radius: 24rpx;

		.head {
			display: flex;
			justify-content: space-between;

			.left-wrapper {
				display: flex;
				align-items: center;

				.logo {
					width: 80rpx;
					height: 80rpx;
					border-radius: 6rpx;
					overflow: hidden;
					margin-right: 20rpx;

					image {
						width: 120rpx;
						height: 120rpx;
						border-radius: 6rpx;
						overflow: hidden;
					}
				}

				.con-box {
					.bt-color {
						width: max-content;
						white-space: nowrap;
						font-size: 16rpx;
						padding: 2rpx 10rpx;
						background-color: #fff;
						@include main_color(theme);
						border-radius: 13rpx;

					}

					.name {
						font-size: 30rpx;
						color: #333;
						font-weight: bold;
						margin-top: -7rpx;

						.mer_name {
							max-width: 400rpx;
							margin-right: 10rpx;
						}
					}
				}
			}

			.link {
				width: 114rpx;
				height: 50rpx;
				line-height: 50rpx;
				@include linear-gradient(theme);
				border-radius: 25rpx;
				text-align: center;
				color: #fff;
				font-size: 24rpx;
			}
		}

		.pic-wrapper {
			width: 100%;
			display: grid;
			grid-template-rows: auto;
			grid-template-columns: repeat(3, 1fr);
			grid-gap: 20rpx;
			background-color: #FFFFFF;
			border-radius: 0px 16rpx 16rpx 16rpx;
			padding-top: 20rpx;

			.pic-name {
				margin-top: 10rpx;
				font-size: 24rpx;
				color: #333333;
        height: 68rpx;
        line-height: 34rpx;
			}

			.pic-item {
				position: relative;
				width: 100%;
				height: 170rpx;
				overflow: hidden;
				border-radius: 14rpx;

				.easy-loadimage,
				image,
				uni-image {
					overflow: hidden;
					border-radius: 16rpx;
					width: 100%;
					height: 100%;
				}

				.price {
					position: absolute;
					right: 0;
					bottom: 0;
					height: 36rpx;
					padding: 0 10rpx;
					line-height: 36rpx;
					text-align: center;
					background: rgba(0, 0, 0, .5);
					border-radius: 16rpx 2rpx 16rpx 2rpx;
					color: #fff;
					font-size: 24rpx;

					text {
						font-size: 18rpx;
					}
				}

				&:nth-child(3n) {
					margin-right: 0;
				}
			}
		}
	}
</style>
