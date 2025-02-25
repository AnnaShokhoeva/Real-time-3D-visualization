// 🎬 Scene, Camera, Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 🎮 Orbit Controls
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// 🌎 Ambient Light (always present)
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);

// 🎨 Materials
const redMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 }); // Left wall
const greenMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 }); // Right wall
const whiteMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff }); // Other walls

// 🏠 Cornell Box Walls (GUI Controlled)
const walls = new THREE.Group();
const wallMaterials = [redMaterial, greenMaterial, whiteMaterial, whiteMaterial, whiteMaterial];

const createWall = (width, height, depth, position, material) => {
    const geo = new THREE.BoxGeometry(width, height, depth);
    const wall = new THREE.Mesh(geo, material);
    wall.position.set(...position);
    walls.add(wall);
};

// 📦 Create Cornell Box
createWall(5, 5, 0.1, [0, 2.5, -2.5], whiteMaterial); // Back wall
createWall(0.1, 5, 5, [-2.5, 2.5, 0], redMaterial); // Left wall
createWall(0.1, 5, 5, [2.5, 2.5, 0], greenMaterial); // Right wall
createWall(5, 0.1, 5, [0, 0, 0], whiteMaterial); // Floor
createWall(5, 0.1, 5, [0, 5, 0], whiteMaterial); // Ceiling
scene.add(walls);

// 🔺 Add 3D Objects Inside the Cornell Box
const cone = new THREE.Mesh(
    new THREE.ConeGeometry(0.7, 2, 32),
    new THREE.MeshLambertMaterial({ color: 0x800080 }) // Purple
);
cone.position.set(-1.5, 1, 0);
scene.add(cone);

const cylinder = new THREE.Mesh(
    new THREE.CylinderGeometry(0.5, 0.5, 2, 32),
    new THREE.MeshPhongMaterial({ color: 0x0000ff, shininess: 100 }) // Blue with shininess
);
cylinder.position.set(1.5, 1, 0);
scene.add(cylinder);

const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.6, 32, 32),
    new THREE.MeshPhysicalMaterial({ color: 0xffd700, roughness: 0.2, clearcoat: 1.0 }) // Gold with clearcoat
);
sphere.position.set(0, 0.7, 1);
scene.add(sphere);

// 💡 Light Sources (From Ceiling)
const lights = {
    directional: new THREE.DirectionalLight(0xffffff, 1),
    point: new THREE.PointLight(0xffffff, 1, 10),
    spot: new THREE.SpotLight(0xffffff, 1, 15, Math.PI / 6, 0.5, 1),
    hemisphere: new THREE.HemisphereLight(0xffffff, 0x0000ff, 1)
};

// 📍 Position Lights from the Ceiling
for (let key in lights) {
    lights[key].position.set(0, 5, 0);
}

// 🏷️ Add Only One Light Initially
scene.add(lights.directional);
let currentLight = lights.directional;

// 🎛 GUI Setup
const gui = new lil.GUI();
const lightControls = {
    type: "Directional", // Default light type
    color: "#ffffff",
    intensity: 1,
    positionX: 0,
    positionY: 5,
    positionZ: 0
};

// 🔄 Function to Update Active Light
function updateLight() {
    scene.remove(currentLight); // Remove previous light
    currentLight = lights[lightControls.type.toLowerCase()];
    scene.add(currentLight);
}

// 🎨 Light GUI Controls
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

// 🎨 Wall Color GUI Controls
const wallColors = {
    back: "#ffffff",
    left: "#ff0000",
    right: "#00ff00",
    floor: "#ffffff",
    ceiling: "#ffffff"
};

