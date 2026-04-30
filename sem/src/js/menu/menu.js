import { show_view } from "../tools/tools.js";

const play_button = document.getElementsByClassName("menu-play-button");
if (play_button) {
    for (let element of play_button) {
        element.addEventListener("click", (event) => {
            show_view("setup");
        });
    }
}


const rules_button = document.getElementsByClassName("menu-rules-button");
if (rules_button) {
    for (let element of rules_button) {
        element.addEventListener("click", (event) => {
            show_view("rules");
        });
    }
}