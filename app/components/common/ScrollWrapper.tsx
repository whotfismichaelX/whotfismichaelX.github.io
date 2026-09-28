'use client';

import { useScroll } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useLayoutEffect, useRef } from "react";
import { isMobile } from "react-device-detect";
import * as THREE from "three";

import { usePortalStore, useScrollStore } from "@stores";

const ScrollWrapper = (props: { children: React.ReactNode | React.ReactNode[]}) => {
  const { camera } = useThree();
  const data = useScroll();
  const activePortalId = usePortalStore((state) => state.activePortalId);
  const isActive = !!activePortalId;
  const setScrollProgress = useScrollStore((state) => state.setScrollProgress);
  const previousPortal = useRef<string | null>(null);
  const pagePosition = useRef({ fraction: 0, offset: 0 });

  useLayoutEffect(() => {
    // One scroll element owns wheel, touch and pointer events in every scene.
    // Preserve the page position while Work uses its own 0–1 timeline range.
    if (activePortalId && !previousPortal.current) {
      pagePosition.current = {
        fraction: data.el.scrollTop / Math.max(1, data.el.scrollHeight - data.el.clientHeight),
        offset: data.offset,
      };
    }

    if (activePortalId === 'work') {
      data.el.scrollTop = 0;
      data.el.dispatchEvent(new Event('scroll'));
      data.offset = 0;
      data.delta = 0;
      setScrollProgress(0);
    } else if (previousPortal.current) {
      data.el.scrollTop = pagePosition.current.fraction * (data.el.scrollHeight - data.el.clientHeight);
      data.el.dispatchEvent(new Event('scroll'));
      data.offset = pagePosition.current.offset;
      data.delta = 0;
      setScrollProgress(pagePosition.current.offset);
    }

    data.el.style.overflowY = activePortalId === 'projects' ? 'hidden' : 'auto';
    data.el.style.overscrollBehavior = 'contain';
    data.el.dataset.scrollMode = activePortalId ?? 'page';
    previousPortal.current = activePortalId;
  }, [activePortalId, data, setScrollProgress]);

  useFrame((state, delta) => {
    if (data) {
      const a = data.range(0, 0.3);
      const b = data.range(0.3, 0.5);
      const d = data.range(0.85, 0.18);

      if (!isActive) {
        camera.rotation.x = THREE.MathUtils.damp(camera.rotation.x, -0.5 * Math.PI * a, 5, delta);
        camera.position.y = THREE.MathUtils.damp(camera.position.y, -37 * b, 7, delta);
        camera.position.z = THREE.MathUtils.damp(camera.position.z, 5 + 10 * d, 7, delta);

        setScrollProgress(data.range(0, 1));
      } else if (activePortalId === 'work') {
        setScrollProgress(THREE.MathUtils.clamp(data.offset, 0, 1));
      }

      // Move camera slightly on mouse movement.
      if (!isMobile && !isActive) {
        camera.rotation.y = THREE.MathUtils.lerp(camera.rotation.y, -(state.pointer.x * Math.PI) / 90, 0.05);
      }
    }
  });

  const children = Array.isArray(props.children) ? props.children : [props.children];

  return <>
    {children.map((child, index) => {
      return <group key={index}>
        {child}
      </group>
    })}
  </>
}

export default ScrollWrapper;
