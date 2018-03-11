import Vue from 'vue'
import ElementUI from 'element-ui'

import enLocale from 'element-ui/lib/locale/lang/en'
import trLocale from 'element-ui/lib/locale/lang/tr-TR'

export default ({ app, route, error }) => {
  app.i18n.mergeLocaleMessage('en', enLocale)
  app.i18n.mergeLocaleMessage('tr', trLocale)

  Vue.use(ElementUI, {
    i18n: (key, value) => app.i18n.t(key, value)
  })
}
