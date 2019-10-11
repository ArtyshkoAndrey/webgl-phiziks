<template>
  <v-container fluid>
    <v-layout align-center justify-center row wrap fill-height>
      <v-flex md3 xs12>
        <h2>Start</h2>
        <input id="openfile" type='file' style='display: none'/>
        <a href="#" @click="openFile(false)">New Project</a>
        <br>
        <a href="#" @click="openFile(true)">Open File</a>
      </v-flex>
      <v-flex md3 xs12>
        <h2>Help</h2>
        <a href='#' class="my-2" @click='require("electron").shell.openExternal("https://github.com/ArtyshkoAndrey/webgl-phiziks")'>GitHub repository</a>
        <br>
        <a href='#' class="my-2" @click='require("electron").shell.openExternal("https://github.com/ArtyshkoAndrey/webgl-phiziks/wiki")'>Product documentation</a>
        <br>
        <a href='#' class="my-2" @click='require("electron").shell.openExternal("https://github.com/ArtyshkoAndrey/webgl-phiziks/blob/master/readme.md")'>About</a>
      </v-flex>
      <v-flex md3 xs12>
        <h2>Settings</h2>
        <a href='#' @click="openThemeModal" class="my-2">Select Theme</a>
        <br>
        <a href='#' @click="openGraphicsModal" class="my-2">Graphics settings</a>
      </v-flex>
      <themeModal ref='theme' :dark='dark'></themeModal>
      <GraphicsModal ref='graphics' :graphics='graphics'></GraphicsModal>
    </v-layout>
    <transition name="slide-x-transition" :duration="500" mode="out-in">
      <v-stepper class="col-md-12 mt-5" v-if="e6 < 5" v-model="e6" vertical>
        <v-stepper-step :complete="e6 > 1" step="1">
          Добро пожаловать
        </v-stepper-step>

        <v-stepper-content step="1">
          <v-card class="mb-2">
            <v-card-text>
              <p class="body-1">В данном меню краткий инструктаж</p>
            </v-card-text>
          </v-card>

          <v-btn color="primary" @click="e6 = 2">Далее</v-btn>
        </v-stepper-content>

        <v-stepper-step :complete="e6 > 2" step="2">
          Нажите на "New Project"
        </v-stepper-step>

        <v-stepper-content step="2">
          <v-card class="mb-2">
            <v-card-text>
              <p class="body-1">Откроется окно с 3D сценой</p>
            </v-card-text>
          </v-card>
          <v-btn color="primary" @click="e6 = 3">Continue</v-btn>
        </v-stepper-content>

        <v-stepper-step :complete="e6 > 3" step="3">
          Создать первый атом
        </v-stepper-step>

        <v-stepper-content step="3">
          <v-card class="mb-2">
            <v-card-text>
              <p class="body-1">С левого бока имеется меню. Нажимая на поле 'Atom name' будет доступен выбо атомы.
                После выбора атома необходимо кликнуть на него.
                Программа автоматически преложит создать файл сохранения в формате MOPAC.
                После создание файла, программа будет автоматически сохранять каждое изменение молекулы
              </p>
            </v-card-text>
          </v-card>
          <v-btn color="primary" @click="e6 = 4">Continue</v-btn>
        </v-stepper-content>

        <v-stepper-step :complete="e6 > 4" step="4">Завершение проекта</v-stepper-step>
        <v-stepper-content step="4">
          <v-card class="mb-2">
            <v-card-text>
              <p class="body-1">Для выхода из редактора молекулы, необходимо нажать на <v-icon>menu</v-icon> и выбрать 'Home'</p>
            </v-card-text>
          </v-card>
          <v-btn color="primary" @click="e6 = 5">Close</v-btn>
        </v-stepper-content>
      </v-stepper>
    </transition>
  </v-container>
</template>

<script>
  import theme from './settings/theme.vue'
  import graphics from './settings/graphics.vue'
  export default {
    name: 'index',
    props: ['dark', 'graphics'],
    components: {
      'themeModal': theme,
      'GraphicsModal': graphics
    },
    data: () => {
      return {
        e6: 1
      }
    },
    mounted () {
      this.e6 = JSON.parse(JSON.stringify(this.$store.getters.helloWord))
      console.log('Index.vue dark:', this.dark)
    },
    watch: {
      e6: function (val) {
        if (val === 5) {
          this.$store.dispatch('setHelloWord', 5)
        }
      }
    },
    methods: {
      openFile (pr) {
        if (pr === false) {
          this.$parent.path = false
          this.$router.push('graphics')
        } else {
          let chooser = document.querySelector('#openfile')
          chooser.click()
          // this.$parent.status = true
          chooser.addEventListener('change', (evt) => {
            this.$parent.path = document.querySelector('#openfile').files[0].path
            this.$router.push('graphics')
          })
        }
      },
      openThemeModal () {
        this.$refs.theme.open()
      },
      openGraphicsModal () {
        this.$refs.graphics.open()
      }
    }
  }
</script>

<style>

</style>
