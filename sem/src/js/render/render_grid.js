import { UNIT, CARD_H, CARD_W, BOARD_W, BOARD_H } from "../settings.js"

export function draw_grid() {
    const g_element = document.getElementById("board-grid");
    g_element.innerHTML = "";
    for (let i = 0; i < BOARD_H; i += UNIT) {
        g_element.innerHTML += `<line x1="0" y1="${i}" x2="${BOARD_W}" y2="${i}" />`;
    }
    for (let i = 0; i < BOARD_W; i += UNIT) {
        g_element.innerHTML += `<line x1="${i}" y1="0" x2="${i}" y2="${BOARD_H}" />`;
    }
}       