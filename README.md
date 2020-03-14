# easy-flow

## 演示地址
> 感谢码云平台给了一个免费的Gitee Pages服务, 可能访问有点慢

[演示地址](http://xiaoka2017.gitee.io/easy-flow/#?_blank)

## 效果图


<table>
    <tr>
        <td><img src="https://gitee.com/xiaoka2017/resource/raw/master/easy-flow/1.png"/></td>
        <td><img src="https://gitee.com/xiaoka2017/resource/raw/master/easy-flow/2.png"></td>
    </tr>
    <tr>
        <td><img src="https://gitee.com/xiaoka2017/resource/raw/master/easy-flow/3.png"/></td>
        <td><img src="https://gitee.com/xiaoka2017/resource/raw/master/easy-flow/4.png"></td>
    </tr>
</table>


## 项目介绍
`easy-flow` 基于VUE+ElementUI+JsPlumb的流程设计器，通过 vuedraggable 插件来实现左侧菜单的拖拽，拖拽结束后回调end方法,
根据鼠标所在的位置添加一个节点信息，使用jsplumb来管理该节点，设置该节点可拖拽、连线 并注册相关的事件。


## 功能
* 支持拖拽添加节点
* 鼠标移入到节点中显示 编辑、删除 操作
* 不支持节点线连接自己
* 不支持节点A与节点B之间线互连
* 点击线进行删除
* 支持给定数据加载流程图

## 更新日志

2020年3月14日
* 页面样式调整
* 新增类型参数
* 新增菜单样式调整

2019年12月09日
* 修复移动节点位置后，点击【流程信息】时节点信息位置未更新问题

2019年12月08日
* 去除_this定义，使用箭头函数

2019年11月26日
* 修复： 修复删除节点时把其他的线也删除了
* 优化： 优化代码结构
* 修改版本： 修改lodash版本为4.17.15

2019年11月25日
* 修复加载数据时nodeId不唯一问题

2019年08月23日
* 修改IE 11.316版本下无法拖拽问题
* 新增演示环境地址， [演示地址](http://xiaoka2017.gitee.io/easy-flow/#?_blank)

2019年08月22日
* 修改火狐浏览器下不能够拖拽问题

## 操作说明
* 左侧菜单子节点可以拖拽，将其拖拽到右侧画板中松开鼠标即可添加一个节点
* 鼠标移动到画板中的节点上，节点的右上角出现 【删除】、【编辑】图标，点击对应的图标可进行删除、编辑操作
* 节点分为2部分，图标在左上角侧，文字在下侧，鼠标从图标上可以拖拽出连线，可以连接其他节点，拖动图标意外位置可以改变节点在页面的位置

## 数据格式
``` json

{
    name: '流程C',
    nodeList: [
        {
            id: 'nodeA',
            name: '流程C-节点A',
            left: '400px',
            top: '15px',
            ico: 'el-icon-user-solid',
            show: true
        },
        {
            id: 'nodeB',
            name: '流程C-节点B',
            left: '400px',
            top: '200px',
            ico: 'el-icon-goods',
            show: true
        },
        {
            id: 'nodeC',
            name: '流程C-节点C',
            left: '400px',
            top: '378px',
            ico: 'el-icon-present',
            show: true
        }
    ],
    lineList: [
        {
            from: 'nodeA',
            to: 'nodeB'
        }, {
            from: 'nodeB',
            to: 'nodeC'
        }
    ]
}

```
## data 参数说明
|    参数    |      描述      |
| :--------: | :------------: |
|  name  |     流程图名称      |

## nodeList 参数说明
|    参数    |      描述      |
| :--------: | :------------: |
|  id  |     标识唯一的节点、可以与业务ID相结合      |
|  name  |   节点名称      |
|  left  |   节点在页面上的X坐标      |
|  top  |   节点在页面上的Y坐标      |
|  ico  |   节点显示的图标      |
|  show  |   为了解决节点删除问题      |


## lineList 参数说明
|    参数    |      描述      |
| :--------: | :------------: |
|  from  |     连线的起始节点的ID      |
|  to  |   连线的终点节点ID      |

## 使用说明

* 左侧的节点名称以及图标可以自定义，在tool.vue页面menuList变量中
* 左侧的节点展开时，子节点可以拖拽到右侧画布中即可添加
* 鼠标移动到画布中节点上，节点的右上角上显示【修改】、【删除】操作链接
* 将鼠标从画布节点的左上角图标上拖动时可以拖拽出连线，然后将鼠标移动到其他节点上即可连接
* 点击画布中节点之间的连线，可以进行连线删除

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
* 提供Java版本数据解析工具包
> 目前正在开发中，功能还未完善



## github
https://github.com/BiaoChengLiu/easy-flow

## 交流群

QQ群：534446043

![avatar](https://gitee.com/xiaoka2017/resource/raw/master/easy-flow/qrcode_1575887795029.jpg)

## 协议
符合项目package.json中使用的插件中规定的协议即可
