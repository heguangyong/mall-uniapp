<template>
	<!--商品关联系统表单-->
	<view v-if="value.length>0" class="wrapper virtual_form bg-f boder-24 px-30">
		<view class='item acea-row row-between-wrapper'
			:class="{on:(item.name=='radios' || item.name=='checkboxs'),on2:item.name == 'dateranges',on3:item.name == 'citys',pd0:item.name == 'uploadPicture'}"
			v-for="(item,index) in orderNewForm" :key="index">
			<view class="name">
				<text class="item-require" v-if="item.titleShow.val">*</text>
				{{ item.titleConfig.val }}
			</view>
			<!-- radio -->
			<view v-if="item.name=='radios'" class="discount">
				<radio-group @change="radioChange($event, index, item)" class="acea-row row-middle row-right">
					<label class="radio" v-for="(j,jindex) in item.wordsConfig.list" :key="jindex">
						<view class="acea-row row-middle">
							<!-- #ifndef MP -->
							<radio :value="jindex.toString()" :checked='j.show' />
							<!-- #endif -->
							<!-- #ifdef MP -->
							<radio :value="jindex" :checked='j.show' />
							<!-- #endif -->
							<view>{{j.val}}</view>
						</view>
					</label>
				</radio-group>
			</view>
			<!-- checkbox -->
			<view v-if="item.name=='checkboxs'" class="discount acea-row">
				<checkbox-group @change="checkboxChange($event, index, item)" class="acea-row row-middle row-right">
					<label class="radio" v-for="(j,jindex) in item.wordsConfig.list" :key="jindex">
						<view class="acea-row row-middle">
							<!-- #ifndef MP -->
							<checkbox :value="jindex.toString()" :checked="j.show" style="transform:scale(0.9)" />
							<!-- #endif -->
							<!-- #ifdef MP -->
							<checkbox :value="jindex" :checked="j.show" style="transform:scale(0.9)" />
							<!-- #endif -->
							<view>{{j.val}}</view>
						</view>
					</label>
				</checkbox-group>
			</view>
			<!-- text -->
			<view v-if="item.name=='texts' && item.valConfig.tabVal == 0" class="discount">
				<input type="text" :placeholder="item.tipConfig.val" class="text-28rpx" placeholder-class="placeholder"
					v-model="item.value" />
			</view>
			<!-- number -->
			<view v-if="item.name=='texts' && item.valConfig.tabVal == 4" class="discount">
				<input type="number" :placeholder="item.tipConfig.val" class="text-28rpx" placeholder-class="placeholder"
					v-model="item.value" />
			</view>
			<!-- email -->
			<view v-if="item.name=='texts' && item.valConfig.tabVal == 3" class="discount">
				<input type="text" :placeholder="item.tipConfig.val" class="text-28rpx" placeholder-class="placeholder"
					v-model="item.value" />
			</view>
			<!-- data -->
			<view v-if="item.name=='dates'" class="discount">
				<picker mode="date" :value="item.value" @change="bindDateChange($event,index)">
					<view class="acea-row row-between-wrapper text-28rpx">
						<view v-if="item.value == ''" class="text--w111-ccc">{{item.tipConfig.val}}</view>
						<view v-else>{{item.value}}</view>
						<text class='iconfont icon-xiangxia'></text>
					</view>
				</picker>
			</view>
			<!-- dateranges -->
			<view v-if="item.name=='dateranges'" class="discount">
				<uni-datetime-picker v-model="item.value" type="daterange" class="text-28rpx flex" @maskClick="maskClick">
          <view v-if="item.value == ''" class="text--w111-ccc">请选择</view>
          <view v-else>{{item.value.length?item.value[0]+' - '+item.value[1]:item.tipConfig.val}}</view>
					<text class='iconfont icon-xiangxia'></text>
				</uni-datetime-picker>
			</view>
			<!-- time -->
			<view v-if="item.name=='times'" class="discount">
				<picker mode="time" :value="item.value" @change="bindTimeChange($event,index)"
					:placeholder="item.tipConfig.value">
					<view class="acea-row row-between-wrapper text-28rpx">
						<view v-if="item.value == ''" class="text--w111-ccc">{{item.tipConfig.val}}</view>
						<view v-else>{{item.value}}</view>
						<text class='iconfont icon-xiangxia'></text>
					</view>
				</picker>
			</view>
			<!-- timeranges -->
			<view v-if="item.name=='timeranges'" class="discount acea-row row-between-wrapper"
				@click="getTimeranges(index)">
				<view v-if="item.value" class="text-28rpx">{{item.value}}</view>
				<view v-else class="text--w111-ccc text-28rpx">{{item.tipConfig.val}}</view>
				<text class='iconfont icon-xiangxia'></text>
			</view>
			<!-- select -->
			<view v-if="item.name=='selects'" class="discount">
				<picker :value="item.value" :range="item.wordsConfig.list" @change="bindSelectChange($event,index,item)"
					range-key="val">
					<view class="acea-row row-between-wrapper">
						<view v-if="item.value" class="text-28rpx">{{item.value}}</view>
						<view v-else class="text--w111-ccc text-28rpx">请选择</view>
						<text class='iconfont icon-xiangxia'></text>
					</view>
				</picker>
			</view>
			<!-- city -->
			<view v-if="item.name=='citys'" class="discount" @click="changeRegion(index)">
				<view class="acea-row row-middle row-right">
					<view class="city text--w111-ccc" v-if="item.value == ''">{{item.tipConfig.val}}</view>
					<view class="city text-28rpx" v-else>{{item.value}}</view>
					<text class='iconfont icon-xiangxia'></text>
				</view>
			</view>
			<!-- id -->
			<view v-if="item.name=='texts' && item.valConfig.tabVal == 2" class="discount">
				<input type="idcard" :placeholder="item.tipConfig.val" class="text-28rpx" placeholder-class="placeholder"
					v-model="item.value" />
			</view>
			<!-- phone -->
			<view v-if="item.name=='texts' && item.valConfig.tabVal == 1" class="discount">
				<input type="number" :placeholder="item.tipConfig.val" class="text-28rpx"  placeholder-class="placeholder"
					v-model="item.value" />
			</view>
			<!-- img -->
			<view v-if="item.name=='uploadPicture'" class="confirmImg" style="padding-bottom: 0;">
				<view class='upload acea-row row-middle justify-end'>
					<view class='pictrue' v-for="(items,indexs) in item.value" :key="indexs">
						<image :src='items' mode="aspectFill"></image>
						<view class="close acea-row row-center-wrapper" @tap='DelPic(index,indexs)'>
							<view class="iconfont icon-guanbi1"></view>
						</view>
					</view>
					<view class='pictrue acea-row row-center-wrapper row-column' @tap='uploadpic(item)' style="margin-right: 0"
						v-if="item.value.length < item.numConfig.val">
						<view>上传图片</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 时间选择 -->
		<timerangesFrom :isShow='isShow' :time='timeranges' @confrim="confrim" @cancel="cancels"></timerangesFrom>

		<areaWindow ref="areaWindow" :display="display" :address='addressInfoArea' :cityShow='cityShow'
			@submit="OnChangeAddress" @changeClose="changeAddressClose"></areaWindow>
	</view>
