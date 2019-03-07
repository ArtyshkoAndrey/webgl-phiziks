class Molecule {
	constructor (scene) {
		this.scene = scene
		this.atoms = []
		this.materials = []
		this.geometries = []
		this.k = 0.4
		this.ColorAtoms = []
		this.Object = new THREE.Object3D();
	}
	// Создание модели молекулы в 3d, переделать по отдельным атомам
	creatModel () {
		for (let Name in this.ColorAtoms) {
			let material = new THREE.MeshPhongMaterial({
				color: this.ColorAtoms[Name][1],
				specular: 0x00b2fc,
				shininess: 12,
				blending: THREE.NormalBlending,
				depthTest: true
			});
			this.materials.push(material);
			let geometry = new THREE.SphereGeometry(this.ColorAtoms[Name][2] * this.k, 16, 16); // геометрия сферы
			this.geometries.push(geometry);
		}

		for (let i = 0; i < this.atoms.length; i++) {
			let Name = this.atoms[i].name // номер элемента
			let Punct = new THREE.Mesh(this.geometries[this.ColorAtoms[Name][0]], this.materials[this.ColorAtoms[Name][0]])
			Punct.position.set(this.atoms[i].x, this.atoms[i].y, this.atoms[i].z)
			this.Object.add(Punct)
		}

		// связи

		for (let i = 0; i < this.atoms.length; i++) {

			let num = this.atoms[i].number - 1; // номер атома

			let x1 = parseFloat(this.atoms[num].x);
			let y1 = parseFloat(this.atoms[num].y);
			let z1 = parseFloat(this.atoms[num].z);

			for (let j = 0; j < this.atoms[i].connections.length; j++) {

				let num = this.atoms[i].connections[j] - 1; // номер атома

				let x2 = (parseFloat(this.atoms[num].x) + x1) / 2;
				let y2 = (parseFloat(this.atoms[num].y) + y1) / 2;
				let z2 = (parseFloat(this.atoms[num].z) + z1) / 2;


				let fingerLength = this.cylinderMesh(new THREE.Vector3(x1, y1, z1), new THREE.Vector3(x2, y2, z2));
				fingerLength.material = this.materials[this.ColorAtoms[this.atoms[i].name][0]];
				this.Object.add(fingerLength);
			}
		}
		return this.Object;
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
			console.log(this.atoms)
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
		console.log(this.ColorAtoms)
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
}
