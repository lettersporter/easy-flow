<template>
    <div v-if="easyFlowVisible">
        <el-row>
            <!--顶部工具菜单-->
            <el-col :span="24">
                <div class="flow-tooltar">
                    <el-link type="primary">{{data.name}}</el-link>
                    <el-button icon="el-icon-document" @click="dataInfo" size="mini">流程信息</el-button>
                    <el-button @click="dataReloadA" icon="el-icon-refresh" size="mini">切换流程A</el-button>
                    <el-button @click="dataReloadB" icon="el-icon-refresh" size="mini">切换流程B</el-button>
                    <el-button @click="dataReloadC" icon="el-icon-refresh" size="mini">切换流程C</el-button>
                    <el-button @click="changeLabel" icon="el-icon-edit-outline" size="mini">设置线</el-button>
                </div>
            </el-col>
        </el-row>
        <el-row>
            <!--左侧可以拖动的菜单-->
            <el-col :span="2" ref="nodeMenu">
                <node-menu @addNode="addNode"></node-menu>
            </el-col>
            <el-col :span="22">
                <el-row>
                    <!--画布-->
                    <el-col :span="18">
                        <div id="flowContainer" ref="flowContainer" class="container">
                            <template v-for="node in data.nodeList">
                                <flow-node
                                        v-show="node.show"
                                        :id="node.id"
                                        :node="node"
                                        @deleteNode="deleteNode"
                                        @changeNodeSite="changeNodeSite"
                                        @nodeRightMenu="nodeRightMenu"
                                        @clickNode="clickNode"
                                >
                                </flow-node>
                            </template>
                        </div>
                    </el-col>
                    <el-col :span="6">
                        <flow-node-form ref="nodeForm"></flow-node-form>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
        <!-- 流程数据详情 -->
        <flow-info v-if="flowInfoVisible" ref="flowInfo" :data="data"></flow-info>
    </div>

</template>

