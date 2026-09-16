/* =========================================================
   CONTINUACIÓN DEL TURNO DE ALEXANDRA / DIRECTORA
   ========================================================= */

/*
 * Correcciones y continuación:
 * - Mientras FC1 sale de CD hacia D1 queda visible AD2s en CD.
 * - Al terminar el corrimiento de la fila D, el dado se lanza
 *   automáticamente y termina en 1.
 * - AN15 pasa de CA a A1 y AN9 queda visible en CA.
 * - El turno real de Alexandra empieza en director-work-start; desde ese
 *   diálogo turn-backgrounds.js cambia a IMGBE3.
 * - Una ficha amarilla paga FC1 y termina agotada en Qa1.
 * - Rango pasa de A2 a D3, debajo de Lorena (AD16s).
 * - La recompensa de la adopción devuelve una ficha rosa y una verde de Q a F.
 */

[
  "AD2s.png",
  "AN9s.png",
  "DD1.png",
  "lorena.png"
].forEach(src => {
  const img = new Image();
  img.src = src;
});

/* =========================================================
   ESCENAS
   ========================================================= */

const directorRescueResultSceneIndex = scenes.length;
scenes.push({
  image: "IMGBE2.png",
  type: "practice-board",
  practiceStep: "director-rescue-result",
  text: "Mmm... esto se complicó un poco. El dado cayó en 1, así que acaba de llegar un rescate de urgencia. Lo llevaremos a la recepción mientras conseguimos algo de espacio."
});

const directorWorkStartSceneIndex = scenes.length;
scenes.push({
  image: "IMGBE3.png",
  type: "practice-board",
  practiceStep: "director-work-start",
  text: "¡Manos a la obra! Voy a aprovechar este turno al máximo. Empecemos pagando la factura."
});

const directorPaidDiscountSceneIndex = scenes.length;
scenes.push({
  image: "IMGBE3.png",
  type: "practice-board",
  practiceStep: "director-paid-discount",
  text: "Usé mi habilidad gratuita para pagar la factura con un costo menor, así que solo tuvimos que gastar 1 ficha amarilla. Pero esto apenas comienza."
});

const directorAdoptionPlanSceneIndex = scenes.length;
scenes.push({
  image: "IMGBE3.png",
  type: "practice-board",
  practiceStep: "director-adoption-plan",
  text: "Esperábamos encontrar a alguien con la misma personalidad de Rango, pero necesitamos liberar esa habitación con urgencia. Confiamos en que tendrá un buen hogar con Lorena."
});

const directorAdoptionRewardSceneIndex = scenes.length;
scenes.push({
  image: "IMGBE3.png",
  type: "practice-board",
  practiceStep: "director-adoption-reward",
  text: "En el lado izquierdo de la carta de Lorena veremos la recompensa por completar la adopción. En este caso, recibiremos una ficha rosa y una verde."
});

const directorRewardDoneSceneIndex = scenes.length;
scenes.push({
  image: "IMGBE3.png",
  type: "practice-board",
  practiceStep: "director-reward-done",
  text: ""
});

/* =========================================================
   CARTA GRANDE DE LORENA
   ========================================================= */

const directorLorenaLargeCard = document.createElement("img");
directorLorenaLargeCard.src = "lorena.png";
directorLorenaLargeCard.alt = "Carta de Lorena ampliada";
directorLorenaLargeCard.draggable = false;
directorLorenaLargeCard.hidden = true;
Object.assign(directorLorenaLargeCard.style, {
  position: "absolute",
  zIndex: "48",
  left: "61.8%",
  top: "35.5%",
  width: "13.5%",
  height: "auto",
  objectFit: "contain",
  pointerEvents: "none",
  filter: "drop-shadow(0 10px 18px rgba(0,0,0,.28))"
});
stage.appendChild(directorLorenaLargeCard);

/* =========================================================
   ESTADO DEL TABLERO PARA ESTA CONTINUACIÓN
   ========================================================= */

