<template>
	<view class="refund">
		<view class="money-section">
			<view class="acea-row row-middle item">
				<view class="">预计退款</view>
				<input disabled="" v-model="refundMoney" class="input" type="text" />
			</view>
			<view class="acea-row row-middle item" >
				<view class="">退款类型</view>
				<view class="acea-row row-right radio-group">
					<view class="acea-row row-middle radio-item" :class="{ on: !isSplit}" @click="refundTypeChange(0)">
						<text class="iconfont" :class="isSplit?'icon-weixuanzhong':'icon-a-ic_CompleteSelect'"></text>整单退款
					</view>
					<view v-if="type!=2" class="acea-row row-middle radio-item" :class="{ on: isSplit}" @click="refundTypeChange(1)">
						<text class="iconfont" :class="isSplit?'icon-a-ic_CompleteSelect':'icon-weixuanzhong'"></text>分单退款
					</view>
				</view>
			</view>
		</view>
		<splitOrder :type="1" v-if="isSplit" :splitGoods="splitGoods" :select_all="false" @getList="getList">
		</splitOrder>
		<view class="footer acea-row row-middle">
			<view class="all acea-row row-middle" v-if="isSplit" @click="allChange">
				<text class="iconfont" :class="isAll?'icon-a-ic_CompleteSelect':'icon-ic_unselect'"></text>
				全选
			</view>
			<view class="btn-box">
				<view class="btn" :style="{ width: isSplit?'auto':'100%'}" @click="openRefund">
					确认
					<text v-if="isSplit">({{ numTotal }})</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import splitOrder from '../components/splitOrder/index.vue';
	import {
		employeeDirectRefund,
		sendDetailList
	} from '@/api/work.js'
	export default {
		components: {
			splitOrder,
		},
		data() {
			return {
				refundMoney: 0,
				isSplit: 0,
				isAll: false,
				splitGoods: [],
				goodsChecked: [],
				cart_ids: [],
				info: {},
				orderNo:'',
				type:''
			}
		},
		computed: {
			total() {
				return this.goodsChecked.reduce((total, item) => {
					return this.$util.$h.Add(total, this.$util.$h.Mul(this.$util.$h.Div(item.payPrice,item.payNum), item.surplus_num)).toFixed(2);
				}, 0);
			},
			numTotal() {
				return this.goodsChecked.reduce((total, {
					surplus_num,
				}) => {
					return this.$util.$h.Add(total, surplus_num);
				}, 0);
			},
		},
		watch: {
			total(newValue, oldValue) {
				this.refundMoney = newValue
			},
		},
		onLoad(options) {
			this.getInfo(options.orderNo)
			this.orderNo=options.orderNo
			this.type=options.type
		},
		methods: {
			getInfo(orderNo){
				sendDetailList(orderNo).then(res=>{
					this.info = res.data
					this.getIndex(res.data)
				})
			},
			allChange() {
				this.isAll = !this.isAll;
				this.cart_ids = [];
				this.goodsChecked = [];
				for (let i = 0; i < this.splitGoods.length; i++) {
					this.splitGoods[i].checked = this.isAll;
					if (this.splitGoods[i].checked) {
						this.goodsChecked.push(this.splitGoods[i]);
						this.cart_ids.push(this.splitGoods[i].id);
					}
				}
			},
			refundTypeChange(value) {
				this.isSplit = value;
				if (value) {
					this.goodsChecked = []
					this.splitGoods.forEach(item => {
						item.checked = false
					})
					this.isAll = false
				} else {
					this.splitGoods.forEach(item => {
						item.surplus_num=item.payNum - item.refundNum
					})
					this.goodsChecked = this.splitGoods
				}
			},
			getIndex(info) {
				let that = this;
				let obj = '';
				const cartInfo = info
				let list = cartInfo.map(item => {
					return {
						id: item.id,
						checked: false,
						numShow: item.payNum - item.refundNum,
						surplus_num: item.payNum - item.refundNum,
						...item,
						refundPrice: this.$util.$h.Div(item.refundPrice, item.payNum),
					};
				});
				this.splitGoods = list;
				this.goodsChecked = list;
				
			},
			getList(val) {
				let that = this;
				that.splitGoods = JSON.parse(JSON.stringify(val));
				let goodsChecked = [];
				let cart_ids = [];
				for (let i = 0; i < val.length; i++) {
					if (val[i].checked) {
						goodsChecked.push(val[i]);
						cart_ids.push(val[i].id);
					}
				}
				this.goodsChecked = goodsChecked;
				this.cart_ids = cart_ids;
				this.isAll = this.goodsChecked.length == this.splitGoods.length;
			},
			openRefund() {
				let cart_ids = [];
				let data = {
					refund_price: this.refundMoney,
					type: 1,
					is_split_order: this.isSplit,
				};
				cart_ids = this.goodsChecked.map(({
					id,
					surplus_num
				}) => {
					return {
						orderDetailId: id,
						num: surplus_num
					}
				});
				let refundObj = {
					orderNo: this.orderNo,
					returnType: this.isSplit == 0 ? 1 : 2,
					detailList: cart_ids
				}
				employeeDirectRefund(refundObj).then(res => {
					if (res.code == 200) {
						this.$util.Tips({
							title: '操作成功'
						})
						setTimeout(()=>{
							uni.navigateTo({
								url:'/pages/admin/order/index?type=complete'
							})
						},500)
					}
				}).catch(err=>{
					this.$util.Tips({
						title: err
					})
				})
			},
		},
	}
