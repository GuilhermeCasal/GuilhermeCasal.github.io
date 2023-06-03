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
orbit.minDistance = 50;
orbit.maxDistance = 350;

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

function createPlanetMoon(size, texture, position, moon) {
    const geo = new THREE.SphereGeometry(size, 30, 30);
    const mat = new THREE.MeshStandardMaterial({ map: textureLoader.load(texture) });
    const mesh = new THREE.Mesh(geo, mat);
    const obj = new THREE.Object3D();
    obj.add(mesh);

    if (moon) {
        const moonGeo = new THREE.SphereGeometry(moon.size, 30, 30);
        const moonMat = new THREE.MeshStandardMaterial({ map: textureLoader.load(moon.texture) });
        const moonMesh = new THREE.Mesh(moonGeo, moonMat);
        const moonObj = new THREE.Object3D();
        moonObj.add(moonMesh);
        obj.add(moonObj);

        // Set the moon's position and rotation relative to the planet
        const distance = 4; // Default distance from Earth
        const initialRotation = 2; // Default initial rotation
        moonObj.position.set(distance, 0, 0);
        moonMesh.rotateY(initialRotation);
        moonObj.rotateY(initialRotation);

        // Add moon properties to the main object for animation purposes
        obj.moon = {
            mesh: moonMesh,
            obj: moonObj,
            velocity: moon.velocity,
        };
    }

    scene.add(obj);
    mesh.position.x = position;

    return { mesh, obj };
}


//Load json file
let mercury;
let venus;
let earth;
let mars;
let jupiter;
let saturn;
let uranus;
let neptune;



fetch('../solarsystem.json')
  .then(response => response.json())
  .then(data => {
    for (const planetName in data) {
        if(planetName == "mercury"){
            const Pdata = data[planetName];
            mercury = createPlanet(Pdata.size,Pdata.texture,Pdata.position);  
            mercury.mesh.receiveShadow = true;
            mercury.mesh.castShadow = true;    
        }
        if(planetName == "venus"){
            const Pdata = data[planetName];
            venus = createPlanet(Pdata.size,Pdata.texture,Pdata.position); 
            venus.mesh.receiveShadow = true; //default
            venus.mesh.castShadow = true; //default     
        }      
        if(planetName == "earth"){
            const Pdata = data[planetName];
            earth = createPlanetMoon(Pdata.size,Pdata.texture,Pdata.position,Pdata.moon);  
            earth.mesh.receiveShadow = true; //default
            earth.mesh.castShadow = true; //default    
        }
        if(planetName == "mars"){
            const Pdata = data[planetName];
            mars = createPlanet(Pdata.size,Pdata.texture,Pdata.position);   
            mars.mesh.receiveShadow = true; //default
            mars.mesh.castShadow = true; //default   
        }  
        if(planetName == "jupiter"){
            const Pdata = data[planetName];
            jupiter = createPlanet(Pdata.size,Pdata.texture,Pdata.position); 
            jupiter.mesh.receiveShadow = true; //default
            jupiter.mesh.castShadow = true; //default     
        } 
        if(planetName == "saturn"){
            const Pdata = data[planetName];
            saturn = createPlanet(Pdata.size,Pdata.texture,Pdata.position,Pdata.ring); 
            saturn.mesh.receiveShadow = true; //default
            saturn.mesh.castShadow = true; //default     
        } 
        if(planetName == "uranus"){
            const Pdata = data[planetName];
            uranus = createPlanet(Pdata.size,Pdata.texture,Pdata.position,Pdata.ring);  
            uranus.mesh.receiveShadow = true; //default
            uranus.mesh.castShadow = true; //default    
        } 
        if(planetName == "neptune"){
            const Pdata = data[planetName];
            neptune = createPlanet(Pdata.size,Pdata.texture,Pdata.position);  
            neptune.mesh.receiveShadow = true; //default
            neptune.mesh.castShadow = true; //default    
        }      
    }
  });

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
const aroundSun = gui.addFolder('Planets Velocity Around the Sun');
const mercuryRotation = {
    velocity: 0.04,
};
const mercuryRotationController = aroundSun.add(mercuryRotation, 'velocity', 0, 0.5, 0.01).name('Mercury');
const venusRotation = {
    velocity: 0.015,
};
const venusRotationController = aroundSun.add(venusRotation, 'velocity', 0, 0.2, 0.01).name('Venus');
const earthRotation = {
    velocity: 0.01,
};
const earthRotationController = aroundSun.add(earthRotation, 'velocity', 0, 0.2, 0.01).name('Earth');
const marsRotation = {
    velocity: 0.008,
};
const marsRotationController = aroundSun.add(marsRotation, 'velocity', 0, 0.2, 0.001).name('Mars');
const jupiterRotation = {
    velocity: 0.002,
};
const jupiterRotationController = aroundSun.add(jupiterRotation, 'velocity', 0, 0.2, 0.001).name('Jupiter');
const saturnRotation = {
    velocity: 0.0009,
};
const saturnRotationController = aroundSun.add(saturnRotation, 'velocity', 0, 0.18, 0.0001).name('Saturn');
const uranusRotation = {
    velocity: 0.0004,
};
const uranusRotationController = aroundSun.add(uranusRotation, 'velocity', 0, 0.18, 0.0001).name('Uranus');
const neptuneRotation = {
    velocity: 0.0001,
};
const neptuneRotationController = aroundSun.add(neptuneRotation, 'velocity', 0, 0.18, 0.0001).name('Neptune');
//

