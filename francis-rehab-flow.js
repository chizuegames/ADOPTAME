/* =========================================================
   REHABILITACIÓN DE FRANCIS — DESPUÉS DE LAS FICHAS AZULES
   ========================================================= */

/*
 * Secuencia:
 * - Alexandra coloca una ficha azul sobre Francis (42) y otra sobre Spirit (24).
 * - Sin toque adicional, las cuatro fichas de Francis en A4 pasan a Q:
 *     rosa 41  -> Qf1
 *     azul 42  -> Qz2  (Qz1 ya estaba ocupada)
 *     verde 43 -> Qv1
 *     verde 44 -> Qv4  (Qv2 y Qv3 ya estaban ocupadas)
 * - AN11s se voltea y revela AF11s.
 * - Después aparece el diálogo sobre Francis recuperado.
 * - Al continuar se retoma el diálogo de Horas Extra.
 */

const francisRecoveredPreload = new Image();
francisRecoveredPreload.src = "AF11s.png";

const directorFrancisRecoveredSceneIndex = scenes.length;
scenes.push({
  image: "IMGBE3.png",
  type: "practice-board",
  practiceStep: "director-francis-recovered",
  text: "Francis ya está recuperado. Podría irse con Mario y Lina, pero creo que pronto llegará un adoptante que encaje mejor con él, así que esperaremos un poco."
});

/* Yetti conserva sus dos descuidos y AS8 sigue activa durante este diálogo. */
if (typeof DIRECTOR_STEPS_WITH_SECOND_NEGLECT !== "undefined") {
  DIRECTOR_STEPS_WITH_SECOND_NEGLECT.add("director-francis-recovered");
}

if (typeof DIRECTOR_STEPS_WITH_AS8 !== "undefined") {
  DIRECTOR_STEPS_WITH_AS8.add("director-francis-recovered");
}

const FRANCIS_RECOVERED_STEPS = new Set([
  "director-francis-recovered",
  "director-overtime",
  "director-overtime-role",
  "director-valentina-help",
  "director-yetti-cleared",
  "director-round-threat",
  "director-round-die-two"
]);

/* =========================================================
   ESTADO REHABILITADO DE FRANCIS
   ========================================================= */

function applyFrancisRecoveredState() {
  /* La carta frontal desaparece y queda visible la cara rehabilitada. */
  removeBoardPiece("AN11");
  removeBoardPiece("AF11");
  createImagePiece("AF11", "AF11s.png", "A4", {
    zIndex: 17,
    alt: "Francis recuperado"
  });

  /* Ya no quedan fichas sobre A4. */
  [
    "Francis-41",
    "Francis-blue-42",
    "Francis-43",
    "Francis-44"
  ].forEach(removeBoardPiece);

  /* Normalizamos también posibles IDs de la animación de fichas azules. */
  removeBoardPiece("reserve-Fz4");

  /* Las fichas pasan a las primeras posiciones libres correspondientes en Q. */
  removeBoardPiece("Francis-Qf1");
  removeBoardPiece("Francis-Qz2");
  removeBoardPiece("Francis-Qv1");
  removeBoardPiece("Francis-Qv4");

  createImagePiece("Francis-Qf1", practiceTokenAssets.affection.small, "Qf1", {
    width: "1.72%",
    zIndex: 20,
    shadow: false,
    alt: "Ficha rosa de Francis agotada en Qf1"
  });

  createImagePiece("Francis-Qz2", practiceTokenAssets.stimulation.small, "Qz2", {
    width: "1.72%",
    zIndex: 20,
    shadow: false,
    alt: "Ficha azul de Francis agotada en Qz2"
  });

  createImagePiece("Francis-Qv1", practiceTokenAssets.health.small, "Qv1", {
    width: "1.72%",
    zIndex: 20,
    shadow: false,
    alt: "Primera ficha verde de Francis agotada en Qv1"
  });

  createImagePiece("Francis-Qv4", practiceTokenAssets.health.small, "Qv4", {
    width: "1.72%",
    zIndex: 20,
    shadow: false,
    alt: "Segunda ficha verde de Francis agotada en Qv4"
  });
}

/*
 * Todos los pasos posteriores deben conservar a Francis recuperado, incluso
 * cuando otros flujos vuelven a reconstruir el tablero desde cero.
 */
const baseRenderDirectorLateBoardForFrancisRehab = renderDirectorLateBoard;
renderDirectorLateBoard = function (options = {}) {
  baseRenderDirectorLateBoardForFrancisRehab(options);

  const step = scenes[sceneIndex]?.practiceStep;
  const francisRecovered = Boolean(
    options.francisRecovered ||
    options.overtimeSpent ||
    options.yettiCleared ||
    FRANCIS_RECOVERED_STEPS.has(step)
  );

  if (francisRecovered) {
    applyFrancisRecoveredState();
  }
};

/* =========================================================
   FICHAS AZULES + REHABILITACIÓN AUTOMÁTICA DE FRANCIS
   ========================================================= */

