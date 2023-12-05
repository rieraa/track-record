<template>
	<view class="container">
		<map class="map" :polyline="polyline" :markers="markers" :latitude="latitude" :longitude="longitude"
			@callouttap="previewImage" :enable-rotate="true">
			<cover-view slot="callout">
				<cover-view v-for="(item,index) in markers" :key="index">
					<cover-view class="customCallout" :marker-id="item.id">
						<cover-view class="customCallout-imglist">
							<image @click="previewImg" class="record-img" v-for="(url,index) in item.photo" :src="url"
								:alt="index">
							</image>
						</cover-view>

					</cover-view>
				</cover-view>
			</cover-view>
		</map>

		<cover-view class="function-list">
			<button v-if="flag" class="button" @click="handleStart">开始记录</button>
			<button v-if="flag" class="button" @click="handleReset">重新定位</button>
			<button v-if="!flag" class="button" @click="handleEnd">停止记录</button>
			<button v-if="!flag" class="button" @click="handlePhoto">拍照</button>
		</cover-view>


	</view>
</template>

<script setup>
import {onMounted, ref} from 'vue';

import {getLocation} from "../../utils/location.js";


/********************************* 数据 *********************************/
	// 云对象
	const track = uniCloud.importObject("track_record")

	// 当前状态
	const flag = ref(true)


	// 图片预览

	const previewImg = (url) => {
		console.log("preview")
		wx.previewImage({
			urls: [url],
		});
	}


	// 地图中点
	const latitude = ref(0) // 地图默认显示的纬度
	const longitude = ref(0) // 地图默认显示的经度

	// 定时器标识符
	let intervalId;
	// 标点标识
	let id = 0

	// 拍照坐标
	let photoPos = {
		latitude: 0,
		longitude: 0,
	}

	// 单个点的经纬度值
	const position = ref({
		latitude: 0,
		longitude: 0,
	})


	// 路径记录
	const polyline = ref([{
		points: [],
		color: "#04C562",
		width: 5,
	}]);

	// 拍照点数据
	const markers = ref([])


	/********************************* 方法 *********************************/
	// 开始记录
	const handleStart = () => {
		flag.value = false;
		// 开始定时器
		intervalId = setInterval(updateLocation, 2000);
	}
	// 记录实时位置
	const updateLocation = () => {

		getLocation()
			.then(res => {
				position.value.latitude = parseFloat(res.latitude)
				position.value.longitude = parseFloat(res.longitude)

				// 模拟移动测试
				// position.value.latitude = parseFloat((position.value.latitude + 0.00001).toFixed(5));
				// position.value.longitude = parseFloat((position.value.longitude + 0.00001).toFixed(5))

				polyline.value[0].points.push({
					"latitude": position.value.latitude,
					"longitude": position.value.longitude
				})


			})
			.catch(err => {
				console.error('获取位置信息失败:', err);
				uni.showToast({
					title: '获取位置信息失败',
					duration: 2000
				});
			});

	};

	// 结束记录
	const handleEnd = () => {

		// 获取终点位置并标点
		markers.value.push({
			id,
			...polyline.value[0].points.slice(-1)[0],

		})
		id++

		uni.showLoading({
			title: '正在提交记录'
		});


		addRecord({
			"title": `记录 ${getRandomEmoji()}`,
			"data": getCurrentTime(),
			"points": polyline.value[0].points
		}, {
			"markers": markers.value
		})

		// 清除定时器
		clearInterval(intervalId);

		flag.value = true;


	}


	// 重新定位
	const handleReset = () => {

		getLocation()
			.then(res => {

				// 定位地图中心点
				latitude.value = parseFloat(res.latitude)
				longitude.value = parseFloat(res.longitude)


				polyline.value[0].points[0] = {
					"latitude": position.value.latitude,
					"longitude": position.value.longitude
				}

				id = 0
				markers.value[0] = {
					id,
					longitude,
					latitude,
				}
				id++

			})
			.catch(err => {
				console.error('获取位置信息失败:', err);
				uni.showToast({
					title: '获取位置信息失败',
					duration: 2000
				});
			});
	}

	// 计算拍照间隔距离
	function getDistance(lat1, lon1, lat2, lon2) {
		let R = 6371e3; // 地球半径，单位为米
		let φ1 = lat1 * Math.PI / 180; // 将纬度转换为弧度
		let φ2 = lat2 * Math.PI / 180; // 将纬度转换为弧度
		let Δφ = (lat2 - lat1) * Math.PI / 180; // 纬度之差
		let Δλ = (lon2 - lon1) * Math.PI / 180; // 经度之差

		let a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
			Math.cos(φ1) * Math.cos(φ2) *
			Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
		let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		let d = R * c; // 最终结果，单位为米
		return d;
	}

	// 图片选择
	const handlePhoto = () => {

		// 处理文件上传方法
		async function uploadFiles(filePaths) {
			const promises = filePaths.map(async (item) => {
				const result = await uniCloud.uploadFile({
					filePath: item,
					cloudPath: `track-record/${getCurrentTime()}.jpg`,
					onUploadProgress: function(progressEvent) {
						console.log(progressEvent);
						var percentCompleted = Math.round((progressEvent.loaded * 100) /
							progressEvent.total);
					}
				});

				return result.fileID;
			});

			// 等待所有文件上传 Promise 完成
			const fileListUrl = await Promise.all(promises);
			return fileListUrl;
		}

		// 获取当前的位置
		const currentPos = polyline.value[0].points.slice(-1)[0]
		// 计算最近两次拍照的距离
		const distance = getDistance(currentPos.latitude, currentPos.longitude, photoPos.latitude, photoPos.longitude)

		uni.chooseImage({
			sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
			// 选择图片成功后回调
			success: function(res) {
				let fileListUrl = []

				if (res.tempFilePaths.length > 0) {

					// 进行上传操作 调用函数并处理结果
					uploadFiles(res.tempFilePaths)
						.then((fileListUrl) => {
							fileListUrl = fileListUrl
							// 在这里可以使用 fileListUrl，它是包含所有文件 ID 的数组
							if (distance > 20) {
								// 当前拍照位置
								photoPos = currentPos
								markers.value.push({
									id: id,
									photo: [...fileListUrl],
									width: 30,
									height: 30,
									iconPath: "https://mp-f72e2dde-1a8b-4be3-95ae-b17754045d8f.cdn.bspapp.com/pin.png",
									customCallout: {
										anchorY: -20, // Y轴偏移量
										anchorX: 50,
										display: "BYCLICK"
									},
									...photoPos,
								})
								id++
								// 当两次拍照距离小于于20米
							} else {
								markers.value[markers.value.length - 1].photo.push(...fileListUrl);
							}
						})
						.catch((error) => {
							console.error("File upload failed:", error);
						});

				}


			}
		})

	}

	// 获取当前时间
	const getCurrentTime = () => {
		// 辅助函数，用于补零
		function padZero(number) {
			return number < 10 ? `0${number}` : number;
		}

		// 创建一个Date对象，它将包含当前的日期和时间
		const currentDate = new Date();
		// 获取年、月、日、时、分、秒
		const year = currentDate.getFullYear();
		const month = currentDate.getMonth() + 1; // 月份是从0开始的，所以要加1
		const day = currentDate.getDate();
		const hours = currentDate.getHours();
		const minutes = currentDate.getMinutes();
		const seconds = currentDate.getSeconds();
		// 使用模板字符串拼接成字符串
		const currentTimeString =
			`${year}-${padZero(month)}-${padZero(day)}-${padZero(hours)}:${padZero(minutes)}`;

		// 返回拼接好的字符串
		return currentTimeString;
	}

	// 随机选择一个 emoji
	function getRandomEmoji() {
		const emojis = ['😊', '🎉', '📅', '🚀', '📝', '🔥', '🌟', '🎈', '❤️', '👍'];
		const randomIndex = Math.floor(Math.random() * emojis.length);
		return emojis[randomIndex];
	}

	// 记录提交
	const addRecord = async (track, marker) => {

		// 把对象交给数据库
		let trackRes = await uniCloud.callFunction({
			name: 'addTrack',
			data: track
		})

		let markerRes = await uniCloud.callFunction({
			name: 'addMarker',
			data: {
				"trackId": trackRes.result.id,
				...marker
			}
		})


		uni.hideLoading();
		uni.showToast({
			title: '上传记录成功',
			duration: 2000
		});

		// Adding a delay of 2000 milliseconds (2 seconds) before redirecting
		setTimeout(function() {
			uni.reLaunch({
				url: '/pages/tabbar/index'
			});
		}, 2000);


	}

	/********************************* 生命周期 *********************************/
	onMounted(() => {

		// wx.startLocationUpdate({
		// 	success: (res) => {
		// 		wx.onLocationChange((data) => {
		// 			console.log("🚀 ~ onLocationChange-provider:", data.provider)
		// 			console.log("🚀 ~ onLocationChange:", data.latitude, data.longitude)

		// 			longitude.value = data.longitude
		// 			latitude.value = data.latitude
		// 			polyline.value[0].points.push({
		// 				"latitude": data.latitude,
		// 				"longitude": data.longitude
		// 			})

		// 			markers.value.push({
		// 				id,
		// 				longitude,
		// 				latitude,
		// 			})
		// 			id++


		// 		});

		// 	},
		// 	fail: (err) => {
		// 		console.log(err);
		// 	}
		// })


		clearInterval(intervalId);
		// 初始化地图， 定位用户当前位置
		getLocation()
			.then(res => {
				position.value.longitude = res.longitude
				position.value.latitude = res.latitude
				// 定位地图中心点
				longitude.value = res.longitude
				latitude.value = res.latitude
				// 设置起点
				markers.value.push({
					id,
					longitude,
					latitude,
				})
				id++
				// 放置开始路线点
				polyline.value[0].points.push({
					"latitude": position.value.latitude,
					"longitude": position.value.longitude
				})
			})
			.catch(err => {
				console.error('获取位置信息失败:', err);
			});
	})
