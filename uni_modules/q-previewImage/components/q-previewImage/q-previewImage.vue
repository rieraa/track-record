<template>
	<view class="previewImage" v-if="show" @tap="close">
		<view class="page" v-if="urls.length > 0">
			<text class="text">{{ current + 1 }} / {{ urls.length }}</text>
		</view>
		<swiper class="swiper" :current="current" @change="swiperChange"  @touchstart="handleTouchStart" @touchend="handleTouchEnd">
			<swiper-item v-for="(item, index) in urls" :key="index">
				<movable-area class="movable-area" scale-area>
					<movable-view class="movable-view" direction="all" :inertia="true" damping="100" scale="true" scale-min="1" scale-max="4" :scale-value="scale">
						<scroll-view scroll-y="true" class="uni-scroll-view">
							<view class="scroll-view"><image :key="index" class="image" :src="item" mode="widthFix" @longpress="onLongpress(item)" /></view>
						</scroll-view>
					</movable-view>
				</movable-area>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
export default {
	props: {
		urls: {
			type: Array,
			required: true,
			default: () => {
				return [];
			}
		}
	},
	data() {
		return {
			show: false,
			current: 0, //当前页
			scale: 1,
			isZooming: false // 是否处于缩放状态
		};
	},
	methods: {
		//打开
		open(current) {
			this.current = this.urls.findIndex(item => item === current);
			this.show = true;
			this.$emit('open');
		},
		//关闭
		close() {
			if (!this.isZooming) {
				this.show = false;
				this.current = 0;
				this.$emit('close');
			}
		},
		//图片改变
		swiperChange(e) {
			this.current = e.detail.current;
		},
		//监听长按
		onLongpress(e) {
			this.$emit('onLongpress', e);
		},
		handleTouchStart() {
			this.isZooming = true;
		},
		handleTouchEnd() {
			this.isZooming = false;
		}
	}
};
</script>

<style lang="scss" scoped>
.previewImage {
	z-index: 9999;
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: #000000;
	.swiper {
		width: 100%;
		height: 100vh;
		swiper-item {
			.movable-area {
				height: 100%;
				width: 100%;
				.movable-view {
					width: 100%;
					min-height: 100%;
					.scroll-view {
						display: flex;
						align-items: center;
						justify-content: center;
						height: 100vh;
						.image {
							width: 100%;
							height: auto;
						}
					}
				}
			}
		}
	}
	.page {
		position: absolute;
		z-index: 9999;
		width: 100%;
		top: 60rpx;
		text-align: center;
		.text {
			color: #fff;
			font-size: 32rpx;
			background-color: rgba(0, 0, 0, 0.5);
			padding: 3rpx 16rpx;
			border-radius: 20rpx;
			user-select: none;
		}
	}
}
</style>
