/* =========================================================
   TERCERA RONDA — TURNO DE VALENTINA Y ADOPCIÓN DE FRANCIS
   ========================================================= */

/*
 * Continúa después del diálogo de la semana 9.
 *
 * Secuencia:
 * - Cambia el fondo a IMGBE4 y vuelve Valentina (RV).
 * - Descansar devuelve 3 fichas verdes de Q a F.
 * - Valentina coloca una ficha azul sobre Spirit en 24.
 * - Francis (AF11s) baja de A4 a D2, detrás de Victoria (AD2s).
 * - Se muestran AF11.png y AD2.png grandes, lado a lado, usando la misma
 *   composición de Rango + Lorena.
 * - Al continuar, AD2s y AF11s salen por la derecha.
 * - La recompensa devuelve una ficha rosa, una verde y una amarilla de Q a F.
 * - Valentina termina su turno y Alexandra (RD) inicia la sección de trucos.
 */

[
  "IMGBE4.png",
  "AF11.png",
  "AD2.png",
  "AF17.png",
  "AD16.png"
].forEach(src => {
  const img = new Image();
  img.src = src;
});

/*
 * Las comparaciones ampliadas anteriores también deben usar las versiones
 * grandes, no las cartas terminadas en "s".
 */
if (typeof directorRangoLargeCard !== "undefined") {
  directorRangoLargeCard.src = "AF17.png";
}
if (typeof directorLorenaLargeCard !== "undefined") {
  directorLorenaLargeCard.src = "AD16.png";
}

/* =========================================================
   ESCENAS
   ========================================================= */

const thirdValentinaRestSceneIndex = scenes.length;
scenes.push({
  image: "IMGBE4.png",
  type: "practice-board",
  practiceStep: "third-valentina-rest",
  text: "He vuelto. Han sido semanas intensas, así que aprovecharé mi acción para descansar. Veo que nos estamos quedando sin fichas verdes y necesitamos recuperarlas."
});

const thirdValentinaRestExplainSceneIndex = scenes.length;
scenes.push({
  image: "IMGBE4.png",
  type: "practice-board",
  practiceStep: "third-valentina-rest-explain",
  text: "Al descansar recuperamos 3 fichas del color de nuestro rol, o 2 de otros colores. Gracias a eso, volvemos a tener 4 fichas de salud disponibles para curar a Sonic cuando llegue en el próximo turno."
});

const thirdValentinaSpiritPlanSceneIndex = scenes.length;
scenes.push({
  image: "IMGBE4.png",
  type: "practice-board",
  practiceStep: "third-valentina-spirit-plan",
  text: "Me gustaría curar a Yetti, pero Spirit es la mejor opción, porque ya hay una pareja que cumple con sus requisitos. Los caballos necesitan bastante dinero, espacio y tiempo."
});

const thirdValentinaStimulateSceneIndex = scenes.length;
scenes.push({
  image: "IMGBE4.png",
  type: "practice-board",
  practiceStep: "third-valentina-stimulate",
  text: "No conviene dejar pasar esta oportunidad, así que aprovecharé mi segunda acción para colocar una ficha de estimulación sobre Spirit."
});

const thirdValentinaFrancisAdoptionSceneIndex = scenes.length;
scenes.push({
  image: "IMGBE4.png",
  type: "practice-board",
  practiceStep: "third-valentina-francis-adoption",
  text: "Aprovechando la oportunidad, daré a Francis en adopción. Victoria es perfecta para él: cumple con todos sus requisitos de tenencia y, además, los dos comparten la personalidad floja."
});

const thirdValentinaFrancisMatchSceneIndex = scenes.length;
scenes.push({
  image: "IMGBE4.png",
  type: "practice-board",
  practiceStep: "third-valentina-francis-match",
  text: ""
});

const thirdValentinaRewardSceneIndex = scenes.length;
scenes.push({
  image: "IMGBE4.png",
  type: "practice-board",
  practiceStep: "third-valentina-reward",
  text: "Como logramos un match perfecto, recibiremos una ficha rosa, una verde y una amarilla. La ficha amarilla es la recompensa extra por haber encontrado al adoptante ideal."
});

