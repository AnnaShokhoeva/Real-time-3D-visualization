import * as THREE from 'three';
  import { OrbitControls } from 'three/addons/controls/OrbitControls.js';


function makeInstance(scene, texture, geometry, color, x) {
    const material = new THREE.MeshBasicMaterial({
        color,
        map: texture,
        side: THREE.DoubleSide  // Render both front and back faces
    });

    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    cube.position.x = x;
    return cube;
  }


function main() 
{
  const canvas = document.querySelector('#c');
  const renderer = new THREE.WebGLRenderer({canvas, antialias: true});

  const fov = 75;
  const aspect = 2;
  const near = 0.1;
  const far = 100;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.z = 5;

  var controls = new OrbitControls( camera, renderer.domElement );

  const scene = new THREE.Scene();
  scene.background = new THREE.Color( 0x333333 );

  {
    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    scene.add(light);
  }

  // NOT A GOOD EXAMPLE OF HOW TO MAKE A CUBE!
  // Only trying to make it clear most vertices are unique
  const vertices = [
    // front
    { pos: [-1, -1,  1], norm: [ 0,  0,  1], uv: [0, 0], }, // 0
    { pos: [ 1, -1,  1], norm: [ 0,  0,  1], uv: [1, 0], }, // 1
    { pos: [-1,  1,  1], norm: [ 0,  0,  1], uv: [0, 1], }, // 2
    { pos: [ 1,  1,  1], norm: [ 0,  0,  1], uv: [1, 1], }, // 3

    // right
    { pos: [ 1, -1,  1], norm: [ 1,  0,  0], uv: [0, 0], }, // 4
    { pos: [ 1, -1, -1], norm: [ 1,  0,  0], uv: [1, 0], }, // 5
    { pos: [ 1,  1,  1], norm: [ 1,  0,  0], uv: [0, 1], }, // 6
    { pos: [ 1,  1, -1], norm: [ 1,  0,  0], uv: [1, 1], }, // 7
    // back
    { pos: [ 1, -1, -1], norm: [ 0,  0, -1], uv: [1, 0], }, // 8
    { pos: [-1, -1, -1], norm: [ 0,  0, -1], uv: [0, 0], }, // 9
    { pos: [ 1,  1, -1], norm: [ 0,  0, -1], uv: [1, 1], }, // 10
    { pos: [-1,  1, -1], norm: [ 0,  0, -1], uv: [0, 1], }, // 11
    // left
    { pos: [-1, -1, -1], norm: [-1,  0,  0], uv: [0, 0], }, // 12
    { pos: [-1, -1,  1], norm: [-1,  0,  0], uv: [1, 0], }, // 13
    { pos: [-1,  1, -1], norm: [-1,  0,  0], uv: [0, 1], }, // 14
    { pos: [-1,  1,  1], norm: [-1,  0,  0], uv: [1, 1], }, // 15
    // top
    { pos: [ 1,  1, -1], norm: [ 0,  1,  0], uv: [0, 0], }, // 16
    { pos: [-1,  1, -1], norm: [ 0,  1,  0], uv: [1, 0], }, // 17
    { pos: [ 1,  1,  1], norm: [ 0,  1,  0], uv: [0, 1], }, // 18
    { pos: [-1,  1,  1], norm: [ 0,  1,  0], uv: [1, 1], }, // 19
    // bottom
    { pos: [ 1, -1,  1], norm: [ 0, -1,  0], uv: [0, 0], }, // 20
    { pos: [-1, -1,  1], norm: [ 0, -1,  0], uv: [1, 0], }, // 21
    { pos: [ 1, -1, -1], norm: [ 0, -1,  0], uv: [0, 1], }, // 22
    { pos: [-1, -1, -1], norm: [ 0, -1,  0], uv: [1, 1], }, // 23

    //Hole in the front face
    { pos: [-0.5, -0.5, 1], norm: [0, 0, 1], uv: [0.25, 0.25] }, // 24
    { pos: [ 0.5, -0.5, 1], norm: [0, 0, 1], uv: [0.75, 0.25] }, // 25
    { pos: [-0.5,  0.5, 1], norm: [0, 0, 1], uv: [0.25, 0.75] }, // 26
    { pos: [ 0.5,  0.5, 1], norm: [0, 0, 1], uv: [0.75, 0.75] }, // 27

    //Hole in the back face
    { pos: [-0.5, -0.5, -1], norm: [0, 0, -1], uv: [0.25, 0.25] }, // 28
    { pos: [ 0.5, -0.5, -1], norm: [0, 0, -1], uv: [0.75, 0.25] }, // 29
    { pos: [-0.5,  0.5, -1], norm: [0, 0, -1], uv: [0.25, 0.75] }, // 30
    { pos: [ 0.5,  0.5, -1], norm: [0, 0, -1], uv: [0.75, 0.75] }, // 31
  ];
  const numVertices = vertices.length;
  const positionNumComponents = 3;
  const normalNumComponents = 3;
  const uvNumComponents = 2;
  const positions = new Float32Array(numVertices * positionNumComponents);
  const normals = new Float32Array(numVertices * normalNumComponents);
  const uvs = new Float32Array(numVertices * uvNumComponents);
  let posNdx = 0;
  let nrmNdx = 0;
  let uvNdx = 0;
  for (const vertex of vertices) {
    positions.set(vertex.pos, posNdx);
    normals.set(vertex.norm, nrmNdx);
    uvs.set(vertex.uv, uvNdx);
    posNdx += positionNumComponents;
    nrmNdx += normalNumComponents;
    uvNdx += uvNumComponents;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
      'position',
      new THREE.BufferAttribute(positions, positionNumComponents));
  geometry.setAttribute(
      'normal',
      new THREE.BufferAttribute(normals, normalNumComponents));
  geometry.setAttribute(
      'uv',
      new THREE.BufferAttribute(uvs, uvNumComponents));

  geometry.setIndex([
    // Four triangles to form the border around the front hole
    0, 1, 24,   1, 25, 24,  // Bottom left
    1, 3, 25,   3, 27, 25,  // Bottom right
    3, 2, 27,   2, 26, 27,  // Top right
    2, 0, 26,   0, 24, 26,  // Top left

    // Four triangles to form the border around the back hole
    8, 9, 28,   9, 30, 28,  // Bottom left
    9, 11, 30,   11, 31, 30,  // Bottom right
    11, 10, 31,   10, 29, 31,  // Top right
    10, 8, 29,   8, 28, 29,  // Top left

    4,  5,  6,   6,  5,  7,  // right
    12, 13, 14,  14, 13, 15,  // left
    16, 17, 18,  18, 17, 19,  // top
    20, 21, 22,  22, 21, 23,  // bottom
  ]);

  const loader = new THREE.TextureLoader();
  const texture = loader.load('grenouille.jpg');

  const cubes = [
    makeInstance(scene, texture, geometry, 0x00FF00,  0),
    makeInstance(scene, texture, geometry, 0xFF0000, -3),
    makeInstance(scene, texture, geometry, 0x0000FF,  3),
  ];


  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  function render(time) {

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }


  requestAnimationFrame(render);
}

main();