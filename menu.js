/* =========================================================
   MENÚ DE SECCIONES — DISPONIBLE EN EL PRIMER DIÁLOGO
   ========================================================= */

const storyMenuButton = document.createElement("button");
storyMenuButton.type = "button";
storyMenuButton.textContent = "MENÚ";
storyMenuButton.hidden = true;
storyMenuButton.setAttribute("aria-label", "Abrir menú de secciones");
storyMenuButton.title = "Menú de secciones";
Object.assign(storyMenuButton.style, {
  position: "absolute",
  zIndex: "60",
  left: "14.8%",
  top: "67.0%",
  width: "46.8%",
  height: "16.8%",
  border: "4px solid #252323",
  borderRadius: "20px",
  background: "rgba(255,255,255,.94)",
  color: "#252323",
  fontFamily: "inherit",
  fontWeight: "800",
  fontSize: "clamp(20px, 3.2vw, 48px)",
  letterSpacing: ".06em",
  boxShadow: "0 7px 18px rgba(0,0,0,.18)",
  cursor: "pointer",
  touchAction: "manipulation"
});
stage.appendChild(storyMenuButton);

const storyMenuOverlay = document.createElement("div");
storyMenuOverlay.hidden = true;
storyMenuOverlay.setAttribute("role", "dialog");
storyMenuOverlay.setAttribute("aria-modal", "true");
storyMenuOverlay.setAttribute("aria-label", "Menú de secciones");
Object.assign(storyMenuOverlay.style, {
  position: "absolute",
  inset: "0",
  zIndex: "80",
  display: "none",
  alignItems: "center",
  justifyContent: "center",
  background: "rgba(0,0,0,.46)",
  padding: "4%",
  boxSizing: "border-box",
  touchAction: "manipulation"
});
stage.appendChild(storyMenuOverlay);

const storyMenuPanel = document.createElement("div");
Object.assign(storyMenuPanel.style, {
  position: "relative",
  width: "72%",
  maxHeight: "78%",
  overflowY: "auto",
  background: "#ffffff",
  border: "5px solid #252323",
  borderRadius: "26px",
  padding: "3.2% 3.4% 3.0%",
  boxSizing: "border-box",
  boxShadow: "0 12px 28px rgba(0,0,0,.28)"
});
storyMenuOverlay.appendChild(storyMenuPanel);

const storyMenuTitle = document.createElement("div");
storyMenuTitle.textContent = "Ir a una sección";
Object.assign(storyMenuTitle.style, {
  fontSize: "clamp(22px, 3vw, 44px)",
  fontWeight: "800",
  textAlign: "center",
  color: "#252323",
  marginBottom: "2.5%"
});
storyMenuPanel.appendChild(storyMenuTitle);

const storyMenuGrid = document.createElement("div");
Object.assign(storyMenuGrid.style, {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: "12px"
});
storyMenuPanel.appendChild(storyMenuGrid);

const storyMenuHint = document.createElement("div");
storyMenuHint.textContent = "Para acceder al menú, mantén pulsada la pantalla.";
Object.assign(storyMenuHint.style, {
  marginTop: "2.8%",
  paddingTop: "2.2%",
  borderTop: "2px solid rgba(37,35,35,.18)",
  color: "#252323",
  fontFamily: "inherit",
  fontSize: "clamp(13px, 1.55vw, 23px)",
  fontWeight: "600",
  lineHeight: "1.2",
  textAlign: "center"
});
storyMenuPanel.appendChild(storyMenuHint);

const storyMenuClose = document.createElement("button");
storyMenuClose.type = "button";
storyMenuClose.textContent = "✕";
storyMenuClose.setAttribute("aria-label", "Cerrar menú");
Object.assign(storyMenuClose.style, {
  position: "absolute",
  right: "2.2%",
  top: "2.2%",
  width: "8%",
  aspectRatio: "1 / 1",
  border: "0",
  borderRadius: "999px",
  background: "#252323",
  color: "#ffffff",
  fontSize: "clamp(16px, 2vw, 30px)",
  fontWeight: "800",
  cursor: "pointer",
  touchAction: "manipulation"
});
storyMenuPanel.appendChild(storyMenuClose);

function findSceneIndex(predicate, fallback = 1) {
  const index = scenes.findIndex(predicate);
  return index >= 0 ? index : fallback;
}

function getStoryMenuSections() {
  return [
    {
      label: "Introducción",
      index: findSceneIndex((scene, index) => index > 0 && scene.type === "dialogue")
    },
    {
      label: "La fundación",
      index: findSceneIndex(scene => scene.type === "room-map")
    },
    {
      label: "Nuestro personal",
      index: findSceneIndex(scene => scene.type === "dialogue" && scene.text?.includes("nuestro personal"))
    },
    {
      label: "Carta de animal",
      index: findSceneIndex(scene => scene.type === "animal-card")
    },
    {
      label: "Turnos y cuidados",
      index: findSceneIndex(scene => scene.type === "dialogue" && scene.text?.includes("jugar por turnos"))
    },
    {
      label: "Tarjetas de amenaza",
      index: findSceneIndex(scene => scene.type === "threat-card")
    },
    {
      label: "Práctica",
      index: findSceneIndex(scene => scene.type === "practice-board" && scene.practiceStep === "intro")
    },
    {
      label: "Turno de Tatiana",
      index: findSceneIndex(scene => scene.type === "practice-board" && scene.practiceStep === "tatiana-intro")
    },
    {
      label: "Turno de la directora",
      index: findSceneIndex(scene => scene.type === "practice-board" && scene.practiceStep === "director-return")
    }
  ];
}