const thirdValentinaTurnEndSceneIndex = scenes.length;
scenes.push({
  image: "IMGBE4.png",
  type: "practice-board",
  practiceStep: "third-valentina-turn-end",
  text: "Con esto termina mi turno. Aún falta resolver la carta de amenaza, pero parece que la directora quiere enseñarles algunos trucos más, así que los dejo con ella."
});

const thirdDirectorTricksSceneIndex = scenes.length;
scenes.push({
  image: "IMGBE4.png",
  type: "practice-board",
  practiceStep: "third-director-tricks",
  text: "Así es, gracias, Valentina. Ahora quiero enseñarles algunas cositas extra, así que dejaremos hasta aquí la partida normal y pasaremos a ver algunos trucos. Para eso, voy a llamar a Giovanni."
});

/* =========================================================
   CARTAS GRANDES — FRANCIS + VICTORIA
   ========================================================= */

const thirdFrancisLargeCard = document.createElement("img");
thirdFrancisLargeCard.src = "AF11.png";
thirdFrancisLargeCard.alt = "Carta de Francis ampliada";
thirdFrancisLargeCard.draggable = false;
thirdFrancisLargeCard.hidden = true;
Object.assign(thirdFrancisLargeCard.style, {
  position: "absolute",
  zIndex: "51",
  left: "31.8%",
  top: "10.5%",
  width: "15.8%",
  height: "auto",
  objectFit: "contain",
  pointerEvents: "none",
  filter: "drop-shadow(0 10px 18px rgba(0,0,0,.28))"
});
stage.appendChild(thirdFrancisLargeCard);

const thirdVictoriaLargeCard = document.createElement("img");
thirdVictoriaLargeCard.src = "AD2.png";
thirdVictoriaLargeCard.alt = "Carta de Victoria ampliada";
thirdVictoriaLargeCard.draggable = false;
thirdVictoriaLargeCard.hidden = true;
Object.assign(thirdVictoriaLargeCard.style, {
  position: "absolute",
  zIndex: "51",
  left: "52.4%",
  top: "10.5%",
  width: "15.8%",
  height: "auto",
  objectFit: "contain",
  pointerEvents: "none",
  filter: "drop-shadow(0 10px 18px rgba(0,0,0,.28))"
});
stage.appendChild(thirdVictoriaLargeCard);

function hideThirdValentinaLargeCards() {
  thirdFrancisLargeCard.hidden = true;
  thirdVictoriaLargeCard.hidden = true;
}

function showThirdValentinaLargeCards() {
  Object.assign(thirdFrancisLargeCard.style, {
    left: "31.8%",
    top: "10.5%",
    width: "15.8%",
    opacity: "1",
    transition: "none"
  });
  Object.assign(thirdVictoriaLargeCard.style, {
    left: "52.4%",
    top: "10.5%",
    width: "15.8%",
    opacity: "1",
    transition: "none"
  });
  thirdFrancisLargeCard.hidden = false;
  thirdVictoriaLargeCard.hidden = false;
}

/* =========================================================
   UTILIDADES DE F / Q
   ========================================================= */

function thirdPieceIdAtZone(zoneName) {
  const target = BOARD_MAP[zoneName];
  if (!target) return null;

  const expectedLeft = `${target.left}%`;
  const expectedTop = `${target.top}%`;

  for (const [id, piece] of boardPieces.entries()) {
    if (!piece || !piece.isConnected) continue;
    if (piece.style.left === expectedLeft && piece.style.top === expectedTop) {
      return id;
    }
  }

  return null;
}

function thirdFirstOccupiedQSlot(rowKey, count) {
  for (let i = 1; i <= count; i += 1) {
    const zoneName = `Q${rowKey}${i}`;
    const id = thirdPieceIdAtZone(zoneName);
    if (id) return { id, zoneName };
  }
  return null;
}

function thirdFirstOccupiedFSlot(rowKey, count) {
  for (let i = 1; i <= count; i += 1) {
    const zoneName = `F${rowKey}${i}`;
    const id = thirdPieceIdAtZone(zoneName);
    if (id) return { id, zoneName };
  }
  return null;
}

function thirdFirstFreeFSlot(rowKey, count) {
  for (let i = 1; i <= count; i += 1) {
    const zoneName = `F${rowKey}${i}`;
    if (!thirdPieceIdAtZone(zoneName)) return zoneName;
  }
  return `F${rowKey}${count}`;
}

