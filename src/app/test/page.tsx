// Simplified page.tsx with workaround for duplicate tenant field
import type { Where } from 'payload'
import configPromise from '@payload-config'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import React from 'react'

import { RenderPage } from '../components/RenderPage'
import { DimensionTheme } from '../components/themes/dimension/DimensionTheme'

type Locale = 'all' | 'en' | 'fr' | undefined

export default async function Page({
  params: paramsPromise,
}: {
  params: Promise<{ slug?: string[]; tenant: string; locale: string }>
}) {
  try {
    const params = await paramsPromise
    
    let slug = undefined
    let locale: Locale = undefined

    if (params?.slug) {
      slug = params.slug
    }
    if (params?.locale) {
      locale = params.locale as Locale
    }

    try {
      const payload = await getPayload({ config: configPromise })

      // Fetch tenant data
      let tenantData: any = null;
      try {
        const tenantsResult = await payload.find({
          collection: 'tenants',
          where: {
            domain: {
              equals: params.tenant,
            },
          },
        });
        
        tenantData = tenantsResult.docs?.[0];
        
        if (!tenantData) {
          return notFound();
        }
      } catch (e) {
        console.log('Error querying tenants:', e);
        return notFound();
      }

      if (!slug) {
        return notFound();
      }

      // Simpler page query - avoid filtering by tenant for now
      let pageData: any = null;
      try {
        const pageQuery = await payload.find({
          collection: 'pages',
          where: {
            slug: {
              equals: slug.join('/'),
            },
          },
          locale: locale,
          depth: 2,
        });
        
        // Find the page that matches the tenant
        pageData = pageQuery.docs.find((page: any) => {
          // Try various ways the tenant might be stored
          const pageTenant = typeof page.tenant === 'object' ? page.tenant : page.tenant;
          
          if (pageTenant && typeof pageTenant === 'object') {
            return pageTenant.domain === params.tenant || pageTenant.id === tenantData.id;
          }
          
          return false;
        });
        
        if (!pageData) {
          return notFound();
        }
      } catch (e) {
        console.error('Error querying pages:', e);
        return <div>Error loading page: {(e as Error).message}</div>;
      }

      // Default navigation
      const navigation = [
        { id: 'intro', label: 'Intro', slug: 'intro' },
        { id: 'work', label: 'Work', slug: 'work' },
        { id: 'about', label: 'About', slug: 'about' },
        { id: 'contact', label: 'Contact', slug: 'contact' }
      ];

      // Select theme based on tenant domain
      if (tenantData.domain === 'gold.frmsn.space') {
        return (
          <DimensionTheme 
            page={pageData} 
            tenant={tenantData.domain}
            locale={locale as string} 
            navigation={navigation} 
          />
        );
      } else {
        return <RenderPage data={pageData} />;
      }
    } catch (e) {
      console.error('Error in page component:', e);
      return <div>An error occurred: {(e as Error).message}</div>;
    }
  } catch (e) {
    console.error('Top-level error:', e);
    return <div>Something went wrong: {(e as Error).message}</div>;
  }
}