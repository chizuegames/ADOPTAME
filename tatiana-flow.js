/* =========================================================
   CONTINUACIÓN — RESULTADO VISUAL + TURNO DE TATIANA
   ========================================================= */

/*
 * - Durante el diálogo “Y obtuvimos un 4...” se muestra PP1.png junto
 *   al cuadro RE para reforzar visualmente el resultado.
 * - Al terminar la rehabilitación de Rango aparece el último diálogo de RE.
 * - Después entra Tatiana con RC.png sobre el fondo IMGBE2.png.
 * - La zona CE vuelve a brillar y la fila de adoptantes avanza:
 *     AD16: D1 -> D2
 *     AD12: CD -> D1
 *     AD13 queda visible en CD.
 * - Al terminar esa animación aparece automáticamente el diálogo para lanzar
 *   el dado. El nuevo lanzamiento termina en 3.
 * - El resultado 3 coloca una ficha negra de descuido sobre Yetti en 36.
 * - Finalmente AS6 pasa de CE a CO, AS5 desaparece al quedar cubierta y AS7
 *   queda visible en CE como la siguiente amenaza.
 */

[
  "PP1.png",
  "RC.png",
  "IMGBE2.png",
  "AD13s.png",
  "AS7s.png",
  "DD3.png"
].forEach(src => {
  const img = new Image();
  img.src = src;
});

/* =========================================================
   NUEVAS ESCENAS
   ========================================================= */

const reFinishActionsSceneIndex = scenes.length;
scenes.push({
  image: "IMGBE1.png",
  type: "practice-board",
  practiceStep: "re-finish-actions",
  text: "Con esto terminan mis acciones. Ahora debemos resolver la carta de amenaza S6, pero dejaré que Tatiana se encargue de explicarla."
});

const tatianaIntroSceneIndex = scenes.length;
scenes.push({
  image: "IMGBE2.png",
  type: "practice-board",
  practiceStep: "tatiana-intro",
  text: "¡Hola! Desde ahora yo los acompañaré un ratito. Primero, traigamos a un nuevo adoptante, tal como nos indica la tarjeta de amenaza."
});

const tatianaDicePromptSceneIndex = scenes.length;
scenes.push({
  image: "IMGBE2.png",
  type: "practice-board",
  practiceStep: "tatiana-dice-prompt",
  text: "¡Ahora sí! Lancemos el dado y veamos qué nos espera en este turno."
});

const tatianaDiceResultSceneIndex = scenes.length;
scenes.push({
  image: "IMGBE2.png",
  type: "practice-board",
  practiceStep: "tatiana-dice-result",
  text: "¡No puede ser, salió un 3! Yetti perderá salud y, como no tiene ninguna ficha verde para retirar, tendrá que recibir una ficha de descuido."
});

const tatianaNextThreatSceneIndex = scenes.length;
scenes.push({
  image: "IMGBE2.png",
  type: "practice-board",
  practiceStep: "tatiana-next-threat",
  text: "Bueno, pasemos a la siguiente carta de amenaza y ahora sí, ¡que comience mi turno!"
});

const tatianaThreatAdvancedSceneIndex = scenes.length;
scenes.push({
  image: "IMGBE2.png",
  type: "practice-board",
  practiceStep: "tatiana-threat-advanced",
  text: ""
});

/* =========================================================
   PP1 — RESULTADO VISUAL DEL DADO ANTERIOR
   ========================================================= */

const practiceResultBadge = document.createElement("img");
practiceResultBadge.src = "PP1.png";
practiceResultBadge.alt = "Resultado de amenaza: menos uno de salud con resultado cuatro";
practiceResultBadge.draggable = false;
practiceResultBadge.hidden = true;
Object.assign(practiceResultBadge.style, {
  position: "absolute",
  zIndex: "46",
  left: "79.2%",
  top: "73.5%",
  width: "18.0%",
  height: "auto",
  objectFit: "contain",
  pointerEvents: "none",
  filter: "drop-shadow(0 6px 10px rgba(0,0,0,.20))"
});
stage.appendChild(practiceResultBadge);

function hidePracticeResultBadge() {
  practiceResultBadge.hidden = true;
}

function showPracticeResultBadge() {
  practiceResultBadge.hidden = false;
}

/* PP1 debe desaparecer junto con el diálogo antes de iniciar la animación. */
const baseHidePracticeDialogueBeforeAnimationForResultBadge = hidePracticeDialogueBeforeAnimation;
hidePracticeDialogueBeforeAnimation = function (callback) {
  hidePracticeResultBadge();
  baseHidePracticeDialogueBeforeAnimationForResultBadge(callback);
};

