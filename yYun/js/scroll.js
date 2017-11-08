function scrollBox(boxElem) {
    this.boxElem = boxElem;
    this.oContent = boxElem.children[0];
    this.oScrollF = boxElem.children[1];
    this.oScrollBar = boxElem.children[1].children[0];
    this.scale=0;
}
scrollBox.prototype.setConW = function() {
    //设置内容宽度
    var children = this.boxElem.children;
    var boxW = this.boxElem.offsetWidth;
    children[0].style.width = boxW - children[1].offsetWidth + "px";

}

//初始化拖动滚动
scrollBox.prototype.initScrollBar = function() {
    var _this = this;
    var scrollFrame = this.boxElem.children[1]; //滚动框
    var contentElem = this.boxElem.children[0]; //内容
    var scrollElem = scrollFrame.children[0]; //滚动条

    this.boxElem.style.height = document.documentElement.clientHeight - 182 + "px";
    scrollElem.style.height = this.boxElem.offsetHeight / contentElem.offsetHeight * scrollFrame.offsetHeight + "px";


    if (_this.boxElem.offsetHeight > contentElem.offsetHeight) {
        scrollFrame.style.display = "none";
        scrollBox.canmove = false;
    }



    //ie设置全局捕获
    if (scrollElem.setCapture) {
        scrollElem.setCapture();
    }

    scrollElem.onmousedown = function(ev) {
        var ev = ev || window.event;
        var disY = ev.clientY - this.offsetTop; //鼠标相对于滚动条位移
        var elemH = scrollElem.offsetHeight, //滚动条高度
            scrollFH = scrollFrame.offsetHeight, //滚动框高度
            contentH = contentElem.offsetHeight; //内容高度
        //滚动条和内容可滚动区域的比值
        var scale = (contentH - _this.boxElem.offsetHeight) / (scrollFH - elemH);




        document.onmousemove = function(ev) {
            var ev = ev || window.event;
            var currentY = ev.clientY - disY;

            //判断拖动滚动边界条件
            if (currentY < 0) {
                currentY = 0;
            }
            if (currentY > scrollFH - elemH) {
                currentY = scrollFH - elemH;
            }

            //设置拖动滚动
            scrollElem.style.top = currentY + "px";
            contentElem.style.marginTop = -(currentY * scale) + "px";
        }


        //
        document.onmouseup = function(ev) {
            //清除拖动事件
            document.onmousemove = document.onmouseup = null;

            //ie释放全局捕获
            if (scrollElem.releaseCapture) {
                scrollElem.releaseCapture();
            }

        }


        return false;
    }

}

//初始化滚动事件
scrollBox.prototype.scrollChange = function() {
    var _this = this;

    function whell(ev) {
        var oContent = _this.oContent, //内容
            oScrollBar = _this.oScrollBar, //滚动条
            canMoveDis = _this.oScrollF.offsetHeight - oScrollBar.offsetHeight, //滚动条可滚动区域
            contentH = oContent.offsetHeight, //内容高度
            contentCanMove = contentH - _this.boxElem.offsetHeight; //内容可滚动区域
            //滚动条和内容可滚动区域比值
            _this.scale = contentCanMove / canMoveDis;
        var scale=_this.scale;
        var eWhellDis = 5; //每次滚动距离
        if (scrollBox.canmove) {
            var ev = ev || window.event;
            var contentTop = parseFloat(scrollBox.getStyle(oContent, "marginTop").replace("px", "")); //内容区域marginTop
            var scrollBarTop = oScrollBar.offsetTop; //滚动条离上边界的距离
            var contentMDis, scrollBarMDis; //滚动条和内容滚动后离上边界的距离



            var dirFlag = true; //true代表向上滚动

            if (ev.wheelDelta) {
                dirFlag = ev.wheelDelta > 0 ? true : false;
            } else {
                //火狐的滚轮方向
                dirFlag = ev.detail < 0 ? true : false;
            }

            //兼容火狐的阻止默认行为
            if (_this.boxElem.addEventListener) {
                ev.preventDefault();
            }


            if (dirFlag) {

                //向上滚动
                contentMDis = contentTop + eWhellDis * scale;
                scrollBarMDi = scrollBarTop - eWhellDis;
                if (scrollBarMDi < 0) {
                    scrollBarMDi = 0;
                    contentMDis = 0;
                }
            } else {

                //向下滚动
                contentMDis = -eWhellDis * scale + contentTop
                scrollBarMDi = scrollBarTop + eWhellDis
                if (scrollBarMDi > canMoveDis) {
                    scrollBarMDi = canMoveDis;
                    contentMDis = -contentCanMove;
                }

            }
            oContent.style.marginTop = contentMDis + "px";

            oScrollBar.style.top = scrollBarMDi + "px";

            return false;

        }
    }
    this.boxElem.onmousewheel = whell;
    if (this.boxElem.addEventListener) {
        //兼容火狐
        this.boxElem.addEventListener("DOMMouseWhell", whell, false);
    }

}
scrollBox.prototype.init = function() {
    var _this = this;
    this.setConW();
    this.initScrollBar();
    this.scrollChange();
    window.addEventListener("resize", function() {

        _this.changeCPosY();

    }, false);

}
scrollBox.prototype.changeCPosY = function() {
    var scrollFrame = this.boxElem.children[1]; //滚动框
    var contentElem = this.boxElem.children[0]; //内容
    var scrollElem = scrollFrame.children[0]; //滚动条
    var cH = document.documentElement.clientHeight;
    var oSBarH=this.oScrollBar.offsetHeight,
        oSBarT=this.oScrollBar.offsetTop,
        oSFrameH=this.oScrollF.offsetHeight;
    var oCMarginTop=parseFloat(scrollBox.getStyle(contentElem,"marginTop"));

    this.boxElem.style.height = cH - 182 + "px";
    scrollElem.style.height = this.boxElem.offsetHeight / contentElem.offsetHeight * scrollFrame.offsetHeight + "px";


    this.boxElem.style.height = cH - 182 + "px";
    if (this.boxElem.offsetHeight < contentElem.offsetHeight) {
        scrollBox.canmove = true;
        scrollFrame.style.display = "block";
    } else {
        scrollBox.canmove = false;
        scrollFrame.style.display = "none";
    }
    if(oSBarH+oSBarT>oSFrameH){
        this.oScrollBar.style.top=oSBarT-(oSBarH+oSBarT-oSFrameH)+"px";
        this.oContent.style.marginTop=oCMarginTop+(oSBarH+oSBarT-oSFrameH)*this.scale+"px";
    }



}
scrollBox.canmove = true;
//工具方法，获取样式(在非内嵌样式下无法使用elem.style来获取样式)
scrollBox.getStyle = function(oElem, styleName) {


    return window.getComputedStyle ? window.getComputedStyle(oElem, null)[styleName] : oElem.currentStyle[styleName];


}

var oScrollElem = document.getElementById("y_frame");
var oSroll = new scrollBox(oScrollElem).init();