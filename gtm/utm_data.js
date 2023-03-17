const utmParameters = [
  "utm_campaign",
  "utm_content",
  "utm_name",
  "utm_term",
  "utm_medium",
  "utm_source",
  "source_url",
];

/**
 *
 * @param {*} parameters
 * @returns   { utm_source:"origin" }
 */
function getQueryParameters(parameters) {
  const urlParams = new URLSearchParams(location.search);

  let utms = {};
  parameters.forEach((param) => {
    if (param == "source_url")
      utms = { ...utms, source_url: location.origin + location.pathname };

    if (!!urlParams.get(param))
      utms = { ...utms, [param]: urlParams.get(param) };
  });

  return utms;
}

function getUTMData() {
  if (!!sessionStorage.getItem("utm")) return;

  // Get parameters
  let parameters = getQueryParameters(utmParameters);

  // Set to Seccion Storage
  sessionStorage.setItem("utm", JSON.stringify(parameters));
}

function fillHbsptUtmData() {
  const hbsptForm = document.querySelector('[id^="hbspt-form-"]');

  if (!!hbsptForm) {
    let inputForm;
    const utmUserParams = JSON.parse(sessionStorage.getItem("utm") || "{}");

    Object.keys(utmUserParams).forEach((item) => {
      inputForm = document.querySelector(`input[name='${item}']`);
      if (!!inputForm) inputForm.value = utmUserParams[item];
    });
  }
}

function setQPNewTab() {
  jQuery("a").mousedown(function (event) {
    const utmData = JSON.parse(sessionStorage.getItem("utm") || "{}");

    let queryString = "?";
    Object.keys(utmData).forEach((item) => {
      queryString = `${queryString}${item}=${utmData[item]}&`;
    });

    event.target.href = event.target.href + queryString;
  });
}
// ********** Here the magic!!!!
window.onload = () => {
  getUTMData();

  setQPNewTab();
};

setTimeout(() => {
  fillHbsptUtmData();
}, 2000);
