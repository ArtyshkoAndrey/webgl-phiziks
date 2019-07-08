<template>
  <v-app id="app" :dark="theme">
    <v-navigation-drawer v-model="drawer" :temporary="true"
                         absolute
                         overflow
                         floating
                         app>
      <v-layout column fill-height>
        <v-toolbar flat class="transparent">
          <v-list>
            <v-list-tile>
              <v-list-tile-title class="title">
                Menu
              </v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-toolbar>
        <v-divider></v-divider>
        <v-list dense>
          <v-list-tile @click="$router.push('/')">
            <v-list-tile-action>
              <v-icon>home</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Home</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile @click="$router.push('/')">
            <v-list-tile-action>
              <v-icon class="blue--text">settings</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Settings</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile @click="require('electron').remote.getCurrentWindow().close()">
            <v-list-tile-action>
              <v-icon class="red--text">exit_to_app</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Close App</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
        <v-spacer></v-spacer>
        <v-list class="py-0">
          <v-list-tile>
            <v-list-tile-content>
              <v-list-tile-title class="caption">Version of the program {{ ver }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-layout>
    </v-navigation-drawer>
    <v-toolbar app absolute>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title>Atoms</v-toolbar-title>
    </v-toolbar>
    <v-content style="position: initial;">
      <transition name="slide-x-transition" :duration="500" mode="out-in">
        <router-view :dark='dark' :colorAtoms='colorAtoms' :graphics='graphics'></router-view>
      </transition>
    </v-content>
  </v-app>
</template>

<script>
  import { addWikiAtoms } from './../../static/libs/functions.js'
  import { version } from './../../package.json'
  // import exec from 'executive'
  export default {
    name: 'gl',
    data: () => {
      return {
        path: '',
        dark: true,
        drawer: null,
        colorAtoms: null,
        ver: version
      }
    },
    mounted () {
      this.dark = this.$store.getters.dark
      this.colorAtoms = addWikiAtoms()
      console.log(this.colorAtoms)
    },
    computed: {
      theme () {
        return this.$store.getters.dark
      },
      graphics () {
        return this.$store.getters.graphics
      }
    }
  }
</script>
