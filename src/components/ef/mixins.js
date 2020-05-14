export const easyFlowMixin = {
    data() {
        return {
            jsplumbSetting: {
                // 动态锚点、位置自适应
                Anchors: ['Top', 'TopCenter', 'TopRight', 'TopLeft', 'Right', 'RightMiddle', 'Bottom', 'BottomCenter', 'BottomRight', 'BottomLeft', 'Left', 'LeftMiddle'],
                Container: 'efContainer',
                // 连线的样式 StateMachine、Flowchart，Bezier、Straight
                // Connector: ['Flowchart', {curviness: 50}],
                Connector: ['Bezier', {stub: [0, 0], gap: 1, cornerRadius: 5, alwaysRespectStubs: true}],
                // 鼠标不能拖动删除线
                ConnectionsDetachable: false,
                // 删除线的时候节点不删除
                DeleteEndpointsOnDetach: false,
                // 连线的端点：圆形
                Endpoint: ['Dot', {radius: 3}],
                // 连线的端点：矩形
                // Endpoint: ['Rectangle', {height: 10, width: 10}],
                // 线端点的样式
                EndpointStyle: {fill: '', outlineWidth: 1},
                // 是否打开jsPlumb的内部日志记录
                LogEnabled: true,
                // 绘制连线
                PaintStyle: {
                    stroke: '#E0E3E7',
                    strokeWidth: 1,
                    // 设置外边线的颜色、无色，为了方便点击 https://blog.csdn.net/roymno2/article/details/72717101
                    outlineStroke: 'transparent',
                    // 设定线外边的宽，单位px
                    outlineWidth: 10
                },
                // 绘制连线箭头
                Overlays: [
                    ['Arrow', {width: 10, length: 8, location: 1, foldback: 0.8}],
                    ['Label', {location: 0.1, id: 'label', cssClass: 'aLabel'}]
                ],
                // 绘制图的模式 svg、canvas
                RenderMode: 'svg',
                // 没看到效果
                DragOptions: {
                    cursor: 'pointer',
                    zIndex: 2000,
                    hoverClass: 'dropHover',
                    activeClass: 'dragActive'
                }
                // 鼠标滑过线的样式
                // HoverPaintStyle: {stroke: '', strokeWidth: 0, cursor: 'pointer'}
                // 滑过锚点效果
                // EndpointHoverStyle: {fill: 'red'}
            },
            // jsplumb连接参数
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
            jsplumbSourceOptions: {
                /* "span"表示标签，".className"表示类，"#id"表示元素id */
                filter: '.flow-node-drag',
                filterExclude: false,
                anchor: 'Continuous',
                allowLoopback: false
            },
            jsplumbTargetOptions: {
                // "span"表示标签，".className"表示类，"#id"表示元素id
                filter: '.flow-node-drag',
                filterExclude: false,
                anchor: 'Continuous',
                allowLoopback: false
            }
        }
    }
}
