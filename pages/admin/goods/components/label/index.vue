<template>
	<base-drawer mode="right" :visible="visible" background-color="transparent" mask maskClosable @close="closeDrawer">
    <view class="edit-lable">
      <!-- #ifdef MP -->
      <view class="accountTitle">
        <view :style="{height:getHeight.barTop+'px'}"></view>
        <view class="sysTitle acea-row row-center-wrapper" :style="{height:getHeight.barHeight+'px'}">
          <view>筛选</view>
        </view>
      </view>
      <view :style="{height:(getHeight.barTop+getHeight.barHeight)+'px'}"></view>
      <view class="list" v-if="isStore"
            :style="'height: calc(100% - '+(getHeight.barTop+getHeight.barHeight*2+150)+'rpx - constant(safe-area-inset-bottom));height: calc(100% - '+(getHeight.barTop+getHeight.barHeight*2+150)+'rpx - env(safe-area-inset-bottom))'">
        <!-- #endif -->
        <!-- #ifndef MP -->
        <view class="header">筛选</view>
        <view class="list" v-if="isStore">
          <!-- #endif -->
          <scroll-view scroll-y="true" style="height: 100%">
            <view class="goods_type">
              商品类型
            </view>
            <view class="goods_type_box">
              <view class="goods_type_item" v-for="(item,index) in goodsType" :key="item.id"
                    @click="selectProduct(item.id)" :class="{selectActive:item.id===selectId.productType}">
                {{item.text}}
              </view>
            </view>
            <view class="merchants_type">
              商家分类
            </view>
            <view class="merchants_type_box">
              <view class="merchants_type_item" v-for="(item,index) in productType" :key="item.id">
                <view class="type_item_operate">
                  <text :class="{oneSelectActive:item.id==selectId.cateId}" @click="selectMerchant(item.id)">{{item.name}}</text>
                  <text v-if="item.childList.length>3" @click="changeHide(item)">{{item.hide?'展开':'收起'}}<text class="iconfont"
                                                                                                                  :class="item.hide?'icon-xiangxia':'icon-xiangshang'"></text></text>
                </view>
                <view class="main_box">
                  <template v-for="(citem,cindex) in item.childList">
                    <view class="main_item" :key="citem.id" v-if="!(cindex>2&&item.hide)"
                          @click="selectMerchant(citem.id)"
                          :class="{selectActive:citem.id==selectId.cateId}">
                      {{citem.name}}
                    </view>
                  </template>
                </view>
              </view>
            </view>
          </scroll-view>
        </view>
        <view class="empty-box" v-else>
          <emptyPage title="暂无分类～" :imgSrc="urlDomain+'crmebimage/presets/noSearch.png'"></emptyPage>
        </view>
        <view class="footer acea-row row-between-wrapper">
          <view class="bnt acea-row row-center-wrapper" @tap="reset">重置</view>
          <view class="bnt on acea-row row-center-wrapper" @tap="define">确定</view>
        </view>
    </view>
    </view>
	</base-drawer>
</template>

<script>
	import {
		mapGetters
	} from "vuex";
	import emptyPage from '@/components/emptyPage.vue';
	import baseDrawer from '@/components/tui-drawer/tui-drawer.vue';
	import {productCategroyGetTree} from '@/api/work.js'
	export default {
		computed:{
			...mapGetters(['selectMerId']),
		},
		components: {
			emptyPage,
			baseDrawer
		},
		props: {
			visible: {
				type: Boolean,
				default: false,
			},
		},
		data: function() {
			return {
        urlDomain: this.$Cache.get("imgHost"),
				// #ifdef MP
				getHeight: this.$util.getWXStatusHeight(),
				// #endif
				selectId: {
					cateId: '',
					productType: '',
				},
				labelList: [],
				goodsInfo: {}, //列表中已存在id（固定不变）
				dataLabel: [], //已存在选中id(随着选中可以变化)
				isStore: true, //判断是否存在标签
				num: 0, // 判断是否为批量
				ids: [], //批量时的id集合
				goodsType: [
					{
						id: 0,
						text: '普通商品'
					},
					{
						id: 2,
						text: '虚拟商品'
					},
					{
						id: 5,
						text: '云盘商品'
					},
					{
						id: 6,
						text: '卡密商品'
					}
				],
				productType: [],
			};
		},
		mounted() {},
		created() {
			this.getTree()
		},
		methods: {
			// 确认
			define(){
					this.$emit('successChange',this.selectId)
			},
			getTree(){
				productCategroyGetTree(this.selectMerId).then(res=>{
					this.productType=res.data
					this.productType.forEach(item=>{
						item.hide=true
					})
				})
			},
			changeHide(item){
				item.hide=!item.hide
				this.productType=[...this.productType]
			},
			//重置
			reset() {
				this.selectId = {
					cateId: '',
					productType: '',
				}
			},
			//选择商品分类
			selectProduct(id) {
				this.selectId.productType = id
			},
			//选择商户分类
			selectMerchant(id) {
				this.selectId.cateId = id
			},
			closeDrawer() {
				this.$emit('closeDrawer');
			}
		}
	}
