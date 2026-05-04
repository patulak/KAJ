
const prev = document.getElementById("rules-prev");
const next = document.getElementById("rules-next");

function swap_image(event, direction) {
    const images = document.querySelectorAll(".rules-images img");
    let original_i = 0;
    for (let i = 0; i < images.length; i++) {
        if (images[i].classList.contains("current-show")) {
            original_i = i;
            images[i].classList.remove("current-show");
            break;
        }
    }
    original_i = direction == "back" ? original_i - 1 : original_i + 1;
    original_i = (original_i + images.length) % images.length;
    images[original_i].classList.add("current-show");
    console.log(original_i);
}

prev.addEventListener("click", (event) => swap_image(event, "next"));
next.addEventListener("click", (event) => swap_image(event, "back"));