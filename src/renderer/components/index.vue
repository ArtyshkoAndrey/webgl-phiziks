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
      .col-md-4.col-sm-6.col-12
        .wrapper.mt-5
          h2 Help
          p
            a(href="#" @click='require("electron").shell.openExternal("https://github.com/ArtyshkoAndrey/webgl-phiziks")') GitHub repository
          p
            a(href="#" @click='require("electron").shell.openExternal("https://github.com/ArtyshkoAndrey/webgl-phiziks/wiki")') Product documentation
          p
            a(href="#" @click='require("electron").shell.openExternal("https://github.com/ArtyshkoAndrey/webgl-phiziks/blob/master/readme.md")') About
      .col-md-4.col-sm-6.col-12
        .wrapper.mt-5
          h2 Customize
          p
            a(href="#") Video graphics
          p
            a(href="#") Color theme
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
</template>

<script>
  export default {
    name: 'index',
    methods: {
      openFile: function () {
        let self = this
        let chooser = document.querySelector('#openfile')
        chooser.click()
        chooser.addEventListener('change', function (evt) {
          // console.log(fs.readFileSync(this.value, 'utf-8'))
          // self.openProtocol(JSON.parse(fs.readFileSync(this.value, 'utf8').toString()))
          self.$parent.path = document.querySelector('#openfile').files[0].path
          self.$router.push('graphics')
        })
      }
    }
  }
  // container
  //   .row
  //     .col-xs-6
  //       h1 Hellow
  //       button.btn.btn-primary.w-100(@click='openFile()') Открыть файл
  //       input#openfile(type='file' accept='.txt' style='display: none')
</script>

<style>
  html, body {
    padding: 0;
    margin: 0;
  }
  body {
    overflow-y: scroll;
    overflow-x: hidden;
    background-color: #1E1E1E!important
  }
  p, h1, h2, h3, h4, h5 {
    color: #929292;
  }
  p {
    padding: 0;
    margin: 0!important;
    margin-top: .3rem!important;
  }
</style>