/* =========================================================
   RESALTADO DE CE PARA TATIANA
   ========================================================= */

const tatianaCEHighlight = document.createElement("div");
tatianaCEHighlight.hidden = true;
tatianaCEHighlight.setAttribute("aria-hidden", "true");
Object.assign(tatianaCEHighlight.style, {
  position: "absolute",
  zIndex: "37",
  left: `${BOARD_MAP.CE.left - 0.35}%`,
  top: `${BOARD_MAP.CE.top - 0.55}%`,
  width: `${BOARD_MAP.CE.width + 0.70}%`,
  aspectRatio: "206 / 306",
  border: "4px solid rgba(255, 153, 31, .92)",
  borderRadius: "11px",
  boxSizing: "border-box",
  background: "rgba(255, 209, 42, .06)",
  boxShadow: "0 0 18px 7px rgba(255, 196, 36, .74), inset 0 0 0 3px rgba(255,255,255,.82)",
  animation: "adoptame-ca-pulse 1.05s ease-in-out infinite",
  pointerEvents: "none",
  transformOrigin: "center center"
});
stage.appendChild(tatianaCEHighlight);

/* =========================================================
   ESTADO DEL TABLERO PARA TATIANA
   ========================================================= */

function renderTatianaBoard(options = {}) {
  const adoptersAdvanced = Boolean(options.adoptersAdvanced);
  const diceFace = options.diceFace == null ? 4 : Number(options.diceFace);
  const neglectOnYetti = Boolean(options.neglectOnYetti);
  const nextThreat = Boolean(options.nextThreat);

  renderYettiTurnBoard({
    healthRecovered: true,
    stimulationPlaced: true,
    exhausted: true,
    rangoFlipped: true
  });

  /* Ajustamos la fila de adoptantes después de resolver la parte superior S6. */
  if (adoptersAdvanced) {
    removeBoardPiece("AD16");
    removeBoardPiece("AD12");

    createImagePiece("AD16", "AD16s.png", "D2", {
      zIndex: 17,
      alt: "Lorena en D2"
    });

    createImagePiece("AD12", "AD12s.png", "D1", {
      zIndex: 17,
      alt: "Adoptante AD12 en D1"
    });

    createImagePiece("AD13", "AD13s.png", "CD", {
      zIndex: 14,
      alt: "Nuevo adoptante AD13 visible en CD"
    });
  }

  /* El tablero previo conserva DD4; para este turno podemos reemplazarlo. */
  removeBoardPiece("dice");
  if (diceFace >= 1 && diceFace <= 6) {
    createImagePiece("dice", `DD${diceFace}.png`, "DS", {
      width: "4.33%",
      zIndex: 22,
      shadow: false,
      alt: `Dado mostrando ${diceFace}`
    });
  }

  /* Cuando Yetti recibe descuido, Fn6 deja de estar disponible y va a 36. */
  if (neglectOnYetti) {
    removeBoardPiece("reserve-Fn6");
    createImagePiece("Yetti-36", practiceTokenAssets.neglect.small, "36", {
      width: "1.78%",
      zIndex: 23,
      shadow: false,
      alt: "Ficha de descuido sobre Yetti"
    });
  }

  /* AS7 es la siguiente amenaza: AS6 pasa a CO y AS5 deja de verse. */
  if (nextThreat) {
    removeBoardPiece("AS5");
    removeBoardPiece("AS6");
    removeBoardPiece("AS6-highlight");

    createImagePiece("AS7", "AS7s.png", "CE", {
      zIndex: 15,
      alt: "Amenaza AS7 activa"
    });

    createImagePiece("AS6", "AS6s.png", "CO", {
      zIndex: 14,
      alt: "Amenaza AS6 descartada"
    });
  }
}

function applyTatianaBackground() {
  setSceneImage("IMGBE2.png", "Tablero de práctica con Tatiana");
}

function showSpeakerDialogue(frameSrc, scene) {
  practiceSpeakerBox.src = frameSrc;
  showPracticeSpeakerBox();
  dialogueText.hidden = false;
  dialogueText.textContent = scene.text || "";
  applyMobilePracticeDialogueLayout();
}

function hideTatianaExtras() {
  hidePracticeResultBadge();
  tatianaCEHighlight.hidden = true;
}

/* =========================================================
   CONTROL DE ANIMACIONES
   ========================================================= */

