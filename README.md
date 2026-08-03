# ARIANNA

Static website for ARIANNA, ready to deploy on GitHub Pages.

## GitHub Pages setup

1. Push this repository to GitHub.
2. In GitHub, open `Settings` -> `Pages`.
3. Under `Build and deployment`, set `Source` to `GitHub Actions`.
4. Push to your default branch (`main` recommended) to trigger deploy.

The workflow at `.github/workflows/deploy-pages.yml` publishes this site's root files to GitHub Pages.

## Website form delivery

The contact, demo, trial, partner, support, and newsletter forms are rendered by `site-shell.js`. They submit to FormSubmit, which forwards entries to `hello@ariannateam.ai` and applies reCAPTCHA plus a honeypot spam check. If the hidden `_honey` field contains a value, the browser cancels the submission; FormSubmit also recognizes the field for server-side filtering.

The first submission after configuring the recipient triggers a one-time activation email from FormSubmit. Open that message in `hello@ariannateam.ai` and confirm the form before relying on live delivery.

Form delivery settings and fields are centralized in `site-shell.js`. After submission, FormSubmit redirects visitors directly to the ARIANNA homepage.

### Verify after deploy

1. Open the demo, trial, contact, support, and partner pages and confirm the correct form renders.
2. Open a newsletter prompt and confirm it only asks for an email address.
3. Submit a test entry, complete the CAPTCHA, and confirm the FormSubmit activation email if required.
4. Submit a second test and confirm it arrives at `hello@ariannateam.ai` with the correct subject and source page.
