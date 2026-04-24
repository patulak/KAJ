import { Deck } from "./deck.js";
import { UNIT, CARD_H, CARD_W } from "../settings.js"

export const CORNER_OFFSETS = {
    tl: { x: 0, y: 0 },
    tr: { x: CARD_W - 1, y: 0 },
    br: { x: CARD_W - 1, y: CARD_H - 1 },
    bl: { x: 0, y: CARD_H - 1 }
};

export class PlayerBoard {

    constructor() {
        this.placed_cards = []
    }

    place_card(card, x, y, player_id = null, turn = null) {
        card.placed = true;
        card.x = x;
        card.y = y;
        card.player_id = player_id;
        card.placed_turn = turn;

        if (!this.placed_cards.includes(card)) {
            this.placed_cards.push(card);
        }
    }

    get_cards() {
        return this.placed_cards;
    }

    get_card_by_id(card_id) {
        return this.placed_cards.find(card => card.id === card_id) ?? null;
    }

    pixel_to_grid(pixel_x, pixel_y) {
        return {
            x: Math.round(pixel_x / UNIT),
            y: Math.round(pixel_y / UNIT)
        };
    }

    grid_to_pixel(grid_x, grid_y) {
        return {
            x: grid_x * UNIT,
            y: grid_y * UNIT
        };
    }

    is_valid_placement() { }

    get_visible_symbols() { }

    get_possible_moves(card) { }

    draw_random_card() { }

    get_showed_cards() { }

    draw_showed_card(card) { }


}