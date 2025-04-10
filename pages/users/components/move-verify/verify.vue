<template>
	<view :class="mode=='pop'?'masks':''" v-if="clickShow">
		<view :class="mode=='pop'?'verifybox':''">
			<view class="verifybox-top" v-if="mode=='pop'">
				请完成安全验证
				<text class="verifybox-close" @click="clickShow = false">
					<text class="iconfont icon-close"></text>
				</text>
			</view>
			<view class="verifybox-bottom" :style="{padding:mode=='pop'?'15px':'0'}">
				<!-- 验证码容器 -->
				<move-verify :style="{ marginTop: '40rpx'} " @vertify='vertifyResult'></move-verify>
			</view>
		</view>
	</view>
</template>
<script>
	import moveVerify from './move-verify.vue';

	export default {
		name: 'MoveVerify',
		components: {
			moveVerify,
		},
		props: {
			mode: {
				type: String,
				default: 'pop'
			},
		},
		data() {
			return {
				vertify: false, //验证是否成功
				// showBox:true,
				clickShow: false,
				// 内部类型
				verifyType: undefined,
				tipWords: '', // 提示语
				startMoveTime: "", //移动开始的时间
				endMovetime: '', //移动结束的时间
			}
		},
		methods: {
			/**
			 * 滑动验证
			 */
			vertifyResult(vertify) {
				this.vertify = vertify
				if(this.vertify) this.$emit('success', this.vertify)
			},
			show() {
				if (this.mode == "pop") {
					this.clickShow = true;
				}
			},
			hide() {
				if (this.mode == "pop") {
					this.clickShow = false;
				}
			}
		},
		computed: {
			instance() {
				return this.$refs.instance || {}
			},
			showBox() {
				if (this.mode == 'pop') {
					return this.clickShow
				} else {
					return true;
				}
			}
		},
	}
</script>

<style scoped>
	.verifybox {
		width: 90%;
		position: relative;
		box-sizing: border-box;
		border-radius: 2px;
		border: 1px solid #e4e7eb;
		background-color: #fff;
		box-shadow: 0 0 10px rgba(0, 0, 0, .3);
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
	}

	.verifybox-top {
		padding: 0 15px;
		height: 50px;
		line-height: 50px;
		text-align: left;
		font-size: 16px;
		color: #45494c;
		border-bottom: 1px solid #e4e7eb;
		box-sizing: border-box;
	}

	.verifybox-bottom {
		/* padding: 15px; */
		box-sizing: border-box;
	}

	.verifybox-close {
		position: absolute;
		top: 13px;
		right: 9px;
		width: 24px;
		height: 24px;
		text-align: center;
		cursor: pointer;
	}

	.masks {
		position: fixed;
		top: 0;
		left: 0;
		z-index: 1001;
		width: 100%;
		height: 100vh;
		background: rgba(0, 0, 0, .3);
		/* display: none; */
		transition: all .5s;
	}

	.verify-tips {
		position: absolute;
		left: 0px;
		bottom: 0px;
		width: 100%;
		height: 30px;
		background-color: rgb(231, 27, 27, .5);
		line-height: 30px;
		color: #fff;
	}

	.tips-enter,
	.tips-leave-to {
		bottom: -30px;
	}

	.tips-enter-active,
	.tips-leave-active {
		transition: bottom .5s;
	}
</style>
