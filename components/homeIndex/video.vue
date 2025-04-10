<template>
	<view>
		<!-- 视频 -->
		<!-- #ifndef APP-PLUS -->
		<view class="diy_video acea-row row-center-wrapper" :style="[boxStyle]">
			<video :src="link" :show-mute-btn="pageGesture" :poster="cover" controls :autoplay="false" loop
				objectFit="cover"></video>
		</view>
		<!-- #endif -->
		<!-- app端为了解决层级太高，挡住了自定义底部菜单的问题，如果使用原生底部菜单，不存在遮挡问题，可以去掉判断，使用上面的写法就行。 -->
		<!-- #ifdef APP-PLUS -->
		<view class="diy_video acea-row row-center-wrapper" :style="[boxStyle]">
			<iframe :onload="onloadCode" style="width:100%;height:100%;"></iframe>
		</view>
		<!-- #endif -->
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
	export default {
		name: 'pictureCube',
		props: {
			dataConfig: {
				type: Object,
				default: () => {}
			},
		},
		data() {
			return {
				pageGesture: true,
				onloadCode: ''
			};
		},
		created() {
			// #ifdef APP
			this.onloadCode =
				`this.contentWindow.document.body.innerHTML = '<video style="width: 100%;height: 100%" objectFit="cover" controls="controls"  loop show-mute-btn="${this.pageGesture}" poster="${this.cover}" src="${this.link}"></video>';`
			// #endif
		},
		computed: {
			//视频封面
			cover() {
				return this.dataConfig.cover.url
			},
			//视频地址
			link() {
				if (this.dataConfig.tabConfig.tabVal === 0) {
					return this.dataConfig.uploadVideo.url
				} else {
					return this.dataConfig.link.val
				}

			},
			//最外层盒子的样式
			boxStyle() {
				return {
					borderRadius: this.dataConfig.bgStyle.val * 2 + 'rpx',
					background: `linear-gradient(${this.dataConfig.bgColor.color[0].item}, ${this.dataConfig.bgColor.color[1].item})`,
					margin: this.dataConfig.mbConfig.val * 2 + 'rpx' + ' ' + this.dataConfig.lrConfig.val * 2 + 'rpx' +
						' ' + 0,
					padding: this.dataConfig.upConfig.val * 2 + 'rpx' + ' ' + 0 + ' ' + this.dataConfig.downConfig.val *
						2 + 'rpx'
				}
			},
		}
	}
</script>
<style lang="scss" scoped>
	.diy_video {
		iframe {
			border: none;

			body {
				margin: 0;
			}
		}

		video {
			width: 100%;
			height: 340rpx;
			border-radius: 14rpx;
		}
	}
</style>