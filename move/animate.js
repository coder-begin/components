/**
 * 实现一个运动可以有两种方式:
 * 1.速度方式，就是一般的调用距离和速度挂钩
 * 2.时间方式，就是根据时间的流逝来实现运动距离的改变
 * 都一种方式有一个问题，就是在页面失去焦点的时候setInterval会放慢,如果里面
 * 又套了一层setInterval就会出问题，两个的时间就不会同步了，当然可以改进,就是在页面
 * 失去焦点的时候把定时器停下来。
 * 
 * 第二种方式就没有这个问题，虽然同样是setInterval来实现的定时，失去焦点的时候定时器都会被放缓
 * 但是因为是以时间为变量的，所以一旦切回来时间就是现在的时间，他会直接跳到现在时间的位置
 * 
 * @param {Object} elem
 * @param {Object} mMode
 * @param {Object} styles
 * @param {Object} times
 * @param {Object} fn
 */

(function(window) {

	function Move(elem) {
		//判断调用方式
		if(!(this instanceof Move)) {
			return new Move(elem);
		}
		this.elem = elem;
		this.animates = [];

	}
	Move.prototype.animate = function(mMode, styles, times, fn) {
			
		this.animates.push([mMode, styles, times, fn]);
		var _this = this;
		animate(_this.elem,mMode,styles,times,fn,this.animates);
		return this;
	}
	
	window.$ = Move;
})(window);

function animate(elem, mMode, styles, times, callBack, queueList) {
	//输入参数判断

	if(!animate.isElem(elem)) {
		throw new Error("第一个参数类型错误!");
	}
	if(animate.isString(mMode)) {
		if(!animate.isFunction(Tween[mMode])) {
			throw new Error("不支持的运动类型!");
		}
	} else {
		throw new Error("第二个参数类型错误!");
	}
	if(!animate.isObj(styles)) {
		throw new Error("第三个参数类型错误!");
	}
	if(!animate.isNumber(parseInt(times))) {
		throw new Error("第四个参数类型错误!");
	}
	if(!animate.isFunction(callBack)) {
		throw new Error("第五个参数类型错误!");
	}

	var beginStyles = {}; //存储出事样式
	var currentDate;




	//初始化需要变化的初始样式
	for(var styleName in styles) {
		beginStyles[styleName] = "";
	}
	//获取初始样式
	for(var name in beginStyles) {
		//判断透明度
		if(name == "opacity") {
			beginStyles[name] = parseFloat(animate.getStyle(elem, name));
		} else {
			beginStyles[name] = parseFloat(animate.getStyle(elem, name));
		}
	}

	//清理定时器
	clearInterval(elem.timer);

	//获取开始时间
	var beginDate = new Date().getTime();

	elem.timer = setInterval(function() {

		//计算每次运动的开始时间
		currentDate = Math.min((new Date().getTime()) - beginDate, times);
		for(var changeStyle in beginStyles) {
			var currentStyle = Tween[mMode](currentDate, beginStyles[changeStyle], styles[changeStyle] - beginStyles[changeStyle], times);

			//对透明度进行判断
			if(changeStyle == "opacity") {

				elem.style.opacity = currentStyle;
				elem.style.filter = "alpha(opacity=" + currentStyle * 100 + ")";

			} else {

				elem.style[changeStyle] = currentStyle + "px";

			}

		}
		if(currentDate == times) {
			queueList=queueList.slice(1);
			clearInterval(elem.timer);
			if(queueList.length>0){
				arguments.callee.apply(elem,queueList.shift())
			}
			
			callBack.call(elem);

		}

	}, 13);

	
}

//工具方法
animate.getStyle = function(elem, styleName) {

	if(elem.currentStyle) {
		return elem.currentStyle[styleName];
	} else {
		return window.getComputedStyle(elem, false)[styleName];
	}

}
animate.isString = function(arg) {

	if(Object.prototype.toString.call(arg) == "[object String]") {
		return true;
	} else {
		return false;
	}

}
animate.isFunction = function(arg) {

	if(Object.prototype.toString.call(arg) == "[object Function]") {
		return true;
	} else {
		return false;
	}
}
animate.isObj = function(arg) {

	if(Object.prototype.toString.call(arg) == "[object Object]") {
		return true;
	} else {
		return false;
	}
}

animate.isElem = function(arg) {

	if(arg.nodeType == 1) {
		return true;
	} else {
		return false;
	}

}
animate.isNumber = function(arg) {
	if(Object.prototype.toString.call(arg) == "[object Number]") {
		return true;
	} else {
		return false;
	}
}

