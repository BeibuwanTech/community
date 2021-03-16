# 基于开源项目 Discuz! 的北部湾城市群科技服务交易社区

## 主要特点

- 钱包: 钱包功能支持账户钱包和微信支付
- 交易: 通过悬赏、问答发起虚拟化服务的交易流程

## 介绍

```shell
.
├── core # Discuz!Q 核心代码
├── design # 设计物料
├── serverless # 基于 serverless 的部署方案
├── README.md
├── ssl # 域名证书
├── tool # 工具
├── uniapp # 移动端小程序
├── web # PC端
├── README.md
```

## Discuz! 开源代码地址

1. [pc端最新下载地址](https://dl.discuz.chat/discuz_web_latest.zip)
2. [小程序与H5前端 最新下载地址](https://dl.discuz.chat/uniapp_latest.zip)
3. [Discuz! Q代码下载地址](https://dl.discuz.chat/dzq_latest_install.zip)，包括了 后台源代码，与构建好的前端代码，前端代码在 public 目录下。管理后台的源代码位于 `dzq_latest_install/resources/frame` 目录下，运行 `yarn build-admin` 构建编译到 `dzq_latest_install/public/static-admin/` 目录下

## 开发指南

### 1、启动服务

请先执行`download.sh`脚本下载最新的代码文件。

1、通过`docker-compose up`。将默认启动后端代码并且挂载本地的源码目录 `source/dzq_latest_install`，并且创建一个本地mysql数据库，方便本地开发。
2、可在 `source/discuz_web_v2.1.201126` 目录执行 `yarn install && yarn dev` 运行web端服务
3、可在 `source/uniapp_v2.1.201126` 目录执行 `yarn install && yarn dev:h5` 运行h5端服务

### 2、配置代理到本地开发

本地开发前端代码时，后台请求默认代理到DQ提供的公共服务 `https://dq.comsenz-service.com` 上，如果希望改变代理。请修改如下配置

1、`source/uniapp_v2.1.201126/vue.config.js`文件夹 `devServer.proxy['/api'].target`
2、`source/discuz_web_v2.1.201126/config.js`文件夹内的 `DEV_API_URL`
