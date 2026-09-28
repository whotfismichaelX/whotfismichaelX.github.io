import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const ignoreRaycast = () => {};

const skyVertexShader = /* glsl */ `
  varying vec3 vDirection;
  void main() {
    vDirection = normalize(position);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const skyFragmentShader = /* glsl */ `
  varying vec3 vDirection;
  void main() {
    float elevation = normalize(vDirection).y;
    vec3 horizon = vec3(0.105, 0.104, 0.145);
    vec3 midnight = vec3(0.020, 0.034, 0.078);
    vec3 zenith = vec3(0.008, 0.014, 0.037);
    vec3 color = mix(horizon, midnight, smoothstep(-0.02, 0.33, elevation));
    color = mix(color, zenith, smoothstep(0.22, 0.95, elevation));
    gl_FragColor = vec4(color, 1.0);
    #include <colorspace_fragment>
  }
`;

const starVertexShader = /* glsl */ `
  attribute float aSize;
  attribute float aPhase;
  attribute float aWarmth;
  uniform float uPixelRatio;
  varying float vPhase;
  varying float vWarmth;
  varying float vElevation;
  void main() {
    vPhase = aPhase;
    vWarmth = aWarmth;
    vElevation = normalize(position).y;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * uPixelRatio;
  }
`;

const starFragmentShader = /* glsl */ `
  uniform float uTime;
  varying float vPhase;
  varying float vWarmth;
  varying float vElevation;
  void main() {
    float radius = length(gl_PointCoord - vec2(0.5));
    float alpha = 1.0 - smoothstep(0.10, 0.50, radius);
    float twinkle = 0.83 + 0.12 * sin(uTime * 0.65 + vPhase);
    float haze = smoothstep(0.015, 0.22, vElevation);
    vec3 color = mix(vec3(0.70, 0.80, 1.0), vec3(1.0, 0.88, 0.71), vWarmth);
    gl_FragColor = vec4(color, alpha * twinkle * haze * 0.82);
    #include <colorspace_fragment>
  }
`;

/** The Work portal's local Y axis is up; the desert surface sits at Y = -6. */
export function WorkNightSky({ active = true }: { active?: boolean }) {
  const starMaterial = useRef<THREE.ShaderMaterial>(null);
  const gl = useThree((state) => state.gl);
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uPixelRatio: { value: Math.min(gl.getPixelRatio(), 2) },
  }), [gl]);

  const stars = useMemo(() => {
    const count = 1100;
    const position = new Float32Array(count * 3);
    const size = new Float32Array(count);
    const phase = new Float32Array(count);
    const warmth = new Float32Array(count);
    let seed = 73129;
    const random = () => {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      return seed / 4294967296;
    };

    for (let index = 0; index < count; index += 1) {
      const azimuth = random() * Math.PI * 2;
      // Uniform sampling over the upper hemisphere, with a clear horizon.
      const elevation = 0.025 + random() * 0.975;
      const horizontal = Math.sqrt(1 - elevation * elevation);
      position.set([
        Math.cos(azimuth) * horizontal * 130,
        elevation * 130,
        Math.sin(azimuth) * horizontal * 130,
      ], index * 3);
      size[index] = 1.1 + Math.pow(random(), 4) * 1.7;
      phase[index] = random() * Math.PI * 2;
      warmth[index] = random() > 0.84 ? 1 : random() * 0.25;
    }

    return { position, size, phase, warmth };
  }, []);

  useFrame((_, delta) => {
    if (active && starMaterial.current) {
      starMaterial.current.uniforms.uTime.value += Math.min(delta, 0.05);
    }
  });

  return (
    <group position={[0, -6, 0]}>
      <mesh raycast={ignoreRaycast} frustumCulled={false} renderOrder={-1000}>
        <sphereGeometry args={[150, 32, 24]} />
        <shaderMaterial
          vertexShader={skyVertexShader}
          fragmentShader={skyFragmentShader}
          side={THREE.BackSide}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
      <points raycast={ignoreRaycast} frustumCulled={false} renderOrder={-999}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[stars.position, 3]} />
          <bufferAttribute attach="attributes-aSize" args={[stars.size, 1]} />
          <bufferAttribute attach="attributes-aPhase" args={[stars.phase, 1]} />
          <bufferAttribute attach="attributes-aWarmth" args={[stars.warmth, 1]} />
        </bufferGeometry>
        <shaderMaterial
          ref={starMaterial}
          uniforms={uniforms}
          vertexShader={starVertexShader}
          fragmentShader={starFragmentShader}
          transparent
          depthWrite={false}
          toneMapped={false}
        />
      </points>
    </group>
  );
}
