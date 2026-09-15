/* =========================================================
   FLUJO MÓVIL — DIÁLOGO ANTES DE ANIMAR + TOQUES
   ========================================================= */

/*
 * En la práctica, primero se muestra el diálogo con calma.
 * Al avanzar, el cuadro se retira y SOLO después comienza la animación.
 * Al terminar, se pasa automáticamente al siguiente diálogo/estado.
 *
 * Navegación táctil:
 * - Toque sencillo: avanzar.
 * - Doble toque: regresar.
 *
 * El toque sencillo se confirma después de una espera muy corta para poder
 * distinguirlo de un doble toque. Los botones interactivos conservan su
 * comportamiento normal.
 */

/* =========================================================
   PRIMER DIÁLOGO: INSTRUCCIONES DE NAVEGACIÓN
   ========================================================= */

const navigationHelpAlreadyAdded = scenes.some(scene => scene.navigationHelp === true);

if (!navigationHelpAlreadyAdded) {
  // Al insertar una escena después de la portada cambian en +1 los índices
  // de destino que ya existían en la introducción.
  scenes.forEach(scene => {
    if (Number.isInteger(scene.skipTo) && scene.skipTo >= 1) {
      scene.skipTo += 1;
    }
  });

  scenes.splice(1, 0, {
    image: "IMG1.png",
    type: "dialogue",
    navigationHelp: true,
    text: "Para avanzar, toca la pantalla. Para retroceder, toca dos veces."
  });
}

let practicePhaseAnimating = false;
let practiceAutoAdvanceTimer = null;

function clearPracticeAutoAdvance() {
  if (practiceAutoAdvanceTimer) {
    clearTimeout(practiceAutoAdvanceTimer);
    practiceAutoAdvanceTimer = null;
  }
}

/*
 * Protección adicional: nunca debe haber dos elementos visuales con el
 * mismo id de pieza. Esto evita, por ejemplo, que quede una Lorena quieta
 * en CD mientras otra copia se mueve hacia D1.
 */
const baseCreateImagePieceForMobileFlow = createImagePiece;
createImagePiece = function (id, src, zoneName, options = {}) {
  const previousPiece = boardPieces.get(id);
  if (previousPiece) {
    previousPiece.remove();
    boardPieces.delete(id);
  }

  return baseCreateImagePieceForMobileFlow(id, src, zoneName, options);
};

function applyMobilePracticeDialogueLayout() {
  // En celular priorizamos lectura. La burbuja puede cubrir el tablero,
  // porque desaparece antes de iniciar cualquier animación.
  dialogueText.style.zIndex = "45";
  dialogueText.style.left = "8.0%";
  dialogueText.style.top = "60.0%";
  dialogueText.style.width = "84.0%";
  dialogueText.style.height = "31.0%";
  dialogueText.style.padding = "2.6% 3.4%";
  dialogueText.style.fontSize = "clamp(16px, calc(1.45vw + 4px), 32px)";
  dialogueText.style.lineHeight = "1.17";
  dialogueText.style.alignItems = "center";
  dialogueText.style.justifyContent = "center";
  dialogueText.style.background = "#ffffff";
  dialogueText.style.border = "5px solid #111111";
  dialogueText.style.borderRadius = "24px";
  dialogueText.style.color = "#111111";
  dialogueText.style.boxShadow = "0 6px 18px rgba(0,0,0,.20)";
  dialogueText.style.textAlign = "center";
  dialogueText.style.overflow = "hidden";
  dialogueText.style.opacity = "1";
  dialogueText.style.transform = "none";
  dialogueText.style.transition = "none";
}

function renderStaticPracticeStep(scene) {
  if (typeof clearBoardPieces === "function") clearBoardPieces();
  if (typeof hidePracticeLayer === "function") hidePracticeLayer();

  // Las capas anteriores pueden haber establecido un bloqueo al intentar
  // iniciar una animación. Aquí mostramos primero el diálogo, así que la
  // interacción debe quedar disponible inmediatamente.
  interactionLockedUntil = 0;

  boardPracticeLayer.style.display = "block";

  switch (scene.practiceStep) {
    case "intro":
    case "adopter":
      renderCoreBoardState({ adopterMoved: false });
      break;

    case "dice-roll":
      renderCoreBoardState({ adopterMoved: true });
      break;

    case "dice-result":
      renderCoreBoardState({ adopterMoved: true, showDie: true, neglectPlaced: false });
      break;

    case "after-roll":
      renderCoreBoardState({ adopterMoved: true, showDie: true, neglectPlaced: true });
      break;
  }
}

