# 配置远程仓库的 cli 工具

> <div><b>Follow the <a href="https://github.com/lxs24sxl">lxs24sxl</a> for updates on new list additions.</b></div>

* 常规命令如下

```sh
$ ? 请选择一种前端框架
$   Vue
$   React
$ ❯ Node

$ ? 请选择一种模版类型 (Use arrow keys)
$ ❯ Egg
$   Koa
$   Nest
$   Cabloy
```

* 配置方法拉到底部

## 命令
``` sh
$ npm install -g vole-cli
# OR
$ yarn global add vole-cli

$ vole create <project-name>
```

## 内容
- [init](#init)
- [create](#create)
- [config](#config)

## init
初始化全局.volerc文件

```json
{
	"VUE_ADMIN_TEMPLATE_REPO": "",
    "config": {
     	"configurable": true
   }
}
```
## create

### 可用命令

<table>
  <thead>
    <tr>
      <th>Command</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        -f, --force
      </td>
      <td>
        Overwrite target directory if it exists
      </td>
    </tr>
  </tbody>
</table>

### 用法

```sh
$ vole create .
$ vole create <project-name>

$ vole create
# error: missing required argument 'app-name'
```

## config

### 可用命令

<table>
  <thead>
    <tr>
      <th>Command</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
       	-g, --get 'key'
      </td>
      <td>
        get value from option
      </td>
    </tr>
     <tr>
      <td>
       	-s, --set 'key' 'value'
      </td>
      <td>
        set option value
      </td>
    </tr>
    <tr>
      <td>
        -d, --delete 'key'
      </td>
      <td>
        delete option from config
      </td>
    </tr>
    <tr>
      <td>
        -e, --edit
      </td>
      <td>
        open config with default editor
      </td>
    </tr>
    <tr>
      <td>
        --json
      </td>
      <td>
        outputs JSON result only
      </td>
    </tr>
  </tbody>
</table>

### 用法

#### 1. get

```sh
$ vole config -g configurable
# true
$ vole config -g configurable --json
# {
# 	"value": true
# }
```

#### 2. set
```sh
$ vole config -s configurable false
# You have updated the option: configurable to false
```

#### 3. delete
```sh
$ vole config -d configurable
# You have removed the option: configurable
```

#### 4. json
```sh
$ vole config --json
# {
#   "resolvedPath": "/Users/lxs24sxl/.volerc",
#   "content": {
#     "VUE_ADMIN_TEMPLATE_REPO": "",
#     "config": {
#       "configurable": true
#     }
#   }
# }
```

### 命令提醒
```sh
$ vole creat

# Usage: vole <command> [options]

# Options:
#   -V, --version                output the version number
#   -h, --help                   display help for command

# Commands:
#   create [options] <app-name>  create a new project powered by vole-cli-service
#   init                         initialize the .volerc file
#   config [options] [value]     inspect and modify the config
#   Run vole <command> --help for detailed usage of given command.

#   Unknown command creat.

#   Did you mean create.
```

```sh
$ vole -V
# vole-cli 1.0.0
```

## 常见问题

### 1. 如果屏蔽这些命令交互？（可无视）
```sh
? 请输入后台模版名称 默认后台模版
? 请输入后台模版路由名( 路由为空则为一级路由,否则为二级路由,例:/retail/ )
? 请输入后台模版系统编码( 传递给后端的名称,例:admin-retail ) admin-test
? 请输入端口号 8081

```
#### 解决方法
```sh
$ vole config -s configurable false
```

### 2. 如何在create之前先屏蔽上面的命令交互？（可无视）

#### 解决方法
先跑init生成.volerc文件，再进行修改

```sh
$ vole init
$ vole config -s configurable false
$ vole create <project-name>
```

### 3. 如何添加自己的模版?

#### 解决方法
- 目前版本定义框架为vue或react，模版类型为admin/standard/h5/app/quickapp。node -> egg/koa/nest/cabloy
- 添加需要的模板路径只需要使用config命令配置不同的repo地址
- repo配置方法详细见[download-git-repo](https://www.npmjs.com/package/download-git-repo)

* 常用repo配置法: gitlab -> gitlab地址:gitlab中项目地址#分支名， github -> github地址:github名称/项目地址#分支名

```sh
$ vole config -s VUE_STANDARD_TEMPLATE_REPO <repo>
$ vole config -s REACT_ADMIN_TEMPLATE_REPO <repo>
$ vole config -s NODE_NEST_TEMPLATE_REPO <repo>
```
