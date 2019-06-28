<template>
    <div v-if="easyFlowVisible">
        <el-row>
            <el-col :span="3" ref="flowTool">
                <flowTool @addNode="addNode"></flowTool>
            </el-col>
            <el-col :span="21">
                <el-row>
                    <el-col :span="24">
                        <div style="margin-bottom: 5px; margin-left: 10px">
                            <el-link type="primary">流程名称</el-link>
                            <el-button type="primary" icon="el-icon-document" size="mini" @click="dataInfo">流程信息
                            </el-button>
                            <el-button type="warning" icon="el-icon-warning-outline" size="mini" @click="help">帮助
                            </el-button>
                            <el-button type="primary" @click="dataReload" size="mini" icon="el-icon-refresh">重新载入</el-button>
                        </div>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <!--画布-->
                        <div id="flowContainer" class="container">
                            <template v-for="node in nodeList">
                                <flow-node
                                        v-show="node.show"
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

        <flow-help v-if="flowHelpVisible" ref="flowHelp"></flow-help>
    </div>

</template>

<script>
    import draggable from 'vuedraggable'
    import {jsPlumb} from 'jsplumb'
    import flowNode from '@/components/flow/node'
    import flowTool from '@/components/flow/tool'
    import FlowInfo from '@/components/flow/info'
    import FlowHelp from '@/components/flow/help'
    import lodash from 'lodash'
    import {getData} from './data'

    export default {
        name: "easyFlow",
        data() {
            return {
                jsPlumb: null,// jsPlumb 实例
                easyFlowVisible: true,
                flowInfoVisible: false,
                flowHelpVisible: false,
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
                        top: '15px',
                        ico: 'el-icon-user-solid',
                        show: true
                    },
                    {
                        id: 'nodeB',
                        name: '节点B',
                        left: '400px',
                        top: '200px',
                        ico: 'el-icon-goods',
                        show: true
                    },
                    {
                        id: 'nodeC',
                        name: '节点C',
                        left: '800px',
                        top: '200px',
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
        },
        components: {
            draggable, flowNode, flowTool, FlowInfo, FlowHelp
        },
        mounted() {
            this.jsPlumb = jsPlumb.getInstance()
            this.$nextTick(()=>{
                this.jsPlumbInit()
            })
        },
        methods: {
            jsPlumbInit() {
                const _this = this
                this.jsPlumb.ready(function () {

                    // 导入默认配置
                    _this.jsPlumb.importDefaults(_this.jsplumbSetting)
                    // 会使整个jsPlumb立即重绘。
                    _this.jsPlumb.setSuspendDrawing(false,true);
                    // 初始化节点
                    _this.loadEasyFlow()

                    // 单点击了连接线,
                    _this.jsPlumb.bind('click', function (conn, originalEvent) {
                        console.log("click", conn)

                        _this.$confirm('确定删除所点击的线吗?', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            _this.jsPlumb.deleteConnection(conn)
                        }).catch(() => {
                        })
                    })
                    // 连线
                    _this.jsPlumb.bind("connection", function (evt) {
                        console.log('connection', evt)
                        let from = evt.source.id
                        let to = evt.target.id
                        if (_this.loadEasyFlowFinish) {
                            _this.lineList.push({
                                from: from,
                                to: to
                            })
                        }
                    })

                    // 删除连线
                    _this.jsPlumb.bind("connectionDetached", function (evt) {
                        console.log('connectionDetached', evt)
                        _this.deleteLine(evt.sourceId, evt.targetId)
                    })

                    // 改变线的连接节点
                    _this.jsPlumb.bind("connectionMoved", function (evt) {
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
                    _this.jsPlumb.bind("contextmenu", function (evt) {
                        console.log('contextmenu', evt)
                    })


                    // beforeDrop
                    _this.jsPlumb.bind("beforeDrop", function (evt) {
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
                    _this.jsPlumb.bind("beforeDetach", function (evt) {
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
                    this.jsPlumb.makeSource(node.id, this.jsplumbSourceOptions)
                    // // 设置目标点，其他源点拖出的线可以连接该节点
                    this.jsPlumb.makeTarget(node.id, this.jsplumbTargetOptions)
                    // jsPlumb.addEndpoint(node.id)
                    // 设置可拖拽
                    // jsPlumb.draggable(node.id, {
                    //     containment: 'parent',
                    //     grid: [10, 10]
                    // })

                    this.jsPlumb.draggable(node.id, {
                        containment: 'parent'
                    })

                    // jsPlumb.draggable(node.id)
                }

                // 初始化连线
                for (var i = 0; i < this.lineList.length; i++) {
                    let line = this.lineList[i]
                    this.jsPlumb.connect({
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
            addNode(evt, nodeMenu) {
                console.log('添加节点', evt, nodeMenu)
                let width = this.$refs.flowTool.$el.clientWidth
                const index = this.index++
                let nodeId = 'node' + index
                this.nodeList.push({
                    id: 'node' + index,
                    name: '节点' + index,
                    left: evt.originalEvent.layerX - width + 'px',
                    top: evt.originalEvent.clientY - 50 + 'px',
                    ico: nodeMenu.ico,
                    show: true
                })
                this.$nextTick(function () {

                    this.jsPlumb.makeSource(nodeId, this.jsplumbSourceOptions)

                    this.jsPlumb.makeTarget(nodeId, this.jsplumbTargetOptions)

                    this.jsPlumb.draggable(nodeId, {
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
                    type: 'warning',
                    closeOnClickModal: false
                }).then(() => {

                    this.nodeList =  this.nodeList.filter(function (node) {

                        // return node.id !== nodeId
                        if (node.id === nodeId){
                            node.show = false
                        }
                        return true
                    })

                    this.$nextTick(function () {
                        console.log('删除'+nodeId)
                        this.jsPlumb.removeAllEndpoints(nodeId);
                    })
                }).catch(() => {
                })
                return true
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
            },
            // 帮助
            help() {
                this.flowHelpVisible = true
                this.$nextTick(function () {
                    this.$refs.flowHelp.init()
                })
            },
            // 数据重新载入
            dataReload() {
                this.easyFlowVisible = false
                this.nodeList = []
                this.lineList = []
                this.$nextTick(() => {
                    // 这里模拟后台获取数据、然后加载
                    let data = getData()
                    data = lodash.cloneDeep(data)
                    this.easyFlowVisible = true
                    this.nodeList = data.nodeList
                    this.lineList = data.lineList
                    this.$nextTick(() => {
                        this.jsPlumb = jsPlumb.getInstance()
                        this.$nextTick(() => {
                            this.jsPlumbInit()
                        })
                    })
                })
            }
        }
    }
</script>

<style>
    #flowContainer {
        background-image: linear-gradient(90deg, rgba(0, 0, 0, 0.15) 10%, rgba(0, 0, 0, 0) 10%), linear-gradient(rgba(0, 0, 0, 0.15) 10%, rgba(0, 0, 0, 0) 10%);
        background-size: 10px 10px;
        height: 500px;
        background-color: rgb(251, 251, 251);
        /*background-color: #42b983;*/
        position: relative;
    }
</style>