function thirdReturnTokenStatic(rowKey, count, asset, idPrefix) {
  const occupied = thirdFirstOccupiedQSlot(rowKey, count);
  if (!occupied) return null;

  const destination = thirdFirstFreeFSlot(rowKey, count);
  removeBoardPiece(occupied.id);
  createImagePiece(`${idPrefix}-${destination}`, asset, destination, {
    width: "1.72%",
    zIndex: 20,
    shadow: false
  });
  return destination;
}

/* =========================================================
   ESTADOS DEL TABLERO
   ========================================================= */

function applyThirdValentinaRestRecoveredState() {
  /* Devuelve las tres primeras fichas verdes agotadas a los primeros F libres. */
  for (let i = 0; i < 3; i += 1) {
    thirdReturnTokenStatic(
      "v",
      5,
      practiceTokenAssets.health.small,
      `third-rest-green-${i + 1}`
    );
  }
}

function applyThirdValentinaSpiritStimulatedState() {
  const occupiedBlue = thirdFirstOccupiedFSlot("z", 5);
  if (occupiedBlue) removeBoardPiece(occupiedBlue.id);

  removeBoardPiece("third-Spirit-blue-24");
  createImagePiece(
    "third-Spirit-blue-24",
    practiceTokenAssets.stimulation.small,
    "24",
    {
      width: "1.78%",
      zIndex: 24,
      shadow: false,
      alt: "Nueva ficha azul de estimulación sobre Spirit"
    }
  );
}

function applyThirdValentinaFrancisQueuedState() {
  removeBoardPiece("AF11");
  createImagePiece("AF11", "AF11s.png", "D2", {
    zIndex: 17,
    alt: "Francis ubicado detrás de Victoria"
  });

  const victoria = boardPieces.get("AD2");
  if (victoria) victoria.style.zIndex = "25";
}

function applyThirdValentinaFrancisAdoptedState() {
  removeBoardPiece("AF11");
  removeBoardPiece("AD2");
}

function applyThirdValentinaRewardState() {
  thirdReturnTokenStatic(
    "f",
    5,
    practiceTokenAssets.affection.small,
    "third-reward-pink"
  );
  thirdReturnTokenStatic(
    "v",
    5,
    practiceTokenAssets.health.small,
    "third-reward-green"
  );
  thirdReturnTokenStatic(
    "a",
    6,
    practiceTokenAssets.money.small,
    "third-reward-yellow"
  );
}

function renderThirdValentinaBoard(options = {}) {
  const restRecovered = Boolean(options.restRecovered);
  const spiritStimulated = Boolean(options.spiritStimulated);
  const francisQueued = Boolean(options.francisQueued);
  const francisAdopted = Boolean(options.francisAdopted);
  const rewardsReturned = Boolean(options.rewardsReturned);

  renderDirectorRoundEndBoard({
    adoptersAdvanced: true,
    diceFace: 2,
    roundResolved: true
  });

  if (restRecovered || spiritStimulated || francisQueued || francisAdopted || rewardsReturned) {
    applyThirdValentinaRestRecoveredState();
  }

  if (spiritStimulated || francisQueued || francisAdopted || rewardsReturned) {
    applyThirdValentinaSpiritStimulatedState();
  }

  if (francisQueued && !francisAdopted) {
    applyThirdValentinaFrancisQueuedState();
  }

  if (francisAdopted || rewardsReturned) {
    applyThirdValentinaFrancisAdoptedState();
  }

  if (rewardsReturned) {
    applyThirdValentinaRewardState();
  }

  setSceneImage("IMGBE4.png", "Tablero del turno de Valentina en la tercera ronda");
}

/* =========================================================
   CONTROL DE ANIMACIONES
   ========================================================= */

let thirdValentinaAnimationRunning = false;
let thirdValentinaTimer = null;

function finishThirdValentinaAnimation(nextSceneIndex) {
  thirdValentinaTimer = null;
  thirdValentinaAnimationRunning = false;
  interactionLockedUntil = 0;
  sceneIndex = nextSceneIndex;
  renderScene();
}

/* =========================================================
   DESCANSO — 3 VERDES Q -> F
   ========================================================= */

