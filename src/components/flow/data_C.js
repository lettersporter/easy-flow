var dataC = {
    name: '流程C',
    nodeList: [
        {
            id: 'nodeA',
            name: '流程C-节点A',
            left: '400px',
            top: '15px',
            ico: 'el-icon-user-solid',
            show: true
        },
        {
            id: 'nodeB',
            name: '流程C-节点B',
            left: '400px',
            top: '200px',
            ico: 'el-icon-goods',
            show: true
        },
        {
            id: 'nodeC',
            name: '流程C-节点C',
            left: '400px',
            top: '378px',
            ico: 'el-icon-present',
            show: true
        }
    ],
    lineList: [
        {
            from: 'nodeA',
            to: 'nodeB'
        }, {
            from: 'nodeB',
            to: 'nodeC'
        }
    ]
}

export function getDataC() {
    return dataC
}
