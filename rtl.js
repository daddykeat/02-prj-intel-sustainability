(() => {
  const rtlLangs = ["ar", "he", "fa", "ur"];

  function applyDir(lang) {
    const short = (lang || "").toLowerCase();
    const isRTL = rtlLangs.includes(short);

    document.documentElement.dir = isRTL ? "rtl" : "ltr";
    document.documentElement.lang = short || (isRTL ? "ar" : "en");
    document.body.classList.toggle("rtl", isRTL);
  }

  const params = new URLSearchParams(window.location.search);
  const langParam = params.get("lang");
  const browserLang = (navigator.language || "en").split("-")[0];

  applyDir(langParam || browserLang);
})();
