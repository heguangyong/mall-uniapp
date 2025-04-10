<template>
	<view :data-theme="theme">
		<view class='productList'>
			<view class='search bg_color acea-row row-between-wrapper'>
				<!-- #ifdef H5 -->
				<view class="iconfont icon-xiangzuo" @click="goback()"></view>
				<!-- #endif -->
				<view :class="tabIndex !== 2?'searchIpt':''" class='input acea-row row-middle'><text
						class='iconfont icon-sousuo mr20'></text>
					<input :placeholder="tabIndex===1?'搜索商品名称':'搜索店铺名称'" placeholder-class='placeholder'
						confirm-type='search' name="search" v-model="keyword" @confirm="searchSubmit"
						maxlength="20"></input>
				</view>
				<view v-if="tabIndex === 2" class='iconfont icon-shaixuan' @click='open(2)'></view>
			</view>
			<view class="nav-wrapper mr-20px" v-if="merId===0 && cid === 0">
				<view class="tab-bar" :class="{'merTab':tabIndex===2}">
					<view class="tab-item" :class="{on:tabIndex===1}" @click="changetab(1)">商品</view>
					<view class="tab-item" :class="{on:tabIndex===2}" @click="changetab(2)">店铺</view>
				</view>
			</view>
			<view v-if="tabIndex===1" class='nav acea-row row-middle' :class="(merId > 0 || cid > 0) ? 'mer-nav' : ''">
				<view class='item' :class='title ? "font_color":""' @click='set_where(1,tabIndex)'>
					{{title ? title:'默认'}}
				</view>
				<view class='item' @click='set_where(2,tabIndex)'>
					价格
					<image v-if="price==1" :src='upPng'></image>
					<image v-else-if="price==2" :src='downPng'></image>
					<image v-else :src="urlDomain+'crmebimage/presets/horn.png'"></image>
				</view>
				<view class='item-c item' @click='set_where(3,tabIndex)'>
					销量
					<image v-if="stock==1" :src='upPng'></image>
					<image v-else-if="stock==2" :src='downPng'></image>
					<image v-else :src="urlDomain+'crmebimage/presets/horn.png'"></image>
				</view>
				<!-- down -->
				<view class="item-shu"></view>
				<view class='item-icon iconfont' :class="is_switch?'icon-pailie':'icon-tupianpailie'" @click='Changswitch()'>
				</view>
			</view>
			<view v-if="tabIndex===1" :class="is_switch==true?'proList':'listBox'">
				<view :class="[(merId > 0 || cid > 0) ? 'mer-listBox' : '']" v-if="productList.length>0">
					<view v-if="!is_switch" class='list acea-row row-between-wrapper'
						:class="[is_switch==true ? '' : 'on', (merId > 0 || cid > 0) ? 'mer-list' : ''] ">
						<view class='item' :class='is_switch==true?"":"on"' hover-class='none'
							v-for="(item,index) in productList" :key="index" @click="godDetail(item)">
							<view class='pictrue' :class='is_switch==true?"":"on"'>
								<view v-show="item.stock===0" class="sellOut">已售罄</view>
								<easy-loadimage :image-src="item.image" :class='is_switch==true?"":"on"'>
								</easy-loadimage>
								<span class="pictrue_log_class"
									:class="is_switch === true ? 'pictrue_log_big' : 'pictrue_log'"
									v-if="item.activityH5 && item.activityH5.type === '1'">秒杀</span>
								<span class="pictrue_log_class"
									:class="is_switch === true ? 'pictrue_log_big' : 'pictrue_log'"
									v-if="item.activityH5 && item.activityH5.type === '2'">砍价</span>
								<span class="pictrue_log_class"
									:class="is_switch === true ? 'pictrue_log_big' : 'pictrue_log'"
									v-if="item.activityH5 && item.activityH5.type === '3'">拼团</span>
							</view>
							<view class='text' :class='is_switch==true?"":"on"'>
								<view class='name box-line2 mb-10'>
									<span v-if="item.productTags && item.productTags.locationLeftTitle.length"
										class="font-bg-red mr10 merType bg-color">{{item.productTags.locationLeftTitle[0].tagName}}</span>
									{{item.name}}
								</view>
								<!-- 价格 -->
								<svip-price :svipIconStyle="svipIconStyle" :productPrice="item"
									:svipPriceStyle="svipPriceStyle"></svip-price>
								<view v-if="item.productTags && item.productTags.locationUnderTitle.length">
									<text
										v-for="items in item.productTags.locationUnderTitle.length>3?item.productTags.locationUnderTitle.slice(0,3):item.productTags.locationUnderTitle"
										class="mr10 tagSolid">{{items.tagName}}</text>
								</view>
								<view class='vip acea-row row-between-wrapper mt-10 mb-10' :class='is_switch==true?"":"on"'>
									<view>已售{{item.sales}}{{item.unitName}}</view>
								</view>
								<view v-if="item.merName" class="company" @click.stop="goStore(item.merId)">
									<text class='name line1'>{{item.merName}}</text>
									<view class="flex">
										进店
										<text class="iconfont icon-xiangyou"></text>
									</view>
								</view>
							</view>

						</view>
					</view>
					<view v-else class="goods">
						<WaterfallsFlow :wfList='productList' :type="1">
							<template slot-scope="{item}">
								<WaterfallsFlowItem :item="item" :type="1" :isStore="1" />
							</template>
						</WaterfallsFlow>
					</view>
				</view>
				<view class='loadingicon acea-row row-center-wrapper'>
					<text class='loading iconfont icon-jiazai'
						:hidden='loading==false'></text>{{productList.length>0?loadTitle:''}}
				</view>
			</view>
			<view class="merList" v-if="tabIndex == 2">
				<view v-if="merchantList.length===0" style="background-color: #F5F5F5;" class='nav acea-row row-middle'
					:class="(merId > 0 || cid > 0) ? 'mer-nav' : ''">
				</view>
				<merchant-list :merchantList="merchantList"></merchant-list>
				<view class='loadingicon acea-row row-center-wrapper'>
					<text class='loading iconfont icon-jiazai' :hidden='loading==false'></text>
				</view>
			</view>
		</view>
		<view class='noCommodity' :class="{'mer-mt194': tabIndex ==2, 'mer-mt100':  cid !== 0}"
			:style="{'top':!is_switch?'-110rpx':''}"
			v-if="(productList.length==0 && isShow && tabIndex===1 && !loading )  || (merchantList.length==0 && isShow && tabIndex===2 && !loading)">
			<view class='pictrue'>
				<image :src="urlDomain+'crmebimage/presets/noSearch.png'"></image>
			</view>
			<text class="text-ccc">{{tabIndex===1?'暂无商品~':'暂无店铺~'}}</text>
			<recommend v-if="!merId" ref="recommendIndex" class="mt-40"></recommend>
		</view>

		<tui-drawer mode="right" :visible="rightDrawer" @close="closeDrawer">
			<merSeach :whereMer="whereMer" @close="closeDrawer" @confirm="confirm"></merSeach>
		</tui-drawer>
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
		productList
	} from '@/api/product.js';
	import {
		getMerSearchApi,
		getMerProListApi
	} from '@/api/merchant.js';
	import {
		mapGetters
	} from "vuex";
	import {
    goProductDetail
	} from '@/libs/order.js'
	import merSeach from '../components/merSeach/index.vue'
	import merchantList from '@/components/merchantList/index.vue'
	import WaterfallsFlow from '@/components/WaterfallsFlow/WaterfallsFlow.vue'
	import tuiDrawer from '../components/tui-drawer/index.vue'
	import recommend from "@/components/base/recommend.vue";
	import easyLoadimage from '@/components/base/easy-loadimage.vue';
	import WaterfallsFlowItem from '@/components/WaterfallsFlowItem/WaterfallsFlowItem.vue'
	import svipPrice from '@/components/svipPrice.vue';
	let app = getApp();
	export default {
		computed: mapGetters(['uid']),
		components: {
			merchantList,
			merSeach,
			WaterfallsFlow,
			tuiDrawer,
			recommend,
			easyLoadimage,
			WaterfallsFlowItem,
			svipPrice
		},
		mounted() {
			this.$store.dispatch('MerCategoryList');
			this.$store.dispatch('MerTypeList');
		},
		data() {
			return {
				//普通价格
				svipPriceStyle: {
					svipBox: {
						height: '26rpx',
						borderRadius: '60rpx 56rpx 56rpx 20rpx',
					},
					icon: {
						height: '26rpx',
						fontSize: '18rpx',
						borderRadius: '12rpx 0 12rpx 2rpx'
					},
					price: {
						fontSize: '38rpx'
					},
					svipPrice: {
						fontSize: '22rpx'
					}
				},
				//svip价格
				svipIconStyle: {
					svipBox: {
						height: '26rpx',
						borderRadius: '24rpx 40rpx 40rpx 0.4rpx',
					},
					price: {
						fontSize: '38rpx'
					},
					svipPrice: {
						fontSize: '18rpx'
					}
				},
				urlDomain: this.$Cache.get("imgHost"),
				keyword: '',
				drawers: 0,
				tabIndex: 1,
				productList: [],
				is_switch: true,
				where: {
					keyword: '',
					priceOrder: '',
					salesOrder: '',
					//news: 0,
					page: 1,
					limit: 20,
					cid: '', //商城使用
					merId: '',
					cids: '' //商户使用
				},
				cid: 0, //分类id
				price: 0,
				stock: 0,
				nows: false,
				loadend: false,
				loading: false,
				loadTitle: '加载更多',
				title: '',
				theme: app.globalData.theme,
				upPng: '',
				downPng: '',
				whereMer: {
					categoryIds: '',
					isSelf: '',
					keywords: '',
					page: 1,
					limit: 20,
					typeIds: ''
				},
				rightDrawer: false,
				merchantList: [],
				merId: 0,
				goodScroll: true,
				isShow: false
			};
		},
		// 滚动监听
		onPageScroll(e) {
			// 传入scrollTop值并触发所有easy-loadimage组件下的滚动监听事件
			uni.$emit('scroll');
		},
		onLoad: function(options) {
			this.downPng = `${this.urlDomain}crmebimage/presets/down_red.png`;
			this.upPng = `${this.urlDomain}crmebimage/presets/up_red.png`;
			this.merId = options.merId ? Number(options.merId) : 0;
			this.$set(this, 'cid', Number(options.cid) || 0);
			this.title = options.title || '';
			this.$set(this, 'keyword', options.searchValue || '');
			if (this.tabIndex === 1) this.get_product_list();
			switch (this.theme) {
				case 'theme2':
					this.upPng = `${this.urlDomain}crmebimage/presets/up_orange.png`;
					this.downPng = `${this.urlDomain}crmebimage/presets/down_orange.png`;
					break;
				case 'theme3':
					this.upPng = `${this.urlDomain}crmebimage/presets/up_green.png`;
					this.downPng = `${this.urlDomain}crmebimage/presets/down_green.png`;
					break;
				case 'theme4':
					this.upPng = `${this.urlDomain}crmebimage/presets/up_blue.png`;
					this.downPng = `${this.urlDomain}crmebimage/presets/down_blue.png`;
					break;
				case 'theme5':
					this.upPng = `${this.urlDomain}crmebimage/presets/up_pink.png`;
					this.downPng = `${this.urlDomain}crmebimage/presets/down_pink.png`;
					break;
				default:
					this.upPng = `${this.urlDomain}crmebimage/presets/up_red.png`;
					this.downPng = `${this.urlDomain}crmebimage/presets/down_red.png`;
					break;
			}
		},
		methods: {
			goStore(id) {
				uni.navigateTo({
					url: `/pages/merchant/home/index?merId=${id}`
				})
			},
			confirm(data) {
				this.whereMer.typeIds = data.typeId;
				this.whereMer.categoryIds = data.categoryId;
				this.whereMer.keywords = this.where.keyword;
				this.loadend = false;
				this.$set(this.whereMer, 'page', 1)
				this.merchantList = [];
				this.rightDrawer = false
				this.getMerStreet();
			},
			changetab(n) {
				this.tabIndex = n;
				this.nows = 1;
				this.stock = 0;
				this.loadend = false;
				this.loading = false;
				if (n === 2) {
					this.merchantList = [];
					this.$set(this.whereMer, 'page', 1);
					this.getMerStreet();
					this.title = '';
				} else {
					this.whereMer.typeIds = '';
					this.whereMer.categoryIds = '';
					this.productList = [];
					this.$set(this.where, 'page', 1);
					this.get_product_list();
				}
			},
			open(n) {
				if (this.tabIndex === 2) {
					this.rightDrawer = true;
					this.drawers = n;
				}
			},
			closeDrawer(e) {
				this.rightDrawer = false
				if (!e) {
					this.rightDrawer = false
				}
			},
			goback() {
				// #ifdef H5
				return history.back();
				// #endif
				// #ifndef H5
				return uni.navigateBack({
					delta: 1,
				})
				// #endif
			},
			getMerStreet: function(isPage) {
				this.skeletonShow = true
				let that = this;
				that.setWhere();
				if (that.loadend) return;
				if (that.loading) return;
				that.loading = true;
				if (isPage === true) that.$set(that, 'merchantList', []);
				that.loadTitle = '';
				that.whereMer.keywords = encodeURIComponent(that.keyword);
				getMerSearchApi(that.whereMer).then(res => {
					let list = res.data.list;
					let merchantList = that.$util.SplitArray(list, that.merchantList);
					let loadend = list.length < that.whereMer.limit;
					that.loadend = loadend;
					that.loadTitle = loadend ? '没有了' : '加载更多';
					that.$set(that, 'merchantList', merchantList);
					that.$set(that.whereMer, 'page', that.whereMer.page + 1);
					that.loading = false;
					this.skeletonShow = false;
					this.isShow = true
				}).catch(err => {
					that.loading = false;
					that.goodScroll = false;
					that.loadTitle = '加载更多';
				});
			},
			// 去详情页
			godDetail(item) {
        goProductDetail(item.id, 0,'');
			},
			Changswitch: function() {
				let that = this;
				that.is_switch = !that.is_switch
			},
			searchSubmit: function(e) {
				let that = this;
				that.loadend = false;
				that.$set(that, 'keyword', e.detail.value || '');
				if (that.tabIndex === 1) {
					that.$set(that.where, 'page', 1)
					this.get_product_list(true);
				} else {
					that.$set(that, 'merchantList', []);
					this.$set(this.whereMer, 'page', 1)
					this.getMerStreet();
				}
			},
			//点击事件处理
			set_where: function(e, n) {
				switch (e) {
					case 1:
						this.price = 0;
						this.stock = 0;
						break;
					case 2:
						if (this.price == 0) this.price = 1;
						else if (this.price == 1) this.price = 2;
						else if (this.price == 2) this.price = 0;
						this.stock = 0;
						break;
					case 3:
						if (this.stock == 0) this.stock = 1;
						else if (this.stock == 1) this.stock = 2;
						else if (this.stock == 2) this.stock = 0;
						this.price = 0
						break;
					case 4:
						this.price = 0;
						this.stock = 0;
						break;
				}
				if (n === 1) {
					this.loadend = false;
					this.$set(this.where, 'page', 1);
					this.get_product_list(true);
				} else {
					this.nows = 1;
				}
			},
			//设置where条件
			setWhere: function() {
				if (this.price == 0) this.where.priceOrder = '';
				else if (this.price == 1) this.where.priceOrder = 'asc';
				else if (this.price == 2) this.where.priceOrder = 'desc';
				if (this.stock == 0) this.where.salesOrder = '';
				else if (this.stock == 1) this.where.salesOrder = 'asc';
				else if (this.stock == 2) this.where.salesOrder = 'desc';
				//this.where.news = this.nows ? 1 : 0;
			},
			//查找产品
			get_product_list: function(isPage) {
				let that = this;
				that.setWhere();
				if (that.loadend) return;
				if (that.loading) return;
				if (isPage === true) that.$set(that, 'productList', []);
				that.loading = true;
				that.loadTitle = '';
				if (this.merId > 0) that.where.merId = that.merId
				that.where.keyword = encodeURIComponent(that.keyword);
				if (that.cid === 0) {
					that.where.cid = '';
					that.where.cids = '';
				} else {
					if (this.merId > 0){
						that.where.cids = that.cid
						that.where.cid = '';
					}else{
						that.where.cid = that.cid;
						that.where.cids = ''
					}
					
				}
				this.merId === 0 ? productList(that.where).then(res => {
					let list = res.data.list;
					let productList = that.$util.SplitArray(list, that.productList);
					let loadend = list.length < that.where.limit;
					that.loadend = loadend;
					that.loading = false;
					that.loadTitle = loadend ? '已全部加载' : '加载更多';
					that.$set(that, 'productList', productList);
					that.$set(that.where, 'page', that.where.page + 1);
					this.isShow = true
				}).catch(err => {
					that.loading = false;
					that.loadTitle = '加载更多'
				}) : getMerProListApi(that.where).then(res => {
					let list = res.data.list;
					let productList = that.$util.SplitArray(list, that.productList);
					let loadend = list.length < that.where.limit;
					that.loadend = loadend;
					that.loading = false;
					that.loadTitle = loadend ? '已全部加载' : '加载更多';
					that.$set(that, 'productList', productList);
					that.$set(that.where, 'page', that.where.page + 1);
					this.isShow = true
				}).catch(err => {
					that.loading = false;
					that.loadTitle = '加载更多'
				})
			},
		},
		onReachBottom() {
			if(this.tabIndex === 2){
				this.getMerStreet();
			}
			if (this.productList.length > 0) {
				this.get_product_list();
			}
			if ((this.productList.length == 0 && this.isShow && this.tabIndex === 1 && !this.loading) || (this.merchantList
					.length == 0 && this.isShow && this.tabIndex === 2 && !this.loading)) {
				this.$refs.recommendIndex.get_host_product();
			}
		}
	}
