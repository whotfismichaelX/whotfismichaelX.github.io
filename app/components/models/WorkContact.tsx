import { Text, useCursor } from '@react-three/drei';
import { ThreeElements, ThreeEvent } from '@react-three/fiber';
import { useEffect, useState } from 'react';
import { Mesh } from 'three';
import { FOOTER_LINKS } from '../../constants';

type WorkContactProps = Omit<ThreeElements['group'], 'children'> & {
  active: boolean;
};

const ignoreRaycast = () => {};
const font = './Vercetti-Regular.woff';

function ContactAction({
  label,
  url,
  x,
  active,
}: {
  label: string;
  url: string;
  x: number;
  active: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  useCursor(active && hovered);

  useEffect(() => {
    if (!active) setHovered(false);
  }, [active]);

  const openLink = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    if (active) window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <group position={[x, -1.02, 0.10]}>
      <mesh
        raycast={active ? Mesh.prototype.raycast : ignoreRaycast}
        onClick={openLink}
        onPointerOver={(event) => {
          event.stopPropagation();
          if (active) setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
      >
        <planeGeometry args={[2.27, 0.59]} />
        <meshBasicMaterial
          color={hovered ? '#42676d' : '#233b48'}
          transparent
          opacity={0.94}
          toneMapped={false}
        />
      </mesh>
      <Text
        font={font}
        fontSize={0.23}
        position={[0, 0, 0.01]}
        color={hovered ? '#ffffff' : '#d9e8e7'}
        anchorX="center"
        anchorY="middle"
        raycast={ignoreRaycast}
      >
        {label}
      </Text>
    </group>
  );
}

/** A small contact sign at the end of the Work timeline. */
export function WorkContact({ active, ...groupProps }: WorkContactProps) {
  const telegram = FOOTER_LINKS.find((link) => link.name === 'Telegram');
  const resume = FOOTER_LINKS.find((link) => link.name === 'Resume');

  return (
    <group {...groupProps} visible={active && groupProps.visible !== false}>
      <mesh raycast={ignoreRaycast}>
        <boxGeometry args={[5.5, 3.1, 0.12]} />
        <meshBasicMaterial color="#101c2a" transparent opacity={0.94} toneMapped={false} />
      </mesh>
      {([-1.55, 1.55] as const).map((y) => (
        <mesh key={`horizontal-${y}`} position={[0, y, 0.065]} raycast={ignoreRaycast}>
          <boxGeometry args={[5.5, 0.014, 0.014]} />
          <meshBasicMaterial color="#547279" toneMapped={false} />
        </mesh>
      ))}
      {([-2.75, 2.75] as const).map((x) => (
        <mesh key={`vertical-${x}`} position={[x, 0, 0.065]} raycast={ignoreRaycast}>
          <boxGeometry args={[0.014, 3.1, 0.014]} />
          <meshBasicMaterial color="#547279" toneMapped={false} />
        </mesh>
      ))}
      <mesh position={[-2.37, 1.18, 0.10]} raycast={ignoreRaycast}>
        <circleGeometry args={[0.033, 12]} />
        <meshBasicMaterial color="#a0d5c9" toneMapped={false} />
      </mesh>
      <Text
        font={font}
        fontSize={0.14}
        letterSpacing={0.06}
        position={[-2.21, 1.18, 0.10]}
        color="#a6bfbe"
        anchorX="left"
        anchorY="middle"
        raycast={ignoreRaycast}
      >
        ОТКРЫТ К ДИАЛОГУ
      </Text>
      <Text
        font={font}
        fontSize={0.37}
        lineHeight={1.16}
        position={[-2.4, 0.72, 0.10]}
        color="#eff2ef"
        anchorX="left"
        anchorY="top"
        raycast={ignoreRaycast}
      >
        {'ДАВАЙТЕ СОЗДАДИМ\nПРОДУКТ'}
      </Text>
      <Text
        font={font}
        fontSize={0.18}
        position={[-2.4, -0.34, 0.10]}
        color="#91a5b2"
        anchorX="left"
        anchorY="middle"
        raycast={ignoreRaycast}
      >
        AI · Product · Security
      </Text>
      {telegram && <ContactAction label="Telegram ↗" url={telegram.url} x={-1.23} active={active} />}
      {resume && <ContactAction label="Резюме ↓" url={resume.url} x={1.23} active={active} />}
    </group>
  );
}
