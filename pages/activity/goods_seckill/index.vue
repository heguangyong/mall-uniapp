<template>
	<view :data-theme="theme">
		<view class='cart_nav'>
			<view v-if="styleValue=='1'">
				<nav-bar ref="navBarRef" @getNavH='getNavH' iconColor='#fff' :navTitle="pageScrollStatus ? '限时秒杀' : ''"
					:backgroundColor="pageScrollStatus?'#e93323':''" :isBackgroundColor="false" :isHeight="false">
				</nav-bar>
			</view>
			<view v-else>
				<!-- #ifdef MP || APP-PLUS-->
				<nav-bar @getNavH='getNavH' iconColor='#fff' :isBackgroundColor="false" ref="navBarRef"
					:isHeight="false">
					<view slot='default' class="">
						<image class="seckill_title" src="../static/images/seckill_title.png" mode=""></image>
					</view>
				</nav-bar>
				<!--  #endif -->
			</view>
		</view>

		<view @touchstart="touchStart">
			<ListStyle v-if="styleValue=='1'" :pageScrollStatus="pageScrollStatus" :seckillList="seckillList"
				:timeLine="timeLine" :loading="loading" :active="active" @getCheckSeckill="getCheckSeckill"></ListStyle>
			<PageStyle v-if="styleValue=='2'" :tabLeft="tabLeft" :mainWidth="mainWidth" :datatime="datatime"
				:isWidth="isWidth" :desc="desc" :marTop="marTop" :seckillList="seckillList" :timeLine="timeLine"
				:loading="loading" :active="active" @getCheckSeckill="getCheckSeckill"></PageStyle>
		</view>
	</view>
</template>

