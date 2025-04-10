<template>
	<view class="pos-order-list" ref="container">
		<!-- #ifdef MP || APP-PLUS -->
		<NavBar titleText="订单管理" bagColor="#f5f5f5" :iconColor="iconColor" :textColor="iconColor"
			:isScrolling="isScrolling" showBack></NavBar>
		<!-- #endif -->
		<view class="searchCon acea-row">
			<view class="search acea-row row-middle">
				<text class="iconfont icon-ic_search"></text>
				<input class="inputs" placeholder='请输入订单号' placeholder-style="font-size:28rpx" placeholder-class='placeholder' confirm-type='search'
					name="search" v-model="searchListData.orderNo" @confirm="searchSubmit"></input>
			</view>
			<view class="btn" @click="filterShow = true">
				<text class="iconfont icon-a-icon_filter1x"></text>
			</view>
		</view>
		<view :style="{ height: navHeight + 'px' }" v-if="isFixed"></view>
		<!-- #ifdef MP -->
		<view class="nav acea-row row-around row-middle" :style="{
			top:getHeight.barTop+getHeight.barHeight+'px'
		}" id="nav">
		<!-- #endif -->
			<!-- #ifndef MP -->
			<view class="nav acea-row row-around row-middle" id="nav">
			<!-- #endif -->
				<scroll-view scroll-x="true" class="scroll_view">
					<view class="item" :class="state == 'all' ? 'on' : ''" @click="changeStatus('all')">
						全部({{headerArr['all']!=undefined?headerArr['all']:0}})
						<image src="../static/adorn.png" v-if="state == 'all'"></image>
					</view>
					<view class="item" :class="state == 'notShipped' ? 'on' : ''" @click="changeStatus('notShipped')">
						待发货({{headerArr['notShipped']!=undefined?headerArr['notShipped']:0}})
						<image src="../static/adorn.png" v-if="state == 'notShipped'"></image>
					</view>
					<view class="item" :class="state == 'spike' ? 'on' : ''" @click="changeStatus('spike')">
						待收货({{headerArr['spike']!=undefined?headerArr['spike']:0}})
						<image src="../static/adorn.png" v-if="state == 'spike'"></image>
					</view>
					<view class="item" :class="state == 'awaitVerification' ? 'on' : ''"
						@click="changeStatus('awaitVerification')">
						待核销({{headerArr['verification']!=undefined?headerArr['verification']:0}})
						<image src="../static/adorn.png" v-if="state == 'awaitVerification'"></image>
					</view>
					<view class="item" :class="state == 'receiving' ? 'on' : ''" @click="changeStatus('receiving')">
						已收货({{headerArr['receiving']!=undefined?headerArr['receiving']:0}})
						<image src="../static/adorn.png" v-if="state == 'receiving'"></image>
					</view>
					<view class="item" :class="state == 'complete' ? 'on' : ''" @click="changeStatus('complete')">
						已完成({{headerArr['complete']!=undefined?headerArr['complete']:0}})
						<image src="../static/adorn.png" v-if="state == 'complete'"></image>
					</view>
					<view class="item" :class="state == 'refunded' ? 'on' : ''" @click="changeStatus('refunded')">
						已退款({{headerArr['refunded']!=undefined?headerArr['refunded']:0}})
						<image src="../static/adorn.png" v-if="state == 'refunded'"></image>
					</view>
					<view class="item" :class="state == 'deleted' ? 'on' : ''" @click="changeStatus('deleted')">
						已删除({{headerArr['deleted']!=undefined?headerArr['deleted']:0}})
						<image src="../static/adorn.png" v-if="state == 'deleted'"></image>
					</view>
				</scroll-view>
			</view>
			<view class="list" v-if="list.length">
				<view class="item" v-for="(item, index) in list" :key="index">
					<view class="order-num acea-row row-between-wrapper" @click="toDetail(item)">
						<view>
							<view class="title">
								<view class="type">{{orderType[item.type]}}</view>{{ item.orderNo }}
							</view>
						</view>
						<view class="state" v-if="item.refundStatus==3">
							已退款
						</view>
						<view class="state" v-else-if="item.groupBuyRecordStatus===99||item.groupBuyRecordStatus===10|| item.status == 9">
							{{orderStatus[item.status]}}
						</view>
						<view class="state" v-else>
							{{item.groupBuyRecordStatus==0?'拼团中':'拼团失败'}}
						</view>
					</view>
					<view class="pos-order-goods">
						<view class="goods acea-row" @click="toDetail(item)">
							<scroll-view class="picTxt scroll-view" scroll-x="true"
								v-if="item.infoResponseList.length > 1">
								<view class="pictrue" v-for="(val, key) in item.infoResponseList" :key="key">
									<image :src="val.image" />
								</view>
							</scroll-view>
							<view class="picTxt" v-else>
								<view class="acea-row" v-for="(val, key) in item.infoResponseList" :key="key">
									<view class="pictrue">
										<image :src="val.image" />
									</view>
									<view class="text info-text">
										<view class="info line2">
											{{ val.productName }}
										</view>
										<view class="attr">
											{{ val.sku }}
										</view>
									</view>
								</view>
							</view>
							<view class="money">
								<baseMoney :money="item.payPrice" symbolSize="20" integerSize="32" decimalSize="20">
								</baseMoney>
								<view class="num">共{{ item.totalNum }}件</view>
							</view>
						</view>
					</view>
					<view class="operation acea-row row-between-wrapper">
						<view class="more">
						</view>
						<view class="acea-row row-middle">
							<view class="bnt" v-if="item.groupBuyRecordStatus==10||item.groupBuyRecordStatus==99"  @click="modify(item, 1)">订单备注</view>
							<view class="bnt primary" v-if="[1,2].includes(item.status)&&item.refundStatus!=3&&(item.groupBuyRecordStatus==10||item.groupBuyRecordStatus==99)"
								@click="goDelivery(item)">立即发货
							</view>
							<!-- <navigator class="bnt primary" :url="'/pages/admin/logistics/index?orderId='+item.order_id"
								v-if="item._status == 4 && item.delivery_type == 'express'&&item.refundStatus!=3">发货记录
							</navigator> -->
							<view class="bnt primary" v-if="item.status==3&&item.refundStatus!=3&&item.groupBuyRecordStatus==99" @click="verify(item)">
								立即核销</view>
							<view class="bnt primary" v-if="item.status==3&&item.groupBuyRecordStatus==10&&item.refundStatus!=3" @click="verify(item)">
								立即核销</view>
						</view>
					</view>
				</view>
			</view>
			<emptyPage v-else title="暂无订单～" :imgSrc="urlDomain+'crmebimage/presets/noShopper.png'"></emptyPage>
			<Loading :loaded="loaded" :loading="loading"></Loading>
			<PriceChange :change="change" :orderInfo="orderInfo" :isRefund="isRefund"
				v-on:statusChange="statusChange($event)" v-on:closechange="changeclose($event)"
				v-on:savePrice="savePrice" :status="status"></PriceChange>
			<view class="mask" v-if="filterShow" @click="filterShow=!filterShow"></view>
			<!-- #ifdef H5 -->
			<view class="filter-popup" :class="{ on: filterShow }">
			<!-- #endif -->
			<!-- #ifndef H5 -->
			<view class="filter-popup" :class="{ on: filterShow }" :style="{
			top:getHeight.barTop+getHeight.barHeight+'px'}">
			<!-- #endif -->
				<view class="search-box">
					<view class="search acea-row row-middle">
						<text class="iconfont icon-ic_search"></text>
						<input class="input" placeholder='请输入要查询的订单' placeholder-style="font-size:28rpx" placeholder-class='placeholder'
							confirm-type='search' name="search" v-model="searchListData.orderNo"
							@confirm="searchSubmit"></input>
					</view>
				</view>
				<view class="content">
					<view class="item">
						<view class="title">按下单时间</view>
						<view class="acea-row list">
							<view class="cell" v-for="(item, index) in dateList" :key="index"
								:class="{ on: item.val == dateSelected }" @click="dateChange(item.val)">{{ item.label }}
							</view>
						</view>
					</view>
					<view class="item">
						<view class="title">按订单类型</view>
						<view class="acea-row list">
							<view class="cell" v-for="(item, index) in payList" :key="index"
								:class="{ on: item.val === searchListData.type }" @click="payChange(item.val)">
								{{ item.label }}
							</view>
						</view>
					</view>
					<view class="bottom">
						<view class="no_view" @click="resetBtn">重置</view>
						<view class="yes_view" @click="submitBtn">确定</view>
					</view>
				</view>
			</view>
			<view v-if="confirmShow" class="mask"></view>
			<view v-if="confirmShow" class="confirm-popup">
				<view class="title">确认付款</view>
				<view class="info">确认该订单用户已付款</view>
				<view class="acea-row btn-box">
					<view class="btn" @click="confirmShow = false">取消</view>
					<view class="btn primary" @click="offlinePay">确认</view>
				</view>
			</view>
			<view class="footerH"></view>
			<footerPage></footerPage>
		</view>
