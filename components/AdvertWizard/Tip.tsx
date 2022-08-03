/* eslint-disable react/jsx-props-no-spreading */
import {FC} from 'react'
import IcQuestionMark from 'icons/material/QuestionMark.svg'
import {usePopperTooltip} from 'react-popper-tooltip'
import * as PopperJS from '@popperjs/core'
import {isMobile} from 'react-device-detect'
import Button from '../Buttons/Button'

interface Props {
  message: string
  placement: PopperJS.Placement
}
const Tip: FC<Props> = ({message, placement}) => {
  const {
    getArrowProps,
    getTooltipProps,
    setTooltipRef,
    setTriggerRef,
    visible,
  } = usePopperTooltip({
    placement,
    offset: [10, 10],
    trigger: isMobile ? 'click' : 'hover',
  })
  return (
    <div>
      <div ref={setTriggerRef}>
        <Button>
          <IcQuestionMark className='w-6 h-6 fill-current hover:text-nc-link text-nc-icon' />
        </Button>
      </div>
      {visible && (
        <div
          ref={setTooltipRef}
          {...getTooltipProps({
            className: 'tooltip-container',
          })}>
          <div {...getArrowProps({className: 'tooltip-arrow'})} />
          <span className='text-body-16 whitespace-normal'>{message}</span>
        </div>
      )}
    </div>
  )
}
export default Tip
