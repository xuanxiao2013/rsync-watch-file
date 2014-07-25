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

var fs = require('fs');
var cp = require('child_process');
var chokidar = require('chokidar');
var VERSION = "0.1.0";

var opts = {
	local: '/home/path/trunk_skey2/',
	host: '1.0.1.0',
	remote: '/rsyncdConf_modleName/project1/',
	//启动程序首次是否同步, 默认同步
	everyRsync: true
}, watch;

var keyMap = {
	'add': '新增文件',
	'addDir': '新增目录',
	'change': '文件修改',
	'unlink': '删除文件',
	'unlinkDir': '删除目录',
	'success': '同步成功',
	'error': '同步失败'
}

function log() {
	console.log.apply(this, arguments);
}


if(process.argv.length <= 2) {
  log(usage());
  return;
}

function watch(){	
	var rpath, local = opts.local;
	watch = chokidar.watch(local, {ignored: /[\/\\]\./, persistent: true, ignoreInitial: true}).on('all', function(event, path) {
		if(path){
			rpath = path.split(local)[1];
			log(keyMap[event], rpath);
			rsync(rpath)
		}
	});
}
function rsync(filePath){
	var rsyncCmd = 'rsync -avu --delete --exclude=.svn ' + opts.local + ' ' + 'rsync://' + opts.host + opts.remote;
	//log(rsyncCmd)
	cp.exec(rsyncCmd, function(error, stdout, stderr) {
		filePath = filePath || stdout;
		if(error || stderr) {
			log(keyMap['error'], filePath);
		}else{
			log(keyMap['success'], filePath);
		}		
	});
}

function usage(errorString) {
	  var str = '';
	  if(errorString) {
	    str += '!!! ' + errorString + '\n\n';
	  } else {
	    str += 'autorsync  version ' + VERSION + '\n';      
	  }
	  str += 'Usage:\n autorsync rsyncFile  \n\n';
	  str += 'eg: autorsync ~/.autorsync.conf   \n\n';
	  str += 'vim ~/.autorsync.conf   \n\n';
	  str += '{\n';
	  str += '	local: /home/path/work/project1/   \n';
	  str += '	host: 0.0.0.1 \n';
	  str += '	remote: /rsyncdConf_modleName/project1/ \n';
	  str += '	everyRsync: true \n';
	  str += '}\n\n';
	  return str;
}


opts.everyRsync && rsync();
watch();

