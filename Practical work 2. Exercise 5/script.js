// Scene, Camera, Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Orbit Controls
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

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

// Rectangular Area Lights for Each Wall
const rectLightBack = new THREE.RectAreaLight(0xffffff, 2, 5, 5); // Back wall light
rectLightBack.position.set(0, 2.5, -2.49);
rectLightBack.lookAt(0, 2.5, 0);

const rectLightLeft = new THREE.RectAreaLight(0xff0000, 2, 5, 5); // Left wall light
rectLightLeft.position.set(-2.49, 2.5, 0);
rectLightLeft.lookAt(0, 2.5, 0);

const rectLightRight = new THREE.RectAreaLight(0x00ff00, 2, 5, 5); // Right wall light
rectLightRight.position.set(2.49, 2.5, 0);
rectLightRight.lookAt(0, 2.5, 0);

const rectLightFloor = new THREE.RectAreaLight(0xffffff, 1.5, 5, 5); // Floor light
rectLightFloor.position.set(0, 0.01, 0);
rectLightFloor.rotation.x = -Math.PI / 2;

const rectLightCeiling = new THREE.RectAreaLight(0xffffff, 1.5, 5, 5); // Ceiling light
rectLightCeiling.position.set(0, 4.99, 0);
rectLightCeiling.rotation.x = Math.PI / 2;

// Add Lights to Scene
scene.add(rectLightBack, rectLightLeft, rectLightRight, rectLightFloor, rectLightCeiling);

// Table
const tabletop = new THREE.Mesh(
    new THREE.BoxGeometry(3, 0.2, 2), // Width, thickness, depth
    new THREE.MeshStandardMaterial({ color: 0x8B4513 }) // Brown color
);
tabletop.position.set(0, 1, 0); // Positioned above the floor
scene.add(tabletop);

// Table Legs
const legMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 }); // Same material as tabletop
const legGeometry = new THREE.BoxGeometry(0.2, 1, 0.2); // Legs

const createLeg = (x, z) => {
    const leg = new THREE.Mesh(legGeometry, legMaterial);
    leg.position.set(x, 0.5, z);
    scene.add(leg);
};

// Adding 4 legs at the corners
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

// Position Lights from the Ceiling
for (let key in lights) {
    lights[key].position.set(0, 5, 0);
}


scene.add(lights.directional);
let currentLight = lights.directional;

