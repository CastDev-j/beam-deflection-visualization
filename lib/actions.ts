"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

export interface BeamData {
  w0: number;
  EI: number;
  deformationScale: number;
  maxDeflection: number;
  maxDeflectionPosition: number;
  showOriginal: boolean;
  useAbsoluteColor: boolean;
}

export async function interpretBeamResults(data: BeamData): Promise<string> {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      throw new Error("GEMINI_API_KEY no está configurada");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `Actúa como un ingeniero estructural experto. Analiza los resultados de una viga simplemente apoyada (L = 10 m) con carga distribuida NO uniforme. Responde de forma técnica, concisa y estructurada SOLO con las 4 secciones indicadas abajo. PROHIBIDO incluir: resumen final, conclusiones genéricas, agradecimientos, despedidas, disculpas, frases meta como 'como IA/modelo', repeticiones de los parámetros o relleno.

**Parámetros de entrada:**
- Carga distribuida máxima (w₀): ${data.w0} kN/m
- Rigidez a flexión (EI): ${data.EI} kN·m²
- Escala de deformación para visualización: ${data.deformationScale}x

**Resultados calculados:**
- Deflexión máxima: ${(data.maxDeflection * 1000).toFixed(2)} mm
- Posición de deflexión máxima: ${data.maxDeflectionPosition.toFixed(
      2
    )} m desde el apoyo izquierdo

**Configuración de visualización:**
- Mostrar posición original: ${data.showOriginal ? "Sí" : "No"}
- Coloración absoluta: ${data.useAbsoluteColor ? "Sí" : "No"}

Devuelve EXACTAMENTE estas secciones en markdown, en este orden, sin texto antes o después:
### 1. Análisis técnico
Interpretación estructural directa de los valores.
### 2. Evaluación de servicio (L/360)
Comparación numérica deflexión vs límite, razonamiento breve.
### 3. Observaciones sobre distribución
Implicaciones de la posición de deflexión máxima y forma de carga.
### 4. Recomendaciones
Acciones concretas (ajustes EI, w₀, materiales, criterios admisibles).

Reglas de formato: Markdown limpio; evita listas vacías; sin despedidas ni frases motivacionales; no repetir parámetros; máximo 2–4 frases por sección si son párrafos. Puedes usar viñetas sólo en recomendaciones si mejora claridad.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return text;
  } catch (error) {
    console.error("Error al interpretar con Gemini:", error);
    throw new Error(
      error instanceof Error
        ? `Error de IA: ${error.message}`
        : "Error desconocido al interpretar resultados"
    );
  }
}
