export default {
  actions: {
    // Required for nuxt/auth module
    nuxtServerInit({ commit, dispatch }) {
      // dispatch('near/init')
    },
    async nuxtClientInit({ commit, dispatch }) {
      // Run once on client side init
      dispatch('near/init')
    },
  }
}
