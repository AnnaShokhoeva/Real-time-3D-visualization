// Create Two Canvas
const container = document.createElement("div");
document.body.appendChild(container);
container.style.display = "flex";

// First Canvas (Perspective)
const canvas1 = document.createElement("canvas");
container.appendChild(canvas1);
const renderer1 = new THREE.WebGLRenderer({ canvas: canvas1, antialias: true });
renderer1.setSize(window.innerWidth / 2, window.innerHeight);

// Second Canvas (Orthographic)
const canvas2 = document.createElement("canvas");
container.appendChild(canvas2);
const renderer2 = new THREE.WebGLRenderer({ canvas: canvas2, antialias: true });
renderer2.setSize(window.innerWidth / 2, window.innerHeight);

// Create Scene
const scene = new THREE.Scene();

// Perspective Camera
const perspectiveCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
perspectiveCamera.position.set(5, 8, 15);
perspectiveCamera.lookAt(0, 2, 0);

// Orthographic Camera
const aspect = window.innerWidth / window.innerHeight;
const orthoCamera = new THREE.OrthographicCamera(-10 * aspect, 10 * aspect, 10, -10, 0.1, 1000);
orthoCamera.position.set(5, 8, 15);
orthoCamera.lookAt(0, 2, 0);

// Add OrbitControls
const controls1 = new THREE.OrbitControls(perspectiveCamera, renderer1.domElement);
const controls2 = new THREE.OrbitControls(orthoCamera, renderer2.domElement);

// Add FirstPersonControls
const firstPersonControls = new THREE.FirstPersonControls(perspectiveCamera, renderer1.domElement);
firstPersonControls.lookSpeed = 0.1;
firstPersonControls.movementSpeed = 5;
firstPersonControls.noFly = false;
firstPersonControls.lookVertical = true;

// Add TrackballControls
const trackballControls = new THREE.TrackballControls(perspectiveCamera, renderer1.domElement);
trackballControls.rotateSpeed = 5;
trackballControls.zoomSpeed = 2;
trackballControls.panSpeed = 2;
trackballControls.dynamicDampingFactor = 0.3;

// Add FlyControls
const flyControls = new THREE.FlyControls(perspectiveCamera, renderer1.domElement);
flyControls.movementSpeed = 10;
flyControls.rollSpeed = Math.PI / 24;
flyControls.autoForward = false;
flyControls.dragToLook = true;

// Lighting
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(10, 10, 10);
scene.add(light);

// Define Lathe Geometry
const lathePoints = [];
for (let i = 0; i < 10; i++) {
    lathePoints.push(new THREE.Vector2(Math.sin(i * 0.2) * 0.4 + 0.1, i * 0.1 - 0.5)); 
}
const latheGeometry = new THREE.LatheGeometry(lathePoints, 32);

// Define a heart shape
const heartShape = new THREE.Shape();
heartShape.moveTo(0, 0.4);
heartShape.bezierCurveTo(0.2, 0.8, 0.8, 0.8, 1, 0.4);
heartShape.bezierCurveTo(1.2, -0.2, 0.6, -0.5, 0, -1);
heartShape.bezierCurveTo(-0.6, -0.5, -1.2, -0.2, -1, 0.4);
heartShape.bezierCurveTo(-0.8, 0.8, -0.2, 0.8, 0, 0.4);

// Extrude settings for heart
const extrudeSettings = { depth: 0.2, bevelEnabled: false };
const heartGeometry = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);

// Define Sine Curve
class CustomSinCurve extends THREE.Curve {
    constructor(scale = 1) {
        super();
        this.scale = scale;
    }
    getPoint(t) {
        const tx = t * 3 - 1.5;
        const ty = Math.sin(2 * Math.PI * t);
        const tz = 0;
        return new THREE.Vector3(tx, ty, tz).multiplyScalar(this.scale);
    }
}

// Create Tube Geometry from Sine Curve
const path = new CustomSinCurve(0.5);
const sineWaveGeometry = new THREE.TubeGeometry(path, 20, 0.2, 8, false);

// Primitives
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
    new THREE.CapsuleGeometry(0.5, 1, 10, 20),
    latheGeometry, // Lathe
    heartGeometry,  // Heart
    sineWaveGeometry, // Sine Wave Tube
];

// Colors
const colors = [
    0xff6347, 0x4682b4, 0x32cd32, 0xff69b4, 0x8a2be2, 0xdaA520, 
    0x7fff00, 0xdc143c, 0x00ced1, 0xff4500, 0x6a5acd, 0x20b2aa, 0xcd5c5c,
    0xffd700, 0xff8c00, 0xff0000, 0xff4500, 0xff0000
];

// Create Primitives
primitives.forEach((geometry, index) => {
    const material = new THREE.MeshPhongMaterial({ color: colors[index] });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(index % 4 * 3 - 4, Math.floor(index / 4) * 3, 0);
    scene.add(mesh);
});

// Cross Marks
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

// Add Grid of Cross Marks
for (let x = -5; x <= 5; x++) {
    for (let z = -5; z <= 5; z++) {
        createCross(x * 1.5, -1, z * 1.5);
    }
}

// Handle Window Resize
window.addEventListener('resize', () => {
    renderer1.setSize(window.innerWidth / 2, window.innerHeight);
    renderer2.setSize(window.innerWidth / 2, window.innerHeight);

    perspectiveCamera.aspect = window.innerWidth / window.innerHeight;
    perspectiveCamera.updateProjectionMatrix();

    orthoCamera.left = -10 * aspect;
    orthoCamera.right = 10 * aspect;
    orthoCamera.top = 10;
    orthoCamera.bottom = -10;
    orthoCamera.updateProjectionMatrix();
});

// Animation Loop
function animate() {
    requestAnimationFrame(animate);

    scene.children.forEach(obj => {
        if (obj instanceof THREE.Mesh) {
            obj.rotation.x += 0.01; // Rotate around X-axis
            obj.rotation.y += 0.01; //around Y-axis
        }
    });

    // Update controls
    controls1.update();
    controls2.update();
    firstPersonControls.update(0.1);
    trackballControls.update();
    flyControls.update(0.1);

    renderer1.render(scene, perspectiveCamera);
    renderer2.render(scene, orthoCamera);
}
animate();