/// <reference path="../typings/index.d.ts" />

interface IPlanet {
  image: string;
  url: string;
  distance: number;
  speed: number;
  size: number;
  tilt: number;
  angle: number;
  mesh: THREE.Mesh;
}

class Planet implements IPlanet {
  public image: string;
  public url: string;
  public distance: number;
  public speed: number;
  public size: number;
  public tilt: number;
  public angle: number;
  public mesh: THREE.Mesh;
}
