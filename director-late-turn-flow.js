/* =========================================================
   CONTINUACIÓN FINAL DEL TURNO DE ALEXANDRA
   ========================================================= */

/*
 * Ajustes de esta etapa:
 * - Después de que Yetti recibe su segunda ficha de descuido, AS7 pasa
 *   de CE a CO y AS8 queda activa en CE antes de “¡Manos a la obra!”.
 * - Después de la adopción de Rango, Spirit (AN15) pasa de A1 a A2.
 * - Alexandra coloca dos fichas azules: Francis en 42 y Spirit en 24.
 * - Horas Extra gasta dos fichas amarillas y las envía a Qa2 y Qa3.
 * - Valentina retira los dos descuidos de Yetti y devuelve las fichas
 *   negras a Fn5 y Fn6.
 */

const directorLatePreload = ["AS8s.png"];
directorLatePreload.forEach(src => {
  const img = new Image();
  img.src = src;
});

/* =========================================================
   NUEVOS DIÁLOGOS
   ========================================================= */

/* El estado final de la adopción deja de ser silencioso. */
if (Number.isInteger(directorRewardDoneSceneIndex) && scenes[directorRewardDoneSceneIndex]) {
  scenes[directorRewardDoneSceneIndex].text =
    "Ahora que Rango se ha ido, podemos darle su lugar a Spirit para que no tenga que quedarse en la recepción. Si permaneciera allí hasta el siguiente turno, recibiría una ficha de descuido.";
}

const directorBlueActionsSceneIndex = scenes.length;
scenes.push({
  image: "IMGBE3.png",
  type: "practice-board",
  practiceStep: "director-blue-actions",
  text: "Dar a un animal en adopción no consume ninguna acción, así que ahora sí comenzaré con las mías. Por el momento, colocaré una ficha azul sobre Francis y otra sobre Spirit."
});

const directorOvertimeSceneIndex = scenes.length;
scenes.push({
  image: "IMGBE3.png",
  type: "practice-board",
  practiceStep: "director-overtime",
  text: "No se preocupen por Yetti, ya tengo todo bajo control. Como ya no me quedan acciones, usaré Horas Extra: gastaré 2 fichas amarillas para realizar una acción adicional. Incluso puedo usar la habilidad de otro rol, y esta vez necesitaré la de Valentina."
});

const directorValentinaHelpSceneIndex = scenes.length;
scenes.push({
  image: "IMGBE3.png",
  type: "practice-board",
  practiceStep: "director-valentina-help",
  text: "¿Me llamaste? Oh... ya entiendo. Vas a usar Horas Extra para aprovechar mi habilidad. ¡Perfecto! Puedo retirar 2 fichas negras de cualquier animal, así que me encargaré de Yetti."
});

const directorYettiClearedSceneIndex = scenes.length;
scenes.push({
  image: "IMGBE3.png",
  type: "practice-board",
  practiceStep: "director-yetti-cleared",
  text: ""
});

/* Los dos descuidos deben seguir visibles hasta que Valentina los retire. */
[
  "director-blue-actions",
  "director-overtime",
  "director-valentina-help"
].forEach(step => DIRECTOR_STEPS_WITH_SECOND_NEGLECT.add(step));

const DIRECTOR_STEPS_WITH_AS8 = new Set([
  "director-work-start",
  "director-paid-discount",
  "director-adoption-plan",
  "director-adoption-comparison",
  "director-adoption-reward",
  "director-reward-done",
  "director-blue-actions",
  "director-overtime",
  "director-valentina-help",
  "director-yetti-cleared"
]);

/* =========================================================
   ESTADO DE AMENAZA: AS8 ACTIVA / AS7 DESCARTADA
   ========================================================= */

function applyDirectorThreatAS8State() {
  removeBoardPiece("AS6");
  removeBoardPiece("AS7");
  removeBoardPiece("AS8");

  createImagePiece("AS8", "AS8s.png", "CE", {
    zIndex: 15,
    alt: "Amenaza AS8 activa"
  });

  createImagePiece("AS7", "AS7s.png", "CO", {
    zIndex: 14,
    alt: "Amenaza AS7 descartada"
  });
}

const baseRenderDirectorContinuationBoardForLateTurn = renderDirectorContinuationBoard;
renderDirectorContinuationBoard = function (options = {}) {
  baseRenderDirectorContinuationBoardForLateTurn(options);

  const step = scenes[sceneIndex]?.practiceStep;
  if (DIRECTOR_STEPS_WITH_AS8.has(step)) {
    applyDirectorThreatAS8State();
  }
};

/* =========================================================
   ESTADOS POSTERIORES A LA ADOPCIÓN
   ========================================================= */

