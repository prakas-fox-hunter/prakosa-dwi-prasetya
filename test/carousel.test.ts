import assert from 'node:assert/strict'
import test from 'node:test'

import { getNextSlideIndex, getPreviousSlideIndex } from '../src/utils/carousel.ts'

test('next slide advances from slide 1 to slide 2', () => {
  assert.equal(getNextSlideIndex(0, 2), 1)
})

test('next slide wraps from the last slide to the first slide', () => {
  assert.equal(getNextSlideIndex(1, 2), 0)
})

test('previous slide moves from slide 2 to slide 1', () => {
  assert.equal(getPreviousSlideIndex(1, 2), 0)
})

test('previous slide wraps from the first slide to the last slide', () => {
  assert.equal(getPreviousSlideIndex(0, 2), 1)
})
