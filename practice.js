/* =========================================================
   PRÁCTICA — MOTOR DE TABLERO POR ZONAS
   ========================================================= */

/*
 * A partir de IMG4E la práctica usa una imagen base limpia (IMGBE1.png)
 * y solo dibuja sobre ella las cartas/fichas que están visibles.
 *
 * Convenciones:
 * - Cartas terminadas en "s": versión pequeña para el despliegue.
 * - Fichas terminadas en "m": versión pequeña para tablero/cartas.
 * - Las coordenadas se basan en el mapa 1893 x 1066 creado para el juego.
 */

const practiceTokenAssets = {
  money: { large: "FAM.png", small: "FAMm.png" },
  stimulation: { large: "FAz.png", small: "FAZm.png" },
  affection: { large: "FFC.png", small: "FFCm.png" },
  neglect: { large: "FNG.png", small: "FNGm.png" },
  health: { large: "FVR.png", small: "FVRm.png" }
};

/* =========================================================
   ESCENAS NUEVAS DE LA PRÁCTICA
   Las escenas intro y adopter siguen creadas en threat.js.
   ========================================================= */

scenes.push(
  {
    image: "IMGBE1.png",
    type: "practice-board",
    practiceStep: "dice-roll",
    text: "Ahora que ya resolvimos la primera parte de la carta, es momento de lanzar el dado. En este turno solo tendremos un lanzamiento..."
  },
  {
    image: "IMGBE1.png",
    type: "practice-board",
    practiceStep: "dice-result",
    text: "Y obtuvimos un 4. Nos tocó -1 de estimulación, como Rango no tiene fichas azules de estimulación ahora tendrá una ficha negra de descuido, lo que lo pondrá en peligro."
  },
  {
    image: "IMGBE1.png",
    type: "practice-board",
    practiceStep: "after-roll",
    text: ""
  }
);

const practicePreloadAssets = [
  "IMGBE1.png",
  "AS5s.png",
  "AS6s.png",
  "AN2s.png",
  "AN17s.png",
  "AD12s.png",
  "AD16s.png",
  "DD1.png",
  "DD2.png",
  "DD3.png",
  "DD4.png",
  "DD5.png",
  "DD6.png",
  practiceTokenAssets.money.small,
  practiceTokenAssets.stimulation.small,
  practiceTokenAssets.affection.small,
  practiceTokenAssets.neglect.small,
  practiceTokenAssets.health.small
];

practicePreloadAssets.forEach(src => {
  const img = new Image();
  img.src = src;
});

/* =========================================================
   MAPA CENTRAL DEL TABLERO
   ========================================================= */

const BOARD_MAP = {
  size: { width: 1893, height: 1066 },

  // Cartas principales
  CE: { kind: "rect", left: 7.82, top: 10.41, width: 10.72 },
  CO: { kind: "rect", left: 20.23, top: 10.41, width: 10.72 },
  CA: { kind: "rect", left: 9.30, top: 43.25, width: 7.71 },
  CD: { kind: "rect", left: 9.30, top: 67.45, width: 7.71 },

  // Dado
  DS: { kind: "rect", left: 33.70, top: 23.83, width: 4.33 },

  // Cartas de animales
  A1: { kind: "rect", left: 26.68, top: 43.25, width: 7.71 },
  A2: { kind: "rect", left: 44.48, top: 43.25, width: 7.71 },
  A3: { kind: "rect", left: 62.39, top: 43.25, width: 7.71 },
  A4: { kind: "rect", left: 80.08, top: 43.25, width: 7.71 },
  A5: { kind: "rect", left: 44.48, top: 16.89, width: 7.71 },

  // Fila de adoptantes
  D1: { kind: "rect", left: 26.68, top: 67.45, width: 7.71 },
  D2: { kind: "rect", left: 44.48, top: 67.45, width: 7.71 },
  D3: { kind: "rect", left: 62.39, top: 67.45, width: 7.71 },
  D4: { kind: "rect", left: 80.08, top: 67.45, width: 7.71 },

  // Posiciones de fichas sobre A1
  "11": { kind: "point", left: 28.02, top: 48.97 },
  "12": { kind: "point", left: 28.01, top: 52.33 },
  "13": { kind: "point", left: 28.01, top: 55.79 },
  "14": { kind: "point", left: 27.99, top: 59.11 },
  "15": { kind: "point", left: 33.08, top: 55.81 },
  "16": { kind: "point", left: 33.05, top: 59.18 },

  // Posiciones de fichas sobre A2
  "21": { kind: "point", left: 45.97, top: 48.99 },
  "22": { kind: "point", left: 45.96, top: 52.33 },
  "23": { kind: "point", left: 45.96, top: 55.81 },
  "24": { kind: "point", left: 45.94, top: 59.16 },
  "25": { kind: "point", left: 50.99, top: 55.83 },
  "26": { kind: "point", left: 50.98, top: 59.20 },

  // Posiciones de fichas sobre A3
  "31": { kind: "point", left: 63.72, top: 48.97 },
  "32": { kind: "point", left: 63.70, top: 52.32 },
  "33": { kind: "point", left: 63.70, top: 55.79 },
  "34": { kind: "point", left: 63.69, top: 59.13 },
  "35": { kind: "point", left: 68.77, top: 55.81 },
  "36": { kind: "point", left: 68.73, top: 59.17 },

  // Posiciones de fichas sobre A4 (Rango en esta prueba)
  "41": { kind: "point", left: 81.40, top: 48.97 },
  "42": { kind: "point", left: 81.38, top: 52.31 },
  "43": { kind: "point", left: 81.38, top: 55.79 },
  "44": { kind: "point", left: 81.41, top: 59.14 },
  "45": { kind: "point", left: 86.46, top: 55.81 },
  "46": { kind: "point", left: 86.42, top: 59.19 },

  // Posiciones de fichas sobre A5
  "51": { kind: "point", left: 45.82, top: 22.61 },
  "52": { kind: "point", left: 45.80, top: 25.96 },
  "53": { kind: "point", left: 45.80, top: 29.44 },
  "54": { kind: "point", left: 45.93, top: 32.79 },
  "55": { kind: "point", left: 50.86, top: 29.45 },
  "56": { kind: "point", left: 50.83, top: 32.82 }
};

