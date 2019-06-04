<template>
    <div style="background-color: #66a6e0;" ref="tool">
        <el-menu>
            <el-submenu :index="menu.type+index" v-for="(menu,index)  in  menuList" :key="menu.type+index">
                <template slot="title">
                    <i :class="menu.ico"></i>
                    <span>{{menu.name}}</span>
                </template>

                <el-menu-item-group>

                    <draggable @end="addNode" v-for="(son,i) in menu.children" :key="son.type+i">
                        <el-menu-item :index="son.type+i" :type="son.type"><i :class="son.ico"></i>{{son.name}}
                        </el-menu-item>
                    </draggable>

                </el-menu-item-group>

            </el-submenu>
        </el-menu>
    </div>
</template>
<script>
    import draggable from 'vuedraggable'

    export default {
        data() {
            return {
                menuList: [
                    {
                        type: 'group',
                        name: '开始节点',
                        ico: 'el-icon-coffee',
                        children: [
                            {
                                type: 'timer',
                                name: '定时器',
                                ico: 'el-icon-ice-drink',
                            }, {
                                type: 'task',
                                name: '定时任务',
                                ico: 'el-icon-milk-tea',
                            }
                        ]
                    },
                    {
                        type: 'group',
                        name: '结束节点',
                        ico: 'el-icon-lollipop',
                        children: [
                            {
                                type: 'end',
                                name: '结束',
                                ico: 'el-icon-grape',
                            }, {
                                type: 'over',
                                name: '清理',
                                ico: 'el-icon-apple',
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
            // 更具类型获取菜单
            getMenu(type) {
                for (var i = 0; i < this.menuList.length; i++) {
                    let children = this.menuList[i].children;
                    for (var j = 0; j < children.length; j++) {
                        let son = children[j]
                        if (son.type === type) {
                            return son
                        }
                    }
                }
            },
            // 添加节点
            addNode(evt, e) {
                let nodeMenu = this.getMenu(evt.originalEvent.srcElement.type)
                this.$emit('addNode', evt, nodeMenu)
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
