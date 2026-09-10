const scenes = [

  // 0
  {
    image: "IMGI.png",
    type: "start",
    text: "Toca para iniciar"
  },


  // 1
  {
    image: "IMG1.png",
    type: "dialogue",
    text: "¡Hola, amigos! Y bienvenidos a la Fundación Corazón Peludito.",
    skipTo: 3,
    skipClass: "skip-img1"
  },


  // 2
  {
    image: "IMG1.png",
    type: "dialogue",
    text: "Hoy vamos a jugar el modo historia de Adóptame y, de paso, aprenderemos algunas cosillas por el camino.",
    skipTo: 3,
    skipClass: "skip-img1"
  },


  // 3
  {
    image: "IMG2.png",
    type: "room-map",
    text: "¡Así se ve nuestra fundación! Toca cualquiera de sus cuartos para descubrir qué función cumple.",
    skipTo: 4,
    skipClass: "skip-img2"
  },


  // 4
  {
    image: "IMG1.png",
    type: "dialogue",
    text: "También sería bueno que conozcan a nuestro personal, y acá están...",
    skipTo: 5,
    skipClass: "skip-img1"
  },


  // 5
  {
    image: "IMGR1.png",
    type: "staff",
    text: ""
  },


  // 6
  {
    image: "IMGR2.png",
    type: "staff",
    text: ""
  },


  // 7
  {
    image: "IMGR3.png",
    type: "staff",
    text: ""
  },


  // 8
  {
    image: "IMGR4.png",
    type: "staff",
    text: ""
  },


  // 9
  {
    image: "IMG1.png",
    type: "dialogue",
    text: "Bueno, ahora que ya conocemos la fundación y a nuestro equipo, vamos a conocer las cartas de los animales...",
    skipTo: 10,
    skipClass: "skip-img1"
  },


  // 10
  {
    image: "IMG3.png",
    type: "animal-card",
    text: "Acá tenemos a Rango, la iguana. Como pueden ver, está en blanco y negro, y eso significa que necesita nuestra ayuda."
  },


  // 11
  {
    image: "IMG3.png",
    type: "animal-card",
    text: "En la parte superior veremos el nombre del animal y, debajo, su personalidad. En este caso, Rango es flojo. Esto será importante, porque podremos encontrarle un adoptante que comparta su personalidad.",
    highlights: ["name", "trait"]
  },


  // 12
  {
    image: "IMG3.png",
    type: "animal-card",
    text: "Ahora, si miramos la parte lateral izquierda, veremos las necesidades del animal. En este caso, Rango necesita estimulación, afecto y dos cuidados de salud, representados por los íconos verdes.",
    highlights: ["needs"]
  },


  // 13
  {
    image: "IMG3.png",
    type: "animal-card",
    text: "En la parte inferior veremos los requisitos de tenencia: dinero, espacio y tiempo. El adoptante deberá tener esa cantidad o más para poder adoptar al animal.",
    highlights: ["requirements"]
  }

];



/* =========================================================
   CUARTOS DE LA FUNDACIÓN
   ========================================================= */

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



/* =========================================================
   ELEMENTOS
   ========================================================= */

const stage =
  document.getElementById("stage");

const sceneImage =
  document.getElementById("sceneImage");

const startPrompt =
  document.getElementById("startPrompt");

const dialogueText =
  document.getElementById("dialogueText");


const animalNameHighlight =
  document.getElementById("animalNameHighlight");

const animalTraitHighlight =
  document.getElementById("animalTraitHighlight");

const animalNeedsHighlight =
  document.getElementById("animalNeedsHighlight");

const animalRequirementsHighlight =
  document.getElementById("animalRequirementsHighlight");


const roomHotspots =
  document.getElementById("roomHotspots");

const roomBack =
  document.getElementById("roomBack");

const skipButton =
  document.getElementById("skipButton");

const bgMusic =
  document.getElementById("bgMusic");

const musicToggle =
  document.getElementById("musicToggle");

const previousButton =
  document.getElementById("previousButton");



/* =========================================================
   ESTADO
   ========================================================= */

let sceneIndex = 0;

let currentImage = "";

let openRoomKey = null;

let musicStarted = false;



/* =========================================================
   MÚSICA
   ========================================================= */

bgMusic.volume = 0.14;



function updateMusicButton() {

  const muted = bgMusic.muted;

  musicToggle.textContent =
    muted ? "🔇" : "🔊";

  musicToggle.setAttribute(
    "aria-label",
    muted
      ? "Activar música"
      : "Silenciar música"
  );

  musicToggle.title =
    muted
      ? "Activar música"
      : "Silenciar música";

}



function startBackgroundMusic() {

  if (musicStarted) {
    return;
  }

  musicStarted = true;

  bgMusic.muted = false;

  musicToggle.hidden = false;

  updateMusicButton();


  const playPromise =
    bgMusic.play();


  if (
    playPromise &&
    typeof playPromise.catch === "function"
  ) {

    playPromise.catch(() => {

      bgMusic.muted = true;

      updateMusicButton();

    });

  }

}



