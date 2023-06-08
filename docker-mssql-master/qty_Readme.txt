参考
github地址： https://github.com/GCSLaoLi/docker-mssql
【使用docker安装微软Sql server数据库】 
https://www.bilibili.com/video/BV1Vo4y1m7cK/?share_source=copy_web&vd_source=f6efa13f970d516aa8e9c9cc456576c5

数据库的文件都挂载到data/mssql里了
使用Navicat成功链接(mssql-2022,localhost,SA,20021124Qian)上后,会发现一片空白，需要对其新建一个数据库。
对于建表sql（非建库sql），请对dbo右键，执行外部sql。而不是像mysql中直接对数据库右键。