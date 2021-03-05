// javascript shim for Python's built-in 'sum'
export function sum(nums: any) {
  let accumulator = 0
  for (let i = 0, l = nums.length; i < l; i++)
    accumulator += nums[i]
  return accumulator
}

// In case you were wondering, the nice functional version is slower.
// function sum_slow(nums) {
//   return nums.reduce(function(a, b) { return a + b; }, 0);
// }
// var tenmil = _.range(1e7); sum(tenmil); sum_slow(tenmil);

// like betavariate, but more like R's name
export function rbeta(alpha: any, beta: any) {
  const alpha_gamma = rgamma(alpha, 1)
  return alpha_gamma / (alpha_gamma + rgamma(beta, 1))
}

// From Python source, so I guess it's PSF Licensed
const SG_MAGICCONST = 1 + Math.log(4.5)
const LOG4 = Math.log(4.0)

export function rgamma(alpha: any, beta: any) {
  let x, v

  // does not check that alpha > 0 && beta > 0
  if (alpha > 1) {
    // Uses R.C.H. Cheng, "The generation of Gamma variables with non-integral
    // shape parameters", Applied Statistics, (1977), 26, No. 1, p71-74
    const ainv = Math.sqrt(2.0 * alpha - 1.0)
    const bbb = alpha - LOG4
    const ccc = alpha + ainv

    while (true) {
      const u1 = Math.random()
      if (!((u1 > 1e-7) && (u1 < 0.9999999)))
        continue

      const u2 = 1.0 - Math.random()
      v = Math.log(u1 / (1.0 - u1)) / ainv
      x = alpha * Math.exp(v)
      const z = u1 * u1 * u2
      const r = bbb + ccc * v - x
      if (r + SG_MAGICCONST - 4.5 * z >= 0.0 || r >= Math.log(z))
        return x * beta
    }
  }
  else if (alpha === 1.0) {
    let u = Math.random()
    while (u <= 1e-7)
      u = Math.random()

    return -Math.log(u) * beta
  }
  else { // 0 < alpha < 1
    // Uses ALGORITHM GS of Statistical Computing - Kennedy & Gentle
    while (true) {
      const u3 = Math.random()
      const b = (Math.E + alpha) / Math.E
      const p = b * u3
      if (p <= 1.0)
        x = Math.pow(p, (1.0 / alpha))

      else
        x = -Math.log((b - p) / alpha)

      const u4 = Math.random()
      if (p > 1.0) {
        if (u4 <= Math.pow(x, (alpha - 1.0)))
          break
      }
      else if (u4 <= Math.exp(-x)) {
        break
      }
    }
    return x * beta
  }
}
