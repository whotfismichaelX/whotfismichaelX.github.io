import { ThreeElements } from '@react-three/fiber';
import { useEffect, useMemo } from 'react';
import * as THREE from 'three';

// The relief is a single continuous surface. Its moonlight is baked into the
// vertex colours so the surrounding portal does not need extra scene lights.
const WIDTH = 12;
const DEPTH = 8;
const COLUMNS = 96;
const ROWS = 72;

const smoothstep = (low: number, high: number, value: number) => {
  const t = THREE.MathUtils.clamp((value - low) / (high - low), 0, 1);
  return t * t * (3 - 2 * t);
};

function hash(x: number, z: number) {
  const value = Math.sin(x * 127.1 + z * 311.7 + 19.83) * 43758.5453;
  return value - Math.floor(value);
}

function noise(x: number, z: number) {
  const ix = Math.floor(x);
  const iz = Math.floor(z);
  const tx = x - ix;
  const tz = z - iz;
  const sx = tx * tx * tx * (tx * (tx * 6 - 15) + 10);
  const sz = tz * tz * tz * (tz * (tz * 6 - 15) + 10);
  return THREE.MathUtils.lerp(
    THREE.MathUtils.lerp(hash(ix, iz), hash(ix + 1, iz), sx),
    THREE.MathUtils.lerp(hash(ix, iz + 1), hash(ix + 1, iz + 1), sx),
    sz,
  ) * 2 - 1;
}

function fractal(x: number, z: number) {
  return noise(x, z) * 0.58
    + noise(x * 2.07 + 11.2, z * 2.07 - 4.3) * 0.27
    + noise(x * 4.31 - 7.8, z * 4.31 + 19.1) * 0.11
    + noise(x * 8.69 + 2.4, z * 8.69 + 8.5) * 0.04;
}

function elevation(x: number, z: number) {
  const warpedX = x + fractal(x * 0.55 + 31, z * 0.55) * 0.48;
  const warpedZ = z + fractal(x * 0.55, z * 0.55 - 17) * 0.37;
  const radius = Math.hypot(warpedX / 6, warpedZ / 4);
  const footprint = 1 - smoothstep(0.66, 1, radius);
  if (footprint === 0) return 0;

  // Offset summits share a broad rock mass instead of separate conical meshes.
  const summit = (cx: number, cz: number, rx: number, rz: number, height: number) => {
    const dx = (warpedX - cx) / rx;
    const dz = (warpedZ - cz) / rz;
    return height * Math.exp(-(dx * dx + dz * dz) * 0.74);
  };
  const summits = [
    summit(-0.95, -0.62, 2.35, 2.05, 5.5),
    summit(1.80, 0.73, 2.20, 1.55, 4.35),
    summit(-3.10, 0.85, 1.65, 1.75, 3.05),
    summit(0.65, -2.25, 2.05, 1.15, 3.65),
  ];
  const highest = Math.max(...summits);
  const massif = highest + Math.log(summits.reduce((sum, h) => sum + Math.exp((h - highest) * 3), 0)) / 3;

  const broadRidges = fractal(warpedX * 0.82, warpedZ * 0.91);
  const crags = 1 - Math.abs(noise(warpedX * 2.1 + 8, warpedZ * 2.3 - 3));
  // Radial drainage cuts descend from the main summit, breaking up the slopes.
  const angle = Math.atan2(warpedZ + 0.62, warpedX + 0.95);
  const drainage = Math.pow(Math.abs(Math.sin(angle * 10 + broadRidges * 2.4)), 10);
  const rock = massif * (0.91 + broadRidges * 0.23)
    + crags * 0.18
    + fractal(warpedX * 3.4, warpedZ * 3.4) * 0.12
    - drainage * Math.min(0.48, massif * 0.11);

  return Math.max(0, rock) * footprint;
}

function createMountainGeometry() {
  const vertexCount = (COLUMNS + 1) * (ROWS + 1);
  const positions = new Float32Array(vertexCount * 3);
  const colors = new Float32Array(vertexCount * 3);
  const heights = new Float32Array(vertexCount);
  const indices: number[] = [];
  let maxHeight = 0;

  for (let row = 0; row <= ROWS; row++) {
    for (let column = 0; column <= COLUMNS; column++) {
      const index = row * (COLUMNS + 1) + column;
      const x = (column / COLUMNS - 0.5) * WIDTH;
      const z = (row / ROWS - 0.5) * DEPTH;
      const height = elevation(x, z);
      heights[index] = height;
      maxHeight = Math.max(maxHeight, height);
      positions[index * 3] = x;
      positions[index * 3 + 2] = z;
    }
  }

  for (let index = 0; index < vertexCount; index++) {
    positions[index * 3 + 1] = heights[index] * 6 / maxHeight;
  }

  for (let row = 0; row < ROWS; row++) {
    for (let column = 0; column < COLUMNS; column++) {
      const a = row * (COLUMNS + 1) + column;
      const b = a + 1;
      const c = a + COLUMNS + 1;
      const d = c + 1;
      // Leave out the flat square corners, preserving an irregular rock foot.
      if (Math.max(heights[a], heights[b], heights[c], heights[d]) < 0.015) continue;
      if ((row + column) % 2 === 0) indices.push(a, c, b, b, c, d);
      else indices.push(a, c, d, a, d, b);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  const normals = geometry.getAttribute('normal');
  const moonDirection = new THREE.Vector3(-0.62, 0.74, 0.28).normalize();
  const moonRock = new THREE.Color('#8296ae');
  const darkRock = new THREE.Color('#3e495d');
  const mineral = new THREE.Color('#8a898a');
  const palePeak = new THREE.Color('#c3cbd3');
  const footHaze = new THREE.Color('#263042');
  const normal = new THREE.Vector3();
  const color = new THREE.Color();

  for (let index = 0; index < vertexCount; index++) {
    const x = positions[index * 3];
    const y = positions[index * 3 + 1];
    const z = positions[index * 3 + 2];
    normal.fromBufferAttribute(normals, index);
    const moonlight = Math.max(0, normal.dot(moonDirection));
    const grain = fractal(x * 4.5 + 41, z * 4.5 - 28);
    const strata = Math.sin(y * 14 + fractal(x * 1.4, z * 1.4) * 3.8) * 0.5 + 0.5;
    const exposedMineral = smoothstep(0.35, 0.83, noise(x * 1.6 - 10, z * 1.6 + 4));
    const frost = smoothstep(4.15, 5.9, y + fractal(x * 3, z * 3) * 0.5)
      * smoothstep(0.24, 0.73, normal.y) * 0.78;

    color.copy(darkRock).lerp(moonRock, Math.pow(moonlight, 0.8));
    color.lerp(mineral, exposedMineral * 0.18);
    color.lerp(palePeak, frost);
    color.multiplyScalar(0.83 + grain * 0.16 + strata * 0.10);
    color.lerp(footHaze, (1 - smoothstep(0, 1.25, y)) * 0.55);
    color.toArray(colors, index * 3);
  }

  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geometry.computeBoundingSphere();
  return geometry;
}

export function WorkMountain(props: Omit<ThreeElements['group'], 'children'>) {
  const geometry = useMemo(createMountainGeometry, []);

  useEffect(() => () => geometry.dispose(), [geometry]);

  return (
    <group {...props}>
      <mesh geometry={geometry}>
        <meshBasicMaterial vertexColors />
      </mesh>
    </group>
  );
}
