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
