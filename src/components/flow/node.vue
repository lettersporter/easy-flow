<template>
    <div
            ref="node"
            :style="nodeContainerStyle"
            @mouseenter="mouseEnter=true"
            @mouseleave="mouseEnter=false"
            @click="clickNode"
            @mouseup="changeNodeSite"
            :class="{'flow-node-container': true,'flow-node-active': flowNodeActive}"
    >
        <!-- 最左侧的那条竖线 -->
        <div class="flow-node-left"></div>
        <!-- 标识节点类型的图标 -->
        <div class="flow-node-left-ico flow-node-drag">
            <i :class="nodeIcoClass"></i>
        </div>
        <!-- 显示的节点名称 -->
        <div class="flow-node-text" :show-overflow-tooltip="true">
            {{node.name}}
        </div>
        <!-- 鼠标移入到节点中显示删除图标 -->
        <div class="flow-node-right-ico" v-show="mouseEnter" @click="deleteNode">
            <i class="el-icon-delete"></i>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            node: Object,
            activeNodeId: String
        },
        data() {
            return {
                // 控制节点操作显示
                mouseEnter: false
            }
        },
        computed: {
            // 计算是否是激活的节点
            flowNodeActive() {
                return this.activeNodeId === this.node.id
            },
            // 节点容器样式
            nodeContainerStyle() {
                return {
                    top: this.node.top,
                    left: this.node.left
                }
            },
            nodeIcoClass() {
                var nodeIcoClass = {}
                nodeIcoClass[this.node.ico] = true
                // 添加该class可以推拽连线出来
                nodeIcoClass['flow-node-drag'] = true
                return nodeIcoClass
            }
        },
        methods: {
            // 删除节点
            deleteNode() {
                this.$emit('deleteNode', this.node.id)
            },
            // 点击节点
            clickNode() {
                this.$emit('clickNode', this.node.id)
            },
            // 鼠标移动后抬起
            changeNodeSite() {
                // 避免抖动
                if (this.node.left == this.$refs.node.style.left && this.node.top == this.$refs.node.style.top) {
                    return;
                }
                this.$emit('changeNodeSite', {
                    nodeId: this.node.id,
                    left: this.$refs.node.style.left,
                    top: this.$refs.node.style.top,
                })
            }
        }
    }
</script>

<style>
    .flow-node-container {
        position: absolute;
        display: flex;
        width: 170px;
        height: 32px;
        border: 1px solid #E0E3E7;
        border-radius: 5px;
        background-color: #fff;
    }

    .flow-node-container:hover {
        /* 设置移动样式*/
        cursor: move;
        background-color: #F0F7FF;
        /*box-shadow: #1879FF 0px 0px 12px 0px;*/
        background-color: #F0F7FF;
        border: 1px dashed #1879FF;
    }

    /*激活状态*/
    .flow-node-active {
        background-color: #F0F7FF;
        /*box-shadow: #1879FF 0px 0px 12px 0px;*/
        background-color: #F0F7FF;
        border: 1px solid #1879FF;
    }

    .flow-node-left {
        width: 4px;
        background-color: #1879FF;
        border-radius: 4px 0 0 4px;
    }

    .flow-node-left-ico {
        line-height: 32px;
        margin-left: 8px;
    }

    .flow-node-left-ico:hover {
        /* 设置拖拽的样式 */
        cursor: crosshair;
    }

    .flow-node-text {
        color: #565758;
        font-size: 12px;
        line-height: 32px;
        margin-left: 8px;
        width: 100px;
        /* 设置超出宽度文本显示方式*/
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        text-align: center;
    }

    .flow-node-right-ico {
        line-height: 32px;
        position: absolute;
        right: 10px;
        color: #84CF65;
        cursor: default;
    }

</style>
