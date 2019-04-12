<template>
  <!-- Modal -->
  <v-dialog v-model="dialog" max-width="290">
    <v-card>
      <v-card-title class="headline">Choose theme</v-card-title>
      <v-card-text>
        <v-radio-group v-model="theme">
          <v-radio
            label="Dark Theme"
            :value="true"
          ></v-radio>
          <v-radio
            label="Light Theme"
            :value="false"
          ></v-radio>
        </v-radio-group>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" flat="flat" @click="dialog = false">
          Exit
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    name: 'theme',
    data: () => {
      return {
        theme: true,
        dialog: false
      }
    },
    methods: {
      open () {
        this.dialog = true
      }
    },
    mounted () {
      this.theme = this.$store.getters.dark
      console.log(this.theme)
    },
    watch: {
      theme: function (n, old) {
        this.$store.dispatch('setTheme', this.theme)
        console.log(this.$store.getters.dark)
      }
    }
  }
</script>
