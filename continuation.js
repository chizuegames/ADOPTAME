/* =========================================================
   CONTINUACIÓN DE LA PRÁCTICA — SECUENCIA CORREGIDA
   ========================================================= */

/*
 * Corrección principal de la práctica:
 * - La amenaza inicial es AS5s en CE y AS4s en CO.
 * - El resultado 4 quita una ficha de SALUD de Rango.
 * - La ficha verde perdida pasa a Qv1.
 * - Al terminar el turno, AS5 avanza a CO y AS6 queda activa en CE.
 * - CA queda resaltada hasta que el usuario toque a Yetti.
 * - En el siguiente turno se recupera salud desde Fv3 y luego estimulación
 *   desde Fz5.
 * - Al rehabilitar a Rango, las fichas agotadas buscan la primera posición Q
 *   libre de su color. Por eso, como Qv1 ya está ocupada, las verdes nuevas
 *   terminan en Qv2 y Qv3.
 */

/* =========================================================
   TEXTOS CORREGIDOS DE LAS ESCENAS EXISTENTES
   ========================================================= */

const diceResultSceneIndex = scenes.findIndex(
  scene => scene.type === "practice-board" && scene.practiceStep === "dice-result"
);

if (diceResultSceneIndex >= 0) {
  scenes[diceResultSceneIndex].text =
    "Y obtuvimos un 4. Eso significa que perderemos 1 de salud. Como Rango tiene 2 fichas verdes, retiraremos una. Por suerte la tenía, porque de lo contrario habría recibido una ficha de descuido.";
}

const afterRollSceneIndex = scenes.findIndex(
  scene => scene.type === "practice-board" && scene.practiceStep === "after-roll"
);

if (afterRollSceneIndex >= 0) {
  scenes[afterRollSceneIndex].text =
    "Con esto termina el turno de Valentina y comienza el mío. Toca al siguiente animal para ver qué necesita y decidir dónde ubicarlo.";
}

/* =========================================================
   PRELOAD DE LOS ELEMENTOS NUEVOS
   ========================================================= */

