# 最简洁的模拟图片预览,支持长按事件，多图左右滑动，大图上下滑动查看，支持图片放大，支持覆盖原生组件/原生导航栏/tabbar  支持vue2/vue3/app/小程序/h5

  - 为了解决项目中因一些特殊原因无法使用uni.previewImage，例如App.onShow或者页面的oShow中写了方法。
  - 如果用uni.previewImage，每次预览图片都会进到onShow的方法里
  - 可以基本实现官方的预览图片功能，但是体验不如uni.previewImage()
  - 如没有特殊原因，还是推荐官方的uni.previewImage()

## 安装指引

##1. 在插件市场打开本插件页面，在右侧点击`使用 HBuilderX 导入插件`，选择要导入的项目点击确定

##2. 使用方法 vue2写法

```
<template>
	<view>
		<video v-if="videoShow" id="myVideo" src="https://img.cdn.aliyun.dcloud.net.cn/guide/uniapp/%E7%AC%AC1%E8%AE%B2%EF%BC%88uni-app%E4%BA%A7%E5%93%81%E4%BB%8B%E7%BB%8D%EF%BC%89-%20DCloud%E5%AE%98%E6%96%B9%E8%A7%86%E9%A2%91%E6%95%99%E7%A8%8B@20200317.mp4" controls></video>
		<image v-for="(item, index) in imgs" :key="index" :src="item" @click="preview(item)"></image>
		<q-previewImage ref="previewImage" :urls="imgs" @onLongpress="onLongpress" @open="open" @close="close"></q-previewImage>
	</view>
</template>

<script>
export default {
 	data() {
 		return {
			videoShow:true,//video组件是否显示
 			imgs: [],
 		};
 	},

 	methods: {
 		preview(url) {
			this.imgs = ['https://web-assets.dcloud.net.cn/unidoc/zh/multiport-20210812.png', 'https://web-assets.dcloud.net.cn/unidoc/zh/uni-function-diagram.png'] //设置图片数组
			// #ifdef MP-WEIXIN
			this.$nextTick(()=>{
				 this.$refs.previewImage.open(url); // 传入当前选中的图片地址(小程序必须添加$nextTick，解决组件首次加载无图)
			})
			// #endif
			
			// #ifndef MP-WEIXIN
			this.$refs.previewImage.open(url); // 传入当前选中的图片地址
			// #endif
 		},
		onLongpress(e){ //长按事件
			console.log('当前长按的图片是' + e);
			uni.showActionSheet({
				itemList: ['转发给朋友', '保存到手机'],
				success: function (res) {
					console.log('选中了第' + (res.tapIndex + 1) + '个按钮');
				},
				fail: function (res) {
					console.log(res.errMsg);
				}
			});
		},
		
		/* open和close方法一般用不到，但是在一些特殊场景会用到，
		 * 比如预览图片时你需要覆盖 NavigationBar和 TabBar，
		 * 或者在app中需要预览图片时覆盖住原生组件，比如video或者map等，
		 * 你可以根据open和close去做一些操作，例如隐藏导航栏或者隐藏一些原生组件等
		 */
		open(){ //监听组件显示 （隐藏TabBar和NavigationBar，隐藏video原生组件）
			// uni.hideTabBar()
			// uni.setNavigationBarColor({
			//   frontColor: '#000000', // 设置前景色为黑色
			//   backgroundColor: '#000000', // 设置背景色为黑色
			// })
			// this.videoShow = false 
		},
		close(){ //监听组件隐藏 （显示TabBar和NavigationBar，显示video原生组件）
			// uni.showTabBar()
			// uni.setNavigationBarColor({
			//   frontColor: '#ffffff', // 设置前景色为白色
			//   backgroundColor: '#000000', // 设置背景色为黑色
			// })
			// this.videoShow = true
		}
 	}
 };
</script>


```

##3. vue3 setup写法

