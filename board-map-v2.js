/* =========================================================
   MAPA DE ZONAS V2 — HABITACIÓN VIOLETA DOBLE + FILA D
   ========================================================= */

/*
 * Ajuste basado en el nuevo plano 1893 x 1066.
 *
 * La habitación violeta ahora puede albergar 2 animales:
 * - Z1 = espacio izquierdo
 * - A1 = espacio derecho
 *
 * También se fijan nuevamente las posiciones D1-D4 según el plano actualizado.
 */

// Habitación violeta: dos espacios independientes.
BOARD_MAP.Z1 = { kind: "rect", left: 22.72, top: 43.25, width: 7.71 };
BOARD_MAP.A1 = { kind: "rect", left: 30.64, top: 43.25, width: 7.71 };

// Posiciones de fichas sobre Z1.
BOARD_MAP["01"] = { kind: "point", left: 24.06, top: 48.91 };
BOARD_MAP["02"] = { kind: "point", left: 24.06, top: 52.29 };
BOARD_MAP["03"] = { kind: "point", left: 24.06, top: 55.78 };
BOARD_MAP["04"] = { kind: "point", left: 24.06, top: 59.04 };
BOARD_MAP["05"] = { kind: "point", left: 29.13, top: 55.78 };
BOARD_MAP["06"] = { kind: "point", left: 29.13, top: 59.16 };

// Posiciones de fichas sobre A1, ahora desplazada a la derecha.
BOARD_MAP["11"] = { kind: "point", left: 31.98, top: 48.91 };
BOARD_MAP["12"] = { kind: "point", left: 31.98, top: 52.29 };
BOARD_MAP["13"] = { kind: "point", left: 31.98, top: 55.78 };
BOARD_MAP["14"] = { kind: "point", left: 31.98, top: 59.04 };
BOARD_MAP["15"] = { kind: "point", left: 36.99, top: 55.78 };
BOARD_MAP["16"] = { kind: "point", left: 36.99, top: 59.16 };

// Fila de adoptantes corregida según el nuevo plano.
BOARD_MAP.D1 = { kind: "rect", left: 26.68, top: 67.45, width: 7.71 };
BOARD_MAP.D2 = { kind: "rect", left: 44.48, top: 67.45, width: 7.71 };
BOARD_MAP.D3 = { kind: "rect", left: 62.39, top: 67.45, width: 7.71 };
BOARD_MAP.D4 = { kind: "rect", left: 80.03, top: 67.45, width: 7.71 };

// ADOPTAME_BOARD_MAP apunta al mismo objeto; dejamos explícita la referencia
// para que cualquier código externo consulte siempre la versión actualizada.
window.ADOPTAME_BOARD_MAP = BOARD_MAP;
