/* =========================================================
   TRUCOS FINALES — GIOVANNI, TATIANA Y DIRECTORA
   ========================================================= */

/*
 * Continúa después de que la directora llama a Giovanni.
 *
 * Reglas importantes de esta etapa:
 * - La ficha azul que Valentina coloca sobre Spirit sale de Fz2.
 * - Todo movimiento de cartas o fichas entre zonas se anima con movePiece.
 * - Giovanni reorganiza la fila de adoptantes y descansa.
 * - Tatiana rehabilita a Spirit y completa su adopción con Mario y Lina.
 * - La directora enseña Invitar, la recepción, la oficina y las condiciones
 *   de derrota / fichas de prevención.
 */

[
  "IMGBE1.png",
  "IMGBE2.png",
  "IMGBE3.png",
  "AD17s.png",
  "AD8s.png",
  "AD4s.png",
  "AF15s.png",
  "AN1s.png",
  "AN10s.png",
  "AN13s.png"
].forEach(src => {
  const img = new Image();
  img.src = src;
});

/* =========================================================
   CORRECCIÓN: VALENTINA DEBE USAR Fz2 -> 24
   ========================================================= */

applyThirdValentinaSpiritStimulatedState = function () {
  /* Quitamos exactamente la ficha que ocupa Fz2. */
  const tokenAtFz2 = thirdPieceIdAtZone("Fz2");
  if (tokenAtFz2) removeBoardPiece(tokenAtFz2);

  removeBoardPiece("third-Spirit-blue-24");
  createImagePiece(
    "third-Spirit-blue-24",
    practiceTokenAssets.stimulation.small,
    "24",
    {
      width: "1.78%",
      zIndex: 24,
      shadow: false,
      alt: "Ficha azul de estimulación sobre Spirit"
    }
  );
};

animateThirdValentinaStimulateSpirit = function () {
  if (thirdValentinaAnimationRunning) return;

  thirdValentinaAnimationRunning = true;
  interactionLockedUntil = Date.now() + 1700;

  const beginAnimation = () => {
    renderThirdValentinaBoard({ restRecovered: true });

    let blueId = thirdPieceIdAtZone("Fz2");

    /* Fz2 debe ser siempre la ficha que se arrastra hacia Spirit. */
    if (!blueId) {
      createImagePiece(
        "reserve-Fz2",
        practiceTokenAssets.stimulation.small,
        "Fz2",
        {
          width: "1.72%",
          zIndex: 18,
          shadow: false,
          alt: "Ficha azul Fz2"
        }
      );
      blueId = "reserve-Fz2";
    }

    const blue = boardPieces.get(blueId);
    if (blue) blue.style.zIndex = "32";

    window.setTimeout(() => {
      movePiece(blueId, "24", {
        duration: 1000,
        width: "1.78%"
      });
    }, 120);

    thirdValentinaTimer = window.setTimeout(() => {
      finishThirdValentinaAnimation(thirdValentinaFrancisAdoptionSceneIndex);
    }, 1330);
  };

  hidePracticeDialogueBeforeAnimation(beginAnimation);
};

/* =========================================================
   ESCENAS
   ========================================================= */

const extraGiovanniIntroSceneIndex = scenes.length;
scenes.push({
  image: "IMGBE1.png",
  type: "practice-board",
  practiceStep: "extra-giovanni-intro",
  text: "Veo que me llamaron... Mmm, creo que ya sé lo que la directora quiere mostrarles. Pero para eso, vamos a complicar un poquito la situación."
});

const extraGiovanniReorderSceneIndex = scenes.length;
scenes.push({
  image: "IMGBE1.png",
  type: "practice-board",
  practiceStep: "extra-giovanni-reorder",
  text: "Ya llenamos la fila de adoptantes y dejamos a Mario y Lina a punto de irse. Para evitarlo, usaré mi habilidad para reacomodarlos y así ganar un poco más de tiempo."
});

const extraGiovanniRestSceneIndex = scenes.length;
scenes.push({
  image: "IMGBE1.png",
  type: "practice-board",
  practiceStep: "extra-giovanni-rest",
  text: "Listo, ya vimos cómo funciona mi habilidad gratuita. Ahora, como nos estamos quedando sin fichas de estimulación, aprovecharé para descansar y recuperar algunas. Después, le daré paso a Tatiana."
});

const extraTatianaMoveSceneIndex = scenes.length;
scenes.push({
  image: "IMGBE2.png",
  type: "practice-board",
  practiceStep: "extra-tatiana-move",
  text: "Ahora me toca mostrarles cómo colocar 3 fichas del mismo color con una sola acción. Primero, usaré mi habilidad para mover a Spirit a la sala rosa."
});

