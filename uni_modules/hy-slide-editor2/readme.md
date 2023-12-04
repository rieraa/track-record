# hy-slide-editor2
# # hy-slide-editor （第二版）

`hy-slide-editor2` 是一个可以左右滑动编辑的列表组件，可对其灵活编辑、修改后使用，下面为具体使用过程。

## `hy-slide-editor2` 是 [hy-slide-editor](https://ext.dcloud.net.cn/plugin?id=14219) 的第二版，如需使用第一版可点击跳转。


## 1.属性说明
| 属性名     | 类型 |	 说明	 |
|:-----------|	:----:	|:-------|
|	id	 |	String	|	需要传入的id值，要使用点击事件时，必须填写。|
|	damping	|	Int |	滑块回弹速度	,默认65|
|	proportion	|	Int	|	宽高比例	，默认6|
|	img 	|	String		|	图片的url	|
|	fillet	|	Bool	|	图片是否圆角,默认false	|
|	ismore	|	Bool	|	是否显示左滑更多操作，默认‘false’		|
|	ismove	| 	String	|	是否可左右滑动，默认左右移动：‘horizontal’，可设置为不可移动：‘none’	|
|	border	|	String	|	边框，默认不显示，可设置为‘#f8f8f8’，	rgb(248,248,248)等颜色值		|
|	text1	|	String	|	文字1	|
|	text2	|	String	|	文字2	|
|	text3	|	String	|	文字3，一般为日期时间	|
|	text4	|	String	|	文字4，一般为消息数	|
|	t4color	|	String	|	文字4的字体颜色，默认：'#fff'	|
|	t4bgcolor	|	String	|	文字4的背景颜色，默认：‘red’	|
|	btn1	|	String	|	按钮1文字，默认“编辑”	|
|	btn2	|	String	|	按钮2文字，默认“删除”	|
|	@toBtn1		|	EventHandle	|	按钮1点击事件	|
|	@toBtn2		|	EventHandle	|	按钮2点击事件	|
|	@toDetail	|	EventHandle	|	点击组件事件		|


## 2.使用示例
页面:
```html
<template>
    <view class="content">
         <hy-slide-editor2 :id='id' @toBtn1="Btn1" @toBtn2="Btn2" @toDetail="Detail" img="../../static/logo.png" ismove="none" border="#f8f8f8"  text1="TEXT1" text2="TEXT2" text3="20010108" text4='5' btn1="编辑" btn2="删除" proportion='6' damping='65' fillet=false></hy-slide-editor2>
    </view>
</template>

```
script:
```javascript
	 export default {
		 data() {
			return {
				id:'123'
			}
		 },
		methods: {
			Btn1(e){
				console.log(e);
			},
			Btn2(e){
				console.log(e);
			},
			Detail(e){
				console.log(e);
			},
		}
	}

```

