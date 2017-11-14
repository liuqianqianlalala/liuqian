// 封装函数，实现根据id、标签、类名查找元素
// 参数：
//		selector : 选择器，如：#id, .className, element
//		context : 查询上下文环境，可选参数，表示一个具体的DOM对象
// 返回值：
//		返回满足条件的结果
function $(selector, context){
	context = context || document; // 默认查询上下文为 document
	if (selector.indexOf("#") === 0) // id
		return document.getElementById(selector.slice(1));
	if (selector.indexOf(".") === 0) // className
		return getElementsByClassName(selector.slice(1), context);
	return context.getElementsByTagName(selector);
}

// 解决 getElementsByClassName() 方法兼容问题
// 参数：
// 		className : 类名
//		context : 查询上下文环境，可选参数，表示一个具体的DOM对象
// 返回值：
//		返回根据类名查找的结果
function getElementsByClassName(className, context) {
	context = context || document;
	// 判断浏览器是否支持使用 getElementsByClassName()
	if (context.getElementsByClassName) // 支持
		return context.getElementsByClassName(className);

	/* 不支持 */
	var result = []; // 保存查找到结果的数组
	// 查找在查询上下文后代中所有的元素
	var allElements = context.getElementsByTagName("*");
	// 遍历所有元素
	for (var i = 0, len = allElements.length; i < len; i++) {
		// 判断当前遍历到的元素类名中是否存在待查找的类名
		var classNames = allElements[i].className.split(" ");
		if (inArray(className, classNames) !== -1) // 存在
			result.push(allElements[i]);
	}
	// 返回查找结果
	return result;
}

// 判断给定的某个值是否在数组中存在，存在则返回其下标，不存在返回-1
// 参数：
//		value : 待查找判断的值
//		array : 数组
// 返回值：
//		数组中的下标，-1表示不存在
function inArray(value, array) {
	if (Array.prototype.indexOf) // 支持使用数组的 indexOf() 方法
		return array.indexOf(value);
	// 不支持使用 indexOf()
	for (var i = 0, len = array.length; i < len; i++) {
		if (array[i] === value)
			return i;
	}
	return -1;
}

// 封装函数，获取/设置CSS样式
// 使用 css(element, "width") -- 获取 element元素的 width 属性值
// 使用 css(element, "width", "100px") -- 设置 element 元素的 width 属性值为 100px(只设置一个属性)
// 使用 css(element, {width:"100px", height:"100px"}) -- 设置 element 元素的多个CSS属性，属性名与属性值使用对象表示
// 参数：
//		element : DOM元素对象
//		attr : CSS属性名
//		value : CSS属性值，可选，不传表示获取CSS，传递表示设置CSS
// 返回值：
//		查找到的CSS属性值
function css(element, attr, value) {
	// 获取
	if (typeof attr === "string" && typeof value === "undefined")
		return window.getComputedStyle 
				? getComputedStyle(element)[attr] 
				: element.currentStyle[attr];
	// 设置
	if (typeof attr === "string" && value){
		element.style[attr] = value;
	} else if (typeof attr === "object") {
		for (var prop in attr) {
			element.style[prop] = attr[prop];
		}
	}
}

// 显示 element 元素
function show(element) {
	element.style.display = "block";
}

// 隐藏 element 元素
function hide(element) {
	element.style.display = "none";
}

// 注册事件监听
function on(element, type, callback) {
	if (element.addEventListener) { // 支持使用 addEventListener
		if (type.indexOf("on") === 0)
			type = type.slice(2);
		element.addEventListener(type, callback, false);
	} else { // 不支持使用 addEventListener
		if (type.indexOf("on") !== 0)
			type = "on" + type;
		element.attachEvent(type, callback);
	}
}

// 解除事件监听
function off(element, type, callback) {
	if (element.removeEventListener) { // 支持使用 removeEventListener
		if (type.indexOf("on") === 0)
			type = type.slice(2);
		element.removeEventListener(type, callback, false);
	} else { // 不支持使用 removeEventListener
		if (type.indexOf("on") !== 0)
			type = "on" + type;
		element.detachEvent(type, callback);
	}
}