[
  "AS4s.png",
  "AS5s.png",
  "AS6s.png",
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
   OCHO FICHAS NEGRAS
   Seis disponibles en F y dos agotadas desde el inicio en Qn1 y Qn2.
   ========================================================= */

const baseRenderReserveTokensForCorrectedPractice = renderReserveTokens;
renderReserveTokens = function () {
  // En esta versión ninguna ficha negra sale de F durante la amenaza.
  baseRenderReserveTokensForCorrectedPractice(true);

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
   ESTADO CENTRAL CORREGIDO DEL TABLERO
   ========================================================= */

renderCoreBoardState = function (options = {}) {
  const adopterMoved = Boolean(options.adopterMoved);
  const showDie = Boolean(options.showDie);

  // mobile-flow.js todavía usa neglectPlaced para distinguir el estado
  // posterior al resultado del dado. Lo reinterpretamos como "salud perdida"
  // para conservar la compatibilidad con el flujo ya construido.
  const healthLost = Boolean(options.healthLost || options.neglectPlaced);
  const healthRecovered = Boolean(options.healthRecovered);
  const threatAdvanced = Boolean(options.threatAdvanced);
  const highlightThreat = options.highlightThreat !== false;

  /* Amenaza activa y descarte. */
  if (threatAdvanced) {
    createImagePiece("AS6", "AS6s.png", "CE", {
      zIndex: 15,
      alt: "Amenaza AS6 activa"
    });

    if (highlightThreat) createHighlight("AS6-highlight", "CE");

    createImagePiece("AS5", "AS5s.png", "CO", {
      zIndex: 14,
      alt: "Amenaza AS5 descartada"
    });
  } else {
    createImagePiece("AS5", "AS5s.png", "CE", {
      zIndex: 15,
      alt: "Amenaza AS5 activa"
    });

    if (highlightThreat) createHighlight("AS5-highlight", "CE");

    createImagePiece("AS4", "AS4s.png", "CO", {
      zIndex: 14,
      alt: "Amenaza AS4 descartada"
    });
  }

  /* Mazo de animales. */
  createImagePiece("AN2", "AN2s.png", "CA", {
    zIndex: 15,
    alt: "Animal visible AN2"
  });

  /* Rango en A4. */
  createImagePiece("AN17", "AN17s.png", "A4", {
    zIndex: 15,
    alt: "Rango"
  });

  createImagePiece("Rango-42", practiceTokenAssets.affection.small, "42", {
    width: "1.78%",
    zIndex: 21,
    shadow: false
  });

  // Antes de la amenaza están 43 y 44. Después del resultado, 43 desaparece.
  // Cuando Giovanni la recupera, 43 vuelve sin retirar Qv1.
  if (!healthLost || healthRecovered) {
    createImagePiece("Rango-43", practiceTokenAssets.health.small, "43", {
      width: "1.78%",
      zIndex: 21,
      shadow: false
    });
  }

  createImagePiece("Rango-44", practiceTokenAssets.health.small, "44", {
    width: "1.78%",
    zIndex: 21,
    shadow: false
  });

  /* Adoptantes. */
  if (adopterMoved) {
    createImagePiece("AD12", "AD12s.png", "CD", {
      zIndex: 14,
      alt: "Adoptante visible AD12"
    });
    createImagePiece("AD16", "AD16s.png", "D1", {
      zIndex: 16,
      alt: "Lorena"
    });
  } else {
    createImagePiece("AD16", "AD16s.png", "CD", {
      zIndex: 16,
      alt: "Lorena"
    });
  }

  /* Reservas F y fichas negras agotadas iniciales. */
  renderReserveTokens();

  /* La ficha verde perdida por la amenaza queda agotada en Qv1. */
  if (healthLost) {
    createImagePiece("threat-Qv1", practiceTokenAssets.health.small, "Qv1", {
      width: "1.72%",
      zIndex: 19,
      shadow: false
    });
  }

  if (showDie) {
    createImagePiece("dice", "DD4.png", "DS", {
      width: "4.33%",
      zIndex: 22,
      shadow: false,
      alt: "Dado mostrando 4"
    });
  }
};

/* =========================================================
   RESULTADO DEL DADO: 43 → Qv1
   Mantenemos el nombre antiguo de la función para que mobile-flow.js
   continúe llamándola sin necesidad de modificar más archivos.
   ========================================================= */

animateNeglectFromFn6ToRango = function () {
  renderCoreBoardState({
    adopterMoved: true,
    showDie: true,
    healthLost: false
  });

  const token = boardPieces.get("Rango-43");
  if (!token) return;

  token.style.zIndex = "27";

  boardLater(420, () => {
    movePiece("Rango-43", "Qv1", {
      width: "1.72%",
      duration: 1100,
      transform: "translate(-50%, -50%)"
    });
  });

  interactionLockedUntil = Date.now() + 1650;
};

/* =========================================================
   ESCENAS NUEVAS
   ========================================================= */

const nextAnimalWaitSceneIndex = scenes.length;
scenes.push({
  image: "IMGBE1.png",
  type: "practice-board",
  practiceStep: "next-animal-wait",
  text: ""
});

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
  text: "Listo, Yetti ya tiene dónde quedarse. Pero no nos olvidemos de Rango. Usaré mi primera acción para reponer la ficha de salud que perdió."
});