/* =========================================================
   PRECARGA DE IMÁGENES
   ========================================================= */

const imagesToPreload = [

  ...scenes.map(
    scene => scene.image
  ),

  ...Object.values(rooms).map(
    room => room.image
  )

];


[
  ...new Set(imagesToPreload)
]
.forEach(src => {

  const img =
    new Image();

  img.src =
    src;

});



/* =========================================================
   CAMBIO DE IMAGEN
   ========================================================= */

function setSceneImage(
  src,
  alt
) {

  /*
    Si la imagen es la misma,
    NO vuelve a cargarla.

    Esto evita el parpadeo
    entre diálogos.
  */

  if (
    src !== currentImage
  ) {

    sceneImage.src =
      src;

    currentImage =
      src;

  }


  sceneImage.alt =
    alt;

}



/* =========================================================
   RESALTADOS DE LA CARTA
   ========================================================= */

const cardHighlights = {

  name:
    animalNameHighlight,

  trait:
    animalTraitHighlight,

  needs:
    animalNeedsHighlight,

  requirements:
    animalRequirementsHighlight

};



function hideAllCardHighlights() {

  Object.values(
    cardHighlights
  )
  .forEach(element => {

    if (element) {
      element.hidden = true;
    }

  });

}



function applyAnimalHighlights(
  scene
) {

  hideAllCardHighlights();


  if (
    !Array.isArray(
      scene.highlights
    )
  ) {

    return;

  }


  scene.highlights.forEach(
    highlightName => {

      const element =
        cardHighlights[
          highlightName
        ];


      if (element) {

        element.hidden =
          false;

      }

    }
  );

}



/* =========================================================
   MOSTRAR ESCENA
   ========================================================= */

function renderScene() {

  const scene =
    scenes[sceneIndex];


  openRoomKey =
    null;


  roomBack.hidden =
    true;


  roomHotspots.hidden =
    true;


  previousButton.hidden =
    sceneIndex === 0;


  dialogueText.classList.remove(
    "map-dialogue",
    "animal-dialogue"
  );


  hideAllCardHighlights();


  stage.dataset.mode =
    scene.type;


  skipButton.hidden =
    true;


  skipButton.classList.remove(
    "skip-img1",
    "skip-img2"
  );


  /* IMAGEN */

  let altText =
    "Escena en la Fundación Corazón Peludito";


  if (
    scene.type === "start"
  ) {

    altText =
      "Portada del modo historia de Adóptame";

  }


  if (
    scene.type === "staff"
  ) {

    altText =
      "Presentación del personal de la Fundación Corazón Peludito";

  }


  if (
    scene.type === "animal-card"
  ) {

    altText =
      "Carta de animal de la Fundación Corazón Peludito";

  }


  setSceneImage(
    scene.image,
    altText
  );


  /* PORTADA */

  if (
    scene.type === "start"
  ) {

    startPrompt.hidden =
      false;

    startPrompt.textContent =
      scene.text;

    dialogueText.hidden =
      true;


    stage.setAttribute(
      "aria-label",
      "Portada de Adóptame. Toca o presiona Enter para iniciar."
    );


    return;

  }


  startPrompt.hidden =
    true;


  /* PERSONAL */

  if (
    scene.type === "staff"
  ) {

    dialogueText.hidden =
      true;

  }

  else {

    dialogueText.hidden =
      false;

    dialogueText.textContent =
      scene.text;

  }


  /* FLECHA NARANJA */

  if (
    Number.isInteger(
      scene.skipTo
    )
  ) {

    skipButton.hidden =
      false;


    if (
      scene.skipClass
    ) {

      skipButton.classList.add(
        scene.skipClass
      );

    }

  }


  /* MAPA DE SALAS */

  if (
    scene.type === "room-map"
  ) {

    dialogueText.classList.add(
      "map-dialogue"
    );


    roomHotspots.hidden =
      false;


    stage.setAttribute(
      "aria-label",
      "Mapa de la Fundación Corazón Peludito. Selecciona uno de los cuartos para conocer su función o usa la flecha naranja para continuar."
    );

  }


  /* PERSONAL */

  else if (
    scene.type === "staff"
  ) {

    stage.setAttribute(
      "aria-label",
      "Presentación del personal. Toca o presiona Enter para continuar."
    );

  }


  /* CARTA DE ANIMAL */

  else if (
    scene.type === "animal-card"
  ) {

    dialogueText.classList.add(
      "animal-dialogue"
    );


    applyAnimalHighlights(
      scene
    );


    stage.setAttribute(
      "aria-label",
      "Carta de animal. Toca o presiona Enter para continuar."
    );

  }


  /* DIÁLOGO NORMAL */

  else {

    stage.setAttribute(
      "aria-label",
      "Diálogo de la historia. Toca o presiona Enter para continuar."
    );

  }

}



/* =========================================================
   AVANZAR
   ========================================================= */

