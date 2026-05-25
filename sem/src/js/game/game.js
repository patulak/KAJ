import { Player } from "./player.js";
import { PlayerBoard } from "./board.js";
import { Deck } from "./deck.js";
import { CARD_H, CARD_W, BOARD_H, BOARD_W, UNIT } from "../settings.js";
import { show_view } from "../tools/tools.js";
import { render_results } from "../render/render_results.js";

export class Game {
    constructor() {
        this.players = [];

        this.current_player_index = 0;
        this.turn = 1;

        this.deck = new Deck;
        this.showed_cards = [];
        this.showed_golden_cards = [];

        this.last_turn = false;
        this.phase = 0; //created, playing, ended
    }

    add_player(player) {
        player.id = this.players.length;
        this.players.push(player);
    }

    current_player() {
        return this.players[this.current_player_index];
    }

    next_turn() {
        //this.current_player().draw_card(this.deck.draw_random_normal_card()); //TODO for now, later choose
        for (let player of this.players) {
            if (player.get_score() >= 10) {
                this.last_turn = true;
            }
        }

        this.current_player_index = (this.current_player_index + 1) % this.players.length;

        if (this.current_player_index === 0) {
            this.turn++;
            if (this.last_turn) {
                this.end_game();
            }
        }
    }

    end_game() {
        this.phase = 2;
        render_results(this);
        show_view("results");
    }

    prepare_game() {
        const center_x = Math.floor((BOARD_W / UNIT) / 2 - CARD_W / 2);
        const center_y = Math.floor((BOARD_H / UNIT) / 2 - CARD_H / 2);

        this.deck.generate_deck();
        for (let player of this.players) {
            const starting_card = this.deck.draw_starting_card();
            player.board.place_card(starting_card, center_x, center_y, player.id, 0);
            player.board.starting_card = starting_card;


            player.draw_card(this.deck.draw_random_normal_card())
            player.draw_card(this.deck.draw_random_normal_card())
            player.draw_card(this.deck.draw_random_golden_card())
        }

        this.phase = 1;
    }

}