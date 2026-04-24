import { PlayerBoard } from "./board.js";


export class Player {
    constructor(name, color) {
        this.name = name;
        this.score = 0;
        this.hand = [];
        this.color = color;
        this.board = new PlayerBoard();

        this.id = 0;
    }

    set_id(id) {
        this.id = id;
    }

    draw_card(card) {
        this.hand.push(card);
    }

    remove_from_hand(card) {
        this.hand = this.hand.filter(c => c.id !== card.id);
    }

    get_score() {
        return this.score;
    }
}