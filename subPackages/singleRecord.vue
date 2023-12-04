<template>
	<view>
		<map :polyline="polyline" :markers="markers" style="width: 100%; height: 100vh;" :latitude="latitude"
			:longitude="longitude" @callouttap="previewImage">
			<cover-view slot="callout">
				<cover-view v-for="(item,index) in markers" :key="index">
					<cover-view class="customCallout" :marker-id="item.id">
						<cover-view class="customCallout-title">
							{{ item.title }}
						</cover-view>
						<cover-view class="customCallout-imglist">
							<cover-image class="record-img" v-for="(url,index) in item.photo" :src="url" :alt="index">
							</cover-image>
						</cover-view>

					</cover-view>
				</cover-view>
			</cover-view>
		</map>

	</view>
</template>

<script setup>
	import {
		computed,
		onMounted,
		ref
	} from 'vue';
	import {
		onLoad
	} from "@dcloudio/uni-app";

	const map = ''
	const latitude = ref(0) // 地图默认显示的纬度
	const longitude = ref(0) // 地图默认显示的经度
	// 路线位置
	const polyline = ref([{
		points: [],
		color: "#04C562", //线条的颜色
		width: 5, //宽度


	}])

	const com = computed(() => {
		return polyline
	})
	// 图片点
	const markers = ref([])

	// 获取路径
	const getTrack = async (id = '') => {
		try {
			// 依次调用两个云函数
			const trackRes = await uniCloud.callFunction({
				name: 'getTrack',
				data: {
					id: id
				}
			});

			const markerRes = await uniCloud.callFunction({
				name: 'getMarker',
				data: {
					id: id
				}
			});

			// 直接返回 trackRes 和 markerRes
			return {
				trackRes,
				markerRes
			};
		} catch (error) {
			// 处理错误
			return {
				error: error
			};
		}
	};

	// 获取被点击气泡的id
	const previewImage = function(e) {
		const foundMarker = getMarkerById(e.markerId);
		uni.previewImage({
			urls: foundMarker.photo,
			current: 0
		})
	}
	// 通过id获取相应气泡的内容
	function getMarkerById(id) {
		return markers.value.find(marker => marker.id === id);
	}


	onLoad(async (prop) => {
		console.log("? ~ file:singleRecord method: line:80 -----prop:", prop)
		const {
			trackRes,
			markerRes,
			error
		} = await getTrack(prop.id);
		// 判断是否有错误
		if (error) {
			console.error('Error:', error);
		} else {
			// 输出 trackRes 和 markerRes
			polyline.value[0].points = trackRes.result.data[0].points
			markers.value = markerRes.result.data[0].markers
			console.log("? ~ file:singleRecord method: line:87 -----trackRes:", trackRes.result.data[0].points)
			console.log("? ~ file:singleRecord method: line:88 -----markerRes:", markerRes.result.data[0]
				.markers)

			latitude.value = polyline.value[0].points[0].latitude
			longitude.value = polyline.value[0].points[0].longitude

		}




	})
</script>

<style lang="scss">
	.customCallout {

		background-color: #fff;
		border: 1px solid #ccc;
		border-radius: 30px;
		width: 150px;

		display: flex;
		flex-direction: column;
		padding: 20px 20px;

		&-title {
			margin-bottom: 10px;
			font-size: 15px;
		}


		&-imglist {
			display: flex;
			gap: 20px;

			.record-img {
				width: 60px;
				height: 60px;
				margin-right: 5px;
				/* 根据需要调整间距 */

			}

			.record-img:last-child {
				margin-right: 0;
				/* 去除最后一个图像的右侧间距 */
			}
		}

		// justify-content: center;


	}
</style>