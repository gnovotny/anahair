import React, { forwardRef } from 'react'

import { addEffect, invalidate } from '@react-three/fiber'

import { SmoothScrollbar } from '../scrollbar/SmoothScrollbar'
import { ISmoothScrollbar } from '../scrollbar/SmoothScrollbar'

function R3FSmoothScrollbar(props: ISmoothScrollbar, ref: any) {
  return (
    <SmoothScrollbar
      ref={ref}
      invalidate={invalidate}
      addEffect={addEffect}
      {...props}
    />
  )
}

export default forwardRef<any, ISmoothScrollbar>(R3FSmoothScrollbar)
