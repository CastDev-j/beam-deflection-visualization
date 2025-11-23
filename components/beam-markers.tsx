"use client";

import { useState } from "react";
import { Html } from "@react-three/drei";
import { calculateDeflection, calculateLoad } from "@/lib/beam-formulas";

interface BeamMarkersProps {
  w0: number;
  EI: number;
  deformationScale: number;
}

export function BeamMarkers({ w0, EI, deformationScale }: BeamMarkersProps) {
  const [activeMarker, setActiveMarker] = useState<number | null>(null);

  // Puntos de interés en la viga
  const markers = [
    {
      x: 0,
      label: "Empotramiento",
      description: "Extremo fijo - Momento y reacciones",
      interpretation:
        "Este extremo no puede rotar ni desplazarse. Genera un momento de reacción que resiste la deflexión.",
    },
    {
      x: 2,
      label: "Transición de Carga",
      description: "Inicio de carga constante (3w₀)",
      interpretation:
        "La carga pasa de triangular creciente a constante. La función cambia de w(x)=(3/2)xw₀ a w(x)=3w₀.",
    },
    {
      x: 5,
      label: "Centro de Viga",
      description: "Punto medio de la viga",
      interpretation:
        "Zona de máxima deflexión esperada. Aquí la viga se deforma más debido a la carga distribuida.",
    },
    {
      x: 8,
      label: "Transición de Carga",
      description: "Fin de carga constante",
      interpretation:
        "La carga pasa de constante a triangular decreciente. La función cambia a w(x)=(3/2)(10-x)w₀.",
    },
    {
      x: 10,
      label: "Apoyo Simple",
      description: "Extremo con rodillo",
      interpretation:
        "Este apoyo permite rotación pero no desplazamiento vertical. Solo genera reacción vertical.",
    },
  ];

  return (
    <>
      {markers.map((marker, index) => {
        const deflection =
          calculateDeflection(marker.x, w0, EI) * deformationScale;
        const load = calculateLoad(marker.x, w0);
        const position: [number, number, number] = [
          marker.x - 5,
          deflection,
          0,
        ];
        const isActive = activeMarker === index;

        return (
          <group key={index} position={position}>
            {/* Marcador HTML clickeable */}
            <Html
              position={[0, 0, 0]}
              center
              distanceFactor={6}
              zIndexRange={[100, 0]}
            >
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveMarker(isActive ? null : index);
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.cursor = "pointer";
                }}
                className={`
                  w-8 h-8 rounded-full border-3 flex items-center justify-center
                  transition-all duration-200 cursor-pointer shadow-lg
                  ${
                    isActive
                      ? "bg-blue-500 border-blue-300 scale-125 shadow-blue-500/50"
                      : "bg-yellow-500 border-yellow-300 hover:scale-110 hover:shadow-yellow-500/50"
                  }
                `}
                style={{
                  boxShadow: isActive
                    ? "0 0 20px rgba(59, 130, 246, 0.8), 0 0 40px rgba(59, 130, 246, 0.4)"
                    : "0 0 15px rgba(234, 179, 8, 0.8), 0 0 30px rgba(234, 179, 8, 0.3)",
                }}
              >
                <div className="w-3 h-3 bg-white rounded-full opacity-80"></div>
              </div>
            </Html>

            {/* Etiqueta con posición */}
            <Html
              position={[0, 0.5, 0]}
              center
              distanceFactor={8}
              style={{
                pointerEvents: "none",
                userSelect: "none",
              }}
            >
              <div className="bg-card/95 backdrop-blur-sm border border-border rounded-lg px-3 py-1.5 shadow-lg">
                <p className="text-xs font-semibold text-primary whitespace-nowrap">
                  x = {marker.x.toFixed(1)} m
                </p>
              </div>
            </Html>

            {/* Panel de detalles (aparece al hacer click) */}
            {isActive && (
              <Html
                position={[0, 1.5, 0]}
                center
                distanceFactor={10}
                style={{
                  transition: "all 0.3s ease",
                }}
              >
                <div className="bg-card/98 backdrop-blur-md border-2 border-primary rounded-lg p-4 shadow-2xl min-w-[320px] max-w-[380px] animate-in fade-in zoom-in duration-200">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-sm font-bold text-primary">
                      {marker.label}
                    </h3>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMarker(null);
                      }}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                      style={{ pointerEvents: "auto", cursor: "pointer" }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">
                    {marker.description}
                  </p>

                  {/* Interpretación del punto */}
                  <div className="bg-secondary/50 rounded-md p-2 mb-3">
                    <p className="text-xs text-foreground leading-relaxed">
                      <strong className="text-primary">Interpretación:</strong>{" "}
                      {marker.interpretation}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">
                        Posición:
                      </span>
                      <span className="text-xs font-mono font-semibold text-accent">
                        {marker.x.toFixed(2)} m
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">
                        Deflexión:
                      </span>
                      <span className="text-xs font-mono font-semibold text-primary">
                        {(calculateDeflection(marker.x, w0, EI) * 1000).toFixed(
                          2
                        )}{" "}
                        mm
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">
                        Carga:
                      </span>
                      <span className="text-xs font-mono font-semibold text-foreground">
                        {load.toFixed(2)} kN/m
                      </span>
                    </div>
                    {marker.x === 0 && (
                      <div className="flex justify-between items-center pt-2 border-t border-border/50">
                        <span className="text-xs text-muted-foreground">
                          Condición:
                        </span>
                        <span className="text-xs font-semibold text-destructive">
                          y(0) = 0, θ(0) = 0
                        </span>
                      </div>
                    )}
                    {marker.x === 10 && (
                      <div className="flex justify-between items-center pt-2 border-t border-border/50">
                        <span className="text-xs text-muted-foreground">
                          Condición:
                        </span>
                        <span className="text-xs font-semibold text-destructive">
                          y(10) = 0
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="mt-3 pt-3 border-t border-border">
                    <p className="text-[10px] text-muted-foreground italic text-center">
                      Click en la esfera para cerrar
                    </p>
                  </div>
                </div>
              </Html>
            )}
          </group>
        );
      })}
    </>
  );
}
