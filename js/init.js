// Создание сцены
let camera, scene, renderer, control, light
renderer = new THREE.WebGLRenderer({antialias: true})
renderer.setClearColor(0xa4a4a4)
// renderer.setClearColor(0x000000)
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)
camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500)
camera.position.set(0, 10, 10)
control = new THREE.OrbitControls(camera, renderer.domElement)
control.rotateSpeed = 1
control.noZoom = false
control.zoomSpeed = 1.2
control.staticMoving = true
control.autoRotate = true
scene = new THREE.Scene()
light = new THREE.DirectionalLight(0xffffff, 1)
light.position.set(0, 0, 100)
scene.add(light)

// Линии осей
var axes = new THREE.AxisHelper(1000)
scene.add(axes)

// Создание молекулы по парсеру
let molecule = new Molecule(scene)
molecule.finderAtoms('https://raw.githubusercontent.com/alexan0308/threejs/master/examples/XYZ/book.xyz')
molecule.creatModel()
scene.add(molecule.Object)
let bbox = new THREE.Box3().setFromObject(molecule.Object);
// camera.lookAt((bbox.max.z - bbox.min.z)/2, (bbox.max.x - bbox.min.x)/2,(bbox.max.y - bbox.min.y)/2)
camera.position.set(bbox.max.z - bbox.min.z, bbox.max.x - bbox.min.x, bbox.max.y - bbox.min.y)
control.target = new THREE.Vector3((bbox.max.z - bbox.min.z)/2, (bbox.max.x - bbox.min.x)/2,(bbox.max.y - bbox.min.y)/2)

// Ререндер 3d для обновления на экране
function render() {
	light.position.copy(camera.position)
	control.update()
	renderer.render(scene, camera)
  if (molecule.renderer) {
    molecule.creatModel()
    var selectedObject = scene.getObjectByName(molecule.Object.name);
    scene.remove( selectedObject );
    scene.add(molecule.Object)
    molecule.renderer = false
  }
	requestAnimationFrame(render)
}

// Онлайн изменение размера 3d канваса и соотношения сторон
window.addEventListener( 'resize', onWindowResize, false );
function onWindowResize(){
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}

render();
