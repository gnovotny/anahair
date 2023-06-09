import { Fragment } from 'react'

import cn from 'clsx'
import { useRouter } from 'next/router'

import Link from '@/components/ui/link'

const {
  i18n: { locales },
} = require('../../../../next-i18next.config')

const LangSwitcherFull = ({ className = '' }) => {
  const { pathname, locale: currentLocale } = useRouter()

  return (
    <ul className={cn('', className)}>
      {locales.map((locale: string, index: number) => (
        <Fragment key={locale}>
          <li>
            <Link
              href={pathname}
              locale={locale}
              className={cn('uppercase no-underline', {
                'font-bold': currentLocale === locale,
              })}
              lineProps={{
                mode: 'hover',
              }}
            >
              {locale}
            </Link>
          </li>
          {index + 1 < locales.length && (
            <li className='relative w-3 h-6 text-5xl'>
              <div className='absolute h-full w-[1px] bg-current rotate-[20deg] left-1/2' />
            </li>
          )}
        </Fragment>
      ))}
    </ul>
  )
}

export default LangSwitcherFull
