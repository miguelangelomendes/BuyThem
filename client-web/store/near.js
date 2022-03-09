import * as near from '../near/interface'

function initialState() {
  return {
    is_loading: true,
    is_session_loading: false,
    contract: null,
    nearConfig: null,
    user: null,
    is_logged_in: false,
  }
}

export const state = () => (initialState())

export const mutations = {
  SET_LOADING(state, isUpdating) {
    state.is_loading = isUpdating
  },
  SET_SESSION_LOADING(state, isUpdating) {
    state.is_loading = isUpdating
  },
  SET_CONTRACT(state, contract) {
    state.contract = contract
  },
  SET_USER(state, user) {
    state.user = user
  },
  SET_CONFIG(state, nearConfig) {
    state.nearConfig = nearConfig
  },
  SET_IS_LOGGED_IN(state, isSingnedIn) {
    state.is_logged_in = isSingnedIn
  },
}

export const actions = {
  async init({ commit }) {
    try {
      commit('SET_LOADING', true)
      const { contract, currentUser, nearConfig, walletConnection } = await near.initContract()
      console.log({ contract, currentUser, nearConfig, walletConnection })
      commit('SET_CONTRACT', contract)
      commit('SET_USER', currentUser)
      commit('SET_CONFIG', nearConfig)
      console.log("walletConnection.isSignedIn()", walletConnection.isSignedIn())
      commit('SET_IS_LOGGED_IN', walletConnection.isSignedIn())

      commit('SET_LOADING', false)
    } catch (err) {
      console.log('Contract init error: ', err)
      commit('SET_LOADING', false)
      return null
    }
  },
  async login({ commit }) {
    try {
      commit('SET_SESSION_LOADING', true)
      const result = await near.login()
      console.log('Login result ', result)
      // commit('SET_IS_LOGGED_IN', walletConnection.isSingnedIn())
      // commit('SET_SESSION_LOADING', false)
    } catch (err) {
      console.log('Contract init error: ', err)
      commit('SET_SESSION_LOADING', false)
      return null
    }
  },
  async logout({ commit }) {
    try {
      commit('SET_SESSION_LOADING', true)
      const result = await near.logout()
      console.log('Logout result ', result)
      commit('SET_IS_LOGGED_IN', false)
      // commit('SET_SESSION_LOADING', false)
    } catch (err) {
      console.log('Contract init error: ', err)
      commit('SET_SESSION_LOADING', false)
      return null
    }
  },
  async create({ commit, dispatch }, item) {
    try {
      commit('SET_LOADING', true)
      const result = await near.createItem(item)
      commit('SET_LOADING', false)
      return result
    } catch (err) {
      console.log('Contract init error: ', err)
      commit('SET_LOADING', false)
      return null
    }
  }
}