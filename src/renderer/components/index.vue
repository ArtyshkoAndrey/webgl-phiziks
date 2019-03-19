<template lang="pug">
  .container
    .row
      .col-xs-6
        h1 Hellow
        button.btn.btn-primary.w-100(@click='openFile()') Открыть файл
        input#openfile(type='file' accept='.txt' style='display: none')
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
</script>