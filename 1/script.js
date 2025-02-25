// Scene, Camera, Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lighting
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(10, 10, 10);
scene.add(light);

// Define Lathe Geometry (Curve that will be Rotated)
const lathePoints = [];
for (let i = 0; i < 10; i++) {
    lathePoints.push(new THREE.Vector2(Math.sin(i * 0.2) * 0.4 + 0.1, i * 0.1 - 0.5)); 
}
const latheGeometry = new THREE.LatheGeometry(lathePoints, 32);

// Primitives Data
const primitives = [
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.CircleGeometry(0.5, 32),
    new THREE.ConeGeometry(0.5, 1, 32),
    new THREE.CylinderGeometry(0.5, 0.5, 1, 32),
    new THREE.DodecahedronGeometry(0.5),
    new THREE.IcosahedronGeometry(0.5),
    new THREE.OctahedronGeometry(0.5),
    new THREE.PlaneGeometry(1, 1),
    new THREE.RingGeometry(0.3, 0.5, 32),
    new THREE.SphereGeometry(0.5, 32, 32),
    new THREE.TetrahedronGeometry(0.5),
    new THREE.TorusGeometry(0.4, 0.15, 16, 100),
    new THREE.TorusKnotGeometry(0.4, 0.15, 100, 16),
    new THREE.CapsuleGeometry(0.5, 1, 10, 20), // Capsule
    latheGeometry // Lathe
];

// Colors
const colors = [
    0xff6347, 0x4682b4, 0x32cd32, 0xff69b4, 0x8a2be2, 0xdaa520, 
    0x7fff00, 0xdc143c, 0x00ced1, 0xff4500, 0x6a5acd, 0x20b2aa, 0xcd5c5c,
    0xffd700, 0xff8c00
];

// Function to Create Primitives
function createPrimitives() {
    primitives.forEach((geometry, index) => {
        const material = new THREE.MeshPhongMaterial({ color: colors[index] });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(index % 4 * 3 - 4, Math.floor(index / 4) * 3, 0); // Grid layout
        scene.add(mesh);
    });
}

// Function to Create Cross Marks
function createCross(x, y, z) {
    const material = new THREE.LineBasicMaterial({ color: 0xffffff });
    const crossSize = 0.1;
    const points = [
        new THREE.Vector3(x - crossSize, y, z),
        new THREE.Vector3(x + crossSize, y, z),
        new THREE.Vector3(x, y, z - crossSize),
        new THREE.Vector3(x, y, z + crossSize)
    ];
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.LineSegments(geometry, material);
    scene.add(line);
}

// Function to Add Grid of Cross Marks
function addCrossMarks() {
    for (let x = -5; x <= 5; x++) {
        for (let z = -5; z <= 5; z++) {
            createCross(x * 1.5, -1, z * 1.5); // Adjusted spacing
        }
    }
}

// Call Functions
createPrimitives();
addCrossMarks();

// Camera Position
camera.position.set(5, 8, 15);
camera.lookAt(0, 2, 0);

// Animation Loop
function animate() {
    requestAnimationFrame(animate);
    
    // Rotate objects slowly for visualization
    scene.children.forEach(obj => {
        if (obj instanceof THREE.Mesh) {
            obj.rotation.y += 0.01;
        }
    });

    renderer.render(scene, camera);
}
animate();