"use client";

import { useEffect } from "react";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

export function useAppTour() {
  useEffect(() => {
    const hasSeenTour = localStorage.getItem("beam-app-tour-seen");

    if (!hasSeenTour) {
      const driverObj = driver({
        showProgress: true,
        showButtons: ["next", "previous", "close"],
        nextBtnText: "Siguiente",
        prevBtnText: "Anterior",
        doneBtnText: "Finalizar",
        popoverClass: "driverjs-theme",
        steps: [
          {
            element: "#control-panel",
            popover: {
              title: "Panel de Parámetros de Control",
              description:
                "Aquí puedes ajustar todos los parámetros que afectan el comportamiento de la viga: la carga aplicada, la rigidez del material y la escala de visualización.",
              side: "right",
              align: "start",
            },
          },
          {
            element: "#w0-control",
            popover: {
              title: "Control de Carga (w₀)",
              description:
                "Ajusta la carga distribuida aplicada a la viga en kN/m. Valores más altos producen mayor deflexión.",
              side: "right",
              align: "start",
            },
          },
          {
            element: "#ei-control",
            popover: {
              title: "Control de Rigidez (EI)",
              description:
                "Modifica la rigidez flexional de la viga. Valores más altos reducen la deflexión.",
              side: "right",
              align: "start",
            },
          },
          {
            element: "#scale-control",
            popover: {
              title: "Escala de Deformación",
              description:
                "Amplifica visualmente la deformación de la viga para facilitar su observación.",
              side: "right",
              align: "start",
            },
          },
          {
            element: "#show-original-toggle",
            popover: {
              title: "Comparación Visual",
              description:
                "Activa o desactiva la visualización de la viga original (sin deformar) para comparar.",
              side: "right",
              align: "start",
            },
          },
          {
            element: "#ai-interpret-button",
            popover: {
              title: "Interpretación con IA",
              description:
                "Obtén un análisis estructural completo de los resultados usando inteligencia artificial. La IA evaluará si la deflexión está dentro de límites aceptables y te dará recomendaciones.",
              side: "right",
              align: "start",
            },
          },
          {
            element: ".beam-canvas-container",
            popover: {
              title: "Visualización 3D",
              description:
                "Aquí puedes ver la viga deformada en 3D. Usa el ratón para rotar, hacer zoom y explorar la visualización.",
              side: "left",
              align: "start",
            },
          },
          {
            element: "#load-chart",
            popover: {
              title: "Gráfica de Carga",
              description:
                "Muestra la distribución de carga a lo largo de la viga según la función w(x).",
              side: "top",
              align: "start",
            },
          },
          {
            element: "#deflection-chart",
            popover: {
              title: "Gráfica de Deflexión",
              description:
                "Representa la curva de deflexión y(x) calculada mediante la Transformada de Laplace.",
              side: "top",
              align: "start",
            },
          },
          {
            element: ".formula-container",
            popover: {
              title: "Ecuación de Deflexión",
              description:
                "La ecuación matemática que describe la deflexión de la viga en función de x.",
              side: "top",
              align: "start",
            },
          },
        ],
        onDestroyStarted: () => {
          localStorage.setItem("beam-app-tour-seen", "true");
          driverObj.destroy();
        },
      });

      setTimeout(() => {
        driverObj.drive();
      }, 1000);
    }
  }, []);

  const startTour = () => {
    const driverObj = driver({
      showProgress: true,
      showButtons: ["next", "previous", "close"],
      nextBtnText: "Siguiente",
      prevBtnText: "Anterior",
      doneBtnText: "Finalizar",
      popoverClass: "driverjs-theme",
      steps: [
        {
          element: "#control-panel",
          popover: {
            title: "Panel de Parámetros de Control",
            description:
              "Aquí puedes ajustar todos los parámetros que afectan el comportamiento de la viga: la carga aplicada, la rigidez del material y la escala de visualización.",
            side: "right",
            align: "start",
          },
        },
        {
          element: "#w0-control",
          popover: {
            title: "Control de Carga (w₀)",
            description:
              "Ajusta la carga distribuida aplicada a la viga en kN/m. Valores más altos producen mayor deflexión.",
            side: "right",
            align: "start",
          },
        },
        {
          element: "#ei-control",
          popover: {
            title: "Control de Rigidez (EI)",
            description:
              "Modifica la rigidez flexional de la viga. Valores más altos reducen la deflexión.",
            side: "right",
            align: "start",
          },
        },
        {
          element: "#scale-control",
          popover: {
            title: "Escala de Deformación",
            description:
              "Amplifica visualmente la deformación de la viga para facilitar su observación.",
            side: "right",
            align: "start",
          },
        },
        {
          element: "#show-original-toggle",
          popover: {
            title: "Comparación Visual",
            description:
              "Activa o desactiva la visualización de la viga original (sin deformar) para comparar.",
            side: "right",
            align: "start",
          },
        },
        {
          element: "#ai-interpret-button",
          popover: {
            title: "Interpretación con IA",
            description:
              "Obtén un análisis estructural completo de los resultados usando inteligencia artificial. La IA evaluará si la deflexión está dentro de límites aceptables y te dará recomendaciones.",
            side: "right",
            align: "start",
          },
        },
        {
          element: ".beam-canvas-container",
          popover: {
            title: "Visualización 3D",
            description:
              "Aquí puedes ver la viga deformada en 3D. Usa el ratón para rotar, hacer zoom y explorar la visualización.",
            side: "left",
            align: "start",
          },
        },
        {
          element: "#load-chart",
          popover: {
            title: "Gráfica de Carga",
            description:
              "Muestra la distribución de carga a lo largo de la viga según la función w(x).",
            side: "top",
            align: "start",
          },
        },
        {
          element: "#deflection-chart",
          popover: {
            title: "Gráfica de Deflexión",
            description:
              "Representa la curva de deflexión y(x) calculada mediante la Transformada de Laplace.",
            side: "top",
            align: "start",
          },
        },
        {
          element: ".formula-container",
          popover: {
            title: "Ecuación de Deflexión",
            description:
              "La ecuación matemática que describe la deflexión de la viga en función de x.",
            side: "top",
            align: "start",
          },
        },
      ],
    });

    driverObj.drive();
  };

  return { startTour };
}
