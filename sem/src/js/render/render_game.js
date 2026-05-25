
import { UNIT, BOARD_W, BOARD_H, CARD_W, CARD_H } from "../settings.js";

let turn_timeout = null;
let switch_timeout = null;
let card_draw_timeout = null;

function render_header(game) {
    const players_bar = document.getElementById("players-bar");
    const turn_info = document.getElementById("turn-info");

    players_bar.innerHTML = "";
    for (const player of game.players) {
        players_bar.innerHTML += `<div class="player${game.current_player_index == player.id ? " active" : ""}">[${player.id}] ${player.name} ... ${player.get_score()}</div>`
    }

    turn_info.innerHTML = `Turn: ${game.turn}<br>Playing: ${game.current_player().name}`;
}

function center_on_card(card) {
    const viewport = document.getElementById("board-viewport");

    const grid_card_w = CARD_W * UNIT;
    const grid_card_h = CARD_H * UNIT;

    const target_x = card.x * UNIT + grid_card_w / 2 - viewport.clientWidth / 2;
    const target_y = card.y * UNIT + grid_card_h / 2 - viewport.clientHeight / 2;

    viewport.scrollTo({
        left: target_x,
        top: target_y,
        behavior: "smooth"
    });
}

function show_turn(player_name, game, drawn_card) { //+next_turn

    function show_name_and_switch() {
        // show who playing
        wait.textContent = `Playing: ${player_name}`;
        wait.classList.add("visible");
        clearTimeout(turn_timeout);
        turn_timeout = setTimeout(() => {
            wait.classList.remove("visible");
        }, 2000);


        // transtition switch to next player
        view.classList.add("switching-players");
        clearTimeout(switch_timeout);
        switch_timeout = setTimeout(() => {
            game.next_turn();
            render_game(game);
            game.current_player().phase = "place";
            view.classList.remove("switching-players");
        }, 600);
    }


    const wait = document.getElementById("turn-wait");
    const view = document.getElementById("view-game");

    // store x,y.. render card in hand, apply transition from original x,y
    const drawn_el = document.querySelector(`[data-card-id="${drawn_card.id}"]`);
    let start_rect = null;
    if (drawn_el) {
        start_rect = drawn_el.getBoundingClientRect();
    }

    render_hand(game);

    const hand_card = document.querySelector(`#player-hand-layer codex-card[data-card-id="${drawn_card.id}"]`);
    if (hand_card && start_rect) {
        const end_rect = hand_card.getBoundingClientRect();

        const dx = end_rect.left - start_rect.left;
        const dy = (end_rect.top - start_rect.bottom) / 2 - CARD_H * UNIT; //dont ask me.. this just works??

        // start from old position
        hand_card.style.transform = `translate(${-dx}px, ${dy}px) scale(1.1)`;
        hand_card.style.zIndex = "1000";

        // force reflow
        hand_card.getBoundingClientRect();

        // animate to normal position
        hand_card.style.transition = "transform 1s ease";
        hand_card.style.transform = "translate(0, 0) scale(1)";

        hand_card.addEventListener("transitionend", () => {
            hand_card.style.transition = "";
            hand_card.style.zIndex = "";

            show_name_and_switch();
        }, { once: true });


    }
    else {
        hand_card.classList.add("hand-card-enter");

        setTimeout(() => {
            hand_card.classList.add("visible");
            clearTimeout(card_draw_timeout);
            card_draw_timeout = setTimeout(() => {
                hand_card.classList.remove("hand-card-enter");
                hand_card.classList.remove("visible");
                show_name_and_switch();
            }, 750);
        }, 250);

    }




}

function toggle_draw_pile() {
    const draw_layer = document.getElementById("draw-overlay");
    draw_layer.classList.toggle("shown");
}

