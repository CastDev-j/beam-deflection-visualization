"use client";

import { useMemo } from "react";
import { BufferGeometry, Float32BufferAttribute } from "three";
import { calculateDeflection, generateBeamData } from "@/lib/beam-formulas";

interface BeamMeshProps {
  w0: number;
  EI: number;
  showOriginal: boolean;
  deformationScale: number;
}

export function BeamMesh({
  w0,
  EI,
  showOriginal,
  deformationScale,
}: BeamMeshProps) {
  const { deformedGeometry, originalGeometry, maxDeflection } = useMemo(() => {
    const segments = 100;
    const beamLength = 10;
    const beamWidth = 0.4;
    const beamHeight = 0.6;

    // Generate beam data
    const data = generateBeamData(w0, EI, segments);
    const maxDef = Math.max(...data.map((d) => Math.abs(d.deflection)));

    // Create deformed geometry
    const deformedGeo = new BufferGeometry();
    const positions: number[] = [];
    const indices: number[] = [];
    const colors: number[] = [];

    // Create vertices for deformed beam
    for (let i = 0; i <= segments; i++) {
      const x = (i / segments) * beamLength - beamLength / 2;
      const y =
        calculateDeflection((i / segments) * beamLength, w0, EI) *
        deformationScale;

      // Calculate color based on deflection (gradiente suave azul-cyan-amarillo)
      const deflectionRatio = Math.abs(y) / (maxDef * deformationScale || 1);
      const r = deflectionRatio * 0.9;
      const g = 0.5 + deflectionRatio * 0.3;
      const b = 1 - deflectionRatio * 0.5;

      // Four corners of beam cross-section at this position
      positions.push(x, y - beamHeight / 2, -beamWidth / 2);
      colors.push(r, g, b);

      positions.push(x, y + beamHeight / 2, -beamWidth / 2);
      colors.push(r, g, b);

      positions.push(x, y + beamHeight / 2, beamWidth / 2);
      colors.push(r, g, b);

      positions.push(x, y - beamHeight / 2, beamWidth / 2);
      colors.push(r, g, b);
    }

    // Create faces
    for (let i = 0; i < segments; i++) {
      const base = i * 4;
      const nextBase = (i + 1) * 4;

      // Front face
      indices.push(base, base + 1, nextBase + 1);
      indices.push(base, nextBase + 1, nextBase);

      // Back face
      indices.push(base + 2, base + 3, nextBase + 3);
      indices.push(base + 2, nextBase + 3, nextBase + 2);

      // Top face
      indices.push(base + 1, base + 2, nextBase + 2);
      indices.push(base + 1, nextBase + 2, nextBase + 1);

      // Bottom face
      indices.push(base + 3, base, nextBase);
      indices.push(base + 3, nextBase, nextBase + 3);
    }

    deformedGeo.setIndex(indices);
    deformedGeo.setAttribute(
      "position",
      new Float32BufferAttribute(positions, 3)
    );
    deformedGeo.setAttribute("color", new Float32BufferAttribute(colors, 3));
    deformedGeo.computeVertexNormals();

    // Create original (undeformed) geometry
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
      maxDeflection: maxDef,
    };
  }, [w0, EI, deformationScale]);

  return (
    <>
      {/* Deformed beam with color gradient */}
      <mesh geometry={deformedGeometry} position={[0, 0, 0]}>
        <meshStandardMaterial
          vertexColors
          metalness={0.4}
          roughness={0.5}
          envMapIntensity={0.5}
        />
      </mesh>

      {/* Original beam outline (if enabled) */}
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
