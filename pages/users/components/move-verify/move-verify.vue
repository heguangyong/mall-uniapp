<template>
	<view :data-theme="theme">
		<view class="move-path bg-color" @touchend="handleOnTouchEnd" @touchstart="start">
			<view class="move-content">
				<view v-if="vertify" class="success">{{this.tipWords}}</view>
				<view v-else>拖动滑块验证</view>
			</view>
			<movable-area :animation="true">
				<movable-view class="move-view" :x="x" direction="horizontal" @change="handleOnMoving" :disabled="vertify"
					:class="{'active':vertify}"></movable-view>
			</movable-area>
		</view>
	</view>
</template>

<script>
	let app = getApp();
	export default {
		name: 'move-vertify',
		data() {
			return {
				x: 0,
				oldx: 0,
				vertify: false,
				size: {},
				isMove: false,
				tipWords: '', // 提示语
				startMoveTime: "", //移动开始的时间
				endMovetime: '', //移动结束的时间
				theme: app.globalData.theme,
			};
		},
		mounted() {
			this.init()
		},
		methods: {
			//鼠标按下
			start: function(e) {
				this.startMoveTime = new Date().getTime(); 
			},//开始滑动的时间
			//鼠标松开
			end: function() {
				this.endMovetime = new Date().getTime();
			},
			init() {
				this.getSize(".move-path").then((pathway) => {
					this.size.pathway = pathway;
					this.getSize(".move-view").then((track) => {
						this.size.track = track;
					});
				})
			},
			/**
			 * 获取元素宽度
			 */
			getSize(selector) {
				return new Promise((resolve, reject) => {
					const view = uni.createSelectorQuery().in(this).select(selector);
					view.fields({
						size: true,
					}, (res) => {
						resolve(res.width);
					}).exec();
				});
			},
			/**
			 * 滑动过程
			 */
			handleOnMoving(e) {
				this.oldx = e.detail.x;
			},
			/**
			 * 滑动结束
			 */
			handleOnTouchEnd() {
				this.endMovetime = new Date().getTime();
				
				if (this.vertify || this.oldx < 1) return;
				this.x = this.oldx;
				if ((this.oldx + 2) > (this.size.pathway - this.size.track)) this.vertify = true;
				else {
					this.$nextTick(() => {
						this.x = 0;
						this.oldx = 0;
					});
				}
				this.tipWords =`${((this.endMovetime-this.startMoveTime)/1000).toFixed(2)}s验证成功`;
				setTimeout(() => {
					this.$emit("vertify", this.vertify);
				}, 1000)
				
			},
		}
	}
</script>

<style scoped lang="scss">
	.move-path {
		margin: 20rpx auto;
		color: #333;
		height: 80rpx;
		border-radius: 80rpx;
		position: relative;
		overflow: hidden;

		.move-content {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			line-height: 80rpx;
			text-align: center;
			color: #fff;
			font-size: 32rpx;
			z-index: 3;

			.success {
				color: #fff;
			}
		}

		movable-area {
			position: absolute;
			top: 0;
			left: 0;
			height: 100%;
			width: 100%;
			background: none;
			z-index: 5;
		}

		movable-view {
			width: 120rpx;
			height: 80rpx;
			box-sizing: border-box;
			border-radius: 80rpx;
			background-color: #fff;
			@include coupons_border_color(theme);
			background-position: center;
			background-repeat: no-repeat;
			background-size: auto 32rpx;
			background-image: url('./arrow.png');
		}

		movable-view.active {
			background-size: 30% 30%;
			background-image: url('./success.png');
		}
	}
</style>