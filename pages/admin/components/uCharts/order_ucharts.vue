<template>
	<view class="charts-box">
		<ucharts type="line" :chartData="chartData" :opts="opts" :ontouch="true" @scrollRight="scrollRight" />
	</view>
</template>

<script>
	import {
		throttle
	} from '@/utils/validate.js'
	import ucharts from '../qiun-data-charts/components/qiun-data-charts/qiun-data-charts.vue'
	export default {
		components: {
			ucharts
		},
		data() {
			return {
				chartData: {
					categories: ["1", "2", "3", "4", "5", "6", '7', '8'],
					series: [{
						name: "销售额",
						data: [18, 27, 21, 24, 6, 28, 66, 54]
					}]
				},
				opts: {
					enableScroll: true, //开启图表拖拽功能
					xAxis: {
						scrollShow: true, //新增是否显示滚动条，默认false
						itemCount: 4 //x轴单屏显示数据的数量，默认为5个 
					}
				},
			};
		},
		methods: {
			scrollRight: throttle(function() {
			}, 300)
		}
	};
</script>

<style>
	.charts-box {
		width: 100%;
		height: 300px;
	}
</style>