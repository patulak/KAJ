import { Deck } from "./deck.js";
import { UNIT, CARD_H, CARD_W } from "../settings.js"
import { Symbols } from "./cards.js";

export const CORNER_OFFSETS = {
    tl: { x: 0, y: 0 },
    tr: { x: CARD_W - 1, y: 0 },
    br: { x: CARD_W - 1, y: CARD_H - 1 },
    bl: { x: 0, y: CARD_H - 1 }
};

export class PlayerBoard {

    constructor() {
        this.placed_cards = [];
        this.starting_card = null;
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

    get_visible_symbols() {
        function str_to_num(str) {
            switch (str) {
                case "tl":
                    return 0;
                case "tr":
                    return 1;
                case "br":
                    return 2;
                case "bl":
                    return 3;

                default:
                    return null;
            }
        }

        // BFS from starting, marking visited
        let visited = new Set();
        let count = new Map();
        for (const symbol of Symbols.all_symbols()) {
            count.set(symbol, 0);
        }
        for (const symbol of this.starting_card.fixed_symbols) {
            count.set(symbol, count.get(symbol) + 1);
        }

        let front = [this.starting_card];

        while (front.length >= 1) {
            let card = front.shift();
            if (visited.has(card.id)) {
                continue;
            }
            visited.add(card.id);

            let banned_corners = [];
            for (const conn of card.overlap_cards) {
                front.push(conn.card);
                if (card.placed_turn < conn.card.placed_turn) {
                    banned_corners.push(str_to_num(conn.where))
                }
            }

            for (let i = 0; i < card.symbols.length; i++) {
                const symbol = card.symbols[i];
                //not the overlaping ones
                if (symbol != null && banned_corners.find(num => num == i) == undefined) {
                    count.set(symbol, count.get(symbol) + 1);
                }
            }


        }
        return count;
    }


}