/* Reservas F y colas Q. */
const reserveColumnsF = [59.24, 62.02, 64.79, 67.56, 70.34, 73.11];
const reserveColumnsQ = [76.94, 79.74, 82.54, 85.31, 88.09, 90.86];
const reserveRows = {
  n: 13.79,
  z: 20.40,
  f: 25.23,
  v: 30.11,
  a: 34.99
};

function addReserveRow(prefix, rowKey, count, columns) {
  for (let i = 0; i < count; i += 1) {
    BOARD_MAP[`${prefix}${rowKey}${i + 1}`] = {
      kind: "point",
      left: columns[i],
      top: reserveRows[rowKey]
    };
  }
}

addReserveRow("F", "n", 6, reserveColumnsF);
addReserveRow("F", "z", 5, reserveColumnsF);
addReserveRow("F", "f", 5, reserveColumnsF);
addReserveRow("F", "v", 5, reserveColumnsF);
addReserveRow("F", "a", 6, reserveColumnsF);

addReserveRow("Q", "n", 6, reserveColumnsQ);
addReserveRow("Q", "z", 5, reserveColumnsQ);
addReserveRow("Q", "f", 5, reserveColumnsQ);
addReserveRow("Q", "v", 5, reserveColumnsQ);
addReserveRow("Q", "a", 6, reserveColumnsQ);

/* Expuesto para facilitar los siguientes pasos del tutorial. */
window.ADOPTAME_BOARD_MAP = BOARD_MAP;

/* =========================================================
   CAPA VISUAL DEL TABLERO
   ========================================================= */

const boardPracticeLayer = document.createElement("div");
boardPracticeLayer.setAttribute("aria-label", "Elementos visibles del tablero de práctica");
Object.assign(boardPracticeLayer.style, {
  position: "absolute",
  inset: "0",
  zIndex: "12",
  display: "none",
  pointerEvents: "none"
});
stage.appendChild(boardPracticeLayer);

const boardPieces = new Map();
let boardTimers = [];
let boardDiceTimer = null;

function boardLater(delay, callback) {
  const timer = setTimeout(callback, delay);
  boardTimers.push(timer);
  return timer;
}

function clearBoardTimers() {
  boardTimers.forEach(timer => clearTimeout(timer));
  boardTimers = [];

  if (boardDiceTimer) {
    clearInterval(boardDiceTimer);
    boardDiceTimer = null;
  }
}

function clearBoardPieces() {
  clearBoardTimers();
  boardPieces.clear();
  boardPracticeLayer.replaceChildren();
}

function hideBoardPracticeLayer() {
  clearBoardPieces();
  boardPracticeLayer.style.display = "none";
}

function zone(name) {
  return BOARD_MAP[name];
}