function advanceScene() {

  const scene =
    scenes[sceneIndex];


  /*
    La música empieza
    con la primera interacción
    del usuario.
  */

  if (
    scene.type === "start"
  ) {

    startBackgroundMusic();

  }


  /*
    IMG2 no avanza tocando
    cualquier parte.

    Se avanza mediante
    su flecha naranja.
  */

  if (
    scene.type === "room-map"
  ) {

    return;

  }


  if (
    sceneIndex <
    scenes.length - 1
  ) {

    sceneIndex += 1;

    renderScene();

  }

}



/* =========================================================
   VOLVER A LA ESCENA ANTERIOR
   ========================================================= */

function previousScene() {

  if (
    openRoomKey
  ) {

    returnToRoomMap();

    return;

  }


  if (
    sceneIndex <= 0
  ) {

    return;

  }


  sceneIndex -= 1;

  renderScene();

}



/* =========================================================
   SALTAR CON FLECHA NARANJA
   ========================================================= */

function skipCurrentPart() {

  const scene =
    scenes[sceneIndex];


  if (
    !Number.isInteger(
      scene.skipTo
    )
  ) {

    return;

  }


  sceneIndex =
    Math.min(
      scene.skipTo,
      scenes.length - 1
    );


  renderScene();

}



/* =========================================================
   CUARTOS
   ========================================================= */

function openRoom(
  roomKey
) {

  const room =
    rooms[roomKey];


  if (
    !room
  ) {

    return;

  }


  openRoomKey =
    roomKey;


  stage.dataset.mode =
    "detail";


  setSceneImage(
    room.image,
    `Información de ${room.name}`
  );


  startPrompt.hidden =
    true;


  dialogueText.hidden =
    true;


  roomHotspots.hidden =
    true;


  roomBack.hidden =
    false;


  previousButton.hidden =
    true;


  skipButton.hidden =
    true;


  hideAllCardHighlights();


  stage.setAttribute(
    "aria-label",
    `Información de ${room.name}. Toca la pantalla o el botón Volver para regresar a la fundación.`
  );

}



function returnToRoomMap() {

  if (
    !openRoomKey
  ) {

    return;

  }


  renderScene();

}



/* =========================================================
   TOCAR PANTALLA
   ========================================================= */

stage.addEventListener(
  "click",
  event => {

    /*
      Los botones tienen
      comportamiento propio.
    */

    if (
      event.target.closest(
        "button"
      )
    ) {

      return;

    }


    /*
      Si estamos dentro
      de una sala,
      tocar la pantalla vuelve.
    */

    if (
      openRoomKey
    ) {

      returnToRoomMap();

      return;

    }


    advanceScene();

  }
);



/* =========================================================
   FLECHA NARANJA
   ========================================================= */

skipButton.addEventListener(
  "click",
  event => {

    event.stopPropagation();

    skipCurrentPart();

  }
);



/* =========================================================
   BOTONES DE LOS CUARTOS
   ========================================================= */

roomHotspots.addEventListener(
  "click",
  event => {

    const button =
      event.target.closest(
        ".room-hotspot"
      );


    if (
      !button
    ) {

      return;

    }


    event.stopPropagation();


    openRoom(
      button.dataset.room
    );

  }
);



/* =========================================================
   VOLVER DESDE UNA SALA
   ========================================================= */

roomBack.addEventListener(
  "click",
  event => {

    event.stopPropagation();

    returnToRoomMap();

  }
);



/* =========================================================
   BOTÓN GENERAL VOLVER
   ========================================================= */

previousButton.addEventListener(
  "click",
  event => {

    event.stopPropagation();

    previousScene();

  }
);



/* =========================================================
   BOTÓN DE MÚSICA
   ========================================================= */

musicToggle.addEventListener(
  "click",
  event => {

    event.stopPropagation();


    if (
      !musicStarted
    ) {

      startBackgroundMusic();

      return;

    }


    bgMusic.muted =
      !bgMusic.muted;


    if (
      !bgMusic.muted &&
      bgMusic.paused
    ) {

      bgMusic
        .play()
        .catch(() => {

          bgMusic.muted =
            true;

          updateMusicButton();

        });

    }


    updateMusicButton();

  }
);



/* =========================================================
   TECLADO
   ========================================================= */

stage.addEventListener(
  "keydown",
  event => {

    if (
      event.target.closest(
        "button"
      )
    ) {

      return;

    }


    /* ESCAPE */

    if (
      event.key === "Escape" &&
      openRoomKey
    ) {

      event.preventDefault();

      returnToRoomMap();

      return;

    }


    /* VOLVER */

    if (
      event.key === "ArrowLeft" ||
      event.key === "Backspace"
    ) {

      event.preventDefault();

      previousScene();

      return;

    }


    /* AVANZAR */

    if (
      event.key === "Enter" ||
      event.key === " "
    ) {

      event.preventDefault();


      if (
        openRoomKey
      ) {

        returnToRoomMap();

      }

      else {

        advanceScene();

      }

    }

  }
);



/* =========================================================
   INICIO
   ========================================================= */

renderScene();
