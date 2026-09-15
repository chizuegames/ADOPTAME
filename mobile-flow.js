/* =========================================================
   FLUJO MÓVIL — DIÁLOGO ANTES DE ANIMAR + GESTOS
   ========================================================= */

/*
 * En la práctica, primero se muestra el diálogo con calma.
 * Cuando el usuario avanza, el cuadro se retira y SOLO entonces
 * comienza la animación. Al terminar, se pasa automáticamente al
 * siguiente diálogo/estado.
 */

let practicePhaseAnimating = false;
let practiceAutoAdvanceTimer = null;

function clearPracticeAutoAdvance() {
  if (practiceAutoAdvanceTimer) {
    clearTimeout(practiceAutoAdvanceTimer);
    practiceAutoAdvanceTimer = null;
  }
}

function applyMobilePracticeDialogueLayout() {
  // Burbuja mucho más amplia para celular. Puede cubrir el tablero:
  // durante la animación se retira por completo.
  dialogueText.style.zIndex = "45";
  dialogueText.style.left = "12.0%";
  dialogueText.style.top = "65.5%";
  dialogueText.style.width = "76.0%";
  dialogueText.style.height = "26.0%";
  dialogueText.style.padding = "2.2% 3.0%";
  dialogueText.style.fontSize = "clamp(15px, calc(1.35vw + 4px), 30px)";
  dialogueText.style.lineHeight = "1.16";
  dialogueText.style.alignItems = "center";
  dialogueText.style.justifyContent = "center";
  dialogueText.style.background = "#ffffff";
  dialogueText.style.border = "5px solid #111111";
  dialogueText.style.borderRadius = "22px";
  dialogueText.style.color = "#111111";
  dialogueText.style.boxShadow = "0 5px 16px rgba(0,0,0,.18)";
  dialogueText.style.textAlign = "center";
  dialogueText.style.overflow = "hidden";
  dialogueText.style.opacity = "1";
  dialogueText.style.transform = "none";
  dialogueText.style.transition = "none";
}

function renderStaticPracticeStep(scene) {
  if (typeof clearBoardPieces === "function") clearBoardPieces();
  if (typeof hidePracticeLayer === "function") hidePracticeLayer();

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

  // El gesto sustituye la necesidad del botón flotante de volver.
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
   DESLIZAMIENTO HORIZONTAL
   Izquierda = avanzar | Derecha = regresar
   ========================================================= */

let swipeStartX = 0;
let swipeStartY = 0;
let swipeCurrentX = 0;
let swipeCurrentY = 0;
let swipeTracking = false;
let suppressStageClickUntil = 0;

const SWIPE_MIN_DISTANCE = 48;
const SWIPE_AXIS_RATIO = 1.15;

// Permite desplazamiento vertical de la página anfitriona, pero reserva
// el gesto horizontal para la historia.
stage.style.touchAction = "pan-y pinch-zoom";

function canNavigateNow() {
  return !practicePhaseAnimating && Date.now() >= interactionLockedUntil;
}

function advanceWithSwipe() {
  if (!canNavigateNow()) return;

  if (openRoomKey) {
    returnToRoomMap();
    return;
  }

  const scene = scenes[sceneIndex];
  if (!scene) return;

  // En el mapa de salas, deslizar permite seguir sin depender de la flecha.
  if (scene.type === "room-map" && Number.isInteger(scene.skipTo)) {
    skipCurrentPart();
    return;
  }

  // Las tarjetas de amenaza conservan sus zonas táctiles, pero también
  // pueden abandonarse con un deslizamiento hacia la izquierda.
  if (scene.type === "threat-card") {
    if (sceneIndex < scenes.length - 1) {
      sceneIndex += 1;
      renderScene();
    }
    return;
  }

  advanceScene();
}

function backWithSwipe() {
  if (!canNavigateNow()) return;

  if (openRoomKey) {
    returnToRoomMap();
    return;
  }

  previousScene();
}

stage.addEventListener("touchstart", event => {
  if (event.touches.length !== 1) {
    swipeTracking = false;
    return;
  }

  const touch = event.touches[0];
  swipeStartX = touch.clientX;
  swipeStartY = touch.clientY;
  swipeCurrentX = swipeStartX;
  swipeCurrentY = swipeStartY;
  swipeTracking = true;
}, { passive: true });

stage.addEventListener("touchmove", event => {
  if (!swipeTracking || event.touches.length !== 1) return;

  const touch = event.touches[0];
  swipeCurrentX = touch.clientX;
  swipeCurrentY = touch.clientY;

  const dx = swipeCurrentX - swipeStartX;
  const dy = swipeCurrentY - swipeStartY;

  if (Math.abs(dx) > 16 && Math.abs(dx) > Math.abs(dy) * SWIPE_AXIS_RATIO) {
    event.preventDefault();
  }
}, { passive: false });

stage.addEventListener("touchend", event => {
  if (!swipeTracking) return;
  swipeTracking = false;

  const touch = event.changedTouches[0];
  if (touch) {
    swipeCurrentX = touch.clientX;
    swipeCurrentY = touch.clientY;
  }

  const dx = swipeCurrentX - swipeStartX;
  const dy = swipeCurrentY - swipeStartY;
  const horizontal = Math.abs(dx) >= SWIPE_MIN_DISTANCE && Math.abs(dx) > Math.abs(dy) * SWIPE_AXIS_RATIO;

  if (!horizontal) return;

  suppressStageClickUntil = Date.now() + 550;

  if (dx < 0) advanceWithSwipe();
  else backWithSwipe();
}, { passive: true });

stage.addEventListener("touchcancel", () => {
  swipeTracking = false;
}, { passive: true });

// Evita que el navegador convierta el final del swipe en un toque adicional.
stage.addEventListener("click", event => {
  if (Date.now() < suppressStageClickUntil) {
    event.preventDefault();
    event.stopImmediatePropagation();
  }
}, true);
