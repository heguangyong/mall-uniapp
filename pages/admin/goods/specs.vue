<template>
	<view class="specs">
		<checkbox-group @change="checkboxChange">
			<view class="list acea-row" :class="administer?'on':''" v-for="(item, index) in attrsList" :key="index">
				<!-- #ifndef MP -->
				<checkbox class="checkbox" v-if="administer" :value="(item.id).toString()" :checked="item.checked" />
				<!-- #endif -->
				<!-- #ifdef MP -->
				<checkbox class="checkbox" v-if="administer" :value="item.id" :checked="item.checked" />
				<!-- #endif -->
				<view class="listCon">
					<!-- <view class="item acea-row row-middle">
						<view class="name">商品图</view>
						<view class="pictrue">
							<image :src="item.image" mode="aspectFill"></image>
						</view>
					</view> -->
					<view class="item acea-row row-middle">
						<view class="name">规格名称</view>
						<view class="info">{{item.attrValue}}</view>
					</view>
					<view class="item acea-row row-middle">
						<view class="name">成本价</view>
						<input type="number" :disabled="administer" v-model="item.cost" 
							placeholder-class="placeholder" />
					</view>
					<view class="item acea-row row-middle">
						<view class="name">划线价</view>
						<input type="number" :disabled="administer" v-model="item.otPrice" 
							placeholder-class="placeholder" />
					</view>
					<view class="item acea-row row-middle">
						<view class="name">售价</view>
						<input type="number"  @blur="handleInput(item)" :disabled="administer" min='0' v-model="item.price"
							placeholder="请填写售价" placeholder-class="placeholder" />
					</view>
					<view class="item acea-row row-middle" v-if="isPaidMember">
						<view class="name">会员价</view>
						<input @blur="handleInput(item)"  type="number" :disabled="administer" min='0' v-model="item.vipPrice"
							placeholder="请填写会员价" placeholder-class="placeholder" />
					</view>
					<view class="item acea-row row-middle">
						<view class="name">库存</view>
						<input type="number" :disabled="administer" v-model="item.stock" placeholder="请填写库存"
							placeholder-class="placeholder" />
					</view>
				</view>
			</view>
		</checkbox-group>
		<view class="footer on acea-row row-between-wrapper" v-if="administer">
			<checkbox-group @change="checkboxAllChange">
				<checkbox value="all" :checked="isAllSelect" />
				<text class='checkAll'>全选</text>
			</checkbox-group>
			<view class="acea-row row-middle">
				<view class="bnt acea-row row-center-wrapper" @click="manageTap">取消</view>
				<view class="bnt on acea-row row-center-wrapper" @click="batchEdit">批量修改</view>
			</view>
		</view>
		<view class="footer acea-row row-between-wrapper" v-else>
			<view class="bnt acea-row row-center-wrapper" @click="manageTap">批量操作</view>
			<view class="bnt on acea-row row-center-wrapper" @click="define">保存</view>
		</view>
		<edit-price :visible='visiblePrice' :isPaidMember="isPaidMember"  :goodsInfo='goodsInfo' @closeDrawer='priceCloseDrawer'
			@successChange='successChange'></edit-price>
	</view>
</template>

