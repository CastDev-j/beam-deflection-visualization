"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid, PerspectiveCamera } from "@react-three/drei";
import { useState, useMemo } from "react";
import { BeamMesh } from "./beam-mesh";
import { BeamSupports } from "./beam-supports";
import { LoadArrows } from "./load-arrows";
import { BeamMarkers } from "./beam-markers";

interface BeamCanvasProps {
  w0: number;
  EI: number;
  showOriginal: boolean;
  deformationScale: number;
  useAbsoluteColor: boolean;
}

export function BeamCanvas({
  w0,
  EI,
  showOriginal,
  deformationScale,
  useAbsoluteColor,
}: BeamCanvasProps) {
  const [showInfo, setShowInfo] = useState(false);
  const legendData = useMemo(() => {
    if (useAbsoluteColor) {
      return [
        { color: "bg-[rgb(26,77,242)]", label: "Azul", desc: "0–12.5 mm" },
        { color: "bg-[rgb(25,191,102)]", label: "Verde", desc: "12.5–25 mm" },
        { color: "bg-[rgb(242,140,38)]", label: "Naranja", desc: "25–37.5 mm" },
        {
          color: "bg-[rgb(230,26,38)]",
          label: "Rojo",
          desc: ">37.5 mm (≈50 mm máx)",
        },
      ];
    }
    return [
      { color: "bg-[rgb(26,77,242)]", label: "Azul", desc: "0–0.33 · δmax" },
      {
        color: "bg-[rgb(25,191,102)]",
        label: "Verde",
        desc: "0.33–0.66 · δmax",
      },
      {
        color: "bg-[rgb(242,140,38)]",
        label: "Naranja",
        desc: "0.66–0.9 · δmax",
      },
      { color: "bg-[rgb(230,26,38)]", label: "Rojo", desc: ">0.9 · δmax" },
    ];
  }, [useAbsoluteColor]);
  return (
    <div className="relative w-full h-full bg-card rounded-lg overflow-hidden border border-border">
      <Canvas>
        <PerspectiveCamera makeDefault position={[15, 10, 15]} fov={50} />
        <OrbitControls
          enablePan
          enableZoom
          enableRotate
          minDistance={5}
          maxDistance={50}
        />

        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={0.8} />

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

        <BeamMesh
          w0={w0}
          EI={EI}
          showOriginal={showOriginal}
          deformationScale={deformationScale}
          useAbsoluteColor={useAbsoluteColor}
        />
        <BeamSupports />
        <LoadArrows w0={w0} />
        <BeamMarkers
          w0={w0}
          EI={EI}
          deformationScale={deformationScale}
          disabled={showInfo}
        />
      </Canvas>
      <button
        onClick={() => setShowInfo((p) => !p)}
        aria-label="Información del modelo"
        className="absolute top-2 sm:top-3 left-2 sm:left-3 z-50 flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary/90 hover:bg-primary text-primary-foreground text-xs sm:text-sm font-bold transition-all hover:scale-105 active:scale-95"
      >
        i
      </button>
      {showInfo && (
        <>
          <div
            className="absolute inset-0 bg-background/75 backdrop-blur-sm z-40"
            onClick={() => setShowInfo(false)}
          />
          <div className="absolute top-12 sm:top-14 left-2 right-2 sm:left-3 sm:right-auto z-50 bg-card border border-border rounded-lg p-3 sm:p-4 sm:w-[360px] max-w-full text-xs space-y-3 max-h-[calc(100vh-5rem)] overflow-y-auto">
            <div className="flex justify-between items-start mb-1">
              <h4 className="font-semibold text-primary text-sm sm:text-base">
                Información del Modelo 3D
              </h4>
              <button
                onClick={() => setShowInfo(false)}
                aria-label="Cerrar"
                className="text-muted-foreground hover:text-foreground text-lg sm:text-xl leading-none transition-colors -mt-1"
              >
                ×
              </button>
            </div>
            <div className="space-y-3 max-h-[280px] sm:max-h-[300px] overflow-y-auto pr-1">
              <div>
                <p className="font-medium text-foreground text-xs sm:text-sm">
                  Coloración de la viga
                </p>
                <ul className="mt-1.5 space-y-1 text-muted-foreground">
                  {legendData.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-center justify-between gap-2"
                    >
                      <span className="flex items-center">
                        <span
                          className={`inline-block w-3 h-3 rounded-full mr-2 ${item.color} shrink-0`}
                        />
                        <span className="text-xs">{item.label}</span>
                      </span>
                      <span className="font-mono text-[10px] sm:text-xs text-muted-foreground">
                        {item.desc}
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="mt-1.5 text-[10px] sm:text-xs text-muted-foreground leading-relaxed">
                  {useAbsoluteColor
                    ? "Escala absoluta: mm de deflexión (tope ≈ 50 mm)."
                    : "Escala relativa: fracción δ/δmax en la viga."}
                </p>
              </div>
              <div>
                <p className="font-medium text-foreground text-xs sm:text-sm">
                  Flechas de carga
                </p>
                <p className="text-muted-foreground leading-relaxed text-xs">
                  Su longitud refleja la intensidad local de la carga
                  distribuida w(x).
                </p>
              </div>
              <div>
                <p className="font-medium text-foreground text-xs sm:text-sm">
                  Elementos
                </p>
                <ul className="mt-1.5 space-y-1 text-muted-foreground text-xs">
                  <li>Viga deformada (gradiente de colores)</li>
                  <li>
                    Contorno original {showOriginal ? "visible" : "oculto"}
                  </li>
                  <li>Soportes (empotramiento / rodillo)</li>
                  <li>Marcadores interactivos</li>
                </ul>
              </div>
              <div>
                <p className="font-medium text-foreground text-xs sm:text-sm">
                  Interacción
                </p>
                <p className="text-muted-foreground leading-relaxed text-xs">
                  Usa rotación, zoom y click en marcadores para ver detalles.
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
