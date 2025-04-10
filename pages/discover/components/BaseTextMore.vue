<template>
	<view class="t-wrap">
		<!-- 虚拟view用于计算，计算完成则消失 -->
		<view class="t-txt-hide" :id="hid" v-if="!isCompute" :style="[computeStyle(0),{'text-align':oneRowTextAlign}]">
			<text space="nbsp">{{testContent?testContent:content}}{{showSymbol?'...':''}}</text><text
				v-if="expandText && collapseText && showSymbol" class="t-button">
				{{expandText}}
			</text><text></text>
		</view>
		<!-- 真实显示的内容 -->
		<view class="t-ellipsis" :id="id"
			:style="[!isCompute?computeStyle(1):computeStyle(2),{'text-align':oneRowTextAlign}]" @click="contentClick">
			<text space="nbsp">{{(!isCompute || expand)?content:(actualContent+(showSymbol?'...':''))}}</text><text
				v-if="expandText && collapseText && showSymbol" class="t-button" @click.stop="changeCollapse"
				:style="{'color':actionFontColor}">{{!expand?expandText:collapseText}}</text><text></text>
		</view>
		<!-- 这里加入了自定义的动态骨架屏友好反馈 -->
		<view v-if="!isCompute && rows>0" class="t-skeleton">
			<view class="skeletons" v-for="(item,index) in rows" :key="index">
				<view class="empty"></view>
			</view>
		</view>
	</view>
</template>

