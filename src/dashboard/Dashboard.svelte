<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { getStateZoneCode, makeRequest } from "../api";
    import { storage, cacheStorage, configStorage } from "../storage";

    export let count: number;
    let successMessage: string = null;

    let stateZoneCode: { [key: string] } = {};
    let districts: any;
    let currentState: string;
    let currentDistrict: { [key: string]: { name: string, code: string }; };

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

    onMount(async () => {
        try {
            currentState = await configStorage.getState();
            currentDistrict = await configStorage.getZone();
            stateZoneCode = await getStateZoneCode();
            if (stateZoneCode[currentState]) {
                districts = stateZoneCode[currentState];
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
            <option value="">Please select state</option>
            {#each Object.keys(stateZoneCode) as state}
            <option value="{state}">{state}</option>
            {/each}
        </select>
    </div>
    <div>
    {#if districts != null}
        <select id="district" name="district" on:change={onDistrictChange}>
            <option value="">Please select district/location</option>
            {#each districts as district}
            <option value="{JSON.stringify(district)}" selected={currentDistrict && currentDistrict.name == district.name}>{district.name}</option>
            {/each}
        </select>
    {/if}
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
