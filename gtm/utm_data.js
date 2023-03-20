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

  // Set to Session Storage
  sessionStorage.setItem("utm", JSON.stringify(parameters));
}

function fillHbsptUtmData() {
  const hbsptForm = document.querySelector('[id^="hbspt-form-"]');

  if (!hbsptForm) return;
  
  const utmUserParams = JSON.parse(sessionStorage.getItem("utm") || "{}");

  Object.keys(utmUserParams).forEach((item) => {
    let inputForm = document.querySelector(`input[name='${item}']`);
    if (!!inputForm) inputForm.value = utmUserParams[item];
  });
}

function setQueryParamsNewTab() {
  document.querySelectorAll("a").forEach((anchor) =>
    anchor.addEventListener("mousedown", (event) => {
      let queryString = "";
      const isTarget = !!event.target.href;

      let originalHref = isTarget
        ? event.target.href
        : event.currentTarget.href;

      if (event.button != 0 || event.ctrlKey || event.shiftKey) {
        const utmData = JSON.parse(sessionStorage.getItem("utm") || "{}");
        queryString = "?";
        Object.keys(utmData).forEach((item) => {
          queryString = `${queryString}${item}=${utmData[item]}&`;
        });
      } else if (`${originalHref}`.includes("?"))
        originalHref = `${originalHref}`.split("?")[0];

      if (isTarget) event.target.href = originalHref + queryString;
      else event.currentTarget.href = originalHref + queryString;
    })
  );
}

// ********** Here the magic!!!!

window.onload = () => {
  getUTMData();

  setQueryParamsNewTab();
};

setTimeout(() => {
  fillHbsptUtmData();
}, 3000);
