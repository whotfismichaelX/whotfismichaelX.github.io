import { useMemo } from 'react';
import * as THREE from 'three';

type Peak = { x: number; height: number; width: number };
type Range = {
  depth: number;
  base: number;
  peaks: Peak[];
  shade: string;
  light: string;
  highlight: string;
};

const RANGES: Range[] = [
  {
    depth: -32,
    base: 5.2,
    peaks: [
      { x: -35, height: 4.4, width: 17 },
      { x: -13, height: 3.4, width: 15 },
      { x: 12, height: 4.5, width: 18 },
      { x: 36, height: 4.0, width: 16 },
    ],
    shade: '#aeb6ba',
    light: '#c9cbca',
    highlight: '#dedbd2',
  },
  {
    depth: -21,
    base: 3.5,
    peaks: [
      { x: -34, height: 3.7, width: 16 },
      { x: -10, height: 2.7, width: 15 },
      { x: 18, height: 3.8, width: 17 },
      { x: 40, height: 3.2, width: 14 },
    ],
    shade: '#858e90',
    light: '#b5b3aa',
    highlight: '#d0c8b9',
  },
];

function makeRange(range: Range) {
  const positions: number[] = [];
  const colors: number[] = [];
  const shade = new THREE.Color(range.shade);
  const light = new THREE.Color(range.light);
  const highlight = new THREE.Color(range.highlight);

  const triangle = (a: number[], b: number[], c: number[], color: THREE.Color) => {
    positions.push(...a, ...b, ...c);
    for (let i = 0; i < 3; i++) colors.push(color.r, color.g, color.b);
  };

  range.peaks.forEach((peak, index) => {
    const left = peak.x - peak.width;
    const right = peak.x + peak.width;
    const center = peak.x + peak.width * 0.16;
    const foot = range.base - 0.4;
    const summit = range.base + peak.height;
    const z = range.depth + index * 0.15;
    const l = [left, foot, z];
    const m = [center, foot, z + 1.1];
    const r = [right, foot, z];
    const top = [peak.x, summit, z - 1.8];
    const shoulder = [peak.x - peak.width * 0.34, range.base + peak.height * 0.55, z + 0.5];

    triangle(l, shoulder, m, shade);
    triangle(shoulder, top, m, light);
    triangle(m, top, r, shade.clone().lerp(light, 0.36));
    triangle(shoulder, l, top, highlight.clone().lerp(light, 0.55));
    triangle(l, r, [peak.x, foot, z - 3], shade);
    triangle(l, [peak.x, foot, z - 3], top, light);
    triangle([peak.x, foot, z - 3], r, top, shade);
  });

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  geometry.computeVertexNormals();
  return geometry;
}

export function MountainBackdrop() {
  const geometries = useMemo(() => RANGES.map(makeRange), []);

  return (
    <group>
      {geometries.map((geometry, index) => (
        <mesh key={index} geometry={geometry} frustumCulled={false}>
          <meshBasicMaterial vertexColors side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );
}
