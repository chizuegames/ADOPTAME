/* =========================================================
   TRANSICIÓN DE TATIANA A LA DIRECTORA — FACTURA Y ADOPTANTES
   ========================================================= */

/*
 * Continúa inmediatamente después de que Tatiana termina de colocar las
 * dos fichas verdes sobre Francis.
 *
 * Secuencia de voces:
 *   RC -> RD -> RV -> RC -> RD
 *
 * Al final, AD13 en CD gira para convertirse en FC1. Después la fila avanza:
 *   FC1  : CD -> D1
 *   AD12 : D1 -> D2
 *   AD16 : D2 -> D3
 */

[
  "RC.png",
  "RD.png",
  "RV.png",
  "FC1.png"
].forEach(src => {
  const img = new Image();
  img.src = src;
});

/* =========================================================
   ESCENAS
   ========================================================= */

const directorHandoffSceneIndex = scenes.length;
scenes.push({
  image: "IMGBE2.png",
  type: "practice-board",
  practiceStep: "director-handoff",
  text: "Qué triste, mi turno ya se acaba. Pero no se preocupen, ahora los dejo con nuestra siguiente jugadora: ¡la directora!"
});

const directorReturnSceneIndex = scenes.length;
scenes.push({
  image: "IMGBE2.png",
  type: "practice-board",
  practiceStep: "director-return",
  text: "¡Hola de nuevo! Ya estoy de vuelta para seguir cuidando y luchando por estos animalitos que tanto amor nos dan."
});

const directorWarningSceneIndex = scenes.length;
scenes.push({
  image: "IMGBE2.png",
  type: "practice-board",
  practiceStep: "director-warning",
  text: "Pero le dejaste una situación complicada a la directora... ¡mira ese descuido! Si sale un 3, Yetti podría morir."
});

const directorReassureSceneIndex = scenes.length;
scenes.push({
  image: "IMGBE2.png",
  type: "practice-board",
  practiceStep: "director-reassure",
  text: "Tranquila, esperemos que la suerte esté de nuestro lado. Puede que esta decisión termine salvando vidas más adelante."
});

const directorWeekSceneIndex = scenes.length;
scenes.push({
  image: "IMGBE2.png",
  type: "practice-board",
  practiceStep: "director-week",
  text: "Ya no más discusiones. Veamos qué nos depara esta semana. Primero, llegará una factura, así que la carta de adoptante entrará al revés, por el lado de facturas y donaciones."
});

const directorBillingDoneSceneIndex = scenes.length;
scenes.push({
  image: "IMGBE2.png",
  type: "practice-board",
  practiceStep: "director-billing-done",
  text: ""
});

/* =========================================================
   ESTADO DEL TABLERO
   ========================================================= */

function renderDirectorBoard(options = {}) {
  const billingAdvanced = Boolean(options.billingAdvanced);

  renderTatianaActionBoard({
    francisPlaced: true,
    affectionPlaced: true,
    roleSwapped: true,
    healthPlaced: true
  });

  if (!billingAdvanced) return;

  removeBoardPiece("AD13");
  removeBoardPiece("AD12");
  removeBoardPiece("AD16");

  createImagePiece("FC1", "FC1.png", "D1", {
    zIndex: 18,
    alt: "Factura FC1 en D1"
  });

  createImagePiece("AD12", "AD12s.png", "D2", {
    zIndex: 17,
    alt: "Adoptante AD12 en D2"
  });

  createImagePiece("AD16", "AD16s.png", "D3", {
    zIndex: 17,
    alt: "Adoptante AD16 en D3"
  });
}

/* =========================================================
   ANIMACIÓN DE FACTURA Y DESPLAZAMIENTO DE LA FILA
   ========================================================= */

let directorAnimationRunning = false;
let directorAnimationTimer = null;

function clearDirectorAnimationTimer() {
  if (directorAnimationTimer) {
    clearTimeout(directorAnimationTimer);
    directorAnimationTimer = null;
  }
}

function animateDirectorBillingQueue() {
  if (directorAnimationRunning) return;

  directorAnimationRunning = true;
  interactionLockedUntil = Date.now() + 2200;

  const beginAnimation = () => {
    renderDirectorBoard({ billingAdvanced: false });
    applyTatianaBackground();

    const topCard = boardPieces.get("AD13");
    const d1Card = boardPieces.get("AD12");
    const d2Card = boardPieces.get("AD16");

    if (topCard) {
      topCard.style.zIndex = "30";
      topCard.style.transformOrigin = "center center";
      topCard.style.transition = "transform 220ms ease-in";
      topCard.style.transform = "scaleX(0)";
    }

    if (d1Card) d1Card.style.zIndex = "28";
    if (d2Card) d2Card.style.zIndex = "27";

    // En el punto medio del giro, la carta cambia del lado de adoptante a FC1.
    window.setTimeout(() => {
      const card = boardPieces.get("AD13");
      if (!card) return;

      card.src = "FC1.png";
      card.alt = "Factura FC1";
      card.style.transition = "transform 220ms ease-out";
      card.style.transform = "scaleX(1)";
    }, 230);

    // Una vez completado el giro, toda la fila avanza una posición.
    window.setTimeout(() => {
      movePiece("AD13", "D1", { duration: 1050 });
      movePiece("AD12", "D2", { duration: 1050 });
      movePiece("AD16", "D3", { duration: 1050 });
    }, 520);

    directorAnimationTimer = window.setTimeout(() => {
      directorAnimationTimer = null;
      directorAnimationRunning = false;
      interactionLockedUntil = 0;
      sceneIndex = directorBillingDoneSceneIndex;
      renderScene();
    }, 1780);
  };

  hidePracticeDialogueBeforeAnimation(beginAnimation);
}

