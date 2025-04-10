<template>
	<view class="activity-box">
		<view class="activity_header" :style="{backgroundImage: headerBg}">
			<view class='cart_nav'>
				<nav-bar navTitle="秒杀列表" ref="navBarRef" iconColor='#fff' :backgroundColor="backgroundColor"
					:isBackgroundColor="false"></nav-bar>
			</view>
		</view>
		<view class="list-box" :style="{'z-index':listZindex}"  @touchstart="touchStart">
			<seckill-list :seckillList="seckillList" :loading="loading" :loadTitle="loadTitle"
				:status="1"></seckill-list>
		</view>
	</view>
</template>

<script>
	import navBar from '@/components/navBar';
	import useActivity from "@/mixins/useActivity";
	import SeckillList from "../components/SeckillList";
	import {
		seckillMerchantApi
	} from "../../../api/activity";
	import {
		silenceBindingSpread,
		getUserSpread
	} from '@/utils/index.js';
	import {
		mapGetters
	} from "vuex";
  import onShare from "@/mixins/onShare";
	export default {
		mixins: [useActivity,onShare],
		name: "index",
    computed: {
      headerBg() {
        return 'url(' + this.urlDomain + 'crmebimage/presets/seckill_header.png' + ')'
      },
      ...mapGetters(['isLogin', 'uid', 'globalData']),
    },
		components: {
			navBar,
			SeckillList
		},
		data() {
			return {
				seckillList: [],
				page: 1,
				limit: 10,
				loading: false,
				loadend: false,
				merId: 0,
				loadTitle: '',
				urlDomain: this.$Cache.get("imgHost"),
        title: '秒杀列表'
			}
		},
		onLoad(options) {
			this.merId = options.merId
			this.getSeckillList()
			//分销码
			getUserSpread(options);
		},
		onShow() {
			//分销绑定
			silenceBindingSpread(this.isLogin, this.globalData.spread);
		},
		// 滚动监听
		onPageScroll(e) {
			// 传入scrollTop值并触发所有easy-loadimage组件下的滚动监听事件
			uni.$emit('scroll');
		},
		/**
		 * 页面上拉触底事件的处理函数
		 */
		onReachBottom: function() {
			this.getSeckillList();
		},
		methods: {
      //滚动
      touchStart() {
        this.$refs.navBarRef.currentPage = false;
      },
			getSeckillList() {
				let data = {
					page: this.page,
					limit: this.limit,
					merId: this.merId,
				};
				if (this.loadend) return;
				if (this.loading) return;
				this.loadTitle = '';
				this.loading = true
				seckillMerchantApi(data).then(res => {
					this.$set(this, 'page', this.page + 1);
					this.seckillList = this.seckillList.concat(res.data.list || []);
					this.loadend = this.page > res.data.totalPage;
					this.loadTitle = this.loadend ? '已全部加载' : '加载更多';
					this.loading = false;
					this.showSkeleton = false
				}).catch(err => {
					this.loading = false
				});
			},
		}
	}
</script>

<style scoped lang="scss">
	 @import "../static/css/activity.scss";
	/deep/.seckill_list{
		padding: 0 !important;
		background-color: #f5f5f5 !important;
	}
	/deep/.seckill_item{
		border: none;
	}
</style>