<template>
  <v-container fluid style="padding: 0; position: initial;">
    <v-layout row wrap style="width: 150px;">
      <v-flex md12 xs12 class="px-2">
        <div id="InfoForAtom">
        </div>
      </v-flex>
      <v-flex xs12 class="px-2">
        <v-btn color="primary" @click="tick" block v-if="dragAndTick">Drag</v-btn>
        <v-btn color="primary" block @click="drag" v-else>Tick</v-btn>
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
        <v-btn color="success" v-if="newAtom !== null" @click="addAtom" block>Добавить</v-btn>
      </v-flex>
      <v-flex class="px-2 py-3" v-if="checkTickAtom">
        <!-- Кнопка удаления -->
        <h4>Delete selected Atom</h4>
        <v-btn color="error" @click="deleteAtom" block >Удалить</v-btn>
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
