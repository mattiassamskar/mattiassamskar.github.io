import * as THREE from "three";

export interface Planet {
  image: string;
  url: string;
  distance: number;
  speed: number;
  size: number;
  tilt: number;
  angle: number;
  mesh: THREE.Mesh | null;
}

var parentElement: HTMLElement;
var scene: THREE.Scene;
var camera: THREE.PerspectiveCamera;
var renderer: THREE.Renderer;
var raycaster: THREE.Raycaster;
var mouse: THREE.Vector2;
var box: THREE.Mesh;
var stars: THREE.Mesh[] = [];

var planets: Planet[] = [
  {
    image: "./img/linkedin.png",
    url: "https://se.linkedin.com/in/mattiassamskar",
    distance: 500,
    speed: 0.007,
    size: 23,
    tilt: -1,
    angle: 0,
    mesh: null
  },
  {
    image: "./img/github.jpg",
    url: "https://github.com/mattiassamskar",
    distance: 360,
    speed: 0.008,
    size: 25,
    tilt: 1,
    angle: 0,
    mesh: null
  },
  {
    image: "./img/twitter.jpg",
    url: "https://twitter.com/mattiassamskar",
    distance: 420,
    speed: 0.009,
    size: 20,
    tilt: -1,
    angle: 0,
    mesh: null
  },
  {
    image: "./img/facebook.png",
    url: "https://facebook.com/mattias.samskar",
    distance: 400,
    speed: 0.011,
    size: 15,
    tilt: 1,
    angle: 0,
    mesh: null
  },
  {
    image: "./img/instagram.jpg",
    url: "https://www.instagram.com/mattiassamskar/",
    distance: 260,
    speed: 0.015,
    size: 16,
    tilt: -1,
    angle: 0,
    mesh: null
  }
];

var initStars = () => {
  for (var i = -2000; i < 1000; i += 20) {
    var geometry = new THREE.CircleGeometry(3);
    var material = new THREE.MeshBasicMaterial({ color: 0xcccccc });
    var star = new THREE.Mesh(geometry, material);
    setMeshStartPosition(star, i);
    stars.push(star);
    scene.add(star);
  }
};

var initBox = () => {
  var geometry = new THREE.BoxGeometry(60, 60, 60);
  var map = new THREE.TextureLoader().load("./img/mattias.jpg");
  var material = new THREE.MeshBasicMaterial({ color: 0xffffff, map: map });
  box = new THREE.Mesh(geometry, material);
  box.position.set(0, 0, 0);
  scene.add(box);
};

var initPlanets = () => {
  planets.forEach(function(planet) {
    var geometry = new THREE.SphereGeometry(planet.size, 50, 50);
    var map = new THREE.TextureLoader().load(planet.image);
    var material = new THREE.MeshBasicMaterial({ color: 0xffffff, map: map });
    planet.mesh = new THREE.Mesh(geometry, material);
    planet.mesh.userData = planet.url as any;
    planet.angle = Math.random() * 10;
    scene.add(planet.mesh);
  });
};

var setMeshStartPosition = (mesh: THREE.Mesh, z: number) => {
  var width = parentElement.offsetWidth;
  var height = parentElement.offsetHeight;

  mesh.position.x = 3 * (Math.random() * width - width / 2);
  mesh.position.y = 3 * (Math.random() * height - height / 2);
  mesh.position.z = z;
};

var animateStars = () => {
  stars.forEach((star: THREE.Mesh) => {
    star.position.z += 15;
    if (star.position.z > 1000) {
      setMeshStartPosition(star, -2000);
    }
  });
};

var animateBox = () => {
  box.rotation.x += 0.01;
  box.rotation.y += 0.005;
  box.rotation.z += 0.015;
};

var animatePlanets = () => {
  planets.forEach((planet: Planet) => {
    var x = planet.distance * Math.cos(planet.angle * planet.tilt);
    var y = (planet.distance * Math.sin(planet.angle * planet.tilt)) / 3;
    var z = planet.distance * Math.sin(planet.angle);
    planet.mesh!.position.set(x, y, z);
    planet.mesh!.rotation.y += planet.speed;
    planet.angle += planet.speed;
  });
};

var onElementResize = () => {
  renderer.setSize(parentElement.offsetWidth, parentElement.offsetHeight);
  camera.aspect = parentElement.offsetWidth / parentElement.offsetHeight;
  camera.updateProjectionMatrix();
};

export const onElementMouseDown = (event: MouseEvent) => {
  event.preventDefault();
  mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
  mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  var intersects = raycaster.intersectObjects(
    planets.map((planet: Planet) => planet.mesh!)
  );
  if (intersects.length > 0) {
    window.open(intersects[0].object.userData as any);
  }
};

export const onElementTouchStart = (event: any) => {
  event.preventDefault();
  event.clientX = event.touches[0].clientX;
  event.clientY = event.touches[0].clientY;
  onElementMouseDown(event);
};

export const init = (htmlElement: HTMLElement) => {
  parentElement = htmlElement;
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    40,
    parentElement.offsetWidth / parentElement.offsetHeight,
    1,
    5000
  );
  camera.position.z = 1000;
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(parentElement.offsetWidth, parentElement.offsetHeight);
  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();

  parentElement.appendChild(renderer.domElement);
  window.addEventListener("resize", onElementResize, false);
  parentElement.addEventListener("mousedown", onElementMouseDown, false);
  parentElement.addEventListener("touchstart", onElementTouchStart, false);

  initStars();
  initBox();
  initPlanets();
};

export const animate = () => {
  requestAnimationFrame(animate);
  animateStars();
  animateBox();
  animatePlanets();
  renderer.render(scene, camera);
};
