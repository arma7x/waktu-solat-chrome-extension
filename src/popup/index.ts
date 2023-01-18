import Popup from "./Popup.svelte";
import { storage } from "src/storage";

const target = document.getElementById("app");

function render() {
    storage.get().then(({ count }) => {
        new Popup({ target, props: { count } });
    });
}

document.addEventListener("DOMContentLoaded", render);
