<template>
	<!-- 店铺街 -->
	<view>
		<view class='indexList tui-skeleton' :style="[boxStyle]" v-if="merList.length>0">
			<view class='title acea-row row-between-wrapper'>
				<view class='text line1 tui-skeleton-rect acea-row'>
					<image :src="logoUrl"></image>
					<text class='label' :style="[titleColor]">{{dataConfig.titleConfig.val}}</text>
				</view>
				<view class='more tui-skeleton-rect fs-12' :style="[moreColor]" hover-class="none" @click="more()">
          更多
					<text class="iconfont icon-jiantou fs-12"></text>
				</view>
			</view>
			<view class='tips mb20'>Good brand store</view>
			<view class='merList' :style="[gridGap]" v-if="listStyle == 0">
				<view class='item' v-for="(item,index) in merList" :key='index'>
					<navigator :url="`/pages/merchant/home/index?merId=${item.id}`" hover-class="none">
						<view class='pic tui-skeleton-rect'>
							<easy-loadimage :image-src="item.coverImage"
								:radius="dataConfig.contentStyle.val"></easy-loadimage>
						</view>
						<image class="lines left" :src="urlDomain+'crmebimage/presets/lianjie.png'"></image>
						<view v-show="logoShow" class='logo tui-skeleton-rect'>
							<image :src='item.rectangleLogo'></image>
						</view>
						<image class="lines right" :src="urlDomain+'crmebimage/presets/lianjie.png'"></image>
						<view class='merName tui-skeleton-rect'>
							<view class='neme line1 line-heightOne' v-show="nameShow" :style="[nameColor]">{{item.name}}</view>
							<view v-show="typeShow"><text class='label'
									:style="[labelColor]">{{item.typeId | merchantTypeFilter}}</text></view>
						</view>
					</navigator>
				</view>
			</view>
			<view v-if="listStyle == 1">
				<mer-card :merchantList="merList" :merchantStyle="merchantStyle" :isShowHome="isShowHome" :isStreet="true" :isHome="true"></mer-card>
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
		getDiyMerListApi,
		getMerListbyidsApi
	} from '@/api/merchant.js';
	import merCard from '@/components/merchantList/index.vue'
	import easyLoadimage from '@/components/base/easy-loadimage.vue';
	let app = getApp()
	export default {
		name: 'merchantList',
		props: {
			dataConfig: {
				type: Object,
				default: () => {}
			},
		},
		data() {
			return {
				urlDomain: this.$Cache.get("imgHost"),
				merList: [],
				isShowHome: {} ,//首页中展示字段判断
				merchantStyle: null ,//样式二中的样式集合
				themeColor:this.$options.filters.filterTheme(app.globalData.theme)
			}
		},
		components: {
			merCard,
			easyLoadimage
		},
		computed: {
			//店铺数据类型，0默认，1自定义
			listConfig(){
				return this.dataConfig.listConfig.tabVal
			},
			//店铺数据自定义，选中商户的id集合
			activeValueMer(){
				return this.dataConfig.activeValueMer.activeValue
			},
			//样式类型，0，1
			listStyle() {
				return this.dataConfig.tabConfig.tabVal
			},
			//最外层盒子的样式
			boxStyle() {
				return {
					borderRadius: this.dataConfig.bgStyle.val * 2 + 'rpx',
					background: `linear-gradient(${this.dataConfig.bgColor.color[0].item}, ${this.dataConfig.bgColor.color[1].item})`,
					margin: this.dataConfig.mbConfig.val * 2 + 'rpx' + ' ' + '20rpx' + ' ' + 0,
					padding: this.dataConfig.upConfig.val * 2 + 'rpx' + ' ' + '10px' + ' ' + this.dataConfig.downConfig
						.val * 2 + 'rpx'
				}
			},
			//图片样式
			contentStyle() {
				return {
					'border-radius': this.dataConfig.contentStyle.val + 'px',
				}
			},
			//内容间距
			gridGap() {
				return {
					'grid-gap': this.dataConfig.contentConfig.val + 'px'
				}
			},
			//标题颜色
			titleColor() {
				return {
					'color': this.dataConfig.titleColor.color[0].item
				}
			},
			//名称颜色
			nameColor() {
				return {
					'color': this.dataConfig.nameColor.color[0].item
				}
			},
			//更多颜色
			moreColor() {
				return {
					'color': this.dataConfig.moreColor.color[0].item
				}
			},
			  // 价格颜色
			priceColor(){
				return {
				  'color': this.dataConfig.themeStyleConfig.tabVal?this.dataConfig.priceColor.color[0].item:this.themeColor
				}
			},
			//标题图片
			logoUrl() {
				return this.dataConfig.logoConfig.url
			},
			//标签
			labelColor() {
				return {
					'backgroundColor': this.dataConfig.themeStyleConfig.tabVal?this.dataConfig.labelColor.color[0].item:this.themeColor,
					'color': this.dataConfig.labelFontColor.color[0].item
				}
			},
			//店铺名称
			nameShow() {
				if (this.dataConfig.typeConfig.activeValue.indexOf(0) !== -1) {
					return true;
				} else {
					return false;
				}
			},
			//店铺logo
			logoShow() {
				if (this.dataConfig.typeConfig.activeValue.indexOf(1) !== -1) {
					return true;
				} else {
					return false;
				}
			},
			//店铺类型
			typeShow() {
				if (this.dataConfig.typeConfig.activeValue.indexOf(2) !== -1) {
					return true;
				} else {
					return false;
				}
			},
			//店铺数量
			numConfig(){
				return this.dataConfig.numConfig.val
			}
		},
		mounted() {
			this.merchantStyle = {
				contentStyle: this.contentStyle,
				nameColor: this.nameColor,
				labelColor: this.labelColor,
				priceColor: this.priceColor
			}
			this.$store.dispatch('MerCategoryList');
			this.$store.dispatch('MerTypeList');
			if(this.listConfig === 0){
				this.getMerList();
			}else{
				this.getMerListbyids();
			}
			this.isShowHome = {
				typeShow: this.typeShow,
				nameShow: this.nameShow,
				logoShow: this.logoShow
			}
		},
		methods: {
			more() {
				this.$util.navigateTo(this.dataConfig.linkConfig.val)
			},
			//默认店铺数据
			getMerList() {
				getDiyMerListApi(this.numConfig).then((res) => {
					this.merList = res.data.list;
				});
			},
			//自定义店铺数据
			getMerListbyids(){
				getMerListbyidsApi(this.activeValueMer.join(',')).then((res) => {
					this.merList = res.data;
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.indexList {}

	.merList {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		grid-template-rows: auto;
		width: 100%;

		.item {
			position: relative;

			.lines {
				width: 8rpx;
				height: 34rpx;
				position: absolute;
				z-index: 1;
			}

			.left {
				left: 14rpx;
				top: 204rpx;
			}

			.right {
				right: 14rpx;
				top: 204rpx;
			}

			.pic {
				width: 100%;
				height: 220rpx;
				overflow: hidden;

				image {
					width: 100%;
					height: 100%;
				}
			}

			.logo {
				width: 150rpx;
				height: 44rpx;
				background: #FFFFFF;
				box-shadow: 0rpx 3rpx 6rpx 1rpx rgba(0, 0, 0, 0.1000);
				border-radius: 33rpx;
				opacity: 1;
				margin: auto;
				position: absolute;
				z-index: 1;
				left: 16%;
				top: 59%;

				image {
					margin: auto;
					width: 130rpx;
					height: 44rpx;
					display: block;
				}
			}

			.merName {
				width: 100%;
				height: 110rpx;
				background: #FFFFFF;
				border-radius: 14rpx;
				opacity: 1;
				padding: 30rpx 0 14rpx 0;
				display: flex;
				flex-direction: column;
				align-items: center;

				.neme {
					font-weight: bold;
					color: #333333;
					font-size: 22rpx;
					text-align: center;
					margin-bottom: 4rpx;
					width: 210rpx;
				}

				.label {
					height: 28rpx;
					line-height: 28rpx;
					border-radius: 14rpx;
					opacity: 1;
					text-align: center;
					font-size: 18rpx;
					padding: 0 12rpx;
				}
			}
		}
	}
	.fs-12{
		font-size: 24rpx !important;
	}
</style>