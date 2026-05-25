
export function render_results(game) {
    const results_view = document.getElementById("view-results");
    const winner_card = document.querySelector(".winner-card");
    const result_grid = document.querySelector(".results-grid");

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
            <div class="player-result ${index === 0 ? "first-place" : ""}">
                <div class="player-rank">#${index + 1}</div>
                <h3>${player.name}</h3>
                <p>${player.get_score()} points</p>
            </div>
        `;
    });

    result_grid.innerHTML = scoreboard;
}