import * as THREE from '../build/three.module.js/index.js';
import {GUI} from './dat.gui.module.js';
import { OrbitControls }  from './OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from './CSS2DRenderer.js';

let RADIUS_SUN = 100;
let RADIUS_MULTIPLIER_JUPITER = 0.100397506;
let RADIUS_MULTIPLIER_SATURN = 0.083625575;
let RADIUS_MULTIPLIER_URANUS = 0.036421758;
let RADIUS_MULTIPLIER_NEPTUNE = 0.035359062;
let RADIUS_MULTIPLIER_VENUS = 0.008689696;
let RADIUS_MULTIPLIER_MARS = 0.004866861;
let RADIUS_MULTIPLIER_MERCURY = 0.003502589
let RADIUS_MULTIPLIER_EARTH = 0.00914924;
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

let ROTATION_MULTIPLIER = 0.005;

let AXIS_ROTATION_SUN = 1/27;

let AXIS_ROTATION = [
    1/58.66,
    1/243,
    1,
    1/1.04,
    1/0.41,
    1/0.45,
    1/0.70,
    1/0.66
]

let ORBIT_SPEED = [
    1/0.2,
    1/0.6,
    1,
    1/1.9,
    1/11.9,
    1/29.5,
    1/84,
    1/164.8
]

let INNER_PLANET_RADIUS_MULTIPLIER = 15;
let OUTER_PLANET_RADIUS_MULTIPLIER = 4.5;

let RADIUS_PLANETS =
[
    (RADIUS_SUN * RADIUS_MULTIPLIER_MERCURY * INNER_PLANET_RADIUS_MULTIPLIER),
    (RADIUS_SUN * RADIUS_MULTIPLIER_VENUS * INNER_PLANET_RADIUS_MULTIPLIER),
    (RADIUS_SUN * RADIUS_MULTIPLIER_EARTH * INNER_PLANET_RADIUS_MULTIPLIER),
    (RADIUS_SUN * RADIUS_MULTIPLIER_MARS * INNER_PLANET_RADIUS_MULTIPLIER),
    (RADIUS_SUN * RADIUS_MULTIPLIER_JUPITER * OUTER_PLANET_RADIUS_MULTIPLIER),
    (RADIUS_SUN * RADIUS_MULTIPLIER_SATURN * OUTER_PLANET_RADIUS_MULTIPLIER),
    (RADIUS_SUN * RADIUS_MULTIPLIER_URANUS * OUTER_PLANET_RADIUS_MULTIPLIER),
    (RADIUS_SUN * RADIUS_MULTIPLIER_NEPTUNE * OUTER_PLANET_RADIUS_MULTIPLIER),
]


// set orbit radius for each
let FIXED_SPACING = 50;
var orbit_radius = [];
orbit_radius[0] = (RADIUS_SUN + RADIUS_PLANETS[0] + FIXED_SPACING);
for (var i = 1; i < RADIUS_PLANETS.length; i++) {
    orbit_radius[i] = (orbit_radius[i-1] + RADIUS_PLANETS[i]*2 + FIXED_SPACING);
};

// window resize listener
window.addEventListener( 'resize', onWindowResize, false );
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
    labelRenderer.setSize( window.innerWidth, window.innerHeight );
}

// camera
var camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 10000 );
camera.position.set(-300, 400, -300);

// renderer object
var renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// set scene
var scene = new THREE.Scene();

// // orbit controls
// var orbit = new OrbitControls( camera, renderer.domElement );
// orbit.enableZoom = true;
// // orbit.enableDamping = true;
// orbit.maxPolarAngle = Math.PI / 2;
// orbit.minDistance = 150;
// orbit.maxDistance = 1500;

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

//lights
var lights = [];
lights[ 0 ] = new THREE.PointLight( 0xffffff, 1, 0 );
lights[ 1 ] = new THREE.PointLight( 0xffffff, 1, 0 );
lights[ 2 ] = new THREE.PointLight( 0xffffff, 1, 0 );
lights[ 3 ] = new THREE.PointLight( 0xffffff, 1, 0 );

lights[ 0 ].position.set( 0, 2000, 0 );
lights[ 1 ].position.set( 1000, 2000, 1000 );
lights[ 2 ].position.set( - 1000, - 2000, - 1000 );
lights[ 3 ].position.set( 0, 0, 0);

