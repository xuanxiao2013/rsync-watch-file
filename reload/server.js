var fs = require('fs'),
    util = require('util'),
    path = require('path'),
    cp = require('child_process'),
    chokidar = require('chokidar');

var pdir = '/Users/xuanxiao/work/test/hashRouter/';
var server = require('http').createServer();
var io = require('socket.io')(server);
console.log('监听目录:' + pdir)
watch = chokidar.watch(pdir, {
    ignored: /[\/\\]\./,
    persistent: true,
    ignoreInitial: true
}).on('all', function(event, path) {
    if (path) {
        io.sockets.emit(event);
    }
});
server.listen(3000);
