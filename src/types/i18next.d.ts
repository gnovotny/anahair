/**
 * If you want to enable locale keys typechecking and enhance IDE experience.
 *
 * Requires `resolveJsonModule:true` in your tsconfig.json.
 *
 * @link https://www.i18next.com/overview/typescript
 */
import 'i18next'

import type common from '../../public/locales/en/common.json'

interface I18nNamespaces {
  common: typeof common
}

declare module 'i18next' {
  interface CustomTypeOptions {
    // returnNull: false
    // defaultNS: 'translation'
    resources: I18nNamespaces
  }
}
