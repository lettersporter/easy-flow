# easy-flow

## 演示地址
> 感谢码云平台给了一个免费的Gitee Pages服务, 可能访问有点慢

[演示地址](http://xiaoka2017.gitee.io/easy-flow/#?_blank)

## 效果图

![](https://gitee.com/xiaoka2017/resource/raw/master/easy-flow/2.2.0/1.png)



![](https://gitee.com/xiaoka2017/resource/raw/master/easy-flow/2.3.0/3.jpg)



![](https://gitee.com/xiaoka2017/resource/raw/master/easy-flow/2.2.0/2.png)





## 项目介绍
`easy-flow` 基于VUE+ElementUI+JsPlumb的流程设计器，通过 vuedraggable 插件来实现节点拖拽。


## 功能介绍
* 支持拖拽添加节点
* 点击线进行设置条件
* 支持给定数据加载流程图
* 支持画布拖拽
* 支持连线样式、锚点、类型自定义覆盖
* 支持力导图

## 更新日志

2020年11月12日

* 新增力导图自适应布局，只需要提供节点、节点和节点之间的关系即可自动计算坐标（比没有坐标好些）

2020年8月6日

* 新增自连接样例

2020年8月6日

* 新增缩放（还存在一些问题）
* 新增使用说明
* 新增拖拽回调
* 节点新增viewOnly参数，可以控制节点是否只读

2020年6月14日
* 新增：连线自定义类型
* 新增：连线自定义锚点
* 新增：连线制自定义样式

2020年5月10日

* 修改jsplumb源码
* 支持label设置和修改
* 新增节点状态

2020年5月6日
* 新增: 连线条件支持
* 重构: 布局重构
* 删除: show控制显示参数
* 新增: 画布拖拽

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
* 节点分为3部分，左边为标识节点的图标，中间节点的描述，右变为节点的状态图标，鼠标从左变图标上可以拖拽出连线，可以连接其他节点，拖动左侧图标以外位置可以改变节点在页面的位置

## 数据格式
``` json

 {
    name: '流程D',
    nodeList: [
        {
            id: 'nodeA',
            name: '流程D-节点A',
            type: 'task',
            left: '18px',
            top: '223px',
            ico: 'el-icon-user-solid',
            state: 'success'
        },
        {
            id: 'nodeB',
            type: 'task',
            name: '流程D-节点B',
            left: '351px',
            top: '96px',
            ico: 'el-icon-goods',
            viewOnly: true,
            state: 'error'
        },
        {
            id: 'nodeC',
            name: '流程D-节点C',
            type: 'task',
            left: '354px',
            top: '351px',
            ico: 'el-icon-present',
            state: 'warning'
        }, {
            id: 'nodeD',
            name: '流程D-节点D',
            type: 'task',
            left: '723px',
            top: '215px',
            ico: 'el-icon-present',
            state: 'running'
        }
    ],
    lineList: [{
        from: 'nodeA',
        to: 'nodeB',
        label: '直线,自定义线样式,固定锚点',
        connector: 'Straight',
        anchors: ['Top', 'Bottom'],
        paintStyle: {strokeWidth: 2, stroke: '#1879FF'}
    }, {
        from: 'nodeA',
        to: 'nodeC',
        label: '贝塞尔曲线,固定锚点',
        connector: 'Bezier',
        anchors: ['Bottom', 'Left']
    }, {
        from: 'nodeB',
        to: 'nodeD',
        label: '默认连线样式,动态锚点'
    }, {
        from: 'nodeC',
        to: 'nodeD',
        label: '默认连线样式,动态锚点'
    }
    ]
}

```
## data 参数说明
|    参数    |      描述      |
| :--------: | :------------: |
|  name  |     流程图名称      |

## nodeList 参数说明
|    参数    |    必填    |      描述      |      可选值      |
| :--------: | :------------: | ---------- | ---------- |
|  id  |  是  |     标识唯一的节点、可以与业务ID相结合      |           |
|  name  |  是  |   节点名称      |         |
| type | 是 | 节点类型，可以和业务相结合做处理 |  |
|  left  |  是  | 节点在页面上的X坐标，以px结尾  |         |
|  top  |  是  |  节点在页面上的Y坐标，以px结尾 |         |
|  ico  |  是  |   节点显示的图标，标识   |         |
|  state  |  否  |   状态，状态不同右侧展示的图标不同   | success、error、warning、running |
|  viewOnly  |  否  |   是否仅用于浏览，true: 不可拖拽   | true 、false|




## lineList 参数说明
|    参数    |    必填    |      备注      |      可选值      |
| :--------: | :------------: | -------------- | -------------- |
|  from  |  是  |     连线的起始节点的ID      |           |
|  to  |  是  |   连线的终点节点ID      |         |
|  label  |  否  |   连线上的描述信息   |         |
| anchors | 否 | 连线的起始锚点位置，如：["Top","Right"] | ['Top', 'TopCenter', 'TopRight', 'TopLeft', 'Right', 'RightMiddle', 'Bottom', 'BottomCenter', 'BottomRight', 'BottomLeft', 'Left', 'LeftMiddle'], |
| connector | 否 | 连线类型 | StateMachine、Flowchart，Bezier、Straight |

## 如何集成

- 下载源码

- 在自己的vue工程中找到package.json，并引入如下依赖（不用额外引入jsplumb）

  ```js
    "element-ui": "2.9.1",
    "lodash": "4.17.15",
    "vue": "^2.5.2",
    "vue-codemirror": "^4.0.6",
    "vuedraggable": "2.23.0"
  ```

- 将easy-flow/src/components/ef 目录复制到自己工程的一个目录下（如/src/views）

- 修改main.js，引入elementUI和easy-flow样式

  ```js
  import ElementUI from 'element-ui'
  import 'element-ui/lib/theme-chalk/index.css'
  import '@/这个为复制后的目录，src就不要写了/ef/index.css'
  Vue.use(ElementUI, {size: 'small'})
  ```


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

## github
https://github.com/BiaoChengLiu/easy-flow

## 码云
https://gitee.com/xiaoka2017/easy-flow

## 交流群

QQ群：534446043

![avatar](https://gitee.com/xiaoka2017/resource/raw/master/easy-flow/qrcode_1575887795029.jpg)

## 协议
符合项目package.json中使用的插件中规定的协议即可

## 学习资料
| 名称        | 地址                                             | 说明                         |
| ----------- | ------------------------------------------------ | ---------------------------- |
| 后端SDK     | https://gitee.com/xiaoka2017/easy-flow-sdk       | 一个后端数据存储、操作的案例 |
| 学习资料    | https://www.cnblogs.com/mq0036/p/7942139.html    |                              |
| jsplumb官网 | http://jsplumb.github.io/jsplumb/home.html#setup | jsplumb官网api说明           |

