<template>
  <!-- Modal -->
  <v-dialog v-model="dialog" max-width="290">
    <v-card>
      <v-card-title class="headline" primary-title >Choose theme</v-card-title>
      <v-card-text>
        <v-radio-group v-model="localDark">
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
    props: {
      dark: Boolean
    },
    data: () => {
      return {
        dialog: false,
        localDark: null
      }
    },
    mounted () {
      this.localDark = this.$store.getters.dark
    },
    methods: {
      open () {
        this.dialog = true
      }
    },
    watch: {
      localDark: function (n, old) {
        this.$store.dispatch('setTheme', this.localDark)
        console.log('В theme.vue dark: ', this.$store.getters.dark)
      }
    }
  }
</script>