// 获取/设置指定元素在文档中的定位坐标
// 参数：
//		element : DOM 元素
//		coordinate : 坐标，可选参数，传递时表示设置元素在文档中的坐标
function offset(element, coordinate) {
	if (typeof coordinate === "undefined") { // 获取
		var _top = 0, _left = 0;
		while(element) {
			_top += element.offsetTop;
			_left += element.offsetLeft;
			element = element.offsetParent;
		}

		return {
			top : _top,
			left : _left
		};
	}
	
	// 设置
	// 先查找父元素在文档中坐标
	var _top = 0, _left = 0, currentElement = element.offsetParent;
	while(currentElement) {
		_top += currentElement.offsetTop;
		_left += currentElement.offsetLeft;
		currentElement = currentElement.offsetParent;
	}
	// 计算当前元素在文档中定位换算为距其有定位父元素坐标系中的位置
	css(element, {
		top : coordinate.top - _top + "px",
		left : coordinate.left - _left + "px"
	});
}

// 解决 event.pageX/event.pageY 兼容问题
function page(e) {
	var _x = e.pageX || (e.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft)),
		_y = e.pageY || (e.clientY + (document.documentElement.scrollTop || document.body.scrollTop));
	return {
		x : _x,
		y : _y
	}
}

// 封装操作 cookie 的函数：获取/设置 cookie
// 参数：
//		key : cookie 名
//		value : cookie 值，可选，不传递表示读取cookie
//		options : 可配置项  {expires:7, path:"/", domain:"", secure:true}
function cookie(key, value, options){
	// 读取
	if (typeof value === "undefined") {
		var cookies = document.cookie.split("; ");
		for (var i = 0, len = cookies.length; i < len; i++) {
			var cookie = cookies[i].split("=");
			var name = decodeURIComponent(cookie.shift());
			if (name === key)
				return decodeURIComponent(cookie.join("="));
		}

		return null;
	}

	// 保存
	// 基础 key=value 的结构
	var cookie = encodeURIComponent(key) + "=" + encodeURIComponent(value);
	// 判断是否有可配置项
	options = options || {};
	if (options.expires) { // 失效时间
		var date = new Date();
		date.setDate(date.getDate() + options.expires);
		cookie += ";expires=" + date.toUTCString();
	}
	if (options.path) // 路径 
		cookie += ";path=" + options.path;
	if (options.domain) // 域名
		cookie += ";domain=" + options.domain;
	if (options.secure) // 安全
		cookie += ";secure";

	document.cookie = cookie;
}

// 删除 cookie
function removeCookie(key, options) {
	options = options || {};
	options.expires = -1;
	cookie(key, "", options);
}

// 多属性运动框架
// 参数：
//		element: 待添加运动动画效果的元素
//		options: 对象，设置各多属性时的属性名与运动终值
//			options = {width:100, height:300, left:200, top: 800}
// 		speed: 运动总限时
//		fn: 可选，运动动画效果执行结束后再执行到的函数
function animate(element, options, speed, fn) {
	// 先停止元素上已有运动
	clearInterval(element.timer);

	// 遍历 options 对象中各属性，设置初始值与运动区间值
	// start = {width:100, height:100, left:100, top:50}
	// range = {width:0, height:200, left:100, top:750}
	var start = {}, range = {};
	for (var attr in options) {
		start[attr] = parseFloat(css(element, attr));
		range[attr] = options[attr] - start[attr];
	}

	// 记录运动起始时间
	var startTime = +new Date();
	// 启动运动动画计时器
	element.timer = setInterval(function(){
		// 计算运动已消耗时间
		var elapsed = Math.min(speed, new Date() - startTime);
		// 根据公式计算各属性当前步情况
		for (var attr in options) {
			// 计算遍历到的属性当前步情况
			var result = elapsed * range[attr] / speed + start[attr];
			// 设置CSS对应属性
			element.style[attr] = result + (attr === "opacity" ? "" : "px");
		}
		// 判断是否停止运动
		if (elapsed === speed) {
			clearInterval(element.timer);
			// 有传递运动结束后的函数参数，则调用
			fn && fn(); 
		}
	}, 1000/60);
}

// 淡入
function fadeIn(element, speed, fn) {
	show(element);
	element.style.opacity = 0;
	animate(element, {opacity:1}, speed, fn);
}

