/* =========================================================
   TURNO DE TATIANA — FRANCIS, HABILIDAD DE ROL Y CONSULTORIO
   ========================================================= */

/*
 * Continúa inmediatamente después de que AS7 queda activa en CE.
 * Se mantiene la regla de fluidez: al terminar cada animación aparece
 * automáticamente el siguiente diálogo.
 */

[
  "AN11s.png",
  "AN15s.png",
  "AF17s.png",
  "FFCm.png",
  "FVRm.png"
].forEach(src => {
  const img = new Image();
  img.src = src;
});

/* =========================================================
   DIÁLOGO INICIAL SOBRE LA ESCENA YA EXISTENTE
   ========================================================= */

const tatianaThreatAdvancedForTurnIndex = scenes.findIndex(
  scene => scene.type === "practice-board" && scene.practiceStep === "tatiana-threat-advanced"
);

if (tatianaThreatAdvancedForTurnIndex >= 0) {
  scenes[tatianaThreatAdvancedForTurnIndex].text =
    "Como aún tenemos una habitación disponible, enviaremos a Francis allí. En cuanto lo ubiquemos, comenzarán mis acciones.";
}

const tatianaFrancisAffectionSceneIndex = scenes.length;
scenes.push({
  image: "IMGBE2.png",
  type: "practice-board",
  practiceStep: "tatiana-francis-affection",
  text: "Creo que me voy a arriesgar y dejaré la ficha de descuido para que el siguiente jugador se encargue de ella. Por ahora, colocaré una ficha rosada sobre Francis."
});

const tatianaRoleAbilitySceneIndex = scenes.length;
scenes.push({
  image: "IMGBE2.png",
  type: "practice-board",
  practiceStep: "tatiana-role-ability",
  text: "Ahora usaré mi habilidad de rol, que me permite intercambiar a los animales entre habitaciones. Llevaré a Francis al consultorio y traeré a Rango a la sala de estimulación."
});

const tatianaFinalHealthSceneIndex = scenes.length;
scenes.push({
  image: "IMGBE2.png",
  type: "practice-board",
  practiceStep: "tatiana-final-health",
  text: "Perfecto. Como mi habilidad de rol es gratuita, todavía me queda una acción. La usaré para colocar 2 fichas de salud sobre Francis, ya que está en el consultorio."
});

const tatianaHealthDoneSceneIndex = scenes.length;
scenes.push({
  image: "IMGBE2.png",
  type: "practice-board",
  practiceStep: "tatiana-health-done",
  text: ""
});

/* =========================================================
   ESTADOS DEL TABLERO DURANTE EL TURNO
   ========================================================= */

function renderTatianaActionBoard(options = {}) {
  const francisPlaced = Boolean(options.francisPlaced);
  const affectionPlaced = Boolean(options.affectionPlaced);
  const roleSwapped = Boolean(options.roleSwapped);
  const healthPlaced = Boolean(options.healthPlaced);

  renderTatianaBoard({
    adoptersAdvanced: true,
    diceFace: 3,
    neglectOnYetti: true,
    nextThreat: true
  });
  applyTatianaBackground();

  if (francisPlaced || affectionPlaced || roleSwapped || healthPlaced) {
    removeBoardPiece("AN11");
    createImagePiece("AN15", "AN15s.png", "CA", {
      zIndex: 14,
      alt: "Siguiente animal visible AN15"
    });

    createImagePiece("AN11", "AN11s.png", roleSwapped || healthPlaced ? "A4" : "A2", {
      zIndex: 17,
      alt: "Francis"
    });
  }

  if (roleSwapped || healthPlaced) {
    removeBoardPiece("AF17");
    createImagePiece("AF17", "AF17s.png", "A2", {
      zIndex: 17,
      alt: "Rango rehabilitado en la sala de estimulación"
    });
  }

  if (affectionPlaced || roleSwapped || healthPlaced) {
    removeBoardPiece("reserve-Ff4");
    createImagePiece(
      roleSwapped || healthPlaced ? "Francis-41" : "Francis-21",
      practiceTokenAssets.affection.small,
      roleSwapped || healthPlaced ? "41" : "21",
      {
        width: "1.78%",
        zIndex: 23,
        shadow: false,
        alt: "Ficha de afecto sobre Francis"
      }
    );
  }

  if (healthPlaced) {
    removeBoardPiece("reserve-Fv1");
    removeBoardPiece("reserve-Fv2");

    createImagePiece("Francis-43", practiceTokenAssets.health.small, "43", {
      width: "1.78%",
      zIndex: 23,
      shadow: false,
      alt: "Primera ficha de salud sobre Francis"
    });

    createImagePiece("Francis-44", practiceTokenAssets.health.small, "44", {
      width: "1.78%",
      zIndex: 23,
      shadow: false,
      alt: "Segunda ficha de salud sobre Francis"
    });
  }
}

