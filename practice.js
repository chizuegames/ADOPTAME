/* =========================================================
   PRÁCTICA: DADO + FICHA DE DESCUIDO
   ========================================================= */

/*
 * Las fichas terminadas en "m" son las variantes pequeñas para
 * colocarlas sobre cartas o espacios reducidos.
 */
const practiceTokenAssets = {
  money: { large: "FAM.png", small: "FAMm.png" },
  stimulation: { large: "FAz.png", small: "FAZm.png" },
  affection: { large: "FFC.png", small: "FFCm.png" },
  neglect: { large: "FNG.png", small: "FNGm.png" },
  health: { large: "FVR.png", small: "FVRm.png" }
};

scenes.push(
  {
    image: "IMG4E.png",
    type: "practice-board",
    practiceStep: "dice-roll",
    text: "Ahora que ya resolvimos la primera parte de la carta, es momento de lanzar el dado. En este turno solo tendremos un lanzamiento... y obtuvimos un 4."
  },
  {
    image: "IMG4E.png",
    type: "practice-board",
    practiceStep: "neglect",
    text: "Nos tocó -1 de estimulación. Como Rango no tiene fichas azules de estimulación, ahora tendrá una ficha negra de descuido, lo que lo pondrá en peligro."
  },
  {
    image: "IMG4E1.png",
    type: "practice-board",
    practiceStep: "after-roll",
    text: ""
  }
);

[
  "IMG4E1.png",
  practiceTokenAssets.neglect.large,
  practiceTokenAssets.neglect.small
].forEach(src => {
  const img = new Image();
  img.src = src;
});

const dicePracticeLayer = document.createElement("div");
dicePracticeLayer.setAttribute("aria-label", "Animación del lanzamiento del dado y ficha de descuido");
Object.assign(dicePracticeLayer.style, {
  position: "absolute",
  inset: "0",
  zIndex: "27",
  display: "none",
  pointerEvents: "none"
});
stage.appendChild(dicePracticeLayer);

const dicePracticeLorena = document.createElement("img");
dicePracticeLorena.src = "lorena.png";
dicePracticeLorena.alt = "Lorena";
dicePracticeLorena.draggable = false;
dicePracticeLorena.setAttribute("aria-hidden", "true");
Object.assign(dicePracticeLorena.style, {
  position: "absolute",
  zIndex: "28",
  display: "none",
  width: "8.4%",
  height: "auto",
  left: "26.0%",
  top: "66.1%",
  opacity: "1",
  filter: "drop-shadow(0 6px 10px rgba(0,0,0,.22))",
  pointerEvents: "none"
});
dicePracticeLayer.appendChild(dicePracticeLorena);

/* Dado rosa con resultado 4, equivalente al recurso Dado4. */
const dicePracticeDie = document.createElement("div");
dicePracticeDie.setAttribute("aria-hidden", "true");
Object.assign(dicePracticeDie.style, {
  position: "absolute",
  zIndex: "29",
  display: "none",
  width: "5.6%",
  aspectRatio: "1 / 1",
  left: "26.1%",
  top: "22.8%",
  opacity: "0",
  background: "#ef2786",
  borderRadius: "11%",
  transform: "rotate(-540deg) scale(.35)",
  transformOrigin: "center center",
  filter: "drop-shadow(0 6px 10px rgba(0,0,0,.18))",
  pointerEvents: "none"
});
dicePracticeLayer.appendChild(dicePracticeDie);

[
  ["17%", "17%"],
  ["67%", "17%"],
  ["17%", "67%"],
  ["67%", "67%"]
].forEach(([left, top]) => {
  const pip = document.createElement("span");
  Object.assign(pip.style, {
    position: "absolute",
    left,
    top,
    width: "17%",
    height: "17%",
    borderRadius: "50%",
    background: "#fff"
  });
  dicePracticeDie.appendChild(pip);
});

const dicePracticeNeglect = document.createElement("img");
dicePracticeNeglect.src = practiceTokenAssets.neglect.small;
dicePracticeNeglect.alt = "Ficha negra de descuido";
dicePracticeNeglect.draggable = false;
dicePracticeNeglect.setAttribute("aria-hidden", "true");
Object.assign(dicePracticeNeglect.style, {
  position: "absolute",
  zIndex: "30",
  display: "none",
  width: "2.7%",
  height: "auto",
  left: "78.7%",
  top: "25.0%",
  opacity: "0",
  transform: "scale(.55)",
  filter: "drop-shadow(0 4px 7px rgba(0,0,0,.22))",
  pointerEvents: "none"
});
dicePracticeLayer.appendChild(dicePracticeNeglect);

let dicePracticeTimers = [];

function clearDicePracticeTimers() {
  dicePracticeTimers.forEach(timer => clearTimeout(timer));
  dicePracticeTimers = [];
}

function dicePracticeLater(delay, callback) {
  const timer = setTimeout(callback, delay);
  dicePracticeTimers.push(timer);
}

