const SERVICE_URL = 'http://dev-management.dogannet.tv'
const PREVIEW_URL = 'http://dev-preview.dogannet.tv'
const DELIVERY_URL = 'http://dev-delivery.dogannet.tv'
const IMAGE_BASE_URL = 'http://assets.dogannet.tv/img'

module.exports = {
  env: {
    apiBaseUrl: process.env.SERVICE_URL || SERVICE_URL,
    apiPreviewBaseUrl: process.env.PREVIEW_URL || PREVIEW_URL,
    apiDeliveryUrl: process.env.DELIVERY_URL || DELIVERY_URL,
    imageBaseUrl: process.env.IMAGE_BASE_URL || IMAGE_BASE_URL,
    imageQuality: '75'
  },
  /*
  ** Headers of the page
  */
  head: {
    title: 'starter',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Quark V3 Output Generator' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
  ** Global CSS
  */
  css: [
    {
      src: 'element-ui/lib/theme-chalk/index.css',
      lang: 'css'
    },
    {
      src: '~/assets/scss/main.scss',
      lang: 'scss'
    }
  ],
  /*
  ** Add axios globally
  */
  build: {
    /*
    ** Run ESLINT on save
    */
    extend (config, ctx) {
      if (ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    },
    extractCSS: true
  },
  middleware: 'auth',
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/auth',
    '@nuxtjs/sentry',
    'qonfucius-nuxt-fontawesome',
    ['nuxt-i18n', {
      locales: [
        {
          code: 'en',
          iso: 'en-US',
          name: 'English',
          langFile: 'en-IE.json'
        },
        {
          code: 'tr',
          iso: 'tr-TR',
          name: 'Türkçe',
          langFile: 'tr-TR.json'
        }
      ],
      loadLanguagesAsync: true,
      langDir: 'locales/',
      defaultLocale: 'tr',
      seo: false
    }]
  ],
  axios: {
    debug: false,
    baseURL: process.env.SERVICE_URL || SERVICE_URL,
    credentials: false
  },
  auth: {
    redirect: {
      callback: '/callback'
    },
    endpoints: {
      login: { url: `${process.env.apiBaseUrl || SERVICE_URL}/api/tokens`, method: 'post', propertyName: 'token' },
      logout: false,
      user: { url: `${process.env.apiBaseUrl || SERVICE_URL}/api/me`, method: 'get', propertyName: 'user' }
    }
  },
  sentry: {
    public_dsn: 'https://2a0a0088eb244205b32a9ec776b104b9@sentry.dogannet.tv/6'
  },
  plugins: [
    '~/plugins/axios',
    '~/plugins/element-ui'
  ],
  fontAwesome: {
    packs: [
      {
        package: '@fortawesome/fontawesome-free-regular'
      },
      {
        package: '@fortawesome/fontawesome-free-solid'
      },
      {
        package: '@fortawesome/fontawesome-free-brands'
      }
    ]
  }
}
