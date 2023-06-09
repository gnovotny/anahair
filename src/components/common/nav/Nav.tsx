import { PropsWithChildren } from 'react'

import cn from 'clsx'
import { useRouter } from 'next/router'
import { WithTranslation, withTranslation } from 'next-i18next'

import Link from '@/components/ui/link'
import { LinkProps } from '@/components/ui/link/Link'
import { INFO } from '@/config'

export type NavProps = PropsWithChildren<
  WithTranslation & {
    className?: string
    itemClassName?: string
    linkProps?: LinkProps
  }
>

const Nav = ({ className = '', itemClassName = '', t, children, linkProps }: NavProps) => {
  const { pathname } = useRouter()

  const items = [
    {
      href: '/opening-hours',
      label: t('opening_hours'),
      className: 'xl:hidden',
    },
    {
      href: '/services',
      label: t('services'),
    },
    {
      href: '/products',
      label: t('products'),
    },
    {
      href: '/jobs',
      label: t('jobs'),
    },
    {
      href: INFO.instagramUrl,
      label: 'Instagram',
    },
  ]

  return (
    <ul className={className}>
      {items.map(({ href, label, className }) => (
        <li
          key={`nav-item-${href}`}
          className={cn(className, itemClassName)}
        >
          <Link
            {...linkProps}
            href={href}
            isActive={href === pathname}
          >
            {label}
          </Link>
        </li>
      ))}
      {children && <li className={cn(itemClassName)}>{children}</li>}
    </ul>
  )
}

export default withTranslation()(Nav)
