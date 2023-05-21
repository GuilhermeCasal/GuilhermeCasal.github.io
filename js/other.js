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
const sunGeo = new THREE.SphereGeometry(8,15,15);
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


//Load json file
let planet1;
let planet2;
let planet3;
let planet4;
let planet5;
let planet6;

fetch('../other.json')
  .then(response => response.json())
  .then(data => {
    for (const planetName in data) {
        if(planetName == "planet1"){
            const Pdata = data[planetName];
            planet1 = createPlanet(Pdata.size,Pdata.texture,Pdata.position);  
            planet1.mesh.receiveShadow = true;
            planet1.mesh.castShadow = true;    
        }
        if(planetName == "planet2"){
            const Pdata = data[planetName];
            planet2 = createPlanet(Pdata.size,Pdata.texture,Pdata.position); 
            planet2.mesh.receiveShadow = true; //default
            planet2.mesh.castShadow = true; //default     
        }      
        if(planetName == "planet3"){
            const Pdata = data[planetName];
            planet3 = createPlanet(Pdata.size,Pdata.texture,Pdata.position);  
            planet3.mesh.receiveShadow = true; //default
            planet3.mesh.castShadow = true; //default    
        }
        if(planetName == "planet4"){
            const Pdata = data[planetName];
            planet4 = createPlanet(Pdata.size,Pdata.texture,Pdata.position);   
            planet4.mesh.receiveShadow = true; //default
            planet4.mesh.castShadow = true; //default   
        }  
        if(planetName == "planet5"){
            const Pdata = data[planetName];
            planet5 = createPlanet(Pdata.size,Pdata.texture,Pdata.position); 
            planet5.mesh.receiveShadow = true; //default
            planet5.mesh.castShadow = true; //default     
        } 
        if(planetName == "planet6"){
            const Pdata = data[planetName];
            planet6 = createPlanet(Pdata.size,Pdata.texture,Pdata.position,Pdata.ring); 
            planet6.mesh.receiveShadow = true; //default
            planet6.mesh.castShadow = true; //default     
        } 
    }
  });

const planetSizes = {
    planet1: 1,
    planet2: 1,
    planet3: 1,
    planet4: 1,
    planet5: 1,
    planet6: 2
};
    

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
const planet1Rotation = {
    velocity: 0.04,
};
const planet1RotationController = aroundSun.add(planet1Rotation, 'velocity', 0, 0.5, 0.01).name('Planet 1');
const planet2Rotation = {
    velocity: 0.015,
};
const planet2RotationController = aroundSun.add(planet2Rotation, 'velocity', 0, 0.2, 0.01).name('Planet 2');
const planet3Rotation = {
    velocity: 0.01,
};
const planet3RotationController = aroundSun.add(planet3Rotation, 'velocity', 0, 0.2, 0.01).name('Planet 3');
const planet4Rotation = {
    velocity: 0.008,
};
const planet4RotationController = aroundSun.add(planet4Rotation, 'velocity', 0, 0.2, 0.001).name('Planet 4');
const planet5Rotation = {
    velocity: 0.002,
};
const planet5RotationController = aroundSun.add(planet5Rotation, 'velocity', 0, 0.2, 0.001).name('Planet 5');
const planet6Rotation = {
    velocity: 0.0009,
};
const planet6RotationController = aroundSun.add(planet6Rotation, 'velocity', 0, 0.18, 0.0001).name('Planet 6');


const rot = gui.addFolder('Planets Rotation');
const planet1Self = {
    velocity: 0.004,
};
const planet1SelfRot = rot.add(planet1Self, 'velocity', 0, 0.5, 0.01).name('Planet 1');
const planet2Self = {
    velocity: 0.002,
};
const planet2SelfRot = rot.add(planet2Self, 'velocity', 0, 0.4, 0.01).name('Planet 2');
const planet3Self = {
    velocity: 0.02,
};
const planet3SelfRot = rot.add(planet3Self, 'velocity', 0, 0.4, 0.01).name('Planet 3');
const planet4Self = {
    velocity: 0.018,
};
const planet4SelfRot = rot.add(planet4Self, 'velocity', 0, 0.4, 0.01).name('Planet 4');
const planet5Self = {
    velocity: 0.04,
};
const planet5SelfRot = rot.add(planet5Self, 'velocity', 0, 0.4, 0.01).name('Planet 5');
const planet6Self = {
    velocity: 0.038,
};
const planet6SelfRot = rot.add(planet6Self, 'velocity', 0, 0.4, 0.01).name('Planet 6');

const size = gui.addFolder('Planets Size');
const planet1SizeController = size.add(planetSizes, 'planet1', 1, 12.0, 0.2).name('Planet 1');
const planet2SizeController = size.add(planetSizes, 'planet2', 1, 12.0, 0.2).name('Planet 2');
const planet3SizeController = size.add(planetSizes, 'planet3', 1, 12.0, 0.2).name('Planet 3');
const planet4SizeController = size.add(planetSizes, 'planet4', 1, 12.0, 0.2).name('Planet 4');
const planet5SizeController = size.add(planetSizes, 'planet5', 1, 12.0, 0.2).name('Planet 5');
const planet6SizeController = size.add(planetSizes, 'planet6', 1, 12.0, 0.2).name('Planet 6');



function animate() {
    sun.rotateY(0.005);
    if (planet1) {
        planet1.mesh.rotateY(planet1Self.velocity);
        planet1.obj.rotateY(planet1Rotation.velocity);
        planet1.mesh.scale.set(planetSizes.planet1, planetSizes.planet1, planetSizes.planet1);
    }
    if (planet2) {
        planet2.mesh.rotateY(planet2Self.velocity);
        planet2.obj.rotateY(planet2Rotation.velocity);
        planet2.mesh.scale.set(planetSizes.planet2, planetSizes.planet2, planetSizes.planet2);
    }
    if (planet3) {
        planet3.mesh.rotateY(planet3Self.velocity);
        planet3.obj.rotateY(planet3Rotation.velocity);
        planet3.mesh.scale.set(planetSizes.planet3, planetSizes.planet3, planetSizes.planet3);
    }
    if (planet4) {
        planet4.mesh.rotateY(planet4Self.velocity);
        planet4.obj.rotateY(planet4Rotation.velocity);
        planet4.mesh.scale.set(planetSizes.planet4, planetSizes.planet4, planetSizes.planet4);
    }
    if (planet5) {
        planet5.mesh.rotateY(planet5Self.velocity);
        planet5.obj.rotateY(planet5Rotation.velocity);
        planet5.mesh.scale.set(planetSizes.planet5, planetSizes.planet5, planetSizes.planet5);
    }
    if (planet6) {
        planet6.mesh.rotateY(planet6Self.velocity);
        planet6.obj.rotateY(planet6Rotation.velocity);
        planet6.mesh.scale.set(planetSizes.planet6, planetSizes.planet6, planetSizes.planet6);
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