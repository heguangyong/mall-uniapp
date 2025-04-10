// +----------------------------------------------------------------------
// | CRMEB [ CRMEB赋能开发者，助力企业发展 ]
// +----------------------------------------------------------------------
// | Copyright (c) 2016~2025 https://www.crmeb.com All rights reserved.
// +----------------------------------------------------------------------
// | Licensed CRMEB并不是自由软件，未经许可不能去掉CRMEB相关版权
// +----------------------------------------------------------------------
// | Author: CRMEB Team <admin@crmeb.com>
// +----------------------------------------------------------------------

import {
	TOKENNAME,
	HTTP_REQUEST_URL
} from '../config/app.js';
import store from '../store';
import animationType from '@/utils/animationType.js'
// #ifdef APP-PLUS
import permision from "./permission.js"
// #endif
export default {
	/**
	 * 时间截取成字符串 23-06-26
	 * @param {Object} time 2023-06-26 15:13:00
	 */
	getTime(time) {
		let reg = new RegExp('-', 'g'); //g代表全部
		return time.split(' ')[0].replace(reg, '.').substring(2, 10);
	},

	/**优惠券展示的使用有效期均根据今天进行判断，
	 * 没到使用期的展示「开始日期-结束日期 有效」，
	 * 已经可以使用的展示「有效期至 结束日期」
	 * @param {Object} time
	 */
	getCouponTime(startTime, endTime) {
		let start = new Date(startTime).getTime();
		let newTime = Date.now();
		let reg = new RegExp('-', 'g') //g代表全部
		if (newTime < start) {
			return startTime.slice(0, 16).replace(reg, '.') + ' - ' + endTime.slice(0, 16).replace(reg, '.') + ' 可用';
		} else {
			return '有效期至 ' + endTime.slice(0, 16).replace(reg, '.');
		}
	},
	/**
	 * opt  object | string
	 * to_url object | string
	 * 例:
	 * this.Tips('/pages/test/test'); 跳转不提示
	 * this.Tips({title:'提示'},'/pages/test/test'); 提示并跳转
	 * this.Tips({title:'提示'},{tab:1,url:'/pages/index/index'}); 提示并跳转值table上
	 * tab=1 一定时间后跳转至 table上
	 * tab=2 一定时间后跳转至非 table上
	 * tab=3 一定时间后返回上页面
	 * tab=4 关闭所有页面跳转至非table上
	 * tab=5 关闭当前页面跳转至table上
	 */
	Tips: function(opt, to_url) {
		if (typeof opt == 'string') {
			to_url = opt;
			opt = {};
		}
		let title = opt.title || '',
			icon = opt.icon || 'none',
			endtime = opt.endtime || 1000,
			success = opt.success;
		if (title) uni.showToast({
			title: title,
			icon: icon,
			duration: endtime,
			success
		})
		if (to_url != undefined) {
			if (typeof to_url == 'object') {
				let tab = to_url.tab || 1,
					url = to_url.url || '';
				switch (tab) {
					case 1:
						//一定时间后跳转至 table
						setTimeout(function() {
							uni.switchTab({
								url: url
							})
						}, endtime);
						break;
					case 2:
						//跳转至非table页面
						setTimeout(function() {
							uni.navigateTo({
								url: url,
							})
						}, endtime);
						break;
					case 3:
						//返回上页面
						setTimeout(function() {
							// #ifndef H5
							uni.navigateBack({
								delta: parseInt(url),
							})
							// #endif
							// #ifdef H5
							history.back();
							// #endif
						}, endtime);
						break;
					case 4:
						//关闭当前所有页面跳转至非table页面
						setTimeout(function() {
							uni.reLaunch({
								url: url,
							})
						}, endtime);
						break;
					case 5:
						//关闭当前页面跳转至非table页面
						setTimeout(function() {
							uni.redirectTo({
								url: url,
							})
						}, endtime);
						break;
				}

			} else if (typeof to_url == 'function') {
				setTimeout(function() {
					to_url && to_url();
				}, endtime);
			} else {
				//没有提示时跳转不延迟
				setTimeout(function() {
					uni.navigateTo({
						url: to_url,
					})
				}, title ? endtime : 0);
			}
		}
	},
	/**
	 * 移除数组中的某个数组并组成新的数组返回
	 * @param array array 需要移除的数组
	 * @param int index 需要移除的数组的键值
	 * @param string | int 值
	 * @return array
	 *
	 */
	ArrayRemove: function(array, index, value) {
		const valueArray = [];
		if (array instanceof Array) {
			for (let i = 0; i < array.length; i++) {
				if (typeof index == 'number' && array[index] != i) {
					valueArray.push(array[i]);
				} else if (typeof index == 'string' && array[i][index] != value) {
					valueArray.push(array[i]);
				}
			}
		}
		return valueArray;
	},
	/**
	 * 获取视频分享海报
	 * @param array arr2 海报素材
	 * @param string store_name 素材文字
	 * @param string price 价格
	 * @param function successFn 回调函数
	 * 
	 * 
	 */
	videoPosterCanvas: function(arr2, content, nickname, successFn, errFun) {
		let that = this;
		const ctx = uni.createCanvasContext('myCanvas');
		ctx.clearRect(0, 0, 0, 0);
		/**
		 * 只能获取合法域名下的图片信息,本地调试无法获取
		 * 
		 */
		uni.getImageInfo({
			src: arr2[0],
			success: function(res) {
				const WIDTH = res.width;
				const HEIGHT = res.height;
				let r = 90;
				let d = r * 2;
				let cx = 40;
				let cy = 760;
				let ux = 50;
				let uy = 700;
				ctx.drawImage(arr2[0], 0, 0, WIDTH, HEIGHT);
				ctx.drawImage(arr2[1], 32, 32, WIDTH - 64, WIDTH - 64);
				ctx.strokeStyle = "#ffffff";
				ctx.save();
				ctx.arc(cx + r, cy + r, r, 0, 2 * Math.PI);
				ctx.drawImage(arr2[2], 530, 760, d, d);
				that.handleBorderRect(ctx, ux, uy, r, r, 45);
				ctx.clip();
				ctx.stockStyle = "#ffffff";
				ctx.drawImage(arr2[3], ux, uy, r, r);
				ctx.restore();
				ctx.setTextAlign('left')
				ctx.setFontSize(28);
				ctx.setFillStyle('#282828');
				ctx.fillText(nickname, r + 60, 760);
				ctx.setTextAlign('left')
				ctx.setFontSize(28);
				ctx.setFillStyle('#282828');
				const CONTENT_ROW_LENGTH = 25;
				let [contentLeng, contentArray, contentRows] = that.textByteLength(content,
					CONTENT_ROW_LENGTH);
				if (contentRows > 2) {
					contentRows = 2;
					let textArray = contentArray.slice(0, 2);
					textArray[textArray.length - 1] += '……';
					contentArray = textArray;
				}
				ctx.setTextAlign('left');
				ctx.font = 'bold 32px Arial';
				let contentHh = 32 * 1.3;
				for (let m = 0; m < contentArray.length; m++) {
					ctx.fillText(contentArray[m], 55, 850 + contentHh * m);
				}
				ctx.draw(true, function() {
					uni.canvasToTempFilePath({
						canvasId: 'myCanvas',
						fileType: 'png',
						destWidth: WIDTH,
						destHeight: HEIGHT,
						success: function(res) {
							uni.hideLoading();
							successFn && successFn(res.tempFilePath);
						},
						fail: function(err) {
							uni.hideLoading();
							errFun && errFun(err);
						}
					})
				});
			},
			fail: function(err) {
				uni.hideLoading();
				that.Tips({
					title: '无法获取图片信息'
				});
				errFun && errFun(err);
			}
		})
	},
	/**
	 * 生成海报获取文字
	 * @param string text 为传入的文本
	 * @param int num 为单行显示的字节长度
	 * @return array
	 */
	textByteLength: function(text, num) {

		let strLength = 0;
		let rows = 1;
		let str = 0;
		let arr = [];
		for (let j = 0; j < text.length; j++) {
			if (text.charCodeAt(j) > 255) {
				strLength += 2;
				if (strLength > rows * num) {
					strLength++;
					arr.push(text.slice(str, j));
					str = j;
					rows++;
				}
			} else {
				strLength++;
				if (strLength > rows * num) {
					arr.push(text.slice(str, j));
					str = j;
					rows++;
				}
			}
		}
		arr.push(text.slice(str, text.length));
		return [strLength, arr, rows] //  [处理文字的总字节长度，每行显示内容的数组，行数]
	},

	/**
	 * 获取分享海报
	 * @param array arr2 海报素材
	 * @param string store_name 素材文字
	 * @param string price 价格
	 * @param string ot_price 原始价格
	 * @param function successFn 回调函数
	 *
	 *
	 */
	PosterCanvas: function(arr2, store_name, price, ot_price, successFn) {
		let that = this;
		const ctx = uni.createCanvasContext('firstCanvas');
		ctx.clearRect(0, 0, 0, 0);
		/**
		 * 只能获取合法域名下的图片信息,本地调试无法获取
		 *
		 */
		ctx.fillStyle = '#fff';
		ctx.fillRect(0, 0, 750, 1150);
		uni.getImageInfo({
			src: arr2[0],
			success: function(res) {
				const WIDTH = res.width;
				const HEIGHT = res.height;
				// ctx.drawImage(arr2[0], 0, 0, WIDTH, 1050);
				ctx.drawImage(arr2[1], 0, 0, WIDTH, WIDTH);
				ctx.save();
				let r = 110;
				let d = r * 2;
				let cx = 480;
				let cy = 790;
				ctx.arc(cx + r, cy + r, r, 0, 2 * Math.PI);
				// ctx.clip();
				ctx.drawImage(arr2[2], cx, cy, d, d);
				ctx.restore();
				const CONTENT_ROW_LENGTH = 18;
				let [contentLeng, contentArray, contentRows] = that.textByteLength(store_name,
					CONTENT_ROW_LENGTH);
				if (contentRows > 2) {
					contentRows = 2;
					let textArray = contentArray.slice(0, 2);
					textArray[textArray.length - 1] += '……';
					contentArray = textArray;
				}
				ctx.setTextAlign('left');
				ctx.setFontSize(36);
				ctx.setFillStyle('#000');
				// let contentHh = 36 * 1.5;
				let contentHh = 36;
				for (let m = 0; m < contentArray.length; m++) {
					// ctx.fillText(contentArray[m], 50, 1000 + contentHh * m,750);
					if (m) {
						ctx.fillText(contentArray[m], 50, 1000 + contentHh * m + 18, 1100);
					} else {
						ctx.fillText(contentArray[m], 50, 1000 + contentHh * m, 1100);
					}
				}
				ctx.setTextAlign('left')
				ctx.setFontSize(72);
				ctx.setFillStyle('#DA4F2A');
				ctx.fillText('￥' + price, 40, 820 + contentHh);

				ctx.setTextAlign('left')
				ctx.setFontSize(36);
				ctx.setFillStyle('#999');
				ctx.fillText('￥' + ot_price, 50, 876 + contentHh);

				var underline = function(ctx, text, x, y, size, color, thickness, offset) {
					var width = ctx.measureText(text).width;
					switch (ctx.textAlign) {
						case "center":
							x -= (width / 2);
							break;
						case "right":
							x -= width;
							break;
					}

					y += size + offset;

					ctx.beginPath();
					ctx.strokeStyle = color;
					ctx.lineWidth = thickness;
					ctx.moveTo(x, y);
					ctx.lineTo(x + width, y);
					ctx.stroke();
				}
				underline(ctx, '￥' + ot_price, 55, 865, 36, '#999', 2, 0)
				ctx.setTextAlign('left')
				ctx.setFontSize(28);
				ctx.setFillStyle('#999');
				ctx.fillText('长按或扫描查看', 490, 1030 + contentHh);
				ctx.draw(true, function() {
					uni.canvasToTempFilePath({
						canvasId: 'firstCanvas',
						fileType: 'png',
						destWidth: WIDTH,
						destHeight: HEIGHT,
						success: function(res) {
							// uni.hideLoading();
							successFn && successFn(res.tempFilePath);
						}
					})
				});
			},
			fail: function(err) {
				console.log('失败', err)
				uni.hideLoading();
				that.Tips({
					title: '无法获取图片信息'
				});
			}
		})
	},
	
	/**
	 * 拼团邀请海报
	 * @param array arr2 海报素材
	 * @param string store_name 素材文字
	 * @param string price 价格
	 * @param string ot_price 拼团人数
	 * @param function successFn 回调函数
	 *
	 *
	 */
	 circleImg(ctx, img, x, y, r) {
	    ctx.save();
			ctx.beginPath()
	    var d =2 * r;
	    var cx = x + r;
	    var cy = y + r;
	    ctx.arc(cx, cy, r, 0, 2 * Math.PI);
	    ctx.clip();
	    ctx.drawImage(img, x, y, d, d);
	    ctx.restore();
			
	},
	groupCanvas: function(arr2, store_name, price, ot_price,groupLeaderNickname, successFn) {
		let that = this;
		const ctx = uni.createCanvasContext('firstCanvas');
		ctx.clearRect(0, 0, 0, 0);
		/**
		 * 只能获取合法域名下的图片信息,本地调试无法获取
		 *
		 */
		ctx.fillStyle = '#fff';
		ctx.fillRect(0, 30, 750, 1100);
		uni.getImageInfo({
			src: arr2[0],
			success: function(res) {
				const WIDTH = res.width;
				const HEIGHT = res.height;
				ctx.drawImage(arr2[0], 0, 0, 750, 1180);
				ctx.drawImage(arr2[3], 30, 80, 700, 1020);
				ctx.drawImage(arr2[1], 88, 300, WIDTH+90, WIDTH+120);
				ctx.save();
				let r = 70;
				let d = r * 2;
				let cx = 470;
				let cy = 870;
				ctx.arc(cx + r, cy + r, r, 0, 2 * Math.PI);
				// ctx.clip();
				ctx.drawImage(arr2[2], cx+45, cy+70, d, d);
				ctx.restore();
				that.circleImg(ctx, arr2[5], 70, 30, 30);
				const CONTENT_ROW_LENGTH = 20;
				let [contentLeng, contentArray, contentRows] = that.textByteLength(store_name,
					CONTENT_ROW_LENGTH);
				if (contentRows > 2) {
					contentRows = 2;
					let textArray = contentArray.slice(0, 2);
					textArray[textArray.length - 1] += '……';
					contentArray = textArray;
				}
				ctx.setTextAlign('left');
				ctx.setFontSize(36);
				ctx.setFillStyle('#000');
				// let contentHh = 36 * 1.5;
				let contentHh = 36;
				for (let m = 0; m < contentArray.length; m++) {
					// ctx.fillText(contentArray[m], 50, 1000 + contentHh * m,750);
					if (m) {
						ctx.fillText(contentArray[m], 90, 200 + contentHh * m + 18, 1400);
					} else {
						ctx.fillText(contentArray[m], 90, 200 + contentHh * m, 1400);
					}
				}
				ctx.setTextAlign('left')
				ctx.setFontSize(34);
				ctx.setFillStyle('#fff');
				ctx.fillText(groupLeaderNickname+'邀请你拼团', 135, 73 );
				
				
				ctx.setTextAlign('left')
				ctx.setFontSize(40);
				ctx.setFillStyle('#DA4F2A');
				ctx.fillText('￥' + price, 95, 950 + contentHh);
				
				let priceNumWidth = ctx.measureText('￥' + price).width
				ctx.drawImage(arr2[4], 110+priceNumWidth, 948, 100, 50);
				
				
				ctx.setTextAlign('left')
				ctx.setFontSize(28);
				ctx.setFillStyle('#666');
				ctx.fillText(`还差`, 100, 1020 + contentHh);
	
				ctx.setTextAlign('left')
				ctx.setFontSize(28);
				ctx.setFillStyle('#DA4F2A');
				ctx.fillText(`${ot_price}人`, 160, 1020 + contentHh);
				
				let numWidth = ctx.measureText(`${ot_price}人`).width
				
				ctx.setTextAlign('left')
				ctx.setFontSize(28);
				ctx.setFillStyle('#999');
				ctx.fillText(`即可拼团成功`, 160+numWidth, 1020 + contentHh);
				
				ctx.draw(true, function() {
					uni.canvasToTempFilePath({
						canvasId: 'firstCanvas',
						fileType: 'png',
						destWidth: WIDTH,
						destHeight: HEIGHT,
						success: function(res) {
							// uni.hideLoading();
							successFn && successFn(res.tempFilePath);
						}
					})
				});
			},
			fail: function(err) {
				console.log('失败', err)
				uni.hideLoading();
				that.Tips({
					title: '无法获取图片信息'
				});
			}
		})
	},
	
	/**
	 * 绘制文字自动换行
	 * @param array arr2 海报素材
	 * @param Number x , y 绘制的坐标
	 * @param Number maxWigth 绘制文字的宽度
	 * @param Number lineHeight 行高
	 * @param Number maxRowNum 最大行数
	 */
	canvasWraptitleText(canvas, text, x, y, maxWidth, lineHeight, maxRowNum) {
		if (typeof text != 'string' || typeof x != 'number' || typeof y != 'number') {
			return;
		}
		// canvas.font = '20px Bold PingFang SC'; //绘制文字的字号和大小
		// 字符分隔为数组
		var arrText = text.split('');
		var line = '';
		var rowNum = 1
		for (var n = 0; n < arrText.length; n++) {
			var testLine = line + arrText[n];
			var metrics = canvas.measureText(testLine);
			var testWidth = metrics.width;
			if (testWidth > maxWidth && n > 0) {
				if (rowNum >= maxRowNum) {
					var arrLine = testLine.split('')
					arrLine.splice(-9)
					var newTestLine = arrLine.join("")
					newTestLine += "..."
					canvas.fillText(newTestLine, x, y);
					//如果需要在省略号后面添加其他的东西，就在这个位置写（列如添加扫码查看详情字样）
					//canvas.fillStyle = '#2259CA';
					//canvas.fillText('扫码查看详情',x + maxWidth-90, y);
					return
				}
				canvas.fillText(line, x, y);
				line = arrText[n];
				y += lineHeight;
				rowNum += 1
			} else {
				line = testLine;
			}
		}
		canvas.fillText(line, x, y);
	},
	/**
	 * 获取活动分享海报
	 * @param array arr2 海报素材
	 * @param string storeName 素材文字
	 * @param string price 价格
	 * @param string people 人数
	 * @param string count 剩余人数
	 * @param function successFn 回调函数
	 */
	activityCanvas: function(arrImages, storeName, price, people, count, num, successFn) {
		let that = this;
		let rain = 2;
		const context = uni.createCanvasContext('activityCanvas');
		context.clearRect(0, 0, 0, 0);
		/**
		 * 只能获取合法域名下的图片信息,本地调试无法获取
		 *
		 */
		context.fillStyle = '#fff';
		context.fillRect(0, 0, 594, 850);
		uni.getImageInfo({
			src: arrImages[0],
			success: function(res) {
				context.drawImage(arrImages[0], 0, 0, 594, 850);
				context.setFontSize(14 * rain);
				context.setFillStyle('#333333');
				that.canvasWraptitleText(context, storeName, 110 * rain, 110 * rain, 230 * rain, 30 *
					rain, 1)
				context.drawImage(arrImages[2], 68 * rain, 194 * rain, 160 * rain, 160 * rain);
				context.save();

				context.setFontSize(14 * rain);
				context.setFillStyle('#fc4141');
				context.fillText('￥', 157 * rain, 145 * rain);

				context.setFontSize(24 * rain);
				context.setFillStyle('#fc4141');
				context.fillText(price, 170 * rain, 145 * rain);

				context.setFontSize(10 * rain);
				context.setFillStyle('#fff');
				context.fillText(people, 118 * rain, 143 * rain);


				context.setFontSize(12 * rain);
				context.setFillStyle('#666666');
				context.setTextAlign('center');
				context.fillText(count, (167 - num) * rain, 166 * rain);

				that.handleBorderRect(context, 27 * rain, 94 * rain, 75 * rain, 75 * rain, 6 * rain);
				context.clip();
				context.drawImage(arrImages[1], 27 * rain, 94 * rain, 75 * rain, 75 * rain);
				context.draw(true, function() {
					uni.canvasToTempFilePath({
						canvasId: 'activityCanvas',
						fileType: 'png',
						destWidth: 594,
						destHeight: 850,
						success: function(res) {
							// uni.hideLoading();
							successFn && successFn(res.tempFilePath);
						}
					})
				});

			},
			fail: function(err) {
				console.log('失败', err)
				uni.hideLoading();
				that.Tips({
					title: '无法获取图片信息'
				});
			}
		})
	},

	/**
	 * 图片圆角设置
	 * @param string x x轴位置
	 * @param string y y轴位置
	 * @param string w 图片宽
	 * @param string y 图片高
	 * @param string r 圆角值
	 */
	handleBorderRect(ctx, x, y, w, h, r) {
		ctx.beginPath();
		// 左上角
		ctx.arc(x + r, y + r, r, Math.PI, 1.5 * Math.PI);
		ctx.moveTo(x + r, y);
		ctx.lineTo(x + w - r, y);
		ctx.lineTo(x + w, y + r);
		// 右上角
		ctx.arc(x + w - r, y + r, r, 1.5 * Math.PI, 2 * Math.PI);
		ctx.lineTo(x + w, y + h - r);
		ctx.lineTo(x + w - r, y + h);
		// 右下角
		ctx.arc(x + w - r, y + h - r, r, 0, 0.5 * Math.PI);
		ctx.lineTo(x + r, y + h);
		ctx.lineTo(x, y + h - r);
		// 左下角
		ctx.arc(x + r, y + h - r, r, 0.5 * Math.PI, Math.PI);
		ctx.lineTo(x, y + r);
		ctx.lineTo(x + r, y);

		ctx.fill();
		ctx.closePath();
	},
	/*
	 * 视频上传
	 * @param object opt
	 * @param callable successCallback 成功执行方法 data
	 * @param callable errorCallback 失败执行方法
	 */
	uploadVideo: function(opt, successCallback, errorCallback) {
		let that = this;
		if (typeof opt === 'string') {
			let url = opt;
			opt = {};
			opt.url = url;
		}
		let count = opt.count || 1,
			sizeType = opt.sizeType || ['compressed'],
			sourceType = opt.sourceType || ['album', 'camera'],
			is_load = opt.is_load || true,
			uploadUrl = opt.url || '',
			inputName = opt.name || 'file',
			pid = opt.pid,
			fils = '',
			uploadMaxSize = 30,
			urlPath = HTTP_REQUEST_URL + '/api/front/upload/file' + "?model=" + opt.model +
			"&pid=" + opt.pid,
			model = opt.model;

		uni.chooseVideo({
			sourceType: sourceType,
			success: async (res) => {
				if (Math.ceil(res.size / 1024) < uploadMaxSize * 1024) {
					fils = await that.uploadFile(urlPath, res.tempFilePath, opt, '视频上传中');
					//获取视频第一帧为封面图，只兼容h5
					// #ifdef H5
					let dataURL = '';
					//uni.createVideoContext('1', that).play()
					let video = document.createElement("video");
					video.setAttribute('crossOrigin', 'anonymous'); //处理跨域
					video.setAttribute('src', fils);
					video.setAttribute('width', 400);
					video.setAttribute('height', 240);
					video.setAttribute('preload', 'auto');
					video.addEventListener('loadeddata', async function() {
						uni.showLoading({
							title: '加载中...',
						});
						let canvas = document.createElement("canvas"),
							width = video.width, //canvas的尺寸和图片一样
							height = video.height;
						canvas.width = width;
						canvas.height = height;
						canvas.getContext("2d").drawImage(video, 0, 0, width,
							height); //绘制canvas
						dataURL = canvas.toDataURL('image/png'); //转换为base64
						let file = await that.base64ToFile(dataURL); //base64转文件流
						let urlPaths = HTTP_REQUEST_URL + '/api/front/upload/image' +
							"?model=product&pid=1"; //图片上传地址
						let coverURL = await that.uploadFile(urlPaths, file, opt) //封面图
						successCallback && successCallback({
							fils: fils,
							coverURL: coverURL
						})
					});
					// #endif
					// #ifndef H5
					successCallback && successCallback({
						fils: fils,
						coverURL: ''
					})
					// #endif

				} else {
					// #ifdef APP-PLUS
					plus.nativeUI.alert(`您选择的视频超出${uploadMaxSize}MB,已过滤`);
					// #endif
					// #ifndef APP-PLUS
					uni.showModal({
						content: `您选择的视频超出${uploadMaxSize}MB,已过滤`,
						showCancel: false
					});
					// #endif
				}

			}
		})
	},
	/*
	 * 单图上传
	 * @param object opt
	 * @param callable successCallback 成功执行方法 data
	 * @param callable errorCallback 失败执行方法
	 */
	uploadImageOne: function(opt, successCallback, errorCallback) {
		let that = this;
		if (typeof opt === 'string') {
			let url = opt;
			opt = {};
			opt.url = url;
		}
		let count = opt.count || 1,
			sizeType = opt.sizeType || ['compressed'],
			sourceType = opt.sourceType || ['album', 'camera'],
			is_load = opt.is_load || true,
			uploadUrl = opt.url || '',
			inputName = opt.name || 'pics',
			pid = opt.pid,
			model = opt.model;

		uni.chooseImage({
			count: count, //最多可以选择的图片总数
			sizeType: sizeType, // 可以指定是原图还是压缩图，默认二者都有
			sourceType: sourceType, // 可以指定来源是相册还是相机，默认二者都有
			mediaType:['image'],
			success: async (res) => {
				let image = [];
				let filesLen = res.tempFiles.length;
				let exceeded_list = [];
				let uploadMaxSize = 10;
				let imageList = [];
				let urlPath = HTTP_REQUEST_URL + '/api/front/upload/image' + "?model=" + opt.model +
					"&pid=" + opt.pid
				if (count === 1) {
					successCallback && successCallback(await that.uploadFile(urlPath, res.tempFilePaths[
						0], opt, '图片上传中'))
				} else {
					for (let i = 0; i < res.tempFiles.length; i++) {
						if (Math.ceil(res.tempFiles[i].size / 1024) < uploadMaxSize * 1024) {
							image.push(res.tempFiles[i].path);
						} else {
							exceeded_list.push(i + 1);
							filesLen = filesLen - 1;
							// #ifdef APP-PLUS
							plus.nativeUI.alert(
								`第${[...new Set(exceeded_list)].join(',')}张图片超出限制${uploadMaxSize}MB,已过滤`
							);
							// #endif
							// #ifndef APP-PLUS
							uni.showModal({
								content: `第${[...new Set(exceeded_list)].join(',')}张图片超出限制${uploadMaxSize}MB,已过滤`
							});
							// #endif
							continue;
						}
					}
					for (const key in image) {
						imageList.push(await that.uploadFile(urlPath, image[key], opt, '图片上传中'))
					}
					successCallback && successCallback(imageList)
				}
			}
		})
	},
	uploadFile(urlPath, localPath, opt, message) {
		let that = this;
		return new Promise(async (resolve) => {
			//启动上传等待中...
			if (message) uni.showLoading({
				title: message,
			});
			uni.uploadFile({
				url: urlPath,
				filePath: localPath,
				name: opt.name || 'pics',
				header: {
					// #ifdef MP
					"Content-Type": "multipart/form-data",
					// #endif
					[TOKENNAME]: store.state.app.token
				},
				success: function(res) {
					uni.hideLoading();
					if (res.statusCode == 403) {
						that.Tips({
							title: res.data
						});
					} else {
						let data = res.data ? JSON.parse(res.data) : {};
						if (data.code == 200) {
							resolve(data.data.url);
						} else {
							that.Tips({
								title: data.message
							});
						}
					}
				},
				fail: function(res) {
					uni.hideLoading();
					that.Tips({
						title: res
					});
				}
			})
		})
	},
	/**
	 * 小程序头像获取上传
	 * @param uploadUrl 上传接口地址
	 * @param filePath 上传文件路径
	 * @param successCallback success回调
	 * @param errorCallback err回调
	 */
	uploadImgs(filePath, opt, successCallback, errorCallback) {
		let that = this;
		if (typeof opt === 'string') {
			let url = opt;
			opt = {};
			opt.url = url;
		}
		let count = opt.count || 1,
			sizeType = opt.sizeType || ['compressed'],
			sourceType = opt.sourceType || ['album', 'camera'],
			is_load = opt.is_load || true,
			uploadUrl = opt.url || '',
			inputName = opt.name || 'pics',
			pid = opt.pid,
			model = opt.model;
		let urlPath = HTTP_REQUEST_URL + '/api/front/upload/image' + "?model=" + model +
			"&pid=" + pid
		uni.uploadFile({
			url: urlPath,
			filePath: filePath,
			name: inputName,
			formData: {
				'filename': inputName
			},
			header: {
				// #ifdef MP
				"Content-Type": "multipart/form-data",
				// #endif
				[TOKENNAME]: store.state.app.token
			},
			success: function(res) {
				uni.hideLoading();
				if (res.statusCode == 403) {
					that.Tips({
						title: res.data
					});
				} else {
					let data = res.data ? JSON.parse(res.data) : {};

					if (data.code == 200) {
						successCallback && successCallback(data)
					} else {
						errorCallback && errorCallback(data);
						that.Tips({
							title: data.message
						});
					}
				}
			},
			fail: function(res) {
				uni.hideLoading();
				that.Tips({
					title: res
				});
			}
		})
	},
	base64ToImg(urlData, filename) {
		// 64转file
		var arr = urlData.split(",");
		var type = arr[0].match(/:(.*?);/)[1];
		var fileExt = type.split("/")[1];
		var bstr = atob(arr[1]);
		var n = bstr.length;
		var u8arr = new Uint8Array(n);
		while (n--) {
			u8arr[n] = bstr.charCodeAt(n);
		}
		return new File([u8arr], `${filename}.` + fileExt, {
			type: type,
		});

	},
	/**
	 * 处理服务器扫码带进来的参数
	 * @param string param 扫码携带参数
	 * @param string k 整体分割符 默认为：&
	 * @param string p 单个分隔符 默认为：=
	 * @return object
	 *
	 */
	// #ifdef MP
	getUrlParams: function(param, k, p) {
		if (typeof param != 'string') return {};
		k = k ? k : '&'; //整体参数分隔符
		p = p ? p : '='; //单个参数分隔符
		var value = {};
		if (param.indexOf(k) !== -1) {
			param = param.split(k);
			for (var val in param) {
				if (param[val].indexOf(p) !== -1) {
					var item = param[val].split(p);
					value[item[0]] = item[1];
				}
			}
		} else if (param.indexOf(p) !== -1) {
			var item = param.split(p);
			value[item[0]] = item[1];
		} else {
			return param;
		}
		return value;
	},
	/**根据格式组装公共参数
	 * @param {Object} value
	 */
	formatMpQrCodeData(value) {
		let values = value.split(',');
		let result = {};
		if (values.length === 2) {
			let v1 = values[0].split(":");
			if (v1[0] === 'pid') {
				result.spread = v1[1];
			} else {
				result.id = v1[1];
			}
			let v2 = values[1].split(":");
			if (v2[0] === 'pid') {
				result.spread = v2[1];
			} else {
				result.id = v2[1];
			}
		} else {
			result.spread = values[0].split(":")[1];
		}
		return result;
	},
	// #endif
	/*
	 * 合并数组
	 */
	SplitArray(list, sp) {
		if (typeof list != 'object') return [];
		if (sp === undefined) sp = [];
		for (var i = 0; i < list.length; i++) {
			sp.push(list[i]);
		}
		return sp;
	},
	trim(str) {
		return String.prototype.trim.call(str);
	},
	$h: {
		//除法函数，用来得到精确的除法结果
		//说明：javascript的除法结果会有误差，在两个浮点数相除的时候会比较明显。这个函数返回较为精确的除法结果。
		//调用：$h.Div(arg1,arg2)
		//返回值：arg1除以arg2的精确结果
		Div: function(arg1, arg2) {
			arg1 = parseFloat(arg1);
			arg2 = parseFloat(arg2);
			var t1 = 0,
				t2 = 0,
				r1, r2;
			try {
				t1 = arg1.toString().split(".")[1].length;
			} catch (e) {}
			try {
				t2 = arg2.toString().split(".")[1].length;
			} catch (e) {}
			r1 = Number(arg1.toString().replace(".", ""));
			r2 = Number(arg2.toString().replace(".", ""));
			return this.Mul(r1 / r2, Math.pow(10, t2 - t1));
		},
		//加法函数，用来得到精确的加法结果
		//说明：javascript的加法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的加法结果。
		//调用：$h.Add(arg1,arg2)
		//返回值：arg1加上arg2的精确结果
		Add: function(arg1, arg2) {
			arg2 = parseFloat(arg2);
			var r1, r2, m;
			try {
				r1 = arg1.toString().split(".")[1].length
			} catch (e) {
				r1 = 0
			}
			try {
				r2 = arg2.toString().split(".")[1].length
			} catch (e) {
				r2 = 0
			}
			m = Math.pow(100, Math.max(r1, r2));
			return (this.Mul(arg1, m) + this.Mul(arg2, m)) / m;
		},
		//减法函数，用来得到精确的减法结果
		//说明：javascript的加法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的减法结果。
		//调用：$h.Sub(arg1,arg2)
		//返回值：arg1减去arg2的精确结果
		Sub: function(arg1, arg2) {
			arg1 = parseFloat(arg1);
			arg2 = parseFloat(arg2);
			var r1, r2, m, n;
			try {
				r1 = arg1.toString().split(".")[1].length
			} catch (e) {
				r1 = 0
			}
			try {
				r2 = arg2.toString().split(".")[1].length
			} catch (e) {
				r2 = 0
			}
			m = Math.pow(10, Math.max(r1, r2));
			//动态控制精度长度
			n = (r1 >= r2) ? r1 : r2;
			return ((this.Mul(arg1, m) - this.Mul(arg2, m)) / m).toFixed(n);
		},
		//乘法函数，用来得到精确的乘法结果
		//说明：javascript的乘法结果会有误差，在两个浮点数相乘的时候会比较明显。这个函数返回较为精确的乘法结果。
		//调用：$h.Mul(arg1,arg2)
		//返回值：arg1乘以arg2的精确结果
		Mul: function(arg1, arg2) {
			arg1 = parseFloat(arg1);
			arg2 = parseFloat(arg2);
			var m = 0,
				s1 = arg1.toString(),
				s2 = arg2.toString();
			try {
				m += s1.split(".")[1].length
			} catch (e) {}
			try {
				m += s2.split(".")[1].length
			} catch (e) {}
			return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
		},
	},
	// 获取地理位置;
	$L: {
		getLocation() {
			console.log('Location')
			return new Promise(async (resolve, reject) => {
				// #ifdef APP-PLUS
				let status = await this.checkPermission();
				if (status !== 1) {
					uni.removeStorageSync('user_latitude');
					uni.removeStorageSync('user_longitude');
					resolve(status);
					return;
				}
				// #endif

				// #ifdef MP
				let status = await this.getSetting();
				if (status === 2) {
					uni.removeStorageSync('user_latitude');
					uni.removeStorageSync('user_longitude');
					this.Tips({
						title: '获取当前定位遇到困难，如需定位请开启权限'
					});
					//this.openSetting();
					resolve(status);
					return;
				}
				// #endif

				let Location = await this.doGetLocation();
				resolve(Location);
			});
		},
		doGetLocation() {
			return new Promise((resolve, reject) => {
				uni.getLocation({
					type: 'wgs84',
					success: (res) => {
						uni.setStorageSync('user_latitude', res.latitude);
						uni.setStorageSync('user_longitude', res.longitude);
						resolve(res);
					},
					complete: (res) => {
						uni.setStorageSync('user_latitude', res.latitude);
						uni.setStorageSync('user_longitude', res.longitude);
						resolve(res);
					},
					fail: (err) => {
						uni.removeStorageSync('user_latitude');
						uni.removeStorageSync('user_longitude');
						reject(err);
						// #ifdef MP-BAIDU
						if (err.errCode === 202 || err.errCode ===
							10003) { // 202模拟器 10003真机 user deny
							this.openSetting();
						}
						// #endif
						// #ifndef MP-BAIDU
						if (err.errMsg.indexOf("auth deny") >= 0) {
							uni.showToast({
								title: '访问位置被拒绝',
								icon: 'none',
								duration: 2000
							});
						} else {
							uni.showToast({
								title: err.errMsg,
								icon: 'none',
								duration: 2000
							});
						}
						// #endif
					}
				})
			});
		},
		getSetting: function() {
			return new Promise((resolve, reject) => {
				uni.getSetting({
					success: (res) => {
						if (res.authSetting['scope.userLocation'] === undefined) {
							resolve(0);
							return;
						}
						if (res.authSetting['scope.userLocation']) {
							resolve(1);
						} else {
							resolve(2);
						}
					}
				});
			});
		},
		/**
		 * 开启权限提示
		 */
		openSetting: function() {
			uni.openSetting({
				success: (res) => {
					if (res.authSetting && res.authSetting['scope.userLocation']) {
						this.doGetLocation();
					}
				},
				fail: (err) => {}
			})
		},
		async checkPermission() {
			let status = permision.isIOS ? await permision.requestIOS('location') :
				await permision.requestAndroid('android.permission.ACCESS_FINE_LOCATION');
			let pages = getCurrentPages();
			let prePage = pages[pages.length - 1].route;
			if (status === null || status === 1) {
				status = 1;
			} else if (status === 2) {
				if (prePage === 'pages/users/user_address/index')
					uni.showModal({
						content: "系统定位已关闭",
						confirmText: "确定",
						showCancel: false,
						success: function(res) {}
					})
			} else if (status.code) {
				if (prePage === 'pages/users/user_address/index')
					uni.showModal({
						content: status.message
					})
			} else {
				if (prePage === 'pages/users/user_address/index')
					uni.showModal({
						content: "需要定位权限",
						confirmText: "设置",
						success: function(res) {
							if (res.confirm) {
								permision.gotoAppSetting();
							}
						}
					})
			}
			return status;
		},
	},

	toStringValue: function(obj) {
		if (obj instanceof Array) {
			var arr = [];
			for (var i = 0; i < obj.length; i++) {
				arr[i] = toStringValue(obj[i]);
			}
			return arr;
		} else if (typeof obj == 'object') {
			for (var p in obj) {
				obj[p] = toStringValue(obj[p]);
			}
		} else if (typeof obj == 'number') {
			obj = obj + '';
		}
		return obj;
	},

	/*
	 * 替换域名
	 */
	setDomain: function(url) {
		url = url ? url.toString() : '';
		if (url.indexOf("https://") > -1) return url;
		else return url.replace('http://', 'https://');
	},

	/**
	 * 姓名除了姓显示其他
	 */
	formatName: function(str) {
		return str.substr(0, 1) + new Array(str.length).join('*');
	},

	/**
	 * 微信地址导入
	 * @param uploadUrl 上传接口地址
	 * @param filePath 上传文件路径
	 * @param successCallback success回调
	 * @param errorCallback err回调
	 */
	addressWxImport() {
		let that = this;
		uni.showLoading({
			title: '加载中...'
		});

		return new Promise((resolve, reject) => {
			uni.authorize({
				scope: 'scope.address',
				success: function(res) {
					uni.hideLoading();
					uni.chooseAddress({
						success(resd) {
							resolve(resd);
						},
						fail: function(err) {
							if (err.errMsg == 'chooseAddress:cancel') return that.Tips({
								title: '取消选择'
							});
						},
					})
				},
				fail: function(err) {
					uni.hideLoading();
					uni.showModal({
						title: '您已拒绝导入微信地址权限',
						content: '是否进入权限管理，调整授权？',
						success(err) {
							if (err.confirm) {
								uni.openSetting({
									success: function(err) {
										console.log(err.authSetting)
									}
								});
							} else if (err.cancel) {
								return that.Tips({
									title: '已取消！'
								});
							}
						}
					})
				}
			})
		});
	},

	/**
	 * 回退并且刷新页面
	 */
	backPageRefresh() {
		let pages = getCurrentPages(); // 当前页面        
		let beforePage = pages[pages.length - 2]; // 上一页        
		uni.navigateBack({
			success: function() {
				beforePage.$vm.reFresh();
			}
		})
	},

	/**
	 * 将时间转化为几小时
	 * @param {Object} data data必须是日期格式，不能是时间戳
	 */
	getDateDiff(data) {
		let datas = data;
		// 传进来的data必须是日期格式，不能是时间戳
		//var str = data;
		//将字符串转换成时间格式
		var timePublish = new Date(data);
		var timeNow = new Date();
		var minute = 1000 * 60;
		var hour = minute * 60;
		var day = hour * 24;
		var month = day * 30;
		var result = "";
		var diffValue = timeNow - timePublish;
		var diffMonth = diffValue / month;
		var diffWeek = diffValue / (7 * day);
		var diffDay = diffValue / day;
		var diffHour = diffValue / hour;
		var diffMinute = diffValue / minute;
		if (diffValue < 0) {} else if (diffMonth > 3) {
			result = timePublish.getFullYear() + "-";
			result += timePublish.getMonth() + "-";
			result += timePublish.getDate();

		} else if (diffMonth > 1) {
			result = parseInt(diffMonth) + "月前";
		} else if (diffWeek > 1) {
			result = parseInt(diffWeek) + "周前";
		} else if (diffDay > 1) {
			result = parseInt(diffDay) + "天前";
		} else if (diffHour > 1) {
			result = parseInt(diffHour) + "小时前";
		} else if (diffMinute > 1) {
			result = parseInt(diffMinute) + "分钟前";
		} else {
			result = "刚刚";
		}
		return result;
	},
	/**
	 * 链接地址跳转
	 * @param {Object} url 链接地址
	 */
	navigateTo(url) {
		if (url.indexOf("http") !== -1) {
			// #ifdef H5
			location.href = url
			// #endif
			// #ifdef APP-PLUS || MP
			uni.navigateTo({
				url: '/pages/users/web_page/index?webUel=' + encodeURIComponent(url)
			})
			// #endif
		} else {
			if (['/pages/goods_cate/index', '/pages/order_addcart/order_addcart', '/pages/user/index',
					'/pages/discover_index/index', '/pages/index/index'
				].indexOf(url) == -1) {
				uni.navigateTo({
					animationType: animationType.type,
					animationDuration: animationType.duration,
					url: url
				})
			} else {
				uni.switchTab({
					animationType: animationType.type,
					animationDuration: animationType.duration,
					url: url
				})
			}
		}
	},
	/**
	 * base64格式转为文件流
	 * @param base64 base64地址
	 * @returns {File}
	 */
	base64ToFile(base64) {
		return new Promise(function(resolve, reject) {
			if (typeof window === 'object' && 'document' in window) {
				base64 = base64.split(',')
				var type = base64[0].match(/:(.*?);/)[1]
				var str = atob(base64[1])
				var n = str.length
				var array = new Uint8Array(n)
				while (n--) {
					array[n] = str.charCodeAt(n)
				}
				return resolve((window.URL || window.webkitURL).createObjectURL(new Blob([array], {
					type: type
				})))
			}
			var extName = base64.match(/data\:\S+\/(\S+);/)
			if (extName) {
				extName = extName[1]
			} else {
				reject(new Error('base64 error'))
			}
			var fileName = Date.now() + '.' + extName
			if (typeof plus === 'object') {
				var bitmap = new plus.nativeObj.Bitmap('bitmap' + Date.now())
				bitmap.loadBase64Data(base64, function() {
					var filePath = '_doc/uniapp_temp/' + fileName
					bitmap.save(filePath, {}, function() {
						bitmap.clear()
						resolve(filePath)
					}, function(error) {
						bitmap.clear()
						reject(error)
					})
				}, function(error) {
					bitmap.clear()
					reject(error)
				})
				return
			}
			if (typeof wx === 'object' && wx.canIUse('getFileSystemManager')) {
				var filePath = wx.env.USER_DATA_PATH + '/' + fileName
				wx.getFileSystemManager().writeFile({
					filePath: filePath,
					data: base64.replace(/^data:\S+\/\S+;base64,/, ''),
					encoding: 'base64',
					success: function() {
						resolve(filePath)
					},
					fail: function(error) {
						reject(error)
					}
				})
				return
			}
			reject(new Error('not support'))
		})
	},
	// 计算头部自定义导航高度；
	getWXStatusHeight() {
		// 获取距上
		const barTop = uni.getSystemInfoSync().statusBarHeight;
		// #ifdef MP
		// 获取胶囊按钮位置信息
		const menuButtonInfo = wx.getMenuButtonBoundingClientRect() || 0
		// 获取导航栏高度
		const barHeight = menuButtonInfo.height + (menuButtonInfo.top - barTop) * 2
		let barWidth = menuButtonInfo.width
		// #endif
		// #ifndef MP
		// 获取导航栏高度
		const barHeight = parseInt(barTop) + 10;
		let barWidth = '100%'
		// #endif
		return {
			barHeight,
			barTop,
			barWidth
		}
	},

	/**
	 * 对象转数组
	 * @param data 对象
	 * @returns {*[]}
	 */
	objToArr(data) {
		let obj = Object.keys(data).sort();
		let m = obj.map(key => data[key]);
		return m;
	},
}