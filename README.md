# waterfall
---
title: 瀑布流布局
comments: true
date: 2018-06-03 09:51:08
categories:
tags:
about:

---

我们可以发现瀑布流布局最重要的两点是：`"定位"` 、`"定宽"`,`"哪一列最小就放到哪一列"`

定宽分成五列,前五张图片排好了之后,第六个图片看前五个列中哪一个列所占的高度最小就排到哪一列的后面,后面的图片以此类推。


我们先看一下最小值是怎么计算呢？

```javascript

var arr=[20,31,12,13,15,16];
var min_val = arr[0];
var min_key = 0;

for(var i=0; i<arr.length; i++) {
	if(arr[i] < min_val) {
		min_val = arr[i];
		 min_key = i;
	}
}
console.log('最小值为:' + min_val, '最小下标为:' + min_key);
```


`$.extend()`:将两个或更多对象的内容合并到第一个对象,如果有相同的属性，则覆盖，如果没有相同的属性则添加。

```javascript
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>jQuery extend</title>
	<style>
		h4 {
			text-align: center;
		}
	</style>
</head>
<body>
	<h4>jQuery extend</h4>
	<script src="./js/jquery.min.js"></script>
	<script>
		var defaults = {
			name: 'itcast',
			age: 10
		}
		var options = {
			name: 'web developer',
			sex: '男'
		}
		// 合并对象，有则替换，无则添加
		var newresult = $.extend(defaults, options);
		console.log(newresult);
	</script>
</body>
</html>
```

一个简易的瀑布流插件

计算每个pin(图片)的宽度，再加上2倍的图片之间的间隔，用浏览器的宽度一整除，就是每列可以放几张图片。


每个图片的宽度值应该等于它自身的宽度值乘以它的索引值。

将所有的列的值放到一个数组中，(其实每一列的高度就是由图片所组成的)

当所要放置的图片超过了第一行所要数目放置图片的的时候，这时候就应该比较第一行中的每一列，然后找那个图片高度最小的那一列，然后接下来的图片就放置到高度最小的那一列。也就是说现在的图片的top值就应该等于最小的那一列的高度再加上那个图片之间的间隙,left值为图片自身的宽度值乘以最小值对应的下标。以后所有的图片都要以依次比较最小的那一列，以此类推...

如果所有的图片都可以放在第一行的话，那么它的top值肯定是0。
主要代码如下：

```
(function($){

	$.fn.waterfall = function(options) {
		var defaults = {
			gap: 20 //图片之间的间隙
		}
		defaults = $.extend(defaults, options);
		//this指的是当前调用插件的DOM节点[#main]
		var that = $(this), //保存当前this的指向
		pin=that.children(), //获取当前节点的孩子节点
		width = pin.width(), //获取每张图片的宽度
		height,
		 //计算浏览器可以放几列
	    colums = Math.floor(that.width()/(width + 2 * defaults.gap));
	    //取出每一列图片的高度，然后比较一下看哪个最小，然后就把接下来的图片放到最小的那一列
	    //定义一个数组，用来存放图片的高度
	    h=[];
	    pin.each(function(index, Element){
	    	//每张图片的高度
	    	height=$(Element).height();
	    	if(index<colums){//所有的图片都在第一行，也就是说图片不超过5个
	    		//将需要循环遍历每一张图片的高度放在数组中
	    		h[index]=height;
	    		$(Element).css({
	    			//设置每一张图片的left和top值
	    		   	top:0,
	    			left:(width+defaults.gap)*index
	    		})
	    	}else{//说明这时候图片超过了五张，需要计算看现在哪一列的高度值最小，就把接下来的图片放到哪一列
	    		var min_h=h[0]; //将第一个看做是最小的，然后遇见更小的再逐一替换
	    		var min_index=0;
	    		for(var i=0;i<h.length;i++){
	    			if(h[i]<min_h)
	    			{
	    			min_h=h[i];
	    			min_index=i;//现在h数组中最小的值为下标i对应的元素
	    			}
	    	}
	    	//需要不断的更新最小的列
	    		h[min_index]+=height;
	    		$(Element).css({
	    			//现在的top值就应该等于最小的那一列的高度再加上那个图片之间的间隙
	    			top:min_h+defaults.gap,
	    			//现在的left值为图片自身的宽度值乘以最小值对应的下标
	    			left:(width+defaults.gap)*min_index
	    	})
	       }
	   })
	 }
})(jQuery)
```

完整源代码见：https://github.com/255255255255/pubuliu

瀑布流的bug问题：jQuery的执行机制是DOM树加载完毕就开始运行，这时可能图片的高度信息不能正确的获取到，导致top值设置的不正确，会出现再刚开始加载页面的时候所有的图片可能堆叠在一起的效果


解决方法：原生的javascript的执行机制是在所有的外部资源加载完毕后才开始运行，可以正确的获取到图片的高度信息，所以应该将获取图片的宽度和高度的信息放在javascript的入口函数中。


最好的解决办法：将图片的高度和宽度信息直接可以提前获取到，将图片的信息直接写死。(重构与回流的原因)


用ajax实现请求数据：也就是点击加载更多的效果：(其实也就是一个翻页的效果)

实现原理：第一次请求数据时要取第一页，第二次请求数据时要取第二页，第三次请求时要取第三页，......所以在ajax请求的时候只需要传递页码就可以了，(page=1,page=2、page=3)。

最主要的计算是每一页是怎么划分的？

假设每一页可以放10张图片(截取JSON数据的前十个)，那么第二页就是
