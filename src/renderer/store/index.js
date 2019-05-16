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
    dark: true,
    graphics: {
      antiAliasing: true,
      quality: 4,
      postProcessing: false
    }
  },
  mutations: {
    dark (state, flag) {
      state.dark = flag
    }
  },
  actions: {
    setTheme ({ commit }, flag) {
      commit('dark', flag)
    }
  },
  getters: {
    dark: state => {
      return state.dark
    },
    graphics: state => {
      return state.graphics
    }
  }
})
