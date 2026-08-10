# ARIANNA

Static website for ARIANNA, ready to deploy on GitHub Pages.

## GitHub Pages setup

1. Push this repository to GitHub.
2. In GitHub, open `Settings` -> `Pages`.
3. Under `Build and deployment`, set `Source` to `GitHub Actions`.
4. Push to your default branch (`main` recommended) to trigger deploy.

The workflow at `.github/workflows/deploy-pages.yml` publishes this site's root files to GitHub Pages.

## Google Search Console

The public site resolves on `https://www.ariannateam.ai/`. Canonical URLs, Open Graph URLs, structured-data URLs, `robots.txt`, and `sitemap.xml` must all use that same host.

After publishing SEO changes:

1. Submit `https://www.ariannateam.ai/sitemap.xml` in Search Console and confirm its status is **Success**.
2. Use URL Inspection on the homepage, `resources.html`, and the main product pages; run **Test live URL** and request indexing after significant changes.
3. Review **Page indexing** for website-sourced errors and **Core Web Vitals** separately for mobile and desktop.
4. Use the Performance report to improve page titles and copy based on actual queries, impressions, click-through rate, and average position rather than guessed keywords.

Email-rendering files intended for Nutshell are marked `noindex, nofollow` and must not be added to the sitemap. Every public indexable HTML page should have one title, one description, one canonical URL, and one H1.

## Website form delivery

The contact, demo, trial, partner, support, and newsletter forms are rendered by `site-shell.js`. They submit to FormSubmit, which forwards entries to `hello@ariannateam.ai` and applies reCAPTCHA plus a honeypot spam check. FormSubmit's reCAPTCHA can run invisibly or present its challenge after an otherwise valid submission; it is not an embedded checkbox in the ARIANNA form. If the hidden `_honey` field contains a value, the browser cancels the submission; FormSubmit also recognizes the field for server-side filtering. Email addresses are trimmed and validated in the browser before submission, including local-part, domain-label, and complete-domain checks. Common personal email domains are rejected so that the forms require a business email address; the denylist is maintained in `NON_BUSINESS_EMAIL_DOMAINS`. Email errors appear persistently below the fields on blur and on submit, in addition to the browser's native validation prompt.

The first submission after configuring the recipient triggers a one-time activation email from FormSubmit. Open that message in `hello@ariannateam.ai` and confirm the form before relying on live delivery.

Form delivery settings and fields are centralized in `site-shell.js`. After submission, FormSubmit redirects visitors directly to the ARIANNA homepage.

### Verify after deploy

1. Open the demo, trial, contact, support, and partner pages and confirm the correct form renders.
2. Open a newsletter prompt and confirm it only asks for an email address.
3. Submit a test entry, complete the CAPTCHA, and confirm the FormSubmit activation email if required.
4. Submit a second test and confirm it arrives at `hello@ariannateam.ai` with the correct subject and source page.