// scene.add( lights[ 0 ] );
// scene.add( lights[ 1 ] );
// scene.add( lights[ 2 ] );
scene.add( lights[ 3 ] );

var ambientLight = new THREE.AmbientLight(0xffffff);
// scene.add(ambientLight);

// set sun and planets
//sun
var sunGeometry = new THREE.SphereGeometry(RADIUS_SUN, 64, 64);
var sunSettings = {
    geometry: sunGeometry,
    material: new THREE.MeshLambertMaterial({
        emissive: 0xffffff,
        emissiveMap: new THREE.TextureLoader().load('./texture/2k_sun.jpg'),
        emisiveIntensity: 0.2
    })
}
var sun = new THREE.Mesh(sunSettings.geometry, sunSettings.material);
scene.add(sun);

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
var mercuryGeometry = new THREE.SphereGeometry(RADIUS_PLANETS[0], WIDTH_SEGMENTS, HEIGHT_SEGMENTS);
var mercury = new THREE.Mesh(
    mercuryGeometry,
    new THREE.MeshLambertMaterial({
        map: new THREE.TextureLoader().load('./texture/2k_mercury.jpg')
    }));
mercury.position.set(endPosX + mercuryGeometry.parameters.radius + FIXED_SPACING, 0, 0);
mercury.rotateX(THREE.Math.degToRad(0.03));
endPosX = mercury.position.x + mercuryGeometry.parameters.radius;
planets.add( mercury );

//venus
var venusGeometry = new THREE.SphereGeometry(RADIUS_PLANETS[1], WIDTH_SEGMENTS, HEIGHT_SEGMENTS);
var venus  = new THREE.Mesh(
    venusGeometry,
    new THREE.MeshLambertMaterial({
        map: new THREE.TextureLoader().load('./texture/2k_venus_surface.jpg')
    }));
venus.position.set(endPosX + venusGeometry.parameters.radius + FIXED_SPACING, 0, 0);
venus.rotateX(THREE.Math.degToRad(2.64));
endPosX = venus.position.x + venusGeometry.parameters.radius;
planets.add( venus );

//earth
var earthGeometry = new THREE.SphereGeometry(RADIUS_PLANETS[2], WIDTH_SEGMENTS, HEIGHT_SEGMENTS);
var earth  = new THREE.Mesh(
    earthGeometry,
    new THREE.MeshLambertMaterial({
        map: new THREE.TextureLoader().load('./texture/2k_earth_daymap.jpg')
    }));
earth.position.set(endPosX + earthGeometry.parameters.radius + FIXED_SPACING, 0, 0);
earth.rotateX(THREE.Math.degToRad(23.44));
endPosX = earth.position.x + earthGeometry.parameters.radius;
planets.add( earth );

//mars
var marsGeometry = new THREE.SphereGeometry(RADIUS_PLANETS[3], WIDTH_SEGMENTS, HEIGHT_SEGMENTS);
var mars = new THREE.Mesh(
    marsGeometry,
    new THREE.MeshLambertMaterial({
        map: new THREE.TextureLoader().load('./texture/2k_mars.jpg')
    }));
mars.position.set(endPosX + marsGeometry.parameters.radius + FIXED_SPACING, 0, 0);
mars.rotateX(THREE.Math.degToRad(25.19));
endPosX = mars.position.x + marsGeometry.parameters.radius;
planets.add( mars );

//jupiter
var jupiterGeometry = new THREE.SphereGeometry(RADIUS_PLANETS[4], WIDTH_SEGMENTS, HEIGHT_SEGMENTS);
var jupiter  = new THREE.Mesh(
    jupiterGeometry,
    new THREE.MeshLambertMaterial({
        map: new THREE.TextureLoader().load('./texture/2k_jupiter.jpg')
    }));
jupiter.position.set(endPosX + jupiterGeometry.parameters.radius + FIXED_SPACING, 0, 0);
jupiter.rotateX(THREE.Math.degToRad(3.13));
endPosX = jupiter.position.x + jupiterGeometry.parameters.radius;
planets.add( jupiter );

//saturn
var saturnGeometry = new THREE.SphereGeometry(RADIUS_PLANETS[5], WIDTH_SEGMENTS, HEIGHT_SEGMENTS);
var saturn = new THREE.Mesh(
    saturnGeometry,
    new THREE.MeshLambertMaterial({
        map: new THREE.TextureLoader().load('./texture/2k_saturn.jpg')
    }));
