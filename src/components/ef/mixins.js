export const easyFlowMixin = {
    data () {
        return {
            jsplumbSetting: {
                // 动态锚点、位置自适应
                Anchors: ['Top', 'TopCenter', 'TopRight', 'TopLeft', 'Right', 'RightMiddle', 'Bottom', 'BottomCenter', 'BottomRight', 'BottomLeft', 'Left', 'LeftMiddle'],
                // 容器ID
                Container: 'efContainer',
                // 连线的样式，直线或者曲线等，可选值:  StateMachine、Flowchart，Bezier、Straight
                // Connector: ['Flowchart', {curviness: 50}],
                Connector: ['Bezier', {stub: [0, 0], gap: 1, cornerRadius: 5, alwaysRespectStubs: true}],
                // 鼠标不能拖动删除线
                ConnectionsDetachable: false,
                // 删除线的时候节点不删除
                DeleteEndpointsOnDetach: false,
                /**
                 * 连线的两端端点类型：圆形
                 * radius: 圆的半径，越大圆越大
                 */
                Endpoint: ['Dot', {radius: 5}],
                /**
                 * 连线的两端端点类型：矩形
                 * height: 矩形的高
                 * width: 矩形的宽
                 */
                // Endpoint: ['Rectangle', {height: 20, width: 20}],
                /**
                 * 连线的两端端点样式
                 * fill: 颜色值，如：#12aabb，为空不显示
                 * outlineWidth: 外边线宽度
                 */
                EndpointStyle: {fill: '', outlineWidth: 1},
                // 是否打开jsPlumb的内部日志记录
                LogEnabled: true,
                /**
                 * 连线的样式
                 */
                PaintStyle: {
                    // 线的颜色
                    stroke: '#E0E3E7',
                    // 线的粗细，值越大线越粗
                    strokeWidth: 1,
                    // 设置外边线的颜色，默认设置透明，这样别人就看不见了，点击线的时候可以不用精确点击，参考 https://blog.csdn.net/roymno2/article/details/72717101
                    outlineStroke: 'transparent',
                    // 线外边的宽，值越大，线的点击范围越大
                    outlineWidth: 10
                },
                /**
                 * 箭头
                 */
                Overlays: [
                    ['Arrow', {width: 10, length: 8, location: 1, foldback: 0.8}],
                    ['Label', {location: 0.1, id: 'label', cssClass: 'aLabel'}]
                ],
                // 绘制图的模式 svg、canvas
                RenderMode: 'svg',
                // 鼠标滑过线的样式
                HoverPaintStyle: {stroke: '#b0b2b5', strokeWidth: 1}
                // 滑过锚点效果
                // EndpointHoverStyle: {fill: 'red'}
            },
            /**
             * 连线参数
             */
            jsplumbConnectOptions: {
                isSource: true,
                isTarget: true,
                // 动态锚点、提供了4个方向 Continuous、AutoDefault
                anchor: 'Continuous',
                // 设置连线上面的label样式
                labelStyle: {
                    cssClass: 'flowLabel'
                },
                // 修改了jsplumb 源码，支持label 为空传入自定义style
                emptyLabelStyle: {
                    cssClass: 'emptyFlowLabel'
                }
            },
            /**
             * 源点配置参数
             */
            jsplumbSourceOptions: {
                // 设置可以拖拽的类名，只要鼠标移动到该类名上的DOM，就可以拖拽连线
                filter: '.flow-node-drag',
                filterExclude: false,
                anchor: 'Continuous',
                allowLoopback: false
            },
            jsplumbTargetOptions: {
                // 设置可以拖拽的类名，只要鼠标移动到该类名上的DOM，就可以拖拽连线
                filter: '.flow-node-drag',
                filterExclude: false,
                anchor: 'Continuous',
                allowLoopback: false
            }
        }
    }
}
