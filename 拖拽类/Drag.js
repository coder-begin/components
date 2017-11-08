function Drag(moveElem,rangeElem) {
	this.elem = moveElem;
	this.rElem=rangeElem;
	this.disX = 0;
	this.disY = 0;
}

Drag.prototype.mouseDown = function(ev) {

	var _this=this;
	_this.disX = ev.clientX - this.elem.offsetLeft;
	_this.disY = ev.clientY - this.elem.offsetTop;
	
	if(_this.setCapture){
		_this.elem.setCapture();
	}
	
	document.onmousemove = function(ev) {
		var ev = ev || window.event;
		_this.mouseMove(ev)
	}
	document.onmouseup=function(){
		_this.mouseUp();
	}
}

Drag.prototype.mouseMove = function(ev) {
	var  L=ev.clientX-this.disX;
	var  T=ev.clientY-this.disY;
	var pWidth=this.rElem.offsetWidth,
		pHeight=this.rElem.offsetHeight,
		mWidth=this.elem.offsetWidth,
		mHeight=this.elem.offsetHeight;
	
	if(L<0){
		L=0;
	}else if(L>pWidth-mWidth){
		L=pWidth-mWidth;
	}
	if(T<0){
		T=0;
	}else if(T>pHeight-mHeight){
		
		T=pHeight-mHeight;
	}
	
	
	this.elem.style.left=L+"px";
	this.elem.style.top=T+"px";
		
}

Drag.prototype.mouseUp = function() {
	
	document.onmousemove = document.onmouseup = null;
	if(this.releaseCapture){
		this.releaseCapture();
	}
}

Drag.prototype.init = function() {
	var _this = this;
	
	_this.elem.onmousedown = function(ev) {
		var ev = ev || window.event;
		_this.mouseDown(ev);
		return false;
	}

}


//工具方法
//获取样式
Drag.getStyle=function(obj,attr){
	
	return obj.currentStyle?obj.currentStyle[attr]:window.getComputedStyle(obj,false)[attr];
	
}


//实现继承
Drag.extend=function(childObj,parentObj){
	
	for(var attr in parentObj){
		childObj[attr]=parentObj[attr];
		
	}
	
}



