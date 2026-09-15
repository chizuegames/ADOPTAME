/* =========================================================
   CONTINUACIÓN — RESULTADO VISUAL + ENTRADA DE TATIANA
   ========================================================= */

/*
 * - Durante el diálogo “Y obtuvimos un 4...” se muestra PP1.png junto
 *   al cuadro RE para reforzar visualmente el resultado.
 * - Al terminar la rehabilitación de Rango aparece el último diálogo de RE.
 * - Después entra Tatiana con RC.png sobre el nuevo fondo IMGBE2.png.
 * - La zona CE vuelve a brillar y la fila de adoptantes avanza:
 *     AD16: D1 -> D2
 *     AD12: CD -> D1
 *     AD13 queda visible en CD.
 */

[
  "PP1.png",
  "RC.png",
  "IMGBE2.png",
  "AD13s.png"
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
  text: "¡Por fin llegó mi turno de hablar! Primero, traigamos a los nuevos adoptantes."
});

const tatianaAdoptersDoneSceneIndex = scenes.length;
scenes.push({
  image: "IMGBE2.png",
  type: "practice-board",
  practiceStep: "tatiana-adopters-done",
  text: ""
});

/* =========================================================
   PP1 — RESULTADO VISUAL DEL DADO
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
   ESTADO DEL TABLERO PARA LA ENTRADA DE TATIANA
   ========================================================= */

function renderTatianaBoard(adoptersAdvanced = false) {
  renderYettiTurnBoard({
    healthRecovered: true,
    stimulationPlaced: true,
    exhausted: true,
    rangoFlipped: true
  });

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
   ANIMACIÓN DE ADOPTANTES
   ========================================================= */

let tatianaAdopterAnimationRunning = false;
let tatianaAdopterAnimationTimer = null;

function clearTatianaAdopterAnimationTimer() {
  if (tatianaAdopterAnimationTimer) {
    clearTimeout(tatianaAdopterAnimationTimer);
    tatianaAdopterAnimationTimer = null;
  }
}

function animateTatianaAdopters() {
  if (tatianaAdopterAnimationRunning) return;

  tatianaAdopterAnimationRunning = true;
  interactionLockedUntil = Date.now() + 1600;

  const beginAnimation = () => {
    renderTatianaBoard(false);
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

    tatianaAdopterAnimationTimer = window.setTimeout(() => {
      tatianaAdopterAnimationTimer = null;
      tatianaAdopterAnimationRunning = false;
      interactionLockedUntil = 0;
      sceneIndex = tatianaAdoptersDoneSceneIndex;
      renderScene();
    }, 1330);
  };

  hidePracticeDialogueBeforeAnimation(beginAnimation);
}

/* =========================================================
   RENDER FINAL DE ESTA CONTINUACIÓN
   ========================================================= */

const baseRenderSceneForTatianaFlow = renderScene;
renderScene = function () {
  clearTatianaAdopterAnimationTimer();
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
    renderTatianaBoard(false);
    setSceneImage("IMGBE1.png", "Tablero de práctica de Adóptame");
    showSpeakerDialogue("RE.png", scene);
    stage.setAttribute(
      "aria-label",
      "Último diálogo de este turno. Después Tatiana explicará la amenaza S6."
    );
    return;
  }

  if (scene.type === "practice-board" && scene.practiceStep === "tatiana-intro") {
    renderTatianaBoard(false);
    applyTatianaBackground();
    tatianaCEHighlight.hidden = false;
    showSpeakerDialogue("RC.png", scene);
    stage.setAttribute(
      "aria-label",
      "Tatiana toma la palabra. La amenaza S6 está resaltada y al tocar avanzarán los nuevos adoptantes."
    );
    return;
  }

  if (scene.type === "practice-board" && scene.practiceStep === "tatiana-adopters-done") {
    renderTatianaBoard(true);
    applyTatianaBackground();
    tatianaCEHighlight.hidden = false;
    dialogueText.hidden = true;
    hidePracticeSpeakerBox(true);
    stage.setAttribute(
      "aria-label",
      "La fila de adoptantes avanzó: AD16 está en D2, AD12 en D1 y AD13 queda visible en CD."
    );
  }
};

/* =========================================================
   CONTROL DE AVANCE
   ========================================================= */

const baseAdvanceSceneForTatianaFlow = advanceScene;
advanceScene = function () {
  const scene = scenes[sceneIndex];

  if (tatianaAdopterAnimationRunning) return;

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

  baseAdvanceSceneForTatianaFlow();
};

/* Navegación hacia atrás coherente con el nuevo bloque. */
const basePreviousSceneForTatianaFlow = previousScene;
previousScene = function () {
  if (tatianaAdopterAnimationRunning || Date.now() < interactionLockedUntil) return;

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

  if (scene?.practiceStep === "tatiana-adopters-done") {
    sceneIndex = tatianaIntroSceneIndex;
    renderScene();
    return;
  }

  basePreviousSceneForTatianaFlow();
};
