import * as THREE from "three";
import { WorkTimelinePoint } from "../types";

export const WORK_TIMELINE: WorkTimelinePoint[] = [
  {
    point: new THREE.Vector3(0, 0, 0),
    year: '2025',
    title: 'СамГТУ',
    subtitle: 'Бакалавр, Pipeline Engineer',
    position: 'right',
  },
  {
    point: new THREE.Vector3(-4, -4, -3),
    year: '2024—2025',
    title: 'AH (HR tech)',
    subtitle: 'Product Manager',
    position: 'left',
  },
  {
    point: new THREE.Vector3(-3, -1, -6),
    year: '2025—2026',
    title: 'Статица — Juridex',
    subtitle: 'Product Manager',
    position: 'left',
  },
  {
    point: new THREE.Vector3(0, -1, -10),
    year: new Date().toLocaleDateString('default', { year: 'numeric' }),
    title: '?',
    subtitle: '???',
    position: 'right',
  }
]
