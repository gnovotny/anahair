import React, { forwardRef } from 'react'

import Link from '@/components/ui/link'
import { LinkType } from '@/components/ui/link/Link'
import { INFO } from '@/config'

const TelLink: LinkType = forwardRef(({ children, ...props }, ref) => (
  <Link
    {...props}
    ref={ref}
    href={`tel:${INFO.tel}`}
  >
    {children ?? INFO.tel}
  </Link>
))

export default TelLink
