// Modular addition which avoids overflow.  Uses the identity
// (a + b) % mod = (a % mod) + (b % mod) % mod
function addmod(a, b, mod) {
    var am = a % mod;
    var bm = b % mod;
    
    // If `mod`, `a`, and `b` are very large, just returning `(am + bm) % mod` could overflow
    var diff = mod - bm;
    if (diff < am) { // aka if (am + bm > mod)
      // Since am < mod and bm < mod, am + bm < 2 * mod.  In this specific case mod < am + bm < 2 * mod,
      // so we have the identity am + bm % mod = am - mod + bm
      return am - diff;
    }
    return am + bm;
  }
  
  // modular multiplication which avoids overflow.  Takes O(log(a)) iterations.
  function mulmod(a, b, mod) {
    var res = 0;
    if (b == 0) return 0;
    while (a != 0) {
      if (a & 1) {
        res = addmod(res, b, mod);
      }
      // double a and half b.
      a >>= 1;
      b = addmod(b, b, mod);
    }
    return res;
  }
  
  // This is the BSD rand() from https://rosettacode.org/wiki/Linear_congruential_generator
  export var prng_state = 0;
  export var mulres = 0;
  var mod = pow(2, 16);
  function prng(max) {
    mulres = mulmod(1103515245, prng_state);
    prng_state = addmod(mulmod(1103515245, prng_state, mod), 12345, mod);
    return prng_state / mod * max;
  }
  
  var adjusts = array(pixelCount);
  export function beforeRender(delta) {
    t1 = time(.1)
    var sparkliness = 0.01
    for (var i = 0; i < pixelCount; ++i) {
      adjusts[i] += prng(sparkliness) - sparkliness / 2;
    }
  }
  
  export function render(index) {
    h = t1 + index/pixelCount + adjusts[index]
    s = 1
    v = 1
    hsv(h, s, v)
  }