saturn.position.set(endPosX + saturnGeometry.parameters.radius + FIXED_SPACING, 0, 0);
endPosX = saturn.position.x + saturnGeometry.parameters.radius;
planets.add( saturn );

//saturn rings
var saturnRGeometry = new THREE.RingBufferGeometry(RADIUS_PLANETS[5] *  1.2, RADIUS_SUN * RADIUS_MULTIPLIER_SATURN * OUTER_PLANET_RADIUS_MULTIPLIER * 1.95, 64);
var saturnRTexture = new THREE.TextureLoader().load( './texture/saturn_ring2.jpg' );
var saturnRMaterial = new THREE.MeshLambertMaterial( { map: saturnRTexture, side: THREE.DoubleSide, transparent: false } );
var saturnR = new THREE.Mesh( saturnRGeometry, saturnRMaterial );
// rotate ring
saturnR.rotateX(THREE.Math.degToRad(90));
// apply saturn tilt
saturn.rotateX(THREE.Math.degToRad(26.73));
saturn.add( saturnR );


//uranus
var uranusGeometry = new THREE.SphereGeometry(RADIUS_PLANETS[6], WIDTH_SEGMENTS, HEIGHT_SEGMENTS);
var uranus = new THREE.Mesh(
    uranusGeometry,
    new THREE.MeshLambertMaterial({
        map: new THREE.TextureLoader().load('./texture/2k_uranus.jpg')
    }));
uranus.position.set(endPosX + uranusGeometry.parameters.radius + FIXED_SPACING, 0, 0);
uranus.rotateX(THREE.Math.degToRad(82.23));
endPosX = uranus.position.x + uranusGeometry.parameters.radius;
planets.add( uranus );

//neptune
var neptuneGeometry = new THREE.SphereGeometry(RADIUS_PLANETS[7], WIDTH_SEGMENTS, HEIGHT_SEGMENTS);
var neptune = new THREE.Mesh(
    neptuneGeometry,
    new THREE.MeshLambertMaterial({
        map: new THREE.TextureLoader().load('./texture/2k_neptune.jpg')
    }));
neptune.position.set(endPosX + neptuneGeometry.parameters.radius + FIXED_SPACING, 0, 0);
neptune.rotateX(THREE.Math.degToRad(28.32));
endPosX = neptune.position.x + neptuneGeometry.parameters.radius;
planets.add( neptune );

scene.add( planets );

// labels
var mercuryDiv = document.createElement( 'div' );
mercuryDiv.className = 'label';
mercuryDiv.textContent = 'Mercury';
mercuryDiv.style.marginTop = '-1em';
var mercuryLabel = new CSS2DObject( mercuryDiv );
mercuryLabel.position.set(0, RADIUS_PLANETS[0]+10, 0);
mercury.add(mercuryLabel);

var venusDiv = document.createElement( 'div' );
venusDiv.className = 'label';
venusDiv.textContent = 'Venus';
venusDiv.style.marginTop = '-1em';
var venusLabel = new CSS2DObject( venusDiv );
venusLabel.position.set(0, RADIUS_PLANETS[1]+10, 0);
venus.add(venusLabel);

var earthDiv = document.createElement( 'div' );
earthDiv.className = 'label';
earthDiv.textContent = 'Earth';
earthDiv.style.marginTop = '-1em';
var earthLabel = new CSS2DObject( earthDiv );
earthLabel.position.set(0, RADIUS_PLANETS[2]+10, 0);
earth.add(earthLabel);

var marsDiv = document.createElement( 'div' );
marsDiv.className = 'label';
marsDiv.textContent = 'Mars';
marsDiv.style.marginTop = '-1em';
var marsLabel = new CSS2DObject( marsDiv );
marsLabel.position.set(0, RADIUS_PLANETS[3]+10, 0);
mars.add(marsLabel);

var jupiterDiv = document.createElement( 'div' );
jupiterDiv.className = 'label';
jupiterDiv.textContent = 'Jupiter';
jupiterDiv.style.marginTop = '-1em';
var jupiterLabel = new CSS2DObject( jupiterDiv );
jupiterLabel.position.set(0, RADIUS_PLANETS[4]+10, 0);
jupiter.add(jupiterLabel);

