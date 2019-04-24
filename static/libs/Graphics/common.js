import * as BABYLON from 'babylonjs'
let Molvwr
(Molvwr => {
  const BabylonContext = (() => {
    class BabylonContext {
      constructor(canvas) {
        const _this = this
        this.canvas = canvas
        this.engine = new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true })
        this.engine.runRenderLoop(() => {
          if (_this.scene)
            _this.scene.render()
        })
        this.bindedResize = this.resize.bind(this)
        window.addEventListener('resize', this.bindedResize)
      }

      resize() {
        this.engine.resize()
      }

      exportScreenshot() {
        return this.canvas.toDataURL('image/png')
      }

      dispose() {
        this.engine.dispose()
        window.removeEventListener('resize', this.bindedResize)
      }

      sphereMaterial(mesh, atomMat, useEffects) {
        if (this.viewmode) {
          this.viewmode.sphereMaterial(this, mesh, atomMat, useEffects)
        }
      }

      cylinderMaterial(mesh, atomMat, useEffects) {
        if (this.viewmode) {
          this.viewmode.cylinderMaterial(this, mesh, atomMat, useEffects)
        }
      }

      createScene() {
        if (this.scene)
          this.scene.dispose()
        console.log('create babylon scene')
        const scene = new BABYLON.Scene(this.engine)
        this.scene = scene
        if (this.viewmode) {
          this.viewmode.createScene(this)
        }
      }
    }

    return BabylonContext
  })()
  Molvwr.BabylonContext = BabylonContext
})(Molvwr || (Molvwr = {}))

