import { Card, Colors, GoldenCard } from "./game/cards.js";
import { Game } from "./game/game.js";
import { Player } from "./game/player.js";
import { render_game } from "./render/render_game.js";
import { draw_grid } from "./render/render_grid.js";
import { show_view } from "./tools/tools.js"
import { init_setup } from "./menu/setup.js";

const menu = document.getElementById("menu-button");
const rules = document.getElementById("rules-button");
const setup = document.getElementById("setup-button");
const game = document.getElementById("game-button");
const results = document.getElementById("results-button");

menu.addEventListener("click", (event) => { show_view("menu") })
rules.addEventListener("click", (event) => { show_view("rules") })
setup.addEventListener("click", (event) => { show_view("setup") })
game.addEventListener("click", (event) => { show_view("game") })
results.addEventListener("click", (event) => { show_view("results") })



let g = new Game();

init_setup((username) => {
    let player = new Player(username, Colors.all_colors()[g.players.length]);
    g.add_player(player);
    console.log(player);
}, () => {
    show_view("game");
    g.prepare_game();
    draw_grid()
    render_game(g);
    console.log("GAME", g);
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

