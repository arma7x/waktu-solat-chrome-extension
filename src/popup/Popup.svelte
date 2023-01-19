<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { makeRequest } from "../api";
    import { storage, configStorage } from "../storage";

    export let count: number;
    let successMessage: string = null;

    let prayerTime;

    function openDashboard() {
        const optionsUrl = chrome.runtime.getURL('src/dashboard/dashboard.html');
        chrome.tabs.query({url: optionsUrl}, (tabs) => {
            if (tabs.length) {
                chrome.tabs.update(tabs[0].id, {active: true});
            } else {
                chrome.tabs.create({ 'url': optionsUrl });
            }
        });
    }

    function increment() {
        count += 1;
    }

    function decrement() {
        count -= 1;
    }

    function save() {
        storage.set({ count }).then(() => {
            successMessage = "Options saved!";

            setTimeout(() => {
                successMessage = null;
            }, 1500);
        });
    }

    onMount(async () => {
        try {
            const district = await configStorage.getZone();
            if (district != null) {
                const d = new Date();
                let today = `${d.getFullYear()}-${(d.getMonth() + 1) > 10 ? (d.getMonth() + 1) : '0'+(d.getMonth() + 1)}-${d.getDate()}`;
                const req = makeRequest("POST", "duration", district.code, { "datestart": today, "dateend": today });
                prayerTime = (await (await fetch(req)).json()).prayerTime;
                console.log(prayerTime);
            } else {

            }
        } catch (err) {
            console.error(err);
        }
    });

</script>

<div class="container">
    <p>Current count: <b>{count}</b></p>
    <div>
        <button on:click={decrement}>-</button>
        <button on:click={increment}>+</button>
        <button on:click={save}>Save</button>
        <button on:click={openDashboard}>Dashboard</button>
        {#if successMessage}<span class="success">{successMessage}</span>{/if}
    </div>
    {#if prayerTime }
        {JSON.stringify(prayerTime)};
    {/if}
</div>

<style>
    .container {
        min-width: 250px;
    }

    button {
        border-radius: 2px;
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.6);
        background-color: #2ecc71;
        color: #ecf0f1;
        transition: background-color 0.3s;
        padding: 5px 10px;
        border: none;
    }

    button:hover,
    button:focus {
        background-color: #27ae60;
    }

    .success {
        color: #2ecc71;
        font-weight: bold;
    }
</style>
