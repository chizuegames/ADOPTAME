/* =========================================================
   ACUMULACIÓN DE DESCUIDO DE YETTI — TURNO DE ALEXANDRA
   ========================================================= */

/*
 * Este paso ocurre después de resolver el resultado 1 del dado:
 * - AN15 ya pasó de CA a A1.
 * - AN9 quedó visible en CA.
 * - Antes de que comience el turno real de Alexandra, recordamos que el
 *   descuido de Yetti se acumuló por no haber sido retirado en el turno
 *   anterior.
 * - Una segunda ficha negra baja desde Fn5 hasta la posición 35.
 * - El fondo se mantiene en IMGBE2 durante este diálogo; IMGBE3 comienza
 *   recién en director-work-start, tal como quedó definido anteriormente.
 */

const directorNeglectAccumulationSceneIndex = scenes.length;
scenes.push({
  image: "IMGBE2.png",
  type: "practice-board",
  practiceStep: "director-neglect-accumulation",
  text: "Como nos advirtió Valentina, el descuido de Yetti se ha acumulado. Como no lo retiramos en el turno anterior, ahora tendrá 2 fichas de descuido."
});

let directorSecondNeglectPlaced = false;
let directorSecondNeglectAutoStarted = false;
let directorSecondNeglectAnimationRunning = false;
let directorSecondNeglectTimer = null;

const DIRECTOR_STEPS_WITH_SECOND_NEGLECT = new Set([
  "director-work-start",
  "director-paid-discount",
  "director-adoption-plan",
  "director-adoption-comparison",
  "director-adoption-reward",
  "director-reward-done"
]);

function shouldShowDirectorSecondNeglect() {
  const step = scenes[sceneIndex]?.practiceStep;

  if (step === "director-neglect-accumulation") {
    return directorSecondNeglectPlaced;
  }

  return DIRECTOR_STEPS_WITH_SECOND_NEGLECT.has(step);
}

function placeDirectorSecondNeglectStatic() {
  removeBoardPiece("reserve-Fn5");
  removeBoardPiece("Yetti-35");

  createImagePiece("Yetti-35", practiceTokenAssets.neglect.small, "35", {
    width: "1.78%",
    zIndex: 23,
    shadow: false,
    alt: "Segunda ficha de descuido acumulada sobre Yetti"
  });
}

/*
 * Todos los estados posteriores del tablero deben conservar las dos fichas
 * negras de Yetti: la primera en 36 y la segunda en 35.
 */
const baseRenderDirectorContinuationBoardForNeglect = renderDirectorContinuationBoard;
renderDirectorContinuationBoard = function (options = {}) {
  baseRenderDirectorContinuationBoardForNeglect(options);

  if (shouldShowDirectorSecondNeglect()) {
    placeDirectorSecondNeglectStatic();
  } else {
    removeBoardPiece("Yetti-35");
  }
};

/* =========================================================
   RESCATE DE URGENCIA — AHORA TERMINA EN EL NUEVO DIÁLOGO
   ========================================================= */

animateDirectorRescueToA1 = function () {
  if (directorContinuationAnimationRunning || directorSecondNeglectAnimationRunning) return;

  directorContinuationAnimationRunning = true;
  interactionLockedUntil = Date.now() + 1600;
  directorSecondNeglectPlaced = false;
  directorSecondNeglectAutoStarted = false;

  const beginAnimation = () => {
    renderDirectorContinuationBoard({ diceFace: 1 });

    createImagePiece("AN9", "AN9s.png", "CA", {
      zIndex: 13,
      alt: "Siguiente animal AN9"
    });

    const rescue = boardPieces.get("AN15");
    if (rescue) rescue.style.zIndex = "29";

    window.setTimeout(() => {
      movePiece("AN15", "A1", { duration: 1050 });
    }, 120);

    directorContinuationTimer = window.setTimeout(() => {
      finishDirectorContinuationAnimation(directorNeglectAccumulationSceneIndex);
    }, 1320);
  };

  hidePracticeDialogueBeforeAnimation(beginAnimation);
};

