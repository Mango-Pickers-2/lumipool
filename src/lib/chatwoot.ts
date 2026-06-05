export function loadChatwoot() {
  if (window.chatwootSDK || window.$chatwoot) {
    return;
  }

  const BASE_URL = "https://app.chatwoot.com";

  window.chatwootSettings = {
    hideMessageBubble: true,
  };

  const script = document.createElement("script");

  script.src = `${BASE_URL}/packs/js/sdk.js`;
  script.async = true;
  script.defer = true;

  script.onload = () => {
    window.chatwootSDK.run({
      websiteToken: "3wXxWoUecNeHPsLbcrmFucQn",
      baseUrl: BASE_URL,
    });
  };

  document.body.appendChild(script);
}
