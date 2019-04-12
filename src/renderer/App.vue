<template>
  <v-app id="app" :dark="theme">
    <v-navigation-drawer v-model="drawer" :temporary="true"
                         absolute
                         overflow
                         app>
      <v-list dense>
        <v-divider></v-divider>
        <v-list-tile @click="$router.push('/')">
          <v-list-tile-action>
            <v-icon>home</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Home</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar app absolute>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title>Atoms</v-toolbar-title>
    </v-toolbar>
    <v-content style="position: initial;">
      <transition name="slide-x-transition" :duration="500" mode="out-in">
        <router-view></router-view>
      </transition>
    </v-content>
  </v-app>
</template>

<script>
  import { addWikiAtoms } from './../../static/libs/functions.js'
  export default {
    name: 'gl',
    data: () => {
      return {
        path: '',
        dark: true,
        drawer: null,
        colorAtoms: null
      }
    },
    mounted () {
      this.dark = this.$store.getters.dark
      this.colorAtoms = addWikiAtoms()
    },
    computed: {
      theme () {
        return this.$store.getters.dark
      }
    }
  }
</script>
