/* =========================================================
   EXTENSIÓN: TARJETAS DE AMENAZA
   ========================================================= */

scenes.push(
  {
    image: "IMGRV.png",
    type: "vet-treatment",
    text: "Y antes de pasar al siguiente turno, dejemos que Giovanni les explique cómo funcionan las tarjetas de amenaza.",
    treatmentStep: "complete"
  },
  {
    image: "IMGRE.png",
    type: "threat-card",
    threatKey: "S6",
    text: "Acá están nuestras infames tarjetas de amenaza. Toca la parte que quieras que te explique. Te aconsejo empezar por arriba, porque la primera hilera contiene los eventos obligatorios."
  },
  {
    image: "IMGRE1.png",
    type: "threat-card",
    threatKey: "S7",
    text: "Acá tenemos otro ejemplo. Recuerden que la parte superior de la tarjeta siempre se aplica. Y si lanzan el dado dos veces y obtienen el mismo número, esa amenaza solo se hará efectiva una vez. La única excepción son las donaciones, que sí pueden activarse varias veces."
  }
);

const threatTexts = {
  S6: {
    A1: "Este es el ícono de adoptantes. Cada vez que aparezca, deberás sacar un adoptante y colocarlo debajo de las salas. Empezará en la recepción y avanzará a medida que lleguen nuevos adoptantes, hasta que finalmente se vaya. A veces el ícono puede cambiar: pueden llegar dos adoptantes o uno junto con una donación.",
    A2: "Este ícono indica que debes lanzar el dado. Dependiendo de la carta, tendrás que hacerlo 1, 2 o hasta 3 veces. El resultado activará los eventos que estén debajo de esta hilera.",
    A3: "Este es el número de la tarjeta. En este caso tenemos la S6, es decir, Semana 6. Si quieres que la partida vaya aumentando de dificultad poco a poco, ordénalas. Pero si lo tuyo es el caos total... ¡mézclalas todas!",
    A4: "Este es el símbolo de adopción. Si sacas un 1 en el dado, llegará un animalito como rescate de urgencia y tendrá que quedarse en la recepción mientras le buscamos una sala. Recuerda que allí solo puede haber 2 animales; si ya está llena, simplemente ignoraremos esta amenaza.",
    A5: "Este símbolo afecta al afecto y se activa cuando sacas un 2 en el dado. Fíjate en el color de fondo del ícono, porque indica qué sala será afectada. En este caso, es la sala azul. Si hay un animal allí, perderá una ficha fucsia; si no tiene ninguna, recibirá una ficha negra de descuido. Si la sala está vacía, no pasa nada.",
    A6: "Este símbolo afecta a la salud y se activa cuando sacas un 3 en el dado. Fíjate en el color de fondo del ícono, porque indica qué sala será afectada. En este caso, es la sala rosa. Si hay un animal allí, perderá una ficha verde; si no tiene ninguna, recibirá una ficha negra de descuido. Si la sala está vacía, no pasa nada.",
    A7: "Este símbolo afecta a la estimulación y se activa cuando sacas un 4 en el dado. Fíjate en el color de fondo del ícono, porque indica qué sala será afectada. En este caso, es la sala verde. Si hay un animal allí, perderá una ficha azul; si no tiene ninguna, recibirá una ficha negra de descuido. Si la sala está vacía, no pasa nada.",
    A8: "¡Oh, no! Este es el símbolo de descuido. Si sacas un 5, en este caso caerá una ficha negra en la sala rosada, aunque la sala puede cambiar según la tarjeta de amenaza. Y ojo con los descuidos: conviene tratarlos rápido, porque pueden multiplicarse.",
    A9: "Este último símbolo representa un gasto imprevisto. Si aparece, la fundación perderá 1 ficha amarilla. Pero no te asustes, también hay cartas que traen donaciones y pueden ayudarnos a recuperar recursos."
  },
  S7: {
    A1: "Este es el símbolo de factura. Cuando aparezca, el siguiente adoptante entrará a la fila por el lado contrario, mostrando una factura que tendremos que pagar. Si sale de la fila antes de hacerlo, contará como una factura vencida. En este espacio también pueden aparecer donaciones o rescates.",
    A2: "Este ícono indica que debes lanzar el dado. Dependiendo de la carta, tendrás que hacerlo 1, 2 o hasta 3 veces. El resultado activará los eventos que estén debajo de esta hilera.",
    A3: "Este es el número de la tarjeta. En este caso tenemos la S7, es decir, Semana 7. Si quieres que la partida vaya aumentando de dificultad poco a poco, ordénalas. Pero si lo tuyo es el caos total... ¡mézclalas todas!",
    A4: "Este es el símbolo de adopción. Si sacas un 1 en el dado, llegará un animalito como rescate de urgencia y tendrá que quedarse en la recepción mientras le buscamos una sala. Recuerda que allí solo puede haber 2 animales; si ya está llena, simplemente ignoraremos esta amenaza.",
    A5: "Este símbolo afecta a la salud y se activa cuando sacas un 2 en el dado. Fíjate en el color de fondo del ícono, porque indica qué sala será afectada. En este caso, es la sala azul. Si hay un animal allí, perderá una ficha verde; si no tiene ninguna, recibirá una ficha negra de descuido. Si la sala está vacía, no pasa nada.",
    A6: "Este símbolo afecta a la estimulación y se activa cuando sacas un 3 en el dado. Fíjate en el color de fondo del ícono, porque indica qué sala será afectada. En este caso, es la sala rosa. Si hay un animal allí, perderá una ficha azul; si no tiene ninguna, recibirá una ficha negra de descuido. Si la sala está vacía, no pasa nada.",
    A7: "Este símbolo afecta al afecto y se activa cuando sacas un 4 en el dado. Fíjate en el color de fondo del ícono, porque indica qué sala será afectada. En este caso, es la sala verde. Si hay un animal allí, perderá una ficha fucsia; si no tiene ninguna, recibirá una ficha negra de descuido. Si la sala está vacía, no pasa nada.",
    A8: "¡Oh, no! Este es el símbolo de descuido. Si sacas un 5, en este caso caerá una ficha negra en la sala azul, aunque la sala puede cambiar según la tarjeta de amenaza. Y ojo con los descuidos: conviene tratarlos rápido, porque pueden multiplicarse.",
    A9: "Esta vez, el 6 es una donación. Si tienes la suerte de sacarlo, la fundación recibirá 1 ficha amarilla adicional. Además, este es el único símbolo que puede activarse varias veces; los demás solo se hacen efectivos una vez por turno."
  }
};