/*function is_visible(card) {
    const container = document.getElementById("board-viewport");

    const left = container.scrollLeft;
    const top = container.scrollTop;
    const right = left + container.clientWidth;
    const bottom = top + container.clientHeight;

    const card_left = card.x * UNIT;
    const card_top = card.y * UNIT;
    const card_right = card_left + CARD_W * UNIT;
    const card_bottom = card_top + CARD_H * UNIT;

    return !(
        card_right < left ||
        card_left > right ||
        card_bottom < top ||
        card_top > bottom
    );
}*/

export function render_draw_pile(game) {

    function draw_and_refill(source, index = null) {
        const player = game.current_player();

        let drawn_card = null;

        if (source === "normal_deck") {
            drawn_card = game.deck.draw_random_normal_card();
        } else if (source === "gold_deck") {
            drawn_card = game.deck.draw_random_golden_card();
        } else if (source === "shown_normal") {
            drawn_card = game.deck.take_shown_normal_card(index);
        } else if (source === "shown_golden") {
            drawn_card = game.deck.take_shown_golden_card(index);
        }

        if (!drawn_card) return false;

        player.draw_card(drawn_card);

        toggle_draw_pile();

        return drawn_card;
    }

    const layer = document.getElementById("board-draw-layer");
    layer.innerHTML = "";

    layer.innerHTML = `
        <div class="draw-section">
            <h3>Normal cards</h3>
            <div class="draw-row">
                <button class="deck-button" data-source="normal_deck">
                    Deck<br>
                    ${game.deck.normal_cards.length} left
                </button>

                <div id="shown-normal-cards" class="shown-cards"></div>
            </div>
        </div>

        <div class="draw-section">
            <h3>Golden cards</h3>
            <div class="draw-row">
                <button class="deck-button gold" data-source="gold_deck">
                    Deck<br>
                    ${game.deck.golden_cards.length} left
                </button>

                <div id="shown-golden-cards" class="shown-cards"></div>
            </div>
        </div>
    `;

    const normal_container = document.getElementById("shown-normal-cards");
    const golden_container = document.getElementById("shown-golden-cards");

    game.deck.shown_normal_cards.forEach((card, index) => {
        const el = document.createElement("codex-card");
        el.set_card(card);
        el.classList.add("draw-card");
        el.dataset.source = "shown_normal";
        el.dataset.index = index;

        normal_container.appendChild(el);
    });

    game.deck.shown_golden_cards.forEach((card, index) => {
        const el = document.createElement("codex-card");
        el.set_card(card);
        el.classList.add("draw-card");
        el.dataset.source = "shown_golden";
        el.dataset.index = index;

        golden_container.appendChild(el);
    });

    /* events */
    layer.querySelector('[data-source="normal_deck"]').addEventListener("click", () => {
        let drawn_card = draw_and_refill("normal_deck");

        //game.next_turn();
        //render_game(game);
        show_turn(game.current_player().name, game, drawn_card);
    });

    layer.querySelector('[data-source="gold_deck"]').addEventListener("click", () => {
        let drawn_card = draw_and_refill("gold_deck");

        //game.next_turn();
        //render_game(game);
        show_turn(game.current_player().name, game, drawn_card);
    });

    normal_container.querySelectorAll("codex-card").forEach((el) => {
        el.addEventListener("click", () => {
            const index = Number(el.dataset.index);
            let drawn_card = draw_and_refill("shown_normal", index);

            //game.next_turn();
            //render_game(game);
            show_turn(game.current_player().name, game, drawn_card);
        });
    });

    golden_container.querySelectorAll("codex-card").forEach((el) => {
        el.addEventListener("click", () => {
            const index = Number(el.dataset.index);
            let drawn_card = draw_and_refill("shown_golden", index);

            //game.next_turn();
            //render_game(game);
            show_turn(game.current_player().name, game, drawn_card);
        });
    });
}

