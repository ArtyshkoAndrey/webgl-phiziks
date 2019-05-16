<template>
  <v-container fluid style="padding: 0; position: initial;">
    <v-layout row wrap style="width: 150px; z-index: 10">
      <v-flex md12 xs12 class="px-2">
        <div id="InfoForAtom">
        </div>
      </v-flex>
      <v-flex xs12 class="px-2">
        <v-btn color="primary" block @click="changeMode" v-if="pointer === 'drag'">Drag</v-btn>
        <v-btn color="primary" block @click="changeMode" v-else>Tick</v-btn>
      </v-flex>
      <!-- Создание атома -->
      <v-flex xs12 class="px-2 py-3">
        <h4>Add new Atom</h4>
        <v-select class="py-0"
                  v-model='newAtom'
                  :items="Object.entries($parent.$parent.$parent.colorAtoms.atoms)"
                  item-text="[1].name"
                  item-value="[1].symbol"
                  single-line
                  return-object
                  persistent-hint
                  label="Atom name"
        ></v-select>
        <v-btn color="success" block @click="createAtom">Добавить</v-btn>
      </v-flex>
      <v-flex class="px-2 py-3" v-if="ticks > 0">
        <!-- Кнопка удаления -->
        <h4>Delete selected Atom</h4>
        <v-btn color="error" block @click="deleteAtom">Удалить</v-btn>
      </v-flex>
    </v-layout>
    <canvas id="gl" style='z-index: 1'></canvas>
  </v-container>
</template>

<script>
  import Graphics from '../../../static/libs/Graphics/common.js'
  import Molecule from '../../../static/libs/Molecule/common.js'
  import fs from 'fs'
  export default {
    name: 'index',
    props: ['colorAtoms'],
    data: () => {
      return {
        gl: null,
        molecule: null,
        dragControls: null,
        events: [],
        newAtom: null,
        dragAndTick: false
      }
    },
    mounted () {
      if (this.$parent.path === '' || !fs.existsSync(this.$parent.path)) {
        this.$parent.path = ''
        this.gl = null
        this.molecule = null
        this.$router.push('index')
      } else if (this.checkCanvas) {
        this.gl = new Graphics(this.checkCanvas, this.colorAtoms)
        this.gl.init()
        this.molecule = new Molecule(this.gl.scene, this.colorAtoms)
        this.molecule.fileGetContents(this.$parent.path)
        this.gl.newMolecule = this.molecule.molecule
        this.gl.startRender()
        window.addEventListener('resize', () => {
          this.gl.engine.resize()
        })
      }
    },
    methods: {
      changeMode () {
        this.gl.changeMode()
        this.molecule.changeMode()
      },
      deleteAtom () {
        this.molecule.deleteAtom()
      },
      createAtom () {
        this.molecule.createAtom(this.newAtom[0])
      }
    },
    computed: {
      checkCanvas () {
        return document.getElementById('gl')
      },
      pointer () {
        try {
          return this.gl.pointer
        } catch (err) {
          console.log(err)
          return 'tick'
        }
      },
      ticks () {
        try {
          return this.molecule.ticks.length
        } catch (err) {
          console.log(err)
          return 0
        }
      }
    },
    beforeRouteLeave (to, from, next) {
      try {
        window.removeEventListener('resize', () => {
          this.gl.engine.resize()
        })
        this.gl.engine.dispose()
        this.gl.scene.dispose()
        this.gl.molecule._children.forEach(atom => {
          atom.material.dispose()
          atom.dispose()
        })
      } catch (err) {
        next()
      }
      next()
    }
  }
</script>

<style scoped>

</style>
