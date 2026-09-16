/* =========================================================
   COMPARACIÓN DE ADOPCIÓN — RANGO + LORENA
   ========================================================= */

/*
 * Ajusta la adopción de Rango para que, antes de explicar la recompensa,
 * el jugador pueda comparar las dos cartas grandes una al lado de la otra.
 *
 * Secuencia:
 * 1) Rango llega a D3 debajo de Lorena.
 * 2) Se muestran Rango y Lorena grandes, lado a lado, sobre el diálogo.
 * 3) Al tocar, Rango grande se retira y Lorena queda centrada.
 * 4) Se explica la recompensa y luego continúa la animación ya existente:
 *    fichas rosa/verde Q -> F y Lorena + Rango salen por la derecha.
 */

const directorAdoptionComparisonSceneIndex = scenes.length;
scenes.push({
  image: "IMGBE3.png",
  type: "practice-board",
  practiceStep: "director-adoption-comparison",
  text: "Como podemos ver, Lorena cuenta con todo lo necesario para cuidar de Rango. Esperamos que juntos tengan una vida muy feliz en su nuevo hogar."
});

/* =========================================================
   CARTA GRANDE DE RANGO
   ========================================================= */

const directorRangoLargeCard = document.createElement("img");
directorRangoLargeCard.src = "AF17s.png";
directorRangoLargeCard.alt = "Carta de Rango ampliada";
directorRangoLargeCard.draggable = false;
directorRangoLargeCard.hidden = true;
Object.assign(directorRangoLargeCard.style, {
  position: "absolute",
  zIndex: "49",
  left: "31.8%",
  top: "10.5%",
  width: "15.8%",
  height: "auto",
  objectFit: "contain",
  pointerEvents: "none",
  filter: "drop-shadow(0 10px 18px rgba(0,0,0,.28))"
});
stage.appendChild(directorRangoLargeCard);

const directorRangoPreload = new Image();
directorRangoPreload.src = "AF17s.png";

function setDirectorLargeCardComparisonLayout() {
  directorRangoLargeCard.hidden = false;
  Object.assign(directorRangoLargeCard.style, {
    left: "31.8%",
    top: "10.5%",
    width: "15.8%",
    opacity: "1",
    transition: "none"
  });

  directorLorenaLargeCard.hidden = false;
  Object.assign(directorLorenaLargeCard.style, {
    left: "52.4%",
    top: "10.5%",
    width: "15.8%",
    opacity: "1",
    transition: "none"
  });
}

function setDirectorLorenaCenteredLayout() {
  directorRangoLargeCard.hidden = true;

  directorLorenaLargeCard.hidden = false;
  Object.assign(directorLorenaLargeCard.style, {
    left: "42.1%",
    top: "10.5%",
    width: "15.8%",
    opacity: "1",
    transition: "none"
  });
}

/* =========================================================
   RANGO: A2 -> D3, DEBAJO DE LORENA
   Ahora termina en la escena de comparación.
   ========================================================= */

animateRangoToLorena = function () {
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
      finishDirectorContinuationAnimation(directorAdoptionComparisonSceneIndex);
    }, 1390);
  };

  hidePracticeDialogueBeforeAnimation(beginAnimation);
};

/* =========================================================
   RENDER
   ========================================================= */

const baseRenderSceneForAdoptionComparison = renderScene;
renderScene = function () {
  directorRangoLargeCard.hidden = true;

  /* Restauramos la posición base de Lorena antes de delegar el render. */
  Object.assign(directorLorenaLargeCard.style, {
    left: "61.8%",
    top: "35.5%",
    width: "13.5%",
    opacity: "1",
    transition: "none"
  });

  baseRenderSceneForAdoptionComparison();

  const scene = scenes[sceneIndex];
  if (!scene || scene.type !== "practice-board") return;

  if (scene.practiceStep === "director-adoption-comparison") {
    renderDirectorContinuationBoard({
      diceFace: 1,
      rescuePlaced: true,
      invoicePaid: true,
      rangoQueued: true
    });
    showSpeakerDialogue("RD.png", scene);
    setDirectorLargeCardComparisonLayout();
    stage.setAttribute(
      "aria-label",
      "Compara las cartas ampliadas de Rango y Lorena. Ambos cumplen los requisitos necesarios para completar la adopción."
    );
    return;
  }

  if (scene.practiceStep === "director-adoption-reward") {
    /*
     * El render base conserva el diálogo de recompensa. En esta segunda
     * pantalla retiramos Rango y dejamos únicamente a Lorena centrada.
     */
    setDirectorLorenaCenteredLayout();
    stage.setAttribute(
      "aria-label",
      "La carta de Lorena queda centrada para mostrar la recompensa de la adopción: una ficha rosa y una verde."
    );
  }
};

/* =========================================================
   AVANCE
   ========================================================= */

const baseAdvanceSceneForAdoptionComparison = advanceScene;
advanceScene = function () {
  const scene = scenes[sceneIndex];

  if (directorContinuationAnimationRunning) return;

  if (scene?.practiceStep === "director-adoption-comparison") {
    sceneIndex = directorAdoptionRewardSceneIndex;
    interactionLockedUntil = 0;
    renderScene();
    return;
  }

  baseAdvanceSceneForAdoptionComparison();
};

/* =========================================================
   RETROCESO
   ========================================================= */

const basePreviousSceneForAdoptionComparison = previousScene;
previousScene = function () {
  if (directorContinuationAnimationRunning || Date.now() < interactionLockedUntil) return;

  const scene = scenes[sceneIndex];

  if (scene?.practiceStep === "director-adoption-comparison") {
    sceneIndex = directorAdoptionPlanSceneIndex;
    renderScene();
    return;
  }

  if (scene?.practiceStep === "director-adoption-reward") {
    sceneIndex = directorAdoptionComparisonSceneIndex;
    renderScene();
    return;
  }

  basePreviousSceneForAdoptionComparison();
};
