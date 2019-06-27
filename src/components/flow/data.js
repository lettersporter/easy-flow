var nodeList = [
    {
        id: 'nodeA',
        name: '我是另一个数据-节点A',
        left: '300px',
        top: '15px',
        ico: 'el-icon-user-solid'
    },
    {
        id: 'nodeB',
        name: '我是另一个数据-节点B',
        left: '300px',
        top: '316px',
        ico: 'el-icon-goods'
    },
    {
        id: 'nodeC',
        name: '我是另一个数据-节点C',
        left: '800px',
        top: '316px',
        ico: 'el-icon-present'
    },{
        id: 'nodeD',
        name: '我是另一个数据-节点D',
        left: '800px',
        top: '121px',
        ico: 'el-icon-present'
    }
]

var lineList = [{
    from: 'nodeA',
    to: 'nodeB'
}, {
    from: 'nodeB',
    to: 'nodeC'
},{
    from: 'nodeC',
    to: 'nodeD'
}
]

export function getData() {
    return {
        nodeList: nodeList,
        lineList: lineList
    }
}
