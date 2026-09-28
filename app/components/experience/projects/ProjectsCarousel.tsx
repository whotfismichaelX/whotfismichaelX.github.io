import { useEffect, useMemo, useState } from "react";
import { isMobile } from "react-device-detect";
import ProjectTile from "./ProjectTile";

import { PROJECTS } from "@constants";
import { usePortalStore } from "@stores";

const ProjectsCarousel = () => {
  const [activeId, setActiveId] = useState<number | null>(null);
  const isActive = usePortalStore((state) => state.activePortalId === "projects");

  useEffect(() => {
    if (!isActive) setActiveId(null);
  }, [isActive]);

  const onClick = (id: number) => {
    if (!isMobile) return;
    setActiveId(id === activeId ? null : id);
  };

  const tiles = useMemo(() => {
    const spread = Math.PI * 2 / 3;
    const distance = 13;
    const count = PROJECTS.length;

    return PROJECTS.map((project, i) => {
      const angle = count === 1 ? 0 : -spread / 2 + spread * i / (count - 1);
      const z = -distance * Math.cos(angle);
      const x = distance * Math.sin(angle);
      const rotY = -angle;

      return (
        <ProjectTile
          key={project.title}
          project={project}
          index={i}
          position={[x, 1, z]}
          rotation={[0, rotY, 0]}
          activeId={activeId}
          onClick={() => onClick(i)}
        />
      );
    });
  }, [activeId]);

  return (
    <group>
      {tiles}
    </group>
  );
};

export default ProjectsCarousel;
