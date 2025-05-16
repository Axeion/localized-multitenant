import type { CollectionConfig } from "payload";

import { tenantsArrayField } from "@payloadcms/plugin-multi-tenant/fields";

const defaultTenantArrayField = tenantsArrayField({
  tenantsArrayFieldName: "tenants",
  tenantsArrayTenantFieldName: "tenant",
  tenantsCollectionSlug: "tenants",
  arrayFieldAccess: {},
  tenantFieldAccess: {},
  rowFields: [
    {
      name: "roles",
      type: "select",
      defaultValue: ["tenant-viewer"],
      hasMany: true,
      options: ["tenant-admin", "tenant-viewer"],
      required: true,
    },
  ],
});

const Users: CollectionConfig = {
  slug: "users",
  access: {
    create: () => true,
    delete: () => true,
    read: () => true,
    update: () => true,
  },
  admin: {
    useAsTitle: "email",
  },
  auth: true,
  fields: [
    {
      name: "username",
      type: "text",
      index: true,
    },
    {
      ...defaultTenantArrayField,
      admin: {
        ...(defaultTenantArrayField?.admin || {}),
        position: "sidebar",
      },
    },
  ],
};

export default Users;
