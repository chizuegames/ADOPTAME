/* =========================================================
   TRATAMIENTO DE RANGO — ANIMACIÓN ACTIVADA POR TOQUE
   ========================================================= */

/*
 * En las dos escenas del consultorio veterinario separamos lectura y acción:
 * 1. El diálogo aparece con el tablero quieto.
 * 2. El primer toque ejecuta la animación de las fichas.
 * 3. Cuando termina, un nuevo toque permite pasar al siguiente diálogo.
 *
 * Esto aplica tanto a las dos fichas verdes de salud como a la ficha fucsia
 * de afecto. La navegación general (toque simple / doble toque) sigue a cargo
 * de mobile-flow.js.
 */

let treatmentAnimationDone = false;
let treatmentAnimationRunning = false;
let treatmentCompletionTimer = null;

function isInteractiveTreatmentScene(scene) {
  return Boolean(
    scene &&
    scene.type === "vet-treatment" &&
    (scene.treatmentStep === "health" || scene.treatmentStep === "affection")
  );
}

function clearTreatmentCompletionTimer() {
  if (treatmentCompletionTimer) {
    clearTimeout(treatmentCompletionTimer);
    treatmentCompletionTimer = null;
  }
}

function prepareTreatmentScene(scene) {
  /*
   * app.js inicia estas animaciones automáticamente al renderizar.
   * Las detenemos de inmediato para que el usuario pueda leer primero.
   */
  clearStageAnimations();
  interactionLockedUntil = 0;

  treatmentAnimationDone = false;
  treatmentAnimationRunning = false;

  dialogueText.hidden = false;
  dialogueText.textContent = scene.text || "";
  applyVetTreatmentDialogueLayout();

  /*
   * Al llegar a la segunda acción, las dos fichas verdes ya deben verse
   * colocadas porque corresponden al resultado de la escena anterior.
   */
  if (scene.treatmentStep === "affection") {
    showHealthTokensPlaced();
  }

  stage.setAttribute(
    "aria-label",
    scene.treatmentStep === "health"
      ? "Rango está en el consultorio. Lee la explicación y toca la pantalla para colocar las dos fichas verdes de salud."
      : "Rango está en el consultorio con sus fichas verdes colocadas. Lee la explicación y toca la pantalla para colocar la ficha fucsia de afecto."
  );
}

function startTreatmentAnimation(scene) {
  if (!isInteractiveTreatmentScene(scene) || treatmentAnimationRunning || treatmentAnimationDone) return;

  treatmentAnimationRunning = true;
  clearTreatmentCompletionTimer();

  if (scene.treatmentStep === "health") {
    animateHealthTokens();

    treatmentCompletionTimer = window.setTimeout(() => {
      treatmentCompletionTimer = null;
      treatmentAnimationRunning = false;
      treatmentAnimationDone = true;
      interactionLockedUntil = 0;
      stage.setAttribute(
        "aria-label",
        "Las dos fichas verdes ya están colocadas. Toca la pantalla para continuar al siguiente diálogo."
      );
    }, 1800);

    return;
  }

  if (scene.treatmentStep === "affection") {
    animateAffectionToken();

    treatmentCompletionTimer = window.setTimeout(() => {
      treatmentCompletionTimer = null;
      treatmentAnimationRunning = false;
      treatmentAnimationDone = true;
      interactionLockedUntil = 0;
      stage.setAttribute(
        "aria-label",
        "La ficha fucsia ya está colocada. Toca la pantalla para continuar."
      );
    }, 1450);
  }
}

/* =========================================================
   INTEGRACIÓN CON EL RENDER FINAL
   ========================================================= */

const baseRenderSceneForTreatmentFlow = renderScene;
renderScene = function () {
  clearTreatmentCompletionTimer();

  baseRenderSceneForTreatmentFlow();

  const scene = scenes[sceneIndex];
  if (!isInteractiveTreatmentScene(scene)) {
    treatmentAnimationDone = false;
    treatmentAnimationRunning = false;
    return;
  }

  prepareTreatmentScene(scene);
};

/* =========================================================
   PRIMER TOQUE = ANIMAR | SEGUNDO TOQUE = CONTINUAR
   ========================================================= */

const baseAdvanceSceneForTreatmentFlow = advanceScene;
advanceScene = function () {
  const scene = scenes[sceneIndex];

  if (isInteractiveTreatmentScene(scene)) {
    if (treatmentAnimationRunning || Date.now() < interactionLockedUntil) return;

    if (!treatmentAnimationDone) {
      startTreatmentAnimation(scene);
      return;
    }
  }

  baseAdvanceSceneForTreatmentFlow();
};

const basePreviousSceneForTreatmentFlow = previousScene;
previousScene = function () {
  if (treatmentAnimationRunning || Date.now() < interactionLockedUntil) return;
  clearTreatmentCompletionTimer();
  basePreviousSceneForTreatmentFlow();
};