<script>
    import draggable from 'vuedraggable'
    import { jsPlumb } from 'jsplumb'
    import { easyFlowMixin } from '@/mixins/easy_flow_mixin'
    import flowNode from '@/components/flow/node'
    import nodeMenu from '@/components/flow/node_menu'
    import FlowInfo from '@/components/flow/info'
    import FlowNodeForm from './node_form'
    import lodash from 'lodash'
    import { getDataA } from './data_A'
    import { getDataB } from './data_B'
    import { getDataC } from './data_C'

    export default {
        data() {
            return {
                // jsPlumb 实例
                jsPlumb: null,
                // 控制画布销毁
                easyFlowVisible: true,
                // 控制流程数据显示与隐藏
                flowInfoVisible: false,
                // 是否加载完毕标志位
                loadEasyFlowFinish: false,
                // 数据
                data: {}
            }
        },
        // 一些基础配置移动该文件中
        mixins: [easyFlowMixin],
        components: {
            draggable, flowNode, nodeMenu, FlowInfo, FlowNodeForm
        },
        mounted() {
            this.jsPlumb = jsPlumb.getInstance()
            this.$nextTick(() => {
                // 默认加载流程A的数据、在这里可以根据具体的业务返回符合流程数据格式的数据即可
                this.dataReload(getDataB())
            })
        },
        methods: {
            // 返回唯一标识
            getUUID() {
                return Math.random().toString(36).substr(3, 10)
            },
            jsPlumbInit() {
                this.jsPlumb.ready(() => {
                    // 导入默认配置
                    this.jsPlumb.importDefaults(this.jsplumbSetting)
                    // 会使整个jsPlumb立即重绘。
                    this.jsPlumb.setSuspendDrawing(false, true);
                    // 初始化节点
                    this.loadEasyFlow()
                    // 单点击了连接线,
                    this.jsPlumb.bind('click', (conn, originalEvent) => {
                        this.$confirm('确定删除所点击的线吗?', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            this.jsPlumb.deleteConnection(conn)
                        }).catch(() => {
                        })
                    })
                    // 连线
                    this.jsPlumb.bind("connection", (evt) => {
                        let from = evt.source.id
                        let to = evt.target.id
                        if (this.loadEasyFlowFinish) {
                            this.data.lineList.push({from: from, to: to})
                        }
                    })

                    // 删除连线回调
                    this.jsPlumb.bind("connectionDetached", (evt) => {
                        this.deleteLine(evt.sourceId, evt.targetId)
                    })

                    // 改变线的连接节点
                    this.jsPlumb.bind("connectionMoved", (evt) => {
                        this.changeLine(evt.originalSourceId, evt.originalTargetId)
                    })

                    // 连线右击
                    this.jsPlumb.bind("contextmenu", (evt) => {
                        console.log('contextmenu', evt)
                    })

                    // 连线
                    this.jsPlumb.bind("beforeDrop", (evt) => {
                        let from = evt.sourceId
                        let to = evt.targetId
                        if (from === to) {
                            this.$message.error('节点不支持连接自己')
                            return false
                        }
                        if (this.hasLine(from, to)) {
                            this.$message.error('该关系已存在,不允许重复创建')
                            return false
                        }
                        if (this.hashOppositeLine(from, to)) {
                            this.$message.error('不支持两个节点之间连线回环');
                            return false
                        }
                        this.$message.success('连接成功')
                        return true
                    })

                    // beforeDetach
                    this.jsPlumb.bind("beforeDetach", (evt) => {
                        console.log('beforeDetach', evt)
                    })
                })
            },
            // 加载流程图
            loadEasyFlow() {
                // 初始化节点
                for (var i = 0; i < this.data.nodeList.length; i++) {
                    let node = this.data.nodeList[i]
                    // 设置源点，可以拖出线连接其他节点
                    this.jsPlumb.makeSource(node.id, this.jsplumbSourceOptions)
                    // // 设置目标点，其他源点拖出的线可以连接该节点
                    this.jsPlumb.makeTarget(node.id, this.jsplumbTargetOptions)
                    this.jsPlumb.draggable(node.id, {containment: 'parent'})
                }
                // 初始化连线
                for (var i = 0; i < this.data.lineList.length; i++) {
                    let line = this.data.lineList[i]
                    this.jsPlumb.connect({source: line.from, target: line.to}, this.jsplumbConnectOptions)
                }
                this.$nextTick(function () {
                    this.loadEasyFlowFinish = true
                })
            },
            // 删除线
            deleteLine(from, to) {
                this.data.lineList = this.data.lineList.filter(function (line) {
                    if (line.from == from && line.to == to) {
                        return false
                    }
                    return true
                })
            },
            // 改变连线
            changeLine(oldFrom, oldTo) {
                this.deleteLine(oldFrom, oldTo)
            },
            // 改变节点的位置
            changeNodeSite(data) {
                for (var i = 0; i < this.data.nodeList.length; i++) {
                    let node = this.data.nodeList[i]
                    if (node.id === data.nodeId) {
                        node.left = data.left
                        node.top = data.top
                    }
                }
            },
            /**
             * 拖拽结束后添加新的节点
             * @param evt
             * @param nodeMenu 被添加的节点对象
             * @param mousePosition 鼠标拖拽结束的坐标
             */
            addNode(evt, nodeMenu, mousePosition) {
                let width = this.$refs.nodeMenu.$el.clientWidth
                let nodeId = this.getUUID(), left = mousePosition.left, top = mousePosition.top
                if (left < 0) {
                    left = evt.originalEvent.layerX - width
                }
                if (top < 0) {
                    top = evt.originalEvent.clientY - 50
                }
                // 获取容器的坐标范围
                // var containerRect = this.$refs.flowContainer.getBoundingClientRect()
                // var containerX1 = containerRect.x, containerX2 = containerRect.x + containerRect.width
                // var containerY1 = containerRect.y, containerY2 = containerRect.y + containerRect.height
                // console.log(left, top)
                // console.log(containerX1, containerY1, containerX2, containerY2)
                // if (left <= containerX1 || left >= containerX2 || top <= containerY1 || top >= containerY2) {
                //     this.$message.error('请拖入到容器中')
                //     return false
                // }
                var node = {
                    id: nodeId,
                    name: nodeId,
                    type: nodeMenu.type,
                    left: left + 'px',
                    top: top + 'px',
                    ico: nodeMenu.ico,
                    show: true
                }
                /**
                 * 这里可以进行业务判断、是否能够添加该节点
                 */
                this.data.nodeList.push(node)
                this.$nextTick(function () {
                    this.jsPlumb.makeSource(nodeId, this.jsplumbSourceOptions)
                    this.jsPlumb.makeTarget(nodeId, this.jsplumbTargetOptions)
                    this.jsPlumb.draggable(nodeId, {
                        containment: 'parent'
                    })
                })
            },
            /**
             * 删除节点
             * @param nodeId 被删除节点的ID
             */
            deleteNode(nodeId) {
                this.$confirm('确定要删除节点' + nodeId + '?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    closeOnClickModal: false
                }).then(() => {
                    /**
                     * 这里需要进行业务判断，是否可以删除
                     */
                    this.data.nodeList = this.data.nodeList.filter(function (node) {
                        if (node.id === nodeId) {
                            // 伪删除，将节点隐藏，否则会导致位置错位
                            node.show = false
                        }
                        return true
                    })
                    this.$nextTick(function () {
                        this.jsPlumb.removeAllEndpoints(nodeId);
                    })
                }).catch(() => {
                })
                return true
            },
            clickNode(nodeId) {
                console.log('点击')
                this.$refs.nodeForm.init(this.data, nodeId)
            },
            // 是否具有该线
            hasLine(from, to) {
                for (var i = 0; i < this.data.lineList.length; i++) {
                    var line = this.data.lineList[i]
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
            // 流程数据信息
            dataInfo() {
                this.flowInfoVisible = true
                this.$nextTick(function () {
                    this.$refs.flowInfo.init()
                })
            },
            // 加载流程图
            dataReload(data) {
                this.easyFlowVisible = false
                this.data.nodeList = []
                this.data.lineList = []
                this.$nextTick(() => {
                    data = lodash.cloneDeep(data)
                    this.easyFlowVisible = true
                    this.data = data
                    this.$nextTick(() => {
                        this.jsPlumb = jsPlumb.getInstance()
                        this.$nextTick(() => {
                            this.jsPlumbInit()
                        })
                    })
                })
            },
            // 模拟载入数据dataA
            dataReloadA() {
                this.dataReload(getDataA())
            },
            // 模拟载入数据dataB
            dataReloadB() {
                this.dataReload(getDataB())
            },
            // 模拟载入数据dataC
            dataReloadC() {
                this.dataReload(getDataC())
            },
            changeLabel() {
                var lines = this.jsPlumb.getConnections({
                    source: 'nodeA',
                    target: 'nodeB'
                })
                lines[0].setLabel({
                    label: '',
                    cssClass: 'labelClass a b'
                })
            }
        }
    }
</script>

<style>
    #flowContainer {
        /*background-image: linear-gradient(90deg, rgba(0, 0, 0, 0.15) 10%, rgba(0, 0, 0, 0) 10%), linear-gradient(rgba(0, 0, 0, 0.15) 10%, rgba(0, 0, 0, 0) 10%);*/
        background-size: 10px 10px;
        height: 500px;
        background-color: rgb(251, 251, 251);
        /*background-color: #fff;*/
        position: relative;
    }

    .labelClass {
        background-color: white;
        padding: 5px;
        opacity: 0.7;
        border: 1px solid #346789;
        /*border-radius: 10px;*/
        cursor: pointer;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }

    .flow-tooltar {
        padding-left: 10px;
        box-sizing: border-box;
        border: 1px solid #e9e9e9;
        height: 42px;
        line-height: 42px;
        z-index: 3;
        -webkit-box-shadow: 0 8px 12px 0 rgba(0, 52, 107, .04);
        box-shadow: 0 8px 12px 0 rgba(0, 52, 107, .04);
    }
</style>