const extraTatianaPinkSceneIndex = scenes.length;
scenes.push({
  image: "IMGBE2.png",
  type: "practice-board",
  practiceStep: "extra-tatiana-pink",
  text: "Como Spirit está en la sala rosada y estamos en mi turno, puedo colocar una ficha rosa adicional. Así, con una sola acción, pondremos un total de 3."
});

const extraTatianaSpiritReadySceneIndex = scenes.length;
scenes.push({
  image: "IMGBE2.png",
  type: "practice-board",
  practiceStep: "extra-tatiana-spirit-ready",
  text: "¡Listo! Nuestro amigo equino ya está listo para ser adoptado, así que puede irse con Mario y Lina. Y con eso, mi trabajo aquí está hecho."
});

const extraDirectorReturnSceneIndex = scenes.length;
scenes.push({
  image: "IMGBE3.png",
  type: "practice-board",
  practiceStep: "extra-director-return",
  text: "¡Ya volví! Solo me quedan dos cositas más por enseñarles. La primera es mi habilidad gratuita, que se llama Invitar."
});

const extraDirectorInviteSceneIndex = scenes.length;
scenes.push({
  image: "IMGBE3.png",
  type: "practice-board",
  practiceStep: "extra-director-invite",
  text: "Esta habilidad nos permite hacer entrar a un nuevo adoptante. Puede ser muy útil para acelerar una adopción o incluso para evitar que un adoptante termine convertido en una factura."
});

const extraDirectorFillRoomsSceneIndex = scenes.length;
scenes.push({
  image: "IMGBE3.png",
  type: "practice-board",
  practiceStep: "extra-director-fill-rooms",
  text: "También quiero enseñarles qué podemos hacer cuando todas las habitaciones están llenas. Para verlo, vamos a ocuparlas todas."
});

const extraDirectorReceptionSceneIndex = scenes.length;
scenes.push({
  image: "IMGBE3.png",
  type: "practice-board",
  practiceStep: "extra-director-reception",
  text: "Una aclaración importante: la recepción solo puede tener 2 residentes. Si ya está llena, no podrá entrar ningún otro."
});

const extraDirectorOfficeSceneIndex = scenes.length;
scenes.push({
  image: "IMGBE3.png",
  type: "practice-board",
  practiceStep: "extra-director-office",
  text: "Si nos quedamos sin espacio, podemos usar la oficina como una habitación adicional. Solo tendremos que pagar 2 fichas amarillas y llevar allí a uno de nuestros amigos."
});

const extraDirectorOfficeExplainSceneIndex = scenes.length;
scenes.push({
  image: "IMGBE3.png",
  type: "practice-board",
  practiceStep: "extra-director-office-explain",
  text: "Tengan en cuenta que tendremos que pagar este costo cada vez que llevemos un nuevo animal a la oficina. Y si se libera alguna habitación de abajo, el animalito bajará automáticamente."
});

const extraDirectorCatastrophesSceneIndex = scenes.length;
scenes.push({
  image: "IMGBE3.png",
  type: "practice-board",
  practiceStep: "extra-director-catastrophes",
  text: "Creo que con esto ya terminamos. Antes de cerrar, recuerden que perderemos si acumulamos 3 catástrofes, como la muerte de un animal o una factura vencida. También perderemos si nos quedamos sin fichas negras disponibles."
});

const extraDirectorPreventionSceneIndex = scenes.length;
scenes.push({
  image: "IMGBE3.png",
  type: "practice-board",
  practiceStep: "extra-director-prevention",
  text: "Y si se preguntan por las fichas blancas, son fichas de prevención. Mientras un animalito tenga una sobre su carta, estará protegido de cualquier efecto negativo."
});

const extraDirectorPreventionUseSceneIndex = scenes.length;
scenes.push({
  image: "IMGBE3.png",
  type: "practice-board",
  practiceStep: "extra-director-prevention-use",
  text: "La ficha se agotará en cuanto bloquee uno de esos efectos. Solo tenemos 4 disponibles y colocarlas no consume ninguna acción."
});

const extraTutorialEndSceneIndex = scenes.length;
scenes.push({
  image: "IMGBE3.png",
  type: "practice-board",
  practiceStep: "extra-tutorial-end",
  text: "¡Y con esto terminamos nuestra fase de instrucción! Ahora ya estás preparad@ para enfrentarte a una partida real."
});

/* =========================================================
   UTILIDADES DE ESTADO
   ========================================================= */

function extraFirstFreeQSlot(rowKey, count) {
  for (let i = 1; i <= count; i += 1) {
    const zoneName = `Q${rowKey}${i}`;
    if (!thirdPieceIdAtZone(zoneName)) return zoneName;
  }
  return `Q${rowKey}${count}`;
}

function extraFirstFreeFSlot(rowKey, count) {
  for (let i = 1; i <= count; i += 1) {
    const zoneName = `F${rowKey}${i}`;
    if (!thirdPieceIdAtZone(zoneName)) return zoneName;
  }
  return `F${rowKey}${count}`;
}

