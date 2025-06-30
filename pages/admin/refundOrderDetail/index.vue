<template>
	<view>
		<!-- #ifdef MP || APP-PLUS -->
		<NavBar titleText="售后详情" :iconColor="iconColor" :textColor="iconColor" :isScrolling="isScrolling" showBack>
		</NavBar>
		<!-- #endif -->
		<view class="headerBg">
			<view :style="{ height: `${getHeight.barTop}px` }"></view>
			<view :style="{ height: `${getHeight.barHeight}px` }"></view>
			<view class="inner"></view>
		</view>
		<view class="order-details pos-order-details">
			<view class="header">
				<view class="state">{{statusArr[refundInfo.refundStatus]}}</view>
				<view class="data">
					<span v-if="refundInfo.refundStatus==0">用户提交退款申请，请您及时处理哦～</span>
					<span v-if="refundInfo.refundStatus==4">您已同意此退款申请，等待用户退货中～</span>
					<span v-if="refundInfo.refundStatus==5">用户已经填写退货信息，请您耐心等待～</span>
					<span v-if="refundInfo.refundStatus==2">退款金额原支付路径返回中！</span>
					<span v-if="refundInfo.refundStatus==3">退款金额已返还用户账户！</span>
					<span v-if="refundInfo.refundStatus==6">用户已经撤销此退款申请！</span>
					<span v-if="refundInfo.refundStatus==1">{{refundInfo.refundReason}}</span>
				</view>
			</view>
			<view class='wrapper'>
				<view class='item acea-row title'>
					<view>退款明细</view>
				</view>
				<view class='item acea-row row-between'>
					<view>退款金额</view>
					<view class='conter'>¥{{refundInfo.refundPrice}}</view>
				</view>
				<view class='item acea-row row-between'>
					<view>退回运费</view>
					<view class='conter'>¥{{refundInfo.refundFreightFee}}</view>
				</view>
				<view class='item acea-row row-between'>
					<view>退回抵扣积分</view>
					<view class='conter'>{{refundInfo.refundUseIntegral}}</view>
				</view>
				<view class='item acea-row row-between'>
					<view>收回赠送积分</view>
					<view class='conter'>{{refundInfo.refundGainIntegral}}</view>
				</view>
			</view>
			<!-- 商品信息 -->
			<view class='wrapper'>
				<view class="acea-row row-between productInfo-box">
					<image class="productImg" :src="refundInfo.image" mode=""></image>
					<view class="product-right">
						<view class="product-name prodyct-item">{{refundInfo.productName}}</view>
						<view class="product-sku prodyct-item">{{refundInfo.sku}}</view>
						<view class="product-price prodyct-item">￥{{refundInfo.price}}</view>
					</view>
				</view>
				<view class="item acea-row row-between">
					<view>退款件数</view>
					<view class="conter">{{ refundInfo.applyRefundNum }}</view>
				</view>
				<view class="item acea-row row-between">
					<view>售后类型</view>
					<view class="conter">{{ refundInfo.afterSalesType==1?'仅退款':'退货退款' }}</view>
				</view>
				<view class="item acea-row row-between">
					<view>退货方式</view>
					<view class="conter">{{ refundInfo.returnGoodsType==0?'不退货':refundInfo.returnGoodsType==1?'快递退回':'到店退货' }}</view>
				</view>
				<view class="item acea-row row-between">
					<view>退款原因</view>
					<view class="conter">{{ refundInfo.refundReasonWap }}</view>
				</view>
				<view class="item acea-row row-between">
					<view>备注说明</view>
					<view class="conter">{{ refundInfo.refundReasonWapExplain }}</view>
				</view>
				<view class="item acea-row row-between">
					<view>退款凭证</view>
					<view class="conter">
						<scroll-view class="picTxt scroll-view" scroll-x="true" v-if="refundInfo.refundReasonWapImg">
							<view class="pictrue" v-for="(val, key) in refundInfo.refundReasonWapImg.split(',')" :key="key">
								<image class="scroll-img" :src="val" />
							</view>
						</scroll-view>
					</view>
				</view>
			</view>
			<view class="wrapper">
				<view class="item acea-row row-between">
					<view>订单编号</view>
					<view class="conter">
						{{ orderInfoVo.orderNo}}
						<!-- #ifdef H5 -->
						<text class="copy copy-data" :data-clipboard-text="orderInfoVo.orderNo">复制</text>
						<!-- #endif -->
						<!-- #ifdef MP -->
						<text class="copy copy-data" @click="copyNum(orderInfoVo.orderNo)">复制</text>
						<!-- #endif -->
					</view>
				</view>
				<view class="item acea-row row-between">
					<view>退款编号</view>
					<view class="conter">
						{{ refundInfo.refundOrderNo }}
						<!-- #ifdef H5 -->
						<text class="copy copy-data" :data-clipboard-text="refundInfo.refundOrderNo">复制</text>
						<!-- #endif -->
						<!-- #ifdef MP -->
						<text class="copy copy-data" @click="copyNum(refundInfo.refundOrderNo)">复制</text>
						<!-- #endif -->
					</view>
				</view>
				<view class="item acea-row row-between">
					<view>申请时间</view>
					<view class="conter">{{ orderInfoVo.createTime }}</view>
				</view>
				<view class="item acea-row row-between">
					<view>退款方式</view>
					<view class="conter">{{ payType[`${orderInfoVo.payType}`] }}</view>
				</view>
				<view class="item acea-row row-between">
					<view>退一级返佣</view>
					<view class="conter">{{ refundInfo.refundFirstBrokerageFee }}</view>
				</view>
				<view class="item acea-row row-between">
					<view>退二级返佣</view>
					<view class="conter">{{ refundInfo.refundSecondBrokerageFee }}</view>
				</view>
				<view class="item acea-row row-between">
					<view>平台备注</view>
					<view class="conter">{{ refundInfo.platformRemark||'' }}</view>
				</view>
				<view class="item acea-row row-between">
					<view>商家备注</view>
					<view class="conter">{{  refundInfo.merRemark||''}}</view>
				</view>
			</view>
			<view class="height-add"></view>
			<view class="footer acea-row row-right row-middle" v-if="goname != 'looks'">
				<view class="btn" @click="modify(refundInfo, 7)">退款单备注</view>
				<view class="btn on" v-if="(refundInfo.returnGoodsType==0||refundInfo.returnGoodsType==2)&&refundInfo.refundStatus==0"  @click="modify(refundInfo,'2',1,0)">
					退款审核
				</view>
				<view class="btn on" v-if="refundInfo.returnGoodsType==1&&refundInfo.refundStatus==0"  @click="modify(refundInfo,'2',0,1)">
					退款审核
				</view>
				<view class="btn on" v-if="refundInfo.refundStatus==5" @click="modify(refundInfo, 2, 1,2)">确认收货</view>
			</view>
			<PriceChange :change="change" :orderInfo="orderInfo" :isRefund="isRefund"
				v-on:statusChange="statusChange($event)" v-on:closechange="changeclose($event)" v-on:savePrice="savePrice"
				:status="status"></PriceChange>
		</view>
	</view>
