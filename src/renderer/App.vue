<template>
  <div id="app">
    <div class='loader container-fuild' v-if="status">
      <div class="d-flex row justify-content-center text-light" style="margin-top: 20%">
        <div class="col-auto">
          <div class="spinner-border" role="status">
            <span class="sr-only">Loading...</span>
          </div>
        </div>
        <div class="col-12 pt-5 text-center">
          <span class="pt-5">Loading...</span>
        </div>
      </div>
    </div>
    <transition name="fade">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
  export default {
    name: 'gl',
    data: () => {
      return {
        path: '',
        lightTheme: null,
        status: false
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

</style>
