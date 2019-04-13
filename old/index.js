/// <reference path="../typings/index.d.ts" />
var scene;
var camera;
var renderer;
var raycaster;
var mouse;
var box;
var stars = [];
var planets = [
    {
        image: './img/linkedin.png',
        url: 'https://se.linkedin.com/in/mattiassamskar',
        distance: 500,
        speed: 0.007,
        size: 23,
        tilt: -1,
        angle: 0,
        mesh: null
    },
    {
        image: './img/github.jpg',
        url: 'https://github.com/mattiassamskar',
        distance: 360,
        speed: 0.008,
        size: 25,
        tilt: 1,
        angle: 0,
        mesh: null
    },
    {
        image: './img/twitter.jpg',
        url: 'https://twitter.com/mattiassamskar',
        distance: 420,
        speed: 0.009,
        size: 20,
        tilt: -1,
        angle: 0,
        mesh: null
    },
    {
        image: './img/facebook.png',
        url: 'https://facebook.com/mattias.samskar',
        distance: 400,
        speed: 0.011,
        size: 15,
        tilt: 1,
        angle: 0,
        mesh: null
    },
    {
        image: './img/instagram.jpg',
        url: 'https://www.instagram.com/mattiassamskar/',
        distance: 260,
        speed: 0.015,
        size: 16,
        tilt: -1,
        angle: 0,
        mesh: null
    },
];
var initStars = function () {
    for (var i = -2000; i < 1000; i += 20) {
        var geometry = new THREE.CircleGeometry(3);
        var material = new THREE.MeshBasicMaterial({ color: 0xcccccc });
        var star = new THREE.Mesh(geometry, material);
        setMeshStartPosition(star, i);
        stars.push(star);
        scene.add(star);
    }
};
var initBox = function () {
    var geometry = new THREE.BoxGeometry(60, 60, 60);
    var map = new THREE.TextureLoader().load("./img/mattias.jpg");
    var material = new THREE.MeshBasicMaterial({ color: 0xffffff, map: map });
    box = new THREE.Mesh(geometry, material);
    box.position.set(0, 0, 0);
    scene.add(box);
};
var initPlanets = function () {
    planets.forEach(function (planet) {
        var geometry = new THREE.SphereGeometry(planet.size, 50, 50);
        var map = new THREE.TextureLoader().load(planet.image);
        var material = new THREE.MeshBasicMaterial({ color: 0xffffff, map: map });
        planet.mesh = new THREE.Mesh(geometry, material);
        planet.mesh.userData = planet.url;
        planet.angle = Math.random() * 10;
        scene.add(planet.mesh);
    });
};
var setMeshStartPosition = function (mesh, z) {
    var width = window.innerWidth;
    var height = window.innerHeight;
    mesh.position.x = 3 * (Math.random() * width - width / 2);
    mesh.position.y = 3 * (Math.random() * height - height / 2);
    mesh.position.z = z;
};
var animateStars = function () {
    stars.forEach(function (star) {
        star.position.z += 15;
        if (star.position.z > 1000) {
            setMeshStartPosition(star, -2000);
        }
    });
};
var animateBox = function () {
    box.rotation.x += 0.01;
    box.rotation.y += 0.005;
    box.rotation.z += 0.015;
};
var animatePlanets = function () {
    planets.forEach(function (planet) {
        var x = planet.distance * Math.cos(planet.angle * planet.tilt);
        var y = planet.distance * Math.sin(planet.angle * planet.tilt) / 3;
        var z = planet.distance * Math.sin(planet.angle);
        planet.mesh.position.set(x, y, z);
        planet.mesh.rotation.y += planet.speed;
        planet.angle += planet.speed;
    });
};
var onWindowResize = function () {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
};
var onDocumentMouseDown = function (event) {
    event.preventDefault();
    mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
    mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    var intersects = raycaster.intersectObjects(planets.map(function (planet) { return planet.mesh; }));
    if (intersects.length > 0) {
        window.open(intersects[0].object.userData);
    }
};
var onDocumentTouchStart = function (event) {
    event.preventDefault();
    event.clientX = event.touches[0].clientX;
    event.clientY = event.touches[0].clientY;
    onDocumentMouseDown(event);
};
var init = function () {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 5000);
    camera.position.z = 1000;
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();
    document.body.appendChild(renderer.domElement);
    window.addEventListener('resize', onWindowResize, false);
    document.addEventListener('mousedown', onDocumentMouseDown, false);
    document.addEventListener('touchstart', onDocumentTouchStart, false);
    initStars();
    initBox();
    initPlanets();
};
var animate = function () {
    requestAnimationFrame(animate);
    animateStars();
    animateBox();
    animatePlanets();
    renderer.render(scene, camera);
};
init();
animate();