// 🎛 Material Properties Controls
const materialControls = {
    coneColor: "#800080",    // Purple for Cone
    cylinderColor: "#0000ff", // Blue for Cylinder
    sphereColor: "#ffd700",   // Gold for Sphere
    emissive: "#000000",
    emissiveIntensity: 1,
    opacity: 1,
    transparent: false,
    shininess: 30,       // For MeshPhongMaterial
    roughness: 0.5,      // For MeshPhysicalMaterial
    metalness: 0.5,      // For MeshPhysicalMaterial
    clearcoat: 0.0,      // For MeshPhysicalMaterial
    clearcoatRoughness: 0.0 // For MeshPhysicalMaterial
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

// 🎨 Materials (Updated to Use Shared Controls)
const lambertMaterial = new THREE.MeshLambertMaterial({
    color: materialControls.coneColor,
    emissive: materialControls.emissive,
    emissiveIntensity: materialControls.emissiveIntensity,
    transparent: materialControls.transparent,
    opacity: materialControls.opacity
});

const phongMaterial = new THREE.MeshPhongMaterial({
    color: materialControls.cylinderColor,
    emissive: materialControls.emissive,
    emissiveIntensity: materialControls.emissiveIntensity,
    shininess: materialControls.shininess,
    transparent: materialControls.transparent,
    opacity: materialControls.opacity
});

const physicalMaterial = new THREE.MeshPhysicalMaterial({
    color: materialControls.sphereColor,
    emissive: materialControls.emissive,
    emissiveIntensity: materialControls.emissiveIntensity,
    roughness: materialControls.roughness,
    metalness: materialControls.metalness,
    clearcoat: materialControls.clearcoat,
    clearcoatRoughness: materialControls.clearcoatRoughness,
    transparent: materialControls.transparent,
    opacity: materialControls.opacity
});

cone.material = lambertMaterial;
cylinder.material = phongMaterial;
sphere.material = physicalMaterial;

// 🎛 GUI for Material Properties
const materialFolder = gui.addFolder("Material Properties");

// 🎨 Separate Color Controls for Each Object
materialFolder.addColor(materialControls, "coneColor").name("Cone Color").onChange(value => {
    lambertMaterial.color.set(value);
});

materialFolder.addColor(materialControls, "cylinderColor").name("Cylinder Color").onChange(value => {
    phongMaterial.color.set(value);
});

materialFolder.addColor(materialControls, "sphereColor").name("Sphere Color").onChange(value => {
    physicalMaterial.color.set(value);
});

// Shared Properties
materialFolder.addColor(materialControls, "emissive").name("Emissive Color").onChange(value => {
    lambertMaterial.emissive.set(value);
    phongMaterial.emissive.set(value);
    physicalMaterial.emissive.set(value);
});

materialFolder.add(materialControls, "emissiveIntensity", 0, 5, 0.1).name("Emissive Intensity").onChange(value => {
    lambertMaterial.emissiveIntensity = value;
    phongMaterial.emissiveIntensity = value;
    physicalMaterial.emissiveIntensity = value;
});

materialFolder.add(materialControls, "transparent").name("Transparent").onChange(value => {
    lambertMaterial.transparent = value;
    phongMaterial.transparent = value;
    physicalMaterial.transparent = value;
});

materialFolder.add(materialControls, "opacity", 0, 1, 0.01).name("Opacity").onChange(value => {
    lambertMaterial.opacity = value;
    phongMaterial.opacity = value;
    physicalMaterial.opacity = value;
});

// MeshPhongMaterial-Specific (For Cylinder)
materialFolder.add(materialControls, "shininess", 0, 100, 1).name("Shininess (Phong)").onChange(value => {
    phongMaterial.shininess = value;
});

// MeshPhysicalMaterial-Specific (For Sphere)
materialFolder.add(materialControls, "roughness", 0, 1, 0.01).name("Roughness (Physical)").onChange(value => {
    physicalMaterial.roughness = value;
});

materialFolder.add(materialControls, "metalness", 0, 1, 0.01).name("Metalness (Physical)").onChange(value => {
    physicalMaterial.metalness = value;
});

materialFolder.add(materialControls, "clearcoat", 0, 1, 0.01).name("Clearcoat (Physical)").onChange(value => {
    physicalMaterial.clearcoat = value;
});

materialFolder.add(materialControls, "clearcoatRoughness", 0, 1, 0.01).name("Clearcoat Roughness").onChange(value => {
    physicalMaterial.clearcoatRoughness = value;
});

// 🎥 Camera Position
camera.position.set(0, 2, 6);

// 🎞 Animation Loop
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();

// 📏 Window Resize Handling
window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});



