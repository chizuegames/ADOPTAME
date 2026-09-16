/* =========================================================
   CIERRE DEL TURNO DE ALEXANDRA — FIN DE LA PRIMERA RONDA
   ========================================================= */

/*
 * Secuencia añadida después de que Valentina retira los dos descuidos de Yetti:
 * 1) Alexandra anuncia que terminará su turno y con ello la primera ronda.
 * 2) AS8 indica la llegada de 2 adoptantes.
 * 3) La fila D avanza:
 *      AD12: D2 -> D3
 *      AD2:  CD -> D2
 *      AD1:  CD -> D1
 *      AD7 queda visible en CD.
 * 4) Al terminar la fila, el dado se lanza automáticamente y cae en 2.
 * 5) El resultado 2 hace que Spirit pierda su ficha azul de 24, que pasa
 *    a Qz3. Después AS8 pasa de CE a CO y AS9 queda activa en CE.
 */

[
  "AD1s.png",
  "AD7s.png",
  "DD2.png",
  "AS9s.png"
].forEach(src => {
  const img = new Image();
  img.src = src;
});

/* =========================================================
   DIÁLOGOS
   ========================================================= */

if (Number.isInteger(directorYettiClearedSceneIndex) && scenes[directorYettiClearedSceneIndex]) {
  scenes[directorYettiClearedSceneIndex].text =
    "Ahora que ya conocemos cómo funciona el flujo de los turnos, terminaré el mío y daremos por finalizada esta primera ronda.";
}

const directorRoundThreatSceneIndex = scenes.length;
scenes.push({
  image: "IMGBE3.png",
  type: "practice-board",
  practiceStep: "director-round-threat",
  text: "Veamos qué nos trae la carta de amenazas... Mmm, llegan 2 adoptantes. ¡Hagámoslos pasar! y lancemos el dado."
});

const directorRoundDieTwoSceneIndex = scenes.length;
scenes.push({
  image: "IMGBE3.png",
  type: "practice-board",
  practiceStep: "director-round-die-two",
  text: "Mmm... salió un 2, así que Spirit perderá una ficha de estimulación. Por suerte, no es nada que no podamos manejar."
});

const directorRoundResolvedSceneIndex = scenes.length;
scenes.push({
  image: "IMGBE3.png",
  type: "practice-board",
  practiceStep: "director-round-resolved",
  text: ""
});

/* Mientras se explica el resultado del dado, AS8 sigue activa y AS7 en CO. */
if (typeof DIRECTOR_STEPS_WITH_AS8 !== "undefined") {
  DIRECTOR_STEPS_WITH_AS8.add("director-round-threat");
  DIRECTOR_STEPS_WITH_AS8.add("director-round-die-two");
}

/* =========================================================
   ESTADO DEL TABLERO PARA EL CIERRE DE RONDA
   ========================================================= */

function renderDirectorRoundEndBoard(options = {}) {
  const adoptersAdvanced = Boolean(options.adoptersAdvanced);
  const diceFace = options.diceFace == null ? 1 : Number(options.diceFace);
  const roundResolved = Boolean(options.roundResolved);

  renderDirectorLateBoard({
    spiritMoved: true,
    bluesPlaced: true,
    overtimeSpent: true,
    yettiCleared: true
  });

  if (adoptersAdvanced || roundResolved) {
    removeBoardPiece("AD12");
    removeBoardPiece("AD2");
    removeBoardPiece("AD1");
    removeBoardPiece("AD7");

    createImagePiece("AD12", "AD12s.png", "D3", {
      zIndex: 17,
      alt: "Adoptante AD12 en D3"
    });

    createImagePiece("AD2", "AD2s.png", "D2", {
      zIndex: 17,
      alt: "Adoptante AD2 en D2"
    });

    createImagePiece("AD1", "AD1s.png", "D1", {
      zIndex: 17,
      alt: "Nuevo adoptante AD1 en D1"
    });

    createImagePiece("AD7", "AD7s.png", "CD", {
      zIndex: 14,
      alt: "Siguiente adoptante AD7 visible en CD"
    });
  }

  removeBoardPiece("dice");
  if (diceFace >= 1 && diceFace <= 6) {
    createImagePiece("dice", `DD${diceFace}.png`, "DS", {
      width: "4.33%",
      zIndex: 22,
      shadow: false,
      alt: `Dado mostrando ${diceFace}`
    });
  }

  if (roundResolved) {
    /* Spirit pierde la ficha azul de 24 y esta pasa a la primera Q azul libre. */
    removeBoardPiece("Spirit-blue-24");
    removeBoardPiece("Spirit-blue-Qz3");
    createImagePiece("Spirit-blue-Qz3", practiceTokenAssets.stimulation.small, "Qz3", {
      width: "1.72%",
      zIndex: 20,
      shadow: false,
      alt: "Ficha azul de Spirit agotada en Qz3"
    });

    /* AS8 queda descartada y AS9 pasa a ser la amenaza activa. */
    removeBoardPiece("AS7");
    removeBoardPiece("AS8");
    removeBoardPiece("AS9");

    createImagePiece("AS9", "AS9s.png", "CE", {
      zIndex: 15,
      alt: "Amenaza AS9 activa"
    });

    createImagePiece("AS8", "AS8s.png", "CO", {
      zIndex: 14,
      alt: "Amenaza AS8 descartada"
    });
  }
}

