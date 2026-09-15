/* =========================================================
   CONTINUACIÓN DE LA PRÁCTICA — YETTI
   ========================================================= */

/*
 * Continúa desde el estado final de la primera resolución de amenaza.
 * El tablero se conserva visible mientras se consulta la carta grande de
 * Yetti. La carta grande intenta usar AN2.png y, mientras ese archivo no
 * esté disponible, cae automáticamente a AN2s.png como respaldo.
 */

const afterRollSceneIndex = scenes.findIndex(
  scene => scene.type === "practice-board" && scene.practiceStep === "after-roll"
);

if (afterRollSceneIndex >= 0) {
  scenes[afterRollSceneIndex].text =
    "Con esto termina el turno de Valentina y comienza el mío. Toca al siguiente animal para ver qué necesita y decidir dónde ubicarlo.";
}

const yettiDetailSceneIndex = scenes.length;
scenes.push({
  image: "IMGBE1.png",
  type: "practice-board",
  practiceStep: "yetti-detail",
  text: "Mmm... Veo que Yetti necesita un poco de afecto. Lo mejor será llevarlo a la sala rosa de descanso."
});

const yettiPlacedSceneIndex = scenes.length;
scenes.push({
  image: "IMGBE1.png",
  type: "practice-board",
  practiceStep: "yetti-placed",
  text: ""
});

["AN2.png", "AN2s.png", "AN11s.png"].forEach(src => {
  const img = new Image();
  img.src = src;
});

/* =========================================================
   ELEMENTOS DE INTERACCIÓN
   ========================================================= */

const yettiCAHotspot = document.createElement("button");
yettiCAHotspot.type = "button";
yettiCAHotspot.hidden = true;
yettiCAHotspot.setAttribute("aria-label", "Abrir la siguiente carta de animal");
yettiCAHotspot.title = "Ver siguiente animal";
Object.assign(yettiCAHotspot.style, {
  position: "absolute",
  zIndex: "38",
  left: "9.0%",
  top: "42.8%",
  width: "8.4%",
  height: "22.3%",
  border: "0",
  padding: "0",
  background: "transparent",
  cursor: "pointer",
  touchAction: "manipulation"
});
stage.appendChild(yettiCAHotspot);

const yettiLargeCard = document.createElement("img");
yettiLargeCard.src = "AN2.png";
yettiLargeCard.alt = "Carta grande de Yetti";
yettiLargeCard.draggable = false;
yettiLargeCard.hidden = true;
Object.assign(yettiLargeCard.style, {
  position: "absolute",
  zIndex: "42",
  left: "39.0%",
  top: "4.0%",
  width: "22.0%",
  height: "auto",
  objectFit: "contain",
  filter: "drop-shadow(0 10px 18px rgba(0,0,0,.28))",
  pointerEvents: "none",
  opacity: "1",
  transform: "scale(1)",
  transformOrigin: "center center"
});

yettiLargeCard.addEventListener("error", () => {
  if (!yettiLargeCard.src.endsWith("AN2s.png")) {
    yettiLargeCard.src = "AN2s.png";
  }
});

stage.appendChild(yettiLargeCard);

let yettiPlacementAnimating = false;
let yettiPlacementTimer = null;

function clearYettiPlacementTimer() {
  if (yettiPlacementTimer) {
    clearTimeout(yettiPlacementTimer);
    yettiPlacementTimer = null;
  }
}

function hideYettiExtraUI() {
  yettiCAHotspot.hidden = true;
  yettiLargeCard.hidden = true;
  clearYettiPlacementTimer();
}

function renderResolvedBoard() {
  if (typeof clearBoardPieces === "function") clearBoardPieces();
  boardPracticeLayer.style.display = "block";
  renderCoreBoardState({ adopterMoved: true, showDie: true, neglectPlaced: true });
}

function renderYettiPlacedBoard() {
  renderResolvedBoard();

  // AN11 queda visible en CA cuando Yetti abandona el mazo.
  createImagePiece("AN11", "AN11s.png", "CA", {
    zIndex: 14,
    alt: "Siguiente animal visible AN11"
  });

  // La misma carta pequeña de Yetti queda en A3, la sala rosa de descanso.
  createImagePiece("AN2", "AN2s.png", "A3", {
    zIndex: 16,
    alt: "Yetti ubicado en A3"
  });
}

