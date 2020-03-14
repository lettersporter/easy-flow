<template>
    <div class="flow-menu" ref="tool">
        <el-collapse v-model="activeNames">
            <el-collapse-item v-for="menu  in  menuList" :key="menu.id" :name="menu.id">
                <template slot="title">
                    {{menu.name}}
                </template>
                <draggable @end="end" @start="move" v-model="menu.children" :options="draggableOptions">
                    <div v-for="son in menu.children"
                         :type="son.type"
                         class="flow-node-menu" :style="son.style">
                        <div class="flow-node-menu-left"></div>
                        <div class="flow-node-menu-left-ico">
                            <i :class="son.ico"></i>
                        </div>
                        <div class="flow-node-menu-text">
                            {{son.name}}
                        </div>
                    </div>
                </draggable>
            </el-collapse-item>
        </el-collapse>
    </div>
</template>
<script>
    import draggable from 'vuedraggable'

    var mousePosition = {
        left: -1,
        top: -1
    }

    export default {
        data() {
            return {
                activeNames: '1',
                // draggable配置参数参考 https://www.cnblogs.com/weixin186/p/10108679.html
                draggableOptions: {
                    preventOnFilter: false,
                    sort: false,
                    disabled: false,
                    ghostClass: 'tt',
                    // 不使用H5原生的配置
                    forceFallback: true,
                    // 拖拽的时候样式
                    // fallbackClass: 'flow-node-draggable'
                },
                // 默认打开的左侧菜单的id
                defaultOpeneds: ['1', '2'],
                menuList: [
                    {
                        id: '1',
                        type: 'group',
                        name: '开始节点',
                        ico: 'el-icon-video-play',
                        children: [
                            {
                                id: '11',
                                type: 'timer',
                                name: '数据接入',
                                ico: 'el-icon-time',
                                // 自定义覆盖样式
                                style: {}
                            }, {
                                id: '12',
                                type: 'task',
                                name: '接口调用',
                                ico: 'el-icon-odometer',
                                // 自定义覆盖样式
                                style: {}
                            }
                        ]
                    },
                    {
                        id: '2',
                        type: 'group',
                        name: '结束节点',
                        ico: 'el-icon-video-pause',
                        children: [
                            {
                                id: '21',
                                type: 'end',
                                name: '流程结束',
                                ico: 'el-icon-caret-right',
                                // 自定义覆盖样式
                                style: {}
                            }, {
                                id: '22',
                                type: 'over',
                                name: '数据清理',
                                ico: 'el-icon-shopping-cart-full',
                                // 自定义覆盖样式
                                style: {}
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
                for (let i = 0; i < this.menuList.length; i++) {
                    let children = this.menuList[i].children;
                    for (let j = 0; j < children.length; j++) {
                        if (children[j].type === type) {
                            return children[j]
                        }
                    }
                }
            },
            // 拖拽开始时触发
            move(evt, a, b, c) {
                console.log(evt, a, b, c)
                var type = evt.item.attributes.type.nodeValue
                this.nodeMenu = this.getMenu(type)
            },
            // 拖拽结束时触发
            end(evt, e) {
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

    .flow-menu {
        text-align: center;
    }

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

    .flow-node-draggable {
        border: 1px solid #1879FF;
        height: 35px !important;
        width: 170px !important;
        line-height: 35px;
    }


    .flow-node-menu {
        margin: 10px;
        display: flex;
        width: 80%;
        height: 30px;
        border: 1px solid #E0E3E7;
        border-radius: 5px;
        background-color: #fff;
    }

    .flow-node-menu:hover {
        /* 设置移动样式*/
        cursor: move;
        background-color: #F0F7FF;
        /*box-shadow: #1879FF 0px 0px 12px 0px;*/
        background-color: #F0F7FF;
        border: 1px solid #1879FF;
    }

    .flow-node-menu-left {
        width: 4px;
        background-color: #1879FF;
        border-radius: 3px 0 0 3px;
    }

    .flow-node-menu-left-ico {
        line-height: 30px;
        margin-left: 4px;
    }

    .flow-node-menu-text {
        color: #565758;
        font-size: 12px;
        line-height: 30px;
        margin-left: 4px;
        width: 70px;
        /* 设置超出宽度文本显示方式*/
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }


</style>
