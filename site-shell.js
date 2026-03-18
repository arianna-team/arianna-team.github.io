(function () {
  function onReady(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  function ensureMontserratFont() {
    if (document.getElementById("site-font-preconnect")) return;

    var preconnect = document.createElement("link");
    preconnect.id = "site-font-preconnect";
    preconnect.rel = "preconnect";
    preconnect.href = "https://fonts.googleapis.com";
    document.head.appendChild(preconnect);

    var preconnectStatic = document.createElement("link");
    preconnectStatic.rel = "preconnect";
    preconnectStatic.href = "https://fonts.gstatic.com";
    preconnectStatic.crossOrigin = "anonymous";
    document.head.appendChild(preconnectStatic);

    var stylesheet = document.createElement("link");
    stylesheet.rel = "stylesheet";
    stylesheet.href = "https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap";
    document.head.appendChild(stylesheet);
  }

  function ensureUppercaseTitles() {
    if (document.getElementById("site-title-case-styles")) return;

    var style = document.createElement("style");
    style.id = "site-title-case-styles";
    style.textContent = [
      "h1,",
      "h2,",
      "h3,",
      ".footer-brand-title {",
      "  text-transform: uppercase;",
      "}",
      "h1 {",
      "  font-weight: 500;",
      "}",
      "h2,",
      "h3,",
      ".footer-brand-title {",
      "  font-weight: 400;",
      "}"
    ].join("\n");
    document.head.appendChild(style);
  }

  function ensureBorderlessButtons() {
    if (document.getElementById("site-button-reset-styles")) return;

    var style = document.createElement("style");
    style.id = "site-button-reset-styles";
    style.textContent = [
      ".nav-cta,",
      ".button,",
      ".footer-cta,",
      ".cta a,",
      ".form-card button,",
      ".newsletter-form button,",
      "button {",
      "  border: none !important;",
      "  border-color: transparent !important;",
      "}"
    ].join("\n");
    document.head.appendChild(style);
  }

  function safeGet(key) {
    try {
      return window.localStorage.getItem(key);
    } catch (error) {
      return null;
    }
  }

  function safeSet(key, value) {
    try {
      window.localStorage.setItem(key, value);
    } catch (error) {
      // Ignore storage failures and keep the UI usable.
    }
  }

  function initSharedFooter() {
    var footer = document.querySelector("footer");
    if (!footer) return;

    if (!document.getElementById("site-footer-styles")) {
      var style = document.createElement("style");
      style.id = "site-footer-styles";
      style.textContent = [
        "footer.site-footer {",
        "  padding: 0 8vw 60px;",
        "  margin-top: 0;",
        "  background: #0b1823;",
        "  color: rgba(255, 255, 255, 0.7);",
        "  display: grid;",
        "  grid-template-columns: minmax(180px, 238px) minmax(0, 1fr);",
        "  column-gap: 32px;",
        "  justify-content: start;",
        "  align-items: flex-start;",
        "}",
        "footer.site-footer.has-cta {",
        "  margin-top: 0;",
        "  padding-top: 24px;",
        "}",
        "footer.site-footer .footer-brand {",
        "  margin-right: 0;",
        "  padding-top: 10px;",
        "}",
        "footer.site-footer .footer-right {",
        "  display: grid;",
        "  grid-template-columns: auto auto auto auto;",
        "  gap: 28px;",
        "  justify-content: start;",
        "  justify-items: start;",
        "  align-items: start;",
        "}",
        "footer.site-footer .footer-copy {",
        "  display: grid;",
        "  gap: 10px;",
        "  padding-top: 10px;",
        "  max-width: 420px;",
        "}",
        "footer.site-footer .footer-brand-title {",
        "  margin: 0;",
        "  color: #ffffff;",
        "  font-family: \"Montserrat\", \"Avenir Next\", \"Helvetica Neue\", Arial, sans-serif;",
        "  font-size: clamp(24px, 3vw, 36px);",
        "  line-height: 1.1;",
        "}",
        "footer.site-footer .footer-brand-body {",
        "  margin: 0;",
        "  max-width: 360px;",
        "}",
        "footer.site-footer .footer-brand-link {",
        "  display: inline-flex;",
        "  align-items: center;",
        "}",
        "footer.site-footer .footer-brand-link svg {",
        "  display: block;",
        "  width: min(100%, 238px);",
        "  height: auto;",
        "}",
        "footer.site-footer .footer-brand-link svg path,",
        "footer.site-footer .footer-brand-link svg polygon,",
        "footer.site-footer .footer-brand-link svg rect {",
        "  fill: #ffffff;",
        "}",
        "footer.site-footer .footer-brand-link svg .cls-1 {",
        "  fill: #3fbab7;",
        "}",
        "footer.site-footer .footer-actions {",
        "  display: grid;",
        "  gap: 10px;",
        "  align-content: start;",
        "  padding-top: 10px;",
        "}",
        "footer.site-footer .footer-actions .footer-cta {",
        "  display: inline-flex;",
        "  align-items: center;",
        "  justify-content: center;",
        "  min-width: 132px;",
        "  padding: 12px 20px;",
        "  border-radius: 999px;",
        "  background: #3fbab7;",
        "  color: #0f1e2b;",
        "  font-weight: 600;",
        "  font-size: 14px;",
        "  line-height: 1;",
        "  transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease, color 0.2s ease;",
        "}",
        "footer.site-footer .footer-actions .footer-cta:hover {",
        "  background: #f28a1a;",
        "  color: #ffffff;",
        "  box-shadow: 0 12px 24px rgba(15, 30, 43, 0.18);",
        "  transform: translateY(-1px);",
        "}",
        "footer.site-footer h4 {",
        "  color: white;",
        "  margin: 0 0 10px;",
        "}",
        "footer.site-footer > div:not(.footer-brand) {",
        "  padding-top: 10px;",
        "}",
        "footer.site-footer p {",
        "  margin: 0 0 8px;",
        "  color: rgba(255, 255, 255, 0.7);",
        "  font-size: 14px;",
        "  line-height: 1.5;",
        "}",
        "footer.site-footer a {",
        "  color: inherit;",
        "  text-decoration: none;",
        "  transition: color 0.2s ease;",
        "}",
        "footer.site-footer a:hover {",
        "  color: #1aa5a7;",
        "}",
        "footer.site-footer .footer-contact {",
        "  justify-self: start;",
        "  align-self: start;",
        "}",
        ".cta > div:last-child {",
        "  padding-top: 0;",
        "  margin-top: 0;",
        "}",
        "@media (max-width: 720px) {",
        "  footer.site-footer {",
        "    display: grid;",
        "    grid-template-columns: 1fr;",
        "    justify-content: start;",
        "    gap: 16px;",
        "    padding: 32px 8vw 40px;",
        "  }",
        "  footer.site-footer.has-cta {",
        "    margin-top: 0;",
        "    padding-top: 24px;",
        "  }",
        "  footer.site-footer .footer-brand {",
        "    margin-right: 0;",
        "    padding-top: 0;",
        "  }",
        "  footer.site-footer .footer-right {",
        "    grid-template-columns: 1fr;",
        "    gap: 14px;",
        "  }",
        "  footer.site-footer .footer-copy {",
        "    display: grid;",
        "    gap: 10px;",
        "    padding-top: 0;",
        "  }",
        "  footer.site-footer .footer-actions {",
        "    grid-auto-flow: row;",
        "    justify-items: start;",
        "    padding-top: 0;",
        "  }",
        "  footer.site-footer .footer-company,",
        "  footer.site-footer .footer-contact {",
        "    grid-column: auto;",
        "    justify-self: start;",
        "    align-self: start;",
        "  }",
        "  .cta > div:last-child {",
        "    padding-top: 0;",
        "    margin-top: 0;",
        "  }",
        "}"
      ].join("\n");
      document.head.appendChild(style);
    }

    footer.classList.add("site-footer");

    var ctaLinks = [
      { href: "book-a-demo.html", text: "Book a free Demo" },
      { href: "free-trial.html", text: "Start a free Trial" }
    ];
    var ctaSection = footer.previousElementSibling && footer.previousElementSibling.classList.contains("cta")
      ? footer.previousElementSibling
      : null;
    if (ctaSection) {
      var links = ctaSection.querySelectorAll("a[href]");
      if (links.length) {
        ctaLinks = Array.prototype.map.call(links, function (link) {
          return {
            href: link.getAttribute("href") || "#",
            text: (link.textContent || "").trim() || "Learn more"
          };
        });
      }
      ctaSection.style.display = "none";
    }

    if (ctaSection) {
      footer.classList.add("has-cta");
    } else {
      footer.classList.remove("has-cta");
    }

    var footerActionsHtml = ctaLinks.map(function (link) {
      return '  <a class="footer-cta" href="' + link.href + '">' + link.text + "</a>";
    }).join("\n");

    footer.innerHTML = [
      '<div class="footer-brand">',
      '  <a class="footer-brand-link" aria-label="ARIANNA" href="index.html">',
      '    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 206.8 67.1" role="img" aria-label="ARIANNA logo">',
      '      <defs>',
      '        <style>',
      '          .cls-1 { fill: #3fbab7; }',
      '        </style>',
      '      </defs>',
      '      <g>',
      '        <g id="Laag_1">',
      '          <polygon points="162.1 20.4 159.4 20.4 159.4 31.2 147.7 20.5 147.7 37 150.4 37 150.4 26.3 162.1 36.9 162.1 20.4"/>',
      '          <path d="M197.8,25.8l2.9,6.3h-5.9l3-6.3ZM189.3,37h2.9l1.3-2.7h8.5l1.3,2.7h2.9l-8.4-16.5-8.4,16.5Z"/>',
      '          <path d="M136.5,32h-5.9l3-6.3,3,6.3ZM125.1,37h2.9l1.3-2.7h8.5l1.3,2.7h2.9l-8.4-16.5-8.5,16.5Z"/>',
      '          <polygon points="183.6 20.4 181 20.4 181 31.2 169.3 20.5 169.3 37 172 37 172 26.3 183.6 36.9 183.6 20.4"/>',
      '          <path d="M98.7,22.7h4.8c.6,0,1.2.1,1.6.4.4.2.7.6.9.9.2.3.3.7.4,1.1,0,.4,0,.7,0,1,0,.5,0,1-.3,1.4-.2.4-.4.7-.7,1-.3.3-.6.5-1,.6-.4.1-.7.2-1,.2h-4.8v-6.5ZM102.6,31.6c.7.9,1.3,1.9,2,2.8.6.9,1.3,1.7,1.9,2.6h3.1c-1.3-1.8-2.6-3.5-3.9-5.3l-.3-.3.4-.2c1-.4,1.8-1.1,2.5-2,.6-.9.9-2,.9-3.2s-.1-1.6-.4-2.3c-.3-.7-.7-1.3-1.1-1.8-.5-.5-1.1-.9-1.8-1.2-.7-.3-1.5-.4-2.3-.4h-7.5v16.6h2.7v-5.5h3.8Z"/>',
      '          <rect x="116.3" y="20.4" width="2.7" height="16.6"/>',
      '          <path d="M85.8,32h-5.9l3-6.3,3,6.3ZM74.4,37h2.9l1.3-2.7h8.5l1.3,2.7h2.9l-8.5-16.5-8.4,16.5Z"/>',
      '          <path class="cls-1" d="M56.8,56.5V.8H1v55.7h20.5v-3.1H4.1V3.9h49.6v49.5h-14.3v-5.6h8.7V9.5H9.7v38.3h13.2c2.4,0,3.9.5,4.7,1.5,1,1.5.8,4.3-.7,8.3-1,2.8-.5,5.7,1.2,7.4,1,.9,2.3,1.4,3.8,1.4s2.8-.4,3.7-.8l-1.2-2.9c-1.9.7-3.4.7-4.3,0-.9-.8-1-2.5-.4-4.1,1.9-5.2,2-8.8.3-11.2-1.3-1.9-3.7-2.8-7.2-2.8h-10.1V12.6h32.2v32.2h-8.7v11.8h20.5Z"/>',
      '          <polygon class="cls-1" points="36.3 21.3 36.3 36.1 21.5 36.1 21.5 30 30.7 30 30.7 26.9 18.4 26.9 18.4 39.2 39.4 39.2 39.4 18.2 18.4 18.2 18.4 21.3 36.3 21.3"/>',
      '        </g>',
      '      </g>',
      '    </svg>',
      '  </a>',
      '</div>',
      '<div class="footer-right">',
      '  <div class="footer-copy">',
      '    <p class="footer-brand-title">See ARIANNA in action</p>',
      '    <p class="footer-brand-body">Book a demo or Trial to explore vulnerability management workflows for your industry.</p>',
      '  </div>',
      '  <div class="footer-actions">',
      footerActionsHtml,
      '  </div>',
      '  <div class="footer-company">',
      '    <h4><a href="company.html">Company</a></h4>',
      '    <p><a href="company.html#about">About ARIANNA</a></p>',
      '    <p><a href="company.html#careers">Careers</a></p>',
      '    <p><a href="resources.html">Resources</a></p>',
      '    <p><a href="privacy.html">Privacy &amp; GDPR</a></p>',
      '  </div>',
      '  <div class="footer-contact">',
      '    <h4><a href="contact.html">Contact</a></h4>',
      '    <p><a href="support.html">Support</a></p>',
      '    <p><a href="mailto:hello@ariannateam.ai">hello@ariannateam.ai</a></p>',
      '    <p><a href="tel:+393313482583">+39 331 3482583</a></p>',
      '  </div>',
      '</div>'
    ].join("\n");
  }

  function initNewsletterOverlay() {
    var overlay = document.getElementById("newsletterOverlay");
    if (!overlay) return;

    var closeButton = overlay.querySelector(".newsletter-close");
    var highIntent = document.body.getAttribute("data-newsletter-high-intent") === "true";

    function openOverlay() {
      overlay.classList.add("is-visible");
      overlay.setAttribute("aria-hidden", "false");
    }

    function closeOverlay() {
      overlay.classList.remove("is-visible");
      overlay.setAttribute("aria-hidden", "true");
    }

    var subscribed = safeGet("arianna_newsletter_subscribed") === "true";
    var dismissed = safeGet("arianna_newsletter_dismissed") === "true";
    var lastShown = Number(safeGet("arianna_newsletter_shown_at") || 0);
    var now = Date.now();

    if (!highIntent && !subscribed && !dismissed && (!lastShown || now - lastShown >= 60000)) {
      window.setTimeout(function () {
        openOverlay();
        safeSet("arianna_newsletter_shown_at", String(Date.now()));
      }, 5000);
    }

    overlay.addEventListener("submit", function (event) {
      if (!event.target.closest(".newsletter-form")) return;
      safeSet("arianna_newsletter_subscribed", "true");
      closeOverlay();
    }, true);

    if (closeButton) {
      closeButton.addEventListener("click", function () {
        safeSet("arianna_newsletter_dismissed", "true");
        closeOverlay();
      });
    }

    overlay.addEventListener("click", function (event) {
      if (event.target === overlay) {
        safeSet("arianna_newsletter_dismissed", "true");
        closeOverlay();
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && overlay.classList.contains("is-visible")) {
        closeOverlay();
      }
    });
  }

  function initMobileNav() {
    var dropdowns = document.querySelectorAll(".nav-dropdown");
    if (!dropdowns.length) return;

    function isMobileNav() {
      return window.matchMedia("(max-width: 720px)").matches;
    }

    function syncAria() {
      dropdowns.forEach(function (dropdown) {
        var toggle = dropdown.querySelector(".nav-dropdown-toggle");
        if (toggle) toggle.setAttribute("aria-expanded", dropdown.classList.contains("is-open") ? "true" : "false");
      });
    }

    function closeAll(exceptNode) {
      dropdowns.forEach(function (dropdown) {
        if (dropdown !== exceptNode) dropdown.classList.remove("is-open");
      });
      syncAria();
    }

    dropdowns.forEach(function (dropdown) {
      var toggle = dropdown.querySelector(".nav-dropdown-toggle");
      if (!toggle) return;

      toggle.setAttribute("aria-expanded", "false");

      toggle.addEventListener("click", function (event) {
        if (!isMobileNav()) return;

        if (!dropdown.classList.contains("is-open")) {
          event.preventDefault();
          closeAll(dropdown);
          dropdown.classList.add("is-open");
        } else {
          dropdown.classList.remove("is-open");
        }

        syncAria();
      });
    });

    document.addEventListener("click", function (event) {
      if (!isMobileNav()) return;
      dropdowns.forEach(function (dropdown) {
        if (!dropdown.contains(event.target)) dropdown.classList.remove("is-open");
      });
      syncAria();
    });

    window.addEventListener("resize", function () {
      if (!isMobileNav()) closeAll();
    });
  }

  onReady(function () {
    ensureMontserratFont();
    ensureUppercaseTitles();
    ensureBorderlessButtons();
    initSharedFooter();
    initNewsletterOverlay();
    initMobileNav();
  });
})();
