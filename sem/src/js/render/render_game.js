
import { UNIT, BOARD_W, BOARD_H, CARD_W, CARD_H } from "../settings.js";

let turn_timeout = null;

function render_header(game) {
    const players_bar = document.getElementById("players-bar");
    const turn_info = document.getElementById("turn-info");

    players_bar.innerHTML = "";
    for (const player of game.players) {
        players_bar.innerHTML += `<div class="player${game.current_player_index == player.id ? " active" : ""}">[${player.id}] ${player.name} ... ${player.get_score()}</div>`
    }

    turn_info.textContent = `Turn: ${game.turn}`;
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

function show_turn(player_name) {
    const wait = document.getElementById("turn-wait");

    wait.textContent = `Playing: ${player_name}`;
    wait.classList.add("visible");

    clearTimeout(turn_timeout);

    turn_timeout = setTimeout(() => {
        wait.classList.remove("visible");
    }, 1200);




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

export function render_board(game) {
    const current_player = game.current_player();
    const board = current_player.board;

    const board_container = document.getElementById("board-container");
    const layer = document.getElementById("board-cards-layer");
    const hand_layer = document.getElementById("player-hand-layer");

    layer.innerHTML = "";
    hand_layer.innerHTML = "";

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

    current_player.hand.forEach((card, idx) => {
        const card_el = document.createElement("codex-card");

        card_el.set_card(card);

        attach_drag(card_el, card, board, game, current_player);

        hand_layer.appendChild(card_el);
    })
}

function attach_drag(card_el, card, board, game, current_player) {
    let dragging = false;
    let offset_x = 0;
    let offset_y = 0;

    function drag_start(event) {
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
        if (!dragging) return;

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

    function drag_release(event) { //for playing card
        if (!dragging) return;
        dragging = false;
        card_el.classList.remove("dragging");

        const board_rect = document.getElementById("board-container").getBoundingClientRect();

        const mouse_x = event.clientX - board_rect.left - offset_x;
        const mouse_y = event.clientY - board_rect.top - offset_y;

        const grid_x = Math.round(mouse_x / UNIT);
        const grid_y = Math.round(mouse_y / UNIT);

        if (is_on_board(mouse_x, mouse_y)/* && TODO valid placement*/) {
            current_player.remove_from_hand(card);
            board.place_card(card, grid_x, grid_y, current_player.id, game.turn);
            current_player.score += card.get_score();
            //TODO start drawing a card
            game.next_turn()
            show_turn(current_player.name);
        }
        else {
            document.getElementById("player-hand-layer").appendChild(card_el);
        }
        document.getElementById("board-drag-layer").innerHTML = "";

        render_board(game);
    }

    card_el.addEventListener("pointerdown", drag_start)
    card_el.addEventListener("pointermove", drag_moving)
    card_el.addEventListener("pointerup", drag_release)
}

export function render_game(game) {
    render_header(game);
    render_board(game);

    const current_player = game.current_player();
    center_on_card(current_player.board.placed_cards[current_player.board.placed_cards.length - 1]);
}