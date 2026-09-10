const scenes = [
  { image: "IMGI.png", type: "start", text: "Toca para iniciar" },
  {
    image: "IMG1.png",
    type: "dialogue",
    text: "¡Hola, amigos! Y bienvenidos a la Fundación Corazón Peludito.",
    skipTo: 3,
    skipClass: "skip-img1"
  },
  {
    image: "IMG1.png",
    type: "dialogue",
    text: "Hoy vamos a jugar el modo historia de Adóptame y, de paso, aprenderemos algunas cosillas por el camino.",
    skipTo: 3,
    skipClass: "skip-img1"
  },
  {
    image: "IMG2.png",
    type: "room-map",
    text: "¡Así se ve nuestra fundación! Toca cualquiera de sus cuartos para descubrir qué función cumple.",
    skipTo: 4,
    skipClass: "skip-img2"
  },
  {
    image: "IMG1.png",
    type: "dialogue",
    text: "También sería bueno que conozcan a nuestro personal, y acá están...",
    skipTo: 5,
    skipClass: "skip-img1"
  },
  { image: "IMGR1.png", type: "staff", text: "" },
  { image: "IMGR2.png", type: "staff", text: "" },
  { image: "IMGR3.png", type: "staff", text: "" },
  { image: "IMGR4.png", type: "staff", text: "" },
  {
    image: "IMG1.png",
    type: "dialogue",
    text: "Bueno, ahora que ya conocemos la fundación y a nuestro equipo, vamos a conocer las cartas de los animales...",
    skipTo: 10,
    skipClass: "skip-img1"
  },
  {
    image: "IMG3.png",
    type: "animal-card",
    text: "Acá tenemos a Rango, la iguana. Como pueden ver, está en blanco y negro, y eso significa que necesita nuestra ayuda."
  },
  {
    image: "IMG3.png",
    type: "animal-card",
    text: "En la parte superior veremos el nombre del animal y, debajo, su personalidad. En este caso, Rango es flojo. Esto será importante, porque podremos encontrarle un adoptante que comparta su personalidad.",
    highlights: ["name", "trait"]
  },
  {
    image: "IMG3.png",
    type: "animal-card",
    text: "Ahora, si miramos la parte lateral izquierda, veremos las necesidades del animal. En este caso, Rango necesita estimulación, afecto y dos cuidados de salud, representados por los íconos verdes.",
    highlights: ["needs"]
  },
  {
    image: "IMG3.png",
    type: "animal-card",
    text: "En la parte inferior veremos los requisitos de tenencia: dinero, espacio y tiempo. El adoptante deberá tener esa cantidad o más para poder adoptar al animal.",
    highlights: ["requirements"]
  },
  {
    image: "IMG1.png",
    type: "dialogue",
    text: "Antes de continuar, recuerden que vamos a jugar por turnos. Yo ocuparé el último, así que dejemos que Valentina nos muestre qué hacer primero."
  },
  {
    image: "IMG3V.png",
    type: "animal-card",
    text: "Rango necesita más cuidados de salud que cualquier otra cosa, así que lo mejor será llevarlo al consultorio veterinario. Allí podré empezar a tratarlo."
  },
  {
    image: "IMG2V.png",
    type: "room-demo",
    text: "Primero tomaremos a Rango y lo llevaremos a la habitación que necesitamos. En este caso, al consultorio veterinario.",
    animateRango: true
  },
  {
    image: "IMGRV.png",
    type: "vet-treatment",
    text: "Ahora que Rango está en el consultorio, usaré mi primera acción para cubrir sus necesidades de salud. Como está en esta sala, puedo cubrir 2 necesidades de salud con una sola acción, colocando las fichas verdes sobre ellas. En cualquier otra sala solo podría cubrir una.",
    treatmentStep: "health"
  },
  {
    image: "IMGRV.png",
    type: "vet-treatment",
    text: "Todavía me queda una acción, así que voy a aprovecharla para cubrir una necesidad de afecto. De esta forma, el siguiente jugador solo tendrá que cubrir una más y Rango quedará listo para ser adoptado.",
    treatmentStep: "affection"
  }
];

