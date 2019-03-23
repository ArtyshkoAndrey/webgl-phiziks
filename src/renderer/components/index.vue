<template lang="pug">
  .container
    .row
      .col-md-4.col-sm-6.col-12
        input#openfile(type='file' accept='.txt' style='display: none')
        .wrapper.mt-5
          h2 Start
          p
            a(href="#") New project
          p
            a(href="#" @click='openFile()') Open file
      .col-md-4.col-sm-6.col-12.start
        .wrapper.mt-5
          h2 Help
          p
            a(href="#" @click='require("electron").shell.openExternal("https://github.com/ArtyshkoAndrey/webgl-phiziks")') GitHub repository
          p
            a(href="#" @click='require("electron").shell.openExternal("https://github.com/ArtyshkoAndrey/webgl-phiziks/wiki")') Product documentation
          p
            a(href="#" @click='require("electron").shell.openExternal("https://github.com/ArtyshkoAndrey/webgl-phiziks/blob/master/readme.md")') About
      .col-md-4.col-sm-6.col-12.start
        .wrapper.mt-5
          h2 Customize
          p
            a(href="#") Video graphics
          p
            button.text-primary(data-toggle="modal" data-target="#theme") Color Theme
          p
            a(href="#") Settings
      .col-md-8.offset-md-2.col-12.text-center.mt-5
        h2 ScreenShot
        #carouselExampleControls.carousel.slide(data-ride="carousel")
          .carousel-inner
            .carousel-item.active
              img.img-thumbnail(src='./../../../static/img/1.png')
            .carousel-item
              img.img-thumbnail(src='./../../../static/img/2.png')
          a.carousel-control-prev(href="#carouselExampleControls" role="button" data-slide="prev")
            span.carousel-control-prev-icon(aria-hidden="true")
            span.sr-only Previous
          a.carousel-control-next(href="#carouselExampleControls" role="button" data-slide="next")
            span.carousel-control-next-icon(aria-hidden="true")
            span.sr-only Next
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
        let self = this
        let chooser = document.querySelector('#openfile')
        chooser.click()
        chooser.addEventListener('change', function (evt) {
          self.$parent.path = document.querySelector('#openfile').files[0].path
          self.$router.push('graphics')
        })
      }
    }
  }
</script>

<style>

</style>