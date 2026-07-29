# ARIANNA Website Security Review

Review date: 2026-07-26

## Executive Summary

This repository is a static GitHub Pages website built from HTML, CSS, and vanilla JavaScript. I did not find backend code, database access, private key files, `eval`/`new Function`, `document.write`, `postMessage` handlers, or obvious DOM XSS paths from URL parameters into HTML.

The main risks are around public third-party form integrations and missing visible production hardening controls. The recent form-spam incident fits this risk profile: the website itself was probably not "hacked" in the classic sense, but publicly embedded lead forms can be abused unless the form provider and edge layer enforce rate limits and bot checks.

No review can prove the site cannot be hacked. The highest-value next steps are to verify the Nutshell public widget token scope, keep stronger Nutshell spam protection enabled, add Cloudflare/WAF rate limiting, and deploy security headers where the hosting layer allows it.

## Scope And Evidence

- Static site files are deployed by GitHub Pages from `.github/workflows/deploy-pages.yml`.
- The deploy workflow uploads the repository root as the site artifact: `.github/workflows/deploy-pages.yml:32`.
- Forms are embedded via Nutshell widgets on public pages such as `contact.html`, `book-a-demo.html`, `free-trial.html`, `partners.html`, `support.html`, and newsletter overlays.
- JavaScript review focused on `site-shell.js` and `attribution.js`.

## Findings

### F-001: Public Nutshell boot token is embedded across many pages

Severity: High until token scope is confirmed; Medium if Nutshell confirms it is a strictly public, domain-scoped widget token.

Location:

- `index.html:658`
- `contact.html:394`
- `book-a-demo.html:409`
- `free-trial.html:409`
- `partners.html:523`
- `support.html:428`
- many article/resource pages matched by `rg -n 'authToken' -g '*.html' .`

Evidence:

```html
Nutsheller('boot', {instance: '384033', authToken: 'Sc-...[redacted]', target: 'nutshell-boot-384033'});
```

Impact:

If this token is accepted from arbitrary origins or allows more than rendering a public widget, an attacker can reuse it outside your website. Even if it is intended as a public widget token, it is still abuse-sensitive because it identifies your Nutshell instance and can help automate interaction with your forms/widgets.

Fix:

Ask Nutshell support to confirm exactly what the token can do and whether it is domain-restricted to `ariannateam.ai` / `www.ariannateam.ai`. Rotate it if it was not intended to be public, or if yesterday's spam incident suggests it may have been abused directly.

Mitigation:

Keep Nutshell spam protection in strict mode for public forms. Add Cloudflare/WAF rate limiting for public form pages and, if possible, block direct form submissions that do not pass Nutshell's bot checks.

False positive notes:

Some SaaS widget tokens are intentionally public. This finding remains important because the repo does not document that assumption or the token scope.

### F-002: Public form IDs can be targeted directly for spam submissions

Severity: High for lead-quality/CRM abuse; Low for static-site compromise.

Location:

- `contact.html:499` and `contact.html:502`
- `book-a-demo.html:520` and `book-a-demo.html:524`
- `free-trial.html:520` and `free-trial.html:524`
- `partners.html:699` and `partners.html:702`
- `support.html:534` and `support.html:537`
- newsletter form examples such as `index.html:956` and `index.html:959`

Evidence:

```html
<div id="nutshell-form-v0iQqW-contact"></div>
Nutsheller('initForm', {form: 'v0iQqW', instance: '384033', authToken: '', target: 'nutshell-form-v0iQqW-contact'});
```

Impact:

Attackers can discover form IDs and automate submissions. This does not by itself compromise the static website, but it can pollute Nutshell, trigger follow-up workflows, burn team time, and degrade lead quality.

Fix:

Keep the stricter Nutshell anti-spam mode enabled. Review all Nutshell automations so new submissions do not automatically enter important sales or email workflows without validation.

Mitigation:

