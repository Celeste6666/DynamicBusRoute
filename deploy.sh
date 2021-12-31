#!/usr/bin/env sh

# 当发生错误时中止脚本
set -e

# 构建
# npm run build

# cd 到构建输出的目录下
# cd dist

# 部署到自定义域域名
# echo 'www.example.com' > CNAME

# git init
git add -A
git commit -m '修改公車收藏頁面公車站抵達時間預估及刪除按鈕定位'

# 部署到 https://<USERNAME>.github.io
# git push -f git@github.com:<USERNAME>/<USERNAME>.github.io.git master

# 部署到 https://<USERNAME>.github.io/<REPO>
git push -f git@github.com:Celeste6666/DynamicBusRoute.git master:main

cd -