
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


        this.id = Card.current_id;
        Card.current_id += 1;
    }

    get_score() {
        return this.points; //TODO calculate corners/symbols etc if placed 
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
}