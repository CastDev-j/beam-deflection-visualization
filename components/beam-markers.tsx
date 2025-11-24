"use client";

import { useState } from "react";
import { Html } from "@react-three/drei";
import { calculateDeflection, calculateLoad } from "@/lib/beam-formulas";
import { InlineMath } from "react-katex";
import "katex/dist/katex.min.css";

interface BeamMarkersProps {
  w0: number;
  EI: number;
  deformationScale: number;
  disabled?: boolean;
}

export function BeamMarkers({
  w0,
  EI,
  deformationScale,
  disabled,
}: BeamMarkersProps) {
  if (disabled) return null;
  const [activeMarker, setActiveMarker] = useState<number | null>(null);

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
      description: (
        <span>
          Inicio de carga constante (<InlineMath math="3w_0" />)
        </span>
      ),
      interpretation: (
        <span>
          La carga pasa de triangular creciente a constante. La función cambia
          de <InlineMath math="w(x)=\\frac{3}{2} x w_0" /> a{" "}
          <InlineMath math="w(x)=3 w_0" />.
        </span>
      ),
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
      interpretation: (
        <span>
          La carga pasa de constante a triangular decreciente. La función cambia
          a <InlineMath math="w(x)=\\frac{3}{2}(10 - x) w_0" />.
        </span>
      ),
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
        // Invertimos la deflexión para que los marcadores sigan la viga hacia abajo
        const deflection =
          -calculateDeflection(marker.x, w0, EI) * deformationScale;
        const load = calculateLoad(marker.x, w0);
        const position: [number, number, number] = [
          marker.x - 5,
          deflection,
          0,
        ];
        const isActive = activeMarker === index;

        return (
          <group key={index} position={position}>
            <Html
              position={[0, 0, 0]}
              center
              distanceFactor={6}
              wrapperClass="z-20"
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
                  transition-all duration-200 cursor-pointer
                  ${
                    isActive
                      ? "bg-blue-500 border-blue-300 scale-125"
                      : "bg-yellow-500 border-yellow-300 hover:scale-110"
                  }
                `}
                style={{}}
              >
                <div className="w-3 h-3 bg-white rounded-full opacity-80"></div>
              </div>
            </Html>

            <Html
              position={[0, 0.5, 0]}
              center
              distanceFactor={8}
              wrapperClass="z-20"
              style={{
                pointerEvents: "none",
                userSelect: "none",
              }}
            >
              <div className="bg-card/95 backdrop-blur-sm border border-border rounded-lg px-3 py-1.5">
                <p className="text-xs font-semibold text-primary whitespace-nowrap">
                  x = {marker.x.toFixed(1)} m
                </p>
              </div>
            </Html>

            {isActive && (
              <Html
                position={[0, 1.5, 0]}
                center
                distanceFactor={10}
                wrapperClass="z-30"
                style={{
                  transition: "all 0.3s ease",
                }}
              >
                <div className="bg-card/98 backdrop-blur-md border-2 border-primary rounded-lg p-4 min-w-[320px] max-w-[380px] animate-in fade-in zoom-in duration-200">
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
                        {(
                          -calculateDeflection(marker.x, w0, EI) * 1000
                        ).toFixed(2)}{" "}
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
                          <InlineMath math="y(0) = 0, \\theta(0) = 0" />
                        </span>
                      </div>
                    )}
                    {marker.x === 10 && (
                      <div className="flex justify-between items-center pt-2 border-t border-border/50">
                        <span className="text-xs text-muted-foreground">
                          Condición:
                        </span>
                        <span className="text-xs font-semibold text-destructive">
                          <InlineMath math="y(10) = 0" />
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
