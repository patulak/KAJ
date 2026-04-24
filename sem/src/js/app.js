import { Card, Colors, GoldenCard } from "./game/cards.js";
import { Game } from "./game/game.js";
import { Player } from "./game/player.js";
import { render_game } from "./render/render_game.js";
import { draw_grid } from "./render/render_grid.js";

let p1 = new Player("kolac", Colors.red)
let p2 = new Player("pinki", Colors.blue)

let g = new Game();
g.add_player(p1);
g.add_player(p2);


let card1 = new Card(Colors.red, [0, 1, 1, 0], [null, Colors.red, Colors.blue, null], 0);
let card2 = new Card(Colors.purple, [1, 1, 1, 0], [Colors.red, null, Colors.green, null], 1);
let card3 = new GoldenCard(Colors.green, [0, 1, 1, 0], [null, null, null, null], 5, [Colors.green, Colors.green, Colors.green, Colors.green, Colors.green]);

g.players[0].board.place_card(card1, 6, 3, p1.id, 1)
g.players[0].board.place_card(card2, 0, 0, p1.id, 2)
//g.players[0].board.place_card(card3, 10, 5, p1.id, 3)
g.turn = 3;
g.players[0].draw_card(card3)


console.log(g);

draw_grid()
render_game(g);