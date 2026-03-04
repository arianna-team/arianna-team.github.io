(function () {
  function onReady(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
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
    initNewsletterOverlay();
    initMobileNav();
  });
})();
