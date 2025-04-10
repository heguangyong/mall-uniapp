<template>
	<view class="user_store_attention">
		<view v-if="list.length > 0">
			<view class="item" v-for="(item,index) in list" :key="index" @click="goHomepage(item)">
				<image v-if="item.userLevelIcon" class="level_icon" :src="item.userLevelIcon" alt="">
				<image :src="item.avatar?item.avatar:urlDomain+'crmebimage/presets/morenT.png'" mode=""></image>
				<view class="info">
					<view class="line1">
						<text class="name line1">{{item.isLogoff ? "用户已注销" :item.nickname}}</text>
					</view>
					<view v-if="item.fansNum" class="des">
						粉丝{{item.fansNum<10000 ? item.fansNum : (item.fansNum/10000).toFixed(2)+'万'}}
					</view>
					<view v-else class="des">粉丝0</view>
					<view class="btn" :class="(!item.isConcerned && type === 'follow') || (!item.isFansConcerned &&type === 'fans') ? 'focusBtn' : ''" @click.stop="focusToggle(item)">
			            <text v-if="type === 'follow'">{{!item.isConcerned ?'关注' : '已关注'}}</text>
						<text v-else>{{!item.isFansConcerned ?'回关' : '已关注'}}</text>
					</view>
				</view>
			</view>
		</view>
		<view :hidden="!loading" class="acea-row row-center-wrapper loadingicon">
			<text class="iconfont icon-jiazai loading"></text>
		</view>
		<view class='noCommodity' v-if="list.length == 0 && !loading">
			<view v-if="type === 'follow'" class='pictrue'>
        <image :src="urlDomain+'crmebimage/presets/noguanzhu.png'"></image>
				<view class="text-ccc">暂未关注任何人哦~</view>
			</view>
			<view v-else class='pictrue'>
        <image :src="urlDomain+'crmebimage/presets/noguanzhu.png'"></image>
				<view class="text-ccc">你还没有粉丝哦~</view>
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
	let app = getApp();
	import {
		discoverFollowAuthor
	} from '@/libs/follow.js';
	import {
		Debounce
	} from '@/utils/validate.js'
	import { myConcernedListApi, followAuthorApi, myFansListApi } from '@/api/discover.js'
	export default{
		data(){
			return {
				urlDomain: this.$Cache.get("imgHost"),
				list:[],
				isScroll:true,
				loading: false,
				page:1,
				limit:20,
				type: ''//follow关注，fans粉丝
			}
		},
		onLoad(options) {
			this.type = options.type;
			uni.setNavigationBarTitle({
				title: options.type  === 'follow' ? '我的关注' : '我的粉丝'
			})
			if(options.type === 'follow'){
				this.getList()
			}else{
				this.getFansList()
			}
		},
		mounted: function() {},
		methods:{	
			//粉丝列表
			getFansList(){
				if(!this.isScroll || this.loading) return
				this.loading = true;
				myFansListApi({
					page:this.page,
					limit:this.limit
				}).then(res=>{
					this.loading = false
					this.isScroll = res.data.list.length>=this.limit
					this.list = this.list.concat(res.data.list)
					this.page+=1
				})
			},
			//关注列表
			getList(){
				if(!this.isScroll || this.loading) return
				this.loading = true;
				myConcernedListApi({
					page:this.page,
					limit:this.limit
				}).then(res=>{
					this.loading = false
					this.isScroll = res.data.list.length>=this.limit
					this.list = this.list.concat(res.data.list)
					this.page+=1
				})
			},
			/*关注*/
			focusToggle: Debounce(function(item){
				discoverFollowAuthor(item.id).then(() => {
					this.$set(item, 'isConcerned', !item.isConcerned);
					this.$set(item, 'isFansConcerned', !item.isFansConcerned);
				});
			}),
			goHomepage(item){
				if(item.isLogoff) return;
				uni.navigateTo({
					url: `/pages/discover/discover_user/index?id=${item.id}`
				})
			}
		},
		onReachBottom() {
			this.getList()
		}
	}
</script>

<style lang="scss" scoped>
	.level_icon {
		position: absolute;
		width: 38rpx !important;
		height: 38rpx !important;
		border: none;
		z-index: 11;
		bottom: 30rpx;
		left: 106rpx;
	}
	.noCommodity{
		margin-top: 50%;
	}
.user_store_attention{
	.item{
		position: relative;
		display: flex;
		padding: 30rpx 20rpx;
		background-color: #fff;
		align-items: center;
		&::after{
			content: ' ';
			position: absolute;
			bottom: 0;
			left: 30rpx;
			right: 0;
			height: 1px;
			background: #f0f0f0;
		}
		image{
			width: 120rpx;
			height: 120rpx;
			border-radius: 50%;
		}
		.info{
			flex: 1;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			margin-left: 20rpx;
			position: relative;
			.name{
				width: 410rpx;
				font-size: 30rpx;
				color: #282828;
			}
			.des{
				color: #999999;
				font-size: 24rpx;
				margin-top: 10rpx;
			}
			.btn{
				display: flex;
				align-items: center;
				justify-content: center;
				position: absolute;
				right: 0;
				top: 50%;
				width: 124rpx;
				height: 50rpx;
				font-weight: 500;
				line-height: 50rpx;
				transform: translateY(-50%);
				border:1px solid #F5F5F5;
				color: #999999;
				border-radius: 33rpx;
				font-size: 22rpx;
				&.focusBtn{
					color: #fff;
					background: #E93323;
					border: none;
					.iconfont{
						font-size: 20rpx;
						margin-right: 10rpx;
					}
				}
			}
		}
	}
}
.no_content,.main{
	min-height: 100vh;
	background: #fff;
	position: relative;
	.count{
		position: absolute;
		text-align: center;
		width: 100%;
		top: 50%;
		margin-top: -300rpx;
		image,uni-image{
			width: 424rpx;
			height: 305rpx;
		}
		text{
			display: block;
			color: #999999;
			font-size: 26rpx;
		}
	}
}
</style>
