import { Card, Symbols, Colors, GoldenCard } from "./cards.js";

export class Deck {

    constructor() {
        this.cards = [];
        this.not_drawed_cards = [];
        this.drawed_cards = [];
        this.starting_cards = [];
        this.drawed_starting_cards = [];
    }

    generate_deck() {
        //const all_corners = [tl, tr, br, bl]

        const specials = [Symbols.paper, Symbols.ink, Symbols.feather];
        let last_color = Colors.all_colors()[Colors.all_colors().length - 1];
        let overall = 0;
        let two_corners = [[1, 1, 0, 0], [0, 1, 1, 0], [0, 0, 1, 1], [1, 0, 0, 1]];
        for (let color of Colors.all_colors()) {
            //normal
            for (let i = 0; i < 4; i++) {
                let corners = [];
                let symbols = [];
                let pushed = false;
                for (let j = 0; j < 4; j++) {
                    corners.push(i == j ? 0 : 1);
                    symbols.push(i == j ? null : color);
                    if (i != j && !pushed) {
                        symbols[j] = null;
                        pushed = true;
                    }
                }
                this.cards.push(new Card(color, corners, symbols, 0))
            }
            for (let i = 0; i < 3; i++) {
                let corners = [];
                let symbols = [];
                let symbols2 = [];
                let corners2 = [];

                let pair_symbols = [];


                let prep_symbols2 = [null, color, last_color, specials[i]];
                for (let j = 0; j < 4; j++) {
                    corners.push(i == j ? 0 : 1);
                    symbols.push(i + 1 == j ? color : null);
                    symbols2.push(prep_symbols2[(j + i + overall) % 4]);
                    corners2.push(symbols2[j] != null ? 1 : 0);
                    pair_symbols.push(j == two_corners[(i + overall) % 4].findIndex((e) => e == 1) ? specials[i] : 0);
                }
                this.cards.push(new Card(color, corners, symbols, 0));
                this.cards.push(new Card(color, corners2, symbols2, 0));
                //golden

                this.cards.push(new GoldenCard(color, two_corners[(i + overall) % 4], pair_symbols, 3, [color, color, color]));
            }
            let current_color = 0;
            for (let i = 0; i < 3; i++) {
                let corners = [];
                let corners2 = [];
                let symbols = [null, null, null, null];
                let symbols2 = [null, null, null, null];

                let count = 0;

                for (let j = 0; j < 4; j++) {
                    corners.push((i + overall) % 4 == j ? 0 : 1);
                    corners2.push((i + 1 + overall) % 4 == j ? 0 : 1);
                    if (corners2[j] == 1) {

                        if (count == i) {
                            symbols2[j] = specials[i];
                        }
                        count++;
                    }

                }
                if (Colors.all_colors()[current_color] == color) {
                    current_color++;
                }

                this.cards.push(new GoldenCard(color, corners, symbols, 2, [color, color, color, Colors.all_colors()[current_color]], false, null, true));
                this.cards.push(new GoldenCard(color, corners2, symbols2, 1, [color, color, Colors.all_colors()[current_color]], true, specials[i], false));
                current_color++;
            }

            last_color = color;
            overall++;
        }
        this.cards.push(new GoldenCard(Colors.red,
            [1, 1, 0, 0],
            [null, null, null, null],
            5,
            [Colors.red, Colors.red, Colors.red, Colors.red, Colors.red]));
        this.cards.push(new GoldenCard(Colors.blue,
            [0, 1, 1, 0],
            [null, null, null, null],
            5,
            [Colors.blue, Colors.blue, Colors.blue, Colors.blue, Colors.blue]));
        this.cards.push(new GoldenCard(Colors.purple,
            [0, 0, 1, 1],
            [null, null, null, null],
            5,
            [Colors.purple, Colors.purple, Colors.purple, Colors.purple, Colors.purple]));
        this.cards.push(new GoldenCard(Colors.green,
            [1, 0, 0, 1],
            [null, null, null, null],
            5,
            [Colors.green, Colors.green, Colors.green, Colors.green, Colors.green]));

        for (let i = 0; i < this.cards.length; i++) {
            this.not_drawed_cards.push(this.cards[i]);
        }

        this.generate_starting_cards();
        this.generate_objectives();
    }

    generate_starting_cards() {
        let card = new Card(null, [1, 1, 1, 1], [null, null, null, null], 0);
        card.fixed_symbols = [Symbols.blue, Symbols.purple];
        this.starting_cards.push(card);
        card = new Card(null, [1, 1, 1, 1], [null, null, null, null], 0);
        card.fixed_symbols = [Symbols.green, Symbols.red];
        this.starting_cards.push(card);

        card = new Card(null, [1, 1, 1, 1], [Symbols.blue, null, Symbols.red, null], 0);
        card.fixed_symbols = [Symbols.red];
        this.starting_cards.push(card);
        card = new Card(null, [1, 1, 1, 1], [null, Symbols.green, null, Symbols.purple], 0);
        card.fixed_symbols = [Symbols.purple];
        this.starting_cards.push(card);

        card = new Card(null, [1, 1, 0, 0], [null, null, null, null], 0);
        card.fixed_symbols = [Symbols.red, Symbols.blue, Symbols.green];
        this.starting_cards.push(card);
        card = new Card(null, [1, 1, 0, 0], [null, null, null, null], 0);
        card.fixed_symbols = [Symbols.purple, Symbols.blue, Symbols.green];
        this.starting_cards.push(card);
    }
    generate_objectives() {

    }

    draw_random_card() {
        if (this.not_drawed_cards.length === 0) {
            return null;
        }
        const index = Math.floor(Math.random() * this.not_drawed_cards.length);
        const cards = this.not_drawed_cards.splice(index, 1);
        this.drawed_cards.push(cards[0]);
        return cards[0];
    }

    draw_starting_card() {
        if (this.starting_cards.length === 0) {
            return null;
        }
        const index = Math.floor(Math.random() * this.starting_cards.length);
        const cards = this.starting_cards.splice(index, 1);
        this.drawed_starting_cards.push(cards[0]);
        return cards[0];
    }


}