function extraMoveQToFStatic(rowKey, count, asset, idPrefix) {
  const occupied = thirdFirstOccupiedQSlot(rowKey, count);
  if (!occupied) return null;

  const destination = extraFirstFreeFSlot(rowKey, count);
  removeBoardPiece(occupied.id);
  const oldDestinationId = thirdPieceIdAtZone(destination);
  if (oldDestinationId) removeBoardPiece(oldDestinationId);

  createImagePiece(`${idPrefix}-${destination}`, asset, destination, {
    width: "1.72%",
    zIndex: 19,
    shadow: false
  });

  return destination;
}

function extraMoveFToQStatic(rowKey, count, asset, idPrefix) {
  const occupied = thirdFirstOccupiedFSlot(rowKey, count);
  if (!occupied) return null;

  const destination = extraFirstFreeQSlot(rowKey, count);
  removeBoardPiece(occupied.id);

  createImagePiece(`${idPrefix}-${destination}`, asset, destination, {
    width: "1.72%",
    zIndex: 20,
    shadow: false
  });

  return destination;
}

function extraApplyAdopterRowState(phase) {
  ["AD12", "AD1", "AD7", "AD17", "AD8", "AD4"].forEach(removeBoardPiece);

  if (phase <= 0) {
    createImagePiece("AD12", "AD12s.png", "D3", { zIndex: 17, alt: "Mario y Lina" });
    createImagePiece("AD1", "AD1s.png", "D1", { zIndex: 17, alt: "Adoptante AD1" });
    createImagePiece("AD7", "AD7s.png", "CD", { zIndex: 14, alt: "Adoptante AD7" });
    return;
  }

  if (phase === 1) {
    createImagePiece("AD12", "AD12s.png", "D4", { zIndex: 17, alt: "Mario y Lina en D4" });
    createImagePiece("AD1", "AD1s.png", "D3", { zIndex: 17, alt: "Adoptante AD1 en D3" });
    createImagePiece("AD7", "AD7s.png", "D2", { zIndex: 17, alt: "Adoptante AD7 en D2" });
    createImagePiece("AD17", "AD17s.png", "D1", { zIndex: 17, alt: "Adoptante AD17 en D1" });
    createImagePiece("AD8", "AD8s.png", "CD", { zIndex: 14, alt: "Adoptante AD8 visible" });
    return;
  }

  /* Desde la habilidad de Giovanni en adelante, AD12 queda en D1. */
  createImagePiece("AD17", "AD17s.png", "D4", { zIndex: 17, alt: "Adoptante AD17 en D4" });
  createImagePiece("AD1", "AD1s.png", "D3", { zIndex: 17, alt: "Adoptante AD1 en D3" });
  createImagePiece("AD7", "AD7s.png", "D2", { zIndex: 17, alt: "Adoptante AD7 en D2" });
  createImagePiece("AD8", "AD8s.png", "CD", { zIndex: 14, alt: "Adoptante AD8 visible" });

  /* Spirit y Mario/Lina se retiran en la fase 6. */
  if (phase < 6) {
    createImagePiece("AD12", "AD12s.png", "D1", { zIndex: 17, alt: "Mario y Lina en D1" });
  }

  /* La directora usa Invitar a partir de la fase 7. */
  if (phase >= 7) {
    createImagePiece("AD4", "AD4s.png", "D1", { zIndex: 17, alt: "Nuevo adoptante AD4 en D1" });
  }
}

function extraApplyGiovanniBlueRestState() {
  for (let i = 0; i < 3; i += 1) {
    extraMoveQToFStatic(
      "z",
      5,
      practiceTokenAssets.stimulation.small,
      `extra-blue-rest-${i + 1}`
    );
  }
}

function extraApplyTatianaSwapState(recovered) {
  removeBoardPiece("AN15");
  removeBoardPiece("AF15");
  removeBoardPiece("AN2");
  removeBoardPiece("third-Spirit-blue-24");
  removeBoardPiece("extra-Spirit-blue-34");

  createImagePiece("AN2", "AN2s.png", "A2", {
    zIndex: 17,
    alt: "Yetti en A2"
  });

  if (recovered) {
    createImagePiece("AF15", "AF15s.png", "A3", {
      zIndex: 17,
      alt: "Spirit recuperado"
    });
    return;
  }

  createImagePiece("AN15", "AN15s.png", "A3", {
    zIndex: 17,
    alt: "Spirit en A3"
  });

  createImagePiece("extra-Spirit-blue-34", practiceTokenAssets.stimulation.small, "34", {
    width: "1.78%",
    zIndex: 24,
    shadow: false,
    alt: "Ficha azul sobre Spirit"
  });
}