let tatianaAnimationRunning = false;
let tatianaAnimationTimer = null;
let tatianaDiceInterval = null;

function clearTatianaAnimationTimer() {
  if (tatianaAnimationTimer) {
    clearTimeout(tatianaAnimationTimer);
    tatianaAnimationTimer = null;
  }

  if (tatianaDiceInterval) {
    clearInterval(tatianaDiceInterval);
    tatianaDiceInterval = null;
  }
}

/* =========================================================
   ADOPTANTES: D1 -> D2 / CD -> D1 / AD13 EN CD
   ========================================================= */

function animateTatianaAdopters() {
  if (tatianaAnimationRunning) return;

  tatianaAnimationRunning = true;
  interactionLockedUntil = Date.now() + 1600;

  const beginAnimation = () => {
    renderTatianaBoard({ adoptersAdvanced: false, diceFace: 4 });
    applyTatianaBackground();
    tatianaCEHighlight.hidden = false;

    // La nueva carta queda debajo de AD12 antes de que la fila avance.
    createImagePiece("AD13", "AD13s.png", "CD", {
      zIndex: 13,
      alt: "Nuevo adoptante AD13"
    });

    const ad16 = boardPieces.get("AD16");
    const ad12 = boardPieces.get("AD12");
    if (ad16) ad16.style.zIndex = "22";
    if (ad12) ad12.style.zIndex = "21";

    window.setTimeout(() => {
      movePiece("AD16", "D2", { duration: 1050 });
      movePiece("AD12", "D1", { duration: 1050 });
    }, 120);

    tatianaAnimationTimer = window.setTimeout(() => {
      tatianaAnimationTimer = null;
      tatianaAnimationRunning = false;
      interactionLockedUntil = 0;
      tatianaCEHighlight.hidden = true;

      // Regla de fluidez: aparece automáticamente el siguiente diálogo.
      sceneIndex = tatianaDicePromptSceneIndex;
      renderScene();
    }, 1330);
  };

  hidePracticeDialogueBeforeAnimation(beginAnimation);
}

/* =========================================================
   NUEVO LANZAMIENTO DE DADO — RESULTADO 3
   ========================================================= */

function animateTatianaDiceToThree() {
  if (tatianaAnimationRunning) return;

  tatianaAnimationRunning = true;
  interactionLockedUntil = Date.now() + 1900;

  const beginAnimation = () => {
    renderTatianaBoard({ adoptersAdvanced: true, diceFace: 1 });
    applyTatianaBackground();

    const die = boardPieces.get("dice");
    if (!die) {
      tatianaAnimationRunning = false;
      interactionLockedUntil = 0;
      return;
    }

    die.style.zIndex = "29";
    die.style.transition = "transform 120ms ease";

    let face = 1;
    let ticks = 0;
    tatianaDiceInterval = window.setInterval(() => {
      ticks += 1;
      face = (face % 6) + 1;
      die.src = `DD${face}.png`;
      die.style.transform = `rotate(${ticks * 42}deg) scale(${ticks % 2 ? 1.08 : 0.94})`;

      if (ticks >= 12) {
        clearInterval(tatianaDiceInterval);
        tatianaDiceInterval = null;
        die.src = "DD3.png";
        die.style.transform = "rotate(0deg) scale(1)";
      }
    }, 95);

    tatianaAnimationTimer = window.setTimeout(() => {
      if (tatianaDiceInterval) {
        clearInterval(tatianaDiceInterval);
        tatianaDiceInterval = null;
      }

      const finalDie = boardPieces.get("dice");
      if (finalDie) {
        finalDie.src = "DD3.png";
        finalDie.style.transform = "rotate(0deg) scale(1)";
      }

      tatianaAnimationTimer = null;
      tatianaAnimationRunning = false;
      interactionLockedUntil = 0;

      // El resultado se explica inmediatamente al terminar el lanzamiento.
      sceneIndex = tatianaDiceResultSceneIndex;
      renderScene();
    }, 1450);
  };

  hidePracticeDialogueBeforeAnimation(beginAnimation);
}

/* =========================================================
   RESULTADO 3 — FICHA NEGRA Fn6 -> 36 SOBRE YETTI
   ========================================================= */