function renderDirectorContinuationBoard(options = {}) {
  const diceFace = options.diceFace == null ? 3 : Number(options.diceFace);
  const rescuePlaced = Boolean(options.rescuePlaced);
  const invoicePaid = Boolean(options.invoicePaid);
  const rangoQueued = Boolean(options.rangoQueued);
  const adoptionComplete = Boolean(options.adoptionComplete);
  const rewardsReturned = Boolean(options.rewardsReturned);

  renderDirectorBoard({ billingAdvanced: true });

  /* Cuando FC1 deja CD, AD2 queda como la nueva carta visible del mazo. */
  createImagePiece("AD2", "AD2s.png", "CD", {
    zIndex: 14,
    alt: "Adoptante AD2 visible en CD"
  });

  /* Conservamos el resultado actual del dado según el punto del flujo. */
  removeBoardPiece("dice");
  if (diceFace >= 1 && diceFace <= 6) {
    createImagePiece("dice", `DD${diceFace}.png`, "DS", {
      width: "4.33%",
      zIndex: 22,
      shadow: false,
      alt: `Dado mostrando ${diceFace}`
    });
  }

  /* Rescate de urgencia: AN15 sale del mazo hacia A1 y AN9 queda visible. */
  if (rescuePlaced || invoicePaid || rangoQueued || adoptionComplete || rewardsReturned) {
    removeBoardPiece("AN15");
    createImagePiece("AN15", "AN15s.png", "A1", {
      zIndex: 17,
      alt: "Rescate de urgencia ubicado en A1"
    });
    createImagePiece("AN9", "AN9s.png", "CA", {
      zIndex: 14,
      alt: "Siguiente animal visible AN9"
    });
  }

  /* La factura ya fue pagada: desaparece FC1 y la ficha amarilla queda en Qa1. */
  if (invoicePaid || rangoQueued || adoptionComplete || rewardsReturned) {
    removeBoardPiece("FC1");
    removeBoardPiece("reserve-Fa6");
    createImagePiece("paid-Qa1", practiceTokenAssets.money.small, "Qa1", {
      width: "1.72%",
      zIndex: 20,
      shadow: false,
      alt: "Ficha amarilla usada para pagar la factura"
    });
  }

  /* Rango se coloca en D3 debajo de Lorena. */
  if (rangoQueued && !adoptionComplete) {
    removeBoardPiece("AF17");
    createImagePiece("AF17", "AF17s.png", "D3", {
      zIndex: 16,
      alt: "Rango debajo de Lorena para completar la adopción"
    });

    const lorena = boardPieces.get("AD16");
    if (lorena) lorena.style.zIndex = "22";
  }

  /* Al completar la adopción, Lorena y Rango ya salieron de la fila. */
  if (adoptionComplete) {
    removeBoardPiece("AF17");
    removeBoardPiece("AD16");
  }

  /* Recompensa: una rosa y una verde vuelven de Q a F. */
  if (rewardsReturned) {
    removeBoardPiece("used-Qf1");
    removeBoardPiece("threat-Qv1");

    createImagePiece("reserve-Ff4", practiceTokenAssets.affection.small, "Ff4", {
      width: "1.72%",
      zIndex: 18,
      shadow: false,
      alt: "Ficha rosa recuperada y disponible"
    });

    createImagePiece("reserve-Fv1", practiceTokenAssets.health.small, "Fv1", {
      width: "1.72%",
      zIndex: 18,
      shadow: false,
      alt: "Ficha verde recuperada y disponible"
    });
  }

  if (typeof applyPracticeTurnBackground === "function") {
    applyPracticeTurnBackground();
  }
}

/* =========================================================
   CONTROL DE ANIMACIONES
   ========================================================= */

let directorContinuationAnimationRunning = false;
let directorContinuationTimer = null;
let directorContinuationDiceInterval = null;