function animateThirdValentinaRest() {
  if (thirdValentinaAnimationRunning) return;

  thirdValentinaAnimationRunning = true;
  interactionLockedUntil = Date.now() + 1800;

  const beginAnimation = () => {
    renderThirdValentinaBoard();

    for (let i = 0; i < 3; i += 1) {
      const occupied = thirdFirstOccupiedQSlot("v", 5);
      if (!occupied) break;

      const destination = thirdFirstFreeFSlot("v", 5);
      const piece = boardPieces.get(occupied.id);
      if (piece) piece.style.zIndex = "32";

      movePiece(occupied.id, destination, {
        duration: 1000,
        width: "1.72%"
      });
    }

    thirdValentinaTimer = window.setTimeout(() => {
      finishThirdValentinaAnimation(thirdValentinaRestExplainSceneIndex);
    }, 1350);
  };

  hidePracticeDialogueBeforeAnimation(beginAnimation);
}

/* =========================================================
   SEGUNDA ACCIÓN — AZUL F -> 24
   ========================================================= */

function animateThirdValentinaStimulateSpirit() {
  if (thirdValentinaAnimationRunning) return;

  thirdValentinaAnimationRunning = true;
  interactionLockedUntil = Date.now() + 1600;

  const beginAnimation = () => {
    renderThirdValentinaBoard({ restRecovered: true });

    const blue = thirdFirstOccupiedFSlot("z", 5);
    if (!blue) {
      finishThirdValentinaAnimation(thirdValentinaFrancisAdoptionSceneIndex);
      return;
    }

    const piece = boardPieces.get(blue.id);
    if (piece) piece.style.zIndex = "32";

    window.setTimeout(() => {
      movePiece(blue.id, "24", {
        duration: 1000,
        width: "1.78%"
      });
    }, 120);

    thirdValentinaTimer = window.setTimeout(() => {
      finishThirdValentinaAnimation(thirdValentinaFrancisAdoptionSceneIndex);
    }, 1330);
  };

  hidePracticeDialogueBeforeAnimation(beginAnimation);
}

/* =========================================================
   FRANCIS — A4 -> D2, DETRÁS DE VICTORIA
   ========================================================= */

function animateThirdValentinaFrancisToVictoria() {
  if (thirdValentinaAnimationRunning) return;

  thirdValentinaAnimationRunning = true;
  interactionLockedUntil = Date.now() + 1750;

  const beginAnimation = () => {
    renderThirdValentinaBoard({
      restRecovered: true,
      spiritStimulated: true
    });

    const francis = boardPieces.get("AF11");
    const victoria = boardPieces.get("AD2");
    if (francis) francis.style.zIndex = "18";
    if (victoria) victoria.style.zIndex = "26";

    window.setTimeout(() => {
      movePiece("AF11", "D2", { duration: 1100 });
    }, 120);

    thirdValentinaTimer = window.setTimeout(() => {
      finishThirdValentinaAnimation(thirdValentinaFrancisMatchSceneIndex);
    }, 1390);
  };

  hidePracticeDialogueBeforeAnimation(beginAnimation);
}

/* =========================================================
   ADOPCIÓN — AD2s + AF11s SALEN POR LA DERECHA
   ========================================================= */

function animateThirdValentinaFrancisAdoptionExit() {
  if (thirdValentinaAnimationRunning) return;

  thirdValentinaAnimationRunning = true;
  interactionLockedUntil = Date.now() + 1700;

  hideThirdValentinaLargeCards();

  const beginAnimation = () => {
    renderThirdValentinaBoard({
      restRecovered: true,
      spiritStimulated: true,
      francisQueued: true
    });

    const francis = boardPieces.get("AF11");
    const victoria = boardPieces.get("AD2");

    [francis, victoria].forEach(piece => {
      if (!piece) return;
      piece.style.transition = "left 1050ms cubic-bezier(.22,1,.36,1), opacity 1050ms ease";
      piece.style.left = "107%";
      piece.style.opacity = "0.9";
    });

    thirdValentinaTimer = window.setTimeout(() => {
      finishThirdValentinaAnimation(thirdValentinaRewardSceneIndex);
    }, 1280);
  };

  hidePracticeDialogueBeforeAnimation(beginAnimation);
}

/* =========================================================
   RECOMPENSA — ROSA + VERDE + AMARILLA Q -> F
   ========================================================= */

