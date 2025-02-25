// Create the scene
const scene = new THREE.Scene();

// Create the camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 3, 8);

// Create the renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add OrbitControls
const controls1 = new THREE.OrbitControls(camera, renderer.domElement);

// Add lighting
const light = new THREE.PointLight(0xffffff, 1, 100);
light.position.set(5, 5, 5);
scene.add(light);
scene.add(new THREE.AmbientLight(0x404040)); // Soft ambient light

// Create a material
const material = new THREE.MeshStandardMaterial({ color: 0x0077ff });

// Create the body (Trapezoid)
const bodyGeometry = new THREE.CylinderGeometry(1.8, 1.2, 2.5, 32);
const body = new THREE.Mesh(bodyGeometry, material);
scene.add(body);

// Function to create an arm
function createArm(xOffset) {
    const armGroup = new THREE.Group();
    
    // Shoulder Joint (Attach directly to body)
    const shoulderGeometry = new THREE.SphereGeometry(0.4, 32, 32);
    const shoulder = new THREE.Mesh(shoulderGeometry, material);
    shoulder.position.set(xOffset, 1.2, 0);
    armGroup.add(shoulder);

    // Upper Arm
    const upperArmGeometry = new THREE.CylinderGeometry(0.3, 0.3, 2, 32);
    const upperArm = new THREE.Mesh(upperArmGeometry, material);
    upperArm.position.y = -1;
    upperArm.rotation.x = -Math.PI / 4; // Rotate forward (raising the arm)
    shoulder.add(upperArm);

    // Lower Arm
    const lowerArmGeometry = new THREE.CylinderGeometry(0.2, 0.2, 2, 32);
    const lowerArm = new THREE.Mesh(lowerArmGeometry, material);
    lowerArm.position.y = -1.5;
    lowerArm.rotation.x = -Math.PI / 6; // Bend forward slightly
    upperArm.add(lowerArm);
    upperArm.add(lowerArm);

    // Wrist
    const wristGeometry = new THREE.SphereGeometry(0.3, 32, 32);
    const wrist = new THREE.Mesh(wristGeometry, material);
    wrist.position.y = -1;
    lowerArm.add(wrist);

    // Attach the arm group to the body
    body.add(armGroup);

    return { shoulder, upperArm, lowerArm, wrist };
}

// Create and attach arms
const leftArm = createArm(-2);
const rightArm = createArm(2);
body.add(leftArm);
body.add(rightArm);

// Animation function
function animate() {
    requestAnimationFrame(animate);

    // Move arms
    leftArm.shoulder.rotation.z = Math.sin(Date.now() * 0.001) * 0.5;
    leftArm.upperArm.rotation.z = Math.sin(Date.now() * 0.001 + Math.PI / 4) * 0.5;
    leftArm.lowerArm.rotation.z = Math.sin(Date.now() * 0.001 + Math.PI / 2) * 0.5;

    rightArm.shoulder.rotation.z = Math.sin(Date.now() * 0.001) * -0.5;
    rightArm.upperArm.rotation.z = Math.sin(Date.now() * 0.001 + Math.PI / 4) * -0.5;
    rightArm.lowerArm.rotation.z = Math.sin(Date.now() * 0.001 + Math.PI / 2) * -0.5;

    renderer.render(scene, camera);
}

animate();

// Handle window resize
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});
















