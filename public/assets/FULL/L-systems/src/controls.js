const imageContainer = document.getElementsByClassName('imageList')[0]
const stats = document.getElementById('stats')
const name = document.getElementById('name')
const download = document.getElementById('download')

// controls

const axiom = document.getElementById('axiom')
const angle = document.getElementById('angle')
const rules = document.getElementById('rules')
const centerX = document.getElementById('X')
const centerY = document.getElementById('Y')
const iterations = document.getElementById('iterations')
const stepLength = document.getElementById('stepLength')
const initialAngle = document.getElementById('initialAngle')
const canvasColor = document.getElementById('canvasColor')
const colorize = document.getElementById('colorizeShape')
const toDeg = document.getElementById('toDeg')
const warning = document.getElementById('warning')
const openControls = document.getElementById('openControls')

canvasColor.value = '#ffffff'
colorize.checked = false

const controls = [
  axiom,
  angle,
  rules,
  centerX,
  centerY,
  iterations,
  stepLength,
  initialAngle,
  canvasColor,
  colorize
]

const shapesNamesList = Object.keys(SHAPES)
shapesNamesList.forEach((element, i) => {
  const image = document.createElement('img')
  const id = SHAPES[element].id
  image.setAttribute('src', `src/img/${id}.png`)
  image.setAttribute('class', 'shapePreview')
  image.setAttribute('data-id', id)
  image.setAttribute('alt', element)
  image.setAttribute('title', element)
  imageContainer.appendChild(image)
})

const previews = document.getElementsByClassName('shapePreview')
const previewsArr = Array.from(previews)

previewsArr.forEach(preview => {
  preview.addEventListener('click', e => {
    previewsArr.forEach(el => el.classList.remove('active'))
    preview.classList.toggle('active')
    drawFromPreview(preview, state)
  })
})

controls.forEach(control =>
  control.addEventListener(control === colorize ? 'click' : 'input', e => {
    previewsArr.forEach(el => el.classList.remove('active'))
    const newRules = htmlToJson(rules.value)
    if (
      control !== colorize &&
      control !== canvasColor &&
      control !== rules &&
      control !== axiom &&
      isNaN(control.value)
    ) {
      warning.innerHTML = 'provided value must be a number'
      return
    }
    if (iterations.value > 10) {
      warning.innerHTML = 'too many iterations, please use < 10'
      return
    } else if (stepLength.value == '') {
      warning.innerHTML = 'please provide step value'
      return
    }
    warning.innerHTML = ''
    const newShapeObject = {
      id: Infinity,
      axiom: axiom.value,
      rules: newRules,
      angle: angle.value,
      stepLength: stepLength.value,
      center: {
        x: centerX.value,
        y: centerY.value
      },
      initialAngle: initialAngle.value || 0,
      iterations: iterations.value
    }
    Object.assign(state, {
      canvasColor: canvasColor.value,
      shapeColor: colorize.checked
    })
    drawFromControls(newShapeObject)
  })
)

// ── Mouse drag ───────────────────────────────────────────────────────

let draggin = false
const mouseCoord = {}

canvas.addEventListener('mousedown', e => {
  draggin = true
  canvas.style.cursor = 'move'
  Object.assign(mouseCoord, {
    x: e.offsetX,
    y: e.offsetY
  })
})

canvas.addEventListener('mouseup', e => {
  draggin = false
  canvas.style.cursor = 'grab'
  if (tempObject) {
    tempObject.center = {
      x: Number(tempObject.center.x - (mouseCoord.x - e.offsetX)),
      y: Number(tempObject.center.y - (mouseCoord.y - e.offsetY))
    }
  }
  Object.assign(mouseCoord, { x: 0, y: 0 })
})

canvas.addEventListener('mousemove', e => {
  if (draggin && tempObject) {
    draw(tempObject, state, {
      x: mouseCoord.x - e.offsetX,
      y: mouseCoord.y - e.offsetY
    })
    centerX.value = tempObject.center.x - (mouseCoord.x - e.offsetX)
    centerY.value = tempObject.center.y - (mouseCoord.y - e.offsetY)
  }
})

// ── Touch drag ───────────────────────────────────────────────────────