const threatLayer = document.createElement("div");
threatLayer.setAttribute("aria-label", "Zonas interactivas de la tarjeta de amenaza");
Object.assign(threatLayer.style, {
  position: "absolute",
  inset: "0",
  zIndex: "25",
  display: "none",
  pointerEvents: "auto"
});
stage.appendChild(threatLayer);

/* Coordenadas calculadas con base en el mapeo A1-A9 enviado. */
const threatRects = {
  A1: { left: "25.4%", top: "7.8%", width: "11.6%", height: "24.7%" },
  A2: { left: "37.0%", top: "7.8%", width: "9.1%", height: "24.7%" },
  A3: { left: "46.1%", top: "7.8%", width: "11.4%", height: "24.7%" },
  A4: { left: "25.4%", top: "32.5%", width: "15.9%", height: "18.2%" },
  A5: { left: "41.3%", top: "32.5%", width: "16.2%", height: "18.2%" },
  A6: { left: "25.4%", top: "50.7%", width: "15.9%", height: "18.5%" },
  A7: { left: "41.3%", top: "50.7%", width: "16.2%", height: "18.5%" },
  A8: { left: "25.4%", top: "69.2%", width: "15.9%", height: "23.0%" },
  A9: { left: "41.3%", top: "69.2%", width: "16.2%", height: "23.0%" }
};

const threatButtons = {};
Object.entries(threatRects).forEach(([key, rect]) => {
  const button = document.createElement("button");
  button.type = "button";
  button.dataset.threat = key;
  button.setAttribute("aria-label", `Explicar ${key}`);
  Object.assign(button.style, {
    position: "absolute",
    left: rect.left,
    top: rect.top,
    width: rect.width,
    height: rect.height,
    border: "0",
    padding: "0",
    borderRadius: "10px",
    background: "transparent",
    cursor: "pointer",
    touchAction: "manipulation"
  });
  threatLayer.appendChild(button);
  threatButtons[key] = button;
});

