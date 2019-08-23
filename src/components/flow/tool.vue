<template>
    <div style="background-color: #66a6e0;" ref="tool">
        <el-menu :default-openeds="defaultOpeneds">
            <el-submenu :index="menu.type+index" v-for="(menu,index)  in  menuList" :key="menu.type+index">
                <!--一级菜单名称、不可拖拽 -->
                <template slot="title">
                    <i :class="menu.ico"></i>
                    <span>{{menu.name}}</span>
                </template>
                <!--一级菜单子菜单、可拖拽菜单-->
                <el-menu-item-group>
                    <draggable @end="addNode" @choose="move" v-model="menu.children" :options="draggableOptions">
                        <el-menu-item v-for="(son,i) in menu.children"
                                      :key="son.type+i"
                                      :index="son.type+i"
                                      :type="son.type"
                                      :aaa="son.type"
                                      :bbb="son.type"
                        >
                            <i :class="son.ico"></i>{{son.name}}
                        </el-menu-item>
                    </draggable>
                </el-menu-item-group>
            </el-submenu>
        </el-menu>
    </div>
</template>
<script>
    import draggable from 'vuedraggable'

    /**
     * 参考 https://blog.csdn.net/zjiang1994/article/details/79809687
     *
     */
    var mousePosition = {
        left: -1,
        top: -1
    }
    export default {
        data() {
            return {
                draggableOptions: {
                    preventOnFilter: false
                },
                defaultOpeneds: ['group0', 'group1'],
                menuList: [
                    {
                        type: 'group',
                        name: '开始节点',
                        ico: 'el-icon-video-play',
                        children: [
                            {
                                type: 'timer',
                                name: '定时器',
                                ico: 'el-icon-time',
                            }, {
                                type: 'task',
                                name: '定时任务',
                                ico: 'el-icon-odometer',
                            }
                        ]
                    },
                    {
                        type: 'group',
                        name: '结束节点',
                        ico: 'el-icon-video-pause',
                        children: [
                            {
                                type: 'end',
                                name: '结束',
                                ico: 'el-icon-caret-right',
                            }, {
                                type: 'over',
                                name: '清理',
                                ico: 'el-icon-shopping-cart-full',
                            }
                        ]
                    }
                ],
                nodeMenu: {}
            }
        },
        components: {
            draggable
        },
        created() {
            /**
             * 以下是为了解决在火狐浏览器上推拽时弹出tab页到搜索问题
             * @param event
             */
            if (this.isFirefox()) {
                document.body.ondrop = function (event) {
                    // 解决火狐浏览器无法获取鼠标拖拽结束的坐标问题
                    mousePosition.left = event.layerX
                    mousePosition.top = event.clientY - 50
                    event.preventDefault();
                    event.stopPropagation();
                }
            }
        },
        methods: {
            // 根据类型获取左侧菜单对象
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
            move(evt) {
                var attrs = evt.item.attributes
                this.nodeMenu = this.getMenu(attrs.type.nodeValue)
            },
            // 添加节点
            addNode(evt, e) {
                this.$emit('addNode', evt, this.nodeMenu, mousePosition)
            },
            // 是否是火狐浏览器
            isFirefox() {
                var userAgent = navigator.userAgent
                if (userAgent.indexOf("Firefox") > -1) {
                    return true
                }
                return false
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