<script>
	import {
		getSeckillHeaderApi,
		getSeckillListApi,
		seckillStyleApi
	} from '@/api/activity.js';
	import {
		silenceBindingSpread,
		getUserSpread
	} from '@/utils/index.js';
	import ListStyle from "../components/listStyle.vue";
	import PageStyle from "../components/pageStyle.vue";
	import navBar from '@/components/navBar';
	import {
		mapGetters
	} from "vuex";
	import onShare from "../../../mixins/onShare";
	let app = getApp();
	let sysHeight = uni.getSystemInfoSync().statusBarHeight + 'px';
	export default {
		mixins: [onShare],
		components: {
			navBar,
			ListStyle,
			PageStyle
		},
		computed: mapGetters(['isLogin', 'uid', 'globalData']),
		created() {
			var that = this
			// 获取设备宽度
			uni.getSystemInfo({
				success(e) {
					that.mainWidth = e.windowWidth
					that.isWidth = (e.windowWidth - 65) / 4
				}
			})
		},
		onPageScroll(object) {
			if (object.scrollTop > 200) {
				this.pageScrollStatus = true;
			} else if (object.scrollTop < 200) {
				this.pageScrollStatus = false;
			}
			uni.$emit('scroll');
		},
		data() {
			return {
				seckillList: [],
				timeList: [],
				active: 0,
				page: 1,
				limit: 5,
				loading: true,
				loadend: false,
				timeLine: [],
				showSkeleton: true, //骨架屏显示隐藏
				isNodes: 0, //控制什么时候开始抓取元素节点,只要数值改变就重新抓取
				circular: true,
				autoplay: true,
				interval: 500,
				topImage: '',
				scrollLeft: 0,
				status: 1,
				returnShow: true,
				navH: '',
				theme: this.$Cache.get("theme"),
				isLeft: 0,
				mainWidth: 0,
				tabLeft: 0,
				isWidth: 0,
				info: {},
				desc: '',
				datatime: 0,
				marTop: 0,
				activeTime: {},
				loadTitle: '',
				sysHeight: sysHeight,
				pageScrollStatus: false,
				styleValue: '1', //样式值
				title: '秒杀列表'
			}
		},
		onLoad(options) {
			this.getSeckillStyle();

			//分销码
			getUserSpread(options);

			setTimeout(() => {
				this.isNodes++;
			}, 500);
			var pages = getCurrentPages();
			this.returnShow = pages.length === 1 ? false : true;
			// #ifdef H5
			this.navH = app.globalData.navHeight - 18;
			// #endif
			this.getSeckillConfig();

		},
		onShow() {
			//分销绑定
			silenceBindingSpread(this.isLogin, this.globalData.spread);
		},
		methods: {
			//滚动
			touchStart() {
				this.$refs.navBarRef.currentPage = false;
			},
			//获取秒杀样式
			async getSeckillStyle() {
				let {
					code,
					data
				} = await seckillStyleApi();
				if (code === 200) this.styleValue = data;
			},
			getNavH(marTop) {
				this.marTop = marTop;
			},
			//点击时间段
			getCheckSeckill(index, item) {
				this.active = index;
				this.isLeft = -(index * this.isWidth) //设置下划线位置	
				this.tabLeft = (index - 2) * this.isWidth //设置下划线位置
				this.status = item.status;
				if (item.status == 1) {
					this.desc = '距本场结束';
					this.datatime = item.endTimeStamp / 1000;
				} else if (item.status == 2 || item.status == 3) {
					this.desc = '距本场开始';
					this.datatime = item.startTimeStamp / 1000;
				} else if (item.status == 0) {
					this.desc = '已结束';
				}
				this.loading = false;
				this.loadend = false;
				this.page = 1;

				this.activeTime = item;
				this.getSeckillList(item);

			},
			getSeckillConfig: function() {
				getSeckillHeaderApi().then(res => {
					this.timeLine = res.data;
					//找出第一个进行中的下标
					this.active = this.timeLine.length ? res.data.findIndex(item => item.status === 1 || item
						.status === 2) : 0;
					this.$nextTick(() => {
						this.tabLeft = (this.active - 2) * this.isWidth //选中的位置放在第一位
					})

					if (res.data[this.active].status == 1) {
						this.desc = '距本场结束';
						this.datatime = res.data[this.active].endTimeStamp / 1000;
						this.status = 1;
					} else if (res.data[this.active].status == 2) {
						this.desc = '距本场开始';
						this.status = 2;
						this.datatime = res.data[this.active].startTimeStamp / 1000;
					} else if (res.data[this.active].status == 0) {
						this.desc = '已结束';
						this.status = 0;
					}
					this.loading = false;
					this.loadend = false;
					this.page = 1;
					//this.seckillList = [];
					let item = this.timeLine[this.active];
					this.activeTime = item;
					this.getSeckillList(this.activeTime);

				});
			},
			async getSeckillList(item) {
				try {
					const data = {
						page: this.page,
						limit: this.limit,
						date: item.date,
						startTime: item.startTime,
						endTime: item.endTime
					};
					if (this.loadend) return;
					if (this.loading) return;
					this.loadTitle = '';
					this.loading = true
					// 获取数据的逻辑
					const res = await getSeckillListApi(data);
					this.loadend = this.page > res.data.totalPage;
					if (this.page == 1) {
						this.seckillList = [];
					}
					this.loadTitle = this.loadend ? '已全部加载' : '加载更多';
					this.seckillList = this.seckillList.concat(res.data.list || []);
					this.$set(this, 'page', this.page + 1);
					// 在数据更新后恢复滚动位置
					this.$nextTick(() => {
						this.$set(this, 'seckillList', this.seckillList);
					});
					this.loading = false;
					// #ifdef H5
					this.setShare();
					// #endif
					this.showSkeleton = false


				} catch (error) {
					this.loading = false
				}
			},
			goBack: function() {
				uni.navigateBack();
			},
			setShare: function() {
				this.$wechat.isWeixin() &&
					this.$wechat.wechatEvevt([
						"updateAppMessageShareData",
						"updateTimelineShareData",
						"onMenuShareAppMessage",
						"onMenuShareTimeline"
					], {
						desc: this.seckillList[0].title,
						title: this.seckillList[0].title,
						link: location.href,
						imgUrl: this.seckillList[0].image
					}).then(res => {}).catch(err => {
						console.log(err);
					});
			},
		},
		/**
		 * 页面上拉触底事件的处理函数
		 */
		onReachBottom: function() {
			this.getSeckillList(this.activeTime);
		}
	}
</script>

<style scoped lang="scss">
	.seckill_title {
		width: 144rpx;
		height: 36rpx;
	}
</style>