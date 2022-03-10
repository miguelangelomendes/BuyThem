export default {
  head: {
    title: 'BuyThem',
    titleTemplate: 'BuyThem - %s',
    meta: [
      { charset: 'utf-8' },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1'
      },
  
      {
        hid: 'og:type',
        property: 'og:type',
        content: 'website'
      },
      {
        hid: 'og:title',
        property: 'og:title',
        content: 'BuyThem'
      },
      {
        hid: 'og:description',
        property: 'og:description',
        content:
        'A place where you can buy and sell photos.'
      },
     
      // default
      {
        hid: 'title',
        name: 'title',
        content:
          'BuyThem'
      },
      
   
      {
        hid: 'description',
        name: 'description',
        content:
        'A place where you can buy and sell photos.'
      },

      // Twitter
      // Test on: https://cards-dev.twitter.com/validator
      {
        hid: 'twitter:card',
        name: 'twitter:card',
        content: 'summary'
      },
      
          {
        hid: 'twitter:title',
        name: 'twitter:title',
        content: 'BuyThem'
      },
      {
        hid: 'twitter:description',
        name: 'twitter:description',
        content:
          'A place where you can buy and sell photos.'
      },

    ],
    // canonical
    link: [
     
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ],
  },
  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [
    '~/assets/css/tailwind.css'
  ],

  /*
  ** Customize the progress-bar color
  */
  loading: {
    color: '#32C3A1',
    height: '8px'
  },
  loadingIndicator: {
    name: 'circle',
    color: '#3B8070',
    background: 'white'
  },

  serverMiddleware: [
    // '~/server-middleware/logger',
    { path: '/cryptography', handler: '~/api/cryptography.js' },
    { path: '/storage', handler: '~/api/storage.js' },
  ],
  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    { src: '~/plugins/axios.js' },
    { src: '~/plugins/nuxt-client-init.js', mode: 'client' },
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: [
    {
      path: '~/components/',
    },
    {
      path: '~/components/Icons',
    },
  ],

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/tailwindcss
    '@nuxtjs/tailwindcss',
    '@nuxt/postcss8',
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    // https://i18n.nuxtjs.org/setup
    'nuxt-i18n',
    // https://github.com/nuxt-community/dayjs-module
    '@nuxtjs/dayjs',
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
  ],
  i18n: {
    locales: [
      {
        code: 'en',
        name: 'English',
        iso: 'en-US',
        file: 'en_US.js'
      },
    ],
    lazy: true,
    langDir: '~/lang/',
    defaultLocale: 'en',
    strategy: 'no_prefix',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'locale',
      onlyOnRoot: true,  // recommended
    },
    vueI18n: {
      fallbackLocale: 'en',
    },
  },

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
    postcss: {
      plugins: {
        tailwindcss: {},
        autoprefixer: {},
      },
    },
    babel: {
      plugins: [
        ['@babel/plugin-proposal-private-methods', { loose: true }],
        ['@babel/plugin-proposal-private-property-in-object', { loose: true }]
      ]
    },
  }
}