function hideDicePracticeLayer() {
  clearDicePracticeTimers();
  dicePracticeLayer.style.display = "none";

  dicePracticeLorena.style.display = "none";

  dicePracticeDie.style.display = "none";
  dicePracticeDie.style.transition = "none";
  dicePracticeDie.style.left = "26.1%";
  dicePracticeDie.style.top = "22.8%";
  dicePracticeDie.style.opacity = "0";
  dicePracticeDie.style.transform = "rotate(-540deg) scale(.35)";

  dicePracticeNeglect.style.display = "none";
  dicePracticeNeglect.style.transition = "none";
  dicePracticeNeglect.style.left = "78.7%";
  dicePracticeNeglect.style.top = "25.0%";
  dicePracticeNeglect.style.width = "2.7%";
  dicePracticeNeglect.style.opacity = "0";
  dicePracticeNeglect.style.transform = "scale(.55)";
}

function showPracticeLorenaAtReception() {
  dicePracticeLayer.style.display = "block";
  dicePracticeLorena.style.display = "block";
  dicePracticeLorena.style.left = "26.0%";
  dicePracticeLorena.style.top = "66.1%";
  dicePracticeLorena.style.opacity = "1";
}

function showPracticeDieAtFour() {
  dicePracticeLayer.style.display = "block";
  dicePracticeDie.style.display = "block";
  dicePracticeDie.style.transition = "none";
  dicePracticeDie.style.left = "26.1%";
  dicePracticeDie.style.top = "22.8%";
  dicePracticeDie.style.opacity = "1";
  dicePracticeDie.style.transform = "rotate(-24deg) scale(1)";
}

function animatePracticeDie() {
  dicePracticeLayer.style.display = "block";
  showPracticeLorenaAtReception();

  dicePracticeDie.style.display = "block";
  dicePracticeDie.style.transition = "none";
  dicePracticeDie.style.left = "23.0%";
  dicePracticeDie.style.top = "10.5%";
  dicePracticeDie.style.opacity = "0";
  dicePracticeDie.style.transform = "rotate(-540deg) scale(.35)";

  dicePracticeLater(100, () => {
    dicePracticeDie.style.transition = [
      "left 980ms cubic-bezier(.22,1,.36,1)",
      "top 980ms cubic-bezier(.22,1,.36,1)",
      "opacity 180ms ease",
      "transform 980ms cubic-bezier(.22,1,.36,1)"
    ].join(", ");

    dicePracticeDie.style.left = "26.1%";
    dicePracticeDie.style.top = "22.8%";
    dicePracticeDie.style.opacity = "1";
    dicePracticeDie.style.transform = "rotate(-24deg) scale(1)";
  });

  interactionLockedUntil = Date.now() + 1200;
}

function animatePracticeNeglect() {
  dicePracticeLayer.style.display = "block";
  showPracticeLorenaAtReception();
  showPracticeDieAtFour();

  // FNGm es la variante pequeña porque la ficha termina encima de Rango.
  dicePracticeNeglect.src = practiceTokenAssets.neglect.small;
  dicePracticeNeglect.style.display = "block";
  dicePracticeNeglect.style.transition = "none";
  dicePracticeNeglect.style.left = "78.7%";
  dicePracticeNeglect.style.top = "25.0%";
  dicePracticeNeglect.style.width = "2.7%";
  dicePracticeNeglect.style.opacity = "0";
  dicePracticeNeglect.style.transform = "scale(.55)";

  dicePracticeLater(120, () => {
    dicePracticeNeglect.style.transition = [
      "left 1050ms cubic-bezier(.22,1,.36,1)",
      "top 1050ms cubic-bezier(.22,1,.36,1)",
      "opacity 180ms ease",
      "transform 1050ms cubic-bezier(.22,1,.36,1)"
    ].join(", ");

    dicePracticeNeglect.style.left = "81.9%";
    dicePracticeNeglect.style.top = "54.0%";
    dicePracticeNeglect.style.opacity = "1";
    dicePracticeNeglect.style.transform = "scale(1)";
  });

  interactionLockedUntil = Date.now() + 1350;
}

const baseRenderSceneForDicePractice = renderScene;
renderScene = function () {
  hideDicePracticeLayer();

  baseRenderSceneForDicePractice();

  const scene = scenes[sceneIndex];
  if (!scene || scene.type !== "practice-board") return;

  if (scene.practiceStep === "dice-roll") {
    dialogueText.hidden = false;
    dialogueText.textContent = scene.text;
    applyPracticeDialogueLayout();
    previousButton.hidden = false;
    animatePracticeDie();
    stage.setAttribute(
      "aria-label",
      "Práctica: Lorena ya está debajo de recepción. El dado entra girando junto a la carta de amenaza y se detiene mostrando un 4."
    );
  }

  if (scene.practiceStep === "neglect") {
    dialogueText.hidden = false;
    dialogueText.textContent = scene.text;
    applyPracticeDialogueLayout();
    previousButton.hidden = false;
    animatePracticeNeglect();
    stage.setAttribute(
      "aria-label",
      "Práctica: el resultado cuatro provoca menos uno de estimulación. Una ficha negra pequeña de descuido se mueve desde el área junto a la sala de receso hasta la carta de Rango."
    );
  }

  if (scene.practiceStep === "after-roll") {
    dialogueText.hidden = true;
    previousButton.hidden = false;
    stage.setAttribute(
      "aria-label",
      "Estado actualizado del turno en IMG4E1 después de resolver el lanzamiento del dado."
    );
  }
};