```

<template>
	<view>
		<video v-if="videoShow" id="myVideo" src="https://img.cdn.aliyun.dcloud.net.cn/guide/uniapp/%E7%AC%AC1%E8%AE%B2%EF%BC%88uni-app%E4%BA%A7%E5%93%81%E4%BB%8B%E7%BB%8D%EF%BC%89-%20DCloud%E5%AE%98%E6%96%B9%E8%A7%86%E9%A2%91%E6%95%99%E7%A8%8B@20200317.mp4" controls></video>
		<image v-for="(item, index) in imgs" :key="index" :src="item" @click="preview(item)"></image>
		<q-previewImage ref="previewImage" :urls="imgs"  @onLongpress="onLongpress" @open="open" @close="close"></q-previewImage>
	</view>
</template>

<script setup>
import { reactive, ref, toRefs,nextTick } from 'vue';

const data = reactive({
	videoShow:true,//video组件是否显示
	imgs: [],
});
const previewImage = ref(null);

const { imgs,videoShow } = toRefs(data)// 解构

const preview = url => {
	data.imgs = ['https://web-assets.dcloud.net.cn/unidoc/zh/multiport-20210812.png', 'https://web-assets.dcloud.net.cn/unidoc/zh/uni-function-diagram.png'] //设置图片数组
	
	
	// #ifdef MP-WEIXIN
	nextTick(()=>{
		 previewImage.value.open(url); // 传入当前选中的图片地址(小程序必须添加nextTick，解决组件首次加载无图)
	})
	// #endif
	
	// #ifndef MP-WEIXIN
	previewImage.value.open(url); // 传入当前选中的图片地址
	// #endif
};

const onLongpress = e =>{
	console.log('当前长按的图片是' + e);
	uni.showActionSheet({
		itemList: ['转发给朋友', '保存到手机'],
		success: function (res) {
			console.log('选中了第' + (res.tapIndex + 1) + '个按钮');
		},
		fail: function (res) {
			console.log(res.errMsg);
		}
	});
}

/* open和close方法一般用不到，但是在一些特殊场景会用到，
* 比如预览图片时你需要覆盖 NavigationBar和 TabBar，
* 或者在app中需要预览图片时覆盖住原生组件，比如video或者map等，
* 你可以根据open和close去做一些操作，例如隐藏导航栏或者隐藏一些原生组件等
*/
const open = () => { //监听组件显示 （隐藏TabBar和NavigationBar，隐藏video原生组件）
	// uni.hideTabBar()
	// uni.setNavigationBarColor({
	// 	frontColor: '#000000', // 设置前景色为黑色
	// 	backgroundColor: '#000000', // 设置背景色为黑色
	// })
	// data.videoShow = false 
}

const close = () => { //监听组件隐藏 （显示TabBar和NavigationBar，显示video原生组件）
	// uni.showTabBar()
	// uni.setNavigationBarColor({
	// 	frontColor: '#ffffff', // 设置前景色为白色
	// 	backgroundColor: '#000000', // 设置背景色为黑色
	// })
	// data.videoShow = true
}

</script>
					
```

##4. 项目示例 (一般返回的数据图片是以逗号或特殊字符分割的字符串，点击时就需要传两个参数，一个是图片数组，一个是当前图片的index)
## 注意q-previewImage不要写在循环体中，imgs其实就是用来存放当前图片的数组，每次点击每次赋值就行

```
<template>
	<view>
		<video v-if="videoShow" id="myVideo" src="https://img.cdn.aliyun.dcloud.net.cn/guide/uniapp/%E7%AC%AC1%E8%AE%B2%EF%BC%88uni-app%E4%BA%A7%E5%93%81%E4%BB%8B%E7%BB%8D%EF%BC%89-%20DCloud%E5%AE%98%E6%96%B9%E8%A7%86%E9%A2%91%E6%95%99%E7%A8%8B@20200317.mp4" controls></video>
		<view v-for="(item, index) in list" :key="index" class="list">
			<image :src="i"  mode="aspectFill" v-for="(i,imgindex) in item.urls.split(',')" @click.stop="preimg(item.urls.split(','),imgindex)"></image>
		<view>
		<q-previewImage ref="previewImage" :urls="imgs" @onLongpress="onLongpress" @open="open" @close="close"></q-previewImage>
	</view>
</template>

<script>
export default {
 	data() {
 		return {
			videoShow:true,//是否显示video组件
 			imgs: [],//imgs其实就是用来存放当前图片的数组，每次点击每次赋值就行
			
 		};
 	},

 	methods: {
 		preimg(urls,index){
 			this.imgs = urls //imgs其实就是用来存放当前图片的数组，每次点击每次赋值就行
			// #ifdef MP-WEIXIN
			this.$nextTick(()=>{
				 this.$refs.previewImage.open(this.imgs[index]); // 传入当前选中的图片地址(小程序必须添加$nextTick，解决组件首次加载无图)
			})
			// #endif
			
			// #ifndef MP-WEIXIN
			this.$refs.previewImage.open(this.imgs[index]); // 传入当前选中的图片地址
			// #endif
 		},
		onLongpress(e){ //长按事件
			console.log('当前长按的图片是' + e);
			uni.showActionSheet({
				itemList: ['转发给朋友', '保存到手机'],
				success: function (res) {
					console.log('选中了第' + (res.tapIndex + 1) + '个按钮');
				},
				fail: function (res) {
					console.log(res.errMsg);
				}
			});
		},
		/* open和close方法一般用不到，但是在一些特殊场景会用到，
		 * 比如预览图片时你需要覆盖 NavigationBar和 TabBar，
		 * 或者在app中需要预览图片时覆盖住原生组件，比如video或者map等，
		 * 你可以根据open和close去做一些操作，例如隐藏导航栏或者隐藏一些原生组件等
		 */
		open(){ //监听组件显示 （隐藏TabBar和NavigationBar，隐藏video原生组件）
			// uni.hideTabBar()
			// uni.setNavigationBarColor({
			//   frontColor: '#000000', // 设置前景色为黑色
			//   backgroundColor: '#000000', // 设置背景色为黑色
			// })
			// this.videoShow = false 
		},
		close(){ //监听组件隐藏 （显示TabBar和NavigationBar，显示video原生组件）
			// uni.showTabBar()
			// uni.setNavigationBarColor({
			//   frontColor: '#ffffff', // 设置前景色为白色
			//   backgroundColor: '#000000', // 设置背景色为黑色
			// })
			// this.videoShow = true
		}
 	}
 };
</script>

```


## 如果插件对您有一点帮助，请给个五星好评，感谢支持


## 如有问题，请加qq 965969604