</script>

<style lang="scss" scoped>
	.accountTitle {
		position: fixed;
		left: 0;
		top: 0;
		width: 100%;
		z-index: 99;
		padding-bottom: 6rpx;

		.sysTitle {
			width: 100%;
			position: relative;
			font-weight: 600;
			color: #333333;
			font-size: 34rpx;
			font-family: PingFang SC, PingFang SC;
		}
	}

	.edit-lable {
		background-color: #fff;
		width: 670rpx;
		// border-radius: 40rpx 0 0 40rpx;
		height: 100%;
		padding: 20rpx 34rpx 0 32rpx;

		.header {
			text-align: center;
			height: 96rpx;
			line-height: 96rpx;
			font-size: 34rpx;
			font-family: PingFang SC, PingFang SC;
			font-weight: 600;
			color: #333333;
			position: relative;
		}

		.list {
			overflow: auto;
			height: calc(100% - 208rpx);
			height: calc(100% - (208rpx + constant(safe-area-inset-bottom)));
			height: calc(100% - (208rpx + env(safe-area-inset-bottom)));

			.item {
				margin-top: 48rpx;

				.title {
					font-size: 28rpx;
					font-family: PingFang SC, PingFang SC;
					font-weight: 600;
					color: #333333;
				}

				.listn {
					.name {
						width: 184rpx;
						height: 56rpx;
						background-color: #F5F5F5;
						border-radius: 50rpx;
						border: 1rpx solid #F5F5F5;
						font-size: 24rpx;
						font-family: PingFang SC, PingFang SC;
						font-weight: 400;
						color: #333333;
						margin-right: 26rpx;
						margin-top: 24rpx;
						padding: 0 8rpx;

						&.on {
							background-color: #E9F2FE;
							border-color: #2A7EFB;
							color: #2A7EFB;
						}

						&:nth-of-type(3n) {
							margin-right: 0;
						}
					}
				}
			}
		}

		.footer {
			width: 100%;
			height: 112rpx;
			position: fixed;
			bottom: 0;
			left: 0;
			padding: 0 32rpx;
			background-color: #fff;
			border-radius: 0 0 0 40rpx;
			height: calc(112rpx + constant(safe-area-inset-bottom)); ///兼容 IOS<11.2/
			height: calc(112rpx + env(safe-area-inset-bottom)); ///兼容 IOS>11.2/
			padding-bottom: constant(safe-area-inset-bottom); ///兼容 IOS<11.2/
			padding-bottom: env(safe-area-inset-bottom); ///兼容 IOS>11.2/

			.bnt {
				width: 296rpx;
				height: 72rpx;
				border: 1px solid #2A7EFB;
				border-radius: 200rpx;
				font-size: 26rpx;
				font-family: PingFang SC, PingFang SC;
				font-weight: 400;
				color: #2A7EFB;

				&.on {
					background: #2A7EFB;
					border-color: #2A7EFB;
					color: #fff;
				}
			}
		}

		.goods_type {
			font-weight: 600;
			font-size: 14px;
			color: #333333;
		}

		.goods_type_box {
			display: flex;
			flex-wrap: wrap;
			padding: 0 10rpx;
			justify-content: space-between;
			margin-top: 14rpx;

			.goods_type_item {
				background: #F5F5F5;
				border-radius: 200rpx;
				width: 184rpx;
				height: 56rpx;
				text-align: center;
				line-height: 56rpx;
				margin-top: 20rpx;
			}
		}

		.merchants_type {
			font-weight: 600;
			font-size: 14px;
			color: #333333;
			margin-top: 24rpx;
		}

		.merchants_type_box {
			.merchants_type_item {
				.type_item_operate {
					display: flex;
					justify-content: space-between;
					font-weight: 400;
					font-size: 24rpx;
					color: #666666;
					padding: 20rpx 0;

					.icon-xiangshang,
					.icon-xiangxia {
						font-weight: 400;
						font-size: 24rpx;
						color: #666666;
					}
				}
			}

			.main_box {
				margin-bottom: 30rpx;

				.main_item {
					display: inline-block;
					background: #F5F5F5;
					border-radius: 100px 100px 100px 100px;
					width: 184rpx;
					height: 56rpx;
					text-align: center;
					line-height: 56rpx;
					margin-right: 26rpx;
					margin-top: 20rpx;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;

					&:nth-of-type(3n) {
						margin-right: 0rpx !important;
					}
				}
			}
		}
	}

	.selectActive {
		background: #E9F2FE !important;
		border-radius: 200rpx;
		border: 1px solid #2A7EFB;
		color: #2A7EFB;
	}
	.oneSelectActive{
		color: #2A7EFB;
	}
</style>