const healthRecoveredWaitSceneIndex = scenes.length;
scenes.push({
  image: "IMGBE1.png",
  type: "practice-board",
  practiceStep: "health-recovered-wait",
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

/* =========================================================
   INTERACCIÓN CON CA + BRILLO
   ========================================================= */

const continuationStyle = document.createElement("style");
continuationStyle.textContent = `
  @keyframes adoptame-ca-pulse {
    0%, 100% {
      box-shadow: 0 0 8px 3px rgba(255, 209, 42, .55), inset 0 0 0 3px rgba(255,255,255,.78);
      border-color: rgba(255, 153, 31, .82);
      transform: scale(1);
    }
    50% {
      box-shadow: 0 0 24px 10px rgba(255, 209, 42, .95), inset 0 0 0 4px rgba(255,255,255,.96);
      border-color: rgba(255, 122, 24, 1);
      transform: scale(1.035);
    }
  }
`;
document.head.appendChild(continuationStyle);

const yettiCAHighlight = document.createElement("div");
yettiCAHighlight.hidden = true;
yettiCAHighlight.setAttribute("aria-hidden", "true");
Object.assign(yettiCAHighlight.style, {
  position: "absolute",
  zIndex: "37",
  left: `${BOARD_MAP.CA.left - 0.35}%`,
  top: `${BOARD_MAP.CA.top - 0.55}%`,
  width: `${BOARD_MAP.CA.width + 0.70}%`,
  aspectRatio: "206 / 306",
  border: "4px solid rgba(255, 153, 31, .9)",
  borderRadius: "11px",
  boxSizing: "border-box",
  background: "rgba(255, 209, 42, .06)",
  animation: "adoptame-ca-pulse 1.05s ease-in-out infinite",
  pointerEvents: "none",
  transformOrigin: "center center"
});
stage.appendChild(yettiCAHighlight);

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

function hideContinuationExtraUI() {
  yettiCAHotspot.hidden = true;
  yettiCAHighlight.hidden = true;
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

function renderHealthLostBoard(options = {}) {
  if (typeof clearBoardPieces === "function") clearBoardPieces();
  boardPracticeLayer.style.display = "block";

  renderCoreBoardState({
    adopterMoved: true,
    showDie: true,
    healthLost: true,
    healthRecovered: Boolean(options.healthRecovered),
    threatAdvanced: Boolean(options.threatAdvanced),
    highlightThreat: options.highlightThreat
  });
}

function putYettiInA3AndNextAnimalInCA() {
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
  const healthRecovered = Boolean(options.healthRecovered);
  const stimulationPlaced = Boolean(options.stimulationPlaced);
  const exhausted = Boolean(options.exhausted);
  const rangoFlipped = Boolean(options.rangoFlipped);

  renderHealthLostBoard({
    healthRecovered,
    threatAdvanced: true,
    highlightThreat: false
  });

  putYettiInA3AndNextAnimalInCA();

  // Fv3 fue usada para restaurar la salud de Rango.
  if (healthRecovered || stimulationPlaced || exhausted) {
    removeBoardPiece("reserve-Fv3");
  }

  // Fz5 fue usada para cubrir estimulación.
  if (stimulationPlaced || exhausted) {
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
    removeBoardPiece("Rango-42");
    removeBoardPiece("Rango-43");
    removeBoardPiece("Rango-44");

    // Qv1 ya está ocupada por la ficha perdida en la amenaza.
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
    createImagePiece("used-Qv2", practiceTokenAssets.health.small, "Qv2", {
      width: "1.72%",
      shadow: false,
      zIndex: 19
    });
    createImagePiece("used-Qv3", practiceTokenAssets.health.small, "Qv3", {
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
   CAMBIO DE TARJETA DE AMENAZA: AS5 → CO / AS6 → CE
   ========================================================= */

function animateThreatAdvanceToAS6() {
  if (continuationAnimating) return;

  continuationAnimating = true;
  interactionLockedUntil = Date.now() + 1500;

  const beginAnimation = () => {
    renderHealthLostBoard({ threatAdvanced: false, highlightThreat: false });

    // AS6 queda debajo en CE mientras AS5 comienza a salir.
    createImagePiece("AS6", "AS6s.png", "CE", {
      zIndex: 14,
      alt: "Nueva amenaza AS6"
    });

    const as5 = boardPieces.get("AS5");
    if (as5) as5.style.zIndex = "22";

    window.setTimeout(() => {
      movePiece("AS5", "CO", { duration: 1050 });
    }, 120);

    continuationTimer = window.setTimeout(() => {
      continuationTimer = null;
      continuationAnimating = false;
      interactionLockedUntil = 0;
      sceneIndex = nextAnimalWaitSceneIndex;
      renderScene();
    }, 1300);
  };

  if (typeof hidePracticeDialogueBeforeAnimation === "function") {
    hidePracticeDialogueBeforeAnimation(beginAnimation);
  } else {
    beginAnimation();
  }
}

/* =========================================================
   YETTI
   ========================================================= */

function openYettiDetail() {
  if (continuationAnimating) return;
  yettiCAHighlight.hidden = true;
  yettiCAHotspot.hidden = true;
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
    yettiCAHighlight.hidden = true;

    renderHealthLostBoard({
      threatAdvanced: true,
      highlightThreat: false
    });

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
   PRIMERA ACCIÓN: Fv3 → 43
   ========================================================= */

function animateHealthRecoveryToRango() {
  if (continuationAnimating) return;

  continuationAnimating = true;
  interactionLockedUntil = Date.now() + 1450;

  const beginAnimation = () => {
    renderYettiTurnBoard({ healthRecovered: false });

    const green = boardPieces.get("reserve-Fv3");
    if (green) green.style.zIndex = "27";

    window.setTimeout(() => {
      movePiece("reserve-Fv3", "43", {
        duration: 950,
        width: "1.78%"
      });
    }, 120);

    continuationTimer = window.setTimeout(() => {
      continuationTimer = null;
      continuationAnimating = false;
      interactionLockedUntil = 0;
      sceneIndex = healthRecoveredWaitSceneIndex;
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
   SEGUNDA ACCIÓN: Fz5 → 41
   ========================================================= */

function animateStimulationToRango() {
  if (continuationAnimating) return;

  continuationAnimating = true;
  interactionLockedUntil = Date.now() + 1450;

  const beginAnimation = () => {
    renderYettiTurnBoard({ healthRecovered: true });

    const blue = boardPieces.get("reserve-Fz5");
    if (blue) blue.style.zIndex = "27";

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
   PRIMER ESPACIO Q LIBRE
   ========================================================= */

function isBoardZoneOccupied(zoneName, ignoredIds = []) {
  const target = BOARD_MAP[zoneName];
  if (!target) return false;

  const expectedLeft = `${target.left}%`;
  const expectedTop = `${target.top}%`;

  for (const [id, piece] of boardPieces.entries()) {
    if (ignoredIds.includes(id)) continue;
    if (!piece || !piece.isConnected) continue;

    if (piece.style.left === expectedLeft && piece.style.top === expectedTop) {
      return true;
    }
  }

  return false;
}

function nextAvailableQSlot(rowKey, count = 5) {
  for (let i = 1; i <= count; i += 1) {
    const zoneName = `Q${rowKey}${i}`;
    if (!isBoardZoneOccupied(zoneName)) return zoneName;
  }

  return `Q${rowKey}${count}`;
}

/* =========================================================
   REHABILITACIÓN: FICHAS → PRIMER Q LIBRE + AN17s → AF17s
   ========================================================= */

function animateRangoRehabilitation() {
  if (continuationAnimating) return;

  continuationAnimating = true;
  interactionLockedUntil = Date.now() + 2400;

  const beginAnimation = () => {
    renderYettiTurnBoard({
      healthRecovered: true,
      stimulationPlaced: true
    });

    ["Rango-41", "Rango-42", "Rango-43", "Rango-44"].forEach(id => {
      const piece = boardPieces.get(id);
      if (piece) piece.style.zIndex = "28";
    });

    window.setTimeout(() => {
      movePiece("Rango-41", nextAvailableQSlot("z"), {
        duration: 900,
        width: "1.72%"
      });
    }, 100);

    window.setTimeout(() => {
      movePiece("Rango-42", nextAvailableQSlot("f"), {
        duration: 900,
        width: "1.72%"
      });
    }, 180);

    // Qv1 ya está ocupada por la ficha que se perdió durante la amenaza.
    // Por eso 43 irá a Qv2 y, al quedar Qv2 ocupada, 44 irá a Qv3.
    window.setTimeout(() => {
      movePiece("Rango-43", nextAvailableQSlot("v"), {
        duration: 900,
        width: "1.72%"
      });
    }, 260);

    window.setTimeout(() => {
      movePiece("Rango-44", nextAvailableQSlot("v"), {
        duration: 900,
        width: "1.72%"
      });
    }, 360);

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
    }, 1370);

    continuationTimer = window.setTimeout(() => {
      continuationTimer = null;
      continuationAnimating = false;
      interactionLockedUntil = 0;
      sceneIndex = rangoRehabilitatedSceneIndex;
      renderScene();
    }, 2070);
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
   RENDER DE LA SECUENCIA CORREGIDA
   ========================================================= */

const baseRenderSceneForCorrectedContinuation = renderScene;
renderScene = function () {
  hideContinuationExtraUI();
  continuationAnimating = false;

  baseRenderSceneForCorrectedContinuation();

  const scene = scenes[sceneIndex];
  if (!scene) return;

  /* Paso 5: diálogo de cambio de turno antes de mover la amenaza. */
  if (scene.practiceStep === "after-roll") {
    renderHealthLostBoard({
      threatAdvanced: false,
      highlightThreat: true
    });
    showContinuationDialogue(scene);
    stage.setAttribute(
      "aria-label",
      "Terminó el turno de Valentina. Rango perdió una ficha de salud y AS5 sigue activa hasta que el usuario continúe."
    );
    return;
  }

  /* Después de mover AS5 a CO, solo CA puede continuar. */
  if (scene.practiceStep === "next-animal-wait") {
    renderHealthLostBoard({
      threatAdvanced: true,
      highlightThreat: false
    });
    showContinuationDialogue(scene);
    yettiCAHotspot.hidden = false;
    yettiCAHighlight.hidden = false;
    stage.setAttribute(
      "aria-label",
      "AS6 está activa y AS5 descartada. Toca la carta de animal resaltada en CA para conocer a Yetti."
    );
    return;
  }

  if (scene.practiceStep === "yetti-detail") {
    renderHealthLostBoard({
      threatAdvanced: true,
      highlightThreat: false
    });
    yettiLargeCard.hidden = false;
    showContinuationDialogue(scene);
    stage.setAttribute(
      "aria-label",
      "Carta grande de Yetti. Yetti necesita afecto y debe ir a la sala rosa de descanso. Toca para continuar."
    );
    return;
  }

  if (scene.practiceStep === "yetti-placed") {
    renderYettiTurnBoard({ healthRecovered: false });
    showContinuationDialogue(scene);
    stage.setAttribute(
      "aria-label",
      "Yetti está en A3. Toca para recuperar la ficha verde de salud de Rango desde Fv3 hasta 43."
    );
    return;
  }

  if (scene.practiceStep === "health-recovered-wait") {
    renderYettiTurnBoard({ healthRecovered: true });
    showContinuationDialogue(scene);
    stage.setAttribute(
      "aria-label",
      "La salud de Rango fue recuperada. Toca para conocer la segunda acción del turno."
    );
    return;
  }

  if (scene.practiceStep === "stimulation-dialogue") {
    renderYettiTurnBoard({ healthRecovered: true });
    showContinuationDialogue(scene);
    stage.setAttribute(
      "aria-label",
      "A Rango solo le falta estimulación. Toca para mover Fz5 hasta la posición 41."
    );
    return;
  }

  if (scene.practiceStep === "stimulation-done-wait") {
    renderYettiTurnBoard({
      healthRecovered: true,
      stimulationPlaced: true
    });
    showContinuationDialogue(scene);
    stage.setAttribute(
      "aria-label",
      "Rango ya tiene cubiertas todas sus necesidades. Toca para continuar."
    );
    return;
  }

  if (scene.practiceStep === "rehabilitation-dialogue") {
    renderYettiTurnBoard({
      healthRecovered: true,
      stimulationPlaced: true
    });
    showContinuationDialogue(scene);
    stage.setAttribute(
      "aria-label",
      "Toca para mover las fichas de Rango a las primeras posiciones libres de Q y dar vuelta su carta."
    );
    return;
  }

  if (scene.practiceStep === "rango-rehabilitated") {
    renderYettiTurnBoard({
      healthRecovered: true,
      stimulationPlaced: true,
      exhausted: true,
      rangoFlipped: true
    });
    showContinuationDialogue(scene);
    stage.setAttribute(
      "aria-label",
      "Rango está rehabilitado. La ficha verde perdida antes permanece en Qv1 y las dos verdes usadas ahora están en Qv2 y Qv3."
    );
  }
};

/* =========================================================
   CONTROL DE AVANCE
   ========================================================= */

const baseAdvanceSceneForCorrectedContinuation = advanceScene;
advanceScene = function () {
  const scene = scenes[sceneIndex];

  if (continuationAnimating) return;

  /* El diálogo del paso 5 se cierra y la amenaza avanza. */
  if (scene?.practiceStep === "after-roll") {
    animateThreatAdvanceToAS6();
    return;
  }

  /* Una vez resaltada CA, tocar cualquier otro sitio NO avanza. */
  if (scene?.practiceStep === "next-animal-wait") return;

  /* Cierra la carta grande y mueve Yetti a A3. */
  if (scene?.practiceStep === "yetti-detail") {
    animateYettiToA3();
    return;
  }

  /* Primera acción: recuperar salud desde Fv3 hasta 43. */
  if (scene?.practiceStep === "yetti-placed") {
    animateHealthRecoveryToRango();
    return;
  }

  /* Después de recuperar salud, el siguiente toque muestra la segunda acción. */
  if (scene?.practiceStep === "health-recovered-wait") {
    sceneIndex = stimulationDialogueSceneIndex;
    renderScene();
    return;
  }

  /* Segunda acción: estimulación desde Fz5 hasta 41. */
  if (scene?.practiceStep === "stimulation-dialogue") {
    animateStimulationToRango();
    return;
  }

  /* Después de completar estimulación, explicar la rehabilitación. */
  if (scene?.practiceStep === "stimulation-done-wait") {
    sceneIndex = rehabilitationDialogueSceneIndex;
    renderScene();
    return;
  }

  /* Agotar fichas en las primeras Q libres y voltear a AF17s. */
  if (scene?.practiceStep === "rehabilitation-dialogue") {
    animateRangoRehabilitation();
    return;
  }

  baseAdvanceSceneForCorrectedContinuation();
};
