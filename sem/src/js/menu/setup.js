
const form = document.getElementById("setup-form");
const player_count = document.getElementById("setup-player-count");
const player_div = document.querySelector("#setup-form div");

player_count.addEventListener("change", () => {
    const current = player_div.children;
    const requested = parseInt(player_count.value);
    if (requested <= 0 || requested > 4) {
        return;
    }

    if (current.length < requested) {
        let add_count = requested - current.length;
        for (let i = 0; i < add_count; i++) {
            const input = document.createElement("input");

            input.type = "text";
            input.name = "setup-usernames[]";
            input.placeholder = `Player ${current.length + i + 1}`;

            player_div.appendChild(input);
        }
    }
    else {
        let remove_count = current.length - requested;

        for (let i = 0; i < remove_count; i++) {
            player_div.removeChild(player_div.lastElementChild);
        }
    }
});

export function init_setup(add_player, on_finish){
    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const data = new FormData(form);
        const usernames = data.getAll("setup-usernames[]");

        for(let username of usernames){
            add_player(username);
        }
        on_finish();
    });
}