function placeElementAtZone(element, zoneName, options = {}) {
  const target = zone(zoneName);
  if (!target) return;

  const width = options.width || (target.kind === "rect" ? `${target.width}%` : "1.72%");

  element.style.width = width;
  element.style.height = "auto";

  if (target.kind === "rect") {
    element.style.left = `${target.left}%`;
    element.style.top = `${target.top}%`;
    element.style.transform = options.transform || "none";
  } else {
    element.style.left = `${target.left}%`;
    element.style.top = `${target.top}%`;
    element.style.transform = options.transform || "translate(-50%, -50%)";
  }
}

function createImagePiece(id, src, zoneName, options = {}) {
  const image = document.createElement("img");
  image.src = src;
  image.alt = options.alt || "";
  image.draggable = false;
  image.dataset.boardPiece = id;
  image.setAttribute("aria-hidden", "true");

  Object.assign(image.style, {
    position: "absolute",
    zIndex: String(options.zIndex || 15),
    opacity: options.opacity == null ? "1" : String(options.opacity),
    pointerEvents: "none",
    transformOrigin: "center center",
    filter: options.shadow === false ? "none" : "drop-shadow(0 4px 6px rgba(0,0,0,.18))"
  });

  placeElementAtZone(image, zoneName, options);
  boardPracticeLayer.appendChild(image);
  boardPieces.set(id, image);
  return image;
}

function createHighlight(id, zoneName) {
  const target = zone(zoneName);
  if (!target || target.kind !== "rect") return null;

  const highlight = document.createElement("div");
  highlight.dataset.boardPiece = id;
  Object.assign(highlight.style, {
    position: "absolute",
    zIndex: "26",
    left: `${target.left - 0.25}%`,
    top: `${target.top - 0.45}%`,
    width: `${target.width + 0.50}%`,
    aspectRatio: "206 / 306",
    border: "4px solid #ff941f",
    borderRadius: "10px",
    boxSizing: "border-box",
    boxShadow: "0 0 12px rgba(255,148,31,.65)",
    pointerEvents: "none"
  });

  boardPracticeLayer.appendChild(highlight);
  boardPieces.set(id, highlight);
  return highlight;
}

function movePiece(id, destination, options = {}) {
  const piece = boardPieces.get(id);
  const target = zone(destination);
  if (!piece || !target) return;

  const duration = options.duration || 1050;

  piece.style.transition = [
    `left ${duration}ms cubic-bezier(.22,1,.36,1)`,
    `top ${duration}ms cubic-bezier(.22,1,.36,1)`,
    `width ${duration}ms cubic-bezier(.22,1,.36,1)`,
    `transform ${duration}ms cubic-bezier(.22,1,.36,1)`
  ].join(", ");

  placeElementAtZone(piece, destination, options);
}

/* =========================================================
   ESTADO BASE DE ESTA PRUEBA
   ========================================================= */

function renderReserveTokens(includeFn6 = true) {
  // Negras: 6 al inicio; Fn6 será la que viaje a Rango.
  for (let i = 1; i <= (includeFn6 ? 6 : 5); i += 1) {
    createImagePiece(`reserve-Fn${i}`, practiceTokenAssets.neglect.small, `Fn${i}`, {
      width: "1.72%",
      shadow: false,
      zIndex: 18
    });
  }

  // Azules: las cinco disponibles.
  for (let i = 1; i <= 5; i += 1) {
    createImagePiece(`reserve-Fz${i}`, practiceTokenAssets.stimulation.small, `Fz${i}`, {
      width: "1.72%",
      shadow: false,
      zIndex: 18
    });
  }

  // Fucsias: falta una porque está en Rango (42).
  for (let i = 1; i <= 4; i += 1) {
    createImagePiece(`reserve-Ff${i}`, practiceTokenAssets.affection.small, `Ff${i}`, {
      width: "1.72%",
      shadow: false,
      zIndex: 18
    });
  }

  // Verdes: faltan dos porque están en Rango (43 y 44).
  for (let i = 1; i <= 3; i += 1) {
    createImagePiece(`reserve-Fv${i}`, practiceTokenAssets.health.small, `Fv${i}`, {
      width: "1.72%",
      shadow: false,
      zIndex: 18
    });
  }

  // Amarillas: las seis disponibles.
  for (let i = 1; i <= 6; i += 1) {
    createImagePiece(`reserve-Fa${i}`, practiceTokenAssets.money.small, `Fa${i}`, {
      width: "1.72%",
      shadow: false,
      zIndex: 18
    });
  }
}