function extraApplySpiritRecoveredTokenState() {
  /* Tres fichas rosas de F pasan a Q. */
  for (let i = 0; i < 3; i += 1) {
    extraMoveFToQStatic(
      "f",
      5,
      practiceTokenAssets.affection.small,
      `extra-spirit-pink-${i + 1}`
    );
  }

  /* La ficha azul que acompañaba a Spirit también se agota en Q. */
  removeBoardPiece("extra-Spirit-blue-34");
  removeBoardPiece("third-Spirit-blue-24");
  const blueDestination = extraFirstFreeQSlot("z", 5);
  createImagePiece("extra-Spirit-blue-Q", practiceTokenAssets.stimulation.small, blueDestination, {
    width: "1.72%",
    zIndex: 20,
    shadow: false,
    alt: "Ficha azul de Spirit agotada"
  });
}

function extraApplySpiritAdoptedState() {
  removeBoardPiece("AN15");
  removeBoardPiece("AF15");
}

function extraApplyRoomsFilledState(officeUsed) {
  ["AN9", "AN1", "AN13", "AN10"].forEach(removeBoardPiece);

  createImagePiece("AN13", "AN13s.png", "A1", {
    zIndex: 17,
    alt: "Animal AN13 en A1"
  });
  createImagePiece("AN1", "AN1s.png", "A3", {
    zIndex: 17,
    alt: "Animal AN1 en A3"
  });
  createImagePiece("AN9", "AN9s.png", "A4", {
    zIndex: 17,
    alt: "Animal AN9 en A4"
  });
  createImagePiece("AN10", "AN10s.png", officeUsed ? "A5" : "Z1", {
    zIndex: 17,
    alt: officeUsed ? "Animal AN10 en la oficina" : "Animal AN10 en recepción"
  });
}

function extraApplyOfficePaymentState() {
  for (let i = 0; i < 2; i += 1) {
    extraMoveFToQStatic(
      "a",
      6,
      practiceTokenAssets.money.small,
      `extra-office-yellow-${i + 1}`
    );
  }
}

function renderExtraTricksBoard(phase) {
  renderThirdValentinaBoard({
    restRecovered: true,
    spiritStimulated: true,
    francisAdopted: true,
    rewardsReturned: true
  });

  extraApplyAdopterRowState(phase);

  if (phase >= 3) {
    extraApplyGiovanniBlueRestState();
  }

  if (phase >= 4 && phase < 6) {
    extraApplyTatianaSwapState(phase >= 5);
  }

  if (phase >= 5) {
    extraApplySpiritRecoveredTokenState();
  }

  if (phase >= 6) {
    extraApplySpiritAdoptedState();
  }

  if (phase >= 8) {
    extraApplyRoomsFilledState(phase >= 9);
  }

  if (phase >= 9) {
    extraApplyOfficePaymentState();
  }
}

/* =========================================================
   CONTROL DE ANIMACIONES
   ========================================================= */

let extraTricksAnimationRunning = false;
let extraTricksTimer = null;

function extraFinishAnimation(nextSceneIndex) {
  if (extraTricksTimer) {
    clearTimeout(extraTricksTimer);
    extraTricksTimer = null;
  }
  extraTricksAnimationRunning = false;
  interactionLockedUntil = 0;
  sceneIndex = nextSceneIndex;
  renderScene();
}

/* =========================================================
   GIOVANNI — LLENAR FILA DE ADOPTANTES
   D3 -> D4 / D1 -> D3 / CD -> D2 / AD17 -> D1 / AD8 EN CD
   ========================================================= */

function animateExtraGiovanniFillAdopters() {
  if (extraTricksAnimationRunning) return;
  extraTricksAnimationRunning = true;
  interactionLockedUntil = Date.now() + 1800;

  const beginAnimation = () => {
    renderExtraTricksBoard(0);

    createImagePiece("AD8", "AD8s.png", "CD", {
      zIndex: 10,
      alt: "Adoptante AD8 debajo del mazo"
    });
    createImagePiece("AD17", "AD17s.png", "CD", {
      zIndex: 13,
      alt: "Nuevo adoptante AD17"
    });

    const ids = ["AD12", "AD1", "AD7", "AD17"];
    ids.forEach((id, index) => {
      const piece = boardPieces.get(id);
      if (piece) piece.style.zIndex = String(31 - index);
    });

    window.setTimeout(() => {
      movePiece("AD12", "D4", { duration: 1050 });
      movePiece("AD1", "D3", { duration: 1050 });
      movePiece("AD7", "D2", { duration: 1050 });
      movePiece("AD17", "D1", { duration: 1050 });
    }, 120);

    extraTricksTimer = window.setTimeout(() => {
      extraFinishAnimation(extraGiovanniReorderSceneIndex);
    }, 1380);
  };

  hidePracticeDialogueBeforeAnimation(beginAnimation);
}

