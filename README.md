# easy-flow

> 基于VUE+ElementUI+JsPlumb的流程设计器

![](https://gitee.com/xiaoka2017/resource/raw/master/easy-flow/1.png)

![](https://gitee.com/xiaoka2017/resource/raw/master/easy-flow/2.png)

![](https://gitee.com/xiaoka2017/resource/raw/master/easy-flow/3.png)

## 功能
* 支持拖拽添加节点
* 鼠标移入到节点中显示 编辑、删除 操作
* 不支持节点线连接自己
* 不支持节点A与节点B之间线互连
* 点击线进行删除

## 节点数据格式
``` json

[
    {
        "id": "nodeA",
        "name": "节点A",
        "left": "400px",
        "top": "15px",
        "ico": "el-icon-user-solid"
    },
    {
        "id": "nodeB",
        "name": "节点B",
        "left": "400px",
        "top": "200px",
        "ico": "el-icon-goods"
    },
    {
        "id": "nodeC",
        "name": "节点C",
        "left": "800px",
        "top": "200px",
        "ico": "el-icon-present"
    }
]

```
## 参数说明
|    参数    |      描述      |
| :--------: | :------------: |
|  id  |     标识唯一的节点、可以与业务ID相结合      |
|  name  |   节点名称      |
|  left  |   节点在页面上的X坐标      |
|  top  |   节点在页面上的Y坐标      |
|  ico  |   节点显示的图标      |



## 节点连线数据格式
``` json
[
    {
        "from": "nodeA",
        "to": "nodeB"
    },
    {
        "from": "nodeB",
        "to": "nodeC"
    }
]
```
## 参数说明
|    参数    |      描述      |
| :--------: | :------------: |
|  from  |     连线的起始节点的ID      |
|  to  |   连线的终点节点ID      |

## 帮助

* 左侧的节点名称以及图标可以自定义，在tool.vue中 menuList 中
* 左侧的节点展开时，子节点可以拖拽到右侧画布中即可添加
* 鼠标移动到节点上，节点的右上角上显示【修改】、【删除】链接
* 将鼠标从节点的左上角的图标上拖动时可以进行节点直接创建连线
* 点击节点之间的连线，可以进行连线删除

## 启动

``` bash
# 下载工程
git clone  https://github.com/BiaoChengLiu/easy-flow.git

# 安装依赖包
npm install

# 启动
npm run dev

# 访问地址
 http://localhost:8080
```

## TODO
* 支持多种节点
* 节点图标自定义
* 节点样式自定义
* 提供保存JSON格式功能
* 提供根据JSON数据加载功能
* 提供Java版本数据解析工具包
> 目前正在开发中，功能还未完善
