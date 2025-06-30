<template>
	<view class="sendBox">
		<view class="title" v-if="info.userRefundSign" @click="skipList(info.orderNo)">
			<view class="acea-row row-middle">
				<text class="iconfont icon-shuoming2"></text>
				<view>该订单存在处理中售后，请点击查看</view>
			</view>
			<text class="iconfont icon-xiangyou"></text>
		</view>
		<view class="list">
			<view>
				<text>订单编号：</text><text>{{info.orderNo}}</text>
			</view>
			<view v-if="sendIndex!=4">
				<text>配送方式：</text>
				<picker :disabled="type==2" mode="selector" :range="sendTypeArray" @change="sendPickerChange">
					<view>{{ sendTypeArray[sendIndex] }}<text v-if="type!=2" class="iconfont icon-xiangyou"></text>
					</view>
				</picker>
			</view>
			<view v-if="sendIndex==4">
				<text>配送方式：</text>
				<view class="">
					虚拟发货
				</view>
			</view>
			<view v-if="sendIndex==0&&templateShow=='1'">
				<text>发货类型：</text>
				<picker mode="selector"  :range="expressSendType" @change="expressSendTypeChange">
					<view>{{ (expressSendType.length&&expressSendType[expressSendTypeIndex])||'' }}<text
							class="iconfont icon-xiangyou"></text></view>
				</picker>
				</text>
			</view>
			<view v-if="sendIndex==0&&expressSendTypeIndex==1">
				<text>寄件人姓名：</text><input v-model="saveData.toName" class="input-text textarea-small" type="text"
					placeholder-class="placeholderInput" placeholder="此处填写寄件人姓名" />
			</view>
			<view v-if="sendIndex==0&&expressSendTypeIndex==1">
				<text>寄件人电话：</text><input v-model="saveData.toTel" class="input-text textarea-small" type="text"
					placeholder-class="placeholderInput" placeholder="此处填写寄件人电话" />
			</view>
			<view v-if="sendIndex==0&&expressSendTypeIndex==1">
				<text>寄件人地址：</text><input v-model="saveData.toAddr" class="input-text textarea-small" type="text"
					placeholder-class="placeholderInput" placeholder="此处填写寄件人地址" />
			</view>
			<view v-if="sendIndex==0">
				<text>快递公司：</text>
				<picker mode="selector" range-key='name' :range="expressArray" @change="bindPickerChange">
					<view>{{ (expressArray.length&&expressArray[index].name)||'' }}<text
							class="iconfont icon-xiangyou"></text></view>
				</picker>
				</text>
			</view>
			<view v-if="sendIndex==0&&expressSendTypeIndex==1">
				<text>电子面单：</text>
				<picker mode="selector" range-key='title' :range="templateArray" @change="templateChange">
					<view>{{ (templateArray.length&&templateArray[templateIndex].title)||'' }}<text
							class="iconfont icon-xiangyou"></text><text v-if="templateArray.length" @click.stop="preview" class="preview">预览</text>
					</view>
				</picker>
				</text>
			</view>
			<view v-if="sendIndex==0&&expressSendTypeIndex==0">
				<text>快递单号：</text>
				<view class="acea-row row-middle">
					<input v-model="saveData.expressNumber" class="input-text" type="text" maxlength="40"
						placeholder-class="placeholderInput" placeholder="请输入"></input>
					<text @click="scanCode" class="iconfont icon-ic_Scan"></text>
				</view>
			</view>
			<view v-if="sendIndex==1">
				<text>发货备注：</text><textarea v-model="saveData.deliveryMark" class="input-text textarea" type="text"
					placeholder-class="placeholderInput" placeholder="此处填写发货备注" />
			</view>
			<view v-if="sendIndex==2">
				<text>配送人员：</text>
				<picker mode="selector" range-key='personnelName' :range="deliveryPersonnelList"
					@change="deliveryPersonneChange">
					<view>
						{{ saveData.deliveryCarrier||'' }}<text class="iconfont icon-xiangyou"></text>
					</view>
				</picker>
				</text>
			</view>
			<view v-if="sendIndex==2">
				<text>手机号：</text><input v-model="saveData.carrierPhone" disabled="true" class="input-text" type="text"
					placeholder-class="placeholderInput" placeholder="请输入手机号" />
			</view>
			<view v-if="sendIndex==4">
				<text>发货备注：</text><textarea v-model="saveData.deliveryMark" class="input-text textarea" type="text"
					placeholder-class="placeholderInput" placeholder="此处填写发货备注" />
			</view>
		</view>
		<view class="split-wrapper" v-if="info.totalNum>1&&type==1&&sendIndex!=4">
			<view class="split-switch acea-row row-between-wrapper">
				<view>分单发货</view>
				<view class="switch" :class="{ on: curGoods }" @click="changeGoods"></view>
			</view>
			<splitOrder :select_all="false" :splitGoods="splitGoods" @getList="getList" v-if="curGoods"></splitOrder>
		</view>
		<view class="height-add"></view>
		<view class="confirm-wrapper">
			<view class="confirm-wrapper-num">
				<text v-if="type==1">共{{num}}件</text>
			</view>
			<view v-if="type==1" class="confirm" @click="saveInfo">确认发货</view>
			<view v-else class="confirm" @click="updateInfo">确认修改</view>
		</view>
	</view>
