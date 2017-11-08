(function() {
    function Bdy(sideFooter, sideNav, oBtnOffLine, oMask, oContent) {
        this.sideFooter = sideFooter;
        this.sideNav = sideNav;
        this.btnOffLine = oBtnOffLine;
        this.oMask = oMask;
        this.oMaskCloseBtn = null;
        this.oContent = oContent;
        this.data = null;
        this.yContent = Bdy.getByCName("y_file", oContent)[0];
        this.oFileNum = document.getElementById("fileNum");
        this.oSelAll = document.getElementById("selAll");
        this.selectAll = false;
        this.newFolder = document.getElementById("newFolder");
    }
    Bdy.prototype.setBody = function() {
        var bHeight = document.documentElement.clientHeight,
            bWidth = document.documentElement.clientWidth;
        Bdy.getByCName("main", document)[0].style.height = bHeight - 62 + "px";

    }
    Bdy.prototype.setSide = function() {
        var sideFooter = this.sideFooter;
        var sideNav = this.sideNav;
        var wHeight = document.documentElement.clientHeight;

        if (sideNav.offsetHeight + 62 + sideFooter.offsetHeight + 62 > wHeight) {
            sideFooter.style.position = "static";
            sideFooter.style.marginTop = "50px";
        } else {
            sideFooter.style.position = "absolute";
            sideFooter.style.marginTop = "0";
        }

    }

    Bdy.prototype.stopRClick = function(ev) {
        if (ev.which == 3) {
            Bdy.showRCContent(ev.clientLeft, ev.clientY);
        }
        if (ev.which == 2 || ev.which == 3) {
            ev.cancelBubble = true
            ev.returnValue = false;
            return false;
        }


    }

    Bdy.prototype.addMaskContent = function(width, height) {
        var _this = this;
        var oDiv = document.createElement("div");
        var maskCStr =
            "<div class='maskContent' style='width:" + width + "px;height:" + height + "px;margin-top:" + (-height / 2) + "px;margin-left:" + (-width / 2) + "px'>\
            <div class='maskCTop clear'>\
                <div class='fl'>离线下载任务列表</div>\
                <div class='fr btnClose'>+</div>\
            </div>\
        </div>"

        this.oMask.style.display = "block";
        this.oMask.innerHTML = maskCStr;
        this.oMaskCloseBtn = Bdy.getByCName("btnClose", this.oMask)[0];
        this.oMaskCloseBtn.onclick = function(argument) {
            _this.oMask.style.display = "none";
        }
    }
    Bdy.prototype.setLevFile = function(data, path) {
        var _this = this;
        var htmlStr = "";
        var pathStr = "";
        var aPath = "#";
        var hashArr = Bdy.parseUrlToArr(path);
        for (var i = 0; i < data.length; i++) {
            if (data[i].fileType == "folder") {
                if (path == "/") {
                    path = path + data[i].fileName;
                } else {
                    path = path + "/" + data[i].fileName;
                }
            }
            htmlStr +=
                "<li class='clear'>\
            <div class='fl w60 fileName'>\
                <input type='checkbox'>\
                <i class='" + data[i].fileType + "'></i>\
                <a href='#" + path + "' class='verC fileClick'>" + data[i].fileName + "</a>\
            </div>\
            <div class='fl w15 fileSize'>\
                " + data[i].fileSize + "MB" + "\
            </div>\
            <div class='fl w25 fileChangeDate'>\
                " + data[i].date + "\
            </div>\
        </li>"
        }



        if (hashArr.length > 0) {
            var backStr = "#";

            for (var k = 0; k < hashArr.length - 1; k++) {
                backStr = backStr + "/" + hashArr[k];
            }
            pathStr = "<a style='color:skyblue' href='" + backStr + "'>返回上级  |</a>"


            for (var j = 0; j < hashArr.length; j++) {
                aPath = aPath + "/" + hashArr[j];
                if (j == hashArr.length - 1) {
                    pathStr += "<a>" + hashArr[j] + "</a>"
                } else {

                    pathStr += "<a style='color:skyblue' href='" + aPath + "'>" + hashArr[j] + " ></a>"

                }

            }
        } else {
            pathStr = "<a href='#/'>全部文件</a>";
        }

        this.yContent.innerHTML = htmlStr;
        $(".filePath").html(pathStr);
    }
    Bdy.prototype.getData = function() {
        var hash = window.location.hash.slice(1) || "/";
        var data = this.data;
        var hashArr = Bdy.parseUrlToArr(hash);

        function ergodic(cArr, pathArr, index) {
            for (var i = 0; i < cArr.length; i++) {
                if (cArr[i].fileName == pathArr[index]) {
                    if (index == pathArr.length - 1) {
                        data = cArr[i].children;
                        return;
                    }
                    ergodic(cArr[i].children, pathArr, ++index);
                }
            }
        }

        if (hashArr.length !== 0) {
            ergodic(data, hashArr, 0);
        }

        return [data, hash];
    }


    Bdy.prototype.init = function() {
        var _this = this;
        _this.setBody();
        _this.setSide();
        window.addEventListener("resize", function() {
            _this.setBody();
            _this.setSide();

        }, false);
        _this.btnOffLine.onclick = function() {

            _this.addMaskContent(620, 354);

        }
        _this.oContent.oncontextmenu = function(ev) {
            var ev = ev || window.event;
            ev.cancelBubble = true
            ev.returnValue = false;
            return false;
        }
        _this.oContent.onmousedown = function(ev) {
            var ev = ev || window.event;
            _this.stopRClick(ev);


        }

        window.onhashchange = function() {

            _this.setLevFile.apply(_this, _this.getData());

        }
        _this.oSelAll.onclick = function(argument) {

            _this.selectAll = !_this.selectAll;
            $(".y_file input[type=checkbox]").each(function() {
                this.checked = _this.selectAll;
            })

        }

        _this.newFolder.onclick = function() {

            _this.addNewFolder();

        }


        tools.jsonp("./infos.js", Bdy.dealInfos, oBdy); //初始化数据




    }
    Bdy.prototype.addInfos=function(path) {
        var _this=this;
        var date=new Date();

        var pathArr=Bdy.parseUrlToArr(path.slice(1));
        var newFInfos={
            "fileType":"folder",
            "fileName":pathArr[pathArr.length-1],
            "level":pathArr.length-1,
            "fileSize":"...",
            "date":date.getFullYear()+"."+(date.getMonth()+1)+"."+date.getDate(),
            "children":[]
        }
        function searchPos(data,pathArr,index){
            for(var i=0;i<data.length;i++){
                if(data[i].fileName==pathArr[index]){
                    if(index==pathArr.length-2){
                        data[i].children.push(newFInfos);
                        return;
                    }
                    searchPos(data[i].children,pathArr,++index);
                }
            }
        }
        
        searchPos(_this.data,pathArr,0);

    }
    Bdy.prototype.addNewFolder = function() {
        var _this=this;
        var date = new Date();
        var oLi = document.createElement("li"),
            oDiv1 = document.createElement("div"),
            oDiv2 = document.createElement("div"),
            oDiv3 = document.createElement("div"),
            oCheckBox = document.createElement("input"),
            oInputText = document.createElement("input"),
            oI = document.createElement("li"),
            oBtnOk = document.createElement("input"),
            oBtnClose = document.createElement("input");



        oLi.className = "clear";
        
        oDiv1.className = "fl w60 fileName";

        oDiv2.className = "fl w15 fileSize";
        oDiv2.innerHTML = "...";

        oDiv3.className = "fl w25 fileChangeDate";
        oDiv3.innerHTML = date.getFullYear() + "." + (date.getMonth() + 1) + "." + date.getDate();

        oI.className = "folder";

        oInputText.id="newInput";
        oInputText.className = "newFolderText";
        oInputText.value = "新建文件夹";
        oInputText.type = "text";

        oCheckBox.type = "checkbox";

        oBtnOk.id="btnOk";
        oBtnOk.type = "button"
        oBtnOk.className = "btnSmall btnOk";
        oBtnOk.onclick=function() {

            var oNewInput=document.getElementById("newInput");
            var oBtnOk=document.getElementById("btnOk");
            var oBtnClose=document.getElementById("btnClose");
            var path="#";
            oBtnClose.onclick=null;
            oBtnOk.onclick=null;
            var oA=document.createElement("a");
            oA.className="verC fileClick";
            oA.innerHTML=oNewInput.value;
            var hash=window.location.hash.slice(1)||"/";
            if(hash=="/"){
                 path=path+hash+oNewInput.value;
            }else{
                path=path+hash+"/"+oNewInput.value;
            }
            oA.href=path;
             _this.addInfos(path);
            _this.yContent.firstChild.firstChild.removeChild(oBtnOk);
            _this.yContent.firstChild.firstChild.removeChild(oBtnClose);    
            _this.yContent.firstChild.firstChild.removeChild(oNewInput);    
            _this.yContent.firstChild.firstChild.appendChild(oA);


        }

        oBtnClose.type = "button";
        oBtnClose.className = "btnSmall btnClose";
        oBtnClose.id="btnClose";



        oDiv1.appendChild(oCheckBox);
        oDiv1.appendChild(oI);
        oDiv1.appendChild(oInputText);
        oDiv1.appendChild(oBtnOk);
        oDiv1.appendChild(oBtnClose);


        oLi.appendChild(oDiv1);
        oLi.appendChild(oDiv2);
        oLi.appendChild(oDiv3);

        this.yContent.insertBefore(oLi,this.yContent.firstChild);

    }
    Bdy.parseUrlToArr = function(url) {
        var hashs = url.split("/");
        var hashArr = [];

        for (var i = 0; i < hashs.length; i++) {
            if (hashs[i] !== "") {
                hashArr.push(hashs[i]);
            }
        }
        return hashArr;
    }


    Bdy.showRCContent = function(posX, posY) {
        var mouseX = posX - 194;
        var mouseY = posY - 113;
    }
    Bdy.getByCName = function(className, context) {
        var allElem = context.getElementsByTagName("*");
        var selElem = [];
        for (var i = 0, j = allElem.length; i < j; i++) {
            if (allElem[i].className.search(className) != -1) {
                selElem.push(allElem[i]);
            }

        }
        return selElem;
    }
    Bdy.dealInfos = function(data) {
        this.data = data;
        var path = location.hash.slice(1) || "/";

        this.setLevFile.apply(this, this.getData());

    }

    var sNav = Bdy.getByCName("side_nav", document)[0];
    var sFooter = Bdy.getByCName("side_footer", document)[0];
    var oBtnOffLine = document.getElementById("offline_download");
    var oMask = Bdy.getByCName("mask", document)[0];
    var oContent = Bdy.getByCName("content", document)[0];

    var oBdy = new Bdy(sFooter, sNav, oBtnOffLine, oMask, oContent);
    oBdy.init();





})()