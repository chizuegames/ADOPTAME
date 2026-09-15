/* =========================================================
   PRUEBA DE CUADRO DE DIÁLOGO RE — SOLO DESDE LA PRÁCTICA
   ========================================================= */

/*
 * Todo lo anterior a “¡Perfecto! Ahora que ya conoces cómo funciona todo...”
 * queda intacto. Desde las escenas practice-board usamos RE.png como marco
 * visual del diálogo. El texto se coloca encima de su zona blanca y tanto
 * marco como texto desaparecen antes de iniciar las animaciones.
 *
 * IMPORTANTE: RE.png conserva siempre su proporción original. No se estira
 * horizontal ni verticalmente. El área de texto es una capa independiente.
 */

const practiceSpeakerBox = document.createElement("img");
practiceSpeakerBox.src = "RE.png";
practiceSpeakerBox.alt = "";
practiceSpeakerBox.draggable = false;
practiceSpeakerBox.setAttribute("aria-hidden", "true");
Object.assign(practiceSpeakerBox.style, {
  position: "absolute",
  zIndex: "44",
  display: "none",
  left: "3.0%",
  top: "67.0%",
  width: "74.0%",
  height: "auto",
  objectFit: "contain",
  opacity: "1",
  transform: "none",
  transformOrigin: "center center",
  pointerEvents: "none"
});
stage.appendChild(practiceSpeakerBox);

const practiceSpeakerPreload = new Image();
practiceSpeakerPreload.src = "RE.png";

function showPracticeSpeakerBox() {
  practiceSpeakerBox.style.display = "block";
  practiceSpeakerBox.style.opacity = "1";
  practiceSpeakerBox.style.transform = "none";
  practiceSpeakerBox.style.transition = "none";
}

function hidePracticeSpeakerBox(immediate = false) {
  if (immediate) {
    practiceSpeakerBox.style.display = "none";
    practiceSpeakerBox.style.opacity = "0";
    practiceSpeakerBox.style.transform = "none";
    practiceSpeakerBox.style.transition = "none";
    return;
  }

  practiceSpeakerBox.style.transition = "opacity 160ms ease, transform 160ms ease";
  practiceSpeakerBox.style.opacity = "0";
  practiceSpeakerBox.style.transform = "scale(.97)";

  window.setTimeout(() => {
    practiceSpeakerBox.style.display = "none";
    practiceSpeakerBox.style.transition = "none";
    practiceSpeakerBox.style.transform = "none";
  }, 190);
}

/*
 * El texto es una capa independiente colocada sobre la zona blanca marcada
 * en la referencia. Así podemos aprovechar casi todo el espacio útil sin
 * deformar la ilustración del cuadro de diálogo.
 */
applyMobilePracticeDialogueLayout = function () {
  dialogueText.style.zIndex = "45";
  dialogueText.style.left = "19.6%";
  dialogueText.style.top = "69.1%";
  dialogueText.style.width = "55.0%";
  dialogueText.style.height = "23.8%";
  dialogueText.style.padding = "1.1% 1.6%";
  dialogueText.style.boxSizing = "border-box";
  dialogueText.style.fontSize = "clamp(15px, calc(1.18vw + 3px), 27px)";
  dialogueText.style.lineHeight = "1.15";
  dialogueText.style.alignItems = "center";
  dialogueText.style.justifyContent = "center";
  dialogueText.style.background = "transparent";
  dialogueText.style.border = "0";
  dialogueText.style.borderRadius = "0";
  dialogueText.style.color = "#111111";
  dialogueText.style.boxShadow = "none";
  dialogueText.style.textAlign = "center";
  dialogueText.style.overflow = "hidden";
  dialogueText.style.overflowWrap = "break-word";
  dialogueText.style.wordBreak = "normal";
  dialogueText.style.opacity = "1";
  dialogueText.style.transform = "none";
  dialogueText.style.transition = "none";
};

/*
 * La función ya existente retira el texto antes de animar. La envolvemos
 * para retirar al mismo tiempo RE.png.
 */
const baseHidePracticeDialogueBeforeAnimationForRE = hidePracticeDialogueBeforeAnimation;
hidePracticeDialogueBeforeAnimation = function (callback) {
  hidePracticeSpeakerBox(false);
  baseHidePracticeDialogueBeforeAnimationForRE(callback);
};

/*
 * Se carga al final de la cadena de render. Solo practice-board muestra RE.
 * Por tanto, todos los diálogos previos conservan exactamente su diseño.
 */
const baseRenderSceneForPracticeSpeakerBox = renderScene;
renderScene = function () {
  hidePracticeSpeakerBox(true);

  baseRenderSceneForPracticeSpeakerBox();

  const scene = scenes[sceneIndex];
  if (!scene || scene.type !== "practice-board") return;

  if (scene.practiceStep === "after-roll" || !scene.text) {
    hidePracticeSpeakerBox(true);
    return;
  }

  showPracticeSpeakerBox();
  dialogueText.hidden = false;
  dialogueText.textContent = scene.text;
  applyMobilePracticeDialogueLayout();
};
