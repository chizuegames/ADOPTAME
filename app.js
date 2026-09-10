const scenes = [
  {
    image: "IMGI.png",
    type: "start",
    text: "Toca para iniciar"
  },
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

const rangoMini = document.createElement("img");
rangoMini.src = "rangomini.png";
rangoMini.alt = "Carta mini de Rango";
rangoMini.draggable = false;
rangoMini.setAttribute("aria-hidden", "true");
Object.assign(rangoMini.style, {
  position: "absolute",
  zIndex: "18",
  display: "none",
  pointerEvents: "none",
  width: "11.2%",
  height: "auto",
  left: "4.5%",
  top: "70%",
  opacity: "0",
  transform: "scale(0.85)",
  filter: "drop-shadow(0 8px 12px rgba(0,0,0,.28))"
});
stage.appendChild(rangoMini);

let sceneIndex = 0;
let currentImage = "";
let openRoomKey = null;
let musicStarted = false;
let interactionLockedUntil = 0;
let rangoRevealTimer = null;
let rangoMoveTimer = null;

bgMusic.volume = 0.14;

const imagesToPreload = [
  ...scenes.map(scene => scene.image),
  ...Object.values(rooms).map(room => room.image),
  "rangomini.png"
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

function clearRangoAnimation() {
  clearTimeout(rangoRevealTimer);
  clearTimeout(rangoMoveTimer);
  rangoRevealTimer = null;
  rangoMoveTimer = null;
  rangoMini.style.transition = "none";
  rangoMini.style.display = "none";
  rangoMini.style.opacity = "0";
}

function animateRangoToVet() {
  clearRangoAnimation();

  rangoMini.style.display = "block";
  rangoMini.style.transition = "none";
  rangoMini.style.left = "4.5%";
  rangoMini.style.top = "70%";
  rangoMini.style.width = "11.2%";
  rangoMini.style.opacity = "0";
  rangoMini.style.transform = "scale(0.85)";

  rangoRevealTimer = setTimeout(() => {
    rangoMini.style.transition = "opacity 180ms ease, transform 180ms ease";
    rangoMini.style.opacity = "1";
    rangoMini.style.transform = "scale(1)";
  }, 80);

  rangoMoveTimer = setTimeout(() => {
    rangoMini.style.transition = [
      "left 1200ms cubic-bezier(0.22, 1, 0.36, 1)",
      "top 1200ms cubic-bezier(0.22, 1, 0.36, 1)",
      "width 1200ms cubic-bezier(0.22, 1, 0.36, 1)",
      "transform 1200ms cubic-bezier(0.22, 1, 0.36, 1)"
    ].join(", ");

    rangoMini.style.left = "75.2%";
    rangoMini.style.top = "52.4%";
    rangoMini.style.width = "10.8%";
    rangoMini.style.transform = "scale(1)";
  }, 420);

  interactionLockedUntil = Date.now() + 1700;
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
  previousButton.hidden = sceneIndex === 0;
  hideAllCardHighlights();
  clearRangoAnimation();

  dialogueText.classList.remove("map-dialogue", "animal-dialogue");
  skipButton.hidden = true;
  skipButton.classList.remove("skip-img1", "skip-img2");
  stage.dataset.mode = scene.type;

  let altText = "Escena en la Fundación Corazón Peludito";
  if (scene.type === "start") altText = "Portada del modo historia de Adóptame";
  if (scene.type === "staff") altText = "Presentación del personal de la Fundación Corazón Peludito";
  if (scene.type === "animal-card") altText = "Carta de animal de la Fundación Corazón Peludito";
  if (scene.type === "room-demo") altText = "Demostración de cómo mover a Rango al consultorio veterinario";
  setSceneImage(scene.image, altText);

  if (scene.type === "start") {
    startPrompt.hidden = false;
    startPrompt.textContent = scene.text;
    dialogueText.hidden = true;
    stage.setAttribute("aria-label", "Portada de Adóptame. Toca o presiona Enter para iniciar.");
    return;
  }

  startPrompt.hidden = true;
  dialogueText.hidden = scene.type === "staff";
  dialogueText.textContent = scene.text || "";

  if (Number.isInteger(scene.skipTo)) {
    skipButton.hidden = false;
    if (scene.skipClass) skipButton.classList.add(scene.skipClass);
  }

  if (scene.type === "room-map") {
    dialogueText.classList.add("map-dialogue");
    roomHotspots.hidden = false;
    stage.setAttribute("aria-label", "Mapa de la Fundación Corazón Peludito. Selecciona uno de los cuartos para conocer su función o usa la flecha naranja para continuar.");
  } else if (scene.type === "staff") {
    stage.setAttribute("aria-label", "Presentación del personal. Toca o presiona Enter para continuar.");
  } else if (scene.type === "animal-card") {
    dialogueText.classList.add("animal-dialogue");
    applyAnimalHighlights(scene);
    stage.setAttribute("aria-label", "Carta de animal. Toca o presiona Enter para continuar.");
  } else if (scene.type === "room-demo") {
    dialogueText.classList.add("map-dialogue");
    if (scene.animateRango) animateRangoToVet();
    stage.setAttribute("aria-label", "Demostración de cómo mover a Rango al consultorio veterinario. Espera a que termine la animación y luego toca para continuar.");
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
  hideAllCardHighlights();
  clearRangoAnimation();

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
  skipCurrentPart();
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
