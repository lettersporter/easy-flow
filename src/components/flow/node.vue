<template>
    <div
            ref="node"
            :style="flowNodeContainer"
            @mouseenter="showDelete"
            @mouseleave="hideDelete"
            @mouseup="changeNodeSite"
    >
        <div class="flow-node-header">
            <!--左上角的那个图标样式-->
            <i :class="nodeClass"></i>
            <!--鼠标移入到节点中时右上角的【编辑】、【删除】 按钮-->
            <div style="position: absolute;top: 0px;right: 0px;line-height: 25px" v-show="mouseEnter">
                <a href="#" style="" @click="editNode"><img src="@/assets/edit.png"></a>&nbsp;
                <a href="#" style="" @click="deleteNode"><img src="@/assets/delete.png"></a> &nbsp;
            </div>
        </div>
        <!--节点的正文部分-->
        <div class="flow-node-body">
            {{node.name}}
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            node: Object
        },
        data() {
            return {
                // 控制节点操作显示
                mouseEnter: false
            }
        },
        computed: {
            // 节点容器样式
            flowNodeContainer: {
                get() {
                    return {
                        position: 'absolute',
                        width: '200px',
                        top: this.node.top,
                        left: this.node.left,
                        boxShadow: this.mouseEnter ? '#66a6e0 0px 0px 12px 0px' : '',
                        backgroundColor: 'transparent'
                    }
                }
            },
            nodeClass() {
                var nodeclass = {}
                nodeclass[this.node.ico] = true
                nodeclass['flow-node-drag'] = true
                return nodeclass
            }
        },
        methods: {
            // 删除节点
            deleteNode() {
                this.$emit('deleteNode', this.node.id)
            },
            // 编辑节点
            editNode() {
                this.$emit('editNode', this.node.id)
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
        /*background-color: beige;*/
        background-color: white;
        text-align: center;
        cursor: pointer;
        height: 25px;
        line-height: 25px;
        border-bottom-left-radius: 6px;
        border-bottom-right-radius: 6px;
    }

</style>