function clearDirectorContinuationAnimation() {
  if (directorContinuationTimer) {
    clearTimeout(directorContinuationTimer);
    directorContinuationTimer = null;
  }

  if (directorContinuationDiceInterval) {
    clearInterval(directorContinuationDiceInterval);
    directorContinuationDiceInterval = null;
  }
}

function finishDirectorContinuationAnimation(nextSceneIndex) {
  directorContinuationTimer = null;
  directorContinuationAnimationRunning = false;
  interactionLockedUntil = 0;
  sceneIndex = nextSceneIndex;
  renderScene();
}

/* =========================================================
   CORRECCIÓN DE LA FACTURA: AD2 QUEDA VISIBLE EN CD
   Y AL TERMINAR SE LANZA AUTOMÁTICAMENTE EL DADO
   ========================================================= */

animateDirectorBillingQueue = function () {
  if (directorAnimationRunning || directorContinuationAnimationRunning) return;

  directorAnimationRunning = true;
  interactionLockedUntil = Date.now() + 2400;

  const beginAnimation = () => {
    renderDirectorBoard({ billingAdvanced: false });
    if (typeof applyPracticeTurnBackground === "function") {
      applyPracticeTurnBackground();
    }

    /* AD2 está debajo de AD13 y se revela en cuanto FC1 sale de CD. */
    createImagePiece("AD2", "AD2s.png", "CD", {
      zIndex: 12,
      alt: "Adoptante AD2 debajo de la carta superior"
    });

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

    window.setTimeout(() => {
      const card = boardPieces.get("AD13");
      if (!card) return;
      card.src = "FC1.png";
      card.alt = "Factura FC1";
      card.style.transition = "transform 220ms ease-out";
      card.style.transform = "scaleX(1)";
    }, 230);

    window.setTimeout(() => {
      movePiece("AD13", "D1", { duration: 1050 });
      movePiece("AD12", "D2", { duration: 1050 });
      movePiece("AD16", "D3", { duration: 1050 });
    }, 520);

    directorAnimationTimer = window.setTimeout(() => {
      directorAnimationTimer = null;
      directorAnimationRunning = false;
      interactionLockedUntil = 0;

      renderDirectorContinuationBoard({ diceFace: 3 });

      /* Sin toque adicional: al terminar la fila, comienza el dado. */
      window.setTimeout(() => {
        animateDirectorDiceToOne();
      }, 180);
    }, 1780);
  };

  hidePracticeDialogueBeforeAnimation(beginAnimation);
};

/* =========================================================
   DADO AUTOMÁTICO — RESULTADO 1
   ========================================================= */

function animateDirectorDiceToOne() {
  if (directorContinuationAnimationRunning) return;

  directorContinuationAnimationRunning = true;
  interactionLockedUntil = Date.now() + 1900;

  renderDirectorContinuationBoard({ diceFace: 3 });

  const die = boardPieces.get("dice");
  if (!die) {
    directorContinuationAnimationRunning = false;
    interactionLockedUntil = 0;
    sceneIndex = directorRescueResultSceneIndex;
    renderScene();
    return;
  }

  die.style.zIndex = "30";
  die.style.transition = "transform 110ms ease";

  let face = 3;
  let ticks = 0;
  directorContinuationDiceInterval = window.setInterval(() => {
    ticks += 1;
    face = (face % 6) + 1;
    die.src = `DD${face}.png`;
    die.style.transform = `rotate(${ticks * 43}deg) scale(${ticks % 2 ? 1.08 : 0.94})`;

    if (ticks >= 12) {
      clearInterval(directorContinuationDiceInterval);
      directorContinuationDiceInterval = null;
      die.src = "DD1.png";
      die.style.transform = "rotate(0deg) scale(1)";
    }
  }, 95);

  directorContinuationTimer = window.setTimeout(() => {
    if (directorContinuationDiceInterval) {
      clearInterval(directorContinuationDiceInterval);
      directorContinuationDiceInterval = null;
    }

    const finalDie = boardPieces.get("dice");
    if (finalDie) {
      finalDie.src = "DD1.png";
      finalDie.style.transform = "rotate(0deg) scale(1)";
    }

    finishDirectorContinuationAnimation(directorRescueResultSceneIndex);
  }, 1450);
}

