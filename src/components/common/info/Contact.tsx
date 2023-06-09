import cn from 'clsx'

import { EmailLink, GooglePlaceLink, TelLink } from '@/components/common/links'
import { INFO } from '@/config'

const Contact = ({
  className = '',
  primaryClassName = '',
  secondaryClassName = '',
  secondaryInnerClassName = '',
  secondaryItemClassName = '',
  secondaryAlignRight = false,
}) => (
  <ul className={cn('space-y-6 flex flex-col', className)}>
    <li className={primaryClassName}>
      <ul>
        <li>
          <strong>{INFO.name}</strong>
        </li>
        <li>
          <GooglePlaceLink>{INFO.streetAddress}</GooglePlaceLink>
        </li>
        <li>
          <GooglePlaceLink>{INFO.streetAddress2}</GooglePlaceLink>
        </li>
      </ul>
    </li>
    <li
      className={cn(
        {
          'self-end': secondaryAlignRight,
        },
        secondaryClassName
      )}
    >
      <ul className={cn('space-y-1 sm:space-y-0', secondaryInnerClassName)}>
        <li
          className={cn(
            {
              'text-right': secondaryAlignRight,
            },
            secondaryItemClassName
          )}
        >
          <TelLink />
        </li>
        <li
          className={cn(
            {
              'text-right': secondaryAlignRight,
            },
            secondaryItemClassName
          )}
        >
          <EmailLink />
        </li>
      </ul>
    </li>
  </ul>
)

export default Contact