canvas.addEventListener('touchstart', e => {
  if (e.touches.length === 1) {
    draggin = true
    const rect = canvas.getBoundingClientRect()
    Object.assign(mouseCoord, {
      x: e.touches[0].clientX - rect.left,
      y: e.touches[0].clientY - rect.top
    })
    e.preventDefault()
  }
}, { passive: false })

canvas.addEventListener('touchend', e => {
  if (!draggin) return
  draggin = false
  if (tempObject && e.changedTouches.length > 0) {
    const rect = canvas.getBoundingClientRect()
    const endX = e.changedTouches[0].clientX - rect.left
    const endY = e.changedTouches[0].clientY - rect.top
    tempObject.center = {
      x: Number(tempObject.center.x - (mouseCoord.x - endX)),
      y: Number(tempObject.center.y - (mouseCoord.y - endY))
    }
  }
  Object.assign(mouseCoord, { x: 0, y: 0 })
})

canvas.addEventListener('touchmove', e => {
  if (draggin && tempObject && e.touches.length === 1) {
    const rect = canvas.getBoundingClientRect()
    const touchX = e.touches[0].clientX - rect.left
    const touchY = e.touches[0].clientY - rect.top
    draw(tempObject, state, {
      x: mouseCoord.x - touchX,
      y: mouseCoord.y - touchY
    })
    centerX.value = tempObject.center.x - (mouseCoord.x - touchX)
    centerY.value = tempObject.center.y - (mouseCoord.y - touchY)
    e.preventDefault()
  }
}, { passive: false })

// ── Zoom (wheel + pinch) ─────────────────────────────────────────────

canvas.addEventListener('wheel', e => {
  if (!tempObject) return
  e.preventDefault()
  if (e.deltaY > 0) {
    tempObject.stepLength = Number(tempObject.stepLength) + 0.1
  } else {
    tempObject.stepLength = Math.max(0.1, Number(tempObject.stepLength) - 0.1)
  }
  draw(tempObject, state)
}, { passive: false })

// Pinch-to-zoom on touch
let lastPinchDist = 0

canvas.addEventListener('touchstart', e => {
  if (e.touches.length === 2) {
    const dx = e.touches[0].clientX - e.touches[1].clientX
    const dy = e.touches[0].clientY - e.touches[1].clientY
    lastPinchDist = Math.sqrt(dx * dx + dy * dy)
    e.preventDefault()
  }
}, { passive: false })

canvas.addEventListener('touchmove', e => {
  if (e.touches.length === 2 && tempObject) {
    const dx = e.touches[0].clientX - e.touches[1].clientX
    const dy = e.touches[0].clientY - e.touches[1].clientY
    const dist = Math.sqrt(dx * dx + dy * dy)
    const delta = dist - lastPinchDist
    tempObject.stepLength = Math.max(0.1, Number(tempObject.stepLength) + delta * 0.02)
    lastPinchDist = dist
    draw(tempObject, state)
    e.preventDefault()
  }
}, { passive: false })

// ── Download ─────────────────────────────────────────────────────────

download.addEventListener('click', () => {
  const image = canvas
    .toDataURL('image/png')
    .replace('image/png', 'image/octet-stream')
  download.setAttribute('href', image)
})

// ── Toggle controls panel ────────────────────────────────────────────

openControls.addEventListener('click', () => {
  document
    .getElementsByClassName('controls')[0]
    .classList.toggle('showControls')
})

// ── Keyboard navigation ──────────────────────────────────────────────

document.addEventListener('keypress', e => {
  if (e.keyCode === 38) {
    previewsArr.forEach(preview => {
      if (preview.classList.contains('active') && preview.previousSibling) {
        preview.classList.remove('active')
        preview.previousSibling.scrollIntoView()
        preview.previousSibling.classList.add('active')
        drawFromPreview(preview.previousSibling, state)
      }
    })
  } else if (e.keyCode === 40) {
    previewsArr.some(preview => {
      if (preview.classList.contains('active')) {
        preview.classList.remove('active')
        preview.nextSibling.scrollIntoView()
        preview.nextSibling.classList.add('active')
        drawFromPreview(preview.nextSibling, state)
        return true
      }
    })
  }
})
