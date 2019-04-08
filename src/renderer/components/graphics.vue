<template>
  <div>
    <div id="infoMouse" class="text-white p-2" style='z-index:3 ;position:absolute; display:none; top:0; left:0; background-color: rgba(0, 0, 0, 0.5)'></div>
    <canvas id="gl" style='z-index: 1'></canvas>
    <div class="border-right left-side-info shadow rounded">
      <div class="row p-0 m-0 mt-2">
        <div class="col-12">
          <button class="btn btn-warning w-100" @click="goToHome()">Выход</button>
        </div>
      </div>
      <div class="row p-0 m-0 mt-2">
        <div class="col-12">
          <p id="InfoForAtom" class></p>
        </div>
      </div>
      <transition name='fade'>
        <div v-if='checkTickAtom.check'>
          <form v-on:submit.prevent="changePosition" class="mt-3">
            <div class="form-group row m-0 p-0 mt-2">
              <div class="col-12 d-flex">
                <span class="d-inline-flex align-items-center align-middle">X=</span>
                <input type="text" class="d-inline-flex form-control" :value='checkTickAtom.x' name='x'>
              </div>
            </div>
            <div class="form-group row m-0 p-0 mt-2">
              <div class="col-12 d-flex">
                <span class="d-inline-flex align-items-center align-middle">Y=</span>
                <input type="text" class="d-inline-flex form-control" :value='checkTickAtom.y' name='y'>
              </div>
            </div>
            <div class="form-group row m-0 p-0 mt-2">
              <div class="col-12 d-flex">
                <span class="d-inline-flex align-items-center align-middle">Z=</span>
                <input type="text" class="d-inline-flex form-control" :value='checkTickAtom.z' name='z'>
              </div>
            </div>
            <div class="form-group row m-0 p-0 mt-2">
              <div class="col-12">
                <input type="submit" class="btn btn-primary w-100" value="Применить">
              </div>
            </div>
          </form>
          <button class="btn btn-danger mt-2 col-10 offset-1" @click="deleteAtom">Удалить</button>
        </div>
      </transition>
    </div>
  </div>
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
        molecule: null
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
        let glCanvas = this.checkCanvas
        let bgColor = this.$store.getters.lightTheme
        this.gl = new Graphics(bgColor)
        this.gl.init(this.checkCanvas)
        this.molecule = new Molecule(this.gl.scene)
        this.molecule.finderAtoms(this.$parent.path)
        this.molecule.creatModel()
        this.gl.initMolecule(this.molecule, this.molecule.ObjectMolecule)
        this.gl.render()
        glCanvas.addEventListener('mousedown', this.gl.raycast.bind(this.gl.retThis()))
        window.addEventListener('resize', this.gl.resizeWindow.bind(this.gl.retThis()), false)
        glCanvas.addEventListener('mousemove', this.gl.getInfo.bind(this.gl.retThis()))
        let dragControls = new DragControls(this.molecule.ObjectMolecule.children, this.gl.camera, this.gl.renderer.domElement)
        dragControls.addEventListener('dragstart', () => {
          this.gl.control.enabled = false
        })
        dragControls.addEventListener('dragend', () => {
          this.gl.control.enabled = true
        })
        this.gl.renderer.domElement.addEventListener('mousemove', () => {
          this.gl.renderer.render(this.gl.scene, this.gl.camera)
        })
      }
    },
    computed: {
      checkCanvas () {
        return document.getElementById('gl')
      },
      checkTickAtom () {
        let pos = {}
        if (this.molecule instanceof Molecule) {
          if (this.molecule.ticks.length === 1) {
            for (let i = 0; i < this.molecule.atoms.length; i++) {
              if (Number(this.molecule.atoms[i].number) === Number(this.molecule.ticks[0])) {
                pos.x = this.molecule.atoms[i].x
                pos.y = this.molecule.atoms[i].y
                pos.z = this.molecule.atoms[i].z
                pos.check = true
              }
            }
          } else {
            pos.check = false
          }
        } else {
          pos.check = false
        }
        return pos
      }
    },
    methods: {
      // Исправил баг, перерисовка соединения по новому положению
      changePosition (evt) {
        let x = Number(evt.target.elements.x.value)
        let y = Number(evt.target.elements.y.value)
        let z = Number(evt.target.elements.z.value)
        this.molecule.changePosition(Number(this.molecule.ticks[0]), new Vector3(x, y, z))
        this.molecule.ticks = []
        this.gl.renderer.render(this.gl.scene, this.gl.camera)
      },
      goToHome () {
        this.gl.destuctor()
        this.molecule.destuctor()
        this.gl = null
        this.molecule = null
        delete this.gl
        delete this.molecule
        this.$router.push('index')
      },
      deleteAtom () {
        this.molecule.deleteAtom(Number(this.molecule.ticks[0]))
        this.molecule.ticks = []
        this.gl.renderer.render(this.gl.scene, this.gl.camera)
      }
    }
  }
</script>

<style scoped>

</style>
