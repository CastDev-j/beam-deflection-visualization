"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { AIInterpretation } from "@/components/ai-interpretation";
import type { BeamData } from "@/lib/actions";

interface ControlPanelProps {
  w0: number;
  EI: number;
  showOriginal: boolean;
  deformationScale: number;
  useServiceLimitColor: boolean;
  onW0Change: (value: number) => void;
  onEIChange: (value: number) => void;
  onShowOriginalChange: (value: boolean) => void;
  onDeformationScaleChange: (value: number) => void;
  onUseServiceLimitColorChange: (value: boolean) => void;
  onReset: () => void;
  maxDeflection: number;
  maxDeflectionPosition: number;
}

export function ControlPanel({
  w0,
  EI,
  showOriginal,
  deformationScale,
  useServiceLimitColor,
  onW0Change,
  onEIChange,
  onShowOriginalChange,
  onDeformationScaleChange,
  onUseServiceLimitColorChange,
  onReset,
  maxDeflection,
  maxDeflectionPosition,
}: ControlPanelProps) {
  const beamData: BeamData = {
    w0,
    EI,
    deformationScale,
    maxDeflection,
    maxDeflectionPosition,
    showOriginal,
    useServiceLimitColor,
    serviceLimitDeflection: 10000 / 360, // L/360 en mm
  };

  return (
    <Card id="control-panel" className="w-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-base sm:text-lg">
          Parámetros de Control
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Ajusta los valores para ver la deflexión de la viga
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5 sm:space-y-6">
        <div id="w0-control" className="space-y-2.5">
          <div className="flex justify-between items-center gap-3">
            <Label id="w0-label" className="text-xs sm:text-sm font-medium">
              Carga w₀ (kN/m)
            </Label>
            <span className="text-xs sm:text-sm font-mono bg-secondary px-2.5 py-1 rounded min-w-12 text-center">
              {w0.toFixed(1)}
            </span>
          </div>
          <Slider
            id="w0-slider"
            name="w0"
            min={1}
            max={100}
            step={0.5}
            value={[w0]}
            onValueChange={(values) => onW0Change(values[0])}
            aria-labelledby="w0-label"
            className="w-full"
          />
        </div>

        <div id="ei-control" className="space-y-2.5">
          <div className="flex justify-between items-center gap-3">
            <Label id="ei-label" className="text-xs sm:text-sm font-medium">
              Rigidez EI (kN·m²)
            </Label>
            <span className="text-xs sm:text-sm font-mono bg-secondary px-2.5 py-1 rounded min-w-12 text-center">
              {EI.toFixed(0)}
            </span>
          </div>
          <Slider
            id="ei-slider"
            name="ei"
            min={100}
            max={10000}
            step={100}
            value={[EI]}
            onValueChange={(values) => onEIChange(values[0])}
            aria-labelledby="ei-label"
            className="w-full"
          />
        </div>

        <div id="scale-control" className="space-y-2.5">
          <div className="flex justify-between items-center gap-3">
            <Label id="scale-label" className="text-xs sm:text-sm font-medium">
              Escala de Deformación
            </Label>
            <span className="text-xs sm:text-sm font-mono bg-secondary px-2.5 py-1 rounded min-w-12 text-center">
              {deformationScale.toFixed(1)}x
            </span>
          </div>
          <Slider
            id="scale-slider"
            name="deformationScale"
            min={0.1}
            max={10}
            step={0.1}
            value={[deformationScale]}
            onValueChange={(values) => onDeformationScaleChange(values[0])}
            aria-labelledby="scale-label"
            className="w-full"
          />
        </div>

        <div
          id="show-original-toggle"
          className="flex items-center justify-between gap-3"
        >
          <Label id="original-label" className="text-xs sm:text-sm font-medium">
            Mostrar posición original
          </Label>
          <Switch
            id="show-original"
            name="showOriginal"
            checked={showOriginal}
            onCheckedChange={onShowOriginalChange}
            aria-labelledby="original-label"
          />
        </div>

        <div className="flex items-center justify-between gap-3">
          <Label
            id="color-mode-label"
            className="text-xs sm:text-sm font-medium"
          >
            Coloración por límite L/360
          </Label>
          <Switch
            id="color-mode"
            name="useServiceLimitColor"
            checked={useServiceLimitColor}
            onCheckedChange={onUseServiceLimitColorChange}
            aria-labelledby="color-mode-label"
          />
        </div>

        <div className="border-t border-border pt-4 sm:pt-5 space-y-3">
          <div className="text-xs sm:text-sm">
            <span className="text-muted-foreground block mb-1">
              Deflexión máxima:
            </span>
            <p className="font-mono text-primary font-semibold text-sm sm:text-base">
              {(maxDeflection * 1000).toFixed(2)} mm
            </p>
          </div>
          <div className="text-xs sm:text-sm">
            <span className="text-muted-foreground block mb-1">
              En posición:
            </span>
            <p className="font-mono text-accent font-semibold text-sm sm:text-base">
              x = {maxDeflectionPosition.toFixed(2)} m
            </p>
          </div>
        </div>

        <AIInterpretation beamData={beamData} />

        <Button
          onClick={onReset}
          variant="outline"
          className="w-full text-xs sm:text-sm py-2 sm:py-2.5 border-2 border-primary/30 hover:border-primary hover:bg-primary/5 font-medium"
        >
          Restablecer Valores
        </Button>
      </CardContent>
    </Card>
  );
}
