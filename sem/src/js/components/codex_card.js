import { Card, Colors, Symbols } from "../game/cards.js";

export class CodexCard extends HTMLElement {
    constructor() {
        super();
        this.card = null;
    }

    set_card(card) {
        this.card = card;
        if (card.placed) {
            this.style.zIndex = this.card.placed_turn; //to show correctly overlaping
        }
        this.render();
    }

    render() {
        if (!this.card) return;

        const map_colors = {
            [Colors.red]: "#c85d4b",
            [Colors.blue]: "#4d84c4",
            [Colors.green]: "#5ea05e",
            [Colors.purple]: "#8e63b7"
        };

        const bg = map_colors[[this.card.color]] || "#999";

        const map_symbols = {
            [Symbols.red]: "#c85d4b",
            [Symbols.blue]: "#4d84c4",
            [Symbols.green]: "#5ea05e",
            [Symbols.purple]: "#8e63b7",
            [Symbols.paper]: "#fcf0d2",
            [Symbols.ink]: "#000000",
            [Symbols.feather]: "#f5d15c",
            "": "#999"
        }

        this.innerHTML = `
            <div class="card-root">
                <div class="corner tl back">
                    <div class="corner tl" style="background-color:${map_symbols[this.card.symbols[0] ?? ""]}"></div>
                </div>
                <div class="corner tr back">
                    <div class="corner tr" style="background-color:${map_symbols[this.card.symbols[1] ?? ""]}"></div>
                </div>
                <div class="corner br back">
                    <div class="corner br" style="background-color:${map_symbols[this.card.symbols[2] ?? ""]}"></div>
                </div>
                <div class="corner bl back">
                    <div class="corner bl" style="background-color:${map_symbols[this.card.symbols[3] ?? ""]}"></div>
                </div>

                <div class="card-center">
                    <div> ${this.card.points}</div>
                    <div class="debug">_id: ${this.card.id}</div>
                    <div class="requirements">
                    ${this.card.requirements
                        ? this.card.requirements
                            .map(symbol => `<div class="symbol "style="background-color:${map_symbols[symbol]}"></div>`)
                            .join("")
                        : ""
                    }
                    </div>
                </div>
            </div>
        `;

        this.style.setProperty("--card-bg", bg);
    }
}

customElements.define("codex-card", CodexCard);