import localForage from "localforage";

type IStorage = {
    count: number;
};

const defaultStorage: IStorage = {
    count: 0,
};

export const storage = {
    get: (): Promise<IStorage> =>
        chrome.storage.sync.get(defaultStorage) as Promise<IStorage>,
    set: (value: IStorage): Promise<void> => chrome.storage.sync.set(value),
};

localForage.setDriver(localForage.INDEXEDDB);

const dbName = "waktu-solat";

export const _tableCaches = localForage.createInstance({
    name        : dbName,
    storeName   : "caches"
});

export const cacheStorage = {
    cacheZoneCode: (zoneCode) => {
        return _tableCaches.setItem("zoneCode", zoneCode);
    },
    getZoneCode: () => {
        return _tableCaches.getItem("zoneCode");
    },
}

export const _tableConfigs = localForage.createInstance({
    name        : dbName,
    storeName   : "configs"
});

export const configStorage = {
    setState: (state) => {
        return _tableConfigs.setItem("state", state);
    },
    getState: () => {
        return _tableConfigs.getItem("state");
    },
    resetState: () => {
        return _tableConfigs.removeItem("state");
    },
    setZone: (zone) => {
        return _tableConfigs.setItem("zone", zone);
    },
    getZone: () => {
        return _tableConfigs.getItem("zone");
    },
    resetZone: () => {
        return _tableConfigs.removeItem("zone");
    },
}
