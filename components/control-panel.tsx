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

interface ControlPanelProps {
  w0: number;
  EI: number;
  showOriginal: boolean;
  deformationScale: number;
  onW0Change: (value: number) => void;
  onEIChange: (value: number) => void;
  onShowOriginalChange: (value: boolean) => void;
  onDeformationScaleChange: (value: number) => void;
  onReset: () => void;
  maxDeflection: number;
  maxDeflectionPosition: number;
}

export function ControlPanel({
  w0,
  EI,
  showOriginal,
  deformationScale,
  onW0Change,
  onEIChange,
  onShowOriginalChange,
  onDeformationScaleChange,
  onReset,
  maxDeflection,
  maxDeflectionPosition,
}: ControlPanelProps) {
  return (
    <Card id="control-panel" className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">Parámetros de Control</CardTitle>
        <CardDescription>
          Ajusta los valores para ver la deflexión de la viga
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* w0 Control */}
        <div id="w0-control" className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="w0-slider" className="text-sm font-medium">
              Carga w₀ (kN/m)
            </Label>
            <span className="text-sm font-mono bg-secondary px-2 py-1 rounded">
              {w0.toFixed(1)}
            </span>
          </div>
          <Slider
            id="w0-slider"
            min={1}
            max={100}
            step={0.5}
            value={[w0]}
            onValueChange={(values) => onW0Change(values[0])}
            className="w-full"
          />
        </div>

        {/* EI Control */}
        <div id="ei-control" className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="ei-slider" className="text-sm font-medium">
              Rigidez EI (kN·m²)
            </Label>
            <span className="text-sm font-mono bg-secondary px-2 py-1 rounded">
              {EI.toFixed(0)}
            </span>
          </div>
          <Slider
            id="ei-slider"
            min={100}
            max={10000}
            step={100}
            value={[EI]}
            onValueChange={(values) => onEIChange(values[0])}
            className="w-full"
          />
        </div>

        {/* Deformation Scale */}
        <div id="scale-control" className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="scale-slider" className="text-sm font-medium">
              Escala de Deformación
            </Label>
            <span className="text-sm font-mono bg-secondary px-2 py-1 rounded">
              {deformationScale.toFixed(1)}x
            </span>
          </div>
          <Slider
            id="scale-slider"
            min={0.1}
            max={10}
            step={0.1}
            value={[deformationScale]}
            onValueChange={(values) => onDeformationScaleChange(values[0])}
            className="w-full"
          />
        </div>

        {/* Show Original Toggle */}
        <div
          id="show-original-toggle"
          className="flex items-center justify-between"
        >
          <Label htmlFor="show-original" className="text-sm font-medium">
            Mostrar posición original
          </Label>
          <Switch
            id="show-original"
            checked={showOriginal}
            onCheckedChange={onShowOriginalChange}
          />
        </div>

        {/* Max Deflection Display */}
        <div className="border-t border-border pt-4 space-y-2">
          <div className="text-sm">
            <span className="text-muted-foreground">Deflexión máxima:</span>
            <p className="font-mono text-primary font-semibold">
              {(maxDeflection * 1000).toFixed(2)} mm
            </p>
          </div>
          <div className="text-sm">
            <span className="text-muted-foreground">En posición:</span>
            <p className="font-mono text-accent font-semibold">
              x = {maxDeflectionPosition.toFixed(2)} m
            </p>
          </div>
        </div>

        {/* Reset Button */}
        <Button
          onClick={onReset}
          variant="outline"
          className="w-full bg-transparent"
        >
          Restablecer Valores
        </Button>
      </CardContent>
    </Card>
  );
}