/* =========================================================
   GIOVANNI — INTERCAMBIO D4 <-> D1
   ========================================================= */

function animateExtraGiovanniSwapAdopters() {
  if (extraTricksAnimationRunning) return;
  extraTricksAnimationRunning = true;
  interactionLockedUntil = Date.now() + 1700;

  const beginAnimation = () => {
    renderExtraTricksBoard(1);

    const marioLina = boardPieces.get("AD12");
    const ad17 = boardPieces.get("AD17");
    if (marioLina) marioLina.style.zIndex = "31";
    if (ad17) ad17.style.zIndex = "30";

    window.setTimeout(() => {
      movePiece("AD12", "D1", { duration: 1100 });
      movePiece("AD17", "D4", { duration: 1100 });
    }, 120);

    extraTricksTimer = window.setTimeout(() => {
      extraFinishAnimation(extraGiovanniRestSceneIndex);
    }, 1410);
  };

  hidePracticeDialogueBeforeAnimation(beginAnimation);
}

/* =========================================================
   GIOVANNI — DESCANSO: 3 AZULES Q -> F
   ========================================================= */

function animateExtraGiovanniBlueRest() {
  if (extraTricksAnimationRunning) return;
  extraTricksAnimationRunning = true;
  interactionLockedUntil = Date.now() + 1900;

  const beginAnimation = () => {
    renderExtraTricksBoard(2);

    for (let i = 0; i < 3; i += 1) {
      const occupied = thirdFirstOccupiedQSlot("z", 5);
      if (!occupied) continue;
      const destination = extraFirstFreeFSlot("z", 5);
      const piece = boardPieces.get(occupied.id);
      if (piece) piece.style.zIndex = String(33 - i);

      /* movePiece actualiza la zona de inmediato y anima visualmente el arrastre. */
      movePiece(occupied.id, destination, {
        duration: 1050,
        width: "1.72%"
      });
    }

    extraTricksTimer = window.setTimeout(() => {
      extraFinishAnimation(extraTatianaMoveSceneIndex);
    }, 1530);
  };

  hidePracticeDialogueBeforeAnimation(beginAnimation);
}

/* =========================================================
   TATIANA — SPIRIT A2 -> A3 + 24 -> 34 / YETTI A3 -> A2
   ========================================================= */

function animateExtraTatianaRoomSwap() {
  if (extraTricksAnimationRunning) return;
  extraTricksAnimationRunning = true;
  interactionLockedUntil = Date.now() + 1800;

  const beginAnimation = () => {
    renderExtraTricksBoard(3);

    const spirit = boardPieces.get("AN15");
    const yetti = boardPieces.get("AN2");
    const blue = boardPieces.get("third-Spirit-blue-24");
    if (spirit) spirit.style.zIndex = "31";
    if (yetti) yetti.style.zIndex = "30";
    if (blue) blue.style.zIndex = "33";

    window.setTimeout(() => {
      movePiece("AN15", "A3", { duration: 1100 });
      movePiece("AN2", "A2", { duration: 1100 });
      movePiece("third-Spirit-blue-24", "34", {
        duration: 1100,
        width: "1.78%"
      });
    }, 120);

    extraTricksTimer = window.setTimeout(() => {
      extraFinishAnimation(extraTatianaPinkSceneIndex);
    }, 1420);
  };

  hidePracticeDialogueBeforeAnimation(beginAnimation);
}

/* =========================================================
   TATIANA — 3 ROSAS F -> 31/32/33, LUEGO 31/32/33/34 -> Q
   Y AN15s SE VOLTEA A AF15s
   ========================================================= */

