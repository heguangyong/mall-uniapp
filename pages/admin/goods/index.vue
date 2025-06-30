<template>
	<view class="goods-list">
		<!-- #ifdef MP || APP-PLUS -->
		<NavBar titleText="商品管理" bagColor="#F5F5F5" :iconColor="iconColor" :textColor="iconColor"
			:isScrolling="isScrolling" showBack></NavBar>
		<!-- #endif -->
		<view class="searchCon acea-row row-between-wrapper">
			<view class="search acea-row row-middle">
				<text class="iconfont icon-ic_search"></text>
				<input class="inputs" placeholder='请输入商品名称/关键字' placeholder-class='placeholder' confirm-type='search'
					name="search" v-model="keyword" @confirm="searchSubmit"></input>
			</view>
			<view class="edit acea-row row-center-wrapper" @click="filtrate">
				<text class="iconfont icon-a-icon_filter1x"></text>
			</view>
			<view @click="manageTap" v-if="administer">取消</view>
			<view class="edit acea-row row-center-wrapper" @click="manageTap" v-else>
				<text class="iconfont icon-ic_batch"></text>
			</view>
		</view>
		<!-- #ifdef H5 -->
		<view class="nav acea-row row-middle">
		<!-- #endif -->
			<!-- #ifndef H5 -->
			<view class="nav acea-row row-middle" :style="{
			top:getHeight.barTop+getHeight.barHeight+'px'
		}">
			<!-- #endif -->
				<scroll-view scroll-x="true" class="scroll_view">
					<view class="item" :class="current == index?'on':''" v-for="(item, index) in navList" :key="index"
						@click="navTap(item,index)">
						{{item.name}}({{tabsArr?tabsArr[index].count:0}})
						<image src="../static/adorn.png" v-if="current == index"></image>
					</view>
				</scroll-view>
			</view>
			<view class="list" v-if="goodsList.length">
				<checkbox-group @change="checkboxChange">
					<view class="acea-row row-middle" v-for="(item, index) in goodsList" :key="index">
						<!-- #ifndef MP -->
						<checkbox class="checkbox" v-if="administer" :value="(item.id).toString()"
							:checked="item.checked" />
						<!-- #endif -->
						<!-- #ifdef MP -->
						<checkbox class="checkbox" v-if="administer" :value="item.id" :checked="item.checked" />
						<!-- #endif -->
						<view class="item">
							<view class="item_header">
								<view class="item_header-type"><text class="iconfont icon-color"
										:class="goods_type_icon[item.type]"></text>{{goods_type[item.type]}}
								</view>
								<view class="item_header_right">{{item.isShow?'已上架':'未上架'}}</view>
							</view>
							<view class="top acea-row row-center-wrapper" @tap="priceNum(item.id,item.type)">
								<view class="pictrue">
									<image :src="item.image"></image>
								</view>
								<view class="text">
									<view class="name line1">{{item.name}}</view>
									<view class="info">
										<text>销量: {{item.sales}}</text>
										<text>库存: {{item.stock}}</text>
									</view>
									<view class="acea-row svip-box">
										<baseMoney :money="item.price" symbolSize="20" integerSize="32" decimalSize="20"
											color="#333333"></baseMoney>
										<view class="svip-price-box acea-row" v-if="item.isPaidMember">
											<view class="svip">
												SVIP
											</view>
											<view class="svip-price semiBold">
												{{item.vipPrice}}
											</view>
										</view>
									</view>
								</view>
							</view>
							<view class="bottom acea-row row-right" v-if="!administer&&type==1">
								<view class="bnt acea-row row-center-wrapper" :class="item.isShow?'':'up'"
									@click="setUpDown(item.isShow,item.id)">{{item.isShow?'下架':'上架'}}</view>
								<!-- <view class="bnt on acea-row row-center-wrapper" v-if="item.type!=6"
									@click="addNum(item.id)">增加库存</view> -->
									<view class="bnt on  acea-row row-center-wrapper" v-if="item.type!=6"
										@click="priceNum(item.id)">价格库存</view>
							</view>
							<view class="bottom acea-row row-right" v-if="!administer&&(type==2||type==3||type==4)">
								<!-- <view class="bnt acea-row row-center-wrapper" @click="editClass(item.id)">修改分类</view> -->
								<view class="bnt  acea-row row-center-wrapper" v-if="item.type!=6"
									@click="priceNum(item.id)">价格库存</view>
								<!-- <view class="bnt  acea-row row-center-wrapper" v-if="item.type!=6&&item.isShow"
									@click="addNum(item.id)">增加库存</view> -->
								<view class="bnt on acea-row row-center-wrapper"
									@click="setUpDown(item.isShow,item.id)">{{item.isShow?'下架':'上架'}}</view>
							</view>
							<view class="bottom acea-row row-right" v-if="!administer&&type==8">
								<view class="bnt acea-row row-center-wrapper" @click="hsToggle('center',item.id)">加入回收站
								</view>
								<view class="bnt  acea-row row-center-wrapper" v-if="item.type!=6"
									@click="priceNum(item.id)">价格库存</view>
								<view class="bnt on acea-row row-center-wrapper" @click="shToggle(item.id)">提交审核</view>
							</view>
							<view class="bottom acea-row row-right" v-if="!administer&&(type==6||type==7)">
								<view class="bnt acea-row row-center-wrapper" @click="hsToggle('center',item.id)">加入回收站
								</view>
							</view>
							<view class="bottom acea-row row-right" v-if="!administer&&type==5">
								<view class="bnt acea-row row-center-wrapper" @click="toDelete(item.id)">删除</view>
								<view class="bnt on acea-row row-center-wrapper" @click="toRestore(item.id)">恢复商品</view>
							</view>
						</view>
					</view>
				</checkbox-group>
			</view>
			<view class="empty-box" v-if="goodsList.length == 0 && !loading">
				<emptyPage title="暂无商品～" :imgSrc="urlDomain+'crmebimage/presets/noShopper.png'"></emptyPage>
			</view>
			<Loading :loaded="loadend" :loading="loading"></Loading>
			<view class="footerH"></view>
			<view class="footer acea-row row-between-wrapper" v-if="administer">
				<checkbox-group @change="checkboxAllChange">
					<checkbox value="all" :checked="isAllSelect" />
					<text class='checkAll'>全选({{getIds().length}})</text>
				</checkbox-group>
				<view class="acea-row row-middle" v-if="type == 1">
					<view class="bnt acea-row row-center-wrapper" @click="setShow('',1,0)">批量下架</view>
				</view>
				<view class="acea-row row-middle" v-if="type == 2">
					<view class="bnt acea-row row-center-wrapper" @click="toRecycleAll('',1,1)">加入回收站</view>
					<view class="bnt acea-row row-center-wrapper" @click="setShow('',1,1)">批量上架</view>
				</view>
				<view class="acea-row row-middle" v-if="(type == 3||type == 4)">
					<view class="bnt acea-row row-center-wrapper" @click="setShow('',1,0)">批量下架</view>
					<view class="bnt acea-row row-center-wrapper" @click="setShow('',1,1)">批量上架</view>
				</view>
				<view class="acea-row row-middle" v-if="type == 8">
					<view class="bnt acea-row row-center-wrapper" @click="toRecycleAll('',1,1)">加入回收站</view>
					<view class="bnt acea-row row-center-wrapper" @click="shToggleAll">批量提审</view>
				</view>
				<view class="acea-row row-middle" v-if="type == 6||type ==7">
					<view class="bnt acea-row row-center-wrapper" @click="toRecycleAll('',1,1)">加入回收站</view>
				</view>
				<view class="acea-row row-middle" v-if="type == 5">
					<view class="bnt acea-row row-center-wrapper" @click="toDeleteAll">批量删除</view>
					<view class="bnt acea-row row-center-wrapper" @click="toRestoreAll('',1,1)">恢复商品</view>
				</view>
			</view>
			<footer-page></footer-page>
			<base-drawer mode="bottom" :visible="visible" background-color="transparent" mask maskClosable
				@close="closeDrawer">
				<view class="edit-list rd-t-40rpx">
					<view class="item" v-for="(item, index) in editList" :key="index" @tap="editInfo(index)">
						{{item.name}}
					</view>
				</view>
			</base-drawer>
			<edit-price :visible='visiblePrice' :goodsInfo='goodsInfo' @closeDrawer='priceCloseDrawer'
				@successChange='successChange'></edit-price>
			<edit-lable ref="lable" :visible='visibleLable' @closeDrawer='lableCloseDrawer'
				@successChange='successChange'></edit-lable>
			<!-- 提交审核 -->
			<uni-popup ref="sh_popup" background-color="#fff" borderRadius="10px">
				<view class="sh_popup-content"
					:class="{ 'popup-height': popup_center === 'left' || popup_center === 'right' }">
					<view class="sh_popup_title">
						提交审核
					</view>
					<view class="sh_popup_text">
						你确定要将选中商品提交审核吗？
					</view>
					<view class="sh_popup_btn">
						<view class="no_btn btn" @click="shPopupClose">取消</view>
						<view class="yes_btn btn" @click="toAudit">确认</view>
					</view>
				</view>
			</uni-popup>
			<!-- 回收站 -->
			<uni-popup ref="hs_popup" background-color="#fff" borderRadius="10px">
				<view class="sh_popup-content"
					:class="{ 'popup-height': popup_center === 'left' || popup_center === 'right' }">
					<view class="sh_popup_title">
						加入回收站
					</view>
					<view class="sh_popup_text">
						你确定要将选中商品加入回收站吗？
					</view>
					<view class="sh_popup_btn">
						<view class="no_btn btn" @click="hsPopupClose">取消</view>
						<view class="yes_btn btn" @click="toRecycle">确认</view>
					</view>
				</view>
			</uni-popup>
			<!-- 恢复商品 -->
			<uni-popup ref="hf_popup" background-color="#fff" borderRadius="10px">
				<view class="sh_popup-content"
					:class="{ 'popup-height': popup_center === 'left' || popup_center === 'right' }">
					<view class="sh_popup_title">
						恢复商品
					</view>
					<view class="sh_popup_text">
						你确定要将选中商品恢复吗？
					</view>
					<view class="sh_popup_btn">
						<view class="no_btn btn" @click="hfPopupClose">取消</view>
						<view class="yes_btn btn" @click="toRestoreBtn">确认</view>
					</view>
				</view>
			</uni-popup>
			<!-- 删除商品 -->
			<uni-popup ref="sc_popup" background-color="#fff" borderRadius="10px">
				<view class="sh_popup-content"
					:class="{ 'popup-height': popup_center === 'left' || popup_center === 'right' }">
					<view class="sh_popup_title">
						删除商品
					</view>
					<view class="sh_popup_text">
						你确定要将选中商品删除吗？
					</view>
					<view class="sh_popup_btn">
						<view class="no_btn btn" @click="scPopupClose">取消</view>
						<view class="yes_btn btn" @click="toDeleteBtn">确认</view>
					</view>
				</view>
			</uni-popup>
		</view>
