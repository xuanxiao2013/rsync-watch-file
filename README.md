rsync-watch-file
================

watch file and rsync

缘由
----

现在开发大的项目，都是在开发机上做开发，想要在本机开发，搭建开发环境，大多数是难度很大，除非在这个项目设计之初就有这个考虑。
在开发机上做开发，其实也是个习惯的问题，习惯了也就没有什么区别了，但是如果想要爱美的前端习惯在这丑陋的开发机上开发，使用各种
奇怪、晦涩,但是强大的linux命令，这个过程比较痛苦。

从一开始的不习惯开发机开发，到在开发机上开发，学习使用vim，使着vim时间越长，就发现有个问题，本来在这个开发机开发，过两天，PE
说这个机器要下线，那好，我的vim环境有的重新搭建，好吧，我可以吧我的vim做出一键安装。但是又有一个问题，我要安装vim的一些插件，
依赖于其它的一些东西，这里的版本问题是最大的问题，难道这个也要直接在开发机上弄，这种事一般是吃力不讨好啊。

办法
----

我就想，要是我在我本机开发，有一个程序自动同步，这个不就省了好多的事情，最主要的是我就可以在客户端使用我最帅气的编辑器，yy自己
的开发环境，想想这个也不难，那就做呗

写后端毕竟不是前端的强项，在github上找，发现这个[autorsync](https://github.com/mattes/autorsync),试了试，发现这个达不到期望，就是find找文件，在监听，这个要是项目特
别大的时候，就快慢死了。接着找到这个[chokidar](https://github.com/paulmillr/chokidar)，这个不错，很满足期望，然后稍作改进，目的达到


文件配置
----

````
这个配置文件不能添加注释，满足json文件的格式
{
	//本地路径,必须为绝对路径
	"local": "/path/to/project1/",
	//远程机器
	"host": "10.12.13.14",
	//远程路径： 模块名/path/
	"remote": "/modle_name/project1/",
	//排除文件路径, 必须为绝对路径
	//.rsf.ignores 这个文件中的路径为相对路径
	"excludeFilePath": "/path/to/project1/.rsf.ignores",
	//启动程序首次是否同步, 默认同步
	"everyRsync": "true",
	//会打印rsync执行语句
	"debug": "true"
}

````

服务端配置
----

````
/etc/rsyncd.conf
uid = username
gid = users
use chroot = no
max connections = 100
pid file = /var/run/rsyncd.pid
lock file = /var/run/rsync.lock
log file = /var/log/rsyncd.log

[modle_name]
path = /home/path/path/
hosts allow = 1.0.1.0
read only = false
list = false
write only = true
````

运行
----

本机必须安装git node rsync

git clone https://github.com/xuanxiao2013/rsync-watch-file.git rwf

cd rwf

启动命令：node bin/rwf /path/to/.rsf.config
结束：CTRL+c






