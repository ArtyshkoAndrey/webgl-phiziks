<template lang="pug">
  .container(style="position: relative")
    .row
      .col-md-4.col-sm-6.col-12
        input#openfile(type='file' accept='.out' style='display: none')
        .wrapper.mt-5
          h2 Start
          p
            a(href='#') New project
          p
            a(href='#' @click='openFile()') Open file
      .col-md-4.col-sm-6.col-12.start
        .wrapper.mt-5
          h2 Help
          p
            a(href='#' @click='require("electron").shell.openExternal("https://github.com/ArtyshkoAndrey/webgl-phiziks")') GitHub repository
          p
            a(href='#' @click='require("electron").shell.openExternal("https://github.com/ArtyshkoAndrey/webgl-phiziks/wiki")') Product documentation
          p
            a(href='#' @click='require("electron").shell.openExternal("https://github.com/ArtyshkoAndrey/webgl-phiziks/blob/master/readme.md")') About
      .col-md-4.col-sm-6.col-12.start
        .wrapper.mt-5
          h2 Customize
          p
            a(href="#") Video graphics
          p
            button.text-primary(data-toggle="modal" data-target="#theme") Color Theme
          p
            a(href="#") Settings
    themeModal
</template>

<script>
  import theme from './settings/theme.vue'
  export default {
    name: 'index',
    components: {
      'themeModal': theme
    },
    methods: {
      openFile: function () {
        let chooser = document.querySelector('#openfile')
        chooser.click()
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
