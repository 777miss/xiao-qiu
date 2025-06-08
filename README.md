# 小秋(xiaoqiu)

## 项目介绍

机器人基于库OICQ进行开发，其菜单可分为五个部分，即群管理操作、群聊相关、小秋相关、积分玩法、其它玩法。每个部分均由若干指令构成，每个指令又有独自的配置项，例如指令名称、返回内容、触发其所需的最低权限等，且每个指令的触发方式有多种（作为隐藏彩蛋），成员可通过\[菜单\]指令获取更加具体的玩法

## 生成项目

克隆至本地

```javascript
git clone https://github.com/777miss/xiao-qiu.git
```

在根目录`/xiao-qiu`中安装其声明文件

```javascript
npm i -D
```

由于账号所对应的数据问题，需要将`xiao-qiu/lib`下的`user-copy`文件夹名称修改为`user`（`user`文件中所需的数据可稍后进行配置），随后在`xiao-qiu`中编译TS文件

```javascript
tsc
```

使用`tsc`命令编译后会生成`xiaoqiu`新文件夹，部署时只需部署该文件夹即可

## 准备工作

按照上述步骤生成项目后，目录结构为

```
├─xiao-qiu        // 开发环境
|   ├─assets
|   ├─database
|   ├─eventHandle
|   ├─lib
|   ├─temporary
|   ├─timing
|   ├─xiaoqiu     // 使用tsc命令生成的js文件所在处
|   ├─......
|   ├─app.ts
```

其`xiao-qiu/assets`文件夹结构如下
```
├─assets
|   ├─images
|   ├─readme
|   ├─videos
|   ├─package.json
|   ├─xiaoqiu_alpha.sql
```

将`xiao-qiu/assets`文件夹整体移至`xiao-qiu/xiaoqiu`文件夹下，并将`xiao-qiu/xiaoqiu/assets`中的`pakcage.json`文件移至`xiao-qiu/xiaoqiu`目录下，新的`xiao-qiu/xiaoqiu`目录结构为

```
├─xiaoqiu
|   ├─assets
|   |   └images
|   |   └readme
|   |   └videos
|   |   └xiaoqiu_alpha.sql
|   ├─......
|   ├─app.js
|   ├─package.json
```

随后在`xiao-qiu/xiaoqiu`下安装所需依赖

```javascript
npm i
```

## 账号相关

`xiao-qiu/lib/user`中存在`account.ts`与`account-alpha.ts`两个文件，前者为正式版配置，后者为测试版配置，可以在`xiao-qiu/lib/user/index.ts`中根据不同的需要进行切换

以`account-alpha.ts`为例，用户必须指定机器人的登录账号与密码、所监听的群聊账号、要修改群昵称的群聊账号、绝对权限、以及数据库配置

绝对权限是相对于指令的叫法，对于用户来说，绝对权限即特定用户，是独立于`member(普通成员)`、`admin(管理员)`、`owner(群主)`之外的用户，若某个指令指定了其所需的最低触发权限为特定用户，则只有该特定用户可触发，判断规则是账号层面的判断，而不是权限层面的判断

数据库配置方面，您可以选择新建一个数据库，并运行`xiao-qiu/xiaoqiu/assets/xiaoqiu_alpha.sql`文件，创建其所需数据结构（项目启动时会自动初始化表数据，所以只需关心它们的结构，而非数据），然后在`connectionDbConfig`中指定刚才创建好的数据库相关数据，例如

```javascript
const connectionDbConfig = {
    host: '主机名',
    user: '数据库账号',
    password: '数据库密码',
    database: '数据库名称'
}
```

> 在修改`account-alpha.ts`文件之后，应当重新执行`tsc`命令

## 启动项目

完成以上步骤，便可在`xiao-qiu/xiaoqiu`下启动该项目

```javascript
node app
```

初次登陆时，您可能会收到一条滑动验证，此时需要在该验证地址中得到`token`，然后将其输入在终端窗口中即可成功登陆（在`network`中找到对应请求地址）

> 登录后，`oicq`会在您的`xiao-qiu/xiaoqiu`下自动生成`data`文件夹，用于存放账号相关数据

## 开发新指令

> 只要您修改了源代码，则必须通过`tsc`命令生成新的JS文件，并`node app`运行它们

由于每个指令配置项众多，所以您可以参考`xiao-qiu/lib/Temp/temp-comment.ts`进行开发，或者您可以选择复制一份`xiao-qiu/lib/Temp/temp.ts`文件至您的新指令所在处

开发新指令时您应当注意：

1. 在`xiao-qiu/database/forms/interface.ts`中新增一个指令名称
2. 在`xiao-qiu/eventHandle/fn.ts`中引入新指令
3. 确保数据库中`switch_commands`中该指令为开启状态，否则不会被触发
4. [![Powered by DartNode](https://dartnode.com/branding/DN-Open-Source-sm.png)](https://dartnode.com "Powered by DartNode - Free VPS for Open Source")