function renderCoreBoardState(options = {}) {
  const adopterMoved = Boolean(options.adopterMoved);
  const showDie = Boolean(options.showDie);
  const neglectPlaced = Boolean(options.neglectPlaced);

  // Amenaza activa y descarte.
  createImagePiece("AS6", "AS6s.png", "CE", { zIndex: 15, alt: "Amenaza AS6" });
  createHighlight("AS6-highlight", "CE");
  createImagePiece("AS5", "AS5s.png", "CO", { zIndex: 14, alt: "Amenaza AS5 descartada" });

  // Mazo/entrada visible de animales.
  createImagePiece("AN2", "AN2s.png", "CA", { zIndex: 15, alt: "Animal visible AN2" });

  // Rango en A4.
  createImagePiece("AN17", "AN17s.png", "A4", { zIndex: 15, alt: "Rango" });
  createImagePiece("Rango-42", practiceTokenAssets.affection.small, "42", { width: "1.78%", zIndex: 21, shadow: false });
  createImagePiece("Rango-43", practiceTokenAssets.health.small, "43", { width: "1.78%", zIndex: 21, shadow: false });
  createImagePiece("Rango-44", practiceTokenAssets.health.small, "44", { width: "1.78%", zIndex: 21, shadow: false });

  // Adoptantes: Lorena es la carta visible al principio; al moverse queda AD12 visible en CD.
  if (adopterMoved) {
    createImagePiece("AD12", "AD12s.png", "CD", { zIndex: 14, alt: "Adoptante visible AD12" });
    createImagePiece("AD16", "AD16s.png", "D1", { zIndex: 16, alt: "Lorena" });
  } else {
    createImagePiece("AD16", "AD16s.png", "CD", { zIndex: 16, alt: "Lorena" });
  }

  // Reservas F, descontando las fichas ya puestas sobre Rango.
  renderReserveTokens(!neglectPlaced);

  if (showDie) {
    createImagePiece("dice", "DD4.png", "DS", {
      width: "4.33%",
      zIndex: 22,
      shadow: false,
      alt: "Dado mostrando 4"
    });
  }

  if (neglectPlaced) {
    createImagePiece("Rango-46", practiceTokenAssets.neglect.small, "46", {
      width: "1.78%",
      zIndex: 22,
      shadow: false
    });
  }
}

/* =========================================================
   ANIMACIONES DE ESTA PRUEBA
   ========================================================= */

function animateLorenaFromCDToD1() {
  renderCoreBoardState({ adopterMoved: false });

  // En cuanto Lorena comienza a salir del mazo, AD12 queda visible debajo.
  boardLater(180, () => {
    const lorena = boardPieces.get("AD16");
    if (!lorena) return;

    const ad12 = createImagePiece("AD12", "AD12s.png", "CD", {
      zIndex: 14,
      alt: "Adoptante visible AD12"
    });
    ad12.style.opacity = "1";

    lorena.style.zIndex = "19";
    movePiece("AD16", "D1", { duration: 1150 });
  });

  interactionLockedUntil = Date.now() + 1500;
}

function animateDiceToFour() {
  renderCoreBoardState({ adopterMoved: true });

  const die = createImagePiece("dice", "DD1.png", "DS", {
    width: "4.33%",
    zIndex: 23,
    shadow: false,
    opacity: 0,
    alt: "Dado"
  });

  // El dado entra ligeramente desde arriba/izquierda y gira mientras muestra todas sus caras.
  die.style.left = "28.7%";
  die.style.top = "14.3%";
  die.style.transform = "rotate(-540deg) scale(.55)";

  const faces = ["DD1.png", "DD2.png", "DD3.png", "DD4.png", "DD5.png", "DD6.png", "DD2.png", "DD5.png"];
  let faceIndex = 0;

  boardLater(160, () => {
    die.style.transition = [
      "left 1250ms cubic-bezier(.22,1,.36,1)",
      "top 1250ms cubic-bezier(.22,1,.36,1)",
      "opacity 180ms ease",
      "transform 1250ms cubic-bezier(.22,1,.36,1)"
    ].join(", ");

    die.style.opacity = "1";
    die.style.left = `${BOARD_MAP.DS.left}%`;
    die.style.top = `${BOARD_MAP.DS.top}%`;
    die.style.transform = "rotate(0deg) scale(1)";

    boardDiceTimer = setInterval(() => {
      die.src = faces[faceIndex % faces.length];
      faceIndex += 1;
    }, 115);
  });

  boardLater(1380, () => {
    if (boardDiceTimer) {
      clearInterval(boardDiceTimer);
      boardDiceTimer = null;
    }
    die.src = "DD4.png";
    die.style.transition = "transform 180ms ease";
    die.style.transform = "rotate(0deg) scale(1.05)";
  });

  boardLater(1570, () => {
    die.style.transform = "rotate(0deg) scale(1)";
  });

  interactionLockedUntil = Date.now() + 1650;
}

