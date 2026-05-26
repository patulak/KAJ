import { Card, Colors, GoldenCard } from "./game/cards.js";
import { Game } from "./game/game.js";
import { Player } from "./game/player.js";
import { render_game } from "./render/render_game.js";
import { draw_grid } from "./render/render_grid.js";
import { show_view, handle_route, navigate_to } from "./tools/tools.js"
import { init_setup } from "./menu/setup.js";
import { render_results } from "./render/render_results.js";

let g = new Game();

const menu = document.getElementById("menu-button");
const rules = document.getElementById("rules-button");
const setup = document.getElementById("setup-button");
const game = document.getElementById("game-button");
const results = document.getElementById("results-button");


menu.addEventListener("click", (event) => { navigate_to("menu") })
rules.addEventListener("click", (event) => { navigate_to("rules") })
setup.addEventListener("click", (event) => { navigate_to("setup") })
game.addEventListener("click", (event) => { navigate_to("game") })
results.addEventListener("click", (event) => { navigate_to("results") })


function get_view_from_url() {
    return location.hash.replace("#", "") || "menu";
}

const start_view = get_view_from_url();

history.replaceState({ view: start_view }, "", `#${start_view}`);
show_view(start_view);

window.addEventListener("popstate", (event) => {
    const view = event.state?.view ?? "menu";
    show_view(view);
});
window.addEventListener("hashchange", handle_route);
window.addEventListener("load", handle_route);

const clear_button = document.getElementById("clear-results-button");
clear_button.addEventListener("click", () => {
    if (!confirm("Delete all saved results?")) {
        return;
    }
    localStorage.removeItem("codex-results-history");
    render_results(g);
});

window.game = g; //debug in console

init_setup((username) => {
    let player = new Player(username, Colors.all_colors()[g.players.length]);
    g.add_player(player);
    //console.log(player);
}, () => {
    show_view("game");
    g.prepare_game();
    draw_grid()
    render_game(g);
    //console.log("GAME", g);
})



/*let card1 = new Card(Colors.red, [0, 1, 1, 0], [null, Colors.red, Colors.blue, null], 0);
let card2 = new Card(Colors.purple, [1, 1, 1, 0], [Colors.red, null, Colors.green, null], 1);
let card3 = new GoldenCard(Colors.green, [0, 1, 1, 0], [null, null, null, null], 5, [Colors.green, Colors.green, Colors.green, Colors.green, Colors.green]);

let card4 = new Card(Colors.blue, [0, 1, 1, 0], [null, Colors.purple, Colors.blue, null], 0);
let card5 = new Card(Colors.green, [1, 1, 1, 0], [Colors.red, null, Colors.green, null], 1);
let card6 = new GoldenCard(Colors.red, [0, 1, 1, 0], [null, null, null, null], 5, [Colors.green, Colors.green, Colors.green]);

g.players[1].board.place_card(card4, 1, 1, p2.id, 1);
g.players[1].board.place_card(card5, 5, 5, p2.id, 2);
g.players[1].draw_card(card6)

//g.players[0].board.place_card(card1, 6, 3, p1.id, 1);
//g.players[0].board.place_card(card2, 0, 0, p1.id, 2);
//g.players[0].board.place_card(card3, 10, 5, p1.id, 3)
g.players[0].draw_card(card3)

g.turn = 3;*/



//draw all cards
/*
let i = 0;
let x = 0;
let y = 0;
for (let card of g.deck.cards) {
    g.players[0].board.place_card(card, x, y, p1.id, i)
    i++;
    x += 6;
    if (i % 5 == 0) {
        x = 0;
        y += 4;
    }
}*/

//console.log(g.deck.cards);

