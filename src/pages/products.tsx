import React, { FC, SVGProps } from 'react'

import cn from 'clsx'
import { useTranslation } from 'next-i18next'
import { NextSeo } from 'next-seo'

import CorinneSvg from '@/assets/corinne.svg'
import DavinesSvg from '@/assets/davines.svg'
import KMSvg from '@/assets/km.svg'
import img from '@/assets/products.jpg'
import ShueUemuraSvg from '@/assets/shu-uemura.svg'
import CoverImage from '@/components/common/cover-image'
import { buildStaticPropsGetterWithTitle } from '@/lib/utils/page-data'

const PRODUCTS: ProductProps[] = [
  {
    href: 'https://davines.com',
    title: 'Davines',
    Cmp: DavinesSvg,
    className: 'pb-18 md:pb-5 xl:pb-12',
  },
  {
    href: 'https://www.shuuemura-usa.com/',
    title: 'Shu Uemura',
    Cmp: ShueUemuraSvg,
  },
  {
    href: 'https://www.instagram.com/kevin.murphy',
    title: 'Kevin Murphy',
    Cmp: KMSvg,
  },
  {
    href: 'https://corinneworld.com/',
    title: 'Corinne',
    Cmp: CorinneSvg,
  },
]

type ProductProps = {
  href: string
  className?: string
  title?: string
  Cmp: FC<SVGProps<any>>
}

const Product = ({ title = '', href, Cmp, className = '', ...props }: ProductProps) => (
  <a
    href={href}
    target='_blank'
    className='w-full'
    rel='noreferrer'
  >
    <div
      title={title}
      className={cn(
        'w-full p-12 md:p-8 lg:p-12 aspect-square bg-quaternary hover:bg-secondary transition-colors text-secondary hover:text-primary duration-700',
        className
      )}
    >
      <div className='relative flex items-center justify-center w-full h-full'>
        <Cmp className={cn('w-full h-auto overflow-visible', className)} />
      </div>
    </div>
  </a>
)

export default function ProductsPage() {
  const { t } = useTranslation()

  return (
    <>
      <NextSeo title={t('products')} />
      <div
        className={cn(
          'relative w-full fit-nav-pt md:pt-0 flex flex-col-reverse justify-start items-start md:flex-row md:h-screen'
        )}
      >
        <div className='relative flex items-center justify-center w-full px-12 pt-12 pb-6 md:pt-60 md:px-9 md:w-1/2 lg:px-20 lg:pt-72 lg:pb-20'>
          <div className='w-full'>
            <div className='items-center justify-center font-sans text-xl leading-normal grid gap-12 md:gap-9 lg:gap-24 grid-cols-1 md:grid-cols-2 text-[#333] md:text-xl'>
              {PRODUCTS.map((product, index) => (
                <Product
                  key={`product-${index}`}
                  {...product}
                />
              ))}
            </div>
          </div>
        </div>
        <div className='relative w-full h-72 md:w-1/2 md:h-[200vh]'>
          <CoverImage src={img} />
        </div>
      </div>
    </>
  )
}

export const getStaticProps = buildStaticPropsGetterWithTitle('products')