/* =========================================================
   CONTROL DE ANIMACIONES
   ========================================================= */

let tatianaTurnAnimationRunning = false;
let tatianaTurnTimer = null;

function clearTatianaTurnTimer() {
  if (tatianaTurnTimer) {
    clearTimeout(tatianaTurnTimer);
    tatianaTurnTimer = null;
  }
}

function finishTatianaTurnAnimation(nextSceneIndex) {
  tatianaTurnTimer = null;
  tatianaTurnAnimationRunning = false;
  interactionLockedUntil = 0;
  sceneIndex = nextSceneIndex;
  renderScene();
}

/* =========================================================
   FRANCIS: CA -> A2 / AN15 QUEDA VISIBLE EN CA
   ========================================================= */

function animateFrancisToA2() {
  if (tatianaTurnAnimationRunning) return;

  tatianaTurnAnimationRunning = true;
  interactionLockedUntil = Date.now() + 1550;

  const beginAnimation = () => {
    renderTatianaActionBoard();

    // AN15 queda debajo mientras Francis abandona el mazo visible.
    createImagePiece("AN15", "AN15s.png", "CA", {
      zIndex: 13,
      alt: "Siguiente animal AN15"
    });

    const francis = boardPieces.get("AN11");
    if (francis) francis.style.zIndex = "27";

    window.setTimeout(() => {
      movePiece("AN11", "A2", { duration: 1050 });
    }, 120);

    tatianaTurnTimer = window.setTimeout(() => {
      finishTatianaTurnAnimation(tatianaFrancisAffectionSceneIndex);
    }, 1320);
  };

  hidePracticeDialogueBeforeAnimation(beginAnimation);
}

/* =========================================================
   FICHA ROSADA: Ff4 -> 21
   ========================================================= */

function animateFrancisAffection() {
  if (tatianaTurnAnimationRunning) return;

  tatianaTurnAnimationRunning = true;
  interactionLockedUntil = Date.now() + 1450;

  const beginAnimation = () => {
    renderTatianaActionBoard({ francisPlaced: true });

    const pink = boardPieces.get("reserve-Ff4");
    if (pink) pink.style.zIndex = "29";

    window.setTimeout(() => {
      movePiece("reserve-Ff4", "21", {
        duration: 950,
        width: "1.78%"
      });
    }, 120);

    tatianaTurnTimer = window.setTimeout(() => {
      finishTatianaTurnAnimation(tatianaRoleAbilitySceneIndex);
    }, 1240);
  };

  hidePracticeDialogueBeforeAnimation(beginAnimation);
}

/* =========================================================
   HABILIDAD DE ROL: FRANCIS A2 -> A4 / RANGO A4 -> A2
   La ficha rosada acompaña a Francis: 21 -> 41.
   ========================================================= */

function animateTatianaRoleSwap() {
  if (tatianaTurnAnimationRunning) return;

  tatianaTurnAnimationRunning = true;
  interactionLockedUntil = Date.now() + 1650;

  const beginAnimation = () => {
    renderTatianaActionBoard({
      francisPlaced: true,
      affectionPlaced: true
    });

    const francis = boardPieces.get("AN11");
    const rango = boardPieces.get("AF17");
    const pink = boardPieces.get("Francis-21");

    if (francis) francis.style.zIndex = "28";
    if (rango) rango.style.zIndex = "27";
    if (pink) pink.style.zIndex = "30";

    window.setTimeout(() => {
      movePiece("AN11", "A4", { duration: 1100 });
      movePiece("AF17", "A2", { duration: 1100 });
      movePiece("Francis-21", "41", {
        duration: 1100,
        width: "1.78%"
      });
    }, 120);

    tatianaTurnTimer = window.setTimeout(() => {
      finishTatianaTurnAnimation(tatianaFinalHealthSceneIndex);
    }, 1390);
  };

  hidePracticeDialogueBeforeAnimation(beginAnimation);
}

/* =========================================================
   ÚLTIMA ACCIÓN: Fv1/Fv2 -> 43/44
   ========================================================= */

function animateFrancisHealth() {
  if (tatianaTurnAnimationRunning) return;

  tatianaTurnAnimationRunning = true;
  interactionLockedUntil = Date.now() + 1650;

  const beginAnimation = () => {
    renderTatianaActionBoard({
      francisPlaced: true,
      affectionPlaced: true,
      roleSwapped: true
    });

    const green1 = boardPieces.get("reserve-Fv1");
    const green2 = boardPieces.get("reserve-Fv2");
    if (green1) green1.style.zIndex = "30";
    if (green2) green2.style.zIndex = "30";

    window.setTimeout(() => {
      movePiece("reserve-Fv1", "43", {
        duration: 1000,
        width: "1.78%"
      });
    }, 100);

    window.setTimeout(() => {
      movePiece("reserve-Fv2", "44", {
        duration: 1000,
        width: "1.78%"
      });
    }, 210);

    tatianaTurnTimer = window.setTimeout(() => {
      finishTatianaTurnAnimation(tatianaHealthDoneSceneIndex);
    }, 1450);
  };

  hidePracticeDialogueBeforeAnimation(beginAnimation);
}

