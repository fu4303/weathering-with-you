import { Fn } from '@vueuse/core'

export interface Vector2D {
  x: number
  y: number
}

export function randomInt(min: number, max: number) {
  return Math.floor((Math.random() * (max - min)) + min)
}

export function lerp(a: number, b: number, n: number) {
  return a + ((b - a) * n)
}

export function scaleVector(v: Vector2D, s: number) {
  v.x *= s
  v.y *= s
}

export function normalizeVector(v: Vector2D) {
  const m = Math.sqrt(v.x * v.x + v.y * v.y)
  scaleVector(v, 1 / m)
}

export function between(min: number, max: number) {
  return +(((Math.random() * (max - min)) + min).toFixed(2))
}

export function ease(n: number) {
  return n * (2 - n)
}

export function degToRad(deg: number) {
  return deg * Math.PI / 180
}
