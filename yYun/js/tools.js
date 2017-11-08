tools = (function() {

    function jsonp(path, fnName, context) {
        var oScript = document.createElement("script");
        oScript.src = path;
        document.getElementsByTagName("head")[0].appendChild(oScript);
        oScript.onload = function() {
            fnName.call(context, fileDir);
        }
    }

    function getXHR() {
        if (typeof XMLHttpRequest != undefined) {
            return new XMLHttpRequest();
        } else if (typeof ActiveXObject != undefined) {
            return new ActiveXObject("MSXML2.XMLHttp");
        } else {
            throw new Error("getXHR error");
        }

    }


    function get(path, fn, sendMsg) {
        var xhr = getXHR();
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
                    fn(xhr.responseText);
                }
            }
        };
        xhr.open("get", path, true);
        xhr.send(sendMsg);

    }

    function sortByDate(data) {

    	
    	
    }
    return {
        jsonp: jsonp,
        get: get,
    }

})();