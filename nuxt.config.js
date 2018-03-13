const ORIGIN = 'http://localhost:3000'
const HOST = 'localhost'
const PORT = 3000
const SERVICE_URL = 'http://management.dogannet.tv'
const PREVIEW_URL = 'http://preview.dogannet.tv'
const DELIVERY_URL = 'http://delivery.dogannet.tv'
const IMAGE_BASE_URL = 'http://assets.dogannet.tv/img'
const MONGO_URL = 'mongodb://localhost/quark_v3_output'

module.exports = {
  mode: 'spa',
  loading: {
    color: '#111111',
    height: '4px'
  },
  env: {
    origin: process.env.ORIGIN || ORIGIN,
    host: process.env.HOST || HOST,
    port: process.env.PORT || PORT,
    apiBaseUrl: process.env.SERVICE_URL || SERVICE_URL,
    apiPreviewBaseUrl: process.env.PREVIEW_URL || PREVIEW_URL,
    apiDeliveryUrl: process.env.DELIVERY_URL || DELIVERY_URL,
    imageBaseUrl: process.env.IMAGE_BASE_URL || IMAGE_BASE_URL,
    imageQuality: '75',
    mongoUrl: process.env.MONGO_URL || MONGO_URL
  },
  /*
  ** Headers of the page
  */
  head: {
    title: 'Blupoint Output',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Blupoint Output Generator' }
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
      login: { url: `${process.env.ORIGIN || ORIGIN}/api/login`, method: 'post', propertyName: 'token' },
      logout: { url: `${process.env.ORIGIN || ORIGIN}/api/logout`, method: 'post', propertyName: 'token' },
      user: { url: `${process.env.SERVICE_URL || SERVICE_URL}/api/me`, method: 'get', propertyName: 'user' }
    }
  },
  sentry: {
    public_dsn: 'https://2a0a0088eb244205b32a9ec776b104b9@sentry.dogannet.tv/6'
  },
  plugins: [
    '~/plugins/axios',
    '~/plugins/element-ui',
    '~/plugins/moment'
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