</template>

<script>
	import Cache from '@/utils/cache';
	import {
		orderInvoiceListInfo
	} from '@/api/order.js';
	import {
		Debounce
	} from '@/utils/validate.js'
	import {
		expressSearchPage,
		employeeOrderInvoiceUpdate,
		deliveryPersonnelApi,
		employeeExpressTemplate,
		employeeExpressElectInfo
	} from '@/api/work.js'
	import {
		employeeOrderSend,
		employeeOrderInfo,
		employeeInvoiceList
	} from '@/api/work.js'
	import splitOrder from '../components/splitOrder/index.vue'
	export default {
		components: {
			splitOrder
		},
		data() {
			return {
				info: {},
				index: 0,
				sendIndex: 0,
				expressArray: [],
				curGoods: 0,
				splitGoods: [],
				cartIds: [],
				expressSendType: ['手动填写', '电子面单'],
				saveData: {
					"expressRecordType": 1,
					"orderNo": '',
					"deliveryType": "express",
					"isSplit": "",
					"detailList": [{
						"num": 0,
						"orderDetailId": 0
					}],
					"expressCode": "",
					"expressNumber": "",
					"deliveryMark": "",
					"deliveryCarrier": "",
					"carrierPhone": "",
					"id": '',
					"toName": '',
					"toTel": '',
					"toAddr": '',
					"expressTempId": ''
				},
				sendTypeArray: ['快递配送', '无需发货', '商家送货'],
				expressType: ['express', 'noNeed', 'merchant'],
				//1-发货 2-编辑
				type: 1,
				//配送方式
				deliveryType: '',
				orderNo: '',
				orderIndex: '',
				deliveryPersonnelList: [], //配送人员
				personneIndex: 0,
				expressSendTypeIndex: 0,
				templateArray: [],
				templateIndex: 0,
				templateShow:Cache.get('electrPrintingSwitch') ,
			}
		},
		computed: {
			num() {
				let sum = 0
				if (this.curGoods) {
					this.cartIds.forEach(value => {
						sum += value.num
					})
				} else {
					let list = this.info.orderDetailList
					if (list) {
						list.forEach(item => {
							sum += (item.payNum - item.deliveryNum - item.refundNum)
						})
					}
				}
				return sum
			}
		},
		created() {
			this.expressAll('1')
		},
		onLoad(options) {
			this.initOrderInfo(options.orderNo)
			this.updateInit(options)
			this.getDeliveryPersonnel(options)
			this.getElectInfo()
		},
		methods: {
			getElectInfo(){
				employeeExpressElectInfo().then(res=>{
					this.saveData.toName=res.data.senderUsername;
					this.saveData.toTel=res.data.senderPhone;
					this.saveData.toAddr=res.data.senderAddr;
				})
			},
			preview() {
				uni.previewImage({
					current: 0,
					urls: [this.templateArray[this.templateIndex].pic],
					longPressActions: {
						fail: function(err) {
							console.log(err.errMsg);
						}
					}
				})
			},
			//配送人员列表
			async getDeliveryPersonnel(options) {
				let {
					data
				} = await deliveryPersonnelApi({
					limit: 99999,
					page: 1
				})
				this.deliveryPersonnelList = data.list
				if (options.index != 0) {
					this.saveData.deliveryCarrier = this.deliveryPersonnelList[this.personneIndex].personnelName
					this.saveData.carrierPhone = this.deliveryPersonnelList[this.personneIndex].personnelPhone
				}

			},
			//配送人员选择
			deliveryPersonneChange: function(e) {
				this.personneIndex = e.detail.value
				this.saveData.deliveryCarrier = this.deliveryPersonnelList[e.detail.value].personnelName
				this.saveData.carrierPhone = this.deliveryPersonnelList[e.detail.value].personnelPhone
			},
			updateInit(options) {
				if (options.type) {
					this.type = options.type
					this.orderNo = options.orderNo
					this.orderIndex = options.index
					this.getInfo(options.orderNo, options.index)
				}
			},
			getInfo(orderNo, index) {
				orderInvoiceListInfo(orderNo).then(res => {
					this.sendIndex = res.data.invoiceList[index].deliveryType == 'merchant' ? 2 : 1
					this.saveData.deliveryMark = res.data.invoiceList[index].deliveryMark
					this.saveData.deliveryCarrier = res.data.invoiceList[index].deliveryCarrier
					this.saveData.carrierPhone = res.data.invoiceList[index].carrierPhone
					this.saveData.id = res.data.invoiceList[index].id
				})
			},
			// 扫码
			scanCode() {
				var self = this;
				// #ifdef MP || APP
				uni.scanCode({
					scanType: ['barCode'],
					success(res) {
						self.saveData.expressNumber = res.result;
					}
				})
				// #endif
				//#ifdef H5
				if (this.$wechat.isWeixin()) {
					this.$wechat.wechatEvevt('scanQRCode', {
						needResult: 1,
						scanType: ["barCode"]
					}).then(res => {
						let result = res.resultStr;
						if (result.includes(',')) {
							result = result.split(",")[1]
						}
						self.saveData.expressNumber = result
					})
				} else {
					return self.$util.Tips({
						title: '扫码仅支持小程序/公众号/APP',
						endtime: 2000,
					});
				}
				//#endif
			},
			skipList(orderNo) {
				uni.navigateTo({
					url: `/pages/admin/skipRefund/index?orderNo=${orderNo}`
				})
			},
			expressAll(flag) {
				expressSearchPage({
					openStatus: true
				}).then(res => {
					if (res.data.list.length) {
						this.expressArray = res.data.list
						flag == '1' && (this.saveData.expressCode = this.expressArray[0].code)
					} else {
						return this.$util.Tips({
							title: '请先配置物流公司～',
							endtime: 2000,
						});
					}
				})
			},
			getList(val) {
				let that = this;
				that.splitGoods = JSON.parse(JSON.stringify(val));
				let cartIds = [];
				val.forEach((item) => {
					if (item.checked) {
						let i = {
							orderDetailId: item.id,
							num: item.surplus_num
						}
						cartIds.push(i)
					}
				})
				this.cartIds = cartIds;
			},
			// 点击获取拆单列表
			changeGoods() {
				this.curGoods = this.curGoods ? 0 : 1;
				if (this.curGoods) {
					this.splitList();
				}
			},
			splitList() {
				let list = this.info.orderDetailList
				list.forEach((item) => {
					item.checked = false
					item.surplus_num = item.payNum - item.deliveryNum - item.refundNum
					item.numShow = item.payNum - item.deliveryNum - item.refundNum
				})
				this.splitGoods = list;
			},
			initOrderInfo(orderNo) {
				employeeOrderInfo(orderNo).then(res => {
					this.info = res.data
					this.saveData.orderNo = this.info.orderNo
					if (this.info.secondType == 2) {
						this.sendIndex = 4
					}
				})
			},
			bindPickerChange: function(e) {
				this.index = e.detail.value
				this.saveData.expressCode = this.expressArray[e.detail.value].code
				if (this.expressSendTypeIndex == 1) {
					this.getTemplate(this.expressArray[e.detail.value].code)
					this.templateIndex = 0
				}
			},
			getTemplate(code) {
				employeeExpressTemplate({
					com: code
				}).then(res => {
					this.templateArray = res.data.data.data
				})
			},
			expressSendTypeChange: function(e) {
				this.expressSendTypeIndex = e.detail.value
				this.getTemplate(this.expressArray[0].code)
				this.templateIndex = 0
			},
			templateChange: function(e) {
				this.templateIndex = e.detail.value
			},
			sendPickerChange: function(e) {
				this.sendIndex = e.detail.value
				this.saveData.deliveryType = this.expressType[this.sendIndex]
			},
			//确认提交
			saveInfo: Debounce(function() {
				this.saveData.expressTempId = this.templateArray[this.templateIndex]?.temp_id
				// 是否分单
				if (this.curGoods) {
					this.saveData.detailList = this.cartIds
					this.saveData.isSplit = true
				} else {
					this.saveData.isSplit = false
					let arr = []
					let list = this.info.orderDetailList
					list.forEach(item => {
						arr.push({
							orderDetailId: item.attrValueId,
							num: item.payNum - item.deliveryNum - item.refundNum
						})
					})
					this.saveData.detailList = arr
				}
				if (this.sendIndex == 0 && this.expressSendTypeIndex == 1) {
					// 提交校验
					if (!this.saveData.toAddr || !this.saveData.toName || !this.saveData.toTel) {
						return this.$util.Tips({
							title: '请将信息填写完整'
						})
					}
					if (!/^1(3|4|5|7|8|9|6)\d{9}$/i.test(this.saveData.toTel)) {
						return this.$util.Tips({
							title: '请输入正确寄件人电话'
						})
					}
				}
				if (this.sendIndex == 0 && this.expressSendTypeIndex == 0) {
					// 提交校验
					if (!this.saveData.expressNumber) {
						return this.$util.Tips({
							title: '请输入快递单号'
						})
					} else if (!this.saveData.detailList.length) {
						return this.$util.Tips({
							title: '请先选择商品'
						})
					}
				}
				if (this.sendIndex == 1) {
					// 提交校验
					if (!this.saveData.deliveryMark) {
						// return this.$util.Tips({
						// 	title: '请输入商家备注'
						// })
					} else if (!this.saveData.detailList.length) {
						return this.$util.Tips({
							title: '请先选择商品'
						})
					}
				}
				if (this.sendIndex == 2) {
					// 提交校验
					if (!this.saveData.deliveryCarrier) {
						return this.$util.Tips({
							title: '请输入配送人姓名'
						})
					} else if (!this.saveData.detailList.length) {
						return this.$util.Tips({
							title: '请先选择商品'
						})
					} else if (!/^1(3|4|5|7|8|9|6)\d{9}$/i.test(this.saveData.carrierPhone)) {
						return this.$util.Tips({
							title: '请输入正确手机号码'
						})
					}
				}
				if (this.sendIndex == 4) {
					this.saveData.deliveryType = 'noNeed'
				}
				//参数处理
				if (this.expressSendTypeIndex == 1) {
					this.expressSendTypeIndex = 2
					this.saveData.expressRecordType=2
				} else if (this.expressSendTypeIndex == 0) {
					this.expressSendTypeIndex = 1
					this.saveData.expressRecordType=1
				}
				employeeOrderSend(this.saveData).then(res => {
					if (res.code == 200) {
						this.$util.Tips({
							title: '操作成功'
						})
						setTimeout(() => {
							uni.navigateBack({
								delta: 1,
							});
						}, 500)
					}
				}).catch(err => {
					return this.$util.Tips({
						title: err
					})
				})
				if (this.expressSendTypeIndex == 2) {
					this.expressSendTypeIndex = 1
					this.saveData.expressRecordType=1
				} else if (this.expressSendTypeIndex == 1) {
					this.expressSendTypeIndex = 0
					this.saveData.expressRecordType=0
				}
			}),
			// 修改配送信息
			updateInfo() {
				employeeOrderInvoiceUpdate(this.saveData).then(res => {
					this.$util.Tips({
						title: '操作成功',
						endtime: 1000,
					})
					setTimeout(() => {
						uni.redirectTo({
							url: `/pages/admin/logistics/record?orderNo=${this.orderNo}&index=${this.orderIndex}`
						})
					}, 500)
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	::v-deep.uni-checkbox-input.uni-checkbox-input-checked {
		border: 1px solid #2A7EFB !important;
		background-color: #2A7EFB !important;
		color: #FFF !important;
	}

	::v-deep.wx-checkbox-input.wx-checkbox-input-checked {
		border: 1px solid #2A7EFB !important;
		background-color: #2A7EFB !important;
		color: #FFF !important;
	}

	.sendBox {
		padding: 20rpx;

		.title {
			display: flex;
			align-items: center;
			justify-content: space-between;
			background: #E5EFFE;
			border-radius: 14rpx;
			padding: 28rpx 24rpx;
			font-family: PingFang SC, PingFang SC;
			font-weight: 400;
			font-size: 26rpx;
			color: #2A7EFB;
			margin-bottom: 20rpx;
		}

		.list {
			padding: 28rpx 24rpx;
			border-radius: 14rpx;
			font-size: 28rpx;
			background-color: #FFF;
			// margin-top: 20rpx;

			&>view {
				padding: 20rpx 0;
				display: flex;
				justify-content: space-between;

				input {
					font-weight: 400;
					font-size: 14px;
					color: #999999;
				}
			}
		}

		.operate {
			padding: 28rpx 24rpx;
			border-radius: 14rpx;
			background-color: #FFF;
			margin-top: 20rpx;

			.operate-btn {
				display: flex;
				align-items: center;
				justify-content: space-between;
			}

			.operate-goods {
				margin-top: 20rpx;

				.operate-goods-item {
					display: flex;
					align-items: center;
					justify-content: space-between;

					.icon-a-ic_CompleteSelect,
					.icon-weixuanzhong {
						color: #2A7EFB;
					}

					.goods-info {
						display: flex;

						.img {
							width: 136rpx;
							height: 136rpx;
							border-radius: 16rpx;
						}

						.info {
							display: flex;
							flex-direction: column;
							justify-content: space-between;
							margin-left: 10rpx;

							&>view {
								width: 350rpx;
								overflow: hidden;
								/* 确保超出容器的文本被裁剪 */
								white-space: nowrap;
								/* 确保文本在一行内显示 */
								text-overflow: ellipsis;
								/* 使用省略号表示文本溢出 */
							}

							.name {
								font-size: 28rpx;
								color: #333333;
							}

							.sku {
								font-size: 22rpx;
								color: #999999;
							}

							.num {
								font-size: 22rpx;

								text {
									color: #2A7EFB;
								}
							}
						}
					}

					.num-operate {
						height: 130rpx;
						display: flex;
						align-items: end;

						.num-operate-box {
							display: flex;
							align-items: center;

							.ipt {
								text-align: center;
								width: 50rpx;
								background: #F5F5F5;
								border-radius: 4rpx;
								margin: 0 10rpx;
							}

							.iconfont {
								font-size: 28rpx;
							}
						}
					}
				}
			}
		}
	}

	.split-wrapper {
		border-radius: 24rpx;
		margin-top: 20rpx;
		background: #FFFFFF;

		.splitOrder {
			padding: 0 24rpx 46rpx;
			margin: 0;
		}
	}

	.split-switch {
		padding: 40rpx 24rpx;
		font-size: 28rpx;
		color: #333333;

		.switch {
			position: relative;
			width: 79rpx;
			height: 48rpx;
			padding: 4rpx;
			border-radius: 24rpx;
			background: #DDDDDD;
			transition: background 0.1s, border 0.1s;
			line-height: 48rpx;

			&::after {
				content: "";
				position: absolute;
				top: 4rpx;
				left: 4rpx;
				width: 40rpx;
				height: 40rpx;
				border-radius: 20rpx;
				background: #FFFFFF;
				box-shadow: 0 3rpx 6rpx 0 rgba(0, 0, 0, 0.08);
				transition: transform 0.35s cubic-bezier(0.4, 0.4, 0.25, 1.35);
			}

			&.on {
				background: #2A7EFB;

				&::after {
					transform: translateX(31rpx);
				}
			}
		}
	}

	.height-add {
		height: 120rpx;
	}

	.confirm-wrapper {
		position: fixed;
		left: 0;
		bottom: 0;
		bottom: constant(safe-area-inset-bottom);
		bottom: env(safe-area-inset-bottom);
		width: 100%;
		padding: 20rpx;
		display: flex;
		justify-content: space-between;
		height: 100rpx;
		line-height: 100rpx;
		background: #fff;
	}

	.confirm {
		width: 160rpx;
		height: 64rpx;
		font-weight: 500;
		font-size: 28rpx;
		color: #fff;
		border-radius: 40rpx;
		background: #2A7EFB;
		text-align: center;
		line-height: 64rpx;
	}

	.confirm-wrapper-num {
		height: 60rpx;
		line-height: 60rpx;
	}

	.placeholderInput {
		text-align: right;
		width: 100%;
		font-size: 28rpx;
	}

	.icon-xiangyou {
		font-size: 28rpx !important;
		color: #999;
	}

	.icon-shuoming2 {
		margin-right: 6rpx !important;
	}

	.input-text {
		text-align: right !important;
		white-space: normal;
	}

	::v-deep.split-switch .switch::after {
		top: 4rpx;
	}

	.icon-ic_Scan {
		color: #2A7EFB;
		margin-left: 12rpx;
	}

	.textarea {
		width: 400rpx;
		height: 80rpx;
	}

	.preview {
		font-weight: 400;
		font-size: 14px;
		color: #2A7EFB;
	}
	.textarea-small{
		width: 400rpx;
		height: 38rpx;
		line-height: 38rpx;
	}
</style>