# Dockerfile中需要编写该项目的各种大环境依赖（如操作系统等）
# 可以去Docker Hub找
# 其上的基础镜像已经制定了操作系统和node版本
# 我们可以在此基础之上构建其他东西搭建新的镜像

# node版本20，操作系统alpine3.17(linux)
FROM node:20-alpine3.17  
# 指定容器的工作目录
WORKDIR /start
# 将Package.json复制进镜像的工作目录/start
COPY package.json .
# 镜像根据package.json安装包依赖
RUN npm install

# 将本地构建服务器用的文件全部复制到镜像里
COPY . .
# ！！注意，不是所有的文件都需要，比如node_modules文件夹就不用
# 创建dockerignore文件，把不想复制到镜像的文件和文件夹写进去


# 暴露容器的端口号,与本机的端口号不同
EXPOSE 3000
# 在容器中运行项目。CMD命令后接参数用数组
# CMD ["node", "app.js"]
CMD ["npm", "run", "dev"]