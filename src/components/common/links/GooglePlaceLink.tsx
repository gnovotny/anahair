import React, { forwardRef } from 'react'

import Link from '@/components/ui/link'
import { LinkType } from '@/components/ui/link/Link'
import { INFO } from '@/config'

const GooglePlaceLink: LinkType = forwardRef(({ children, ...props }, ref) => (
  <Link
    {...props}
    ref={ref}
    href={INFO.googlePlaceUrl}
  >
    {children ?? INFO.googlePlaceUrl}
  </Link>
))

export default GooglePlaceLink
