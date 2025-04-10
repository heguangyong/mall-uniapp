<template>
	<view>
	  <view class="time1" :class='isShow==true?"on":""'>
	    <view class="top acea-row row-between-wrapper">
	    	<text @tap="cancel">取消</text>
	    	<text @tap="confirm">确定</text>
	    </view>
	    <picker-view class="picker" :value="value" @change="getime" indicator-style="height:34px;">
	    	<picker-view-column>
	    		<view class="hours" v-for="(item,index) in hoursList" :key="index">{{item}}</view>
	    	</picker-view-column>
	    	<picker-view-column>
	    		<view class="minutes" v-for="(item,index) in minutes" :key="index">{{item}}</view>
	    	</picker-view-column>
	    	<picker-view-column>
	    		<view class="center">-</view>
	    	</picker-view-column>
	    	<picker-view-column>
	    		<view class="hours" v-for="(item,index) in hoursList" :key="index">{{item}}</view>
	    	</picker-view-column>
	    	<picker-view-column>
	    		<view class="minutes" v-for="(item,index) in minutes" :key="index">{{item}}</view>
	    	</picker-view-column>
	    </picker-view>
	  </view>
	  <view class="mask" @tap="cancel" catchtouchmove="true" :hidden="isShow==false"></view>
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
	let minutes=[]
	for (let i = 0; i <= 59; i++) {
		if(i<10){
			i="0"+i
		}
	  minutes.push(i)
	}
	let hoursList = []
	for (let i = 0; i <= 23; i++) {
		if(i<10){
			i="0"+i
		}
	  hoursList.push(i)
	}
	export default{
		props:{
		  isShow:{
			type: Boolean,
			default: false
		  },
		  time:{
		  	type: Array,
		  	default() {
		  	  return [];
		  	}
		  }
		},
		watch:{
			time:function(){
				this.value=this.time
			}
		},
		created(){

		},
		data(){
			return{
				value:this.time,//默认结束开始时间
				hoursList,
				minutes,
			}
		},
		methods:{
			confirm(){
        let num0 = this.value[0]?this.value[0]:'00'
        let num1 = this.value[1]?this.value[1]:'00'
        let num3 = this.value[3]?this.value[3]:'00'
        let num4 = this.value[4]?this.value[4]:'00'
				let time = num0 +":"+ num1 +" - "+ num3+":"+ num4
				if(num3>num0 || (num3 == num0 && num4 >= num1)){
				  this.$emit("confrim",{time:time,val:this.value})
				}else{
				  return this.$util.Tips({
				    title: '开始时间必须小于结束时间'
				  });
				}
			},
			cancel(){
				let time = this.value[0]+":"+this.value[1]+" - "+this.value[3]+":"+this.value[4]
				this.$emit("cancel",{time:time})
			},
			getime(e){
				let val = e.detail.value
				this.value[0] = this.hoursList[val[0]]
				this.value[1] = this.minutes[val[1]]
				this.value[2] = val[2]
				this.value[3] = this.hoursList[val[3]]
				this.value[4] = this.minutes[val[4]]
			},
		}
	}
</script>
<style lang="scss" scoped>
.time1{
	width:100%;
	margin: 0 auto;
	background-color:#FFFFFF;
	color: #000;
	height: 568rpx;
	position: fixed;
	bottom: 0;
  left: 0;
	z-index: 99;
	transform: translate3d(0, 200%, 0);
	transition: all .3s cubic-bezier(.25, .5, .5, .9);
	&.on{
	 transform: translate3d(0, 0, 0);
	}
	.top{
		height: 90rpx;
		border-bottom: 1px solid #eee;
		padding: 0 30rpx;
		text{
			font-size: 32rpx;
			&:nth-child(1){
				color: #888;
			}
			&:nth-child(2){
				color: #007aff;
			}
		}
	}
	.tip12{
		width: 100%;
		height: 100rpx;
		view{
			width: 50%;
			text-align: center;
			line-height: 100rpx;
			font-size: 40rpx;
			color: #000000;
		}
	}
	.hours{
		font-size: 32rpx;
		color: #000;
		line-height:34px;
		text-align: center;
	}
	.minutes{
		font-size: 32rpx;
		color: #000;
		line-height:34px;
		text-align: center;
	}
	.center{
		line-height:34px;
		text-align: center;
	}
}
.picker{
	width: 100%;
	height: 476rpx;
}
</style>