</script>
<style>
	body {
		height: auto !important;
	}
</style>
<style scoped lang="scss">
	.mt80 {
		margin-top: 80rpx;
	}

	.searchIpt {
		/* #ifdef H5 */
		width: 91% !important;
		/* #endif */
		/* #ifndef H5 */
		width: 100% !important;
		/* #endif */
	}

	.store-item .merTab {
		height: auto !important;

		.tab-item {
			margin-top: 8rpx !important;
		}
	}

	.text-ccc {
		text-align: center;
		display: block;
	}

	.company {
		display: flex;
		align-items: center;
		color: #737373 !important;
		font-size: 26rpx;

		.name {
			display: inline-block;
			// width: 120rpx;
			height: auto !important;
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
		}

		.flex {
			display: flex;
			align-items: center;
			margin-left: 10rpx;
			color: #282828 !important;
			width: 100rpx;

			.iconfont {
				font-size: 16rpx;
				margin-top: 4rpx;
			}
		}
	}

	.icon-xiangzuo {
		color: #fff;
	}

	.goods {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		padding-left: 24rpx;
		background-color: #F5F5F5;
		width: 100%;
	}

	.proList {
		margin-top: 256rpx;
	}

	.merList {
		position: relative;
		top: 154rpx;
		z-index: 66;
	}

	.merBox {
		/deep/.tui-drawer-container {
			width: 635rpx;
		}
	}

	.mer {
		&-nav {
			top: 80rpx !important;
			border-radius: inherit !important;
		}

		&-list {
			margin-top: 248rpx !important;
		}

		&-listBox {
			position: relative;
			top: -68rpx;
		}

		&-mt194 {
			margin-top: 260rpx !important;
		}

		&-mt100 {
			top: -200rpx !important;
		}
	}

	.no-shop {
		margin-top: 6rpx;
		background-color: #fff;
		padding-bottom: calc(100% - 109rpx);

		.pictrue {
			display: flex;
			flex-direction: column;
			align-items: center;

			//color: $uni-nothing-text;
			image {
				width: 414rpx;
				height: 380rpx;
			}
		}
	}

	.with50 {
		width: 50% !important;
	}

	.nav-wrapper {
		z-index: 9;
		position: fixed;
		left: 0;
		top: 86rpx;
		width: 100%;
		@include main_bg_color(theme);

		.tab-bar {
			display: flex;
			align-items: center;
			height: 131rpx;

			.tab-item {
				position: relative;
				flex: 1;
				display: flex;
				justify-content: center;
				align-items: center;
				padding-bottom: 40rpx;
				color: #fff;
				font-size: 28rpx;
				font-weight: bold;
				margin-top: -36rpx;

				&::after {
					content: ' ';
					position: absolute;
					left: 50%;
					bottom: 34rpx;
					width: 60rpx;
					height: 3rpx;
					background: transparent;
					transform: translateX(-50%);
				}

				&.on {
					&::after {
						background: #fff;
					}
				}
			}
		}
	}

	.bg_color {
		@include main_bg_color(theme);
	}

	.font_color {
		@include main_color(theme);
	}

	.x-money {
		font-size: 38rpx;
		font-weight: 900;
		@include price_color(theme);
	}

	.iconfont {
		//color: #fff;
	}

	.listBox {
		margin-top: 240rpx !important;
		background-color: #FFFFFF;
	}

	.fixed-top {
		position: fixed;
		top: 0;
		left: 0;
		z-index: 9;
	}

	.productList .search {
		width: 100%;
		height: 86rpx;
		padding: 0 30rpx;
		box-sizing: border-box;
		position: fixed;
		top: 0 !important;
		left: 0;
		z-index: 666;
		color: #fff;

	}

	.productList .search .input {
		width: 570rpx;
		height: 60rpx;
		background-color: #fff;
		border-radius: 50rpx;
		padding: 0 20rpx;
		box-sizing: border-box;
		color: #333;
	}

	.productList .search .input input {
		width: 88%;
		height: 100%;
		font-size: 26rpx;
	}

	.productList .search .input .placeholder {
		color: #CCCCCC;
	}

	.productList .search .input .iconfont {
		font-size: 26rpx;
		color: #999999;
	}

	.productList .search .icon-yangshi1,
	.icon-shaixuan {
		color: #fff;
		width: 62rpx;
		font-size: 40rpx;
		height: 86rpx;
		line-height: 86rpx;
		text-align: right;
	}

	.productList .nav {
		height: 86rpx;
		color: #454545;
		position: fixed;
		left: 0;
		width: 100%;
		font-size: 28rpx;
		background-color: #fff;
		top: 154rpx;
		z-index: 9;
		border-radius: 16rpx 16rpx 0rpx 0rpx;
		padding-left: 20rpx;
	}

	.productList .nav .item {
		width: 30%;
		text-align: center;

		.iconfont {
			//color: #fff;
		}
	}
	.item-c{
		width: 27% !important;
	}
	.item-icon{
		width: 8%;
		margin-left: 30rpx;
	}
	.item-shu{
		width: 1px;
		height: 12px;
		background: #666666;
		opacity: 0.2;
	}
	.productList .nav .item.font-color {
		font-weight: bold;
	}

	.productList .nav .item image {
		width: 15rpx;
		height: 19rpx;
		margin-left: 10rpx;
	}


	.productList .list.on {
		padding-top: 30rpx !important;
		background-color: #fff;
		border-top: 1px solid #F5F5F5;
	}

	.productList .list .item {
		width: 335rpx;
		background-color: #fff;
		border-radius: 14rpx;
		margin-bottom: 20rpx;
	}

	.productList .list .item.on {
		width: 100%;
		display: flex;
		padding: 0 24rpx 60rpx 24rpx;
		margin: 0;
		border-radius: 14rpx;
	}

	.productList .list .item .pictrue {
		position: relative;
		// width: 100%;
	}

	.productList .list .item .pictrue /deep/.easy-loadimage {
		width: 240rpx;
		height: 240rpx;
		border-radius: 14rpx;
		overflow: hidden;
	}

	.productList .list .item .pictrue image {
		width: 100%;
		height: 100%;
		border-radius: 20rpx 20rpx 0 0;
		overflow: hidden;
	}

	.productList .list .item .pictrue image.on {
		border-radius: 6rpx;
	}

	.productList .list .item .text {
		padding: 18rpx 20rpx;
		font-size: 30rpx;
		color: #222;
	}

	.productList .list .item .text.on {
		width: 456rpx;
		padding: 0 0 0 20rpx;
		position: relative;

		&::after {
			content: '';
			display: block;
			width: 94%;
			border-bottom: 1rpx solid #f6f6f6;
			position: absolute;
			right: 2rpx;
			bottom: -24rpx;
		}

		.name {
			height: 84rpx;
			line-height: 42rpx;
		}
	}

	.productList .list .item .text .money {
		font-size: 26rpx;
		font-weight: bold;
		margin-top: 8rpx;
	}

	.productList .list .item .text .money.on {
		margin-top: 50rpx;
	}

	.productList .list .item .text .money .num {
		font-size: 34rpx;
	}

	.productList .list .item .text .vip {
		font-size: 20rpx;
		color: #aaa;
	}

	.productList .list .item .text .vip .vip-money {
		font-size: 24rpx;
		color: #282828;
		font-weight: bold;
	}

	.productList .list .item .text .vip .vip-money image {
		width: 46rpx;
		height: 21rpx;
		margin-left: 4rpx;
	}

	.row-between-wrapper .input {
		height: 60rpx;
		margin: 10rpx 0 16rpx;
	}
	.box-line2 {
		overflow: hidden;
	}
</style>