function hidePracticeDialogueBeforeAnimation(callback) {
  dialogueText.style.transition = "opacity 160ms ease, transform 160ms ease";
  dialogueText.style.opacity = "0";
  dialogueText.style.transform = "scale(.97)";

  window.setTimeout(() => {
    dialogueText.hidden = true;
    dialogueText.style.transition = "none";
    dialogueText.style.transform = "none";
    callback();
  }, 190);
}

function finishPracticeAnimationAfter(delay) {
  clearPracticeAutoAdvance();

  practiceAutoAdvanceTimer = window.setTimeout(() => {
    practiceAutoAdvanceTimer = null;
    practicePhaseAnimating = false;
    interactionLockedUntil = 0;

    if (sceneIndex < scenes.length - 1) {
      sceneIndex += 1;
      renderScene();
    }
  }, delay);
}

function runPracticeStepAnimation(step) {
  if (practicePhaseAnimating) return;

  practicePhaseAnimating = true;

  hidePracticeDialogueBeforeAnimation(() => {
    /*
     * La escena estática mostraba las piezas mientras se leía el diálogo.
     * Antes de reconstruir el estado animado hay que borrarlas. De lo
     * contrario podría quedar una copia estática debajo de la que se mueve.
     */
    if (typeof clearBoardPieces === "function") clearBoardPieces();
    boardPracticeLayer.style.display = "block";

    if (step === "adopter") {
      animateLorenaFromCDToD1();
      finishPracticeAnimationAfter(1650);
      return;
    }

    if (step === "dice-roll") {
      animateDiceToFour();
      finishPracticeAnimationAfter(1850);
      return;
    }

    if (step === "dice-result") {
      animateNeglectFromFn6ToRango();
      finishPracticeAnimationAfter(1900);
      return;
    }

    practicePhaseAnimating = false;
  });
}

/*
 * practice.js ya integra el tablero con renderScene. Esta última capa
 * cancela cualquier animación automática iniciada al entrar a la escena
 * y deja el estado quieto hasta que el usuario decida avanzar.
 */
const baseRenderSceneForMobileFlow = renderScene;
renderScene = function () {
  clearPracticeAutoAdvance();
  practicePhaseAnimating = false;

  baseRenderSceneForMobileFlow();

  const scene = scenes[sceneIndex];

  // La navegación general se hace con toques; el botón flotante de volver
  // deja de ser necesario.
  previousButton.hidden = true;

  if (!scene || scene.type !== "practice-board") return;

  renderStaticPracticeStep(scene);

  if (scene.practiceStep === "after-roll") {
    dialogueText.hidden = true;
    return;
  }

  dialogueText.hidden = false;
  dialogueText.textContent = scene.text || "";
  applyMobilePracticeDialogueLayout();
};

const baseAdvanceSceneForMobileFlow = advanceScene;
advanceScene = function () {
  const scene = scenes[sceneIndex];

  if (scene?.type === "practice-board") {
    if (practicePhaseAnimating || Date.now() < interactionLockedUntil) return;

    if (["adopter", "dice-roll", "dice-result"].includes(scene.practiceStep)) {
      runPracticeStepAnimation(scene.practiceStep);
      return;
    }
  }

  baseAdvanceSceneForMobileFlow();
};

const basePreviousSceneForMobileFlow = previousScene;
previousScene = function () {
  if (practicePhaseAnimating || Date.now() < interactionLockedUntil) return;
  basePreviousSceneForMobileFlow();
};

/* =========================================================
   NAVEGACIÓN TÁCTIL
   Toque sencillo = avanzar
   Doble toque = regresar
   ========================================================= */

const DOUBLE_TAP_MAX_DELAY = 330;
const DOUBLE_TAP_MAX_DISTANCE = 58;
const TAP_MAX_MOVEMENT = 20;

let pendingSingleTapTimer = null;
let lastTapTime = 0;
let lastTapX = 0;
let lastTapY = 0;
let touchStartX = 0;
let touchStartY = 0;
let touchStartTime = 0;
let touchMoved = false;
let suppressTouchClickUntil = 0;

// No usamos arrastre para navegar. El iframe/página anfitriona puede seguir
// gestionando su desplazamiento normal.
stage.style.touchAction = "manipulation";
stage.style.userSelect = "none";
stage.style.webkitUserSelect = "none";
stage.style.webkitTouchCallout = "none";

function clearPendingSingleTap() {
  if (pendingSingleTapTimer) {
    clearTimeout(pendingSingleTapTimer);
    pendingSingleTapTimer = null;
  }
}

function canNavigateNow() {
  return !practicePhaseAnimating && Date.now() >= interactionLockedUntil;
}