(Molvwr => {
  let Config
  (Config => {
    function defaultConfig() {
      return {
        allowLOD: false,
        renderers: ['Sphere'],
        atomScaleFactor: 3,
        cylinderScale: 0.6,
        sphereSegments: 16
      }
    }
    Config.defaultConfig = defaultConfig
    function spheres() {
      return {
        allowLOD: true,
        renderers: ['Sphere'],
        atomScaleFactor: 3,
        cylinderScale: 0.6,
        sphereSegments: 16,
        sphereLOD: [{ depth: 0, segments: 32, effects: true }, { depth: 5, segments: 24, effects: true }, { depth: 10, segments: 16, effects: true }, { depth: 20, segments: 12, effects: true }, { depth: 40, segments: 6, effects: true }, { depth: 60, segments: 6 }, { depth: 80, segments: 4 }]
      }
    }
    Config.spheres = spheres
    function sticks() {
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
    Config.sticks = sticks
    function ballsAndSticks() {
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
    Config.ballsAndSticks = ballsAndSticks
  })(Config = Molvwr.Config || (Molvwr.Config = {}))
})(Molvwr || (Molvwr = {}))

let __global = this

(Molvwr => {
  function process(...args) {
    if (!__global.BABYLON) {
      console.error('Babylon.js is not available, please add a reference to Babylon.js script')
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
      const e = elements[i]
      if (e && e.style) {
        if (e.molvwr) {
          e.molvwr.dispose()
        }
        const moleculeUrl = e.getAttribute('data-molvwr')
        let format = e.getAttribute('data-molvwr-format')
        const view = e.getAttribute('data-molvwr-view')
        if (!format) {
          format = Viewer.getMoleculeFileFormat(moleculeUrl)
        }
        if (!moleculeUrl) {
          console.error('please specify a molecule url by adding a data-molvwr attribute')
          return
        }
        if (!format) {
          console.error(`molecule file format not found or not specified for ${moleculeUrl}`)
          return
        }
        let options = null
        if (view == 'spheres') {
          options = Molvwr.Config.spheres()
        } else if (view == 'ballsandsticks') {
          options = Molvwr.Config.ballsAndSticks()
        } else if (view == 'sticks') {
          options = Molvwr.Config.sticks()
        }
        if (moleculeUrl && format) {
          const viewer = new Viewer(e, options)
          viewer.loadContentFromUrl(moleculeUrl, format)
        }
      }
    }
  }
  Molvwr.process = process
  let Viewer = (() => {
    class Viewer {
      constructor(element, config, viewmode) {
        if (!__global.BABYLON) {
          throw new Error('Babylon.js is not available, please add a reference to Babylon.js script')
        }
        if (!element)
          throw new Error('you must provide an element to host the viewer')
        this.config = config || Molvwr.Config.defaultConfig()
        this.element = element
        this.element.molvwr = this
        this.canvas = document.createElement('CANVAS')
        this.canvas.setAttribute('touch-action', 'manipulation')
        this.canvas.style.width = '100%'
        this.canvas.style.height = '100%'
        this.element.appendChild(this.canvas)
        this.context = new Molvwr.BabylonContext(this.canvas)
        this.viewmode = viewmode
        if (!this.viewmode) {
          this.viewmode = new Molvwr.ViewModes.Standard()
        }
      }

      dispose() {
        this.context.dispose()
        this.context = null
        this.element = null
        this.canvas = null
        this.element.innerHTML = ''
      }

      _loadContentFromString(content, contentFormat, dataReadyCallback) {
        const _this = this
        return new Molvwr.Utils.Promise((complete, error) => {
          const parser = Molvwr.Parser[contentFormat]
          if (parser) {
            console.time(`parsing ${contentFormat}`)
            const molecule = parser.parse(content)
            console.timeEnd(`parsing ${contentFormat}`)
            if (molecule) {
              _this._postProcessMolecule(molecule).then(() => {
                dataReadyCallback(molecule)
                return _this._renderMolecule(molecule)
              }).then(() => molecule).then(complete, error)
            } else {
              console.warn(`no molecule from parser ${contentFormat}`)
              complete()
            }
          } else {
            console.warn(`no parser for ${contentFormat}`)
            complete()
          }
        })
      }

      _renderMolecule(molecule) {
        const _this = this
        this.molecule = molecule
        this._createContext()
        return new Molvwr.Utils.Promise((complete, error) => {
          console.time('rendering...')
          if (_this.config.renderers) {
            const completedCount = 0
            const nbrenderers = _this.config.renderers.length
            const p = []
            _this.config.renderers.forEach(rendererName => {
              const rendererClass = Molvwr.Renderer[rendererName]
              if (rendererClass) {
                const renderer = new rendererClass(_this, _this.context, _this.config)
                p.push(renderer.render(_this.molecule))
              }
            })
            Molvwr.Utils.Promise.all(p).then(() => {
              console.timeEnd('rendering...')
            }).then(complete, error)
          } else {
            complete(molecule)
          }
        })
      }

      setOptions(options, completedcallback) {
        this.config = options
        this.refresh(completedcallback)
      }

      setViewMode(viewmode, completedcallback) {
        this.viewmode = viewmode
        if (!this.viewmode) {
          this.viewmode = new Molvwr.ViewModes.Standard()
        }
        this.refresh(completedcallback)
      }

      refresh(completedcallback) {
        if (this.molecule) {
          this._renderMolecule(this.molecule).then(completedcallback, completedcallback)
        } else {
          if (completedcallback) {
            completedcallback()
          }
        }
      }

      _createContext() {
        if (this.context)
          this.context.dispose()
        this.context = new Molvwr.BabylonContext(this.canvas)
        this.context.viewmode = this.viewmode
        this.context.createScene()
      }

      exportScreenshot() {
        return this.context.exportScreenshot()
      }

      loadContentFromString(content, contentFormat, datareadycallback, completedcallback) {
        this._createContext()
        this._loadContentFromString(content, contentFormat, datareadycallback).then(completedcallback, completedcallback)
      }

      loadContentFromUrl(url, contentFormat, datareadycallback, completedcallback) {
        const _this = this
        if (!contentFormat) {
          contentFormat = Viewer.getMoleculeFileFormat(url)
        }
        if (!contentFormat) {
          console.error('molecule file format not found or not specified')
        }
        this._createContext()
        try {
          const xhr = new XMLHttpRequest()
          xhr.onreadystatechange = () => {
            if (xhr.readyState == 4) {
              if (xhr.status == 200) {
                _this._loadContentFromString(xhr.responseText, contentFormat, datareadycallback).then(completedcallback, completedcallback)
              } else {
                console.warn(`cannot get content from ${url} ${xhr.status} ${xhr.statusText}`)
                completedcallback()
              }
            }
          }
          xhr.open('GET', url, true)
          xhr.send(null)
        }
        catch (e) {
          console.error(e)
          completedcallback()
        }
      }

      _postProcessMolecule(molecule) {
        const _this = this
        console.time('post process')
        molecule.kinds = molecule.kinds || {}
        molecule.bondkinds = molecule.bondkinds || {}
        molecule.batchSize = Math.min(120, (molecule.atoms.length / 4) >> 0)
        molecule.batchSize = Math.max(40, molecule.batchSize)
        return this._center(molecule).then(() => _this._calculateAtomsBondsAsync(molecule)).then(() => {
          console.timeEnd('post process')
        })
      }

      _calculateAtomsBondsAsync(molecule) {
        console.time('check bounds')
        const bonds = []
        const nbatoms = molecule.atoms.length
        return Molvwr.Utils.runBatch(0, 300, molecule.atoms, (atom, batchindex, index) => {
          if (!molecule.kinds[atom.kind.symbol]) {
            molecule.kinds[atom.kind.symbol] = { kind: atom.kind, count: 1 }
          } else {
            molecule.kinds[atom.kind.symbol].count++
          }
          for (let i = index + 1; i < nbatoms; i++) {
            const siblingAtom = molecule.atoms[i]
            const l = new BABYLON.Vector3(atom.x, atom.y, atom.z)
            const m = new BABYLON.Vector3(siblingAtom.x, siblingAtom.y, siblingAtom.z)
            const d = BABYLON.Vector3.Distance(l, m)
            if (d < 1.3 * (atom.kind.radius + siblingAtom.kind.radius)) {
              if (!molecule.bondkinds[`${atom.kind.symbol}#${siblingAtom.kind.symbol}`]) {
                molecule.bondkinds[`${atom.kind.symbol}#${siblingAtom.kind.symbol}`] = { d, key: `${atom.kind.symbol}#${siblingAtom.kind.symbol}`, kindA: atom.kind, kindB: siblingAtom.kind, count: 1 }
              } else {
                molecule.bondkinds[`${atom.kind.symbol}#${siblingAtom.kind.symbol}`].count++
              }
              bonds.push({
                d,
                atomA: atom,
                atomB: siblingAtom,
                cutoff: d / (atom.kind.radius + siblingAtom.kind.radius)
              })
            }
          }
        }, 'checkbounds').then(() => {
          molecule.bonds = bonds
          console.timeEnd('check bounds')
          console.log(`found ${bonds.length} bonds`)
        })
      }

      _getCentroid({atoms}) {
        let minX = Infinity
        let maxX = -Infinity
        let minY = Infinity
        let maxY = -Infinity
        let minZ = Infinity
        let maxZ = -Infinity
        atoms.forEach(({x, y, z}) => {
          if (x > maxX)
            maxX = x
          if (x < minX)
            minX = x
          if (y > maxY)
            maxY = y
          if (y < minY)
            minY = y
          if (z > maxZ)
            maxZ = z
          if (z < minZ)
            minZ = z
        })
        return {
          x: (minX + maxX) / 2,
          y: (minY + maxY) / 2,
          z: (minZ + maxZ) / 2,
        }
      }

      _center(molecule) {
        console.time('recenter atoms')
        const shift = this._getCentroid(molecule)
        molecule.atoms.forEach(atom => {
          atom.x -= shift.x
          atom.y -= shift.y
          atom.z -= shift.z
        })
        console.timeEnd('recenter atoms')
        return Molvwr.Utils.Promise.resolve()
      }
    }

    Viewer.endsWith = (str, suffix) => str.indexOf(suffix, str.length - suffix.length) !== -1
    Viewer.getMoleculeFileFormat = filename => {
      if (Viewer.endsWith(filename, '.pdb'))
        return 'pdb'
      if (Viewer.endsWith(filename, '.mol') || Viewer.endsWith(filename, '.sdf'))
        return 'mol'
      if (Viewer.endsWith(filename, '.xyz'))
        return 'xyz'
      return null
    }
    return Viewer
  })()
  Molvwr.Viewer = Viewer
})(Molvwr || (Molvwr = {}))

(Molvwr => {
  let Elements
  (Elements => {
    Elements.elements = [
      { 'symbol': 'Xx', 'name': 'unknown', 'mass': 1.00000000, 'radius': 1.0000, 'color': [1.000, 0.078, 0.576], 'number': 0 },
      { 'symbol': 'H', 'name': 'hydrogen', 'mass': 1.00794000, 'radius': 0.3100, 'color': [1.000, 1.000, 1.000], 'number': 1 },
      { 'symbol': 'He', 'name': 'helium', 'mass': 4.00260200, 'radius': 0.2800, 'color': [0.851, 1.000, 1.000], 'number': 2 },
      { 'symbol': 'Li', 'name': 'lithium', 'mass': 6.94100000, 'radius': 1.2800, 'color': [0.800, 0.502, 1.000], 'number': 3 },
      { 'symbol': 'Be', 'name': 'beryllium', 'mass': 9.01218200, 'radius': 0.9600, 'color': [0.761, 1.000, 0.000], 'number': 4 },
      { 'symbol': 'B', 'name': 'boron', 'mass': 10.81100000, 'radius': 0.8400, 'color': [1.000, 0.710, 0.710], 'number': 5 },
      { 'symbol': 'C', 'name': 'carbon', 'mass': 12.01070000, 'radius': 0.7300, 'color': [0.565, 0.565, 0.565], 'number': 6 },
      { 'symbol': 'N', 'name': 'nitrogen', 'mass': 14.00670000, 'radius': 0.7100, 'color': [0.188, 0.314, 0.973], 'number': 7 },
      { 'symbol': 'O', 'name': 'oxygen', 'mass': 15.99940000, 'radius': 0.6600, 'color': [1.000, 0.051, 0.051], 'number': 8 },
      { 'symbol': 'F', 'name': 'fluorine', 'mass': 18.99840320, 'radius': 0.5700, 'color': [0.565, 0.878, 0.314], 'number': 9 },
      { 'symbol': 'Ne', 'name': 'neon', 'mass': 20.17970000, 'radius': 0.5800, 'color': [0.702, 0.890, 0.961], 'number': 10 },
      { 'symbol': 'Na', 'name': 'sodium', 'mass': 22.98976928, 'radius': 1.6600, 'color': [0.671, 0.361, 0.949], 'number': 11 },
      { 'symbol': 'Mg', 'name': 'magnesium', 'mass': 24.30500000, 'radius': 1.4100, 'color': [0.541, 1.000, 0.000], 'number': 12 },
      { 'symbol': 'Al', 'name': 'aluminum', 'mass': 26.98153860, 'radius': 1.2100, 'color': [0.749, 0.651, 0.651], 'number': 13 },
      { 'symbol': 'Si', 'name': 'silicon', 'mass': 28.08550000, 'radius': 1.1100, 'color': [0.941, 0.784, 0.627], 'number': 14 },
      { 'symbol': 'P', 'name': 'phosphorus', 'mass': 30.97376200, 'radius': 1.0700, 'color': [1.000, 0.502, 0.000], 'number': 15 },
      { 'symbol': 'S', 'name': 'sulfur', 'mass': 32.06500000, 'radius': 1.0500, 'color': [1.000, 1.000, 0.188], 'number': 16 },
      { 'symbol': 'Cl', 'name': 'chlorine', 'mass': 35.45300000, 'radius': 1.0200, 'color': [0.122, 0.941, 0.122], 'number': 17 },
      { 'symbol': 'Ar', 'name': 'argon', 'mass': 39.94800000, 'radius': 1.0600, 'color': [0.502, 0.820, 0.890], 'number': 18 },
      { 'symbol': 'K', 'name': 'potassium', 'mass': 39.09830000, 'radius': 2.0300, 'color': [0.561, 0.251, 0.831], 'number': 19 },
      { 'symbol': 'Ca', 'name': 'calcium', 'mass': 40.07800000, 'radius': 1.7600, 'color': [0.239, 1.000, 0.000], 'number': 20 },
      { 'symbol': 'Sc', 'name': 'scandium', 'mass': 44.95591200, 'radius': 1.7000, 'color': [0.902, 0.902, 0.902], 'number': 21 },
      { 'symbol': 'Ti', 'name': 'titanium', 'mass': 47.86700000, 'radius': 1.6000, 'color': [0.749, 0.761, 0.780], 'number': 22 },
      { 'symbol': 'V', 'name': 'vanadium', 'mass': 50.94150000, 'radius': 1.5300, 'color': [0.651, 0.651, 0.671], 'number': 23 },
      { 'symbol': 'Cr', 'name': 'chromium', 'mass': 51.99610000, 'radius': 1.3900, 'color': [0.541, 0.600, 0.780], 'number': 24 },
      { 'symbol': 'Mn', 'name': 'manganese', 'mass': 54.93804500, 'radius': 1.3900, 'color': [0.611, 0.478, 0.780], 'number': 25 },
      { 'symbol': 'Fe', 'name': 'iron', 'mass': 55.84500000, 'radius': 1.3200, 'color': [0.878, 0.400, 0.200], 'number': 26 },
      { 'symbol': 'Co', 'name': 'cobalt', 'mass': 58.69340000, 'radius': 1.2600, 'color': [0.941, 0.565, 0.627], 'number': 27 },
      { 'symbol': 'Ni', 'name': 'nickel', 'mass': 58.93319500, 'radius': 1.2400, 'color': [0.314, 0.816, 0.314], 'number': 28 },
      { 'symbol': 'Cu', 'name': 'copper', 'mass': 63.54600000, 'radius': 1.3200, 'color': [0.784, 0.502, 0.200], 'number': 29 },
      { 'symbol': 'Zn', 'name': 'zinc', 'mass': 65.38000000, 'radius': 1.2200, 'color': [0.490, 0.502, 0.690], 'number': 30 },
      { 'symbol': 'Ga', 'name': 'gallium', 'mass': 69.72300000, 'radius': 1.2200, 'color': [0.761, 0.561, 0.561], 'number': 31 },
      { 'symbol': 'Ge', 'name': 'germanium', 'mass': 72.64000000, 'radius': 1.2000, 'color': [0.400, 0.561, 0.561], 'number': 32 },
      { 'symbol': 'As', 'name': 'arsenic', 'mass': 74.92160000, 'radius': 1.1900, 'color': [0.741, 0.502, 0.890], 'number': 33 },
      { 'symbol': 'Se', 'name': 'selenium', 'mass': 78.96000000, 'radius': 1.2000, 'color': [1.000, 0.631, 0.000], 'number': 34 },
      { 'symbol': 'Br', 'name': 'bromine', 'mass': 79.90400000, 'radius': 1.2000, 'color': [0.651, 0.161, 0.161], 'number': 35 },
      { 'symbol': 'Kr', 'name': 'krypton', 'mass': 83.79800000, 'radius': 1.1600, 'color': [0.361, 0.722, 0.820], 'number': 36 },
      { 'symbol': 'Rb', 'name': 'rubidium', 'mass': 85.46780000, 'radius': 2.2000, 'color': [0.439, 0.180, 0.690], 'number': 37 },
      { 'symbol': 'Sr', 'name': 'strontium', 'mass': 87.62000000, 'radius': 1.9500, 'color': [0.000, 1.000, 0.000], 'number': 38 },
      { 'symbol': 'Y', 'name': 'yttrium', 'mass': 88.90585000, 'radius': 1.9000, 'color': [0.580, 1.000, 1.000], 'number': 39 },
      { 'symbol': 'Zr', 'name': 'zirconium', 'mass': 91.22400000, 'radius': 1.7500, 'color': [0.580, 0.878, 0.878], 'number': 40 },
      { 'symbol': 'Nb', 'name': 'niobium', 'mass': 92.90638000, 'radius': 1.6400, 'color': [0.451, 0.761, 0.788], 'number': 41 },
      { 'symbol': 'Mo', 'name': 'molybdenum', 'mass': 95.96000000, 'radius': 1.5400, 'color': [0.329, 0.710, 0.710], 'number': 42 },
      { 'symbol': 'Tc', 'name': 'technetium', 'mass': 98.00000000, 'radius': 1.4700, 'color': [0.231, 0.620, 0.620], 'number': 43 },
      { 'symbol': 'Ru', 'name': 'ruthenium', 'mass': 101.07000000, 'radius': 1.4600, 'color': [0.141, 0.561, 0.561], 'number': 44 },
      { 'symbol': 'Rh', 'name': 'rhodium', 'mass': 102.90550000, 'radius': 1.4200, 'color': [0.039, 0.490, 0.549], 'number': 45 },
      { 'symbol': 'Pd', 'name': 'palladium', 'mass': 106.42000000, 'radius': 1.3900, 'color': [0.000, 0.412, 0.522], 'number': 46 },
      { 'symbol': 'Ag', 'name': 'silver', 'mass': 107.86820000, 'radius': 1.4500, 'color': [0.753, 0.753, 0.753], 'number': 47 },
      { 'symbol': 'Cd', 'name': 'cadmium', 'mass': 112.41100000, 'radius': 1.4400, 'color': [1.000, 0.851, 0.561], 'number': 48 },
      { 'symbol': 'In', 'name': 'indium', 'mass': 114.81800000, 'radius': 1.4200, 'color': [0.651, 0.459, 0.451], 'number': 49 },
      { 'symbol': 'Sn', 'name': 'tin', 'mass': 118.71000000, 'radius': 1.3900, 'color': [0.400, 0.502, 0.502], 'number': 50 },
      { 'symbol': 'Sb', 'name': 'antimony', 'mass': 121.76000000, 'radius': 1.3900, 'color': [0.620, 0.388, 0.710], 'number': 51 },
      { 'symbol': 'Te', 'name': 'tellurium', 'mass': 127.60000000, 'radius': 1.3800, 'color': [0.831, 0.478, 0.000], 'number': 52 },
      { 'symbol': 'I', 'name': 'iodine', 'mass': 126.90470000, 'radius': 1.3900, 'color': [0.580, 0.000, 0.580], 'number': 53 },
      { 'symbol': 'Xe', 'name': 'xenon', 'mass': 131.29300000, 'radius': 1.4000, 'color': [0.259, 0.620, 0.690], 'number': 54 },
      { 'symbol': 'Cs', 'name': 'cesium', 'mass': 132.90545190, 'radius': 2.4400, 'color': [0.341, 0.090, 0.561], 'number': 55 },
      { 'symbol': 'Ba', 'name': 'barium', 'mass': 137.32700000, 'radius': 2.1500, 'color': [0.000, 0.788, 0.000], 'number': 56 },
      { 'symbol': 'La', 'name': 'lanthanum', 'mass': 138.90547000, 'radius': 2.0700, 'color': [0.439, 0.831, 1.000], 'number': 57 },
      { 'symbol': 'Ce', 'name': 'cerium', 'mass': 140.11600000, 'radius': 2.0400, 'color': [1.000, 1.000, 0.780], 'number': 58 },
      { 'symbol': 'Pr', 'name': 'praseodymium', 'mass': 140.90765000, 'radius': 2.0300, 'color': [0.851, 1.000, 0.780], 'number': 59 },
      { 'symbol': 'Nd', 'name': 'neodymium', 'mass': 144.24200000, 'radius': 2.0100, 'color': [0.780, 1.000, 0.780], 'number': 60 },
      { 'symbol': 'Pm', 'name': 'promethium', 'mass': 145.00000000, 'radius': 1.9900, 'color': [0.639, 1.000, 0.780], 'number': 61 },
      { 'symbol': 'Sm', 'name': 'samarium', 'mass': 150.36000000, 'radius': 1.9800, 'color': [0.561, 1.000, 0.780], 'number': 62 },
      { 'symbol': 'Eu', 'name': 'europium', 'mass': 151.96400000, 'radius': 1.9800, 'color': [0.380, 1.000, 0.780], 'number': 63 },
      { 'symbol': 'Gd', 'name': 'gadolinium', 'mass': 157.25000000, 'radius': 1.9600, 'color': [0.271, 1.000, 0.780], 'number': 64 },
      { 'symbol': 'Tb', 'name': 'terbium', 'mass': 158.92535000, 'radius': 1.9400, 'color': [0.189, 1.000, 0.780], 'number': 65 },
      { 'symbol': 'Dy', 'name': 'dysprosium', 'mass': 162.50000000, 'radius': 1.9200, 'color': [0.122, 1.000, 0.780], 'number': 66 },
      { 'symbol': 'Ho', 'name': 'holmium', 'mass': 164.93032000, 'radius': 1.9200, 'color': [0.000, 1.000, 0.612], 'number': 67 },
      { 'symbol': 'Er', 'name': 'erbium', 'mass': 167.25900000, 'radius': 1.8900, 'color': [0.000, 0.902, 0.459], 'number': 68 },
      { 'symbol': 'Tm', 'name': 'thulium', 'mass': 168.93421000, 'radius': 1.9000, 'color': [0.000, 0.831, 0.322], 'number': 69 },
      { 'symbol': 'Yb', 'name': 'ytterbium', 'mass': 173.05400000, 'radius': 1.8700, 'color': [0.000, 0.749, 0.220], 'number': 70 },
      { 'symbol': 'Lu', 'name': 'lutetium', 'mass': 174.96680000, 'radius': 1.8700, 'color': [0.000, 0.671, 0.141], 'number': 71 },
      { 'symbol': 'Hf', 'name': 'hafnium', 'mass': 178.49000000, 'radius': 1.7500, 'color': [0.302, 0.761, 1.000], 'number': 72 },
      { 'symbol': 'Ta', 'name': 'tantalum', 'mass': 180.94788000, 'radius': 1.7000, 'color': [0.302, 0.651, 1.000], 'number': 73 },
      { 'symbol': 'W', 'name': 'tungsten', 'mass': 183.84000000, 'radius': 1.6200, 'color': [0.129, 0.580, 0.839], 'number': 74 },
      { 'symbol': 'Re', 'name': 'rhenium', 'mass': 186.20700000, 'radius': 1.5100, 'color': [0.149, 0.490, 0.671], 'number': 75 },
      { 'symbol': 'Os', 'name': 'osmium', 'mass': 190.23000000, 'radius': 1.4400, 'color': [0.149, 0.400, 0.588], 'number': 76 },
      { 'symbol': 'Ir', 'name': 'iridium', 'mass': 192.21700000, 'radius': 1.4100, 'color': [0.090, 0.329, 0.529], 'number': 77 },
      { 'symbol': 'Pt', 'name': 'platinum', 'mass': 195.08400000, 'radius': 1.3600, 'color': [0.816, 0.816, 0.878], 'number': 78 },
      { 'symbol': 'Au', 'name': 'gold', 'mass': 196.96656900, 'radius': 1.3600, 'color': [1.000, 0.820, 0.137], 'number': 79 },
      { 'symbol': 'Hg', 'name': 'mercury', 'mass': 200.59000000, 'radius': 1.3200, 'color': [0.722, 0.722, 0.816], 'number': 80 },
      { 'symbol': 'Tl', 'name': 'thallium', 'mass': 204.38330000, 'radius': 1.4500, 'color': [0.651, 0.329, 0.302], 'number': 81 },
      { 'symbol': 'Pb', 'name': 'lead', 'mass': 207.20000000, 'radius': 1.4600, 'color': [0.341, 0.349, 0.380], 'number': 82 },
      { 'symbol': 'Bi', 'name': 'bismuth', 'mass': 208.98040000, 'radius': 1.4800, 'color': [0.620, 0.310, 0.710], 'number': 83 },
      { 'symbol': 'Po', 'name': 'polonium', 'mass': 210.00000000, 'radius': 1.4000, 'color': [0.671, 0.361, 0.000], 'number': 84 },
      { 'symbol': 'At', 'name': 'astatine', 'mass': 210.00000000, 'radius': 1.5000, 'color': [0.459, 0.310, 0.271], 'number': 85 },
      { 'symbol': 'Rn', 'name': 'radon', 'mass': 220.00000000, 'radius': 1.5000, 'color': [0.259, 0.510, 0.588], 'number': 86 },
      { 'symbol': 'Fr', 'name': 'francium', 'mass': 223.00000000, 'radius': 2.6000, 'color': [0.259, 0.000, 0.400], 'number': 87 },
      { 'symbol': 'Ra', 'name': 'radium', 'mass': 226.00000000, 'radius': 2.2100, 'color': [0.000, 0.490, 0.000], 'number': 88 },
      { 'symbol': 'Ac', 'name': 'actinium', 'mass': 227.00000000, 'radius': 2.1500, 'color': [0.439, 0.671, 0.980], 'number': 89 },
      { 'symbol': 'Th', 'name': 'thorium', 'mass': 231.03588000, 'radius': 2.0600, 'color': [0.000, 0.729, 1.000], 'number': 90 },
      { 'symbol': 'Pa', 'name': 'protactinium', 'mass': 232.03806000, 'radius': 2.0000, 'color': [0.000, 0.631, 1.000], 'number': 91 },
      { 'symbol': 'U', 'name': 'uranium', 'mass': 237.00000000, 'radius': 1.9600, 'color': [0.000, 0.561, 1.000], 'number': 92 },
      { 'symbol': 'Np', 'name': 'neptunium', 'mass': 238.02891000, 'radius': 1.9000, 'color': [0.000, 0.502, 1.000], 'number': 93 },
      { 'symbol': 'Pu', 'name': 'plutonium', 'mass': 243.00000000, 'radius': 1.8700, 'color': [0.000, 0.420, 1.000], 'number': 94 },
      { 'symbol': 'Am', 'name': 'americium', 'mass': 244.00000000, 'radius': 1.8000, 'color': [0.329, 0.361, 0.949], 'number': 95 },
      { 'symbol': 'Cm', 'name': 'curium', 'mass': 247.00000000, 'radius': 1.6900, 'color': [0.471, 0.361, 0.890], 'number': 96 },
      { 'symbol': 'Bk', 'name': 'berkelium', 'mass': 247.00000000, 'radius': 1.6600, 'color': [0.541, 0.310, 0.890], 'number': 97 },
      { 'symbol': 'Cf', 'name': 'californium', 'mass': 251.00000000, 'radius': 1.6800, 'color': [0.631, 0.212, 0.831], 'number': 98 },
      { 'symbol': 'Es', 'name': 'einsteinium', 'mass': 252.00000000, 'radius': 1.6500, 'color': [0.702, 0.122, 0.831], 'number': 99 },
      { 'symbol': 'Fm', 'name': 'fermium', 'mass': 257.00000000, 'radius': 1.6700, 'color': [0.702, 0.122, 0.729], 'number': 100 },
      { 'symbol': 'Md', 'name': 'mendelevium', 'mass': 258.00000000, 'radius': 1.7300, 'color': [0.702, 0.051, 0.651], 'number': 101 },
      { 'symbol': 'No', 'name': 'nobelium', 'mass': 259.00000000, 'radius': 1.7600, 'color': [0.741, 0.051, 0.529], 'number': 102 },
      { 'symbol': 'Lr', 'name': 'lawrencium', 'mass': 262.00000000, 'radius': 1.6100, 'color': [0.780, 0.000, 0.400], 'number': 103 },
      { 'symbol': 'Rf', 'name': 'rutherfordium', 'mass': 261.00000000, 'radius': 1.5700, 'color': [0.800, 0.000, 0.349], 'number': 104 },
      { 'symbol': 'Db', 'name': 'dubnium', 'mass': 262.00000000, 'radius': 1.4900, 'color': [0.820, 0.000, 0.310], 'number': 105 },
      { 'symbol': 'Sg', 'name': 'seaborgium', 'mass': 266.00000000, 'radius': 1.4300, 'color': [0.851, 0.000, 0.271], 'number': 106 },
      { 'symbol': 'Bh', 'name': 'bohrium', 'mass': 264.00000000, 'radius': 1.4100, 'color': [0.878, 0.000, 0.220], 'number': 107 },
      { 'symbol': 'Hs', 'name': 'hassium', 'mass': 277.00000000, 'radius': 1.3400, 'color': [0.902, 0.000, 0.180], 'number': 108 },
      { 'symbol': 'Mt', 'name': 'meitnerium', 'mass': 268.00000000, 'radius': 1.2900, 'color': [0.922, 0.000, 0.149], 'number': 10, },
      { 'symbol': 'Ds', 'name': 'Ds', 'mass': 271.00000000, 'radius': 1.2800, 'color': [0.922, 0.000, 0.149], 'number': 110 },
      { 'symbol': 'Uuu', 'name': 'Uuu', 'mass': 272.00000000, 'radius': 1.2100, 'color': [0.922, 0.000, 0.149], 'number': 11, },
      { 'symbol': 'Uub', 'name': 'Uub', 'mass': 285.00000000, 'radius': 1.2200, 'color': [0.922, 0.000, 0.149], 'number': 112 },
      { 'symbol': 'Uut', 'name': 'Uut', 'mass': 284.00000000, 'radius': 1.3600, 'color': [0.922, 0.000, 0.149], 'number': 113 },
      { 'symbol': 'Uuq', 'name': 'Uuq', 'mass': 289.00000000, 'radius': 1.4300, 'color': [0.922, 0.000, 0.149], 'number': 114 },
      { 'symbol': 'Uup', 'name': 'Uup', 'mass': 288.00000000, 'radius': 1.6200, 'color': [0.922, 0.000, 0.149], 'number': 115 },
      { 'symbol': 'Uuh', 'name': 'Uuh', 'mass': 292.00000000, 'radius': 1.7500, 'color': [0.922, 0.000, 0.149], 'number': 116 },
      { 'symbol': 'Uus', 'name': 'Uus', 'mass': 294.00000000, 'radius': 1.6500, 'color': [0.922, 0.000, 0.149], 'number': 117 },
      { 'symbol': 'Uuo', 'name': 'Uuo', 'mass': 296.00000000, 'radius': 1.5700, 'color': [0.922, 0.000, 0.149], 'number': 118 }
    ]
    Elements.elementsBySymbol = {}
    Elements.elements.forEach(e => {
      Elements.elementsBySymbol[e.symbol.toUpperCase()] = e
    })
    Elements.elementsByNumber = {}
    Elements.elements.forEach(e => {
      Elements.elementsByNumber[e.number] = e
    })
    Elements.MIN_ATOM_RADIUS = Infinity
    Elements.MAX_ATOM_RADIUS = -Infinity
    Elements.elements.forEach(({radius}) => {
      Elements.MIN_ATOM_RADIUS = Math.min(Elements.MIN_ATOM_RADIUS, radius)
      Elements.MAX_ATOM_RADIUS = Math.max(Elements.MAX_ATOM_RADIUS, radius)
    })
  })(Elements = Molvwr.Elements || (Molvwr.Elements = {}))
})(Molvwr || (Molvwr = {}))

(Molvwr => {
  let Parser
  (Parser => {
    function getFloat(s) {
      if (!s)
        return 0
      return parseFloat(s.trim())
    }
    Parser.mol = {
      parse(content) {
        console.log('parsing mol content')
        const molecule = {
          atoms: [],
          title: null
        }
        const lines = content.split('\n')
        molecule.title = lines[1]
        for (let i = 0, l = lines.length; i < l; i++) {
          if (lines[i].indexOf('  ') === 0) {
            const lineElements = lines[i].split(' ').filter(s => {
              const tmp = s.trim()
              if (tmp && tmp.length) {
                return true
              } else {
                return false
              }
            })
            if (lineElements.length && lineElements.length >= 4) {
              const symbol = lineElements[3].trim()
              const x = getFloat(lineElements[0])
              const y = getFloat(lineElements[1])
              const z = getFloat(lineElements[2])
              const atomKind = Molvwr.Elements.elementsBySymbol[symbol.toUpperCase()]
              if (atomKind) {
                molecule.atoms.push({
                  kind: atomKind,
                  x,
                  y,
                  z,
                  bonds: []
                })
              } else {
                console.warn(`atom not found ${symbol}`)
              }
            }
          }
        }
        console.log(`found ${molecule.atoms.length}`)
        return molecule
      }
    }
  })(Parser = Molvwr.Parser || (Molvwr.Parser = {}))
})(Molvwr || (Molvwr = {}))

(Molvwr => {
  let Parser
  (Parser => {
    function getFloat(s) {
      if (!s)
        return 0
      return parseFloat(s.trim())
    }
    Parser.pdb = {
      parse(content) {
        console.log('parsing pdb content')
        const molecule = {
          atoms: [],
          title: null
        }
        const lines = content.split('\n')
        for (let i = 0, l = lines.length; i < l; i++) {
          const line = lines[i]
          if (line.indexOf('HETATM') === 0 || line.indexOf('ATOM') === 0) {
            this.parseHETATM(molecule, line)
          }
        }
        console.log(`found ${molecule.title} ${molecule.atoms.length}`)
        return molecule
      },
      parseHETATM({atoms}, line) {
        let symbol = line.substr(12, 2).trim()
        if (isNaN(symbol[0]) === false) {
          symbol = symbol.substr(1)
        }
        const atomKind = Molvwr.Elements.elementsBySymbol[symbol.toUpperCase()]
        if (atomKind) {
          const x = parseFloat(line.substr(30, 8).trim())
          const y = parseFloat(line.substr(38, 8).trim())
          const z = parseFloat(line.substr(46, 8).trim())
          atoms.push({
            kind: atomKind,
            x,
            y,
            z,
            bonds: []
          })
        } else {
          console.warn(`atom not found ${symbol}`)
        }
      }
    }
  })(Parser = Molvwr.Parser || (Molvwr.Parser = {}))
})(Molvwr || (Molvwr = {}))


(Molvwr => {
  let Parser
  (Parser => {
    function getFloat(s) {
      if (!s)
        return 0
      return parseFloat(s.trim())
    }
    Parser.xyz = {
      parse(content) {
        console.log('parsing xyz content')
        const molecule = {
          atoms: [],
          title: null
        }
        const lines = content.split('\n')
        molecule.title = lines[1]
        for (let i = 2, l = lines.length; i < l; i++) {
          const lineElements = lines[i].split(' ').filter(s => {
            const tmp = s.trim()
            if (tmp && tmp.length) {
              return true
            } else {
              return false
            }
          })
          if (lineElements.length && lineElements.length >= 4) {
            const symbol = lineElements[0].trim()
            const x = getFloat(lineElements[1])
            const y = getFloat(lineElements[2])
            const z = getFloat(lineElements[3])
            const atomKind = Molvwr.Elements.elementsBySymbol[symbol.toUpperCase()]
            if (atomKind) {
              molecule.atoms.push({
                kind: atomKind,
                x,
                y,
                z,
                bonds: []
              })
            } else {
              console.warn(`atom not found ${symbol}`)
            }
          }
        }
        console.log(`found ${molecule.title} ${molecule.atoms.length}`)
        return molecule
      }
    }
  })(Parser = Molvwr.Parser || (Molvwr.Parser = {}))
})(Molvwr || (Molvwr = {}))

(Molvwr => {
  let Utils
  (Utils => {
    let asap = (typeof setImmediate === 'function' && setImmediate) || (fn => { setTimeout(fn, 1) })
    const isArray = Array.isArray || (value => Object.prototype.toString.call(value) === '[object Array]')
    function runBatch(offset, size, itemslist, itemcallback, batchname) {
      if (batchname)
        console.log(`${batchname} ${offset}/${itemslist.length}`)
      return new Promise((complete, error) => {
        asap(() => {
          const items = itemslist.slice(offset, offset + size)
          items.forEach((item, index) => {
            itemcallback(item, index, index + offset)
          })
          if (items.length < size) {
            complete()
          } else {
            runBatch(offset + size, size, itemslist, itemcallback, batchname).then(complete, error)
          }
        })
      })
    }
    Utils.runBatch = runBatch
    let Promise = (() => {
      class Promise {
        constructor(fn) {
          if (typeof this !== 'object')
            throw new TypeError('Promises must be constructed via new')
          if (typeof fn !== 'function')
            throw new TypeError('not a function')
          this._state = null
          this._value = null
          this._deferreds = []
          doResolve(fn, resolve.bind(this), reject.bind(this))
        }

        catch(onRejected) {
          return this.then(null, onRejected)
        }

        then(onFulfilled, onRejected) {
          const me = this
          return new Promise((resolve, reject) => {
            handle.call(me, new Handler(onFulfilled, onRejected, resolve, reject))
          })
        }

        static timeout(timeoutTime) {
          const me = this
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              resolve()
            }, timeoutTime)
          })
        }

        static all(fake) {
          const args = Array.prototype.slice.call(arguments.length === 1 && isArray(arguments[0]) ? arguments[0] : arguments)
          return new Promise((resolve, reject) => {
            if (args.length === 0)
              return resolve([])
            let remaining = args.length
            function res(i, val) {
              try {
                if (val && (typeof val === 'object' || typeof val === 'function')) {
                  const then = val.then
                  if (typeof then === 'function') {
                    then.call(val, val => { res(i, val) }, reject)
                    return
                  }
                }
                args[i] = val
                if (--remaining === 0) {
                  resolve(args)
                }
              }
              catch (ex) {
                console.error(ex)
                reject(ex)
              }
            }
            for (let i = 0; i < args.length; i++) {
              res(i, args[i])
            }
          })
        }
      }

      Promise.resolve = value => {
        if (value && typeof value === 'object' && value.constructor === Promise) {
          return value
        }
        return new Promise(resolve => {
          resolve(value)
        })
      }
      Promise.reject = value => new Promise((resolveCallback, rejectCallback) => {
        rejectCallback(value)
      })
      Promise.race = values => new Promise((resolveCallback, rejectCallback) => {
        for (let i = 0, len = values.length; i < len; i++) {
          values[i].then(resolveCallback, rejectCallback)
        }
      })
      /**
       * Set the immediate function to execute callbacks
       * @param fn {function} Function to execute
       * @private
       */
      Promise._setImmediateFn = fn => {
        asap = fn
      }
      return Promise
    })()
    Utils.Promise = Promise
    function handle(deferred) {
      const me = this
      if (this._state === null) {
        this._deferreds.push(deferred)
        return
      }
      asap(() => {
        const cb = me._state ? deferred.onFulfilled : deferred.onRejected
        if (cb === null) {
          (me._state ? deferred.resolve : deferred.reject)(me._value)
          return
        }
        let ret
        try {
          ret = cb(me._value)
        }
        catch (e) {
          console.error(e)
          deferred.reject(e)
          return
        }
        deferred.resolve(ret)
      })
    }
    function resolve(newValue) {
      try {
        if (newValue === this)
          throw new TypeError('A promise cannot be resolved with itself.')
        if (newValue && (typeof newValue === 'object' || typeof newValue === 'function')) {
          const then = newValue.then
          if (typeof then === 'function') {
            doResolve(then.bind(newValue), resolve.bind(this), reject.bind(this))
            return
          }
        }
        this._state = true
        this._value = newValue
        finale.call(this)
      }
      catch (e) {
        console.error(e)
        reject.call(this, e)
      }
    }
    function reject(newValue) {
      this._state = false
      this._value = newValue
      finale.call(this)
    }
    function finale() {
      for (let i = 0, len = this._deferreds.length; i < len; i++) {
        handle.call(this, this._deferreds[i])
      }
      this._deferreds = null
    }
    function Handler(onFulfilled, onRejected, resolve, reject) {
      this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null
      this.onRejected = typeof onRejected === 'function' ? onRejected : null
      this.resolve = resolve
      this.reject = reject
    }
    /**
     * Take a potentially misbehaving resolver function and make sure
     * onFulfilled and onRejected are only called once.
     *
     * Makes no guarantees about asynchrony.
     */
    function doResolve(fn, onFulfilled, onRejected) {
      let done = false
      try {
        fn(value => {
          if (done)
            return
          done = true
          onFulfilled(value)
        }, reason => {
          if (done)
            return
          done = true
          onRejected(reason)
        })
      }
      catch (ex) {
        console.error(ex)
        if (done)
          return
        done = true
        onRejected(ex)
      }
    }
  })(Utils = Molvwr.Utils || (Molvwr.Utils = {}))
})(Molvwr || (Molvwr = {}))

