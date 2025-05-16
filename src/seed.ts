import { Config } from "payload";

export const seed: NonNullable<Config["onInit"]> = async (
  payload
): Promise<void> => {
  const tenant1 = await payload.create({
    collection: "tenants",
    data: {
      name: "Tenant 1",
      slug: "gold",
      domain: "gold.localhost",
    },
  });

  const tenant2 = await payload.create({
    collection: "tenants",
    data: {
      name: "Tenant 2",
      slug: "silver",
      domain: "silver.localhost",
    },
  });

  const tenant3 = await payload.create({
    collection: "tenants",
    data: {
      name: "Tenant 3",
      slug: "bronze",
      domain: "bronze.localhost",
    },
  });

  await payload.create({
    collection: "users",
    data: {
      email: "demo@payloadcms.com",
      password: "demo",
      roles: ["super-admin"],
    },
  });

  await payload.create({
    collection: "users",
    data: {
      email: "gold@payloadcms.com",
      password: "demo",
      tenants: [
        {
          roles: ["tenant-admin"],
          tenant: tenant1.id,
        },
      ],
      username: "tenant1",
    },
  });

  await payload.create({
    collection: "users",
    data: {
      email: "silver@payloadcms.com",
      password: "demo",
      tenants: [
        {
          roles: ["tenant-admin"],
          tenant: tenant2.id,
        },
      ],
      username: "tenant2",
    },
  });

  await payload.create({
    collection: "users",
    data: {
      email: "bronze@payloadcms.com",
      password: "demo",
      tenants: [
        {
          roles: ["tenant-admin"],
          tenant: tenant3.id,
        },
      ],
      username: "tenant3",
    },
  });

  await payload.create({
    collection: "users",
    data: {
      email: "multi-admin@payloadcms.com",
      password: "demo",
      tenants: [
        {
          roles: ["tenant-admin"],
          tenant: tenant1.id,
        },
        {
          roles: ["tenant-admin"],
          tenant: tenant2.id,
        },
        {
          roles: ["tenant-admin"],
          tenant: tenant3.id,
        },
      ],
      username: "multi-admin",
    },
  });

  const testPage = await payload.create({
    collection: "pages",
    data: {
      slug: "test",
      tenant: tenant1.id,
      title: "Test Page for Tenant 1 (English)",
    },
    locale: "en",
  });

  await payload.update({
    collection: "pages",
    id: testPage.id,
    data: {
      title: "Test Page for Tenant 1 (French)",
    },
    locale: "fr",
  });

  const page = await payload.create({
    collection: "pages",
    data: {
      slug: "home",
      tenant: tenant1.id,
      title: "Page for Tenant 1 (English)",
    },
    locale: "en",
  });

  await payload.update({
    collection: "pages",
    id: page.id,
    data: {
      title: "Page for Tenant 1 (French)",
    },
    locale: "fr",
  });

  const page2 = await payload.create({
    collection: "pages",
    data: {
      slug: "home",
      tenant: tenant2.id,
      title: "Page for Tenant 2 (English)",
    },
    locale: "en",
  });

  await payload.update({
    collection: "pages",
    id: page2.id,
    data: {
      title: "Page for Tenant 2 (French)",
    },
    locale: "fr",
  });

  const page3 = await payload.create({
    collection: "pages",
    data: {
      slug: "home",
      tenant: tenant3.id,
      title: "Page for Tenant 3 (English)",
    },
    locale: "en",
  });

  await payload.update({
    collection: "pages",
    id: page3.id,
    data: {
      title: "Page for Tenant 3 (French)",
    },
    locale: "fr",
  });
};