function animateExtraTatianaThreePinkAndRecoverSpirit() {
  if (extraTricksAnimationRunning) return;
  extraTricksAnimationRunning = true;
  interactionLockedUntil = Date.now() + 4100;

  const beginAnimation = () => {
    renderExtraTricksBoard(4);

    const pinkSources = [];
    for (let i = 0; i < 3; i += 1) {
      const occupied = thirdFirstOccupiedFSlot("f", 5);
      if (!occupied) break;
      pinkSources.push(occupied.id);
      /* Se mueve provisionalmente su posición para que la siguiente búsqueda use otra ficha. */
      movePiece(occupied.id, `${31 + i}`, {
        duration: 1050,
        width: "1.78%"
      });
    }

    pinkSources.forEach((id, index) => {
      const piece = boardPieces.get(id);
      if (piece) piece.style.zIndex = String(33 - index);
    });

    /* Después de mostrarlas sobre Spirit, las cuatro fichas viajan a Q. */
    window.setTimeout(() => {
      pinkSources.forEach(id => {
        const destination = extraFirstFreeQSlot("f", 5);
        movePiece(id, destination, {
          duration: 950,
          width: "1.72%"
        });
      });

      const blueDestination = extraFirstFreeQSlot("z", 5);
      const blue = boardPieces.get("extra-Spirit-blue-34");
      if (blue) {
        blue.style.zIndex = "34";
        window.setTimeout(() => {
          movePiece("extra-Spirit-blue-34", blueDestination, {
            duration: 950,
            width: "1.72%"
          });
        }, 240);
      }
    }, 1270);

    /* Al agotarse las fichas, Spirit se voltea y revela AF15s. */
    window.setTimeout(() => {
      const spirit = boardPieces.get("AN15");
      if (!spirit) return;

      spirit.style.zIndex = "31";
      spirit.style.transformOrigin = "center center";
      spirit.style.transition = "transform 260ms ease-in, opacity 260ms ease-in";
      spirit.style.transform = "perspective(700px) rotateY(90deg)";
      spirit.style.opacity = "0.5";

      window.setTimeout(() => {
        spirit.src = "AF15s.png";
        spirit.alt = "Spirit recuperado";
        spirit.style.transition = "transform 300ms ease-out, opacity 300ms ease-out";
        spirit.style.transform = "perspective(700px) rotateY(0deg)";
        spirit.style.opacity = "1";
      }, 270);
    }, 2470);

    extraTricksTimer = window.setTimeout(() => {
      extraFinishAnimation(extraTatianaSpiritReadySceneIndex);
    }, 3260);
  };

  hidePracticeDialogueBeforeAnimation(beginAnimation);
}

/* =========================================================
   SPIRIT — A3 -> D1, LUEGO SPIRIT + MARIO/LINA SALEN
   ========================================================= */

function animateExtraSpiritAdoption() {
  if (extraTricksAnimationRunning) return;
  extraTricksAnimationRunning = true;
  interactionLockedUntil = Date.now() + 3000;

  const beginAnimation = () => {
    renderExtraTricksBoard(5);

    const spirit = boardPieces.get("AF15");
    const marioLina = boardPieces.get("AD12");
    if (spirit) spirit.style.zIndex = "18";
    if (marioLina) marioLina.style.zIndex = "28";

    window.setTimeout(() => {
      movePiece("AF15", "D1", { duration: 1050 });
    }, 120);

    window.setTimeout(() => {
      ["AF15", "AD12"].forEach(id => {
        const piece = boardPieces.get(id);
        if (!piece) return;
        piece.style.transition = "left 1050ms cubic-bezier(.22,1,.36,1), opacity 1050ms ease";
        piece.style.left = "107%";
        piece.style.opacity = "0.9";
      });
    }, 1260);

    extraTricksTimer = window.setTimeout(() => {
      extraFinishAnimation(extraDirectorReturnSceneIndex);
    }, 2430);
  };

  hidePracticeDialogueBeforeAnimation(beginAnimation);
}

/* =========================================================
   DIRECTORA — INVITAR: AD4 SALE DE CD -> D1
   ========================================================= */

function animateExtraDirectorInvite() {
  if (extraTricksAnimationRunning) return;
  extraTricksAnimationRunning = true;
  interactionLockedUntil = Date.now() + 1700;

  const beginAnimation = () => {
    renderExtraTricksBoard(6);

    createImagePiece("AD4", "AD4s.png", "CD", {
      zIndex: 29,
      alt: "Nuevo adoptante AD4"
    });

    window.setTimeout(() => {
      movePiece("AD4", "D1", { duration: 1050 });
    }, 120);

    extraTricksTimer = window.setTimeout(() => {
      extraFinishAnimation(extraDirectorFillRoomsSceneIndex);
    }, 1370);
  };

  hidePracticeDialogueBeforeAnimation(beginAnimation);
}

/* =========================================================
   DIRECTORA — LLENAR HABITACIONES DESDE CA
   AN13 -> A1 / AN1 -> A3 / AN9 -> A4 / AN10 -> Z1
   ========================================================= */

function animateExtraFillAllRooms() {
  if (extraTricksAnimationRunning) return;
  extraTricksAnimationRunning = true;
  interactionLockedUntil = Date.now() + 2100;

  const beginAnimation = () => {
    renderExtraTricksBoard(7);

    createImagePiece("AN1", "AN1s.png", "CA", {
      zIndex: 27,
      alt: "Animal AN1"
    });
    createImagePiece("AN13", "AN13s.png", "CA", {
      zIndex: 26,
      alt: "Animal AN13"
    });
    createImagePiece("AN10", "AN10s.png", "CA", {
      zIndex: 25,
      alt: "Animal AN10"
    });

    const current = boardPieces.get("AN9");
    if (current) current.style.zIndex = "30";

    const moves = [
      ["AN9", "A4"],
      ["AN1", "A3"],
      ["AN13", "A1"],
      ["AN10", "Z1"]
    ];

    moves.forEach(([id, destination], index) => {
      window.setTimeout(() => {
        movePiece(id, destination, { duration: 1100 });
      }, 120 + (index * 90));
    });

    extraTricksTimer = window.setTimeout(() => {
      extraFinishAnimation(extraDirectorReceptionSceneIndex);
    }, 1640);
  };

  hidePracticeDialogueBeforeAnimation(beginAnimation);
}