(Molvwr => {
  let Renderer
  (Renderer => {
    const BondsCylinder = (() => {
      class BondsCylinder {
        constructor(viewer, ctx, config) {
          this.meshes = {}
          this.ctx = ctx
          this.config = config
          this.viewer = viewer
        }

        render(molecule) {
          const _this = this
          const cfg = this.config
          const meshes = []
          const diameter = Molvwr.Elements.MIN_ATOM_RADIUS * this.config.cylinderScale * this.config.atomScaleFactor
          const nbbonds = molecule.bonds.length
          return this.prepareBonds(molecule, diameter).then(() => {
            console.time('cylinder rendering')
            return Molvwr.Utils.runBatch(0, molecule.batchSize, molecule.bonds, ({atomA, atomB, d}, index) => {
              const key = `${atomA.kind.symbol}#${atomB.kind.symbol}`
              const mesh = _this.meshes[key]
              const cylinder = mesh.createInstance(`bond${index}`)
              _this.alignCylinderToBinding(atomA, atomB, d, cylinder)
            }, 'cylinder rendering').then(() => {
              console.timeEnd('cylinder rendering')
            })
          })
        }

        prepareBonds(molecule, diameter) {
          const _this = this
          console.time('prepare bonds as cylinder')
          const bondkinds = []
          for (const n in molecule.bondkinds) {
            bondkinds.push(molecule.bondkinds[n])
          }
          let batchSize = 100
          if (this.config.cylinderLOD) {
            batchSize = (batchSize / this.config.cylinderLOD.length) >> 0
          }
          return Molvwr.Utils.runBatch(0, batchSize, bondkinds, (bondkind, index) => {
            _this.meshes[bondkind.key] = _this.createMesh(bondkind, diameter)
          }, 'prepare cylinder').then(() => {
            console.timeEnd('prepare bonds as cylinder')
          })
        }

        createMesh(binding, diameter) {
          if (this.config.cylinderLOD) {
            const rootConf = this.config.cylinderLOD[0]
            const rootMesh = this.createCylinder(binding, diameter, 0, rootConf.segments, rootConf.effects, rootConf.color)
            for (let i = 1, l = this.config.cylinderLOD.length; i < l; i++) {
              const conf = this.config.cylinderLOD[i]
              if (conf.segments) {
                const childCylinder = this.createCylinder(binding, diameter, i, conf.segments, conf.effects, conf.color)
                rootMesh.addLODLevel(conf.depth, childCylinder)
              } else {
                rootMesh.addLODLevel(conf.depth, null)
              }
            }
            return rootMesh
          } else {
            return this.createCylinder(binding, diameter, 0, this.config.cylinderSegments, true, null)
          }
        }

        createCylinder({key, d, kindA}, diameter, lodIndex, segments, useeffects, coloroverride) {
          const cylinder = BABYLON.Mesh.CreateCylinder(`bondtemplate${key}`, d, diameter, diameter, segments, 2, this.ctx.scene, false)
          const rootMat = new BABYLON.StandardMaterial(`materialFor${key}${lodIndex}`, this.ctx.scene)
          const atomAColor = coloroverride || kindA.color
          rootMat.diffuseColor = new BABYLON.Color3(0.3, 0.3, 0.3)
          this.ctx.cylinderMaterial(cylinder, rootMat, useeffects)
          cylinder.material = rootMat
          cylinder.isPickable = false
          cylinder.setEnabled(false)
          return cylinder
        }

        alignCylinderToBinding(atomA, atomB, distance, cylinder) {
          const pointA = new BABYLON.Vector3(atomA.x, atomA.y, atomA.z)
          const pointB = new BABYLON.Vector3(atomB.x, atomB.y, atomB.z)
          const v1 = pointB.subtract(pointA)
          v1.normalize()
          let v2 = new BABYLON.Vector3(0, 1, 0)
          if (this.vectorEqualsCloseEnough(v1, v2.negate())) {
            console.log('must invert...')
            let v2 = new BABYLON.Vector3(1, 0, 0)
            let axis = BABYLON.Vector3.Cross(v2, v1)
            axis.normalize()
            let angle = BABYLON.Vector3.Dot(v1, v2)
            angle = Math.acos(angle) + (Math.PI / 2)
            cylinder.setPivotMatrix(BABYLON.Matrix.Translation(0, -distance / 2, 0))
            cylinder.position = pointB
            const quaternion = BABYLON.Quaternion.RotationAxis(axis, angle)
            quaternion.w = -quaternion.w
            cylinder.rotationQuaternion = quaternion
            console.log(cylinder.rotationQuaternion)
          } else {
            let axis = BABYLON.Vector3.Cross(v2, v1)
            axis.normalize()
            let angle = BABYLON.Vector3.Dot(v1, v2)
            angle = Math.acos(angle)
            cylinder.setPivotMatrix(BABYLON.Matrix.Translation(0, -distance / 2, 0))
            cylinder.position = pointB
            cylinder.rotationQuaternion = BABYLON.Quaternion.RotationAxis(axis, angle)
          }
        }

        vectorEqualsCloseEnough(v1, v2, tolerance) {
          if (tolerance === void 0) { tolerance = 0.00002 }
          if (typeof (v2) !== 'object') {
            throw ('v2 is supposed to be an object')
          }
          if (typeof (v1) !== 'object') {
            throw ('v1 is supposed to be an object')
          }
          if (v1.x < v2.x - tolerance || v1.x > v2.x + tolerance) {
            return false
          }
          if (v1.y < v2.y - tolerance || v1.y > v2.y + tolerance) {
            return false
          }
          if (v1.z < v2.z - tolerance || v1.z > v2.z + tolerance) {
            return false
          }
          return true
        }
      }

      return BondsCylinder
    })()
    Renderer.BondsCylinder = BondsCylinder
  })(Renderer = Molvwr.Renderer || (Molvwr.Renderer = {}))
})(Molvwr || (Molvwr = {}))

