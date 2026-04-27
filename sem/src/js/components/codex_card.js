import { Card, Colors, GoldenCard, Symbols } from "../game/cards.js";

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

        const bg = map_colors[[this.card.color]] || "#cccccc";

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

        function get_corner_color(card, idx) {
            if (card.corners[idx]) {
                return `style="background-color: ${map_symbols[card.symbols[idx] ?? ""]}"`;
            }
            else {
                return "";
            }
        }

        if (!this.card.is_flipped) {
            this.innerHTML = `
            <div class="card-root${this.card.golden ? " golden" : ""}">
                <div class="corner tl back${this.card.corners[0] ? " active" : ""}">
                    <div class="corner tl" ${get_corner_color(this.card, 0)}></div>
                </div>
                <div class="corner tr back${this.card.corners[1] ? " active" : ""}">
                    <div class="corner tr" ${get_corner_color(this.card, 1)}></div>
                </div>
                <div class="corner br back${this.card.corners[2] ? " active" : ""}">
                    <div class="corner br" ${get_corner_color(this.card, 2)}></div>
                </div>
                <div class="corner bl back${this.card.corners[3] ? " active" : ""}">
                    <div class="corner bl" ${get_corner_color(this.card, 3)}></div>
                </div>

                <div class="card-center">
                    <div> ${this.card.points}${this.card.per_corner ? " pc" : ""}${this.card.per_special_symbol ? " " + this.card.special_symbol : ""}</div>
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
        } else {
            this.innerHTML = `
            <div class="card-root${this.card.golden ? " golden" : ""}">
                <div class="corner tl back active">
                    <div class="corner tl"></div>
                </div>
                <div class="corner tr back active">
                    <div class="corner tr"></div>
                </div>
                <div class="corner br back active">
                    <div class="corner br"></div>
                </div>
                <div class="corner bl back active">
                    <div class="corner bl"></div>
                </div>

                <div class="card-center">
                    <div> class="debug" ${this.card.points}</div>
                    <div> flipped</div>
                    <div class="requirements debug"></div>
                </div>
            </div>
            `;
        }

        this.style.setProperty("--card-bg", bg);
        this.dataset.cardId = this.card.id;
    }
}

customElements.define("codex-card", CodexCard);