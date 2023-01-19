<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { getStateZoneCode, makeRequest } from "../api";
    import { storage, cacheStorage, configStorage } from "../storage";
    import { type DISTRICT, type WAKTU_SOLAT, PERIOD, PERIOD_OPTIONS } from "../types";

    export let count: number;
    let successMessage: string = null;

    let stateZoneCode: { [key: string]: [DISTRICT] } = {};
    let districts: [DISTRICT];
    let currentState: string;
    let currentDistrict: DISTRICT;
    let periodType: PERIOD = PERIOD.YEAR;
    let today: string;
    let dateStart;
    let dateEnd;
    let prayerTime: [WAKTU_SOLAT] = [];

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

    async function getWaktuSolat() {
        try {
            let method = "GET";
            let form = {};
            if (periodType == PERIOD.DURATION) {
                method = "POST";
                form = { "datestart": dateStart.value, "dateend": dateEnd.value };
            }
            const req = makeRequest(method, periodType, currentDistrict.code, form);
            prayerTime = (await (await fetch(req)).json()).prayerTime;
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
    <p>Current count: <b>{count}</b></p>
    <div>
        <button on:click={decrement}>-</button>
        <button on:click={increment}>+</button>
        <button on:click={save}>Save</button>
        {#if successMessage}<span class="success">{successMessage}</span>{/if}
    </div>
    <div>
        <select id="state" name="state" on:change={onStateChange} bind:value={currentState}>
            <option value="">Sila pilih negeri</option>
            {#each Object.keys(stateZoneCode) as state}
            <option value="{state}">{state}</option>
            {/each}
        </select>
    </div>
    {#if districts != null}
    <div>
        <select id="district" name="district" on:change={onDistrictChange}>
            <option value="">Sila pilih daerah/lokasi</option>
            {#each districts as district}
            <option value="{JSON.stringify(district)}" selected={currentDistrict && currentDistrict.name == district.name}>{district.name}</option>
            {/each}
        </select>
    </div>
    <div>
        <select id="period" class="form-control" on:bind={onPeriodChange} bind:value={periodType}>
            {#each Object.keys(PERIOD_OPTIONS) as key}
            <option value="{key}">{PERIOD_OPTIONS[key]}</option>
            {/each}
        </select>
    </div>
    <div>
    {#if periodType == "duration"}
        <input bind:this={dateStart} type="date" id="datestart" name="datestart" value={today}>
        <input bind:this={dateEnd} type="date" id="dateend" name="dateend" value={today}>
    {/if}
    </div>
    <div>
        <button on:click={getWaktuSolat}>CARI</button>
    </div>
    {/if}
    <div>
        {JSON.stringify(prayerTime)};
    </div>
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
