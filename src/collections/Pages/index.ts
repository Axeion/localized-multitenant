import type { CollectionConfig } from "payload";

export const Pages: CollectionConfig = {
  slug: "pages",
  admin: {
    useAsTitle: "title",
  },
  fields: [
    {
      name: "title",
      type: "text",
      localized: true,
    },
    {
      name: "slug",
      type: "text",
      required: true,
      index: true,
    },
  ],
};
