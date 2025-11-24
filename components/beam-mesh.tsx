"use client";

import { useMemo, useEffect, useRef } from "react";
import { BufferGeometry, Float32BufferAttribute, Mesh } from "three";
import { calculateDeflection, generateBeamData } from "@/lib/beam-formulas";

interface BeamMeshProps {
  w0: number;
  EI: number;
  showOriginal: boolean;
  deformationScale: number;
  useServiceLimitColor: boolean;
}

export function BeamMesh({
  w0,
  EI,
  showOriginal,
  deformationScale,
  useServiceLimitColor,
}: BeamMeshProps) {
  const meshRef = useRef<Mesh>(null);

  const { deformedGeometry, originalGeometry } = useMemo(() => {
    const segments = 100;
    const beamLength = 10;
    const beamWidth = 0.4;
    const beamHeight = 0.6;

    const deformedGeo = new BufferGeometry();
    const indices: number[] = [];

    for (let i = 0; i < segments; i++) {
      const base = i * 4;
      const nextBase = (i + 1) * 4;

      indices.push(base, base + 1, nextBase + 1);
      indices.push(base, nextBase + 1, nextBase);

      indices.push(base + 2, base + 3, nextBase + 3);
      indices.push(base + 2, nextBase + 3, nextBase + 2);

      indices.push(base + 1, base + 2, nextBase + 2);
      indices.push(base + 1, nextBase + 2, nextBase + 1);

      indices.push(base + 3, base, nextBase);
      indices.push(base + 3, nextBase, nextBase + 3);
    }

    deformedGeo.setIndex(indices);
    deformedGeo.setAttribute(
      "position",
      new Float32BufferAttribute(new Array((segments + 1) * 12).fill(0), 3)
    );
    deformedGeo.setAttribute(
      "color",
      new Float32BufferAttribute(new Array((segments + 1) * 12).fill(0), 3)
    );

    const originalGeo = new BufferGeometry();
    const originalPositions: number[] = [];

    for (let i = 0; i <= segments; i++) {
      const x = (i / segments) * beamLength - beamLength / 2;
      const y = 0;

      originalPositions.push(x, y - beamHeight / 2, -beamWidth / 2);
      originalPositions.push(x, y + beamHeight / 2, -beamWidth / 2);
      originalPositions.push(x, y + beamHeight / 2, beamWidth / 2);
      originalPositions.push(x, y - beamHeight / 2, beamWidth / 2);
    }

    originalGeo.setIndex(indices);
    originalGeo.setAttribute(
      "position",
      new Float32BufferAttribute(originalPositions, 3)
    );
    originalGeo.computeVertexNormals();

    return {
      deformedGeometry: deformedGeo,
      originalGeometry: originalGeo,
    };
  }, []);

  useEffect(() => {
    if (!meshRef.current) return;

    const segments = 100;
    const beamLength = 10;
    const beamWidth = 0.4;
    const beamHeight = 0.6;

    const data = generateBeamData(w0, EI, segments);
    const maxDef = Math.max(...data.map((d) => Math.abs(d.deflection)));

    const positions: number[] = [];
    const colors: number[] = [];

    function lerpColor(
      a: [number, number, number],
      b: [number, number, number],
      t: number
    ): [number, number, number] {
      return [
        a[0] + (b[0] - a[0]) * t,
        a[1] + (b[1] - a[1]) * t,
        a[2] + (b[2] - a[2]) * t,
      ];
    }

    const cBlue: [number, number, number] = [0.1, 0.3, 0.95];
    const cGreen: [number, number, number] = [0.1, 0.75, 0.4];
    const cOrange: [number, number, number] = [0.95, 0.55, 0.15];
    const cRed: [number, number, number] = [0.9, 0.1, 0.15];

    for (let i = 0; i <= segments; i++) {
      const x = (i / segments) * beamLength - beamLength / 2;
      const deflection = calculateDeflection(
        (i / segments) * beamLength,
        w0,
        EI
      );

      const y = -deflection * deformationScale;

      let deflectionRatio: number;
      if (useServiceLimitColor) {
        // L/360 = 10000mm / 360 = 27.78mm
        const serviceLimitMm = 10000 / 360; // ~27.78 mm
        const absDeflectionMm = Math.abs(deflection) * 1000;
        // Ratio: 0-0.33 azul, 0.33-0.66 verde, 0.66-1.0 naranja, >1.0 rojo (excede límite)
        deflectionRatio = Math.min(1.2, absDeflectionMm / serviceLimitMm);
      } else {
        // Coloración relativa: de menor a mayor deflexión
        deflectionRatio = Math.min(
          1,
          Math.abs(deflection) / (maxDef || 0.0001)
        );
      }

      let color: [number, number, number];
      if (deflectionRatio < 0.33) {
        const t = deflectionRatio / 0.33;
        color = lerpColor(cBlue, cGreen, t);
      } else if (deflectionRatio < 0.66) {
        const t = (deflectionRatio - 0.33) / 0.33;
        color = lerpColor(cGreen, cOrange, t);
      } else {
        const t = (deflectionRatio - 0.66) / 0.34;
        color = lerpColor(cOrange, cRed, t);
      }
      const [r, g, b] = color;

      positions.push(x, y - beamHeight / 2, -beamWidth / 2);
      colors.push(r, g, b);

      positions.push(x, y + beamHeight / 2, -beamWidth / 2);
      colors.push(r, g, b);

      positions.push(x, y + beamHeight / 2, beamWidth / 2);
      colors.push(r, g, b);

      positions.push(x, y - beamHeight / 2, beamWidth / 2);
      colors.push(r, g, b);
    }

    const geometry = meshRef.current.geometry as BufferGeometry;
    geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
    geometry.setAttribute("color", new Float32BufferAttribute(colors, 3));
    geometry.attributes.position.needsUpdate = true;
    geometry.attributes.color.needsUpdate = true;
    geometry.computeVertexNormals();
  }, [w0, EI, deformationScale, useServiceLimitColor]);

  return (
    <>
      <mesh ref={meshRef} geometry={deformedGeometry} position={[0, 0, 0]}>
        <meshStandardMaterial
          vertexColors
          metalness={0.4}
          roughness={0.5}
          envMapIntensity={0.5}
        />
      </mesh>

      {showOriginal && (
        <mesh geometry={originalGeometry} position={[0, 0, 0]}>
          <meshBasicMaterial
            color="#666666"
            transparent
            opacity={0.15}
            wireframe
          />
        </mesh>
      )}
    </>
  );
}