function renderDirectorLateBoard(options = {}) {
  const spiritMoved = Boolean(options.spiritMoved);
  const bluesPlaced = Boolean(options.bluesPlaced);
  const overtimeSpent = Boolean(options.overtimeSpent);
  const yettiCleared = Boolean(options.yettiCleared);

  renderDirectorContinuationBoard({
    diceFace: 1,
    rescuePlaced: true,
    invoicePaid: true,
    adoptionComplete: true,
    rewardsReturned: true
  });

  /* Spirit deja A1 y ocupa el lugar libre de Rango en A2. */
  if (spiritMoved || bluesPlaced || overtimeSpent || yettiCleared) {
    removeBoardPiece("AN15");
    createImagePiece("AN15", "AN15s.png", "A2", {
      zIndex: 17,
      alt: "Spirit ubicado en A2"
    });
  }

  /* Dos acciones de Alexandra: estimulación para Francis y Spirit. */
  if (bluesPlaced || overtimeSpent || yettiCleared) {
    removeBoardPiece("reserve-Fz4");
    removeBoardPiece("reserve-Fz3");

    createImagePiece("Francis-blue-42", practiceTokenAssets.stimulation.small, "42", {
      width: "1.78%",
      zIndex: 23,
      shadow: false,
      alt: "Ficha azul de estimulación sobre Francis"
    });

    createImagePiece("Spirit-blue-24", practiceTokenAssets.stimulation.small, "24", {
      width: "1.78%",
      zIndex: 23,
      shadow: false,
      alt: "Ficha azul de estimulación sobre Spirit"
    });
  }

  /* Horas Extra consume dos fichas amarillas. Qa1 ya contiene la factura. */
  if (overtimeSpent || yettiCleared) {
    removeBoardPiece("reserve-Fa5");
    removeBoardPiece("reserve-Fa4");

    createImagePiece("overtime-Qa2", practiceTokenAssets.money.small, "Qa2", {
      width: "1.72%",
      zIndex: 20,
      shadow: false,
      alt: "Primera ficha amarilla gastada en Horas Extra"
    });

    createImagePiece("overtime-Qa3", practiceTokenAssets.money.small, "Qa3", {
      width: "1.72%",
      zIndex: 20,
      shadow: false,
      alt: "Segunda ficha amarilla gastada en Horas Extra"
    });
  }

  /* Valentina devuelve los dos descuidos de Yetti a la reserva F. */
  if (yettiCleared) {
    removeBoardPiece("Yetti-35");
    removeBoardPiece("Yetti-36");
    removeBoardPiece("reserve-Fn5");
    removeBoardPiece("reserve-Fn6");

    createImagePiece("reserve-Fn5", practiceTokenAssets.neglect.small, "Fn5", {
      width: "1.72%",
      zIndex: 18,
      shadow: false,
      alt: "Ficha negra devuelta a Fn5"
    });

    createImagePiece("reserve-Fn6", practiceTokenAssets.neglect.small, "Fn6", {
      width: "1.72%",
      zIndex: 18,
      shadow: false,
      alt: "Ficha negra devuelta a Fn6"
    });
  }
}

/* =========================================================
   CONTROL DE ANIMACIONES
   ========================================================= */

let directorLateAnimationRunning = false;
let directorLateTimer = null;

function finishDirectorLateAnimation(nextSceneIndex) {
  directorLateTimer = null;
  directorLateAnimationRunning = false;
  interactionLockedUntil = 0;
  sceneIndex = nextSceneIndex;
  renderScene();
}

/* =========================================================
   AS7: CE -> CO / AS8 QUEDA ACTIVA EN CE
   ========================================================= */

function animateDirectorThreatToAS8() {
  if (
    directorLateAnimationRunning ||
    directorSecondNeglectAnimationRunning ||
    directorContinuationAnimationRunning
  ) {
    return;
  }

  directorLateAnimationRunning = true;
  interactionLockedUntil = Date.now() + 1700;
  directorSecondNeglectPlaced = true;
  directorSecondNeglectAutoStarted = true;

  const beginAnimation = () => {
    renderDirectorContinuationBoard({
      diceFace: 1,
      rescuePlaced: true
    });

    /* AS8 queda debajo mientras AS7 se desplaza hacia el descarte. */
    createImagePiece("AS8", "AS8s.png", "CE", {
      zIndex: 13,
      alt: "Nueva amenaza AS8"
    });

    const as7 = boardPieces.get("AS7");
    if (as7) as7.style.zIndex = "28";

    window.setTimeout(() => {
      movePiece("AS7", "CO", { duration: 1050 });
    }, 120);

    /* AS6 queda cubierta por AS7 y deja de verse. */
    window.setTimeout(() => {
      removeBoardPiece("AS6");
    }, 1040);

    directorLateTimer = window.setTimeout(() => {
      finishDirectorLateAnimation(directorWorkStartSceneIndex);
    }, 1370);
  };

  hidePracticeDialogueBeforeAnimation(beginAnimation);
}