/* =========================================================
   RESCATE DE URGENCIA — AN15: CA -> A1 / AN9 VISIBLE EN CA
   ========================================================= */

function animateDirectorRescueToA1() {
  if (directorContinuationAnimationRunning) return;

  directorContinuationAnimationRunning = true;
  interactionLockedUntil = Date.now() + 1600;

  const beginAnimation = () => {
    renderDirectorContinuationBoard({ diceFace: 1 });

    createImagePiece("AN9", "AN9s.png", "CA", {
      zIndex: 13,
      alt: "Siguiente animal AN9"
    });

    const rescue = boardPieces.get("AN15");
    if (rescue) rescue.style.zIndex = "29";

    window.setTimeout(() => {
      movePiece("AN15", "A1", { duration: 1050 });
    }, 120);

    directorContinuationTimer = window.setTimeout(() => {
      finishDirectorContinuationAnimation(directorWorkStartSceneIndex);
    }, 1320);
  };

  hidePracticeDialogueBeforeAnimation(beginAnimation);
}

/* =========================================================
   PAGO DE FACTURA — Fa6 -> D1 -> Qa1
   ========================================================= */

function animateDirectorInvoicePayment() {
  if (directorContinuationAnimationRunning) return;

  directorContinuationAnimationRunning = true;
  interactionLockedUntil = Date.now() + 2600;

  const beginAnimation = () => {
    renderDirectorContinuationBoard({
      diceFace: 1,
      rescuePlaced: true
    });

    const yellow = boardPieces.get("reserve-Fa6");
    if (yellow) yellow.style.zIndex = "31";

    window.setTimeout(() => {
      movePiece("reserve-Fa6", "D1", {
        duration: 950,
        width: "1.78%"
      });
    }, 120);

    /* La factura desaparece después de que la ficha amarilla llega a D1. */
    window.setTimeout(() => {
      removeBoardPiece("FC1");
    }, 1120);

    /* Después la ficha utilizada se agota en Qa1. */
    window.setTimeout(() => {
      movePiece("reserve-Fa6", "Qa1", {
        duration: 850,
        width: "1.72%"
      });
    }, 1260);

    directorContinuationTimer = window.setTimeout(() => {
      finishDirectorContinuationAnimation(directorPaidDiscountSceneIndex);
    }, 2240);
  };

  hidePracticeDialogueBeforeAnimation(beginAnimation);
}

/* =========================================================
   RANGO: A2 -> D3, DEBAJO DE LORENA
   ========================================================= */

function animateRangoToLorena() {
  if (directorContinuationAnimationRunning) return;

  directorContinuationAnimationRunning = true;
  interactionLockedUntil = Date.now() + 1700;

  const beginAnimation = () => {
    renderDirectorContinuationBoard({
      diceFace: 1,
      rescuePlaced: true,
      invoicePaid: true
    });

    const rango = boardPieces.get("AF17");
    const lorena = boardPieces.get("AD16");
    if (rango) rango.style.zIndex = "18";
    if (lorena) lorena.style.zIndex = "24";

    window.setTimeout(() => {
      movePiece("AF17", "D3", { duration: 1100 });
    }, 120);

    directorContinuationTimer = window.setTimeout(() => {
      finishDirectorContinuationAnimation(directorAdoptionRewardSceneIndex);
    }, 1390);
  };

  hidePracticeDialogueBeforeAnimation(beginAnimation);
}

/* =========================================================
   ADOPCIÓN COMPLETADA + RECOMPENSA
   AD16 Y RANGO SALEN A LA DERECHA; Qf1 -> Ff4 Y Qv1 -> Fv1
   ========================================================= */

