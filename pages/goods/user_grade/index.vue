<template>
	<view class="user-grade">
		<view class="head">
			<view class="user-card mb20">
				<view class="user-info acea-row row-between">
					<view class="acea-row row-center-wrapper">
						<view class="avatar acea-row row-center-wrapper">
							<image :src="userlevel.avatar"
								v-if="userlevel.avatar && userlevel.avatar !=urlDomain+'crmebimage/presets/morenT.png'"></image>
							<image v-else class="avatar" :src="urlDomain+'crmebimage/presets/morenT.png'"></image>
						</view>
						<view class="info">
							<view class="name">
								{{userlevel.nickname}}
							</view>
						</view>
						<view class="grade">
							<image class="image" :src="(userlevel.icon) ? userlevel.icon : '' " alt="">
						</view>

					</view>
					<view @click="goMultiple" class="rule acea-row row-center-wrapper">
						<text class="iconfont wenhao mr10">?</text>
						<view>规则说明</view>
					</view>
				</view>
			</view>
			<view v-if="next_level" class="card-wrapper" :style="'background-image: url('+userlevel.backImage+')'">
				<view class="usericon">
					<image :src="userlevel.icon"></image>
				</view>
				<view class="growth">
					<view class="title" :style="'color: '+userlevel.backColor">{{userlevel.userLevelName}}</view>
					<view class="info" :style="'color: '+userlevel.backColor">今日获得经验值{{userlevel.todayExp}}点</view>
				</view>
				<view class="wait">
					<view class="wait_count acea-row row-between-wrapper">
						<text class="value" :style="'color: '+userlevel.backColor">{{userlevel.experience}} <text
								class="upExperience">/{{userlevel.upExperience}}</text></text>
						<text v-if="userlevel.upExperience>0" class="text"
							:style="'color: '+userlevel.backColor">距{{userlevel.nextLevelName}}还需{{userlevel.upExperience>0 && userlevel.experience>=0 &&userlevel.upExperience>userlevel.experience ? userlevel.upExperience-userlevel.experience : 0 }}

						</text>
					</view>
					<view class="progress"><text class="current_value" :style="'width:'+curPercent+'%'"></text></view>
				</view>
			</view>
		</view>
		<view class="ml-20 mr-20">
			<view class="grade_main">
				<view v-if="gradeList.length > 0" class="grade_privilege">
					<view class="title">会员可专项优质特权</view>
					<view class="grade_list acea-row row-between-wrapper">
						<view v-for="(item,index) in gradeList" class="item acea-row">
							<view class="picture" :class="item.status == 0 ? 'isLocked' : ''">
								<image class="bg_image" :src="item.pic"></image>
							</view>
							<view class="desc">
								<view class="name line1">{{item.name}}</view>
								<view class="detail line1">{{item.info}}</view>
							</view>
						</view>
					</view>
				</view>
				<view class="upgrade">
					<view class="upgrade-main">
						<view class="acea-row row-between mb-36">
							<view class="title">获取经验</view>
							<navigator hover-class='none' url='/pages/goods/exp_record/index'>
								<view class="rule acea-row row-center-wrapper">经验明细<text
										class="iconfont icon-jinru2"></text></view>
							</navigator>
						</view>
						<view class="item acea-row row-between-wrapper ">
							<view class="flex-center">
								<image class="w-100 h-100" :src="urlDomain+'crmebimage/presets/qiandaotu.png'"></image>
								<view class="ml-24">
									<view class="name">
										签到
									</view>
									<view class="text">每日签到可获得经验值</view>
								</view>
							</view>
							<view v-if="userlevel.todaySign" class="get_btn">已完成</view>
							<navigator v-else class="get_btn" hover-class='none' url='/pages/merchant/user_sgin/index'>去完成
							</navigator>
						</view>
						<view v-if="userlevel.isOpenCommunity" class="mt-44 item acea-row row-between-wrapper">
							<view class="flex-center">
								<image class="w-100 h-100" :src="urlDomain+'crmebimage/presets/zhongcaotu.png'"></image>
								<view class="ml-24">
									<view class="name">
										发布种草{{'（'+userlevel.noteNum+'/'+ userlevel.noteMaxNum + '）'}}
									</view>
									<view class="text">发布一条种草可获得经验值<text class="add">+{{userlevel.noteExp}}</text></view>
								</view>
							</view>
							<navigator class="get_btn" hover-class='none' url='/pages/discover/discover_release/index'>{{userlevel.noteNum == userlevel.noteMaxNum ? '已完成': '去完成'}}
							</navigator>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class='hotList'>
			<!-- 推荐商品-->
			<recommend ref="recommendIndex" :isShowTitle="isShowTitle" @getRecommendLength="getRecommendLength"></recommend>
		</view>
		<view class="instructions" v-if="showProtocol">
			<view class="setAgCount">
				<i class="icon iconfont icon-cha" @click="showProtocol = false"></i>
				<div class="title">会员等级规则</div>
				<view class="content">
					<jyf-parser :html="protocol" ref="article" :tag-style="tagStyle"></jyf-parser>
				</view>
			</view>
		</view>
		<view class="success" v-if="isShowbox">
			<view class="bg"></view>
			<view class="con">
				<view class="title">恭喜您升级为</view>
				<view class="upgrade">
					{{upgradeInfo.brokerage_name}}
				</view>

				<view class="level">
					<image class="imgae" :src="upgradeInfo.brokerage_icon"></image>
				</view>
				<view class="btn" @click="close">查看我的权益</view>
				<view class='iconfont icon-guanbi3' @click="close"></view>
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
		toLogin
	} from '@/libs/login.js';
	import {
		myExpApi,
		memberInfo,
		brokerageNotice
	} from '@/api/user.js';
	import recommend from "@/components/base/recommend.vue";
	import {
		mapGetters
	} from "vuex";
	import {
		configMap
	} from '@/utils';
	import parser from "../components/jyf-parser/jyf-parser";
	export default {
		computed: mapGetters(['userInfo', 'isLogin']),
		components: {
			recommend,
			"jyf-parser": parser,
		},
		data() {
			return {
				urlDomain: this.$Cache.get("imgHost"),
				isShowTitle: true,
				userlevel: {},
				loading: false, //是否加载中
				loadend: false, //是否加载完毕
				loadTitle: '加载更多', //提示语
				isAuto: false, //没有授权的不会自动授权
				isShowAuth: false, //是否隐藏授权
				protocol: '',
				showProtocol: false,
				tagStyle: {
					img: 'width:100%;display:block;',
					video: 'width:100%;'
				},
				gradeList: [],
				hostProduct: [],
				hotScroll: false,
				hotPage: 1,
				hotLimit: 10,
				isShowbox: false,
				curLevel: {},
				next_level: {},
				growthValue: '',
				brokerage_bg: '',
				experience: '',
				curPercent: 0,
				valueList: {},
				upgradeInfo: {}
			};
		},
		onShow() {
			if (this.isLogin) {
				this.getMemberInfo();
			} else {
				toLogin();
			}
		},
		// 滚动监听
		onPageScroll(e) {
			// 传入scrollTop值并触发所有easy-loadimage组件下的滚动监听事件
			uni.$emit('scroll');
		},
		onReachBottom() {
			this.$refs.recommendIndex.get_host_product();
		},
		methods: {
			goMultiple(e) {
				uni.navigateTo({
					url: '/pages/goods/level_rule/index'
				})
			},
			getRecommendLength(e) {
				this.isNoCommodity = e == 0 ? true : false;
			},
			shareIntegral() {
				uni.setStorageSync('isIntegral', true)
				uni.switchTab({
					url: '/pages/index/index'
				});
			},
			/*升级提醒*/
			upgradeRemind() {
				let that = this;
				brokerageNotice({
					type: 1
				}).then(function(res) {
					that.isShowbox = true;
					that.upgradeInfo = res.data.level;
				}).catch(res => {
					that.isShowbox = false;
				});
			},
			// 获取会员信息
			getMemberInfo() {
				let that = this;
				myExpApi().then(res => {
					this.userlevel = res.data;
					let check1 = this.userlevel.upExperience > 0 ; //下级经验
					let check2 = this.userlevel.experience >= 0 ; //当前经验
					let check3 = Number(this.userlevel.upExperience) > Number(this.userlevel.experience);
					this.curPercent = (check1 && check2 && check3) ? ((this.userlevel
						.experience / this.userlevel.upExperience) * 100).toFixed(2) : 100; //经验进度条

				}).catch(err => {
					this.$util.Tips({
						title: err
					});
					setTimeout(() => {
						uni.switchTab({
							url: '/pages/user/index',
						});
					}, 500)
				})
			},
			// 弹窗关闭
			close() {
				this.isShowbox = false
			},
		}
	}