</template>

<script>
	import areaWindow from '../areaWindow';
	import timerangesFrom from '../timeranges';
	import uniDatetimePicker from '../uni-datetime-picker/components/uni-datetime-picker/uni-datetime-picker.vue';
	import dayjs from "@/plugin/dayjs/dayjs.min.js";
	const CACHE_CITY = {};
	export default {
		props: {
      value: {
        type: Array,
        default: function() {
          return []
        }
      },
		},
		components: {
			areaWindow,
			timerangesFrom,
			uniDatetimePicker
		},
		data() {
			return {
				orderNewForm: [],
				isShow: false,
				timerangesIndex: 0,
				display: false,
				addressInfoArea: [],
				cityShow: 2,
				timeranges: [],
			}
		},
    watch: {
      orderNewForm: {
        handler(newVal) {
          this.$emit('input', newVal);
        },
        deep: true,
      },
    },
		mounted() {
			this.getFromData()
		},
		methods: {
			getFromData() {
				let formData = [...this.value];
				formData.forEach((item, index, arr) => {
					this.$set(item, 'value', "");
					CACHE_CITY[index] = ''; //清空省市区
					if (item.name == 'texts') {
						if (item.defaultValConfig.val) {
							item.value = item.defaultValConfig.val
						} else {
							item.value = ''
						}
					} else if (item.name == 'radios') {
						item.value = item.wordsConfig.list[0].val
					} else if (item.name == 'uploadPicture') {
						item.value = [];
					} else if (item.name == 'dateranges') {
						if (item.valConfig.tabVal == 0) {
							if (item.valConfig.tabData == 0) {
								let obj = dayjs(new Date(Number(new Date().getTime()))).format('YYYY-MM-DD');
								item.value = [obj, obj]
							} else {
								let data1 = dayjs(new Date(Number(new Date(item.valConfig.specifyDate[0])
									.getTime()))).format('YYYY-MM-DD');
								let data2 = dayjs(new Date(Number(new Date(item.valConfig.specifyDate[1])
									.getTime()))).format('YYYY-MM-DD');
								item.value = [data1, data2];
							}
						} else {
							item.value = [];
						}
					} else {
						if (['times', 'dates', 'timeranges'].indexOf(item.name) != -1) {
							if (item.valConfig.tabVal == 0) { //显示默认值
								if (item.valConfig.tabData == 0) {
									if (item.name == 'times') {
										item.value = dayjs(new Date(Number(new Date().getTime()))).format('HH:mm');
									} else if (item.name == 'dates') {
										item.value = dayjs(new Date(Number(new Date().getTime()))).format(
											'YYYY-MM-DD');
									} else {
										let current = dayjs(new Date(Number(new Date().getTime()))).format(
											'HH:mm');
										item.value = current + ' - ' + current;
									}
								} else {
									if (item.name == 'times' || item.name == 'dates') {
										item.value = item.valConfig.specifyDate;
									} else {
										item.value = item.valConfig.specifyDate[0] + ' - ' + item.valConfig
											.specifyDate[1];
									}
								}
							} else {
								item.value = '';
							}
						} else {
							item.value = '';
						}
					}
				})

				function sortNumber(a, b) {
					return a.timestamp - b.timestamp;
				}
				formData.sort(sortNumber);
				this.$set(this, 'orderNewForm', formData);
			},

			// 单选
			radioChange(e, index, item) {
				this.orderNewForm[index].value = item.wordsConfig.list[e.detail.value].val
			},

			// 多选
			checkboxChange(e, index, item) {
				let obj = e.detail.value;
				let val = '';
				item.wordsConfig.list.forEach((j, jindex) => {
					obj.forEach(x => {
						if (jindex == x) {
							val = val + (val ? ',' : '') + j.val;
						}
					})
				})
				this.orderNewForm[index].value = val
			},

			//日期
			bindDateChange(e, index) {
				this.orderNewForm[index].value = e.target.value
				this.$forceUpdate()
			},

			//时间
			bindTimeChange(e, index) {
				this.orderNewForm[index].value = e.target.value
			},

			//时间选择
			getTimeranges(index) {
				this.isShow = true
				this.timerangesIndex = index
			},

			//时间选择回调
			confrim(e) {
				this.isShow = false;
				this.orderNewForm[this.timerangesIndex].value = e.time;
				let arrayNew = [];
				e.val.forEach(item => {
					arrayNew.push(Number(item))
				})
				this.timeranges = arrayNew;
			},

			//关闭时间选择弹窗
			cancels() {
				this.isShow = false;
			},

			//sel选择
			bindSelectChange(e, index, item) {
				this.$set(this.orderNewForm[index], 'value', item.wordsConfig.list[e.detail.value].val);
			},

			//城市地址选择
			changeRegion(index) {
				if (!this.orderNewForm[index].value) {
					this.addressInfoArea = [];
				}
				this.timerangesIndex = index;
				this.cityShow = Number(this.orderNewForm[index].valConfig.tabVal) + 1;
				this.display = true;
				if (CACHE_CITY[index]) {
					this.addressInfoArea = CACHE_CITY[index];
				}
			},

			//选择地址回调
			OnChangeAddress(address) {
				// let addr = '';
				let addr = address.map(v => v.regionName).join('/');
				this.orderNewForm[this.timerangesIndex].value = addr;
				CACHE_CITY[this.timerangesIndex] = address;
			},

			// 关闭地址弹窗；
			changeAddressClose() {
				this.display = false;
			},

			/**上传文件*/
			uploadpic(item) {
				let that = this;
				that.$util.uploadImageOne({
					url: 'upload/image',
					name: 'multipart',
					model: "order",
					pid: 0
				}, function(res) {
					let pics = item.value || []
					pics.push(res);
					that.$set(item, 'value', pics);
				});
			},

			//删除图片
			DelPic(index, indexs) {
				let pic = this.orderNewForm[index].value;
				this.orderNewForm[index].value.splice(indexs, 1);
				this.$set(this.orderNewForm[index], 'value', this.orderNewForm[index].value);
			},
		}
	}
</script>

<style scoped lang="scss">
.item {
  font-size: 28rpx;
  color: #282828;
  margin-top: 20rpx;
}
	.name{
		width: 168rpx;
	}
	.virtual_form {
		.uni-input-wrapper {
			text-align: right;
		}

		.item-require {
			color: red;
			margin-right: 4rpx;
		}

		.item {
			padding: 27rpx 0;

			.pd0 {
				padding-bottom: 0;
			}

			.radio {
				margin: 0 22rpx 0 22rpx;
				padding: 10rpx 0;
			}

			.discount .placeholder {
				color: #ccc;
				text-align: right;
				font-size: 28rpx;
			}

			.discount {
				max-width: 480rpx;
				font-size: 28rpx;
				text-align: right;

				&.discount_voice {
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					max-width: 460rpx;
					text-align: right;
				}

				.iconfont {
					color: #515151;
					font-size: 20rpx;
					margin-left: 12rpx;
				}

				.num {
					font-size: 28rpx;
					margin-right: 20rpx;
				}
			}
		}
	}
</style>