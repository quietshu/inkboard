;(function () {
  var canvas = document.getElementById('sketch')

  var inkboard = new Inkboard(canvas, {
    width: window.innerWidth * window.devicePixelRatio,
    height: window.innerHeight * window.devicePixelRatio
  })

  var id = 0
  canvas.addEventListener('mousedown', function (ev) {
    var c = '#' + ~~(Math.random() * 10) + ~~(Math.random() * 10) + ~~(Math.random() * 10)
    id = inkboard.pathAdd({color: c}, {x: ev.pageX * window.devicePixelRatio, y: ev.pageY * window.devicePixelRatio})
  })
  canvas.addEventListener('touchstart', function (ev) {
    var c = '#' + ~~(Math.random() * 10) + ~~(Math.random() * 10) + ~~(Math.random() * 10)
    id = inkboard.pathAdd({color: c}, {x: ev.pageX * window.devicePixelRatio, y: ev.pageY * window.devicePixelRatio, f: ev.touches[0].force})
  })

  canvas.addEventListener('mousemove', function (ev) {
    if (id >= 0) inkboard.pathPush(id, {x: ev.pageX * window.devicePixelRatio, y: ev.pageY * window.devicePixelRatio})
  })
  canvas.addEventListener('touchmove', function (ev) {
    ev.preventDefault()
    if (id >= 0) inkboard.pathPush(id, {x: ev.pageX * window.devicePixelRatio, y: ev.pageY * window.devicePixelRatio, f: ev.touches[0].force})
  })

  canvas.addEventListener('mouseup', function (ev) {
    id = -1
  })
  canvas.addEventListener('touchend', function (ev) {
    id = -1
  })

})()
