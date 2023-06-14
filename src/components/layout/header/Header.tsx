import React, { useCallback, useEffect, useRef, useState } from 'react'

import cn from 'clsx'
import { useMotionValue, m } from 'framer-motion'
import { AppProps } from 'next/app'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { WithTranslation, withTranslation } from 'next-i18next'
import useMeasure from 'react-use-measure'

import { Contact, OpeningHours } from '@/components/common/info'
import LangSwitcherMinimal from '@/components/common/lang-switcher'
import CSSAnimatedLogoGroupOpticallyCentered from '@/components/common/logo/CSSAnimatedLogoGroupOpticallyCentered'
import Nav from '@/components/common/nav'
import { useLenisScroll } from '@/components/scrollrig/hooks/useLenisScroll'
import { useWindowSize } from '@/components/scrollrig/hooks/useWindowSize'
import { ScrollCallbackProps } from '@/components/scrollrig/scrollbar/SmoothScrollbar'
import Button from '@/components/ui/button'
import { LinkProps } from '@/components/ui/link/Link'
import useIsHome from '@/lib/hooks/useIsHome'
import { useMediaQuery } from '@/lib/hooks/useMediaQuery'
import { useStore } from '@/lib/store'
import { clamp } from '@/lib/utils/math'
import { down } from '@/lib/utils/media-query'

const LINK_PROPS: LinkProps = {
  className: 'lowercase',
  lineProps: {
    mode: 'hover',
    className: 'after:h-[.125rem] before:h-[.125rem] after:bottom-[0] before:bottom-[0]',
  },
}

enum SCROLL_DIRECTION {
  DOWN = 1,
  UP = -1,
  NONE = 0,
}

type HeaderProps = WithTranslation & {
  pageProps: AppProps['pageProps']
}