(Molvwr => {
  let Renderer
  (Renderer => {
    const BondsLines = (() => {
      class BondsLines {
        constructor(viewer, ctx, config) {
          this.meshes = {}
          this.ctx = ctx
          this.config = config
          this.viewer = viewer
        }

        render({bonds}) {
          const _this = this
          const cfg = this.config
          const meshes = []
          console.log('rendering bonds as lines')
          bonds.forEach(({atomA, atomB}, index) => {
            const line = BABYLON.Mesh.CreateLines(`bond-${index}`, [
              new BABYLON.Vector3(atomA.x, atomA.y, atomA.z),
              new BABYLON.Vector3(atomB.x, atomB.y, atomB.z),
            ], _this.ctx.scene, false)
            line.color = new BABYLON.Color3(0.5, 0.5, 0.5)
            meshes.push(line)
          })
          return Molvwr.Utils.Promise.resolve()
        }
      }

      return BondsLines
    })()
    Renderer.BondsLines = BondsLines
  })(Renderer = Molvwr.Renderer || (Molvwr.Renderer = {}))
})(Molvwr || (Molvwr = {}))

(Molvwr => {
  let Renderer
  (Renderer => {
    const Sphere = (() => {
      class Sphere {
        constructor(viewer, ctx, config) {
          this.meshes = {}
          this.ctx = ctx
          this.config = config
          this.viewer = viewer
        }

        render(molecule) {
          const _this = this
          return this.prepareMeshes(molecule).then(() => {
            console.time('sphere rendering')
            return Molvwr.Utils.runBatch(0, molecule.batchSize, molecule.atoms, _this.renderAtom.bind(_this), 'sphere rendering').then(() => {
              console.timeEnd('sphere rendering')
            })
          })
        }

        prepareMeshes(molecule) {
          const _this = this
          console.time('prepare spheres')
          const kinds = []
          for (const n in molecule.kinds) {
            kinds.push(molecule.kinds[n])
          }
          return Molvwr.Utils.runBatch(0, 100, kinds, ({kind}, index) => {
            _this.meshes[kind.symbol] = _this.createMesh(kind)
          }, 'prepare spheres').then(() => {
            console.timeEnd('prepare spheres')
          })
        }

        createMesh(atomkind) {
          if (this.config.sphereLOD) {
            const rootConf = this.config.sphereLOD[0]
            const rootMesh = this.createSphere(atomkind, rootConf.segments, rootConf.effects, rootConf.color)
            for (let i = 1, l = this.config.sphereLOD.length; i < l; i++) {
              const conf = this.config.sphereLOD[i]
              if (conf.segments) {
                const childSphere = this.createSphere(atomkind, conf.segments, conf.effects, conf.color)
                rootMesh.addLODLevel(conf.depth, childSphere)
              } else {
                rootMesh.addLODLevel(conf.depth, null)
              }
            }
            return rootMesh
          } else {
            return this.createSphere(atomkind, this.config.sphereSegments, true, null)
          }
        }

        createSphere(atomkind, segments, useEffects, overridecolor) {
          const sphere = BABYLON.Mesh.CreateSphere('spheretemplate', segments, atomkind.radius * this.config.atomScaleFactor, this.ctx.scene, false)
          sphere.setEnabled(false)
          sphere.isPickable = false
          const atomMat = new BABYLON.StandardMaterial(`materialFor${atomkind.symbol}`, this.ctx.scene)
          const color = overridecolor || atomkind.color
          atomMat.diffuseColor = new BABYLON.Color3(color[0], color[1], color[2])
          this.ctx.sphereMaterial(sphere, atomMat, useEffects)
          sphere.material = atomMat
          return sphere
        }

        renderAtom({kind, x, y, z}, index) {
          const cfg = this.config
          const mesh = this.meshes[kind.symbol]
          if (!mesh) {
            console.warn(`no mesh for ${kind.symbol}`)
          }
          const sphere = mesh.createInstance(`sphere${index}`)
          sphere.pickable = false
          sphere.position.x = x
          sphere.position.y = y
          sphere.position.z = z
          return sphere
        }
      }

      return Sphere
    })()
    Renderer.Sphere = Sphere
  })(Renderer = Molvwr.Renderer || (Molvwr.Renderer = {}))
})(Molvwr || (Molvwr = {}))

