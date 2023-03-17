"use strict";

require("core-js/modules/es.symbol.description.js");
require("core-js/modules/web.dom-collections.iterator.js");
require("core-js/modules/web.url-search-params.js");
require("core-js/modules/es.regexp.exec.js");
require("core-js/modules/es.string.search.js");
require("core-js/modules/es.json.stringify.js");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
const utmParameters = ["utm_campaign", "utm_content", "utm_name", "utm_term", "utm_medium", "utm_source", "source_url"];

/**
 *
 * @param {*} parameters
 * @returns   { utm_source:"origin" }
 */
function getQueryParameters(parameters) {
  const urlParams = new URLSearchParams(location.search);
  let utms = {};
  parameters.forEach(param => {
    if (!!urlParams.get(param)) utms = _objectSpread(_objectSpread({}, utms), {}, {
      [param]: urlParams.get(param)
    });
  });
  return utms;
}
function getUTMData() {
  if (!!sessionStorage.getItem("utm")) return;

  // Get parameters
  let parameters = getQueryParameters(utmParameters);
  parameters = _objectSpread(_objectSpread({}, parameters), {}, {
    source_url: location.origin + location.pathname
  });

  // Set to Seccion Storage
  sessionStorage.setItem("utm", JSON.stringify(parameters));
}
function fillUbsptUtmData() {
  const hbsptForm = document.querySelector('[id^="hbspt-form-"]');
  if (!!hbsptForm) {
    let inputForm;
    const utmUserParams = JSON.parse(sessionStorage.getItem("utm") || "{}");
    Object.keys(utmUserParams).forEach(item => {
      inputForm = document.querySelector("input[name='".concat(item, "']"));
      if (!!inputForm) inputForm.value = utmUserParams[item];
    });
  }
}
function setQPNewTab() {
  jQuery("a").mousedown(function (event) {
    const utmData = JSON.parse(sessionStorage.getItem("utm") || "{}");
    let queryString = "?";
    Object.keys(utmData).forEach(item => {
      queryString = "".concat(queryString).concat(item, "=").concat(utmData[item], "&");
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
  fillUbsptUtmData();
}, 1000);