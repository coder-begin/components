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
	}
	
	
}