animateDirectorBlueActions = function () {
  if (directorLateAnimationRunning) return;

  directorLateAnimationRunning = true;
  interactionLockedUntil = Date.now() + 3900;

  const beginAnimation = () => {
    /* Estado justo antes de gastar las dos fichas azules. */
    baseRenderDirectorLateBoardForFrancisRehab({ spiritMoved: true });

    const francisBlue = boardPieces.get("reserve-Fz4");
    const spiritBlue = boardPieces.get("reserve-Fz3");
    if (francisBlue) francisBlue.style.zIndex = "31";
    if (spiritBlue) spiritBlue.style.zIndex = "31";

    /* Primera animación: azul a Francis y azul a Spirit. */
    window.setTimeout(() => {
      movePiece("reserve-Fz4", "42", {
        duration: 950,
        width: "1.78%"
      });

      movePiece("reserve-Fz3", "24", {
        duration: 950,
        width: "1.78%"
      });
    }, 120);

    /*
     * Al terminar, reconstruimos el mismo estado con IDs estables y, sin
     * pedir otro toque, comenzamos la rehabilitación de Francis.
     */
    window.setTimeout(() => {
      baseRenderDirectorLateBoardForFrancisRehab({
        spiritMoved: true,
        bluesPlaced: true
      });

      ["Francis-41", "Francis-blue-42", "Francis-43", "Francis-44"].forEach(id => {
        const piece = boardPieces.get(id);
        if (piece) piece.style.zIndex = "32";
      });

      /* Todas las fichas de A4 viajan a Q. */
      movePiece("Francis-41", "Qf1", {
        duration: 950,
        width: "1.72%"
      });

      window.setTimeout(() => {
        movePiece("Francis-blue-42", "Qz2", {
          duration: 950,
          width: "1.72%"
        });
      }, 90);

      window.setTimeout(() => {
        movePiece("Francis-43", "Qv1", {
          duration: 950,
          width: "1.72%"
        });
      }, 180);

      window.setTimeout(() => {
        movePiece("Francis-44", "Qv4", {
          duration: 950,
          width: "1.72%"
        });
      }, 270);

      /* Cuando las fichas han salido, la carta de Francis se voltea. */
      window.setTimeout(() => {
        const francis = boardPieces.get("AN11");
        if (!francis) return;

        francis.style.zIndex = "30";
        francis.style.transformOrigin = "center center";
        francis.style.transition = "transform 260ms ease-in, opacity 260ms ease-in";
        francis.style.transform = "perspective(700px) rotateY(90deg)";
        francis.style.opacity = "0.55";

        window.setTimeout(() => {
          francis.src = "AF11s.png";
          francis.alt = "Francis recuperado";
          francis.style.transition = "transform 300ms ease-out, opacity 300ms ease-out";
          francis.style.transform = "perspective(700px) rotateY(0deg)";
          francis.style.opacity = "1";
        }, 270);
      }, 1180);
    }, 1190);

    directorLateTimer = window.setTimeout(() => {
      finishDirectorLateAnimation(directorFrancisRecoveredSceneIndex);
    }, 3030);
  };

  hidePracticeDialogueBeforeAnimation(beginAnimation);
};

/* =========================================================
   RENDER DEL NUEVO DIÁLOGO
   ========================================================= */

const baseRenderSceneForFrancisRehab = renderScene;
renderScene = function () {
  baseRenderSceneForFrancisRehab();

  const scene = scenes[sceneIndex];
  if (!scene || scene.practiceStep !== "director-francis-recovered") return;

  renderDirectorLateBoard({
    spiritMoved: true,
    bluesPlaced: true,
    francisRecovered: true
  });

  setSceneImage("IMGBE3.png", "Tablero durante el turno de Alexandra");
  showSpeakerDialogue("RD.png", scene);
  stage.setAttribute(
    "aria-label",
    "Francis ya está recuperado. Sus fichas pasaron a la zona Q y su carta muestra la cara rehabilitada. Toca para continuar."
  );
};

/* =========================================================
   AVANCE Y RETROCESO
   ========================================================= */

const baseAdvanceSceneForFrancisRehab = advanceScene;
advanceScene = function () {
  const scene = scenes[sceneIndex];

  if (directorLateAnimationRunning) return;

  if (scene?.practiceStep === "director-francis-recovered") {
    sceneIndex = directorOvertimeSceneIndex;
    interactionLockedUntil = 0;
    renderScene();
    return;
  }

  baseAdvanceSceneForFrancisRehab();
};

const basePreviousSceneForFrancisRehab = previousScene;
previousScene = function () {
  if (directorLateAnimationRunning || Date.now() < interactionLockedUntil) return;

  const scene = scenes[sceneIndex];

  if (scene?.practiceStep === "director-francis-recovered") {
    sceneIndex = directorBlueActionsSceneIndex;
    renderScene();
    return;
  }

  if (scene?.practiceStep === "director-overtime") {
    sceneIndex = directorFrancisRecoveredSceneIndex;
    renderScene();
    return;
  }

  basePreviousSceneForFrancisRehab();
};