</template>
<script>
	import {refundOrderDetail} from'@/api/work.js'
	import PriceChange from "../components/PriceChange/index.vue";
	// #ifdef MP || APP-PLUS
	import NavBar from "../components/NavBar.vue";
	// #endif
	// #ifdef H5
	import ClipboardJS from "@/plugin/clipboard/clipboard.js";
	// #endif

	import {
		isMoney
	} from '@/utils/validate.js'
import {refundOrderList,refundOrderMark,refundStatusNum,refundOrderAudit,refundReceiving,refundReceivingReject} from '@/api/work.js'
	export default {
		name: "AdminOrder",
		components: {
			PriceChange,
			// #ifdef MP || APP-PLUS
			NavBar,
			// #endif
		},
		props: {},
		data: function() {
			return {
				payType: {
					'public': '公众号支付',
					'mini': '小程序支付',
					'h5': '网页支付支付',
					'yue': '余额支付',
					'wechatIos': '微信Ios支付',
					'wechatAndroid': '微信Android支付',
					'alipay': '支付宝支付',
					'alipayApp': '支付宝App支付'
				},
				statusArr:['待审核','商家拒绝','退款中','已退款','用户退货','商家待收货','已撤销'],
				openErp: false,
				order: false,
				change: false,
				status: "",
				types: "",
				statusType: -3,
				clickNum: 1,
				goname: '',
				isRefund: 0, //1是仅退款;0是同意退货退款
				// #ifdef MP || APP-PLUS
				iconColor: '#FFFFFF',
				isScrolling: false,
				// #endif
				getHeight: this.$util.getWXStatusHeight(),
				refundInfo: '',
				refundOrderNo:'',
				apiModalType:'',
				orderInfo:{},
				orderInfoVo:''
			};
		},
		onLoad: function(option) {
			this.refundOrderNo=option.refundOrderNo
			this.getIndex();
			// #ifdef H5
			this.$nextTick(function() {
				var clipboard = new ClipboardJS('.copy-data');
				clipboard.on('success', function(e) {
					this.$util.Tips({
						title: '复制成功'
					})
				});
				clipboard.on('error', function(e) {
					this.$util.Tips({
						title: '复制失败'
					})
				});
			});
			// #endif

		},
		onShow() {
			this.getIndex();
		},
		onPageScroll(e) {
			// #ifdef MP || APP-PLUS
			if (e.scrollTop > 50) {
				this.iconColor = '#333333';
				this.isScrolling = true;
			} else {
				this.iconColor = '#FFFFFF';
				this.isScrolling = false;
			}
			// #endif
		},
		methods: {
			//0-仅退款 1-退货退款 2-确认收货
			modify: function(item, status, type,apiType) {
				this.apiModalType=apiType
				if (this.openErp && status != 1) return
				this.change = true;
				this.status = status.toString();
				this.orderInfo = item;
				if (status == 2) {
					this.isRefund = type
				}
			},
			changeclose: function(msg) {
				this.change = msg;
			},
			getIndex: function() {
				refundOrderDetail(this.refundOrderNo).then(res=>{
					this.refundInfo=res.data
					this.orderInfoVo=res.data.orderInfoVo
				})
			},
			async savePrice(opt) {
				let that = this,
					data = {};
				data.refundOrderNo = that.orderInfo.refundOrderNo;
				if (that.apiModalType == 0) {
					if(opt.type==2&&!opt.refuse_reason){
						return this.$util.Tips({
							title: '请输入拒绝理由'
						})
					}
					let requestObj = {
						refundOrderNo:that.orderInfo.refundOrderNo,
						auditType:opt.type==1?'success':'refuse',
						reason:opt.refuse_reason?opt.refuse_reason:''
					}
					refundOrderAudit(requestObj).then(res=>{
						if(res.code==200){
							this.$util.Tips({
								title: '审核成功'
							})
							this.init();
							this.change = false
						}else{
							this.$util.Tips({
								title:res.message
							})
						}
					})
				} else if (that.apiModalType == 1) {
					//退货退款审核
					if(opt.type==2&&!opt.refuse_reason){
						return this.$util.Tips({
							title: '请输入拒绝理由'
						})
					}
					if(opt.type==1&&!opt.merAddressId){
						return this.$util.Tips({
							title: '请选择退货地址'
						})
					}
					//退货退款拒绝
					if(opt.type==2){
						let requestObj = {
							refundOrderNo:that.orderInfo.refundOrderNo,
							auditType:opt.type==1?'success':'refuse',
							reason:opt.refuse_reason?opt.refuse_reason:''
						}
						refundOrderAudit(requestObj).then(res=>{
							if(res.code==200){
								this.$util.Tips({
									title: '操作成功'
								})
								this.init();
								this.change = false
							}else{
								this.$util.Tips({
									title:res.message
								})
							}
						})
					}
					//退货退款同意
					if(opt.type==1){
						let requestObj = {
							refundOrderNo:that.orderInfo.refundOrderNo,
							auditType:opt.type==1?'success':'refuse',
							merAddressId:opt.merAddressId
						}
						refundOrderAudit(requestObj).then(res=>{
							if(res.code==200){
								this.$util.Tips({
									title: '操作成功'
								})
								this.init();
								this.change = false
							}else{
								this.$util.Tips({
									title:res.message
								})
							}
						})
					}
				}else if(that.apiModalType == 2){
					//确认收货
					if(opt.type==2&&!opt.refuse_reason){
						return this.$util.Tips({
							title: '请输入拒绝理由'
						})
					}
					if(opt.type==1){
						// 同意
						refundReceiving(that.orderInfo.refundOrderNo).then(res=>{
							if(res.code==200){
								this.$util.Tips({
									title: '操作成功'
								})
								this.init();
								this.change = false
							}else{
								this.$util.Tips({
									title:res.message
								})
							}
						})
					}
					if(opt.type==2){
						let requestObj = {
							refundOrderNo:that.orderInfo.refundOrderNo,
							reason:opt.refuse_reason?opt.refuse_reason:''
						}
						// 拒绝
						refundReceivingReject(requestObj).then(res=>{
							if(res.code==200){
								this.$util.Tips({
									title: '操作成功'
								})
								this.init();
								this.change = false
							}else{
								this.$util.Tips({
									title:res.message
								})
							}
						})
					}
				}else{
					data.remark=opt.remark
					if (!data.remark) {
						return this.$util.Tips({
							title: '请输入备注'
						})
					}
					refundOrderMark(data).then(res=>{
						if(res.code==200){
							this.$util.Tips({
								title: '备注成功'
							})
							this.getIndex();
							this.change = false
						}else{
							this.$util.Tips({
								title:res.message
							})
						}
					})
				}
			},
			init(){
				uni.navigateBack()
			},
			// #ifdef MP
			copyNum(id) {
				uni.setClipboardData({
					data: id,
					success: function() {}
				});
			},
			// #endif
			// #ifdef H5
			webCopy(item, index) {
				let items = item
				let indexs = index
				let self = this
				if (self.clickNum == 1) {
					self.clickNum += 1
					self.webCopy(items, indexs)
				}
			},
			// #endif
		}
	};