var saturnDiv = document.createElement( 'div' );
saturnDiv.className = 'label';
saturnDiv.textContent = 'Saturn';
saturnDiv.style.marginTop = '-1em';
var saturnLabel = new CSS2DObject( saturnDiv );
saturnLabel.position.set(0, RADIUS_PLANETS[5]+10, 0);
saturn.add(saturnLabel);

var uranusDiv = document.createElement( 'div' );
uranusDiv.className = 'label';
uranusDiv.textContent = 'Uranus';
uranusDiv.style.marginTop = '-1em';
var uranusLabel = new CSS2DObject( uranusDiv );
uranusLabel.position.set(0, RADIUS_PLANETS[6]+10, 0);
uranus.add(uranusLabel);

var neptuneDiv = document.createElement( 'div' );
neptuneDiv.className = 'label';
neptuneDiv.textContent = 'Neptune';
neptuneDiv.style.marginTop = '-1em';
var neptuneLabel = new CSS2DObject( neptuneDiv );
neptuneLabel.position.set(0, RADIUS_PLANETS[7]+10, 0);
neptune.add(neptuneLabel);

var labelRenderer = new CSS2DRenderer();
labelRenderer.setSize( window.innerWidth, window.innerHeight );
labelRenderer.domElement.style.position = 'absolute';
labelRenderer.domElement.style.top = 0;
document.body.appendChild( labelRenderer.domElement );

// orbit controls
var orbit = new OrbitControls( camera, labelRenderer.domElement );
orbit.enableZoom = true;
// orbit.enableDamping = true;
orbit.maxPolarAngle = Math.PI / 2;
orbit.minDistance = 150;
orbit.maxDistance = 1500;

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
    hide_background: false,
    distance_multiplier: 1,
    show_labels: false,
    animate_rotation: false
    // distance_between: 0
}

// gui controls
var gui = new GUI();
var folder = gui.addFolder( 'Solar System Control' );
folder.open();
folder.add(options, 'orbit_speed_multiplier', 0.02, 0.35 ).name('Simulation Speed');
folder.add(options, 'orbit_animation').name('Animate Orbit');
folder.add(options, 'sun_light_only').name('Sun Light Only');
folder.add(options, 'true_size').name('True Size');
folder.add(options, 'earth_view').name('Earth View');
folder.add(options, 'hide_background').name('Hide Background');
folder.add(options, 'distance_multiplier', 1, 2).name('Distance Multiplier');
folder.add(options, 'show_labels').name('Show Labels');
folder.add(options, 'animate_rotation').name('Animate Rotation');

// start at t
// all planets lined up at t = 0
var t = 500;

function animate() {
    requestAnimationFrame( animate );

    // animate axis rotation
    if(options.animate_rotation) {
        sun.rotation.y += ROTATION_MULTIPLIER * AXIS_ROTATION_SUN;
        for (var i = 0; i < planets.children.length; i++){
            planets.children[i].rotation.y += ROTATION_MULTIPLIER * AXIS_ROTATION[i];
        };
    }

    //animate orbits
    if (options.orbit_animation) {
        for (var i = 0; i < planets.children.length; i++){
            planets.children[i].position.set(
                Math.sin(t * ORBIT_SPEED[i] * options.orbit_speed_multiplier) * (orbit_radius[i] * options.distance_multiplier),
                0,
                Math.cos(t * ORBIT_SPEED[i] * options.orbit_speed_multiplier) * (orbit_radius[i] * options.distance_multiplier)
            )
        };

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
    // show/hide planet labels
    if (options.show_labels) {
        mercuryLabel.visible = true;
        venusLabel.visible = true;
        earthLabel.visible = true;
        marsLabel.visible = true;
        jupiterLabel.visible = true;
        saturnLabel.visible = true;
        uranusLabel.visible = true;
        neptuneLabel.visible = true;
    } else {
        mercuryLabel.visible = false;
        venusLabel.visible = false;
        earthLabel.visible = false;
        marsLabel.visible = false;
        jupiterLabel.visible = false;
        saturnLabel.visible = false;
        uranusLabel.visible = false;
        neptuneLabel.visible = false;
    }

    if (options.hide_background) {bg.material.color = new THREE.Color(0x000000);}
    else {bg.material.color = new THREE.Color(0xFFFFFF);}

    renderer.render( scene, camera );
    labelRenderer.render( scene, camera);

    if (options.orbit_animation){t += Math.PI / 180 * 2;}
}

animate();