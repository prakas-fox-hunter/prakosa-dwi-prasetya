export function getNextSlideIndex(currentIndex: number, slideCount: number): number {
  if (slideCount <= 0) return 0
  return (currentIndex + 1) % slideCount
}

export function getPreviousSlideIndex(currentIndex: number, slideCount: number): number {
  if (slideCount <= 0) return 0
  return (currentIndex - 1 + slideCount) % slideCount
}