/* =========================================================
   CONTROL DE ANIMACIONES
   ========================================================= */

let directorRoundEndAnimationRunning = false;
let directorRoundEndTimer = null;
let directorRoundEndDiceInterval = null;

function finishDirectorRoundEndAnimation(nextSceneIndex) {
  if (directorRoundEndTimer) {
    clearTimeout(directorRoundEndTimer);
    directorRoundEndTimer = null;
  }

  if (directorRoundEndDiceInterval) {
    clearInterval(directorRoundEndDiceInterval);
    directorRoundEndDiceInterval = null;
  }

  directorRoundEndAnimationRunning = false;
  interactionLockedUntil = 0;
  sceneIndex = nextSceneIndex;
  renderScene();
}

/* =========================================================
   LLEGAN 2 ADOPTANTES
   D2 -> D3 / CD -> D2 / AD1 -> D1 / AD7 QUEDA EN CD
   ========================================================= */

function animateDirectorTwoAdopters() {
  if (directorRoundEndAnimationRunning || directorLateAnimationRunning) return;

  directorRoundEndAnimationRunning = true;
  interactionLockedUntil = Date.now() + 3100;

  const beginAnimation = () => {
    renderDirectorRoundEndBoard({ adoptersAdvanced: false, diceFace: 1 });

    /*
     * AD7 queda al fondo del mazo. AD1 aparece debajo de AD2 para que las
     * dos cartas nuevas puedan salir visualmente desde CD.
     */
    createImagePiece("AD7", "AD7s.png", "CD", {
      zIndex: 11,
      alt: "Adoptante AD7 debajo del mazo"
    });

    createImagePiece("AD1", "AD1s.png", "CD", {
      zIndex: 13,
      alt: "Nuevo adoptante AD1"
    });

    const ad12 = boardPieces.get("AD12");
    const ad2 = boardPieces.get("AD2");
    const ad1 = boardPieces.get("AD1");

    if (ad12) ad12.style.zIndex = "29";
    if (ad2) ad2.style.zIndex = "28";
    if (ad1) ad1.style.zIndex = "27";

    window.setTimeout(() => {
      movePiece("AD12", "D3", { duration: 1050 });
      movePiece("AD2", "D2", { duration: 1050 });
      movePiece("AD1", "D1", { duration: 1050 });
    }, 120);

    directorRoundEndTimer = window.setTimeout(() => {
      directorRoundEndTimer = null;
      renderDirectorRoundEndBoard({ adoptersAdvanced: true, diceFace: 1 });

      /* Regla de fluidez: el dado se activa automáticamente. */
      window.setTimeout(() => {
        animateDirectorDiceToTwo();
      }, 180);
    }, 1370);
  };

  hidePracticeDialogueBeforeAnimation(beginAnimation);
}

/* =========================================================
   DADO AUTOMÁTICO — RESULTADO 2
   ========================================================= */

function animateDirectorDiceToTwo() {
  const die = boardPieces.get("dice");

  if (!die) {
    finishDirectorRoundEndAnimation(directorRoundDieTwoSceneIndex);
    return;
  }

  die.style.zIndex = "31";
  die.style.transition = "transform 100ms ease";

  let face = 1;
  let ticks = 0;

  directorRoundEndDiceInterval = window.setInterval(() => {
    ticks += 1;
    face = (face % 6) + 1;
    die.src = `DD${face}.png`;
    die.style.transform = `rotate(${ticks * 41}deg) scale(${ticks % 2 ? 1.08 : 0.94})`;

    if (ticks >= 12) {
      clearInterval(directorRoundEndDiceInterval);
      directorRoundEndDiceInterval = null;
      die.src = "DD2.png";
      die.style.transform = "rotate(0deg) scale(1)";
    }
  }, 95);

  directorRoundEndTimer = window.setTimeout(() => {
    if (directorRoundEndDiceInterval) {
      clearInterval(directorRoundEndDiceInterval);
      directorRoundEndDiceInterval = null;
    }

    const finalDie = boardPieces.get("dice");
    if (finalDie) {
      finalDie.src = "DD2.png";
      finalDie.style.transform = "rotate(0deg) scale(1)";
    }

    finishDirectorRoundEndAnimation(directorRoundDieTwoSceneIndex);
  }, 1450);
}

/* =========================================================
   RESULTADO 2
   SPIRIT: 24 -> Qz3 / AS8: CE -> CO / AS9 QUEDA ACTIVA
   ========================================================= */

