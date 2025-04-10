<template>
	<view :data-theme="theme" class="discover_index">
		<view class="page_con">
			<view class="discover-header bg--w111-fff relative z-999">
				<!-- #ifdef APP || MP -->
				<view class="sys-head" :style="{ height: sysHeight+'px' }"></view>
				<!--  #endif -->
				<view class="discover-navTab acea-row row-middle" :style="[headerBoxStyle]">
					<image @click="goUser" class="avatar"
						:src="userInfo.avatar ? userInfo.avatar : urlDomain+'crmebimage/presets/morenT.png'">
					</image>
					<view class="acea-row row-center-wrapper" :style="[textBoxStyle]">
						<view :class="tabActive == 0 ? 'on' : ''" class="nav-item"
							@click="tabActive=0;showCateDrawer = false">关注</view>
						<view :class="tabActive == 1 ? 'on' : ''" class="nav-item" @click="tabActive=1;">发现</view>
						<view style="width: 32rpx;">
							<navigator v-show="tabActive == 1" url="/pages/discover/discover_search_list/index"
								hover-class="none" class="search">
								<text class="iconfont icon-xiazai5"></text>
							</navigator>
						</view>
					</view>
					<!-- #ifndef MP -->
					<view style="width: 32rpx;"></view>
					<!-- #endif -->
				</view>
				<!-- 话题分类 -->
				<view class="longTab" scroll-y enhanced>
					<view class="flex" :class="tabActive == 1?'h96':'h36'">
						<scroll-view v-if="tabActive == 1" scroll-x="true" style="white-space: nowrap; display: flex;"
							scroll-with-animation class="menu" :scroll-left="tabLeft" :show-scrollbar="false">
							<view class="longItem" :data-index="index" :class="index === tabClick ? 'click' : ''"
								v-for="(item, index) in categoryList" :key="index" :id="'id' + index"
								@click.stop="selectMenu(item, index, true)">
								<text>{{ item.name }}</text>
							</view>
						</scroll-view>
						<view v-show="tabActive == 1" class="w-76 h-100 flex-center topic-box"
							@tap="showCateDrawer = !showCateDrawer">
							<text class="iconfont fs-24"
								:class="!showCateDrawer?'icon-xiala3':'icon-xiangshang2'"></text>
						</view>
					</view>
				</view>

				<!-- :style="{top: sysHeight + 38 + 'px'}" -->

			</view>

			<!-- 话题分类下拉 -->
			<view class="fixed-lt w-full bg--w111-fff rd-b-24rpx z-100 pt-22" v-if="showCateDrawer"
				:style="{top: listMarTop + 'px'}">
				<view class="w-full pr-20 pb-30 pl-30">
					<view class="flex flex-wrap">
						<view class="h-58 bg--w111-f5f5f5 rd-29rpx px-24 flex-center fs-24 mr-14 mb-28"
							v-for="(item,index) in categoryList" :key="index"
							:class="{'active-topic': index === tabClick}" @tap="selectMenu(item, index)">
							{{item.name}}
						</view>
					</view>
				</view>
			</view>
			<view class="mask z-80" v-if="showCateDrawer" @tap="()=>{showCateDrawer = false}"></view>

			<view class="discover-box">
				<!-- 发现 -->
				<scroll-view scroll-y="true" @scroll="followScroll" class="main">
					<view class="tab-cont" id="main">
						<!-- 发现 -->
						<view v-if="tabActive === 1">
							<swiper :interval="interval" indicator-color="rgba(255,255,255,0.6)"
								:current="swiperCurrent" @change="swiperChange" :style="'height:'+swiperHeight+'px'">
								<block v-for="(item,index) in categoryList" :key="index">
									<swiper-item :item-id="`${item.id}`">
										<scroll-view @scroll="scrollLeft" scroll-y="true" :show-scrollbar="false"
											class="scroll-view" :style="'height:'+swiperHeight+'px'" id="goods"
											refresher-enabled="true" :refresher-threshold="100"
											:refresher-triggered="triggeredDiscover"
											@refresherrefresh="onRefreshDiscover" @refresherpulling="onPulling"
											@refresherrestore="onRestore" @refresherabort="onAbort">
											<view class="goods padbottom">
												<view class="goods-wrap" id="goods"
													v-if="discoverList[item.id] && discoverList[item.id].goods.length">
													<view>
														<WaterfallsFlow v-if="discoverList[item.id].goods.length"
															
															:wfList="discoverList[item.id].goods" :fromType="1">
														</WaterfallsFlow>
													</view>
												</view>
												<view class='loadingicon acea-row row-center-wrapper'>
													<text class='loading iconfont icon-jiazai'
														:hidden='loading==false'></text>{{discoverList[item.id] &&discoverList[item.id].goods.length>0?loadTitle:''}}
												</view>
												<view class="empty-boxs noContent"
													v-if="discoverList[item.id] && discoverList[item.id].goods.length == 0 && !loading">
													<emptyPage title="暂无内容~" mTop="13%"
														:imgSrc="urlDomain+'crmebimage/presets/noguanzhu.png'">
													</emptyPage>
												</view>
												<view class="footerBottoms"></view>
											</view>

										</scroll-view>
									</swiper-item>
								</block>
							</swiper>
						</view>

						<!-- 关注 登录后 -->
						<view id="goods" v-if="isLogin&&tabActive == 0" class="discover-detail">
							<scroll-view scroll-y="true" :show-scrollbar="false" class="scroll-view recommendList"
								:style="'height:'+swiperHeight+'px'" id="recommendList"
								@scrolltolower="onTouchmoveRecommend" :refresher-threshold="100" @scroll="followScroll"
								refresher-enabled="true" :refresher-triggered="triggered" @refresherrefresh="onRefresh"
								@refresherpulling="onPulling" @refresherrestore="onRestore" @refresherabort="onAbort">
								<view class="goods padbottom">
									<view class="goods-wrap" id="goods" v-if="noteRecommendList.length">
										<view>
											<WaterfallsFlow v-if="noteRecommendList.length" :wfList="noteRecommendList"
												:fromType="1">
											</WaterfallsFlow>
										</view>
									</view>
									<view :hidden='loadingfollow==false'
										class='loadingicon acea-row row-center-wrapper'>
										<text
											class='loading iconfont icon-jiazai'></text>{{noteRecommendList.length>0?loadTitleFollow:''}}
									</view>
									<view
										v-if="isLogin&&tabActive == 0 && noteRecommendList.length===0 &&!loadingfollow"
										class="empty-boxs noContent">
										<emptyPage title="暂无更多内容~" mTop="0%"
											:imgSrc="urlDomain+'crmebimage/presets/noguanzhu.png'"></emptyPage>
									</view>
								</view>

								<!-- <discover-details v-if="noteRecommendList.length>0" type="follow"
									:noteRecommendList="noteRecommendList" @getComment="getComment"
									@getPro="getPro"></discover-details> -->

								<!-- 为你推荐 -->
								<view v-if="authorList.length>0 && !loadingfollow" class="author-list mt-24">
									<title-box title="为你推荐"></title-box>
									<view v-for="(item, index) in authorList" :key="item.authorId" class="author-item"
										@click="goAuthor(item)">
										<view class="acea-row row-between row-middle mb30">
											<view class="acea-row row-middle">
												<view class="author-head">
													<image :src="item.authorAvatar"></image>
												</view>
												<view class="author-info">
													<view class="author-name">{{item.authorName}}</view>
													<view v-show="item.authorSignature" class="author-sign line1">
														{{item.authorSignature}}
													</view>
													<view class="author-fans">
														粉丝<text
															class="text-333 ml-8">{{ item.fansNum < 10000 ? item.fansNum : (item.fansNum / 10000).toFixed(2) }}</text>
													</view>
												</view>
											</view>
											<view @click.stop="followAuthor(item, index)" class="author-follow acea-row"
												:class="item.isConcerned ? 'focusBtn' : ''">
												<text v-if="!item.isConcerned"
													class="iconfont icon-shangpinshuliang-jia"></text>
												{{!item.isConcerned ? '关注' : '已关注'}}
											</view>
										</view>
										<scroll-view scroll-x="true" class="white-nowrap vertical-middle w-full"
											show-scrollbar="false">
											<view class="inline-block mr-20" v-for="items in item.noteList"
												:key="items.id">
												<view class="relative">
													<easy-loadimage :image-src="items.cover" width="184rpx"
														height="254rpx" :radius="8"></easy-loadimage>
													<view class="discover_video_icon" v-show="items.type == 2">
														<text class="iconfont icon-24gf-play"></text>
													</view>
												</view>
											</view>
										</scroll-view>
									</view>
									<view class='loadingicon acea-row row-center-wrapper'>
										<text class='loading iconfont icon-jiazai'
											:hidden='loading==false'></text>{{authorList.length>0?loadTitle:''}}
									</view>
								</view>
								<view class="footerBottoms"></view>
							</scroll-view>
						</view>
						<!-- 关注未登录 -->
						<view class="empty-boxs" v-if="!isLogin&&tabActive == 0">
							<emptyPage title="登录后可查看关注用户的内容哦~" mTop="30%"
								:imgSrc="urlDomain+'crmebimage/presets/nodenglu.png'"></emptyPage>
							<view class="btn" @click="openAuto">立即登录</view>
						</view>
					</view>
				</scroll-view>
			</view>
			<view class="publish" @click="publish" :class="bottomNavigationIsCustom?'bottom':''"><text
					class="iconfont icon-ic_edit"></text></view>

		</view>
		<pageFooter v-if="isShowFooter"></pageFooter>

		<!-- 评论 -->
		<uni-popup type="bottom" ref="comment">
			<view
				:style="'width: '+ windowWidth +'px; background-color: #fff; border-top-left-radius: 10px; border-top-right-radius: 10px;'">
				<discoverComment v-if="showComment" @getReplyNum="getReplyNum" :noteId="noteDetails.id"
					:noteDetails="noteDetails" @close="close">
				</discoverComment>
			</view>
		</uni-popup>
		<!-- 商品列表 -->
		<uni-popup type="bottom" ref="goods">
			<mentioned v-if="popupShow" :list="proList" @close="popup" class=""></mentioned>
		</uni-popup>
	</view>
