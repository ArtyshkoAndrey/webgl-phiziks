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
        <h2>Start</h2>
        <p class="primary--text mt-2 pb-0 mb-0">New project</p>
        <p class="primary--text mt-2 pb-0 mb-0">Open File</p>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  export default {
    name: 'index',
    methods: {
      openFile: function () {
        let chooser = document.querySelector('#openfile')
        chooser.click()
        // this.$parent.status = true
        chooser.addEventListener('change', (evt) => {
          this.$parent.path = document.querySelector('#openfile').files[0].path
          this.$router.push('graphics')
        })
      }
    }
  }
</script>

<style>

</style>