(Molvwr => {
  let Renderer
  (Renderer => {
    const Sticks = (() => {
      class Sticks {
        constructor(viewer, ctx, config) {
          this.meshes = {}
          this.ctx = ctx
          this.config = config
          this.viewer = viewer
        }

        render(molecule) {
          const _this = this
          const cfg = this.config
          const meshes = []
          const diameter = Molvwr.Elements.MIN_ATOM_RADIUS * this.config.cylinderScale * this.config.atomScaleFactor
          const nbbonds = molecule.bonds.length
          return this.prepareBonds(molecule, diameter).then(() => {
            console.time('sticks rendering')
            return Molvwr.Utils.runBatch(0, molecule.batchSize, molecule.bonds, ({atomA, atomB, d}, index) => {
              const key = `${atomA.kind.symbol}#${atomB.kind.symbol}`
              const mesh = _this.meshes[key]
              const cylinder = mesh.createInstance(`bond${index}`)
              _this.alignCylinderToBinding(atomA, atomB, d, cylinder)
            }).then(() => {
              console.timeEnd('sticks rendering')
            })
          })
        }

        prepareBonds(molecule, diameter) {
          const _this = this
          console.time('prepare bonds as sticks')
          const bondkinds = []
          for (const n in molecule.bondkinds) {
            bondkinds.push(molecule.bondkinds[n])
          }
          let batchSize = 50
          if (this.config.cylinderLOD) {
            batchSize = (batchSize / this.config.cylinderLOD.length) >> 0
          }
          return Molvwr.Utils.runBatch(0, batchSize, bondkinds, (bondkind, index) => {
            _this.meshes[bondkind.key] = _this.createMesh(bondkind, diameter)
          }, 'prepare sticks').then(() => {
            console.timeEnd('prepare bonds as sticks')
          })
        }

        createMesh(binding, diameter) {
          const processor = this.createStickMergemesh
          if (this.config.cylinderLOD) {
            const rootConf = this.config.cylinderLOD[0]
            const rootMesh = processor.apply(this, [binding, diameter, 0, rootConf.segments, rootConf.texture, rootConf.effects, rootConf.color])
            for (let i = 1, l = this.config.cylinderLOD.length; i < l; i++) {
              const conf = this.config.cylinderLOD[i]
              if (conf.segments) {
                const childCylinder = processor.apply(this, [binding, diameter, i, conf.segments, conf.texture, conf.effects, conf.color])
                rootMesh.addLODLevel(conf.depth, childCylinder)
              } else {
                rootMesh.addLODLevel(conf.depth, null)
              }
            }
            return rootMesh
          } else {
            return processor.apply(this, [binding, diameter, 0, this.config.cylinderSegments, true, true, null])
          }
        }

        createStickMergemesh(
          {d, key, kindA, kindB},
          diameter,
          lodIndex,
          segments,
          texture,
          useeffects,
          coloroverride
        ) {
          const radius = diameter / 2
          const cylinderSize = d - (radius / 2.5)
          const halfCylinderSize = cylinderSize / 2
          const cylinder = BABYLON.Mesh.CreateCylinder(`bondtemplate${key}-${lodIndex}`, cylinderSize, diameter, diameter, segments, 2, this.ctx.scene, false)
          const cylinderIndices = cylinder.getIndices()
          const sphereA = BABYLON.Mesh.CreateSphere(`sphereA${key}-${lodIndex}`, segments, diameter, this.ctx.scene, false)
          sphereA.position.y = -halfCylinderSize
          const sphereB = BABYLON.Mesh.CreateSphere(`sphereB${key}-${lodIndex}`, segments, diameter, this.ctx.scene, false)
          sphereB.position.y = halfCylinderSize
          const capsule = BABYLON.Mesh.MergeMeshes([sphereA, cylinder, sphereB], true)
          const atomAMat = new BABYLON.StandardMaterial(`materialFor${key}${kindA.symbol}-${lodIndex}`, this.ctx.scene)
          const atomAColor = coloroverride || kindA.color
          atomAMat.diffuseColor = new BABYLON.Color3(atomAColor[0], atomAColor[1], atomAColor[2])
          this.ctx.cylinderMaterial(null, atomAMat, useeffects)
          const atomBMat = new BABYLON.StandardMaterial(`materialFor${key}${kindB.symbol}-${lodIndex}`, this.ctx.scene)
          const atomBColor = coloroverride || kindB.color
          atomBMat.diffuseColor = new BABYLON.Color3(atomBColor[0], atomBColor[1], atomBColor[2])
          this.ctx.cylinderMaterial(null, atomBMat, useeffects)
          const rootMat = new BABYLON.MultiMaterial(`materialFor${key}-${lodIndex}`, this.ctx.scene)
          rootMat.subMaterials.push(atomAMat)
          rootMat.subMaterials.push(atomBMat)
          const verticesCount = capsule.getTotalVertices()
          const indices = capsule.getIndices()
          capsule.subMeshes = []
          const halfindices = ((indices.length / 2) >> 0) - 3 * segments
          capsule.subMeshes.push(new BABYLON.SubMesh(0, 0, verticesCount, 0, halfindices, capsule))
          capsule.subMeshes.push(new BABYLON.SubMesh(1, 0, verticesCount, halfindices, indices.length - halfindices, capsule))
          capsule.material = rootMat
          capsule.isPickable = false
          capsule.setEnabled(false)
          return capsule
        }

        alignCylinderToBinding(atomA, atomB, distance, cylinder) {
          const pointA = new new BABYLON.Vector3(atomA.x, atomA.y, atomA.z)
          const pointB = new BABYLON.Vector3(atomB.x, atomB.y, atomB.z)
          const v1 = pointB.subtract(pointA)
          v1.normalize()
          let v2 = new BABYLON.Vector3(0, 1, 0)
          if (this.vectorEqualsCloseEnough(v1, v2.negate())) {
            let v2 = new BABYLON.Vector3(1, 0, 0)
            let axis = BABYLON.Vector3.Cross(v2, v1)
            axis.normalize()
            let angle = BABYLON.Vector3.Dot(v1, v2)
            angle = Math.acos(angle) + (Math.PI / 2)
            cylinder.setPivotMatrix(BABYLON.Matrix.Translation(0, -distance / 2, 0))
            cylinder.position = pointB
            const quaternion = BABYLON.Quaternion.RotationAxis(axis, angle)
            quaternion.w = -quaternion.w
            cylinder.rotationQuaternion = quaternion
            console.log(cylinder.rotationQuaternion)
          } else {
            let axis = BABYLON.Vector3.Cross(v2, v1)
            axis.normalize()
            let angle = BABYLON.Vector3.Dot(v1, v2)
            angle = Math.acos(angle)
            cylinder.setPivotMatrix(BABYLON.Matrix.Translation(0, -distance / 2, 0))
            cylinder.position = pointB
            cylinder.rotationQuaternion = BABYLON.Quaternion.RotationAxis(axis, angle)
          }
        }

        vectorEqualsCloseEnough(v1, v2, tolerance) {
          if (tolerance === void 0) { tolerance = 0.00002 }
          if (typeof (v2) !== 'object') {
            throw ('v2 is supposed to be an object')
          }
          if (typeof (v1) !== 'object') {
            throw ('v1 is supposed to be an object')
          }
          if (v1.x < v2.x - tolerance || v1.x > v2.x + tolerance) {
            return false
          }
          if (v1.y < v2.y - tolerance || v1.y > v2.y + tolerance) {
            return false
          }
          if (v1.z < v2.z - tolerance || v1.z > v2.z + tolerance) {
            return false
          }
          return true
        }
      }

      return Sticks
    })()
    Renderer.Sticks = Sticks
  })(Renderer = Molvwr.Renderer || (Molvwr.Renderer = {}))
})(Molvwr || (Molvwr = {}))