const rooms = {
  reception: { name: "Recepción", image: "IMGS1.png" },
  stimulation: { name: "Sala de estimulación", image: "IMGS2.png" },
  vet: { name: "Consultorio veterinario", image: "IMGS3.png" },
  rest: { name: "Sala de descanso", image: "IMGS4.png" },
  office: { name: "Oficina / Sala extra", image: "IMGS5.png" },
  break: { name: "Sala de receso", image: "IMGS6.png" }
};

const stage = document.getElementById("stage");
const sceneImage = document.getElementById("sceneImage");
const startPrompt = document.getElementById("startPrompt");
const dialogueText = document.getElementById("dialogueText");
const roomHotspots = document.getElementById("roomHotspots");
const roomBack = document.getElementById("roomBack");
const skipButton = document.getElementById("skipButton");
const bgMusic = document.getElementById("bgMusic");
const musicToggle = document.getElementById("musicToggle");
const previousButton = document.getElementById("previousButton");

const cardHighlights = {
  name: document.getElementById("animalNameHighlight"),
  trait: document.getElementById("animalTraitHighlight"),
  needs: document.getElementById("animalNeedsHighlight"),
  requirements: document.getElementById("animalRequirementsHighlight")
};

const staffBackHotspot = document.createElement("button");
staffBackHotspot.type = "button";
staffBackHotspot.hidden = true;
staffBackHotspot.setAttribute("aria-label", "Volver a la presentación anterior");
staffBackHotspot.title = "Volver";
Object.assign(staffBackHotspot.style, {
  position: "absolute",
  zIndex: "19",
  border: "0",
  padding: "0",
  background: "transparent",
  cursor: "pointer",
  touchAction: "manipulation",
  left: "81.0%",
  top: "78.6%",
  width: "8.0%",
  height: "16.5%"
});
stage.appendChild(staffBackHotspot);

function createAnimatedImage(src, alt, width = "6.1%") {
  const image = document.createElement("img");
  image.src = src;
  image.alt = alt;
  image.draggable = false;
  image.setAttribute("aria-hidden", "true");
  Object.assign(image.style, {
    position: "absolute",
    zIndex: "20",
    display: "none",
    pointerEvents: "none",
    width,
    height: "auto",
    opacity: "0",
    transform: "scale(0.72)",
    filter: "drop-shadow(0 5px 8px rgba(0,0,0,.22))"
  });
  stage.appendChild(image);
  return image;
}

const rangoMini = createAnimatedImage("rangomini.png", "Carta mini de Rango", "11.2%");
const healthToken1 = createAnimatedImage("FVR.png", "Ficha verde de salud");
const healthToken2 = createAnimatedImage("FVR.png", "Ficha verde de salud");
const affectionToken = createAnimatedImage("FFC.png", "Ficha fucsia de afecto");

let sceneIndex = 0;
let currentImage = "";
let openRoomKey = null;
let musicStarted = false;
let interactionLockedUntil = 0;
let animationTimers = [];

bgMusic.volume = 0.14;

const imagesToPreload = [
  ...scenes.map(scene => scene.image),
  ...Object.values(rooms).map(room => room.image),
  "rangomini.png",
  "FVR.png",
  "FFC.png"
];

[...new Set(imagesToPreload)].forEach(src => {
  const img = new Image();
  img.src = src;
});

function setSceneImage(src, alt) {
  if (src !== currentImage) {
    sceneImage.src = src;
    currentImage = src;
  }
  sceneImage.alt = alt;
}

function hideAllCardHighlights() {
  Object.values(cardHighlights).forEach(element => {
    if (element) element.hidden = true;
  });
}

function applyAnimalHighlights(scene) {
  hideAllCardHighlights();
  if (!Array.isArray(scene.highlights)) return;

  scene.highlights.forEach(name => {
    const element = cardHighlights[name];
    if (element) element.hidden = false;
  });
}

function resetDialogueLayout() {
  dialogueText.style.left = "";
  dialogueText.style.top = "";
  dialogueText.style.width = "";
  dialogueText.style.height = "";
  dialogueText.style.padding = "";
  dialogueText.style.fontSize = "";
  dialogueText.style.lineHeight = "";
  dialogueText.style.alignItems = "";
  dialogueText.style.justifyContent = "";
}

