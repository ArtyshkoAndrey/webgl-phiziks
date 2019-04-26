'use strict'
import * as BABYLON from 'babylonjs'

export class Molvwr {
  constructor () {
    this.Viewer = new Viewer()
    this.Config = new Config()
  }
  process (...args) {
    if (!BABYLON) {
      console.error('Babylon.js is not available, please add a reference to Babylon.js script');
      return
    }
    let elements
    if (args[0]) {
      if (args[0].length) {
        elements = args[0]
      } else {
        elements = [args[0]]
      }
    } else {
      elements = document.querySelectorAll('*[data-molvwr]')
    }
    for (let i = 0, l = elements.length; i < l; i++) {
      let e = elements[i]
      if (e && e.style) {
        if (e.molvwr) {
          e.molvwr.dispose()
        }
        let moleculeUrl = e.getAttribute('data-molvwr')
        let format = e.getAttribute('data-molvwr-format')
        let view = e.getAttribute('data-molvwr-view')
        if (!format) {
          format = Viewer.getMoleculeFileFormat(moleculeUrl);
        }
        if (!moleculeUrl) {
          console.error('please specify a molecule url by adding a data-molvwr attribute')
          return
        }
        if (!format) {
          console.error('molecule file format not found or not specified for ' + moleculeUrl)
          return
        }
        let options = null
        if (view === 'spheres') {
          options = this.Config.spheres()
        } else if (view === 'ballsandsticks') {
          options = this.Config.ballsAndSticks()
        } else if (view === 'sticks') {
          options = this.Config.sticks()
        }
        if (moleculeUrl && format) {
          this.viewer = new Viewer(e, options)
          this.viewer.loadContentFromUrl(moleculeUrl, format)
        }
      }
    }
  }
}

export class BabylonContext {
  constructor (canvas) {
    this.canvas = canvas
    this.scene = null
    this.viewmode = null
    this.engine = new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true })
    this.engine.runRenderLoop(() => {
      if (this.scene) {
        this.scene.render()
      }
    })
    this.bindedResize = this.resize.bind(this)
    window.addEventListener('resize', this.bindedResize)
  }
  resize () {
    this.engine.resize()
  }
  exportScreenshot () {
    return this.canvas.toDataURL('image/png')
  }
  dispose () {
    this.engine.dispose()
    window.removeEventListener('resize', this.bindedResize)
  }
  sphereMaterial (mesh, atomMat, useEffects) {
    if (this.viewmode) {
      this.viewmode.sphereMaterial(this, mesh, atomMat, useEffects)
    }
  }
  cylinderMaterial (mesh, atomMat, useEffects) {
    if (this.viewmode) {
      this.viewmode.cylinderMaterial(this, mesh, atomMat, useEffects)
    }
  }
  createScene = function () {
    if (this.scene) {
      this.scene.dispose()
    }
    console.log('create babylon scene')
    let scene = new BABYLON.Scene(this.engine)
    this.scene = scene
    if (this.viewmode) {
      this.viewmode.createScene(this)
    }
  }
}

export class Config {
  defaultConfig () {
    return {
      allowLOD: false,
      renderers: ['Sphere'],
      atomScaleFactor: 3,
      cylinderScale: 0.6,
      sphereSegments: 16
    }
  }
  spheres () {
    return {
      allowLOD: true,
      renderers: ['Sphere'],
      atomScaleFactor: 3,
      cylinderScale: 0.6,
      sphereSegments: 16,
      sphereLOD: [{ depth: 0, segments: 32, effects: true }, { depth: 5, segments: 24, effects: true }, { depth: 10, segments: 16, effects: true }, { depth: 20, segments: 12, effects: true }, { depth: 40, segments: 6, effects: true }, { depth: 60, segments: 6 }, { depth: 80, segments: 4 }]
    }
  }
  sticks () {
    return {
      allowLOD: true,
      renderers: ['Sticks'],
      atomScaleFactor: 1.3,
      cylinderScale: 1.4,
      sphereSegments: 16,
      cylinderSegments: 16,
      cylinderLOD: [{ depth: 0, segments: 64, effects: true }, { depth: 10, segments: 32, effects: true }, { depth: 20, segments: 24, effects: true }, { depth: 40, segments: 16, effects: true }, { depth: 60, segments: 12 }, { depth: 80, segments: 8 }],
    }
  }
  ballsAndSticks () {
    return {
      allowLOD: true,
      renderers: ['BondsCylinder', 'Sphere'],
      atomScaleFactor: 1.3,
      cylinderScale: 0.6,
      sphereSegments: 16,
      cylinderSegments: 8,
      cylinderLOD: [{ depth: 0, segments: 64, effects: true }, { depth: 5, segments: 32, effects: true }, { depth: 20, segments: 24, effects: true }, { depth: 60, segments: 12 }],
      sphereLOD: [{ depth: 0, segments: 64, effects: true }, { depth: 5, segments: 32, effects: true }, { depth: 10, segments: 24, effects: true }, { depth: 20, segments: 16, effects: true }, { depth: 40, segments: 12, effects: true }, { depth: 60, segments: 6 }, { depth: 80, segments: 4 }]
    }
  }
}