(Molvwr => {
  let ViewModes
  (ViewModes => {
    const Standard = (() => {
      class Standard {
        constructor(viewoptions) {
          this.options = viewoptions
          if (!viewoptions) {
            console.log('default viewmode config')
            this.options = Molvwr.ViewModes.Standard.defaultConfig()
          }
          if (!this.options.sphere)
            this.options.sphere = {}
          if (!this.options.cylinder)
            this.options.cylinder = {}
        }

        getColor(config, defaultColor) {
          if (config && config.length >= 3) {
            return new BABYLON.Color3(config[0], config[1], config[2])
          } else {
            return new BABYLON.Color3(defaultColor[0], defaultColor[1], defaultColor[2])
          }
        }

        createScene(context) {
          context.scene.clearColor = this.getColor(this.options.clearColor, [0.9, 0.9, 0.95])
          context.scene.fogMode = BABYLON.Scene.FOGMODE_EXP2
          context.scene.fogColor = this.getColor(this.options.fogColor, [0.9, 0.9, 0.85])
          context.scene.fogDensity = this.options.fogDensity || 0.01
          const camera = new BABYLON.ArcRotateCamera('Camera', 1, .8, 28, new BABYLON.Vector3(0, 0, 0), context.scene)
          camera.wheelPrecision = this.options.wheelPrecision || 10
          camera.pinchPrecision = this.options.pinchPrecision || 7
          camera.panningSensibility = this.options.panningSensibility || 70
          camera.setTarget(BABYLON.Vector3.Zero())
          camera.attachControl(context.canvas, false)
          context.camera = camera
          const light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), context.scene)
          light.intensity = 0.7
          light.groundColor = this.getColor(this.options.groundColor, [0.4, 0.4, 0.4])
          light.specular = this.getColor(this.options.specular, [0.5, 0.5, 0.5])
        }

        applyTexture(
          {scene},
          material,
          {diffuseTexture, textureScale, specularTexture, bumpTexture}
        ) {
          if (diffuseTexture) {
            material.diffuseTexture = new BABYLON.Texture(diffuseTexture, scene)
            material.diffuseTexture.uScale = textureScale || 1
            material.diffuseTexture.vScale = textureScale || 1
          }
          if (specularTexture) {
            material.specularTexture = new BABYLON.Texture(specularTexture, scene)
            material.specularTexture.uScale = textureScale || 1
            material.specularTexture.vScale = textureScale || 1
          }
          if (bumpTexture) {
            material.bumpTexture = new BABYLON.Texture(bumpTexture, scene)
            material.bumpTexture.uScale = textureScale || 1
            material.bumpTexture.vScale = textureScale || 1
          }
        }

        sphereMaterial(context, mesh, material, useEffects) {
          material.ambientColor = new BABYLON.Color3(0, 0, 1)
          material.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1)
          material.emissiveColor = new BABYLON.Color3(0.2, 0.2, 0.2)
          if (useEffects) {
            if (this.options.emisivefresnel) {
              material.emissiveFresnelParameters = this.options.emisivefresnel
            }
            if (this.options.sphere) {
              this.applyTexture(context, material, this.options.sphere)
            }
          }
        }

        cylinderMaterial(context, mesh, material, useEffects) {
          material.ambientColor = new BABYLON.Color3(0, 0, 1)
          material.specularColor = new BABYLON.Color3(0.2, 0.2, 0.2)
          material.emissiveColor = new BABYLON.Color3(0.2, 0.2, 0.2)
          if (useEffects) {
            if (this.options.emisivefresnel) {
              material.emissiveFresnelParameters = this.options.emisivefresnel
            }
            if (this.options.cylinder) {
              this.applyTexture(context, material, this.options.cylinder)
            }
          }
        }
      }

      Standard.defaultConfig = () => {
        const res = {
          texture: false,
          emisivefresnel: new BABYLON.FresnelParameters(),
          cylinder: {},
          sphere: {}
        }
        res.emisivefresnel.bias = 0.3
        res.emisivefresnel.power = 1
        res.emisivefresnel.leftColor = BABYLON.Color3.Black()
        res.emisivefresnel.rightColor = BABYLON.Color3.White()
        return res
      }
      return Standard
    })()
    ViewModes.Standard = Standard
  })(ViewModes = Molvwr.ViewModes || (Molvwr.ViewModes = {}))
})(Molvwr || (Molvwr = {}))

