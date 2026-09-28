import { usePortalStore, useScrollStore } from "@stores";
import * as THREE from "three";
import { Memory } from "../../models/Memory";
import { WorkNightSky } from "../../models/WorkNightSky";
import { WorkMountain } from "../../models/WorkMountain";
import { WorkContact } from "../../models/WorkContact";
import Timeline from "./Timeline";

const Work = () => {
  const isActive = usePortalStore((state) => state.activePortalId === 'work');
  const scrollProgress = useScrollStore((state) => state.scrollProgress);

  return (
    <group>
      <WorkNightSky active={isActive} />
      <WorkMountain position={[9, 3.4, -40]} scale={[1.5, 1, 1.6]} />
      <WorkContact active={isActive && scrollProgress > 0.92} position={[-8, 4.8, -26]} scale={1.25} />
      <mesh receiveShadow>
        <planeGeometry args={[4, 4, 1]} />
        <shadowMaterial opacity={0.1} />
      </mesh>
      <Memory nightScene scale={new THREE.Vector3(5, 5, 5)} position={new THREE.Vector3(0, -6, 1)}/>
      <Timeline progress={isActive ? scrollProgress : 0} />
    </group>
  );
};

export default Work;
