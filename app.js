const scenes = [
  {
    image: "IMGI.png",
    type: "start",
    text: "Toca para iniciar"
  },
  {
    image: "IMG1.png",
    type: "dialogue",
    text: "¡Hola, amigos! Y bienvenidos a la Fundación Corazón Peludito."
  },
  {
    image: "IMG1.png",
    type: "dialogue",
    text: "Hoy vamos a jugar el modo historia de Adóptame y, de paso, aprenderemos algunas cosillas por el camino."
  }
];

const stage = document.getElementById("stage");
const sceneImage = document.getElementById("sceneImage");
const startPrompt = document.getElementById("startPrompt");
const dialogueText = document.getElementById("dialogueText");
const continueHint = document.getElementById("continueHint");

let sceneIndex = 0;
let locked = false;

// Precarga las imágenes para que el cambio entre escenas sea inmediato.
[...new Set(scenes.map(scene => scene.image))].forEach(src => {
  const img = new Image();
  img.src = src;
});

function renderScene() {
  const scene = scenes[sceneIndex];

  sceneImage.src = scene.image;
  sceneImage.alt = scene.type === "start"
    ? "Portada del modo historia de Adóptame"
    : "Escena en la Fundación Corazón Peludito";

  if (scene.type === "start") {
    startPrompt.hidden = false;
    startPrompt.textContent = scene.text;
    dialogueText.hidden = true;
    continueHint.hidden = true;
  } else {
    startPrompt.hidden = true;
    dialogueText.hidden = false;
    dialogueText.textContent = scene.text;
    continueHint.hidden = false;
  }
}

function advanceScene() {
  if (locked) return;

  locked = true;
  stage.classList.add("is-changing");

  window.setTimeout(() => {
    sceneIndex = (sceneIndex + 1) % scenes.length;
    renderScene();
    stage.classList.remove("is-changing");

    window.setTimeout(() => {
      locked = false;
    }, 190);
  }, 180);
}

stage.addEventListener("click", advanceScene);

stage.addEventListener("keydown", event => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    advanceScene();
  }
});

renderScene();