function applyVetTreatmentDialogueLayout() {
  resetDialogueLayout();
  dialogueText.style.left = "64.6%";
  dialogueText.style.top = "13.7%";
  dialogueText.style.width = "33.6%";
  dialogueText.style.height = "72.5%";
  dialogueText.style.padding = "4.2% 3.2% 4.4%";
  dialogueText.style.fontSize = "clamp(13px, calc(1.35vw + 2px), 28px)";
  dialogueText.style.lineHeight = "1.18";
  dialogueText.style.alignItems = "center";
  dialogueText.style.justifyContent = "center";
}

function addTimer(delay, callback) {
  const timer = setTimeout(callback, delay);
  animationTimers.push(timer);
}

function clearAnimationTimers() {
  animationTimers.forEach(timer => clearTimeout(timer));
  animationTimers = [];
}

function hideAnimatedImage(image) {
  image.style.transition = "none";
  image.style.display = "none";
  image.style.opacity = "0";
  image.style.transform = "scale(0.72)";
}

function clearStageAnimations() {
  clearAnimationTimers();
  [rangoMini, healthToken1, healthToken2, affectionToken].forEach(hideAnimatedImage);
}

function placeAnimatedImage(image, left, top, width, opacity = "1", scale = "1") {
  image.style.left = left;
  image.style.top = top;
  image.style.width = width;
  image.style.opacity = opacity;
  image.style.transform = `scale(${scale})`;
}

function animateImageTo(image, { delay, startLeft, startTop, endLeft, endTop, width = "6.1%", duration = 900 }) {
  image.style.display = "block";
  image.style.transition = "none";
  placeAnimatedImage(image, startLeft, startTop, width, "0", "0.72");

  addTimer(delay, () => {
    image.style.transition = "opacity 180ms ease, transform 180ms ease";
    image.style.opacity = "1";
    image.style.transform = "scale(1)";
  });

  addTimer(delay + 260, () => {
    image.style.transition = [
      `left ${duration}ms cubic-bezier(0.22, 1, 0.36, 1)`,
      `top ${duration}ms cubic-bezier(0.22, 1, 0.36, 1)`,
      `transform ${duration}ms cubic-bezier(0.22, 1, 0.36, 1)`
    ].join(", ");
    placeAnimatedImage(image, endLeft, endTop, width, "1", "1");
  });
}

function animateRangoToVet() {
  clearStageAnimations();
  rangoMini.style.display = "block";
  rangoMini.style.transition = "none";
  placeAnimatedImage(rangoMini, "4.5%", "70%", "11.2%", "0", "0.85");

  addTimer(80, () => {
    rangoMini.style.transition = "opacity 180ms ease, transform 180ms ease";
    rangoMini.style.opacity = "1";
    rangoMini.style.transform = "scale(1)";
  });

  addTimer(420, () => {
    rangoMini.style.transition = [
      "left 1200ms cubic-bezier(0.22, 1, 0.36, 1)",
      "top 1200ms cubic-bezier(0.22, 1, 0.36, 1)",
      "width 1200ms cubic-bezier(0.22, 1, 0.36, 1)",
      "transform 1200ms cubic-bezier(0.22, 1, 0.36, 1)"
    ].join(", ");
    placeAnimatedImage(rangoMini, "75.2%", "52.4%", "10.8%", "1", "1");
  });

  interactionLockedUntil = Date.now() + 1700;
}

function showHealthTokensPlaced() {
  [
    [healthToken1, "19.95%", "52.7%"],
    [healthToken2, "19.95%", "64.8%"]
  ].forEach(([token, left, top]) => {
    token.style.display = "block";
    token.style.transition = "none";
    placeAnimatedImage(token, left, top, "6.1%", "1", "1");
  });
}

function animateHealthTokens() {
  clearStageAnimations();

  animateImageTo(healthToken1, {
    delay: 180,
    startLeft: "4.5%",
    startTop: "79%",
    endLeft: "19.95%",
    endTop: "52.7%",
    width: "6.1%",
    duration: 820
  });

  animateImageTo(healthToken2, {
    delay: 520,
    startLeft: "4.5%",
    startTop: "79%",
    endLeft: "19.95%",
    endTop: "64.8%",
    width: "6.1%",
    duration: 820
  });

  interactionLockedUntil = Date.now() + 1750;
}

