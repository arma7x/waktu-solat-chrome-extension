<script lang="ts">
    import "../content/styles.css";
    import { onMount, onDestroy } from 'svelte';
    import { makeRequest } from "../api";
    import { configStorage } from "../storage";
    import { type DISTRICT, type WAKTU_SOLAT, PERIOD, WAKTU_SOLAT_SORT, WAKTU_SOLAT_BAHASA, HARI_BAHASA, REQUEST_TYPE, getLocalTime, formatHijri } from "../types";

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
                const req = makeRequest(REQUEST_TYPE.POST, PERIOD.DURATION, district.code, { "datestart": today, "dateend": today });
                prayerTime = (await (await fetch(req)).json()).prayerTime[0];
            } else {

            }
        } catch (err) {
            console.error(err);
        }
    });

</script>

<div class="container">
    {#if prayerTime }
        <div>
            <div class="row-space-between">
                <h2>Negeri:</h2>
                <h3>{state}</h3>
            </div>
            <div class="row-space-between margin-top-2">
                <h3>Daerah/Lokasi:</h3>
                <h3>{district.name}({district.code})</h3>
            </div>
        </div>
        <div class="margin-top-10">
            {#each WAKTU_SOLAT_SORT as key, idx}
            <div class="row-space-between margin-top-2">
                <h3>{WAKTU_SOLAT_BAHASA[idx]}</h3>
                <h3>{ key === "day" ? HARI_BAHASA[prayerTime[key].toLowerCase()] : (key === "hijri" ? formatHijri(prayerTime[key]) : getLocalTime(prayerTime[key])) }</h3>
            </div>
            {/each}
        </div>
    {:else}
        <h3>Sila pilih negeri/daerah/lokasi di halaman Dashboard</h3>
    {/if}
    <div class="margin-top-6">
        <button type="button" class="button button-block" on:click={openDashboard}>Dashboard</button>
    </div>
</div>

<style>
    .row-space-between {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }
    .row-space-between > h5, h4, h3, h2, h1 {
        margin: 0;
        padding: 0;
    }
</style>
