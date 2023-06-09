import React, { forwardRef } from 'react'

import Link from '@/components/ui/link'
import { LinkType } from '@/components/ui/link/Link'
import { INFO } from '@/config'

const EmailLink: LinkType = forwardRef(({ children, ...props }, ref) => (
  <Link
    {...props}
    ref={ref}
    href={`mailto:${INFO.email}`}
  >
    {children ?? INFO.email}
  </Link>
))

export default EmailLink
