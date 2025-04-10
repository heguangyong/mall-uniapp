<template>
  <view :data-theme="theme">
    <view class="order-details">
      <!-- 给header上与data上加on为退款订单-->
      <view class="header bg_color">
        <view class="picTxt acea-row row-middle">
          <view class="data">
            <view class="state">{{
              orderInfo.status | orderStatusFilter
            }}</view>
            <view v-if="orderInfo.refundReasonTime !== null">{{
              orderInfo.refundReasonTime
            }}</view>
            <view v-if="orderInfo.createTime">{{ orderInfo.createTime }}</view>
          </view>
        </view>
      </view>

      <view class="borderPad" style="margin: -100rpx auto 0 auto">
        <view
          v-if="
            orderInfo.status !== 9 && (shippingType === 1 || shippingType === 3)
          "
          class="nav"
        >
          <view class="navCon acea-row row-between-wrapper">
            <view :class="orderInfo.status == 0 ? 'on' : ''">待付款</view>
            <view :class="orderInfo.status == 1 ? 'on' : ''">待发货</view>
            <view :class="orderInfo.status == 4 ? 'on' : ''">待收货</view>
            <view :class="orderInfo.status == 5 ? 'on' : ''">已收货</view>
            <view :class="orderInfo.status == 6 ? 'on' : ''">已完成</view>
          </view>
          <!-- 订单状态（0：待支付，1：待发货,2：部分发货， 3：待核销，4：待收货,5：已收货,6：已完成，9：已取消） -->
          <view class="progress acea-row row-between-wrapper">
            <view
              class="iconfont"
              :class="
                (orderInfo.status == 0
                  ? 'icon-webicon318'
                  : 'icon-yuandianxiao') +
                ' ' +
                (orderInfo.status >= 0 ? 'font_color' : '')
              "
            >
            </view>
            <view
              class="line"
              :class="orderInfo.status > 0 ? 'bg_color' : ''"
            ></view>
            <view
              class="iconfont"
              :class="
                (orderInfo.status == 1
                  ? 'icon-webicon318'
                  : 'icon-yuandianxiao') +
                ' ' +
                (orderInfo.status >= 1 ? 'font_color' : '')
              "
            >
            </view>
            <view
              class="line"
              :class="orderInfo.status > 2 ? 'bg_color' : ''"
            ></view>
            <view
              class="iconfont"
              :class="
                (orderInfo.status == 4
                  ? 'icon-webicon318'
                  : 'icon-yuandianxiao') +
                ' ' +
                (orderInfo.status >= 4 ? 'font_color' : '')
              "
            >
            </view>
            <view
              class="line"
              :class="orderInfo.status > 4 ? 'bg_color' : ''"
            ></view>
            <view
              class="iconfont"
              :class="
                (orderInfo.status == 5
                  ? 'icon-webicon318'
                  : 'icon-yuandianxiao') +
                ' ' +
                (orderInfo.status >= 5 ? 'font_color' : '')
              "
            >
            </view>
            <view
              class="line"
              :class="orderInfo.status > 5 ? 'bg_color' : ''"
            ></view>
            <view
              class="iconfont"
              :class="
                (orderInfo.status == 6
                  ? 'icon-webicon318'
                  : 'icon-yuandianxiao') +
                ' ' +
                (orderInfo.status >= 6 ? 'font_color' : '')
              "
            >
            </view>
          </view>
        </view>
        <view v-if="shippingType === 2" class="nav">
          <view class="navCon acea-row row-between-wrapper">
            <view :class="orderInfo.status == 0 ? 'on' : ''">待付款</view>
            <view :class="orderInfo.status == 3 ? 'on' : ''">待核销</view>
            <view :class="orderInfo.status == 6 ? 'on' : ''">已收货</view>
          </view>
          <!-- 订单状态（0：待支付，1：待发货,2：部分发货， 3：待核销，4：待收货,5：已收货,6：已完成，9：已取消） -->
          <view class="progress acea-row row-between-wrapper">
            <view
              class="iconfont"
              :class="
                (orderInfo.status == 0
                  ? 'icon-webicon318'
                  : 'icon-yuandianxiao') +
                ' ' +
                (orderInfo.status >= 0 ? 'font_color' : '')
              "
            >
            </view>
            <view
              class="line"
              :class="orderInfo.status > 0 ? 'bg_color' : ''"
            ></view>
            <view
              class="iconfont"
              :class="
                (orderInfo.status == 3
                  ? 'icon-webicon318'
                  : 'icon-yuandianxiao') +
                ' ' +
                (orderInfo.status >= 3 ? 'font_color' : '')
              "
            >
            </view>
            <view
              class="line"
              :class="orderInfo.status > 4 ? 'bg_color' : ''"
            ></view>
            <view
              class="iconfont"
              :class="
                (orderInfo.status == 5
                  ? 'icon-webicon318'
                  : 'icon-yuandianxiao') +
                ' ' +
                (orderInfo.status >= 5 ? 'font_color' : '')
              "
            >
            </view>
          </view>
        </view>

        <view
          v-for="(item, index) in orderInfo.merchantOrderList"
          :key="item.merId"
        >
          <view class="borRadius14 orderGoodsBox">
            <orderGoods
              :orderInfo="item"
              :orderNo="orderNo"
              :cartInfo="item.orderInfoList"
              :jump="true"
              :orderData="orderInfo"
              :isShowBtn="false"
            ></orderGoods>
            <view class="flex justify-between userRemarkBox">
              <view class="f-s-30 color28">配送方式：</view>
              <view class="cor-86 f-s-30">自动发货</view>
            </view>
            <view class="flex justify-between userRemarkBox">
              <view class="f-s-30 color28">买家留言：</view>
              <view class="flex align-center userRemark">
                <view class="cor-86 f-s-30">{{ item.userRemark || "-" }}</view>
              </view>
              <view v-show="!isShow" @click="isShow = !isShow">
                <view class="mark_show f-s-30">{{ item.userRemark }}</view>
              </view>
            </view>
          </view>

          <!-- 云盘信息 -->
          <view
            v-if="secondType === ProductTypeEnum.CloudDrive && orderInfo.paid"
          >
            <view
              v-for="(items, index) in item.orderInfoList"
              :key="items.id"
              class="borRadius14 fictitious wrapper"
            >
              <view class="item acea-row row-between">
                <view class="f-s-30 color28">云盘信息：</view>
                <!-- #ifndef H5 -->
                <text
                  class="copy f-s-22 font-color"
                  @tap="handleCopy(items.expand)"
                  >复制</text
                >
                <!-- #endif -->
                <!-- #ifdef H5 -->
                <text
                  class="copy copy-data f-s-22 font-color"
                  :data-clipboard-text="items.expand"
                  >复制</text
                >
                <!-- #endif -->
              </view>
              <view class="mt-26 bg-color-F5F5F5 rd-8rpx padding20">
                <view class="f-s-26 text-666 lh-34rpx break-word">
                  {{ items.expand }}
                </view>
              </view>
            </view>
          </view>
          <!-- 卡密信息 -->
          <view
            v-if="secondType === ProductTypeEnum.CardPassword && orderInfo.paid"
          >
            <view
              v-for="items in item.orderInfoList"
              :key="index"
              class="borRadius14 fictitious wrapper"
            >
              <view class="item acea-row row-between">
                <view class="f-s-30 color28">卡密信息：</view>
              </view>
              <view class="mt-26">
                <view
                  v-for="its in items.cardSecretList"
                  :key="its.id"
                  class="item acea-row row-between bg-color-F5F5F5 rd-8rpx padding20"
                >
                  <view style="width: 540rpx">
                    <view class="f-s-26 text-666 mb-20 break-word"
                      >卡号：{{ its.cardNumber }}</view
                    >
                    <view class="f-s-26 text-666 break-word"
                      >密码：{{ its.secretNum }}</view
                    >
                  </view>
                  <!-- #ifndef H5 -->
                  <text
                    class="copy f-s-22 font-color"
                    @tap="
                      handleCopy(
                        '卡号:' + its.cardNumber + ',密码:' + its.secretNum
                      )
                    "
                    >复制</text
                  >
                  <!-- #endif -->
                  <!-- #ifdef H5 -->
                  <text
                    class="copy copy-data f-s-22 font-color"
                    :data-clipboard-text="
                      '卡号:' + its.cardNumber + ',密码:' + its.secretNum
                    "
                    >复制</text
                  >
                  <!-- #endif -->
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>

      <view v-if="orderExtend.length" class="borderPad">
        <view class="wrapper borRadius14">
          <systemFromInfo :orderExtend="orderExtend"></systemFromInfo>
        </view>
      </view>

      <!-- 订单信息 "-->
      <view class="borderPad">
        <view class="wrapper borRadius14">
          <view class="item acea-row row-between">
            <view>订单编号：</view>
            <view
              class="conter acea-row row-middle row-right"
              style="width: auto"
              ><text class="text-overflow">{{ orderInfo.orderNo }}</text>
              <!-- #ifndef H5 -->
              <text
                class="copy line-heightOne"
                @tap="handleCopy(orderInfo.orderNo)"
                >复制</text
              >
              <!-- #endif -->
              <!-- #ifdef H5 -->
              <text
                class="copy copy-data"
                :data-clipboard-text="orderInfo.orderNo"
                >复制</text
              >
              <!-- #endif -->
            </view>
          </view>
          <view class="item acea-row row-between" style="margin-top: 22rpx">
            <view>下单时间：</view>
            <view class="conter">{{ orderInfo.createTime || 0 }}</view>
          </view>
          <view class="item acea-row row-between">
            <view>支付状态：</view>
            <view class="conter" v-if="orderInfo.paid">已支付</view>
            <view class="conter" v-else>未支付</view>
          </view>
          <view v-if="orderInfo.payType" class="item acea-row row-between">
            <view>支付方式：</view>
            <view class="conter">{{ orderInfo.payType | payTypeFilter }}</view>
          </view>
        </view>
        <view class="wrapper borRadius14">
          <view class="item acea-row row-between">
            <view>商品总价：</view>
            <view class="conter">￥{{ orderInfo.proTotalPrice || 0 }}</view>
          </view>
          <view
            class="item acea-row row-between"
            v-if="orderInfo.payPostage > 0"
          >
            <view>运费：</view>
            <view class="conter">￥{{ orderInfo.payPostage || 0 }}</view>
          </view>
          <view
            class="item acea-row row-between"
            v-if="orderInfo.merCouponPrice > 0"
          >
            <view>店铺优惠：</view>
            <view class="conter">-￥{{ orderInfo.merCouponPrice || 0 }}</view>
          </view>
          <view
            class="item acea-row row-between"
            v-if="orderInfo.platCouponPrice > 0"
          >
            <view>平台优惠：</view>
            <view class="conter">-￥{{ orderInfo.platCouponPrice || 0 }}</view>
          </view>
          <view
            class="item acea-row row-between"
            v-if="orderInfo.integralPrice > 0"
          >
            <view>积分抵扣：</view>
            <view class="conter">-￥{{ orderInfo.integralPrice || 0 }}</view>
          </view>
          <view class="actualPay acea-row row-right"
            >实付款：<text class="money">￥{{ orderInfo.payPrice || 0 }}</text>
          </view>
        </view>
        <view style="height: 120rpx"></view>
        <!-- 订单状态（0：待支付，1：待发货,2：部分发货， 3：待核销，4：待收货,5：已收货,6：已完成，9：已取消） -->
        <view
          v-if="orderInfo.status !== 1 && orderInfo.status !== 5"
          class="footer acea-row row-right row-middle"
        >
          <view
            class="qs-btn"
            v-if="orderInfo.status == 0"
            @click.stop="cancelOrder"
            >取消订单</view
          >
          <view
            class="bnt bg_color"
            v-if="orderInfo.status == 4"
            @tap="confirmOrder"
            >确认收货</view
          >
          <view
            class="bnt cancel"
            v-if="orderInfo.status == 6 || orderInfo.status == 9"
            @tap="delOrder"
            >删除订单
          </view>
          <view
            class="bnt bg_color"
            v-if="orderInfo.status == 0"
            @tap="goPay(orderInfo)"
            >立即付款</view
          >
          <view
            class="bnt bg_color"
            v-if="orderInfo.status > 0"
            @tap="goOrderConfirm"
          >
            再次购买</view
          >
        </view>
      </view>
    </view>
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
import easyLoadimage from "@/components/base/easy-loadimage.vue";
import {
  getOrderDetail,
  orderTake,
  orderDel,
  orderCancel,
  strToBase64Api,
  orderStatusImgApi,
} from "@/api/order.js";
import { cartBatchAddApi } from "@/api/product.js";
import orderGoods from "../components/orderGoods";
import ClipboardJS from "@/plugin/clipboard/clipboard.js";
import { toLogin } from "@/libs/login.js";
import { mapGetters } from "vuex";
import { ProductTypeEnum } from "@/enums/productEnums";
// #ifdef MP
import uQRCode from "@/js_sdk/Sansnn-uQRCode/uqrcode.js";
// #endif
import { setThemeColor } from "@/utils/setTheme.js";
import { Debounce } from "@/utils/validate.js";
import systemFromInfo from "@/components/systemFromInfo";
const app = getApp();
export default {
  components: {
    orderGoods,
    easyLoadimage,
    systemFromInfo,
  },
  data() {
    return {
      ProductTypeEnum: ProductTypeEnum,
      codeImg: "",
      qrcodeSize: 100,
      orderNo: "",
      cartInfo: [], //购物车产品
      orderInfo: {
        systemStore: {},
        pstatus: {},
      }, //订单详情
      status: {}, //订单底部按钮状态
      totalPrice: "0",
      id: 0, //订单id
      uniId: "",
      utils: this.$util,
      againStatus: 0,
      secondType: 0, //二级订单类型
      isShow: true,
      theme: app.globalData.theme,
      bgColor: "#e93323",
      shippingType: 1,
      statusPic: "",
      isUserAddress: false, //是否只显示一次收货地址
      orderExtend: [], //系统表单数据
    };
  },
  computed: {
    //是否是虚拟商品
    isProductType() {
      return (
        this.secondType === this.ProductTypeEnum.CloudDrive ||
        this.secondType === this.ProductTypeEnum.CardPassword
      );
    },
    ...mapGetters(["isLogin", "chatUrl", "userInfo"]),
  },
  onLoad: function (options) {
    if (!options.orderNo)
      return this.$util.Tips(
        {
          title: "缺少参数",
        },
        {
          tab: 3,
          url: 1,
        }
      );
    this.$set(this, "orderNo", options.orderNo);
    this.bgColor = setThemeColor();
    uni.setNavigationBarColor({
      frontColor: "#ffffff",
      backgroundColor: this.bgColor,
    });
  },
  onShow() {
    if (this.isLogin) {
      this.getOrderInfo();
    } else {
      toLogin();
    }
  },
  onHide: function () {
    this.isClose = true;
  },
  // 滚动监听
  onPageScroll(e) {
    // 传入scrollTop值并触发所有easy-loadimage组件下的滚动监听事件
    uni.$emit("scroll");
  },
  onReady: function () {
    // #ifdef H5
    this.$nextTick(function () {
      const clipboard = new ClipboardJS(".copy-data");
      clipboard.on("success", () => {
        this.$util.Tips({
          title: "复制成功",
        });
      });
    });
    // #endif
  },
  methods: {
    /**
     * 打开支付组件
     *
     */
    goPay: Debounce(function (item) {
      uni.showLoading({
        title: "加载中...",
      });

      uni.navigateTo({
        url: `/pages/goods/order_payment/index?orderNo=${item.orderNo}&payPrice=${item.payPrice}`,
      });
    }),
    /**
     * 拨打电话
     */
    makePhone: function (e) {
      uni.makePhoneCall({
        phoneNumber: e,
      });
    },
    /**
     * 获取订单详细信息
     *
     */
    getOrderInfo: function () {
      let that = this;
      uni.showLoading({
        title: "正在加载中",
      });
      getOrderDetail(that.orderNo)
        .then((res) => {
          uni.hideLoading();
          let data = res.data;
          that.$set(that, "orderInfo", data);
          that.$set(that, "id", data.id);
          that.$set(that, "secondType", data.secondType);
          that.$set(
            that,
            "shippingType",
            data.merchantOrderList[0].shippingType
          );
          that.$set(that, "cartInfo", data.merchantOrderList[0].orderInfoList);
          that.$set(
            that,
            "orderExtend",
            data.orderExtend ? JSON.parse(data.orderExtend) : []
          );
          if (that.orderInfo.refundStatus > 0) {
            uni.setNavigationBarColor({
              frontColor: "#fff",
              backgroundColor: "#666666",
            });
          }
        })
        .catch((err) => {
          that.$util.Tips(
            {
              title: err,
            },
            {
              tab: 4,
              url: "/pages/user/index",
            }
          );
        });
    },
    //剪切订单号
    // #ifndef H5
    handleCopy: function (num) {
      uni.setClipboardData({
        data: num,
      });
    },
    // #endif
    /**
     * 打电话
     */
    goTel: function () {
      uni.makePhoneCall({
        phoneNumber: this.orderInfo.deliveryId,
      });
    },
    /**
     * 再此购买
     *
     */
    goOrderConfirm: Debounce(function () {
      uni.showLoading({
        title: "加载中...",
      });
      let cartListRequest = [];
      let that = this;
      this.cartInfo.map((item) => {
        cartListRequest.push({
          productId: parseFloat(item.productId),
          productAttrUnique: item.attrValueId,
          cartNum: parseFloat(item.payNum),
        });
      });
      cartBatchAddApi(cartListRequest)
        .then(function (res) {
          uni.switchTab({
            url: "/pages/order_addcart/order_addcart",
          });
        })
        .catch((res) => {
          return this.$util.Tips({
            title: res,
          });
        });
    }),
    confirmOrder: Debounce(function () {
      let that = this;
      uni.showModal({
        title: "确认收货",
        content: "为保障权益，请收到货确认无误后，再确认收货",
        success: function (res) {
          if (res.confirm) {
            orderTake(that.orderNo)
              .then((res) => {
                return that.$util.Tips(
                  {
                    title: "操作成功",
                    icon: "success",
                  },
                  function () {
                    that.getOrderInfo();
                  }
                );
              })
              .catch((err) => {
                return that.$util.Tips({
                  title: err,
                });
              });
          }
        },
      });
    }),
    /**
     *
     * 删除订单
     */
    delOrder: Debounce(function () {
      uni.showModal({
        content: "确定删除该订单",
        cancelText: "取消",
        confirmText: "确定",
        showCancel: true,
        confirmColor: "#f55850",
        success: (res) => {
          if (res.confirm) {
            let that = this;
            orderDel(this.orderNo)
              .then((res) => {
                return that.$util.Tips(
                  {
                    title: "删除成功",
                    icon: "success",
                  },
                  {
                    tab: 4,
                    url: "/pages/user/index",
                  }
                );
              })
              .catch((err) => {
                return that.$util.Tips({
                  title: err,
                });
              });
          } else {
          }
        },
      });
    }),
    cancelOrder: Debounce(function () {
      let self = this;
      uni.showModal({
        title: "提示",
        content: "确认取消该订单?",
        success: function (res) {
          if (res.confirm) {
            orderCancel(self.orderNo)
              .then((data) => {
                self.$util.Tips(
                  {
                    title: "取消成功",
                  },
                  {
                    tab: 4,
                    url: "/pages/user/index",
                  }
                );
              })
              .catch((err) => {
                self.$util.Tips({
                  title: err,
                });
                self.getDetail();
              });
          } else if (res.cancel) {
            console.log("用户点击取消");
          }
        },
      });
    }),
  },
};
</script>
<style scoped lang="scss">
@import "../static/css/order_details.scss";
</style>
