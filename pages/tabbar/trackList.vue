<template>
	<view class="container">
		<uni-search-bar class="search" @confirm="search" @input="input">

		</uni-search-bar>
		<view class="list">
			<view v-for="(item, index) in trackList" class="list-item">
				<view class="list-item-left">
					<view class="list-item-left-title">{{ item.title }}</view>
					<view class="list-item-left-detail">{{ item.data }}</view>
				</view>
				<view class="list-item-right">
					<button @click="(e) => handleClick(item._id)" class="list-item-right-button">
						查看
					</button>
					<button @click="modify(item)" class="list-item-right-button">
						编辑
					</button>
				</view>

				<view class="list-item-separator"></view>
			</view>

		</view>
	</view>

</template>


<script setup>
	import {
		onShow
	} from "@dcloudio/uni-app";
	import {
		onMounted,
		ref
	} from "vue";

	const isshow = ref(true)

	// 记录列表
	const trackList = ref([]);



	// 修改记录名称
	const modify = (item) => {
		wx.showModal({
			editable: true,
			title: '修改名称🖊️',
			content: item.title,
			async success(res) {
				if (res.confirm) {
					item.title = res.content
					await modifyTrackName(item)
					console.log('用户点击确定')
				} else if (res.cancel) {
					console.log('用户点击取消')
				}
			}
		})
	}

	// 搜索记录
	const search = async (e) => {
		console.log(e.value)
		trackList.value = await searchTrack(e.value);
	}

	// 跳转记录
	const handleClick = (id) => {
		uni.navigateTo({
			url: `/subPackages/singleRecord?id=${id}`
		});
	};
	// 获取所有记录
	const getTrack = async (id = '') => {
		uni.showToast({
			title: '加载中',
			icon: "loading"
		});
		let res = await uniCloud.callFunction({
			name: 'getTrack',
			data: {
				id: id
			}
		});
		console.log("🚀 ~ file:trackList method:getTrack line:84 -----res:", res)
		uni.hideToast();

		return res.result.data;
	};

	// 查询记录
	const searchTrack = async (title = '') => {
		uni.showToast({
			title: '加载中',
			icon: "loading"
		});
		let res = await uniCloud.callFunction({
			name: 'searchTrack',
			data: {
				title: title
			}
		});
		uni.hideToast();

		return res.result.data;
	};

	const modifyTrackName = async (item) => {
		let res = await uniCloud.callFunction({
			name: 'updateTrack',
			data: {
				id: item._id,
				title: item.title
			}
		});
	};

	onMounted(async () => {
		trackList.value = await getTrack();
	});
	onShow(async () => {
		trackList.value = await getTrack();
	})
</script>

<style lang="scss">
	.container {
		display: flex;
		flex-direction: column;

		.search {
			width: 100%;
		}

		.list {
			display: flex;
			flex-direction: column;
			margin-top: 10px;
			gap: 15px;

			&-item {
				height: 50px;
				position: relative;
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 0 13px;
				font-size: 15px;

				&-left {
					display: flex;
					flex-direction: column;
					gap: 6rpx;

					&-detail {
						color: #b1b1b1;
						font-size: 13px;
					}
				}

				&-right {
					display: flex;
					gap: 4px;

					&-button {
						font-size: 10px;
						color: #8c96a0;
						text-shadow: 1px 1px 1px #fff;
						border: 1px solid #dce1e6;
						box-shadow: 0 1px 2px #fff inset, 0 -1px 0 #a8abae inset;
						background: -webkit-linear-gradient(top, #f2f3f7, #e4e8ec);
						background: -moz-linear-gradient(top, #f2f3f7, #e4e8ec);
						background: linear-gradient(top, #f2f3f7, #e4e8ec);
					}
				}

				&-separator {
					position: absolute;
					bottom: -9px;
					left: 50%;
					width: 80%;
					height: 1px;
					background-color: #dce1e6;
					transform: translateX(-50%);
					/* 将其左边沿移动到父元素的中心 */
				}
			}
		}
	}
</style>