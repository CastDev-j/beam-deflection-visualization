"use client";

import { useState, useMemo } from "react";
import { useDebouncedValue } from "@/hooks/use-debounced";
import { BeamCanvas } from "@/components/beam-canvas";
import { ControlPanel } from "@/components/control-panel";
import { DeflectionChart } from "@/components/deflection-chart";
import { LoadChart } from "@/components/load-chart";
import { findMaxDeflection } from "@/lib/beam-formulas";
import { useAppTour } from "@/components/app-tour";
import { Button } from "@/components/ui/button";
import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

const DEFAULT_W0 = 1.5;
const DEFAULT_EI = 5000;
const DEFAULT_DEFORMATION_SCALE = 5;

export default function BeamDeflectionApp() {
  const [w0, setW0] = useState(DEFAULT_W0);
  const [EI, setEI] = useState(DEFAULT_EI);
  const [showOriginal, setShowOriginal] = useState(true);
  const [deformationScale, setDeformationScale] = useState(
    DEFAULT_DEFORMATION_SCALE
  );
  const [useServiceLimitColor, setUseServiceLimitColor] = useState(false);

  const { startTour } = useAppTour();

  // Debounce heavy recalculations when user moves sliders rápidamente
  const w0Debounced = useDebouncedValue(w0, 120);
  const EIDebounced = useDebouncedValue(EI, 120);
  const deformationScaleDebounced = useDebouncedValue(deformationScale, 120);

  const { maxDeflection, position } = useMemo(() => {
    return findMaxDeflection(w0Debounced, EIDebounced);
  }, [w0Debounced, EIDebounced]);

  const handleReset = () => {
    setW0(DEFAULT_W0);
    setEI(DEFAULT_EI);
    setDeformationScale(DEFAULT_DEFORMATION_SCALE);
    setShowOriginal(true);
    setUseServiceLimitColor(false);
  };

  return (
    <div className="min-h-screen bg-background p-3 sm:p-4 md:p-6 lg:p-8">
      <header id="app-header" className="mb-4 sm:mb-6 md:mb-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
            <div className="flex-1">
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-2 text-pretty leading-tight">
                Visualización de Deflexión en Vigas
              </h1>
              <p className="text-xs sm:text-sm md:text-base text-muted-foreground text-balance">
                Análisis estructural de viga de 10 metros con carga distribuida
                no uniforme
              </p>
            </div>
            <Button
              onClick={startTour}
              variant="outline"
              size="sm"
              className="self-start sm:self-auto whitespace-nowrap text-xs sm:text-sm px-4 py-2 border-2 border-primary/30 hover:border-primary hover:bg-primary/5"
            >
              Ver Tutorial
            </Button>
          </div>
          <div className="mt-3 sm:mt-4 flex flex-wrap gap-2 sm:gap-3 items-center text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <span>TecNM Celaya</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="w-2 h-2 rounded-full bg-accent" />
              <a
                href="https://github.com/CastDev-j/beam-deflection-visualization"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
              >
                Desarrollado por casdev
              </a>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
          <div className="lg:col-span-1 space-y-4 sm:space-y-5 md:space-y-6">
            <ControlPanel
              w0={w0}
              EI={EI}
              showOriginal={showOriginal}
              deformationScale={deformationScale}
              useServiceLimitColor={useServiceLimitColor}
              onW0Change={setW0}
              onEIChange={setEI}
              onShowOriginalChange={setShowOriginal}
              onDeformationScaleChange={setDeformationScale}
              onUseServiceLimitColorChange={setUseServiceLimitColor}
              onReset={handleReset}
              maxDeflection={maxDeflection}
              maxDeflectionPosition={position}
            />

            <div className="bg-card border border-border rounded-lg p-4 sm:p-5">
              <h3 className="font-semibold text-sm sm:text-base mb-3 text-card-foreground">
                Condiciones de Frontera
              </h3>
              <ul className="text-xs sm:text-sm text-muted-foreground space-y-1.5">
                <li>• Empotrada en x = 0 m</li>
                <li>• Apoyo simple en x = 10 m</li>
                <li>• Longitud total: 10 metros</li>
                <li>• Criterio L/360: 27.78 mm (NOM/ACI/AISC)</li>
                <li>• Solución vía Transformada de Laplace</li>
              </ul>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-4 sm:space-y-5 md:space-y-6">
            <div className="h-[420px] md:h-[480px] lg:h-[500px] w-full beam-canvas-container">
              <BeamCanvas
                w0={w0Debounced}
                EI={EIDebounced}
                showOriginal={showOriginal}
                deformationScale={deformationScaleDebounced}
                useServiceLimitColor={useServiceLimitColor}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
              <div className="load-chart-container">
                <LoadChart w0={w0Debounced} />
              </div>
              <div className="deflection-chart-container">
                <DeflectionChart w0={w0Debounced} EI={EIDebounced} />
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-4 sm:p-5 md:p-6 formula-container overflow-x-auto">
              <h3 className="font-semibold mb-3 sm:mb-4 text-card-foreground text-sm sm:text-base">
                Ecuación de Deflexión
              </h3>
              <div className="text-xs sm:text-sm overflow-x-auto">
                <BlockMath math="y(x) = \frac{3w_0}{2EI}\left[\frac{x^5}{120} - \frac{(x-2)^5}{120}u(x-2) - \frac{(x-8)^5}{120}u(x-8)\right] + \frac{w_0}{EI}\left[\frac{87}{5}x^2 - \frac{129}{50}x^3\right]" />
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mt-3">
                donde u(x-a) es la función escalón unitario
              </p>
            </div>
          </div>
        </div>
      </div>

      <footer className="mt-8 sm:mt-10 md:mt-12 pb-6 sm:pb-8 text-center text-xs sm:text-sm text-muted-foreground">
        <p className="font-medium">
          Tecnológico Nacional de México - Campus Celaya
        </p>
        <p className="mt-1.5 sm:mt-2">
          Aplicación interactiva para análisis estructural de vigas
        </p>
      </footer>
    </div>
  );
}
