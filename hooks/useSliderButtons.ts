import {useCallback, useEffect, useState} from 'react'
import {EmblaCarouselType} from 'embla-carousel'

const useSliderButtons = (embla: EmblaCarouselType) => {
  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false)
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false)

  const scrollPrev = useCallback(() => embla && embla.scrollPrev(), [embla])
  const scrollNext = useCallback(() => embla && embla.scrollNext(), [embla])
  const onSelect = useCallback(() => {
    if (!embla) return
    setPrevBtnEnabled(embla.canScrollPrev())
    setNextBtnEnabled(embla.canScrollNext())
  }, [embla])

  useEffect(() => {
    if (!embla) return
    embla.on('select', onSelect)
    onSelect()
  }, [embla, onSelect])

  return {scrollNext, scrollPrev, prevBtnEnabled, nextBtnEnabled}
}

export default useSliderButtons
