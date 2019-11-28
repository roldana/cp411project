import * as THREE from '../build/three.module.js/index.js';
import {GUI} from './dat.gui.module.js';
import { OrbitControls }  from './OrbitControls.js';

let RADIUS_SUN = 100;
let RADIUS_MULTIPLIER_JUPITER = 0.100397506;
let RADIUS_MULTIPLIER_SATURN = 0.083625575;
let RADIUS_MULTIPLIER_URANUS = 0.036421758;
let RADIUS_MULTIPLIER_NEPTUNE = 0.035359062;
let RADIUS_MULTIPLIER_VENUS = 0.008689696;
let RADIUS_MULTIPLIER_MARS = 0.004866861;
let RADIUS_MULTIPLIER_MERCURY = 0.003502589
let RADIUS_MULPIPLIER_EARTH = 0.00914924;
let WIDTH_SEGMENTS = 64;
let HEIGHT_SEGMENTS = 64;

let ORBIT_SPEED_MERCURY = 1/0.2;
let ORBIT_SPEED_VENUS = 1/0.6;
let ORBIT_SPEED_EARTH = 1;
let ORBIT_SPEED_MARS = 1/1.9;
let ORBIT_SPEED_JUPITER = 1/11.9;
let ORBIT_SPEED_SATURN = 1/29.5;
let ORBIT_SPEED_URANUS = 1/84;
let ORBIT_SPEED_NEPTUNE = 1/164.8;

let INNER_PLANET_RADIUS_MULTIPLIER = 15;
let OUTER_PLANET_RADIUS_MULTIPLIER = 4.5;

var distance_between = 50;


// window resize listener
window.addEventListener( 'resize', onWindowResize, false );
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

// camera
var camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 10000 );
camera.position.set(-300, 400, -300);

// renderer object
var renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild( renderer.domElement );

// set scene
var scene = new THREE.Scene();

// orbit controls
var orbit = new OrbitControls( camera, renderer.domElement );
orbit.enableZoom = true;
orbit.maxPolarAngle = Math.PI / 2;
orbit.minDistance = 150;
orbit.maxDistance = 1500;

// set background mesh
var bgTexture = new THREE.TextureLoader().load( './texture/8k_stars_milky_way.jpg' );
var bgSettings = {
    geometry: new THREE.SphereGeometry(
        RADIUS_SUN * 50, 32, 32
    ),
    material: new THREE.MeshLambertMaterial({
        color: 0xFFFFFF,
        map: bgTexture,
        side: THREE.BackSide
    })
}
var bg = new THREE.Mesh(
    bgSettings.geometry,
    bgSettings.material
)
scene.add(bg);

// sunlight
var sunlight = new THREE.PointLight( 0xffffff, 1, 0 );
sunlight.castShadow = true;
sunlight.shadowDarkness = 0.9;
scene.add(sunlight);

// ambient light
var ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
ambientLight.visible = false;
scene.add(ambientLight);

// set sun and planets
//sun
var sunGeometry = new THREE.SphereGeometry( RADIUS_SUN, 80, 60, 0, Math.PI*2, 0, Math.PI );
var sunTexture = new THREE.TextureLoader().load( './texture/2k_sun.jpg' );
var sunMaterial = new THREE.MeshLambertMaterial( { emissive: 0xffffff,  emissiveMap: sunTexture, emissiveIntensity: 1 } );
var sun = new THREE.Mesh( sunGeometry, sunMaterial );
scene.add( sun );

var endPosX = sun.position.x + sunGeometry.parameters.radius;

//sun glow
var spriteMaterial = new THREE.SpriteMaterial( 
{
    map: new THREE.TextureLoader().load( './texture/glow.png' ), 
    color: 0xfffb00, transparent: true, blending: THREE.AdditiveBlending
});
var sprite = new THREE.Sprite( spriteMaterial );
sprite.scale.set(250, 250, 1.0);
sun.add( sprite );

// planet group
var planets = new THREE.Group();

