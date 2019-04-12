<template>
  <v-container fluid style="padding: 0; position: initial;">
    <v-layout row wrap style="width: 150px;">
      <v-flex md12 xs12 class="px-2">
        <div id="InfoForAtom">
        </div>
        <!-- Добавления  атома -->
        <v-select
          v-model='newAtom'
          :items="Object.entries($parent.$parent.$parent.colorAtoms.atoms)"
          item-text="[1].name"
          item-value="[1].symbol"
          single-line
          return-object
          persistent-hint
          label="Standard"
        ></v-select>
        <v-btn color="success" @click="addAtom" block>Добавить</v-btn>
        <!-- Кнопка удаления -->
        <v-btn color="error" @click="deleteAtom" block v-if="checkTickAtom">Удалить</v-btn>
      </v-flex>
    </v-layout>
    <div id="infoMouse" class="text-white p-2" style='z-index:3 ;position:absolute; display:none; top:0; left:0; background-color: rgba(0, 0, 0, 0.5)'></div>
    <canvas id="gl" style='z-index: 1'></canvas>
  </v-container>
</template>

<script>
  import Graphics from '../../../static/libs/Graphics/common.js'
  import Molecule from '../../../static/libs/Molecule/common.js'
  import fs from 'fs'
  import { Vector3 } from 'three'
  import DragControls from 'three-dragcontrols'
  export default {
    name: 'index',
    data: () => {
      return {
        gl: null,
        molecule: null,
        dragControls: null,
        events: [],
        newAtom: null
      }
    },
    mounted () {
      if (!fs.existsSync(this.$parent.path)) {
        this.$parent.path = ''
        this.gl = null
        this.molecule = null
        this.$router.push('index')
      }
      if (this.checkCanvas) {
        let bgColor = this.$store.getters.dark
        this.gl = new Graphics(bgColor)
        this.gl.init(this.checkCanvas)
        this.molecule = new Molecule(this.gl.scene, this.$parent.$parent.$parent.colorAtoms)
        this.molecule.finderAtoms(this.$parent.path)
        this.molecule.creatModel()
        this.gl.initMolecule(this.molecule, this.molecule.ObjectMolecule)
        this.gl.render()
        this.events[0] = this.gl.raycast.bind(this.gl.retThis())
        this.events[1] = this.gl.resizeWindow.bind(this.gl.retThis())
        this.events[2] = this.gl.getInfo.bind(this.gl.retThis())
        this.checkCanvas.addEventListener('mousedown', this.events[0], false)
        window.addEventListener('resize', this.events[1], false)
        this.checkCanvas.addEventListener('mousemove', this.events[2], false)
        this.dragControls = new DragControls(this.molecule.ObjectMolecule.children, this.gl.camera, this.gl.renderer.domElement)
        this.dragControls.addEventListener('dragstart', () => {
          this.gl.control.enabled = false
        }, false)
        this.dragControls.addEventListener('dragend', () => {
          this.gl.control.enabled = true
        }, false)
        this.gl.renderer.domElement.addEventListener('mousemove', () => {
          this.gl.renderer.render(this.gl.scene, this.gl.camera)
        }, false)
      }
    },
    beforeRouteLeave (to, from, next) {
      console.log(window)
      if (this.gl !== null && this.gl !== undefined) {
        this.checkCanvas.removeEventListener('mousedown', this.events[0], false)
        window.removeEventListener('resize', this.events[1], false)
        this.checkCanvas.removeEventListener('mousemove', this.events[2], false)
        this.dragControls.removeEventListener('dragstart', () => {
          this.gl.control.enabled = false
        }, false)
        this.dragControls.removeEventListener('dragend', () => {
          this.gl.control.enabled = true
        }, false)
        this.gl.renderer.domElement.removeEventListener('mousemove', () => {
          this.gl.renderer.render(this.gl.scene, this.gl.camera)
        }, false)
        this.goToHome()
      }
      next()
    },
    computed: {
      checkCanvas () {
        return document.getElementById('gl')
      },
      checkTickAtom () {
        if (this.molecule instanceof Molecule) {
          if (this.molecule.ticks.length === 1) {
            console.log(this.molecule)
            return true
          } else {
            return false
          }
        } else {
          return false
        }
      }
    },
    methods: {
      addAtom () {
        console.log(this.newAtom)
        this.molecule.addAtom(this.newAtom[0])
      },
      // Исправил баг, перерисовка соединения по новому положению
      changePosition (evt) {
        let x = Number(evt.target.elements.x.value)
        let y = Number(evt.target.elements.y.value)
        let z = Number(evt.target.elements.z.value)
        this.molecule.changePosition(Number(this.molecule.ticks[0]), new Vector3(x, y, z))
        this.molecule.ticks = []
        this.gl.renderer.render(this.gl.scene, this.gl.camera)
      },
      goToHome  () {
        this.gl.destructor()
        this.molecule.destructor()
        this.gl = null
        this.molecule = null
        delete this.gl
        delete this.molecule
        this.$router.push('index')
      },
      deleteAtom () {
        console.log('Deleted')
        this.molecule.deleteAtom(Number(this.molecule.ticks[0]))
        this.molecule.ticks = []
        this.gl.renderer.render(this.gl.scene, this.gl.camera)
      }
    }
  }
</script>

<style scoped>

</style>
