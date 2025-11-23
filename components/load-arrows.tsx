"use client";

import { useMemo } from "react";
import { calculateLoad } from "@/lib/beam-formulas";

interface LoadArrowsProps {
  w0: number;
}

export function LoadArrows({ w0 }: LoadArrowsProps) {
  const arrows = useMemo(() => {
    const numArrows = 15;
    const beamLength = 10;
    const arrowData = [];

    for (let i = 0; i <= numArrows; i++) {
      const x = (i / numArrows) * beamLength;
      const load = calculateLoad(x, w0);
      const arrowLength = (load / (3 * w0)) * 1.2;

      arrowData.push({
        position: x - beamLength / 2,
        length: arrowLength,
      });
    }

    return arrowData;
  }, [w0]);

  return (
    <group>
      {arrows.map((arrow, i) => (
        <group key={i} position={[arrow.position, 2, 0]}>
          <mesh position={[0, -arrow.length / 2, 0]}>
            <cylinderGeometry args={[0.015, 0.015, arrow.length, 6]} />
            <meshStandardMaterial
              color="#ef4444"
              emissive="#ef4444"
              emissiveIntensity={0.1}
            />
          </mesh>

          <mesh position={[0, -arrow.length, 0]} rotation={[Math.PI, 0, 0]}>
            <coneGeometry args={[0.06, 0.12, 6]} />
            <meshStandardMaterial
              color="#ef4444"
              emissive="#ef4444"
              emissiveIntensity={0.1}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}
