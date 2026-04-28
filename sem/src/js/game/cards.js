import { CARD_W, CARD_H } from "../settings.js";

export class Colors {
    static red = "Red";
    static blue = "Blue";
    static purple = "Purple";
    static green = "Green";

    constructor() { }

    static all_colors() {
        return ["Red", "Blue", "Purple", "Green"];
    }
}

export class Symbols {
    static red = "Red";
    static blue = "Blue";
    static purple = "Purple";
    static green = "Green";
    static ink = "Ink";
    static paper = "Paper";
    static feather = "Feather";

    constructor() { }

    static all_symbols() {
        return ["Red", "Blue", "Purple", "Green", "Paper", "Ink", "Feather"];
    }
}

export class Card {
    static current_id = 0;

    constructor(color, corners, symbols, points) { //Red, [0,1,1,0], [Red, Null, Null, Blue], 1
        this.color = color;
        this.corners = corners;
        this.symbols = symbols;
        this.points = points;

        this.is_flipped = false;
        this.fixed_symbols = [];

        this.x = null;
        this.y = null;
        this.placed = false;
        this.in_hand = false;
        this.player_id = null;
        this.placed_turn = null;
        this.overlap_cards = [];


        this.id = Card.current_id;
        Card.current_id += 1;
    }

    get_score() {
        return this.points;
    }

    get_corners_coords() {
        if (!this.placed) {
            return null;
        }
        return [{ x: this.x, y: this.y }, { x: this.x + CARD_W - 1, y: this.y }, { x: this.x + CARD_W - 1, y: this.y + CARD_H - 1 }, { x: this.x, y: this.y + CARD_H - 1 }]
    }
}

export class GoldenCard extends Card {
    constructor(color, corners, symbols, points, requirements, per_special_symbol = false, special_symbol = null, per_corner = false) { //Red, [0,1,1,0], [Red, Null, Null, Blue], 1, {Green: 3, Blue: 1}
        super(color, corners, symbols, points)
        this.requirements = requirements;
        this.per_special_symbol = per_special_symbol;
        this.special_symbol = special_symbol;
        this.per_corner = per_corner;
        this.golden = true;
    }

    meet_requirements(symbol_count_o) {
        let symbol_count = new Map(symbol_count_o);
        for (const symbol of this.requirements) {
            let c = symbol_count.get(symbol);
            if (c > 0) {
                symbol_count.set(symbol, c - 1);
            }
            else {
                return false;
            }
        }
        return true;
    }

    get_special_score(symbol_count) {
        let score = 0;
        if (this.per_special_symbol) {
            score += symbol_count.get(this.special_symbol) * this.points;
        }
        if (this.per_corner) {
            score += this.overlap_cards.length * this.points;
        }
        return score;
    }

    get_score() {
        return (this.per_special_symbol || this.per_corner) ? 0 : this.points;
    }
}