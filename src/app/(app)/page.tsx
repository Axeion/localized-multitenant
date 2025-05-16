export default async ({ params: paramsPromise }: { params: Promise<{ slug: string[] }> }) => {
  return (
    <div>
      <h1>Multi-Tenant & Localization Example</h1>

      <p>This example demonstrates how to use multi-tenancy combined with localization in a single Next.js app powered by Payload.</p>

      <h2>Testing the App</h2>

      <p>The app is setup to support 3 different custom domains: <code>gold.localhost</code>, <code>silver.localhost</code> or  <code>bronze.localhost</code>.
        <br />Each domain will be parsed to identify the correct tenant and load the relevant localized content.</p>

      <ul>
        <li>Visit different tenant and locales combinations <a href="http://gold.localhost:3000/en/test" rel="noopener noreferrer">http://gold.localhost:3000/en/test</a> then <a href="http://silver.localhost:3000/fr/test" rel="noopener noreferrer">http://silver.localhost:3000/fr/test</a> to see how different domains can be accessed with localized content rendered.</li>
      </ul>

      <h2>How It Works</h2>

      <ul>
        <li>Next.js <code>rewrites</code> allows the tenant from the request&apos;s host header to be extracted and transformed internally to a <code>/tenant/locale/path</code> structure.</li>
        <li>The app directory matches this structure with nested folders:
          <code>/app/[tenant]/[locale]/[...slug]</code>
        </li>
        <li>The tenant and locale params are used in the page component to fetch and render the correct localized tenant content.</li>
      </ul>

      <p>For a detailed breakdown of the code and setup, checkout the full <a href="https://github.com/payloadcms/localized-multitenant/blob/main/README.md" target="_blank" rel="noopener noreferrer">README</a> in the example root folder.</p>
    </div>
  )
}