function showContinuationDialogue(scene) {
  if (!scene?.text) {
    dialogueText.hidden = true;
    if (typeof hidePracticeSpeakerBox === "function") hidePracticeSpeakerBox(true);
    return;
  }

  if (typeof showPracticeSpeakerBox === "function") showPracticeSpeakerBox();
  dialogueText.hidden = false;
  dialogueText.textContent = scene.text;

  if (typeof applyMobilePracticeDialogueLayout === "function") {
    applyMobilePracticeDialogueLayout();
  }
}

function openYettiDetail() {
  if (yettiPlacementAnimating) return;
  sceneIndex = yettiDetailSceneIndex;
  interactionLockedUntil = 0;
  renderScene();
}

function animateYettiToA3() {
  if (yettiPlacementAnimating) return;

  yettiPlacementAnimating = true;
  interactionLockedUntil = Date.now() + 1450;

  const beginAnimation = () => {
    yettiLargeCard.hidden = true;
    yettiCAHotspot.hidden = true;

    renderResolvedBoard();

    // Ponemos AN11 debajo de AN2 antes de moverla, así el mazo nunca queda vacío.
    createImagePiece("AN11", "AN11s.png", "CA", {
      zIndex: 14,
      alt: "Siguiente animal visible AN11"
    });

    const yettiSmall = boardPieces.get("AN2");
    if (yettiSmall) yettiSmall.style.zIndex = "18";

    window.setTimeout(() => {
      movePiece("AN2", "A3", { duration: 1050 });
    }, 120);

    yettiPlacementTimer = window.setTimeout(() => {
      yettiPlacementTimer = null;
      yettiPlacementAnimating = false;
      interactionLockedUntil = 0;
      sceneIndex = yettiPlacedSceneIndex;
      renderScene();
    }, 1320);
  };

  if (typeof hidePracticeDialogueBeforeAnimation === "function") {
    hidePracticeDialogueBeforeAnimation(beginAnimation);
  } else {
    beginAnimation();
  }
}

yettiCAHotspot.addEventListener("click", event => {
  event.preventDefault();
  event.stopPropagation();
  openYettiDetail();
});

/* =========================================================
   RENDER DE LAS NUEVAS FASES
   ========================================================= */

const baseRenderSceneForYettiContinuation = renderScene;
renderScene = function () {
  hideYettiExtraUI();
  yettiPlacementAnimating = false;

  baseRenderSceneForYettiContinuation();

  const scene = scenes[sceneIndex];
  if (!scene) return;

  if (scene.practiceStep === "after-roll") {
    // El flujo anterior ocultaba este diálogo porque antes era un estado final.
    // Ahora pasa a ser el comienzo del siguiente turno.
    renderResolvedBoard();
    yettiCAHotspot.hidden = false;
    showContinuationDialogue(scene);
    stage.setAttribute(
      "aria-label",
      "Terminó el turno de Valentina. Toca la carta de animal visible en CA para conocer a Yetti."
    );
    return;
  }

  if (scene.practiceStep === "yetti-detail") {
    renderResolvedBoard();
    yettiLargeCard.hidden = false;
    showContinuationDialogue(scene);
    stage.setAttribute(
      "aria-label",
      "Carta grande de Yetti. Yetti necesita afecto y debe ir a la sala rosa de descanso. Toca para continuar."
    );
    return;
  }

  if (scene.practiceStep === "yetti-placed") {
    renderYettiPlacedBoard();
    dialogueText.hidden = true;
    if (typeof hidePracticeSpeakerBox === "function") hidePracticeSpeakerBox(true);
    stage.setAttribute(
      "aria-label",
      "Yetti está ubicado en A3 y AN11 queda visible en CA como siguiente carta de animal."
    );
  }
};

/* =========================================================
   CONTROL DE AVANCE
   ========================================================= */

const baseAdvanceSceneForYettiContinuation = advanceScene;
advanceScene = function () {
  const scene = scenes[sceneIndex];

  // En este punto no basta tocar cualquier parte: hay que seleccionar CA.
  if (scene?.practiceStep === "after-roll") return;

  // Un toque sobre la carta grande cierra la consulta y anima Yetti a A3.
  if (scene?.practiceStep === "yetti-detail") {
    animateYettiToA3();
    return;
  }

  baseAdvanceSceneForYettiContinuation();
};
