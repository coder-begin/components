var express = require('express');

var app = express();
app.use(express.static(__dirname));
var fs=require("fs");


app.get("/server.js",function(req,res) {
   console.log(req.query.callback)
    if(req.query.callback){
      res.send(req.query.callback+"("+1561616+")");

    }
  
})
app.get('/', function (req, res) {
  
  	fs.open("./index.html","r",function(err) {

  			if(!err){

  				fs.readFile("./index.html", null, function(error,data) {

  					if(!error){
  						res.send(data.toString());
  					}else{

  						console.log("读取文件失败");

  					}

  				});

  			}else{
  				console.log("打开文件失败");
  			}

  	})
	
  
});






var server = app.listen(3000, function () {
	var host = server.address().address;
	var port = server.address().port;
  	console.log(port);
});