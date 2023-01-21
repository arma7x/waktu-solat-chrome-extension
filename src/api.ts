import { PERIOD, type REQUEST_FORM, REQUEST_TYPE } from "./types";

export function getStateZoneCode(): Promise<any> {
  return fetch("https://www.e-solat.gov.my/index.php?siteId=24&pageId=24#")
  .then(response => {
    return response.text();
  })
  .then(text => {
    const doc = new DOMParser().parseFromString(text, "text/html");
    let stateZoneCode = {};
    let inputZones = doc.getElementById("inputZone");
    Array.from(inputZones.children).forEach((opt) => {
      if (opt.children.length > 0) {
        const state = opt.label;
        stateZoneCode[state] = [];
        Array.from(opt.children).forEach((subopt) => {
          let district = subopt.text.replaceAll(subopt.value, "").replaceAll("-", "").replaceAll(" dan ", ", ").trim();
          district = district.split(",");
          district.forEach((value, index) => {
            district[index] = value.trim();
            stateZoneCode[state].push({"name": district[index], "code": subopt.value});
          });
        });
      }
    });
    return Promise.resolve(stateZoneCode);
  });
}

export function makeRequest(method: REQUEST_TYPE = "GET", period: PERIOD, zone: String, form: REQUEST_FORM = {}): Request {
  let options = { "method": method.toUpperCase() };
  if (form && options.method == REQUEST_TYPE.POST && Object.keys(form).length > 0) {
    const formData = new FormData();
    for (let key in form) {
      formData.append(key, form[key]);
    }
    options["body"] = formData;
  }
  return new Request(`https://www.e-solat.gov.my/index.php?r=esolatApi/takwimsolat&period=${period}&zone=${zone}`, options);
}
