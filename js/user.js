function user(req,res,config){ 
    var path=require('path');   
    var fs=require('fs');
    var multiparty = require('multiparty');//文件上传模块
    var async = require('async');//异步模块
    var form = new multiparty.Form();//新建表单

    //设置编辑
    form.encoding = 'utf-8';
    //设置文件存储路径
    form.uploadDir = "files/";
    //设置单文件大小限制
   // form.maxFilesSize = 200 * 1024 * 1024;
    /*form.parse表单解析函数，fields是生成数组用获传过参数，files是bolb文件名称和路径*/
    form.parse(req, function (err,fields,files) {
        
        console.log("文件名："+files.fu_UploadFile[0].originalFilename)
        console.log("文件大小："+files.fu_UploadFile[0].size)
        
         var name=files.fu_UploadFile[0].originalFilename;//文件名称
         var url='files/'+name;//临时bolb文件新名字
         fs.renameSync(files.fu_UploadFile[0].path,url);//修改临时文件名字

         var pathname='files/'+name;//上传文件存放位置和名称
         	
         	
         	
                /*
                                                          检查文件是存在，如果存在，重新设置名称
                */
                fs.access(pathname,fs.F_OK,(err) => {
                      
                    	console.log("接收完成")
                        myDate=Date.now();
                        pathname='tempdir/'+myDate+name;
                    
                });
                
                
                
                
                
                
                
                
                //这里定时，是做异步串行，等上执行完后，再执行下面
                setTimeout(function(){
                    /*进行合并文件，先创建可写流，再把所有BOLB文件读出来,流入可写流，生成文件
                        fs.createWriteStream创建可写流   
                        aname是存放所有生成bolb文件路径数组:
                        ['Uploads/img/3G.rar1','Uploads/img/3G.rar2',...]
                    */
                    var writeStream=fs.createWriteStream(pathname);
                    var aname=[];
                    var url='tempdir/'+myDate+name;
                    aname.push(url);
                    

                    //async.eachLimit进行同步处理
                    async.eachLimit(aname,1,function(item,callback){
                        //item 当前路径， callback为回调函数
                        fs.readFile(item,function(err,data){    
                           if(err)throw err;
                           //把数据写入流里
                            writeStream.write(data);
                            //删除生成临时bolb文件              
                            fs.unlink(item,function(){console.log('finish');})
                            callback();
                        });
                    },function(err){
                        if (err) throw err;
                        //后面文件写完，关闭可写流文件，文件已经成生完成
                        writeStream.end();
                        //返回给客服端，上传成功
                        var data=JSON.stringify({'code':0,'msg':'上传成功'});
                        res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'}); 
                        res.end(data);//返回数据    
                    });
                },3000);
    });
    return user;
}; 
exports.init = user;
