require('dotenv').config()

module.exports = {
  mode: 'spa',
  loading: {
    color: '#111111',
    height: '4px'
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
  router: {
    middleware: ['blupoint_auth']
  },
  middleware: ['auth'],
  modules: [
    '@nuxtjs/dotenv',
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
    baseURL: process.env.SERVICE_URL,
    credentials: false
  },
  auth: {
    redirect: {
      callback: '/callback'
    },
    endpoints: {
      login: { url: `${process.env.ORIGIN}/api/login`, method: 'post', propertyName: 'token' },
      logout: { url: `${process.env.ORIGIN}/api/logout`, method: 'post', propertyName: 'token' },
      user: { url: `${process.env.SERVICE_URL}/api/me`, method: 'get', propertyName: 'user' }
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
