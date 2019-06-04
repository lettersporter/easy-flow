<template>
    <div>
        <el-row>
            <el-col :span="3">
                <flowTool @addNode="addNode"></flowTool>
            </el-col>
            <el-col :span="21">
                <el-row>
                    <el-col :span="24">
                        <div style="margin-bottom: 5px; margin-left: 5px">
                            <el-link type="primary">流程名称</el-link>
                            <el-button type="primary" icon="el-icon-edit" round
                                       size="mini" @click="dataInfo">流程信息
                            </el-button>
                            <el-button type="success" icon="el-icon-check" round size="mini">保存</el-button>
                        </div>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <!--画布-->
                        <div id="flowContainer" class="container">
                            <template v-for="node in nodeList">
                                <flow-node
                                        :id="node.id"
                                        :node="node"
                                        @deleteNode="deleteNode"
                                        @changeNodeSite="changeNodeSite"
                                        @nodeRightMenu="nodeRightMenu"
                                        @editNode="editNode"
                                >
                                </flow-node>
                            </template>
                        </div>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>

        <flow-info v-if="flowInfoVisible" ref="flowInfo" :lineList="lineList" :nodeList="nodeList"></flow-info>

    </div>

</template>

<script>
    import draggable from 'vuedraggable'
    import {jsPlumb} from 'jsplumb'
    import flowNode from '@/components/flow/node'
    import flowTool from '@/components/flow/tool'
    import FlowInfo from '@/components/flow/info'

    export default {
        data() {
            return {
                flowInfoVisible: false,
                index: 1,
                // 默认设置参数
                jsplumbSetting: {
                    // 动态锚点、位置自适应
                    Anchors: ['Top', 'TopCenter', 'TopRight', 'TopLeft', 'Right', 'RightMiddle', 'Bottom', 'BottomCenter', 'BottomRight', 'BottomLeft', 'Left', 'LeftMiddle'],
                    Container: 'flowContainer',
                    // 连线的样式 StateMachine、Flowchart
                    Connector: 'Flowchart',
                    // 鼠标不能拖动删除线
                    ConnectionsDetachable: false,
                    // 删除线的时候节点不删除
                    DeleteEndpointsOnDetach: false,
                    // 连线的端点
                    // Endpoint: ["Dot", {radius: 5}],
                    Endpoint: ["Rectangle", {height: 10, width: 10}],
                    // 线端点的样式
                    EndpointStyle: {fill: 'rgba(255,255,255,0)', outlineWidth: 1},
                    LogEnabled: true,//是否打开jsPlumb的内部日志记录
                    // 绘制线
                    PaintStyle: {stroke: 'black', strokeWidth: 3},
                    // 绘制箭头
                    Overlays: [['Arrow', {width: 12, length: 12, location: 1}]],
                    RenderMode: "svg"
                },
                // jsplumb连接参数
                jsplumbConnectOptions: {
                    isSource: true,
                    isTarget: true,
                    // 动态锚点、提供了4个方向 Continuous、AutoDefault
                    anchor: "Continuous"
                },
                jsplumbSourceOptions: {
                    filter: ".flow-node-drag",/*"span"表示标签，".className"表示类，"#id"表示元素id*/
                    filterExclude: false,
                    anchor: "Continuous",
                    allowLoopback: false
                },
                jsplumbTargetOptions: {
                    filter: ".flow-node-drag",/*"span"表示标签，".className"表示类，"#id"表示元素id*/
                    filterExclude: false,
                    anchor: "Continuous",
                    allowLoopback: false
                },
                // 是否加载完毕
                loadEasyFlowFinish: false,
                nodeList: [
                    {
                        id: 'nodeA',
                        name: '节点A',
                        left: '400px',
                        top: '15px'
                    },
                    {
                        id: 'nodeB',
                        name: '节点B',
                        left: '400px',
                        top: '200px'
                    },
                    {
                        id: 'nodeC',
                        name: '节点C',
                        left: '800px',
                        top: '200px'
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
        },
        components: {
            draggable, flowNode, flowTool, FlowInfo
        },
        mounted() {
            this.jsPlumbInit()
        },
        methods: {
            jsPlumbInit() {
                const _this = this
                jsPlumb.ready(function () {

                    // 导入默认配置
                    jsPlumb.importDefaults(_this.jsplumbSetting)
                    // 初始化节点
                    _this.loadEasyFlow()

                    // 单点击了连接线,
                    jsPlumb.bind('click', function (conn, originalEvent) {
                        console.log("click", conn)

                        _this.$confirm('确定删除所点击的链接吗?', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            jsPlumb.deleteConnection(conn)
                        }).catch(() => {
                        })
                    })
                    // 连线
                    jsPlumb.bind("connection", function (evt) {
                        console.log('connection', evt)
                        let from = evt.sourceId
                        let to = evt.targetId
                        if (_this.loadEasyFlowFinish) {
                            _this.lineList.push({
                                from: from,
                                to: to
                            })
                        }
                    })

                    // 删除连线
                    jsPlumb.bind("connectionDetached", function (evt) {
                        console.log('connectionDetached', evt)
                        _this.deleteLine(evt.sourceId, evt.targetId)
                    })

                    // 改变线的连接节点
                    jsPlumb.bind("connectionMoved", function (evt) {
                        console.log('connectionMoved', evt)
                        _this.changeLine(evt.originalSourceId, evt.originalTargetId)
                    })

                    // 单击endpoint
                    // jsPlumb.bind("endpointClick", function (evt) {
                    //   console.log('endpointClick', evt)
                    // })
                    //
                    // // 双击endpoint
                    // jsPlumb.bind("endpointDblClick", function (evt) {
                    //   console.log('endpointDblClick', evt)
                    // })

                    // contextmenu
                    jsPlumb.bind("contextmenu", function (evt) {
                        console.log('contextmenu', evt)
                    })


                    // beforeDrop
                    jsPlumb.bind("beforeDrop", function (evt) {
                        console.log('beforeDrop', evt)
                        let from = evt.sourceId
                        let to = evt.targetId
                        if (from === to) {
                            _this.$message.error('不能连接自己');
                            return false
                        }
                        if (_this.hasLine(from, to)) {
                            _this.$message.error('不能重复连线');
                            return false
                        }
                        if (_this.hashOppositeLine(from, to)) {
                            _this.$message.error('不能回环哦');
                            return false
                        }
                        return true
                    })

                    // beforeDetach
                    jsPlumb.bind("beforeDetach", function (evt) {
                        console.log('beforeDetach', evt)
                    })
                })
            },
            // 加载流程图
            loadEasyFlow() {

                // 初始化节点
                for (var i = 0; i < this.nodeList.length; i++) {
                    let node = this.nodeList[i]
                    // 设置源点，可以拖出线连接其他节点
                    jsPlumb.makeSource(node.id, this.jsplumbSourceOptions)
                    // // 设置目标点，其他源点拖出的线可以连接该节点
                    jsPlumb.makeTarget(node.id, this.jsplumbTargetOptions)
                    // jsPlumb.addEndpoint(node.id)
                    // 设置可拖拽
                    // jsPlumb.draggable(node.id, {
                    //     containment: 'parent',
                    //     grid: [10, 10]
                    // })

                    jsPlumb.draggable(node.id, {
                        containment: 'parent'
                    })

                    // jsPlumb.draggable(node.id)
                }

                // 初始化连线
                for (var i = 0; i < this.lineList.length; i++) {
                    let line = this.lineList[i]
                    jsPlumb.connect({
                        source: line.from,
                        target: line.to,
                    }, this.jsplumbConnectOptions)
                }
                this.$nextTick(function () {
                    this.loadEasyFlowFinish = true
                })
            },
            getNodes() {
                console.log(jsPlumb)
                console.log(jsPlumb.Defaults)
            },
            getLines() {
                console.log('线', jsPlumb.getConnections())
            },
            // 删除线
            deleteLine(from, to) {
                this.lineList = this.lineList.filter(function (line) {
                    return line.from !== from && line.to !== to
                })
            },
            // 改变连线
            changeLine(oldFrom, oldTo) {
                this.deleteLine(oldFrom, oldTo)
            },
            // 改变节点的位置
            changeNodeSite(data) {
                for (var i = 0; i < this.nodeList.length; i++) {
                    let node = this.nodeList[i]
                    if (node.id === data.nodeId) {
                        node.left = data.left
                        node.top = data.top
                    }
                }
            },
            // 添加新的节点
            addNode(evt) {
                console.log('添加节点', evt)
                const index = this.index++
                let nodeId = 'node' + index
                this.nodeList.push({
                    id: 'node' + index,
                    name: '节点' + index,
                    left: evt.originalEvent.layerX + 'px',
                    top: evt.originalEvent.layerY + 'px'
                })
                this.$nextTick(function () {

                    jsPlumb.makeSource(nodeId, this.jsplumbSourceOptions)

                    jsPlumb.makeTarget(nodeId, this.jsplumbTargetOptions)

                    jsPlumb.draggable(nodeId, {
                        containment: 'parent'
                    })

                })
            },
            // 是否具有该线
            hasLine(from, to) {
                for (var i = 0; i < this.lineList.length; i++) {
                    var line = this.lineList[i]
                    if (line.from === from && line.to === to) {
                        return true
                    }
                }
                return false
            },
            // 是否含有相反的线
            hashOppositeLine(from, to) {
                return this.hasLine(to, from)
            },
            nodeRightMenu(nodeId, evt) {
                this.menu.show = true
                this.menu.curNodeId = nodeId
                this.menu.left = evt.x + 'px'
                this.menu.top = evt.y + 'px'
            },
            deleteNode(nodeId) {

                this.$confirm('确定要删除节点' + nodeId + '?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {

                    this.nodeList = this.nodeList.filter(function (node) {
                        return node.id !== nodeId
                    })

                    this.$nextTick(function () {
                        jsPlumb.removeAllEndpoints(nodeId);
                    })
                }).catch(() => {
                })
            },
            editNode(nodeId) {
                console.log('编辑节点', nodeId)
                this.$message({
                    type: 'success',
                    message: `你可以在这里弹个页面进行节点${nodeId}信息修改!`
                });
            },
            // 流程数据信息
            dataInfo() {
                this.flowInfoVisible = true
                this.$nextTick(function () {
                    this.$refs.flowInfo.init()
                })
            }
        }
    }
</script>

<style>
    #flowContainer {
        background-image: linear-gradient(90deg, rgba(0, 0, 0, 0.15) 10%, rgba(0, 0, 0, 0) 10%), linear-gradient(rgba(0, 0, 0, 0.15) 10%, rgba(0, 0, 0, 0) 10%);
        background-size: 10px 10px;
        height: 445px;
        background-color: rgb(251, 251, 251);
        /*background-color: #42b983;*/
        position: relative;
    }

</style>
