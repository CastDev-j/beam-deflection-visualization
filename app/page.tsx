"use client";

import { useState, useMemo } from "react";
import { BeamCanvas } from "@/components/beam-canvas";
import { ControlPanel } from "@/components/control-panel";
import { DeflectionChart } from "@/components/deflection-chart";
import { LoadChart } from "@/components/load-chart";
import { findMaxDeflection } from "@/lib/beam-formulas";
import { useAppTour } from "@/components/app-tour";
import { Button } from "@/components/ui/button";
import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

const DEFAULT_W0 = 20;
const DEFAULT_EI = 5000;
const DEFAULT_DEFORMATION_SCALE = 5;

export default function BeamDeflectionApp() {
  const [w0, setW0] = useState(DEFAULT_W0);
  const [EI, setEI] = useState(DEFAULT_EI);
  const [showOriginal, setShowOriginal] = useState(true);
  const [deformationScale, setDeformationScale] = useState(
    DEFAULT_DEFORMATION_SCALE
  );

  const { startTour } = useAppTour();

  const { maxDeflection, position } = useMemo(() => {
    return findMaxDeflection(w0, EI);
  }, [w0, EI]);

  const handleReset = () => {
    setW0(DEFAULT_W0);
    setEI(DEFAULT_EI);
    setDeformationScale(DEFAULT_DEFORMATION_SCALE);
    setShowOriginal(true);
  };

  return (
    <div className="min-h-screen bg-background p-2 sm:p-4 md:p-6">
      {/* Header */}
      <header id="app-header" className="mb-4 md:mb-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2 text-pretty">
                Visualización de Deflexión en Vigas
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground text-balance">
                Análisis estructural de viga de 10 metros con carga distribuida
                no uniforme
              </p>
            </div>
            <Button
              onClick={startTour}
              variant="outline"
              size="sm"
              className="self-start sm:self-auto whitespace-nowrap"
            >
              Ver Tutorial
            </Button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2 sm:gap-3 items-center text-xs sm:text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <span>TecNM Celaya</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-accent" />
              <span>Desarrollado por casdev</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Left Column - Controls */}
          <div className="lg:col-span-1 space-y-4 md:space-y-6">
            <ControlPanel
              w0={w0}
              EI={EI}
              showOriginal={showOriginal}
              deformationScale={deformationScale}
              onW0Change={setW0}
              onEIChange={setEI}
              onShowOriginalChange={setShowOriginal}
              onDeformationScaleChange={setDeformationScale}
              onReset={handleReset}
              maxDeflection={maxDeflection}
              maxDeflectionPosition={position}
            />

            {/* Info Card */}
            <div className="bg-card border border-border rounded-lg p-3 md:p-4">
              <h3 className="font-semibold text-sm mb-2 text-card-foreground">
                Condiciones de Frontera
              </h3>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Empotrada en x = 0 m</li>
                <li>• Apoyo simple en x = 10 m</li>
                <li>• Longitud total: 10 metros</li>
                <li>• Solución vía Transformada de Laplace</li>
              </ul>
            </div>
          </div>

          {/* Right Column - Visualization */}
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            {/* 3D Canvas */}
            <div className="h-[300px] sm:h-[400px] md:h-[500px] w-full beam-canvas-container">
              <BeamCanvas
                w0={w0}
                EI={EI}
                showOriginal={showOriginal}
                deformationScale={deformationScale}
              />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="load-chart-container">
                <LoadChart w0={w0} />
              </div>
              <div className="deflection-chart-container">
                <DeflectionChart w0={w0} EI={EI} />
              </div>
            </div>

            {/* Formula Display */}
            <div className="bg-card border border-border rounded-lg p-4 md:p-6 formula-container overflow-x-auto">
              <h3 className="font-semibold mb-3 text-card-foreground text-sm md:text-base">
                Ecuación de Deflexión
              </h3>
              <div className="text-sm overflow-x-auto">
                <BlockMath math="y(x) = \frac{3w_0}{2EI}\left[\frac{x^5}{120} - \frac{(x-2)^5}{120}u(x-2) - \frac{(x-8)^5}{120}u(x-8)\right] + \frac{w_0}{EI}\left[\frac{87}{5}x^2 - \frac{129}{50}x^3\right]" />
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                donde u(x-a) es la función escalón unitario
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-8 md:mt-12 pb-6 text-center text-xs sm:text-sm text-muted-foreground">
        <p>Tecnológico Nacional de México - Campus Celaya</p>
        <p className="mt-1">
          Aplicación interactiva para análisis estructural de vigas
        </p>
      </footer>
    </div>
  );
}