</script>

<style scoped lang="scss">
	.icon-jinru2 {
		margin-left: 6rpx;
		font-size: 16rpx;
	}

	.growth {
		padding-top: 55rpx;
	}

	.usericon {
		width: 180rpx;
		height: 180rpx;
		position: absolute;
		display: inline-block;
		right: 40rpx;
		top: -20rpx;

		image {
			width: 100%;
			height: 100%;
		}
	}

	.user-grade {

		.head {
			height: 446rpx;
			width: 100%;
			padding: 14rpx 45rpx 45rpx;
			box-sizing: border-box;
			background: linear-gradient(180deg, #181818 0%, #505050 100%);

			.user-card {
				width: 100%;

				.user-info {
					z-index: 20;
					padding: 0 10rpx;

					.vip {
						width: 82rpx;
						height: 36rpx;
						margin-left: 12rpx;

						image {
							width: 82rpx;
							height: 36rpx;
						}
					}

					.rule {
						color: #999999;
						font-size: 24rpx;
						top: 50%;
						right: 40rpx;

						.wenhao {
							width: 22rpx;
							height: 22rpx;
							display: flex;
							align-items: center;
							justify-content: center;
							font-size: 22rpx;
							border-radius: 50%;
							background-color: #AAAAAA;
							color: #181818;
							margin-left: 4rpx;
						}
					}

					.avatar {
						width: 60rpx;
						height: 60rpx;
						border-radius: 50%;
						background-color: rgba(255, 255, 255, 0.6);

						image {
							width: 56rpx;
							height: 56rpx;
							border-radius: 50%;
							margin: auto;
						}
					}

					.info {
						margin-left: 20rpx;
						padding: 15rpx 0;

						.name {
							display: flex;
							align-items: center;
							color: #fff;
							font-size: 31rpx;

							.vip {
								display: flex;
								align-items: center;
								height: 36rpx;
								padding: 0 20rpx;
								background: rgba(0, 0, 0, 0.2);
								border-radius: 18px;
								font-size: 20rpx;
								margin-left: 12rpx;

								image {
									width: 27rpx;
									height: 27rpx;
								}
							}
						}

						.num {
							display: flex;
							align-items: center;
							font-size: 26rpx;
							color: rgba(255, 255, 255, 0.6);

							image {
								width: 22rpx;
								height: 23rpx;
								margin-left: 20rpx;
							}
						}
					}

					.grade {
						width: 22rpx;
						height: 22rpx;
						margin-left: 10rpx;

						.image,
						uni-image {
							width: 100%;
							height: 100%;
							display: block;
						}
					}
				}
			}
		}

		.card-wrapper {
			background-size: cover;
			width: 656rpx;
			height: 300rpx;
			margin: 0 auto;
			position: relative;
			padding: 0 40rpx 42rpx;
			box-sizing: border-box;
			border-radius: 22rpx 22rpx 0px 0px;

			.title {
				font-size: 40rpx;
				font-weight: 600;
			}

			.info {
				font-size: 26rpx;
				margin-top: 12rpx;
				opacity: .5;
			}

			.wait {
				margin-top: 36rpx;

				.wait_count {
					.upExperience {
						opacity: .7;
						font-size: 24rpx !important;
					}

					.text {
						opacity: .7;
						font-size: 24rpx;
					}

					.value {
						// color: #282828;
						// opacity: .7;
						font-weight: bold;
						font-size: 34rpx;
						margin-right: 6rpx;
					}

					.iconfont {
						font-size: 14rpx;
						color: #333333;
						display: inline-block;
						margin-left: 4rpx;
					}
				}

				.progress {
					width: 100%;
					height: 8rpx;
					margin-top: 10rpx;
					position: relative;

					&::after {
						content: "";
						display: inline-block;
						width: 100%;
						height: 8rpx;
						background-color: #333;
						border-radius: 13rpx;
						opacity: .3;
						position: absolute;
						top: 0;
						left: 0;
					}

					.current_value {
						display: inline-block;
						width: 240rpx;
						height: 8rpx;
						background-color: #333;
						border-radius: 13rpx;
						position: absolute;
						top: 0;
						left: 0;
						z-index: 5;
					}
				}
			}

			.brokerage_icon {
				width: 177rpx;
				height: 212rpx;
				position: absolute;
				right: 60rpx;
				top: 0;
			}
		}

		.grade_main {
			text-align: center;
			padding: 38rpx 32rpx 32rpx 32rpx;
			border-radius: 24rpx;
			position: relative;
			top: -56rpx;
			background: #fff;

			&::before {
				content: "";
				display: inline-block;
				width: 26rpx;
				height: 26rpx;
				background: #ffffff;
				transform: rotate(45deg);
				position: absolute;
				top: -10rpx;
				box-shadow: -1rpx -1rpx 1rpx rgba(0, 0, 0, 0.05);
			}

			.grade_privilege {
				.title {
					display: inline-block;
					color: #786046;
					font-size: 32rpx;
					font-weight: bold;
					padding: 44rpx 54rpx 20rpx;
					background: url('data:image/png;base64,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');
					background-size: 100%;
				}

				.grade_list {
					.item {
						width: 330rpx;
						height: 135rpx;
						box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.08);
						background: #ffffff;
						border-radius: 10rpx;
						padding: 25rpx 25rpx;
						margin-top: 24rpx;

						.picture {
							width: 80rpx;
							height: 80rpx;
							border-radius: 100%;
							position: relative;
							background-color: #FAF1E4;

							image,
							uni-image {
								width: 80rpx;
								height: 80rpx;
								border-radius: 100%;
							}

							&.isLocked {
								background-color: #E8E8E8;

								image,
								uni-image {
									filter: grayscale(100%);
									filter: gray;
									opacity: .5;
								}
							}

							.suozi {
								width: 26rpx;
								height: 26rpx;
								position: absolute;
								bottom: 0;
								right: 0;

								.image,
								uni-image,
								image {
									width: 26rpx;
									height: 26rpx;
									filter: none;
									opacity: 1;
								}
							}
						}

						.desc {
							margin-left: 20rpx;
							text-align: left;

							.name {
								max-width: 180rpx;
								font-size: 32rpx;
								color: #282828;
							}

							.detail {
								font-size: 24rpx;
								color: #666666;
								max-width: 180rpx;
								margin-top: 6rpx;
							}
						}
					}
				}
			}

			.upgrade {
				text-align: left;

				.rule {
					color: #666666;
					font-size: 26rpx;
				}

				.title {
					font-size: 34rpx;
					color: #282828;
					font-weight: bold;

					.name {
						margin: 0 19rpx;
					}

					image {
						width: 119rpx;
						height: 15rpx;

						&.right {
							transform: rotate(180deg);
						}
					}
				}

				.upgrade-svip {
					margin: 40rpx 0;
					background: #FFF7EC;
					border-radius: 35rpx;
					padding: 16rpx 20rpx;
					font-size: 24rpx;
					justify-content: space-between;

					.svip-view {
						color: #AE6908;
						align-items: center;
						justify-content: center;

						image {
							width: 32rpx;
							height: 32rpx;
							margin-right: 6rpx;
						}
					}

					.svip-btn {
						color: #B37400;
						font-size: 22rpx;

						.icon-jinru2 {
							margin-left: 6rpx;
							font-size: 16rpx;
						}
					}
				}

				.item {
					position: relative;
				}

				.name {
					font-size: 30rpx;
					color: #282828;
					font-weight: 600;
				}

				.text {
					font-size: 24rpx;
					color: #999999;
					margin-top: 6rpx;

					.add {
						color: #DFA759;
						display: inline-block;
						font-size: 22rpx;
						margin-left: 10rpx;
					}
				}

				.get_btn {
					display: flex;
					align-items: center;
					justify-content: center;
					width: 136rpx;
					text-align: center;
					height: 58rpx;
					color: #AE6908;
					font-size: 26rpx;
					background: linear-gradient( 90deg, #FFEAB5 0%, #E7B667 100%);
					border-radius: 29rpx;
				}
			}
		}
	}

	.success {
		z-index: 10;
		position: fixed;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		text-align: center;

		.bg {
			position: absolute;
			left: 0;
			top: 0;
			width: 100%;
			height: 100%;
			background: linear-gradient(180deg, #181818 0%, #505050 100%);
		}

		.level {
			width: 222rpx;
			height: 203rpx;
			margin: 20rpx auto 0;

			uni-image,
			image {
				width: 222rpx;
				height: 203rpx;
			}
		}

		.title {
			color: #CD8D33;
			font-weight: bold;
			font-size: 36rpx;
			margin: 0 auto;
			display: inline-block;
			font-size: 26rpx;
			width: 285rpx;
			margin-top: 96rpx;
			position: relative;

			&:before,
			&:after {
				content: "";
				display: block;
				width: 52rpx;
				height: 10rpx;
				position: absolute;
				/* #ifdef MP || APP-PLUS */
				top: 9rpx;
				/* #endif */
				/* #ifdef H5 */
				top: 14rpx;
				/* #endif */
				background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGgAAAAUCAMAAABWIogpAAAAwFBMVEUAAAAeGxsfHBwfHBwfHBwfGxsfHR0gHR0fGxsfHBwBAQH25tDz487v38ro2MPf0LzWyLXQwq+qn5BnYFdHQjwzMCssKSUWFBIQDw0LCgkHBgbCtaS9saBaU0zr3Mfj1cDazLnKvavHuqi4rJy0qJiwpZWkmouglYeckoSYjoCUinyQhnmLgnaHfnKDem5+dmp6cmd2bmRyamBsZVtfWFBUT0dQS0RMSEFBPTc8OTM5NTAnJCEkIR4dGxkaGRZjXVNX44A9AAAACXRSTlMAVPqA/IN8WITLwrIKAAAAr0lEQVRIx7XNRRLCQAAEwMVJiLvi7hLc/v8rODFVkOI2/YEWXKWqYMIjSdQJT7lMnfAUatQJjxDcCQ93wsOb8BTfD3fCQ5/wYBKNhqKoalPTWrreNgzT7HTjJOn1B5Y1HI0n09l8sVytN9udbWdZuj8cHed0vriu511v0v3h+0EQhlEky7KAyldUKOZHcX70TP9HvxOekiDAxH0wsR9M7AcT+8FEfjCRH0x4uOqf5wXaUhSOXi91TgAAAABJRU5ErkJggg==');
				background-size: cover;
			}

			&:before {
				/* #ifdef MP || APP-PLUS */
				left: 0;
				/* #endif */
				/* #ifdef H5 */
				left: 0;
				/* #endif */

			}

			&:after {
				/* #ifdef MP || APP-PLUS */
				right: 0;
				/* #endif */
				/* #ifdef H5 */
				right: 0;
				/* #endif */
				transform: rotateY(180deg);
			}
		}

		.upgrade {
			font-size: 60rpx;
			text-align: ceter;
			color: #CC6C34;
			text-align: center;
			width: 100%;
			font-weight: bold;
			margin-top: 10rpx;
			font-family: 'Tahoma, Geneva, Verdana, sans-serif';
		}

		.con {
			position: absolute;
			left: 50%;
			top: 50%;
			transform: translate(-50%, -50%);
			width: 557rpx;
			height: 660rpx;
			background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAmoAAALjCAMAAACVs9ldAAACZ1BMVEUAAAAiGiD66crysFD60o3604/72qLz4bIeGSAeGCD63a0cFx8cFx/726T85sD66cr85b7758T74rX11KAdGCD61ZX72Jz726b86cr86MX80Yj8363847j836376sv83an86sv6z4j83af84K/96MX84bL83qr86sn81JD84bLi28v81ZLCkFj86sr968v80Yf968v968r96sjTqmvaqmUvKi3Sl1GWc0s+NDDyzIr86sr947bYs3jerGgqJir968uxhVMsJyv804vysFD70o3ysFApJSjysFDGnWOxZzL94rbysFCxaDMsKCv/9u/NlVfCi1D+9/D67+H47d3/+fT99ez78uU1MzYxLzL88+klIib369opJSkuLC84NjkfHiA9Oz46ODssKSz16dj98ufy3b8aGRv25M3x5dX14sj67Nrz38P359L56dbw2Ljn2svXy77f08UVFBbs4NDu4tLq3s7i1sjw1bPbz8Hqyp/pvnHSx7nszaXv2aXt0arv1p7u0pbtzY7syIbrxH/qwXnq1bfu0q7l0rT+36KwZjHds3DVq2XRpl7oyZH97M7NoFfYxanft3jLnE7hzbDdyazXr2zkxIrqzZnLwLPFlEvn1Kb847rSvZThvoFIREHhxJe3bzn8362rdjbw3avTv6XNu6Ht0aDgzaH96MVUTkdgV0trYVKzlWSEd1++eUK1fzjDjkHDua2UfFaDbEzbx513a1iQg2lyXkTJsoqiiF5USTz0zpHCom/Nj1bZu4WunXqfkHI9NjBiUjzXyLLPsHvWnGFKPzTGhEu7iUK8qYK6sKWebDTdp2uNk3CVAAAAUXRSTlMADX36/n18/joeEBcx+UH6TTUZBSf8/QkhKvxkfVlXcWIk4bRtoMl1M418SDyM52a+rZ7YVLYeZVLB2c2bbtvNjIHaoJl96Oe43eDIncmx47DKDwqUAACCeElEQVR42uzdzW6qQBjGcUOsJiR8GnSwiqi0aAwK7I4sTE668uK8AVbueg/e3HlmGNr1iePu+VW5gn/ed0DbDoj+12RA9GqTma3MmBu90sQOhYjjWIgwtBkbvQhCE3EQuK4bBEEsQns2IHoFWwSu7ydJ4vuoDbFxrtErTETgJ2kHtSG2OLQHRKbZsZ9muQV5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');
			background-size: cover;

			.btn {
				position: absolute;
				width: 380rpx;
				height: 70rpx;
				left: 50%;
				margin-left: -185rpx;
				bottom: 77rpx;
				line-height: 70rpx;
				text-align: center;
				color: #9A5D08;
				background: linear-gradient(90deg, #EBBD7B 0%, #FFDDAC 100%);
				border-radius: 35rpx;
				font-size: 28rpx;
			}

			.icon-guanbi3 {
				color: #ffffff;
				font-size: 70rpx;
				position: absolute;
				bottom: -80rpx;
				left: 240rpx;
			}
		}
	}

	.instructions {
		width: 100%;
		height: 100%;
		position: fixed;
		top: 0;
		left: 0;
		background: rgba(0, 0, 0, .5);
		z-index: 10;
	}

	.instructions .setAgCount {
		background: #fff;
		width: 656rpx;
		position: absolute;
		top: 50%;
		left: 50%;
		border-radius: 12rpx;
		-webkit-border-radius: 12rpx;
		padding: 52rpx;
		-webkit-transform: translate(-50%, -50%);
		-moz-transform: translate(-50%, -50%);
		transform: translate(-50%, -50%);
		overflow: hidden;

		.content {
			height: 900rpx;
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

	.instructions .setAgCount .icon {
		font-size: 42rpx;
		color: #b4b1b4;
		position: absolute;
		top: 15rpx;
		right: 15rpx;
	}

	.instructions .setAgCount .title {
		color: #333;
		font-size: 32rpx;
		text-align: center;
		font-weight: bold;
	}

	.instructions .setAgCount .content {
		margin-top: 32rpx;
		color: #333;
		font-size: 26rpx;
		line-height: 22px;
		text-align: justify;
		text-justify: distribute-all-lines;
		height: 756rpx;
		overflow-y: scroll;
	}
</style>