function animateNeglectToYetti() {
  if (tatianaAnimationRunning) return;

  tatianaAnimationRunning = true;
  interactionLockedUntil = Date.now() + 1550;

  const beginAnimation = () => {
    renderTatianaBoard({
      adoptersAdvanced: true,
      diceFace: 3,
      neglectOnYetti: false
    });
    applyTatianaBackground();

    const blackToken = boardPieces.get("reserve-Fn6");
    if (blackToken) blackToken.style.zIndex = "29";

    window.setTimeout(() => {
      movePiece("reserve-Fn6", "36", {
        duration: 1000,
        width: "1.78%"
      });
    }, 120);

    tatianaAnimationTimer = window.setTimeout(() => {
      tatianaAnimationTimer = null;
      tatianaAnimationRunning = false;
      interactionLockedUntil = 0;

      // Al terminar, aparece automáticamente el siguiente diálogo.
      sceneIndex = tatianaNextThreatSceneIndex;
      renderScene();
    }, 1320);
  };

  hidePracticeDialogueBeforeAnimation(beginAnimation);
}

/* =========================================================
   SIGUIENTE AMENAZA — AS6 CE -> CO / AS5 DESAPARECE / AS7 CE
   ========================================================= */

function animateNextThreatToAS7() {
  if (tatianaAnimationRunning) return;

  tatianaAnimationRunning = true;
  interactionLockedUntil = Date.now() + 1750;

  const beginAnimation = () => {
    renderTatianaBoard({
      adoptersAdvanced: true,
      diceFace: 3,
      neglectOnYetti: true,
      nextThreat: false
    });
    applyTatianaBackground();

    // AS7 queda debajo de AS6 mientras la carta actual avanza al descarte.
    createImagePiece("AS7", "AS7s.png", "CE", {
      zIndex: 13,
      alt: "Siguiente amenaza AS7"
    });

    const as6 = boardPieces.get("AS6");
    const as5 = boardPieces.get("AS5");
    if (as6) as6.style.zIndex = "24";
    if (as5) as5.style.zIndex = "14";

    window.setTimeout(() => {
      movePiece("AS6", "CO", { duration: 1100 });
    }, 120);

    // AS5 desaparece después de quedar completamente cubierta por AS6.
    tatianaAnimationTimer = window.setTimeout(() => {
      removeBoardPiece("AS5");

      tatianaAnimationTimer = window.setTimeout(() => {
        tatianaAnimationTimer = null;
        tatianaAnimationRunning = false;
        interactionLockedUntil = 0;
        sceneIndex = tatianaThreatAdvancedSceneIndex;
        renderScene();
      }, 180);
    }, 1250);
  };

  hidePracticeDialogueBeforeAnimation(beginAnimation);
}

/* =========================================================
   RENDER FINAL DE ESTA CONTINUACIÓN
   ========================================================= */

