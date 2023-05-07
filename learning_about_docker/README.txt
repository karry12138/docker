参考技术蛋老师的视频，用docker搭建一个简单的nodejs的项目
【🐳Docker概念，工作流和实践 - 入门必懂-哔哩哔哩】 https://b23.tv/m7xMckB

本地项目通过Dockerfile + docker build ==》创建为镜像
镜像 + docker run ==》分配容器从而运行

如果想运行已经创建好的镜像elderman-container-auto-update，
docker run -d -v /Users/karry/code_hub_notTooLate/docker/learning_about_docker:/start:ro -v /start/node_modules -p 3000:3000 --name elderman-container-auto-update elderman-image-auto-update
如果想暂停此容器
docker stop elderman-container-auto-update
移除此容器
docker rm -fv elderman-container-auto-update

完整流程见下。同时我录制了从0-1的操作流程
链接: https://pan.baidu.com/s/1k5-7jAV4F99-Q5as4arCJQ?pwd=w6vi 

=============创建镜像=============
先初始化项目，并为服务器写代码，测试本地是否能运行。
输入ctrl+C退出服务器项目

然后，创建Dockerfile文件。
>>
touch Dockerfile

这样，我们的构建镜像的准备工作就完成了。
启动docker，开始build镜像
>>
docker build .  在该文件夹下寻找dockerfile进行build
等一会吧，第一次来是有点慢的
你可以看到，截图部分就是我们写在Dockerfile里的命令

>>
docker images  查看所有镜像
由于我们build时没取名字，所以为none

>>
docker tag [IMAGE ID] [镜像名] 为镜像取名
如果镜像不多，输IMAGE ID时打前几位就行
若要把镜像推送到docker hub，建议用标准写法 用户名/镜像名:项目版本
没加项目版本就是latest

接下来，把镜像push到docker hub
docker login进行登录
>>
docker push karry12138/single_page:v1.0
然后就能在docker hub你的账户里找到了


当然也可以在build时就起名，
-t [name]
由于dockerfile每执行一步都会有缓存，所以这次build很快


删除镜像
>>
docker rmi [IMAGE NAME]
-f  force 强制删除正在被使用的镜像


拉取docker hub上账户内的镜像
>>
docker pull [IMAGE NAME]


==========在容器中运行我们的镜像=============
>>
docker run [IMAGE NAME]
返回容器ID
-d detached mode 不占用当前终端来运行


查看正在运行的容器Process Status
>>
docker ps
-a 查看所有容器（包括已暂停/关机）

尝试使用本地浏览器访问容器服务，发现不行。因为我们在镜像的app.js中开启的3000是容器端口号，
而非本地的端口号。所以需要建立容器端口到本地端口的映射。
那你问dockerfile中的EXPOSE 3000有什么用？那只起文档作用，告诉你这个镜像在容器中用一个3000端口

补充：开启端口映射 + 容器取名
>>
docker run [IMAGE NAME]
-d detached mode 不占用当前终端来运行
-p 主机端口:容器端口  开启端口映射
--name [container name] 给容器取名

这样就能在本地浏览器访问容器项目了

将容器关机
>>
docker stop [container ID]


删除容器
>>
docker rm -f [container ID/container NAME]

=========本地与容器同步===========

访问容器
>>
docker exec [container NAME/ID]
-i interactive 交互
-t pseudo-TTY 伪终端，用终端交互

>>
docker exec -it elderman-image-test /bin/sh    # 这是airpine进入shell的方式
我们就进入了容器工作目录（当然，可以指定进入的目录）
然后就和linux一样了
exit退出容器

如果每次修改本地项目，都要重build镜像再运行container，太麻烦了，那么该如何同步呢？

将本地指定文件夹与容器指定文件夹绑定
>>
docker run 
-v volume 绑定
    在命令行中
    -v 本地绝对路径:容器绝对路径
docker run -d -v /Users/karry/code_hub_notTooLate/docker/learning_about_docker:/start -p 3000:3000 --name elderman-image-test elderman-image

关掉旧容器，用新指令新开容器
我们来修改本地项目文件试试
可以看到，容器页面改动啦
但我此时再对本地文件进行修改呢？
不行。
虽然我们已经把本地文件和容器文件绑定，
但我们在docker run，即依据镜像创建容器时，是根据run时的服务器文件来启动服务的。
如果此时文件有修改，需要重run（相当于重新 node app.js）

在nodejs中，有一个模块nodemon可以做到在文件用改动且保存后，就自动重启node项目.

在本地安装nodemon。
npm -i nodemon
由于只在开发环境用，加上 --save-dev
随后在package.json的scripts中增加启动nodemon的命令
"dev": "nodemon app.js"
# "dev": "nodemon -L app.js" //Windows特供
震惊！json不允许注释！
完事后，启动项目的指令就从node app.js  -> npm run dev

同时，要修改dockerfile中的cmd

一切准备工作做好，然后就是重build镜像了。
>>
docker build -t elderman-image-auto-update .

!!!注意！！！
前面-v 绑定两端文件的操作，会使文件同步修改。
本地node_modules会覆盖容器里的，一旦本地丢失，容器也无法运行。
容器有新增，会覆盖本地。
所以建议设置
    1.声明容器中不进行同步的文件夹 -v /start/node_modules
    2.声明本地只读  在-v 绑定文件指令的末尾:ro   表示read only
>>
docker run -d -v /Users/karry/code_hub_notTooLate/docker/learning_about_docker:/start:ro -v /start/node_modules -p 3000:3000 --name elderman-container-auto-update elderman-image-auto-update

尝试修改本地文件，再刷新本地浏览器，可以看到项目页面成功同步更新了


！！！注意！！！
使用了volume的容器，在销毁时也要把volumne删除掉。
>>
docker rm -fv [container NAME]

=======快捷启动容器=======
当然你有docker desktop，很方便。
若是在命令行中，每次启动都要写很长的命令，麻烦。
可以用docker-compose进行多容器快捷启动

1.创建一个docker-compose.yml
2.在命令行运行 docker-compose up 
-d 不占用当前终端来运行
--build 若本地文件有修改，docker-compose就会重build镜像，否则使用之前的缓存

>>
docker-compose up -d --build
不过容器名取的是文件夹名（应该去看看能不设置一下）
docker-compose down -v  # 移除容器

🎉🎉🎉🎉完结撒花！！🎉🎉🎉🎉