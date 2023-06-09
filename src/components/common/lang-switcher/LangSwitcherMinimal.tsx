import cn from 'clsx'
import { useRouter } from 'next/router'

import Link from '@/components/ui/link'
import { LinkProps } from '@/components/ui/link/Link'

const {
  i18n: { locales },
} = require('../../../../next-i18next.config')

type LangSwitcherMinimalProps = {
  className?: string
  childrenClassName?: string
  linkProps?: LinkProps
  mode?: 'code' | 'extended'
}
const LangSwitcherMinimal = ({
  className = '',
  childrenClassName = '',
  linkProps,
  mode = 'code',
}: LangSwitcherMinimalProps) => {
  const { pathname, locale: currentLocale } = useRouter()

  const locale = locales.find((l: string) => l !== currentLocale)

  return (
    <Link
      href={pathname}
      locale={locale}
      className={cn('no-underline', className)}
      {...linkProps}
    >
      <span className={childrenClassName}>
        {mode === 'code' ? locale : locale === 'de' ? 'Switch to German' : 'Auf Englisch wechseln'}
      </span>
    </Link>
  )
}

export default LangSwitcherMinimal
