// Scene, Camera, Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Orbit Controls
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(5, 5, 5);
scene.add(pointLight);

// Cone (Left)
const coneGeometry = new THREE.ConeGeometry(0.5, 1, 32);
const coneMaterial = new THREE.MeshLambertMaterial({ color: 0xff0000 });
const cone = new THREE.Mesh(coneGeometry, coneMaterial);
cone.position.set(-1.5, 0.5, 0);
scene.add(cone);

// Cylinder (Right)
const cylinderGeometry = new THREE.CylinderGeometry(0.4, 0.4, 1, 32);
const cylinderMaterial = new THREE.MeshPhongMaterial({ color: 0x0000ff, shininess: 100 });
const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
cylinder.position.set(1.5, 0.5, 0);
scene.add(cylinder);

// Sphere (Center)
const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);
const sphereMaterial = new THREE.MeshPhysicalMaterial({ 
    color: 0x00ff00, 
    roughness: 0.3, 
    metalness: 0.8, 
    clearcoat: 1, 
    clearcoatRoughness: 0.1 
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.set(0, 0.5, 0);
scene.add(sphere);

// Camera Position
camera.position.set(0, 1, 3);

// Animation Loop
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();

// Resize Handling
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});