</script>


<style lang="scss">
	.container {
		position: relative;

		.function-list {
			display: flex;
			flex-direction: column;
			position: absolute;
			bottom: 0;
			right: 0;

			.button {
				width: 100px;
				color: #8c96a0;
				text-shadow: 1px 1px 1px #fff;
				border: 1px solid #dce1e6;
				box-shadow: 0 1px 2px #fff inset, 0 -1px 0 #a8abae inset;
				background: -webkit-linear-gradient(top, #f2f3f7, #e4e8ec);
				background: -moz-linear-gradient(top, #f2f3f7, #e4e8ec);
				background: linear-gradient(top, #f2f3f7, #e4e8ec);
			}

		}

		.map {

			width: 100%;
			height: 100vh;


			.customCallout {

				background-color: #fff;
				border: 1px solid #ccc;
				border-radius: 30px;
				width: 200px;

				display: flex;
				flex-wrap: wrap;
				flex-direction: column;
				padding: 15px 15px;

				&-title {
					margin-bottom: 10px;
					font-size: 15px;
				}


				&-imglist {
					display: flex;
					gap: 20px;
					flex-wrap: wrap;


					.record-img {
						width: 60px;
						height: 60px;
						margin: 2px;
						/* 根据需要调整间距 */

					}

					.record-img:last-child {
						margin-right: 0;
						/* 去除最后一个图像的右侧间距 */
					}
				}

				// justify-content: center;


			}

		}
	}
</style>