function animateThirdValentinaPerfectMatchReward() {
  if (thirdValentinaAnimationRunning) return;

  thirdValentinaAnimationRunning = true;
  interactionLockedUntil = Date.now() + 1750;

  const beginAnimation = () => {
    renderThirdValentinaBoard({
      restRecovered: true,
      spiritStimulated: true,
      francisAdopted: true
    });

    [
      { rowKey: "f", count: 5 },
      { rowKey: "v", count: 5 },
      { rowKey: "a", count: 6 }
    ].forEach(({ rowKey, count }) => {
      const occupied = thirdFirstOccupiedQSlot(rowKey, count);
      if (!occupied) return;

      const destination = thirdFirstFreeFSlot(rowKey, count);
      const piece = boardPieces.get(occupied.id);
      if (piece) piece.style.zIndex = "33";

      movePiece(occupied.id, destination, {
        duration: 1050,
        width: "1.72%"
      });
    });

    thirdValentinaTimer = window.setTimeout(() => {
      finishThirdValentinaAnimation(thirdValentinaTurnEndSceneIndex);
    }, 1370);
  };

  hidePracticeDialogueBeforeAnimation(beginAnimation);
}

/* =========================================================
   RENDER
   ========================================================= */

const baseRenderSceneForThirdValentina = renderScene;
renderScene = function () {
  hideThirdValentinaLargeCards();
  baseRenderSceneForThirdValentina();

  const scene = scenes[sceneIndex];
  if (!scene || scene.type !== "practice-board") return;

  if (scene.practiceStep === "third-valentina-rest") {
    renderThirdValentinaBoard();
    showSpeakerDialogue("RV.png", scene);
    stage.setAttribute(
      "aria-label",
      "Valentina vuelve en la semana 9 y usará su primera acción para descansar. Toca para recuperar tres fichas verdes desde Q."
    );
    return;
  }

  if (scene.practiceStep === "third-valentina-rest-explain") {
    renderThirdValentinaBoard({ restRecovered: true });
    showSpeakerDialogue("RV.png", scene);
    stage.setAttribute(
      "aria-label",
      "Valentina recuperó tres fichas verdes y vuelve a tener cuatro fichas de salud disponibles."
    );
    return;
  }

  if (scene.practiceStep === "third-valentina-spirit-plan") {
    renderThirdValentinaBoard({ restRecovered: true });
    showSpeakerDialogue("RV.png", scene);
    stage.setAttribute(
      "aria-label",
      "Valentina explica por qué Spirit es la mejor opción para preparar una adopción."
    );
    return;
  }

  if (scene.practiceStep === "third-valentina-stimulate") {
    renderThirdValentinaBoard({ restRecovered: true });
    showSpeakerDialogue("RV.png", scene);
    stage.setAttribute(
      "aria-label",
      "Valentina usará su segunda acción para colocar una ficha azul de estimulación sobre Spirit en 24."
    );
    return;
  }

  if (scene.practiceStep === "third-valentina-francis-adoption") {
    renderThirdValentinaBoard({
      restRecovered: true,
      spiritStimulated: true
    });
    showSpeakerDialogue("RV.png", scene);
    stage.setAttribute(
      "aria-label",
      "Francis será dado en adopción a Victoria. Toca para mover a Francis desde A4 hasta D2 detrás de Victoria."
    );
    return;
  }

  if (scene.practiceStep === "third-valentina-francis-match") {
    renderThirdValentinaBoard({
      restRecovered: true,
      spiritStimulated: true,
      francisQueued: true
    });
    dialogueText.hidden = true;
    hidePracticeSpeakerBox(true);
    showThirdValentinaLargeCards();
    stage.setAttribute(
      "aria-label",
      "Compara las cartas grandes de Francis y Victoria. Toca para completar el match perfecto y retirarlos de la fila."
    );
    return;
  }

  if (scene.practiceStep === "third-valentina-reward") {
    renderThirdValentinaBoard({
      restRecovered: true,
      spiritStimulated: true,
      francisAdopted: true
    });
    showSpeakerDialogue("RV.png", scene);
    stage.setAttribute(
      "aria-label",
      "El match perfecto entrega una ficha rosa, una verde y una amarilla. Toca para devolverlas de Q a F."
    );
    return;
  }

  if (scene.practiceStep === "third-valentina-turn-end") {
    renderThirdValentinaBoard({
      restRecovered: true,
      spiritStimulated: true,
      francisAdopted: true,
      rewardsReturned: true
    });
    showSpeakerDialogue("RV.png", scene);
    stage.setAttribute(
      "aria-label",
      "Valentina termina su turno y entrega la explicación a la directora."
    );
    return;
  }

  if (scene.practiceStep === "third-director-tricks") {
    renderThirdValentinaBoard({
      restRecovered: true,
      spiritStimulated: true,
      francisAdopted: true,
      rewardsReturned: true
    });
    showSpeakerDialogue("RD.png", scene);
    stage.setAttribute(
      "aria-label",
      "La directora detiene la partida normal para enseñar trucos adicionales y anuncia que llamará a Giovanni."
    );
  }
};

