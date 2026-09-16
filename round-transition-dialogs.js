/* =========================================================
   TRANSICIÓN ENTRE RONDAS — CONTINUACIÓN DEL TUTORIAL
   ========================================================= */

/*
 * Después de resolver el resultado 2 y dejar AS9 activa en CE,
 * continuamos con tres diálogos explicativos antes de seguir con
 * los nuevos retos de la tercera ronda.
 */

const roundTransitionValentinaSceneIndex = scenes.length;
scenes.push({
  image: "IMGBE3.png",
  type: "practice-board",
  practiceStep: "round-transition-valentina",
  text: "Una vez resueltas las amenazas, pasamos a la siguiente carta y comienza nuevamente el turno de Valentina."
});

const roundTransitionThirdRoundSceneIndex = scenes.length;
scenes.push({
  image: "IMGBE3.png",
  type: "practice-board",
  practiceStep: "round-transition-third-round",
  text: "En este ejemplo completamos la segunda ronda. En la tercera aparecerán nuevos retos, así que jugaremos solo el primer turno para que puedan conocer las siguientes cartas de amenaza."
});

const roundTransitionWeekNineSceneIndex = scenes.length;
scenes.push({
  image: "IMGBE3.png",
  type: "practice-board",
  practiceStep: "round-transition-week-nine",
  text: "Recuerden que la partida dura 16 semanas, lo que equivale a 4 turnos por cada rol. Nosotros ya estamos en la semana 9."
});

function renderRoundTransitionBoard() {
  renderDirectorRoundEndBoard({
    adoptersAdvanced: true,
    diceFace: 2,
    roundResolved: true
  });
  setSceneImage("IMGBE3.png", "Tablero al inicio de la siguiente etapa del tutorial");
}

/* =========================================================
   RENDER
   ========================================================= */

const baseRenderSceneForRoundTransition = renderScene;
renderScene = function () {
  const current = scenes[sceneIndex];

  /*
   * La escena director-round-resolved era silenciosa. Ahora, al terminar la
   * animación anterior, mostramos directamente el siguiente diálogo.
   */
  if (current?.practiceStep === "director-round-resolved") {
    sceneIndex = roundTransitionValentinaSceneIndex;
    interactionLockedUntil = 0;
    renderScene();
    return;
  }

  baseRenderSceneForRoundTransition();

  const scene = scenes[sceneIndex];
  if (!scene || scene.type !== "practice-board") return;

  if (scene.practiceStep === "round-transition-valentina") {
    renderRoundTransitionBoard();
    showSpeakerDialogue("RD.png", scene);
    stage.setAttribute(
      "aria-label",
      "Las amenazas quedaron resueltas y comienza nuevamente el turno de Valentina. Toca para continuar."
    );
    return;
  }

  if (scene.practiceStep === "round-transition-third-round") {
    renderRoundTransitionBoard();
    showSpeakerDialogue("RD.png", scene);
    stage.setAttribute(
      "aria-label",
      "El ejemplo da por completada la segunda ronda y explica que en la tercera solo se jugará el primer turno. Toca para continuar."
    );
    return;
  }

  if (scene.practiceStep === "round-transition-week-nine") {
    renderRoundTransitionBoard();
    showSpeakerDialogue("RD.png", scene);
    stage.setAttribute(
      "aria-label",
      "La partida dura 16 semanas, cuatro turnos por rol, y el tutorial se encuentra en la semana 9."
    );
  }
};

/* =========================================================
   AVANCE
   ========================================================= */

const baseAdvanceSceneForRoundTransition = advanceScene;
advanceScene = function () {
  const scene = scenes[sceneIndex];

  if (scene?.practiceStep === "round-transition-valentina") {
    sceneIndex = roundTransitionThirdRoundSceneIndex;
    interactionLockedUntil = 0;
    renderScene();
    return;
  }

  if (scene?.practiceStep === "round-transition-third-round") {
    sceneIndex = roundTransitionWeekNineSceneIndex;
    interactionLockedUntil = 0;
    renderScene();
    return;
  }

  /* Dejamos la semana 9 como punto actual hasta agregar la siguiente parte. */
  if (scene?.practiceStep === "round-transition-week-nine") return;

  baseAdvanceSceneForRoundTransition();
};

/* =========================================================
   RETROCESO
   ========================================================= */

const basePreviousSceneForRoundTransition = previousScene;
previousScene = function () {
  if (Date.now() < interactionLockedUntil) return;

  const scene = scenes[sceneIndex];

  if (scene?.practiceStep === "round-transition-valentina") {
    sceneIndex = directorRoundDieTwoSceneIndex;
    renderScene();
    return;
  }

  if (scene?.practiceStep === "round-transition-third-round") {
    sceneIndex = roundTransitionValentinaSceneIndex;
    renderScene();
    return;
  }

  if (scene?.practiceStep === "round-transition-week-nine") {
    sceneIndex = roundTransitionThirdRoundSceneIndex;
    renderScene();
    return;
  }

  basePreviousSceneForRoundTransition();
};
