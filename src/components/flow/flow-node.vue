<template>
  <div
    :style="flowNodeContainer"
    @mouseenter="showDelete"
    @mouseleave="hideDelete"
    @mouseup="changeNodeSite"
    @contextmenu.prevent="rightMenu"
    ref="node"
  >
    <div class="flow-node-close" @click="deleteNode" :style="flowNodeClose">
      <img src="@/assets/node-close.png">
    </div>
    <div class="flow-node-img">
      <img src="@/assets/node-img.png" class="flow-node-drag">
    </div>
    <div class="flow-node-text">{{nodeName}}</div>
  </div>
</template>

<script>
  export default {
    props: {
      nodeId: {
        type: String
      },
      nodeName: {
        type: String
      },
      top: {
        type: String
      },
      left: {
        type: String
      }
    },
    data() {
      return {
        // 控制节点删除的图标显示、隐藏
        flowNodeCloseShow: false
      }
    },
    mounted() {

    },
    computed: {
      // 节点容器样式
      flowNodeContainer: {
        get() {
          return {
            position: 'absolute',
            width: '100px',
            height: '50px',
            top: this.top,
            left: this.left,
            backgroundColor: 'royalblue',
            border: '2px solid black'
          }
        }
      },
      // 节点关闭样式
      flowNodeClose: {
        get() {
          return {display: this.flowNodeCloseShow ? '' : 'none'}
        }
      }
    },
    methods: {
      // 删除节点
      deleteNode() {
        this.$emit('deleteNode', this.nodeId)
      },
      // 鼠标进入
      showDelete() {
        this.flowNodeCloseShow = true
      },
      // 鼠标离开
      hideDelete() {
        this.flowNodeCloseShow = false
      },
      // 鼠标移动后抬起
      changeNodeSite() {
        this.$emit('changeNodeSite', {
          nodeId: this.nodeId,
          left: this.$refs.node.style.left + 'px',
          top: this.$refs.node.style.top + 'px',
        })
      },
      rightMenu(evt) {
        this.$emit('nodeRightMenu', this.nodeId, evt)
      }
    }
  }
</script>

<style>

  .flow-node-img {
    background-color: aliceblue;
    line-height: 50px;
    position: absolute;
    top: 0px;
    left: 0px;
    width: 30px;
    text-align: center;
    vertical-align: middle;
  }

  .flow-node-img img {
    ext-align: center;
    vertical-align: middle;
  }

  .flow-node-text {
    background-color: beige;
    line-height: 50px;
    position: absolute;
    top: 0px;
    left: 30px;
    width: 70px;
    text-align: center;
    cursor: pointer;
  }

  .flow-node-close {
    position: absolute;
    top: 0px;
    left: 70px;
    z-index: 999;
    text-align: center;
  }

</style>