/* =========================================================
   RENDER
   ========================================================= */

const baseRenderSceneForDirectorTurn = renderScene;
renderScene = function () {
  clearDirectorAnimationTimer();
  baseRenderSceneForDirectorTurn();

  const scene = scenes[sceneIndex];
  if (!scene || scene.type !== "practice-board") return;

  /*
   * La animación anterior termina en tatiana-health-done. Aplicamos la regla
   * de fluidez y mostramos inmediatamente la despedida de Tatiana.
   */
  if (scene.practiceStep === "tatiana-health-done") {
    sceneIndex = directorHandoffSceneIndex;
    renderScene();
    return;
  }

  if (scene.practiceStep === "director-handoff") {
    renderDirectorBoard();
    applyTatianaBackground();
    showSpeakerDialogue("RC.png", scene);
    stage.setAttribute(
      "aria-label",
      "Tatiana termina su turno y presenta a la directora."
    );
    return;
  }

  if (scene.practiceStep === "director-return") {
    renderDirectorBoard();
    applyTatianaBackground();
    showSpeakerDialogue("RD.png", scene);
    stage.setAttribute(
      "aria-label",
      "La directora vuelve para continuar el tutorial."
    );
    return;
  }

  if (scene.practiceStep === "director-warning") {
    renderDirectorBoard();
    applyTatianaBackground();
    showSpeakerDialogue("RV.png", scene);
    stage.setAttribute(
      "aria-label",
      "Valentina advierte sobre el descuido que tiene Yetti."
    );
    return;
  }

  if (scene.practiceStep === "director-reassure") {
    renderDirectorBoard();
    applyTatianaBackground();
    showSpeakerDialogue("RC.png", scene);
    stage.setAttribute(
      "aria-label",
      "Tatiana responde y espera que la suerte esté de su lado."
    );
    return;
  }

  if (scene.practiceStep === "director-week") {
    renderDirectorBoard();
    applyTatianaBackground();
    showSpeakerDialogue("RD.png", scene);
    stage.setAttribute(
      "aria-label",
      "La directora explica que llegará una factura y la carta entrará al revés por la fila de adoptantes."
    );
    return;
  }

  if (scene.practiceStep === "director-billing-done") {
    renderDirectorBoard({ billingAdvanced: true });
    applyTatianaBackground();
    dialogueText.hidden = true;
    hidePracticeSpeakerBox(true);
    stage.setAttribute(
      "aria-label",
      "La factura FC1 quedó en D1, AD12 avanzó a D2 y AD16 avanzó a D3."
    );
  }
};

/* =========================================================
   AVANCE
   ========================================================= */

const baseAdvanceSceneForDirectorTurn = advanceScene;
advanceScene = function () {
  const scene = scenes[sceneIndex];

  if (directorAnimationRunning) return;

  if (scene?.practiceStep === "director-handoff") {
    sceneIndex = directorReturnSceneIndex;
    renderScene();
    return;
  }

  if (scene?.practiceStep === "director-return") {
    sceneIndex = directorWarningSceneIndex;
    renderScene();
    return;
  }

  if (scene?.practiceStep === "director-warning") {
    sceneIndex = directorReassureSceneIndex;
    renderScene();
    return;
  }

  if (scene?.practiceStep === "director-reassure") {
    sceneIndex = directorWeekSceneIndex;
    renderScene();
    return;
  }

  if (scene?.practiceStep === "director-week") {
    animateDirectorBillingQueue();
    return;
  }

  baseAdvanceSceneForDirectorTurn();
};

/* =========================================================
   RETROCESO
   ========================================================= */

const basePreviousSceneForDirectorTurn = previousScene;
previousScene = function () {
  if (directorAnimationRunning || Date.now() < interactionLockedUntil) return;

  const scene = scenes[sceneIndex];

  if (scene?.practiceStep === "director-handoff") {
    const previousIndex = scenes.findIndex(
      item => item.type === "practice-board" && item.practiceStep === "tatiana-final-health"
    );
    if (previousIndex >= 0) {
      sceneIndex = previousIndex;
      renderScene();
      return;
    }
  }

  if (scene?.practiceStep === "director-return") {
    sceneIndex = directorHandoffSceneIndex;
    renderScene();
    return;
  }

  if (scene?.practiceStep === "director-warning") {
    sceneIndex = directorReturnSceneIndex;
    renderScene();
    return;
  }

  if (scene?.practiceStep === "director-reassure") {
    sceneIndex = directorWarningSceneIndex;
    renderScene();
    return;
  }

  if (scene?.practiceStep === "director-week") {
    sceneIndex = directorReassureSceneIndex;
    renderScene();
    return;
  }

  if (scene?.practiceStep === "director-billing-done") {
    sceneIndex = directorWeekSceneIndex;
    renderScene();
    return;
  }

  basePreviousSceneForDirectorTurn();
};