<script>
	//为了兼容部分老机型，增加扰动因子参数
	const factor = 5;
	export default {
		name: "KevyEllipsis",
		props: {
			/**
			 * 文本唯一标识符，非必填
			 */
			textId: {
				type: [String, Number],
				default: ''
			},
			/**
			 * 文本内容，默认''
			 */
			content: {
				type: String,
				default: ''
			},
			/**
			 * 字体大小，单位rpx，默认28
			 */
			fontSize: {
				type: [String, Number],
				default: 28
			},
			/**
			 * 字体颜色，默认#666666
			 */
			fontColor: {
				color: String,
				default: '#666666'
			},
			/**
			 * 收起操作的文案，默认''
			 */
			collapseText: {
				type: String,
				default: ''
			},
			/**
			 * 展开操作的文案，默认''
			 */
			expandText: {
				type: String,
				default: ''
			},
			/**
			 * 收起、展开操作文字颜色，默认'#007aff'
			 */
			actionFontColor: {
				color: String,
				default: '#007aff'
			},
			/**
			 * 展示行数，默认1
			 */
			rows: {
				type: Number,
				default: 1
			},
			/**
			 * 只有一行时文本对齐方式，支持left、right、justify
			 */
			oneRowTextAlign: {
				type: String,
				default: "justify"
			},
		},
		data() {
			return {
				//是否展开
				expand: false,
				//是否已计算
				isCompute: false,
				//内容高度
				h: undefined,
				//内容宽度
				w: undefined,
				//实际显示内容
				actualContent: '',
				//高度探测内容
				testContent: undefined,
				//是否显示省略号
				showSymbol: false,
				//hid和id,唯一标识符
				hid: 'hid' + Math.random().toString(36).substr(2),
				id: 'id' + Math.random().toString(36).substr(2),
			};
		},
		mounted() {
			this.$nextTick(() => {
				this.initEllipsis();
			})
		},
		computed: {
			//动态计算组件样式
			computeStyle() {
				return b => {
					let lines = this.rows > 0 ? this.rows : 1;
					let obj = {};
					if (b == 1) {
						obj = {
							'-webkit-line-clamp': lines,
							'display': '-webkit-box',
							'text-overflow': 'ellipsis',
							'overflow': 'hidden',
							'-webkit-box-orient': 'vertical'
						};
					} else if (b == 2) {
						obj = {
							'position': 'relative',
							'left': '0rpx',
							...obj
						};
					}
					return {
						'font-size': this.fontSize + 'rpx',
						'color': this.fontColor,
						...obj
					}
				}
			}
		},
		watch: {
			content(newVal, oldVal) {
				this.expand=false;
				this.isCompute=false;
				this.h=undefined;
				this.w=undefined;
				this.actualContent='';
				this.showSymbol=false;
				this.initEllipsis();
			}
		},
		methods: {
			//初始化
			initEllipsis() {
				if (this.content?.length > 0) {
					this.$nextTick(() => {
						this.init(this, () => {
							this.compute(this);
						})
					})
					
				}
			},
			//收起展开状态切换
			changeCollapse() {
				this.expand = !this.expand;
			},
			//文本点击事件
			contentClick() {
				this.$emit('contentClick', this.textId);
			},
			//组件参数初始化
			init($this, callback, isali) {
				if (isali) {
					uni.createSelectorQuery().in().select('#' + $this.id).boundingClientRect(d => {
						$this.h = Number(d.height.toFixed(1));
						$this.w = Number(d.width.toFixed(1));
						if (callback) {
							callback()
						}
					}).exec();
				} else {
					uni.createSelectorQuery().in($this).select('#' + $this.id).boundingClientRect(d => {
						$this.h = Number(d.height.toFixed(1));
						$this.w = Number(d.width.toFixed(1));
						if (callback) {
							callback()
						}
					}).exec();
				}
			},
			//动态计算组件内容
			computeContent($this, isali, dr) {
				$this.$nextTick(() => {
					$this.getH($this, isali, (ch) => {
						if (ch - factor > $this.h) {
							if (dr === -1) {
								$this.testContent = $this.content.substring(0, $this.testContent.length -
									1);
								$this.computeContent($this, isali, dr);
							} else {
								$this.actualContent = $this.content.substring(0, $this.testContent.length -
									1);
								$this.isCompute = true;
							}
						} else {
							if (dr === -1) {
								$this.actualContent = $this.testContent;
								$this.isCompute = true;
							} else {
								$this.testContent = $this.content.substring(0, $this.testContent.length +
									1);
								$this.computeContent($this, isali, dr);
							}
						}
					})
				});
			},
			//计算工具方法
			compute($this, isali) {
				let {
					rows,
					fontSize,
					content,
					h,
					w
				} = $this;
				$this.testContent = content;
				$this.$nextTick(() => {
					$this.getH($this, isali, (ch) => {
						if (ch - factor > h) {
							let lh = h / rows;
							let fn = Math.floor(w / $this.rpx2px(fontSize));
							let sfn = fn * rows;
							let i = $this.fontNum(content, sfn * 2 - ($this.expandText ? $this.fontNum(
									$this.expandText) :
								0) - 3);
							$this.showSymbol = true;
							$this.testContent = content.substring(0, i);
							$this.$nextTick(() => {
								$this.getH($this, isali, (ch1) => {
									if (ch1 - factor > h) {
										$this.testContent = content.substring(0, $this
											.testContent.length - 1);
										$this.computeContent($this, isali, -1);
									} else {
										$this.testContent = content.substring(0, $this
											.testContent.length + 1);
										$this.computeContent($this, isali, 1);
									}
								});
							});
						} else {
							$this.isCompute = true;
							$this.actualContent = content;
						}
					})
				});
			},
			//动态计算字符数
			fontNum(val, limit) {
				let c = 0;
				for (let i = 0; i < val.length; i++) {
					let a = val.charAt(i);
					if (a.match(/[^\x00-\xff]/ig) != null) {
						if (limit) {
							if (c + 2 > limit) {
								return i;
							} else {
								c += 2;
							}
						} else {
							c += 2;
						}

					} else {
						if (limit) {
							if (c + 1 > limit) {
								return i;
							} else {
								c += 1;
							}
						} else {
							c += 1;
						}
					}
				}
				if (!limit) {
					return c;
				}
			},
			rpx2px(rpx) {
				return uni.getSystemInfoSync().windowWidth * Number(rpx) / 750;
			},
			getH($, isali, callback) {
				if (isali) {
					uni.createSelectorQuery().in().select('#' + $.hid).fields({
						size: true
					}, d => {
						if(d && d.height){
							callback(Number(d.height.toFixed(1)));
						}						
					}).exec();
				} else {
					uni.createSelectorQuery().in($).select('#' + $.hid).fields({
						size: true
					}, d => {
						if(d && d.height){
							callback(Number(d.height.toFixed(1)));
						}
					}).exec();
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.t-wrap {
		width: 100%;
		box-sizing: border-box;
		position: relative;
	}

	.t-txt-hide {
		box-sizing: border-box;
		word-break: break-all;
		position: absolute;
		top: 999999px;
		left: 999999px;
		z-index: -1000;
		top: 0rpx;
		width: 100%;
		margin: 0rpx;
		text-align: justify;
		white-space: pre-line;
		line-height: 1.5 !important;
		.t-button {
			float: right;
			clear: both;
		}
	}

	.t-ellipsis {
		text-align: justify;
		box-sizing: border-box;
		width: 100%;
		word-break: break-all;
		position: relative;
		left: 99999px;
		white-space: pre-line;
		line-height: 1.5 !important;
		.t-button {
			float: right;
			clear: both;
			font-weight: 500;
		}
	}

	.t-skeleton {
		width: 100%;
		height: 100%;
		box-sizing: border-box;
		position: absolute;
		top: 0rpx;
		left: 0rpx;
	}

	.skeletons:first-child {
		margin-top: 0rpx !important;
	}

	.skeletons {
		position: relative;
		display: block;
		overflow: hidden;
		width: 100%;
		height: 32rpx;
		margin-top: 12rpx;
		background-color: rgba(0, 0, 0, 0.06);
		box-sizing: border-box;
	}

	.skeletons .empty {
		display: block;
		position: absolute;
		width: 100%;
		height: 100%;
		-webkit-transform: translateX(-100%);
		transform: translateX(-100%);
		background: linear-gradient(90deg, transparent, rgba(216, 216, 216, 0.753), transparent);
		-webkit-animation: loading .8s infinite;
		animation: loading .8s infinite;
	}



	@keyframes loading {
		100% {
			-webkit-transform: translateX(100%);
			transform: translateX(100%);
		}
	}
</style>