<script>
	import editPrice from './components/editPrice/index.vue';
	import {
		employeeProductInfo,
		reviewFreeEdit
	} from "@/api/work.js";
	export default {
		components: {
			editPrice
		},
		data() {
			return {
				attrsList: [],
				id: 0,
				administer: false,
				isAllSelect: false,
				visiblePrice: false,
				goodsInfo: {
					id: 0,
					spec_type: 1,
					attr_value: {}
				},
				cateId: '',
				isPaidMember:false,
			}
		},
		onShow() {},
		onLoad(option) {
			this.id = option.id;
			this.getAttrsList();
		},
		methods: {
			handleInput(item) {
			      if (Number(item.vipPrice) > Number(item.price)) {
			        item.vipPrice = item.price-0.01;
			      }
				  if(Number(item.vipPrice)<=0){
					  item.vipPrice=0.01
				  }
			    },
			//只能输入两位小数
			decimalNum(e,item) {
				let that = this
				// 通过正则过滤小数点后两位
				// valueAsNumber是输入框值经过过滤的数字形式 如001就是1
				let value = '';
				value = (e.detail.value).toString();
				value = (value.match(/^\d*(.?\d{0,2})/g)[0]) || null
				that.$set(item,'price', value)
			},
			//批量获取id集合
			getIds() {
				let ids = []
				this.attrsList.forEach(item => {
					if (item.checked) {
						ids.push(item.id)
					}
				})
				return ids
			},
			batchEdit() {
				if (!this.getIds().length) {
					this.$util.Tips({
						title: '请选择商品规格'
					});
					return
				}
				this.goodsInfo.id = this.id;
				this.goodsInfo.attr_value = {
					cost: '',
					price: '',
					otPrice: '',
					stock: '',
					vipPrice:''
				}
				this.visiblePrice = true;
			},
			define() {
				let data = {
					attr_value: []
				}
				this.attrsList.forEach(item => {
					data.attr_value.push({
						id: item.id,
						price: item.price,
						stock: item.stock,
						cost:item.cost,
						otPrice:item.otPrice,
						vipPrice:item.vipPrice,
					})
				})
				let requestObj = {
					"attrValue": data.attr_value,
					"cateId": this.cateId,
					"id": this.id
				}
				reviewFreeEdit(requestObj).then(res => {
					if (res.code == 200) {
						this.$util.Tips({
							title: '操作成功'
						});
						setTimeout(function() {
							uni.navigateBack()
						}, 300);
					}
				})
			},
			getAttrsList() {
				employeeProductInfo(this.id).then(res => {
					let data = res.data.attrValueList;
					this.isPaidMember=res.data.isPaidMember
					this.cateId = res.data.cateId
					data.forEach(item => {
						item.checked = false;
						let str = ''
						let obj = JSON.parse(item.attrValue)
						for (let key in obj) {
							str += `${obj[key]},`
						}
						str = str.slice(0, str.length - 1)
						item.attrValue = str
					})
					this.attrsList = data;
				}).catch(err => {
					this.$util.Tips({
						title: err
					});
				})
			},
			checkboxChange(event) {
				let idList = event.detail.value;
				this.attrsList.forEach((item) => {
					if (idList.indexOf(item.id + '') !== -1) {
						item.checked = true;
					} else {
						item.checked = false;
					}
				})
				if (idList.length == this.attrsList.length) {
					this.isAllSelect = true;
				} else {
					this.isAllSelect = false;
				}
			},
			forGoods(val) {
				let that = this;
				if (!that.attrsList.length) return
				that.attrsList.forEach((item) => {
					if (val) {
						item.checked = true;
					} else {
						item.checked = false;
					}
				})
			},
			checkboxAllChange(event) {
				let value = event.detail.value;
				if (value.length) {
					this.isAllSelect = true;
					this.forGoods(1)
				} else {
					this.isAllSelect = false;
					this.forGoods(0)
				}
			},
			manageTap() {
				this.administer = !this.administer;
			},
			priceCloseDrawer() {
				this.visiblePrice = false
			},
			successChange(e) {
				this.visiblePrice = false
				let data = e;
				this.attrsList.forEach(item => {
					if (item.checked) {
						if (data.cost) {
							item.cost = data.cost
						}
						if (data.price) {
							item.price = data.price
						}
						if (data.otPrice) {
							item.otPrice = data.otPrice
						}
						if (data.stock) {
							item.stock = data.stock
						}
						if (data.vipPrice&&Number(data.vipPrice)<Number(item.price)) {
							item.vipPrice = data.vipPrice
						}
						if (data.vipPrice&&Number(data.vipPrice)>Number(item.price)) {
							item.vipPrice = item.price-0.01
						}
						if (data.vipPrice&&Number(data.vipPrice)<=0) {
							item.vipPrice =0.01
						}
						if(data.price&&Number(data.price)<Number(item.vipPrice)){
							item.vipPrice=data.price-0.01
						}
					}
				})
				this.manageTap();
			}
		}
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

	.specs {
		padding: 24rpx 20rpx 112rpx 20rpx;
		padding-bottom: calc(112rpx + constant(safe-area-inset-bottom)); ///兼容 IOS<11.2/
		padding-bottom: calc(112rpx + env(safe-area-inset-bottom)); ///兼容 IOS>11.2/

		.list {
			background-color: #fff;
			border-radius: 24rpx;
			padding: 0 24rpx;
			margin-bottom: 20rpx;

			.listCon {
				flex: 1;
			}

			&.on {
				input {
					color: #999999 !important;
				}
			}

			.checkbox {
				margin: 32rpx 12rpx 0 0;
			}

			.item {
				min-height: 102rpx;
				font-size: 28rpx;
				font-family: PingFang SC, PingFang SC;
				font-weight: 400;

				&~.item {
					border-top: 1rpx solid #F1F1F1;
				}

				.name {
					color: #333333;
					width: 115rpx;
					margin-right: 39rpx;
				}

				.info {
					color: #999999;
					flex: 1;
				}

				input {
					font-size: 36rpx;
					font-family: 'Regular';
					color: #333333;
				}

				// #ifdef MP
				input {
					font-size: 30rpx;
				}

				// #endif
				.placeholder {
					font-size: 28rpx;
				}

				.pictrue {
					width: 100rpx;
					height: 100rpx;

					image {
						width: 100%;
						height: 100%;
						border-radius: 16rpx;
					}
				}
			}
		}

		.footer {
			box-sizing: border-box;
			padding: 0 20rpx;
			width: 100%;
			height: 112rpx;
			background-color: #fff;
			position: fixed;
			bottom: 0;
			z-index: 30;
			height: calc(112rpx + constant(safe-area-inset-bottom)); ///兼容 IOS<11.2/
			height: calc(112rpx + env(safe-area-inset-bottom)); ///兼容 IOS>11.2/
			padding-bottom: constant(safe-area-inset-bottom); ///兼容 IOS<11.2/
			padding-bottom: env(safe-area-inset-bottom); ///兼容 IOS>11.2/
			width: 100%;
			left: 0;

			&.on {
				height: 96rpx;
				height: calc(96rpx + constant(safe-area-inset-bottom)); ///兼容 IOS<11.2/
				height: calc(96rpx + env(safe-area-inset-bottom)); ///兼容 IOS>11.2/

				.bnt {
					width: 160rpx;
					height: 64rpx;
					font-size: 24rpx;

					&.on {
						background-color: #2A7EFB;
						color: #fff;
						margin-left: 16rpx;
					}
				}
			}

			.bnt {
				width: 346rpx;
				height: 72rpx;
				border-radius: 200rpx;
				border: 1px solid #2A7EFB;
				color: #2A7EFB;
				font-size: 26rpx;
				font-family: PingFang SC, PingFang SC;
				font-weight: 500;

				&.on {
					background-color: #2A7EFB;
					color: #fff;
				}
			}
		}
	}
</style>