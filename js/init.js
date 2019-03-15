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
control.autoRotate = false
scene = new THREE.Scene()
light = new THREE.DirectionalLight(0xffffff, 1)
light.position.set(10, 10, 10)
scene.add(light)

// Линии осей
var axes = new THREE.AxisHelper(1000)
scene.add(axes)

// Создание молекулы по парсеру
let molecule = new Molecule(scene)
molecule.finderAtoms('https://raw.githubusercontent.com/alexan0308/threejs/master/examples/XYZ/book.xyz')
molecule.creatModel()
// scene.add(molecule.Object)
// let bbox = new THREE.Box3().setFromObject(molecule.Object)
camera.position.set(10, 10, 10)
// control.target = new THREE.Vector3((bbox.max.z - bbox.min.z)/2, (bbox.max.x - bbox.min.x)/2,(bbox.max.y - bbox.min.y)/2)
// control.target0 = new THREE.Vector3((bbox.max.z - bbox.min.z)/2, (bbox.max.x - bbox.min.x)/2,(bbox.max.y - bbox.min.y)/2)

// Ререндер 3d для обновления на экране
let pos = camera.clone()

function render() {
	control.update()
  if (camera.position.x !== pos.position.x) {
    renderer.render(scene, camera)
  }
  if (molecule.renderer) {
    molecule.creatModel()
    var selectedObject = scene.getObjectByName(molecule.Object.name);
    scene.remove( selectedObject );
    scene.add(molecule.Object)
    molecule.renderer = false
    renderer.render(scene, camera)
  }
  pos = camera.clone()
  light.position.copy(camera.position)
	requestAnimationFrame(render)
}

// Онлайн изменение размера 3d канваса и соотношения сторон
window.addEventListener( 'resize', onWindowResize, false );
function onWindowResize(){
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.render(scene, camera)
}

control.update()
renderer.render(scene, camera)

var vector = new THREE.Vector3();
var raycaster = new THREE.Raycaster();

window.addEventListener( 'mousedown', onMouseMove, false );

function onMouseMove( event ) {
  vector.set( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1, 0.05 ); // z = 0.5 important!
  vector.unproject( camera );

  raycaster.set( camera.position, vector.sub( camera.position ).normalize() );
  var intersects = raycaster.intersectObjects( scene.children, true );
  if (intersects.length > 0) {
    if (intersects[0].object.type !== 'LineSegments') {
      scene.children.forEach(function (atom) {
        if (atom instanceof THREE.Mesh)
          if (atom.geometry instanceof THREE.SphereGeometry) {
            atom.material.color.set(molecule.ColorAtoms[atom.name][1])
            atom.children.forEach(function (cycle) {
              cycle.material.color.set(molecule.ColorAtoms[atom.name][1])
            })
          }
      })
      console.log(intersects[0].object)
      if (intersects[0].object instanceof THREE.Mesh)
        if (intersects[0].object.geometry instanceof THREE.SphereGeometry) {
          intersects[ 0 ].object.material.color.set( 0xff0000 )
          intersects[ 0 ].object.children.forEach(function (cycle) {
            cycle.material.color.set(0xff0000)
          })
        }

    }
    console.log(intersects[0].object)
  }
  renderer.render(scene, camera)
}

render();