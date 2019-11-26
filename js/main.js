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

var camera, scene, renderer;
var mesh;

init();
animate();

function init() {

    var distance_between = 1;
    var inner_planet_radius_multiplier = 15;
    var outer_planet_radius_multiplier = 4.5;

    //camera
    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.z = 500;

    scene = new THREE.Scene();

    var gui = new GUI();
    var folder = gui.addFolder( 'Solar System Control' );
    // folder.add( data, 'width', 1, 30 ).onChange( generateGeometry );
    // folder.add( data, 'height', 1, 30 ).onChange( generateGeometry );
    // folder.add( data, 'depth', 1, 30 ).onChange( generateGeometry );
    // folder.add( data, 'widthSegments', 1, 10 ).step( 1 ).onChange( generateGeometry );
    // folder.add( data, 'heightSegments', 1, 10 ).step( 1 ).onChange( generateGeometry );
    // folder.add( data, 'depthSegments', 1, 10 ).step( 1 ).onChange( generateGeometry );

    //background
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
    // scene.background = bgTexture;
    
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

    scene.add( lights[ 0 ] );
    scene.add( lights[ 1 ] );
    scene.add( lights[ 2 ] );
    scene.add( lights[ 3 ] );

    //texture
    var group = new THREE.Group();

    //sun
    var sunGeometry = new THREE.SphereGeometry( RADIUS_SUN, 80, 60, 0, Math.PI*2, 0, Math.PI );
    var sunTexture = new THREE.TextureLoader().load( './texture/2k_sun.jpg' );
    var sunMaterial = new THREE.MeshLambertMaterial( { map: sunTexture } );
    var sun = new THREE.Mesh( sunGeometry, sunMaterial );
    group.add( sun );

    var endPosX = sun.position.x + sunGeometry.parameters.radius;

    //sun glow
    var spriteMaterial = new THREE.SpriteMaterial( 
    {
        map: new THREE.TextureLoader().load( './texture/glow.png' ), 
        color: 0xfffb00, transparent: true, blending: THREE.AdditiveBlending
    });
    var sprite = new THREE.Sprite( spriteMaterial );
    sprite.scale.set(260, 260, 1.0);
    sun.add( sprite );
    
    //mercury
    var mercuryGeometry = new THREE.SphereGeometry( RADIUS_SUN * RADIUS_MULTIPLIER_MERCURY * inner_planet_radius_multiplier, 80, 60, 0, Math.PI*2, 0, Math.PI );
    var mercuryTexture = new THREE.TextureLoader().load( './texture/2k_mercury.jpg' );
    var mercuryMaterial = new THREE.MeshLambertMaterial( { map: mercuryTexture } );
    var mercury = new THREE.Mesh( mercuryGeometry, mercuryMaterial );
    mercury.position.set(endPosX + mercuryGeometry.parameters.radius + distance_between, 0, 0);
    endPosX = mercury.position.x + mercuryGeometry.parameters.radius;
    group.add( mercury );

    //venus
    var venusGeometry = new THREE.SphereGeometry( RADIUS_SUN * RADIUS_MULTIPLIER_VENUS * inner_planet_radius_multiplier, 80, 60, 0, Math.PI*2, 0, Math.PI );
    var venusTexture = new THREE.TextureLoader().load( './texture/2k_venus_surface.jpg' );
    var venusMaterial = new THREE.MeshLambertMaterial( { map: venusTexture } );
    var venus = new THREE.Mesh( venusGeometry, venusMaterial );
    venus.position.set(endPosX + venusGeometry.parameters.radius + distance_between, 0, 0);
    endPosX = venus.position.x + venusGeometry.parameters.radius;
    group.add( venus );

    //earth
    var earthGeometry = new THREE.SphereGeometry( RADIUS_SUN * RADIUS_MULPIPLIER_EARTH * inner_planet_radius_multiplier, 80, 60, 0, Math.PI*2, 0, Math.PI );
    var earthTexture = new THREE.TextureLoader().load( './texture/2k_earth_daymap.jpg' );
    var earthMaterial = new THREE.MeshLambertMaterial( { map: earthTexture } );
    var earth = new THREE.Mesh( earthGeometry, earthMaterial );
    earth.position.set(endPosX + earthGeometry.parameters.radius + distance_between, 0, 0);
    endPosX = earth.position.x + earthGeometry.parameters.radius;
    group.add( earth );

    //mars
    var marsGeometry = new THREE.SphereGeometry( RADIUS_SUN * RADIUS_MULTIPLIER_MARS * inner_planet_radius_multiplier, 80, 60, 0, Math.PI*2, 0, Math.PI );
    var marsTexture = new THREE.TextureLoader().load( './texture/2k_mars.jpg' );
    var marsMaterial = new THREE.MeshLambertMaterial( { map: marsTexture } );
    var mars = new THREE.Mesh( marsGeometry, marsMaterial );
    mars.position.set(endPosX + marsGeometry.parameters.radius + distance_between, 0, 0);
    endPosX = mars.position.x + marsGeometry.parameters.radius;
    group.add( mars );

    //jupiter
    var jupiterGeometry = new THREE.SphereGeometry( RADIUS_SUN * RADIUS_MULTIPLIER_JUPITER * outer_planet_radius_multiplier, 80, 60, 0, Math.PI*2, 0, Math.PI );
    var jupiterTexture = new THREE.TextureLoader().load( './texture/2k_jupiter.jpg' );
    var jupiterMaterial = new THREE.MeshLambertMaterial( { map: jupiterTexture } );
    var jupiter = new THREE.Mesh( jupiterGeometry, jupiterMaterial );
    jupiter.position.set(endPosX + jupiterGeometry.parameters.radius + distance_between, 0, 0);
    endPosX = jupiter.position.x + jupiterGeometry.parameters.radius;
    group.add( jupiter );

    //saturn
    var saturnGeometry = new THREE.SphereGeometry( RADIUS_SUN * RADIUS_MULTIPLIER_SATURN * outer_planet_radius_multiplier, 80, 60, 0, Math.PI*2, 0, Math.PI );
    var saturnTexture = new THREE.TextureLoader().load( './texture/2k_saturn.jpg' );
    var saturnMaterial = new THREE.MeshLambertMaterial( { map: saturnTexture } );
    var saturn = new THREE.Mesh( saturnGeometry, saturnMaterial );
    saturn.position.set(endPosX + saturnGeometry.parameters.radius + distance_between, 0, 0);
    endPosX = saturn.position.x + saturnGeometry.parameters.radius;
    group.add( saturn );

    //saturn rings
    var saturnRGeometry = new THREE.RingBufferGeometry( RADIUS_SUN * RADIUS_MULTIPLIER_SATURN * outer_planet_radius_multiplier *  1.2, RADIUS_SUN * RADIUS_MULTIPLIER_SATURN * outer_planet_radius_multiplier* 1.95, 64);

    var saturnRTexture = new THREE.TextureLoader().load( './texture/saturn_ring2.jpg' );
    var saturnRMaterial = new THREE.MeshLambertMaterial( { map: saturnRTexture, side: THREE.DoubleSide, transparent: false } );
    var saturnR = new THREE.Mesh( saturnRGeometry, saturnRMaterial );
    saturnR.rotateY(THREE.Math.degToRad(90));
    saturnR.rotateX(THREE.Math.degToRad(45));
    saturn.add( saturnR );

    //uranus
    var uranusGeometry = new THREE.SphereGeometry( RADIUS_SUN * RADIUS_MULTIPLIER_URANUS * outer_planet_radius_multiplier, 80, 60, 0, Math.PI*2, 0, Math.PI );
    var uranusTexture = new THREE.TextureLoader().load( './texture/2k_uranus.jpg' );
    var uranusMaterial = new THREE.MeshLambertMaterial( { map: uranusTexture } );
    var uranus = new THREE.Mesh( uranusGeometry, uranusMaterial );
    uranus.position.set(endPosX + uranusGeometry.parameters.radius + distance_between, 0, 0);
    endPosX = uranus.position.x + uranusGeometry.parameters.radius;
    group.add( uranus );

    //neptune
    var neptuneGeometry = new THREE.SphereGeometry( RADIUS_SUN * RADIUS_MULTIPLIER_NEPTUNE * outer_planet_radius_multiplier, 80, 60, 0, Math.PI*2, 0, Math.PI );
    var neptuneTexture = new THREE.TextureLoader().load( './texture/2k_neptune.jpg' );
    var neptuneMaterial = new THREE.MeshLambertMaterial( { map: neptuneTexture } );
    var neptune = new THREE.Mesh( neptuneGeometry, neptuneMaterial );
    neptune.position.set(endPosX + neptuneGeometry.parameters.radius + distance_between, 0, 0);
    endPosX = neptune.position.x + neptuneGeometry.parameters.radius;
    group.add( neptune );

    scene.add( group );

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    var orbit = new OrbitControls( camera, renderer.domElement );
    orbit.enableZoom = true;

    //

    window.addEventListener( 'resize', onWindowResize, false );

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

function animate() {

    requestAnimationFrame( animate );

    // mesh.rotation.x += 0.005;
    // mesh.rotation.y += 0.01;

    // earth.rotation.y += 0.002;

    renderer.render( scene, camera );

}