function animateAffectionToken() {
  clearStageAnimations();
  showHealthTokensPlaced();

  animateImageTo(affectionToken, {
    delay: 220,
    startLeft: "4.5%",
    startTop: "79%",
    endLeft: "19.95%",
    endTop: "40.5%",
    width: "6.1%",
    duration: 850
  });

  interactionLockedUntil = Date.now() + 1400;
}

function resetSkipButtonPosition() {
  skipButton.style.left = "";
  skipButton.style.top = "";
  skipButton.style.width = "";
  skipButton.style.height = "";
  skipButton.dataset.action = "";
}

function configureStaffNavigation(scene) {
  staffBackHotspot.hidden = true;
  resetSkipButtonPosition();

  if (scene.type === "staff") {
    previousButton.hidden = true;
    staffBackHotspot.hidden = false;

    skipButton.hidden = false;
    skipButton.dataset.action = "next";
    skipButton.style.left = "89.2%";
    skipButton.style.top = "78.6%";
    skipButton.style.width = "9.0%";
    skipButton.style.height = "16.5%";
    return;
  }

  previousButton.hidden = sceneIndex === 0;

  if (Number.isInteger(scene.skipTo)) {
    skipButton.hidden = false;
    skipButton.dataset.action = "skip";
    if (scene.skipClass) skipButton.classList.add(scene.skipClass);
  }
}

function updateMusicButton() {
  const muted = bgMusic.muted;
  musicToggle.textContent = muted ? "🔇" : "🔊";
  musicToggle.setAttribute("aria-label", muted ? "Activar música" : "Silenciar música");
  musicToggle.title = muted ? "Activar música" : "Silenciar música";
}

function startBackgroundMusic() {
  if (musicStarted) return;

  musicStarted = true;
  bgMusic.muted = false;
  musicToggle.hidden = false;
  updateMusicButton();

  const playPromise = bgMusic.play();
  if (playPromise && typeof playPromise.catch === "function") {
    playPromise.catch(() => {
      bgMusic.muted = true;
      updateMusicButton();
    });
  }
}

function renderScene() {
  const scene = scenes[sceneIndex];

  openRoomKey = null;
  interactionLockedUntil = 0;
  roomBack.hidden = true;
  roomHotspots.hidden = true;
  hideAllCardHighlights();
  clearStageAnimations();
  staffBackHotspot.hidden = true;

  dialogueText.classList.remove("map-dialogue", "animal-dialogue");
  resetDialogueLayout();
  skipButton.hidden = true;
  skipButton.classList.remove("skip-img1", "skip-img2");
  resetSkipButtonPosition();
  stage.dataset.mode = scene.type;

  let altText = "Escena en la Fundación Corazón Peludito";
  if (scene.type === "start") altText = "Portada del modo historia de Adóptame";
  if (scene.type === "staff") altText = "Presentación del personal de la Fundación Corazón Peludito";
  if (scene.type === "animal-card") altText = "Carta de animal de la Fundación Corazón Peludito";
  if (scene.type === "room-demo") altText = "Demostración de cómo mover a Rango al consultorio veterinario";
  if (scene.type === "vet-treatment") altText = "Rango recibiendo cuidados en el consultorio veterinario";
  setSceneImage(scene.image, altText);

  if (scene.type === "start") {
    startPrompt.hidden = false;
    startPrompt.textContent = scene.text;
    dialogueText.hidden = true;
    previousButton.hidden = true;
    stage.setAttribute("aria-label", "Portada de Adóptame. Toca o presiona Enter para iniciar.");
    return;
  }

  startPrompt.hidden = true;
  dialogueText.hidden = scene.type === "staff";
  dialogueText.textContent = scene.text || "";

  configureStaffNavigation(scene);

  if (scene.type === "room-map") {
    dialogueText.classList.add("map-dialogue");
    roomHotspots.hidden = false;
    stage.setAttribute("aria-label", "Mapa de la Fundación Corazón Peludito. Selecciona uno de los cuartos para conocer su función o usa la flecha naranja para continuar.");
  } else if (scene.type === "staff") {
    stage.setAttribute("aria-label", "Presentación del personal. Usa las flechas inferiores para avanzar o retroceder.");
  } else if (scene.type === "animal-card") {
    dialogueText.classList.add("animal-dialogue");
    applyAnimalHighlights(scene);
    stage.setAttribute("aria-label", "Carta de animal. Toca o presiona Enter para continuar.");
  } else if (scene.type === "room-demo") {
    dialogueText.classList.add("map-dialogue");
    if (scene.animateRango) animateRangoToVet();
    stage.setAttribute("aria-label", "Demostración de cómo mover a Rango al consultorio veterinario. Espera a que termine la animación y luego toca para continuar.");
  } else if (scene.type === "vet-treatment") {
    applyVetTreatmentDialogueLayout();
    if (scene.treatmentStep === "health") animateHealthTokens();
    if (scene.treatmentStep === "affection") animateAffectionToken();
    stage.setAttribute("aria-label", "Rango en el consultorio veterinario. Se muestran las fichas que cubren sus necesidades.");
  } else {
    stage.setAttribute("aria-label", "Diálogo de la historia. Toca o presiona Enter para continuar.");
  }
}

