 function Router() {
     this.routes = {};
     this.path = "";
 }
 Router.prototype.route = function(path, callBack) {
     this.routes[path] = callback || function() {};
 }
 Router.prototype.refresh = function() {
     this.path = location.hash.slice(1) || "/";
     this.routes[this.path]();
 }

 Router.prototype.init = function() {
     var _this = this;
     window.addEventListener("load", function() {
         _this.refresh();
     }, false);
     window.onhashchange = function() {
         _this.refresh();
     }
 }