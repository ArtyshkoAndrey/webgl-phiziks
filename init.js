var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
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
scene.add( cube );

camera.position.set(100, 0, 1000)

var animate = function () {
  requestAnimationFrame( animate );
  // cube.rotation.x += 0.01;
  // cube.rotation.y += 0.01;
  controls.update();
  renderer.render( scene, camera );
};

animate();