import Dashboard from "./Dashboard.svelte";

const target = document.getElementById("app");

function render() {
    new Dashboard({ target });
}

document.addEventListener("DOMContentLoaded", render);
