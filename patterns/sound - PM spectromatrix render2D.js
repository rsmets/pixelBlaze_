//This pattern uses the sensor expansion board
export var frequencyData

width = 14
zigzag = true


averageWindowMs = 1500
sensitivity = 0
fade = .85

averages = array(32)
pixels = array(pixelCount)

speed = 2

targetFill = 0.07
brightnessFeedback = 0

pic = makePIController(.05, .15, 30, 0, 400)

// Makes a new PI Controller
function makePIController(kp, ki, start, min, max) {
  var pic = array(5)
  pic[0] = kp
  pic[1] = ki
  pic[2] = start
  pic[3] = min
  pic[4] = max
  return pic
}

function calcPIController(pic, err) {
  pic[2] = clamp(pic[2] + err, pic[3], pic[4])
  return pic[0] * err + pic[1] * pic[2]
}

export function beforeRender(delta) {
  t1 = time(.2)
  t2 = time(.13)

  sensitivity = calcPIController(pic, targetFill - brightnessFeedback / pixelCount);
  brightnessFeedback = 0
  
  dw = delta / averageWindowMs
  for (i = 0; i < 32; i++) {
    averages[i] = max(.00001, averages[i] * (1 - dw) + frequencyData[i] * dw * sensitivity)
  }

}

//interpolates values between indexes in an array
function arrayLerp(a, i) {
  var ifloor, iceil, ratio
  ifloor = floor(i)
  iceil = ceil(i);
  ratio = i - ifloor;
  return a[ifloor] * (1 - ratio) + a[iceil] * ratio
}

export function render2D(index, x, y) {
  var i, h, s, v

  i = triangle((wave(x + wave(t1 * speed)) + wave(y - wave(t1 * speed))) / 2 + t2 * speed) * 31

  v = (arrayLerp(frequencyData, i) * sensitivity - arrayLerp(averages, i)) * 10 * (arrayLerp(averages, i) * 1000 + .5)

  h = i / 60 + t1
  v = v > 0 ? v * v : 0
  s = 1 - v
  pixels[index] = pixels[index] * fade + v
  v = pixels[index];

  brightnessFeedback += clamp(v, 0, 1)
  hsv(h, s, v)
}

//this pixel mapper shim will work without a pixel map or on older Pixelblazes
//it calculates x/y based on a 2D LED matrix display given a know width and height
export function render(index) {
  var width = 8, height = 8
  var y = floor(index / width)
  var x = index % width
  //comment out this next line if you don't have zigzag wiring:
  x = (y % 2 == 0 ? x : width - 1 - x)
  x /= width
  y /= height
  render2D(index, x, y)
}