const baseRenderSceneForTatianaFlow = renderScene;
renderScene = function () {
  clearTatianaAnimationTimer();
  hideTatianaExtras();

  // RE vuelve a ser el marco predeterminado para el resto de la práctica.
  practiceSpeakerBox.src = "RE.png";

  baseRenderSceneForTatianaFlow();

  const scene = scenes[sceneIndex];
  if (!scene) return;

  /* PP1 solo acompaña el diálogo que explica el resultado 4. */
  if (scene.type === "practice-board" && scene.practiceStep === "dice-result") {
    showPracticeResultBadge();
    return;
  }

  /*
   * Al terminar la animación de rehabilitación no dejamos una pantalla vacía:
   * abrimos automáticamente el último diálogo de RE.
   */
  if (scene.type === "practice-board" && scene.practiceStep === "rango-rehabilitated") {
    sceneIndex = reFinishActionsSceneIndex;
    renderScene();
    return;
  }

  if (scene.type === "practice-board" && scene.practiceStep === "re-finish-actions") {
    renderTatianaBoard({ adoptersAdvanced: false, diceFace: 4 });
    setSceneImage("IMGBE1.png", "Tablero de práctica de Adóptame");
    showSpeakerDialogue("RE.png", scene);
    stage.setAttribute(
      "aria-label",
      "Último diálogo de este turno. Después Tatiana explicará la amenaza S6."
    );
    return;
  }

  if (scene.type === "practice-board" && scene.practiceStep === "tatiana-intro") {
    renderTatianaBoard({ adoptersAdvanced: false, diceFace: 4 });
    applyTatianaBackground();
    tatianaCEHighlight.hidden = false;
    showSpeakerDialogue("RC.png", scene);
    stage.setAttribute(
      "aria-label",
      "Tatiana toma la palabra. La amenaza S6 está resaltada y al tocar avanzará la fila de adoptantes."
    );
    return;
  }

  if (scene.type === "practice-board" && scene.practiceStep === "tatiana-dice-prompt") {
    renderTatianaBoard({ adoptersAdvanced: true, diceFace: 4 });
    applyTatianaBackground();
    showSpeakerDialogue("RC.png", scene);
    stage.setAttribute(
      "aria-label",
      "Los adoptantes ya avanzaron. Tatiana invita a lanzar nuevamente el dado. Toca para lanzarlo."
    );
    return;
  }

  if (scene.type === "practice-board" && scene.practiceStep === "tatiana-dice-result") {
    renderTatianaBoard({ adoptersAdvanced: true, diceFace: 3 });
    applyTatianaBackground();
    showSpeakerDialogue("RC.png", scene);
    stage.setAttribute(
      "aria-label",
      "El dado cayó en 3. Yetti no tiene salud para perder y recibirá una ficha negra de descuido."
    );
    return;
  }

  if (scene.type === "practice-board" && scene.practiceStep === "tatiana-next-threat") {
    renderTatianaBoard({
      adoptersAdvanced: true,
      diceFace: 3,
      neglectOnYetti: true
    });
    applyTatianaBackground();
    showSpeakerDialogue("RC.png", scene);
    stage.setAttribute(
      "aria-label",
      "Yetti tiene una ficha de descuido en 36. Tatiana propone avanzar a la siguiente amenaza."
    );
    return;
  }

  if (scene.type === "practice-board" && scene.practiceStep === "tatiana-threat-advanced") {
    renderTatianaBoard({
      adoptersAdvanced: true,
      diceFace: 3,
      neglectOnYetti: true,
      nextThreat: true
    });
    applyTatianaBackground();
    dialogueText.hidden = true;
    hidePracticeSpeakerBox(true);
    stage.setAttribute(
      "aria-label",
      "AS7 queda activa en CE, AS6 queda en CO y AS5 ya no es visible. Tatiana está lista para comenzar su turno."
    );
  }
};

/* =========================================================
   CONTROL DE AVANCE
   ========================================================= */

const baseAdvanceSceneForTatianaFlow = advanceScene;
advanceScene = function () {
  const scene = scenes[sceneIndex];

  if (tatianaAnimationRunning) return;

  if (scene?.practiceStep === "re-finish-actions") {
    sceneIndex = tatianaIntroSceneIndex;
    interactionLockedUntil = 0;
    renderScene();
    return;
  }

  if (scene?.practiceStep === "tatiana-intro") {
    animateTatianaAdopters();
    return;
  }

  if (scene?.practiceStep === "tatiana-dice-prompt") {
    animateTatianaDiceToThree();
    return;
  }

  if (scene?.practiceStep === "tatiana-dice-result") {
    animateNeglectToYetti();
    return;
  }

  if (scene?.practiceStep === "tatiana-next-threat") {
    animateNextThreatToAS7();
    return;
  }

  baseAdvanceSceneForTatianaFlow();
};

/* Navegación hacia atrás coherente con el nuevo bloque. */
const basePreviousSceneForTatianaFlow = previousScene;
previousScene = function () {
  if (tatianaAnimationRunning || Date.now() < interactionLockedUntil) return;

  const scene = scenes[sceneIndex];

  if (scene?.practiceStep === "re-finish-actions") {
    const rehabilitationIndex = scenes.findIndex(
      item => item.type === "practice-board" && item.practiceStep === "rehabilitation-dialogue"
    );
    if (rehabilitationIndex >= 0) {
      sceneIndex = rehabilitationIndex;
      renderScene();
      return;
    }
  }

  if (scene?.practiceStep === "tatiana-intro") {
    sceneIndex = reFinishActionsSceneIndex;
    renderScene();
    return;
  }

  if (scene?.practiceStep === "tatiana-dice-prompt") {
    sceneIndex = tatianaIntroSceneIndex;
    renderScene();
    return;
  }

  if (scene?.practiceStep === "tatiana-dice-result") {
    sceneIndex = tatianaDicePromptSceneIndex;
    renderScene();
    return;
  }

  if (scene?.practiceStep === "tatiana-next-threat") {
    sceneIndex = tatianaDiceResultSceneIndex;
    renderScene();
    return;
  }

  if (scene?.practiceStep === "tatiana-threat-advanced") {
    sceneIndex = tatianaNextThreatSceneIndex;
    renderScene();
    return;
  }

  basePreviousSceneForTatianaFlow();
};