Add edge rate limits for repeated visits/submissions related to `/contact.html`, `/book-a-demo.html`, `/free-trial.html`, `/partners.html`, `/support.html`, and pages containing newsletter forms. Longer term, replace direct embeds with custom forms that submit through a serverless endpoint which verifies Cloudflare Turnstile/hCaptcha server-side before sending data to Nutshell.

False positive notes:

All embedded forms expose some public identifiers. The risk is acceptable only if the provider enforces bot protection and abuse controls.

### F-003: Security headers are not visible in the repository

Severity: Medium.

Location:

- No repository file matched `Content-Security-Policy`, `X-Frame-Options`, `frame-ancestors`, `Permissions-Policy`, `Referrer-Policy`, or similar header configuration.
- GitHub Pages deploy config: `.github/workflows/deploy-pages.yml:32`.

Evidence:

The repo contains static files and a GitHub Pages workflow, but no `_headers`, edge worker, or server config that would set security headers.

Impact:

Without headers such as Content Security Policy, `frame-ancestors`, `X-Content-Type-Options`, `Referrer-Policy`, and `Permissions-Policy`, the site has less defense in depth against injected scripts, clickjacking, MIME sniffing, and unnecessary browser features.

Fix:

If the domain is behind Cloudflare, configure response headers there. A practical starting point is:

```text
Content-Security-Policy: default-src 'self'; script-src 'self' https://growth.ariannateam.ai https://loader.nutshell.com https://unpkg.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://growth.ariannateam.ai https://loader.nutshell.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self' https:
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

Mitigation:

Start with a report-only CSP if supported at the edge, observe breakage, then enforce. GitHub Pages itself has limited custom-header support, so Cloudflare is the likely place to do this.

False positive notes:

Headers may already be set outside the repo. Verify the live response headers for `https://ariannateam.ai/`.

### F-004: Third-party scripts run with page privileges and are not pinned with SRI

Severity: Medium.

Location:

- Nutshell scripts, for example `contact.html:396`, `contact.html:504`, `free-trial.html:526`, `partners.html:704`
- Lucide loaded from an unversioned CDN URL: `industries.html:708`

Evidence:

```html
<script type="module" src="https://growth.ariannateam.ai/nutsheller-esm.js"></script>
<script type="module" src="https://loader.nutshell.com/nutsheller-esm.js"></script>
<script src="https://unpkg.com/lucide@latest"></script>
```

Impact:

Third-party JavaScript executes with the same privileges as first-party site code. If a third-party host, CDN path, or dependency is compromised, malicious code can run on your domain, read page content, modify forms, or redirect users.

Fix:

Remove the `unpkg.com/lucide@latest` dependency or pin it to a fixed version with Subresource Integrity if it is still needed. For Nutshell, SRI may not be practical if their script changes frequently; compensate with CSP allowlists and keep the vendor list minimal.

Mitigation:

Use CSP to restrict `script-src` to only the exact origins required. Avoid unversioned `@latest` CDN URLs in production.

False positive notes:

Vendor-hosted form scripts often cannot use SRI because vendors update them. This is still a valid supply-chain risk to acknowledge.

### F-005: `innerHTML` is used for shared templates; currently mostly constant, but one path interpolates existing page links

Severity: Low currently; Medium if future CMS/user-controlled content is interpolated.

Location:

- `site-shell.js:308`
- `site-shell.js:727`
- `site-shell.js:939`
- `site-shell.js:992`
- `site-shell.js:1025`

Evidence:

```js
nav.innerHTML = getSharedNavMarkup();
footer.innerHTML = [...]
ctaSection.innerHTML = [
  ...
  ctaLinks.map(function (link) {
    return '  <a href="' + link.href + '">' + link.text + "</a>";
  }).join("\n"),
  ...
].join("\n");
```

Impact:

Most of these HTML strings are local constants. The `ctaLinks` path takes `href` and text from existing page DOM and re-injects them as HTML. If a future content path lets untrusted values into CTA links, this can become DOM XSS.

