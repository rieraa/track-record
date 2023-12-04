<template>
	<view id="con" class="content">
		<!--,lineHeight:w/proportion+'px'  -->
		<movable-area :style="{height:w/proportion+'px',borderBottom:border?'1px solid'+border:''}" class="area">
			<movable-view :damping="damping" @change.stop="mchange" :style="{width:ismore?3/2*w+'px':w+'px'}" class="item" :x="fx" inertia="true" out-of-bounds="true" :direction="ismove">
				<view class="item1" :style="{width:w+'px'}" @click="todetail(id?id:'未传入id')">
					<image v-if="img" :style="{width:w/proportion-10+'px',height:w/proportion-10+'px',borderRadius:fillet?(w/proportion-10)/2+'px':0}" mode="aspectFill" class="item1-img" :src="img"></image>
					<view class="text-box">
						<view v-if="text1" :style="{fontSize:w/19+'px',width:4*w/7+'px'}" class="item1-text1">{{text1}}</view>
						<view v-if="text2" :style="{fontSize:w/26+'px',width:4*w/7+'px'}" class="item1-text2">{{text2}}</view>
					</view>
					<view v-if="text3" :style="{fontSize:w/30+'px',position:'absolute',top:w/proportion/6+'px',right:w/20+'px'}" class="item1-text3">{{text3}}</view>
					<view v-if="text4" :style="{fontSize:w/proportion/6+'px',position:'absolute',bottom:w/proportion/8+'px',right:w/20+'px',borderRadius:w/proportion/6+'px',paddingRight:w/proportion/12+'px',paddingLeft:w/proportion/12+'px',color:t4color,backgroundColor:t4bgcolor}" class="item1-text4">{{text4}}</view>
					<view v-if="!(text3 || text4)" :style="{fontSize:w/22+'px',position:'absolute',top:w/proportion/3+'px',right:w/20+'px',color:'#808080'}">></view>
				</view>
				<view class="item2" v-if="ismore" :style="{width:w/2+'px'}">
					<view class="item2-btn1" @click="tobtn1(id?id:'未传入id')">{{btn1}}</view>
					<view class="item2-btn2" @click="tobtn2(id?id:'未传入id')">{{btn2}}</view>
				</view>
			</movable-view>
		</movable-area>	
	</view>
</template>

<script>
	export default {
		name:"hy-slide-edittor",
		props:{
			//列表id
			id:{
				required:false
			},
			//滑块回弹速度
			damping:{
				default:65
			},
			//宽高比例
			proportion:{
				default:6
			},
			//图片
			img:{
				
			},
			//图片是否圆角
			fillet:{
				default:false
			},
			//是否左滑更多操作
			ismore:{
				default:false
			},
			//是否可左右移动
			ismove:{
				default:'horizontal'
			},
			//边框
			border:{
				
			},
			//文字1
			text1:{
				
			},
			//文字2
			text2:{
				
			},
			//文字3
			text3:{
				
			},
			//文字4
			text4:{
				
			},
			//text4字体颜色
			t4color:{
				default:'#fff'
			},
			//text4背景颜色
			t4bgcolor:{
				default:'red'
			},
			//按钮1
			btn1:{
				default:'编辑'
			},
			//按钮2
			btn2:{
				default:'删除'
			}
		},
		mounted() {
			//计算组件宽高
			this.$nextTick(function(){
				const query = uni.createSelectorQuery().in(this);
					query.select('#con').boundingClientRect(data => {
					// console.log("得到布局位置信息" + JSON.stringify(data));
					this.w=data.width;
					this.h=data.height;
					// this.fx=-data.left;
					// console.log("节点离页面顶部的距离为" + data.top);								
					}).exec();
			})
		},
		data() {
			return {
				fx: 0,//组件移动量
				oldx: 0,
				w:'',//组件宽度
				h:'',//组件高度	
				mx:'',
				ex:'',
			};
		},
		methods:{
			mchange(e){
				this.oldx=e.detail.x;
					this.ad();	
			},
			ad(){
				// console.log(-this.oldx);
				let a=-this.oldx;
				// console.log(this.w/2);
				if(a<=this.w/2-this.w/4){	
					this.fx=this.oldx;
					this.$nextTick(function(){
						this.fx=0;
					})
				}else if(a>this.w/2-this.w/4){
					this.fx=this.oldx;
					this.$nextTick(function(){
						this.fx=-this.w/2;
					})
				}								
			},
			//按钮1
			tobtn1(e){
				this.$emit('toBtn1',e);
			},
			//按钮2
			tobtn2(e){
				this.$emit('toBtn2',e);
			},
			//点击列表
			todetail(e){
				this.$emit('toDetail',e);
			},
		}
	}
</script>

<style>
.content{
	width: 100%;
	height: 100%;
}
.area{
	height: 100%;
	width: 100%;
	overflow: hidden;
	box-sizing: border-box;
}
.item{
	height: 100%;
	display: flex;
}
.item1{
	display: flex;
	padding-left: 5px;
	box-sizing: border-box;
	position: relative;
}
.item1:active{
	background-color: 	rgb(200,200,200,0.5);
}
	.item1-img{
		margin: 5px;
	}
	.text-box{
		/* height: 100%; */
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding-left: 5px;
		box-sizing: border-box;
	}
	.item1-text1{
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.item1-text2{
		color: 	#606060;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.item1-text3{
		color: 	#606060;
	}
	.item1-text4{
		/* padding: 0 5px; */
		font-weight: 600;
		/* border-radius: 10px; */
		/* color: #fff;
		background-color:red; */
	}
.item2{
	display: flex;
}
.item2-btn1{
	width: 50%;
	height: 100%;
	background-color: #3399ff;
	color: #fff;
	display: flex;
	align-items: center;
	justify-content: center;
}
.item2-btn2{
	width: 50%;
	height: 100%;
	background-color: orangered;
	color: #fff;
	display: flex;
	align-items: center;
	justify-content: center;
}
</style>