/* =========================================================
   SPIRIT: A1 -> A2
   ========================================================= */

function animateDirectorSpiritToA2() {
  if (directorLateAnimationRunning) return;

  directorLateAnimationRunning = true;
  interactionLockedUntil = Date.now() + 1600;

  const beginAnimation = () => {
    renderDirectorLateBoard();

    const spirit = boardPieces.get("AN15");
    if (spirit) spirit.style.zIndex = "29";

    window.setTimeout(() => {
      movePiece("AN15", "A2", { duration: 1050 });
    }, 120);

    directorLateTimer = window.setTimeout(() => {
      finishDirectorLateAnimation(directorBlueActionsSceneIndex);
    }, 1320);
  };

  hidePracticeDialogueBeforeAnimation(beginAnimation);
}

/* =========================================================
   DOS FICHAS AZULES: Fz4 -> 42 / Fz3 -> 24
   ========================================================= */

function animateDirectorBlueActions() {
  if (directorLateAnimationRunning) return;

  directorLateAnimationRunning = true;
  interactionLockedUntil = Date.now() + 1700;

  const beginAnimation = () => {
    renderDirectorLateBoard({ spiritMoved: true });

    const francisBlue = boardPieces.get("reserve-Fz4");
    const spiritBlue = boardPieces.get("reserve-Fz3");
    if (francisBlue) francisBlue.style.zIndex = "31";
    if (spiritBlue) spiritBlue.style.zIndex = "31";

    window.setTimeout(() => {
      movePiece("reserve-Fz4", "42", {
        duration: 1000,
        width: "1.78%"
      });
      movePiece("reserve-Fz3", "24", {
        duration: 1000,
        width: "1.78%"
      });
    }, 120);

    directorLateTimer = window.setTimeout(() => {
      finishDirectorLateAnimation(directorOvertimeSceneIndex);
    }, 1350);
  };

  hidePracticeDialogueBeforeAnimation(beginAnimation);
}

/* =========================================================
   HORAS EXTRA: DOS AMARILLAS -> Qa2 / Qa3
   ========================================================= */

function animateDirectorOvertimePayment() {
  if (directorLateAnimationRunning) return;

  directorLateAnimationRunning = true;
  interactionLockedUntil = Date.now() + 1700;

  const beginAnimation = () => {
    renderDirectorLateBoard({
      spiritMoved: true,
      bluesPlaced: true
    });

    const yellowA = boardPieces.get("reserve-Fa5");
    const yellowB = boardPieces.get("reserve-Fa4");
    if (yellowA) yellowA.style.zIndex = "31";
    if (yellowB) yellowB.style.zIndex = "31";

    window.setTimeout(() => {
      movePiece("reserve-Fa5", "Qa2", {
        duration: 1000,
        width: "1.72%"
      });
      movePiece("reserve-Fa4", "Qa3", {
        duration: 1000,
        width: "1.72%"
      });
    }, 120);

    directorLateTimer = window.setTimeout(() => {
      finishDirectorLateAnimation(directorValentinaHelpSceneIndex);
    }, 1350);
  };

  hidePracticeDialogueBeforeAnimation(beginAnimation);
}

/* =========================================================
   VALENTINA: YETTI 35 -> Fn5 / 36 -> Fn6
   ========================================================= */

function animateValentinaClearsYetti() {
  if (directorLateAnimationRunning) return;

  directorLateAnimationRunning = true;
  interactionLockedUntil = Date.now() + 1750;

  const beginAnimation = () => {
    renderDirectorLateBoard({
      spiritMoved: true,
      bluesPlaced: true,
      overtimeSpent: true
    });

    const neglect35 = boardPieces.get("Yetti-35");
    const neglect36 = boardPieces.get("Yetti-36");
    if (neglect35) neglect35.style.zIndex = "31";
    if (neglect36) neglect36.style.zIndex = "31";

    window.setTimeout(() => {
      movePiece("Yetti-35", "Fn5", {
        duration: 1050,
        width: "1.72%"
      });
      movePiece("Yetti-36", "Fn6", {
        duration: 1050,
        width: "1.72%"
      });
    }, 120);

    directorLateTimer = window.setTimeout(() => {
      finishDirectorLateAnimation(directorYettiClearedSceneIndex);
    }, 1400);
  };

  hidePracticeDialogueBeforeAnimation(beginAnimation);
}

/* =========================================================
   RENDER
   ========================================================= */

