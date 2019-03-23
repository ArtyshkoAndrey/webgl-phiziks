<template>
  <!-- Modal -->
  <div class="modal fade" id="theme" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <div class="custom-control custom-radio">
            <input type="radio" id="customRadio1" v-model='theme' value='false' name="customRadio" class="custom-control-input">
            <label class="custom-control-label" for="customRadio1">Dark Theme</label>
          </div>
          <div class="custom-control custom-radio">
            <input type="radio" id="customRadio2" v-model='theme' value='true' name="customRadio" class="custom-control-input">
            <label class="custom-control-label" for="customRadio2">Light Theme</label>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'theme',
    data: () => {
      return {
        theme: null
      }
    },
    created () {
      this.theme = this.$parent.$parent.lightTheme
    },
    watch: {
      theme: function (n, old) {
        if (this.theme === 'false') {
          this.$parent.$parent.lightTheme = false
        } else if (this.theme === 'true') {
          this.$parent.$parent.lightTheme = true
        }
      }
    }
  }
</script>