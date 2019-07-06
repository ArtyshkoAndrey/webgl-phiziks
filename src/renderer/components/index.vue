<template>
  <v-container fluid>
    <v-layout align-center justify-center row wrap fill-height>
      <v-flex md3 xs12>
        <h2 class="grey--text text--lighten-2">Start</h2>
        <input id="openfile" type='file' style='display: none'/>
        <a href="#" @click="openFile(false)">New Project</a>
        <br>
        <a href="#" @click="openFile(true)">Open File</a>
      </v-flex>
      <v-flex md3 xs12>
        <h2 class="grey--text text--lighten-2">Help</h2>
        <a href='#' class="my-2" @click='require("electron").shell.openExternal("https://github.com/ArtyshkoAndrey/webgl-phiziks")'>GitHub repository</a>
        <br>
        <a href='#' class="my-2" @click='require("electron").shell.openExternal("https://github.com/ArtyshkoAndrey/webgl-phiziks/wiki")'>Product documentation</a>
        <br>
        <a href='#' class="my-2" @click='require("electron").shell.openExternal("https://github.com/ArtyshkoAndrey/webgl-phiziks/blob/master/readme.md")'>About</a>
      </v-flex>
      <v-flex md3 xs12>
        <h2 class="grey--text text--lighten-2">Settings</h2>
        <a href='#' @click="openThemeModal" class="my-2">Select Theme</a>
        <br>
        <a href='#' @click="openGraphicsModal" class="my-2">Graphics settings</a>
      </v-flex>
      <themeModal ref='theme' :dark='dark'></themeModal>
      <GraphicsModal ref='graphics' :graphics='graphics'></GraphicsModal>
    </v-layout>
<!--    <v-layout class="position: fixed; bottom: 10px; left: 20px">-->
<!--      <v-flex md6 xs12 class="grey&#45;&#45;text text&#45;&#45;lighten-2">-->
<!--        <h3>Description</h3>-->
<!--        <p>{{ description }}</p>-->
<!--      </v-flex>-->
<!--    </v-layout>-->
    <v-layout class="row wrap" style="position: fixed; bottom: 10px; right: 20px">
      <v-flex md8 xs12 class="grey--text text--lighten-2 pa-3">
        <p>{{ description }}</p>
      </v-flex>
      <v-flex md4 xs12 class="grey--text text--lighten-2 pa-3">
        Powered by {{ author }}
        <br>
        Version of the program {{ ver }}
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import theme from './settings/theme.vue'
  import graphics from './settings/graphics.vue'
  import { version, author, description } from '../../../package.json'
  export default {
    name: 'index',
    props: ['dark', 'graphics'],
    components: {
      'themeModal': theme,
      'GraphicsModal': graphics
    },
    data: () => {
      return {
        ver: version,
        author: author,
        description: description
      }
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
