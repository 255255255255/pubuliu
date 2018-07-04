(function($){
	$.fn.waterfall = function(options) {
		var defaults = {
			gap: 20 //图片之间的间隙
		}
		defaults = $.extend(defaults, options);
		console.log(defaults)
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