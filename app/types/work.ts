import * as THREE from "three";

export interface WorkTimelinePoint {
  point: THREE.Vector3,
  year: string,
  title: string,
  subtitle?: string,
  description?: string,
  links?: { label: string, url: string, previewUrl: string }[],
  position: 'left' | 'right',
}
