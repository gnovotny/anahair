import React, { forwardRef } from 'react'

import { UrlObject } from 'url'

import cn from 'clsx'
import NextLink, { LinkProps as NextLinkProps } from 'next/link'

import s from './Link.module.css'

export type LinkLineProps = { className?: string; mode?: 'default' | 'hover' }

export type LinkProps = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof NextLinkProps> &
  (Omit<NextLinkProps, 'href'> & { onClick?: () => void; href?: string | UrlObject }) & {
    children?: React.ReactNode
  } & React.RefAttributes<HTMLAnchorElement> & {
    underlined?: boolean
    isActive?: boolean
    lineProps?: LinkLineProps
  }

export type LinkType = React.ForwardRefExoticComponent<LinkProps>

const Link: LinkType = forwardRef(
  ({ className = '', href, onClick, isActive, children, lineProps, underlined = true, ...props }, ref) => {
    const isInternal = !!href && (typeof href !== 'string' || href.startsWith('/'))
    const isHashOrMailOrTelOrClickHandler =
      !isInternal &&
      ((href && (href.startsWith('tel') || href.startsWith('mailto') || href.startsWith('#'))) || onClick)

    const contents = (
      <>
        {children}
        {underlined && <LinkLine {...lineProps} />}
      </>
    )

    return isInternal ? (
      <NextLink
        ref={ref}
        href={href}
        className={cn(s.root, { [s.active]: isActive, [s.underlined]: underlined }, className)}
        onClick={onClick}
        {...props}
      >
        {contents}
      </NextLink>
    ) : (
      <a
        ref={ref}
        href={href as string}
        onClick={onClick}
        className={cn(s.root, { [s.underlined]: underlined }, className)}
        target={!isHashOrMailOrTelOrClickHandler ? '_blank' : undefined}
        rel={!isHashOrMailOrTelOrClickHandler ? 'noreferrer' : undefined}
      >
        {contents}
      </a>
    )
  }
)

const LinkLine = ({ className = '', mode = 'default' }: LinkLineProps) => {
  return (
    <span
      className={cn(
        s.line,
        {
          'before:hidden': mode === 'hover',
        },
        className
      )}
    />
  )
}

export default Link
