(function () {
  "use strict";
  const measurementId = "G-1TZ12XRFQ9";
  const storageKey = "site-analytics-consent";
  let loaded = false;
  function savedChoice() {
    try { return localStorage.getItem(storageKey); } catch (_) { return null; }
  }
  function remember(choice) {
    try { localStorage.setItem(storageKey, choice); } catch (_) { /* Optional without storage. */ }
  }
  function removeAnalyticsCookies() {
    const domains = ["", location.hostname, "." + location.hostname,
      "tdawsonwoodrum.com", ".tdawsonwoodrum.com"];
    document.cookie.split(";").forEach(function (cookie) {
      const name = cookie.split("=")[0].trim();
      if (name !== "_ga" && !name.startsWith("_ga_")) return;
      domains.forEach(function (domain) {
        document.cookie = name + "=; Max-Age=0; path=/" + (domain ? "; domain=" + domain : "") + "; SameSite=Lax";
      });
    });
  }
  function allowAnalytics() {
    window["ga-disable-" + measurementId] = false;
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
    window.gtag("consent", "update", { analytics_storage: "granted" });
    if (loaded) return;
    loaded = true;
    window.gtag("consent", "default", {
      analytics_storage: "granted", ad_storage: "denied",
      ad_user_data: "denied", ad_personalization: "denied"
    });
    window.gtag("js", new Date());
    window.gtag("config", measurementId, {
      send_page_view: true, allow_google_signals: false,
      allow_ad_personalization_signals: false
    });
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://www.googletagmanager.com/gtag/js?id=" + measurementId;
    document.head.appendChild(script);
  }
  function declineAnalytics() {
    window["ga-disable-" + measurementId] = true;
    if (window.gtag) window.gtag("consent", "update", { analytics_storage: "denied" });
    removeAnalyticsCookies();
  }
  function init() {
    let choice = savedChoice();
    if (choice === "allowed") allowAnalytics(); else declineAnalytics();
    const panel = document.createElement("section");
    panel.className = "analytics-choice-panel container";
    panel.setAttribute("aria-label", "Website analytics choices");
    const heading = document.createElement("h2");
    heading.textContent = "Optional website analytics";
    const description = document.createElement("p");
    const policy = document.createElement("a");
    policy.href = "/privacy.html#website-analytics";
    policy.textContent = "Read the privacy policy";
    const actions = document.createElement("div");
    actions.className = "analytics-choice-actions";
    const allow = document.createElement("button");
    allow.type = "button";
    allow.textContent = "Allow analytics";
    const decline = document.createElement("button");
    decline.type = "button";
    decline.textContent = "Decline analytics";
    actions.append(allow, decline);
    panel.append(heading, description, policy, actions);
    const header = document.querySelector(".site-header");
    if (header) header.insertAdjacentElement("afterend", panel);
    else document.body.prepend(panel);
    const settings = document.createElement("button");
    settings.type = "button";
    settings.className = "analytics-settings";
    settings.textContent = "Analytics choices";
    const footer = document.querySelector(".site-footer .container") || document.querySelector(".site-footer");
    if (footer) footer.appendChild(settings);
    function showChoice(focus) {
      description.textContent = choice === "allowed"
        ? "Analytics are currently on. You can turn them off here."
        : "Analytics are off. You can allow optional cookies to help understand how this professional website is used.";
      panel.hidden = false;
      if (focus) allow.focus();
    }
    function choose(value) {
      choice = value;
      remember(value);
      if (value === "allowed") allowAnalytics(); else declineAnalytics();
      panel.hidden = true;
      const main = document.querySelector("main");
      if (main) {
        main.setAttribute("tabindex", "-1");
        main.focus({ preventScroll: true });
      }
    }
    allow.addEventListener("click", function () { choose("allowed"); });
    decline.addEventListener("click", function () { choose("declined"); });
    settings.addEventListener("click", function () { showChoice(true); });
    if (choice !== "allowed" && choice !== "declined") showChoice(false);
    else panel.hidden = true;
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