</template>

<script>
	import {
		mapGetters
	} from "vuex";
	import {
		toLogin
	} from '@/libs/login.js';
	import {
		BACK_URL
	} from '@/config/cache';
	import {
		communityCategoryListApi,
		recommendAuthorListApi,
		discoverListApi,
		followListApi
	} from '@/api/discover.js';
	import {
		discoverFollowAuthor,
	} from '@/libs/follow.js';
	import {
		tokenIsExistApi
	} from '@/api/api.js';
	import {
		silenceBindingSpread,
		getUserSpread
	} from '@/utils/index.js';
	import onShare from "@/mixins/onShare";
	import discoverComment from '@/components/discoverComment/index.vue';
	import animationType from '@/utils/animationType.js'
	import pageFooter from "@/components/pageFooter/index.vue";
	import navBar from '@/components/navBar';
	import emptyPage from '@/components/emptyPage.vue';
	import easyLoadimage from '@/components/base/easy-loadimage.vue';
	import WaterfallsFlow from '@/components/WaterfallsFlow/WaterfallsFlow.vue'
	import WaterfallsFlowItem from '@/components/discoverFlowItem/discoverFlowItem.vue'
	import discoverDetails from '@/components/discoverDetails/index.vue'
	import mentioned from '@/components/mentioned.vue';
	import TitleBox from '@/components/titleBox/index.vue';
	let app = getApp();
	let sysHeight = uni.getSystemInfoSync().statusBarHeight;
	export default {
		mixins: [onShare],
		components: {
			pageFooter,
			navBar,
			emptyPage,
			easyLoadimage,
			WaterfallsFlowItem,
			WaterfallsFlow,
			discoverDetails,
			discoverComment,
			mentioned,
			TitleBox
		},
		computed: {
			...mapGetters(['globalData', 'isLogin', 'userInfo', 'bottomNavigationIsCustom']),
			headerBoxStyle(){
				return {
					// #ifndef MP
					paddingTop:'4rpx',
					// #endif
					// #ifdef MP
					paddingTop: this.marTop + "px",
					marginRight:this.statusWidth + this.searchRight+'px',
					// #endif
				}
			},
			textBoxStyle(){
				return {
					// #ifdef MP
					height:this.searchHeight + 'px',
					lineHeight:this.searchHeight + 'px',
					// #endif
				}
			}
		},
		onLoad(options) {
			//分销码
			getUserSpread(options);
			
			this.windowWidth = uni.getSystemInfoSync().screenWidth; //获取屏幕宽度
			tokenIsExistApi().then(res => {
				this.tokenIsExist = res.data;
				if (this.tokenIsExist && this.isLogin) {
					this.getFollowList();
					setTimeout(() => {
						if (this.noteRecommendList.length === 0 || this.loadendfollow) this
							.getRecommendAuthorList();
					}, 500)
				}
				if (!this.tokenIsExist) {
					this.$store.commit('UPDATE_LOGIN', '');
					this.$store.commit('UPDATE_USERINFO', {});
				}
			})
			this.getDiscoverList();
			this.getCommunityCategoryList();

			this._freshing = false;
		},
		data() {
			return {
				urlDomain: this.$Cache.get("imgHost"),
				sysHeight: sysHeight,
				windowWidth: 0, //获取屏幕宽度🌟💗
				interval: 3000,
				swiperHeight: 0,
				listMarTop: 0,
				tabClick: 0, //设置导航点击了哪一个
				tabLeft: 0, //设置下划线位置
				isLeft: 0, //导航栏下划线位置
				isWidth: 0, //每个导航栏占位
				tabActive: 1, // 顶部关注、发现切换
				windowHeight: 0,
				theme: app.globalData.theme,
				marTop: 0,
				categoryList: [], //分类列表
				categoryId: '', //分类id
				swiperCurrent: 0, //分类索引
				isScroll: false, //是否是滑动
				params: { //推荐作者
					page: 1,
					limit: 10
				},
				followParams: { //关注内容
					page: 1,
					limit: 10
				},
				noteRecommendList: [], //关注内容
				loadendfollow: false, //关注内容
				loadingfollow: false, //关注内容
				where: {
					categoryId: 0,
					page: 1,
					limit: 10
				},
				loadend: false,
				loading: false,
				loadTitle: '加载更多',
				loadTitleFollow: '加载更多',
				onnnn: {
					good: [{
						authorId: 1
					}]
				},
				discoverList: {}, //内容信息
				authorList: [], //推荐作者列表
				isOpenRefresh: true, // 是否开启下拉
				triggered: false,
				triggeredDiscover: false,
				isShow: false, //加载完成
				tokenIsExist: false, //校验token是否有效,true为有效，false为无效
				isRefresher: false, //下拉刷新状态
				noteDetails: {}, //内容详情
				popupShow: false, //商品弹窗
				showComment: false, //评论弹窗
				proList: [], //提到的商品
				isShowFooter: true,
				loadingAuthor: false, //推荐作者
				showCateDrawer: false, //分类下拉展示
				searchRight:0,
				statusWidth:0,
				searchHeight:0,
			}
		},
		// 滚动监听
		onPageScroll(e) {
			// 传入scrollTop值并触发所有easy-loadimage组件下的滚动监听事件
			uni.$emit('scroll');
		},
		onShow() {
			this.showCateDrawer = false;
			this.getTokenIsExist();
            //分销绑定
            silenceBindingSpread(this.isLogin, this.globalData.spread);
		},
		mounted() {
			this.$nextTick(function() {
				const query = uni.createSelectorQuery().in(this);
				query.select('.discover-header').boundingClientRect(data => {
					// #ifndef H5
					this.listMarTop = data.height
					// #endif
					// #ifdef H5
					this.listMarTop = data.height
					// #endif
				}).exec();
			});
		},
		created() {
			var that = this;
			// 获取设备宽度
			uni.getSystemInfo({
				success(e) {
					that.isWidth = e.windowWidth / 6;
					that.windowHeight = e.windowHeight;
					that.swiperHeight = that.windowHeight - 205
					that.$set(that, 'swiperHeight', that.windowHeight - 55);
				}
			});
			that.getNavH()
			
			// #ifdef MP
			const res = uni.getMenuButtonBoundingClientRect()
			const jnHeight = res.height //胶囊高度
			const statusHeight = res.top //胶囊距离顶部
			const statusRight = res.right //胶囊右边界坐标
			this.statusWidth= res.width
			this.searchHeight=jnHeight
			console.log('999',statusHeight,this.sysHeight);
			this.marTop=statusHeight-this.sysHeight
			//搜索框宽度计算
			uni.getSystemInfo({
				success:res=>{
					this.searchRight=res.windowWidth-statusRight
				}
			})
			// #endif
		},
		//uniapp小程序用deep重写组件样式不生效
		options: {
			styleIsolation: 'shared'
		},
		methods: {
			getNavH(marTop) {
				// #ifdef H5
				this.marTop = 30;
				// #endif
				// #ifdef APP
				this.marTop = marTop - 60;
				// #endif
			},
			getPro(item) {
				this.noteDetails = item;
				this.proList = item.productList;
				this.$refs.goods.open('bottom');
				this.popupShow = true;
				setTimeout(() => {
					if (!this.bottomNavigationIsCustom) {
						uni.hideTabBar();
					} else {
						this.isShowFooter = false;
					}
				}, 50)
			},
			popup() {
				if (!this.bottomNavigationIsCustom) {
					uni.showTabBar();
				} else {
					this.isShowFooter = true;
				}
				setTimeout(() => {
					this.$refs.goods.close();
					this.popupShow = false;
				}, 100)

			},
			close() {
				if (!this.bottomNavigationIsCustom) {
					uni.showTabBar();
				} else {
					this.isShowFooter = true;
				}
				setTimeout(() => {
					this.$refs.comment.close();
					this.showComment = false;
				}, 100);
			},
			getReplyNum(n) {
				this.noteDetails.replyNum = n;
			},
			getComment(item) {
				this.noteDetails = item;
				this.$refs.comment.open('bottom');
				this.showComment = true;
				setTimeout(() => {
					if (!this.bottomNavigationIsCustom) {
						uni.hideTabBar();
					} else {
						this.isShowFooter = false;
					}
				}, 50)
			},
			//校验token是否有效,true为有效，false为无效
			getTokenIsExist() {
				tokenIsExistApi().then(res => {
					this.tokenIsExist = res.data;
					if (!this.tokenIsExist) {
						this.$store.commit('UPDATE_LOGIN', '');
						this.$store.commit('UPDATE_USERINFO', {});
					}
				})
			},
			// 去推荐作者个人主人
			goAuthor(item) {
				// #ifdef MP || H5
				uni.navigateTo({
					url: `/pages/discover/discover_user/index?id=${item.authorId}`
				})
				// #endif  
				// #ifdef APP-PLUS
				uni.navigateTo({
					animationType: animationType.type,
					animationDuration: animationType.duration,
					url: `/pages/discover/discover_user/index?id=${item.authorId}`
				})
				// #endif
			},
			// 自定义下拉刷新被中止
			onAbort() {
				console.error("onAbort");
			},
			onPulling(e) {
				if (e.detail.deltaY < 0) return // 防止上滑页面也触发下拉
				if (this.tabActive == 1) {
					this.triggeredDiscover = true;
				} else {
					this.triggered = true;
				}
			},
			// 下拉刷新触发
			refresherpullingFun() {
				this.isRefresher = true
			},
			onRefreshDiscover() {
				if (this._freshing) return;
				this._freshing = true;
				setTimeout(() => {
					this._freshing = false;
					this.discoverList = {}
					this.getDiscoverList();
					this.triggeredDiscover = false;
					uni.stopPullDownRefresh();
					this._freshing = false;
				}, 1000)
			},
			onRefresh() {
				if (this._freshing) return;
				this._freshing = true;
				setTimeout(() => {
					this.loadendfollow = false;
					this.loadend = false;
					this.noteRecommendList = [];
					this.followParams.page = 1;
					this.authorList = [];
					this.params.page = 1;
					this.getFollowList();
					setTimeout(() => {
						if (this.noteRecommendList.length === 0 || this.loadendfollow) this
							.getRecommendAuthorList();
					}, 400)
					this.triggered = false
					uni.stopPullDownRefresh();
					this._freshing = false;
				}, 1000)
			},
			onRestore() {
				this.triggeredDiscover = false;
			},
			//关注内容 
			getFollowList() {
				if (this.loadendfollow) {
					this.triggered = false;
					return;
				}
				this.loadingfollow = true;
				followListApi(this.followParams).then(res => {
					this.$set(this.followParams, 'page', this.followParams.page + 1);
					this.loadendfollow = this.followParams.page > res.data.totalPage;
					this.loadTitleFollow = this.loadendfollow ? '' : '加载更多';
					this.noteRecommendList = this.noteRecommendList.concat(res.data.list || []);
					this.loadingfollow = false
					this.triggered = false;
				}).catch(err => {
					this.loadingfollow = false;
					this.triggered = false;
					uni.showToast({
						title: err,
						icon: 'none'
					})
				});
			},
			// 关注作者
			followAuthor(item) {
				if (this.isLogin) {
					discoverFollowAuthor(item.authorId).then(() => {
						this.$set(item, 'isConcerned', !item.isConcerned);
					});
				} else {
					toLogin();
				}
			},
			//回退页面之后重新加载页面
			reFresh() {
				this.loading = true
				this.discoverList = {};
				this.getDiscoverList();
			},
			//发布内容
			publish() {
				if (this.isLogin) {
					// #ifdef MP || H5
					uni.navigateTo({
						url: `/pages/discover/discover_release/index`
					})
					// #endif  
					// #ifdef APP-PLUS
					uni.navigateTo({
						animationType: animationType.type,
						animationDuration: animationType.duration,
						url: `/pages/discover/discover_release/index`
					})
					// #endif
				} else {
					toLogin();
				}
			},
			/**
			 *  发现列表滑动中用到的方法
			 */
			followScroll() {
				uni.$emit('scroll');
			},
			onTouchmoveRecommend(e) {
				if (!this.loadendfollow) this.getFollowList();
				if (this.loadendfollow && !this.loadend) this.getRecommendAuthorList();
			},
			onTouchmove(e) {
				this.getDiscoverList();
			},
			scrollLeft: function(e) {
				uni.$emit('scroll');
				if (e.detail.scrollTop > e.detail.scrollHeight - 1500) {
					this.getDiscoverList();
				}
				this.swiperHeight = this.windowHeight - 55
			},
			swiperChange(e) {
				let {
					current,
					source,
					currentItemId
				} = e.detail;
				if (source === 'autoplay' || source === 'touch') {
					this.categoryId = currentItemId;
					this.swiperCur = current
					this.selectMenu(this.categoryList[this.swiperCur], this.swiperCur, false)
					if (this.categoryList.length > 3) {
						var tempIndex = this.swiperCur - 2;
						tempIndex = tempIndex <= 0 ? 0 : tempIndex;
						let tabLeft = (this.swiperCur - 2) * this.isWidth; //设置下划线位置
						this.$nextTick(function() {
							this.$set(this, 'tabLeft', tabLeft);
						});
					}
				}
			},
			/*******************发现列表滑动中用到的方法结束*********************/

			// 去个人主人
			goUser() {
				if (!this.isLogin) {
					this.openAuto();
				} else {
					// #ifdef MP || H5
					uni.navigateTo({
						url: '/pages/discover/discover_user/index'
					})
					// #endif  
					// #ifdef APP-PLUS
					uni.navigateTo({
						animationType: animationType.type,
						animationDuration: animationType.duration,
						url: '/pages/discover/discover_user/index'
					})
					// #endif
				}
			},
			// 打开授权
			openAuto() {
				this.$Cache.set(BACK_URL, '')
				toLogin();
			},
			//发现列表
			getDiscoverList() {
				let that = this;
				this.isShow = false;
				if (!this.discoverList[this.categoryId]) {
					this.$set(this.discoverList, this.categoryId, {
						where: {
							...this.where,
							categoryId: this.categoryId
						},
						goods: []
					})
				}
				const data = this.discoverList[this.categoryId];
				const cateId = this.categoryId;
				if (data.loading || data.loadend) {
					this.triggeredDiscover = false;
					return
				};
				data.loading = true
				this.loading = true
				this.loadTitle = '';
				if (data.where.categoryId === 0) data.where.categoryId = ''
				discoverListApi(data.where).then(res => {
					data.loadend = res.data.list.length < that.where.limit;
					if (data.where.page == 1) {
						data.goods = [];
					}
					this.loadTitle = data.loadend ? '没有了' : '加载更多';
					data.goods.push.apply(data.goods, res.data.list);
					data.where.page = data.where.page + 1;
					that.$nextTick(() => {
						that.$set(that.discoverList, cateId, {
							...data
						});

					});
					data.loading = false;
					this.loading = false;
					this.triggeredDiscover = false;
					this.$forceUpdate()
				}).catch(err => {
					data.loading = false;
					this.loading = false;
					uni.showToast({
						title: err,
						icon: 'none'
					})
					this.$set(this.discoverList, cateId, data);
				});
			},
			//推荐作者列表
			getRecommendAuthorList() {
				if (this.loadend) return;
				this.loading = true
				recommendAuthorListApi(this.params).then(res => {
					this.$set(this.params, 'page', this.params.page + 1);
					this.loadend = this.params.page > res.data.totalPage;
					this.authorList = this.authorList.concat(res.data.list || []);
					this.loadTitle = this.loadend ? '没有了' : '加载更多';
					this.loading = false
				})
			},
			//分类列表
			getCommunityCategoryList() {
				let data = [{
					name: "推荐",
					id: ''
				}];
				communityCategoryListApi().then(res => {
					this.categoryList = Array.from(new Set([...data, ...res.data]));
				})
			},

			// 点击列表头部
			selectMenu(item, index, isScroll) {
				this.triggeredDiscover = false;
				this.categoryId = item.id;
				this.swiperCurrent = index;
				this.isScroll = isScroll;
				this.tabClick = index; //设置导航点击了哪一个
				this.isLeft = index * this.isWidth; //设置下划线位置
				this.where.categoryId = item.id;
				this.showCateDrawer = false
				this.getDiscoverList();
			},
		}
	}
