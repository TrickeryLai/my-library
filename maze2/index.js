(function () {

    class Maze {
        constructor(options = defaultOptions) {
            const {
                width = 40,
                    height = 40,
                    el,
                    start = {
                        x: 0,
                        y: 0
                    },
                    end = {
                        x: width - 1,
                        y: height - 1
                    }
            } = options

            this.width = width; // 大小
            this.height = height; // 大小
            this.el = el
            this.result = [] // 所有节点数据
            this.currentItem = {} // 当前位置
            this.visitedArr = [] // 以访问节点
            this.back = 0 // 回退步数
            this.start = start // 开始节点
            this.end = end // 结束点
            this.aliveNodes = [] // 对应以访问节点可用点坐标集合
            this.successPath = [] // 起点至终点路径 
            this.totalF = 0 // 计数

            this.init()
        }

        init() {
            this.itemColor = this.randomColor()
            this.initData()
            this.setStartItem()
            this.created()
            console.log(this.result, this.totalF)
            return this
        }

        getResultPath() {
            return this.successPath
        }

        // 设置开始点
        setStartItem() {
            const {
                x: sX,
                y: sY
            } = this.start
            this.nodeTo(sX, sY)
        }

        // 传入当前节点坐标，设置为当前节点，一系列操作，
        nodeTo(x, y) {
            this.setItemId(x, y)
            this.currentItem = this.result[x][y]
            this.visitedArr.push(this.currentItem)
            if (this.currentItem.type === 1) {
                this.currentItem.color = this.itemColor
            }
            this.aliveNodes.push({
                p: this.visitedArr.length - 1,
                item: JSON.parse(JSON.stringify(this.currentItem))
            })
        }

        // 设置为已访问
        setItemId(w, h) {
            this.result[w][h].visited = true
        }

        // 获取当前项 id 数组
        getItemIdArr(item) {
            return item.id.split('_')
        }

        // 根据 width, height 生成初始数据
        initData() {
            const {
                x: sx,
                y: sy
            } = this.start
            const {
                y: ey,
                x: ex
            } = this.end
            const item = {
                l: false, // 上
                r: false, // 下
                t: false, // 左
                b: false, // 右
                visited: false, // 是否已经访问
                type: 1, // 类型， 1 普通节点, 2开始点 3 结束点 4 路线节点
                id: false, // 以 坐标 "_"拼接
            }
            // 按照 width, height 初始化对应的二维数组
            for (let i = 0; i < this.width; i++) {
                for (let j = 0; j < this.height; j++) {
                    if (!this.result[i]) {
                        this.result[i] = []
                    }
                    item.id = `${i}_${j}`
                    this.result[i][j] = JSON.parse(JSON.stringify(item))

                    if (sx === i && sy === j) {
                        this.result[i][j].type = 2
                    }

                    if (ex === i && ey === j) {
                        this.result[i][j].type = 3
                    }

                }
            }
        }

        randomColor() {
            const r = Math.floor(Math.random() * 255)
            const g = Math.floor(Math.random() * 255)
            const b = Math.floor(Math.random() * 255)
            return `rgba(${r}, ${g}, ${b}, .4)`
        }

        // 随机方向, 如果周围点无法访问，则返回false
        randomPosition(positionData = ['l', 'r', 't', 'b']) {
            if (positionData.length <= 0) {
                return false
            }
            const random = Math.floor(Math.random() * (positionData.length - 0.1))
            const item = positionData[random]
            return item
        }

        // 根据当前位置获取可选方向
        getPositionData(width, height) {
            width = parseInt(width)
            height = parseInt(height)
            let positionData = ['l', 'r', 't', 'b']
            // 边界筛选
            if (width <= 0) {
                const index = positionData.indexOf('t')
                positionData.splice(index, 1)
            }
            if (width >= this.width - 1) {
                const index = positionData.indexOf('b')
                positionData.splice(index, 1)
            }
            if (height <= 0) {
                const index = positionData.indexOf('l')
                positionData.splice(index, 1)
            }
            if (height >= this.height - 1) {
                const index = positionData.indexOf('r')
                positionData.splice(index, 1)
            }
            // 相邻点筛选
            const lIndex = positionData.indexOf('l')
            if (lIndex >= 0 && this.result[width][height - 1].visited) {
                positionData.splice(lIndex, 1)
            }
            const rIndex = positionData.indexOf('r')
            if (rIndex >= 0 && this.result[width][height + 1].visited) {
                positionData.splice(rIndex, 1)
            }
            const tIndex = positionData.indexOf('t')
            if (tIndex >= 0 && this.result[width - 1][height].visited) {
                positionData.splice(tIndex, 1)
            }
            const bIndex = positionData.indexOf('b')
            if (bIndex >= 0 && this.result[width + 1][height].visited) {
                positionData.splice(bIndex, 1)
            }
            return positionData
        }

        // 遍历生成
        created() {
            const result = this.result.flat()
            const lastLength = result.length - this.visitedArr.length
            if (lastLength <= 0) {
                return false
            }
            for (let i = 0; i < lastLength; i++) {
                this.totalF++
                let [cx, cy] = this.getItemIdArr(this.currentItem)
                cx = Number(cx)
                cy = Number(cy)
                // 获取随机位置，如果当前节点周围点已访问，则会返回 false
                const randomP = this.randomPosition(this.getPositionData(cx, cy))
                // randomP 为 false 则表示该节点周围没有路，将会把此节点从 aliveNodes 内删除，同时将当前节点设置为上一个节点，如果上一个节点也没有路了，则会重复删除， 设置。
                if (!randomP) {
                    if (-this.back > this.visitedArr.length - 2) {
                        break;
                    }
                    this.itemColor = this.randomColor()
                    this.back -= 1
                    // 当前周围点已经访问，则该节点从aliveNodes 中删除，并取上一个节点重新开始
                    this.aliveNodes.splice(-1, 1)
                    this.currentItem = this.aliveNodes.slice(-1)[0].item
                    return this.created()
                }
                // 将当前项的该方向设置为 true
                this.result[cx][cy][randomP] = true
                // 下一个节点处理
                if (randomP === 'l') {
                    cy = cy - 1
                    this.result[cx][cy].r = true
                }
                if (randomP === 'r') {
                    cy = cy + 1
                    this.result[cx][cy].l = true
                }
                if (randomP === 't') {
                    cx = cx - 1
                    this.result[cx][cy].b = true

                }
                if (randomP === 'b') {
                    cx = cx + 1
                    this.result[cx][cy].t = true
                }

                // 如果当前到达了终点，因为 aliveNodes 内记录的是之前走的节点，并且已经删除了错误的路线节点，所以将 aliveNodes 内的点类型设置为 4，代表路线节点
                if (cx === this.end.x && cy === this.end.y) {
                    this.findsEnd = true
                    this.successPath = [...this.aliveNodes]
                    this.aliveNodes.forEach(aliveNode => {
                        if (aliveNode.item.type !== 1) {
                            return
                        }
                        const [x, y] = this.getItemIdArr(aliveNode.item)

                        this.result[x][y].type = 4
                    })
                }
                this.nodeTo(cx, cy)
                this.back = 0
            }
        }

        // 渲染
        render() {
            if (!this.el) {
                return
            }
            const app = document.querySelector(this.el)
            let line, block
            const appI = document.createElement('div')
            for (let i = 0; i < this.width; i++) {
                line = document.createElement('div')
                line.classList = 'line'
                for (let j = 0; j < this.height; j++) {
                    block = document.createElement('span')
                    const {
                        l,
                        r,
                        t,
                        b,
                        type,
                        id,
                        color
                    } = this.result[i][j]
                    if (type === 1) {
                        // block.style.background = color
                    }
                    block.classList = `item l-${l} r-${r} t-${t} b-${b} item-type-${type} item-${id}`
                    line.appendChild(block)
                }
                appI.appendChild(line)
            }

            app.appendChild(appI)
        }
    }

    const myMaze = new Maze({
        width: 30,
        height: 60,
        el: '#app',
        start: {
            x: 0,
            y: 0
        },

    })

    myMaze.render()

    document.querySelector('#showLine').addEventListener('click', () => {
        myMaze.getResultPath().forEach((item, index) => {
            setTimeout(() => {
                document.querySelector(`.item-${item.item.id}`).style.background = 'orange'
            }, 0 * index)
        })
    })

})()