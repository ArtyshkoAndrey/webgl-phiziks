<template>
  <!-- Modal -->
  <v-dialog v-model="dialog" max-width="500" fullscreen hide-overlay transition="dialog-bottom-transition">
    <v-toolbar dark color="dark">
      <v-btn icon dark @click="dialog = false">
        <v-icon>close</v-icon>
      </v-btn>
      <v-toolbar-title>Graphics settings</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-card>
<!--      <v-card-title class="headline">Graphics settings</v-card-title>-->
      <v-card-text>
        <v-container fluid class="pa-0">
          <v-layout row wrap>
            <v-flex xs12 class="py-2">
              <p>Anti-Aliasing</p>
              <v-btn-toggle class="d-flex" v-model="antiAliasing">
                <v-btn block flat value='1'>
                  Yes
                </v-btn>
                <v-btn block flat value='0'>
                  No
                </v-btn>
              </v-btn-toggle>
            </v-flex>
            <v-flex xs12 class="py-2">
              <p>Graphic quality</p>
              <v-btn-toggle class="d-flex" v-model="quality">
                <v-btn block flat value='4'>
                  Ultra
                </v-btn>
                <v-btn block flat value='3'>
                  Hight
                </v-btn>
                <v-btn block flat value='2'>
                  Normal
                </v-btn>
                <v-btn block flat value='1'>
                  Low
                </v-btn>
                <v-btn block flat value='0'>
                  Very Low
                </v-btn>
              </v-btn-toggle>
            </v-flex>
            <v-flex xs12 class="py-2">
              <p>Post processing</p>
              <v-btn-toggle class="d-flex" v-model="postProcessing">
                <v-btn block flat value='1'>
                  Yes
                </v-btn>
                <v-btn block flat value='0'>
                  No
                </v-btn>
              </v-btn-toggle>
            </v-flex>
          </v-layout>
        </v-container>
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
    props: ['graphics'],
    data: () => {
      return {
        dialog: false,
        antiAliasing: '1',
        quality: '3',
        postProcessing: '0'
      }
    },
    mounted () {
      this.antiAliasing = Number(this.graphics.antiAliasing) + ''
      this.quality = this.graphics.quality + ''
      this.postProcessing = Number(this.graphics.postProcessing) + ''
    },
    methods: {
      open () {
        this.dialog = true
      }
    },
    watch: {
      antiAliasing: function (n, old) {
        // this.$store.dispatch('setTheme', this.localDark)
        console.log('В graphics.vue antiAliasing: ', !!Number(n))
      }
    }
  }
</script>