(Molvwr => {
  let ViewModes
  (ViewModes => {
    const Experiments = (() => {
      class Experiments {
        createScene(context) {
          context.scene.clearColor = new BABYLON.Color3(0.9, 0.9, 0.95)
          context.scene.fogMode = BABYLON.Scene.FOGMODE_EXP2
          context.scene.fogColor = new BABYLON.Color3(0.9, 0.9, 0.85)
          context.scene.fogDensity = 0.01
          const camera = new BABYLON.ArcRotateCamera('Camera', 1, .8, 28, new BABYLON.Vector3(0, 0, 0), context.scene)
          camera.wheelPrecision = 10
          camera.pinchPrecision = 7
          camera.panningSensibility = 70
          camera.setTarget(BABYLON.Vector3.Zero())
          camera.attachControl(context.canvas, false)
          context.camera = camera
          const light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), context.scene)
          light.intensity = 0.7
          light.groundColor = new BABYLON.Color3(0.4, 0.4, 0.4)
          light.specular = new BABYLON.Color3(0.5, 0.5, 0.5)
        }

        sphereMaterial(context, mesh, material, useEffects) {
        }

        cylinderMaterial(context, mesh, material, useEffects) {
        }

        useAmbientOcclusion({scene, camera}) {
          const ssao = new BABYLON.SSAORenderingPipeline('ssaopipeline', scene, 0.75)
          scene.postProcessRenderPipelineManager.attachCamerasToRenderPipeline('ssaopipeline', camera)
        }

        useHDR({scene, camera}) {
          const hdr = new BABYLON.HDRRenderingPipeline('hdr', scene, 1.0, null, [camera])
          hdr.brightThreshold = 1.2
          hdr.gaussCoeff = 0.3
          hdr.gaussMean = 1
          hdr.gaussStandDev = 0.8
          hdr.exposure = 1
          hdr.minimumLuminance = 0.5
          hdr.maximumLuminance = 1e10
          hdr.luminanceDecreaseRate = 0.5
          hdr.luminanceIncreaserate = 0.5
          scene.postProcessRenderPipelineManager.attachCamerasToRenderPipeline('hdr', [camera])
        }
      }

      return Experiments
    })()
    ViewModes.Experiments = Experiments
  })(ViewModes = Molvwr.ViewModes || (Molvwr.ViewModes = {}))
})(Molvwr || (Molvwr = {}))

export { Molvwr }