// 淡出
function fadeOut(element, speed, fn) {
	animate(element, {opacity:0}, speed, function(){
		hide(element);
		fn && fn();
	});
}

// 边框内部宽度 
function innerWidth(element) {
	var _display = css(element, "display");
	if (_display === "none") {
		return parseFloat(css(element, "width"))
		+ parseFloat(css(element, "paddingLeft"))
		+ parseFloat(css(element, "paddingRight"))
	}

	return element.clientWidth;
}

function innerHeight(element) {
	var _display = css(element, "display");
	if (_display === "none") {
		return parseFloat(css(element, "height"))
		+ parseFloat(css(element, "paddingTop"))
		+ parseFloat(css(element, "paddingBottom"))
	}

	return element.clientHeight;
}

// 边框及内部宽度 
function outerWidth(element) {
	var _display = css(element, "display");
	if (_display === "none") {
		return parseFloat(css(element, "width"))
		+ parseFloat(css(element, "paddingLeft"))
		+ parseFloat(css(element, "paddingRight"))
		+ parseFloat(css(element, "borderLeftWidth"))
		+ parseFloat(css(element, "borderRightWidth"))
	}

	return element.offsetWidth;
}

function outerHeight(element) {
	var _display = css(element, "display");
	if (_display === "none") {
		return parseFloat(css(element, "height"))
		+ parseFloat(css(element, "paddingTop"))
		+ parseFloat(css(element, "paddingBottom"))
		+ parseFloat(css(element, "borderTopWidth"))
		+ parseFloat(css(element, "borderBottomWidth"));
	}

	return element.offsetHeight;
}

// 封装 ajax 操作函数
// 参数：可配置对象
/*options = {
	type : "get", // 请求方式，get或post，默认为 get
	url : "", // 请求资源的URL
	data : {username:"xiaoming", age:15, address:"cd"}, // 向服务器传递的数据
	dataType : "json|text", // 预期从服务器返回数据的格式
	success : function(responseData){}, // 请求成功执行的函数
	error : function(xhr,errMsg){} // 请求失败执行的函数
}*/
function ajax(options) {
	var url = options.url; // 请求URL
	if (!url) // 没有请求的服务器资源URL
		return;
	var method = options.type || "get"; // 请求方式

	// 处理向服务器发送的数据
	// 创建查询字符串内容
	var queryString = null;
	if (options.data) {
		queryString = [];
		// 将 {username:"xiaoming", age:15, address:"cd"} 生成 username=xiaoming&age=15&address=cd
		for (var attr in options.data) {
			queryString.push(attr + "=" + options.data[attr]);
		}
		queryString = queryString.join("&");
	}
	// 是否向 URL 后串联查询字符串
	if (method == "get" && queryString) {
		url += "?" + queryString;
		queryString = null;
	}

	// 创建核心对象
	var xhr = new XMLHttpRequest();
	// 打开
	xhr.open(method, url, true);
	// 判断是否 post 请求
	if (method == "post")
		xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	// 发送
	xhr.send(queryString);
	// 处理响应
	xhr.onreadystatechange = function(){
		if (xhr.readyState === 4) {
			if (xhr.status === 200) {
				var data = xhr.responseText;
				// 判断预期从服务器返回数据的格式
				if (options.dataType == "json")
					data = JSON.parse(data);
				// 数据处理业务
				options.success && options.success(data);
			} else {
				options.error && options.error(xhr, xhr.statusText);
			}
		}
	}
}

// 处理 get 请求的 ajax 操作
function get(url, data, success, dataType) {
	ajax({
		type : "get",
		url : url,
		data : data,
		dataType : dataType,
		success : success
	});
}

function post(url, data, success, dataType) {
	ajax({
		type : "post",
		url : url,
		data : data,
		dataType : dataType,
		success : success
	});
}

// 明确返回数据格式为 json
function getJSON(url, data, success){
	ajax({
		type : "get",
		url : url,
		data : data,
		dataType : "json",
		success : success
	});
}

function intersect(rect1, rect2){
	return !(rect1.y > rect2.y + rect2.height 
			|| rect1.x > rect2.x + rect2.width
			|| rect1.y + rect1.height < rect2.y
			|| rect1.x + rect1.width < rect2.x);
}