export function render_hand(game) {
    const hand_layer = document.getElementById("player-hand-layer");
    const current_player = game.current_player();
    hand_layer.innerHTML = "";

    current_player.hand.forEach((card, idx) => {
        const card_el = document.createElement("codex-card");

        card_el.set_card(card);

        attach_drag(card_el, card, current_player.board, game, current_player);

        hand_layer.appendChild(card_el);
    })
}

export function render_board(game) {
    const current_player = game.current_player();
    const board = current_player.board;

    const board_container = document.getElementById("board-container");
    const layer = document.getElementById("board-cards-layer");


    layer.innerHTML = "";


    for (const card of board.placed_cards) {
        /*if (!is_visible(card)) { //must rerender on scroll
            console - console.log("SAVED");

            continue;
        }*/
        const card_el = document.createElement("codex-card");

        card_el.set_card(card);

        card_el.style.left = `${card.x * UNIT}px`;
        card_el.style.top = `${card.y * UNIT}px`;

        //no moving, its placed

        layer.appendChild(card_el);
    }
}

function attach_drag(card_el, card, board, game, current_player) {
    let dragging = false;
    let offset_x = 0;
    let offset_y = 0;

    function drag_start(event) {
        if (current_player.phase != "place" || game.phase == 2) { return };
        dragging = true;
        card_el.classList.add("dragging");

        const rect = card_el.getBoundingClientRect();
        const board_rect = document.getElementById("board-drag-layer").getBoundingClientRect();

        offset_x = event.clientX - rect.left;
        offset_y = event.clientY - rect.top;

        card_el.style.left = `${rect.left - board_rect.left}px`;
        card_el.style.top = `${rect.top - board_rect.top}px`;

        document.getElementById("board-drag-layer").appendChild(card_el);

        card_el.setPointerCapture(event.pointerId);
    }

    function drag_moving(event) {
        if (!dragging || current_player.phase != "place") return;

        const board_rect = document.getElementById("board-drag-layer").getBoundingClientRect();

        let new_x = event.clientX - board_rect.left - offset_x;
        let new_y = event.clientY - board_rect.top - offset_y;

        card_el.style.left = `${new_x}px`;
        card_el.style.top = `${new_y}px`;
    }

    function is_on_board(mouse_x, mouse_y) {
        const board_rect = document.getElementById("board-viewport").getBoundingClientRect();
        const rect = card_el.getBoundingClientRect();
        const top_y = rect.y;
        const bottom_y = rect.y + rect.height;
        const left_x = rect.x;
        const right_x = rect.x + rect.width;

        if (board_rect.x <= left_x && right_x <= board_rect.x + board_rect.width &&
            board_rect.y <= top_y && bottom_y <= board_rect.y + board_rect.height
        ) {
            return true
        }
        return false;
    }

    function get_card_cells(x, y) {
        const cells = [];
        for (let dx = 0; dx < CARD_W; dx++) {
            for (let dy = 0; dy < CARD_H; dy++) {
                cells.push({
                    x: x + dx,
                    y: y + dy
                });
            }
        }
        return cells;
    }

    function is_on_valid_corner(x, y) {
        /* NOTE: whoever tries to read or redo this will be hanged at the sunrise*/
        function is_card_corner(card_x, card_y, cell_x, cell_y) {

            if (cell_x === card_x && cell_y === card_y) { return { result: true, where: "tl" } }
            if (cell_x === card_x + CARD_W - 1 && cell_y === card_y) { return { result: true, where: "tr" } }
            if (cell_x === card_x + CARD_W - 1 && cell_y === card_y + CARD_H - 1) { return { result: true, where: "br" } }
            if (cell_x === card_x && cell_y === card_y + CARD_H - 1) { return { result: true, where: "bl" } }
            return { result: false, where: "" }

        }

        //not possible to place without covering an corner, so check only them
        const corners = [{ x: x, y: y }, { x: x + CARD_W - 1, y: y }, { x: x + CARD_W - 1, y: y + CARD_H - 1 }, { x: x, y: y + CARD_H - 1 }];

        let found_overlap = false;
        let overlap_count = 0;
        let overlap_cards = [];

        for (let card of board.placed_cards) {
            const check_corners = card.get_corners_coords();
            if (corners[0].x <= check_corners[1].x &&
                corners[1].x >= check_corners[0].x &&
                corners[0].y <= check_corners[2].y &&
                corners[2].y >= check_corners[0].y
            ) {
                //console.log("COLIDING!");
                for (let cell of get_card_cells(x, y)) {

                    if (check_corners[0].x <= cell.x && cell.x <= check_corners[1].x &&
                        check_corners[0].y <= cell.y && cell.y <= check_corners[2].y
                    ) {
                        overlap_count++;
                        const corner_obj = is_card_corner(x, y, cell.x, cell.y);
                        const is_placing_corner = corner_obj.result;
                        const where_corner = corner_obj.where;

                        let is_placed_corner = false;
                        let open_corner = false;

                        let i = 0;
                        for (let corn of check_corners) {
                            //console.log(corn);
                            if (corn.x == cell.x && corn.y == cell.y) {
                                is_placed_corner = true;
                                open_corner = card.corners[i] == 1;
                            }
                            i++;
                        }
                        //console.log(is_placed_corner, is_placing_corner, open_corner);
                        //console.log(cell, card);
                        if (!(is_placed_corner && is_placed_corner && open_corner)) {
                            //console.log("FALSE");
                            return false;
                        }
                        found_overlap = true;

                        const original_obj = is_card_corner(card.x, card.y, cell.x, cell.y);
                        overlap_cards.push({ card: card, where: where_corner, where_origin: original_obj.where });
                    }
                }
            }
        }
        //console.log(corners);
        //console.log("TRUE", found_overlap);
        return { result: found_overlap, overlap_cards: overlap_cards };
    }

    function drag_release(event) { //for playing card
        if (!dragging) return;

        dragging = false;
        card_el.classList.remove("dragging");

        const board_rect = document.getElementById("board-container").getBoundingClientRect();

        const mouse_x = event.clientX - board_rect.left - offset_x;
        const mouse_y = event.clientY - board_rect.top - offset_y;

        const grid_x = Math.round(mouse_x / UNIT);
        const grid_y = Math.round(mouse_y / UNIT);

        const corner_obj = is_on_valid_corner(grid_x, grid_y);
        const result = corner_obj.result;
        const overlap_cards = corner_obj.overlap_cards;

        const symbol_count = board.get_visible_symbols();
        let req = card.requirements;
        if (req == null) {
            req = true;
        }
        else {
            req = card.meet_requirements(symbol_count);
        }

        if (is_on_board(mouse_x, mouse_y) && result && current_player.phase == "place" && req) {
            current_player.remove_from_hand(card);
            board.place_card(card, grid_x, grid_y, current_player.id, game.turn);

            current_player.phase = "draw";

            for (let state of overlap_cards) {
                card.overlap_cards.push({ card: state.card, where: state.where });
                state.card.overlap_cards.push({ card: card, where: state.where_origin });
            }
            //console.log(card);

            toggle_draw_pile();

            current_player.score += card.get_score();
            if (card.golden) {
                const symbol_count_updated = board.get_visible_symbols();
                current_player.score += card.get_special_score(symbol_count_updated);
            }

            //game.next_turn()
            //show_turn(current_player.name);
        }
        document.getElementById("board-drag-layer").innerHTML = "";

        render_game(game);
    }

    card_el.addEventListener("pointerdown", drag_start)
    card_el.addEventListener("pointermove", drag_moving)
    card_el.addEventListener("pointerup", drag_release)
}

export function render_game(game) {
    render_header(game);
    render_board(game);
    render_hand(game);
    render_draw_pile(game);

    const current_player = game.current_player();
    center_on_card(current_player.board.placed_cards[current_player.board.placed_cards.length - 1]);
}