/* Flecha inferior izquierda de IMGRE para pasar a IMGRE1. */
const threatNextHotspot = document.createElement("button");
threatNextHotspot.type = "button";
threatNextHotspot.setAttribute("aria-label", "Continuar a la siguiente tarjeta de amenaza");
threatNextHotspot.title = "Continuar";
Object.assign(threatNextHotspot.style, {
  position: "absolute",
  left: "1.2%",
  top: "80.0%",
  width: "12.0%",
  height: "18.0%",
  border: "0",
  padding: "0",
  background: "transparent",
  cursor: "pointer",
  touchAction: "manipulation"
});
threatLayer.appendChild(threatNextHotspot);

let activeThreatKey = null;

function resetThreatSelection() {
  Object.values(threatButtons).forEach(button => {
    button.style.background = "transparent";
    button.style.boxShadow = "none";
  });
}

function hideThreatLayer() {
  activeThreatKey = null;
  threatLayer.style.display = "none";
  threatNextHotspot.style.display = "none";
  resetThreatSelection();
}

function showThreatLayer(scene) {
  activeThreatKey = scene.threatKey;
  threatLayer.style.display = "block";
  threatNextHotspot.style.display = scene.threatKey === "S6" ? "block" : "none";
}

function applyThreatDialogueLayout() {
  resetDialogueLayout();
  dialogueText.style.left = "64.4%";
  dialogueText.style.top = "14.5%";
  dialogueText.style.width = "34.2%";
  dialogueText.style.height = "71.5%";
  dialogueText.style.padding = "3.4% 2.8% 3.6%";
  dialogueText.style.fontSize = "clamp(11px, calc(1.08vw + 1px), 23px)";
  dialogueText.style.lineHeight = "1.16";
  dialogueText.style.alignItems = "center";
  dialogueText.style.justifyContent = "center";
}

function explainThreat(key) {
  const text = threatTexts[activeThreatKey]?.[key];
  if (!text) return;

  dialogueText.textContent = text;

  Object.entries(threatButtons).forEach(([buttonKey, button]) => {
    const selected = buttonKey === key;
    button.style.background = selected ? "rgba(255, 220, 0, 0.10)" : "transparent";
    button.style.boxShadow = selected ? "inset 0 0 0 4px rgba(255, 204, 0, 0.52)" : "none";
  });
}

function showCompletedRangoTreatment() {
  clearStageAnimations();
  showHealthTokensPlaced();
  affectionToken.style.display = "block";
  affectionToken.style.transition = "none";
  placeAnimatedImage(affectionToken, "19.95%", "40.5%", "6.1%", "1", "1");
}

/* Extiende el render existente sin alterar el resto del tutorial. */
const baseRenderSceneForThreats = renderScene;
renderScene = function () {
  hideThreatLayer();
  baseRenderSceneForThreats();

  const scene = scenes[sceneIndex];
  if (!scene) return;

  if (scene.type === "vet-treatment" && scene.treatmentStep === "complete") {
    applyVetTreatmentDialogueLayout();
    showCompletedRangoTreatment();
  }

  if (scene.type === "threat-card") {
    dialogueText.hidden = false;
    dialogueText.textContent = scene.text;
    applyThreatDialogueLayout();
    showThreatLayer(scene);
    stage.setAttribute(
      "aria-label",
      scene.threatKey === "S6"
        ? "Tarjeta de amenaza interactiva. Toca una zona para conocer su función o usa la flecha inferior izquierda para ver el siguiente ejemplo."
        : "Tarjeta de amenaza interactiva. Toca una zona para conocer su función."
    );
  }
};

/* Las tarjetas de amenaza no avanzan tocando cualquier parte. */
const baseAdvanceSceneForThreats = advanceScene;
advanceScene = function () {
  if (scenes[sceneIndex]?.type === "threat-card") return;
  baseAdvanceSceneForThreats();
};

threatLayer.addEventListener("click", event => {
  event.stopPropagation();
  const button = event.target.closest("button[data-threat]");
  if (button) explainThreat(button.dataset.threat);
});

threatNextHotspot.addEventListener("click", event => {
  event.preventDefault();
  event.stopPropagation();

  if (scenes[sceneIndex]?.type !== "threat-card" || activeThreatKey !== "S6") return;
  if (sceneIndex < scenes.length - 1) {
    sceneIndex += 1;
    renderScene();
  }
});
