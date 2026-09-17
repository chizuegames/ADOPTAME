/* =========================================================
   TRUCOS — CONSISTENCIA DE FONDO Y MOVIMIENTO
   ========================================================= */

/*
 * Reglas visuales definitivas:
 * 1. Durante una animación nunca se cambia temporalmente al fondo IMGBE4.
 *    Giovanni conserva IMGBE1, Tatiana IMGBE2 y la directora IMGBE3.
 * 2. Toda carta o ficha que cambia de zona debe recorrer físicamente el
 *    trayecto; no puede desaparecer del origen y reaparecer en el destino.
 * 3. Cuando se agotan fichas, se usan primero las posiciones de número más
 *    alto y se dejan para el final las posiciones de número más bajo.
 */

/* =========================================================
   ZONA LÓGICA DE CADA PIEZA
   ========================================================= */

const baseCreateImagePieceForMotionConsistency = createImagePiece;
createImagePiece = function (id, src, zoneName, options = {}) {
  const piece = baseCreateImagePieceForMotionConsistency(id, src, zoneName, options);
  if (piece) piece.dataset.boardZone = zoneName;
  return piece;
};

/*
 * Mientras una pieza está viajando, su zona lógica ya es el destino. Esto
 * evita que las búsquedas de huecos vuelvan a seleccionar la misma ficha
 * antes de que termine visualmente el recorrido.
 */
thirdPieceIdAtZone = function (zoneName) {
  const target = BOARD_MAP[zoneName];
  if (!target) return null;

  for (const [id, piece] of boardPieces.entries()) {
    if (!piece || !piece.isConnected) continue;
    if (piece.dataset.boardZone === zoneName) return id;
  }

  const expectedLeft = `${target.left}%`;
  const expectedTop = `${target.top}%`;

  for (const [id, piece] of boardPieces.entries()) {
    if (!piece || !piece.isConnected) continue;
    if (piece.style.left === expectedLeft && piece.style.top === expectedTop) {
      return id;
    }
  }

  return null;
};

/* =========================================================
   MOVIMIENTO VISIBLE GARANTIZADO
   ========================================================= */

movePiece = function (id, destination, options = {}) {
  const piece = boardPieces.get(id);
  const target = zone(destination);
  if (!piece || !target) return;

  const duration = Number(options.duration) || 1050;
  const easing = "cubic-bezier(.22,.78,.22,1)";

  /* Reservamos el destino de inmediato a nivel lógico. */
  piece.dataset.boardZone = destination;

  /*
   * Congelamos primero la posición de origen. Dos frames separados garantizan
   * que incluso una carta recién creada llegue a pintarse en su zona inicial
   * antes de comenzar el desplazamiento. Esto es especialmente importante en
   * móviles, donde un cambio hecho en el mismo frame puede verse como salto.
   */
  piece.style.transition = "none";
  piece.style.willChange = "left, top, width, transform";
  void piece.getBoundingClientRect();

  requestAnimationFrame(() => {
    if (!piece.isConnected) return;

    requestAnimationFrame(() => {
      if (!piece.isConnected) return;

      piece.style.transition = [
        `left ${duration}ms ${easing}`,
        `top ${duration}ms ${easing}`,
        `width ${duration}ms ${easing}`,
        `transform ${duration}ms ${easing}`
      ].join(", ");

      placeElementAtZone(piece, destination, options);

      window.setTimeout(() => {
        if (!piece.isConnected) return;
        piece.style.willChange = "auto";
      }, duration + 100);
    });
  });
};

/* =========================================================
   ORDEN DE FICHAS — NÚMEROS ALTOS PRIMERO
   ========================================================= */

thirdFirstOccupiedFSlot = function (rowKey, count) {
  for (let i = count; i >= 1; i -= 1) {
    const zoneName = `F${rowKey}${i}`;
    const id = thirdPieceIdAtZone(zoneName);
    if (id) return { id, zoneName };
  }
  return null;
};

thirdFirstOccupiedQSlot = function (rowKey, count) {
  for (let i = count; i >= 1; i -= 1) {
    const zoneName = `Q${rowKey}${i}`;
    const id = thirdPieceIdAtZone(zoneName);
    if (id) return { id, zoneName };
  }
  return null;
};

/* motion-polish usa esta función para los grupos animados. */
motionOccupiedZones = function (prefix, rowKey, count) {
  const found = [];
  for (let i = count; i >= 1; i -= 1) {
    const zoneName = `${prefix}${rowKey}${i}`;
    const id = thirdPieceIdAtZone(zoneName);
    if (id) found.push({ id, zoneName });
  }
  return found;
};

/* =========================================================
   FONDO CORRECTO DURANTE TODA LA ANIMACIÓN DE TRUCOS
   ========================================================= */

function tricksBackgroundForPhase(phase) {
  if (phase <= 2) {
    return {
      src: "IMGBE1.png",
      alt: "Tablero durante la demostración de Giovanni"
    };
  }

  if (phase <= 5) {
    return {
      src: "IMGBE2.png",
      alt: "Tablero durante la demostración de Tatiana"
    };
  }

  return {
    src: "IMGBE3.png",
    alt: "Tablero durante los trucos de la directora"
  };
}

/*
 * renderExtraTricksBoard reconstruye el tablero usando internamente
 * renderThirdValentinaBoard(). Esa función llama setSceneImage("IMGBE4.png")
 * antes de que el flujo de Trucos vuelva a colocar su propio fondo. Aunque el
 * cambio dura apenas un instante, el navegador alcanza a pintarlo y produce
 * el destello verde observado entre el texto y la animación.
 *
 * Mientras se reconstruye cualquier fase de Trucos bloqueamos ese cambio
 * intermedio: cualquier intento de usar IMGBE4 se redirige directamente al
 * fondo correspondiente a la fase actual. Así IMGBE4 nunca llega al DOM.
 */
let tricksBackgroundLock = null;
const baseSetSceneImageForTricksBackground = setSceneImage;

setSceneImage = function (src, alt) {
  if (tricksBackgroundLock && src === "IMGBE4.png") {
    baseSetSceneImageForTricksBackground(
      tricksBackgroundLock.src,
      tricksBackgroundLock.alt
    );
    return;
  }

  baseSetSceneImageForTricksBackground(src, alt);
};

const baseRenderExtraTricksBoardForBackgroundConsistency = renderExtraTricksBoard;
renderExtraTricksBoard = function (phase) {
  const background = tricksBackgroundForPhase(phase);
  const previousLock = tricksBackgroundLock;
  tricksBackgroundLock = background;

  try {
    baseRenderExtraTricksBoardForBackgroundConsistency(phase);
    baseSetSceneImageForTricksBackground(background.src, background.alt);
  } finally {
    tricksBackgroundLock = previousLock;
  }
};
