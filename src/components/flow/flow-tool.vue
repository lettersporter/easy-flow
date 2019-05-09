<template>
  <div style="background-color: #66a6e0;">
    <template v-for="tool in toolList">
      <div class="flow-tool-menu">{{tool.name}}</div>
      <template v-for="son in  tool.children">
        <draggable @end="addNode">
          <div class="flow-tool-submenu">
            <div style="vertical-align: middle;">
              <img src="@/assets/node-timer.png">{{son.name}}
            </div>
          </div>
        </draggable>
      </template>
    </template>
  </div>
</template>
<script>
  import draggable from 'vuedraggable'

  export default {
    data() {
      return {
        toolList: [
          {
            type: 'start',
            name: '开始节点',
            ico: '',
            children: [
              {
                type: 'timer',
                name: '节点A',
                ico: '',
              }, {
                type: 'task',
                name: '节点B',
                ico: '',
              }
            ]
          },
          {
            type: 'end',
            name: '结束节点',
            ico: '',
            children: [
              {
                type: 'timer',
                name: '节点C',
                ico: '',
              }, {
                type: 'task',
                name: '节点D',
                ico: '',
              }
            ]
          }
        ]
      }
    },
    components: {
      draggable
    },
    methods: {
      // 添加节点
      addNode(evt) {
        this.$emit('addNode', evt)
      }
    }
  }
</script>
<style>
  .flow-tool-menu {
    background-color: #eeeeee;
    cursor: pointer;
    padding-left: 5px;
    height: 50px;
    line-height: 50px;
    border-bottom: 1px solid #979797
  }

  .flow-tool-submenu {
    background-color: white;
    padding-left: 20px;
    cursor: pointer;
    height: 50px;
    line-height: 50px;
    vertical-align: middle;
    border-bottom: 1px solid #d3d3d3
  }
</style>
