/* =========================================================
   PULIDO GLOBAL DE MOVIMIENTO — CARTAS Y FICHAS
   ========================================================= */

/*
 * Regla visual del tutorial:
 * cualquier pieza que cambie de zona debe verse desplazándose físicamente.
 *
 * El motor original cambiaba left/top en el mismo ciclo en que algunas piezas
 * acababan de ser creadas. En móviles el navegador podía agrupar ambos estados
 * y mostrar el resultado como un salto. Esta versión fuerza el estado inicial
 * antes de modificar la posición, de modo que la transición siempre tenga un
 * punto de origen visible.
 */

const adoptameMotionEasing = "cubic-bezier(.22,.78,.22,1)";

movePiece = function (id, destination, options = {}) {
  const piece = boardPieces.get(id);
  const target = zone(destination);
  if (!piece || !target) return;

  const duration = Number(options.duration) || 1050;

  /*
   * Primero fijamos el estado actual. getBoundingClientRect() obliga al
   * navegador a reconocer la posición de origen incluso si la pieza acaba
   * de aparecer en este mismo frame.
   */
  piece.style.transition = "none";
  piece.style.willChange = "left, top, width, transform";
  void piece.getBoundingClientRect();

  piece.style.transition = [
    `left ${duration}ms ${adoptameMotionEasing}`,
    `top ${duration}ms ${adoptameMotionEasing}`,
    `width ${duration}ms ${adoptameMotionEasing}`,
    `transform ${duration}ms ${adoptameMotionEasing}`
  ].join(", ");

  placeElementAtZone(piece, destination, options);

  window.setTimeout(() => {
    if (!piece.isConnected) return;
    piece.style.willChange = "auto";
  }, duration + 80);
};

/* =========================================================
   AYUDANTES PARA MOVIMIENTOS AGRUPADOS F <-> Q
   ========================================================= */

function motionOccupiedZones(prefix, rowKey, count) {
  const found = [];
  for (let i = 1; i <= count; i += 1) {
    const zoneName = `${prefix}${rowKey}${i}`;
    const id = thirdPieceIdAtZone(zoneName);
    if (id) found.push({ id, zoneName });
  }
  return found;
}

function motionFreeZones(prefix, rowKey, count) {
  const found = [];
  for (let i = 1; i <= count; i += 1) {
    const zoneName = `${prefix}${rowKey}${i}`;
    if (!thirdPieceIdAtZone(zoneName)) found.push(zoneName);
  }
  return found;
}

function motionStaggerMoves(moves, options = {}) {
  const delay = Number(options.delay) || 120;
  const stagger = Number(options.stagger) || 120;
  const duration = Number(options.duration) || 1000;
  const width = options.width;

  moves.forEach((move, index) => {
    const piece = boardPieces.get(move.id);
    if (piece) piece.style.zIndex = String((options.zIndex || 36) - index);

    window.setTimeout(() => {
      movePiece(move.id, move.destination, {
        duration,
        ...(width ? { width } : {})
      });
    }, delay + (index * stagger));
  });

  return delay + Math.max(0, moves.length - 1) * stagger + duration;
}

/* =========================================================
   VALENTINA — DESCANSO: 3 VERDES Q -> F
   ========================================================= */

animateThirdValentinaRest = function () {
  if (thirdValentinaAnimationRunning) return;

  thirdValentinaAnimationRunning = true;
  interactionLockedUntil = Date.now() + 2200;

  const beginAnimation = () => {
    renderThirdValentinaBoard();

    const sources = motionOccupiedZones("Q", "v", 5).slice(0, 3);
    const destinations = motionFreeZones("F", "v", 5).slice(0, sources.length);
    const moves = sources.map((source, index) => ({
      id: source.id,
      destination: destinations[index]
    })).filter(move => move.destination);

    const endAt = motionStaggerMoves(moves, {
      delay: 130,
      stagger: 150,
      duration: 1050,
      width: "1.72%",
      zIndex: 38
    });

    thirdValentinaTimer = window.setTimeout(() => {
      finishThirdValentinaAnimation(thirdValentinaRestExplainSceneIndex);
    }, endAt + 180);
  };

  hidePracticeDialogueBeforeAnimation(beginAnimation);
};

/* =========================================================
   VALENTINA — RECOMPENSA PERFECTA: ROSA/VERDE/AMARILLA Q -> F
   ========================================================= */

animateThirdValentinaPerfectMatchReward = function () {
  if (thirdValentinaAnimationRunning) return;

  thirdValentinaAnimationRunning = true;
  interactionLockedUntil = Date.now() + 2200;

  const beginAnimation = () => {
    renderThirdValentinaBoard({
      restRecovered: true,
      spiritStimulated: true,
      francisAdopted: true
    });

    const specs = [
      ["f", 5],
      ["v", 5],
      ["a", 6]
    ];

    const moves = [];
    specs.forEach(([rowKey, count]) => {
      const source = motionOccupiedZones("Q", rowKey, count)[0];
      const destination = motionFreeZones("F", rowKey, count)[0];
      if (source && destination) moves.push({ id: source.id, destination });
    });

    const endAt = motionStaggerMoves(moves, {
      delay: 130,
      stagger: 130,
      duration: 1050,
      width: "1.72%",
      zIndex: 38
    });

    thirdValentinaTimer = window.setTimeout(() => {
      finishThirdValentinaAnimation(thirdValentinaTurnEndSceneIndex);
    }, endAt + 180);
  };

  hidePracticeDialogueBeforeAnimation(beginAnimation);
};