</script>

<style lang="scss" scoped>
	.headerBg {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		background-image: linear-gradient(360deg, #F5F5F5 0%, rgba(245, 245, 245, 0) 100%),
			linear-gradient(270deg, #01ABF8 0%, #2A7EFB 100%);
		background-position: left bottom, left top;
		background-repeat: no-repeat;
		background-size: 100% 120rpx, 100% 100%;

		.inner {
			height: 356rpx;
		}
	}

	.order-details {
		position: absolute;
		width: 100%;
		padding: 0 20rpx;
	}

	.height-add {
		height: calc(120rpx + constant(safe-area-inset-bottom)); ///兼容 IOS<11.2/
		height: calc(120rpx + env(safe-area-inset-bottom)); ///兼容 IOS>11.2/
	}

	.pos-order-details .footer .more {
		font-size: 27upx;
		color: #aaa;
		width: 100upx;
		height: 64upx;
		text-align: center;
		line-height: 64upx;
		margin-right: 25upx;
		position: relative;
	}

	.pos-order-details .footer .delivery {
		border-color: #2A7EFB !important;
		background: #2A7EFB;
		color: #FFFFFF !important;
	}

	.pos-order-details .footer .more .order .arrow {
		width: 0;
		height: 0;
		border-left: 11upx solid transparent;
		border-right: 11upx solid transparent;
		border-top: 20upx solid #e5e5e5;
		position: absolute;
		left: 15upx;
		bottom: -18upx;
	}

	.pos-order-details .footer .more .order .arrow:before {
		content: '';
		width: 0;
		height: 0;
		border-left: 9upx solid transparent;
		border-right: 9upx solid transparent;
		border-top: 19upx solid #fff;
		position: absolute;
		left: -10upx;
		bottom: 0;
	}

	.pos-order-details .footer .more .order {
		width: 200upx;
		background-color: #fff;
		border: 1px solid #eee;
		border-radius: 10upx;
		position: absolute;
		top: -200upx;
		z-index: 9;
	}

	.pos-order-details .footer .more .order .item {
		height: 77upx;
		line-height: 77upx;
	}

	.pos-order-details .footer .more .order .item~.item {
		border-top: 1px solid #f5f5f5;
	}


	/*订单详情*/
	.order-details .header {
		padding: 48rpx 0 30rpx 12rpx;
	}

	.order-details .header.on {
		background-color: #666 !important;
	}
	.order-details .header .state {
		font-weight: 500;
		font-size: 36rpx;
		line-height: 50rpx;
		color: #FFFFFF;
	}

	.order-details .header .data {
		margin-top: 8rpx;
		font-size: 26rpx;
		line-height: 36rpx;
		color: #FFFFFF;
	}

	.order-details .header.on .data {
		margin-left: 0;
	}

	.order-details .header .data .state {
		font-size: 30upx;
		font-weight: bold;
		color: #fff;
		margin-bottom: 7upx;
	}

	/* .order-details .header .data .time{margin-left:20upx;} */
	.order-details .nav {
		background-color: #fff;
		font-size: 26upx;
		color: #282828;
		padding: 25upx 0;
	}

	.order-details .nav .navCon {
		padding: 0 40upx;
	}

	.order-details .nav .navCon .on {
		font-weight: bold;
		color: #e93323;
	}

	.order-details .nav .progress {
		padding: 0 65upx;
		margin-top: 10upx;
	}

	.order-details .nav .progress .line {
		width: 100upx;
		height: 2upx;
		background-color: #939390;
	}

	.order-details .nav .progress .iconfont {
		font-size: 25upx;
		color: #939390;
		margin-top: -2upx;
		width: 30upx;
		height: 30upx;
		line-height: 33upx;
		text-align: center;
		margin-right: 0 !important;
	}


	.order-details .line {
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 4rpx;
	}

	.order-details .line image {
		width: 100%;
		height: 100%;
		display: block;
	}

	.order-details .wrapper {
		padding: 32rpx 24rpx;
		border-radius: 24rpx;
		margin-top: 20rpx;
		background: #FFFFFF;
		.title{
			font-weight: 600;
			font-size: 28rpx;
			color: #333333;
			border-bottom: 1px solid #EEEEEE;
			padding-bottom: 30rpx;
		}
	}

	.order-details .wrapper .item {
		font-size: 28rpx;
		line-height: 40rpx;
		color: #333333;
	}

	.order-details .wrapper .item~.item {
		margin-top: 24rpx;
	}

	.order-details .wrapper .item .conter .copy {
		height: 36rpx;
		padding: 0 12rpx;
		border: 0;
		border-radius: 18rpx;
		margin-left: 8rpx;
		background: #F5F5F5;
		font-size: 22rpx;
		line-height: 36rpx;
		color: #333333;
	}

	.order-details .wrapper .actualPay {
		margin-top: 26rpx;
	}

	.order-details .wrapper .actualPay .money {
		font-weight: bold;
		font-size: 30upx;
		color: #e93323;
	}

	.order-details .footer {
		width: 100%;
		height: 100upx;
		position: fixed;
		bottom: 0;
		left: 0;
		background-color: #fff;
		padding: 0 30upx;
		border-top: 1px solid #eee;
		height: calc(100rpx + constant(safe-area-inset-bottom)); ///兼容 IOS<11.2/
		height: calc(100rpx + env(safe-area-inset-bottom)); ///兼容 IOS>11.2/
		padding-bottom: calc(0rpx + constant(safe-area-inset-bottom)); ///兼容 IOS<11.2/
		padding-bottom: calc(0rpx + env(safe-area-inset-bottom)); ///兼容 IOS>11.2/
	}

	.order-details .footer .wait {
		color: #2a7efb;
		margin-right: 30rpx;
	}

	.order-details .footer .btn {
		width: 144rpx;
		height: 56rpx;
		border: 1rpx solid #CCCCCC;
		line-height: 54rpx;
		text-align: center;
		border-radius: 28rpx;
		font-size: 24rpx;
		color: #333333;
		transform: rotateZ(360deg);

		
	}

	.order-details .footer .btn.default {
		color: #444;
		border: 1px solid #444;
	}

	.order-details .footer .btn~.btn {
		margin-left: 16rpx;
	}

	.copy-data {
		font-size: 10px;
		color: #333;
		-webkit-border-radius: 1px;
		border-radius: 1px;
		border: 1px solid #666;
		padding: 0px 7px;
		margin-left: 12px;
		height: 20px;
	}
	.productImg{
		width: 140rpx;
		height: 140rpx;
		border-radius: 16rpx;
	}
	.productInfo-box{
		padding-bottom: 32rpx;
		margin-bottom: 24rpx;
		border-bottom: 1px solid #eee;
		.product-right{
			display: flex;
			flex-direction: column;
			justify-content: space-between;
		}
		.prodyct-item{
			width: 500rpx;
			overflow: hidden;//（文字长度超出限定宽度，则隐藏超出的内容）
			white-space: nowrap;//（设置文字在一行显示，不能换行）
			text-overflow: ellipsis;//（规定当文本溢出时，显示省略符号来代表被修剪的文本
		}
		.product-name{
			font-size: 28rpx;
			color: #333333;
		}
		.product-sku{
			font-size: 22rpx;
			color: #999999;
		}
		.product-price{
			font-size: 22rpx;
			color: #333333;
		}
	}
	.scroll-view {
		box-sizing: border-box;
		white-space: nowrap;
	
		.pictrue {
			display: inline-block;
	
			+.pictrue {
				margin-left: 16rpx;
			}
		}
	}
	.on {
		border-color: #2A7EFB !important;
		background: #2A7EFB !important;
		color: #fff !important;
	}
	.scroll-img{
		width: 88rpx;
		height: 88rpx;
		margin-left: 12rpx;
	}
</style>