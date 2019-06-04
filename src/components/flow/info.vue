<template>
    <el-dialog
            title="流程数据信息"
            :visible.sync="dialogVisible"
    >
        <el-row>
            <el-col :span="12">
                <el-link type="primary">连线信息</el-link>
                <codemirror
                        :value="flowLineData"
                        :options="options"
                        class="code"
                ></codemirror>
            </el-col>

            <el-col :span="12">
                <el-link type="success">节点信息</el-link>
                <codemirror
                        :value="flowNodeData"
                        :options="options"
                        class="code"
                ></codemirror>
            </el-col>
        </el-row>

        <span slot="footer" class="dialog-footer">
  </span>
    </el-dialog>
</template>

<script>
    import {codemirror} from 'vue-codemirror'

    require("codemirror/mode/javascript/javascript.js")

    export default {
        props: {
            lineList: Array,
            nodeList: Array
        },
        data() {
            return {
                dialogVisible: false,
                options: {
                    mode: {name: "javascript", json: true},
                    lineNumbers: true
                }
            }
        },
        components: {
            codemirror
        },
        computed: {
            flowNodeData() {
                return JSON.stringify(this.nodeList, null, 4).toString()
            },
            flowLineData() {
                return JSON.stringify(this.lineList, null, 4).toString()
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
