<template>
  <v-container fluid>
    <v-layout align-center justify-center row wrap fill-height>
      <v-flex md3 xs12>
        <h2>Start</h2>
        <input id="openfile" type='file' style='display: none'/>
        <a href="#" @click="openFile(false)">New Project</a>
        <br>
        <a href="#" @click="openFile(true)">Open File</a>
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
        <br>
        <a href='#' @click="openGraphicsModal" class="my-2">Graphics settings</a>
      </v-flex>
      <themeModal ref='theme' :dark='dark'></themeModal>
      <GraphicsModal ref='graphics' :graphics='graphics'></GraphicsModal>
    </v-layout>
  </v-container>
</template>

<script>
  import theme from './settings/theme.vue'
  import graphics from './settings/graphics.vue'
  export default {
    name: 'index',
    props: ['dark', 'graphics'],
    components: {
      'themeModal': theme,
      'GraphicsModal': graphics
    },
    mounted () {
      console.log('Index.vue dark:', this.dark)
    },
    methods: {
      openFile (pr) {
        if (pr === false) {
          this.$parent.path = false
          this.$router.push('graphics')
        } else {
          let chooser = document.querySelector('#openfile')
          chooser.click()
          // this.$parent.status = true
          chooser.addEventListener('change', (evt) => {
            this.$parent.path = document.querySelector('#openfile').files[0].path
            this.$router.push('graphics')
          })
        }
      },
      openThemeModal () {
        this.$refs.theme.open()
      },
      openGraphicsModal () {
        this.$refs.graphics.open()
      }
    }
  }
</script>

<style>

</style>
