//@kylarleds
//https://www.youtube.com/watch?v=cFQ6EF1kr9M

export var frequencyData
export var energyAverage

var pixels_val = array(pixelCount)
var pixels_val_coeff = array(pixelCount)
var pixels_sat = array(pixelCount)
var pixels_age = array(pixelCount)

var fading = 0.86
var nofade = 0.96


export var average  = 0 // Short average
export var average2 = 0 // Long average
var lowthresh = 6       // Splits the frequencyData into lows and highs at this index

export var howmany = 6  // How many lines are going back and forth - slider controlled
export function sliderHowManyLeaders(v)
{
  howmany = floor(v*11)+1
}


var rainbow = 0
export function sliderRainbow(v){
  rainbow = v > 0.5
}

// Custom timers based on delta rather than time()
var fastTimer = 0 
var slowTimer = 0

// Control over the color changing less when the bass/energy is high
var bassPause = 9
var bassPauseHue = 0
var bassPauseHigh = 4000  // At 4000 there is a medium speed hue shift
var bassPauseLow = 220    // At 200 the LEDs rainbow flicker (hue changing very fast)

var samples = 12          // How many samples to average over. Lower will react to small things more

export function beforeRender(delta) {
  // This timer controls how fast they move
  posTimer = time(.1)
  posTimerReverse = 1 - posTimer
  
  fastTimer = (fastTimer+delta/bassPauseLow)%1
  slowTimer = (slowTimer+delta/bassPauseHigh)%1
  
  // Count up the lows and highs in case you want to use them separately
  lows = 0
  highs = 0
  for(var i = 0; i < 32; i++){
    if(i < lowthresh){
      lows  += frequencyData[i]
    }else if(i > lowthresh){
      highs += frequencyData[i]
    }
  }
  
  sum = highs+lows
  average = (average*(samples-1) + sum)/samples         // Moving average. Incorporate new data
  average2 = (average2*(samples*2-1) + sum)/(samples*2) // Moving average2, twice as long
  
  val = (average > average2)*energyAverage*80
  sat = 0.3  // Controls the whiteness of the leading pixel
  for(var leader = 0; leader < howmany; leader++){
    
    // We do 2 index calculations, one for a leader moving left, and the reflection of it moving right
    index = floor(((posTimer+leader/howmany)%1)*pixelCount)        
    pixels_sat[index] = sat
    pixels_val[index] = val
    pixels_age[index] = 0
    pixels_val_coeff[index] = nofade
    
    index = floor(((posTimerReverse+leader/howmany)%1)*pixelCount)
    pixels_sat[index] = sat
    pixels_val[index] = val
    pixels_age[index] = 0
    pixels_val_coeff[index] = nofade
  }
  
  // bassPauseHue is a way to maintain a slow changing hue when the bass hits (or other intensity is maintained)
  // Otherwise, the fastTimer timer will take over and do a flickering rainbow
  bassPauseHue = average > average2 ? slowTimer : fastTimer     
  
}

export function render(index) {
  h = 0
  
  
  
  h = (   (bassPauseHue+    (  (16*index)/(pixelCount*4)  )*(average<average2)       ) + ( (16*index)/pixelCount )*rainbow )
  
  
  pixels_sat[index] = min(pixels_sat[index]*1.3,1)  // Limit the saturation so it doesn't loop. Modify 1.3 to change the rate the white disappears
  pixels_val_coeff[index] = min(pixels_val_coeff[index] , (average > average2 ? nofade : fading) )
  pixels_val[index] = pixels_val[index]*pixels_val_coeff[index] // When loud, fade less (0.96). Fade fast when not loud (0.88)
  
  s = pixels_sat[index]
  v = pixels_val[index]
  
  hsv(h, s, v) // :) thanks for reading some code
}