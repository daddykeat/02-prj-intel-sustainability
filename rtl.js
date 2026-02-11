(() => {
  const rtlLangs = ["ar", "he", "fa", "ur"];

  function setDir(isRTL, lang = "") {
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
    if (lang) document.documentElement.lang = lang;
    document.body.classList.toggle("rtl", isRTL);
  }

  function getLangFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get("lang"); // you already use ?lang=ar
  }

  function getLangFromHtml() {
    return (document.documentElement.getAttribute("lang") || "").toLowerCase();
  }

  // Heuristic: if we see enough Arabic characters, assume RTL
  function pageLooksArabic() {
    const sample = (document.body && document.body.innerText)
      ? document.body.innerText.slice(0, 2000)
      : "";
    const arabicMatches = sample.match(/[\u0600-\u06FF]/g) || [];
    return arabicMatches.length > 20; // threshold
  }

  function decideAndApply() {
    // Priority 1: URL param (your manual test buttons)
    const urlLang = (getLangFromUrl() || "").toLowerCase();
    if (urlLang) {
      setDir(rtlLangs.includes(urlLang), urlLang);
      return;
    }

    // Priority 2: html lang attribute (if it changes)
    const htmlLang = getLangFromHtml();
    if (htmlLang) {
      setDir(rtlLangs.includes(htmlLang), htmlLang);
      return;
    }

    // Priority 3: detect translated content
    if (pageLooksArabic()) {
      setDir(true, "ar");
    } else {
      setDir(false, "en");
    }
  }

  // Initial run
  decideAndApply();

  // Watch for Google Translate DOM changes and re-run
  const observer = new MutationObserver(() => {
    // debounce a bit so we don't thrash during translation
    clearTimeout(window.__rtlTimer);
    window.__rtlTimer = setTimeout(decideAndApply, 200);
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    characterData: true,
  });
})();