// GUI Setup
const gui = new lil.GUI();
const lightControls = {
    type: "Directional", // Default light
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

// Material Properties Controls (Including Textures)
const materialControls = {
    // Colors
    coneColor: "#800080",  
    cylinderColor: "#0000ff",  
    sphereColor: "#ffd700",  
    
    // Texture Maps
    coneMap: 'https://threejs.org/examples/textures/crate.gif', // Texture for Cone
    cylinderMap: 'https://threejs.org/examples/textures/crate.gif', // Texture for Cylinder
    sphereMap: 'https://threejs.org/examples/textures/crate.gif', // Texture for Sphere

    // Texture Toggles
    useConeMap: true,  // Toggle to apply/remove the cone texture
    useCylinderMap: true,  // Toggle to apply/remove the cylinder texture
    useSphereMap: true,  // Toggle to apply/remove the sphere texture

    // Material Properties
    emissive: "#000000",
    emissiveIntensity: 1,
    opacity: 1,
    transparent: false,
    shininess: 30,       
    roughness: 0.5,      
    metalness: 0.5,      
    clearcoat: 0.0,      
    clearcoatRoughness: 0.0 
};


//Texture maps
const textureLoader = new THREE.TextureLoader();

const coneTexture = textureLoader.load('https://threejs.org/examples/textures/crate.gif');  // for cone
const cylinderTexture = textureLoader.load('https://threejs.org/examples/textures/crate.gif');  // for cylinder
const sphereTexture = textureLoader.load('https://threejs.org/examples/textures/crate.gif');  // for sphere

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

// Materials (With Textures)
const lambertMaterial = new THREE.MeshLambertMaterial({
    color: materialControls.coneColor,
    emissive: materialControls.emissive,
    emissiveIntensity: materialControls.emissiveIntensity,
    map: coneTexture,
    transparent: materialControls.transparent,
    opacity: materialControls.opacity
});

const phongMaterial = new THREE.MeshPhongMaterial({
    color: materialControls.cylinderColor,
    emissive: materialControls.emissive,
    emissiveIntensity: materialControls.emissiveIntensity,
    shininess: materialControls.shininess,
    map: cylinderTexture,
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
    map: sphereTexture,
    transparent: materialControls.transparent,
    opacity: materialControls.opacity
});

cone.material = lambertMaterial;
cylinder.material = phongMaterial;
sphere.material = physicalMaterial;

// GUI for Material Properties (Including Textures)
const materialFolder = gui.addFolder("Material Properties");

// Separate Color Controls for Each Object
materialFolder.addColor(materialControls, "coneColor").name("Cone Color").onChange(value => {
    lambertMaterial.color.set(value);
});

materialFolder.addColor(materialControls, "cylinderColor").name("Cylinder Color").onChange(value => {
    phongMaterial.color.set(value);
});

materialFolder.addColor(materialControls, "sphereColor").name("Sphere Color").onChange(value => {
    physicalMaterial.color.set(value);
});

// Texture Controls (Allowing Texture Loading)
materialFolder.add(materialControls, "useConeMap").name("Use Cone Texture").onChange(value => {
    lambertMaterial.map = value ? coneTexture : null;
    lambertMaterial.needsUpdate = true;
});

materialFolder.add(materialControls, "useCylinderMap").name("Use Cylinder Texture").onChange(value => {
    phongMaterial.map = value ? cylinderTexture : null;
    phongMaterial.needsUpdate = true;
});

materialFolder.add(materialControls, "useSphereMap").name("Use Sphere Texture").onChange(value => {
    physicalMaterial.map = value ? sphereTexture : null;
    physicalMaterial.needsUpdate = true;
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

// Material-Specific Controls (Shininess, Roughness, Metalness, Clearcoat)
materialFolder.add(materialControls, "shininess", 0, 100, 1).name("Shininess (Phong)").onChange(value => {
    phongMaterial.shininess = value;
});

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


// GUI Controls for RectAreaLights
const rectLightControls = {
    backColor: "#ffffff",
    backIntensity: 2,
    leftColor: "#ff0000",
    leftIntensity: 2,
    rightColor: "#00ff00",
    rightIntensity: 2,
    floorColor: "#ffffff",
    floorIntensity: 1.5,
    ceilingColor: "#ffffff",
    ceilingIntensity: 1.5
};

const updateRectLights = () => {
    rectLightBack.color.set(rectLightControls.backColor);
    rectLightBack.intensity = rectLightControls.backIntensity;

    rectLightLeft.color.set(rectLightControls.leftColor);
    rectLightLeft.intensity = rectLightControls.leftIntensity;

    rectLightRight.color.set(rectLightControls.rightColor);
    rectLightRight.intensity = rectLightControls.rightIntensity;

    rectLightFloor.color.set(rectLightControls.floorColor);
    rectLightFloor.intensity = rectLightControls.floorIntensity;

    rectLightCeiling.color.set(rectLightControls.ceilingColor);
    rectLightCeiling.intensity = rectLightControls.ceilingIntensity;
};

// Add Controls
const lightFolder = gui.addFolder("Wall Lights");

lightFolder.addColor(rectLightControls, "backColor").name("Back Wall Light").onChange(updateRectLights);
lightFolder.add(rectLightControls, "backIntensity", 0, 5, 0.1).name("Back Intensity").onChange(updateRectLights);

lightFolder.addColor(rectLightControls, "leftColor").name("Left Wall Light").onChange(updateRectLights);
lightFolder.add(rectLightControls, "leftIntensity", 0, 5, 0.1).name("Left Intensity").onChange(updateRectLights);

lightFolder.addColor(rectLightControls, "rightColor").name("Right Wall Light").onChange(updateRectLights);
lightFolder.add(rectLightControls, "rightIntensity", 0, 5, 0.1).name("Right Intensity").onChange(updateRectLights);

lightFolder.addColor(rectLightControls, "floorColor").name("Floor Light").onChange(updateRectLights);
lightFolder.add(rectLightControls, "floorIntensity", 0, 5, 0.1).name("Floor Intensity").onChange(updateRectLights);

lightFolder.addColor(rectLightControls, "ceilingColor").name("Ceiling Light").onChange(updateRectLights);
lightFolder.add(rectLightControls, "ceilingIntensity", 0, 5, 0.1).name("Ceiling Intensity").onChange(updateRectLights);


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