function advanceScene() {
  const scene = scenes[sceneIndex];

  if (scene.type === "start") startBackgroundMusic();
  if (scene.type === "room-map") return;
  if (Date.now() < interactionLockedUntil) return;

  if (sceneIndex < scenes.length - 1) {
    sceneIndex += 1;
    renderScene();
  }
}

function previousScene() {
  if (openRoomKey) {
    returnToRoomMap();
    return;
  }

  if (sceneIndex <= 0) return;
  sceneIndex -= 1;
  renderScene();
}

function skipCurrentPart() {
  const scene = scenes[sceneIndex];
  if (!Number.isInteger(scene.skipTo)) return;

  sceneIndex = Math.min(scene.skipTo, scenes.length - 1);
  renderScene();
}

function openRoom(roomKey) {
  const room = rooms[roomKey];
  if (!room) return;

  openRoomKey = roomKey;
  stage.dataset.mode = "detail";
  setSceneImage(room.image, `Información de ${room.name}`);

  startPrompt.hidden = true;
  dialogueText.hidden = true;
  roomHotspots.hidden = true;
  roomBack.hidden = false;
  previousButton.hidden = true;
  skipButton.hidden = true;
  staffBackHotspot.hidden = true;
  hideAllCardHighlights();
  clearStageAnimations();

  stage.setAttribute("aria-label", `Información de ${room.name}. Toca la pantalla o el botón Volver para regresar a la fundación.`);
}

function returnToRoomMap() {
  if (!openRoomKey) return;
  renderScene();
}

stage.addEventListener("click", event => {
  if (event.target.closest("button")) return;

  if (openRoomKey) {
    returnToRoomMap();
    return;
  }

  advanceScene();
});

skipButton.addEventListener("click", event => {
  event.stopPropagation();

  if (skipButton.dataset.action === "next") {
    advanceScene();
    return;
  }

  skipCurrentPart();
});

staffBackHotspot.addEventListener("click", event => {
  event.stopPropagation();
  previousScene();
});

roomHotspots.addEventListener("click", event => {
  const button = event.target.closest(".room-hotspot");
  if (!button) return;

  event.stopPropagation();
  openRoom(button.dataset.room);
});

roomBack.addEventListener("click", event => {
  event.stopPropagation();
  returnToRoomMap();
});

previousButton.addEventListener("click", event => {
  event.stopPropagation();
  previousScene();
});

musicToggle.addEventListener("click", event => {
  event.stopPropagation();

  if (!musicStarted) {
    startBackgroundMusic();
    return;
  }

  bgMusic.muted = !bgMusic.muted;

  if (!bgMusic.muted && bgMusic.paused) {
    bgMusic.play().catch(() => {
      bgMusic.muted = true;
      updateMusicButton();
    });
  }

  updateMusicButton();
});

stage.addEventListener("keydown", event => {
  if (event.target.closest("button")) return;

  if (event.key === "Escape" && openRoomKey) {
    event.preventDefault();
    returnToRoomMap();
    return;
  }

  if (event.key === "ArrowLeft" || event.key === "Backspace") {
    event.preventDefault();
    previousScene();
    return;
  }

  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    if (openRoomKey) returnToRoomMap();
    else advanceScene();
  }
});

renderScene();