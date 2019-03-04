var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 45, window.innerWidth/window.innerHeight, 0.1, 3000 );
var controls = new THREE.OrbitControls( camera );
var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
var ambLight = new THREE.AmbientLight( 0x444444 );
scene.add( ambLight );

var light = new THREE.DirectionalLight( 0xdddddd, 1 );
light.position.set( -100, 100, 100 );
scene.add( light );

var geometry = new THREE.SphereGeometry( 60, 24, 16 );
var material = new THREE.MeshPhongMaterial({ color: 0xaaaaaa, shininess: 40 });
var cube = new THREE.Mesh( geometry, material );

var geometry2 = new THREE.SphereGeometry( 60, 24, 16 );
var material2 = new THREE.MeshPhongMaterial({ color: 0xaaaaaa, shininess: 40 });
var cube2 = new THREE.Mesh( geometry, material );
cube2.position.x = 200



let line = new Array(100/20)

for (let i = 1; i < line.length + 1; i++) {
	line[i - 1] = {}
	line[i - 1].geometri = new THREE.BoxGeometry( 20, 20, 20 )
	line[i - 1].material = new THREE.MeshNormalMaterial();
	line[i - 1].mesh = new THREE.Mesh(line[i - 1].geometri, line[i - 1].material)
	line[i - 1].mesh.position.x = 40 + i * 20
	scene.add(line[i - 1].mesh)
}
scene.add( cube, cube2 );


camera.position.set(200, 300, 1000)

var animate = function () {
  requestAnimationFrame( animate );
  // cube.rotation.x += 0.01;
  // cube.rotation.y += 0.01;
  controls.update();
  renderer.render( scene, camera );
};

animate();