Fix:

Prefer safe DOM construction with `document.createElement`, `textContent`, and `setAttribute` for generated navigation/footer/CTA components. At minimum, validate CTA `href` values to local/expected URLs before interpolation.

Mitigation:

Add CSP without `unsafe-eval`, and keep `script-src` restricted. Treat any future CMS JSON content as untrusted and never place it into `innerHTML`.

False positive notes:

I did not find URL parameters, localStorage, or external JSON flowing directly into these `innerHTML` sinks today.

### F-006: Attribution data stores full landing URLs and injects them into form hidden fields

Severity: Low to Medium for privacy/lead-data quality; not a direct site compromise.

Location:

- `attribution.js:62`
- `attribution.js:66`
- `attribution.js:100`
- `attribution.js:101`

Evidence:

```js
if (!merged.first_landing_page) merged.first_landing_page = window.location.href;
merged.last_landing_page = window.location.href;
upsertHiddenInput(form, "first_landing_page", data.first_landing_page || "");
upsertHiddenInput(form, "last_landing_page", data.last_landing_page || "");
```

Impact:

Full URLs may contain accidental personal data or sensitive query parameters. They are stored in localStorage after consent and submitted to Nutshell as hidden fields. Attackers can also stuff long or noisy URL values into lead records.

Fix:

Store only allowed attribution parameters and a normalized path, or strip unknown query parameters before saving/submitting landing-page values. Enforce maximum lengths for hidden field values.

Mitigation:

Continue requiring consent for measurement storage. Review Nutshell field display/automation so hidden attribution values do not trigger workflows or appear in customer-facing messages.

False positive notes:

This is already consent-gated for storage. The concern is data minimization and abuse hygiene.

### F-007: README form documentation is stale

Severity: Low.

Location:

- `README.md:14`
- `README.md:16`

Evidence:

```md
The site now uses embedded Nutshell forms (form id `2eagLw`, instance `341921`)
```

Impact:

Operational documentation does not match the deployed code, which uses instance `384033` and multiple form IDs. This can slow incident response and lead to hardening the wrong forms.

Fix:

Update the README to list current public forms, instance ID, and the required Nutshell spam-protection setting.

Mitigation:

Keep a small "forms inventory" table with page, form ID, owner, purpose, and spam-protection setting.

False positive notes:

This is not a direct technical vulnerability, but stale security-relevant documentation matters during incidents.

## Positive Findings

- No private key, token, `.env`, or password files were found by the local file scan.
- No `eval`, `new Function`, string-based timers, `document.write`, or `postMessage` message handlers were found in the reviewed static frontend files.
- External links opened with `target="_blank"` that I saw include `rel="noopener noreferrer"`, for example `partners.html:662`.
- `attribution.js` uses DOM APIs for hidden input creation rather than HTML string injection.
- The GitHub Actions workflow has scoped permissions for Pages deployment: `.github/workflows/deploy-pages.yml:10`.

## Recommended Priority Order

1. Confirm and, if needed, rotate/domain-restrict the Nutshell public boot token.
2. Keep strict Nutshell spam protection enabled on all public forms.
3. Add Cloudflare/WAF rate limiting for form pages and newsletter surfaces.
4. Add security headers at the edge, starting with CSP in report-only mode if possible.
5. Remove or pin `https://unpkg.com/lucide@latest`.
6. Refactor shared `innerHTML` template generation gradually to DOM construction.
7. Normalize attribution URLs before storing/submitting.
8. Update README with the current form inventory and hardening checklist.

## Residual Risk

This site is static, so the repo does not expose typical backend risks such as SQL injection, server-side command execution, or database credential leakage. The realistic attack paths are abuse of public forms, compromise/misbehavior of third-party scripts, weak edge/browser security policy, repository/GitHub account compromise, and mistakes in CRM automation.

The site can be made substantially harder to abuse, but "cannot be hacked" is not a realistic guarantee for any public website.
