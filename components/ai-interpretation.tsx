"use client";

import { useState, useTransition, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { interpretBeamResults, type BeamData } from "@/lib/actions";
import ReactMarkdown from "react-markdown";

interface AIInterpretationProps {
  beamData: BeamData;
}

export function AIInterpretation({ beamData }: AIInterpretationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [interpretation, setInterpretation] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const sanitize = useCallback((raw: string) => {
    const forbidden = [
      /gracias/i,
      /espero/i,
      /como modelo/i,
      /como IA/i,
      /agradeci/i,
      /conclus/i,
      /resumen/i,
      /final/i,
    ];
    return raw
      .split(/\r?\n/)
      .filter(
        (line) => line.trim() !== "" && !forbidden.some((r) => r.test(line))
      )
      .join("\n")
      .replace(/\n{3,}/g, "\n\n");
  }, []);

  const handleInterpret = () => {
    setIsOpen(true);
    setError("");
    if (!interpretation) {
      startTransition(async () => {
        try {
          const result = await interpretBeamResults(beamData);
          setInterpretation(sanitize(result));
        } catch (err) {
          setError(
            err instanceof Error
              ? err.message
              : "Error al obtener la interpretación"
          );
        }
      });
    }
  };

  const handleClose = () => setIsOpen(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.documentElement.classList.add("interpretation-active");
    } else {
      document.body.style.overflow = "";
      document.documentElement.classList.remove("interpretation-active");
    }
    return () => {
      document.body.style.overflow = "";
      document.documentElement.classList.remove("interpretation-active");
    };
  }, [isOpen]);

  return (
    <>
      <Button
        id="ai-interpret-button"
        onClick={handleInterpret}
        variant="outline"
        className="w-full text-xs sm:text-sm py-2 sm:py-2.5 border-2 text-purple-600 border-purple-500/40 hover:border-purple-500 hover:bg-purple-500/10 font-medium group"
      >
        <Sparkles className="w-4 h-4 mr-2 text-purple-600 group-hover:text-purple-700" />
        Interpretar con IA
      </Button>
      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {isOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={handleClose}
                  className="fixed left-0 top-0 h-screen w-screen bg-black/60 backdrop-blur-sm z-100"
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  transition={{ type: "spring", duration: 0.5 }}
                  className="fixed left-0 top-0 h-screen w-screen flex justify-center items-center z-110 overflow-hidden px-4 sm:px-8 md:px-16 lg:px-24 py-4"
                >
                  <Card className="w-full h-full min-h-[90vh] flex flex-col shadow-2xl border border-border/70 backdrop-blur-lg bg-card/90">
                    <CardHeader className="shrink-0 border-b">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <CardTitle className="text-lg sm:text-xl flex items-center gap-2 tracking-tight">
                            <Sparkles className="w-5 h-5 text-purple-600" />
                            Interpretación con IA
                          </CardTitle>
                          <CardDescription className="text-xs sm:text-sm mt-1 leading-relaxed">
                            Análisis estructural técnico
                          </CardDescription>
                        </div>
                        <Button
                          onClick={handleClose}
                          variant="ghost"
                          size="sm"
                          className="shrink-0"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-6"
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-muted/40 p-4 rounded-lg border shadow-sm"
                          >
                            <h3 className="text-sm font-semibold mb-3 text-muted-foreground">
                              Parámetros de Entrada
                            </h3>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                  Carga w₀:
                                </span>
                                <span className="font-mono font-semibold">
                                  {beamData.w0.toFixed(1)} kN/m
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                  Rigidez EI:
                                </span>
                                <span className="font-mono font-semibold">
                                  {beamData.EI.toFixed(0)} kN·m²
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                  Escala (no afecta cálculos o interpretación):
                                </span>
                                <span className="font-mono font-semibold">
                                  {beamData.deformationScale.toFixed(1)}x
                                </span>
                              </div>
                            </div>
                          </motion.div>
                          <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                            className="bg-muted/40 p-4 rounded-lg border shadow-sm"
                          >
                            <h3 className="text-sm font-semibold mb-3 text-muted-foreground">
                              Resultados Calculados
                            </h3>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                  Deflexión máx:
                                </span>
                                <span className="font-mono font-semibold text-primary">
                                  {(beamData.maxDeflection * 1000).toFixed(2)}{" "}
                                  mm
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                  Posición:
                                </span>
                                <span className="font-mono font-semibold text-accent">
                                  {beamData.maxDeflectionPosition.toFixed(2)} m
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                  L/360 límite:
                                </span>
                                <span className="font-mono font-semibold">
                                  {(10000 / 360).toFixed(2)} mm
                                </span>
                              </div>
                            </div>
                          </motion.div>
                        </div>
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 }}
                          className="border-t pt-6"
                        >
                          <div className="mb-4 flex items-center gap-2">
                            <h3 className="text-base sm:text-lg font-semibold flex items-center gap-2 tracking-tight">
                              <Sparkles className="w-4 h-4 text-purple-600" />{" "}
                              Informe Técnico
                            </h3>
                          </div>
                          {isPending ? (
                            <div className="flex flex-col items-center justify-center py-12 gap-4">
                              <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
                              <p className="text-sm text-muted-foreground">
                                Analizando resultados con IA...
                              </p>
                            </div>
                          ) : error ? (
                            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                              <p className="text-sm text-destructive">
                                {error}
                              </p>
                              <Button
                                onClick={() => {
                                  setError("");
                                  handleInterpret();
                                }}
                                variant="outline"
                                size="sm"
                                className="mt-3"
                              >
                                Reintentar
                              </Button>
                            </div>
                          ) : interpretation ? (
                            <div className="rounded-lg border bg-muted/30 p-4 sm:p-5 space-y-5">
                              <div
                                className="prose prose-sm sm:prose md:prose-base max-w-none dark:prose-invert leading-relaxed
                              [&_h3]:mt-0 [&_h3]:text-purple-700 [&_h3]:font-semibold [&_h3]:tracking-tight [&_h3]:border-b [&_h3]:border-muted [&_h3]:pb-2
                              [&_p]:my-2 [&_ul]:my-3 [&_ul]:pl-5 [&_ul]:list-disc [&_li]:marker:text-purple-600
                              [&_strong]:text-foreground [&_code]:text-xs [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:bg-muted/60 [&_blockquote]:border-l-4 [&_blockquote]:border-purple-500/40 [&_blockquote]:bg-muted/40 [&_blockquote]:px-3 [&_blockquote]:py-2 [&_blockquote]:rounded"
                              >
                                <ReactMarkdown>{interpretation}</ReactMarkdown>
                              </div>
                            </div>
                          ) : null}
                        </motion.div>
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              </>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}
