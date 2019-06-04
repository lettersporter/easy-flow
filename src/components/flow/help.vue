<template>
    <el-dialog
            title="帮助信息"
            :visible.sync="dialogVisible"
    >
        <el-link type="warning">左侧的节点名称以及图标可以自定义，在tool.vue中 menuList 中</el-link>
        <el-link type="warning">左侧的节点展开时，子节点可以拖拽到右侧画布中即可添加</el-link>
        <el-link type="warning">鼠标移动到节点上，节点的右上角上显示【修改】、【删除】链接</el-link>
        <el-link type="warning">将鼠标从节点的左上角的图标上拖动时可以进行节点直接创建连线</el-link>
        <el-link type="warning">点击节点之间的连线，可以进行连线删除</el-link>
  </span>
    </el-dialog>
</template>

<script>
    export default {
        data() {
            return {
                dialogVisible: false
            }
        },
        methods: {
            init() {
                this.dialogVisible = true
            }
        }
    }
</script>

<style scoped>

</style>
