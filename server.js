// 代码清单2-2
var http = require('http')
var fs = require('fs')
var path = require('path')
var mime = require('mime')
var cache = {}

// 辅助函数
function send404(response) {
	response.writeHead(404,{'content-type':'text/plain'})
	response.write('Error 404: resource not found.')
	response.end();
}
function sendFile(response, filePath, fileContents) {
	response.writeHead(200,{
		"content-type": mime.lookup(path.basename(filePath))
	})
	response.end(fileContents)
}
function serveStatic(response, cache, absPath) {
	if (cache[absPath]) {
		sendFile(response, absPath, cache[absPath])
	} else {
		fs.exists(absPath, function (exists) {
			if (exists) {
				fs.readFile(absPath, function (err, data) {
					if (err) {
						send404(response)
					} else {
						cache[absPath] = data
						sendFile(response, absPath, data)
					}
				})
			} else {
				send404(response)
			}
		})
	}
}
// 创建http服务器
var server =http.createServer(function (request, response) {
	var filePath = false
	if (request.url == '/') {
		filePath = 'public/index.html'
	} else {
		filePath = 'public' + request.url;
	}
	var absPath = './' + filePath
	serveStatic(response, cache, absPath)
})
//启动http
server.listen(3000, function () {
	console.log("Server listening on port 3000.")
})













