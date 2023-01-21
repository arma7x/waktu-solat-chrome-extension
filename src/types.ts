export interface DISTRICT {
    name: string,
    code: string
}

export interface WAKTU_SOLAT {
    hijri:      string,
    date:       string,
    day:        string,
    imsak:      string,
    fajr:       string,
    syuruk:     string,
    dhuhr:      string,
    asr:        string,
    maghrib:    string,
    isha:       string
}

export enum PERIOD {
    WEEK        = "week",
    MONTH       = "month",
    YEAR        = "year",
    DURATION    = "duration"
}

export const PERIOD_OPTIONS = {
    [PERIOD.WEEK]: "Mingguan",
    [PERIOD.MONTH]: "Bulanan",
    [PERIOD.YEAR]: "Tahunan",
    [PERIOD.DURATION]: "Tarikh(Mula - Tamat)",
}

export const WAKTU_SOLAT_SORT = ["date", "hijri", "day", "imsak", "fajr", "syuruk", "dhuhr", "asr", "maghrib", "isha"];

export const WAKTU_SOLAT_BAHASA = ["Tarikh", "Hijri", "Hari", "Imsak", "Subuh", "Syuruk", "Zohor", "Asar", "Maghrib", "Isyak"];

export const HARI_BAHASA = {
    "sunday":       "Ahad",
    "monday":       "Isnin",
    "tuesday":      "Selasa",
    "wednesday":    "Rabu",
    "thursday":     "Khamis",
    "friday":       "Jumaat",
    "saturday":     "Sabtu",
}

// https://www.geeksforgeeks.org/how-to-validate-time-in-24-hour-format-using-regular-expression/
export const getLocalTime = (time) => {
    let regex = new RegExp(/^([01]\d|2[0-3]):?([0-5]\d):?([0-5]\d)$/);
    if (regex.test(time) == true) {
        let d = new Date();
        d = new Date(`${d.toLocaleDateString()} ${time}`);
        return d.toLocaleTimeString();
    }
    return time;
}
