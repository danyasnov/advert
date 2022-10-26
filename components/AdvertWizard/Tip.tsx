/* eslint-disable react/jsx-props-no-spreading */
import {FC} from 'react'
import IcQuestionMark from 'icons/material/QuestionMark.svg'
import {usePopperTooltip} from 'react-popper-tooltip'
import * as PopperJS from '@popperjs/core'
import {isMobile} from 'react-device-detect'
import {InfoSquare} from 'react-iconly'
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
        <Button className='text-primary-500'>
          <InfoSquare size={24} />
        </Button>
      </div>
      {visible && (
        <div
          ref={setTooltipRef}
          {...getTooltipProps({
            className: 'tooltip-container',
          })}>
          <div {...getArrowProps()} />
          <span className='text-body-16 whitespace-normal text-greyscale-900'>
            {message}
          </span>
        </div>
      )}
    </div>
  )
}
export default Tip
