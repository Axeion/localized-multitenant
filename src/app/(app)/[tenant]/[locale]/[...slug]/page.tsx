import type { Where } from 'payload'
import configPromise from '@payload-config'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import React from 'react'

import { RenderPage } from '../../../../components/RenderPage'
import { DimensionTheme } from '../../../../components/themes/dimension/DimensionTheme'

// Import types but use any for problematic types
import type { Tenant } from '@/payload-types'

// Define a simple type for navigation items
interface NavItem {
  id: string;
  label: string;
  slug: string;
}

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
        })
        
        tenantData = tenantsResult.docs?.[0]
        
        if (!tenantData) {
          return notFound()
        }
      } catch (e) {
        console.log('Error querying tenants:', e)
        return notFound()
      }

      if (!slug) {
        return notFound()
      }

      const slugConstraint: Where = {
        slug: {
          equals: slug.join('/'),
        },
      }

      // Fetch page data
      let pageData: any = null;
      try {
        const pageQuery = await payload.find({
          collection: 'pages',
          where: {
            and: [
              {
                'tenant.domain': {
                  equals: params.tenant,
                },
              },
              slugConstraint,
            ],
          },
          locale: locale,
          depth: 2,
        })
        
        pageData = pageQuery.docs?.[0]
        
        if (!pageData) {
          return notFound()
        }
      } catch (e) {
        console.error('Error querying pages:', e);
        throw new Error(`Failed to fetch page: ${(e as Error).message}`);
      }

      // Default navigation items
      const navigation: NavItem[] = [
        { id: 'intro', label: 'Intro', slug: 'intro' },
        { id: 'work', label: 'Work', slug: 'work' },
        { id: 'about', label: 'About', slug: 'about' },
        { id: 'contact', label: 'Contact', slug: 'contact' }
      ];

      // Render based on the tenant domain
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
    } catch (payloadError) {
      console.error('Payload operation error:', payloadError);
      return (
        <div className="error-container">
          <h1>Error Loading Page</h1>
          <p>We encountered an error connecting to the content database.</p>
          <p>Error details: {(payloadError as Error).message}</p>
        </div>
      );
    }
  } catch (error) {
    console.error('Unhandled page error:', error);
    return (
      <div className="error-container">
        <h1>Something Went Wrong</h1>
        <p>Error details: {(error as Error).message}</p>
      </div>
    );
  }
}

// Comment out generateStaticParams for now
// Uncomment once the basic page is working
/*
export async function generateStaticParams() {
  try {
    const payload = await getPayload({ config: configPromise })
    
    const tenants = await payload.find({
      collection: 'tenants',
    })
    
    const pages = await payload.find({
      collection: 'pages',
    })
    
    const locales: Locale[] = ['en', 'fr']
    
    const params: { tenant: string; locale: string; slug: string[] }[] = []
    
    for (const tenant of tenants.docs) {
      for (const page of pages.docs) {
        if (typeof page.tenant === 'object' && page.tenant?.domain === tenant.domain && page.slug) {
          for (const locale of locales) {
            params.push({
              tenant: tenant.domain,
              locale,
              slug: page.slug.split('/'),
            })
          }
        }
      }
    }
    
    return params
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}
*/