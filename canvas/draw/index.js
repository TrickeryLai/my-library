(
    window.onload = function () {

        function initCanvas(id) {
            if (!id) {
                throw 'canvase id is not defined'
            }
            var clientWidth = document.body.clientWidth
            var clientHeight = document.body.clientHeight
            var canvas = document.getElementById(id);
            canvas.setAttribute('width', clientWidth)
            canvas.setAttribute('height', clientHeight)
            var ctx = canvas.getContext('2d');
            return ctx;
        };

        function Ball(options) {
            if (options) {
                this.x = options.x
                this.y = options.y
                this.radius = options.radius
            } else {
                this.x = 100
                this.y = 100
                this.radius = 10
            }
            this.canvas = ''
            this.position = {
                x: 1,
                y: 1
            }
            this.currentPosition = {
                x: 1,
                y: 1
            }
            this.speed = 3
            this.requestAnimation = null
            this.init()
        }

        Ball.prototype = {
            colors: ['#409EFF', '#67C23A', '#E6A23C', '#F56C6C', '#909399', '#DCDFE6', '#F2F6FC'],
            init: function () {
                this.ctx = this.getCtx()
                this.mathColor = this.mathRandomColor()
                this.radius = this.mathRandomRadius()
                this.position.x = this.mathPosition()
                this.position.y = this.mathPosition()
                this.clientHeight = document.body.clientHeight
                this.clientWidth = document.body.clientWidth
                return this
            },

            getCtx: function () {
                return document.getElementById('canvas').getContext('2d');
            },

            drawBall: function (e) {
                if (e && e.clientX) {
                    // console.log(e)
                    var x = e.clientX || e.x
                    var y = e.clientY || e.y
                    this.x = x;
                    this.y = y
                    this.currentPosition.x = x
                    this.currentPosition.y = y
                } else {
                    var x = this.x
                    var y = this.y
                }
                var ctx = this.ctx
                ctx.clearRect(0, 0, this.clientWidth, this.clientHeight);
                ctx.save()
                ctx.beginPath()
                ctx.fillStyle = this.mathColor
                ctx.arc(x, y, this.radius, 0, 2 * Math.PI)
                // ctx.translate(this.speed * this.position.x, (this.speed + 1) * this.position.y)

                ctx.fill();
                ctx.save()

                this.requestAnimation = requestAnimationFrame(this.drawBall.bind(this))
                if (this.speed <= 0) {
                    cancelAnimationFrame(this.requestAnimation)
                }
                ctx.closePath()
                this.move()
                return this
            },

            move: function () {

                var currentX = this.x
                var currentY = this.y

                if (currentX + this.radius >= this.clientWidth) {
                    this.position.x = -1
                } else if (currentX - this.radius <= 0) {
                    this.position.x = 1
                }

                if (currentY + this.radius >= this.clientHeight) {
                    this.position.y = -1

                } else if (currentY - this.radius <= 0) {
                    this.position.y = 1
                }


                // this.speed--

                this.x += this.position.x * this.speed
                this.y += this.position.y * this.speed
            },

            // 随机方向， -1 为减， 1为+
            mathPosition: function () {
                var value = Math.random()
                return value >= 0.5 ? 1 : -1
            },

            mathRandomColor: function () {
                return this.colors[Math.floor(Math.random() * this.colors.length)]
            },

            mathRandomRadius: function () {
                var maxSize = 50;
                var minSize = 5;
                return minSize + Math.floor(Math.random() * (maxSize - minSize))
            }
        }

        // function Draw(options) {
        //     Ball.call(this, options)
        // }

        // Draw.prototype = new Ball()

        // var drawBall = new Draw({
        //     x: 100,
        //     y: 100,
        //     radius: 10
        // })

        function initCanvas() {
            var clientWidth = document.body.clientWidth
            var clientHeight = document.body.clientHeight
            var canvas = document.getElementById('canvas');
            canvas.setAttribute('width', clientWidth)
            canvas.setAttribute('height', clientHeight)
        };

        initCanvas()

        var balls = []

        document.getElementById('canvas').onclick = function (e) {
            var ball = new Ball().drawBall(e)

            balls.push(ball)

            // console.log(e)
        }


        // drawBall.drawBall()
    }
)();