/* =========================================================
   AVANCE
   ========================================================= */

const baseAdvanceSceneForThirdValentina = advanceScene;
advanceScene = function () {
  const scene = scenes[sceneIndex];

  if (thirdValentinaAnimationRunning) return;

  if (scene?.practiceStep === "round-transition-week-nine") {
    sceneIndex = thirdValentinaRestSceneIndex;
    interactionLockedUntil = 0;
    renderScene();
    return;
  }

  if (scene?.practiceStep === "third-valentina-rest") {
    animateThirdValentinaRest();
    return;
  }

  if (scene?.practiceStep === "third-valentina-rest-explain") {
    sceneIndex = thirdValentinaSpiritPlanSceneIndex;
    interactionLockedUntil = 0;
    renderScene();
    return;
  }

  if (scene?.practiceStep === "third-valentina-spirit-plan") {
    sceneIndex = thirdValentinaStimulateSceneIndex;
    interactionLockedUntil = 0;
    renderScene();
    return;
  }

  if (scene?.practiceStep === "third-valentina-stimulate") {
    animateThirdValentinaStimulateSpirit();
    return;
  }

  if (scene?.practiceStep === "third-valentina-francis-adoption") {
    animateThirdValentinaFrancisToVictoria();
    return;
  }

  if (scene?.practiceStep === "third-valentina-francis-match") {
    animateThirdValentinaFrancisAdoptionExit();
    return;
  }

  if (scene?.practiceStep === "third-valentina-reward") {
    animateThirdValentinaPerfectMatchReward();
    return;
  }

  if (scene?.practiceStep === "third-valentina-turn-end") {
    sceneIndex = thirdDirectorTricksSceneIndex;
    interactionLockedUntil = 0;
    renderScene();
    return;
  }

  if (scene?.practiceStep === "third-director-tricks") return;

  baseAdvanceSceneForThirdValentina();
};

/* =========================================================
   RETROCESO
   ========================================================= */

const basePreviousSceneForThirdValentina = previousScene;
previousScene = function () {
  if (thirdValentinaAnimationRunning || Date.now() < interactionLockedUntil) return;

  const scene = scenes[sceneIndex];

  if (scene?.practiceStep === "third-valentina-rest") {
    sceneIndex = roundTransitionWeekNineSceneIndex;
    renderScene();
    return;
  }

  if (scene?.practiceStep === "third-valentina-rest-explain") {
    sceneIndex = thirdValentinaRestSceneIndex;
    renderScene();
    return;
  }

  if (scene?.practiceStep === "third-valentina-spirit-plan") {
    sceneIndex = thirdValentinaRestExplainSceneIndex;
    renderScene();
    return;
  }

  if (scene?.practiceStep === "third-valentina-stimulate") {
    sceneIndex = thirdValentinaSpiritPlanSceneIndex;
    renderScene();
    return;
  }

  if (scene?.practiceStep === "third-valentina-francis-adoption") {
    sceneIndex = thirdValentinaStimulateSceneIndex;
    renderScene();
    return;
  }

  if (scene?.practiceStep === "third-valentina-francis-match") {
    sceneIndex = thirdValentinaFrancisAdoptionSceneIndex;
    renderScene();
    return;
  }

  if (scene?.practiceStep === "third-valentina-reward") {
    sceneIndex = thirdValentinaFrancisMatchSceneIndex;
    renderScene();
    return;
  }

  if (scene?.practiceStep === "third-valentina-turn-end") {
    sceneIndex = thirdValentinaRewardSceneIndex;
    renderScene();
    return;
  }

  if (scene?.practiceStep === "third-director-tricks") {
    sceneIndex = thirdValentinaTurnEndSceneIndex;
    renderScene();
    return;
  }

  basePreviousSceneForThirdValentina();
};
