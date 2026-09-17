/* =========================================================
   MENÚ — ACCESO DIRECTO A LA SECCIÓN DE TRUCOS
   ========================================================= */

const baseGetStoryMenuSectionsForTricks = getStoryMenuSections;

getStoryMenuSections = function () {
  const sections = baseGetStoryMenuSectionsForTricks();

  if (!sections.some(section => section.label === "Trucos")) {
    sections.push({
      label: "Trucos",
      index: findSceneIndex(
        scene => scene.type === "practice-board" && scene.practiceStep === "third-director-tricks"
      )
    });
  }

  return sections;
};
