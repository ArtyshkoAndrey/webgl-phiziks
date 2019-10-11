import Vue from 'vue'
import Vuex from 'vuex'

import { createPersistedState } from 'vuex-electron'
Vue.use(Vuex)

export default new Vuex.Store({
  plugins: [
    createPersistedState()
  ],
  strict: process.env.NODE_ENV !== 'production',
  state: {
    dark: true,
    helloWord: 1,
    graphics: {
      antiAliasing: true,
      quality: 4,
      postProcessing: false
    }
  },
  mutations: {
    dark (state, flag) {
      state.dark = flag
    },
    helloWord (state, flag) {
      state.helloWord = flag
    }
  },
  actions: {
    setTheme ({ commit }, flag) {
      commit('dark', flag)
    },
    setHelloWord ({commit}, flag) {
      commit('helloWord', flag)
    }
  },
  getters: {
    dark: state => {
      return state.dark
    },
    graphics: state => {
      return state.graphics
    },
    helloWord: state => {
      return state.helloWord
    }
  }
})
