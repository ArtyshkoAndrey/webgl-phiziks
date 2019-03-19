<template lang="pug">
  div
    canvas#gl(style='margin-left: 100px')
    div(style='width: 100px; height: 100%; position: absolute; z-index: 100; background: white')
      .row
        .col-12
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
        document.getElementById('gl').addEventListener('mousedown', this.gl.raycast.bind(this.gl.retThis()))
      })
    }
  }
</script>

<style>
  html, body {
    overflow: hidden;
  }
</style>