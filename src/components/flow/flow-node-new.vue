<template>
  <div
    ref="node"
    :style="flowNodeContainer"
    @mouseenter="showDelete"
    @mouseleave="hideDelete"
    @mouseup="changeNodeSite"
  >
    <div class="flow-node-header">
      <img src="@/assets/node-img.png" class="flow-node-drag">
      <div style="position: absolute;top: 0px;right: 0px;line-height: 25px" v-show="mouseEnter">
        <a href="#" style="" @click="editNode"><img src="@/assets/edit.png"></a>&nbsp;
        <a href="#" style="" @click="deleteNode"><img src="@/assets/delete.png"></a> &nbsp;
      </div>
    </div>
    <div class="flow-node-body">
      {{nodeName}}
    </div>
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
        // 控制节点操作显示
        mouseEnter: false
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
            width: '200px',
            top: this.top,
            left: this.left,
            boxShadow: this.mouseEnter ? '#66a6e0 0px 0px 12px 0px' : '',
            backgroundColor: 'transparent'
          }
        }
      }
    },
    methods: {
      // 删除节点
      deleteNode() {
        this.$emit('deleteNode', this.nodeId)
      },
      // 编辑节点
      editNode() {
        this.$emit('editNode', this.nodeId)
      },
      // 鼠标进入
      showDelete() {
        this.mouseEnter = true
      },
      // 鼠标离开
      hideDelete() {
        this.mouseEnter = false
      },
      // 鼠标移动后抬起
      changeNodeSite() {
        this.$emit('changeNodeSite', {
          nodeId: this.nodeId,
          left: this.$refs.node.style.left,
          top: this.$refs.node.style.top,
        })
      }
    }
  }
</script>

<style>

  .flow-node-drag {
    width: 25px;
    height: 25px;
  }

  .flow-node-header {
    background-color: #66a6e0;
    height: 25px;
    cursor: pointer;
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
  }

  .flow-node-header a {
    text-decoration: none;
    line-height: 25px;
    vertical-align: middle;
  }

  .flow-node-header a img {
    line-height: 25px;
    vertical-align: middle;
    margin-bottom: 5px;
  }

  .flow-node-body {
    background-color: beige;
    text-align: center;
    cursor: pointer;
    height: 25px;
    line-height: 25px;
    border-bottom-left-radius: 6px;
    border-bottom-right-radius: 6px;
  }
</style>