/* =========================================================
   SEGUNDA FICHA NEGRA — Fn5 -> 35
   Se anima automáticamente mientras el nuevo diálogo permanece visible.
   ========================================================= */

function animateDirectorSecondNeglectToYetti() {
  if (
    directorSecondNeglectAnimationRunning ||
    directorSecondNeglectAutoStarted ||
    directorSecondNeglectPlaced ||
    scenes[sceneIndex]?.practiceStep !== "director-neglect-accumulation"
  ) {
    return;
  }

  directorSecondNeglectAutoStarted = true;
  directorSecondNeglectAnimationRunning = true;
  interactionLockedUntil = Date.now() + 1500;

  const token = boardPieces.get("reserve-Fn5");

  if (!token) {
    directorSecondNeglectPlaced = true;
    directorSecondNeglectAnimationRunning = false;
    interactionLockedUntil = 0;
    renderScene();
    return;
  }

  token.style.zIndex = "31";

  window.setTimeout(() => {
    movePiece("reserve-Fn5", "35", {
      duration: 950,
      width: "1.78%"
    });
  }, 180);

  directorSecondNeglectTimer = window.setTimeout(() => {
    directorSecondNeglectTimer = null;
    directorSecondNeglectPlaced = true;
    directorSecondNeglectAnimationRunning = false;
    interactionLockedUntil = 0;
  }, 1260);
}

/* =========================================================
   RENDER
   ========================================================= */

const baseRenderSceneForDirectorNeglect = renderScene;
renderScene = function () {
  baseRenderSceneForDirectorNeglect();

  const scene = scenes[sceneIndex];
  if (!scene || scene.type !== "practice-board") return;

  if (scene.practiceStep === "director-neglect-accumulation") {
    renderDirectorContinuationBoard({
      diceFace: 1,
      rescuePlaced: true
    });

    /* Este diálogo todavía pertenece al cierre del turno anterior. */
    setSceneImage("IMGBE2.png", "Tablero de práctica antes del turno de Alexandra");
    showSpeakerDialogue("RD.png", scene);

    stage.setAttribute(
      "aria-label",
      "El descuido de Yetti se acumuló. Una segunda ficha negra baja hasta la posición 35."
    );

    window.setTimeout(() => {
      animateDirectorSecondNeglectToYetti();
    }, 120);
  }
};

/* =========================================================
   AVANCE
   ========================================================= */

const baseAdvanceSceneForDirectorNeglect = advanceScene;
advanceScene = function () {
  const scene = scenes[sceneIndex];

  if (directorSecondNeglectAnimationRunning) return;

  if (scene?.practiceStep === "director-neglect-accumulation") {
    directorSecondNeglectPlaced = true;
    directorSecondNeglectAutoStarted = true;
    sceneIndex = directorWorkStartSceneIndex;
    interactionLockedUntil = 0;
    renderScene();
    return;
  }

  baseAdvanceSceneForDirectorNeglect();
};

/* =========================================================
   RETROCESO
   ========================================================= */

const basePreviousSceneForDirectorNeglect = previousScene;
previousScene = function () {
  if (
    directorSecondNeglectAnimationRunning ||
    Date.now() < interactionLockedUntil
  ) {
    return;
  }

  const scene = scenes[sceneIndex];

  if (scene?.practiceStep === "director-neglect-accumulation") {
    directorSecondNeglectPlaced = false;
    directorSecondNeglectAutoStarted = false;
    sceneIndex = directorRescueResultSceneIndex;
    renderScene();
    return;
  }

  if (scene?.practiceStep === "director-work-start") {
    directorSecondNeglectPlaced = true;
    directorSecondNeglectAutoStarted = true;
    sceneIndex = directorNeglectAccumulationSceneIndex;
    renderScene();
    return;
  }

  basePreviousSceneForDirectorNeglect();
};
