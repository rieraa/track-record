<template>
	<view class="container">
		<map class="map" :latitude="latitude" :longitude="longitude" :markers="markers" @callouttap="previewImage">
			<cover-view slot="callout">
				<cover-view v-for="(item,index) in markers" :key="index">
					<cover-view class="customCallout" :marker-id="item.id">
						<cover-view class="customCallout-imglist">
							<cover-image class="record-img" v-for="(url,index) in item.photo" :src="url" :key="index"
								:alt="index">
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
		reactive,
		onMounted,
		ref
	} from 'vue';

	import {
		getLocation
	} from "../../utils/location.js";


	/********************************* 数据 *********************************/


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




	const latitude = 25.038897569444444 // 地图默认显示的纬度
	const longitude = 102.73094889322917 // 地图默认显示的经度
	const markers = ref([{
		"id": 0,
		"longitude": "102.73094889322917",
		"latitude": "25.038897569444444",
		"customCallout": {
			"anchorY": -20,
			"anchorX": 50,
			"display": "BYCLICK"
		},
		photo: ["https://mp-f72e2dde-1a8b-4be3-95ae-b17754045d8f.cdn.bspapp.com/101447956.jpg",
			"https://mp-f72e2dde-1a8b-4be3-95ae-b17754045d8f.cdn.bspapp.com/101447956.jpg"
		]
	}])
</script>


<style lang="scss">
	.container {



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
						z-index: 9990;
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