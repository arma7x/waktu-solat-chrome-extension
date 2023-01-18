import Dashboard from "./Dashboard.svelte";
import { storage } from "src/storage";

const target = document.getElementById("app");

function render() {
    storage.get().then(({ count }) => {
        new Dashboard({ target, props: { count } });
    });
}

document.addEventListener("DOMContentLoaded", render);