</template>

<script>
	// import UniDatetime from '../components/uni-datetime-picker/components/uni-datetime-picker/uni-datetime-picker.vue'
	import Loading from '../components/Loading/index'
	import PriceChange from '../components/PriceChange/index.vue'
	import footerPage from '../components/footerPage/index.vue'
	import countDown from '@/components/countDown/index.vue'
	import emptyPage from '@/components/emptyPage.vue'
	import baseMoney from '../components/BaseMoney.vue'
	// #ifdef MP || APP-PLUS
	import NavBar from '../components/NavBar.vue';
	// #endif
	import {
		isMoney
	} from '@/utils/validate.js';
	import {
		HTTP_REQUEST_URL
	} from '@/config/app';
	import {
		employeeOrderList,
		employeeOrderMark,
		orderStatusNum,
		employeeOrderInfo,
		orderGetVerfication
	} from '@/api/work.js';
	export default {
		name: "AdminOrderList",
		components: {
			Loading,
			PriceChange,
			footerPage,
			countDown,
			emptyPage,
			baseMoney,
			// #ifdef MP || APP-PLUS
			NavBar,
			// #endif
		},
		data() {
			return {
				urlDomain: this.$Cache.get("imgHost"),
				datetimerange: [],
				orderType: ['普通','秒杀','拼团'],
				orderStatus: ['待支付', '待发货', '部分发货', '待核销', '待收货', '已收货', '已完成', '已取消'],
				getHeight: this.$util.getWXStatusHeight(),
				iconColor: '#333333',
				isScrolling: false,
				top: 0,
				navHeight: 0,
				isFixed: false,
				filterShow: false,
				current: "",
				change: false,
				types: 0,
				list: [],
				loaded: false,
				loading: false,
				orderInfo: {},
				status: "",
				state: 'all',
				isRefund: 0, //1是仅退款;0是退货退款
				imgHost: HTTP_REQUEST_URL,
				dateSelected: '1',
				dateList: [{
						label: '全部',
						val: '1',
					},
					{
						label: '近1个月',
						val: '2',
					},
					{
						label: '近3个月',
						val: '3',
					},
					{
						label: '近6个月',
						val: '4',
					},
				],
				payList: [
					{
						label: '全部订单',
						val: '',
					},
					{
						label: '普通订单',
						val: 0,
					},
					{
						label: '秒杀订单',
						val: 1,
					},
					{
						label: '拼团订单',
						val: 2,
					}
				],
				confirmOrder: {},
				confirmShow: false,
				searchListData: {
					dateLimit: '',
					limit: 10,
					merId: '',
					orderNo: '',
					page: 1,
					status: 'all',
					type: '',
				},
				headerArr: {},
				totalPage: '',
			};
		},
		onLoad(options) {
			this.state = options.type ? options.type : 'all';
			this.searchListData.status = options.type ? options.type : 'all';
		},
		// created() {
		// 	this.getInitList()
		// 	this.statusHeader()
		// },
		onShow() {
			this.searchListData.page=1
			this.getInitList()
			this.statusHeader()
		},
		methods: {
			//订单表头数量
			statusHeader() {
				orderStatusNum(this.searchListData).then(res => {
					this.headerArr = res.data
				})
			},
			// 订单搜索
			searchSubmit() {
				this.searchListData.page=1
				this.getInitList()
				this.statusHeader()
			},
			//订单列表
			getInitList(type) {
				employeeOrderList(this.searchListData).then(res => {
					//下拉触底
					if (type == 'bottom') {
						this.list = this.list.concat(res.data.list)
					} else {
						this.list = res.data.list
					}
					this.totalPage = res.data.totalPage
				}).catch(err=>{
					this.$util.Tips({
						title: err
					})
				})
			},
			toDetail(item) {
				if(item.groupBuyRecordStatus===0){
					return this.$util.Tips({
						title: '拼团中无法查看详情'
					})
				}else{
					uni.navigateTo({
						url: `/pages/admin/order/detail?orderNo=${item.orderNo}`
					})
				}
			},
			//发送货
			goDelivery(item) {
				if (item.refundStatus == 1) return this.$util.Tips({
					title: '请处理售后，再操作',
				});
				uni.navigateTo({
					url: `/pages/admin/order/send?orderNo=${item.orderNo}`
				})
			},
			// 商品操作
			modify: function(item, status, type) {
				this.change = true;
				this.status = status.toString();
				this.orderInfo = item;
				if (status == 2) {
					this.isRefund = type
				}
			},
			//核销
			verify(item) {
				employeeOrderInfo(item.orderNo).then(res => {
					let verifyCode=res.data.verifyCode
					orderGetVerfication({
						verifyCode: res.data.verifyCode
					}).then(res => {
						if (res.code == 200) {
							uni.navigateTo({
								url: `/pages/admin/cancel/list?info=${JSON.stringify(res.data)}&verifyCode=${verifyCode}`
							})
						} else {
							self.$util.Tips({
								title: res.message
							});
						}
					})
				})
			},
			changeclose: function(msg) {
				this.change = msg;
			},
			async savePrice(opt) {
				if (!opt.remark) {
					return this.$util.Tips({
						title: '请输入备注'
					})
				} else {
					this.toMark(this.orderInfo.orderNo, opt.remark)
				}
			},
			//备注
			toMark(orderNo, remark) {
				employeeOrderMark({
					orderNo,
					remark
				}).then(res => {
					res.code == 200 && (this.change = false);
					return this.$util.Tips({
						title: '备注成功'
					})
				})
			},
			// 导航切换
			changeStatus(val) {
				if (this.state != val) {
					this.state = val;
					// this.where.status = val == -1 ? '' : val;
					this.searchListData.status = val
					this.searchListData.page = 1
					this.searchListData={...this.searchListData}
					this.getInitList()
				}
			},
			dateChange(value) {
				if (value == 1) {
					this.searchListData.dateLimit = ''
					this.dateSelected = value;
					return
				} else if (value == 2) {
					this.searchListData.dateLimit = 'lately30'
				} else if (value == 3) {
					this.searchListData.dateLimit = 'lately90'
				} else if (value == 4) {
					this.searchListData.dateLimit = 'lately180'
				}
				this.dateSelected = value;
			},
			payChange(val) {
				this.searchListData.type = val;
			},
			// 点击确认按钮
			submitBtn() {
				this.filterShow = false;
				this.searchListData.page=1
				this.getInitList()
				this.statusHeader()
			},
			//点击重置按钮
			resetBtn() {
				this.searchListData.orderNo=''
				this.searchListData.dateLimit = ''
				this.searchListData.type = '';
				this.dateSelected = '1'
			}
		},
		onReachBottom() {
			this.searchListData.page += 1
			this.totalPage >= this.searchListData.page && this.getInitList('bottom')
		}
	}
</script>

<style lang="scss" scoped>
	@import '../style/admin_order.scss';
</style>