# Multi-Tenant with Localization Example

This repo demonstrates how to implement multi-tenancy _and_ localization using:

- [Payload](https://github.com/payloadcms/payload)
- `@payloadcms/plugin-multi-tenant`
- A single Next.js frontend app

It allows you to serve multiple tenants (e.g. `gold.localhost`, `silver.localhost`) with localized URLs (e.g. `/en`, `/fr`) from one codebase.

## Quick Start

To spin up this example locally, follow these steps:

1. `cp .env.example .env` to copy the example environment variables

2. `pnpm dev`, `yarn dev` or `npm run dev` to start the server
   - Press `y` when prompted to seed the database
3. `open http://localhost:3000` to access the home page
4. `open http://localhost:3000/admin` to access the admin panel

### Login credentials

Login with email `demo@payloadcms.com` and password `demo`

## Testing Domains

For the domain portion of the example to function properly, you will need to add the following entries to your system's `/etc/hosts` file:

```
127.0.0.1 gold.localhost silver.localhost bronze.localhost
```

# Code Walkthrough - Key Concepts & Files

### 1. Payload Configuration

**File:** `payload.config.ts`

**Localization setup:**

The `localization` field defines supported locales (e.g. `['en', 'fr']`) and default locale.

This enables Payload collections and globals to support localized fields and content.

```ts
localization: {
  locales: ['en', 'fr'],
  defaultLocale: 'en',
  fallback: true,
},
```

**Multi-Tenant Plugin**

The `@payloadcms/plugin-multi-tenant` plugin is installed and passed to Payload via `plugins`.

```ts
plugins: [
  multiTenant({
    // plugin options (e.g., tenant collection, defaults)
  }),
],
```

## 2. Next.js Rewrites

**File:** `next.config.js`

This file rewrites incoming URLs based on domain and path to match your app directory routing structure.

```mjs
async rewrites() {
    return [
      {
        source: '/((?!admin|api)):locale/:path*',
        destination: '/:tenant/:locale/:path*',
        has: [
          {
            type: 'host',
            value: '(?<tenant>.*)',
          },
        ],
      },
    ]
  },
```

### How it works:

- Extracts the tenant from the domain (e.g. `gold.localhost`)
- Restructures URLs like `/en/about` into internal paths like `/:tenant/:locale/:path*`
- Allows your app directory to cleanly handle tenants and locales via nested dynamic routes

## 3. Next.js App Routing Structure

**Folder:** `/app`

- `/app/[tenant]` – captures tenant from rewritten URL
- `/app/[tenant]/[locale]` – captures locale from URL
- `/app/[tenant]/[locale]/[...slug]` – handles all pages under the locale

This allows paths like to be transformed into the app structure:

```bash
http://gold.localhost:3000/en/about
→ /app/gold/en/about → tenant = "gold", locale = "en", slug = "about"
```

## 4. Page Logic

**File:** `/app/[tenant]/[locale]/[...slug]/page.tsx`

This is the main entry point for rendering localized tenant content. Within this file it does the following:

- Reads tenant, locale, and slug from the URL
- Fetches tenant-specific config and localized content from Payload
- Renders dynamic pages for each tenant/locale combo

You can customize this file to fetch and render any kind of tenant-aware, locale-aware data (e.g. pages, navigation, layout).

## 5. Putting It All Together

1. A user visits `http://gold.localhost:3000/fr/about`
2. The Next.js rewrite rule extracts:
   - Tenant from domain (`gold`)
   - Locale and path from URL (`fr`, `about`)
3. The URL is rewritten internally to `/gold/fr/about`
4. Next.js matches the route via `/app/[tenant]/[locale]/[...slug]/page.tsx` in the app directory
5. `page.tsx` uses the tenant, locale, and slug params to fetch content from Payload
6. The requested localized content for the correct tenant is rendered

## Summary of Key Files

| File / Folder                               | Purpose                                              |
| ------------------------------------------- | ---------------------------------------------------- |
| `payload.config.ts`                         | Sets up localization + multi-tenant plugin           |
| `next.config.js`                            | Rewrites URLs based on domain and locale             |
| `/app/[tenant]/[locale]/[...slug]/page.tsx` | Fetches and renders tenant + locale-specific content |
| `/app/[tenant]/[locale]/[...slug]`          | Directory structure that mirrors rewritten URL paths |
