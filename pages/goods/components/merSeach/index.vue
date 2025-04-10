
<template>
	<view class="right-wrapper" @touchmove.stop.prevent="moveStop">
		<view class="control-wrapper">
			<view class="content-box">
				<view class="acea-row row-between">
					<view class="title">店铺类型</view>
					<view class="btns" v-if="!isShow && merchantType.length>9" @click="isShow = true">展开全部<text class="iconfont icon-xiangxia"></text></view>
					<view class="btns" v-if="isShow && merchantType.length>9"  @click="isShow = false">收起<text class="iconfont icon-xiangshang"></text></view>
				</view>
				<view class="brand-wrapper">
					<scroll-view :style="{'height':isShow?'100%':'250rpx'}" :scroll-y="isShow">
						<view class="wrapper">
							<view class="item line1" v-for="(item,index) in merchantType" :key="index" :class="activeIndex === index ? 'on' : ' '" @tap="bindChenck1(index)">
								{{item.name}}
							</view>
						</view>
					</scroll-view>
				</view>
				<view class="acea-row row-between">
					<view class="title">商户分类</view>
					<view class="btns" v-if="!isShowCate && merchantClassify.length>8" @click="isShowCate = true">展开全部<text class="iconfont icon-xiangxia"></text></view>
					<view class="btns" v-if="isShowCate && merchantClassify.length>8"  @click="isShowCate = false">收起<text class="iconfont icon-xiangshang"></text></view>
				</view>
				<view class="brand-wrapper">
					<scroll-view :style="{'height':isShowCate?'100%':'250rpx'}" :scroll-y="isShowCate">
						<view class="wrapper">
							<view class="item line1" v-for="(item,index) in merchantClassify" :key="index" :class="activeIndex2 === index ? 'on' : ' '" @tap="bindChenck2(index)">
								{{item.name}}
							</view>
						</view>
					</scroll-view>
				</view>
				<view class="foot-btn">
					<view class="btn-item" @click="reset">重置</view>
					<view class="btn-item confirm" @click="confirm">确定</view>
				</view>
			</view>
		</view>
		<view class="right-bg" @click="close"></view>
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
	import { mapGetters } from "vuex";
	export default{
		computed: mapGetters(["merchantClassify", "merchantType"]),
		props:{
			whereMer:{
				type:Object,
				default:function(){
					return {}
				}
			}
		},
		data(){
			return {
				min: '',
				max:'',
				isShow:false,
				isShowCate: false,
				list:[],
				merCate: [],
				activeList:[],
				selectList: [],
				activeIndex: null,
				activeIndex2: null
			}
		},
		watch:{
			whereMer:{
				handler:function(newV,oldV){
					if(newV){
					this.typeId = this.whereMer.typeIds;
					this.categoryId = this.whereMer.categoryIds;
					if(this.typeId == '') this.activeIndex =null;
					if(this.categoryId == '') this.activeIndex2 =null;
					}
				},
				deep:true
			}
		},
		methods:{
			bindChenck1(index){
				this.activeIndex = index
				this.typeId = this.merchantType[index].id
			},
			bindChenck2(index){
				this.activeIndex2 = index
				this.categoryId = this.merchantClassify[index].id
			},
			reset(){
				this.activeIndex = null
				this.activeIndex2 = null
				this.typeId = ''
				this.categoryId = ''
			},
			confirm(){
				let obj = {
					typeId:this.typeId,
					categoryId: this.categoryId
				}
				this.$emit('confirm',obj)
			},
			close(){
				this.$emit('close')
			},
			moveStop(){}
		}
	}
</script>

<style lang="scss" scoped>
	.right-wrapper{
		width: 650rpx;
		    background: #FFFFFF;
		    padding: 15px 0 0 15px;
		    box-sizing: border-box;
			height: 100%;
		.control-wrapper{
			z-index: 90;
			position: absolute;
			right: 0;
			top: 0;
			display: flex;
			flex-direction: column;
			width: 650rpx;
			height: 100%;
			background-color: #F5F5F5;
			.btns{
				display: flex;
				align-items: center;
				justify-content: center;
				padding-top: 10rpx;
				font-size: 22rpx;
				color: #999;
				.iconfont{
					margin-left: 10rpx;
					margin-top: 5rpx;
					font-size: 20rpx;
				}
			}
			.header{
				padding: 50rpx 26rpx 40rpx;
				background-color: #fff;
				.title{
					font-size: 26rpx;
					font-weight: bold;
					color: #282828;
				}
				.input-wrapper{
					display: flex;
					align-items: center;
					justify-content: space-between;
					margin-top: 28rpx;
					input{
						width:260rpx;
						height:56rpx;
						padding: 0 10rpx;
						background:rgba(242,242,242,1);
						border-radius:28rpx;
						font-size: 22rpx;
						text-align: center;
					}
					.line{
						width:15rpx;
						height:2rpx;
						background:#7D7D7D;
					}
				}
			}
			.content-box{
				position: relative;
				flex: 1;
				display: flex;
				flex-direction: column;
				padding: 0 26rpx;
				background-color: #fff;
				overflow: hidden;
				.title{
					padding: 54rpx 0 20rpx;
					font-size: 26rpx;
					font-weight: bold;
					color: #282828;
				}
				.brand-wrapper{
					// flex: 1;
					overflow: hidden;
					padding-bottom: 100rpx;
					.wrapper{
						display: flex;
						flex-wrap: wrap;
						padding-bottom: 20rpx;
					}
					.item{
						display: block;
						width:186rpx;
						height:56rpx;
						line-height: 56rpx;
						text-align: center;
						background:rgba(242,242,242,1);
						border-radius:28rpx;
						margin-top: 25rpx;
						padding: 0 10rpx;
						margin-right: 12rpx;
						&:nth-child(3n){
							margin-right: 0;
						}
						&.on{
							@include main_color(theme);
							@include coupons_border_color(theme);
						}
					}

				}
				.foot-btn{
					display: flex;
					align-items: center;
					justify-content: space-between;
					position: absolute;
					// width: 100%;
					// text-align: center;
					bottom: 30rpx;
					.btn-item{
						display: flex;
						align-items: center;
						justify-content: center;
						width:286rpx;
						height:68rpx;
						background:rgba(255,255,255,1);
						border:1px solid rgba(170,170,170,1);
						border-radius:34rpx;
						font-size: 26rpx;
						color: #282828;
						&.confirm{
							@include main_bg_color(theme);
							@include coupons_border_color(theme);
							color: #fff;
							margin-left: 20rpx;
						}
					}
				}
			}
		}
		.right-bg{
			// position: absolute;
			// left: 0;
			// top: 0;
			width: 100%;
			height: 100%;
			background-color: rgba(0,0,0,.5);
		}
	}
</style>
