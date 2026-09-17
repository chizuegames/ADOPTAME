/* =========================================================
   PERSISTENCIA DEL INTERCAMBIO DE TATIANA
   ========================================================= */

/*
 * Después de que Tatiana intercambia A2/A3, Yetti debe permanecer en A2
 * durante toda la sección posterior, incluso después de que Spirit sea
 * adoptado y mientras la directora llena las demás habitaciones.
 */

const baseRenderExtraTricksBoardForTatianaPersistence = renderExtraTricksBoard;
renderExtraTricksBoard = function (phase) {
  baseRenderExtraTricksBoardForTatianaPersistence(phase);

  if (phase >= 6) {
    removeBoardPiece("AN2");
    createImagePiece("AN2", "AN2s.png", "A2", {
      zIndex: 17,
      alt: "Yetti en A2"
    });
  }
};
