<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'gl',
    data: () => {
      return {
        path: '',
        lightTheme: null
      }
    },
    created () {
      // this.store.commit('lightTheme', true)
      // this.$store.dispatch('setTheme', true)
      console.log(this.$store.getters.lightTheme)
      this.lightTheme = this.$store.getters.lightTheme
      if (this.lightTheme) {
        document.getElementsByTagName('body')[0].className += 'light'
      } else {
        document.getElementsByTagName('body')[0].className -= 'light'
      }
    },
    watch: {
      lightTheme: function (n, old) {
        this.$store.dispatch('setTheme', this.lightTheme)
        console.log(this.$store.getters.lightTheme)
        if (this.lightTheme) {
          if (!document.getElementsByTagName('body')[0].classList.contains('light')) {
            document.getElementsByTagName('body')[0].classList.add('light')
          }
        } else {
          if (document.getElementsByTagName('body')[0].classList.contains('light')) {
            document.getElementsByTagName('body')[0].classList.remove('light')
          }
        }
      }
    }
  }
</script>

<style lang='scss'>
  @import 'assets/style/standart.scss';
  @import 'assets/style/light.scss';
</style>