const rot = gui.addFolder('Planets Rotation');
const mercurySelf = {
    velocity: 0.004,
};
const mercurySelfRot = rot.add(mercurySelf, 'velocity', 0, 0.5, 0.01).name('Mercury');
const venusSelf = {
    velocity: 0.002,
};
const venusSelfRot = rot.add(venusSelf, 'velocity', 0, 0.4, 0.01).name('Venus');
const earthSelf = {
    velocity: 0.02,
};
const earthSelfRot = rot.add(earthSelf, 'velocity', 0, 0.4, 0.01).name('Earth');
const marsSelf = {
    velocity: 0.018,
};
const marsSelfRot = rot.add(marsSelf, 'velocity', 0, 0.4, 0.01).name('Mars');
const jupiterSelf = {
    velocity: 0.04,
};
const jupiterSelfRot = rot.add(jupiterSelf, 'velocity', 0, 0.4, 0.01).name('Jupiter');
const saturnSelf = {
    velocity: 0.038,
};
const saturnSelfRot = rot.add(saturnSelf, 'velocity', 0, 0.4, 0.01).name('Saturn');
const uranusSelf = {
    velocity: 0.03,
};
const uranusSelfRot = rot.add(uranusSelf, 'velocity', 0, 0.4, 0.01).name('Uranus');
const neptuneSelf = {
    velocity: 0.032,
};
const neptuneSelfRot = rot.add(neptuneSelf, 'velocity', 0, 0.4, 0.01).name('Neptune');
//


function animate() {
    sun.rotateY(0.005);
    if (mercury) {
        mercury.mesh.rotateY(mercurySelf.velocity);
        mercury.obj.rotateY(mercuryRotation.velocity);
    }
    if (venus) {
        venus.mesh.rotateY(venusSelf.velocity);
        venus.obj.rotateY(venusRotation.velocity);
    }
    if (earth) {
        earth.mesh.rotateY(earthSelf.velocity);
        earth.obj.rotateY(earthRotation.velocity);
        if (earth.obj.moon) {
            const moonRotationSpeed = 0.03; // Adjust the moon's rotation speed as desired
            earth.obj.moon.obj.rotateY(moonRotationSpeed);
        }
    }
    if (mars) {
        mars.mesh.rotateY(marsSelf.velocity);
        mars.obj.rotateY(marsRotation.velocity);
    }
    if (jupiter) {
        jupiter.mesh.rotateY(jupiterSelf.velocity);
        jupiter.obj.rotateY(jupiterRotation.velocity);
    }
    if (saturn) {
        saturn.mesh.rotateY(saturnSelf.velocity);
        saturn.obj.rotateY(saturnRotation.velocity);
    }
    if (uranus) {
        uranus.mesh.rotateY(uranusSelf.velocity);
        uranus.obj.rotateY(uranusRotation.velocity);
    }
    if (neptune) {
        neptune.mesh.rotateY(neptuneSelf.velocity);
        neptune.obj.rotateY(neptuneRotation.velocity);
    }
    renderer.render(scene, camera);
    // orbit.update();
    // requestAnimationFrame(animate);
}

renderer.setAnimationLoop(animate);

window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});