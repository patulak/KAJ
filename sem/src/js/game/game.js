import { Player } from "./player.js";
import { PlayerBoard } from "./board.js";
import { Deck } from "./deck.js";

export class Game {
    constructor() {
        this.players = [];

        this.current_player_index = 0;
        this.turn = 1;

        this.deck = new Deck;
        this.showed_cards = [];
        this.showed_golden_cards = [];
    }

    add_player(player) {
        player.id = this.players.length;
        this.players.push(player);
    }

    get current_player() {
        return this.players[this.current_player_index];
    }

    next_turn() {
        this.current_player_index =
            (this.current_player_index + 1) % this.players.length;

        if (this.current_player_index === 0) {
            this.turn++;
        }
    }
}