<template>
  <v-app id="app" :dark="dark">
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
    <v-content>
      <transition name="slide-x-transition" :duration="500" appear mode="out-in">
        <router-view></router-view>
      </transition>
    </v-content>
  </v-app>
</template>

<script>
  export default {
    name: 'gl',
    data: () => {
      return {
        path: '',
        dark: true,
        drawer: null
      }
    },
    created () {
      console.log(this.$store.getters.dark)
      this.dark = this.$store.getters.dark
    },
    watch: {
      dark: function (n, old) {
        this.$store.dispatch('setTheme', this.dark)
        console.log(this.$store.getters.dark)
      }
    }
  }
</script>
