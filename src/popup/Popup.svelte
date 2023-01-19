<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { makeRequest } from "../api";
    import { configStorage } from "../storage";
    import { type DISTRICT, type WAKTU_SOLAT, PERIOD, WAKTU_SOLAT_SORT, WAKTU_SOLAT_BAHASA } from "../types";

    let prayerTime: WAKTU_SOLAT;
    let district: DISTRICT;
    let state: string;

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

    onMount(async () => {
        try {
            state = await configStorage.getState();
            district = await configStorage.getZone();
            if (district != null) {
                const d = new Date();
                let today = `${d.getFullYear()}-${(d.getMonth() + 1) > 10 ? (d.getMonth() + 1) : '0'+(d.getMonth() + 1)}-${d.getDate()}`;
                const req = makeRequest("POST", PERIOD.DURATION, district.code, { "datestart": today, "dateend": today });
                prayerTime = (await (await fetch(req)).json()).prayerTime[0];
                console.log(prayerTime);
            } else {

            }
        } catch (err) {
            console.error(err);
        }
    });

</script>

<div class="container">
    {#if prayerTime }
        <div>Negeri {state}</div>
        <div>Daerah/Lokasi {district.name}({district.code})</div>
        {#each WAKTU_SOLAT_SORT as key, idx}
            <div>{WAKTU_SOLAT_BAHASA[idx]} {prayerTime[key]}</div>
        {/each}
    {/if}
    <button on:click={openDashboard}>Dashboard</button>
</div>

<style>
    .container {
        min-width: 250px;
    }
</style>