</template>

<script>
	import Loading from '../components/Loading/index';
	import emptyPage from '@/components/emptyPage.vue';
	import footerPage from '../components/footerPage/index.vue';
	import editPrice from './components/editPrice/index.vue';
	import editLable from './components/label/index.vue';
	import baseDrawer from '@/components/tui-drawer/tui-drawer.vue';
	import NavBar from '../components/NavBar.vue'
	import baseMoney from '../components/BaseMoney.vue'
	import {
		employeeProductList,
		employeeProductUp,
		employeeProductDown,
		employeeBatchUp,
		employeeBatchDown,
		employeeBatchRecycle,
		employeeBatchRestore,
		employeeRestore,
		employeeProductDelete,
		employeeBatchDelete,
		employeeSubmitAudit,
		employeeBatchAudit,
		productTabsHeaders,
		productCategroyGetTree
	} from '@/api/work.js';
	export default {
		components: {
			editPrice,
			editLable,
			footerPage,
			emptyPage,
			Loading,
			baseDrawer,
			NavBar,
			baseMoney
		},
		data() {
			return {
				urlDomain: this.$Cache.get("imgHost"),
				goods_type: ['普通商品', '积分商品', '虚拟商品', '','视频号', '云盘商品', '卡密商品'],
				goods_type_icon:['icon-ic_daifahuo','','icon-ic_xuni','','','icon-a-icon_cloud1x','icon-ic_daifukuan'],
				getHeight: this.$util.getWXStatusHeight(),
				navList: [{
						name: '出售中',
						type: 1
					},
					{
						name: '仓库中',
						type: 2
					},
					{
						name: '已售罄',
						type: 3
					},
					{
						name: '库存警告',
						type: 4
					},
					{
						name: '待提审',
						type: 8
					},
					{
						name: '审核中',
						type: 6
					},
					{
						name: '审核未通过',
						type: 7
					},
					{
						name: '回收站',
						type: 5
					}
				],
				editList: [{
						name: '修改价格/库存'
					},
					{
						name: '商品分类'
					},
					{
						name: '商品标签'
					},
				],
				current: 0,
				administer: 0,
				isAllSelect: false,
				goodsList: [],
				goodsInfo: {},
				visible: false,
				visiblePrice: false, //价格库存是否显示
				visibleLable: false, //标签是否显示
				loadTitle: '加载更多',
				loading: false,
				loadend: false,
				limit: 10,
				page: 1,
				keyword: '', //搜索字段
				type: 1, //商品状态
				visibleClass: false,
				iconColor: '#333333',
				isScrolling: false,
				popup_center: 'center',
				cateId: '', //商户商品分类ID
				categoryId: '', //平台商品分类ID
				productType: '', //商品类型：0=普通商品， 5-云盘商品,6-卡密商品
				recycleId: '',
				toRecycleType: '',
				restoreId: '',
				toRestoreType: '',
				deleteId: '',
				toDeleteType: '',
				auditId: '',
				toAuditType: '',
				tabsArr: '',
				loadShow:false
			}
		},
		onShow() {
			!this.loadShow&&this.init()
			this.loadShow=false
		},
		onLoad(option) {
			if(option.type){
				this.loadShow=true
				this.type = option.type?option.type:1;
				for (let i = 0; i < this.navList.length; i++) {
					if (this.navList[i].type == this.type) {
						this.current = i;
						break;
					}
				}
				this.init();
			}
		},
		methods: {
			tabsHeader() {
				productTabsHeaders({
					keywords: this.keyword,
					type: this.type,
					cateId: this.cateId,
					categoryId: this.categoryId,
					productType: this.productType
				}).then(res => {
					let arr = res.data
					let oldVal = arr[4].count
					let newVal = arr[7].count
					arr[4].count = newVal
					arr[7].count = oldVal
					this.tabsArr = arr
				})
			},
			scPopupClose() {
				this.$refs.sc_popup.close()
			},
			hfPopupClose() {
				this.$refs.hf_popup.close()
			},
			hsPopupClose() {
				this.$refs.hs_popup.close()
			},
			hsToggle(type, id) {
				this.popup_center = type
				// open 方法传入参数 等同在 uni-popup 组件上绑定 type属性
				this.$refs.hs_popup.open(type)
				this.recycleId = id
				this.toRecycleType = 0
			},
			shPopupClose() {
				this.$refs.sh_popup.close()
			},
			shToggle(id) {
				this.$refs.sh_popup.open('center')
				this.auditId = id
				this.toAuditType = 0
			},
			//筛选
			filtrate() {
				this.visibleLable = true
				this.visible = false
			},
			//增加库存
			addNum(id) {
				uni.navigateTo({
					url: `/pages/admin/goods/inventory?id=${id}`
				})
			},
			//价格库存
			priceNum(id,type) {
				if(type==6){
					return this.$util.Tips({
						title: '卡密商品无法查看'
					});
				}
				uni.navigateTo({
					url: `/pages/admin/goods/specs?id=${id}`
				})
			},
			editClass(id) {
				this.$refs.classify.category([id], '');
				let that = this;
				setTimeout(function() {
					that.visibleClass = true
				}, 200)
			},
			classCloseDrawer() {
				this.visibleClass = false
			},
			successChange(select) {
				this.visibleClass = false
				this.visibleLable = false
				this.visiblePrice = false
				this.cateId = select.cateId
				this.productType = select.productType
				this.init();
			},
			//批量获取id集合
			getIds() {
				let ids = []
				this.goodsList.forEach(item => {
					if (item.checked) {
						ids.push(item.id)
					}
				})
				ids.slice(0, 100)
				return ids
			},
			setShow(item, num, type) {
				let data = {}
				if (num) {
					if (!this.getIds().length) {
						this.$util.Tips({
							title: '请选择商品'
						});
						return
					}
					data = {
						id: this.getIds(),
						is_show: type
					}
				} else {
					data = {
						id: item.id,
						is_show: item.is_show ? 0 : 1
					}
				}
				if (data.is_show == 0) {
					employeeBatchDown({
						idList: data.id
					}).then(res => {
						if (res.code == 200) {
							this.$util.Tips({
								title: '下架成功'
							})
							this.init()
						}
					})
				} else {
					employeeBatchUp({
						idList: data.id
					}).then(res => {
						if (res.code == 200) {
							this.$util.Tips({
								title: '上架成功'
							})
							this.init()
						}
					})
				}
			},
			//确认提审按钮
			toAudit() {
				if (this.toAuditType == 0) {
					employeeSubmitAudit(this.auditId).then(res => {
						if (res.code == 200) {
							this.$refs.sh_popup.close()
							this.init()
						}
					})
				} else {
					let data = {}
					data = {
						id: this.getIds(),
					}
					employeeBatchAudit({
						idList: data.id
					}).then(res => {
						if (res.code == 200) {
							this.$refs.sh_popup.close()
							this.init()
						}
					})
				}
			},
			//确认删除按钮
			toDeleteBtn() {
				if (this.toDeleteType == 0) {
					employeeProductDelete({
						id: this.deleteId,
						type: 'delete'
					}).then(res => {
						if (res.code == 200) {
							this.$refs.sc_popup.close()
							this.init()
						}
					})
				} else {
					let data = {}
					data = {
						id: this.getIds(),
					}
					employeeBatchDelete({
						idList: data.id
					}).then(res => {
						if (res.code == 200) {
							this.$refs.sc_popup.close()
							this.init()
						}
					})
				}
			},
			//确认恢复商品
			toRestoreBtn() {
				if (this.toRestoreType == 0) {
					employeeRestore(this.restoreId).then(res => {
						if (res.code == 200) {
							this.$refs.hf_popup.close()
							this.init()
						}
					})
				} else {
					let data = {}
					data = {
						id: this.getIds(),
					}
					employeeBatchRestore({
						idList: data.id
					}).then(res => {
						if (res.code == 200) {
							this.$refs.hf_popup.close()
							this.init()
						}
					})
				}
			},
			//确认加入回收站
			toRecycle() {
				if (this.toRecycleType == 0) {
					employeeProductDelete({
						id: this.recycleId,
						type: 'recycle'
					}).then(res => {
						this.$refs.hs_popup.close()
						this.init()
					})
				} else {
					let data = {}
					data = {
						id: this.getIds(),
					}
					employeeBatchRecycle({
						idList: data.id
					}).then(res => {
						if (res.code == 200) {
							this.$refs.hs_popup.close()
							this.init()
						}
					})
				}
			},
			//批量加入回收站
			toRecycleAll(item, num, type) {
				if (!this.getIds().length) {
					this.$util.Tips({
						title: '请选择商品'
					});
					return
				} else {
					this.toRecycleType = 1
					this.$refs.hs_popup.open(type)
				}
			},
			//恢复商品
			toRestore(id) {
				this.toRestoreType = 0
				this.restoreId = id
				this.$refs.hf_popup.open('center')
			},
			//批量恢复商品
			toRestoreAll(item, num, type) {
				if (!this.getIds().length) {
					this.$util.Tips({
						title: '请选择商品'
					});
					return
				}
				this.toRestoreType = 1
				this.$refs.hf_popup.open('center')
			},
			//删除商品
			toDelete(id) {
				this.toDeleteType = 0
				this.deleteId = id
				this.$refs.sc_popup.open('center')
			},
			//批量删除
			toDeleteAll() {
				if (!this.getIds().length) {
					this.$util.Tips({
						title: '请选择商品'
					});
					return
				}
				this.toDeleteType = 1
				this.$refs.sc_popup.open('center')
			},
			//批量提审
			shToggleAll() {
				if (!this.getIds().length) {
					this.$util.Tips({
						title: '请选择商品'
					});
					return
				}
				this.toAuditType = 1
				this.$refs.sh_popup.open('center')
			},
			//上下架  0-未上架 1-上架
			setUpDown(show, id) {
				if (show == 0) {
					employeeProductUp(id).then(res => {
						if (res.code == 200) {
							this.$util.Tips({
								title: '上架成功'
							})
							this.init()
						}
					})
				} else {
					employeeProductDown(id).then(res => {
						if (res.code == 200) {
							this.$util.Tips({
								title: '下架成功'
							})
							this.init()
						}
					})
				}
			},
			init() {
				this.goodsList = [];
				this.page = 1;
				this.loadend = false;
				this.loading = false;
				this.productList();
				this.tabsHeader()
			},
			searchSubmit() {
				this.init();
			},
			productList() {
				let that = this;
				if (this.loading) return;
				if (this.loadend) return;
				that.loading = true;
				that.loadTitle = "";
				employeeProductList({
					page: that.page,
					limit: that.limit,
					keywords: that.keyword,
					type: that.type,
					cateId: that.cateId,
					categoryId: that.categoryId,
					productType: that.productType
				}).then(res => {
					let goodsList = res.data.list;
					goodsList.forEach(item => {
						item.checked = false;
					})
					this.isAllSelect = false
					let loadend = goodsList.length < that.limit;
					that.goodsList = that.$util.SplitArray(goodsList, that.goodsList);
					that.$set(that, 'goodsList', that.goodsList);
					that.loadend = loadend;
					that.loadTitle = loadend ? '没有更多内容啦~' : '加载更多';
					that.page = that.page + 1;
					that.loading = false;
				}).catch(err => {
					that.loading = false;
					that.loadTitle = "加载更多";
					that.$util.Tips({
						title: err
					})
				})
			},
			editInfo(index) {
				switch (index) {
					case 0:
						this.visible = false
						if (this.goodsInfo.spec_type) {
							uni.navigateTo({
								url: '/pages/admin/goods/specs?id=' + this.goodsInfo.id
							})
						} else {
							this.visiblePrice = true
						}
						break;
					case 1:
						this.visible = false
						this.visibleClass = true
						break;
					case 2:
						this.visibleLable = true
						this.visible = false
						break;
				}
			},
			lableCloseDrawer() {
				this.visibleLable = false
			},
			priceCloseDrawer() {
				this.visiblePrice = false
			},
			openDrawer(item) {
				this.visible = true
				this.goodsInfo = JSON.parse(JSON.stringify(item))
				this.$refs.lable.productLabel(this.goodsInfo, 0, []);
				this.$refs.classify.category(item.id, item.cate_id);
			},
			closeDrawer() {
				this.visible = false
			},
			manageTap() {
				this.administer = !this.administer;
			},
			navTap(item, index) {
				this.current = index;
				if (this.type != item.type) {
					this.type = item.type;
					this.init();
				}
			},
			checkboxChange(event) {
				let idList = event.detail.value;
				this.goodsList.forEach((item) => {
					if (idList.indexOf(item.id + '') !== -1) {
						item.checked = true;
					} else {
						item.checked = false;
					}
				})
				if (idList.length == this.goodsList.length) {
					this.isAllSelect = true;
				} else {
					this.isAllSelect = false;
				}
			},
			forGoods(val) {
				let that = this;
				if (!that.goodsList.length) return
				that.goodsList.forEach((item) => {
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
					if (this.goodsList.length > 100) {
						this.$util.Tips({
							title: '每次最多只提交100条数据'
						});
					}
					this.isAllSelect = true;
					this.forGoods(1)
				} else {
					this.isAllSelect = false;
					this.forGoods(0)
				}
			},
		},
		onReachBottom() {
			 this.productList();
		}
	}
</script>

<style lang="scss" scoped>
	::v-deepcheckbox .uni-checkbox-input.uni-checkbox-input-checked {
		border-color: #2A7EFB !important;
		background-color: #2A7EFB !important;
		color: #fff !important;
	}

	::v-deepcheckbox .wx-checkbox-input.wx-checkbox-input-checked {
		border: 1px solid #2A7EFB !important;
		background-color: #2A7EFB !important;
		color: #fff !important;
	}

	::v-deepuni-checkbox .uni-checkbox-input {
		margin-top: -4rpx;
	}

	::v-deepcheckbox:not([disabled]) .uni-checkbox-input:hover {
		border-color: #d1d1d1 !important;
	}

	.empty-box {
		padding: 0 20rpx;
	}

	.accountTitle {
		background: #F5F5F5;
		position: fixed;
		left: 0;
		top: 0;
		width: 100%;
		z-index: 99;
		padding-bottom: 6rpx;

		.sysTitle {
			width: 100%;
			position: relative;
			font-weight: 500;
			color: #333333;
			font-size: 30rpx;

			.iconfont {
				position: absolute;
				font-size: 42rpx;
				left: 20rpx;
				width: 60rpx;
				font-weight: 500;
			}
		}
	}

	.goods-list {
		padding-top: 20rpx;

		.searchCon {
			padding: 0 20rpx;

			.search {
				width: 550rpx;
				height: 72rpx;
				background: #FFFFFF;
				border-radius: 50rpx;
				padding: 0 34rpx;

				.iconfont {
					color: #999;
					font-size: 32rpx;
					margin-right: 16rpx;
				}

				.inputs {
					font-size: 28rpx;
					width: 100%;
					height: 100%;
					flex: 1;
				}

				.placeholder {
					color: #ccc;
				}
			}

			.edit {
				width: 72rpx;
				height: 72rpx;
				background: #FFFFFF;
				border-radius: 50%;

				.iconfont {
					color: #666;
					font-size: 36rpx;
				}
			}
		}

		.nav {
			padding: 20rpx 20rpx 18rpx 34rpx;
			position: sticky !important;
			top: 0;
			left: 0;
			width: 100%;
			background-color: #F5F5F5;
			z-index: 99;

			.item {
				font-weight: 400;
				font-size: 26rpx;
				color: #333333;
				padding: 10rpx 0;
				position: relative;

				&~.item {
					margin-left: 72rpx;
				}

				&.on {
					font-weight: 500;
					color: #2A7EFB;
					font-size: 30rpx;
					font-family: PingFang SC, PingFang SC;
				}

				image {
					width: 14rpx;
					height: 14rpx;
					display: block;
					position: absolute;
					bottom: 0;
					right: -4rpx;
				}
			}
		}

		.list {
			padding-bottom: 20rpx;
			padding: 0 20rpx 20rpx 20rpx;

			::v-deepuni-checkbox .uni-checkbox-input {
				background-color: #f5f5f5;
				margin: 0 20rpx 20rpx 0;
			}

			::v-deepwx-checkbox .wx-checkbox-input {
				background-color: #f5f5f5;
				margin: 0 20rpx 20rpx 0;
			}

			.item {
				width: 100%;
				background-color: #fff;
				padding: 24rpx;
				box-sizing: border-box;
				margin-bottom: 20rpx;
				border-radius: 24rpx;
				flex: 1;
				overflow: hidden;

				.item_header {
					display: flex;
					justify-content: space-between;
					padding-bottom: 20rpx;
					align-items: center;

					.item_header_right {
						font-weight: 400;
						font-size: 13px;
						color: #FF7E00;
					}
				}

				.top {
					.checkbox {
						margin-right: 10rpx;
					}

					.pictrue {
						width: 136rpx;
						height: 136rpx;
						margin-right: 20rpx;

						image {
							width: 100%;
							height: 100%;
							border-radius: 16rpx;
						}
					}

					.text {
						flex: 1;
						overflow: hidden;

						.name {
							font-size: 28rpx;
							font-weight: 400;
							color: #333333;
						}

						.info {
							font-size: 24rpx;
							font-weight: 400;
							color: #666666;
							margin: 10rpx 0 18rpx 0;

							text {
								margin-right: 40rpx;
							}
						}
					}
				}

				.bottom {
					margin-top: 26rpx;

					.bnt {
						width: 144rpx;
						height: 56rpx;
						border: 1px solid #ccc;
						font-size: 24rpx;
						font-family: PingFang SC, PingFang SC;
						font-weight: 400;
						color: #333333;
						border-radius: 50rpx;

						&~.bnt {
							margin-left: 16rpx;
						}

						&.on {
							border-color: #2A7EFB;
							background-color: #2A7EFB;
							color: #fff;
						}

						&.up {
							border-color: #FF7E00;
							color: #FF7E00;
						}
					}
				}
			}
		}

		.footerH {
			height: 110rpx;
			height: calc(110rpx + constant(safe-area-inset-bottom)); ///兼容 IOS<11.2/
			height: calc(110rpx + env(safe-area-inset-bottom)); ///兼容 IOS>11.2/
		}

		.footer {
			box-sizing: border-box;
			padding: 0 32rpx;
			width: 100%;
			height: 96rpx;
			background-color: #fff;
			position: fixed;
			bottom: 0;
			z-index: 30;
			height: calc(96rpx + constant(safe-area-inset-bottom)); ///兼容 IOS<11.2/
			height: calc(96rpx + env(safe-area-inset-bottom)); ///兼容 IOS>11.2/
			padding-bottom: constant(safe-area-inset-bottom); ///兼容 IOS<11.2/
			padding-bottom: env(safe-area-inset-bottom); ///兼容 IOS>11.2/
			width: 100%;
			left: 0;

			.bnt {
				width: 160rpx;
				height: 64rpx;
				border-radius: 50rpx;
				border: 1rpx solid #2A7EFB;
				color: #2A7EFB;
				font-size: 24rpx;
				font-family: PingFang SC, PingFang SC;
				font-weight: 500;

				&~.bnt {
					margin-left: 16rpx;
				}
			}
		}

		.edit-list {
			background-color: #fff;
			padding: 45rpx 34rpx;

			.item {
				font-family: PingFang SC, PingFang SC;
				font-weight: 400;
				color: #333333;
				font-size: 32rpx;
				text-align: center;
				height: 106rpx;
				line-height: 106rpx;
			}
		}
	}

	.scroll_view {
		white-space: nowrap;

		// padding: 0 30rpx;
		.item {
			display: inline-block;
			color: #999999;
		}
	}

	::v-deep .uni-popup__wrapper {
		width: 600rpx;
		height: 310rpx;
		background: #FFFFFF;
		border-radius: 14rpx;
	}

	.sh_popup-content {
		.sh_popup_title {
			font-weight: 500;
			font-size: 32rpx;
			color: #333333;
			text-align: center;
			margin-top: 40rpx;
		}

		.sh_popup_text {
			font-weight: 400;
			font-size: 30rpx;
			color: #666666;
			text-align: center;
			margin-top: 30rpx;
		}

		.sh_popup_btn {
			display: flex;
			justify-content: space-between;
			margin-top: 40rpx;
			padding: 0 47rpx;

			.btn {
				width: 244rpx;
				height: 72rpx;
				border-radius: 50rpx;
				text-align: center;
				line-height: 72rpx;
			}

			.no_btn {
				border: 1px solid #2A7EFB;
				color: #2A7EFB;
			}

			.yes_btn {
				background: #2A7EFB;
				color: #FFFFFF;
			}
		}
	}

	.svip {
		width: 60rpx;
		height: 26rpx;
		background: linear-gradient(90deg, #484643 0%, #1F1B17 100%);
		font-size: 18rpx;
		color: #FDDAA4;
		text-align: center;
		line-height: 26rpx;
		margin-left: 10rpx;
		border-radius: 20rpx 0 20rpx 0 / 20rpx 0 20rpx 0;
		z-index: 3;
	}

	.svip-box {
		align-items: center;
	}

	.svip-price-box {
		position: relative;
	}

	.svip-price {
		font-size: 22rpx;
		color: #333333;
		padding: 0 20rpx;
		height: 26rpx;
		background: #FFF0D1;
		border-radius: 44rpx;
		line-height: 26rpx;
		text-align: center;
		position: absolute;
		left: 57rpx;
	}

	.base-money {
		font-weight: 600;
	}

	.icon-color {
		color: #2A7EFB;
		margin-right: 8rpx;
	}

	.icon-a-icon_filter1x {
		font-size: 40rpx !important;
	}

	/* #ifndef H5 */
	.checkbox {
		margin-right: 20rpx;
	}
	/* #endif */
	.item_header-type{
		align-items: center;
		display: flex;
	}
</style>