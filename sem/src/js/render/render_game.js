import { UNIT, BOARD_W, BOARD_H, CARD_W, CARD_H } from "../settings.js";

function render_header(game) {
    const players_bar = document.getElementById("players-bar");
    const turn_info = document.getElementById("turn-info");

    players_bar.innerHTML = "";
    for (const player of game.players) {
        players_bar.innerHTML += `<div class="player${game.current_player_index == player.id ? " active" : ""}">[${player.id}] ${player.name} ... ${player.get_score()}</div>`
    }

    turn_info.textContent = `Turn: ${game.turn}`;
}

export function render_board(game) {
    const current_player = game.players[game.current_player_index];
    const board = current_player.board;

    const board_container = document.getElementById("board-container");
    const layer = document.getElementById("board-cards-layer");
    const hand_layer = document.getElementById("player-hand-layer");

    layer.innerHTML = "";
    hand_layer.innerHTML = "";

    for (const card of board.placed_cards) {
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

        //card_el.style.left = `${idx * CARD_W * UNIT}px`;
        //card_el.style.top = "0px";

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
        const board_rect = document.getElementById("board-container").getBoundingClientRect();

        offset_x = event.clientX - rect.left;
        offset_y = event.clientY - rect.top;

        card_el.style.left = `${rect.left - board_rect.left}px`;
        card_el.style.top = `${rect.top - board_rect.top}px`;

        document.getElementById("board-cards-layer").appendChild(card_el);

        card_el.setPointerCapture(event.pointerId);
    }

    function drag_moving(event) {
        if (!dragging) return;

        const board_rect = document.getElementById("board-container").getBoundingClientRect();

        let new_x = event.clientX - board_rect.left - offset_x;
        let new_y = event.clientY - board_rect.top - offset_y;

        card_el.style.left = `${new_x}px`;
        card_el.style.top = `${new_y}px`;
    }

    function is_on_board(mouse_x, mouse_y, board_rect) {
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

        if (is_on_board(mouse_x, mouse_y, board_rect)/* && TODO valid placement*/) {
            current_player.remove_from_hand(card);
            board.place_card(card, grid_x, grid_y, current_player.id, game.turn);
            current_player.score += card.get_score();
            //TODO start drawing a card
            game.next_turn()
        }
        else {
            document.getElementById("player-hand-layer").appendChild(card_el);
        }

        render_board(game);
    }

    card_el.addEventListener("pointerdown", drag_start)
    card_el.addEventListener("pointermove", drag_moving)
    card_el.addEventListener("pointerup", drag_release)
}

export function render_game(game) {
    render_header(game);
    render_board(game);
}