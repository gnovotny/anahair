import React, { FC, PropsWithChildren, ReactElement, useCallback, useMemo, useRef } from 'react'

import cn from 'clsx'
import { useTranslation } from 'next-i18next'

import { ScrollCallbackProps } from '@/components/scrollrig/scrollbar/SmoothScrollbar'
import Link from '@/components/ui/link'
import { INFO } from '@/config'
import { useMediaQuery } from '@/lib/hooks/useMediaQuery'
import { clamp, mapLinear } from '@/lib/utils/math'
import { down } from '@/lib/utils/media-query'
import { setStyles } from '@/lib/utils/style'

import { useAddendumScroll } from '../useAddendumScroll'

const WITH_BLUR = false

const AddendumWordSplitLink: FC<PropsWithChildren<{ href: string }>> = ({ children, href }) => (
  <Link
    href={href}
    className={cn('font-serif font-bold transition-colors duration-[1300ms] decoration-1 underline-offset-4')}
    lineProps={{
      className: cn(
        'after:h-[.125rem] before:h-[.125rem] md:after:h-[.175rem] md:before:h-[.175rem] xl:after:h-[.225rem] xl:before:h-[.225rem] after:bottom-[.15rem] before:bottom-[.15rem] md:after:bottom-[.1rem] md:before:bottom-[.1rem] xl:after:bottom-[.05rem] xl:before:bottom-[.05rem]'
      ),
    }}
  >
    {children}
  </Link>
)

const AddendumWordSplit: FC<PropsWithChildren<{ className?: string }>> = ({ children, className }) => {
  const screenMdDown = useMediaQuery(down('md'))

  const elRef = useRef<HTMLDivElement | null>(null)

  const wordsRef = useRef<Array<HTMLSpanElement | null>>([])
  const altWordsRef = useRef<Array<HTMLSpanElement | null>>([])
  const activeRef = useRef<Array<boolean>>([])
  const elementOpacityRef = useRef<number>(1)

  const { t } = useTranslation()

  const wordsStrings = useMemo(() => {
    let text = ''
    React.Children.map(children, (child) => {
      if (typeof child === 'string' || typeof child === 'number') {
        text += String(child)
      } else {
        throw new Error(`WordSplit expect a text as children`)
      }
    })

    return text.split(' ')
  }, [children])

  const words = useMemo(
    () =>
      wordsStrings.map((word, i) => {
        let content: string | ReactElement = word
        let fullContent: string | ReactElement = word
        switch (word) {
          case '(call)':
            content = <span className='font-serif font-bold'>{t('call')}</span>
            fullContent = <AddendumWordSplitLink href={`tel:${INFO.tel}`}>{t('call')}</AddendumWordSplitLink>
            break
          case '(street_address)':
            content = <span className='font-serif font-bold'>{INFO.streetAddress}</span>
            fullContent = <AddendumWordSplitLink href={INFO.googlePlaceUrl}>{INFO.streetAddress}</AddendumWordSplitLink>
            break
        }

        return (
          <span
            className='relative inline-flex '
            key={`word-${i}-wrapper`}
          >
            <span
              style={{ whiteSpace: 'pre' }}
              className={cn('opacity-0 text-primary transition-[opacity] will-change-[opacity] duration-[900ms]', {
                'blur-sm transition-[opacity,filter] will-change-[opacity,filter]': WITH_BLUR,
              })}
              key={`word-${i}`}
              ref={(el) => { wordsRef.current[i] = el }}
            >
              {fullContent}{' '}
            </span>
            <span
              style={{ whiteSpace: 'pre' }}
              className='absolute inline-flex items-center justify-center -z-10 text-[#67676730] text-quinary'
              key={`word-${i}-alt`}
              ref={(el) => { altWordsRef.current[i] = el }}
            >
              {content}{' '}
            </span>
          </span>
        )
      }),
    [t, wordsStrings]
  )

  const cb = useCallback(
    ({ scroll }: ScrollCallbackProps, thresholds: Record<string, number>) => {
      const startIntro = thresholds['startIntro']
      const endIntro = thresholds['endIntro']
      const startOutro = thresholds['startOutro']
      const endOutro = thresholds['endOutro']

      const introActive = scroll >= startIntro && scroll < endIntro * 1.2
      const outroActive = scroll > startOutro && scroll < endOutro * 1.2

      if (introActive) {
        const activeWordIndex = clamp(0, mapLinear(startIntro, endIntro, scroll, 0, words.length), words.length)

        wordsRef.current.forEach((wordElement, index) => {
          if (!wordElement) return

          const wordActive = activeWordIndex >= index

          if (activeRef.current[index] !== wordActive) {
            activeRef.current[index] = wordActive
            setStyles(wordElement, {
              opacity: wordActive ? '1' : '0',
            })
          }
        })
      }

      if (screenMdDown && elRef.current) {
        if (outroActive) {
          elementOpacityRef.current = clamp(0, mapLinear(startOutro, endOutro, scroll, 1, 0), 1)
          setStyles(elRef.current, {
            opacity: String(elementOpacityRef.current),
          })
        } else if (scroll > endOutro * 1.2 && elementOpacityRef.current !== 0) {
          elementOpacityRef.current = 0
          setStyles(elRef.current, {
            opacity: String(elementOpacityRef.current),
          })
        } else if (scroll < startOutro && elementOpacityRef.current !== 1) {
          elementOpacityRef.current = 1
          setStyles(elRef.current, {
            opacity: String(elementOpacityRef.current),
          })
        }
      }
    },
    [screenMdDown, words.length]
  )

  useAddendumScroll(cb)

  return (
    <div
      className={cn('will-change-[opacity] opacity-100', className)}
      ref={elRef}
    >
      {words}
    </div>
  )
}

export default AddendumWordSplit