/* =========================================================
   RENDER
   ========================================================= */

const baseRenderSceneForTatianaTurn = renderScene;
renderScene = function () {
  clearTatianaTurnTimer();
  baseRenderSceneForTatianaTurn();

  const scene = scenes[sceneIndex];
  if (!scene || scene.type !== "practice-board") return;

  if (scene.practiceStep === "tatiana-threat-advanced") {
    renderTatianaActionBoard();
    showSpeakerDialogue("RC.png", scene);
    stage.setAttribute(
      "aria-label",
      "Tatiana enviará a Francis, la carta visible en CA, a la habitación A2."
    );
    return;
  }

  if (scene.practiceStep === "tatiana-francis-affection") {
    renderTatianaActionBoard({ francisPlaced: true });
    showSpeakerDialogue("RC.png", scene);
    stage.setAttribute(
      "aria-label",
      "Francis está en A2 y AN15 queda visible en CA. Tatiana colocará una ficha rosada sobre Francis."
    );
    return;
  }

  if (scene.practiceStep === "tatiana-role-ability") {
    renderTatianaActionBoard({
      francisPlaced: true,
      affectionPlaced: true
    });
    showSpeakerDialogue("RC.png", scene);
    stage.setAttribute(
      "aria-label",
      "Tatiana usará su habilidad gratuita para intercambiar a Francis y Rango entre A2 y A4."
    );
    return;
  }

  if (scene.practiceStep === "tatiana-final-health") {
    renderTatianaActionBoard({
      francisPlaced: true,
      affectionPlaced: true,
      roleSwapped: true
    });
    showSpeakerDialogue("RC.png", scene);
    stage.setAttribute(
      "aria-label",
      "Francis está en el consultorio A4 con su ficha rosada en 41. Tatiana usará su acción restante para colocar dos fichas verdes."
    );
    return;
  }

  if (scene.practiceStep === "tatiana-health-done") {
    renderTatianaActionBoard({
      francisPlaced: true,
      affectionPlaced: true,
      roleSwapped: true,
      healthPlaced: true
    });
    dialogueText.hidden = true;
    hidePracticeSpeakerBox(true);
    stage.setAttribute(
      "aria-label",
      "Francis queda en A4 con una ficha rosada en 41 y dos fichas verdes en 43 y 44. Rango queda en A2 y AN15 permanece visible en CA."
    );
  }
};

/* =========================================================
   AVANCE
   ========================================================= */

const baseAdvanceSceneForTatianaTurn = advanceScene;
advanceScene = function () {
  const scene = scenes[sceneIndex];

  if (tatianaTurnAnimationRunning) return;

  if (scene?.practiceStep === "tatiana-threat-advanced") {
    animateFrancisToA2();
    return;
  }

  if (scene?.practiceStep === "tatiana-francis-affection") {
    animateFrancisAffection();
    return;
  }

  if (scene?.practiceStep === "tatiana-role-ability") {
    animateTatianaRoleSwap();
    return;
  }

  if (scene?.practiceStep === "tatiana-final-health") {
    animateFrancisHealth();
    return;
  }

  baseAdvanceSceneForTatianaTurn();
};

/* =========================================================
   RETROCESO
   ========================================================= */

const basePreviousSceneForTatianaTurn = previousScene;
previousScene = function () {
  if (tatianaTurnAnimationRunning || Date.now() < interactionLockedUntil) return;

  const scene = scenes[sceneIndex];

  if (scene?.practiceStep === "tatiana-francis-affection") {
    if (tatianaThreatAdvancedForTurnIndex >= 0) {
      sceneIndex = tatianaThreatAdvancedForTurnIndex;
      renderScene();
      return;
    }
  }

  if (scene?.practiceStep === "tatiana-role-ability") {
    sceneIndex = tatianaFrancisAffectionSceneIndex;
    renderScene();
    return;
  }

  if (scene?.practiceStep === "tatiana-final-health") {
    sceneIndex = tatianaRoleAbilitySceneIndex;
    renderScene();
    return;
  }

  if (scene?.practiceStep === "tatiana-health-done") {
    sceneIndex = tatianaFinalHealthSceneIndex;
    renderScene();
    return;
  }

  basePreviousSceneForTatianaTurn();
};
