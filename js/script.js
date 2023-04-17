import * as THREE from 'three';
import { OrbitControls } from 'controls';
//import Stats from 'three/addons/libs/stats.module.js';
import { GUI } from 'gui';


//Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default

//Scene and Camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45,window.innerWidth/window.innerHeight, 0.1, 1000);

//Orbit
const orbit = new OrbitControls(camera,renderer.domElement);
camera.position.set(-90, 140, 140);
orbit.update();

const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

//Background
const path = '../img/';
const format = '.jpg';

scene.background = new THREE.CubeTextureLoader()
	.setPath( '../img/' )
	.load( [
		'stars.jpg',
		'stars.jpg',
		'stars.jpg',
		'stars.jpg',
		'stars.jpg',
		'stars.jpg'
	] );

const textureLoader = new THREE.TextureLoader();

const sunTexture = [path + 'sun' + format];
const sunGeo = new THREE.SphereGeometry(16,30,30);
const sunMat = new THREE.MeshBasicMaterial({map: textureLoader.load(sunTexture)});
const sun = new THREE.Mesh(sunGeo, sunMat);
scene.add(sun);

function createPlanet(size, texture, position, ring){
    
    const geo = new THREE.SphereGeometry(size, 30, 30);
    const mat = new THREE.MeshStandardMaterial({ map: textureLoader.load(texture)});
    const mesh = new THREE.Mesh(geo, mat);
    const obj = new THREE.Object3D();
    obj.add(mesh);

    if (ring) {
        const ringGeo = new THREE.RingGeometry( ring.innerRadius, ring.outerRadius, 32);
        const ringMat = new THREE.MeshBasicMaterial({map: textureLoader.load(ring.texture),side: THREE.DoubleSide});
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        obj.add(ringMesh);
        ringMesh.position.x = position;
        ringMesh.rotation.x = -0.5 * Math.PI;
    }

    scene.add(obj);
    mesh.position.x = position;
    return {mesh, obj}
}

const mercuryTexture = [path + 'mercury' + format];
const mercury = createPlanet(3.2, mercuryTexture, 28);
mercury.mesh.receiveShadow = true;
mercury.mesh.castShadow = true;

const venusTexture = [path + 'venus' + format];
const venus = createPlanet(5.8, venusTexture, 44);
venus.mesh.receiveShadow = true; //default
venus.mesh.castShadow = true; //default

const earthTexture = [path + 'earth' + format];
const earth = createPlanet(6, earthTexture, 62);
earth.mesh.receiveShadow = true; //default
earth.mesh.castShadow = true; //default

const marsTexture = [path + 'mars' + format];
const mars = createPlanet(4, marsTexture, 78);
mars.mesh.receiveShadow = true; //default
mars.mesh.castShadow = true; //default

const jupiterTexture = [path + 'jupiter' + format];
const jupiter = createPlanet(12, jupiterTexture, 100);
jupiter.mesh.receiveShadow = true; //default
jupiter.mesh.castShadow = true; //default

const format2 = '.png';

const saturnTexture = [path + 'saturn' + format];
const saturnRingTexture = [path + 'saturnring' + format2];
const saturn = createPlanet(10, saturnTexture, 138, { innerRadius: 10, outerRadius: 20, texture: saturnRingTexture });
saturn.mesh.receiveShadow = true; //default
saturn.mesh.castShadow = true; //default


const uranusTexture = [path + 'uranus' + format];
const uranusRingTexture = [path + 'uranusring' + format2];
const uranus = createPlanet(7, uranusTexture, 176, { innerRadius: 7, outerRadius: 12, texture: uranusRingTexture });
uranus.mesh.receiveShadow = true; //default
uranus.mesh.castShadow = true; //default

const neptuneTexture = [path + 'neptune' + format];
const neptune = createPlanet(7, neptuneTexture, 200);
neptune.mesh.receiveShadow = true; //default
neptune.mesh.castShadow = true; //default


//LIGHT
const pointLight = new THREE.PointLight(0xFFFFFF, 2, 300);
pointLight.castShadow = true;

scene.add(pointLight);

pointLight.shadow.mapSize.width = 1024;
pointLight.shadow.mapSize.height = 1024;
pointLight.shadow.camera.near = 0.5;
pointLight.shadow.camera.far = 500;


//GUI DAT
const gui = new GUI();
const aroundSun = gui.addFolder('Planets Velocity');
const mercuryRotation = {
    velocity: 0.04,
};
const mercuryRotationController = aroundSun.add(mercuryRotation, 'velocity', 0, 0.5, 0.01).name('Mercury Rotation Velocity');
const venusRotation = {
    velocity: 0.015,
};
const venusRotationController = aroundSun.add(venusRotation, 'velocity', 0, 0.2, 0.01).name('Venus Rotation Velocity');
const earthRotation = {
    velocity: 0.01,
};
const earthRotationController = aroundSun.add(earthRotation, 'velocity', 0, 0.2, 0.01).name('Earth Rotation Velocity');
const marsRotation = {
    velocity: 0.008,
};
const marsRotationController = aroundSun.add(marsRotation, 'velocity', 0, 0.2, 0.001).name('Mars Rotation Velocity');
const jupiterRotation = {
    velocity: 0.002,
};
const jupiterRotationController = aroundSun.add(jupiterRotation, 'velocity', 0, 0.2, 0.001).name('Jupiter Rotation Velocity');
const saturnRotation = {
    velocity: 0.0009,
};
const saturnRotationController = aroundSun.add(saturnRotation, 'velocity', 0, 0.18, 0.0001).name('Saturn Rotation Velocity');
const uranusRotation = {
    velocity: 0.0004,
};
const uranusRotationController = aroundSun.add(uranusRotation, 'velocity', 0, 0.18, 0.0001).name('Uranus Rotation Velocity');
const neptuneRotation = {
    velocity: 0.0001,
};
const neptuneRotationController = aroundSun.add(neptuneRotation, 'velocity', 0, 0.18, 0.0001).name('Neptune Rotation Velocity');
//

function animate() {
    sun.rotateY(0.005);
    mercury.mesh.rotateY(0.004);
    venus.mesh.rotateY(0.002);
    earth.mesh.rotateY(0.02);
    mars.mesh.rotateY(0.018);
    jupiter.mesh.rotateY(0.04);
    saturn.mesh.rotateY(0.038);
    uranus.mesh.rotateY(0.03);
    neptune.mesh.rotateY(0.032);

    // Around-sun-rotation
    mercury.obj.rotateY(mercuryRotation.velocity);
    venus.obj.rotateY(venusRotation.velocity);
    earth.obj.rotateY(earthRotation.velocity);
    mars.obj.rotateY(marsRotation.velocity);
    jupiter.obj.rotateY(jupiterRotation.velocity);
    saturn.obj.rotateY(saturnRotation.velocity);
    uranus.obj.rotateY(uranusRotation.velocity);
    neptune.obj.rotateY(neptuneRotation.velocity);

    renderer.render(scene, camera);
    // orbit.update();
}

renderer.setAnimationLoop(animate);

window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});