<template lang="pug">
  div
    div#infoMouse.text-white.p-2(style='z-index:3 ;position:absolute; display:none; top:0; left:0; background-color: rgba(0, 0, 0, 0.5)')
    canvas#gl(style='margin-left: 100px; z-index: 1')
    div(style='width: 100px; height: 100%; position: absolute; z-index: 2; background: white; top: 0; left: 0')
      p#InfoForAtom
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
    }
  }
</script>

<style>
  html, body {
    overflow: hidden;
  }
</style>