/* =========================================================
   DIRECTORA — OFICINA: 2 AMARILLAS F -> Q + AN10 Z1 -> A5
   ========================================================= */

function animateExtraUseOffice() {
  if (extraTricksAnimationRunning) return;
  extraTricksAnimationRunning = true;
  interactionLockedUntil = Date.now() + 2000;

  const beginAnimation = () => {
    renderExtraTricksBoard(8);

    const yellowMoves = [];
    for (let i = 0; i < 2; i += 1) {
      const occupied = thirdFirstOccupiedFSlot("a", 6);
      if (!occupied) break;
      const destination = extraFirstFreeQSlot("a", 6);
      yellowMoves.push([occupied.id, destination]);
      /* Actualizamos la posición inmediatamente para reservar destino/origen. */
      movePiece(occupied.id, destination, {
        duration: 1050,
        width: "1.72%"
      });
    }

    yellowMoves.forEach(([id], index) => {
      const piece = boardPieces.get(id);
      if (piece) piece.style.zIndex = String(33 - index);
    });

    const receptionAnimal = boardPieces.get("AN10");
    if (receptionAnimal) receptionAnimal.style.zIndex = "31";
    movePiece("AN10", "A5", { duration: 1100 });

    extraTricksTimer = window.setTimeout(() => {
      extraFinishAnimation(extraDirectorOfficeExplainSceneIndex);
    }, 1450);
  };

  hidePracticeDialogueBeforeAnimation(beginAnimation);
}

/* =========================================================
   RENDER
   ========================================================= */

const baseRenderSceneForExtraTricks = renderScene;
renderScene = function () {
  baseRenderSceneForExtraTricks();

  const scene = scenes[sceneIndex];
  if (!scene || scene.type !== "practice-board") return;

  const step = scene.practiceStep;

  if (step === "extra-giovanni-intro") {
    renderExtraTricksBoard(0);
    setSceneImage("IMGBE1.png", "Tablero durante la demostración de Giovanni");
    showSpeakerDialogue("RE.png", scene);
    return;
  }

  if (step === "extra-giovanni-reorder") {
    renderExtraTricksBoard(1);
    setSceneImage("IMGBE1.png", "Tablero durante la demostración de Giovanni");
    showSpeakerDialogue("RE.png", scene);
    return;
  }

  if (step === "extra-giovanni-rest") {
    renderExtraTricksBoard(2);
    setSceneImage("IMGBE1.png", "Tablero durante la demostración de Giovanni");
    showSpeakerDialogue("RE.png", scene);
    return;
  }

  if (step === "extra-tatiana-move") {
    renderExtraTricksBoard(3);
    setSceneImage("IMGBE2.png", "Tablero durante la demostración de Tatiana");
    showSpeakerDialogue("RC.png", scene);
    return;
  }

  if (step === "extra-tatiana-pink") {
    renderExtraTricksBoard(4);
    setSceneImage("IMGBE2.png", "Tablero durante la demostración de Tatiana");
    showSpeakerDialogue("RC.png", scene);
    return;
  }

  if (step === "extra-tatiana-spirit-ready") {
    renderExtraTricksBoard(5);
    setSceneImage("IMGBE2.png", "Tablero durante la demostración de Tatiana");
    showSpeakerDialogue("RC.png", scene);
    return;
  }

  if (step === "extra-director-return" || step === "extra-director-invite") {
    renderExtraTricksBoard(6);
    setSceneImage("IMGBE3.png", "Tablero durante los trucos de la directora");
    showSpeakerDialogue("RD.png", scene);
    return;
  }

  if (step === "extra-director-fill-rooms") {
    renderExtraTricksBoard(7);
    setSceneImage("IMGBE3.png", "Tablero durante los trucos de la directora");
    showSpeakerDialogue("RD.png", scene);
    return;
  }

  if (step === "extra-director-reception" || step === "extra-director-office") {
    renderExtraTricksBoard(8);
    setSceneImage("IMGBE3.png", "Tablero con las habitaciones ocupadas");
    showSpeakerDialogue("RD.png", scene);
    return;
  }

  if (
    step === "extra-director-office-explain" ||
    step === "extra-director-catastrophes" ||
    step === "extra-director-prevention" ||
    step === "extra-director-prevention-use" ||
    step === "extra-tutorial-end"
  ) {
    renderExtraTricksBoard(9);
    setSceneImage("IMGBE3.png", "Tablero al final de la fase de instrucción");
    showSpeakerDialogue("RD.png", scene);
  }
};

