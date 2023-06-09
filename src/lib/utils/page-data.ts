import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

export type GetStaticPropsArgs = {
  locale: string
}
export const i18nTranslationNamespaces: Array<'common'> = ['common']

export const getServerSideTranslationProps = ({ locale }: GetStaticPropsArgs) =>
  serverSideTranslations(locale, i18nTranslationNamespaces)

export const getStaticProps = async (props: GetStaticPropsArgs) => ({
  props: {
    ...(await getServerSideTranslationProps(props)),
  },
})

export const buildStaticPropsGetterWithTitle = (title: string) => async (props: GetStaticPropsArgs) => ({
  props: {
    ...(await getServerSideTranslationProps(props)),
    title,
  },
})