//mercury
var mercuryGeometry = new THREE.SphereGeometry(RADIUS_SUN * RADIUS_MULTIPLIER_MERCURY * INNER_PLANET_RADIUS_MULTIPLIER, WIDTH_SEGMENTS, HEIGHT_SEGMENTS);
var mercury = new THREE.Mesh(
    mercuryGeometry,
    new THREE.MeshLambertMaterial({
        map: new THREE.TextureLoader().load('./texture/2k_mercury.jpg')
        }));
mercury.position.set(endPosX + mercuryGeometry.parameters.radius + distance_between, 0, 0);
mercury.castShadow = true;
mercury.receiveShadow = true;
endPosX = mercury.position.x + mercuryGeometry.parameters.radius;
planets.add( mercury );

//venus
var venusGeometry = new THREE.SphereGeometry( RADIUS_SUN * RADIUS_MULTIPLIER_VENUS * INNER_PLANET_RADIUS_MULTIPLIER, WIDTH_SEGMENTS, HEIGHT_SEGMENTS);
var venus  = new THREE.Mesh(
    venusGeometry,
    new THREE.MeshLambertMaterial({
        map: new THREE.TextureLoader().load('./texture/2k_venus_surface.jpg')
        }));
venus.position.set(endPosX + venusGeometry.parameters.radius + distance_between, 0, 0);
venus.castShadow = true;
venus.receiveShadow = true;
endPosX = venus.position.x + venusGeometry.parameters.radius;
planets.add( venus );

//earth
var earthGeometry = new THREE.SphereGeometry( RADIUS_SUN * RADIUS_MULPIPLIER_EARTH * INNER_PLANET_RADIUS_MULTIPLIER, WIDTH_SEGMENTS, HEIGHT_SEGMENTS);
var earth  = new THREE.Mesh(
    earthGeometry,
    new THREE.MeshLambertMaterial({
        map: new THREE.TextureLoader().load('./texture/2k_earth_daymap.jpg')
        }));
earth.position.set(endPosX + earthGeometry.parameters.radius + distance_between, 0, 0);
earth.castShadow = true;
earth.receiveShadow = true;
endPosX = earth.position.x + earthGeometry.parameters.radius;
planets.add( earth );

//mars
var marsGeometry = new THREE.SphereGeometry( RADIUS_SUN * RADIUS_MULTIPLIER_MARS * INNER_PLANET_RADIUS_MULTIPLIER, WIDTH_SEGMENTS, HEIGHT_SEGMENTS);
var mars = new THREE.Mesh(
    marsGeometry,
    new THREE.MeshLambertMaterial({
        map: new THREE.TextureLoader().load('./texture/2k_mars.jpg')
        }));
mars.position.set(endPosX + marsGeometry.parameters.radius + distance_between, 0, 0);
mars.castShadow = true;
mars.receiveShadow = true;
endPosX = mars.position.x + marsGeometry.parameters.radius;
planets.add( mars );

//jupiter
var jupiterGeometry = new THREE.SphereGeometry( RADIUS_SUN * RADIUS_MULTIPLIER_JUPITER * OUTER_PLANET_RADIUS_MULTIPLIER, WIDTH_SEGMENTS, HEIGHT_SEGMENTS);
var jupiter  = new THREE.Mesh(
    jupiterGeometry,
    new THREE.MeshLambertMaterial({
        map: new THREE.TextureLoader().load('./texture/2k_jupiter.jpg')
        }));
jupiter.position.set(endPosX + jupiterGeometry.parameters.radius + distance_between, 0, 0);
jupiter.castShadow = true;
jupiter.receiveShadow = true;
endPosX = jupiter.position.x + jupiterGeometry.parameters.radius;
planets.add( jupiter );

//saturn
var saturnGeometry = new THREE.SphereGeometry( RADIUS_SUN * RADIUS_MULTIPLIER_SATURN * OUTER_PLANET_RADIUS_MULTIPLIER, WIDTH_SEGMENTS, HEIGHT_SEGMENTS);
var saturn = new THREE.Mesh(
    saturnGeometry,
    new THREE.MeshLambertMaterial({
        map: new THREE.TextureLoader().load('./texture/2k_saturn.jpg')
        }));
