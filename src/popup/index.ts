import Popup from "./Popup.svelte";

const target = document.getElementById("app");

function render() {
    new Popup({ target });
}

document.addEventListener("DOMContentLoaded", render);
