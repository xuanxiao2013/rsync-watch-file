/**
服服务端配置 
/etc/rsyncd.conf
uid = xiantao.kong
gid = users
use chroot = no
max connections = 100
pid file = /var/run/rsyncd.pid
lock file = /var/run/rsync.lock
log file = /var/log/rsyncd.log
[xuanxiao_cnzz]
path = /home/path/path/
hosts allow = 1.0.1.0
read only = false
list = false
write only = true
**/

var fs = require('fs'), util = require('util'), 
	path = require('path'), cp = require('child_process'),
	chokidar = require('chokidar'), jf = require('jsonfile'), VERSION = "0.1.0";
var keyMap = {
	'add': '新增文件',
	'addDir': '新增目录',
	'change': '文件修改',
	'unlink': '删除文件',
	'unlinkDir': '删除目录',
	'success': '同步成功',
	'error': '同步失败'
};

function log() {
	console.log.apply(this, arguments);
}


var server = require('http').createServer();
var io = require('socket.io')(server);
//sudo lsof -i:3000

if(process.argv.length != 3) {
  log(usage());
  return;
}else{
	jf.readFile(path.resolve(process.argv[2]), function(err, opts) {
		if(err){
			log(err);
			return false;
		}
		
		if(opts.debug){
			log(opts)
		}
		server.listen(opts.prot);
		run(opts);
	});
}

function watch(config){	
	var rpath, local = config.local;
	watch = chokidar.watch(local, {ignored: /[\/\\]\./, persistent: true, ignoreInitial: true}).on('all', function(event, path) {
		if(path){
			rpath = path.split(local)[1];
			log(keyMap[event], rpath);
			rsync(config, rpath, event)
		}
	});
}

function rsync(config, filePath, event){
	var rsyncCmd = 'rsync -avu --delete --exclude-from=' + config.excludeFilePath + ' ' + config.local + ' ' + 'rsync://' + config.host + config.remote;
	if(config.debug){
		log(rsyncCmd)
	}
	cp.exec(rsyncCmd, function(error, stdout, stderr) {
		filePath = filePath || stdout;
		if(error || stderr) {
			if(config.debug){
				log(filePath)
				log(error)
			}
			log(keyMap['error'], filePath);
		}else{
			log(keyMap['success'], filePath);
        	io.sockets.emit(event);
		}		
	});
}


function usage() {
	  var str = '';
	  str += 'Usage: rsync watch file  \n';
	  str += 'eg: node rwf /path/to/autorsync.conf   \n';
	  str += 'vim /path/to/autorsync.conf   \n';
	  str += '{\n';
	  str += '	"local": "/home/path/work/project1/"   \n';
	  str += '	"host": "0.0.0.1", \n';
	  str += '	"remote": "/rsyncdConf_modleName/project1/", \n';
	  str += '	"excludeFilePath": "/path/to/.rsync_ignores", \n';
	  str += '	"everyRsync": "true" \n';
	  str += '}\n';
	  return str;
}


function run(config){
	config.everyRsync && rsync(config);
	watch(config);
}
