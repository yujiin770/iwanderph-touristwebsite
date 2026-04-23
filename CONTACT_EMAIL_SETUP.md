# Contact EmailJS Setup

This project now sends contact form submissions with EmailJS directly from the frontend.

## What changed

- the contact form no longer uses the Supabase Edge Function
- the form sends through the EmailJS REST API
- lightweight anti-spam stays enabled in the browser:
  - hidden honeypot field
  - minimum submit time
  - 1 minute cooldown
  - 5 sends per day per browser

## 1. Create your EmailJS setup

In EmailJS dashboard:

1. Add an email service
2. Create an email template
3. Copy these values:
   - `Service ID`
   - `Template ID`
   - `Public Key`

## 2. Add env values

Put these in your local frontend env file:

```env
VITE_EMAILJS_SERVICE_ID=your_emailjs_service_id
VITE_EMAILJS_TEMPLATE_ID=your_emailjs_template_id
VITE_EMAILJS_PUBLIC_KEY=your_emailjs_public_key
```

For Vercel production, add the same keys in the Vercel project settings:

1. Open `Project Settings > Environment Variables`
2. Add:
   - `VITE_EMAILJS_SERVICE_ID`
   - `VITE_EMAILJS_TEMPLATE_ID`
   - `VITE_EMAILJS_PUBLIC_KEY`
3. Redeploy the site after saving

Important:

- do not commit a `frontend/.env.production` file with placeholder values like `your_emailjs_public_key`
- Vite reads production env values at build time, so placeholder values can break the deployed site even if local works
- Vercel changes do not affect an already-finished deployment until you redeploy

## 3. Template variables to use in EmailJS

Use these template variables in your EmailJS template:

- `{{from_name}}`
- `{{from_email}}`
- `{{reply_to}}`
- `{{message}}`

The frontend also sends `name` and `email` for backward compatibility, but `from_name` and `from_email` should be the primary variables in EmailJS.

Recommended template example:

```text
New iWander PH Contact Message

Name: {{from_name}}
Email: {{from_email}}

Message:
{{message}}
```

Set the reply-to field in EmailJS to:

```text
{{reply_to}}
```

## 4. Important limitation

Because EmailJS runs in the browser, anti-spam protection is weaker than a server-side function. The current setup helps reduce spam, but it is not as strong as Supabase Edge Functions plus CAPTCHA.

If you later want stronger protection, the best next step is Cloudflare Turnstile or reCAPTCHA.
