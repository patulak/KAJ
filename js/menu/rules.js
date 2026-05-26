import { show_view } from "../tools/tools.js";


const prev = document.getElementById("rules-prev");
const next = document.getElementById("rules-next");
const back = document.getElementById("rules-back");

const images = document.querySelectorAll(".rules-images img");
let current_index = 0;

function update_rules_images(direction = "next") {
    images.forEach((img, index) => {
        img.classList.remove(
            "current-show",
            "slide-left",
            "slide-right",
            "hidden-left",
            "hidden-right"
        );

        if (index === current_index) {
            img.classList.add("current-show");
        }
        else if (index === (current_index - 1 + images.length) % images.length) {
            img.classList.add("hidden-left");
        }
        else if (index === (current_index + 1) % images.length) {
            img.classList.add("hidden-right");
        }
    });
}

function swap_image(direction) {
    if (direction === "next") {
        current_index = (current_index + 1) % images.length;
    }
    else {
        current_index = (current_index - 1 + images.length) % images.length;
    }

    update_rules_images(direction);
}

prev.addEventListener("click", () => swap_image("back"));
next.addEventListener("click", () => swap_image("next"));

back.addEventListener("click", () => {
    show_view("menu");
});

update_rules_images();