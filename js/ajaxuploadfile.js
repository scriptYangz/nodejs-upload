let http = require("http");
let url = require("url");
var formidable = require('formidable');
var fs = require('fs');
var user = require('./user');

let server = http.createServer(function(request, response) {

	response.writeHead(200, {
		'Content-Type': 'text/html;charset=utf-8',
		'Access-Control-Allow-Origin': '*',
		'Accept-Encoding': 'gzip, deflate, sdch'
	});

	var form = new formidable.IncomingForm();
	//		user.init(request, response)

	//初始化这个模块
	form.keepExtensions = true;
	form.uploadDir = "./tempdir";
	form.multiples = true;

	//			form.maxFieldsSize = 50 * 1024 * 1024;
	//参数设置 可以参考文档https: //github.com/felixge/node-formidable   里面设置相应参数  
	form.parse(request, function(err, fields, files) { //使用这个函数来获取文件  


                  
		if(files.file) {
			
			
			
			
			console.log()
		if(files.file.length==undefined){
			
			//这里可以使用两种方法来获取文件，1、nodejs是事件驱动机制，可以使用form.on("file",function(){})来处理。文件接收到触发事件  2、对接收文件进行遍历（本文使用）  
			for(var k in files) { //文件的重定向 存到服务器上  
				fs.rename(files[k].path, "./files/" + files[k].name); //很多文件的时候使用for in循环来进行遍历 此时 k是files对象的某个索引 或者是后面提到的FormData.append的名字  
			}
			
			
			
		}else{
			
			//这里可以使用两种方法来获取文件，1、nodejs是事件驱动机制，可以使用form.on("file",function(){})来处理。文件接收到触发事件  2、对接收文件进行遍历（本文使用）  
			for(var k in files.file) { //文件的重定向 存到服务器上  
				fs.rename(files.file[k].path, "./files/" + files.file[k].name); //很多文件的时候使用for in循环来进行遍历 此时 k是files对象的某个索引 或者是后面提到的FormData.append的名字  
			}
			
		}
			
			

			response.end(JSON.stringify({
				code: 1000,
				msg: "接受完成",
				data: files
			}));
            
		} else {
			
			
			user.init(request, response)
            return false;

		}

	});

})

console.log("服务器正在执行...")
server.listen(8080);