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

// Cornell Box Walls
const wallMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
const walls = new THREE.Group();

const createWall = (width, height, depth, position) => {
    const geo = new THREE.BoxGeometry(width, height, depth);
    const wall = new THREE.Mesh(geo, wallMaterial.clone());
    wall.position.set(...position);
    walls.add(wall);
};

// Cornell Box structure
createWall(5, 5, 0.1, [0, 2.5, -2.5]); // Back wall
createWall(0.1, 5, 5, [-2.5, 2.5, 0]); // Left wall
createWall(0.1, 5, 5, [2.5, 2.5, 0]); // Right wall
createWall(5, 0.1, 5, [0, 0, 0]); // Floor
createWall(5, 0.1, 5, [0, 5, 0]); // Ceiling
scene.add(walls);

// Color change of left wall
const leftWall = walls.children[1];

// GUI Setup (using lil-gui)
const gui = new lil.GUI();
const guiControls = {
    color: "#ffffff", // Initial color
};

// Color controller
gui.addColor(guiControls, "color").name("Left Wall Color").onChange((value) => {
    leftWall.material.color.set(value);
});

// Position of controller
gui.domElement.style.position = "absolute";
gui.domElement.style.top = "20px";
gui.domElement.style.right = "20px";
gui.domElement.style.zIndex = "100"; // Ensure it's above other elements
document.body.appendChild(gui.domElement);

// Camera Position
camera.position.set(0, 2, 6);

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