function animateDirectorAdoptionReward() {
  if (directorContinuationAnimationRunning) return;

  directorContinuationAnimationRunning = true;
  interactionLockedUntil = Date.now() + 2200;
  directorLorenaLargeCard.hidden = true;

  const beginAnimation = () => {
    renderDirectorContinuationBoard({
      diceFace: 1,
      rescuePlaced: true,
      invoicePaid: true,
      rangoQueued: true
    });

    const lorena = boardPieces.get("AD16");
    const rango = boardPieces.get("AF17");
    const pink = boardPieces.get("used-Qf1");
    const green = boardPieces.get("threat-Qv1");

    [lorena, rango].forEach(piece => {
      if (!piece) return;
      piece.style.transition = "left 1050ms cubic-bezier(.22,1,.36,1), opacity 1050ms ease";
      piece.style.left = "106%";
      piece.style.opacity = "0.92";
    });

    if (pink) pink.style.zIndex = "31";
    if (green) green.style.zIndex = "31";

    window.setTimeout(() => {
      movePiece("used-Qf1", "Ff4", {
        duration: 1000,
        width: "1.72%"
      });

      movePiece("threat-Qv1", "Fv1", {
        duration: 1000,
        width: "1.72%"
      });
    }, 360);

    directorContinuationTimer = window.setTimeout(() => {
      finishDirectorContinuationAnimation(directorRewardDoneSceneIndex);
    }, 1650);
  };

  hidePracticeDialogueBeforeAnimation(beginAnimation);
}

/* =========================================================
   RENDER
   ========================================================= */

const baseRenderSceneForDirectorContinuation = renderScene;
renderScene = function () {
  directorLorenaLargeCard.hidden = true;
  baseRenderSceneForDirectorContinuation();

  const scene = scenes[sceneIndex];
  if (!scene || scene.type !== "practice-board") return;

  if (scene.practiceStep === "director-billing-done") {
    renderDirectorContinuationBoard({ diceFace: 3 });
    dialogueText.hidden = true;
    hidePracticeSpeakerBox(true);
    return;
  }

  if (scene.practiceStep === "director-rescue-result") {
    renderDirectorContinuationBoard({ diceFace: 1 });
    showSpeakerDialogue("RD.png", scene);
    stage.setAttribute(
      "aria-label",
      "El dado cayó en 1. Llegó un rescate de urgencia y será llevado a A1."
    );
    return;
  }

  if (scene.practiceStep === "director-work-start") {
    renderDirectorContinuationBoard({
      diceFace: 1,
      rescuePlaced: true
    });
    showSpeakerDialogue("RD.png", scene);
    stage.setAttribute(
      "aria-label",
      "Comienza el turno de Alexandra. Toca para pagar la factura con una ficha amarilla."
    );
    return;
  }

  if (scene.practiceStep === "director-paid-discount") {
    renderDirectorContinuationBoard({
      diceFace: 1,
      rescuePlaced: true,
      invoicePaid: true
    });
    showSpeakerDialogue("RD.png", scene);
    stage.setAttribute(
      "aria-label",
      "La factura fue pagada con una sola ficha amarilla gracias a la habilidad gratuita de Alexandra."
    );
    return;
  }

  if (scene.practiceStep === "director-adoption-plan") {
    renderDirectorContinuationBoard({
      diceFace: 1,
      rescuePlaced: true,
      invoicePaid: true
    });
    showSpeakerDialogue("RD.png", scene);
    stage.setAttribute(
      "aria-label",
      "Alexandra propone que Rango sea adoptado por Lorena para liberar la habitación."
    );
    return;
  }

  if (scene.practiceStep === "director-adoption-reward") {
    renderDirectorContinuationBoard({
      diceFace: 1,
      rescuePlaced: true,
      invoicePaid: true,
      rangoQueued: true
    });
    showSpeakerDialogue("RD.png", scene);
    directorLorenaLargeCard.hidden = false;
    stage.setAttribute(
      "aria-label",
      "La carta de Lorena aparece ampliada. La recompensa de la adopción devuelve una ficha rosa y una verde."
    );
    return;
  }

  if (scene.practiceStep === "director-reward-done") {
    renderDirectorContinuationBoard({
      diceFace: 1,
      rescuePlaced: true,
      invoicePaid: true,
      adoptionComplete: true,
      rewardsReturned: true
    });
    dialogueText.hidden = true;
    hidePracticeSpeakerBox(true);
    stage.setAttribute(
      "aria-label",
      "Lorena y Rango salieron de la fila. Una ficha rosa y una verde regresaron a la zona F y quedaron disponibles."
    );
  }
};