const baseRenderSceneForDirectorLateTurn = renderScene;
renderScene = function () {
  baseRenderSceneForDirectorLateTurn();

  const scene = scenes[sceneIndex];
  if (!scene || scene.type !== "practice-board") return;

  if (scene.practiceStep === "director-reward-done") {
    renderDirectorLateBoard();
    setSceneImage("IMGBE3.png", "Tablero durante el turno de Alexandra");
    showSpeakerDialogue("RD.png", scene);
    stage.setAttribute(
      "aria-label",
      "Rango ya fue adoptado. Toca para mover a Spirit desde A1 hasta A2 y liberar la recepción."
    );
    return;
  }

  if (scene.practiceStep === "director-blue-actions") {
    renderDirectorLateBoard({ spiritMoved: true });
    setSceneImage("IMGBE3.png", "Tablero durante el turno de Alexandra");
    showSpeakerDialogue("RD.png", scene);
    stage.setAttribute(
      "aria-label",
      "Spirit está en A2. Toca para colocar una ficha azul sobre Francis en 42 y otra sobre Spirit en 24."
    );
    return;
  }

  if (scene.practiceStep === "director-overtime") {
    renderDirectorLateBoard({
      spiritMoved: true,
      bluesPlaced: true
    });
    setSceneImage("IMGBE3.png", "Tablero durante el turno de Alexandra");
    showSpeakerDialogue("RD.png", scene);
    stage.setAttribute(
      "aria-label",
      "Alexandra usará Horas Extra. Toca para gastar dos fichas amarillas y llamar a Valentina."
    );
    return;
  }

  if (scene.practiceStep === "director-valentina-help") {
    renderDirectorLateBoard({
      spiritMoved: true,
      bluesPlaced: true,
      overtimeSpent: true
    });
    setSceneImage("IMGBE3.png", "Tablero durante el turno de Alexandra");
    showSpeakerDialogue("RV.png", scene);
    stage.setAttribute(
      "aria-label",
      "Valentina explica que puede retirar dos fichas negras de Yetti. Toca para devolverlas a la reserva."
    );
    return;
  }

  if (scene.practiceStep === "director-yetti-cleared") {
    renderDirectorLateBoard({
      spiritMoved: true,
      bluesPlaced: true,
      overtimeSpent: true,
      yettiCleared: true
    });
    setSceneImage("IMGBE3.png", "Tablero durante el turno de Alexandra");
    dialogueText.hidden = true;
    hidePracticeSpeakerBox(true);
    stage.setAttribute(
      "aria-label",
      "Yetti ya no tiene fichas de descuido. Las dos fichas negras volvieron a Fn5 y Fn6."
    );
  }
};

/* =========================================================
   AVANCE
   ========================================================= */

const baseAdvanceSceneForDirectorLateTurn = advanceScene;
advanceScene = function () {
  const scene = scenes[sceneIndex];

  if (directorLateAnimationRunning) return;

  /* Después del segundo descuido, primero avanza la amenaza a AS8. */
  if (scene?.practiceStep === "director-neglect-accumulation") {
    if (directorSecondNeglectAnimationRunning) return;
    animateDirectorThreatToAS8();
    return;
  }

  if (scene?.practiceStep === "director-reward-done") {
    animateDirectorSpiritToA2();
    return;
  }

  if (scene?.practiceStep === "director-blue-actions") {
    animateDirectorBlueActions();
    return;
  }

  if (scene?.practiceStep === "director-overtime") {
    animateDirectorOvertimePayment();
    return;
  }

  if (scene?.practiceStep === "director-valentina-help") {
    animateValentinaClearsYetti();
    return;
  }

  if (scene?.practiceStep === "director-yetti-cleared") return;

  baseAdvanceSceneForDirectorLateTurn();
};

/* =========================================================
   RETROCESO
   ========================================================= */

const basePreviousSceneForDirectorLateTurn = previousScene;
previousScene = function () {
  if (directorLateAnimationRunning || Date.now() < interactionLockedUntil) return;

  const scene = scenes[sceneIndex];

  if (scene?.practiceStep === "director-blue-actions") {
    sceneIndex = directorRewardDoneSceneIndex;
    renderScene();
    return;
  }

  if (scene?.practiceStep === "director-overtime") {
    sceneIndex = directorBlueActionsSceneIndex;
    renderScene();
    return;
  }

  if (scene?.practiceStep === "director-valentina-help") {
    sceneIndex = directorOvertimeSceneIndex;
    renderScene();
    return;
  }

  if (scene?.practiceStep === "director-yetti-cleared") {
    sceneIndex = directorValentinaHelpSceneIndex;
    renderScene();
    return;
  }

  basePreviousSceneForDirectorLateTurn();
};