saturn.position.set(endPosX + saturnGeometry.parameters.radius + distance_between, 0, 0);
saturn.castShadow = true;
saturn.receiveShadow = true;
endPosX = saturn.position.x + saturnGeometry.parameters.radius;
planets.add( saturn );

//saturn rings
var saturnRGeometry = new THREE.RingBufferGeometry( RADIUS_SUN * RADIUS_MULTIPLIER_SATURN * OUTER_PLANET_RADIUS_MULTIPLIER *  1.2, RADIUS_SUN * RADIUS_MULTIPLIER_SATURN * OUTER_PLANET_RADIUS_MULTIPLIER* 1.95, 64);

var saturnRTexture = new THREE.TextureLoader().load( './texture/saturn_ring2.jpg' );
var saturnRMaterial = new THREE.MeshLambertMaterial( { map: saturnRTexture, side: THREE.DoubleSide, transparent: false } );
var saturnR = new THREE.Mesh( saturnRGeometry, saturnRMaterial );
saturnR.receiveShadow = true;
saturnR.rotateY(THREE.Math.degToRad(90));
saturnR.rotateX(THREE.Math.degToRad(45));
saturn.add( saturnR );

//uranus
var uranusGeometry = new THREE.SphereGeometry( RADIUS_SUN * RADIUS_MULTIPLIER_URANUS * OUTER_PLANET_RADIUS_MULTIPLIER, WIDTH_SEGMENTS, HEIGHT_SEGMENTS);
var uranus = new THREE.Mesh(
    uranusGeometry,
    new THREE.MeshLambertMaterial({
        map: new THREE.TextureLoader().load('./texture/2k_uranus.jpg')
        }));
uranus.position.set(endPosX + uranusGeometry.parameters.radius + distance_between, 0, 0);
uranus.castShadow = true;
uranus.receiveShadow = true;
endPosX = uranus.position.x + uranusGeometry.parameters.radius;
planets.add( uranus );

//neptune
var neptuneGeometry = new THREE.SphereGeometry( RADIUS_SUN * RADIUS_MULTIPLIER_NEPTUNE * OUTER_PLANET_RADIUS_MULTIPLIER, WIDTH_SEGMENTS, HEIGHT_SEGMENTS);
var neptune = new THREE.Mesh(
    neptuneGeometry,
    new THREE.MeshLambertMaterial({
        map: new THREE.TextureLoader().load('./texture/2k_neptune.jpg')
        }));
neptune.position.set(endPosX + neptuneGeometry.parameters.radius + distance_between, 0, 0);
neptune.castShadow = true;
neptune.receiveShadow = true;
endPosX = neptune.position.x + neptuneGeometry.parameters.radius;
planets.add( neptune );

scene.add( planets );

// animation options
var options = {
    orbit_speed_multiplier: 0.05,
    orbit_animation: true,
    sun_light_only: false,
    true_size: false,
    earth_view: function (){
        camera.position.set(earth.position.x+150, earth.position.y+150, earth.position.z+150);
        camera.lookAt(earth.position.x, earth.position.y, earth.position.z);
    },
    hide_background: false
}

// gui controls
var gui = new GUI();
var folder = gui.addFolder( 'Solar System Control' );
folder.open();
folder.add(options, 'orbit_speed_multiplier', 0.02, 0.1 ).name('Orbit Speed');
folder.add(options, 'orbit_animation').name('Animate Orbit');
folder.add(options, 'sun_light_only').name('Sun Light Only');
folder.add(options, 'true_size').name('True Scale');
folder.add(options, 'earth_view').name('Earth View');
folder.add(options, 'hide_background').name('Hide Background');
// folder.add(ambientLight, 'intensity', 0, 0.5).name('Ambient Light Intensity');
folder.add(ambientLight, 'visible').name('Ambient Light');
// folder.add(renderer, 'shadowMapEnabled').name('Enable Shadows');

