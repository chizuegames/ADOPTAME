/* =========================================================
   HORAS EXTRA — DIÁLOGO DIVIDIDO EN DOS
   ========================================================= */

/*
 * Divide el texto de Horas Extra para que no se corte en pantalla.
 * Mantiene exactamente el mismo estado del tablero entre ambos cuadros.
 */

if (Number.isInteger(directorOvertimeSceneIndex) && scenes[directorOvertimeSceneIndex]) {
  scenes[directorOvertimeSceneIndex].text =
    "No se preocupen por Yetti, ya tengo todo bajo control. Como ya no me quedan acciones, usaré Horas Extra: gastaré 2 fichas amarillas para realizar una acción adicional.";
}

const directorOvertimeRoleSceneIndex = scenes.length;
scenes.push({
  image: "IMGBE3.png",
  type: "practice-board",
  practiceStep: "director-overtime-role",
  text: "Incluso puedo usar la habilidad de otro rol, y esta vez necesitaré la de Valentina."
});

/* Durante la segunda parte siguen visibles AS8 y los dos descuidos de Yetti. */
if (typeof DIRECTOR_STEPS_WITH_SECOND_NEGLECT !== "undefined") {
  DIRECTOR_STEPS_WITH_SECOND_NEGLECT.add("director-overtime-role");
}

if (typeof DIRECTOR_STEPS_WITH_AS8 !== "undefined") {
  DIRECTOR_STEPS_WITH_AS8.add("director-overtime-role");
}

/* =========================================================
   RENDER
   ========================================================= */

const baseRenderSceneForOvertimeSplit = renderScene;
renderScene = function () {
  baseRenderSceneForOvertimeSplit();

  const scene = scenes[sceneIndex];
  if (!scene || scene.practiceStep !== "director-overtime-role") return;

  renderDirectorLateBoard({
    spiritMoved: true,
    bluesPlaced: true
  });
  setSceneImage("IMGBE3.png", "Tablero durante el turno de Alexandra");
  showSpeakerDialogue("RD.png", scene);
  stage.setAttribute(
    "aria-label",
    "Alexandra explica que con Horas Extra puede usar la habilidad de otro rol y que necesitará la de Valentina. Toca para continuar."
  );
};

/* =========================================================
   AVANCE
   ========================================================= */

const baseAdvanceSceneForOvertimeSplit = advanceScene;
advanceScene = function () {
  const scene = scenes[sceneIndex];

  if (directorLateAnimationRunning) return;

  /* Primera mitad -> segunda mitad, sin alterar el tablero. */
  if (scene?.practiceStep === "director-overtime") {
    sceneIndex = directorOvertimeRoleSceneIndex;
    interactionLockedUntil = 0;
    renderScene();
    return;
  }

  /* Segunda mitad -> conserva la animación existente de pago de Horas Extra. */
  if (scene?.practiceStep === "director-overtime-role") {
    animateDirectorOvertimePayment();
    return;
  }

  baseAdvanceSceneForOvertimeSplit();
};

/* =========================================================
   RETROCESO
   ========================================================= */

const basePreviousSceneForOvertimeSplit = previousScene;
previousScene = function () {
  if (directorLateAnimationRunning || Date.now() < interactionLockedUntil) return;

  const scene = scenes[sceneIndex];

  if (scene?.practiceStep === "director-overtime-role") {
    sceneIndex = directorOvertimeSceneIndex;
    renderScene();
    return;
  }

  /* Al volver desde Valentina regresamos a la segunda mitad del texto. */
  if (scene?.practiceStep === "director-valentina-help") {
    sceneIndex = directorOvertimeRoleSceneIndex;
    renderScene();
    return;
  }

  basePreviousSceneForOvertimeSplit();
};
