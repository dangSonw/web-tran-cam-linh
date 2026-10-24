// Exact critically damped spring: stable across frame rates and interruptions.
// Keep transient animation state outside React's render cycle.
export function stepSpring(state, target, delta, frequency = 22, precision = 0.001) {
  const offset = state.value - target
  const impulse = state.velocity + frequency * offset
  const decay = Math.exp(-frequency * delta)

  state.value = target + (offset + impulse * delta) * decay
  state.velocity = (state.velocity - frequency * impulse * delta) * decay

  const settled = Math.abs(state.value - target) < precision
    && Math.abs(state.velocity) < precision * frequency

  if (settled) {
    state.value = target
    state.velocity = 0
  }

  return !settled
}
