import type { Where } from 'payload'

import configPromise from '@payload-config'
import { notFound, redirect } from 'next/navigation'
import { getPayload } from 'payload'
import React from 'react'

import { RenderPage } from '../../../../components/RenderPage'
import { DimensionTheme } from '../../../../components/themes/dimension/DimensionTheme'
import { Tenant } from '@/payload-types'

type Locale = 'all' | 'en' | 'fr' | undefined

export default async function Page({
  params: paramsPromise,
}: {
  params: Promise<{ slug?: string[]; tenant: string; locale: string }>
}) {
  const params = await paramsPromise
  let slug = undefined
  let locale: Locale = undefined

  if (params?.slug) {
    slug = params.slug
  }
  if (params?.locale) {
    locale = params.locale as Locale
  }

  const payload = await getPayload({ config: configPromise })

  // Fetch tenant data
  let tenantData = null
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
    depth: 2, // Increase depth to ensure we get all related content
  })

  const pageData = pageQuery.docs?.[0]

  if (!pageData) {
    return notFound()
  }

  // Instead of trying to fetch from a possibly non-existent collection,
  // just use default navigation items
  const navigation = [
    { id: 'intro', label: 'Intro', slug: 'intro' },
    { id: 'work', label: 'Work', slug: 'work' },
    { id: 'about', label: 'About', slug: 'about' },
    { id: 'contact', label: 'Contact', slug: 'contact' }
  ];

  // Select theme based on tenant preference
  const getTenantTheme = (tenantData: Tenant, pageData: any) => { // Change unknown to any or the proper Page type
    switch (tenantData.domain) {
      case 'gold.frmsn.space':
        return (
          <DimensionTheme 
            page={pageData} 
            tenant={tenantData.domain}
            locale={locale as string} 
            navigation={navigation} 
          />
        );
      default:
        // Cast pageData to the expected type for RenderPage
        return <RenderPage data={pageData as any} />;
    }
  };

  return getTenantTheme(tenantData, pageData);
}

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })

  const tenants = await payload.find({
    collection: 'tenants',
  })

  const pages = await payload.find({
    collection: 'pages',
  })

  const locales: Locale[] = ['en', 'fr']

  const params = []

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
}