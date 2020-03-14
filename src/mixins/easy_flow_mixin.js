export const easyFlowMixin = {
    data() {
        return {
            jsplumbSetting: {
                // 动态锚点、位置自适应
                Anchors: ['Top', 'TopCenter', 'TopRight', 'TopLeft', 'Right', 'RightMiddle', 'Bottom', 'BottomCenter', 'BottomRight', 'BottomLeft', 'Left', 'LeftMiddle'],
                Container: 'flowContainer',
                // 连线的样式 StateMachine、Flowchart，Bezier
                Connector: 'Flowchart',
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
                // 绘制线
                PaintStyle: {stroke: '#E0E3E7', strokeWidth: 1},
                // 绘制箭头
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
                },
                scope: 'green dot'
                // 鼠标滑过线的样式
                // HoverPaintStyle: {stroke: '#1879FF'},
                // 滑过锚点效果
                // EndpointHoverStyle: {fill: 'red'}
            },
            // jsplumb连接参数
            jsplumbConnectOptions: {
                isSource: true,
                isTarget: true,
                // 动态锚点、提供了4个方向 Continuous、AutoDefault
                anchor: 'Continuous'
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
