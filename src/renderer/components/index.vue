<template>
  <v-container fluid>
    <v-layout align-center justify-center row wrap fill-height>
      <v-flex md3 xs12>
        <h2>Start</h2>
        <input id="openfile" type='file' accept='.out' style='display: none'/>
        <p class="primary--text mt-2 pb-0 mb-0">New project</p>
        <a href="#" @click="openFile">Open File</a>
      </v-flex>
      <v-flex md3 xs12>
        <h2>Help</h2>
        <a href='#' class="my-2" @click='require("electron").shell.openExternal("https://github.com/ArtyshkoAndrey/webgl-phiziks")'>GitHub repository</a>
        <br>
        <a href='#' class="my-2" @click='require("electron").shell.openExternal("https://github.com/ArtyshkoAndrey/webgl-phiziks/wiki")'>Product documentation</a>
        <br>
        <a href='#' class="my-2" @click='require("electron").shell.openExternal("https://github.com/ArtyshkoAndrey/webgl-phiziks/blob/master/readme.md")'>About</a>
      </v-flex>
      <v-flex md3 xs12>
        <h2>Settings</h2>
        <a href='#' @click="openThemeModal" class="my-2">Select Theme</a>
      </v-flex>
      <themeModal ref='theme'></themeModal>
    </v-layout>
  </v-container>
</template>

<script>
  import theme from './settings/theme.vue'
  // const electron = require('electron')
  // const ipc = electron.ipcRenderer
  export default {
    name: 'index',
    components: {
      'themeModal': theme
    },
    methods: {
      openFile: function () {
        // ipc.send('webGlWindow-window-open')
        let chooser = document.querySelector('#openfile')
        chooser.click()
        // this.$parent.status = true
        chooser.addEventListener('change', (evt) => {
          this.$parent.path = document.querySelector('#openfile').files[0].path
          this.$router.push('graphics')
        })
      },
      openThemeModal () {
        this.$refs.theme.open()
      }
    }
  }
</script>

<style>

</style>