/* =========================================================
   AVANCE
   ========================================================= */

const baseAdvanceSceneForExtraTricks = advanceScene;
advanceScene = function () {
  const scene = scenes[sceneIndex];
  if (extraTricksAnimationRunning) return;

  if (scene?.practiceStep === "third-director-tricks") {
    sceneIndex = extraGiovanniIntroSceneIndex;
    interactionLockedUntil = 0;
    renderScene();
    return;
  }

  if (scene?.practiceStep === "extra-giovanni-intro") {
    animateExtraGiovanniFillAdopters();
    return;
  }

  if (scene?.practiceStep === "extra-giovanni-reorder") {
    animateExtraGiovanniSwapAdopters();
    return;
  }

  if (scene?.practiceStep === "extra-giovanni-rest") {
    animateExtraGiovanniBlueRest();
    return;
  }

  if (scene?.practiceStep === "extra-tatiana-move") {
    animateExtraTatianaRoomSwap();
    return;
  }

  if (scene?.practiceStep === "extra-tatiana-pink") {
    animateExtraTatianaThreePinkAndRecoverSpirit();
    return;
  }

  if (scene?.practiceStep === "extra-tatiana-spirit-ready") {
    animateExtraSpiritAdoption();
    return;
  }

  if (scene?.practiceStep === "extra-director-return") {
    sceneIndex = extraDirectorInviteSceneIndex;
    interactionLockedUntil = 0;
    renderScene();
    return;
  }

  if (scene?.practiceStep === "extra-director-invite") {
    animateExtraDirectorInvite();
    return;
  }

  if (scene?.practiceStep === "extra-director-fill-rooms") {
    animateExtraFillAllRooms();
    return;
  }

  if (scene?.practiceStep === "extra-director-reception") {
    sceneIndex = extraDirectorOfficeSceneIndex;
    interactionLockedUntil = 0;
    renderScene();
    return;
  }

  if (scene?.practiceStep === "extra-director-office") {
    animateExtraUseOffice();
    return;
  }

  if (scene?.practiceStep === "extra-director-office-explain") {
    sceneIndex = extraDirectorCatastrophesSceneIndex;
    interactionLockedUntil = 0;
    renderScene();
    return;
  }

  if (scene?.practiceStep === "extra-director-catastrophes") {
    sceneIndex = extraDirectorPreventionSceneIndex;
    interactionLockedUntil = 0;
    renderScene();
    return;
  }

  if (scene?.practiceStep === "extra-director-prevention") {
    sceneIndex = extraDirectorPreventionUseSceneIndex;
    interactionLockedUntil = 0;
    renderScene();
    return;
  }

  if (scene?.practiceStep === "extra-director-prevention-use") {
    sceneIndex = extraTutorialEndSceneIndex;
    interactionLockedUntil = 0;
    renderScene();
    return;
  }

  if (scene?.practiceStep === "extra-tutorial-end") return;

  baseAdvanceSceneForExtraTricks();
};

/* =========================================================
   RETROCESO
   ========================================================= */

const basePreviousSceneForExtraTricks = previousScene;
previousScene = function () {
  if (extraTricksAnimationRunning || Date.now() < interactionLockedUntil) return;

  const scene = scenes[sceneIndex];
  const backMap = new Map([
    ["extra-giovanni-intro", thirdDirectorTricksSceneIndex],
    ["extra-giovanni-reorder", extraGiovanniIntroSceneIndex],
    ["extra-giovanni-rest", extraGiovanniReorderSceneIndex],
    ["extra-tatiana-move", extraGiovanniRestSceneIndex],
    ["extra-tatiana-pink", extraTatianaMoveSceneIndex],
    ["extra-tatiana-spirit-ready", extraTatianaPinkSceneIndex],
    ["extra-director-return", extraTatianaSpiritReadySceneIndex],
    ["extra-director-invite", extraDirectorReturnSceneIndex],
    ["extra-director-fill-rooms", extraDirectorInviteSceneIndex],
    ["extra-director-reception", extraDirectorFillRoomsSceneIndex],
    ["extra-director-office", extraDirectorReceptionSceneIndex],
    ["extra-director-office-explain", extraDirectorOfficeSceneIndex],
    ["extra-director-catastrophes", extraDirectorOfficeExplainSceneIndex],
    ["extra-director-prevention", extraDirectorCatastrophesSceneIndex],
    ["extra-director-prevention-use", extraDirectorPreventionSceneIndex],
    ["extra-tutorial-end", extraDirectorPreventionUseSceneIndex]
  ]);

  const target = backMap.get(scene?.practiceStep);
  if (Number.isInteger(target)) {
    sceneIndex = target;
    renderScene();
    return;
  }

  basePreviousSceneForExtraTricks();
};
