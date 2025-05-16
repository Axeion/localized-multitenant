import type { CollectionConfig } from "payload";

export const Tenants: CollectionConfig = {
  slug: "tenants",
  admin: {
    useAsTitle: "name",
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "domain",
      type: "text",
      admin: {
        description: "Used for domain-based tenant handling",
      },
    },
    {
      name: "slug",
      type: "text",
      admin: {
        description: "Used for url paths, example: /tenant-slug/page-slug",
      },
      index: true,
      required: true,
    },
  ],
};
