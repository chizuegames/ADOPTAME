/* Tarjetas de amenaza interactivas: S6 (IMGRE) y S7 (IMGRE1). */

const threatStartIndex = scenes.length;

scenes.push(
  {
    image: "IMGRV.png",
    type: "vet-treatment",
    treatmentStep: "complete",
    text: "Y antes de pasar al siguiente turno, dejemos que Giovanni les explique cómo funcionan las tarjetas de amenaza."
  },
  {
    image: "IMGRE.png",
    type: "threat-card",
    threatKey: "S6",
    text: "Acá están nuestras infames tarjetas de amenaza. Toca la parte que quieras que te explique. Te aconsejo empezar por arriba, porque la primera hilera contiene los eventos obligatorios.",
    skipTo: threatStartIndex + 2
  },
  {
    image: "IMGRE1.png",
    type: "threat-card",
    threatKey: "S7",
    text: "Acá tenemos otro ejemplo. Recuerden que la parte superior de la tarjeta siempre se aplica. Y si lanzan el dado dos veces y obtienen el mismo número, esa amenaza solo se hará efectiva una vez. La única excepción son las donaciones, que sí pueden activarse varias veces."
  }
);

const threatCardTexts = {
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

/* Porcentajes calculados sobre el mismo escenario 16:9 usado por el tutorial. */
const threatAreas = {
  A1: { left: 25.4, top: 7.6, width: 11.7, height: 24.8 },
  A2: { left: 37.1, top: 7.6, width: 9.0, height: 24.8 },
  A3: { left: 46.1, top: 7.6, width: 11.3, height: 24.8 },
  A4: { left: 25.4, top: 32.5, width: 15.9, height: 18.4 },
  A5: { left: 41.3, top: 32.5, width: 16.1, height: 18.4 },
  A6: { left: 25.4, top: 50.9, width: 15.9, height: 18.4 },
  A7: { left: 41.3, top: 50.9, width: 16.1, height: 18.4 },
  A8: { left: 25.4, top: 69.3, width: 15.9, height: 22.8 },
  A9: { left: 41.3, top: 69.3, width: 16.1, height: 22.8 }
};

const threatLayer = document.createElement("div");
threatLayer.hidden = true;
threatLayer.setAttribute("aria-label", "Zonas de la tarjeta de amenaza");
Object.assign(threatLayer.style, {
  position: "absolute",
  inset: "0",
  zIndex: "18",
  pointerEvents: "auto"
});
stage.appendChild(threatLayer);

const threatButtons = {};
Object.entries(threatAreas).forEach(([key, area]) => {
  const button = document.createElement("button");
  button.type = "button";
  button.dataset.threatArea = key;
  button.setAttribute("aria-label", `Explicar ${key}`);
  Object.assign(button.style, {
    position: "absolute",
    left: `${area.left}%`,
    top: `${area.top}%`,
    width: `${area.width}%`,
    height: `${area.height}%`,
    border: "0",
    padding: "0",
    borderRadius: "12px",
    background: "transparent",
    boxShadow: "none",
    cursor: "pointer",
    touchAction: "manipulation"
  });
  threatLayer.appendChild(button);
  threatButtons[key] = button;
});

let activeThreatCard = null;

function hideThreatLayer() {
  activeThreatCard = null;
  threatLayer.hidden = true;
  Object.values(threatButtons).forEach(button => {
    button.style.background = "transparent";
    button.style.boxShadow = "none";
  });
}

function showThreatLayer(scene) {
  activeThreatCard = scene.threatKey;
  threatLayer.hidden = false;
}

function applyThreatDialogueLayout() {
  resetDialogueLayout();
  dialogueText.style.left = "64.6%";
  dialogueText.style.top = "13.7%";
  dialogueText.style.width = "33.6%";
  dialogueText.style.height = "72.5%";
  dialogueText.style.padding = "4% 3%";
  dialogueText.style.fontSize = "clamp(11px, calc(1.05vw + 2px), 24px)";
  dialogueText.style.lineHeight = "1.15";
  dialogueText.style.alignItems = "center";
  dialogueText.style.justifyContent = "center";
}

function showCompletedRangoCare() {
  clearStageAnimations();
  showHealthTokensPlaced();
  affectionToken.style.display = "block";
  affectionToken.style.transition = "none";
  placeAnimatedImage(affectionToken, "19.95%", "40.5%", "6.1%", "1", "1");
}

const baseRenderScene = renderScene;
renderScene = function () {
  hideThreatLayer();
  const scene = scenes[sceneIndex];

  baseRenderScene();

  if (scene.type === "vet-treatment" && scene.treatmentStep === "complete") {
    applyVetTreatmentDialogueLayout();
    showCompletedRangoCare();
  }

  if (scene.type !== "threat-card") return;

  dialogueText.hidden = false;
  dialogueText.textContent = scene.text;
  applyThreatDialogueLayout();
  showThreatLayer(scene);

  previousButton.hidden = false;

  /* IMGRE tiene una flecha dibujada abajo a la izquierda para pasar a IMGRE1. */
  if (Number.isInteger(scene.skipTo)) {
    skipButton.hidden = false;
    skipButton.dataset.action = "skip";
    skipButton.classList.remove("skip-img1", "skip-img2");
    skipButton.style.left = "1.8%";
    skipButton.style.top = "81.5%";
    skipButton.style.width = "13%";
    skipButton.style.height = "16%";
  } else {
    skipButton.hidden = true;
  }

  stage.setAttribute(
    "aria-label",
    "Tarjeta de amenaza interactiva. Toca una zona de la tarjeta para leer su explicación."
  );
};

const baseAdvanceScene = advanceScene;
advanceScene = function () {
  if (scenes[sceneIndex]?.type === "threat-card") return;
  baseAdvanceScene();
};

threatLayer.addEventListener("click", event => {
  const button = event.target.closest("button[data-threat-area]");
  if (!button || !activeThreatCard) return;

  event.stopPropagation();
  const area = button.dataset.threatArea;
  const text = threatCardTexts[activeThreatCard]?.[area];
  if (!text) return;

  dialogueText.textContent = text;

  Object.entries(threatButtons).forEach(([key, item]) => {
    const selected = key === area;
    item.style.background = selected ? "rgba(255, 218, 0, 0.16)" : "transparent";
    item.style.boxShadow = selected
      ? "inset 0 0 0 4px rgba(255, 190, 0, 0.72)"
      : "none";
  });
});