function closeStoryMenu() {
  storyMenuOverlay.hidden = true;
  storyMenuOverlay.style.display = "none";
}

function jumpToStorySection(index) {
  closeStoryMenu();

  if (!Number.isInteger(index) || index < 0 || index >= scenes.length) return;

  openRoomKey = null;
  sceneIndex = index;
  interactionLockedUntil = 0;
  renderScene();
}

function buildStoryMenu() {
  storyMenuGrid.replaceChildren();

  getStoryMenuSections().forEach(section => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = section.label;
    button.dataset.sceneIndex = String(section.index);
    Object.assign(button.style, {
      minHeight: "58px",
      border: "3px solid #252323",
      borderRadius: "16px",
      background: "#ffffff",
      color: "#252323",
      fontFamily: "inherit",
      fontSize: "clamp(15px, 1.9vw, 28px)",
      fontWeight: "700",
      padding: "10px 12px",
      cursor: "pointer",
      touchAction: "manipulation"
    });

    button.addEventListener("click", event => {
      event.stopPropagation();
      jumpToStorySection(Number(button.dataset.sceneIndex));
    });

    storyMenuGrid.appendChild(button);
  });
}

function openStoryMenu() {
  if (!storyMenuOverlay.hidden) return;

  buildStoryMenu();
  storyMenuOverlay.hidden = false;
  storyMenuOverlay.style.display = "flex";
}

storyMenuButton.addEventListener("click", event => {
  event.stopPropagation();
  openStoryMenu();
});

storyMenuClose.addEventListener("click", event => {
  event.stopPropagation();
  closeStoryMenu();
});

storyMenuOverlay.addEventListener("click", event => {
  event.stopPropagation();
  if (event.target === storyMenuOverlay) closeStoryMenu();
});

["touchstart", "touchmove", "touchend"].forEach(type => {
  storyMenuOverlay.addEventListener(type, event => {
    event.stopPropagation();
  }, { passive: true });
});

/* =========================================================
   ACCESO RÁPIDO AL MENÚ — PULSACIÓN PROLONGADA
   ========================================================= */

const STORY_MENU_LONG_PRESS_MS = 650;
const STORY_MENU_LONG_PRESS_MOVE = 22;

let storyMenuLongPressTimer = null;
let storyMenuLongPressStartX = 0;
let storyMenuLongPressStartY = 0;
let storyMenuLongPressTriggered = false;

function clearStoryMenuLongPress() {
  if (storyMenuLongPressTimer) {
    clearTimeout(storyMenuLongPressTimer);
    storyMenuLongPressTimer = null;
  }
}

stage.addEventListener("touchstart", event => {
  if (!storyMenuOverlay.hidden) return;
  if (event.touches.length !== 1) return;
  if (event.target.closest("button")) return;

  const touch = event.touches[0];
  storyMenuLongPressStartX = touch.clientX;
  storyMenuLongPressStartY = touch.clientY;
  storyMenuLongPressTriggered = false;
  clearStoryMenuLongPress();

  storyMenuLongPressTimer = window.setTimeout(() => {
    storyMenuLongPressTimer = null;
    storyMenuLongPressTriggered = true;

    if (typeof clearPendingSingleTap === "function") {
      clearPendingSingleTap();
    }

    openStoryMenu();
  }, STORY_MENU_LONG_PRESS_MS);
}, { capture: true, passive: true });

stage.addEventListener("touchmove", event => {
  if (!storyMenuLongPressTimer || event.touches.length !== 1) return;

  const touch = event.touches[0];
  const dx = touch.clientX - storyMenuLongPressStartX;
  const dy = touch.clientY - storyMenuLongPressStartY;

  if (Math.hypot(dx, dy) > STORY_MENU_LONG_PRESS_MOVE) {
    clearStoryMenuLongPress();
  }
}, { capture: true, passive: true });

stage.addEventListener("touchend", event => {
  clearStoryMenuLongPress();

  if (!storyMenuLongPressTriggered) return;

  storyMenuLongPressTriggered = false;

  if (typeof clearPendingSingleTap === "function") {
    clearPendingSingleTap();
  }

  event.preventDefault();
  event.stopImmediatePropagation();
}, { capture: true, passive: false });

stage.addEventListener("touchcancel", () => {
  clearStoryMenuLongPress();
  storyMenuLongPressTriggered = false;
}, { capture: true, passive: true });

const firstStoryDialogueIndex = findSceneIndex(
  (scene, index) => index > 0 && scene.type === "dialogue"
);

const baseRenderSceneForStoryMenu = renderScene;
renderScene = function () {
  closeStoryMenu();
  clearStoryMenuLongPress();
  storyMenuLongPressTriggered = false;

  baseRenderSceneForStoryMenu();

  const scene = scenes[sceneIndex];
  storyMenuButton.hidden = !(sceneIndex === firstStoryDialogueIndex && scene?.type === "dialogue");
};

renderScene();
