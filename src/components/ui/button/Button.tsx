import React, { forwardRef, ButtonHTMLAttributes, JSXElementConstructor, useRef } from 'react'

import cn from 'clsx'
import { mergeRefs } from 'react-merge-refs'

import s from './Button.module.css'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string
  className?: string
  active?: boolean
  type?: 'submit' | 'reset' | 'button'
  Component?: string | JSXElementConstructor<any>
  width?: string | number
  disabled?: boolean
}

// eslint-disable-next-line react/display-name
const Button: React.FC<ButtonProps> = forwardRef((props, buttonRef) => {
  const { className, children, active, width, disabled = false, style = {}, Component = 'button', ...rest } = props
  const ref = useRef<typeof Component>(null)

  const rootClassName = cn(s.root, className)

  return (
    <Component
      aria-pressed={active}
      ref={mergeRefs([ref, buttonRef])}
      className={rootClassName}
      disabled={disabled}
      style={{
        width,
        ...style,
      }}
      {...rest}
    >
      {children}
    </Component>
  )
})

export default Button
