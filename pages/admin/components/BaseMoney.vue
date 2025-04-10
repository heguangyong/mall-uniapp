<template>
	<view :class="{ line: line, weight: weight }"
		:style="{color:color}"
		class="base-money semiBold">
		<text v-show="preFix" class="preFix" :style="{'font-size': preFixSize + 'rpx','color':textColor}">{{preFix}}</text>
		<text class="symbol" :style="{'font-size': symbolSize +'rpx'}">￥</text><text class="integer"
			:style="{'font-size': integerSize +'rpx'}">{{ integer }}</text>
		<text v-if="digits && showDigits" class="decimal semiBold"
			:style="{'font-size': decimalSize +'rpx'}">.{{ decimal }}</text>
	</view>
</template>

<script>
	export default {
		name: 'BaseMoney',
		props: {
			// 小数位数，为0则不显示
			digits: {
				type: Number,
				default: 2
			},
			money: {
				type: String | Number,
				default: ""
			},
			// 删除线
			line: {
				type: Boolean,
				default: false
			},
			// 粗体
			weight: {
				type: Boolean,
				default: false
			},
			color:{
				type: String,
				default: 'var(--view-theme)'
			},
			textColor:{
				type: String,
				default: '#999'
			},
			symbolSize: {
				type: String,
				default: '20'
			},
			integerSize: {
				type: String,
				default: '26'
			},
			decimalSize: {
				type: String,
				default: '24'
			},
			inline: {
				type: Boolean,
				default: false
			},
			preFix:{
				type: String,
				default: ''
			},
			preFixSize:{
				type: String,
				default: '24'
			},
			SemiBold:{
				type: Boolean,
				default: true
			},
			isCoupon:{
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				integer: 0,
				decimal: 0
			};
		},
		watch: {
			money: {
				handler(newValue, oldValue) {
					let value = Number(newValue).toFixed(this.digits);
					value = value.split('.');
					this.integer = value[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
					if (value[1]) {
						this.decimal = value[1];
					}
				},
				immediate: true
			}
		},
		computed:{
			showDigits(){
				if(this.isCoupon){
					if(this.decimal == '00') return false
				}else{
					return true
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.base-money {
		display: inline-block;
		&.line {
			text-decoration: line-through;
		}

		&.weight {
			font-weight: 500;
		}
	}
	.preFix{
		font-weight: 500 !important;
	}
	// .SemiBold{
	// 	font-family:'SemiBold';
	// }
	// .Regular{
	// 	font-family:'Regular';
	// }
</style>