</script>

<style lang="scss" scoped>
	/deep/checkbox .uni-checkbox-input.uni-checkbox-input-checked {
		border: 1px solid #2A7EFB !important;
		background-color: #2A7EFB !important;
		color: #fff !important;
	}
	
	/deep/checkbox .wx-checkbox-input.wx-checkbox-input-checked {
		border: 1px solid #2A7EFB !important;
		background-color: #2A7EFB !important;
		color: #fff !important;
	}
	.refund {
		padding: 22rpx 20rpx;
	}

	.money-section {
		padding: 12rpx 0;
		border-radius: 24rpx;
		background: #FFFFFF;

		.item {
			height: 80rpx;
			padding: 0 24rpx;
			font-size: 28rpx;
			color: #333333;
		}

		.input {
			flex: 1;
			height: 80rpx;
			text-align: right;
			font-family: Regular;
			font-size: 36rpx;
			color: #FF7E00;
		}

		.icon-ic_edit {
			margin-left: 8rpx;
			font-size: 32rpx;
			color: #999999;
		}

		.radio-group {
			flex: 1;
		}

		.radio-item {
			font-size: 28rpx;
			color: #999999;

			+.radio-item {
				margin-left: 48rpx;
			}

			.iconfont {
				margin-right: 12rpx;
				font-size: 32rpx;
			}

			&.on {
				color: #333333;

				.iconfont {
					color: #2A7EFB;
				}
			}
		}
	}

	.footer {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		padding: 16rpx 20rpx 16rpx 32rpx;
		padding-bottom: calc(16rpx + constant(safe-area-inset-bottom));
		padding-bottom: calc(16rpx + env(safe-area-inset-bottom));
		background: #FFFFFF;

		.btn {
			display: inline-block;
			height: 64rpx;
			padding: 0 40rpx;
			border-radius: 32rpx;
			background: #2A7EFB;
			font-weight: 500;
			font-size: 26rpx;
			line-height: 64rpx;
			color: #FFFFFF;
		}

		.all {
			font-size: 26rpx;
			color: #333333;

			.iconfont {
				margin-right: 12rpx;
				font-size: 40rpx;
				color: #CCCCCC;

				&.icon-a-ic_CompleteSelect {
					color: #2A7EFB;
				}
			}
		}

		.btn-box {
			flex: 1;
			text-align: right;

			.btn {
				text-align: center;
			}
		}
	}
</style>