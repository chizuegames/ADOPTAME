/* =========================================================
   CONTINUACIÓN DE LA PRÁCTICA — YETTI Y REHABILITACIÓN DE RANGO
   ========================================================= */

/*
 * Continúa desde el estado final de la primera resolución de amenaza.
 * El tablero se conserva visible mientras se consulta la carta grande de
 * Yetti y luego se desarrollan las dos acciones del siguiente turno.
 */

/* =========================================================
   OCHO FICHAS NEGRAS
   Desde que comienza la práctica hay 6 disponibles en F y 2 agotadas en Q.
   ========================================================= */

const baseRenderReserveTokensWithInitialBlackQ = renderReserveTokens;
renderReserveTokens = function (includeFn6 = true) {
  baseRenderReserveTokensWithInitialBlackQ(includeFn6);

  createImagePiece("initial-Qn1", practiceTokenAssets.neglect.small, "Qn1", {
    width: "1.72%",
    shadow: false,
    zIndex: 18
  });

  createImagePiece("initial-Qn2", practiceTokenAssets.neglect.small, "Qn2", {
    width: "1.72%",
    shadow: false,
    zIndex: 18
  });
};

/* =========================================================
   ESCENAS
   ========================================================= */

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
  text: "Listo, Yetti ya tiene dónde quedarse. Pero no nos olvidemos de Rango. Usaré mi primera acción para retirar su ficha de descuido antes de que se multiplique."
});

const neglectRemovedWaitSceneIndex = scenes.length;
scenes.push({
  image: "IMGBE1.png",
  type: "practice-board",
  practiceStep: "neglect-removed-wait",
  text: ""
});

const stimulationDialogueSceneIndex = scenes.length;
scenes.push({
  image: "IMGBE1.png",
  type: "practice-board",
  practiceStep: "stimulation-dialogue",
  text: "Veo que a Rango ya solo le falta cubrir una necesidad de estimulación para rehabilitarse, así que usaré mi segunda acción para hacerlo."
});

const stimulationDoneWaitSceneIndex = scenes.length;
scenes.push({
  image: "IMGBE1.png",
  type: "practice-board",
  practiceStep: "stimulation-done-wait",
  text: ""
});

const rehabilitationDialogueSceneIndex = scenes.length;
scenes.push({
  image: "IMGBE1.png",
  type: "practice-board",
  practiceStep: "rehabilitation-dialogue",
  text: "Ahora que hemos cubierto todas las necesidades de Rango, moveremos sus fichas al lado de la zona de receso y daremos vuelta a su carta."
});

const rangoRehabilitatedSceneIndex = scenes.length;
scenes.push({
  image: "IMGBE1.png",
  type: "practice-board",
  practiceStep: "rango-rehabilitated",
  text: ""
});

