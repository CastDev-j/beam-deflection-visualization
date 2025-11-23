"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid, PerspectiveCamera } from "@react-three/drei";
import { BeamMesh } from "./beam-mesh";
import { BeamSupports } from "./beam-supports";
import { LoadArrows } from "./load-arrows";
import { BeamMarkers } from "./beam-markers";

interface BeamCanvasProps {
  w0: number;
  EI: number;
  showOriginal: boolean;
  deformationScale: number;
}

export function BeamCanvas({
  w0,
  EI,
  showOriginal,
  deformationScale,
}: BeamCanvasProps) {
  return (
    <div className="w-full h-full bg-card rounded-lg overflow-hidden border border-border">
      <Canvas>
        <PerspectiveCamera makeDefault position={[15, 10, 15]} fov={50} />
        <OrbitControls
          enablePan
          enableZoom
          enableRotate
          minDistance={5}
          maxDistance={50}
        />

        {/* Lighting */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={0.8} />

        {/* Grid simplificado */}
        <Grid
          args={[20, 20]}
          cellSize={1}
          cellThickness={0.5}
          cellColor="#333"
          sectionSize={5}
          sectionThickness={1}
          sectionColor="#555"
          fadeDistance={30}
          fadeStrength={1}
          position={[0, -1, 0]}
        />

        {/* Beam Visualization */}
        <BeamMesh
          w0={w0}
          EI={EI}
          showOriginal={showOriginal}
          deformationScale={deformationScale}
        />

        {/* Supports */}
        <BeamSupports />

        {/* Load Arrows */}
        <LoadArrows w0={w0} />

        {/* Interactive Markers */}
        <BeamMarkers w0={w0} EI={EI} deformationScale={deformationScale} />
      </Canvas>
    </div>
  );
}
