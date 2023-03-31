<script lang="ts">
    import "../content/styles.css";
    import { onMount, onDestroy } from 'svelte';
    import { getStateZoneCode, makeRequest } from "../api";
    import { cacheStorage, configStorage } from "../storage";
    import { type DISTRICT, type WAKTU_SOLAT, PERIOD, PERIOD_OPTIONS, WAKTU_SOLAT_SORT, WAKTU_SOLAT_BAHASA, HARI_BAHASA, REQUEST_TYPE, getLocalTime, formatHijri } from "../types";

    let stateZoneCode: { [key: string]: [DISTRICT] } = {};
    let districts: [DISTRICT];
    let currentState: string;
    let currentDistrict: DISTRICT;
    let periodType: PERIOD = PERIOD.YEAR;
    let today: string;
    let dateStart;
    let dateEnd;
    let prayerTimes: [WAKTU_SOLAT] = [];

    async function getWaktuSolat() {
        try {
            let method = REQUEST_TYPE.GET;
            let form = {};
            if (periodType == PERIOD.DURATION) {
                method = REQUEST_TYPE.POST;
                form = { "datestart": dateStart.value, "dateend": dateEnd.value };
            }
            const req = makeRequest(method, periodType, currentDistrict.code, form);
            prayerTimes = (await (await fetch(req)).json()).prayerTime;
        } catch (err) {
            console.error(err);
        }
    }

    async function onStateChange(evt) {
        currentDistrict = null;
        await configStorage.resetZone();
        districts = stateZoneCode[evt.target.value];
        configStorage.setState(evt.target.value);
    }

    function onDistrictChange(evt) {
        currentDistrict = null;
        try {
            currentDistrict = JSON.parse(evt.target.value);
            configStorage.setZone(currentDistrict);
        } catch (err) {
            currentDistrict = null;
            console.error(err);
        }
    }

    function onPeriodChange(evt) {
        periodType = evt.target.value;
    }

    onMount(async () => {
        const d = new Date();
        today = `${d.getFullYear()}-${(d.getMonth() + 1) > 10 ? (d.getMonth() + 1) : '0'+(d.getMonth() + 1)}-${d.getDate()}`;
        try {
            currentState = await configStorage.getState();
            currentDistrict = await configStorage.getZone();
            stateZoneCode = await getStateZoneCode();
            if (stateZoneCode[currentState]) {
                districts = stateZoneCode[currentState];

            }
            if (currentDistrict) {
                getWaktuSolat();
            }
            await cacheStorage.cacheZoneCode(stateZoneCode);
        } catch (err) {
            console.error(err);
        };
    });

</script>

<div class="container">
    <div>
        <select id="state" name="state" on:change={onStateChange} bind:value={currentState}>
            <option value="">Sila pilih negeri</option>
            {#each Object.keys(stateZoneCode) as state}
            <option value="{state}">{state}</option>
            {/each}
        </select>
        {#if districts != null}
            <select id="district" name="district" on:change={onDistrictChange}>
                <option value="">Sila pilih daerah/lokasi</option>
                {#each districts as district}
                <option value="{JSON.stringify(district)}" selected={currentDistrict && currentDistrict.name == district.name}>{district.name}</option>
                {/each}
            </select>
            <select id="period" class="form-control" on:bind={onPeriodChange} bind:value={periodType}>
                {#each Object.keys(PERIOD_OPTIONS) as key}
                <option value="{key}">{PERIOD_OPTIONS[key]}</option>
                {/each}
            </select>
            {#if periodType == "duration"}
                <input bind:this={dateStart} type="date" id="datestart" name="datestart" value={today}>
                <input bind:this={dateEnd} type="date" id="dateend" name="dateend" value={today}>
            {/if}
            <button type="button" class="button" on:click={getWaktuSolat}>CARI</button>
        {/if}
    </div>
    <div class="margin-top-6">
        <table class="styled-table">
            <thead>
                <tr>
                    {#each WAKTU_SOLAT_BAHASA as header}
                    <th>{header}</th>
                    {/each}
                </tr>
            </thead>
            <tbody>
                {#each prayerTimes as row}
                <tr>
                    {#each Object.entries(row) as [key, value]}
                    <td>{ key === "day" ? HARI_BAHASA[value.toLowerCase()] : (key === "hijri" ? formatHijri(value) : getLocalTime(value))}</td>
                    {/each}
                </tr>
                {/each}
            </tbody>
        </table>
    </div>
</div>

<style>
    .container {
        width: 100%;
    }
    table {
        width: 100%;
        font-size: 110%;
    }
    input, select {
        min-height: 3rem;
        font-size: 16px;
        font-weight: 600;
    }
</style>