//Tween算法
var Tween = {
	Linear: function(t, b, c, d) {
		return c * t / d + b;
	},

	easeIn: function(t, b, c, d) {
		return c * (t /= d) * t + b;
	},
	easeOut: function(t, b, c, d) {
		return -c * (t /= d) * (t - 2) + b;
	},
	easeInOut: function(t, b, c, d) {
		if((t /= d / 2) < 1) return c / 2 * t * t + b;
		return -c / 2 * ((--t) * (t - 2) - 1) + b;
	},

	Cubic: {
		easeIn: function(t, b, c, d) {
			return c * (t /= d) * t * t + b;
		},
		easeOut: function(t, b, c, d) {
			return c * ((t = t / d - 1) * t * t + 1) + b;
		},
		easeInOut: function(t, b, c, d) {
			if((t /= d / 2) < 1) return c / 2 * t * t * t + b;
			return c / 2 * ((t -= 2) * t * t + 2) + b;
		}
	},
	Quart: {
		easeIn: function(t, b, c, d) {
			return c * (t /= d) * t * t * t + b;
		},
		easeOut: function(t, b, c, d) {
			return -c * ((t = t / d - 1) * t * t * t - 1) + b;
		},
		easeInOut: function(t, b, c, d) {
			if((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
			return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
		}
	},
	Quint: {
		easeIn: function(t, b, c, d) {
			return c * (t /= d) * t * t * t * t + b;
		},
		easeOut: function(t, b, c, d) {
			return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
		},
		easeInOut: function(t, b, c, d) {
			if((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b;
			return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
		}
	},
	Sine: {
		easeIn: function(t, b, c, d) {
			return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
		},
		easeOut: function(t, b, c, d) {
			return c * Math.sin(t / d * (Math.PI / 2)) + b;
		},
		easeInOut: function(t, b, c, d) {
			return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
		}
	},
	Expo: {
		easeIn: function(t, b, c, d) {
			return(t == 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
		},
		easeOut: function(t, b, c, d) {
			return(t == d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
		},
		easeInOut: function(t, b, c, d) {
			if(t == 0) return b;
			if(t == d) return b + c;
			if((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
			return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
		}
	},
	Circ: {
		easeIn: function(t, b, c, d) {
			return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
		},
		easeOut: function(t, b, c, d) {
			return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
		},
		easeInOut: function(t, b, c, d) {
			if((t /= d / 2) < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
			return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
		}
	},
	Elastic: {
		easeIn: function(t, b, c, d, a, p) {
			if(t == 0) return b;
			if((t /= d) == 1) return b + c;
			if(!p) p = d * .3;
			if(!a || a < Math.abs(c)) {
				a = c;
				var s = p / 4;
			} else var s = p / (2 * Math.PI) * Math.asin(c / a);
			return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
		},
		easeOut: function(t, b, c, d, a, p) {
			if(t == 0) return b;
			if((t /= d) == 1) return b + c;
			if(!p) p = d * .3;
			if(!a || a < Math.abs(c)) {
				a = c;
				var s = p / 4;
			} else var s = p / (2 * Math.PI) * Math.asin(c / a);
			return(a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b);
		},
		easeInOut: function(t, b, c, d, a, p) {
			if(t == 0) return b;
			if((t /= d / 2) == 2) return b + c;
			if(!p) p = d * (.3 * 1.5);
			if(!a || a < Math.abs(c)) {
				a = c;
				var s = p / 4;
			} else var s = p / (2 * Math.PI) * Math.asin(c / a);
			if(t < 1) return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
			return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
		}
	},
	Back: {
		easeIn: function(t, b, c, d, s) {
			if(s == undefined) s = 1.70158;
			return c * (t /= d) * t * ((s + 1) * t - s) + b;
		},
		easeOut: function(t, b, c, d, s) {
			if(s == undefined) s = 1.70158;
			return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
		},
		easeInOut: function(t, b, c, d, s) {
			if(s == undefined) s = 1.70158;
			if((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
			return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
		}
	},
	Bounce: {
		easeIn: function(t, b, c, d) {
			return c - Tween.Bounce.easeOut(d - t, 0, c, d) + b;
		},
		easeOut: function(t, b, c, d) {
			if((t /= d) < (1 / 2.75)) {
				return c * (7.5625 * t * t) + b;
			} else if(t < (2 / 2.75)) {
				return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
			} else if(t < (2.5 / 2.75)) {
				return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
			} else {
				return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
			}
		},
		easeInOut: function(t, b, c, d) {
			if(t < d / 2) return Tween.Bounce.easeIn(t * 2, 0, c, d) * .5 + b;
			else return Tween.Bounce.easeOut(t * 2 - d, 0, c, d) * .5 + c * .5 + b;
		}
	}
};

//实现数据缓存
 function Data(){
 	
 	
 	//缓存存储
 	this.cache=[];
 	
 	//冻结一些节点的数据缓存
 	Object.defineProperty(this.cache,0,{
 		
 		get:function(){
 			return {};
 		}
 	})
 	
 	//生成每个元素对应的id
 	this.onlyFlag=Math.random()
		
 }
 
 //判定绑定的元素或者对象是否可以被设置值
 Data.accept=function(elem){
 	//只接受非节点对象和节点对象中的元素和文档对象
 	return elem.nodeType?elem.nodeType==1||eldm.nodeType==9:true;
 	
 }
 Data.id=1;
 Data.prototype={
 	//绑定构造函数
 	constructor:Data,
 	//为元素设置唯一id
 	key:function(elem){
 		var _this=this;
 		//如果是不可接受的参数，返回0，表示要冻结这个数据
 		if(!Data.accept(elem)){
 			return 0;
 		}
 		
 		//获取设置的id
 		onlyId=elem[this.onlyFlag];
 		
 		//需要设置的唯一属性
 		var onlyAttr={}
 		
 		
 		//如果不存在这个id就设置
 		if(!onlyId){
 			onlyId=Data.id++;
 			onlyAttr[this.onlyFlag]={value: onlyId};
 			try{
 				//这是不可被更改的属性
 				Object.defineProperties(elem,onlyAttr);
 				
 			}catch(e){
 				//这个是可以被更改的
 				
 				elem[_this.onlyFlag]=onlyId;
 			}
 			
 		}
 		
 		//查看是否有这个元素的缓存，没有就新建一个
 		if(!this.cache[onlyId]){
 			
 			this.cache[onlyId]={};
 		}
 		
 		return onlyId;
 		
 	},
 	
 	set:function(elem,dataName,value){
 		
 		var onlyID=this.key(elem),
 			cache=this.cache[onlyID];
 			
 		//向元素所对应的缓存中存数据
 		if(typeof dataName == "string"){
 			cache[dataName]=value;
 		}else if(util.isObj(dataName)){
 			//当传入的是一个对象的时候
 			for(var index in dataName){
 				cache[index]=dataName[index];
 			}
 			
 		}else{
 			
 			throw new Erroe("error param");
 		}
 		
 		
 		return cache;
 	},
 	get:function(elem,key){
 		//以元素为参照获取数据
 		var data=this.cache[this.key(elem)];

 		//如果没有key这个参数就返回所有值
 		//如果有key就返回指定的值
 		return key==undefined?data:data[key];
 		
 		
 	},
 	data:function(elem,data,value){
 		var stored=null;	
 		if(data==undefined||(data&&typeof data =="string")&&value==undefined){
 			
 			stored=this.get(elem,data);
 			
 			return stored;
 		}
 		
 		this.set(elem,data,value);
		
 		return value!==undefined?value:data;
 		
 		
 	},
 	remove:function(elem,data){
 		var onlyId=this.key(elem);
   			cache=this.cache[onlyId];
   			
 		if(data===undefined){
 			//如果没有第二个参数就清空元素上绑定的所有数据
 			this.cache[onlyID]={};
 			
 		}else if(util.isArray(data)){
 			//若果第二个参数传的数组就删除数组中的值
 			
 			for(var i =0 ;i<data.length;i++){
 				if(this.cache[onlyId][data[i]]){
 					delete this.cache[onlyId][data[i]];
 				}
 			}
 			
 			
 		}else if(typeof data == "string"){
 			
 			delete this.cache[onlyId][data];
 			
 		}else{
 			throw new Error("param error");
 		}
 		
 		
 			
 		
 		
 	}
 	
 	
 	
 	
 }
 
 


//工具方法
var util={
	getStyle:function(elem, styleName) {

		if(elem.currentStyle) {
			return elem.currentStyle[styleName];
		} else {
			return window.getComputedStyle(elem, false)[styleName];
		}

	},
	isString:function(arg) {

		if(Object.prototype.toString.call(arg) == "[object String]") {
			return true;
		} else {
			return false;
		}

	},
	isFunction:function(arg) {

		if(Object.prototype.toString.call(arg) == "[object Function]") {
			return true;
		} else {
			return false;
		}
	},
	isObj:function(arg) {

		if(Object.prototype.toString.call(arg) == "[object Object]") {
			return true;
		} else {
			return false;
		}
	},
	isElem:function(arg) {

		if(arg.nodeType == 1) {
			return true;
		} else {
			return false;
		}

	},
	isNumber: function(arg) {
		if(Object.prototype.toString.call(arg) == "[object Number]") {
			return true;
		} else {
			return false;
		}
	},
	isArray:function(arg){
		
		if(Object.prototype.toString.call(arg) == "[object Array]") {
			return true;
		} else {
			return false;
		}
	}
	
	
}
