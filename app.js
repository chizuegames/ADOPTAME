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

let sceneIndex = 0;
let currentImage = "";

// Precarga las imágenes para que los cambios de escena sean inmediatos.
[...new Set(scenes.map(scene => scene.image))].forEach(src => {
  const img = new Image();
  img.src = src;
});

function renderScene() {
  const scene = scenes[sceneIndex];

  // Solo cambia la imagen cuando realmente cambia el fondo.
  // Si dos diálogos usan la misma imagen, esta permanece fija y únicamente cambia el texto.
  if (scene.image !== currentImage) {
    sceneImage.src = scene.image;
    currentImage = scene.image;
  }

  sceneImage.alt = scene.type === "start"
    ? "Portada del modo historia de Adóptame"
    : "Escena en la Fundación Corazón Peludito";

  if (scene.type === "start") {
    startPrompt.hidden = false;
    startPrompt.textContent = scene.text;
    dialogueText.hidden = true;
  } else {
    startPrompt.hidden = true;
    dialogueText.hidden = false;
    dialogueText.textContent = scene.text;
  }
}

function advanceScene() {
  sceneIndex = (sceneIndex + 1) % scenes.length;
  renderScene();
}

stage.addEventListener("click", advanceScene);

stage.addEventListener("keydown", event => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    advanceScene();
  }
});

renderScene();
