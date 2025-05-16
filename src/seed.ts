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

  const existingUser = await payload.find({
    collection: "users",
    where: {
      email: {
        equals: "demo@payloadcms.com",
      },
    },
  });

  if (!existingUser.docs.length) {
    await payload.create({
      collection: "users",
      data: {
        email: "demo@payloadcms.com",
        password: "demo",
      },
    });
  }

  const page = await payload.create({
    collection: "pages",
    data: {
      slug: "test",
      tenant: tenant1.id,
      title: "Page for Gold Tenant (English)",
    },
    locale: "en",
  });

  await payload.update({
    collection: "pages",
    id: page.id,
    data: {
      title: "Page pour le locatair Gold (Français)",
    },
    locale: "fr",
  });

  const page2 = await payload.create({
    collection: "pages",
    data: {
      slug: "test",
      tenant: tenant2.id,
      title: "Page for Silver Tenant (English)",
    },
    locale: "en",
  });

  await payload.update({
    collection: "pages",
    id: page2.id,
    data: {
      title: "Page pour le locatair Silver (Français)",
    },
    locale: "fr",
  });

  const page3 = await payload.create({
    collection: "pages",
    data: {
      slug: "test",
      tenant: tenant3.id,
      title: "Page for Bronze Tenant (English)",
    },
    locale: "en",
  });

  await payload.update({
    collection: "pages",
    id: page3.id,
    data: {
      title: "Page pour le locataire Bronze (Français)",
    },
    locale: "fr",
  });
};
