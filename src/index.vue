<template>
  <div>
    <!--画布-->
    <div>
      <el-row>
        <el-col :xs="8" :sm="6" :md="4" :lg="3" :xl="3" style="background-color: #66a6e0;height: 100%; height: 445px;">
          <flowTool @addNode="addNode"></flowTool>
        </el-col>
        <el-col :xs="16" :sm="18" :md="20" :lg="21" :xl="21" style="background-color:darkred;height: 100%">
          <div id="flowContainer">
            <template v-for="node in nodeList">
              <flow-node
                :id="node.id"
                :nodeId="node.id"
                :nodeName="node.name"
                :top="node.top"
                :left="node.left"
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
    </div>

    <el-row :gutter="20" style="margin-top: 10px">
      <el-col :span="12">
        <el-card>
          <div slot="header" class="clearfix">
            <span>连线信息</span>
          </div>
          {{lineList}}
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card>
          <div slot="header" class="clearfix">
            <span>节点信息</span>
          </div>
          {{nodeList}}
        </el-card>
      </el-col>
    </el-row>

  </div>

</template>

<script>
  import draggable from 'vuedraggable'
  import {jsPlumb} from 'jsplumb'
  import flowNode from '@/components/flow/flow-node-new'
  import flowTool from '@/components/flow/flow-tool'

  export default {
    data() {
      return {
        index: 1,
        // 默认设置参数
        jsplumbSetting: {
          // 动态锚点、位置自适应
          Anchors: ['Top', 'TopCenter', 'TopRight', 'TopLeft', 'Right', 'RightMiddle', 'Bottom', 'BottomCenter', 'BottomRight', 'BottomLeft', 'Left', 'LeftMiddle'],
          Container: '#flowContainer',
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
          RenderMode: "dom"
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
          anchor: "Continuous"
        },
        jsplumbTargetOptions: {
          filter: ".flow-node-drag",/*"span"表示标签，".className"表示类，"#id"表示元素id*/
          filterExclude: false,
          anchor: "Continuous"
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
      draggable, flowNode, flowTool
    },
    mounted() {
      this.jsPlumbInit()
    },
    computed: {},
    methods: {
      jsPlumbInit() {
        const _this = this
        jsPlumb.ready(function () {

          // 导入默认配置
          jsPlumb.importDefaults(_this.jsplumbSetting)


          _this.loadEasyFlow()

          // 单点击了连接线,
          jsPlumb.bind('click', function (conn, originalEvent) {
            console.log("click", conn)
            if (confirm('确定删除所点击的链接吗？')) {
              jsPlumb.deleteConnection(conn)
            }
          })

          // 连线
          jsPlumb.bind("connection", function (evt) {
            console.log('connection', evt)
            let from = evt.sourceId
            let to = evt.targetId
            if (_this.loadEasyFlowFinish) {
              _this.lineList.push({
                fron: from,
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
              console.log('不能连接自己')
              return false
            }
            if (_this.hashOppositeLine(from, to)) {
              console.log('不能回环哦')
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
          // jsPlumb.draggable(node.id, {containment: 'parent'})
          jsPlumb.draggable(node.id)
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
          left: evt.originalEvent.offsetX + 'px',
          top: evt.originalEvent.offsetY + 'px'
        })
        this.$nextTick(function () {

          jsPlumb.makeSource(nodeId, this.jsplumbSourceOptions)

          jsPlumb.makeTarget(nodeId, this.jsplumbTargetOptions)

          jsPlumb.draggable(nodeId)

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
        if (confirm('确定要删除该节点吗?')) {
          console.log("删除节点" + nodeId)
          this.nodeList = this.nodeList.filter(function (node) {
            return node.id !== nodeId
          })

          this.$nextTick(function () {
            jsPlumb.removeAllEndpoints(nodeId);
          })
        }
      },
      editNode(nodeId) {
        console.log('编辑节点', nodeId)
      }
    }
  }
</script>

<style>
  #flowContainer {
    background-image: linear-gradient(90deg, rgba(0, 0, 0, 0.15) 10%, rgba(0, 0, 0, 0) 10%), linear-gradient(rgba(0, 0, 0, 0.15) 10%, rgba(0, 0, 0, 0) 10%);
    background-size: 10px 10px;
    width: 100%;
    height: 445px;
    background-color: rgb(251, 251, 251);
  }

</style>
