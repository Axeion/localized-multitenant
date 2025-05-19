import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import path from "path";
import { buildConfig } from "payload";
import { fileURLToPath } from "url";

import { Pages } from "./collections/Pages";
import { Tenants } from "./collections/Tenants";
import Users from "./collections/Users";
import { multiTenantPlugin } from "@payloadcms/plugin-multi-tenant";
import type { Config } from "./payload-types";
import { seed } from "./seed";
import { Navigation } from './collections/Navigation';


const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

// Determine if we're in production mode
const isProduction = process.env.NODE_ENV === 'production';

// Domain configuration for frmsn.space
const productionDomains = [
  'https://frmsn.space',
  'https://www.frmsn.space',
  'https://gold.frmsn.space',
  'https://silver.frmsn.space',
  'https://bronze.frmsn.space',
];

// eslint-disable-next-line no-restricted-exports
export default buildConfig({
  // Set the server URL for Vercel deployment
  serverURL: isProduction ? 'https://frmsn.space' : 'http://localhost:3000',
  
  admin: {
    user: "users",
    meta: {
      titleSuffix: '- frmsn.space CMS',
      },
  },
  
// In the collections array
  collections: [Pages, Users, Tenants, Navigation],
  
  db: mongooseAdapter({
    url: process.env.DATABASE_URI as string,
    // Optimized for serverless environment like Vercel
    connectOptions: {
      // Vercel + MongoDB Atlas recommended settings
      retryWrites: true,
      w: 'majority',
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    },
  }),
  
  onInit: async (args) => {
    if (process.env.SEED_DB) {
      await seed(args);
    }
  },
  
  editor: lexicalEditor({}),
  
  graphQL: {
    schemaOutputFile: path.resolve(dirname, "generated-schema.graphql"),
  },
  
  localization: {
    defaultLocale: "en",
    locales: ["en", "fr"],
    fallback: true,
  },
  

  // CSRF protection for Vercel
  csrf: isProduction ? productionDomains : [],
  

  
  secret: process.env.PAYLOAD_SECRET as string,
  
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  
  // Configure upload settings with local adapter (minimal)
  upload: {
    // Using local adapter with minimized settings for Vercel
    limits: {
      fileSize: 2000000, // 2MB file size limit - keep small for Vercel
    },
  },
  
  plugins: [
    multiTenantPlugin<Config>({
      collections: {
        pages: {},
      },
      tenantField: {
        access: {
          read: () => true,
          update: () => true,
        },
      },
      tenantsArrayField: {
        includeDefaultField: false,
      },
      userHasAccessToAllTenants: () => true,
      cleanupAfterTenantDelete: true,
    }),
  ],
  
  // CORS configuration for Vercel
  cors: isProduction ? productionDomains : '*',
  
  // Optimizations for serverless deployment
  telemetry: false,
  maxDepth: 10,
  indexSortableFields: true,
   },
);