const Header = ({ pageProps, t }: HeaderProps) => {
  const { toggleMenu, displayMenu, toggleInfo, displayInfo, closeMenu, closeInfo } = useStore()

  const screenMdDown = useMediaQuery(down('md'))
  const [headerRef, { height: headerHeight }] = useMeasure()
  const { height: windowHeight } = useWindowSize()

  const { pathname } = useRouter()
  const isHome = useIsHome()
  const [headerIsExpanded, setHeaderIsExpanded] = useState(true)
  const [logoCanBeHovered, setLogoCanBeHovered] = useState(true)
  const [logoIsHovered, setLogoIsHovered] = useState(false)
  const [titleIsVisible, setTitleIsVisible] = useState(!isHome)

  const addendumBuffer = windowHeight * (screenMdDown ? 1.5 : 1)
  const scrollStartBuffer = isHome ? windowHeight / 2.3 : windowHeight / 4
  const scrollEndBuffer = headerHeight

  const scrollDirectionRef = useRef<number>(1)
  const lastPositionRef = useRef<number>(scrollStartBuffer)
  const lastHeaderYRef = useRef<number>(0)

  const headerY = useMotionValue(0)

  const [isNearAddendum, setIsNearAddendum] = useState(false)

  const scrollDirectionHasChanged = useCallback(
    (direction: SCROLL_DIRECTION) => direction !== SCROLL_DIRECTION.NONE && direction !== scrollDirectionRef.current,
    []
  )

  const handleScroll = useCallback(
    ({ scroll, direction, limit }: ScrollCallbackProps) => {
      if (!headerHeight) return

      if (scrollDirectionHasChanged(direction)) {
        scrollDirectionRef.current = direction
        lastHeaderYRef.current = headerY.get()
        if (direction === SCROLL_DIRECTION.UP) {
          lastPositionRef.current = Math.min(limit - scrollEndBuffer, scroll)
        } else {
          lastPositionRef.current = Math.max(scrollStartBuffer, scroll)
        }
      }

      const delta = lastPositionRef.current - scroll
      const y = clamp(-headerHeight, lastHeaderYRef.current + delta, 0)
      headerY.set(y)

      const headerAlmostCompletelyVisible = y > -(headerHeight * 0.333)
      setLogoCanBeHovered(headerAlmostCompletelyVisible)
      if (!headerAlmostCompletelyVisible && logoIsHovered) {
        setLogoIsHovered(false)
      }
      if (!isHome) {
        setTitleIsVisible(scroll < scrollStartBuffer)
      }
      setHeaderIsExpanded(/*isHome ? */ scroll < (screenMdDown ? headerHeight * 2 : headerHeight) /* : false*/)
      setIsNearAddendum(scroll > limit - addendumBuffer)
    },
    [
      scrollDirectionHasChanged,
      headerHeight,
      headerY,
      logoIsHovered,
      isHome,
      screenMdDown,
      addendumBuffer,
      scrollEndBuffer,
      scrollStartBuffer,
    ]
  )

  useLenisScroll(handleScroll)

  useEffect(() => {
    setHeaderIsExpanded(true)
    setTitleIsVisible(!isHome)
  }, [pathname, isHome])

  return (
    <m.header
      ref={headerRef}
      className={cn(
        'fixed z-50 top-0 text-xs md:text-sm xl:text-base xl:text-secondary flex flex-row items-between justify-between w-screen h-navbar max-width-page'
      )}
      style={{ y: headerY }}
    >
      <div
        onMouseEnter={() => !headerIsExpanded && logoCanBeHovered && setLogoIsHovered(true)}
        onMouseLeave={() => setLogoIsHovered(false)}
        className={cn(
          'relative w-2/3 md:w-1/4 h-full min-h-full flex items-center justify-center bg-secondary text-primary transition-[width,height,min-height] duration-300 md:duration-700',
          {
            '!w-3/4 md:!w-1/4 xl:!w-1/3 md:min-h-[16rem] !h-[200%] md:!h-[25vh] xl:!h-[50vh]':
              displayMenu || displayInfo || (isHome && headerIsExpanded) || logoIsHovered,
            'md:!w-1/4 xl:!w-1/4 md:!h-[12rem] xl:!h-[12rem]':
              !displayMenu && !displayInfo && !isHome && headerIsExpanded,
          }
        )}
      >
        <div
          className={cn(
            'absolute overflow-hidden flex w-screen md:w-full xl:w-[calc(min(50vw,var(--max-width-page)/2)-100%)] left-0 md:left-full top-full md:top-24 transition-[transform,height,min-height] will-change-[transform,height,min-height] duration-300 md:duration-500 -translate-y-full',
            {
              'md:min-h-[10rem] h-full md:h-[calc(25vh-6rem)] xl:h-[calc(50vh-6rem+1px)]': isHome || logoIsHovered,
              'h-full md:h-[calc(6rem)] xl:h-[calc(6rem)]': !isHome && !logoIsHovered,
              'translate-y-0 delay-300 md:delay-0': !displayMenu && !displayInfo && (headerIsExpanded || logoIsHovered),
            }
          )}
        >
          <div className='relative w-full h-1/2 md:h-full'>
            <div
              className={cn(
                'pointer-events-none bg-quinary p-6 3xl:p-9 absolute flex flex-col items-start md:items-center justify-center xl:items-start w-full h-full transition-opacity will-change-opacity duration-700 opacity-0',
                {
                  '!opacity-100 !pointer-events-auto': titleIsVisible && !logoIsHovered,
                }
              )}
            >
              <div>
                <h1 className='font-sans text-lg font-medium lowercase md:font-bold text-primary sm:text2xl xl:text-3xl !leading-none'>
                  {pageProps?.title ? t(pageProps.title) : null}
                </h1>
              </div>
            </div>
            <div
              className={cn(
                'bg-tertiary p-6 3xl:p-9 absolute hidden md:flex flex-col items-start justify-between w-full h-full space-y-6 transition-opacity will-change-opacity duration-700 opacity-0 pointer-events-none',
                {
                  'md:!opacity-100 md:!pointer-events-auto': isHome || logoIsHovered,
                }
              )}
            >
              <Contact className='w-full font-medium space-y-6 md:space-y-3 xl:space-y-6' />
              <OpeningHours className='hidden w-full font-medium 2xl:grid not-tall:!hidden' />
            </div>
          </div>
        </div>
        <Link
          href='/'
          className={cn(
            'relative p-6 md:p-6 w-full h-full flex items-center xl:items-center justify-center bg-secondary text-primary transition-colors duration-300 md:duration-700',
            {
              'md:pointer-events-none': useIsHome(),
              '!bg-primary': isNearAddendum && !(displayMenu || displayInfo),
            }
          )}
          onClick={() => {
            closeInfo()
            closeMenu()
          }}
        >
          <CSSAnimatedLogoGroupOpticallyCentered
            className={cn(
              'w-full max-w-[10rem] md:max-w-[12rem] xl:max-w-[12rem] text-primary transition-transform duration-300 md:duration-700',
              {
                'scale-125': displayMenu || displayInfo || (headerIsExpanded && isHome) || logoIsHovered,
                'md:scale-100 xl:scale-125 2xl:scale-150':
                  displayMenu || displayInfo || headerIsExpanded || logoIsHovered,
              }
            )}
            hairLogoClassName='pt-1 md:pt-2'
          />
        </Link>
      </div>
      <div
        className={cn(
          'relative flex flex-row h-full items-center justify-center flex-grow lg:justify-between bg-quaternary text-secondary'
        )}
      >
        <Nav
          className='flex-row items-center justify-around hidden w-full xl:justify-between xl:px-36 md:flex'
          itemClassName={cn('font-bold', 'hover:text-white transition-colors duration-300')}
          linkProps={LINK_PROPS}
        >
          <LangSwitcherMinimal linkProps={LINK_PROPS} />
        </Nav>
        <div
          className={cn('absolute top-0 left-0 md:hidden w-full h-full duration-150 will-change-transform', {
            'translate-y-full': displayMenu || displayInfo || (isHome && headerIsExpanded) || logoIsHovered,
          })}
        >
          <Button
            aria-label='Info'
            onClick={toggleInfo}
            className={cn('w-full h-full max-h-full text-primary !duration-[600ms]', {
              '!bg-tertiary !delay-[300ms]': !displayInfo,
              '!bg-quinary !text-primary !delay-[0ms]': displayInfo,
            })}
          >
            {displayInfo ? 'close' : 'info'}
          </Button>
        </div>
        <Button
          aria-label='Menu'
          onClick={toggleMenu}
          className={cn('relative z-10 md:hidden w-full h-full max-h-full text-secondary !duration-[600ms]', {
            '!bg-quaternary !delay-[300ms]': !displayMenu,
            '!bg-primary !text-primary !delay-[0ms]': displayMenu,
          })}
        >
          {displayMenu ? 'close' : 'menu'}
        </Button>
      </div>
    </m.header>
  )
}

export default withTranslation()(Header)