// get planets orbit radius
var mercuryOrbitRadius = mercury.position.x;
var venusOrbitRadius = venus.position.x;
var earthOrbitRadius = earth.position.x;
var marsOrbitRadius = mars.position.x;
var jupiterOrbitRadius = jupiter.position.x;
var saturnOrbitRadius = saturn.position.x;
var uranusOrbitRadius = uranus.position.x;
var neptuneOrbitRadius = neptune.position.x;

var t = 0;

function animate() {
    requestAnimationFrame( animate );

    //animate orbits
    if (options.orbit_animation) {
        mercury.position.x = Math.sin(t * ORBIT_SPEED_MERCURY * options.orbit_speed_multiplier) * mercuryOrbitRadius;
        mercury.position.z = Math.cos(t * ORBIT_SPEED_MERCURY * options.orbit_speed_multiplier) * mercuryOrbitRadius;

        venus.position.x = Math.sin(t * ORBIT_SPEED_VENUS * options.orbit_speed_multiplier) * venusOrbitRadius;
        venus.position.z = Math.cos(t * ORBIT_SPEED_VENUS * options.orbit_speed_multiplier) * venusOrbitRadius;

        earth.position.x = Math.sin(t * ORBIT_SPEED_EARTH * options.orbit_speed_multiplier) * earthOrbitRadius;
        earth.position.z = Math.cos(t * ORBIT_SPEED_EARTH * options.orbit_speed_multiplier) * earthOrbitRadius;

        mars.position.x = Math.sin(t * ORBIT_SPEED_MARS * options.orbit_speed_multiplier) * marsOrbitRadius;
        mars.position.z = Math.cos(t * ORBIT_SPEED_MARS * options.orbit_speed_multiplier) * marsOrbitRadius;

        jupiter.position.x = Math.sin(t * ORBIT_SPEED_JUPITER * options.orbit_speed_multiplier) * jupiterOrbitRadius;
        jupiter.position.z = Math.cos(t * ORBIT_SPEED_JUPITER * options.orbit_speed_multiplier) * jupiterOrbitRadius;

        saturn.position.x = Math.sin(t * ORBIT_SPEED_SATURN * options.orbit_speed_multiplier) * saturnOrbitRadius;
        saturn.position.z = Math.cos(t * ORBIT_SPEED_SATURN * options.orbit_speed_multiplier) * saturnOrbitRadius;

        uranus.position.x = Math.sin(t * ORBIT_SPEED_URANUS * options.orbit_speed_multiplier) * uranusOrbitRadius;
        uranus.position.z = Math.cos(t * ORBIT_SPEED_URANUS * options.orbit_speed_multiplier) * uranusOrbitRadius;

        neptune.position.x = Math.sin(t * ORBIT_SPEED_NEPTUNE * options.orbit_speed_multiplier) * neptuneOrbitRadius;
        neptune.position.z = Math.cos(t * ORBIT_SPEED_NEPTUNE * options.orbit_speed_multiplier) * neptuneOrbitRadius;
    }

    if(options.true_size) {
        for (var i = 0; i < planets.children.length; i++){
            if (i < 4) {
                planets.children[i].scale.set(1 / INNER_PLANET_RADIUS_MULTIPLIER, 1 / INNER_PLANET_RADIUS_MULTIPLIER, 1 / INNER_PLANET_RADIUS_MULTIPLIER);
            } else {
                planets.children[i].scale.set(1 / OUTER_PLANET_RADIUS_MULTIPLIER, 1 / OUTER_PLANET_RADIUS_MULTIPLIER, 1 / OUTER_PLANET_RADIUS_MULTIPLIER);

            }
        }
    } else {
        for (var i = 0; i < planets.children.length; i++){
            planets.children[i].scale.set(1, 1, 1);
        }
    }

    if (options.hide_background) {bg.material.color = new THREE.Color(0x000000);}
    else {bg.material.color = new THREE.Color(0xFFFFFF);}

    renderer.render( scene, camera );
    t += Math.PI / 180 * 2;
}

animate();