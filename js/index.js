function Lunbo(options){
		options = options || {};
		this.imgs = options.imgs;
		this.container = options.container;
		this.width = options.width;
		this.height = options.height;
		this.BoxImgs = [];
		this.circles = null;
		this.currentIndex = 0;
		this.nextIndex =1;
		this.timer = null;	
		
		this.init();
}


Lunbo.prototype = {
	constructor : Lunbo,
	init:function(){
		var _container = document.createElement("div");
		_container.className = "lb_container";
		css(_container,{
			width:this.width+"px",
			height:this.height +"px"
		})
		var _ul = document.createElement("ul");
		css(_ul,{
			width : this.width +"px",
			height :this.height +"px"
		})
		//创建LI
		for(var i=0,len = this.imgs.length;i<len;i++){
			var _img = this.imgs[i];
				_li = document.createElement("li");				
			_li.innerHTML = "<a href='"+ _img.href+"'target='_blank'><img src='"+_img.src+"'></a>";
			if (i === 0)
				show(_li);
			_ul.appendChild(_li);
			//将当前创作的li元素保存到BoxImg数组中
			this.BoxImgs.push(_li);
		}
		_container.appendChild(_ul);
	
		
		//创建左侧img盒子
		var _pages = document.createElement("div");
		_pages.className = "pages";
		
//		css(_pages,{width:this.width+"px"});
		for(var i = 0;i < len; i++){
			var _img = this.imgs[i];			
			_pages.innerHTML +="<img src='"+_img.src+"' class ='"+(i===0?"current":"") +"'>"
		}
		this.circles = $("img",_pages);//保存所有小圆点到对象属性中
		_container.appendChild(_pages);
		//上一页 下一页
		var _prev = document.createElement("div");
		_prev.className = "prev";
		_prev.innerText = "<";
		var _next = document.createElement("div");
		_next.className = "next";
		_next.innerText = ">";
		_container.appendChild(_prev);
		_container.appendChild(_next);
	
		//将当前轮播图结构布局添加到页面容器中
		this.container.appendChild(_container);
		
		//自动轮播
		var cb = this.move.bind(this);
		this.timer = setInterval(cb,2000);
		
		//移入、移出容器，停止、启动自动轮播
		on(_container,"mouseenter", ()=>{
			this.over();			
		});
		on(_container,"mouseleave", ()=>{
			this.out();						
		});
		
		//点击左侧小盒子切换，事件委派
		on(_pages,"click",(e)=>{
			e = e || event;
			var src = e.target || e.srcElement;			
			if(src !== _pages){
				var index = inArray(src, Array.from(this.circles));
//				console.log(this.circles)
//				console.log(_pages.getElementsByTagName("img"))
				if(this.currentIndex!==index){
					this.nextIndex = index;
					this.move();
				}
			}
		});		
		on(_prev, "click", () => {
			this.nextIndex = this.currentIndex - 1;
			if (this.nextIndex < 0)
				this.nextIndex = this.BoxImgs.length - 1;
			this.move();
		});
		on(_next, "click", () => {
			this.move();
		});
	},	
	move : function(){
		fadeOut(this.BoxImgs[this.currentIndex], 500);		
//		console.log(this.BoxImgs[this.currentIndex])
		fadeIn(this.BoxImgs[this.nextIndex], 500);
		
		this.circles[this.currentIndex].className = "";		
		this.circles[this.nextIndex].className = "current";		
		this.currentIndex = this.nextIndex;
		this.nextIndex++;
		if (this.nextIndex >= this.BoxImgs.length)
			this.nextIndex = 0;
	},
	over :function(){
		clearInterval(this.timer);
	},
	out :function(){
		this.timer = setInterval(this.move.bind(this),1500);
	}
}
	