[
  "AN2.png",
  "AN2s.png",
  "AN11s.png",
  "AN17s.png",
  "AF17s.png"
].forEach(src => {
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

let continuationAnimating = false;
let continuationTimer = null;

function clearContinuationTimer() {
  if (continuationTimer) {
    clearTimeout(continuationTimer);
    continuationTimer = null;
  }
}

function hideYettiExtraUI() {
  yettiCAHotspot.hidden = true;
  yettiLargeCard.hidden = true;
  clearContinuationTimer();
}

function removeBoardPiece(id) {
  const piece = boardPieces.get(id);
  if (piece) piece.remove();
  boardPieces.delete(id);
}

/* =========================================================
   ESTADOS DEL TABLERO
   ========================================================= */

function renderResolvedBoard() {
  if (typeof clearBoardPieces === "function") clearBoardPieces();
  boardPracticeLayer.style.display = "block";
  renderCoreBoardState({ adopterMoved: true, showDie: true, neglectPlaced: true });
}

function putYettiInA3AndNextAnimalInCA() {
  // Quita AN2 del mazo para que exista una sola copia visual de Yetti.
  removeBoardPiece("AN2");

  createImagePiece("AN11", "AN11s.png", "CA", {
    zIndex: 14,
    alt: "Siguiente animal visible AN11"
  });

  createImagePiece("AN2", "AN2s.png", "A3", {
    zIndex: 16,
    alt: "Yetti ubicado en A3"
  });
}

function renderYettiTurnBoard(options = {}) {
  const neglectPlaced = options.neglectPlaced !== false;
  const stimulationPlaced = Boolean(options.stimulationPlaced);
  const exhausted = Boolean(options.exhausted);
  const rangoFlipped = Boolean(options.rangoFlipped);

  if (typeof clearBoardPieces === "function") clearBoardPieces();
  boardPracticeLayer.style.display = "block";

  renderCoreBoardState({
    adopterMoved: true,
    showDie: true,
    neglectPlaced
  });

  putYettiInA3AndNextAnimalInCA();

  if (stimulationPlaced || exhausted) {
    // La quinta ficha azul deja la reserva F para cubrir a Rango.
    removeBoardPiece("reserve-Fz5");
  }

  if (stimulationPlaced && !exhausted) {
    createImagePiece("Rango-41", practiceTokenAssets.stimulation.small, "41", {
      width: "1.78%",
      zIndex: 22,
      shadow: false
    });
  }

  if (exhausted) {
    // Las fichas usadas pasan a Q y dejan de mostrarse sobre la carta.
    removeBoardPiece("Rango-42");
    removeBoardPiece("Rango-43");
    removeBoardPiece("Rango-44");

    createImagePiece("used-Qz1", practiceTokenAssets.stimulation.small, "Qz1", {
      width: "1.72%",
      shadow: false,
      zIndex: 19
    });
    createImagePiece("used-Qf1", practiceTokenAssets.affection.small, "Qf1", {
      width: "1.72%",
      shadow: false,
      zIndex: 19
    });
    createImagePiece("used-Qv1", practiceTokenAssets.health.small, "Qv1", {
      width: "1.72%",
      shadow: false,
      zIndex: 19
    });
    createImagePiece("used-Qv2", practiceTokenAssets.health.small, "Qv2", {
      width: "1.72%",
      shadow: false,
      zIndex: 19
    });
  }

  if (rangoFlipped) {
    removeBoardPiece("AN17");
    createImagePiece("AF17", "AF17s.png", "A4", {
      zIndex: 16,
      alt: "Rango rehabilitado"
    });
  }
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

/* =========================================================
   YETTI
   ========================================================= */

function openYettiDetail() {
  if (continuationAnimating) return;
  sceneIndex = yettiDetailSceneIndex;
  interactionLockedUntil = 0;
  renderScene();
}

function animateYettiToA3() {
  if (continuationAnimating) return;

  continuationAnimating = true;
  interactionLockedUntil = Date.now() + 1450;

  const beginAnimation = () => {
    yettiLargeCard.hidden = true;
    yettiCAHotspot.hidden = true;

    renderResolvedBoard();

    // AN11 aparece debajo antes de que Yetti salga del mazo.
    createImagePiece("AN11", "AN11s.png", "CA", {
      zIndex: 14,
      alt: "Siguiente animal visible AN11"
    });

    const yettiSmall = boardPieces.get("AN2");
    if (yettiSmall) yettiSmall.style.zIndex = "18";

    window.setTimeout(() => {
      movePiece("AN2", "A3", { duration: 1050 });
    }, 120);

    continuationTimer = window.setTimeout(() => {
      continuationTimer = null;
      continuationAnimating = false;
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

/* =========================================================
   PRIMERA ACCIÓN: RETIRAR DESCUIDO
   ========================================================= */

function animateNeglectBackToFn5() {
  if (continuationAnimating) return;

  continuationAnimating = true;
  interactionLockedUntil = Date.now() + 1500;

  const beginAnimation = () => {
    renderYettiTurnBoard({ neglectPlaced: true });

    /*
     * Fn1-Fn5 están ocupadas porque Fn6 fue la ficha que cayó sobre Rango.
     * Para cumplir la nueva distribución, la ficha que ya estaba en Fn5 se
     * corre a Fn6 y la ficha retirada de Rango regresa específicamente a Fn5.
     */
    const reserveFn5 = boardPieces.get("reserve-Fn5");
    if (reserveFn5) reserveFn5.style.zIndex = "23";

    movePiece("reserve-Fn5", "Fn6", { duration: 420 });

    window.setTimeout(() => {
      const neglect = boardPieces.get("Rango-46");
      if (neglect) neglect.style.zIndex = "25";
      movePiece("Rango-46", "Fn5", { duration: 900 });
    }, 210);

    continuationTimer = window.setTimeout(() => {
      continuationTimer = null;
      continuationAnimating = false;
      interactionLockedUntil = 0;
      sceneIndex = neglectRemovedWaitSceneIndex;
      renderScene();
    }, 1320);
  };

  if (typeof hidePracticeDialogueBeforeAnimation === "function") {
    hidePracticeDialogueBeforeAnimation(beginAnimation);
  } else {
    beginAnimation();
  }
}

/* =========================================================
   SEGUNDA ACCIÓN: CUBRIR ESTIMULACIÓN
   ========================================================= */

function animateStimulationToRango() {
  if (continuationAnimating) return;

  continuationAnimating = true;
  interactionLockedUntil = Date.now() + 1450;

  const beginAnimation = () => {
    renderYettiTurnBoard({ neglectPlaced: false });

    const blue = boardPieces.get("reserve-Fz5");
    if (blue) blue.style.zIndex = "25";

    window.setTimeout(() => {
      movePiece("reserve-Fz5", "41", {
        duration: 950,
        width: "1.78%"
      });
    }, 120);

    continuationTimer = window.setTimeout(() => {
      continuationTimer = null;
      continuationAnimating = false;
      interactionLockedUntil = 0;
      sceneIndex = stimulationDoneWaitSceneIndex;
      renderScene();
    }, 1260);
  };

  if (typeof hidePracticeDialogueBeforeAnimation === "function") {
    hidePracticeDialogueBeforeAnimation(beginAnimation);
  } else {
    beginAnimation();
  }
}

/* =========================================================
   REHABILITACIÓN: FICHAS A Q Y CARTA A SU LADO REHABILITADO
   ========================================================= */

function animateRangoRehabilitation() {
  if (continuationAnimating) return;

  continuationAnimating = true;
  interactionLockedUntil = Date.now() + 2300;

  const beginAnimation = () => {
    renderYettiTurnBoard({ neglectPlaced: false, stimulationPlaced: true });

    ["Rango-41", "Rango-42", "Rango-43", "Rango-44"].forEach(id => {
      const piece = boardPieces.get(id);
      if (piece) piece.style.zIndex = "27";
    });

    // Cada color va a su primera posición disponible de la zona Q.
    window.setTimeout(() => movePiece("Rango-41", "Qz1", { duration: 900, width: "1.72%" }), 100);
    window.setTimeout(() => movePiece("Rango-42", "Qf1", { duration: 900, width: "1.72%" }), 180);
    window.setTimeout(() => movePiece("Rango-43", "Qv1", { duration: 900, width: "1.72%" }), 260);
    window.setTimeout(() => movePiece("Rango-44", "Qv2", { duration: 900, width: "1.72%" }), 340);

    // Después de guardar las fichas, la carta gira y revela AF17s.
    window.setTimeout(() => {
      const rango = boardPieces.get("AN17");
      if (!rango) return;

      rango.style.transition = "transform 260ms ease-in, opacity 260ms ease-in";
      rango.style.transform = "perspective(700px) rotateY(90deg)";
      rango.style.opacity = "0.45";

      window.setTimeout(() => {
        rango.src = "AF17s.png";
        rango.alt = "Rango rehabilitado";
        rango.style.transition = "transform 300ms ease-out, opacity 300ms ease-out";
        rango.style.transform = "perspective(700px) rotateY(0deg)";
        rango.style.opacity = "1";
      }, 270);
    }, 1320);

    continuationTimer = window.setTimeout(() => {
      continuationTimer = null;
      continuationAnimating = false;
      interactionLockedUntil = 0;
      sceneIndex = rangoRehabilitatedSceneIndex;
      renderScene();
    }, 2010);
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
  continuationAnimating = false;

  baseRenderSceneForYettiContinuation();

  const scene = scenes[sceneIndex];
  if (!scene) return;

  if (scene.practiceStep === "after-roll") {
    // Este diálogo inicia el turno siguiente; para avanzar hay que tocar CA.
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
    renderYettiTurnBoard({ neglectPlaced: true });
    showContinuationDialogue(scene);
    stage.setAttribute(
      "aria-label",
      "Yetti está en A3. Toca para retirar la ficha negra de descuido de Rango y devolverla a Fn5."
    );
    return;
  }

  if (scene.practiceStep === "neglect-removed-wait") {
    renderYettiTurnBoard({ neglectPlaced: false });
    showContinuationDialogue(scene);
    stage.setAttribute(
      "aria-label",
      "La ficha de descuido fue retirada. Toca para conocer la segunda acción del turno."
    );
    return;
  }

  if (scene.practiceStep === "stimulation-dialogue") {
    renderYettiTurnBoard({ neglectPlaced: false });
    showContinuationDialogue(scene);
    stage.setAttribute(
      "aria-label",
      "A Rango solo le falta estimulación. Toca para mover una ficha azul desde F hasta la posición 41."
    );
    return;
  }

  if (scene.practiceStep === "stimulation-done-wait") {
    renderYettiTurnBoard({ neglectPlaced: false, stimulationPlaced: true });
    showContinuationDialogue(scene);
    stage.setAttribute(
      "aria-label",
      "Rango ya tiene cubiertas todas sus necesidades. Toca para continuar."
    );
    return;
  }

  if (scene.practiceStep === "rehabilitation-dialogue") {
    renderYettiTurnBoard({ neglectPlaced: false, stimulationPlaced: true });
    showContinuationDialogue(scene);
    stage.setAttribute(
      "aria-label",
      "Toca para mover las fichas de Rango a la zona Q y dar vuelta su carta."
    );
    return;
  }

  if (scene.practiceStep === "rango-rehabilitated") {
    renderYettiTurnBoard({
      neglectPlaced: false,
      exhausted: true,
      rangoFlipped: true
    });
    showContinuationDialogue(scene);
    stage.setAttribute(
      "aria-label",
      "Rango está rehabilitado. Su carta ahora muestra AF17 y sus fichas usadas están agotadas en la zona Q."
    );
  }
};

/* =========================================================
   CONTROL DE AVANCE
   ========================================================= */

const baseAdvanceSceneForYettiContinuation = advanceScene;
advanceScene = function () {
  const scene = scenes[sceneIndex];

  if (continuationAnimating) return;

  // Aquí no basta tocar cualquier parte: hay que seleccionar la carta en CA.
  if (scene?.practiceStep === "after-roll") return;

  // Cierra la consulta grande y mueve Yetti hasta A3.
  if (scene?.practiceStep === "yetti-detail") {
    animateYettiToA3();
    return;
  }

  // Primera acción: retirar la ficha negra de Rango.
  if (scene?.practiceStep === "yetti-placed") {
    animateNeglectBackToFn5();
    return;
  }

  // Después de la animación, el siguiente toque muestra el segundo diálogo.
  if (scene?.practiceStep === "neglect-removed-wait") {
    sceneIndex = stimulationDialogueSceneIndex;
    renderScene();
    return;
  }

  // Segunda acción: una ficha azul baja desde F hasta 41.
  if (scene?.practiceStep === "stimulation-dialogue") {
    animateStimulationToRango();
    return;
  }

  // Después de la animación, el siguiente toque explica la rehabilitación.
  if (scene?.practiceStep === "stimulation-done-wait") {
    sceneIndex = rehabilitationDialogueSceneIndex;
    renderScene();
    return;
  }

  // Las cuatro fichas se agotan en Q y la carta cambia de AN17s a AF17s.
  if (scene?.practiceStep === "rehabilitation-dialogue") {
    animateRangoRehabilitation();
    return;
  }

  baseAdvanceSceneForYettiContinuation();
};