function animateDirectorRoundResultTwo() {
  if (directorRoundEndAnimationRunning || directorLateAnimationRunning) return;

  directorRoundEndAnimationRunning = true;
  interactionLockedUntil = Date.now() + 1900;

  const beginAnimation = () => {
    renderDirectorRoundEndBoard({ adoptersAdvanced: true, diceFace: 2 });

    /* AS9 queda debajo de AS8 y se revela cuando la amenaza avanza. */
    createImagePiece("AS9", "AS9s.png", "CE", {
      zIndex: 13,
      alt: "Nueva amenaza AS9"
    });

    const spiritBlue = boardPieces.get("Spirit-blue-24");
    const as8 = boardPieces.get("AS8");

    if (spiritBlue) spiritBlue.style.zIndex = "32";
    if (as8) as8.style.zIndex = "31";

    window.setTimeout(() => {
      movePiece("Spirit-blue-24", "Qz3", {
        duration: 1000,
        width: "1.72%"
      });

      movePiece("AS8", "CO", {
        duration: 1050
      });
    }, 120);

    /* AS7 queda cubierta por AS8 en el descarte y deja de verse. */
    window.setTimeout(() => {
      removeBoardPiece("AS7");
    }, 1080);

    directorRoundEndTimer = window.setTimeout(() => {
      finishDirectorRoundEndAnimation(directorRoundResolvedSceneIndex);
    }, 1380);
  };

  hidePracticeDialogueBeforeAnimation(beginAnimation);
}

/* =========================================================
   RENDER
   ========================================================= */

const baseRenderSceneForDirectorRoundEnd = renderScene;
renderScene = function () {
  baseRenderSceneForDirectorRoundEnd();

  const scene = scenes[sceneIndex];
  if (!scene || scene.type !== "practice-board") return;

  if (scene.practiceStep === "director-yetti-cleared") {
    renderDirectorRoundEndBoard({ adoptersAdvanced: false, diceFace: 1 });
    setSceneImage("IMGBE3.png", "Tablero durante el cierre del turno de Alexandra");
    showSpeakerDialogue("RD.png", scene);
    stage.setAttribute(
      "aria-label",
      "Alexandra anuncia el final de su turno y de la primera ronda. Toca para revisar la carta de amenazas."
    );
    return;
  }

  if (scene.practiceStep === "director-round-threat") {
    renderDirectorRoundEndBoard({ adoptersAdvanced: false, diceFace: 1 });
    setSceneImage("IMGBE3.png", "Tablero durante el cierre del turno de Alexandra");
    showSpeakerDialogue("RD.png", scene);
    stage.setAttribute(
      "aria-label",
      "La carta de amenazas trae dos adoptantes. Toca para hacer avanzar la fila y lanzar el dado."
    );
    return;
  }

  if (scene.practiceStep === "director-round-die-two") {
    renderDirectorRoundEndBoard({ adoptersAdvanced: true, diceFace: 2 });
    setSceneImage("IMGBE3.png", "Tablero al final de la primera ronda");
    showSpeakerDialogue("RD.png", scene);
    stage.setAttribute(
      "aria-label",
      "El dado cayó en 2. Spirit perderá su ficha azul de estimulación. Toca para enviarla a Q y avanzar la amenaza de AS8 a AS9."
    );
    return;
  }

  if (scene.practiceStep === "director-round-resolved") {
    renderDirectorRoundEndBoard({
      adoptersAdvanced: true,
      diceFace: 2,
      roundResolved: true
    });
    setSceneImage("IMGBE3.png", "Tablero al final de la primera ronda");
    dialogueText.hidden = true;
    hidePracticeSpeakerBox(true);
    stage.setAttribute(
      "aria-label",
      "Spirit perdió su ficha azul, que quedó agotada en Qz3. AS8 pasó al descarte y AS9 quedó activa en CE."
    );
  }
};

/* =========================================================
   AVANCE
   ========================================================= */

const baseAdvanceSceneForDirectorRoundEnd = advanceScene;
advanceScene = function () {
  const scene = scenes[sceneIndex];

  if (directorRoundEndAnimationRunning) return;

  if (scene?.practiceStep === "director-yetti-cleared") {
    sceneIndex = directorRoundThreatSceneIndex;
    interactionLockedUntil = 0;
    renderScene();
    return;
  }

  if (scene?.practiceStep === "director-round-threat") {
    animateDirectorTwoAdopters();
    return;
  }

  if (scene?.practiceStep === "director-round-die-two") {
    animateDirectorRoundResultTwo();
    return;
  }

  if (scene?.practiceStep === "director-round-resolved") return;

  baseAdvanceSceneForDirectorRoundEnd();
};

/* =========================================================
   RETROCESO
   ========================================================= */

const basePreviousSceneForDirectorRoundEnd = previousScene;
previousScene = function () {
  if (directorRoundEndAnimationRunning || Date.now() < interactionLockedUntil) return;

  const scene = scenes[sceneIndex];

  if (scene?.practiceStep === "director-round-threat") {
    sceneIndex = directorYettiClearedSceneIndex;
    renderScene();
    return;
  }

  if (scene?.practiceStep === "director-round-die-two") {
    sceneIndex = directorRoundThreatSceneIndex;
    renderScene();
    return;
  }

  if (scene?.practiceStep === "director-round-resolved") {
    sceneIndex = directorRoundDieTwoSceneIndex;
    renderScene();
    return;
  }

  basePreviousSceneForDirectorRoundEnd();
};