"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

export interface BeamData {
  w0: number;
  EI: number;
  deformationScale: number;
  maxDeflection: number;
  maxDeflectionPosition: number;
  showOriginal: boolean;
  useServiceLimitColor: boolean;
  serviceLimitDeflection: number;
}

export async function interpretBeamResults(data: BeamData): Promise<string> {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      throw new Error("GEMINI_API_KEY no está configurada");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `Actúa como un ingeniero estructural experto. Analiza los resultados de una viga de acero (L = 10 m) con condiciones de frontera asimétricas y distribución de cargas variable. Responde de forma técnica, concisa y estructurada SOLO con las 4 secciones indicadas abajo. PROHIBIDO incluir: resumen final, conclusiones genéricas, agradecimientos, despedidas, disculpas, frases meta como 'como IA/modelo', repeticiones de los parámetros o relleno.

**Configuración estructural:**
- Longitud de la viga: L = 10 m
- Condición de frontera izquierda: Empotrada (restricción de desplazamiento y rotación)
  - y(0) = 0, y'(0) = 0
- Condición de frontera derecha: Apoyada (restricción de desplazamiento y momento)
  - y(10) = 0, y''(10) = 0

**Distribución de cargas w(x):**
La carga distribuida w(x) se define mediante funciones escalón unitario u(x) con tres regiones:

1. Intervalo [0, 2] m: Crecimiento lineal
   - w(x) = (3/2)x - (3/2)x·u(x-2)
   - Pendiente m = 3/2
   - Carga incrementa de 0 a 3 kN/m

2. Intervalo [2, 8] m: Carga constante
   - w(x) = 3·u(x-2) - 3·u(x-8)
   - Valor constante de 3 kN/m

3. Intervalo [8, 10] m: Decrecimiento lineal
   - w(x) = -(3/2)(x-10)·u(x-8)
   - Pendiente m = -3/2
   - Carga decrece de 3 kN/m a 0

**Parámetros de entrada:**
- Intensidad de carga máxima (w₀): ${data.w0} kN/m
- Rigidez a flexión (EI): ${data.EI} kN·m²

**Resultados calculados:**
- Deflexión máxima: ${(data.maxDeflection * 1000).toFixed(2)} mm
- Posición de deflexión máxima: ${data.maxDeflectionPosition.toFixed(
      2
    )} m desde el extremo empotrado
- Límite de servicio (L/360): ${data.serviceLimitDeflection.toFixed(2)} mm

Devuelve EXACTAMENTE estas secciones en markdown, en este orden, sin texto antes o después:
### 1. Análisis técnico
Interpretación estructural directa de los valores considerando la asimetría del apoyo (empotrado-apoyado) y la distribución de cargas variable.
### 2. Evaluación de servicio (L/360)
Comparación numérica deflexión vs límite, razonamiento breve sobre cumplimiento normativo.
### 3. Observaciones sobre distribución
Implicaciones de la posición de deflexión máxima, efecto de la condición empotrada-apoyada, y forma de la carga w(x).
### 4. Recomendaciones
Acciones concretas (ajustes EI, w₀, materiales, redistribución de cargas, criterios admisibles).

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