/* =========================================================
   GIOVANNI — DESCANSO: 3 AZULES Q -> F
   ========================================================= */

animateExtraGiovanniBlueRest = function () {
  if (extraTricksAnimationRunning) return;

  extraTricksAnimationRunning = true;
  interactionLockedUntil = Date.now() + 2300;

  const beginAnimation = () => {
    renderExtraTricksBoard(2);

    const sources = motionOccupiedZones("Q", "z", 5).slice(0, 3);
    const destinations = motionFreeZones("F", "z", 5).slice(0, sources.length);
    const moves = sources.map((source, index) => ({
      id: source.id,
      destination: destinations[index]
    })).filter(move => move.destination);

    const endAt = motionStaggerMoves(moves, {
      delay: 130,
      stagger: 150,
      duration: 1050,
      width: "1.72%",
      zIndex: 38
    });

    extraTricksTimer = window.setTimeout(() => {
      extraFinishAnimation(extraTatianaMoveSceneIndex);
    }, endAt + 190);
  };

  hidePracticeDialogueBeforeAnimation(beginAnimation);
};

/* =========================================================
   TATIANA — 3 ROSAS F -> SPIRIT -> Q + AZUL -> Q
   ========================================================= */

animateExtraTatianaThreePinkAndRecoverSpirit = function () {
  if (extraTricksAnimationRunning) return;

  extraTricksAnimationRunning = true;
  interactionLockedUntil = Date.now() + 4700;

  const beginAnimation = () => {
    renderExtraTricksBoard(4);

    const pinkSources = motionOccupiedZones("F", "f", 5).slice(0, 3);
    const pinkToSpirit = pinkSources.map((source, index) => ({
      id: source.id,
      destination: String(31 + index)
    }));

    motionStaggerMoves(pinkToSpirit, {
      delay: 130,
      stagger: 140,
      duration: 980,
      width: "1.78%",
      zIndex: 38
    });

    /* Primero se ve claramente cómo llegan las tres rosas a Spirit. */
    window.setTimeout(() => {
      const pinkQDestinations = motionFreeZones("Q", "f", 5).slice(0, pinkSources.length);
      const pinkToQ = pinkSources.map((source, index) => ({
        id: source.id,
        destination: pinkQDestinations[index]
      })).filter(move => move.destination);

      motionStaggerMoves(pinkToQ, {
        delay: 0,
        stagger: 115,
        duration: 950,
        width: "1.72%",
        zIndex: 38
      });

      const blue = boardPieces.get("extra-Spirit-blue-34");
      const blueDestination = motionFreeZones("Q", "z", 5)[0];
      if (blue && blueDestination) {
        blue.style.zIndex = "39";
        window.setTimeout(() => {
          movePiece("extra-Spirit-blue-34", blueDestination, {
            duration: 950,
            width: "1.72%"
          });
        }, 360);
      }
    }, 1510);

    /* El volteo ocurre solo cuando ya se vio salir físicamente cada ficha. */
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
    }, 3000);

    extraTricksTimer = window.setTimeout(() => {
      extraFinishAnimation(extraTatianaSpiritReadySceneIndex);
    }, 3670);
  };

  hidePracticeDialogueBeforeAnimation(beginAnimation);
};

/* =========================================================
   DIRECTORA — OFICINA: 2 AMARILLAS F -> Q + AN10 -> A5
   ========================================================= */

animateExtraUseOffice = function () {
  if (extraTricksAnimationRunning) return;

  extraTricksAnimationRunning = true;
  interactionLockedUntil = Date.now() + 2400;

  const beginAnimation = () => {
    renderExtraTricksBoard(8);

    const yellowSources = motionOccupiedZones("F", "a", 6).slice(0, 2);
    const yellowDestinations = motionFreeZones("Q", "a", 6).slice(0, yellowSources.length);
    const yellowMoves = yellowSources.map((source, index) => ({
      id: source.id,
      destination: yellowDestinations[index]
    })).filter(move => move.destination);

    const endAt = motionStaggerMoves(yellowMoves, {
      delay: 120,
      stagger: 150,
      duration: 1000,
      width: "1.72%",
      zIndex: 38
    });

    const receptionAnimal = boardPieces.get("AN10");
    if (receptionAnimal) receptionAnimal.style.zIndex = "37";

    window.setTimeout(() => {
      movePiece("AN10", "A5", { duration: 1100 });
    }, 320);

    extraTricksTimer = window.setTimeout(() => {
      extraFinishAnimation(extraDirectorOfficeExplainSceneIndex);
    }, Math.max(endAt, 1420) + 180);
  };

  hidePracticeDialogueBeforeAnimation(beginAnimation);
};
