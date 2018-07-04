window.onload = function() {
	waterfall('main', 'pin');
	var data = [{'src': '1.jpg'}, {'src': '2.jpeg'}, {'src': '3.jpg'}, {'src': '4.jpeg'},{'src': '5.jpeg'}, 
	{'src': '6.jpeg'}, {'src': '7.jpg'}, {'src': '8.jpg'}, {'src': '9.jpg'},{'src': '10.jpg'},
	{'src': '11.jpg'}, {'src': '12.jpg'}, {'src': '13.jpg'}, {'src': '14.jpg'},{'src': '15.jpg'}]
	//屏幕滚动的时候往页面加载数据(只要滚动条滚动就加载数据)
	window.onscroll = function() {
		if(checkScrollStie()) {
			var oParent = document.getElementById('main');
			for(i in data) {
				//创建元素节点
				var oPin = document.createElement('div');
				oPin.className = 'pin';
				oParent.appendChild(oPin);
				var oBox = document.createElement('div');
				oBox.className = 'box';
				oPin.appendChild(oBox);
				oImg.src = './images/' + data[i].src;
				oBox.appendChild(oImg);
			}
			waterfall('main', 'pin');
		}
	}
	}
	//               父级(id)  具体瀑布流块(class类名)          
	function waterfall(parent, pin) {
		var oParent = document.getElementById(parent);
		var aPin = getClassObj(oParent, pin);
		var iPinW = aPin[0].offsetWidth;
		var num = Math.floor(document.documentElement.clientWidth / iPinW);
		//让文本居中
		oParent.style.cssText = 'width:' + num * iPinW + 'px;margin:0 auto;';
		var compareAarr = [];
		for(var i = 0; i < aPin.length; i++) {
			if(i < num) {
				compareAarr[i] = aPin[i].offsetHeight;
			} else {
				//取最小的高度的图片
				var minH = Math.min.apply({}, compareAarr);
				var minKey = getMinKey(compareAarr, minH);
				//更新最新的高度数据
				compareAarr[minKey] += aPin[i].offsetHeight;
				setMoveStyle(aPin[i], minH, aPin[minKey].offsetLeft, i, 1);
			}

		}
		for(var i = num; i < aPin.length; i++) {
			aPin[i].style.position = 'absolute';
			//drag(aPin[i]);
		}
	}
	//设置动画( 运动风格 )  obj运动的对象，top运动的top值，left运动的left值                    
	var startNum = 0;

	function setMoveStyle(obj, top, left, index, style) {
		if(index <= startNum) {
			return;

		}
		var documentW = document.documentElement.clientWidth;
		obj.style.position = 'absolute';
		switch(style) {
			case 1:
				obj.style.top = getTotalH() + 'px';
				// 从正中间过来 
				obj.style.left = Math.floor((documentW - obj.offsetWidth) / 3) + 'px';
				$(obj).stop().animate({
					top: top,
					left: left
				}, 2000);
				break;
			case 2:
				obj.style.top = top + 'px';
				// 从正中间过来 
				obj.style.left = left + 'px';
				obj.style.opacity = 0;
				obj.style.filter = 'alpha(opacity=0)';
				$(obj).stop().animate({
					opacity: 1
				}, 1000);
				break;
			    case 3:
				obj.style.top = getTotalH() + 'px';
				if(index%2){
				obj.style.left =-obj.offsetWidth + 'px';
				}else{
					obj.style.left = documentW+'px';	
				}
				// 从正中间过来
				$(obj).stop().animate({
					top: top,
					left: left
				},3000);
		}
		startNum = index; //更新索引
	}
	//请求数据
	function checkScrollStie() {
		//滚动条距离顶部的高度加上页面的高度
		var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
		var documentH = document.documentElement.clientHeight;
		return getLastH() < scrollTop + documentH ? true : false;

	}

	function getLastH() {
		var oParent = document.getElementById('main');
		var aPin = getClassObj(oParent, 'pin');
		//获得最后一个pin距离顶部的高度
		var lastPinH = aPin[aPin.length - 1].offsetTop + Math.floor(aPin[aPin.length - 1].offsetHeight / 2);
		return lastPinH;
	}

	function getTotalH() {
		var totalH = document.documentElement.scrollHeight || document.body.scrollHeight;
		return totalH;
	}
	//获取数组最小值的键值
	function getMinKey(arr, minH) {
		for(key in arr) {
			if(arr[key] == minH) {
				return key;
			}
		}
	}
	//通过class选择元素                父级          类名
	function getClassObj(parent, className) {
		var obj = parent.getElementsByTagName('*');
		var result = [];
		for(var i = 0; i < obj.length; i++) {
			if(obj[i].className == className) {
				result.push(obj[i]);
			}
		}
		return result;
	}