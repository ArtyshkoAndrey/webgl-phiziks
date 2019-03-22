<template lang="pug">
  div
    div#infoMouse.text-white.p-2(style='z-index:3 ;position:absolute; display:none; top:0; left:0; background-color: rgba(0, 0, 0, 0.5)')
    canvas#gl(style='margin-left: 100px; z-index: 1')
    div.border-right(style='width: 150px; height: 100%; position: absolute; z-index: 2; background: white; top: 0; left: 0')
      p#InfoForAtom
      transition(name="fade")
        form(v-if='checkTickAtom.check' v-on:submit.prevent="changePosition")
          .form-group.row.m-0.p-0.pt-2
            .col-12.d-flex
              span.d-inline-flex.align-items-center.align-middle X=
              input.d-inline-flex.form-control(:value='checkTickAtom.x' name='x')
          .form-group.row.m-0.p-0.pt-2
            .col-12.d-flex
              span.d-inline-flex.align-items-center.align-middle Y=
              input.d-inline-flex.form-control(:value='checkTickAtom.y' name='y')
          .form-group.row.m-0.p-0.pt-2
            .col-12.d-flex
              span.d-inline-flex.align-items-center.align-middle Z=
              input.d-inline-flex.form-control(:value='checkTickAtom.z' name='z')
          .form-group.row.m-0.p-0.pt-2
            .col-12.d-flex
              input.btn.btn-primary.d-inline-flex(type='submit' value='Применить')
</template>

<script>
  import Graphics from '../../../static/Graphics.js'
  import Molecule from '../../../static/Molecule.js'
  import fs from 'fs'
  export default {
    name: 'index',
    data: () => {
      return {
        gl: null,
        molecule: null
      }
    },
    created () {
      if (!fs.existsSync(this.$parent.path)) {
        this.$parent.path = ''
        this.gl = null
        this.molecule = null
        this.$router.push('index')
      }
      this.gl = null
      this.molecule = null
      this.$nextTick(() => {
        this.gl = new Graphics()
        this.gl.init(document.getElementById('gl'))
        this.molecule = new Molecule(this.gl.scene)
        this.molecule.finderAtoms(this.$parent.path)
        this.molecule.creatModel()
        this.gl.initMolecule(this.molecule)
        this.gl.render()
        let glCanvas = document.getElementById('gl')
        glCanvas.addEventListener('mousedown', this.gl.raycast.bind(this.gl.retThis()))
        window.addEventListener('resize', this.gl.resizeWindow.bind(this.gl.retThis()), false)
        glCanvas.addEventListener('mousemove', this.gl.getInfo.bind(this.gl.retThis()))
      })
    },
    computed: {
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
        let x = evt.target.elements.x.value
        let y = evt.target.elements.y.value
        let z = evt.target.elements.z.value
        for (let i = 0; i < this.molecule.atoms.length; i++) {
          if (Number(this.molecule.atoms[i].number) === Number(this.molecule.ticks[0])) {
            this.molecule.atoms[i].x = Number(x)
            this.molecule.atoms[i].y = Number(y)
            this.molecule.atoms[i].z = Number(z)
            this.molecule.atoms[i].Object3D.position.set(Number(x), Number(y), Number(z))
            this.gl.renderer.render(this.gl.scene, this.gl.camera)
          }
        }
      }
    }
  }
</script>

<style>
  html, body {
    overflow: hidden;
  }
  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active до версии 2.1.8 */ {
    opacity: 0;
  }
</style>
