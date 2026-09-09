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
    text: "¡Así se ve nuestra fundación! Toca cualquiera de sus cuartos para descubrir qué función cumple."
  }
];

const rooms = {
  reception: {
    name: "Recepción",
    image: "IMGS1.png"
  },
  stimulation: {
    name: "Sala de estimulación",
    image: "IMGS2.png"
  },
  vet: {
    name: "Consultorio veterinario",
    image: "IMGS3.png"
  },
  rest: {
    name: "Sala de descanso",
    image: "IMGS4.png"
  },
  office: {
    name: "Oficina / Sala extra",
    image: "IMGS5.png"
  },
  break: {
    name: "Sala de receso",
    image: "IMGS6.png"
  }
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

let sceneIndex = 0;
let currentImage = "";
let openRoomKey = null;
let musicStarted = false;

bgMusic.volume = 0.14;

// Precarga todas las imágenes para que al abrir un cuarto el cambio sea inmediato.
const imagesToPreload = [
  ...scenes.map(scene => scene.image),
  ...Object.values(rooms).map(room => room.image)
];

[...new Set(imagesToPreload)].forEach(src => {
  const img = new Image();
  img.src = src;
});

function setSceneImage(src, alt) {
  // Evita volver a cargar la misma imagen entre diálogos y elimina el parpadeo.
  if (src !== currentImage) {
    sceneImage.src = src;
    currentImage = src;
  }

  sceneImage.alt = alt;
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
      // Si el navegador bloquea el audio, el botón queda disponible para iniciarlo manualmente.
      bgMusic.muted = true;
      updateMusicButton();
    });
  }
}

function renderScene() {
  const scene = scenes[sceneIndex];

  openRoomKey = null;
  roomBack.hidden = true;
  roomHotspots.hidden = true;
  dialogueText.classList.remove("map-dialogue");
  stage.dataset.mode = scene.type;

  skipButton.hidden = true;
  skipButton.classList.remove("skip-img1", "skip-img2");

  setSceneImage(
    scene.image,
    scene.type === "start"
      ? "Portada del modo historia de Adóptame"
      : "Escena en la Fundación Corazón Peludito"
  );

  if (scene.type === "start") {
    startPrompt.hidden = false;
    startPrompt.textContent = scene.text;
    dialogueText.hidden = true;
    stage.setAttribute("aria-label", "Portada de Adóptame. Toca o presiona Enter para iniciar.");
    return;
  }

  startPrompt.hidden = true;
  dialogueText.hidden = false;
  dialogueText.textContent = scene.text;

  if (Number.isInteger(scene.skipTo)) {
    skipButton.hidden = false;
    if (scene.skipClass) skipButton.classList.add(scene.skipClass);
  }

  if (scene.type === "room-map") {
    dialogueText.classList.add("map-dialogue");
    roomHotspots.hidden = false;
    stage.setAttribute(
      "aria-label",
      "Mapa de la Fundación Corazón Peludito. Selecciona uno de los cuartos para conocer su función."
    );
  } else {
    stage.setAttribute("aria-label", "Diálogo de la historia. Toca o presiona Enter para continuar.");
  }
}

function advanceScene() {
  const scene = scenes[sceneIndex];

  if (scene.type === "start") {
    startBackgroundMusic();
  }

  // El mapa queda abierto para explorar sus cuartos; no avanza al tocar el fondo.
  if (scene.type === "room-map") return;

  sceneIndex = Math.min(sceneIndex + 1, scenes.length - 1);
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
  skipButton.hidden = true;

  stage.setAttribute(
    "aria-label",
    `Información de ${room.name}. Toca la pantalla o el botón Volver para regresar a la fundación.`
  );
}

function returnToRoomMap() {
  if (!openRoomKey) return;
  renderScene();
}

stage.addEventListener("click", event => {
  // Los botones gestionan su propio clic.
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

  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();

    if (openRoomKey) {
      returnToRoomMap();
    } else {
      advanceScene();
    }
  }
});

renderScene();
