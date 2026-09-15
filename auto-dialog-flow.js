/* =========================================================
   FLUJO AUTOMÁTICO DESPUÉS DE ANIMACIONES
   ========================================================= */

/*
 * Regla general de fluidez:
 * - El usuario toca para iniciar una animación.
 * - Al terminar la animación, el siguiente diálogo aparece automáticamente.
 * - Ya no hace falta un toque intermedio solo para revelar el diálogo.
 *
 * Se mantienen las interacciones que sí requieren una decisión concreta,
 * como tocar la carta resaltada en CA para abrir a Yetti.
 */

/* =========================================================
   PRÁCTICA — SALTAR ESTADOS DE ESPERA VACÍOS
   ========================================================= */

const autoStimulationDialogueSceneIndex = scenes.findIndex(
  scene => scene.type === "practice-board" && scene.practiceStep === "stimulation-dialogue"
);

const autoRehabilitationDialogueSceneIndex = scenes.findIndex(
  scene => scene.type === "practice-board" && scene.practiceStep === "rehabilitation-dialogue"
);

const baseRenderSceneForAutomaticDialogues = renderScene;
renderScene = function () {
  baseRenderSceneForAutomaticDialogues();

  const scene = scenes[sceneIndex];
  if (!scene || scene.type !== "practice-board") return;

  /*
   * La recuperación de salud ya terminó. En vez de dejar una pantalla de
   * espera que exige otro toque, mostramos de inmediato el diálogo de la
   * segunda acción.
   */
  if (
    scene.practiceStep === "health-recovered-wait" &&
    autoStimulationDialogueSceneIndex >= 0
  ) {
    sceneIndex = autoStimulationDialogueSceneIndex;
    renderScene();
    return;
  }

  /*
   * La ficha azul ya llegó a 41. Mostramos inmediatamente la explicación
   * de la rehabilitación, sin un toque adicional.
   */
  if (
    scene.practiceStep === "stimulation-done-wait" &&
    autoRehabilitationDialogueSceneIndex >= 0
  ) {
    sceneIndex = autoRehabilitationDialogueSceneIndex;
    renderScene();
  }
};

/* =========================================================
   TRATAMIENTO VETERINARIO — AVANCE AUTOMÁTICO AL TERMINAR
   ========================================================= */

const baseStartTreatmentAnimationForAutomaticDialogues = startTreatmentAnimation;
let automaticTreatmentAdvanceTimer = null;

function clearAutomaticTreatmentAdvanceTimer() {
  if (automaticTreatmentAdvanceTimer) {
    clearTimeout(automaticTreatmentAdvanceTimer);
    automaticTreatmentAdvanceTimer = null;
  }
}

function scheduleAutomaticTreatmentAdvance(scene, sceneAtStart, delay) {
  clearAutomaticTreatmentAdvanceTimer();

  automaticTreatmentAdvanceTimer = window.setTimeout(() => {
    automaticTreatmentAdvanceTimer = null;

    // Si el usuario ya cambió de escena o volvió atrás, no hacemos nada.
    if (sceneIndex !== sceneAtStart) return;
    if (scenes[sceneIndex] !== scene) return;

    // El temporizador original de treatment-flow.js marca la animación como
    // terminada justo antes de este punto. Dejamos un pequeño margen por
    // seguridad y avanzamos automáticamente al siguiente diálogo.
    if (treatmentAnimationRunning || !treatmentAnimationDone) {
      scheduleAutomaticTreatmentAdvance(scene, sceneAtStart, 90);
      return;
    }

    interactionLockedUntil = 0;
    advanceScene();
  }, delay);
}

startTreatmentAnimation = function (scene) {
  const sceneAtStart = sceneIndex;
  baseStartTreatmentAnimationForAutomaticDialogues(scene);

  if (!isInteractiveTreatmentScene(scene)) return;

  if (scene.treatmentStep === "health") {
    scheduleAutomaticTreatmentAdvance(scene, sceneAtStart, 1850);
    return;
  }

  if (scene.treatmentStep === "affection") {
    scheduleAutomaticTreatmentAdvance(scene, sceneAtStart, 1500);
  }
};

/* Al cambiar manualmente de escena, cancelamos cualquier avance pendiente. */
const basePreviousSceneForAutomaticDialogues = previousScene;
previousScene = function () {
  clearAutomaticTreatmentAdvanceTimer();
  basePreviousSceneForAutomaticDialogues();
};
