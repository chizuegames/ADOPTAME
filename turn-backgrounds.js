/* =========================================================
   FONDOS POR TURNO — PRÁCTICA
   ========================================================= */

/*
 * Cada cambio de fondo marca el inicio real de un turno:
 *
 *   Valentina             -> IMGBE4.png
 *   Giovanni              -> IMGBE1.png
 *   Tatiana               -> IMGBE2.png
 *   Alexandra / Directora -> IMGBE3.png
 *
 * Puntos exactos de transición:
 * - La práctica inicia con Valentina sobre IMGBE4.
 * - "Con esto termina el turno de Valentina..." marca el inicio del turno
 *   de Giovanni, por lo que desde ese diálogo usamos IMGBE1.
 * - El fondo permanece IMGBE1 hasta el diálogo de RC
 *   "Bueno, pasemos a la siguiente carta de amenaza...". Desde ese diálogo
 *   comienza el turno de Tatiana y usamos IMGBE2.
 * - Los diálogos previos de presentación de la directora todavía ocurren
 *   sobre el turno de Tatiana.
 * - El turno real de Alexandra / la directora comienza cuando aparece:
 *   "¡Manos a la obra! Voy a aprovechar este turno al máximo. Empecemos
 *   pagando la factura.". Desde ese diálogo usamos IMGBE3.
 */

const PRACTICE_TURN_BACKGROUNDS = {
  valentina: "IMGBE4.png",
  giovanni: "IMGBE1.png",
  tatiana: "IMGBE2.png",
  directora: "IMGBE3.png"
};

Object.values(PRACTICE_TURN_BACKGROUNDS).forEach(src => {
  const img = new Image();
  img.src = src;
});

function findPracticeStepIndex(step) {
  return scenes.findIndex(
    scene => scene?.type === "practice-board" && scene.practiceStep === step
  );
}

function findPracticeTextIndex(fragment) {
  return scenes.findIndex(
    scene => scene?.type === "practice-board" && scene.text?.includes(fragment)
  );
}

function findDirectorTurnStartIndex() {
  /*
   * Cuando implementemos/ajustemos el bloque de acciones de Alexandra,
   * puede usar el step director-work-start. Mientras tanto, el propio texto
   * del diálogo sirve como ancla estable para el cambio de fondo.
   */
  const byStep = findPracticeStepIndex("director-work-start");
  if (byStep >= 0) return byStep;

  return findPracticeTextIndex(
    "¡Manos a la obra! Voy a aprovechar este turno al máximo. Empecemos pagando la factura."
  );
}

function getPracticeTurnBackground(sceneIndexToCheck = sceneIndex) {
  const scene = scenes[sceneIndexToCheck];
  if (!scene || scene.type !== "practice-board") return null;

  const practiceStartIndex = findPracticeStepIndex("intro");
  const giovanniStartIndex = findPracticeStepIndex("after-roll");
  const tatianaStartIndex = findPracticeStepIndex("tatiana-next-threat");
  const directoraStartIndex = findDirectorTurnStartIndex();

  if (
    directoraStartIndex >= 0 &&
    sceneIndexToCheck >= directoraStartIndex
  ) {
    return PRACTICE_TURN_BACKGROUNDS.directora;
  }

  if (
    tatianaStartIndex >= 0 &&
    sceneIndexToCheck >= tatianaStartIndex
  ) {
    return PRACTICE_TURN_BACKGROUNDS.tatiana;
  }

  if (
    giovanniStartIndex >= 0 &&
    sceneIndexToCheck >= giovanniStartIndex
  ) {
    return PRACTICE_TURN_BACKGROUNDS.giovanni;
  }

  if (
    practiceStartIndex >= 0 &&
    sceneIndexToCheck >= practiceStartIndex
  ) {
    return PRACTICE_TURN_BACKGROUNDS.valentina;
  }

  return null;
}

function applyPracticeTurnBackground() {
  const background = getPracticeTurnBackground();
  if (!background) return;

  setSceneImage(background, "Tablero de práctica del turno actual");
}

/*
 * Los flujos de Tatiana y de la directora reutilizan esta función durante
 * sus animaciones. La redefinimos para que respete el turno actual en vez de
 * forzar siempre IMGBE2.
 */
if (typeof applyTatianaBackground === "function") {
  applyTatianaBackground = function () {
    applyPracticeTurnBackground();
  };
}

/*
 * Este envoltorio se carga al final de todos los flujos. De esta forma,
 * aunque una escena anterior todavía declare IMGBE1/IMGBE2 como image, el
 * fondo definitivo queda determinado por el turno.
 */
const baseRenderSceneForTurnBackgrounds = renderScene;
renderScene = function () {
  baseRenderSceneForTurnBackgrounds();
  applyPracticeTurnBackground();
};

renderScene();
