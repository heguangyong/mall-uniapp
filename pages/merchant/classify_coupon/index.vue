<template>
	<view class="classify_coupon" :data-theme="theme">
		<coupon-and-classify :tabActive="tabActive" :merId="merid" v-if="merid"
			type="classify_coupon"></coupon-and-classify>
	</view>
</template>

<script>
	import couponAndClassify from '../components/couponAndClassify/index.vue';
	let app = getApp();
	export default {
		name: "index",
		components: {
			couponAndClassify
		},
		onLoad() {
			uni.setNavigationBarTitle({
				title: this.tabActive === 1?'商品分类':'优惠券' // 设置为你需要的标题
			});
		},
		data() {
			return {
				theme: app.globalData.theme,
				tabActive: 0,
				merid: 0
			}
		},
		methods: {
			onLoad(options) {
				this.merid = Number(options.id)
				this.tabActive = Number(options.tabActive)
			}
		}

	}
</script>

<style scoped>

</style>