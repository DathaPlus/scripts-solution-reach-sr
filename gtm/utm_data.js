/**
 *
 * @param {*} parameters
 * @returns   [ { param: "utm_source", value: "origin" } ]
 */
function getQueryParameters(parameters) {
  const urlParams = new URLSearchParams(location.search);

  let utms = {};
  parameters.forEach((param) => {
    if (!!urlParams.get(param))
      utms = { ...utms, [param]: urlParams.get(param) };
  });

  return utms;
}

// ********** Here the magic!!!!

var utmParameters = [
  "utm_campaign",
  "utm_content",
  "utm_name",
  "utm_term",
  "utm_medium",
  "utm_source",
  "source_url",
];

window.onload = function () {
  // Get parameters
  let parameters = getQueryParameters(utmParameters);

  // Set to Seccion Storage
  sessionStorage.setItem("utm", JSON.stringify(parameters));
};

const hbsptForm = document.querySelector('[id^="hbspt-form-"]');

if (!!hbsptForm) {
  setTimeout(() => {
    let inputForm;
    const utmUserParams = JSON.parse(sessionStorage.getItem("utm"));

    utmParameters.forEach((item) => {
      inputForm = document.querySelector(`input[name='${item}']`);
      inputForm.value = utmUserParams[item] || "";
    });
  }, 1000);
}
