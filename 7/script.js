// Scene, Camera, Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Orbit Controls
const controls = new THREE.OrbitControls(camera, renderer.domElement);

// Ambient Light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);

// Materials
const redMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 }); // Left wall
const greenMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 }); // Right wall
const whiteMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff }); // Other walls

// Cornell Box Walls
const walls = new THREE.Group();
const wallMaterials = [redMaterial, greenMaterial, whiteMaterial, whiteMaterial, whiteMaterial];

const createWall = (width, height, depth, position, material) => {
    const geo = new THREE.BoxGeometry(width, height, depth);
    const wall = new THREE.Mesh(geo, material);
    wall.position.set(...position);
    walls.add(wall);
};

// Create Cornell Box
createWall(5, 5, 0.1, [0, 2.5, -2.5], whiteMaterial); // Back wall
createWall(0.1, 5, 5, [-2.5, 2.5, 0], redMaterial); // Left wall
createWall(0.1, 5, 5, [2.5, 2.5, 0], greenMaterial); // Right wall
createWall(5, 0.1, 5, [0, 0, 0], whiteMaterial); // Floor
createWall(5, 0.1, 5, [0, 5, 0], whiteMaterial); // Ceiling
scene.add(walls);

// Table (Top Surface)
const tabletop = new THREE.Mesh(
    new THREE.BoxGeometry(3, 0.2, 2), // Width, thickness, depth
    new THREE.MeshStandardMaterial({ color: 0x8B4513 }) // Brown color
);
tabletop.position.set(0, 1, 0); // Position
scene.add(tabletop);

// Table Legs
const legMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 }); // Same material as tabletop
const legGeometry = new THREE.BoxGeometry(0.2, 1, 0.2); // Legs

const createLeg = (x, z) => {
    const leg = new THREE.Mesh(legGeometry, legMaterial);
    leg.position.set(x, 0.5, z);
    scene.add(leg);
};

// Adding legs at the corners of table surface
createLeg(-1.3, -0.8);
createLeg(1.3, -0.8);
createLeg(-1.3, 0.8);
createLeg(1.3, 0.8);

// Objects on the Table
const cone = new THREE.Mesh(
    new THREE.ConeGeometry(0.3, 0.8, 32), // Cone
    new THREE.MeshLambertMaterial({ color: 0x800080 }) // Purple
);
cone.position.set(-0.6, 1.5, 0);
scene.add(cone);

const cylinder = new THREE.Mesh(
    new THREE.CylinderGeometry(0.25, 0.25, 0.8, 32), // Cylinder
    new THREE.MeshPhongMaterial({ color: 0x0000ff, shininess: 100 }) // Blue
);
cylinder.position.set(0.6, 1.5, 0);
scene.add(cylinder);

const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.3, 32, 32), // Sphere
    new THREE.MeshPhysicalMaterial({ color: 0xffd700, roughness: 0.2, clearcoat: 1.0 }) // Gold
);
sphere.position.set(0, 1.4, 0.5);
scene.add(sphere);

// Light Sources
const lights = {
    directional: new THREE.DirectionalLight(0xffffff, 1),
    point: new THREE.PointLight(0xffffff, 1, 10),
    spot: new THREE.SpotLight(0xffffff, 1, 15, Math.PI / 6, 0.5, 1),
    hemisphere: new THREE.HemisphereLight(0xffffff, 0x0000ff, 1)
};

// Position lights from the ceiling
for (let key in lights) {
    lights[key].position.set(0, 5, 0);
}


scene.add(lights.directional);
let currentLight = lights.directional;

// GUI Setup
const gui = new lil.GUI();
const lightControls = {
    type: "Directional", // Default light type
    color: "#ffffff",
    intensity: 1,
    positionX: 0,
    positionY: 5,
    positionZ: 0
};

// Function to Update Active Light
function updateLight() {
    scene.remove(currentLight); // Remove previous light
    currentLight = lights[lightControls.type.toLowerCase()];
    scene.add(currentLight);
}

// Light GUI Controls
gui.add(lightControls, "type", ["Directional", "Point", "Spot", "Hemisphere"])
    .name("Light Type")
    .onChange(updateLight);

gui.addColor(lightControls, "color")
    .name("Light Color")
    .onChange((value) => currentLight.color.set(value));

gui.add(lightControls, "intensity", 0, 5, 0.1)
    .name("Intensity")
    .onChange((value) => currentLight.intensity = value);

gui.add(lightControls, "positionX", -5, 5, 0.1)
    .name("Pos X")
    .onChange((value) => currentLight.position.x = value);

gui.add(lightControls, "positionY", 3, 10, 0.1)
    .name("Pos Y")
    .onChange((value) => currentLight.position.y = value);

gui.add(lightControls, "positionZ", -5, 5, 0.1)
    .name("Pos Z")
    .onChange((value) => currentLight.position.z = value);

// Wall Color GUI Controls
const wallColors = {
    back: "#ffffff",
    left: "#ff0000",
    right: "#00ff00",
    floor: "#ffffff",
    ceiling: "#ffffff"
};

const updateWallColors = () => {
    walls.children[0].material.color.set(wallColors.back);
    walls.children[1].material.color.set(wallColors.left);
    walls.children[2].material.color.set(wallColors.right);
    walls.children[3].material.color.set(wallColors.floor);
    walls.children[4].material.color.set(wallColors.ceiling);
};

const wallFolder = gui.addFolder("Wall Colors"); 
wallFolder.addColor(wallColors, "back").name("Back Wall").onChange(updateWallColors);
wallFolder.addColor(wallColors, "left").name("Left Wall").onChange(updateWallColors);
wallFolder.addColor(wallColors, "right").name("Right Wall").onChange(updateWallColors);
wallFolder.addColor(wallColors, "floor").name("Floor").onChange(updateWallColors);
wallFolder.addColor(wallColors, "ceiling").name("Ceiling").onChange(updateWallColors);

// Camera Position
camera.position.set(0, 2, 6);

// Animation Loop
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();

// Window Resize Handling
window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});


