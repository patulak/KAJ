
function format_result_date(date_string) {
    const date = new Date(date_string);

    return date.toLocaleString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
}

export function render_results(game) {
    const results_view = document.getElementById("view-results");
    const winner_card = document.querySelector(".winner-card");
    const result_grid = document.querySelector(".results-grid");

    if(game.players.length == 0){
        winner_card.innerHTML = "No Winner yet!";
        return;
    }

    const players = [...game.players];
    players.sort((a, b) => b.get_score() - a.get_score());

    winner_card.innerHTML = `
            <span class="winner-label">Winner</span>
            <h2>${players[0].name}</h2>
            <p>${players[0].get_score()} points</p>
    `;

    let scoreboard = "";
    players.forEach((player, index) => {
        scoreboard += `
            <div class="player-result">
                <div class="player-rank">#${index + 1}</div>
                <h3>${player.name}</h3>
                <p>${player.get_score()} points</p>
            </div>
        `;
    });

    result_grid.innerHTML = scoreboard;

    const saved = localStorage.getItem("codex-results-history");
    const history_data = saved ? JSON.parse(saved) : [];
    const history_list = document.querySelector(".history-list");
    history_list.innerHTML = "";
    if (history_data.length === 0) {
        history_list.innerHTML = `<p class="empty-history">No saved results yet.</p>`;
    }
    else {
        history_data.forEach((result, game_index) => {
            history_list.innerHTML += `
            <div class="history-game">
                <h3>Game ${history_data.length - game_index}</h3>
                <p class="history-date">${format_result_date(result.date)}</p>
                <div class="history-players">
                    ${result.players.map((player, index) => `
                        <div class="history-player ${index === 0 ? "history-winner" : ""}">
                            <span>#${index + 1}</span>
                            <strong>${player.name}</strong>
                            <span>${player.score} pts</span>
                        </div>
                    `).join("")}
                </div>
            </div>
        `;
        });
    }
}
