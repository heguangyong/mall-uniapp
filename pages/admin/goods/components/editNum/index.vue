<template>
	<base-drawer mode="bottom" :visible="visible" background-color="transparent" mask maskClosable @close="closeDrawer">
		<view class="edit-price rd-t-40rpx" v-if="goodsInfo.attr_value">
			<view class="title">增加库存
			  <view class="close acea-row row-center-wrapper" @tap="closeDrawer">
				  <text class="iconfont icon-guanbi"></text>
			  </view>
			</view>
			<view class="list">
				<view class="item acea-row row-between-wrapper">
					<view>库存</view>
					<input type="number" :placeholder="'请填写增加库存数'" placeholder-class="placeholder" v-model="goodsInfo.attr_value.stock" />
				</view>
			</view>
			<view v-if="goodsInfo.spec_type" class="bnt acea-row row-center-wrapper" @tap="defineSpec">确定</view>
			<view v-else class="bnt acea-row row-center-wrapper" @tap="define">保存</view>
		</view>
	</base-drawer>
</template>

<script>
// import {
// 	postUpdateAttrs
// } from "@/api/admin";
import baseDrawer from '@/components/tui-drawer/tui-drawer.vue';
export default {
	components:{
		baseDrawer
	},
	props:{
		visible: {
		    type: Boolean,
		    default: false,
		},
		goodsInfo: {
			type: Object,
			default: () => {}
		},
	},
	data: function() {
	  return {
		  tips:'',
	  };
	},
	mounted() {
		// this.tips = this.goodsInfo.spec_type?'(可为空)':''
	},
	methods:{
		defineSpec(){
			let info = this.goodsInfo.attr_value;
			if(info.cost || info.price || info.ot_price || info.stock){
				this.$emit('successChange',info);
			}else{
				this.$util.Tips({
					title: '修改类容至少填写一项'
				});
			}
		},
		define(){
			let data = {
				attr_value:[]
			}
			data.attr_value.push(this.goodsInfo.attr_value)
			postUpdateAttrs(this.goodsInfo.id,data).then(res=>{
				this.$util.Tips({
					title: res.msg
				});
				this.$emit('successChange');
			}).catch(err=>{
				this.$util.Tips({
					title: err
				});
			})
		},
		closeDrawer() {
		  this.$emit('closeDrawer');
		}
	}
}
</script>

<style lang="scss" scoped>
	.edit-price{
		background-color: #fff;
		padding-bottom: 60rpx;
		.title{
			text-align: center;
			height: 108rpx;
			line-height: 108rpx;
			font-size: 32rpx;
			font-family: PingFang SC, PingFang SC;
			font-weight: 600;
			color: #333333;
			position: relative;
			padding: 0 30rpx;
			.close{
				width: 36rpx;
				height: 36rpx;
				line-height: 36rpx;
				background: #EEEEEE;
				border-radius: 50%;
				position: absolute;
				right: 30rpx;
				top:38rpx;
				.iconfont {
					font-weight: 300;
					font-size: 20rpx;
				}
			}
		}
		.list{
			padding: 0 10rpx 0 30rpx;
			.item{
				font-size: 28rpx;
				font-family: PingFang SC, PingFang SC;
				font-weight: 400;
				color: #333333;
				height: 72rpx;
				margin-bottom: 32rpx;
				box-sizing: border-box;
				input {
					text-align: right;
					font-size: 28rpx;
					height: 100%;
					padding-right: 20rpx;
				}
				.placeholder{
					font-size: 28rpx;
					padding-right: 20rpx;
				}
			}
		}
		.bnt{
			font-size: 26rpx;
			font-family: PingFang SC, PingFang SC;
			font-weight: 500;
			color: #FFFFFF;
			width: 710rpx;
			height: 72rpx;
			background: #2A7EFB;
			border-radius: 50rpx;
			margin: 72rpx auto 0 auto;
		}
	}
</style>