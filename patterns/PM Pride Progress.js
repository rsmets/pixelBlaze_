// These colors are very sensitive to LED style
// Works on APA102/SK9822 HDR LEDs
// Results on WS28XX probably sketch

var colors = 11
var incr = 1 / colors

export function beforeRender(delta) {
  t1 = time(.1)
}

export function render(index) {
  pct = (2 - t1 - triangle(index / pixelCount)) % 1

       if (pct < incr * 1)  hsv(.05, 1, .00)
  else if (pct < incr * 2)  hsv(.05, 1, .005)
  else if (pct < incr * 3)  hsv(.6, .81, .04)
  else if (pct < incr * 4)  hsv(.93, .95, .15)
  else if (pct < incr * 5)  hsv(.1, .3, .01)
  else if (pct < incr * 6)  hsv(0, 1, .1)
  else if (pct < incr * 7)  hsv(.03, 1, .3)
  else if (pct < incr * 8)  hsv(.1, 1, .1)
  else if (pct < incr * 9)  hsv(.3333, 1, .01)
  else if (pct < incr * 10) hsv(.6666, 1, .01)
  else if (pct < incr * 11) hsv(.75, 1, .01)
}