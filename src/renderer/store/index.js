import Vue from 'vue'
import Vuex from 'vuex'

import { createPersistedState } from 'vuex-electron'
// import modules from './modules'
Vue.use(Vuex)

export default new Vuex.Store({
  // modules,
  plugins: [
    createPersistedState()
    // createSharedMutations()
  ],
  strict: process.env.NODE_ENV !== 'production',
  state: {
    light: false
  },
  mutations: {
    lightTheme (state, flag) {
      state.light = flag
    }
  },
  actions: {
    setTheme ({ commit }, flag) {
      console.log('Test')
      commit('lightTheme', flag)
    }
  },
  getters: {
    lightTheme: state => {
      return state.light
    }
  }
})