function animateNeglectFromFn6ToRango() {
  renderCoreBoardState({ adopterMoved: true, showDie: true, neglectPlaced: false });

  const token = boardPieces.get("reserve-Fn6");
  if (!token) return;

  token.style.zIndex = "24";

  boardLater(520, () => {
    movePiece("reserve-Fn6", "46", {
      width: "1.78%",
      duration: 1100,
      transform: "translate(-50%, -50%)"
    });
  });

  interactionLockedUntil = Date.now() + 1700;
}

/* =========================================================
   DIÁLOGO PARA LA PRÁCTICA
   ========================================================= */

function clearBoardPracticeDialogueStyle() {
  dialogueText.style.zIndex = "";
}

function applyBoardPracticeDialogueLayout() {
  applyPracticeDialogueLayout();
  dialogueText.style.zIndex = "40";
  dialogueText.style.left = "23.5%";
  dialogueText.style.top = "86.4%";
  dialogueText.style.width = "69.5%";
  dialogueText.style.height = "11.2%";
  dialogueText.style.padding = "1.0% 1.8%";
  dialogueText.style.fontSize = "clamp(11px, calc(.95vw + 2px), 22px)";
  dialogueText.style.lineHeight = "1.14";
}

/* =========================================================
   INTEGRACIÓN CON EL SISTEMA DE ESCENAS ACTUAL
   ========================================================= */

const baseRenderSceneForBoardPractice = renderScene;
renderScene = function () {
  hideBoardPracticeLayer();
  clearBoardPracticeDialogueStyle();

  baseRenderSceneForBoardPractice();

  const scene = scenes[sceneIndex];
  if (!scene || scene.type !== "practice-board") return;

  // Desactiva la capa antigua de práctica de threat.js y usa el nuevo tablero por zonas.
  if (typeof hidePracticeLayer === "function") {
    hidePracticeLayer();
  }

  if (typeof hideDicePracticeLayer === "function") {
    hideDicePracticeLayer();
  }

  setSceneImage("IMGBE1.png", "Tablero de práctica de Adóptame");
  boardPracticeLayer.style.display = "block";
  previousButton.hidden = false;

  if (scene.practiceStep === "after-roll") {
    dialogueText.hidden = true;
    renderCoreBoardState({ adopterMoved: true, showDie: true, neglectPlaced: true });
    stage.setAttribute(
      "aria-label",
      "Estado final de la primera resolución: Lorena está en D1, el dado muestra 4 y Rango tiene una ficha negra de descuido en la posición 46."
    );
    return;
  }

  dialogueText.hidden = false;
  dialogueText.textContent = scene.text;
  applyBoardPracticeDialogueLayout();

  if (scene.practiceStep === "intro") {
    renderCoreBoardState({ adopterMoved: false });
    stage.setAttribute(
      "aria-label",
      "Inicio de la práctica. AS6 está activa y resaltada, AS5 está descartada, AN2 está visible en CA, Lorena está visible en CD y Rango está en A4."
    );
    return;
  }

  if (scene.practiceStep === "adopter") {
    animateLorenaFromCDToD1();
    stage.setAttribute(
      "aria-label",
      "Lorena, AD16, se mueve desde CD hasta D1 y AD12 queda visible en CD."
    );
    return;
  }

  if (scene.practiceStep === "dice-roll") {
    animateDiceToFour();
    stage.setAttribute(
      "aria-label",
      "Se lanza el dado. Durante la animación se muestran varias caras y finalmente queda un 4 en la zona DS."
    );
    return;
  }

  if (scene.practiceStep === "dice-result") {
    animateNeglectFromFn6ToRango();
    stage.setAttribute(
      "aria-label",
      "El resultado 4 provoca menos uno de estimulación. La ficha negra de Fn6 se mueve hasta la posición 46 sobre Rango."
    );
  }
};

/* API pequeña para próximos pasos del tutorial. */
window.ADOPTAME_BOARD = {
  map: BOARD_MAP,
  layer: boardPracticeLayer,
  pieces: boardPieces,
  renderCoreState: renderCoreBoardState,
  movePiece,
  createImagePiece
};
