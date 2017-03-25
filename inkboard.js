function Inkboard(canvas, option) {
  this.canvas = canvas
  this.ctx = canvas.getContext('2d')

  var defaultOption = {
    width: 800,
    height: 600,
    thickness: 3,
    color: 'black',
    backgroundColor: 'white'
  }

  for (var key in option) {
    if (option.hasOwnProperty(key)) {
      defaultOption[key] = option[key]
    }
  }

  // Initialize size
  this.width = defaultOption.width
  this.height = defaultOption.height
  this.thickness = defaultOption.thickness
  this.color = defaultOption.color
  this.backgroundColor = defaultOption.backgroundColor

  this.canvas.width = this.width
  this.canvas.height = this.height
  this.ctx.shadowBlur = 1
  this.ctx.globalCompositeOperation = 'source-over'
  this.ctx.lineJoin = 'round'
  this.ctx.lineCap = 'round'

  this.paths = {}
  this.pathId = 0

  this.lastPathPaint = -1
}

Inkboard.prototype.clear = function () {
  this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
  this.paths = []
}
Inkboard.prototype.repaintAll = function (noclear) {
  if (!noclear) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }
  for (var id in this.paths)
    if (this.paths.hasOwnProperty(id)) {
      this.pathPaint(id, 0)
    }
}
Inkboard.prototype.pathPaint = function (id, start) {
  if (this.lastPathPaint !== id) {
    this.lastPathPaint = id
    this.ctx.strokeStyle = this.paths[id].color
    this.ctx.shadowColor = this.paths[id].color
    this.ctx.lineWidth = this.paths[id].thickness
  }
  var points = this.paths[id].points

  if (points.length === 1 && start === 0) {
    // A point
    this.ctx.beginPath()
    this.ctx.moveTo(points[0].x, points[0].y)
    this.ctx.lineTo(points[0].x, points[0].y)
    this.ctx.stroke()
  } else if (points.length >= 3) {
    this.ctx.beginPath()
    if (start <= 2) {
      this.ctx.moveTo(points[0].x, points[0].y)
    } else {
      var sx = points[start - 1].x + points[start - 2].x,
          sy = points[start - 1].y + points[start - 2].y
      this.ctx.moveTo(sx / 2, sy / 2)
    }
    for (var i = Math.max(start - 1, 1); i < points.length - 1; ++i) {
      var sx = points[i].x + points[i + 1].x,
          sy = points[i].y + points[i + 1].y
      // console.log(sx / 2, sy / 2)
      this.ctx.quadraticCurveTo(points[i].x, points[i].y, sx / 2, sy / 2)
      if (typeof points[i].f !== 'undefined') {
        this.ctx.lineWidth = points[i + 1].f * this.paths[id].thickness * 4
      }
    }
    this.ctx.stroke()
  }
}
Inkboard.prototype.pathAdd = function (option, points) {
  var id = this.pathId++
  this.paths[id] = {
    color: option.color ? option.color : this.color,
    thickness: option.thickness ? option.thickness : this.thickness,
    points: []
  }
  if (points) {
    this.pathPush(id, points)
  }
  return id
}
Inkboard.prototype.pathRemove = function (id) {
  if (this.paths[id]) {
    delete this.paths[id]
    this.repaintAll()
  }
}
Inkboard.prototype.pathPush = function (id, points) {
  if (this.paths[id]) {
    var _length = this.paths[id].points.length
    if (points instanceof Array) {
      this.paths[id].points = this.paths[id].points.concat(points)
    } else {
      this.paths[id].points.push(points)
    }
    this.pathPaint(id, _length)
  }
}

// Define module
if (typeof define === 'function' && define.amd) {
  define([], function () {
    return Inkboard
  })
} else if (typeof module === 'object' && module.exports) {
  module.exports = Inkboard
} else {
  this.Inkboard = Inkboard
}