/* =========================================================
   AVANCE
   ========================================================= */

const baseAdvanceSceneForDirectorContinuation = advanceScene;
advanceScene = function () {
  const scene = scenes[sceneIndex];

  if (directorContinuationAnimationRunning) return;

  if (scene?.practiceStep === "director-billing-done") {
    animateDirectorDiceToOne();
    return;
  }

  if (scene?.practiceStep === "director-rescue-result") {
    animateDirectorRescueToA1();
    return;
  }

  if (scene?.practiceStep === "director-work-start") {
    animateDirectorInvoicePayment();
    return;
  }

  if (scene?.practiceStep === "director-paid-discount") {
    sceneIndex = directorAdoptionPlanSceneIndex;
    interactionLockedUntil = 0;
    renderScene();
    return;
  }

  if (scene?.practiceStep === "director-adoption-plan") {
    animateRangoToLorena();
    return;
  }

  if (scene?.practiceStep === "director-adoption-reward") {
    animateDirectorAdoptionReward();
    return;
  }

  if (scene?.practiceStep === "director-reward-done") return;

  baseAdvanceSceneForDirectorContinuation();
};

/* =========================================================
   RETROCESO
   ========================================================= */

const basePreviousSceneForDirectorContinuation = previousScene;
previousScene = function () {
  if (directorContinuationAnimationRunning || Date.now() < interactionLockedUntil) return;

  const scene = scenes[sceneIndex];

  if (scene?.practiceStep === "director-rescue-result") {
    sceneIndex = directorWeekSceneIndex;
    renderScene();
    return;
  }

  if (scene?.practiceStep === "director-work-start") {
    sceneIndex = directorRescueResultSceneIndex;
    renderScene();
    return;
  }

  if (scene?.practiceStep === "director-paid-discount") {
    sceneIndex = directorWorkStartSceneIndex;
    renderScene();
    return;
  }

  if (scene?.practiceStep === "director-adoption-plan") {
    sceneIndex = directorPaidDiscountSceneIndex;
    renderScene();
    return;
  }

  if (scene?.practiceStep === "director-adoption-reward") {
    sceneIndex = directorAdoptionPlanSceneIndex;
    renderScene();
    return;
  }

  if (scene?.practiceStep === "director-reward-done") {
    sceneIndex = directorAdoptionRewardSceneIndex;
    renderScene();
    return;
  }

  basePreviousSceneForDirectorContinuation();
};

/* =========================================================
   MENÚ — LOS TURNOS APUNTAN AL MOMENTO REAL EN QUE CAMBIA EL FONDO
   ========================================================= */

if (typeof getStoryMenuSections === "function") {
  const baseGetStoryMenuSectionsForRealTurns = getStoryMenuSections;

  getStoryMenuSections = function () {
    const sections = baseGetStoryMenuSectionsForRealTurns();
    const tatianaRealStart = scenes.findIndex(
      scene => scene?.type === "practice-board" && scene.practiceStep === "tatiana-next-threat"
    );

    return sections.map(section => {
      if (section.label === "Turno de Tatiana" && tatianaRealStart >= 0) {
        return { ...section, index: tatianaRealStart };
      }

      if (section.label === "Turno de la directora") {
        return { ...section, index: directorWorkStartSceneIndex };
      }

      return section;
    });
  };
}