function advanceWithSingleTap() {
  if (!canNavigateNow()) return;

  if (openRoomKey) {
    returnToRoomMap();
    return;
  }

  const scene = scenes[sceneIndex];
  if (!scene) return;

  // En el mapa, tocar una zona vacía permite continuar; las salas siguen
  // funcionando como botones y no pasan por esta lógica.
  if (scene.type === "room-map" && Number.isInteger(scene.skipTo)) {
    skipCurrentPart();
    return;
  }

  // En tarjetas de amenaza, un toque fuera de A1-A9 continúa la historia.
  if (scene.type === "threat-card") {
    if (sceneIndex < scenes.length - 1) {
      sceneIndex += 1;
      renderScene();
    }
    return;
  }

  advanceScene();
}

function backWithDoubleTap() {
  if (!canNavigateNow()) return;

  if (openRoomKey) {
    returnToRoomMap();
    return;
  }

  previousScene();
}

stage.addEventListener("touchstart", event => {
  if (event.touches.length !== 1) {
    touchMoved = true;
    return;
  }

  // Botones de salas, zonas de amenaza y controles conservan su click.
  if (event.target.closest("button")) {
    touchMoved = true;
    return;
  }

  const touch = event.touches[0];
  touchStartX = touch.clientX;
  touchStartY = touch.clientY;
  touchStartTime = Date.now();
  touchMoved = false;
}, { passive: true });

stage.addEventListener("touchmove", event => {
  if (event.touches.length !== 1) {
    touchMoved = true;
    return;
  }

  const touch = event.touches[0];
  const dx = touch.clientX - touchStartX;
  const dy = touch.clientY - touchStartY;

  if (Math.hypot(dx, dy) > TAP_MAX_MOVEMENT) {
    touchMoved = true;
  }
}, { passive: true });

stage.addEventListener("touchend", event => {
  // Los botones interactivos no usan el sistema toque/doble toque.
  if (event.target.closest("button")) {
    lastTapTime = 0;
    clearPendingSingleTap();
    return;
  }

  // Bloquea el click sintético que genera el navegador tras touchend.
  suppressTouchClickUntil = Date.now() + 700;

  if (touchMoved) {
    touchMoved = false;
    lastTapTime = 0;
    clearPendingSingleTap();
    return;
  }

  const touch = event.changedTouches[0];
  if (!touch) return;

  const now = Date.now();
  const duration = now - touchStartTime;
  if (duration > 450) {
    lastTapTime = 0;
    clearPendingSingleTap();
    return;
  }

  /*
   * La portada se inicia inmediatamente para que el navegador considere
   * el arranque de la música parte del gesto del usuario. Después aparece
   * el nuevo diálogo que explica cómo navegar.
   */
  if (scenes[sceneIndex]?.type === "start") {
    lastTapTime = 0;
    clearPendingSingleTap();
    advanceScene();
    return;
  }

  const x = touch.clientX;
  const y = touch.clientY;
  const sinceLastTap = now - lastTapTime;
  const distanceFromLastTap = Math.hypot(x - lastTapX, y - lastTapY);

  // Segundo toque: cancela el avance pendiente y regresa una escena.
  if (
    lastTapTime > 0 &&
    sinceLastTap <= DOUBLE_TAP_MAX_DELAY &&
    distanceFromLastTap <= DOUBLE_TAP_MAX_DISTANCE
  ) {
    clearPendingSingleTap();
    lastTapTime = 0;
    backWithDoubleTap();
    return;
  }

  // Primer toque: esperamos apenas lo necesario para saber si habrá un
  // segundo. Si no llega, se confirma como avance.
  lastTapTime = now;
  lastTapX = x;
  lastTapY = y;
  clearPendingSingleTap();
  pendingSingleTapTimer = window.setTimeout(() => {
    pendingSingleTapTimer = null;
    lastTapTime = 0;
    advanceWithSingleTap();
  }, DOUBLE_TAP_MAX_DELAY + 20);
}, { passive: true });

stage.addEventListener("touchcancel", () => {
  touchMoved = false;
  lastTapTime = 0;
  clearPendingSingleTap();
}, { passive: true });

/*
 * El código original avanza con un click simple sobre el stage. En móvil,
 * el navegador genera un click sintético después de touchend. Lo bloqueamos
 * para que no se produzca un segundo avance accidental.
 */
stage.addEventListener("click", event => {
  if (Date.now() >= suppressTouchClickUntil) return;
  if (event.target.closest("button")) return;

  event.preventDefault();
  event.stopImmediatePropagation();
}, true);

// Evita zoom/acciones secundarias del navegador por doble toque prolongado.
stage.addEventListener("contextmenu", event => {
  if (event.target.closest("button")) return;
  event.preventDefault();
});
