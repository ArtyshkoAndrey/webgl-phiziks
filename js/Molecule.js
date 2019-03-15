class Molecule {
	constructor (scene) {
		this.scene = scene
		this.atoms = []
		this.materials = []
		this.geometries = []
		this.k = 0.4
		this.ColorAtoms = []
    this.renderer = false
    this.tempAtom = {}
	}
	// Создание модели молекулы в 3d, переделать по отдельным атомам
	creatModel () {
    this.materials = []
    this.geometries = []
		for (let Name in this.ColorAtoms) {
			let material = new THREE.MeshPhongMaterial({
				color: this.ColorAtoms[Name][1],
				specular: 0x00b2fc,
				shininess: 12,
				blending: THREE.NormalBlending,
				depthTest: true
			});
			this.materials.push(material);
			let geometry = new THREE.SphereGeometry(this.ColorAtoms[Name][2] * this.k, 10, 10); // геометрия сферы
			this.geometries.push(geometry);
		}

		for (let i = 0; i < this.atoms.length; i++) {
			let Name = this.atoms[i].name // номер элемента
      let mat = new THREE.MeshPhongMaterial({
        color: this.ColorAtoms[Name][1],
        specular: 0x00b2fc,
        shininess: 12,
        blending: THREE.NormalBlending,
        depthTest: true
      })
			this.atoms[i].Object3D = new THREE.Mesh(this.geometries[this.ColorAtoms[Name][0]], mat)
  		this.atoms[i].Object3D.name = this.atoms[i].name
			this.atoms[i].Object3D.position.set(this.atoms[i].x, this.atoms[i].y, this.atoms[i].z)
      this.scene.add(this.atoms[i].Object3D)
		}

		// связи

		for (let i = 0; i < this.atoms.length; i++) {

			let num = this.atoms[i].number; // номер атома
			let tempAtom = null
			let self = this
			this.atoms.forEach( function (d, index) {
				if (Number(num) === Number(d.number)) {
					tempAtom = self.atoms[index]
				}
			})
			let x1 = parseFloat(tempAtom.x);
			let y1 = parseFloat(tempAtom.y);
			let z1 = parseFloat(tempAtom.z);

			if (this.atoms[i].connections.length > 0) {
				for (let j = 0; j < this.atoms[i].connections.length; j++) {

					let num = this.atoms[i].connections[j]; // номер атома
					tempAtom = null
					this.atoms.forEach( function (d, index) {
						if (Number(num) === Number(d.number)) {
							tempAtom = self.atoms[index]
						}
					})
					let x2 = (parseFloat(tempAtom.x) + x1) / 2;
					let y2 = (parseFloat(tempAtom.y) + y1) / 2;
					let z2 = (parseFloat(tempAtom.z) + z1) / 2;


					let fingerLength = this.cylinderMesh(new THREE.Vector3(0, 0, 0), new THREE.Vector3(x2 - x1, y2 - y1, z2 - z1));
					let mat = new THREE.MeshPhongMaterial({
            color: this.ColorAtoms[this.atoms[i].name][1],
            specular: 0x00b2fc,
            shininess: 12,
            blending: THREE.NormalBlending,
            depthTest: true
          })
          console.log(mat)
          fingerLength.material = mat;
          this.atoms[i].Object3D.add(fingerLength)
          // this.scene.add(fingerLength)
				}
			}
		}
	}

	// Рисование соединения цилиндрами

	cylinderMesh(pointX, pointY) {
		// edge from X to Y
		var direction = new THREE.Vector3().subVectors(pointY, pointX);

		var arrow = new THREE.ArrowHelper(direction.clone().normalize(), pointX, direction.length());

		// cylinder: radiusAtTop, radiusAtBottom, height, segmentsAroundRadius, segmentsAlongHeight
		var edgeGeometry = new THREE.CylinderGeometry(0.1, 0.1, direction.length(), 16, 4);

		var edgeMesh = new THREE.Mesh(edgeGeometry, new THREE.MeshBasicMaterial({
			color: 0x0000ff
		}));
		edgeMesh.position.copy(new THREE.Vector3().addVectors(pointX, direction.multiplyScalar(0.5)));

		edgeMesh.setRotationFromEuler(arrow.rotation);
		return edgeMesh;
	}

	// Создание Атомов по парсеру файла

	finderAtoms (url) {
		let sssr = this.fileGetContents( url )
		let info = sssr.split(/\n/)
		if (info[info.length - 1].length < 1) {
			info.pop();
		}

		// переводим info в массив вида [ [ 1, C, -0.231579, -0.350841, -0.037475, 1, 2, 4, 5, 6 ], [2, C, 0.229441...] ... ]

		for (let i = 1; i < info.length; i++) {
			// this.atoms[i - 1] = info[i].match(/\S+/g); s
			this.atoms[i - 1] = new Atom()
			this.atoms[i - 1].x = info[i].match(/\S+/g)[2]
			this.atoms[i - 1].y = info[i].match(/\S+/g)[3]
			this.atoms[i - 1].z = info[i].match(/\S+/g)[4]
			this.atoms[i - 1].name = info[i].match(/\S+/g)[1]
			this.atoms[i - 1].number = Number(info[i].match(/\S+/g)[0])
			if (info[i].match(/\S+/g).length > 4) {
				for (let j = 6; j < info[i].match(/\S+/g).length; j++) {
					this.atoms[i - 1].connections.push(info[i].match(/\S+/g)[j])
				}
			}
		}

		let allAtomSymbol = ''
		let number = 0
		for (let i = 0; i < this.atoms.length; i++) {
			let AtomSymbol = this.atoms[i].name
			let pos = allAtomSymbol.indexOf('#' + AtomSymbol + '#')
			if (pos < 0) {
				allAtomSymbol = allAtomSymbol + '#' + AtomSymbol + '#'
				if ( this.ColorAtoms[AtomSymbol] === undefined ) this.ColorAtoms[AtomSymbol] = [ number, Math.random() * 0xFFFFFF, 0.7 ]
				number++
			}
		}
	}

	// Парсер файла. Переделать под наш

	fileGetContents (url) {
		let req = null
		try {
			req = new ActiveXObject("Msxml2.XMLHTTP")
		} catch (e) {
			try {
				req = new ActiveXObject("Microsoft.XMLHTTP")
			} catch (e) {
				try {
					req = new XMLHttpRequest()
				} catch (e) {}
			}
		}
		if (req == null) throw new Error('XMLHttpRequest not supported')
		req.open("GET", url, false)
		req.send(null)
		return req.responseText
	}

  // Переписать функцию удаления атома

  deleteAtom (number) {
    let indexAtom = null
    this.atoms.forEach( function (d, index) {
      if (Number(d.number) === Number(number)) {
        indexAtom = index
      }
    })
    if (indexAtom) {
      this.atoms.splice(indexAtom, 1)
      let self = this
      this.atoms.forEach( function (atom, index) {
        console.log(index)
        atom.connections.forEach( function (con, indexCon) {
          if (Number(con) === number) {
            self.atoms[index].connections.splice(indexCon, 1)
            console.log(self.atoms)
          }
        })
      })
      console.log(self.atoms)
      this.renderer = true
    } else {
      alert('Данного атома не существует')
    }
  }
}