</script>

<style lang="scss" scoped>
	/deep/.wf-page{
		background-color: #fff !important;
	}
	.discover_video_icon {
		top: 50% !important;
		left: 50% !important;
		right: 0 !important;
		-webkit-transform: translate(-50%, -50%);
		transform: translate(-50%, -50%);
	}

	.active-topic {
		@include main_color(theme);
		@include coupons_light_color(theme);
		@include coupons_border_color(theme);
	}

	.padbottom {
		/* #ifndef H5 */
		padding-bottom: calc(100rpx+ constant(safe-area-inset-bottom)) !important; ///兼容 IOS<11.2/
		padding-bottom: calc(100rpx + env(safe-area-inset-bottom)) !important;
		/* #endif */
	}

	.bottom {
		bottom: 218rpx !important;
	}

	.footerBottoms {
		width: 100%;
		/* #ifndef H5 */
		height: calc(200rpx+ constant(safe-area-inset-bottom)) !important; ///兼容 IOS<11.2/
		height: calc(200rpx + env(safe-area-inset-bottom)) !important;
		/* #endif */
		/* #ifdef H5 */
		height: calc(100rpx+ constant(safe-area-inset-bottom)) !important; ///兼容 IOS<11.2/
		height: calc(100rpx + env(safe-area-inset-bottom)) !important;
		/* #endif */
	}

	.discover_index {
		/deep/.no-border {
			bottom: 40rpx;
		}

		/deep/.author-list {
			padding-left: 24rpx;
			padding-right: 24rpx;
		}

	}

	.menu {
		padding: 20rpx 34rpx 0 34rpx;
		box-sizing: border-box;
		width: 676rpx;
	}

	.page_con {
		position: fixed;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		display: flex;
		flex-direction: column;
	}

	.empty-boxs {
		margin: auto;
	}

	.goods {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		padding: 0 24rpx;
		background: #ffffff;
	}

	.publish {
		position: fixed;
		z-index: 9999;
		width: 100rpx;
		height: 100rpx;
		opacity: 1;
		border-radius: 50%;
		bottom: 142rpx;
		right: 24rpx;
		color: #fff;
		line-height: 100rpx;
		text-align: center;
		@include linear-gradient(theme);

		.iconfont {
			font-size: 50rpx;
		}
	}

	.main {
		width: 100%;
	}

	.author {
		&-item {
			padding-bottom: 40rpx;
		}

		&-title {
			height: 120rpx;
			line-height: 120rpx;
			font-size: 32rpx;
			color: #333333;

			.iconfont {
				font-size: 170rpx;
				color: #454545;
			}

			.lefticon {
				transform: rotate(180deg);
			}
		}

		.name {
			margin: 0 28rpx;
		}

		&-head {
			width: 80rpx;
			height: 80rpx;
			border-radius: 50%;
			overflow: hidden;

			image {
				width: 100%;
				height: 100%;
			}

			margin-right: 20rpx;
		}

		&-name {
			font-size: 28rpx;
			font-family: PingFang SC-Medium, PingFang SC;
			font-weight: 600;
			color: #282828;
		}

		&-sign,
		&-fans {
			font-size: 22rpx;
			font-family: PingFang SC-Regular, PingFang SC;
			font-weight: 400;
			color: #999999;
		}

		&-sign {
			width: 370rpx;
		}

		&-pictrue {
			width: 222rpx;
			height: 222rpx;
			border-radius: 10px 10px 10px 10px;
			opacity: 1;
			margin-right: 18rpx;


			/deep/image,
			/deep/.easy-loadimage,
			uni-image {
				width: 100%;
				height: 100%;
				border-radius: 10px 10px 10px 10px;
				overflow: hidden;
			}
		}

		&-pictrue:nth-of-type(3n) {
			margin-right: 0;
		}

	}

	.noContent {
		/deep/.empty-box {
			padding-top: 80rpx !important;

		}
	}

	.btn {
		width: 440rpx;
		height: 86rpx;
		line-height: 86rpx;
		text-align: center;
		border-radius: 43rpx 43rpx 43rpx 43rpx;
		opacity: 1;
		border: 1px solid #E93323;
		font-size: 32rpx;
		margin: auto;
		font-family: PingFang SC-Medium, PingFang SC;
		@include main_color(theme);
		@include coupons_border_color(theme);
		font-weight: 600;

	}

	.cart_nav {
		/deep/.nav_title {
			font-size: 36rpx;
			color: #333333;
		}
	}

	.discover {
		&-header {
			background-size: cover;
			top: 0;
			left: 0;

			.title {
				font-size: 36rpx;
				color: #333333;
			}
		}

		&-navTab {
			padding: 0 34rpx 0 34rpx;
			justify-content: space-between;

			.icon-xiazai5 {
				color: #333;
			}

			.nav-item {
				font-size: 32rpx;
				color: #666666;

				margin-right: 52rpx;

				&.on {
					font-size: 38rpx;
					color: #333;
					font-weight: bold;
				}
			}

			.release_btn {
				width: 58rpx;
				height: 58rpx;
				border-radius: 100%;
				background-image: linear-gradient(126deg, var(--view-bntColor21) 0%, var(--view-bntColor22) 100%);
				color: #fff;
				position: absolute;
				top: 20rpx;
				left: 0;

				.iconfont {
					font-size: 28rpx;
				}
			}

			.avatar {
				width: 64rpx;
				height: 64rpx;
				border-radius: 50%;
			}
		}

		&-box {
			flex: 1;
			min-height: 83vh;
			height: auto;
			width: 100%;
			background-color: #fff;
			left: 0;
		}
	}

	.h96 {
		height: 96rpx;
	}

	.h36 {
		/* #ifdef H5 */
		height: 28rpx;
		/* #endif */
		/* #ifndef H5 */
		height: 18rpx;
		/* #endif */
	}

	.longTab {
		width: 100%;

		background: #fff;
		border-radius: 16rpx 16rpx 0 0;

		.longItem {
			height: 50upx;
			display: inline-block;
			text-align: center;
			font-size: 30rpx;
			color: #999999;
			margin-right: 56rpx;

			text {
				display: block;
				max-width: 326rpx;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}

			&:last-child {
				margin-right: 0;
			}

			/*解决ios上滑动不流畅*/
			-webkit-overflow-scrolling: touch;
			position: relative;

			&.click {
				font-weight: bold;
				font-size: 34rpx;
				@include main_color(theme);

				&::after {
					content: "";
					display: block;
					width: 40rpx;
					height: 5rpx;
					@include main_bg_color(theme);
					display: flex;
					position: absolute;
					left: 50%;
					margin-left: -22rpx;
					bottom: -8rpx;
				}

				.underline {
					opacity: 1;
				}
			}
		}

		.underlineBox {
			height: 3px;
			width: 20%;
			display: flex;
			align-content: center;
			justify-content: center;

			.underline {
				opacity: 0;
				width: 60rpx;
				height: 4rpx;
				background-color: #e93323;
			}
		}
	}

	.author-fans {
		font-size: 24rpx !important;
	}
</style>