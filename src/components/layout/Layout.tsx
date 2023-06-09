import React, { FC, PropsWithChildren, useEffect } from 'react'

import { AppProps } from 'next/app'
import { isMobile } from 'react-device-detect'

import { InfoOverlay } from '@/components/common/info'
import Menu from '@/components/common/menu'
import Scrollbar from '@/components/layout/scrollbar'
import WebGLScene from '@/components/layout/webgl'
import { SmoothScrollbar } from '@/components/scrollrig/scrollbar/SmoothScrollbar'
import { WEBGL_ENABLED } from '@/config'
import { useMediaQuery } from '@/lib/hooks'
import { useStore } from '@/lib/store'
import { down } from '@/lib/utils'

import Header from './header'
import { Addendum, PortalElement } from './views'
import PageWrapper from './wrapper'

const MenuUI: FC = () => {
  const { displayMenu, closeMenu, openInfo } = useStore()
  const isSmallScreen = useMediaQuery(down('md'))

  useEffect(() => {
    !isSmallScreen && closeMenu()
  }, [closeMenu, isSmallScreen])

  return (
    <Menu
      open={displayMenu}
      onClose={closeMenu}
      onOpenInfo={openInfo}
    />
  )
}

const InfoUI: FC = () => {
  const { displayInfo, closeInfo } = useStore()
  const isSmallScreen = useMediaQuery(down('md'))

  useEffect(() => {
    !isSmallScreen && closeInfo()
  }, [closeInfo, isSmallScreen])

  return (
    <InfoOverlay
      open={displayInfo}
      onClose={closeInfo}
    />
  )
}

type LayoutProps = {
  pageProps: AppProps['pageProps']
}

const Layout: FC<PropsWithChildren<LayoutProps>> = ({ children, pageProps }) => {
  const { displayMenu, displayInfo } = useStore()

  return (
    <>
      <Scrollbar />
      <MenuUI />
      <InfoUI />
      <Header pageProps={pageProps} />
      <SmoothScrollbar
        locked={displayMenu || displayInfo}
        scrollInContainer={false}
        config={{
          duration: !isMobile ? 1.8 : 1.0,
          smoothTouch: false,
          wheelMultiplier: 0.5,
          touchMultiplier: 0.5,
        }}
      >
        {(bind) => (
          <main {...bind}>
            <PageWrapper>{children}</PageWrapper>
            <PortalElement />
            <Addendum />
            {WEBGL_ENABLED && <WebGLScene eventSource={bind.ref} />}
          </main>
        )}
      </SmoothScrollbar>
    </>
  )
}

export default Layout
