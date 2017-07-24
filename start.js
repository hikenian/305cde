//include all the required module

var http = require('http');
var url = require('url');
var fs = require('fs');
var qs = require('querystring');
var mongodb = require("mongodb");
var MongoClient = require("mongodb").MongoClient;
var mongodbServer = new mongodb.Server("localhost", 27017, { auto_reconnect: true, poolSize: 10 });
var db = new mongodb.Db("dataB", mongodbServer);

//By default, maximum 10 listeners for single event, set to 100 to prevent memory leaked

require("events").EventEmitter.prototype._maxListeners = 100;

var host = 'test-nodejs-h1ken641951.codeanyapp.com';
var port = 3333;
var obj ={};

var server = http.createServer(function(request,response){
	
	//Process http POST method request
	
  if (request.method == 'POST') {
    var body = '';
    var post = '';
    var msg = '';

    request.on('data', function (data) {
      body += data;
			  
      // Too much POST data, kill the connection!
      // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
      if (body.length > 1e6){
        request.connection.destroy();
      }
			
			// Obtain the parameter from the request
			
      request.on('end',function(){
				post = qs.parse(body);
      	msg = JSON.stringify(post);
				obj = JSON.parse(msg);
        console.log("JSON: " + msg);
        console.log("Action: " + obj.action);
        console.log("URL: " + request.url);
      	console.log("Post data : " + data);
        
		//check the request URI
				
		if (request.url == "/flist"){
			
			// check the request action
			
		  if (obj.action == "save"){
				console.log("fl save");
				var tempo = {};
				var query = {username: obj.username, fname: obj.fname };
				var newvalues = { $set:{note: obj.note}};
				
				//Update favourite list to database	
				
				db.open(function(){
					db.collection("hiflist").updateOne(query, newvalues, function(err, data){
						if (data) {
							tempo = {status: "success", fname: obj.fname, username: obj.username, note: obj.note};
							jsonResult = JSON.stringify(tempo);
							//console.log(data);
							console.log("Successfully updated");
							response.writeHead(200, {
				  			"Content-Type": "application/json; charset=utf-8",
				  			"Content-Length": Buffer.byteLength(jsonResult)
							});
							response.end(jsonResult);
						} else {
							console.log("Failed to Insert");
						}
					});
				db.close();
      });	
    }else if (obj.action == "getflist"){
			fs.readFile('./json/petparks.json', 'utf8', function (err, data) {
				var tempo = JSON.parse(data);
						
				//Get all favourite list from database		
						
			  db.open(function(){
       		db.collection("hiflist", function(err, collection){
						var tempjson = [];
				    var query = { username: obj.username};
          	collection.find(query).toArray(function(err, result) {
							if (err) throw err;
							for(var x in result){
								for(var y in tempo){
									if (tempo[y].Name_en == result[x].fname){
										tempo[y].note = result[x].note;
										tempjson.push(tempo[y]);
									}
								}
							}
							//console.log(result);
							var jsonResult = JSON.stringify(tempjson);
							//console.log(jsonResult);
							response.writeHead(200, {
				  			"Content-Type": "application/json; charset=utf-8",
				  			"Content-Length": Buffer.byteLength(jsonResult)
							});
							response.end(jsonResult);
            	db.close();
          	});
        	});
      	});		
			});
		}
			
	}else if (request.url == "/user"){
		
		//Register new user to database
		if (obj.action == "emailpassword"){
			db.open(function(){
        db.collection("hiuser", function(err, collection){
          var query = { username: obj.username};
          collection.find(query).toArray(function(err, result) {
            //if (err) throw err;
						if (!result[0]) {

						//email to user

						}else{
							console.log("email failure");
							temp = {status: "fail"};
							jsonResult = JSON.stringify(temp);
							response.writeHead(200, {
				  			"Content-Type": "application/json; charset=utf-8",
				  			"Content-Length": Buffer.byteLength(jsonResult)
							});
							response.end(jsonResult);
						}
          	db.close();
          });
        });
      });
			
		}else if (obj.action == "register"){
      db.open(function(){
      db.collection("hiuser", function(err, collection){
        collection.insert({ 
          username: obj.username,
          password: obj.password1,
          email: obj.email 
        }, function(err, data){
					if (data) {
						console.log(data);
						temp = {status: "success"};
						jsonResult = JSON.stringify(temp);
						console.log(jsonResult);
						response.writeHead(200, {
				  		"Content-Type": "application/json; charset=utf-8",
				  		"Content-Length": Buffer.byteLength(jsonResult)
						});
						response.end(jsonResult);
						} else {
							console.log("Failed to Insert");
							temp = {status: "fail"};
							jsonResult = JSON.stringify(temp);
							response.writeHead(200, {
				  			"Content-Type": "application/json; charset=utf-8",
				  			"Content-Length": Buffer.byteLength(jsonResult)
							});
							response.end(jsonResult);
						}
					});
        });
        db.collection("hiuser").count(function (err, count) {
          if (err) throw err;       
          console.log('Total Rows: ' + count);
          db.close();
        });
      }); 
		}else if (obj.action == "login"){
			
			//check the user if it is existed in DB
			
      db.open(function(){
        db.collection("hiuser", function(err, collection){
          var query = { username: obj.username, password: obj.password };
          collection.find(query).toArray(function(err, result) {
            //if (err) throw err;
						if (result[0]) {
            	console.log(result);
							jsonResult = JSON.stringify(result);
						//response.write(jsonResult);
							response.writeHead(200, {
				  			"Content-Type": "application/json; charset=utf-8",
				  			"Content-Length": jsonResult.length
							});
							response.end(jsonResult);
						}else{
							console.log("Login failure");
							temp = {status: "fail"};
							jsonResult = JSON.stringify(temp);
							response.writeHead(200, {
				  			"Content-Type": "application/json; charset=utf-8",
				  			"Content-Length": Buffer.byteLength(jsonResult)
							});
							response.end(jsonResult);
						}
          	db.close();
          });
        });
      });
		}
  }
						
  });                 
  });
		
	}else if (request.method == 'GET') {

		//GET method request below
		
		var url_parts = url.parse(request.url,true);
		var getquery = url_parts.query;
		if (url_parts.pathname == "/petpark"){
			if (getquery.action == "getpetpark" && getquery.select == "all" ){
				
			//get all petpark from the backup file of http://www.lcsd.gov.hk/datagovhk/facility/facility-dgpg.json	
				
			fs.readFile('./json/petparks.json', 'utf8', function (err, data) {
				var jsonResult;
  			if (err) throw err;
  			var tempo = JSON.parse(data);
				for(var x in tempo){
				console.log(tempo[x].Name_en);
				}
				jsonResult = JSON.stringify(tempo);
				//console.log(jsonResult);
				response.writeHead(200, {
				  "Content-Type": "application/json; charset=utf-8",
				  "Content-Length": Buffer.byteLength(jsonResult)
				});
				response.end(jsonResult);
			});
			}else if (getquery.action == "getpetpark" && getquery.select == "flist" ){
					fs.readFile('./json/petparks.json', 'utf8', function (err, data) {
					var tempo = JSON.parse(data);
						
					//get all petpark in the favourite list	
						
			  	db.open(function(){
       			db.collection("hiflist", function(err, collection){
							var tempjson = [];
				    	var query = { username: getquery.username};
          		collection.find(query).toArray(function(err, result) {
								if (err) throw err;
								for(var x in result){
									for(var y in tempo){
										if (tempo[y].Name_en == result[x].fname){
											tempo[y].note = result[x].note;
											tempjson.push(tempo[y]);
										}
									}
								}
								//console.log(result);
								var jsonResult = JSON.stringify(tempjson);
								//console.log(jsonResult);
								response.writeHead(200, {
				  				"Content-Type": "application/json; charset=utf-8",
				  				"Content-Length": Buffer.byteLength(jsonResult)
								});
								response.end(jsonResult);
            		db.close();
          		});
        		});
      		});		
				});
		}else if(getquery.action == "getpetpark" && getquery.select == "search" ){
			
				//Search the pet park using keyword
			
				fs.readFile('./json/petparks.json', 'utf8', function (err, data) {
					if (err) throw err;
					var tempo = JSON.parse(data);
					var jsonResult;
					var results = [];
        	//var tempo = JSON.stringify(data); 
        	var toSearch = getquery.keyword.toLowerCase();
             console.log(getquery.keyword);
          for(var i=0; i<tempo.length; i++) {
						//console.log(data[i]);
          	for(key in tempo[i]) {
							 //console.log(tempo[i][key]);
    					if(JSON.stringify(tempo[i][key]).toLowerCase().indexOf(toSearch)!=-1) {
      					results.push(tempo[i]);
								break;
							//	console.log(tempo[i]);
    					}else{
								//console.log(tempo[i]);
							}
  					}
					}	
					

				jsonResult = JSON.stringify(results);
				console.log(jsonResult);
				response.writeHead(200, {
				  "Content-Type": "application/json; charset=utf-8",
				  "Content-Length": Buffer.byteLength(jsonResult)
				});
				response.end(jsonResult);
			});
		}
			}else{
		
		// Other file type request

		  fs.readFile("./" + request.url, function (err, data) {
		    var dotoffset = request.url.lastIndexOf(".");
		  	var mimetype = dotoffset == -1
				? "text/plain"
				: {
					".html": "text/html",
					".ico" : "photo/x-icon",
					".jpg" : "photo/jpeg",
					".png" : "photo/png",
					".gif" : "photo/gif",
					".css" : "text/css",
					".js"  : "text/javascript"
				  }[request.url.substr(dotoffset)];
			  if (!err) {
			  	response.setHeader("Content-Type", mimetype);
		  		response.end(data);
		  		console.log(request.url, mimetype);
		  	} else {
		  		response.writeHead(302, {"Location": "./index.html"});
		  		response.end();
		  	}
	  	});
    }
	}else if (request.method == 'PUT') { 
		var body = '';
    var post = '';
    var msg = '';

    request.on('data', function (data) {
      body += data;
			
          
      // Too much POST data, kill the connection!
      // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
      if (body.length > 1e6){
        request.connection.destroy();
      }
            
      request.on('end',function(){
				post = qs.parse(body);
      	msg = JSON.stringify(post);
				obj = JSON.parse(msg);
        console.log("JSON: " + msg);
        console.log("Action: " + obj.action);
        console.log("URL: " + request.url);
      	console.log("Post data : " + data);
	
	
	//Add new favourite list to database			
				
	if (obj.action == "add"){
				console.log("fl start");
				var tempo = {};
				db.open(function(){
        	db.collection("hiflist", function(err, collection){
          	collection.insert({ 
            	username: obj.username,
            	fname: obj.fname,
							note: "",
          	}, function(err, data){
							if (data) {
								tempo = {status: "success", fname: obj.fname, username: obj.username, note: ""};
								jsonResult = JSON.stringify(tempo);
								console.log("Successfully Insert");
								response.writeHead(200, {
				  				"Content-Type": "application/json; charset=utf-8",
				  				"Content-Length": Buffer.byteLength(jsonResult)
								});
								response.end(jsonResult);
							} else {
								console.log("Failed to Insert");
							}
						});
        	});
			  	db.collection("hiflist").count(function (err, count) {
          if (err) throw err;       
          console.log('Total Rows: ' + count);
        });
				db.close();
			});
				
	} 
		});		
		});	
		
	//Delete a favourite list from the database
		
	}else if (request.method == 'DELETE') { 
		var body = '';
    var post = '';
    var msg = '';

    request.on('data', function (data) {
      body += data;
			
          
      // Too much POST data, kill the connection!
      // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
      if (body.length > 1e6){
        request.connection.destroy();
      }
            
      request.on('end',function(){
				post = qs.parse(body);
      	msg = JSON.stringify(post);
				obj = JSON.parse(msg);
        console.log("JSON: " + msg);
        console.log("Action: " + obj.action);
        console.log("URL: " + request.url);
      	console.log("Post data : " + data);
	
			if(obj.action == "delete"){
			  db.open(function(){
					var query = { username: obj.username, fname: obj.fname};
					db.collection("hiflist").deleteOne(query, function(err, dobj) {
						if (err){
							var tempo = {status: "fail"};
							var jsonResult = JSON.stringify(tempo);
							response.writeHead(200, {
				  			"Content-Type": "application/json; charset=utf-8",
				  			"Content-Length": Buffer.byteLength(jsonResult)
							});
							response.end(jsonResult);
						}else{
						var tempo = {status: "success"};
						var jsonResult = JSON.stringify(tempo);
						response.writeHead(200, {
				  		"Content-Type": "application/json; charset=utf-8",
				  		"Content-Length": Buffer.byteLength(jsonResult)
						});
						response.end(jsonResult);
						}
            db.close();
          });	
        });
			}		
		});
	});
	}	
});
	
//Start listening request
server.listen(port);
console.log('Server running at http://' + host + ':' + port);