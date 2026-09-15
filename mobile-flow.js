/* =========================================================
   FLUJO MÓVIL — DIÁLOGO ANTES DE ANIMAR + DOBLE TOQUE
   ========================================================= */

/*
 * En la práctica, primero se muestra el diálogo con calma.
 * Al avanzar, el cuadro se retira y SOLO después comienza la animación.
 * Al terminar, se pasa automáticamente al siguiente diálogo/estado.
 *
 * Navegación táctil:
 * - Doble toque: avanzar.
 * - Mantener pulsado ~700 ms: regresar.
 *
 * Se abandona el gesto de arrastre porque la app suele estar incrustada
 * en otra página y el navegador interpreta el arrastre como desplazamiento.
 */

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
     * IMPORTANTE:
     * La escena estática mostraba las piezas mientras se leía el diálogo.
     * Antes de reconstruir el estado animado hay que borrarlas. De lo
     * contrario quedaba una copia estática de AD16/Lorena en CD y otra
     * copia era la que se desplazaba hacia D1.
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

  // Ya no necesitamos el botón flotante de volver: en táctil se usa
  // pulsación prolongada y en escritorio siguen disponibles las teclas.
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
   Doble toque = avanzar
   Pulsación prolongada = regresar
   ========================================================= */

const DOUBLE_TAP_MAX_DELAY = 360;
const DOUBLE_TAP_MAX_DISTANCE = 56;
const TAP_MAX_MOVEMENT = 18;
const LONG_PRESS_DELAY = 700;

let lastTapTime = 0;
let lastTapX = 0;
let lastTapY = 0;

let touchStartX = 0;
let touchStartY = 0;
let touchStartTime = 0;
let touchMoved = false;
let longPressTimer = null;
let longPressTriggered = false;
let suppressTouchClickUntil = 0;

// "manipulation" permite el desplazamiento normal de la página anfitriona
// y evita que el doble toque se convierta en zoom del navegador.
stage.style.touchAction = "manipulation";
stage.style.userSelect = "none";
stage.style.webkitUserSelect = "none";
stage.style.webkitTouchCallout = "none";

function clearLongPressTimer() {
  if (longPressTimer) {
    clearTimeout(longPressTimer);
    longPressTimer = null;
  }
}

function canNavigateNow() {
  return !practicePhaseAnimating && Date.now() >= interactionLockedUntil;
}

function advanceWithDoubleTap() {
  if (!canNavigateNow()) return;

  if (openRoomKey) {
    returnToRoomMap();
    return;
  }

  const scene = scenes[sceneIndex];
  if (!scene) return;

  // En el mapa de salas el doble toque permite continuar sin depender
  // obligatoriamente de la flecha incorporada en la ilustración.
  if (scene.type === "room-map" && Number.isInteger(scene.skipTo)) {
    skipCurrentPart();
    return;
  }

  // Las amenazas siguen siendo táctiles en A1-A9, pero un doble toque
  // fuera de esos botones permite pasar al siguiente ejemplo.
  if (scene.type === "threat-card") {
    if (sceneIndex < scenes.length - 1) {
      sceneIndex += 1;
      renderScene();
    }
    return;
  }

  advanceScene();
}

function backWithLongPress() {
  if (!canNavigateNow()) return;

  if (openRoomKey) {
    returnToRoomMap();
    return;
  }

  previousScene();
}

stage.addEventListener("touchstart", event => {
  if (event.touches.length !== 1) {
    clearLongPressTimer();
    return;
  }

  // Los botones interactivos conservan su comportamiento normal.
  if (event.target.closest("button")) {
    clearLongPressTimer();
    return;
  }

  const scene = scenes[sceneIndex];

  const touch = event.touches[0];
  touchStartX = touch.clientX;
  touchStartY = touch.clientY;
  touchStartTime = Date.now();
  touchMoved = false;
  longPressTriggered = false;

  // En la portada conservamos "Toca para iniciar" con un solo toque.
  if (scene?.type === "start") return;

  clearLongPressTimer();
  longPressTimer = window.setTimeout(() => {
    if (touchMoved || !canNavigateNow()) return;

    longPressTriggered = true;
    suppressTouchClickUntil = Date.now() + 700;
    lastTapTime = 0;
    backWithLongPress();
  }, LONG_PRESS_DELAY);
}, { passive: true });

stage.addEventListener("touchmove", event => {
  if (event.touches.length !== 1) {
    touchMoved = true;
    clearLongPressTimer();
    return;
  }

  const touch = event.touches[0];
  const dx = touch.clientX - touchStartX;
  const dy = touch.clientY - touchStartY;

  if (Math.hypot(dx, dy) > TAP_MAX_MOVEMENT) {
    touchMoved = true;
    clearLongPressTimer();
  }
}, { passive: true });

stage.addEventListener("touchend", event => {
  clearLongPressTimer();

  const scene = scenes[sceneIndex];

  // La portada mantiene el toque simple original.
  if (scene?.type === "start") {
    lastTapTime = 0;
    return;
  }

  // Los botones (salas, zonas A1-A9, flechas incorporadas, etc.)
  // conservan su click habitual.
  if (event.target.closest("button")) {
    lastTapTime = 0;
    return;
  }

  suppressTouchClickUntil = Date.now() + 600;

  if (longPressTriggered || touchMoved) {
    longPressTriggered = false;
    lastTapTime = 0;
    return;
  }

  const touch = event.changedTouches[0];
  if (!touch) return;

  const now = Date.now();
  const duration = now - touchStartTime;
  if (duration > 420) {
    lastTapTime = 0;
    return;
  }

  const x = touch.clientX;
  const y = touch.clientY;
  const sinceLastTap = now - lastTapTime;
  const distanceFromLastTap = Math.hypot(x - lastTapX, y - lastTapY);

  if (
    lastTapTime > 0 &&
    sinceLastTap <= DOUBLE_TAP_MAX_DELAY &&
    distanceFromLastTap <= DOUBLE_TAP_MAX_DISTANCE
  ) {
    lastTapTime = 0;
    advanceWithDoubleTap();
    return;
  }

  lastTapTime = now;
  lastTapX = x;
  lastTapY = y;
}, { passive: true });

stage.addEventListener("touchcancel", () => {
  clearLongPressTimer();
  touchMoved = false;
  longPressTriggered = false;
  lastTapTime = 0;
}, { passive: true });

/*
 * El código original avanza con un click simple sobre el stage. En móvil,
 * los navegadores generan un click sintético después del touchend. Lo
 * bloqueamos únicamente durante unos milisegundos después de un toque;
 * así el mouse en escritorio continúa funcionando normalmente.
 */
stage.addEventListener("click", event => {
  if (Date.now() >= suppressTouchClickUntil) return;
  if (event.target.closest("button")) return;

  event.preventDefault();
  event.stopImmediatePropagation();
}, true);

// Evita el menú contextual del navegador durante la pulsación prolongada.
stage.addEventListener("contextmenu", event => {
  if (event.target.closest("button")) return;
  event.preventDefault();
});
