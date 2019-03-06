class Molecule {
	constructor (atoms, ColorForAtoms, scene) {
		this.scene = scene
		this.atoms = atoms
		this.materials = []
		this.geometries = []
		this.k = 0.4
		this.ColorForAtoms = ColorForAtoms
		this.molecule = new THREE.Object3D();
	}

	creatModel () {
		for (let Name in this.ColorForAtoms) {
			let material = new THREE.MeshPhongMaterial({
				color: this.ColorForAtoms[Name][1],
				specular: 0x00b2fc,
				shininess: 12,
				blending: THREE.NormalBlending,
				depthTest: true
			});
			this.materials.push(material);
			let geometry = new THREE.SphereGeometry(this.ColorForAtoms[Name][2] * this.k, 16, 16); // геометрия сферы
			this.geometries.push(geometry);
		}

		for (let i = 0; i < this.atoms.length; i++) {
			let Name = this.atoms[i][1] // номер элемента
			//console.log( 'Name ' + Name )
			let Punct = new THREE.Mesh(this.geometries[this.ColorForAtoms[Name][0]], this.materials[this.ColorForAtoms[Name][0]])
			Punct.position.set(this.atoms[i][2], this.atoms[i][3], this.atoms[i][4])
			this.molecule.add(Punct)
		}

		// связи

		for (let i = 0; i < this.atoms.length; i++) {

			let num = this.atoms[i][0] - 1; // номер атома

			let x1 = parseFloat(this.atoms[num][2]);
			let y1 = parseFloat(this.atoms[num][3]);
			let z1 = parseFloat(this.atoms[num][4]);

			for (let j = 6; j < this.atoms[i].length; j++) {

				let num = this.atoms[i][j] - 1; // номер атома

				let x2 = (parseFloat(this.atoms[num][2]) + x1) / 2;
				let y2 = (parseFloat(this.atoms[num][3]) + y1) / 2;
				let z2 = (parseFloat(this.atoms[num][4]) + z1) / 2;


				let fingerLength = this.cylinderMesh(new THREE.Vector3(x1, y1, z1), new THREE.Vector3(x2, y2, z2));
				fingerLength.material = this.materials[this.ColorForAtoms[this.atoms[i][1]][0]];
				this.molecule.add(fingerLength);
			}
		}
		return this.molecule;
	}

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
}
