<template>
  <v-container fluid style="padding: 0; position: initial;">
    <canvas id="gl" style='z-index: 1'></canvas>
  </v-container>
</template>

<script>
  import Graphics from '../../../static/libs/Graphics/common.js'
  import fs from 'fs'
  export default {
    name: 'index',
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
      if (!fs.existsSync(this.$parent.path)) {
        this.$parent.path = ''
        this.gl = null
        this.molecule = null
        this.$router.push('index')
      }
      if (this.checkCanvas) {
        let bgColor = this.$store.getters.dark
        console.log(bgColor)
        this.gl = new Graphics(this.checkCanvas, this.$parent.$parent.$parent.colorAtoms)
        this.gl.init()
        this.gl.fileGetContents(this.$parent.path)
        window.addEventListener('resize', () => {
          this.gl.engine.resize()
        })
      }
    },
    computed: {
      checkCanvas () {
        return document.getElementById('gl')
      }
    },
    methods: {
      goToHome  () {
        this.gl.destructor()
        this.molecule.destructor()
        this.gl = null
        this.molecule = null
        delete this.gl
        delete this.molecule
        this.$router.push('index')
      }
    }
  }
</script>

<style scoped>

</style>
