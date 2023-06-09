import React, { FC, useRef, MutableRefObject } from 'react'

import cn from 'clsx'
import { WithTranslation, withTranslation } from 'next-i18next'

import LangSwitcherMinimal from '@/components/common/lang-switcher'
import { Link } from '@/components/ui'
import { INFO } from '@/config'
import { useEscapeKeyHandler } from '@/lib/hooks'

import s from './Menu.module.css'

type MenuProps = WithTranslation & {
  className?: string
  open?: boolean
  onClose: () => void
  onOpenInfo: () => void
}

const Menu: FC<MenuProps> = ({ t, open, onClose, onOpenInfo }) => {
  const ref = useRef() as MutableRefObject<HTMLDivElement>

  useEscapeKeyHandler(open, onClose)

  return (
    <div className={cn(s.root, { [s.open]: open })}>
      <nav
        className={s.nav}
        role='menu'
        ref={ref}
        onWheel={(event) => event.stopPropagation()} // don't propagate to lenis
        onScroll={(event) => event.stopPropagation()} // don't propagate to lenis
        onTouchStart={(event) => event.stopPropagation()} // don't propagate to lenis
        onTouchEnd={(event) => event.stopPropagation()} // don't propagate to lenis
        onTouchMove={(event) => event.stopPropagation()} // don't propagate to lenis
      >
        <div className={cn(s.main)}>
          <Link
            href='/services'
            className={cn(s.link, s.third)}
            onClick={onClose}
            underlined={false}
          >
            <span className={s.label}>{t('services_long')}</span>
          </Link>
          <Link
            href='/products'
            className={cn(s.link, s.first)}
            onClick={onClose}
            underlined={false}
          >
            <span className={s.label}>{t('products')}</span>
          </Link>
          <Link
            className={cn(s.link, s.second)}
            onClick={() => {
              onClose()
              onOpenInfo()
            }}
            underlined={false}
          >
            <span className={s.label}>{t('opening_hours_long')}</span>
          </Link>
          <Link
            className={cn(s.link, s.fifth)}
            onClick={() => {
              onClose()
              onOpenInfo()
            }}
            underlined={false}
          >
            <span className={s.label}>{t('contact')}</span>
          </Link>
          <Link
            href='/jobs'
            className={cn(s.link, s.fourth)}
            onClick={onClose}
            underlined={false}
          >
            <span className={s.label}>{t('jobs')}</span>
          </Link>
          <Link
            href={INFO.instagramUrl}
            className={cn(s.link, s.sixth)}
            onClick={onClose}
            underlined={false}
          >
            <span className={s.label}>Instagram</span>
          </Link>
        </div>
        <div className={cn(s.secondary)}>
          <LangSwitcherMinimal
            className={s.link}
            childrenClassName={s.label}
            linkProps={{
              underlined: false,
            }}
          />
        </div>
      </nav>
    </div>
  )
}

export default withTranslation()(Menu)
